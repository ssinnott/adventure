// The Shelf's part of the world map: its zones (the built one, where the atlas lays its map, and the
// planned), the plates of its towns and dungeons, and its sites. src/content/index.ts merges them into
// ATLAS with the rest of the world, which is planned (src/content/atlas.ts).
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  { id: 'shelf', name: 'The Shelf', area: 'shelf', map: 'shelf', at: [200, 30] },
  { id: 'downs', name: 'Harrow Downs', area: 'shelf', band: [2, 5], seeds: [[160, 48], [128, 66], [180, 30]], label: [132, 60] },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'harrow', kind: 'town', at: [216, 22] },
  { id: 'mill', kind: 'dungeon', at: [224, 84] },
  { id: 'greywater1', kind: 'dungeon', at: [196, 68] },
  { id: 'greywater2', kind: 'dungeon', at: [196, 74] },
];

export const SITES: readonly AtlasSite[] = [
  // I. The Shelf, from its map: Harrow's walls at 14-18,1-3, the Ashcombe farm, the Greywater cliffs.
  { name: 'Harrow', icon: 'city', map: 'shelf', at: [16.5, 2.4], label: 'right' },
  { name: 'Harrow Stone', icon: 'stone', map: 'shelf', at: [21.5, 4], label: 'none', planned: true },
  { name: 'Ashcombe', icon: 'farm', map: 'shelf', at: [26.5, 20.2], label: 'below' },
  { name: 'Greywater', icon: 'cave', map: 'shelf', at: [2.5, 27.4], label: 'below' },
  { name: 'Warden Pass', icon: 'gate', map: 'shelf', at: [31.5, 8.6], label: 'none' },
  { name: 'Gullwick', icon: 'village', at: [172, 70], label: 'below', planned: true },
  { name: 'Harrow Light', icon: 'lighthouse', at: [140, 88], label: 'below', planned: true },
  { name: 'Captain\'s Farm', icon: 'farm', at: [176, 42], label: 'right', planned: true }, // the Knight's second prestige
];
