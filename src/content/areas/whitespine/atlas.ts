// The Whitespine's part of the world map: its three zones, the plates of its one dungeon's two levels,
// and its sites. docs/areas/whitespine.md is its brief (#498).
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  { id: 'sheerpoint', name: 'Sheer Point', area: 'whitespine', band: [23, 24], seeds: [[282, 244], [276, 262]] },
  { id: 'highspine', name: 'The High Spine', area: 'whitespine', band: [23, 24], seeds: [[292, 310], [290, 350]] },
  {
    id: 'monksvale', name: 'Monks\' Vale', area: 'whitespine', band: [22, 23], maps: [{ map: 'monksvale_j11', at: [296, 318] }], seeds: [[322, 344], [318, 318]], label: [318, 326],
    // The crossing line said over the pass (#166, #499): how the range feels to a company under its floor.
    crossing: { harder: 'The range begins here, and it is harder than the lochs behind.', warning: 'The range, and nothing in it would spare you. The way back over the pass is still open.' },
  },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'monastery', kind: 'dungeon', at: [322, 346] }, // Highcell, the Monastery: the upper house, through J11's gate at 26,24 (#499, #500); its plate moved from K12 (#443, call 9)
  { id: 'monastery2', kind: 'dungeon', at: [322, 352] }, // the lower house, down the night stair
];

export const SITES: readonly AtlasSite[] = [
  // IX. The Whitespine (docs/areas/whitespine.md §10: the Crown's and the Lanterns' English, kept).
  { name: 'Highcell', icon: 'monastery', at: [322, 342], label: 'right' }, // the Monastery, at the gate on J11, 26,24 (#499, #500)
  { name: 'Peak Stone', icon: 'stone', at: [292, 318], label: 'below', planned: true },
  { name: 'Giants', icon: 'label', at: [300, 296], planned: true },
  { name: 'Stairwatch', icon: 'tower', at: [270, 312], label: 'right', planned: true }, // over the Giants' Stair: the Knight's third prestige
  { name: 'Spine Summit', icon: 'camp', at: [300, 328], label: 'right' }, // the Monk's third prestige: the camp on J11, 4,10 (#499, #448)
  { name: 'Rook\'s Nest', icon: 'cave', at: [286, 230], label: 'right', planned: true }, // on Sheer Point, over the Hand's causeway: the Thief's third prestige
];
