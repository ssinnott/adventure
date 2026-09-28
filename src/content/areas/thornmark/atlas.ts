// Thornmark's part of the world map: its zones (a built one listing its maps, each at its box of the
// grid, and the planned), the plates of its towns and dungeons, and its sites. src/content/index.ts
// merges them into ATLAS with the rest of the world, which is planned (src/content/atlas.ts).
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  { id: 'thornmark', name: 'Thornmark', area: 'thornmark', maps: [{ map: 'thornmark', at: [232, 30] }] },
  { id: 'deepthorn', name: 'The Deepthorn', area: 'thornmark', band: [8, 10], seeds: [[262, 80], [250, 70], [284, 128]], label: [270, 98] },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'thornhold', kind: 'town', at: [256, 22] },
  { id: 'grove1', kind: 'dungeon', at: [254, 72] },
  { id: 'grove2', kind: 'dungeon', at: [254, 78] },
];

export const SITES: readonly AtlasSite[] = [
  // II. Thornmark, from its map, and the Deepthorn.
  { name: 'Thornhold', icon: 'hold', map: 'thornmark', at: [23, 3.2], label: 'below' },
  { name: 'Old Tower', icon: 'tower', map: 'thornmark', at: [4.8, 5], label: 'below' },
  { name: 'Barrow', icon: 'barrow', map: 'thornmark', at: [27.8, 8.4], label: 'below' },
  { name: 'The Grove', icon: 'grove', map: 'thornmark', at: [7.5, 28.6], label: 'right' },
  { name: 'Deepthorn Lodge', icon: 'lodge', at: [278, 112], label: 'below', planned: true }, // the Ranger's second prestige
];
