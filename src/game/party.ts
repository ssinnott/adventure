// The party: races, classes, characters, levelling, conditions. Pure data and pure functions; the
// rng is passed in so tests can pin it.
import type { RngInstance } from '../lib/engine/rng.ts';
import { item } from './items.ts';
import { ITEMS } from '../content/index.ts';
import type { ItemDef } from './items.ts';
import { spellsFor, ELEMENTS } from './spells.ts';
import type { SpellList, Element } from './spells.ts';
import type { SkillId } from './skills.ts';

export type Stat = 'might' | 'intellect' | 'personality' | 'endurance' | 'accuracy' | 'speed' | 'luck';
export const STATS: readonly Stat[] = ['might', 'intellect', 'personality', 'endurance', 'accuracy', 'speed', 'luck'];
export type Stats = Record<Stat, number>;

export type RaceId = 'human' | 'dwarf' | 'elf' | 'gnome' | 'tidefolk' | 'orcblood';
export type ClassId = 'knight' | 'paladin' | 'ranger' | 'cleric' | 'sorcerer' | 'thief' | 'barbarian' | 'monk' | 'bard' | 'druid';

export interface RaceDef {
  id: RaceId; name: string;
  mods: Partial<Stats>;
  /** Innate terrain skill. */
  swim?: boolean;
  /** Finds secrets a cell earlier; cheaper training. */
  perceptive?: boolean;
  resist?: readonly Condition[];
  blurb: string;
}

export interface ClassDef {
  id: ClassId; name: string;
  hpDie: number;
  spDie: number;
  /** The stat SP scales from; none for non-casters. */
  spStat?: Stat;
  spells?: SpellList;
  /** Base to-hit and the martial multiplier on levelling attack bonus. */
  attack: number;
  /** Starting kit. */
  kit: readonly string[];
  /** Passive traits, always on. */
  traits: readonly TraitId[];
  blurb: string;
}

export type TraitId =
  | 'stalwart' | 'weapon_master' | 'holy_strike' | 'divine_health' | 'marksman' | 'keen_eyes' | 'healing_hands'
  | 'faith' | 'spellfire' | 'iron_will' | 'sneak_attack' | 'rage' | 'die_hard' | 'unarmoured' | 'stillness'
  | 'inspire' | 'natures_ward';

export interface TraitDef {
  id: TraitId; name: string; text: string;
  /** Conditions the trait makes its holder immune to. */
  immune?: readonly Condition[];
}

/** What the numeric traits are worth; combat.ts and armorClass read these. */
export const STALWART_AC = 2, WEAPON_MASTER_DMG = 1, HOLY_STRIKE_DMG = 3, MARKSMAN_DMG = 2, HEALING_HANDS = 3,
  SPELLFIRE_DMG = 2, SNEAK_ATTACK_DMG = 4, RAGE_DMG = 3, DIE_HARD_AT = -20, INSPIRE_HIT = 1;

