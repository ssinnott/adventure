// Cairnmoor's part of the world map: its two zones, the plate of its one dungeon, and its sites.
// docs/areas/cairnmoor.md is its brief (#475).
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';

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
 * sides stop at y 246, short of the Rimefells, which their walk leaves as it was.
 */
const CAIRNFIELD_HELD = [...row(394, 423, 190), ...col(423, 191, 221), ...row(424, 455, 222), ...col(455, 223, 246)];
const HIGHMOOR_HELD = [...row(456, 497, 190), ...col(456, 222, 246)];

export const ZONES: readonly AtlasZone[] = [
  {
    id: 'highmoor', name: 'High Moor', area: 'cairnmoor', band: [18, 19], maps: [{ map: 'highmoor_n7', at: [424, 190] }], seeds: [[462, 212], [488, 230], ...HIGHMOOR_HELD],
    // The crossing line said in snow (#166, #476): how the moor feels to a company under its floor.
    crossing: { harder: 'The snow begins here, and the land is harder than the road behind.', warning: 'Snow, and nothing on this moor would spare you. The road behind is still open.' },
  },
  { id: 'cairnfield', name: 'The Cairnfield', area: 'cairnmoor', band: [19, 20], seeds: [[426, 236], [412, 220], ...CAIRNFIELD_HELD], label: [418, 214] },
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
