// The fight's state (#1007, cut from game/combat.ts): its types, the rank sizes and what the buffs
// are worth, the odds both sides share, the dice and the small questions of a state (who stands,
// whether the front does, who leads, how the log names monsters). The other parts take what they
// share from here, not from combat.ts, which takes them: that would be a cycle.
import type { RngInstance } from '../../lib/engine/rng.ts';
import type { MonsterDef } from '../monsters.ts';
import type { Element } from '../spells.ts';
import type { Character, Condition } from '../party.ts';
import type { Tables } from '../tables.ts';

export interface MonsterInst {
  def: MonsterDef;
  hp: number;
  /** Its rank of its group: a group's front and back are each a group of the fight's (`Ranks`). */
  group: number;
  /** The group on the map it came in with: the index into `groupIds`. */
  band: number;
  /** In the back rank: a weapon of the front row reaches it only once the fight's front is down. */
  back: boolean;
  /** Broke and left the fight (`morale`): no longer in it, and paying nothing. */
  fled: boolean;
  /** Under the ice with its group (`Ranks`): its blows reach only the front row. */
  under?: 'ice';
  conditions: Condition[];
  /** Ticks of white a blow leaves: set to 2 when it lands and taken down by one at the end of each tick of the combat screen, so it shows for the one tick after, at any refresh. */
  flash: number;
  /** One that mends (`MonsterDef.regen`) took fire this round, and will not mend at its end (`regenerate`). */
  burnt?: boolean;
  /** The thief's Blind (#1113): the rounds left on it, its to-hit BLIND_HIT less (`monsterHit`). */
  blind?: number;
  /** The thief's Hamstring (#1113): the rounds left on its hold (`paralysed`), which does not tear free before they are out. */
  hamstrung?: number;
}

export type TurnRef = { side: 'party'; i: number } | { side: 'monster'; i: number };

export type PartyAction =
  | { type: 'attack'; target: number }
  | { type: 'cast'; spellId: string; target: number; element?: Element; from?: string }
  | { type: 'defend' }
  | { type: 'use'; itemId: string; target: number }
  | { type: 'flee' }
  | { type: 'feat'; featId: string; target: number };

/**
 * How a feat's blows differ from an Attack's (#1113; combat/feats.ts): so many blows, sure to land,
 * so many times the damage, every one a crit or none (no chance drawn either way), and the feat's
 * mark after the hit's sentence; every one a sneak attack, the first aimed past the front rank, and what
 * a blow does to a foe it lands on and leaves standing, its words after the mark. Unset, each is the
 * Attack's.
 */
export interface Strike { blows?: number; sure?: boolean; times?: number; crits?: boolean; mark?: string; sneak?: boolean; past?: boolean; onLand?: (m: MonsterInst) => string }

type Outcome = 'ongoing' | 'victory' | 'defeat' | 'fled';

/**
 * `xp` is what the kills were worth before the split, each by the monster's level against a
 * member's (`killPay`), and `shares` what each living member took, in party order: one share for all
 * where all are of one level. `ready` names who now has the experience to train a level (levels are
 * bought at a trainer).
 */
export interface Loot { xp: number; shares: number[]; gold: number; items: string[]; ready: string[]; }

export interface CombatState {
  /** The tables the fight reads, from `startCombat` (#973). */
  readonly tables: Tables;
  monsters: MonsterInst[];
  groupIds: string[];
  /** Each group's leader, by monster id, as `groupIds` lists them (`Ranks`). */
  leaders: (string | undefined)[];
  /**
   * The fight's clock (`Clock`), from the group that carries it (`band`): the steps the light has
   * dimmed and the one group its calls stand in.
   */
  clock?: Clock & { band: number; dim: number; into?: number };
  round: number;
  order: TurnRef[];
  turn: number;
  /** The company's members down as the fight began: the game's bot flees only once another falls (#723). */
  downAtStart?: number;
  /** Rounds left on each party buff: Bless (+to-hit), Ward (+AC), Haste (+speed and +to-hit). */
  bless: number;
  shield: number;
  haste: number;
  /** Lampglass: the element the party takes half from, and the rounds left on it. */
  glass?: { element: Element; rounds: number };
  /** Rounds left on Bless and Ward over each group of monsters, by the group it came in with (`band`). */
  foeBless: number[];
  foeShield: number[];
  /**
   * What the company has seen each element do to each kind of monster, by its id: the share of a
   * spell's damage, or of a blow's element die, it took (`elementMult`). A bot learns from it; a
   * player from the log.
   */
  seen: Record<string, Partial<Record<Element, number>>>;
  /** The most the company has seen each kind of monster mend at a round's end, by its id (`regen`). A bot learns from it. */
  mends?: Record<string, number>;
  defending: boolean[];
  /** To-hit lost by bows, slings and crossbows on both sides: the weather (see weather.ts). */
  rangedPenalty: number;
  /** The level damage spells stop growing at, where a tool tries another: SPELLS_GROW_TO in play (see `spellDice`). */
  spellsGrowTo?: number;
  /** What a spell rank adds, where a tool tries another: RANK_STEP in play (see `rankMult`). */
  rankStep?: number;
  /** Whether a blow may crit: CRITS_ON in play, false where a tool or a suite turns crits off (see `critChance`). */
  crits?: boolean;
  /** Whether the feats are on: FEATS_ON in play, false where a tool or a suite turns them off (see combat/feats.ts). */
  feats?: boolean;
  /** Each member's stamina, by its slot, while the feats are on; none else, and none past the fight (#1113). */
  stamina?: number[];
  /** The knight's Challenge (#1113): the member who made it, the group (`MonsterInst.group`) it holds and the rounds left. */
  challenge?: { by: number; group: number; rounds: number };
  /** Rounds left on the knight's Rally (#1113): the front row's to-hit (`RALLY_HIT`). */
  rally?: number;
  /** The barbarian's (#1113): rounds left on each member's Frenzy and Deathless, by slot; the groups (`MonsterInst.group`) a War Cry marked. */
  frenzy?: number[];
  deathless?: number[];
  cried?: number[];
  /** What a tool trying new powers gives each member: none in play (see `Edge`). */
  edge?: (c: Character, s: CombatState) => Edge;
  log: string[];
  outcome: Outcome;
  loot: Loot | null;
}