export const TRAITS: Record<TraitId, TraitDef> = {
  stalwart:      { id: 'stalwart', name: 'Stalwart', text: `+${STALWART_AC} AC.` },
  weapon_master: { id: 'weapon_master', name: 'Weapon Master', text: `+${WEAPON_MASTER_DMG} melee damage.` },
  holy_strike:   { id: 'holy_strike', name: 'Holy Strike', text: `+${HOLY_STRIKE_DMG} damage to the dead.` },
  divine_health: { id: 'divine_health', name: 'Divine Health', text: 'Immune to disease.', immune: ['diseased'] },
  marksman:      { id: 'marksman', name: 'Marksman', text: `+${MARKSMAN_DMG} damage with ranged weapons.` },
  keen_eyes:     { id: 'keen_eyes', name: 'Keen Eyes', text: 'Always finds a secret door when searching.' },
  healing_hands: { id: 'healing_hands', name: 'Healing Hands', text: `Healing spells restore ${HEALING_HANDS} more.` },
  faith:         { id: 'faith', name: 'Faith', text: 'Immune to curses.', immune: ['cursed'] },
  spellfire:     { id: 'spellfire', name: 'Spellfire', text: `Damage spells deal +${SPELLFIRE_DMG} to each foe.` },
  iron_will:     { id: 'iron_will', name: 'Iron Will', text: 'Immune to sleep.', immune: ['asleep'] },
  sneak_attack:  { id: 'sneak_attack', name: 'Sneak Attack', text: `+${SNEAK_ATTACK_DMG} damage in a fight's first round.` },
  rage:          { id: 'rage', name: 'Rage', text: `+${RAGE_DMG} melee damage while below half hp.` },
  die_hard:      { id: 'die_hard', name: 'Die Hard', text: `Dies only at ${DIE_HARD_AT} hp, not -10.` },
  unarmoured:    { id: 'unarmoured', name: 'Unarmoured Defence', text: 'In a robe or less, no shield: +1 AC, +1 more every two levels.' },
  stillness:     { id: 'stillness', name: 'Stillness', text: 'Immune to paralysis.', immune: ['paralysed'] },
  inspire:       { id: 'inspire', name: 'Inspiring Song', text: `While standing, the party hits +${INSPIRE_HIT} more often.` },
  natures_ward:  { id: 'natures_ward', name: "Nature's Ward", text: 'Immune to poison.', immune: ['poisoned'] },
};

export const RACES: Record<RaceId, RaceDef> = {
  human:    { id: 'human', name: 'Human', mods: {}, blurb: 'Balanced.' },
  dwarf:    { id: 'dwarf', name: 'Dwarf', mods: { might: 2, endurance: 3, speed: -1, personality: -1 }, resist: ['poisoned'], blurb: 'Hardy. Resists poison. Reads Kiln-script.' },
  elf:      { id: 'elf', name: 'Elf', mods: { intellect: 3, accuracy: 2, might: -2, endurance: -1 }, perceptive: true, blurb: 'Keen. Innate perception.' },
  gnome:    { id: 'gnome', name: 'Gnome', mods: { luck: 3, personality: 1, might: -2 }, perceptive: true, blurb: 'Lucky. Finds secrets sooner.' },
  tidefolk: { id: 'tidefolk', name: 'Tidefolk', mods: { speed: 2, endurance: 2, intellect: -1, luck: -1 }, swim: true, blurb: 'Swims without the skill.' },
  orcblood: { id: 'orcblood', name: 'Orcblood', mods: { might: 3, speed: 1, intellect: -2, personality: -2 }, blurb: 'Strong. Distrusted in Helmstow.' },
};

