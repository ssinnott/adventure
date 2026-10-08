// The Kilns' part of the world map: its three zones, the plates of its towns and dungeons, and its
// sites. docs/areas/kilns.md is its brief (#456).
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';

/**
 * The Iron Fells' line held at M2's east edge, a seed a square down x 424 from the rim at y 33 to 61: a
 * laid map seeds the zones' walk from every square of it, so without these Lanternwood would run on
 * from M2 into the Fells (#202, #429).
 */
const HELD_AT_M2: [number, number][] = Array.from({ length: 29 }, (_, i): [number, number] => [424, 33 + i]);

/**
 * The line between the Fells and the heart held on the seam of rows 3 and 4 under O3, a seed a square
 * either side of it from x 456 to 487, the Fells' along y 93 and the heart's along y 94: laid whole in
 * the Fells, M3 and N3 seed the walk from every square of them, and without these the Fells would run
 * on south into O4, which is the heart's (#457, docs/areas/kilns.md §4). Under N3 the seam is N3's own
 * south edge and N4's north (#458, #461), each laid in its zone.
 */
const seam = (y: number): [number, number][] => Array.from({ length: 32 }, (_, i): [number, number] => [456 + i, y]);

export const ZONES: readonly AtlasZone[] = [
  { id: 'ironfells', name: 'The Iron Fells', area: 'kilns', band: [16, 17], maps: [{ map: 'ironfells_m3', at: [392, 62] }, { map: 'ironfells_n3', at: [424, 62] }, { map: 'ironfells_n2', at: [424, 30] }], seeds: [[432, 50], ...HELD_AT_M2, ...seam(93)] },
  { id: 'kilnsheart', name: 'The Kilns', area: 'kilns', band: [16, 18], maps: [{ map: 'kilnsheart_n4', at: [424, 94] }, { map: 'kilnsheart_n5', at: [424, 126] }, { map: 'kilnsheart_n6', at: [424, 158] }, { map: 'kilnsheart_o5', at: [456, 126] }], seeds: [[452, 120], [470, 160], ...seam(94)] },
  { id: 'kilnmouth', name: 'Kilnmouth', area: 'kilns', band: [16, 18], maps: [{ map: 'kilnmouth_m6', at: [392, 158] }, { map: 'kilnmouth_l6', at: [360, 158] }], seeds: [[408, 160], [404, 140]] },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'anvilhall', kind: 'town', at: [452, 66] }, // on N3, in the hill behind its gate at 28,8 (#458, #459)
  { id: 'kilnhaven', kind: 'town', at: [385, 162] }, // the ore port, on L6 over the harbour behind its gate at 28,4 (#468, #469)
  { id: 'deep_mines', kind: 'dungeon', at: [440, 104] }, // the Tiefzeche, the Deep Mines: the workings, under N4's shaft at 16,2 (#461, #462)
  { id: 'deep_mines2', kind: 'dungeon', at: [440, 110] }, // the old workings, below them
  { id: 'deep_mines3', kind: 'dungeon', at: [440, 116] }, // the clean corridor, at the bottom
  { id: 'anvil_stone', kind: 'dungeon', at: [468, 142] }, // the Anvil Stone's Rift, the Slag Rift: one level, on the tear on O5, 12,16 (#464, #465)
  { id: 'lava_tubes', name: 'Feuerstollen', kind: 'dungeon', planned: true, band: [17, 18], at: [470, 194] }, // the Lava Tubes, two levels under O6 (#466)
];

export const SITES: readonly AtlasSite[] = [
  // VI. The Kilns (docs/areas/kilns.md §10 has the dwarves' names).
  { name: 'Anvilhall', icon: 'fortress', at: [452, 70], label: 'below' }, // at the gate on N3, 28,8 (#458, #459)
  { name: 'Tiefzeche', icon: 'mine', at: [440, 96], label: 'below' }, // the Deep Mines, at the shaft on N4, 16,2 (#461, #462)
  { name: 'Gluthutte', icon: 'forge', map: 'kilnsheart_n5', at: [12.5, 1.5], label: 'below' }, // the Forges: the smelter on N5 (#463)
  { name: 'Anvil Stone', icon: 'stone', map: 'kilnsheart_o5', at: [12.5, 10.5], label: 'below' }, // the Stone on its anvil of rock on O5, 12,10 (#464)
  { name: 'Feuerstollen', icon: 'cave', at: [478, 178], label: 'below', planned: true }, // the Lava Tubes
  { name: 'Kilnhaven', icon: 'port', at: [388, 162], label: 'right' }, // at the gate on L6, 28,4 (#468, #469)
  { name: 'Erzkamm', icon: 'cave', map: 'ironfells_n2', at: [8.5, 14.5], label: 'below' }, // Iron Crag: the cave in the crag on N2, 8,14, the Barbarian's second prestige (#460)
];
