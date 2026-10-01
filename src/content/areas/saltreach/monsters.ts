// Saltreach's monsters, band 10-12: the Long Water, the Delta's fen and the Drowned Temples, the
// salt pans and Saltmouth. `sprite` names the drawing (src/ui/sprites.ts); the numbers are the
// combat model's. A group on a map is a list of these ids, and any area's maps may place them.
// Drawn ahead of the area's first map, so src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings Saltreach's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'bargeman', 'barge_master',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  { id: 'bargeman', name: 'Bargeman', plural: 'Bargemen', sprite: 'bargeman', kind: 'person', look: 'A barge pole, a knife, and no questions.', level: 10, hp: 90, ac: 16, attack: 7, dice: 2, sides: 6, bonus: 3, speed: 11, xp: 393, gold: [12, 35], tint: '#6e7c86', size: 0.92 },
  { id: 'barge_master', name: 'Barge Master', plural: 'Barge Masters', sprite: 'barge_master', kind: 'person', look: 'A ledger in one hand and a cudgel in the other.', level: 11, hp: 95, ac: 17, attack: 7, dice: 1, sides: 10, bonus: 4, speed: 11, xp: 433, gold: [40, 100], tint: '#3a3e52', size: 1.0 },
];
