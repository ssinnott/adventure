// Ashfall's monsters, band 24-26: Cindercoast, Fire Mountain and the Ember Waste. `sprite` names the
// drawing (src/ui/sprites.ts); the numbers are the combat model's. A group on a map is a list of these
// ids, and any area's maps may place them.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings Ashfall's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'strangler_vine', 'cinder_beetle', 'ember_salamander', 'ash_husk',
  'cinder_drake', 'old_drake',
  'stoker', 'sentry', 'sentinel',
  'drakeling', 'brood_drake', 'flue_walker', 'deep_knocker', 'inspector',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the green shore's trees (#510, #511), a controller on MONSTERS §4.4's line at 24: it holds as the bramble does (§8.2),
  // and never roams, which its groups say (`roams: false`)
  { id: 'strangler_vine', name: 'Strangler Vine', plural: 'Strangler Vines', sprite: 'strangler_vine', kind: 'beast', look: 'The vines hang lower than they did.', level: 24, hp: 284, ac: 23, attack: 14, dice: 3, sides: 8, bonus: 6, speed: 6, xp: 953, gold: [0, 0], inflict: { cond: 'paralysed', chance: 0.3 }, tint: '#4a5c2c', size: 1.15 },
  // the black sand (#510, #511), armoured on the line at 24: fire does not touch it, as it does not the fire beetle
  { id: 'cinder_beetle', name: 'Cinder Beetle', plural: 'Cinder Beetles', sprite: 'cinder_beetle', kind: 'beast', look: 'Its shell is the colour of the beach.', level: 24, hp: 397, ac: 25, attack: 14, dice: 4, sides: 8, bonus: 5, speed: 8, xp: 1271, gold: [0, 0], immune: ['fire'], tint: '#34343a', size: 0.8 },
  // the vents and the ash toward them (#511, #513), a skirmisher on the line at 24: its kin's fire and its cold, and quicker
  { id: 'ember_salamander', name: 'Ember Salamander', plural: 'Ember Salamanders', sprite: 'ember_salamander', kind: 'beast', look: 'Grown in the mountain\'s own fire.', level: 24, hp: 330, ac: 23, attack: 14, dice: 3, sides: 8, bonus: 4, speed: 16, xp: 953, gold: [0, 0], immune: ['fire'], weak: ['cold'], tint: '#4a1c12', size: 0.62 },
  // Old Cinder's crater (#514, #515), a soldier on MONSTERS §4.4's line at 25 as #549 made it again: the dead, cast in ash
  { id: 'ash_husk', name: 'Ash Husk', plural: 'Ash Husks', sprite: 'ash_husk', kind: 'dead', look: 'A man of ash, still holding his cup.', level: 25, hp: 320, ac: 24, attack: 14, dice: 4, sides: 8, bonus: 2, speed: 10, xp: 993, gold: [0, 0], tint: '#9c978e', size: 1 },
  // Fire Mountain's slopes and the shore under them (#511, #513), a brute at 25 on the test drake's line (MONSTERS §3.3):
  // it flies, so it reaches the back row as the eagle does (`ranged`); fire does nothing to it, and its breath burns a row
  { id: 'cinder_drake', name: 'Cinder Drake', plural: 'Cinder Drakes', sprite: 'cinder_drake', kind: 'beast', look: 'The mountain has children.', level: 25, hp: 584, ac: 22, attack: 15, dice: 5, sides: 8, bonus: 3, speed: 8, xp: 1987, gold: [0, 0], ranged: true, immune: ['fire'], sweep: { chance: 0.25, element: 'fire' }, tint: '#7a736b', size: 1.3 },
  // Old Cinder's square (#515), its boss at 26: the boss line come down whole to a sweeper's share (MONSTERS §3.3) with the
  // drakes' breath, off the line (tools/tests/harness.ts); it lies on its town and does not fly. Its hit points are set for
  // #515's gate, 1,226 to 1,000 (won 51% at 25 and 99% at 27 on the line): two times in three at the town's floor, 25,
  // which keeps the floor with its one other fight, and nearly always at 27; its blow is the line's
  { id: 'old_drake', name: 'The Old Drake', plural: 'Old Drakes', sprite: 'old_drake', kind: 'beast', look: 'The mountain\'s eldest, asleep on what is left of the town.', level: 26, hp: 1000, ac: 26, attack: 17, dice: 21, sides: 7, bonus: 32, speed: 13, xp: 16533, gold: [0, 0], immune: ['fire'], sweep: { chance: 0.25, element: 'fire' }, tint: '#58524c', size: 1.8 },
  // the vents (#513), a brute on MONSTERS §4.4's line at 25 as #549 made it again: a machine (§2), and fire does
  // not touch it (§8.2)
  { id: 'stoker', name: 'Stoker', plural: 'Stokers', sprite: 'stoker', kind: 'machine', look: 'It shovels nothing into nothing, and turns as you come.', level: 25, hp: 665, ac: 22, attack: 15, dice: 5, sides: 8, bonus: 8, speed: 8, xp: 1987, gold: [0, 0], immune: ['fire'], tint: '#57514a', size: 1.3 },
  // all of Ashfall once the Ember Stone is lit, its groups `after` (up out of G11's vents first, #513; F11's road,
  // #514), an elite on the line at 26 as #549 made it again: the long arm's clamp holds, paralysed at 0.15 as the
  // elite's line has it
  { id: 'sentry', name: 'Sentry', plural: 'Sentries', sprite: 'sentry', kind: 'machine', look: 'It is looking for whoever touched the Stones.', level: 26, hp: 597, ac: 25, attack: 16, dice: 5, sides: 8, bonus: 4, speed: 15, xp: 2067, gold: [0, 0], inflict: { cond: 'paralysed', chance: 0.15 }, tint: '#5e656d', size: 1.45 },
  // the Ember Stone, the moment it lights (#516), its boss at 26, off the line (tools/tests/harness.ts): its hit points
  // are set for the Stone's gate, the line's 1,498 to 1,400 (won 58% at 25 and 94% at 27 on the line), two times in
  // three at the level's floor, 25, which keeps the floor with its one other fight; its blow is the line's 25d7+42. It
  // carries its visor up (MONSTERS §2). Size 2 and drawn inside TALL_REACH
  { id: 'sentinel', name: 'The Sentinel', plural: 'Sentinels', sprite: 'sentinel', kind: 'machine', look: 'The first thing up through the doors.', level: 26, hp: 1400, ac: 26, attack: 17, dice: 25, sides: 7, bonus: 42, speed: 13, xp: 16533, gold: [0, 0], drops: [{ item: 'sentinel_visor', chance: 1 }], tint: '#4f5359', size: 2 },
  // Meridian Camp's (MONSTERS §8.4; #22), drawn ahead of its three levels and kept here, the camp being Ashfall's.
  // The nest off the iron corridors (meridian_camp2), fodder on MONSTERS §4.4's line at 26 as #549 made it again, six to a
  // group: it flies, so it reaches the back row (`ranged`), and fire does not touch it, as it does not its kin; too young yet
  // to breathe
  { id: 'drakeling', name: 'Drakeling', plural: 'Drakelings', sprite: 'drakeling', kind: 'beast', look: 'The mountain\'s youngest. Its crust has not set.', level: 26, hp: 191, ac: 23, attack: 14, dice: 3, sides: 8, bonus: 4, speed: 12, xp: 517, gold: [0, 0], ranged: true, immune: ['fire'], tint: '#b4735a', size: 0.6 },
  // the nest (meridian_camp2), its boss at 27 and the Barbarian's quarry (#448): the boss line come down whole to a sweeper's share
  // with the drakes' breath, as the Old Drake is, its hit points kept and its blow set by the corridors' gate (#22: 61% at 26,
  // 100% at 28, from 21d7+34); it flies, and fire does not touch it; size 1.8 and drawn inside TALL_REACH
  { id: 'brood_drake', name: 'The Brood Drake', plural: 'Brood Drakes', sprite: 'brood_drake', kind: 'beast', look: 'It will not leave the eggs.', level: 27, hp: 1250, ac: 26, attack: 17, dice: 19, sides: 7, bonus: 28, speed: 13, xp: 17173, gold: [0, 0], ranged: true, immune: ['fire'], sweep: { chance: 0.25, element: 'fire' }, tint: '#764636', size: 1.8 },
  // the iron corridors (meridian_camp2), their elite on the line at 27 as #549 made it again: a machine (§2), and fire does not
  // touch it; its hooks hold, paralysed at 0.15 as the elite's line has it
  { id: 'flue_walker', name: 'Flue Walker', plural: 'Flue Walkers', sprite: 'flue_walker', kind: 'machine', look: 'It walks the corridor to its end, and back.', level: 27, hp: 670, ac: 25, attack: 16, dice: 7, sides: 8, bonus: 7, speed: 15, xp: 2147, gold: [0, 0], immune: ['fire'], inflict: { cond: 'paralysed', chance: 0.15 }, tint: '#7d7a74', size: 1.5 },
  // the gallery below the camp (meridian_camp3), armoured on the line at 28 as #549 made it again: first met here, and back in
  // the Underdeep (§9.2)
  { id: 'deep_knocker', name: 'Deep Knocker', plural: 'Deep Knockers', sprite: 'deep_knocker', kind: 'machine', look: 'Still knocking, on a wall that has never cracked.', level: 28, hp: 523, ac: 27, attack: 16, dice: 6, sides: 8, bonus: 5, speed: 8, xp: 1484, gold: [0, 0], tint: '#b4b8b6', size: 0.75 },
  // the gallery below the camp (meridian_camp3), a caller on a soldier's numbers at 28 as #549 made them again, as the tallyman
  // is at 20: it calls three deep knockers at a half a turn, as #537's test caller does
  { id: 'inspector', name: 'Inspector', plural: 'Inspectors', sprite: 'inspector', kind: 'machine', look: 'It holds its light to the wall, and then to you.', level: 28, hp: 408, ac: 25, attack: 16, dice: 5, sides: 7, bonus: 8, speed: 11, xp: 1113, gold: [0, 0], calls: { monsters: ['deep_knocker', 'deep_knocker', 'deep_knocker'], chance: 0.5 }, tint: '#6a6458', size: 0.8 },
];
