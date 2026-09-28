// The Foreland's part of the world map: its zones (a built one listing its maps, each at its box of the
// grid, and the planned), the plates of its towns and dungeons, and its sites. src/content/index.ts
// merges them into ATLAS with the rest of the world, which is planned (src/content/atlas.ts).
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  { id: 'shelf', name: 'The Foreland', area: 'shelf', maps: [{ map: 'shelf', at: [200, 30] }] },
  { id: 'downs', name: 'Callow Downs', area: 'shelf', band: [2, 5], maps: [{ map: 'downs_f2', at: [168, 30] }], seeds: [[160, 48], [128, 66], [180, 30]], label: [132, 60] },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'harrow', kind: 'town', at: [216, 22] },
  { id: 'mill', kind: 'dungeon', at: [224, 84] },
  { id: 'greywater1', kind: 'dungeon', at: [196, 68] },
  { id: 'greywater2', kind: 'dungeon', at: [196, 74] },
];

export const SITES: readonly AtlasSite[] = [
  // I. The Foreland, from its map: Helmstow's walls at 14-18,1-3, the Ashcombe farm, the Brandy
  // Hole cliffs.
  { name: 'Helmstow', icon: 'city', map: 'shelf', at: [16.5, 2.4], label: 'right' },
  { name: 'Lodestone', icon: 'stone', map: 'shelf', at: [21.5, 4], label: 'none', planned: true },
  { name: 'Ashcombe', icon: 'farm', map: 'shelf', at: [26.5, 20.2], label: 'below' },
  { name: 'Brandy Hole', icon: 'cave', map: 'shelf', at: [2.5, 27.4], label: 'below' },
  { name: 'The Scarth', icon: 'gate', map: 'shelf', at: [31.5, 8.6], label: 'none' },
  { name: 'Gullwick', icon: 'village', at: [172, 70], label: 'below', planned: true },
  { name: 'Crowness Light', icon: 'lighthouse', at: [140, 88], label: 'below', planned: true },
  { name: 'Coldharbour', icon: 'farm', map: 'downs_f2', at: [8.5, 12.5], label: 'right' }, // the Knight's second prestige
];