export const CLASSES: Record<ClassId, ClassDef> = {
  knight:   { id: 'knight', name: 'Knight', hpDie: 10, spDie: 0, attack: 3, kit: ['longsword', 'scale', 'buckler'], traits: ['stalwart', 'weapon_master'], blurb: 'The wall. Best weapons and armour.' },
  paladin:  { id: 'paladin', name: 'Paladin', hpDie: 8, spDie: 3, spStat: 'personality', spells: 'cleric', attack: 2, kit: ['mace', 'leather', 'buckler'], traits: ['holy_strike', 'divine_health'], blurb: 'Fights and heals a little.' },
  ranger:   { id: 'ranger', name: 'Ranger', hpDie: 8, spDie: 2, spStat: 'intellect', spells: 'druid', attack: 2, kit: ['shortsword', 'leather', 'shortbow'], traits: ['marksman', 'keen_eyes'], blurb: 'Bows and a little druid magic. Pathfinder.' },
  cleric:   { id: 'cleric', name: 'Cleric', hpDie: 6, spDie: 6, spStat: 'personality', spells: 'cleric', attack: 1, kit: ['mace', 'robe'], traits: ['healing_hands', 'faith'], blurb: 'Heals, cures, protects.' },
  sorcerer: { id: 'sorcerer', name: 'Sorcerer', hpDie: 4, spDie: 8, spStat: 'intellect', spells: 'sorcerer', attack: 0, kit: ['dagger', 'robe', 'sling'], traits: ['spellfire', 'iron_will'], blurb: 'Damage and the spells that open the map.' },
  thief:    { id: 'thief', name: 'Thief', hpDie: 6, spDie: 0, attack: 2, kit: ['shortsword', 'leather', 'sling'], traits: ['sneak_attack', 'keen_eyes'], blurb: 'Locks, traps, and hitting first.' },
  barbarian: { id: 'barbarian', name: 'Barbarian', hpDie: 12, spDie: 0, attack: 3, kit: ['axe', 'leather'], traits: ['rage', 'die_hard'], blurb: 'Most hp of all. Big weapons, light armour.' },
  monk:     { id: 'monk', name: 'Monk', hpDie: 8, spDie: 0, attack: 3, kit: ['staff', 'robe'], traits: ['unarmoured', 'stillness'], blurb: 'Staff and robe, no steel. Quick.' },
  bard:     { id: 'bard', name: 'Bard', hpDie: 6, spDie: 4, spStat: 'personality', spells: 'cleric', attack: 1, kit: ['shortsword', 'leather', 'sling'], traits: ['inspire'], blurb: 'A blade, a song, and some healing.' },
  druid:    { id: 'druid', name: 'Druid', hpDie: 6, spDie: 6, spStat: 'personality', spells: 'druid', attack: 1, kit: ['staff', 'leather'], traits: ['natures_ward', 'healing_hands'], blurb: 'Thorn, storm and mending. Wears leather.' },
};

/**
 * How a class grows by its prestiges (DESIGN §5): a caster's are spell ranks, a hybrid's a rank and a
 * perk, and the rest perks.
 */
export type Calling = 'caster' | 'hybrid' | 'fighter';

/**
 * Each class's three prestiges (DESIGN §5): the titles, which become its name once taken, and how it
 * grows. They come at PRESTIGE_LEVELS; the first two cost PRESTIGE_PRICES and the third a quest.
 */
export const PRESTIGES: Record<ClassId, { calling: Calling; titles: readonly [string, string, string] }> = {
  knight:    { calling: 'fighter', titles: ['Knight-Errant', 'Knight Banneret', 'Knight Paramount'] },
  paladin:   { calling: 'hybrid', titles: ['Lightbearer', 'Justicar', 'Exemplar'] },
  ranger:    { calling: 'hybrid', titles: ['Outrider', 'Deadeye', 'Unerring'] },
  cleric:    { calling: 'caster', titles: ['Curate', 'Prelate', 'Exarch'] },
  sorcerer:  { calling: 'caster', titles: ['Arcanist', 'Thaumaturge', 'Magus'] },
  thief:     { calling: 'fighter', titles: ['Tumbler', 'Nightjar', 'Faceless'] },
  barbarian: { calling: 'fighter', titles: ['Berserker', 'Ironhide', 'Warlord'] },
  monk:      { calling: 'fighter', titles: ['Stillwater', 'Windwalker', 'Ascendant'] },
  bard:      { calling: 'hybrid', titles: ['Troubadour', 'Skald', 'Laureate'] },
  druid:     { calling: 'caster', titles: ['Swarmcaller', 'Thornspeaker', 'Archdruid'] },
};
/** The levels the prestiges come at: the first past Act I's 10, then eight apart. */
export const PRESTIGE_LEVELS: readonly [number, number, number] = [11, 19, 27];
/** What the first and second cost, each member; the third asks a quest instead. */
export const PRESTIGE_PRICES: readonly [number, number, number] = [1000, 4000, 0];
/** What each prestige adds to every level from its own on: hit points and spell points. */
export const PRESTIGE_POOLS: Record<Calling, readonly [number, number]> = { caster: [1, 2], hybrid: [1, 1], fighter: [2, 0] };

