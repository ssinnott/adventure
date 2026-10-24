// The premade company and what it wears (#984): trained to a level, dressed by the ladder the areas'
// rungs make (each area's checks.ts), its prestiges and the what-ifs on the rules (`Rules`) taken, a
// fresh copy every call. The gate and the harness field it, and the suites and walkthroughs take it
// from here.
import { makeRng } from '../../src/lib/engine/rng.ts';
import type { RngInstance } from '../../src/lib/engine/rng.ts';
import { defaultParty, createCharacter, createParty, xpForLevel, levelUp, equip, weaponOf, bonus, hasTrait, PRESTIGE_LEVELS, prestigeOf, takePrestige } from '../../src/game/party.ts';
import type { Character, Party, ClassId, RaceId, Stats } from '../../src/game/party.ts';
import { linesOf, TIER_LEVELS } from '../../src/game/mastery.ts';
import type { Tier, Tiers } from '../../src/game/mastery.ts';
import { blowsOf } from '../../src/game/combat.ts';
import type { Edge } from '../../src/game/combat.ts';
import { item, hits } from '../../src/game/items.ts';
import { TABLES } from '../../src/content/index.ts';
import type { ItemDef } from '../../src/game/items.ts';
import type { Tables } from '../../src/game/tables.ts';
import { line } from './line.ts';
import { areaRows, gather } from './checks.ts';
import { type BotAnswer } from '../../src/game/bot.ts';
import type { BotOpts } from '../../src/game/bot.ts';

/**
 * What-ifs on the rules, for weighing a change before it is made; play has none of them. `spellsGrowTo`
 * is another level for damage spells to stop growing at than play's 10 (`--spell-cap`); `gearGrows` keeps the company's gear
 * growing past the ladder's top (`--gear-grows`, see `outfit`); `levelTraits` and `levelBonus` give it
 * powers past level 10 instead (`--level-traits`, `--level-bonus`, see `edgeOf`); `rankStep` is another
share a spell rank adds than play's RANK_STEP (`--rank-step`). The prestiges, their ranks and tiers 6
and 7 are play's, and every company takes them. Two more stand off unless a what-if sets them (#865):
`tiers` gives the company its Expert and Master (`--tiers`, see `tier`), and `bot` the bots' options
(`--bot`, BotOpts: the thrifty bot's in `play`, the gate's in fight.ts's `gateTurn`). And `company`
fields the four newer classes' company instead of the premade six (`--company newer`, see `fielded`).
And `artifacts` has it bear the bounds' artifacts named, past the ladder's top (`--artifacts`, see `bear`).
And `answer` turns the bots' answers (`ANSWER`, src/game/bot.ts), as `--abilities` does to see a fight
without one. A value of them is passed to each call that reads one, down to the fight (#946).
 */
export interface Rules { spellsGrowTo?: number; gearGrows?: boolean; levelTraits?: boolean; levelBonus?: boolean; rankStep?: number; tiers?: boolean; bot?: BotOpts; company?: 'newer'; artifacts?: readonly string[]; answer?: BotAnswer }
/** Play's rules, no what-if set: each call's own unless it is passed others. Frozen, so no suite leaves one set for the next (#946). */
export const RULES: Readonly<Rules> = Object.freeze({});
/** The what-ifs `rules` sets, by name. */
export const whatIfs = (rules: Readonly<Rules> = RULES): string[] => (Object.keys(rules) as (keyof Rules)[]).filter((k) => rules[k] !== undefined);
/** Why `--calibrate --write` refuses, while `rules` sets any what-if (a what-if is for weighing), naming them; none else. */
export const writeRefusal = (rules: Readonly<Rules> = RULES): string | undefined => (whatIfs(rules).length ? `a what-if is for weighing, not for writing: drop --write, or the what-ifs (${whatIfs(rules).join(', ')})` : undefined);

/** The classes whose first work is a weapon: the ones `--level-traits` gives more blows. */
export const FIGHTERS: readonly string[] = ['knight', 'paladin', 'ranger', 'thief', 'barbarian', 'monk'];

/**
 * The levels the what-ifs put promotions I and II at: 11, the first past Act I's 10, where Saltreach
 * brings the first, and 29, on Hearth Isle (EXPANSION.md §7).
 */
export const PROMOTIONS: readonly number[] = [11, 29];

