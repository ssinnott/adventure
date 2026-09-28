// What a monster is. The monsters themselves are content, each area's in
// src/content/areas/<area>/monsters.ts. `sprite` names the vector drawing in ui/sprites.ts; the
// numbers are the combat model's. A group on a map is a list of these ids (see map.ts).
import { MONSTERS } from '../content/index.ts';
import type { MonsterSprite } from '../content/index.ts';
import type { Condition } from './party.ts';

export type { MonsterSprite };

/** What a monster is (docs/MONSTERS.md §2), which says what works on it; KINDS has what each sets. */
export type MonsterKind = 'beast' | 'person' | 'dead' | 'rift' | 'machine';

export interface KindDef {
  /** Conditions the whole kind shrugs off. */
  immune: readonly Condition[];
  /** Holy Strike bites. */
  holy: boolean;
}

/** Each kind's defaults, the ones the combat model has so far; the rest of MONSTERS §2 comes with #18 and #20. */
export const KINDS: Record<MonsterKind, KindDef> = {
  beast:   { immune: [], holy: false },
  person:  { immune: [], holy: false },
  dead:    { immune: ['asleep'], holy: true },
  rift:    { immune: [], holy: false },
  machine: { immune: ['asleep'], holy: false },
};

export interface MonsterDef {
  id: string;
  name: string;
  plural: string;
  sprite: MonsterSprite;
  kind: MonsterKind;
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
  /** Chance per hit to inflict the condition. */
  inflict?: { cond: 'poisoned' | 'diseased' | 'asleep' | 'paralysed'; chance: number };
  /** Gold dropped per monster, as a range. */
  gold: [number, number];
  drops?: readonly { item: string; chance: number }[];
  /** Conditions it shrugs off beyond its kind's, as the slime and the wardens do sleep. */
  immune?: readonly Condition[];
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
