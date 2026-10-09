// Wrackholm's monsters, band 12-14: the smugglers' isle, Kelp Hole and the Tide Ship. `sprite` names
// the drawing (src/ui/sprites.ts); the numbers are the combat model's. A group on a map is a list of
// these ids, and any area's maps may place them.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings Wrackholm's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'devilfish', 'great_devilfish',
  'overseer',
  'wrack_smuggler', 'wrack_bowman',
  'bilge_rat',
  'wrack_gull',
  'tide_elder', 'tide_warden',
  // the Dead-Drop's, below the Tide Ship (#22, docs/areas/dead_drop.md), drawn ahead of its three levels
  'loader', 'tally_clerk', 'hold_keeper', 'tallymaster',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the cove's pools and under the ship (#188, #190), a controller on MONSTERS §4.4's line at 13: it reaches the back row, and holds
  { id: 'devilfish', name: 'Devilfish', plural: 'Devilfish', sprite: 'devilfish', kind: 'beast', look: 'Arms, coming up over the side.', level: 13, hp: 142, ac: 18, attack: 8, dice: 2, sides: 8, bonus: 4, speed: 12, xp: 513, gold: [0, 0], ranged: true, inflict: { cond: 'paralysed', chance: 0.2 }, tint: '#7a3a30', size: 1.0 },
  // the sea cave at Kelp Hole's back (#188), the area's boss at 14; it keeps the family's reach and hold. Off MONSTERS §4.4's
  // boss line (674 hp, 13d7+19, won 11% at 12), it is set for #188's gate: about half at its floor, 12, and nearly always at 14
  { id: 'great_devilfish', name: 'Great Devilfish', plural: 'Great Devilfish', sprite: 'great_devilfish', kind: 'beast', look: 'What the smugglers feed.', level: 14, hp: 600, ac: 20, attack: 11, dice: 8, sides: 7, bonus: 10, speed: 13, xp: 8853, gold: [0, 0], ranged: true, inflict: { cond: 'paralysed', chance: 0.2 }, immune: ['asleep'], tint: '#a8928a', size: 1.9 },
  // the cove's chained and the hold's rows (#188, #190), a controller on MONSTERS §4.4's line at 13: the chain holds
  { id: 'ashen_overseer', name: 'Ashen Overseer', plural: 'Ashen Overseers', sprite: 'overseer', kind: 'person', steady: true, look: 'Grey to the wrist, and a chain in each hand.', level: 13, hp: 142, ac: 18, attack: 8, dice: 2, sides: 8, bonus: 4, speed: 12, xp: 513, gold: [20, 50], inflict: { cond: 'paralysed', chance: 0.25 }, tint: '#4a4248', size: 0.95 },
  // the cove and the Tide Ship's deck (#187, #188, #190), a soldier on MONSTERS §4.4's line at 12
  { id: 'wrack_smuggler', name: 'Wrack Smuggler', plural: 'Wrack Smugglers', sprite: 'wrack_smuggler', kind: 'person', look: 'A Compact knife in a Helmstow coat.', level: 12, hp: 138, ac: 17, attack: 8, dice: 2, sides: 8, bonus: 4, speed: 11, xp: 473, gold: [15, 40], drops: [{ item: 'dagger', chance: 0.1 }, { item: 'potion_heal', chance: 0.15 }], tint: '#7a3a32', size: 0.92 },
  // with the smugglers (#187, #188, #190), an archer on MONSTERS §4.4's line at 12: it shoots the back row
  { id: 'wrack_bowman', name: 'Wrack Bowman', plural: 'Wrack Bowmen', sprite: 'wrack_bowman', kind: 'person', look: 'A bow, and the high ground.', level: 12, hp: 138, ac: 17, attack: 9, dice: 2, sides: 6, bonus: 3, speed: 12, xp: 473, gold: [12, 35], ranged: true, missile: true, drops: [{ item: 'longbow', chance: 0.05 }, { item: 'potion_heal', chance: 0.1 }], tint: '#5e3a36', size: 0.92 },
  // the Tide Ship's lower decks and the east shore (#189, #190), fodder on MONSTERS §4.4's line at 12, eight to a group: it carries disease
  { id: 'bilge_rat', name: 'Bilge Rat', plural: 'Bilge Rats', sprite: 'bilge_rat', kind: 'beast', look: 'The rats aboard have been eating well.', level: 12, hp: 107, ac: 16, attack: 7, dice: 1, sides: 6, bonus: 3, speed: 12, xp: 237, gold: [0, 0], inflict: { cond: 'diseased', chance: 0.15 }, tint: '#3e3832', size: 0.4 },
  // the moor and the cliffs (#187, #189), fodder on MONSTERS §4.4's line at 12, eight to a group: it flies, so it reaches the back row
  { id: 'wrack_gull', name: 'Wrack Gull', plural: 'Wrack Gulls', sprite: 'wrack_gull', kind: 'beast', look: 'A thousand gulls, and all of them angry.', level: 12, hp: 107, ac: 16, attack: 7, dice: 1, sides: 6, bonus: 3, speed: 12, xp: 237, gold: [0, 0], ranged: true, tint: '#ecebe6', size: 0.38 },
  // the Tide Ship's forward hold (#190), an elite on MONSTERS §4.4's line at 13: it paralyses
  { id: 'tide_elder', name: 'Tide Elder', plural: 'Tide Elders', sprite: 'tide_elder', kind: 'rift', look: 'A shard of the sea, stood up.', level: 13, hp: 270, ac: 18, attack: 9, dice: 3, sides: 8, bonus: 3, speed: 15, xp: 1027, gold: [0, 0], tint: '#2e8a78', size: 0.95, inflict: { cond: 'paralysed', chance: 0.15 } },
  // over the Stone at its Rift's heart in the forward hold (#190), the area's boss at 14, alone. On MONSTERS §4.4's boss line
  // (13d7+19) it was won 38% at 12 and 76% at 14, and at the escorted boss's 7d7+11 97% at 12; it is set for #190's gate,
  // about two in three at its Rift's floor, 12, so the Rift's fights are won as its other maps' are, and nearly always at 14
  { id: 'tide_warden', name: 'Warden of the Tide', plural: 'Wardens of the Tide', sprite: 'tide_warden', kind: 'rift', look: "The Stone's own light, standing guard over it.", level: 14, hp: 674, ac: 20, attack: 11, dice: 10, sides: 7, bonus: 15, speed: 13, xp: 8853, gold: [0, 0], immune: ['asleep'], tint: '#2a7a6c', size: 1.25 },
  // The Dead-Drop's (#22; MONSTERS §8.5), down the stair from the Tide Ship's hold and placed by its band, 26 to 28,
  // not Wrackholm's (§2.2): machines, every one (§2), drawn ahead of the levels that place them.
  // the drop and the shards' vault, a brute on MONSTERS §4.4's line at 26: a heavy machine with a crate over its head
  { id: 'loader', name: 'Loader', plural: 'Loaders', sprite: 'loader', kind: 'machine', look: 'It carries a crate the size of a cart, and does not set it down.', level: 26, hp: 735, ac: 23, attack: 16, dice: 6, sides: 8, bonus: 6, speed: 8, xp: 2067, gold: [0, 0], tint: '#6d5341', size: 1.4 },
  // the drop, a caller on a soldier's numbers at 26 (MONSTERS §4.2), as the tallyman is at 20: it calls two loaders at a
  // half a turn, the pair #537's test has a clerk call, a brute group's two beside it
  { id: 'tally_clerk', name: 'Tally Clerk', plural: 'Tally Clerks', sprite: 'tally_clerk', kind: 'machine', look: 'It counts the crates, then turns and counts you.', level: 26, hp: 362, ac: 24, attack: 15, dice: 4, sides: 8, bonus: 5, speed: 11, xp: 1033, gold: [0, 0], calls: { monsters: ['loader', 'loader'], chance: 0.5 }, tint: '#8b7b60', size: 0.55 },
  // the people's vault, a controller on MONSTERS §4.4's line at 27: as the Bay Keeper, its touch puts to sleep at 0.3 a hit
  // and it mends the most hurt of its group one turn in four
  { id: 'hold_keeper', name: 'Hold Keeper', plural: 'Hold Keepers', sprite: 'hold_keeper', kind: 'machine', look: 'It carries water to the pens, and nobody is in them.', level: 27, hp: 356, ac: 25, attack: 15, dice: 4, sides: 8, bonus: 6, speed: 12, xp: 1073, gold: [0, 0], inflict: { cond: 'asleep', chance: 0.3 }, cast: { spells: ['heal'], chance: 0.25 }, tint: '#7c857d', size: 1.1 },
  // the counting house, its boss at 28 on MONSTERS §4.4's boss line, for dead_drop3's gate to tune, judged at 27, the
  // room's floor; it fights only when the company steps to its desk (the map's), and calls two clerks at a half a turn,
  // who may call their loaders; size 1.6 and drawn inside TALL_REACH
  { id: 'tallymaster', name: 'The Tallymaster', plural: 'Tallymasters', sprite: 'tallymaster', kind: 'machine', look: 'It writes, and does not look up.', level: 28, hp: 1497, ac: 27, attack: 18, dice: 25, sides: 8, bonus: 28, speed: 13, xp: 17813, gold: [0, 0], calls: { monsters: ['tally_clerk', 'tally_clerk'], chance: 0.5 }, tint: '#6f7780', size: 1.6 },
];
