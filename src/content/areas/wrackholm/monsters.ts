// Wrackholm's monsters, band 12-14: the smugglers' isle, Kelp Hole and the Tide Ship. `sprite` names
// the drawing (src/ui/sprites.ts); the numbers are the combat model's. A group on a map is a list of
// these ids, and any area's maps may place them. Drawn ahead of the area's first map, so
// src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings Wrackholm's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'devilfish', 'great_devilfish',
  'overseer',
  'wrack_smuggler', 'wrack_bowman',
  'bilge_rat',
  'wrack_gull',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the cove's pools and under the ship (#188, #190), a controller on MONSTERS §4.4's line at 13: it reaches the back row, and holds
  { id: 'devilfish', name: 'Devilfish', plural: 'Devilfish', sprite: 'devilfish', kind: 'beast', look: 'Arms, coming up over the side.', level: 13, hp: 136, ac: 18, attack: 8, dice: 2, sides: 8, bonus: 4, speed: 12, xp: 513, gold: [0, 0], ranged: true, inflict: { cond: 'paralysed', chance: 0.2 }, tint: '#7a3a30', size: 1.0 },
  // the sea cave at Kelp Hole's back (#188), the area's boss at 14 on MONSTERS §4.4's boss line; it keeps the family's reach and hold
  { id: 'great_devilfish', name: 'Great Devilfish', plural: 'Great Devilfish', sprite: 'great_devilfish', kind: 'beast', look: 'What the smugglers feed.', level: 14, hp: 674, ac: 20, attack: 11, dice: 13, sides: 7, bonus: 19, speed: 13, xp: 8853, gold: [0, 0], ranged: true, inflict: { cond: 'paralysed', chance: 0.2 }, immune: ['asleep'], tint: '#a8928a', size: 1.9 },
  // the cove's chained and the hold's rows (#188, #190), a controller on MONSTERS §4.4's line at 13: the chain holds
  { id: 'ashen_overseer', name: 'Ashen Overseer', plural: 'Ashen Overseers', sprite: 'overseer', kind: 'person', steady: true, look: 'Grey to the wrist, and a chain in each hand.', level: 13, hp: 136, ac: 18, attack: 8, dice: 2, sides: 8, bonus: 4, speed: 12, xp: 513, gold: [20, 50], inflict: { cond: 'paralysed', chance: 0.25 }, tint: '#4a4248', size: 0.95 },
  // the cove and the Tide Ship's deck (#187, #188, #190), a soldier on MONSTERS §4.4's line at 12
  { id: 'wrack_smuggler', name: 'Wrack Smuggler', plural: 'Wrack Smugglers', sprite: 'wrack_smuggler', kind: 'person', look: 'A Compact knife in a Helmstow coat.', level: 12, hp: 144, ac: 17, attack: 8, dice: 2, sides: 8, bonus: 4, speed: 11, xp: 473, gold: [15, 40], drops: [{ item: 'dagger', chance: 0.1 }, { item: 'potion_heal', chance: 0.15 }], tint: '#7a3a32', size: 0.92 },
  // with the smugglers (#187, #188, #190), an archer on MONSTERS §4.4's line at 12: it shoots the back row
  { id: 'wrack_bowman', name: 'Wrack Bowman', plural: 'Wrack Bowmen', sprite: 'wrack_bowman', kind: 'person', look: 'A bow, and the high ground.', level: 12, hp: 143, ac: 17, attack: 9, dice: 2, sides: 6, bonus: 3, speed: 12, xp: 473, gold: [12, 35], ranged: true, missile: true, drops: [{ item: 'longbow', chance: 0.05 }, { item: 'potion_heal', chance: 0.1 }], tint: '#5e3a36', size: 0.92 },
  // the Tide Ship's lower decks and the east shore (#189, #190), fodder on MONSTERS §4.4's line at 12, eight to a group: it carries disease
  { id: 'bilge_rat', name: 'Bilge Rat', plural: 'Bilge Rats', sprite: 'bilge_rat', kind: 'beast', look: 'The rats aboard have been eating well.', level: 12, hp: 113, ac: 16, attack: 7, dice: 1, sides: 6, bonus: 3, speed: 12, xp: 237, gold: [0, 0], inflict: { cond: 'diseased', chance: 0.15 }, tint: '#3e3832', size: 0.4 },
  // the moor and the cliffs (#187, #189), fodder on MONSTERS §4.4's line at 12, eight to a group: it flies, so it reaches the back row
  { id: 'wrack_gull', name: 'Wrack Gull', plural: 'Wrack Gulls', sprite: 'wrack_gull', kind: 'beast', look: 'A thousand gulls, and all of them angry.', level: 12, hp: 113, ac: 16, attack: 7, dice: 1, sides: 6, bonus: 3, speed: 12, xp: 237, gold: [0, 0], ranged: true, tint: '#ecebe6', size: 0.38 },
];
