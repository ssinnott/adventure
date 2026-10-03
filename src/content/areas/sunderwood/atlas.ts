// Sunderwood's part of the world map: its two zones, the plates of its town and dungeon, and its
// sites. docs/areas/sunderwood.md is its brief.
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  { id: 'eaves', name: 'The Eaves', area: 'sunderwood', band: [14, 15], maps: [{ map: 'eaves_i2', at: [264, 30] }, { map: 'eaves_j2', at: [296, 30] }, { map: 'eaves_k2', at: [328, 30] }, { map: 'eaves_k3', at: [328, 62] }, { map: 'eaves_j3', at: [296, 62] }], seeds: [[292, 40], [300, 86]] },
  { id: 'lanternwood', name: 'Lanternwood', area: 'sunderwood', band: [15, 16], maps: [{ map: 'lanternwood_l2', at: [360, 30] }, { map: 'lanternwood_m2', at: [392, 30] }, { map: 'lanternwood_l3', at: [360, 62] }, { map: 'lanternwood_l4', at: [360, 94] }, { map: 'lanternwood_k4', at: [328, 94] }], seeds: [[372, 50]], label: [378, 84] },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'lantern_watch', kind: 'town', at: [372, 42] }, // on L2 behind its gate at 12,16 (#200, #201)
  { id: 'k3_rift', kind: 'dungeon', band: [14, 15], at: [344, 88] }, // the black-glass Rift in the crystal's clearing, K3 (#198)
  { id: 'the_sunder', kind: 'dungeon', at: [320, 62] }, // the ledges, behind K3's door (#199)
  { id: 'the_sunder2', kind: 'dungeon', at: [320, 70] }, // the floor, below them
];

export const SITES: readonly AtlasSite[] = [
  // V. Sunderwood.
  { name: 'The steading', icon: 'farm', map: 'eaves_j2', at: [20.5, 7.5], label: 'below' }, // the pine-cutters', at the glass trees (#56's 29)
  { name: 'Lantern Watch', icon: 'tower', at: [372, 46], label: 'below' }, // at the gate on L2, 12,16 (#200, #201)
  { name: 'The Sunder', icon: 'rift', map: 'eaves_k3', at: [10.5, 8.5], label: 'right' }, // its door on the first landing (#199)
  { name: 'Sunderfall', icon: 'falls', map: 'eaves_k2', at: [8.5, 27.5], label: 'right' }, // its shrine, the Paladin's second prestige (#19)
];