/** The levels the prestiges come at (DESIGN.md §5): play's. */
export const PRESTIGES: readonly number[] = PRESTIGE_LEVELS;
/** How many prestiges a member of `level` has taken: one at each of PRESTIGES reached. */
export const prestigesAt = (level: number): number => PRESTIGES.filter((l) => level >= l).length;
/**
 * What the what-ifs give a member in a fight's `round`, past level 10. With `levelTraits` a fighter
 * strikes once more a turn with each promotion, and a sneak attack grows by 2 every two levels. With
 * `levelBonus` every member gains a point of damage and of armour every two levels, each where `rules`
 * sets it. Play gives none: its prestiges' perks are the resolver's own.
 */
export function edgeOf(c: Character, round: number, rules: Readonly<Rules> = RULES): Edge {
  const e: Edge = { blows: 1, damage: 0, ac: 0 }, steps = Math.floor(Math.max(0, c.level - 10) / 2);
  if (rules.levelTraits) {
    if (FIGHTERS.includes(c.cls)) e.blows += PROMOTIONS.filter((l) => c.level >= l).length;
    if (hasTrait(c, 'sneak_attack') && round === 1) e.damage += 2 * steps;
  }
  if (rules.levelBonus) { e.damage += steps; e.ac += steps; }
  return e;
}

/**
 * The harness's own items (#973): content's, and the copies `forge` makes for a what-if, which `unforge`
 * takes out again. Content's table is never written. Made on no prototype, so that V8 keeps it a
 * dictionary as it keeps content's: a copy by spread keeps 293 fast properties and looks an item up
 * two and a half times slower, at every blow of the gate.
 */
const OWN: Record<string, ItemDef> = Object.assign(Object.create(null) as Record<string, ItemDef>, TABLES.items);
/**
 * The tables the harness and the gate hand to src/game: content's, but for the items, the harness's own.
 * A worker builds its own as it loads this file, as it builds its rules.
 */
export const HARNESS: Tables = { ...TABLES, items: OWN };

/** A ladder's rows: by a level, the items a company has by then. */
type Rungs = readonly (readonly [number, readonly string[]])[];
/** The areas' rungs (`AreaChecks.gear`), in road order. */
const RUNGS = areaRows((c) => c.gear).map(([at, ids]) => [Number(at), ids] as const);
/** What a company wears (a weapon, armour or a shield), as against what it carries in its bag. */
const worn = (id: string): boolean => (OWN[id]?.slot ?? 'weapon') !== 'none';
/** The areas' rungs of one kind, worn or carried, in the order of their levels. */
export const ladder = (wear: boolean): Rungs =>
  RUNGS.map(([at, ids]) => [at, ids.filter((id) => worn(id) === wear)] as const).filter(([, ids]) => ids.length).sort((a, b) => a[0] - b[0]);

/**
 * The ladder: what a company has in its hands by a level (EXPANSION.md §5.2). Its kit, then by 3
 * the band's gear from Mottram's and the kits' weapons with a plus from the Downs' first boxes, by
 * 5 the kits' armour with a plus and the Downs' last finds, then Thornmark's armoury from 8, where
 * plate is dear, its chests' gear with a plus by 9 and the Deepthorn's +2s by 10. Past them, Act II's
 * (#399): Saltmouth's armourer's step from 11, the same with a plus from Saltreach's and Wrackholm's
 * boxes by 13, Lantern Watch's stores from 14 and theirs with a plus from the Sunder by 16. Then
 * Act III's (#535): Anvilhall's forge from 17, the same with a plus from the Kilns' and Cairnmoor's
 * boxes by 19, Rime Lodge's furrier from 21 and theirs with a plus from Rimewater by 22. Then Act
 * IV's one (#542): Cinderport's armourer from 25. And Act V's, the last (#746): the Hand's steel from
 * 28, found on Hearth Isle and never sold, each piece a point past the armourer's. Each member takes
 * the best its class can use of the kind it already carries, which flatters the company a little
 * (the Old Lantern's Staff is one staff, and every member it is the best for takes it). The
 * harness and the gate check both dress their company from it. Each rung is held by an area in
 * its checks.ts (`AreaChecks.gear`), the last on the road whose items it holds (#968); a level given
 * on two areas is refused (`RUNGS_TWICE`). Each member dresses from it (`outfit`).
 */
export const GEAR: Rungs = ladder(true);
/** The ladder's top: past it, gear grows only in a what-if (`Rules.gearGrows`). */
export const GEAR_TOP = GEAR[GEAR.length - 1][0];

