// Rimewater's monsters, band 20-22: Loch Fada and Loch Fuar, the lochs under the glacier, and the
// Sleepers' Bay under the cold loch. `sprite` names the drawing (src/ui/sprites.ts); the numbers are
// the combat model's. A group on a map is a list of these ids, and any area's maps may place them.
// Drawn ahead of the area's first map, so src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings Rimewater's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'ice_pike', 'snow_lynx', 'tallyman', 'ice_bear', 'bay_keeper', 'matron',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // under the lochs' ice (#486), a skirmisher on MONSTERS §4.4's line at 20: a group placed on ice, which strikes a company on it at one square
  { id: 'ice_pike', name: 'Ice Pike', plural: 'Ice Pike', sprite: 'ice_pike', kind: 'beast', look: "The ice under Ottilie's feet has an eye in it.", level: 20, hp: 239, ac: 21, attack: 12, dice: 3, sides: 7, bonus: 4, speed: 15, xp: 793, gold: [0, 0], tint: '#56634a', size: 0.85 },
  // the pinewoods (#486), a skirmisher on MONSTERS §4.4's line at 20: it leaps at the back row
  { id: 'snow_lynx', name: 'Snow Lynx', plural: 'Snow Lynxes', sprite: 'snow_lynx', kind: 'beast', look: 'Grey, tufted, and it has already jumped.', level: 20, hp: 239, ac: 21, attack: 12, dice: 3, sides: 7, bonus: 4, speed: 15, xp: 793, gold: [0, 0], ranged: true, tint: '#9c978c', size: 0.8 },
  // up through Rime Lodge's ice-hole on the fourth night (#487), a caller on a soldier's numbers at 20 (MONSTERS §4.2), with six
  // knockers: it calls three more at a half a turn, as #537's test caller does, room for one call beside the six
  { id: 'tallyman', name: 'Tallyman', plural: 'Tallymen', sprite: 'tallyman', kind: 'machine', look: 'It stops and clicks, once for each of you.', level: 20, hp: 241, ac: 21, attack: 12, dice: 3, sides: 8, bonus: 4, speed: 11, xp: 793, gold: [0, 0], calls: { monsters: ['knocker', 'knocker', 'knocker'], chance: 0.5 }, tint: '#6e7884', size: 0.6 },
  // the glacier's edge (#486), a brute on MONSTERS §4.4's line at 21
  { id: 'ice_bear', name: 'Ice Bear', plural: 'Ice Bears', sprite: 'ice_bear', kind: 'beast', look: 'White, and bigger than the last one.', level: 21, hp: 518, ac: 20, attack: 13, dice: 4, sides: 8, bonus: 6, speed: 8, xp: 1667, gold: [0, 0], tint: '#e4dfd2', size: 1.3 },
  // the Sleepers' Bay (#490), a controller on MONSTERS §4.4's line at 21: its touch puts to sleep, at 0.3 a hit, and it mends
  // the most hurt of its group one turn in four (at one in two the harness's bot broke off a fifth of its days at fifteen rounds)
  { id: 'bay_keeper', name: 'Bay Keeper', plural: 'Bay Keepers', sprite: 'bay_keeper', kind: 'machine', look: 'Tall and grey, with too many fingers, and gentle.', level: 21, hp: 227, ac: 22, attack: 12, dice: 3, sides: 7, bonus: 5, speed: 12, xp: 833, gold: [0, 0], inflict: { cond: 'asleep', chance: 0.3 }, cast: { spells: ['heal'], chance: 0.25 }, tint: '#8d9399', size: 1.1 },
  // the bay's last row (#490), its boss at 22 on MONSTERS §4.4's boss line, for #490's gate to tune; it never comes back
  { id: 'matron', name: 'The Matron', plural: 'Matrons', sprite: 'matron', kind: 'machine', look: 'It has tended them for four hundred years.', level: 22, hp: 1145, ac: 24, attack: 15, dice: 20, sides: 8, bonus: 21, speed: 13, xp: 13973, gold: [0, 0], tint: '#b0b1ab', size: 1.45 },
];
