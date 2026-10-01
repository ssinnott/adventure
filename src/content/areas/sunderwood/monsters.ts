// Sunderwood's monsters, band 14-16: the Eaves, the Sunder and Lanternwood. `sprite` names the
// drawing (src/ui/sprites.ts); the numbers are the combat model's. A group on a map is a list of
// these ids, and any area's maps may place them.
// Drawn ahead of the area's first map, so src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings Sunderwood's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'pine_bear',
  'glass_spider',
  'sunder_hound',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the Eaves (#195, #196), a brute on MONSTERS §4.4's line at 14
  { id: 'pine_bear', name: 'Pine Bear', plural: 'Pine Bears', sprite: 'pine_bear', kind: 'beast', look: 'A bear, and then the rest of the bear.', level: 14, hp: 297, ac: 17, attack: 10, dice: 3, sides: 7, bonus: 6, speed: 8, xp: 1107, gold: [0, 0], tint: '#6b4a2e', size: 1.15 },
  // the Sunder's edge (#197, #198, #199), a controller on MONSTERS §4.4's line at 15: it paralyses, at 0.25 a hit
  { id: 'glass_spider', name: 'Glass Spider', plural: 'Glass Spiders', sprite: 'glass_spider', kind: 'beast', look: 'Threads of glass, and something walking them.', level: 15, hp: 143, ac: 19, attack: 9, dice: 3, sides: 5, bonus: 3, speed: 12, xp: 593, gold: [0, 0], inflict: { cond: 'paralysed', chance: 0.25 }, tint: '#23262e', size: 0.75 },
  // the Sunder (#196, #197, #198), a skirmisher on MONSTERS §4.4's line at 15: it paralyses, at 0.15 a hit; fire bites the Sunder's things, and cold does not
  { id: 'sunder_hound', name: 'Sunder Hound', plural: 'Sunder Hounds', sprite: 'sunder_hound', kind: 'rift', look: 'A rift hound, gone to glass.', level: 15, hp: 152, ac: 19, attack: 9, dice: 3, sides: 5, bonus: 2, speed: 15, xp: 593, gold: [0, 0], inflict: { cond: 'paralysed', chance: 0.15 }, weak: ['fire'], immune: ['cold'], tint: '#2c2f38', size: 0.72 },
];