/** The prestiges a member has taken. */
export const prestigeOf = (c: Pick<Character, 'prestige'>): number => c.prestige ?? 0;
/** What a member is called: its last prestige's title, or its class's name. */
export const className = (c: Pick<Character, 'cls' | 'prestige'>): string => (prestigeOf(c) ? PRESTIGES[c.cls].titles[prestigeOf(c) - 1] : CLASSES[c.cls].name);
/**
 * A member's spell rank (DESIGN §7): a caster's or a hybrid's prestiges, none for the rest. What a
 * rank does to a spell is `rankMult`'s; a hybrid's is half a caster's step.
 */
export const spellRank = (c: Pick<Character, 'cls' | 'prestige'>): number => (PRESTIGES[c.cls].calling === 'fighter' ? 0 : prestigeOf(c));
/**
 * The hit points and spell points a member's prestiges add to every level from each one's own on, at
 * its level: each counted from the prestige's level, whenever it was taken.
 */
export function prestigePools(c: Pick<Character, 'cls' | 'prestige' | 'level'>): { hp: number; sp: number } {
  const [hp, sp] = PRESTIGE_POOLS[PRESTIGES[c.cls].calling];
  const levels = PRESTIGE_LEVELS.slice(0, prestigeOf(c)).reduce((t, at) => t + Math.max(0, c.level - at + 1), 0);
  return { hp: hp * levels, sp: CLASSES[c.cls].spStat ? sp * levels : 0 };
}

/**
 * Why a member may not take its next prestige, or '' if it may: three taken already, or short of its
 * level. The price, and the third's quest, are the trainer's to ask.
 */
export function prestigeBar(c: Pick<Character, 'cls' | 'prestige' | 'level'>): string {
  const n = prestigeOf(c);
  if (n >= 3) return 'done';
  return c.level < PRESTIGE_LEVELS[n] ? `level ${PRESTIGE_LEVELS[n]}` : '';
}

/** Take the next prestige: its title, and its hit points and spell points for every level from its own. */
export function takePrestige(c: Character): void {
  const before = prestigePools(c);
  c.prestige = prestigeOf(c) + 1;
  const after = prestigePools(c), hp = after.hp - before.hp, sp = after.sp - before.sp;
  c.maxHp += hp; c.hp += hp; c.maxSp += sp; c.sp += sp;
}

export type Condition = 'asleep' | 'poisoned' | 'diseased' | 'paralysed' | 'cursed' | 'stoned' | 'unconscious' | 'dead';
export const CONDITION_ORDER: readonly Condition[] = ['dead', 'stoned', 'unconscious', 'paralysed', 'asleep', 'poisoned', 'diseased', 'cursed'];

export interface Equipment { weapon: string | null; armor: string | null; shield: string | null; }

export interface Character {
  name: string;
  race: RaceId;
  cls: ClassId;
  level: number;
  xp: number;
  stats: Stats;
  hp: number; maxHp: number;
  sp: number; maxSp: number;
  conditions: Condition[];
  equipment: Equipment;
  /** Spell ids known. */
  spells: string[];
  /** Personal pack, item ids. */
  pack: string[];
  /** The prestiges taken, 0 to 3 (DESIGN §5); absent in a save from before them, which is none. */
  prestige?: number;
  /** A cleric's third prestige has kept someone from death since the last rest (`lastRite`). */
  riteSpent?: boolean;
  /** The elements a blessing keeps off (#555): for good, or `until` the next rest. */
  blessed: Blessed[];
  /** The secondary skills learnt (game/skills.ts; DESIGN §5); absent in a save from before them, which is none. */
  skills?: SkillId[];
}

/** An element a blessing keeps off a member, for good or `until` the next rest. */
export interface Blessed { element: Element; until?: 'rest' }

