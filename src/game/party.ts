// The party and what it bears: a member made and equipped, its armour class, weapon, to-hit and
// chance to crit (`critChance`), what it bears (`borne`), resists and is immune to (`immuneTo`), a
// stat as it stands (`statOf`), a condition taken or dealt (`addCondition`, `lift`, `damage`), a heal
// cast, an item used (`useItem`), what the clock's passing does to what is borne (`passClock`),
// whether the company swims or climbs, and the premade and the drawn company (`randomParty`): what
// reads the items, the calendar or the skills. Its parts are in game/party/ (#1020), held to the
// same rule, and it gives on all they hold: the tables, the conditions, the levels and the order
// (#1066). Pure data and pure functions; the rng is passed in so tests can pin it, and the item and
// spell tables are handed in (#973, #974).
import { makeRng } from '../lib/engine/rng.ts';
import type { RngInstance } from '../lib/engine/rng.ts';
import { item, REGEN_PART } from './items.ts';
import type { ItemDef } from './items.ts';
import { MINUTES_PER_DAY, dateAt, sunTimes } from './calendar.ts';
import { spellsFor, ELEMENTS } from './spells.ts';
import type { Element } from './spells.ts';
import { hasSkill } from './skills.ts';
import type { Items, Tables } from './tables.ts';
import {
  STATS, STALWART_AC, HEALING_HANDS, TRAITS, RACES, CLASSES, BASE_STATS, bonus, RANK_STEP, robeLike, SUGGESTED, PRESTIGES,
  CRITS_ON, CRIT_BASE, CRIT_PER_LUCK, CRIT_FLOOR, CRIT_STEP, CRIT_LEVELS,
} from './party/tables.ts';
import type { Stat, Stats, RaceId, ClassId, Condition, Character, Party } from './party/tables.ts';
import { isDown, hasCondition, hasTrait, removeCondition, deathAt, heal, countItem } from './party/conditions.ts';
import { rankMult, armsBonus, createParty } from './party/levels.ts';

// The old path: each part whole, which exports what this file did of it and no more.
export * from './party/tables.ts';
export * from './party/conditions.ts';
export * from './party/levels.ts';
export * from './party/order.ts';
/** The flag a party holds once it has paid a spell hall's fee to study: in game/keys.ts with the save's other keys. */
export { guildFlag } from './keys.ts';

/**
 * A member at level 1: its stats `base` over BASE_STATS's 10 and its people's mods on top, where a
 * member the game makes takes its class's (`ClassDef.stats`, DESIGN §5) and a test any it likes.
 */
export function createCharacter(tables: Tables, name: string, race: RaceId, cls: ClassId, base: Partial<Stats>, rng: RngInstance): Character {
  const stats = { ...BASE_STATS, ...base };
  for (const s of STATS) stats[s] += RACES[race].mods[s] ?? 0;
  const c: Character = {
    name, race, cls, level: 1, xp: 0, stats,
    hp: 0, maxHp: 0, sp: 0, maxSp: 0,
    conditions: [], equipment: { weapon: null, armor: null, shield: null },
    spells: [], pack: [], blessed: [],
  };
  const cd = CLASSES[cls];
  c.maxHp = Math.max(4, cd.hpDie + bonus(stats.endurance) + 2);
  c.maxSp = cd.spStat ? Math.max(0, cd.spDie + bonus(stats[cd.spStat])) : 0;
  c.hp = c.maxHp; c.sp = c.maxSp;
  for (const id of cd.kit) equip(tables.items, c, id) || c.pack.push(id);
  if (cd.spells) c.spells = spellsFor(tables.spells, cd.spells, 1).map((s) => s.id);
  void rng;
  return c;
}

/** Equip an item from anywhere; returns false if the class cannot use it. */
export function equip(items: Items, c: Character, id: string): boolean {
  const d = item(items, id);
  if (d.slot === 'none') return false;
  if (d.classes && !d.classes.includes(c.cls)) return false;
  if (d.slot === 'shield' && c.equipment.weapon && item(items, c.equipment.weapon).twoHanded) return false;
  if (d.slot === 'weapon' && d.twoHanded && c.equipment.shield) { c.pack.push(c.equipment.shield); c.equipment.shield = null; }
  const old = c.equipment[d.slot];
  if (old) c.pack.push(old);
  c.equipment[d.slot] = id;
  const i = c.pack.indexOf(id);
  if (i >= 0) c.pack.splice(i, 1);
  return true;
}

