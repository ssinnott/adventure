// Saltreach's part of the world map: its three zones, the plates of its town and temples, and its
// sites. docs/areas/saltreach.md is its brief.
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  { id: 'upperwater', name: 'The Upper Water', area: 'saltreach', band: [10, 11], seeds: [[56, 76], [80, 56], [36, 110]] },
  { id: 'delta', name: 'The Delta', area: 'saltreach', band: [10, 12], seeds: [[62, 150], [84, 136]], label: [76, 128],
    maps: [{ map: 'delta_d5', at: [104, 126] }, { map: 'delta_c5', at: [72, 126] }, { map: 'delta_b5', at: [40, 126] }, { map: 'delta_b6', at: [40, 158] }] },
  { id: 'saltings', name: 'The Saltings', area: 'saltreach', band: [11, 12], seeds: [[98, 194], [70, 194]],
    maps: [{ map: 'saltings_c6', at: [72, 158] }, { map: 'saltings_c7', at: [72, 190] }] },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'saltmouth', kind: 'town', at: [99, 180] }, // on C6 behind its gate at 26,19, the Salt Road's end (#151, #177)
  { id: 'c5_rift', kind: 'dungeon', band: [10, 11], at: [92, 138] }, // the brine Rift on its islet off the causeway, C5 (#170)
  { id: 'b5_rift_n', kind: 'dungeon', band: [11, 12], at: [56, 131] }, // the brine Rift on the hummock north of the duckboards, B5 (#173)
  { id: 'b5_rift_s', kind: 'dungeon', band: [11, 12], at: [66, 152] }, // the brine Rift on the hummock over the channel, B5 (#173)
  { id: 'drowned_temples', name: 'Drowned Temples', kind: 'dungeon', planned: true, band: [11, 12], at: [56, 160] },
];

export const SITES: readonly AtlasSite[] = [
  // III. Saltreach.
  { name: 'Rietum', icon: 'village', at: [80, 80], label: 'right', planned: true },
  { name: 'Saltmouth', icon: 'port', at: [98, 177], label: 'left' }, // at the gate on C6, 26,19 (#176, #177)
  { name: 'Tide Stone', icon: 'stone', map: 'delta_b5', at: [8.5, 14.5], label: 'below' }, // the plinth on Stienwierde, the stone mound, empty (saltreach.md §10)
  { name: 'Drowned Temples', icon: 'sunken', map: 'delta_b6', at: [16.5, 12.5], label: 'below' }, // the dry door, its way in (#175 opens it)
  { name: 'Sjonghol', icon: 'cave', at: [103, 76], label: 'right', planned: true }, // the singing hollow in Kestrel Edge's cliffs: the Monk's second prestige; a square west into C3, so D3 does not hold it (#71)
];
