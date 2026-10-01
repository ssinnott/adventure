// Sunderwood's monsters, band 14-16: the Eaves, the Sunder and Lanternwood. `sprite` names the
// drawing (src/ui/sprites.ts); the numbers are the combat model's. A group on a map is a list of
// these ids, and any area's maps may place them.
// Drawn ahead of the area's first map, so src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings Sunderwood's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'pine_bear',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the Eaves (#195, #196), a brute on MONSTERS §4.4's line at 14
  { id: 'pine_bear', name: 'Pine Bear', plural: 'Pine Bears', sprite: 'pine_bear', kind: 'beast', look: 'A bear, and then the rest of the bear.', level: 14, hp: 293, ac: 17, attack: 10, dice: 3, sides: 8, bonus: 6, speed: 8, xp: 1107, gold: [0, 0], tint: '#6b4a2e', size: 1.15 },
];
