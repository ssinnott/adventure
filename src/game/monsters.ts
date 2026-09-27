// What a monster is. The monsters themselves are content, each area's in
// src/content/areas/<area>/monsters.ts. `sprite` names the vector drawing in ui/sprites.ts; the
// numbers are the combat model's. A group on a map is a list of these ids (see map.ts).
import { MONSTERS } from '../content/index.ts';
import type { MonsterSprite } from '../content/index.ts';

export type { MonsterSprite };

export interface MonsterDef {
  id: string;
  name: string;
  plural: string;
  sprite: MonsterSprite;
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
  /** Immune to sleep and such. */
  mindless?: boolean;
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
