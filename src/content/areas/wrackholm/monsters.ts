// Wrackholm's monsters, band 12-14: the smugglers' isle, Kelp Hole and the Tide Ship. `sprite` names
// the drawing (src/ui/sprites.ts); the numbers are the combat model's. A group on a map is a list of
// these ids, and any area's maps may place them. Drawn ahead of the area's first map, so
// src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings Wrackholm's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'devilfish', 'great_devilfish',
  'overseer',
  'tide_elder',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the cove's pools and under the ship (#188, #190), a controller on MONSTERS §4.4's line at 13: it reaches the back row, and holds
  { id: 'devilfish', name: 'Devilfish', plural: 'Devilfish', sprite: 'devilfish', kind: 'beast', look: 'Arms, coming up over the side.', level: 13, hp: 97, ac: 18, attack: 8, dice: 2, sides: 6, bonus: 2, speed: 12, xp: 513, gold: [0, 0], ranged: true, inflict: { cond: 'paralysed', chance: 0.2 }, tint: '#7a3a30', size: 1.0 },
  // the sea cave at Kelp Hole's back (#188), the area's boss at 14 on MONSTERS §4.4's boss line; it keeps the family's reach and hold
  { id: 'great_devilfish', name: 'Great Devilfish', plural: 'Great Devilfish', sprite: 'great_devilfish', kind: 'beast', look: 'What the smugglers feed.', level: 14, hp: 621, ac: 20, attack: 11, dice: 12, sides: 8, bonus: 12, speed: 13, xp: 8853, gold: [0, 0], ranged: true, inflict: { cond: 'paralysed', chance: 0.2 }, immune: ['asleep'], tint: '#a8928a', size: 1.9 },
  // the cove's chained and the hold's rows (#188, #190), a controller on MONSTERS §4.4's line at 13: the chain holds
  { id: 'ashen_overseer', name: 'Ashen Overseer', plural: 'Ashen Overseers', sprite: 'overseer', kind: 'person', steady: true, look: 'Grey to the wrist, and a chain in each hand.', level: 13, hp: 97, ac: 18, attack: 8, dice: 2, sides: 6, bonus: 2, speed: 12, xp: 513, gold: [20, 50], inflict: { cond: 'paralysed', chance: 0.25 }, tint: '#4a4248', size: 0.95 },
  // the Tide Ship's forward hold (#190), an elite on MONSTERS §4.4's line at 13: it paralyses
  { id: 'tide_elder', name: 'Tide Elder', plural: 'Tide Elders', sprite: 'tide_elder', kind: 'rift', look: 'A shard of the sea, stood up.', level: 13, hp: 234, ac: 18, attack: 9, dice: 3, sides: 8, bonus: 3, speed: 15, xp: 1027, gold: [0, 0], tint: '#2e8a78', size: 0.95, inflict: { cond: 'paralysed', chance: 0.15 } },
];
