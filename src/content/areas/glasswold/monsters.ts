// The Glasswold's monsters, band 26-28: the Wold's steppe, its dunes and its mesas (MONSTERS §8.3).
// `sprite` names the drawing (src/ui/sprites.ts); the numbers are the combat model's. A group on a
// map is a list of these ids, and any area's maps may place them. Drawn ahead of the area's first
// map (#533), and listed with the area by it (#525).
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings the Wold's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'vulture', 'wold_lion', 'glass_scorpion', 'basilisk', 'grey_lion',
  'glass_walker',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the hills' foot and over every kill (#524 first), fodder on MONSTERS §4.4's line at 26: it flies, reaching the back row
  { id: 'vulture', name: 'Vulture', plural: 'Vultures', sprite: 'vulture', kind: 'beast', look: 'They land when something is about to die.', level: 26, hp: 191, ac: 23, attack: 14, dice: 3, sides: 8, bonus: 4, speed: 12, xp: 517, gold: [0, 0], ranged: true, tint: '#6b5844', size: 0.65 },
  // the steppe, in prides of three or four (#524 first), a skirmisher on the line at 26: it keeps the front row busy, as
  // the mesa's lions do (§8.3), so it does not leap at the back row as the snow lynx does
  { id: 'wold_lion', name: 'Wold Lion', plural: 'Wold Lions', sprite: 'wold_lion', kind: 'beast', look: 'Tawny as the grass, and seen only when it moves.', level: 26, hp: 332, ac: 24, attack: 15, dice: 3, sides: 8, bonus: 6, speed: 15, xp: 1033, gold: [0, 0], tint: '#b08a52', size: 1 },
  // the dunes (#525 first), a controller on the line at 26: its hold is the roster's poison, at 0.35
  { id: 'glass_scorpion', name: 'Glass Scorpion', plural: 'Glass Scorpions', sprite: 'glass_scorpion', kind: 'beast', look: 'Its sting is glass, and so is its shell.', level: 26, hp: 290, ac: 24, attack: 15, dice: 4, sides: 8, bonus: 4, speed: 12, xp: 1033, gold: [0, 0], inflict: { cond: 'poisoned', chance: 0.35 }, tint: '#5f8a6a', size: 0.7 },
  // the mesas (#527 first, D10's), the test basilisk at 27 (tools/testmonster.ts, #546): the controller on the line, its hold a
  // stone at 0.15 and its gaze reaching the back row
  { id: 'basilisk', name: 'Basilisk', plural: 'Basilisks', sprite: 'basilisk', kind: 'beast', look: "Don't meet its eyes.", level: 27, hp: 376, ac: 25, attack: 15, dice: 5, sides: 7, bonus: 7, speed: 12, xp: 1073, gold: [0, 0], ranged: true, inflict: { cond: 'stoned', chance: 0.15 }, tint: '#5c6650', size: 0.85 },
  // the Wold's heart (#529), its boss at 28, set off the line by B8's gate: the boss line's 1,552 and 26d8+29 to 3,000
  // and 16d8+16, won 75% at B8's floor, 27, where the third prestige comes, and 91% at 29; on the line he fell 86% at 27
  { id: 'grey_lion', name: 'The Grey Lion', plural: 'Grey Lions', sprite: 'grey_lion', kind: 'beast', look: 'Old, scarred, and king of all of this.', level: 28, hp: 3000, ac: 27, attack: 18, dice: 16, sides: 8, bonus: 16, speed: 13, xp: 17813, gold: [0, 0], tint: '#7c7466', size: 1.4 },
  // the steppe's far south-west (#525 first, the first machine seen on the Wold), the Glass's edge (#530) and the Buried
  // Tower's decks after (MONSTERS §10.1), an elite on the line at 27: a machine (§2), so it never breaks; its free hand
  // holds, paralysed at 0.15 as the elite's line has it
  { id: 'glass_walker', name: 'Glass Walker', plural: 'Glass Walkers', sprite: 'glass_walker', kind: 'machine', look: 'Something walking out of the Glass, and it has walked a long way.', level: 27, hp: 670, ac: 25, attack: 16, dice: 7, sides: 8, bonus: 7, speed: 15, xp: 2147, gold: [0, 0], inflict: { cond: 'paralysed', chance: 0.15 }, tint: '#5f8a6a', size: 1.2 },
];