/** The ids `forge` has put in the harness's items, for `unforge` to take out. */
const forged: string[] = [];

/** A copy of an item with more to it, for a what-if: kept in the harness's items (`HARNESS`) under its own id until `unforge`. */
function forge(base: ItemDef, more: { bonus?: number; ac?: number; hit?: number }, plus: number): string {
  const id = `${base.id}+${plus}${more.hit ? `^${more.hit}` : ''}`;
  if (!OWN[id]) {
    const copy: ItemDef = { ...base, id, name: `${base.name} +${plus}` };
    if (more.bonus !== undefined) copy.bonus = (base.bonus ?? 0) + more.bonus;
    if (more.ac !== undefined) copy.ac = (base.ac ?? 0) + more.ac;
    if (more.hit !== undefined) copy.plus = (base.plus ?? 0) + more.hit;
    OWN[id] = copy;
    forged.push(id);
  }
  return id;
}

/**
 * Takes every copy `forge` made out of the harness's items again, and the companies kept that were dressed
 * in them (made under `gearGrows`), so a what-if's gear is left behind nowhere (#946).
 */
export function unforge(): void {
  for (const id of forged.splice(0)) delete OWN[id];
  for (const key of [...companies.keys()]) if (/^(newer:)?\d+:\d+:gear/.test(key)) companies.delete(key);
}

/**
 * Dresses a member in the best of GEAR it can use by `level`. With `rules.gearGrows`, past the
 * ladder's top its weapon and armour are enchanted as the curve's gear would be: the weapon's blow
 * grows as the line's hit points do, and the armour a point every two levels, as the line's to-hit does.
 */
export function outfit(c: Character, level: number, rules: Readonly<Rules> = RULES): void {
  const pool = GEAR.filter(([at]) => at <= level).flatMap(([, ids]) => ids).map((id) => item(HARNESS.items, id)).filter((d) => !d.classes || d.classes.includes(c.cls));
  const w = weaponOf(HARNESS.items, c), shielded = !!c.equipment.shield;
  const weapon = pool.filter((d) => d.slot === 'weapon' && !!d.ranged === !!w.ranged && !(shielded && d.twoHanded) && hits(d) > hits(w)).sort((a, b) => hits(b) - hits(a))[0];
  if (weapon) equip(HARNESS.items, c, weapon.id);
  const worn = c.equipment.armor ? item(HARNESS.items, c.equipment.armor).ac ?? 0 : 0;
  const armour = pool.filter((d) => d.slot === 'armor' && (d.ac ?? 0) > worn).sort((a, b) => (b.ac ?? 0) - (a.ac ?? 0))[0];
  if (armour) equip(HARNESS.items, c, armour.id);
  if (shielded) {
    const held = item(HARNESS.items, c.equipment.shield!).ac ?? 0;
    const shield = pool.filter((d) => d.slot === 'shield' && (d.ac ?? 0) > held).sort((a, b) => (b.ac ?? 0) - (a.ac ?? 0))[0];
    if (shield) equip(HARNESS.items, c, shield.id);
  }
  if (rules.gearGrows && level > GEAR_TOP) {
    const held = weaponOf(HARNESS.items, c), blow = Math.round(hits(held) * (line(level).hp / line(GEAR_TOP).hp - 1));
    if (blow > 0) equip(HARNESS.items, c, forge(held, { bonus: blow }, blow));
    const worn = c.equipment.armor ? item(HARNESS.items, c.equipment.armor) : null, ac = Math.floor((level - GEAR_TOP) / 2);
    if (worn && ac > 0) equip(HARNESS.items, c, forge(worn, { ac }, ac));
  }
}

/**
 * The weapon a class's prestige blows want where the ladder's best by its blow is another (combat.ts
 * `blowsOf`), and the kit's own of that kind: the thief's light blade, and the monk's staff (#854), the
 * one of the four newer classes whose blows ask a kind. The ranger's bow is the one it holds.
 */
const BLOWS_WANT: Partial<Record<ClassId, { kind: string; kit: readonly string[] }>> = { thief: { kind: 'light', kit: ['dagger', 'shortsword', 'sling'] }, monk: { kind: 'staff', kit: ['staff'] } };

/**
 * The prestiges a company of its level takes (DESIGN.md §5), as play gives them: each at its level,
 * with its hit points, spell points and perks (game/party.ts, the resolver). The thief takes a light
 * weapon, and the monk a staff, where its blows with it beat one with what it holds (BLOWS_WANT). A
 * caster's and a hybrid's prestiges are its spell ranks, as play reads them (party.ts `rankMult`).
 */
