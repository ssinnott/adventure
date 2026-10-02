// The Whitespine's part of the world map: its three zones, the plate of its one dungeon, and its
// sites. docs/areas/whitespine.md is its brief (#498). Spread into the plan until the area's first box
// lists it (#499).
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  { id: 'sheerpoint', name: 'Sheer Point', area: 'whitespine', band: [23, 24], seeds: [[282, 244], [276, 262]] },
  { id: 'highspine', name: 'The High Spine', area: 'whitespine', band: [23, 24], seeds: [[292, 310], [290, 350]] },
  { id: 'monksvale', name: 'Monks\' Vale', area: 'whitespine', band: [22, 23], seeds: [[322, 344], [318, 318]], label: [318, 326] },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'monastery', name: 'Highcell', kind: 'dungeon', planned: true, band: [23, 24], at: [322, 346] }, // the Monastery, two levels behind J11's gate at 322,342 (#500); its plate moved from K12 (#443, call 9)
];

export const SITES: readonly AtlasSite[] = [
  // IX. The Whitespine (docs/areas/whitespine.md §10: the Crown's and the Lanterns' English, kept).
  { name: 'Highcell', icon: 'monastery', at: [322, 342], label: 'right', planned: true }, // the Monastery
  { name: 'Peak Stone', icon: 'stone', at: [292, 318], label: 'below', planned: true },
  { name: 'Giants', icon: 'label', at: [300, 296], planned: true },
  { name: 'Stairwatch', icon: 'tower', at: [270, 312], label: 'right', planned: true }, // over the Giants' Stair: the Knight's third prestige
  { name: 'Spine Summit', icon: 'camp', at: [300, 328], label: 'right', planned: true }, // the Monk's third prestige
  { name: 'Rook\'s Nest', icon: 'cave', at: [286, 230], label: 'right', planned: true }, // on Sheer Point, over the Hand's causeway: the Thief's third prestige
];
