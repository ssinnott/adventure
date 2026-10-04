// What a monster is. The monsters themselves are content, each area's in
// src/content/areas/<area>/monsters.ts. `sprite` names the vector drawing in ui/sprites.ts; the
// numbers are the combat model's. A group on a map is a list of these ids (see map.ts).
import { MONSTERS } from '../content/index.ts';
import type { MonsterSprite } from '../content/index.ts';
import type { Condition } from './party.ts';
import { spell } from './spells.ts';
import type { Element, SpellDef } from './spells.ts';

export type { MonsterSprite };

/** What a monster is (docs/MONSTERS.md §2), which says what works on it; KINDS has what each sets. */
export type MonsterKind = 'beast' | 'person' | 'dead' | 'rift' | 'machine';

export interface KindDef {
  /** Conditions and elements the whole kind shrugs off. */
  immune: readonly (Condition | Element)[];
  /** Elements that do it half (`elementMult`). */
  resist?: readonly Element[];
  /** Elements that do it half again. */
  weak?: readonly Element[];
  /** Holy Strike bites. */
  holy: boolean;
  /** When it leaves a fight: at its leader's fall, once three in four of its group are down, or never (combat.ts `morale`). */
  breaks: 'leader' | 'rout' | 'never';
}

/**
 * Each kind's defaults, the ones the combat model has so far: holy light bites the dead and lightning
 * the machine, and the swarm does nothing to either nor the Hearth's light to a machine. A beast's
 * or the Rift's elements are its own (MONSTERS §2, §2.1).
 */
export const KINDS: Record<MonsterKind, KindDef> = {
  beast:   { immune: [], holy: false, breaks: 'rout' },
  person:  { immune: [], holy: false, breaks: 'leader' },
  dead:    { immune: ['asleep', 'nature'], weak: ['holy'], holy: true, breaks: 'never' },
  rift:    { immune: [], holy: false, breaks: 'never' },
  machine: { immune: ['asleep', 'holy', 'nature'], weak: ['lightning'], holy: false, breaks: 'never' },
};

export interface MonsterDef {
  id: string;
  name: string;
  plural: string;
  sprite: MonsterSprite;
  kind: MonsterKind;
  /**
   * What it is, in one sentence: the line the log says the first time a company sees one, and the
   * brief its drawing answers (docs/MONSTERS.md §1).
   */
  look?: string;
  /**
   * The party level it is met at: within two of the band of every map that places it, and rising
   * from a map's way in to its far end (src/content/progression.ts, tools/tests/curve.ts). It
   * changes no combat yet; paying a kill by it is #18's.
   */
  level: number;
  hp: number;
  ac: number;
  /** To-hit bonus. */
  attack: number;
  dice: number; sides: number; bonus: number;
  speed: number;
  xp: number;
  /** Ranged monsters can hit the back row from the start. */
  ranged?: boolean;
  /** Shoots bows rather than casting, so bad weather spoils the aim. */
  missile?: boolean;
  /** Chance per hit to inflict the condition: a curse the wights' (#537), which outlasts the fight. */
  inflict?: { cond: 'poisoned' | 'diseased' | 'asleep' | 'paralysed' | 'cursed'; chance: number };
  /** Gold dropped per monster, as a range. */
  gold: [number, number];
  drops?: readonly { item: string; chance: number }[];
  /** Conditions and elements it shrugs off beyond its kind's, as the slime and the wardens do sleep and the brineling cold. */
  immune?: readonly (Condition | Element)[];
  /** Elements that do it half, beyond its kind's (`elementMult`). */
  resist?: readonly Element[];
  /** Elements that do it half again, beyond its kind's: lightning the brineling. */
  weak?: readonly Element[];
  /**
   * Spells from the tables it may spend a turn on, the first it can use (`castable`), at `chance` a
   * turn: at its own level held to SPELLS_GROW_TO, unranked (DESIGN §7). The drowned chanter's Slumber.
   */
  cast?: { spells: readonly string[]; chance: number };
  /** Its hits heal it by their damage ('hp', the leech), or take spell points before hit points ('sp', the bog light). */
  drain?: 'hp' | 'sp';
  /**
   * Hit points it mends at each round's end, never past its own, unless fire burnt it that round: the
   * trolls (#537). One felled stays down. MONSTERS §3.3 sizes it.
   */
  regen?: number;
  /**
   * A group it may spend a turn bringing into the fight, at `chance` a turn, while the fight has room
   * for the whole of it under the cap of 12 monsters in three groups, those already down counted
   * (combat.ts `canCall`): the tallyman's knockers, Vask's sentries (#537). By id; a tool may hand in defs.
   */
  calls?: { monsters: readonly (string | MonsterDef)[]; chance: number };
  /** Never breaks, whatever its kind: the Hand (docs/MONSTERS.md §2). */
  steady?: boolean;
  /** Tint of the sprite. */
  tint: string;
  /** Sprite height relative to a wall (1 = a full cell). */
  size: number;
}

