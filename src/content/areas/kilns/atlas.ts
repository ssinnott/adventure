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
  { id: 'ironfells', name: 'The Iron Fells', area: 'kilns', band: [16, 17], maps: [{ map: 'ironfells_m3', at: [392, 62] }, { map: 'ironfells_n3', at: [424, 62] }], seeds: [[432, 50], ...HELD_AT_M2, ...seam(93)] },
  { id: 'kilnsheart', name: 'The Kilns', area: 'kilns', band: [16, 18], maps: [{ map: 'kilnsheart_n4', at: [424, 94] }], seeds: [[452, 120], [470, 160], ...seam(94)] },
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
  { name: 'Anvilhall', icon: 'fortress', at: [452, 70], label: 'below', planned: true }, // at the gate on N3, 28,8 (#458, #459)
  { name: 'Tiefzeche', icon: 'mine', at: [440, 96], label: 'below', planned: true }, // the Deep Mines
  { name: 'Gluthutte', icon: 'forge', at: [436, 126], label: 'below', planned: true }, // the Forges
  { name: 'Anvil Stone', icon: 'stone', at: [468, 142], label: 'below', planned: true },
  { name: 'Feuerstollen', icon: 'cave', at: [478, 178], label: 'below', planned: true }, // the Lava Tubes
  { name: 'Kilnhaven', icon: 'port', at: [391, 162], label: 'right', planned: true },
  { name: 'Erzkamm', icon: 'cave', at: [432, 44], label: 'below', planned: true }, // Iron Crag: the Barbarian's second prestige
];
