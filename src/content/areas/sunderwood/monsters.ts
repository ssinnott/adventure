// Sunderwood's monsters, band 14-16: the Eaves, Lanternwood and the Sunder between them.
// `sprite` names the drawing (src/ui/sprites.ts); the numbers are the combat model's. A group on a
// map is a list of these ids, and any area's maps may place them.
// Drawn ahead of the area's first map, so src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings Sunderwood's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'sunderling', 'sunder_warden',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the Sunder's black glass (#198, #199), a skirmisher on MONSTERS §4.4's line at 14
  { id: 'sunderling', name: 'Sunderling', plural: 'Sunderlings', sprite: 'sunderling', kind: 'rift', look: 'Black glass, with a white light inside.', level: 14, hp: 145, ac: 18, attack: 9, dice: 3, sides: 5, bonus: 2, speed: 15, xp: 553, gold: [0, 0], tint: '#2c2e38', size: 0.74, inflict: { cond: 'paralysed', chance: 0.1 } },
  // the gorge above the wall (#199), the area's boss at 16
  { id: 'sunder_warden', name: 'Warden of the Sunder', plural: 'Wardens of the Sunder', sprite: 'sunder_warden', kind: 'rift', look: 'The Sunder\'s own knot, and it has held for centuries.', level: 16, hp: 764, ac: 21, attack: 12, dice: 14, sides: 8, bonus: 16, speed: 13, xp: 10133, gold: [0, 0], immune: ['asleep'], tint: '#2a2a34', size: 1.35 },
];