export function monster(id: string): MonsterDef {
  const d = MONSTERS[id];
  if (!d) throw new Error(`unknown monster '${id}'`);
  return d;
}

/** Whether its kind or its own nature keeps the condition off. */
export function monsterImmune(d: MonsterDef, k: Condition): boolean {
  return KINDS[d.kind].immune.includes(k) || !!d.immune?.includes(k);
}

/** What resisting an element leaves of a spell's damage, and what a weakness adds to it. */
export const RESIST = 0.5, WEAK = 1.5;

/**
 * What an element does to it, as a share of a spell's damage: none where its kind or it is immune,
 * half where either resists, half again where either is weak, else whole. No element is whole.
 */
export function elementMult(d: MonsterDef, el: Element | undefined): number {
  if (!el) return 1;
  const k = KINDS[d.kind];
  if (k.immune.includes(el) || d.immune?.includes(el)) return 0;
  if (k.resist?.includes(el) || d.resist?.includes(el)) return RESIST;
  if (k.weak?.includes(el) || d.weak?.includes(el)) return WEAK;
  return 1;
}

/**
 * A spell's damage on it, rolled: none, half rounded up (never nothing), half again rounded down, or
 * whole. A caster who `pierces` (the sorcerer's third rank) passes a resistance, never an immunity.
 */
export function elementDamage(d: MonsterDef, el: Element | undefined, dmg: number, pierces = false): number {
  const m = elementMult(d, el), mult = pierces && m === RESIST ? 1 : m;
  return mult === 0 ? 0 : mult === RESIST ? Math.ceil(dmg / 2) : mult === WEAK ? dmg + Math.floor(dmg / 2) : dmg;
}

/**
 * Whether a monster can cast the spell (`MonsterDef.cast`): a mend on one of its group or all of it,
 * Bless or Ward on its group, a damage spell, or Slumber on a row. Haste, cures, raising and the map
 * spells are the party's.
 */
export function monsterCanCast(sp: SpellDef): boolean {
  if (sp.context === 'explore' || sp.raise || sp.cure) return false;
  if (sp.heal) return sp.target === 'ally' || sp.target === 'party';
  if (sp.buff) return sp.buff === 'bless' || sp.buff === 'shield';
  if (sp.inflict) return sp.inflict === 'asleep' && sp.target === 'group';
  return !!sp.dice && (sp.target === 'enemy' || sp.target === 'group' || sp.target === 'all');
}

/** The spells a monster names, every one of which it can cast; throws on one it cannot. */
export function monsterSpells(d: MonsterDef): SpellDef[] {
  return (d.cast?.spells ?? []).map((id) => {
    const sp = spell(id);
    if (!monsterCanCast(sp)) throw new Error(`${d.id} cannot cast '${id}'`);
    return sp;
  });
}
