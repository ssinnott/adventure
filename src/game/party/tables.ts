// The party's tables (#1020, cut from game/party.ts): the stats, the peoples, the classes and their
// traits with what the numeric ones are worth, the prestiges with their levels, prices and pools,
// the conditions and those a ward may keep off, the shapes of a member and a company (`Character`,
// `Party`), what a member is called and its spell rank, and the small sums a member and a level are
// made of (`bonus`, `xpForLevel`, the caps, what a tier is worth, a kill's pay, the creation
// screen's names and its roll). It takes types alone, so it loads nothing: the other parts and
// party.ts take their shapes and figures from here.
import type { RngInstance } from '../../lib/engine/rng.ts';
import type { ItemDef } from '../items.ts';
import type { SpellList, Element } from '../spells.ts';
import type { SkillId } from '../skills.ts';
import type { Tier, Tiers } from '../mastery.ts';

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

/** What the numeric traits are worth; combat/perks.ts, combat/casting.ts and armorClass read these. */
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
  sneak_attack:  { id: 'sneak_attack', name: 'Sneak Attack', text: `+${SNEAK_ATTACK_DMG} damage to a foe in its first round, before its turn; the Tumbler adds 2 more every two levels past 10.` },
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
  elf:      { id: 'elf', name: 'Elf', mods: { intellect: 3, accuracy: 2, might: -2, endurance: -1 }, blurb: 'Keen. Innate perception.' },
  gnome:    { id: 'gnome', name: 'Gnome', mods: { luck: 3, personality: 1, might: -2 }, blurb: 'Lucky. Finds secrets sooner.' },
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

export type Condition = 'asleep' | 'poisoned' | 'diseased' | 'paralysed' | 'cursed' | 'stoned' | 'unconscious' | 'dead';
export const CONDITION_ORDER: readonly Condition[] = ['dead', 'stoned', 'unconscious', 'paralysed', 'asleep', 'poisoned', 'diseased', 'cursed'];
/** The conditions an artifact's ward may keep off (`ItemDef.ward`, DESIGN §9): any but unconscious and dead. */
export const WARDABLE: readonly Condition[] = CONDITION_ORDER.filter((k) => k !== 'dead' && k !== 'unconscious');

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
  /** The tiers at arms and in magic (game/mastery.ts; DESIGN §5); absent in a save from before them, which is none. */
  tiers?: Tiers;
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
  /**
   * The castings of each artifact's spell spent since the last dawn, by the artifact's id (#847,
   * `ItemDef.casts`): the artifact's, whoever bears it. Absent when none is, and in a save from before.
   */
  spent?: Record<string, number>;
}

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

/** What a spell rank adds to a damage spell's dice and a mending spell's heal (DESIGN §7): 15%, 45% by the third. */
export const RANK_STEP = 0.15;

/** What a tier at arms adds to a member's to-hit and to each of its blows (DESIGN §5): in all, not on top. */
export const TIER_ARMS: Readonly<Record<Tier, number>> = { expert: 1, master: 2 };
/** The rank steps a tier in magic adds to a member's spells (DESIGN §7 Ranks): its costs and the rest are untouched. */
export const TIER_STEPS: Readonly<Record<Tier, number>> = { expert: 1, master: 2 };

/**
 * What a kill pays a member, as a share of the monster's xp, by the monster's level against theirs
 * (EXPANSION §5.2): a tenth at three or more under, up to half again at three or more over.
 */
export const KILL_PAY: Readonly<Record<number, number>> = { [-3]: 0.1, [-2]: 0.4, [-1]: 0.7, 0: 1, 1: 1.15, 2: 1.3, 3: 1.5 };

/** The most letters a member's name may have (ui/create.ts): what a line that names a member is measured with. */
export const NAME_MAX = 10;

/** Nothing, or armour of a robe's own armour class: a plus does not make a robe armour. */
export const robeLike = (d: ItemDef | undefined): boolean => (d?.ac ?? 0) - (d?.plus ?? 0) <= 1;

/** The barbarian's second prestige: it dies only at this (DESIGN §5). */
export const IRONHIDE_AT = -30;

/** The names the creation screen offers, of which a company drawn at random takes six. */
export const SUGGESTED = ['Bram', 'Idris', 'Wren', 'Ottilie', 'Maren', 'Cassian', 'Tamsin', 'Hollis', 'Aveline', 'Rook', 'Sable', 'Piran'];

/** A member's stats as the creation screen rolls them: 8 and two d4 each. */
export function rollStats(rng: RngInstance): Stats {
  const s = {} as Stats;
  for (const k of STATS) s[k] = 8 + rng.int(1, 4) + rng.int(1, 4);
  return s;
}