function prestige(p: Party): void {
  for (const c of p.members) {
    for (let n = prestigesAt(c.level); prestigeOf(c) < n;) takePrestige(c);
    const want = BLOWS_WANT[c.cls];
    if (want && prestigeOf(c)) {
      const held = weaponOf(HARNESS.items, c), best = GEAR.filter(([at]) => at <= c.level).flatMap(([, ids]) => ids).concat(want.kit).map((id) => item(HARNESS.items, id))
        .filter((d) => d.kind === want.kind && !!d.ranged === !!held.ranged && (!d.classes || d.classes.includes(c.cls))).sort((a, b) => hits(b) - hits(a))[0];
      if (best && blowsOf(HARNESS.items, { ...c, equipment: { ...c.equipment, weapon: best.id } }) * hits(best) > blowsOf(HARNESS.items, c) * hits(held)) equip(HARNESS.items, c, best.id);
    }
  }
}

/**
 * The tiers a company of its level holds where `rules.tiers` asks (#852; off unless `--tiers`,
 * #865): on each line
 * its class takes (`linesOf`: a fighter's arms, a caster's magic, a hybrid's both), Expert from 13 and
 * Master from 25 (`TIER_LEVELS`), as a company that took each when it could. After the prestiges, as
 * play teaches them; what a tier does is the resolver's (party.ts `armsBonus`, `rankMult`).
 */
function tier(p: Party): void {
  for (const c of p.members) {
    const t: Tier | undefined = c.level >= TIER_LEVELS.master ? 'master' : c.level >= TIER_LEVELS.expert ? 'expert' : undefined;
    if (!t) continue;
    const tiers: Tiers = {};
    for (const line of linesOf(c.cls)) tiers[line] = t;
    c.tiers = tiers;
  }
}

/** The artifacts in the item tables (`ItemDef.artifact`, #847): one of each in the world, on no rung of the ladder. */
export const artifactIds = (): string[] => Object.values(OWN).filter((d) => d.artifact).map((d) => d.id);

/**
 * The artifacts a company bears where `rules.artifacts` asks (#847; off unless `--artifacts`): each,
 * one in the world, by the first member in the company's order who may bear it, as `outfit` would
 * dress them (a weapon of the reach they hold, or of the other where none who may bear it holds that
 * reach; a two-hander puts a shield in the pack, but never an artifact's) and with no artifact in its
 * slot already. After the ladder, the prestiges and the tiers; the gate's company stays the plain
 * one (#891).
 */
function bear(p: Party, ids: readonly string[]): void {
  for (const id of ids) {
    const d = item(HARNESS.items, id), mine = (c: Character): boolean => d.slot !== 'none' && !!c.equipment[d.slot] && !!item(HARNESS.items, c.equipment[d.slot]!).artifact;
    const may = (m: Character): boolean => (!d.classes || d.classes.includes(m.cls)) && !mine(m) && (d.slot !== 'shield' || !weaponOf(HARNESS.items, m).twoHanded)
      && !(d.twoHanded && m.equipment.shield && item(HARNESS.items, m.equipment.shield).artifact);
    // A weapon of the reach they hold where anyone may bear it so, else of the other: its power is borne from either row.
    const c = p.members.find((m) => may(m) && (d.slot !== 'weapon' || !!d.ranged === !!weaponOf(HARNESS.items, m).ranged)) ?? p.members.find(may);
    if (!c) continue;
    if (d.slot === 'none') c.pack.push(id); else equip(HARNESS.items, c, id);
  }
}

/**
 * A company trained to `level` on `rng`, as every company the harness plays is: each member trained
 * and dressed by the ladder (`outfit`), the bag's kit (`KIT`), the prestiges (`prestige`) and, where
 * `rules.tiers` asks, the tiers (`tier`), and where `rules.artifacts` does, the artifacts (`bear`); then whole.
 */
function train(p: Party, level: number, rng: RngInstance, rules: Readonly<Rules>): Party {
  for (const c of p.members) { c.xp = xpForLevel(level); levelUp(c, rng); outfit(c, level, rules); }
  p.bag.push(...KIT.filter(([at]) => at <= level).flatMap(([, ids]) => ids));
  prestige(p);
  if (rules.tiers) tier(p);
  if (rules.artifacts) bear(p, rules.artifacts);
  for (const c of p.members) { c.hp = c.maxHp; c.sp = c.maxSp; }
  return p;
}

