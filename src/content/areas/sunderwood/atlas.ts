// Sunderwood's part of the world map: its two zones, the plates of its town and dungeon, and its
// sites. docs/areas/sunderwood.md is its brief.
import type { AtlasZone, AtlasPlace, AtlasSite, AtlasLink } from '../../../game/atlas.ts';
import { laid } from '../../../game/atlas.ts';
import { PLAN } from '../../atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  { id: 'eaves', name: 'The Eaves', area: 'sunderwood', band: [14, 15], maps: [laid(PLAN, 'eaves_i2'), laid(PLAN, 'eaves_j2'), laid(PLAN, 'eaves_k2'), laid(PLAN, 'eaves_k3'), laid(PLAN, 'eaves_j3')], seeds: [[292, 40], [300, 86]], road: ['eaves_i2:i2_bears1', 'eaves_i2:i2_bears2', 'eaves_j2:j2_bears', 'eaves_j2:j2_hounds', 'eaves_k2:k2_hounds', 'eaves_k2:k2_bears'] },
  { id: 'lanternwood', name: 'Lanternwood', area: 'sunderwood', band: [15, 16], maps: [laid(PLAN, 'lanternwood_l2'), laid(PLAN, 'lanternwood_m2'), laid(PLAN, 'lanternwood_l3'), laid(PLAN, 'lanternwood_l4'), laid(PLAN, 'lanternwood_k4')], seeds: [[372, 50]], label: [378, 84], road: ['lanternwood_l2:l2_lamp_moths', 'lanternwood_l2:l2_bears', 'lanternwood_m2:m2_hounds'] },
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

export const LINKS: readonly AtlasLink[] = [
  { from: 'eaves', to: 'lanternwood', kind: 'road', a: [330, 56], b: [346, 56], note: 'rope bridge' },
  { from: 'eaves', to: 'the_sunder', kind: 'enter', a: [338, 70] },
  { from: 'lanternwood', to: 'lantern_watch', kind: 'enter', a: [372, 46] },
];
