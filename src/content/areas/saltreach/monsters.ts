// Saltreach's monsters, band 10-12: the Long Water, the Delta's fen and the Drowned Temples, the
// salt pans and Saltmouth. `sprite` names the drawing (src/ui/monsters/); the numbers are the
// combat model's. A group on a map is a list of these ids, and any area's maps may place them.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings Saltreach's monsters are drawn with, one kind to each. A family in src/ui/monsters/ must register every one. */
export const SPRITES = [
  'brineling',
  'bargeman', 'barge_master',
  'temple_drowned', 'drowned_chanter', 'choirmaster',
  'fen_eel', 'leech',
  'fen_toad', 'bull_toad',
  'grey_heron',
  'salt_crab',
  'old_chanter',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  { id: 'brineling', name: 'Brineling', plural: 'Brinelings', sprite: 'brineling', kind: 'rift', look: 'Green glass, walking, with a light in it.', level: 10, hp: 89, ac: 16, attack: 7, dice: 2, sides: 6, bonus: 3, speed: 15, xp: 393, gold: [0, 0], tint: '#3a9a82', size: 0.72, inflict: { cond: 'paralysed', chance: 0.1 }, weak: ['lightning'], immune: ['cold'] },
  { id: 'bargeman', name: 'Bargeman', plural: 'Bargemen', sprite: 'bargeman', kind: 'person', look: 'A barge pole, a knife, and no questions.', level: 10, hp: 90, ac: 16, attack: 7, dice: 2, sides: 6, bonus: 3, speed: 11, xp: 393, gold: [12, 35], tint: '#6e7c86', size: 0.92 },
  { id: 'barge_master', name: 'Barge Master', plural: 'Barge Masters', sprite: 'barge_master', kind: 'person', look: 'A ledger in one hand and a cudgel in the other.', level: 11, hp: 127, ac: 17, attack: 7, dice: 2, sides: 8, bonus: 4, speed: 11, xp: 433, gold: [40, 100], tint: '#3a3e52', size: 1.0 },
  // the Drowned Temples' nave and the choir's front row (#175), a brute on MONSTERS §4.4's line at 11
  { id: 'temple_drowned', name: 'Drowned Man', plural: 'Drowned Men', sprite: 'temple_drowned', kind: 'dead', look: 'It roped the stone to its own neck, and it has not let go.', level: 11, hp: 267, ac: 15, attack: 8, dice: 3, sides: 8, bonus: 6, speed: 8, xp: 867, gold: [0, 15], tint: '#788672', size: 1.15 },
  // the Drowned Temples' choir (#175), a caster on MONSTERS §4.4's line at 11
  { id: 'drowned_chanter', name: 'Drowned Chanter', plural: 'Drowned Chanters', sprite: 'drowned_chanter', kind: 'dead', look: 'A priest of the drowned god, still chanting.', level: 11, hp: 175, ac: 17, attack: 9, dice: 2, sides: 8, bonus: 4, speed: 12, xp: 578, gold: [0, 15], ranged: true, cast: { spells: ['sleep'], chance: 0.1 }, tint: '#5e7a74', size: 0.95 },
  // the choir's end (#175), the area's boss at 12: past MONSTERS §4.4's line (540 hit points, 10d8+14)
  // in its hit points and its blows, so that it is won about half the time at 11 (its hit points set
  // again by #806, against the company with its first prestige), and paid as one fight, not the line's
  // boss, to keep the temples to their share; it blesses its group each round it can, and the Tide
  // Bell it beats time on falls with it
  { id: 'choirmaster', name: 'The Choirmaster', plural: 'Choirmasters', sprite: 'choirmaster', kind: 'dead', look: 'The choir\'s master, beating time on a bell.', level: 12, hp: 950, ac: 20, attack: 11, dice: 12, sides: 8, bonus: 16, speed: 13, xp: 1565, gold: [60, 120], cast: { spells: ['bless'], chance: 1 }, drops: [{ item: 'tide_bell', chance: 1 }], offLine: 'the Drowned Temples\' boss, set by their gate (#175) and its hit points set again against the company with its first prestige (#806), set again on its odds for the class changes (#1117)', tint: '#4a6a6e', size: 1.1 },
  // the river and the fen's water (#261), a skirmisher on MONSTERS §4.4's line at 10
  { id: 'fen_eel', name: 'Fen Eel', plural: 'Fen Eels', sprite: 'fen_eel', kind: 'beast', look: "A back as thick as a man's leg, turning in the reeds.", level: 10, hp: 89, ac: 16, attack: 7, dice: 2, sides: 6, bonus: 3, speed: 15, xp: 393, gold: [0, 0], tint: '#3c4228', size: 0.75 },
  // the Delta (#223), a controller on MONSTERS §4.4's line at 10: its sweat poisons
  { id: 'fen_toad', name: 'Fen Toad', plural: 'Fen Toads', sprite: 'fen_toad', kind: 'beast', look: 'A toad the size of a sheep, its skin weeping.', level: 10, hp: 87, ac: 16, attack: 7, dice: 2, sides: 6, bonus: 3, speed: 12, xp: 393, gold: [0, 0], inflict: { cond: 'poisoned', chance: 0.3 }, tint: '#5e5a32', size: 0.6 },
  // the Upper Water (#222), a skirmisher on MONSTERS §4.4's line at 10: it flies, and spears the back row
  { id: 'grey_heron', name: 'Grey Heron', plural: 'Grey Herons', sprite: 'grey_heron', kind: 'beast', look: 'Taller than Bram, and it has been watching.', level: 10, hp: 89, ac: 16, attack: 7, dice: 2, sides: 6, bonus: 3, speed: 15, xp: 393, gold: [0, 0], ranged: true, tint: '#7c8490', size: 1.1 },
  // the salt pans (#227), armoured on MONSTERS §4.4's line at 11; it shrugs off sleep, as the crabs do
  { id: 'salt_crab', name: 'Salt Crab', plural: 'Salt Crabs', sprite: 'salt_crab', kind: 'beast', look: 'White with salt, and it glitters when it moves.', level: 11, hp: 164, ac: 19, attack: 7, dice: 3, sides: 7, bonus: 3, speed: 8, xp: 578, gold: [0, 0], immune: ['asleep'], tint: '#c8c2b4', size: 0.7 },
  // the fen's pools (#221), a controller on MONSTERS §4.4's line at 10: its hits heal it
  { id: 'leech', name: 'Leech', plural: 'Leeches', sprite: 'leech', kind: 'beast', look: 'Black, and as long as your arm.', level: 10, hp: 87, ac: 16, attack: 7, dice: 2, sides: 6, bonus: 3, speed: 12, xp: 393, gold: [0, 0], drain: 'hp', tint: '#26282a', size: 0.45 },
  // the Delta, alone (#224), a brute on MONSTERS §4.4's line at 12: it carries disease
  { id: 'bull_toad', name: 'Bull Toad', plural: 'Bull Toads', sprite: 'bull_toad', kind: 'beast', look: 'It could swallow Ottilie whole.', level: 12, hp: 337, ac: 16, attack: 9, dice: 4, sides: 8, bonus: 4, speed: 8, xp: 947, gold: [0, 0], inflict: { cond: 'diseased', chance: 0.15 }, tint: '#5a3e26', size: 1.35 },
  // the bounds' lair (#830): Sjongwierde's undercroft under A5's drowned mound, where it keeps the Telstok.
  // The first of the chanters, the lair's boss at 32 (MONSTERS §13): dead, so sleep and nature do nothing
  // to it and holy is half again (its kind); it blesses itself each round it can, as the Choirmaster does,
  // and its hits curse (0.2), as the Cairn King's. Drawn on the line's boss at 32 (2,100 hit points, attack
  // 20, 34d8+41) it was won 65% at 30 and 75% at 32 at the gate; set by the lair's gate (#830's decision
  // 54), its armour, pace, blessing and curse kept, it is won 61% at 30 and 93% at 32 (66% and 92% over
  // 400 seeds), and keeps the line's xp at 32
  { id: 'old_chanter', name: 'The Old Chanter', plural: 'Old Chanters', sprite: 'old_chanter', kind: 'dead', look: 'The first of the chanters, and it still sings the old song.', level: 32, hp: 2800, ac: 29, attack: 25, dice: 31, sides: 8, bonus: 50, speed: 13, xp: 20373, gold: [0, 0], inflict: { cond: 'cursed', chance: 0.2 }, cast: { spells: ['bless'], chance: 1 }, offLine: 'Sjongwierde\'s boss, its hit points, its attack and its blow set by its gate at the lair\'s floor and two above, its blessing and its curse as drawn (#830), set again on its odds for the class changes (#1117)', tint: '#3e5448', size: 1.35 },
];
