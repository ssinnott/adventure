// Saltreach's monsters, band 10-12: the Long Water, the Delta's fen and the Drowned Temples, the
// salt pans and Saltmouth. `sprite` names the drawing (src/ui/sprites.ts); the numbers are the
// combat model's. A group on a map is a list of these ids, and any area's maps may place them.
// Drawn ahead of the area's first map, so src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings Saltreach's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'brineling',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  { id: 'brineling', name: 'Brineling', plural: 'Brinelings', sprite: 'brineling', kind: 'rift', look: 'Green glass, walking, with a light in it.', level: 10, hp: 89, ac: 16, attack: 7, dice: 2, sides: 6, bonus: 3, speed: 15, xp: 393, gold: [0, 0], tint: '#3a9a82', size: 0.72, inflict: { cond: 'paralysed', chance: 0.1 } },
];
