// Saltreach's part of the world map: its three zones, the plates of its town and temples, and its
// sites. docs/areas/saltreach.md is its brief.
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  { id: 'upperwater', name: 'The Upper Water', area: 'saltreach', band: [10, 11], seeds: [[56, 76], [80, 56], [36, 110]],
    maps: [{ map: 'upperwater_c3', at: [72, 62] }] },
  { id: 'delta', name: 'The Delta', area: 'saltreach', band: [10, 12], seeds: [[62, 150], [84, 136]], label: [76, 128],
    maps: [{ map: 'delta_d5', at: [104, 126] }, { map: 'delta_c5', at: [72, 126] }, { map: 'delta_c4', at: [72, 94] }, { map: 'delta_b5', at: [40, 126] }, { map: 'delta_b6', at: [40, 158] }] },
  { id: 'saltings', name: 'The Saltings', area: 'saltreach', band: [11, 12], seeds: [[98, 194], [70, 194]],
    maps: [{ map: 'saltings_c6', at: [72, 158] }, { map: 'saltings_c7', at: [72, 190] }] },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'saltmouth', kind: 'town', at: [99, 180] }, // on C6 behind its gate at 26,19, the Salt Road's end (#151, #177)
  { id: 'c5_rift', kind: 'dungeon', band: [10, 11], at: [92, 138] }, // the brine Rift on its islet off the causeway, C5 (#170)
  { id: 'b5_rift_n', kind: 'dungeon', band: [11, 12], at: [56, 131] }, // the brine Rift on the hummock north of the duckboards, B5 (#173)
  { id: 'b5_rift_s', kind: 'dungeon', band: [11, 12], at: [66, 152] }, // the brine Rift on the hummock over the channel, B5 (#173)
  { id: 'drowned_temples', kind: 'dungeon', at: [56, 160] }, // the upper temple, behind B6's dry door (#175)
  { id: 'drowned_temples2', kind: 'dungeon', at: [56, 166] }, // the choir, below it
];

export const SITES: readonly AtlasSite[] = [
  // III. Saltreach.
  { name: 'Rietum', icon: 'village', map: 'upperwater_c3', at: [5.5, 15.5], label: 'right' }, // the mound either side of the diep, C3 (#172)
  { name: 'Saltmouth', icon: 'port', at: [98, 177], label: 'left' }, // at the gate on C6, 26,19 (#176, #177)
  { name: 'Tide Stone', icon: 'stone', map: 'delta_b5', at: [8.5, 14.5], label: 'below' }, // the plinth on Stienwierde, the stone mound, empty (saltreach.md §10)
  { name: 'Drowned Temples', icon: 'sunken', map: 'delta_b6', at: [16.5, 12.5], label: 'below' }, // the dry door, its way in (#175)
  { name: 'Sjonghol', icon: 'cave', map: 'upperwater_c3', at: [29.5, 10.5], label: 'left' }, // the singing hollow, a cleft in Kestrel Edge's foot on C3: the Monk's second prestige (#71, #172)
];