export function armorClass(items: Items, c: Character): number {
  let ac = 10 + bonus(statOf(items, c, 'speed'));
  for (const slot of ['armor', 'shield'] as const) { const id = c.equipment[slot]; if (id) ac += items[id].ac ?? 0; }
  if (hasTrait(c, 'stalwart')) ac += STALWART_AC;
  if (hasTrait(c, 'unarmoured') && !c.equipment.shield && robeLike(items[c.equipment.armor ?? ''])) ac += 1 + Math.floor(c.level / 2);
  return ac;
}

export function weaponOf(items: Items, c: Character): ItemDef { return c.equipment.weapon ? item(items, c.equipment.weapon) : items.club; }

export function attackBonus(items: Items, c: Character): number {
  return CLASSES[c.cls].attack + Math.floor(c.level / 2) + bonus(statOf(items, c, 'accuracy')) + (weaponOf(items, c).plus ?? 0) + armsBonus(c);
}

/**
 * The share of a member's weapon blows that land and crit, for double (DESIGN §6, #1114): CRIT_BASE,
 * and CRIT_PER_LUCK for each point of Luck over 10 as borne, never under CRIT_FLOOR; a knight's,
 * barbarian's, thief's or monk's CRIT_STEP more at each of CRIT_LEVELS. None while crits are off
 * (`on`: CRITS_ON in play, false where a tool or a suite turns them off), so a blow draws nothing for one.
 */
export function critChance(items: Items, c: Character, on = CRITS_ON): number {
  if (!on) return 0;
  const steps = PRESTIGES[c.cls].calling === 'fighter' ? CRIT_LEVELS.filter((l) => c.level >= l).length : 0;
  return Math.max(CRIT_FLOOR, CRIT_BASE + CRIT_PER_LUCK * (statOf(items, c, 'luck') - 10)) + CRIT_STEP * steps;
}

/** Whether race, class or a ward borne (`ItemDef.ward`, #847) keeps the condition off entirely. */
function immuneTo(items: Items, c: Character, k: Condition): boolean {
  return !!RACES[c.race].resist?.includes(k) || CLASSES[c.cls].traits.some((t) => TRAITS[t].immune?.includes(k)) || borne(items, c).some((id) => item(items, id).ward === k);
}
/**
 * What a member bears: what they wear, and the slotless items in their own pack. Armour in the pack
 * is not worn, and the bag is nobody's. A resistance and a stat's raise are borne so.
 */
export function borne(items: Items, c: Character): string[] {
  const out: string[] = [], { weapon, armor, shield } = c.equipment;
  if (weapon) out.push(weapon);
  if (armor) out.push(armor);
  if (shield) out.push(shield);
  for (const id of c.pack) if (item(items, id).slot === 'none') out.push(id);
  return out;
}
/**
 * The elements a member takes half from (#555): those of what they bear (`borne`) and of a
 * blessing. In ELEMENTS' order.
 */
export function resists(items: Items, c: Character): Element[] {
  const ids = borne(items, c);
  return ELEMENTS.filter((el) => ids.some((id) => item(items, id).resist?.includes(el)) || c.blessed.some((b) => b.element === el));
}
/**
 * Whether any slotted item of a table raises a stat, and any slotless one: worked out the first time a
 * stat is read with that table, so that `statOf` looks nothing up where nothing could raise it. Kept
 * by the table (#973): play has one, and a suite that lends an item plays a table of its own, so an
 * entry of its own. A table is fixed once built; the harness's `forge` adds copies of items it holds,
 * which raise what theirs do. The last table read is kept apart, so the hot path asks no map.
 */
const raisers = new WeakMap<Items, { slotted: boolean; slotless: boolean }>();
let last: { items: Items; r: { slotted: boolean; slotless: boolean } } | null = null;
function raisersOf(items: Items): { slotted: boolean; slotless: boolean } {
  if (last?.items === items) return last.r;
  let r = raisers.get(items);
  if (!r) {
    const all = Object.values(items);
    r = { slotted: all.some((d) => !!d.stat && d.slot !== 'none'), slotless: all.some((d) => !!d.stat && d.slot === 'none') };
    raisers.set(items, r);
  }
  last = { items, r };
  return r;
}
/**
 * A stat as a member stands: their own, raised by what they bear (`ItemDef.stat`), counted by
 * `borne`'s rule without making its list, since every blow and every AC reads it. `c.stats` stays
 * their own, so a save holds no raise.
 */
