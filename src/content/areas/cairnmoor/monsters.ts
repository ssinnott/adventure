// Cairnmoor's monsters, band 18-20: High Moor and the Cairnfield. `sprite` names the drawing
// (src/ui/monsters/); the numbers are the combat model's. A group on a map is a list of these ids,
// and any area's maps may place them.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings Cairnmoor's monsters are drawn with, one kind to each. A family in src/ui/monsters/ must register every one. */
export const SPRITES = [
  'raven', 'bog_light', 'bog_body', 'moor_hound', 'cairn_wight', 'tor_troll', 'cairn_king',
  'rim_troll',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the cairns, from N7 on (#476), fodder on MONSTERS §4.4's line at 18: it flies, reaching the back row; eight to a group
  { id: 'raven', name: 'Raven', plural: 'Ravens', sprite: 'raven', kind: 'beast', look: 'They were here first.', level: 18, hp: 172, ac: 19, attack: 10, dice: 2, sides: 6, bonus: 3, speed: 12, xp: 357, gold: [0, 0], ranged: true, tint: '#1e1d24', size: 0.4 },
  // over the bog by night and round the ring (#477, #478), a controller at 18: it flies, and its touch takes spell points
  // before hit points in place of the line's paralysis. On MONSTERS §4.4's line (204 hp, 3d8+2) four end the day in four
  // fights, so it comes down whole, hit points and blow together (0.575), to about the day's eight and a half
  { id: 'bog_light', name: 'Bog Light', plural: 'Bog Lights', sprite: 'bog_light', kind: 'rift', look: 'A light over the bog, where nobody is.', level: 18, hp: 144, ac: 20, attack: 11, dice: 2, sides: 6, bonus: 3, speed: 12, xp: 713, gold: [0, 0], ranged: true, drain: 'sp', offLine: { role: 'controller', share: 0.575, why: 'four on the line end a company\'s day in four fights (#597)' }, tint: '#bff0b0', size: 0.5 },
  // out of the peat, from N7 on (#476), a soldier on MONSTERS §4.4's line at 18: it carries disease, at 0.2 a hit
  { id: 'bog_body', name: 'Bog Body', plural: 'Bog Bodies', sprite: 'bog_body', kind: 'dead', look: 'Leather over bone, and a rope still round its neck.', level: 18, hp: 292, ac: 20, attack: 11, dice: 3, sides: 8, bonus: 4, speed: 11, xp: 713, gold: [0, 0], inflict: { cond: 'diseased', chance: 0.2 }, tint: '#5e3f28', size: 0.9 },
  // the moor by night, from N7 on (#476), a skirmisher on MONSTERS §4.4's line at 19: its bite holds (paralysis, 0.15)
  { id: 'moor_hound', name: 'Moor Hound', plural: 'Moor Hounds', sprite: 'moor_hound', kind: 'beast', look: 'The Downs\' black dog, grown old and huge.', level: 19, hp: 338, ac: 21, attack: 11, dice: 4, sides: 8, bonus: 2, speed: 15, xp: 753, gold: [0, 0], inflict: { cond: 'paralysed', chance: 0.15 }, tint: '#2e2c31', size: 0.9 },
  // the cairns of N8 and Carn Dubh (#479, #480), a controller at 19 as MONSTERS §3.3 makes a wight (#537): the line's,
  // its hold a curse (0.2); its grave-gold is what it carries
  { id: 'cairn_wight', name: 'Cairn Wight', plural: 'Cairn Wights', sprite: 'cairn_wight', kind: 'dead', look: 'A shroud with grave-gold at its throat.', level: 19, hp: 339, ac: 21, attack: 11, dice: 3, sides: 7, bonus: 7, speed: 12, xp: 753, gold: [20, 60], inflict: { cond: 'cursed', chance: 0.2 }, tint: '#a29e8e', size: 0.95 },
  // the tors by night (#477, #478), a brute at 19 as MONSTERS §3.3 makes a troll (#537): three quarters of the line's hit
  // points, mending a tenth of them each round but a round fire struck it; a tall one, drawn inside TALL_REACH
  { id: 'tor_troll', name: 'Tor Troll', plural: 'Tor Trolls', sprite: 'tor_troll', kind: 'beast', look: 'A tor that stood up.', level: 19, hp: 483, ac: 19, attack: 12, dice: 6, sides: 8, bonus: 7, speed: 8, xp: 1507, gold: [0, 0], regen: 48, tint: '#807d74', size: 1.6 },
  // on its seat at the end of the hall under Carn Dubh (#480), the area's boss at 20; it never comes back, and it curses
  // as its wights do (0.2). Off MONSTERS §4.4's boss line (1,113 hp, 20d8+20, won 81% at 19 and 91% at 21), its hit
  // points and its blow are set for #480's gate: about half at its floor, 19, and nearly always at 21
  { id: 'cairn_king', name: 'The Cairn King', plural: 'Cairn Kings', sprite: 'cairn_king', kind: 'dead', look: 'Crowned, and older than the crown.', level: 20, hp: 1800, ac: 23, attack: 14, dice: 16, sides: 8, bonus: 14, speed: 13, xp: 12693, gold: [150, 300], inflict: { cond: 'cursed', chance: 0.2 }, offLine: 'Carn Dubh\'s boss, its hit points and its blow set by its gate (#480)', tint: '#b9a682', size: 1.3 },
  // the bounds' lair (#834): Bearn Liath, the cleft in the rim behind P7, where it keeps Torhide in the hollow under the
  // tops. The rim stood up, the lair's boss at 32 (MONSTERS §13): it mends each round but a round fire struck it (`regen`,
  // as the tor troll's), and stands at size 2, a tall boss drawn inside TALL_REACH. Drawn at the test troll's at 32 (797
  // hp, attack 19, 7d8+7, mending 80, a brute's 2,547 xp), it was won every time at 30 and at 32; set by the lair's pull
  // request at the gate's company, it stands three times as long and hits harder and more often, its armour, its pace
  // and its mending kept, won 59% at its floor of 30 and 89% at 32, and it pays the boss line's xp at 32
  // (docs/areas/cairnmoor.md §9, #834's 31)
  { id: 'rim_troll', name: 'The Rim Troll', plural: 'Rim Trolls', sprite: 'rim_troll', kind: 'beast', look: 'The rim stood up.', level: 32, hp: 2700, ac: 26, attack: 22, dice: 25, sides: 8, bonus: 18, speed: 8, xp: 20373, gold: [0, 0], regen: 80, offLine: 'Bearn Liath\'s boss, its hit points and its blow set by its gate at the lair\'s floor and two above, its mending the test troll\'s at 32 (#834)', tint: '#67717d', size: 2 },
];
