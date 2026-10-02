// The Kilns' part of the world map: its three zones, the plates of its towns and dungeons, and its
// sites. docs/areas/kilns.md is its brief (#456). Spread into the plan (content/atlas.ts) until the
// area's first box lists it (#457).
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  { id: 'ironfells', name: 'The Iron Fells', area: 'kilns', band: [16, 17], seeds: [[432, 50], [414, 66]] },
  { id: 'kilnsheart', name: 'The Kilns', area: 'kilns', band: [16, 18], seeds: [[452, 120], [470, 160]] },
  { id: 'kilnmouth', name: 'Kilnmouth', area: 'kilns', band: [17, 18], seeds: [[408, 160], [404, 140]] },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'anvilhall', name: 'Anvilhall', kind: 'town', planned: true, band: [16, 18], at: [452, 70] }, // behind N3's gate (#458, #459)
  { id: 'kilnhaven', name: 'Kilnhaven', kind: 'town', planned: true, band: [16, 18], at: [378, 158] }, // the ore port, behind L6's gate (#468, #469)
  { id: 'deep_mines', name: 'The Tiefzeche', kind: 'dungeon', planned: true, band: [16, 18], at: [440, 104] }, // the Deep Mines, three levels under N4 (#462)
  { id: 'anvil_stone', name: 'The Anvil Stone', kind: 'dungeon', planned: true, band: [17, 18], at: [468, 136] }, // the Stone's Rift, one level through O5's tear (#465)
  { id: 'lava_tubes', name: 'Feuerstollen', kind: 'dungeon', planned: true, band: [17, 18], at: [470, 194] }, // the Lava Tubes, two levels under O6 (#466)
];

export const SITES: readonly AtlasSite[] = [
  // VI. The Kilns (docs/areas/kilns.md §10 has the dwarves' names).
  { name: 'Anvilhall', icon: 'fortress', at: [452, 80], label: 'below', planned: true },
  { name: 'Tiefzeche', icon: 'mine', at: [440, 96], label: 'below', planned: true }, // the Deep Mines
  { name: 'Gluthutte', icon: 'forge', at: [436, 126], label: 'below', planned: true }, // the Forges
  { name: 'Anvil Stone', icon: 'stone', at: [468, 142], label: 'below', planned: true },
  { name: 'Feuerstollen', icon: 'cave', at: [478, 178], label: 'below', planned: true }, // the Lava Tubes
  { name: 'Kilnhaven', icon: 'port', at: [391, 162], label: 'right', planned: true },
  { name: 'Erzkamm', icon: 'cave', at: [432, 44], label: 'below', planned: true }, // Iron Crag: the Barbarian's second prestige
];