export function statOf(items: Items, c: Character, s: Stat): number {
  const r = raisersOf(items);
  let n = c.stats[s];
  if (r.slotted) {
    const { weapon, armor, shield } = c.equipment;
    if (weapon) n += items[weapon].stat?.[s] ?? 0;
    if (armor) n += items[armor].stat?.[s] ?? 0;
    if (shield) n += items[shield].stat?.[s] ?? 0;
  }
  if (r.slotless) for (const id of c.pack) { const d = items[id]; if (d.slot === 'none' && d.stat) n += d.stat[s] ?? 0; }
  return n;
}
export function addCondition(items: Items, c: Character, k: Condition): void {
  if (immuneTo(items, c, k)) return;
  if (!c.conditions.includes(k)) c.conditions.push(k);
}
/** What regeneration mends a bearer each whole hour (`ItemDef.regen`): a tenth of their most hit points, rounded down, and at least 1. */
export const mendOf = (c: Pick<Character, 'maxHp'>): number => Math.max(1, Math.floor(c.maxHp / REGEN_PART));
/** The minute dawn breaks on game day `day`, by the calendar's sun (`sunTimes`), as a night's sleep wakes to it. */
export const dawnOf = (day: number): number => day * MINUTES_PER_DAY + Math.ceil(sunTimes(dateAt(day * MINUTES_PER_DAY).dayOfYear).dawn * 60);
/**
 * What the clock's passing from minute `from` to `to` does to what a company bears (#847, DESIGN §9):
 * each bearer of regeneration who is not down mends `mendOf` for each whole hour it passes, never
 * past the most; and once it passes a dawn the artifacts' castings spent come back whole. A fight
 * passes no clock, so neither happens in one. Called by the world's clock (`World.advance`).
 */
export function passClock(items: Items, party: Party, from: number, to: number): void {
  const hours = Math.floor(to / 60) - Math.floor(from / 60);
  if (hours > 0) for (const c of party.members) if (!isDown(c) && c.hp < c.maxHp && borne(items, c).some((id) => item(items, id).regen)) c.hp = Math.min(c.maxHp, c.hp + hours * mendOf(c));
  if (party.spent) for (let d = Math.floor(from / MINUTES_PER_DAY); d <= Math.floor(to / MINUTES_PER_DAY); d++) if (dawnOf(d) > from && dawnOf(d) <= to) { delete party.spent; break; }
}

/**
 * A cure's conditions lifted from a member, as a draught or Absolve lifts them: one turned to glass
 * comes back as it was, out cold if its wounds say so (#546). Whether stone was among those lifted.
 */
export function lift(items: Items, c: Character, ks: readonly string[]): boolean {
  const stone = ks.includes('stoned') && hasCondition(c, 'stoned');
  for (const k of ks) removeCondition(c, k as Condition);
  if (stone && c.hp <= 0 && !hasCondition(c, 'dead')) addCondition(items, c, 'unconscious');
  return stone;
}

export function damage(items: Items, c: Character, n: number): void {
  if (isDown(c)) return;
  c.hp -= n;
  const deadAt = deathAt(c);
  if (c.hp <= deadAt) { c.hp = deadAt; removeCondition(c, 'unconscious'); addCondition(items, c, 'dead'); }
  else if (c.hp <= 0) addCondition(items, c, 'unconscious');
  if (c.hp <= 0) { removeCondition(c, 'asleep'); }
}

/** What a healing spell of `base` restores when this caster casts it: its ranks lift the base (`rankMult`), and not the flat bonuses. */
export function spellHeal(items: Items, caster: Character, base: number, step = RANK_STEP): number {
  return Math.round(base * rankMult(caster, step)) + bonus(statOf(items, caster, 'personality')) + (hasTrait(caster, 'healing_hands') ? HEALING_HANDS : 0);
}

