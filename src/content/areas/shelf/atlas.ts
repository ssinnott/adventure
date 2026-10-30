// The Foreland's part of the world map: its zones (a built one listing its maps, each at its box of the
// grid, and the planned), the plates of its towns and dungeons, and its sites. src/content/index.ts
// merges them into ATLAS with the rest of the world, which is planned (src/content/atlas.ts).
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';
import { laid } from '../../../game/atlas.ts';
import { PLAN } from '../../atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  { id: 'shelf', name: 'The Foreland', area: 'shelf', maps: [laid(PLAN, 'shelf', 'G2')], road: ['shelf:road_rats', 'shelf:hill_wolves'] },
  { id: 'downs', name: 'Callow Downs', area: 'shelf', band: [2, 5], maps: [laid(PLAN, 'downs_f2'), laid(PLAN, 'downs_f3'), laid(PLAN, 'downs_e3'), laid(PLAN, 'downs_e2'), laid(PLAN, 'downs_d2'), laid(PLAN, 'downs_d3'), laid(PLAN, 'downs_d4'), laid(PLAN, 'downs_e4')], seeds: [[160, 48], [128, 66], [180, 30]], label: [132, 60], road: ['downs_f2:f2_bandits'] },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'harrow', kind: 'town', at: [216, 22] },
  { id: 'keep', kind: 'town', at: [216, 16] },
  { id: 'mill', kind: 'dungeon', at: [157, 66] },
  { id: 'greywater1', kind: 'dungeon', at: [196, 68] },
  { id: 'greywater2', kind: 'dungeon', at: [196, 74] },
  { id: 'berth', kind: 'dungeon', at: [108, 54] }, // below the Berth's mouth on D2 (116,42), clear of the Cradle
  { id: 'hag_hole', kind: 'dungeon', band: [30, 32], at: [140, 100] }, // the lair, the sea cave behind E4's 3,6, where the Hag keeps the Hagstone (#837, #845, #846)
];

export const SITES: readonly AtlasSite[] = [
  // I. The Foreland, from its map: Helmstow's walls at 12-20,1-3, the Ellerby farm, the Brandy
  // Hole cliffs.
  { name: 'Helmstow', icon: 'city', map: 'shelf', at: [16.5, 2.4], label: 'right' },
  { name: 'Lodestone', icon: 'stone', map: 'shelf', at: [21.5, 4], label: 'none' },
  { name: 'Ellerby', icon: 'farm', map: 'shelf', at: [26.5, 20.2], label: 'below' },
  { name: 'Brandy Hole', icon: 'cave', map: 'shelf', at: [2.5, 27.4], label: 'below' },
  { name: 'The Scarth', icon: 'gate', map: 'shelf', at: [31.5, 8.6], label: 'none' },
  { name: 'Gullwick', icon: 'village', map: 'downs_f3', at: [4.5, 8.5], label: 'below' },
  { name: 'Crowness Light', icon: 'lighthouse', map: 'downs_e3', at: [20.5, 28.5], label: 'below' },
  { name: 'Ashcombe', icon: 'farm', map: 'downs_e3', at: [23.5, 4.2], label: 'below' },
  { name: 'Coldharbour', icon: 'farm', map: 'downs_f2', at: [8.5, 12.5], label: 'right' }, // the Knight's second prestige
  { name: 'The Berth', icon: 'ruin', map: 'downs_d2', at: [10.5, 12.5], label: 'below' }, // the Queen's barrow, opened (Thornmark claims the barrow's icon); its dungeon is #70's
];