export interface Party {
  members: Character[];
  gold: number;
  food: number;
  /** Shared items not carried by anyone in particular. */
  bag: string[];
  /** Quest and dialogue flags. */
  flags: Record<string, number>;
}

/** The flag a party holds once it has paid a spell hall's fee to study: made from the hall's name, so renaming a hall forgets who paid. */
export const guildFlag = (hall: string): string => `guild_${hall}`;

export const BASE_STATS: Stats = { might: 10, intellect: 10, personality: 10, endurance: 10, accuracy: 10, speed: 10, luck: 10 };

/** Stat bonus in the +/-4 range that the tables use. */
export function bonus(v: number): number { return Math.floor((v - 10) / 3); }

export function xpForLevel(level: number): number { return Math.floor(100 * Math.pow(level - 1, 2) * 1.5) + (level - 1) * 100; }

/**
 * The road's cap. Levels are bought at a trainer, and each town's trainer teaches to its band's top
 * plus one (EXPANSION §5.2), so what a company can reach is set by the towns built, not by this.
 */
export const MAX_LEVEL = 32;
/** Spell tiers unlock at levels 1, 2, 4, 6 and 8, then 15 and 23, between the prestiges (DESIGN §7); seven tiers exist. */
export const MAX_SPELL_TIER = 7;
/** The levels tiers 6 and 7 come at; a hybrid's come two levels later (HYBRID_LAG). */
export const LATE_TIERS: readonly [number, number] = [15, 23];
export const HYBRID_LAG = 2;
export function spellTierAt(level: number, hybrid = false): number {
  const lag = hybrid ? HYBRID_LAG : 0;
  return level >= LATE_TIERS[1] + lag ? 7 : level >= LATE_TIERS[0] + lag ? 6 : Math.min(5, 1 + Math.floor(level / 2));
}

/** What a spell rank adds to a damage spell's dice and a mending spell's heal (DESIGN §7): 15%, 45% by the third. */
export const RANK_STEP = 0.15;
/**
 * What its ranks make a caster's damage dice and mending: a step a rank, half a step for a hybrid,
 * whose perks carry the rest of its growth. A tool weighing another step passes it.
 */
export function rankMult(c: Character, step = RANK_STEP): number {
  return 1 + step * (PRESTIGES[c.cls].calling === 'hybrid' ? 0.5 : 1) * spellRank(c);
}
/** Whether the character has the experience for the next level (and is not at the cap). */
export function canTrain(c: Character): boolean { return c.level < MAX_LEVEL && c.xp >= xpForLevel(c.level + 1); }
/** Whether a trainer who teaches to `maxLevel` can teach the character its next level. */
export function canTrainAt(c: Character, maxLevel: number): boolean { return c.level < maxLevel && canTrain(c); }

/** Split xp among the living, as a fight's is; returns who it makes ready to train. */
export function payXp(party: Party, xp: number): string[] {
  const alive = party.members.filter((c) => !hasCondition(c, 'dead'));
  const each = Math.floor(xp / Math.max(1, alive.length)), ready: string[] = [];
  for (const c of alive) { const before = canTrain(c); c.xp += each; if (!before && canTrain(c)) ready.push(c.name); }
  return ready;
}
/** What a trainer charges to teach the next level: 25 a level to 5, 40 a level after, to the cap. */
export function trainPrice(c: Pick<Character, 'level'>): number { return c.level < 5 ? c.level * 25 : c.level * 40; }

/**
 * What a kill pays a member, as a share of the monster's xp, by the monster's level against theirs
 * (EXPANSION §5.2): a tenth at three or more under, up to half again at three or more over.
 */
export const KILL_PAY: Readonly<Record<number, number>> = { [-3]: 0.1, [-2]: 0.4, [-1]: 0.7, 0: 1, 1: 1.15, 2: 1.3, 3: 1.5 };
export function killPay(monsterLevel: number, memberLevel: number): number {
  return KILL_PAY[Math.max(-3, Math.min(3, Math.round(monsterLevel - memberLevel)))];
}

