// The Whitespine's part of the world map: its three zones, the plate of its one dungeon, and its
// sites. docs/areas/whitespine.md is its brief (#498).
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  { id: 'sheerpoint', name: 'Sheer Point', area: 'whitespine', band: [23, 24], seeds: [[282, 244], [276, 262]] },
  {
    id: 'highspine', name: 'The High Spine', area: 'whitespine', band: [23, 24], maps: [{ map: 'highspine_i11', at: [264, 318] }, { map: 'highspine_i10', at: [264, 286] }], seeds: [[292, 310], [290, 350]],
    // The crossing line said over the crest from the vale (#166, #501).
    crossing: { harder: 'Over the crest the wind is at you, and the range is harder still.', warning: 'Nothing on this crest would spare you. The way back down to the vale is still open.' },
  },
  {
    id: 'monksvale', name: 'Monks\' Vale', area: 'whitespine', band: [22, 23], maps: [{ map: 'monksvale_j11', at: [296, 318] }], seeds: [[322, 344], [318, 318]], label: [318, 326],
    // The crossing line said over the pass (#166, #499): how the range feels to a company under its floor.
    crossing: { harder: 'The range begins here, and it is harder than the lochs behind.', warning: 'The range, and nothing in it would spare you. The way back over the pass is still open.' },
  },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'monastery', name: 'Highcell', kind: 'dungeon', planned: true, band: [23, 24], at: [322, 346] }, // the Monastery, two levels behind J11's gate at 322,342 (#500); its plate moved from K12 (#443, call 9)
];

export const SITES: readonly AtlasSite[] = [
  // IX. The Whitespine (docs/areas/whitespine.md §10: the Crown's and the Lanterns' English, kept).
  { name: 'Highcell', icon: 'monastery', at: [322, 342], label: 'right', planned: true }, // the Monastery
  { name: 'Peak Stone', icon: 'stone', at: [292, 318], label: 'below' }, // whole, on I11 at 28,0 (#501)
  { name: 'Giants', icon: 'label', at: [300, 296], planned: true },
  { name: 'Stairwatch', icon: 'tower', at: [270, 312], label: 'right' }, // over the Giants' Stair: the Knight's third prestige; the ledge on I10, 6,26 (#502, #448)
  { name: 'Spine Summit', icon: 'camp', at: [300, 328], label: 'right' }, // the Monk's third prestige: the camp on J11, 4,10 (#499, #448)
  { name: 'Rook\'s Nest', icon: 'cave', at: [286, 230], label: 'right', planned: true }, // on Sheer Point, over the Hand's causeway: the Thief's third prestige
];
