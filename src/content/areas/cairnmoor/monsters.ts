// Cairnmoor's monsters, band 18-20: High Moor and the Cairnfield. `sprite` names the drawing
// (src/ui/sprites.ts); the numbers are the combat model's. A group on a map is a list of these ids,
// and any area's maps may place them.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings Cairnmoor's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'raven', 'bog_light', 'bog_body', 'moor_hound', 'cairn_wight', 'tor_troll', 'cairn_king',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the cairns, from N7 on (#476), fodder on MONSTERS §4.4's line at 18: it flies, reaching the back row; eight to a group
  { id: 'raven', name: 'Raven', plural: 'Ravens', sprite: 'raven', kind: 'beast', look: 'They were here first.', level: 18, hp: 132, ac: 19, attack: 10, dice: 2, sides: 8, bonus: 4, speed: 12, xp: 357, gold: [0, 0], ranged: true, tint: '#1e1d24', size: 0.4 },
  // over the bog by night and round the ring (#477, #478), a controller at 18: it flies, and its touch takes spell points
  // before hit points in place of the line's paralysis. On MONSTERS §4.4's line (204 hp, 3d8+2) four end the day in four
  // fights, so it comes down whole, hit points and blow together (0.575), to about the day's eight and a half
  { id: 'bog_light', name: 'Bog Light', plural: 'Bog Lights', sprite: 'bog_light', kind: 'rift', look: 'A light over the bog, where nobody is.', level: 18, hp: 117, ac: 20, attack: 11, dice: 2, sides: 6, bonus: 2, speed: 12, xp: 713, gold: [0, 0], ranged: true, drain: 'sp', tint: '#bff0b0', size: 0.5 },
  // out of the peat, from N7 on (#476), a soldier on MONSTERS §4.4's line at 18: it carries disease, at 0.2 a hit
  { id: 'bog_body', name: 'Bog Body', plural: 'Bog Bodies', sprite: 'bog_body', kind: 'dead', look: 'Leather over bone, and a rope still round its neck.', level: 18, hp: 200, ac: 20, attack: 11, dice: 3, sides: 7, bonus: 5, speed: 11, xp: 713, gold: [0, 0], inflict: { cond: 'diseased', chance: 0.2 }, tint: '#5e3f28', size: 0.9 },
  // the moor by night, from N7 on (#476), a skirmisher on MONSTERS §4.4's line at 19: its bite holds (paralysis, 0.15)
  { id: 'moor_hound', name: 'Moor Hound', plural: 'Moor Hounds', sprite: 'moor_hound', kind: 'beast', look: 'The Downs\' black dog, grown old and huge.', level: 19, hp: 270, ac: 21, attack: 11, dice: 3, sides: 7, bonus: 5, speed: 15, xp: 753, gold: [0, 0], inflict: { cond: 'paralysed', chance: 0.15 }, tint: '#2e2c31', size: 0.9 },
  // the cairns of N8 and Carn Dubh (#479, #480), a controller at 19 as MONSTERS §3.3 makes a wight (#537): the line's,
  // its hold a curse (0.2); its grave-gold is what it carries
  { id: 'cairn_wight', name: 'Cairn Wight', plural: 'Cairn Wights', sprite: 'cairn_wight', kind: 'dead', look: 'A shroud with grave-gold at its throat.', level: 19, hp: 232, ac: 21, attack: 11, dice: 4, sides: 8, bonus: 3, speed: 12, xp: 753, gold: [20, 60], inflict: { cond: 'cursed', chance: 0.2 }, tint: '#a29e8e', size: 0.95 },
  // the tors by night (#477, #478), a brute at 19 as MONSTERS §3.3 makes a troll (#537): three quarters of the line's hit
  // points, mending a tenth of them each round but a round fire struck it; a tall one, drawn inside TALL_REACH
  { id: 'tor_troll', name: 'Tor Troll', plural: 'Tor Trolls', sprite: 'tor_troll', kind: 'beast', look: 'A tor that stood up.', level: 19, hp: 397, ac: 19, attack: 12, dice: 5, sides: 8, bonus: 4, speed: 8, xp: 1507, gold: [0, 0], regen: 40, tint: '#807d74', size: 1.6 },
  // on its seat at the end of Carn Dubh's lower chamber (#480), the area's boss at 20 on MONSTERS §4.4's boss line, for
  // #480's gate to tune; it curses as its wights do (0.2)
  { id: 'cairn_king', name: 'The Cairn King', plural: 'Cairn Kings', sprite: 'cairn_king', kind: 'dead', look: 'Crowned, and older than the crown.', level: 20, hp: 1113, ac: 23, attack: 14, dice: 20, sides: 8, bonus: 20, speed: 13, xp: 12693, gold: [150, 300], inflict: { cond: 'cursed', chance: 0.2 }, tint: '#b9a682', size: 1.3 },
];