/** The most letters a member's name may have (ui/create.ts): what a line that names a member is measured with. */
export const NAME_MAX = 10;

export function createCharacter(name: string, race: RaceId, cls: ClassId, base: Partial<Stats>, rng: RngInstance): Character {
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
  for (const id of cd.kit) equip(c, id) || c.pack.push(id);
  if (cd.spells) c.spells = spellsFor(cd.spells, 1).map((s) => s.id);
  void rng;
  return c;
}

/** Equip an item from anywhere; returns false if the class cannot use it. */
export function equip(c: Character, id: string): boolean {
  const d = item(id);
  if (d.slot === 'none') return false;
  if (d.classes && !d.classes.includes(c.cls)) return false;
  if (d.slot === 'shield' && c.equipment.weapon && item(c.equipment.weapon).twoHanded) return false;
  if (d.slot === 'weapon' && d.twoHanded && c.equipment.shield) { c.pack.push(c.equipment.shield); c.equipment.shield = null; }
  const old = c.equipment[d.slot];
  if (old) c.pack.push(old);
  c.equipment[d.slot] = id;
  const i = c.pack.indexOf(id);
  if (i >= 0) c.pack.splice(i, 1);
  return true;
}

export function armorClass(c: Character): number {
  let ac = 10 + bonus(c.stats.speed);
  for (const slot of ['armor', 'shield'] as const) { const id = c.equipment[slot]; if (id) ac += ITEMS[id].ac ?? 0; }
  if (hasTrait(c, 'stalwart')) ac += STALWART_AC;
  if (hasTrait(c, 'unarmoured') && !c.equipment.shield && robeLike(ITEMS[c.equipment.armor ?? ''])) ac += 1 + Math.floor(c.level / 2);
  return ac;
}

/** Nothing, or armour of a robe's own armour class: a plus does not make a robe armour. */
export const robeLike = (d: ItemDef | undefined): boolean => (d?.ac ?? 0) - (d?.plus ?? 0) <= 1;

export function weaponOf(c: Character): ItemDef { return c.equipment.weapon ? item(c.equipment.weapon) : ITEMS.club; }

export function attackBonus(c: Character): number {
  return CLASSES[c.cls].attack + Math.floor(c.level / 2) + bonus(c.stats.accuracy) + (weaponOf(c).plus ?? 0);
}

export function isDown(c: Character): boolean {
  return c.conditions.some((k) => k === 'dead' || k === 'unconscious' || k === 'stoned');
}
export function canAct(c: Character): boolean {
  return !isDown(c) && !c.conditions.some((k) => k === 'asleep' || k === 'paralysed');
}
export function hasCondition(c: Character, k: Condition): boolean { return c.conditions.includes(k); }
export function hasTrait(c: Character, t: TraitId): boolean { return CLASSES[c.cls].traits.includes(t); }
/** Whether race or class keeps the condition off entirely. */
export function immuneTo(c: Character, k: Condition): boolean {
  return !!RACES[c.race].resist?.includes(k) || CLASSES[c.cls].traits.some((t) => TRAITS[t].immune?.includes(k));
}
/**
 * The elements a member takes half from (#555): those of what they wear, of a slotless item in
 * their own pack and of a blessing. Armour in the pack is not worn, and the bag is nobody's. In
 * ELEMENTS' order.
 */
export function resists(c: Character): Element[] {
  const worn = [c.equipment.weapon, c.equipment.armor, c.equipment.shield].filter((id): id is string => !!id);
  const ids = [...worn, ...c.pack.filter((id) => item(id).slot === 'none')];
  return ELEMENTS.filter((el) => ids.some((id) => item(id).resist?.includes(el)) || c.blessed.some((b) => b.element === el));
}
export function addCondition(c: Character, k: Condition): void {
  if (immuneTo(c, k)) return;
  if (!c.conditions.includes(k)) c.conditions.push(k);
}
export function removeCondition(c: Character, k: Condition): void { c.conditions = c.conditions.filter((x) => x !== k); }
/**
 * A cure's conditions lifted from a member, as a draught or Absolve lifts them: one turned to glass
 * comes back as it was, out cold if its wounds say so (#546). Whether stone was among those lifted.
 */