const companies = new Map<string, Party>();
/** A company's key in the cache: its kind, its level, its seed and the what-ifs of `rules` that make it otherwise. */
const keyOf = (kind: string, level: number, seed: number, rules: Readonly<Rules>): string => `${kind}${level}:${seed}:${rules.gearGrows ? 'gear' : ''}${rules.tiers ? ':tiers' : ''}${rules.artifacts ? `:${rules.artifacts.join('+')}` : ''}`;
/**
 * The premade six trained to `level`, outfitted for it and with the prestiges it brings, whole, under
 * the what-ifs `rules`; a fresh copy every call. The gate's company is this one (`gateCompany`, below).
 */
export function companyAt(level: number, seed: number, rules: Readonly<Rules> = RULES): Party {
  const key = keyOf('', level, seed, rules);
  let p = companies.get(key);
  if (!p) {
    const rng = makeRng(seed);
    p = train(defaultParty(HARNESS, rng), level, rng, rules);
    companies.set(key, p);
  }
  return structuredClone(p);
}

/**
 * The four newer classes' company (#854): a barbarian, a monk and a paladin in front; a bard, a
 * druid and a sorcerer behind. Each of the four takes a premade member's place and raises, on its own
 * class's stats and of a people that suits it (the barbarian Bram's, the monk Wren's, the bard
 * Ottilie's, the druid Maren's); the paladin and the sorcerer are the premade's Idris and Cassian, so
 * the two companies differ by the four alone.
 */
export const NEWER: readonly (readonly [name: string, race: RaceId, cls: ClassId, raised: Partial<Stats>])[] = [
  ['Rook', 'dwarf', 'barbarian', { might: 15, endurance: 14, accuracy: 12 }],
  ['Hollis', 'tidefolk', 'monk', { accuracy: 14, speed: 13, might: 11 }],
  ['Idris', 'orcblood', 'paladin', { might: 13, personality: 13, endurance: 12 }],
  ['Aveline', 'gnome', 'bard', { personality: 15, speed: 13, accuracy: 12 }],
  ['Sable', 'human', 'druid', { personality: 15, endurance: 12 }],
  ['Cassian', 'human', 'sorcerer', { intellect: 16, luck: 11, speed: 11 }],
];

/**
 * NEWER trained to `level` as `companyAt`'s six are (`train`): dressed, prestiged and, where
 * `rules.tiers` asks, tiered; a fresh copy every call. The harness suite holds it to the line at
 * four levels (EXPANSION §5.2); the gate judges the premade six alone.
 */
export function newerCompany(level: number, seed: number, rules: Readonly<Rules> = RULES): Party {
  const key = keyOf('newer:', level, seed, rules);
  let p = companies.get(key);
  if (!p) {
    const rng = makeRng(seed);
    p = train(createParty(NEWER.map(([name, race, cls, raised]) => createCharacter(HARNESS, name, race, cls, raised, rng))), level, rng, rules);
    companies.set(key, p);
  }
  return structuredClone(p);
}

/** The company the harness fields: the premade six (`companyAt`), or the newer six where `rules.company` asks (`newerCompany`). */
export const fielded = (level: number, seed: number, rules: Readonly<Rules> = RULES): Party => (rules.company === 'newer' ? newerCompany(level, seed, rules) : companyAt(level, seed, rules));

/**
 * What the company carries beside its gear, by a level: from 25 a Quickening Draught, the stone cure
 * Cinderport's chandler sells by the ladder's step (#546), for a glassed member no one standing can
 * absolve: what the areas' rungs carry rather than wear. tools/tests/ladder.ts holds it to the band's
 * window.
 */
export const KIT: Rungs = ladder(false);
/** The levels whose rung is given on two areas: tools/tests/ladder.ts refuses them. */
export const RUNGS_TWICE: readonly string[] = gather(RUNGS.map(([at, ids]) => [`${at}`, ids] as const)).twice;

/**
 * The premade company, every member trained to `level`, dressed by the ladder and with the prestiges
 * that level brings, whole: harness's own (`companyAt`, under `rules`), a fresh copy every call. Under
 * level 1 it is no company, and throws.
 */
export function gateCompany(level: number, seed: number, rules: Readonly<Rules> = RULES): Party {
  if (!(level >= 1)) throw new Error(`no company at level ${level}: levels start at 1`);
  return companyAt(level, seed, rules);
}
