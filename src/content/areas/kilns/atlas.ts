// The Kilns' part of the world map: its three zones, the plates of its towns and dungeons, and its
// sites. docs/areas/kilns.md is its brief (#456).
import type { AtlasZone, AtlasPlace, AtlasSite, AtlasLink } from '../../../game/atlas.ts';
import { laid } from '../../../game/atlas.ts';
import { PLAN } from '../../atlas.ts';

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
  // Over the pass and down the trail past the spoil heap's beetles (#457), then up the spur past the
  // low heap by the road and the high one under the crag's working, to Anvilhall's gate (#458).
  { id: 'ironfells', name: 'The Iron Fells', area: 'kilns', band: [16, 17], maps: [laid(PLAN, 'ironfells_m3'), laid(PLAN, 'ironfells_n3'), laid(PLAN, 'ironfells_n2'), laid(PLAN, 'ironfells_o3')], seeds: [[432, 50], ...HELD_AT_M2, ...seam(93)], road: ['ironfells_m3:m3_beetles1', 'ironfells_m3:m3_beetles2', 'ironfells_n3:n3_spoil_low', 'ironfells_n3:n3_spoil_high'] },
  // On down the trail past the fresh spoil below the Tiefzeche's shaft: the beetles at its head and
  // the salamanders at its warm end (#461).
  { id: 'kilnsheart', name: 'The Kilns', area: 'kilns', band: [16, 18], maps: [laid(PLAN, 'kilnsheart_n4'), laid(PLAN, 'kilnsheart_n5'), laid(PLAN, 'kilnsheart_n6'), laid(PLAN, 'kilnsheart_o5'), laid(PLAN, 'kilnsheart_o6'), laid(PLAN, 'kilnsheart_o4'), laid(PLAN, 'kilnsheart_p5'), laid(PLAN, 'kilnsheart_p6'), laid(PLAN, 'kilnsheart_p4')], seeds: [[452, 120], [470, 160], ...seam(94)], road: ['kilnsheart_n4:n4_beetles', 'kilnsheart_n4:n4_salamanders'] },
  // Up the branch from N6's fork past the warm kilns' east end, where the beetles overlook the road (#467).
  { id: 'kilnmouth', name: 'Kilnmouth', area: 'kilns', band: [16, 18], maps: [laid(PLAN, 'kilnmouth_m6'), laid(PLAN, 'kilnmouth_l6'), laid(PLAN, 'kilnmouth_m4'), laid(PLAN, 'kilnmouth_m5'), laid(PLAN, 'kilnmouth_k6'), laid(PLAN, 'kilnmouth_l7')], seeds: [[408, 160]], road: ['kilnmouth_m6:m6_beetles_east'] },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'anvilhall', kind: 'town', at: [452, 66] }, // on N3, in the hill behind its gate at 28,8 (#458, #459)
  { id: 'kilnhaven', kind: 'town', at: [385, 162] }, // the ore port, on L6 over the harbour behind its gate at 28,4 (#468, #469)
  { id: 'deep_mines', kind: 'dungeon', at: [440, 104] }, // the Tiefzeche, the Deep Mines: the workings, under N4's shaft at 16,2 (#461, #462)
  { id: 'deep_mines2', kind: 'dungeon', at: [440, 110] }, // the old workings, below them
  { id: 'deep_mines3', kind: 'dungeon', at: [440, 116] }, // the clean corridor, at the bottom
  { id: 'anvil_stone', kind: 'dungeon', at: [468, 142] }, // the Anvil Stone's Rift, the Slag Rift: one level, on the tear on O5, 12,16 (#464, #465)
  { id: 'lava_tubes', kind: 'dungeon', at: [470, 194] }, // Feuerstollen, the Lava Tubes: the fire adit, under O6's ridge at 22,20 (#466)
  { id: 'lava_tubes2', kind: 'dungeon', at: [470, 200] }, // the deep tubes, below it
  { id: 'seestollen', kind: 'dungeon', band: [19, 20], at: [340, 172] }, // the enclave, the first quay's galleries under K6's point, its grate at 20,16 (#831, #845)
  { id: 'randzeche', kind: 'dungeon', band: [30, 32], at: [499, 151] }, // the lair, the old working in the rim under P5, its adit at 11,23 (#831, #845, #846)
  { id: 'randzeche2', kind: 'dungeon', band: [30, 32], at: [499, 155] }, // the Dark Seam, below it, where the Steiger keeps the Erzhemd
];

export const SITES: readonly AtlasSite[] = [
  // VI. The Kilns (docs/areas/kilns.md §10 has the dwarves' names).
  { name: 'Anvilhall', icon: 'fortress', at: [452, 70], label: 'below' }, // at the gate on N3, 28,8 (#458, #459)
  { name: 'Tiefzeche', icon: 'mine', at: [440, 96], label: 'below' }, // the Deep Mines, at the shaft on N4, 16,2 (#461, #462)
  { name: 'Gluthutte', icon: 'forge', map: 'kilnsheart_n5', at: [12.5, 1.5], label: 'below' }, // the Forges: the smelter on N5 (#463)
  { name: 'Anvil Stone', icon: 'stone', map: 'kilnsheart_o5', at: [12.5, 10.5], label: 'below' }, // the Stone on its anvil of rock on O5, 12,10 (#464)
  { name: 'Feuerstollen', icon: 'cave', map: 'kilnsheart_o6', at: [22.5, 20.5], label: 'below' }, // the Lava Tubes: the adit in the ridge on O6, 22,20 (#466)
  { name: 'Kilnhaven', icon: 'port', at: [388, 162], label: 'right' }, // at the gate on L6, 28,4 (#468, #469)
  { name: 'Erzkamm', icon: 'cave', map: 'ironfells_n2', at: [8.5, 14.5], label: 'below' }, // Iron Crag: the cave in the crag on N2, 8,14, the Barbarian's second prestige (#460)
];

export const LINKS: readonly AtlasLink[] = [
  { from: 'ironfells', to: 'anvilhall', kind: 'enter', a: [452, 70] },
  { from: 'ironfells', to: 'deep_mines', kind: 'enter', a: [440, 96] },
  { from: 'kilnsheart', to: 'anvil_stone', kind: 'enter', a: [468, 142] },
  { from: 'kilnsheart', to: 'lava_tubes', kind: 'enter', a: [478, 178] },
  { from: 'kilnmouth', to: 'kilnhaven', kind: 'enter', a: [388, 162] },
];
