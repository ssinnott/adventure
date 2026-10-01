// Saltreach's monsters, band 10-12: the Long Water, the Delta's fen and the Drowned Temples, the
// salt pans and Saltmouth. `sprite` names the drawing (src/ui/sprites.ts); the numbers are the
// combat model's. A group on a map is a list of these ids, and any area's maps may place them.
// Drawn ahead of the area's first map, so src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings Saltreach's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'brineling',
  'bargeman', 'barge_master',
  'drowned_chanter', 'choirmaster',
  'fen_eel',
  'fen_toad', 'bull_toad',
  'grey_heron',
  'salt_crab',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  { id: 'brineling', name: 'Brineling', plural: 'Brinelings', sprite: 'brineling', kind: 'rift', look: 'Green glass, walking, with a light in it.', level: 10, hp: 89, ac: 16, attack: 7, dice: 2, sides: 6, bonus: 3, speed: 15, xp: 393, gold: [0, 0], tint: '#3a9a82', size: 0.72, inflict: { cond: 'paralysed', chance: 0.1 } },
  { id: 'bargeman', name: 'Bargeman', plural: 'Bargemen', sprite: 'bargeman', kind: 'person', look: 'A barge pole, a knife, and no questions.', level: 10, hp: 90, ac: 16, attack: 7, dice: 2, sides: 6, bonus: 3, speed: 11, xp: 393, gold: [12, 35], tint: '#6e7c86', size: 0.92 },
  { id: 'barge_master', name: 'Barge Master', plural: 'Barge Masters', sprite: 'barge_master', kind: 'person', look: 'A ledger in one hand and a cudgel in the other.', level: 11, hp: 95, ac: 17, attack: 7, dice: 1, sides: 10, bonus: 4, speed: 11, xp: 433, gold: [40, 100], tint: '#3a3e52', size: 1.0 },
  // the Drowned Temples' choir (#175), a caster on MONSTERS §4.4's line at 11
  { id: 'drowned_chanter', name: 'Drowned Chanter', plural: 'Drowned Chanters', sprite: 'drowned_chanter', kind: 'dead', look: 'A priest of the drowned god, still chanting.', level: 11, hp: 112, ac: 17, attack: 9, dice: 2, sides: 6, bonus: 4, speed: 12, xp: 578, gold: [0, 15], ranged: true, tint: '#5e7a74', size: 0.95 },
  // the choir's end (#175), the area's boss at 12; its damage is an escorted boss's, for #175's gate to tune
  { id: 'choirmaster', name: 'The Choirmaster', plural: 'Choirmasters', sprite: 'choirmaster', kind: 'dead', look: 'The choir\'s master, beating time on a bell.', level: 12, hp: 540, ac: 19, attack: 10, dice: 6, sides: 8, bonus: 6, speed: 13, xp: 7573, gold: [60, 120], tint: '#4a6a6e', size: 1.1 },
  // the river and the fen's water (#261), a skirmisher on MONSTERS §4.4's line at 10
  { id: 'fen_eel', name: 'Fen Eel', plural: 'Fen Eels', sprite: 'fen_eel', kind: 'beast', look: "A back as thick as a man's leg, turning in the reeds.", level: 10, hp: 89, ac: 16, attack: 7, dice: 2, sides: 6, bonus: 3, speed: 15, xp: 393, gold: [0, 0], tint: '#3c4228', size: 0.75 },
  // the Delta (#223), a controller on MONSTERS §4.4's line at 10: its sweat poisons
  { id: 'fen_toad', name: 'Fen Toad', plural: 'Fen Toads', sprite: 'fen_toad', kind: 'beast', look: 'A toad the size of a sheep, its skin weeping.', level: 10, hp: 87, ac: 16, attack: 7, dice: 2, sides: 6, bonus: 3, speed: 12, xp: 393, gold: [0, 0], inflict: { cond: 'poisoned', chance: 0.3 }, tint: '#5e5a32', size: 0.6 },
  // the Upper Water (#222), a skirmisher on MONSTERS §4.4's line at 10: it flies, and spears the back row
  { id: 'grey_heron', name: 'Grey Heron', plural: 'Grey Herons', sprite: 'grey_heron', kind: 'beast', look: 'Taller than Bram, and it has been watching.', level: 10, hp: 89, ac: 16, attack: 7, dice: 2, sides: 6, bonus: 3, speed: 15, xp: 393, gold: [0, 0], ranged: true, tint: '#7c8490', size: 1.1 },
  // the salt pans (#227), armoured on MONSTERS §4.4's line at 11; it shrugs off sleep, as the crabs do
  { id: 'salt_crab', name: 'Salt Crab', plural: 'Salt Crabs', sprite: 'salt_crab', kind: 'beast', look: 'White with salt, and it glitters when it moves.', level: 11, hp: 108, ac: 19, attack: 7, dice: 2, sides: 8, bonus: 4, speed: 8, xp: 578, gold: [0, 0], immune: ['asleep'], tint: '#c8c2b4', size: 0.7 },
  // the Delta, alone (#224), a brute on MONSTERS §4.4's line at 12: it carries disease
  { id: 'bull_toad', name: 'Bull Toad', plural: 'Bull Toads', sprite: 'bull_toad', kind: 'beast', look: 'It could swallow Ottilie whole.', level: 12, hp: 169, ac: 16, attack: 9, dice: 3, sides: 7, bonus: 4, speed: 8, xp: 947, gold: [0, 0], inflict: { cond: 'diseased', chance: 0.15 }, tint: '#5a3e26', size: 1.4 },
];