export function lift(c: Character, ks: readonly string[]): boolean {
  const stone = ks.includes('stoned') && hasCondition(c, 'stoned');
  for (const k of ks) removeCondition(c, k as Condition);
  if (stone && c.hp <= 0 && !hasCondition(c, 'dead')) addCondition(c, 'unconscious');
  return stone;
}
/**
 * What any temple asks to restore a member (#546 makes it the rule, not a town's): the dead 100 gold
 * a level, the stoned 80, any other condition 25, the well nothing.
 */
export function templePrice(c: Character): number {
  return hasCondition(c, 'dead') ? 100 * c.level : hasCondition(c, 'stoned') ? 80 * c.level : c.conditions.length ? 25 : 0;
}

/** The worst condition, for the party card. */
export function worstCondition(c: Character): Condition | null {
  for (const k of CONDITION_ORDER) if (c.conditions.includes(k)) return k;
  return null;
}

/** The barbarian's second prestige: it dies only at this (DESIGN §5). */
export const IRONHIDE_AT = -30;
/** The hit points a member dies at: -10, lower for Die Hard, lower still for an Ironhide. */
export function deathAt(c: Character): number {
  if (!hasTrait(c, 'die_hard')) return -10;
  return c.cls === 'barbarian' && prestigeOf(c) >= 2 ? IRONHIDE_AT : DIE_HARD_AT;
}

export function damage(c: Character, n: number): void {
  if (isDown(c)) return;
  c.hp -= n;
  const deadAt = deathAt(c);
  if (c.hp <= deadAt) { c.hp = deadAt; removeCondition(c, 'unconscious'); addCondition(c, 'dead'); }
  else if (c.hp <= 0) addCondition(c, 'unconscious');
  if (c.hp <= 0) { removeCondition(c, 'asleep'); }
}

/** What a healing spell of `base` restores when this caster casts it: its ranks lift the base (`rankMult`), and not the flat bonuses. */
export function spellHeal(caster: Character, base: number, step = RANK_STEP): number {
  return Math.round(base * rankMult(caster, step)) + bonus(caster.stats.personality) + (hasTrait(caster, 'healing_hands') ? HEALING_HANDS : 0);
}

export function heal(c: Character, n: number): number {
  if (hasCondition(c, 'dead') || hasCondition(c, 'stoned')) return 0;
  const before = c.hp;
  c.hp = Math.min(c.maxHp, c.hp + n);
  if (c.hp > 0) removeCondition(c, 'unconscious');
  return c.hp - before;
}

/**
 * A night at an inn that counts them (`nights`, Rime Lodge's): the first of its flags the company has
 * not set is set, so each stay is the next night, in order. The flag set, if any.
 */
export function stayNight(party: Party, nights: readonly string[] = []): string | undefined {
  const night = nights.find((n) => !party.flags[n]);
  if (night) party.flags[night] = 1;
  return night;
}

/** Full recovery, as an inn or a night's rest gives, and the end of a blessing kept to it. Does not raise the dead. */
export function rest(c: Character): void {
  delete c.riteSpent;
  c.blessed = c.blessed.filter((b) => !b.until);
  if (hasCondition(c, 'dead') || hasCondition(c, 'stoned')) return;
  c.hp = c.maxHp; c.sp = c.maxSp;
  c.conditions = c.conditions.filter((k) => k === 'poisoned' || k === 'diseased' || k === 'cursed');
}

/**
 * Level up as many times as the xp allows, up to `cap` (MAX_LEVEL in play; tools that look past today's
 * cap pass their own); returns how many levels were gained.
 */
