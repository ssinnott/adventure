// Saltreach's monsters, band 10-12: the Long Water, the Delta's fen and the Drowned Temples, the
// salt pans and Saltmouth. `sprite` names the drawing (src/ui/sprites.ts); the numbers are the
// combat model's. A group on a map is a list of these ids, and any area's maps may place them.
// Drawn ahead of the area's first map, so src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings Saltreach's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'fen_eel',
  'fen_toad',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the river and the fen's water (#261), a skirmisher on MONSTERS §4.4's line at 10
  { id: 'fen_eel', name: 'Fen Eel', plural: 'Fen Eels', sprite: 'fen_eel', kind: 'beast', look: "A back as thick as a man's leg, turning in the reeds.", level: 10, hp: 89, ac: 16, attack: 7, dice: 2, sides: 6, bonus: 3, speed: 15, xp: 393, gold: [0, 0], tint: '#3c4228', size: 0.75 },
  // the Delta (#223), a controller on MONSTERS §4.4's line at 10: its sweat poisons
  { id: 'fen_toad', name: 'Fen Toad', plural: 'Fen Toads', sprite: 'fen_toad', kind: 'beast', look: 'A toad the size of a sheep, its skin weeping.', level: 10, hp: 87, ac: 16, attack: 7, dice: 2, sides: 6, bonus: 3, speed: 12, xp: 393, gold: [0, 0], inflict: { cond: 'poisoned', chance: 0.3 }, tint: '#5e5a32', size: 0.6 },
];