/**
 * Where the fight happens, as far as the resolver cares: the weather's toll on missiles, and its line
 * for the log. A tool trying a ceiling on spells may also say where they stop growing, one trying
 * new powers for the company what each member gains, and one trying crits or feats before play has
 * them whether blows crit and feats are on.
 */
export interface CombatOpts { rangedPenalty?: number; note?: string; spellsGrowTo?: number; rankStep?: number; crits?: boolean; feats?: boolean; edge?: (c: Character, s: CombatState) => Edge; }

/**
 * What a tool trying new powers gives a member in a fight (tools/harness.ts): blows a turn with a
 * weapon, damage added to each, and armour. Play gives none: one blow, nothing added.
 */
export interface Edge { blows: number; damage: number; ac: number }

/**
 * How a group stands (docs/MONSTERS.md §3.3): the last `back` of its monsters in the back rank, and
 * the monster id of its leader, whose fall breaks the fight's people (`morale`). `under` is a group
 * that fights from under the ice, reaching one square: the front row over it, never the back. `clock`
 * is the Core's (`Clock`).
 */
interface Ranks { back?: number; leader?: string; under?: 'ice'; clock?: Clock }

/**
 * The Core's clock (docs/MONSTERS.md §9.3, #748): while a monster the `panel` names stands, the
 * group's leader calls one of `calls` every `every` rounds, on the beat at no cost of a turn and never
 * on its own chance (`beat`), and the light dims a step a round to `dims`, where it holds at a thread
 * (`dim`). The panel down, the calling stops and the light holds where it is. The light never ends a
 * fight.
 */
export interface Clock { calls: string | MonsterDef; every: number; dims: number; panel: readonly string[] }

/** A group as a fight takes it. Its monsters by id; a tool may hand in defs that no map places (tools/harness.ts). */
export interface CombatGroup extends Ranks { id: string; monsters: readonly (string | MonsterDef)[] }

/** What a tool fights: a group's monsters, or the group with its ranks. */
export type Fighters = readonly (string | MonsterDef)[] | (Ranks & { monsters: readonly (string | MonsterDef)[] });

/** The group a tool's fighters make, under `id`. */
export const asGroup = (id: string, f: Fighters): CombatGroup => ('monsters' in f ? { id, monsters: f.monsters, back: f.back, leader: f.leader, under: f.under, ...(f.clock ? { clock: f.clock } : {}) } : { id, monsters: f });

export const FRONT_ROW = 3;
/**
 * The most a fight ever holds, those down counted: twelve monsters in three groups (DESIGN §6). A call
 * keeps to it (`canCall`); the clock's keep to twelve and pass the three, into one group (`beat`).
 */
export const MAX_MONSTERS = 12, MAX_GROUPS = 3;

/** What the buffs are worth while they last. */
export const BLESS_HIT = 2, HASTE_HIT = 1, HASTE_SPEED = 8, WARD_AC = 3;
/** And the knight's Rally on the front row's (#1113). */
export const RALLY_HIT = 2;
/** And the thief's Blind off a foe's (#1113). */
export const BLIND_HIT = 4;

/** Monsters as the log names them: "Bandit", "3 Bandits, Bandit Archer". */
export function describe(ms: readonly MonsterInst[]): string {
  const counts = new Map<string, { def: MonsterDef; n: number }>();
  for (const m of ms) { const c = counts.get(m.def.id); if (c) c.n++; else counts.set(m.def.id, { def: m.def, n: 1 }); }
  return [...counts.values()].map(({ def, n }) => n === 1 ? def.name : `${n} ${def.plural}`).join(', ');
}

/** The chance a to-hit bonus has against an armour class, for either side. */
export function toHit(bonusValue: number, targetAc: number): number {
  const p = 0.65 + (bonusValue - (targetAc - 10)) * 0.05;
  return Math.max(0.05, Math.min(0.95, p));
}

export function roll(rng: RngInstance, dice: number, sides: number, plus: number): number {
  let n = plus;
  for (let i = 0; i < dice; i++) n += rng.int(1, sides);
  return Math.max(0, n);
}

/** Still in the fight: alive, and not fled. */
export const standing = (m: MonsterInst): boolean => m.hp > 0 && !m.fled;

/** Whether any of the fight's front rank stands: while one does, the back is out of a blade's reach. */
export const frontStands = (s: CombatState): boolean => s.monsters.some((m) => standing(m) && !m.back);

/** Whether the monster leads its group (`Ranks`). */
export const isLeader = (s: CombatState, m: MonsterInst): boolean => s.leaders[m.band] === m.def.id;

export function aliveMonsters(s: CombatState): number[] {
  const out: number[] = [];
  s.monsters.forEach((m, i) => { if (standing(m)) out.push(i); });
  return out;
}

/** The chance Grasping Roots holds each one it falls on, and the chance a round each held monster tears free. */
export const ROOTS_CHANCE = 0.5, HOLD_BREAKS = 0.35;

/** The chance Slumber puts each one it falls on to sleep, cast by either side. */
export const SLUMBER_CHANCE = 0.7;
