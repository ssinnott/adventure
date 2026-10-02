// Cairnmoor's part of the world map: its two zones, the plate of its one dungeon, and its sites.
// docs/areas/cairnmoor.md is its brief (#475). Spread into the plan until the area's first box lists
// it (#476).
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  { id: 'highmoor', name: 'High Moor', area: 'cairnmoor', band: [18, 19], seeds: [[462, 212], [488, 230]] },
  { id: 'cairnfield', name: 'The Cairnfield', area: 'cairnmoor', band: [19, 20], seeds: [[426, 236], [412, 220]], label: [418, 214] },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'cairns', name: 'Carn Dubh', kind: 'dungeon', planned: true, band: [19, 20], at: [430, 246] }, // the Cairns, two levels under N8 (#480)
];

export const SITES: readonly AtlasSite[] = [
  // VII. Cairnmoor (docs/areas/cairnmoor.md §10 has the hill folk's names).
  { name: 'Fionnlios', icon: 'ring', at: [462, 214], label: 'below', planned: true }, // the Stone Ring
  { name: 'Carn Dubh', icon: 'barrow', at: [430, 240], label: 'below', planned: true }, // the Cairns
  { name: 'Watcher\'s Hut', icon: 'lodge', at: [466, 208], label: 'right', planned: true }, // the Sorcerer's second prestige
];
