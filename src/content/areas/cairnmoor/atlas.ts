// Cairnmoor's part of the world map: its two zones, the plate of its one dungeon, and its sites.
// docs/areas/cairnmoor.md is its brief (#475).
import type { AtlasZone, AtlasPlace, AtlasSite, AtlasLink } from '../../../game/atlas.ts';

/** A row of seeds from x0 to x1 along y, and a column from y0 to y1 down x. */
const row = (x0: number, x1: number, y: number): [number, number][] => Array.from({ length: x1 - x0 + 1 }, (_, i): [number, number] => [x0 + i, y]);
const col = (x: number, y0: number, y1: number): [number, number][] => Array.from({ length: y1 - y0 + 1 }, (_, i): [number, number] => [x, y0 + i]);

/**
 * The zones' lines held by seeds, a square either side where both are the moor's (#476,
 * docs/areas/cairnmoor.md §9): a laid map seeds the walk from every square of it, so with N7 laid
 * whole in High Moor and the Kilns' N6 and M6 laid north of the moor, High Moor would run on from N7
 * into M7 and N8, and the Kilns would keep the squares of row 7 their walk took (docs/areas/kilns.md
 * §1). The Cairnfield holds M7 along its north edge under M6 (all but its two westmost squares, where
 * a seed would carry it on west round the coast into Kilnmouth's L6 and K6) and its east edge beside
 * N7, and N8 along its north edge under N7 and its east edge beside O8; High Moor holds O7 and P7
 * along their north edges under O6 and P6, and O8 along its west edge. The seams down N8's and O8's
 * sides stop at y 246, short of the Rimefells, which their walk leaves as it was. With Rimewater's M9
 * laid whole in Loch Fada (#486), the Cairnfield held M8 along its south edge over M9 while M8 was
 * parked, where the loch's walk would otherwise climb the Rimefells into it. M7 and M8, laid whole in
 * the Cairnfield (#484), hold their own squares now, and the seeds along their edges change nothing.
 */
const CAIRNFIELD_HELD = [...row(394, 423, 190), ...col(423, 191, 221), ...row(424, 455, 222), ...col(455, 223, 246), ...row(392, 423, 253)];
const HIGHMOOR_HELD = [...row(456, 497, 190), ...col(456, 222, 246)];

export const ZONES: readonly AtlasZone[] = [
  {
    id: 'highmoor', name: 'High Moor', area: 'cairnmoor', band: [18, 19], maps: [{ map: 'highmoor_n7', at: [424, 190] }, { map: 'highmoor_o7', at: [456, 190] }, { map: 'highmoor_o8', at: [456, 222] }, { map: 'highmoor_p7', at: [488, 190] }, { map: 'highmoor_p8', at: [488, 222] }], seeds: [[462, 212], [488, 230], ...HIGHMOOR_HELD],
    // The crossing line said in snow (#166, #476): how the moor feels to a company under its floor.
    crossing: { harder: 'The snow begins here, and the land is harder than the road behind.', warning: 'Snow, and nothing on this moor would spare you. The road behind is still open.' },
    // Over the low hills and down the drove road past the ravens on the first cairn, the bog bodies in
    // the marsh beside it and, on its southern reach by night, the hounds (#476).
    // On O7 (#477), the peat-cutter's track east to the ring past the lights that go round it by night.
    road: ['highmoor_n7:n7_ravens', 'highmoor_n7:n7_bodies_north', 'highmoor_n7:n7_hounds', 'highmoor_o7:o7_lights'],
  },
  // Down the drove road past the ravens on the first cairns, the wights at the open cairn below Carn
  // Dubh and, at the road's head by night, the hounds (#479).
  { id: 'cairnfield', name: 'The Cairnfield', area: 'cairnmoor', band: [19, 20], maps: [{ map: 'cairnfield_n8', at: [424, 222] }, { map: 'cairnfield_m7', at: [392, 190] }, { map: 'cairnfield_m8', at: [392, 222] }, { map: 'cairnfield_l8', at: [360, 222] }], seeds: [[426, 236], [412, 220], ...CAIRNFIELD_HELD], label: [418, 214], road: ['cairnfield_n8:n8_ravens', 'cairnfield_n8:n8_wights_open', 'cairnfield_n8:n8_hounds'] },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'cairns', kind: 'dungeon', at: [430, 246] }, // Carn Dubh, the Cairns: the cairn, through N8's door at 6,18 (#479, #480)
  { id: 'cairns2', kind: 'dungeon', at: [430, 252] }, // under the cairn, down its stair
  { id: 'carn_fada', kind: 'dungeon', band: [20, 21], at: [381, 249] }, // the enclave, the drowned cairn under L8's mound, its gap at 22,27 (#834, #845)
  { id: 'bearn_liath', kind: 'dungeon', band: [30, 32], at: [494, 214] }, // the lair, the cleft in the rim behind P7's 5,24, where the Rim Troll keeps Torhide (#834, #845, #846)
];

export const SITES: readonly AtlasSite[] = [
  // VII. Cairnmoor (docs/areas/cairnmoor.md §10 has the hill folk's names).
  { name: 'Fionnlios', icon: 'ring', map: 'highmoor_o7', at: [6.5, 24.5], label: 'below' }, // the Stone Ring, on its rise on O7, 6,24 (#477)
  { name: 'Carn Dubh', icon: 'barrow', at: [430, 240], label: 'below' }, // the Cairns, at the door on N8, 6,18 (#479, #480)
  { name: 'Watcher\'s Hut', icon: 'lodge', map: 'highmoor_o7', at: [10.5, 18.5], label: 'right' }, // the Sorcerer's second prestige: the hut beside the ring on O7, 10,18 (#477)
];

export const LINKS: readonly AtlasLink[] = [
  { from: 'cairnfield', to: 'cairns', kind: 'enter', a: [430, 240] },
];
