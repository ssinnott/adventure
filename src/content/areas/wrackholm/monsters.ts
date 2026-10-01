// Wrackholm's monsters, band 12-14: the smugglers' isle, Kelp Hole and the Tide Ship. `sprite` names
// the drawing (src/ui/sprites.ts); the numbers are the combat model's. A group on a map is a list of
// these ids, and any area's maps may place them. Drawn ahead of the area's first map, so
// src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings Wrackholm's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'devilfish',
  'wrack_gull',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the cove's pools and under the ship (#188, #190), a controller on MONSTERS §4.4's line at 13: it reaches the back row, and holds
  { id: 'devilfish', name: 'Devilfish', plural: 'Devilfish', sprite: 'devilfish', kind: 'beast', look: 'Arms, coming up over the side.', level: 13, hp: 97, ac: 18, attack: 8, dice: 2, sides: 6, bonus: 2, speed: 12, xp: 513, gold: [0, 0], ranged: true, inflict: { cond: 'paralysed', chance: 0.2 }, tint: '#7a3a30', size: 1.0 },
  // the moor and the cliffs (#187, #189), fodder on MONSTERS §4.4's line at 12, eight to a group: it flies, so it reaches the back row
  { id: 'wrack_gull', name: 'Wrack Gull', plural: 'Wrack Gulls', sprite: 'wrack_gull', kind: 'beast', look: 'A thousand gulls, and all of them angry.', level: 12, hp: 63, ac: 16, attack: 7, dice: 3, sides: 5, bonus: 3, speed: 12, xp: 237, gold: [0, 0], ranged: true, tint: '#ecebe6', size: 0.38 },
];