export function levelUp(c: Character, rng: RngInstance, cap = MAX_LEVEL): number {
  let gained = 0;
  while (c.level < cap && c.xp >= xpForLevel(c.level + 1)) {
    c.level++; gained++;
    const cd = CLASSES[c.cls];
    // Each prestige taken adds its hit points and spell points to every level after it (DESIGN §5).
    const [php, psp] = PRESTIGE_POOLS[PRESTIGES[c.cls].calling].map((x) => x * prestigeOf(c));
    const hp = Math.max(1, rng.int(1, cd.hpDie) + bonus(c.stats.endurance)) + php;
    c.maxHp += hp; c.hp += hp;
    if (cd.spStat) {
      const sp = Math.max(1, rng.int(1, cd.spDie) + bonus(c.stats[cd.spStat])) + psp;
      c.maxSp += sp; c.sp += sp;
      // A new spell tier every two levels to tier 5 at level 8, then 6 and 7 at 15 and 23.
      const tier = spellTierAt(c.level, PRESTIGES[c.cls].calling === 'hybrid');
      for (const s of spellsFor(cd.spells!, tier)) if (!c.spells.includes(s.id)) c.spells.push(s.id);
    }
    // One stat point in the class's leaning, every other level.
    if (c.level % 2 === 0) {
      const s: Stat = cd.spStat ?? (c.cls === 'thief' || c.cls === 'monk' ? 'speed' : 'might');
      c.stats[s]++;
    }
  }
  return gained;
}

export function createParty(members: Character[]): Party {
  return { members, gold: 200, food: 30, bag: ['torch', 'potion_heal', 'potion_heal'], flags: {} };
}

/** The company's level, as the land judges it: its members' mean, the fallen too, rounded down. */
export function companyLevel(p: Party): number {
  return Math.floor(p.members.reduce((t, m) => t + m.level, 0) / Math.max(1, p.members.length));
}

/** Whether anyone standing can do the thing. */
export function partyCan(p: Party): { swim: boolean; climb: boolean; keys: number } {
  const up = p.members.filter((m) => !isDown(m));
  return {
    swim: up.some((m) => RACES[m.race].swim) || (p.flags.skill_swim ?? 0) > 0,
    climb: (p.flags.skill_mountaineer ?? 0) > 0,
    keys: countItem(p, 'key_iron'),
  };
}

export function countItem(p: Party, id: string): number {
  let n = p.bag.filter((x) => x === id).length;
  for (const m of p.members) n += m.pack.filter((x) => x === id).length;
  return n;
}

/** Remove one of an item from wherever the party carries it. */
export function takeItem(p: Party, id: string): boolean {
  let i = p.bag.indexOf(id);
  if (i >= 0) { p.bag.splice(i, 1); return true; }
  for (const m of p.members) { i = m.pack.indexOf(id); if (i >= 0) { m.pack.splice(i, 1); return true; } }
  return false;
}

export function allDown(p: Party): boolean { return p.members.every(isDown); }

/** The six that come with a new game: one of each class, so every system is exercised in the slice. */
export function defaultParty(rng: RngInstance): Party {
  const m = [
    createCharacter('Bram', 'human', 'knight', { might: 15, endurance: 14, accuracy: 12 }, rng),
    createCharacter('Idris', 'orcblood', 'paladin', { might: 13, personality: 13, endurance: 12 }, rng),
    createCharacter('Wren', 'elf', 'ranger', { accuracy: 14, speed: 13, intellect: 11 }, rng),
    createCharacter('Ottilie', 'gnome', 'thief', { speed: 15, luck: 13, accuracy: 12 }, rng),
    createCharacter('Maren', 'tidefolk', 'cleric', { personality: 15, endurance: 12 }, rng),
    createCharacter('Cassian', 'human', 'sorcerer', { intellect: 16, luck: 11, speed: 11 }, rng),
  ];
  return createParty(m);
}
