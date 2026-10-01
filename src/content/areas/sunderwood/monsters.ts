// Sunderwood's monsters, band 14-16: the Eaves, the Sunder and Lanternwood. `sprite` names the
// drawing (src/ui/sprites.ts); the numbers are the combat model's. A group on a map is a list of
// these ids, and any area's maps may place them.
// Drawn ahead of the area's first map, so src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings Sunderwood's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'pine_bear',
  'sunderling', 'sunder_warden',
  'gleaner',
  'glass_spider',
  'sunder_hound',
  'lantern_moth',
  'glass_bear',
  'deathshead',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the Eaves (#195, #196), a brute on MONSTERS §4.4's line at 14
  { id: 'pine_bear', name: 'Pine Bear', plural: 'Pine Bears', sprite: 'pine_bear', kind: 'beast', look: 'A bear, and then the rest of the bear.', level: 14, hp: 293, ac: 17, attack: 10, dice: 3, sides: 8, bonus: 6, speed: 8, xp: 1107, gold: [0, 0], tint: '#6b4a2e', size: 1.15 },
  // the Sunder's black glass (#198, #199), a skirmisher on MONSTERS §4.4's line at 14
  { id: 'sunderling', name: 'Sunderling', plural: 'Sunderlings', sprite: 'sunderling', kind: 'rift', look: 'Black glass, with a white light inside.', level: 14, hp: 155, ac: 18, attack: 9, dice: 3, sides: 6, bonus: 1, speed: 15, xp: 553, gold: [0, 0], tint: '#2c2e38', size: 0.74, inflict: { cond: 'paralysed', chance: 0.1 } },
  // the gorge above the wall (#199), the area's boss at 16
  { id: 'sunder_warden', name: 'Warden of the Sunder', plural: 'Wardens of the Sunder', sprite: 'sunder_warden', kind: 'rift', look: 'The Sunder\'s own knot, and it has held for centuries.', level: 16, hp: 821, ac: 21, attack: 12, dice: 15, sides: 8, bonus: 17, speed: 13, xp: 10133, gold: [0, 0], immune: ['asleep'], tint: '#2a2a34', size: 1.35 },
  // the Sunder's ledges (#198), a soldier on MONSTERS §4.4's line at 15: the Hand, quarrying the Rift
  { id: 'ashen_gleaner', name: 'Ashen Gleaner', plural: 'Ashen Gleaners', sprite: 'gleaner', kind: 'person', steady: true, look: 'A sack of glowing shards, and a knife for the next.', level: 15, hp: 163, ac: 19, attack: 9, dice: 2, sides: 8, bonus: 3, speed: 11, xp: 593, gold: [25, 60], tint: '#54484e', size: 0.92 },
  // the Sunder's edge (#197, #198, #199), a controller on MONSTERS §4.4's line at 15: it paralyses, at 0.25 a hit
  { id: 'glass_spider', name: 'Glass Spider', plural: 'Glass Spiders', sprite: 'glass_spider', kind: 'beast', look: 'Threads of glass, and something walking them.', level: 15, hp: 151, ac: 19, attack: 9, dice: 2, sides: 8, bonus: 4, speed: 12, xp: 593, gold: [0, 0], inflict: { cond: 'paralysed', chance: 0.25 }, tint: '#23262e', size: 0.75 },
  // the Sunder (#196, #197, #198), a skirmisher on MONSTERS §4.4's line at 15: it paralyses, at 0.15 a hit; fire bites the Sunder's things, and cold does not
  { id: 'sunder_hound', name: 'Sunder Hound', plural: 'Sunder Hounds', sprite: 'sunder_hound', kind: 'rift', look: 'A rift hound, gone to glass.', level: 15, hp: 164, ac: 19, attack: 9, dice: 3, sides: 6, bonus: 1, speed: 15, xp: 593, gold: [0, 0], inflict: { cond: 'paralysed', chance: 0.15 }, weak: ['fire'], immune: ['cold'], tint: '#2c2f38', size: 0.72 },
  // Lanternwood by night (#195, #200, #202, #203), fodder on MONSTERS §4.4's line at 14: it flies, reaches the back row, and its dust puts to sleep, at 0.2 a hit
  { id: 'lantern_moth', name: 'Lantern Moth', plural: 'Lantern Moths', sprite: 'lantern_moth', kind: 'beast', look: 'Wings like a pair of hands, and dust that glitters.', level: 14, hp: 118, ac: 17, attack: 8, dice: 2, sides: 6, bonus: 1, speed: 12, xp: 277, gold: [0, 0], ranged: true, inflict: { cond: 'asleep', chance: 0.2 }, tint: '#d8ceb0', size: 0.4 },
  // the Sunder's floor (#199), armoured on MONSTERS §4.4's line at 16; fire does not touch it
  { id: 'glass_bear', name: 'Glass Bear', plural: 'Glass Bears', sprite: 'glass_bear', kind: 'beast', look: 'Glass through its fur like frost.', level: 16, hp: 200, ac: 21, attack: 10, dice: 3, sides: 8, bonus: 2, speed: 8, xp: 844, gold: [0, 0], immune: ['fire'], tint: '#4e4a46', size: 1.2 },
  // Lanternwood by night (#200, #202, #203), an elite on MONSTERS §4.4's line at 16: it flies, reaches the back row, and its dust puts to sleep, at 0.35 a hit
  { id: 'deathshead', name: 'Deathshead', plural: 'Deathsheads', sprite: 'deathshead', kind: 'beast', look: 'A skull on its back, and a scream in its wings.', level: 16, hp: 274, ac: 20, attack: 11, dice: 3, sides: 8, bonus: 4, speed: 15, xp: 1267, gold: [0, 0], ranged: true, inflict: { cond: 'asleep', chance: 0.35 }, tint: '#3a3026', size: 0.55 },
];