/**
 * An item used on a member, in a fight or from the sheet (#978): taken from the holder's pack, or else
 * the company's bag, and its healing, spell points, cure and food applied in that order. `items`, first
 * as #973 passes every table, is the table it is read from; with no holder it comes from the bag. What
 * it says, or null where it has no use or nobody holds it, and then nothing changes.
 */
export function useItem(items: Readonly<Record<string, ItemDef>>, party: Pick<Party, 'bag' | 'food'>, holder: Pick<Character, 'pack'> | null, id: string, target: Character): string[] | null {
  const use = items[id].use;
  const from = holder && holder.pack.includes(id) ? holder.pack : party.bag.includes(id) ? party.bag : null;
  if (!use || !from) return null;
  from.splice(from.indexOf(id), 1);
  const said: string[] = [];
  if (use.heal) said.push(`${target.name} recovers ${heal(target, use.heal)}.`);
  if (use.sp) { target.sp = Math.min(target.maxSp, target.sp + use.sp); said.push(`${target.name} feels sharper.`); }
  if (use.cure) said.push(lift(items, target, use.cure) ? `${target.name} is flesh again.` : `${target.name} is cleansed.`);
  if (use.food) { party.food += use.food; said.push(`The party's food grows by ${use.food}.`); }
  return said;
}

/**
 * Whether anyone standing can do the thing: swim, if one is of a people that swims or has Swimmer;
 * climb, if one has Mountaineer (`hasSkill`, game/skills.ts; #805). The flags `skill_swim` and
 * `skill_mountaineer` grant it as well, for the tests and for anything else that sets them.
 */
export function partyCan(p: Party): { swim: boolean; climb: boolean; keys: number } {
  const up = p.members.filter((m) => !isDown(m));
  return {
    swim: up.some((m) => RACES[m.race].swim || hasSkill(m, 'swimmer')) || (p.flags.skill_swim ?? 0) > 0,
    climb: up.some((m) => hasSkill(m, 'mountaineer')) || (p.flags.skill_mountaineer ?? 0) > 0,
    keys: countItem(p, 'key_iron'),
  };
}

/** The six that come with a new game: one of each class, so every system is exercised in the slice, each on its class's stats. */
export function defaultParty(tables: Tables, rng: RngInstance): Party {
  const six: readonly (readonly [name: string, race: RaceId, cls: ClassId])[] = [
    ['Bram', 'human', 'knight'], ['Idris', 'orcblood', 'paladin'], ['Wren', 'elf', 'ranger'],
    ['Ottilie', 'gnome', 'thief'], ['Maren', 'tidefolk', 'cleric'], ['Cassian', 'human', 'sorcerer'],
  ];
  return createParty(six.map(([name, race, cls]) => createCharacter(tables, name, race, cls, CLASSES[cls].stats, rng)));
}

/** The classes that mend in a fight: a company drawn at random has one at least. */
const MENDERS: readonly ClassId[] = ['cleric', 'paladin', 'bard', 'druid'];
/** The peoples and the classes in their tables' order, as the creation screen lists them. */
const RACE_IDS = Object.keys(RACES) as RaceId[];
const CLASS_IDS = Object.keys(CLASSES) as ClassId[];

/**
 * A company drawn from a seed alone, as P on the title musters one (epic #713, Decided 11): six of
 * the ten classes, one of them a mender, each with a people and a name drawn and on its class's
 * stats, as the creation screen makes a member, the hardiest in the front row. Only the seed makes
 * it, so a seed replays.
 */
export function randomParty(tables: Tables, seed: number): Party {
  const rng = makeRng(seed);
  const draw = <T>(from: readonly T[]): T[] => { const left = [...from], out: T[] = []; while (out.length < 6) out.push(left.splice(rng.int(0, left.length - 1), 1)[0]); return out; };
  let classes = draw(CLASS_IDS);
  while (!classes.some((c) => MENDERS.includes(c))) classes = draw(CLASS_IDS);
  classes.sort((a, b) => CLASSES[b].hpDie - CLASSES[a].hpDie);
  const names = draw(SUGGESTED);
  return createParty(classes.map((cls, i) => createCharacter(tables, names[i], RACE_IDS[rng.int(0, RACE_IDS.length - 1)], cls, CLASSES[cls].stats, rng)));
}
