// Sunderwood's part of the world map: its two zones, the plates of its town and dungeon, and its
// sites. docs/areas/sunderwood.md is its brief.
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  { id: 'eaves', name: 'The Eaves', area: 'sunderwood', band: [14, 15], maps: [{ map: 'eaves_i2', at: [264, 30] }, { map: 'eaves_j2', at: [296, 30] }, { map: 'eaves_k2', at: [328, 30] }, { map: 'eaves_k3', at: [328, 62] }], seeds: [[292, 40], [300, 86]] },
  { id: 'lanternwood', name: 'Lanternwood', area: 'sunderwood', band: [15, 16], seeds: [[372, 50], [370, 96]], label: [378, 84] },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'lantern_watch', name: 'Lantern Watch', kind: 'town', planned: true, band: [14, 16], at: [372, 36] },
  { id: 'k3_rift', kind: 'dungeon', band: [14, 15], at: [344, 88] }, // the black-glass Rift in the crystal's clearing, K3 (#198)
  { id: 'the_sunder', name: 'The Sunder', kind: 'dungeon', planned: true, band: [15, 16], at: [320, 62] },
];

export const SITES: readonly AtlasSite[] = [
  // V. Sunderwood.
  { name: 'The steading', icon: 'farm', map: 'eaves_j2', at: [20.5, 7.5], label: 'below' }, // the pine-cutters', at the glass trees (#56's 29)
  { name: 'Lantern Watch', icon: 'tower', at: [372, 46], label: 'below', planned: true },
  { name: 'The Sunder', icon: 'rift', at: [338, 70], label: 'right', planned: true },
  { name: 'Sunderfall', icon: 'falls', map: 'eaves_k2', at: [8.5, 27.5], label: 'right' }, // its shrine, the Paladin's second prestige (#19)
];
