// The outdoors as one map: the zone maps laid in 1:1 where the atlas puts them, the void round them,
// the ridge and its open pass, and every open square reachable.
import { buildMaps, PLAYED_DEFS } from '../../src/content/maps.ts';
import { MAP_DEFS } from '../../src/content/index.ts';
import { GameMap } from '../../src/game/map.ts';
import type { MapDef } from '../../src/game/map.ts';
import { layOutdoors, OUTDOORS } from '../../src/game/outdoors.ts';
import { ATLAS } from '../../src/content/index.ts';
import { mapAt } from '../../src/game/atlas.ts';
import type { AtlasZone } from '../../src/game/atlas.ts';
import { World } from '../../src/game/world.ts';
import { defaultParty } from '../../src/game/party.ts';
import { makeRng } from '../../src/lib/engine/rng.ts';
import { EAST } from '../../src/game/types.ts';
import { ok, owed, local, stopsWalk } from './lib.ts';
import { logLines } from '../../src/ui/frame.ts';

/**
 * Zone maps laid before the map that joins them to the rest, and whose map that is: their squares
 * are reported as that issue's while none can be walked to, and fail once they all can, so the
 * entry is dropped here. Henlys, I4, is reached through I3 (#215), as H4 between it and H3 is cut.
 * Wrackholm's isle is reached by the smugglers' boat from Saltmouth (#177), a crossing's landing, and
 * Ashfall, begun by sea (#443, call 6), by the Compact's ship to Cinderport and out at its gate (#512).
 * The Wold's steppe, D9, met E10 only corner to corner until the mesas, D10 (#527), joined the two; it
 * is reached from Akordu's box, D8, over its north edge too (#526), D8 by the Riders' ride from
 * Cinderport to its landing there (#547). The Scarp's edge, C8, is reached over D8's west edge and up the
 * Scarp stair from the Saltings' C7 (#528); the Wold's heart, B8, over C8's west edge (#529); the Glass's
 * edge, B9, over B8's south edge (#530).
 */
const CUT_OFF: Record<string, string> = {};

export function outdoors(): void {
  // The outdoors is played as one map the size of the world, every zone map the atlas places laid into it.
  const zoneMaps = MAP_DEFS.filter((d) => d.kind === 'outdoor');
  const played = PLAYED_DEFS.filter((d) => d.kind === 'outdoor');
  ok(played.length === 1 && played[0].id === OUTDOORS, `the outdoors is played as one map (${played.map((d) => d.id).join(', ')})`);
  ok(PLAYED_DEFS[0].id === MAP_DEFS[0].id && PLAYED_DEFS.length === MAP_DEFS.length - zoneMaps.length + 1, 'Helmstow is still the first map, and the towns and dungeons are played as they are written');
  const out = new GameMap(played[0]);
  ok(out.width === ATLAS.width && out.height === ATLAS.height, `the outdoors is the world's size, square for square with the painted map (${out.width}x${out.height})`);
  for (const d of zoneMaps) {
    const z = out.zones.find((q) => q.id === d.id), at = mapAt(ATLAS, d.id);
    ok(!!z && !!at && z.x === at[0] && z.y === at[1] && z.w === d.rows[0].length && z.h === d.rows.length && z.name === d.name, `${d.id}: laid where the atlas puts it, and called ${d.name}`);
    if (!z) continue;
    let same = 0;
    for (let y = 1; y < z.h - 1; y++) for (let x = 1; x < z.w - 1; x++) if (out.at(z.x + x, z.y + y).ch === d.rows[y][x]) same++;
    ok(same === (z.w - 2) * (z.h - 2), `${d.id}: every square inside its ring is the map's own (${same} of ${(z.w - 2) * (z.h - 2)})`);
  }
  let outside = 0, blank = 0;
  for (let y = 0; y < out.height; y++) for (let x = 0; x < out.width; x++) if (!out.zoneAt(x, y)) { outside++; if (out.at(x, y).solid === 'void') blank++; }
  ok(outside > 0 && blank === outside, `every square no zone map covers is void: the world ends there for now (${blank} of ${outside})`);
  ok(out.at(0, 0) === out.at(out.width - 1, out.height - 1) && Object.isFrozen(out.at(0, 0)), 'the void is one frozen cell, however much of it there is');
  // The mountains that closed each zone map in are, where they face nothing built, the end of the
  // world too; between the two zones they are the ridge, as they were, with the pass through it.
  const sh = out.zones.find((z) => z.id === 'shelf')!, th = out.zones.find((z) => z.id === 'thornmark')!;
  const line = (x: number, y: number, dx: number, dy: number, n: number): string => Array.from({ length: n }, (_, i) => out.at(x + dx * i, y + dy * i).ch).join('');
  const faces = [line(sh.x, sh.y, 1, 0, sh.w), line(sh.x, sh.y + sh.h - 1, 1, 0, sh.w), line(th.x, th.y, 1, 0, th.w)];
  ok(faces.every((s) => /^%+$/.test(s)), 'the Foreland\'s north and south edges and Thornmark\'s north edge are the end of the world');
  // South, the Deepthorn's edge (H3, #214): Thornmark's ring stands against it as mountains, with
  // the elves' road through a gap out of the Grove's hollow, and against I2 at its corner.
  const south = line(th.x, th.y + th.h - 1, 1, 0, th.w);
  ok(south === 'M'.repeat(8) + '=' + 'M'.repeat(23), `Thornmark's south edge is mountains against the Deepthorn, with the elves' road through a gap (${south})`);
  // East, the Eaves' way in (I2, #195): Thornmark's ring stands against it as mountains, with the
  // east road through a gap over the Hoarhills; its corner under the rim is the world's end.
  const eaves = out.zones.find((z) => z.id === 'eaves_i2')!;
  const east = line(th.x + th.w - 1, th.y, 0, 1, th.h);
  ok(east === '%' + 'M'.repeat(9) + '=' + 'M'.repeat(21), `Thornmark's east edge is mountains against the Eaves, with the east road through a gap (${east})`);
  // I2 and J2 (#196) meet in one wood, pines on both sides of the seam with the road through them;
  // the rim over both is the world's end.
  const j2 = out.zones.find((z) => z.id === 'eaves_j2')!, k2 = out.zones.find((z) => z.id === 'eaves_k2')!;
  const rim = line(eaves.x, eaves.y, 1, 0, eaves.w * 3), seam = line(eaves.x + eaves.w - 1, eaves.y, 0, 1, eaves.h);
  ok(/^%+$/.test(rim) && seam === '%MM' + 'T'.repeat(8) + '=' + 'T'.repeat(19) + 'M', `I2's north edge, J2's and K2's, the rim, are the end of the world, and I2's east edge is the wood on into J2, with the road through it (${seam})`);
  // J2 and K2 (#197) meet in the gorge: chasm on both sides of the seam north of the road, the east
  // road onto the rope bridge, and the west lip's dead wood and glass south of it.
  const lip = line(j2.x + j2.w - 1, j2.y, 0, 1, j2.h), gorge = line(k2.x, k2.y, 0, 1, k2.h);
  ok(lip === '%' + 'v'.repeat(22) + '==' + 'T'.repeat(6) + 'M' && gorge === '%' + 'v'.repeat(23) + '=cddcdcc', `J2's east edge and K2's west edge are the gorge, but for the road onto the bridge and the woods south of it (${lip}; ${gorge})`);
  // K2 and L2 (#200) meet in one wood, forest on both sides of the seam with the east road through
  // it. K2 and K3 (#198) meet in the gorge: both lips' dead wood, the chasm between them and the rock
  // that walls K2's ledge, the pines east of it. L2 and M2 (#202) meet in one wood, its river down
  // the seam and the road over it by a ford; M2's road leaves by its south edge into M3 (#457), the
  // Kilns' first box, over the ridge between them. J3 (#202) meets J2 by the cutters' track and K3
  // by the west lip's dead wood, and the Deepthorn's I3 and J4 in closed forest. Lanternwood's depths
  // (#203): L2 meets L3 by the Lanterns' bank path and the river; K3 meets K4 by its east lip's dead
  // wood, and L3 in closed forest; L3 meets L4 by the river and the path beside it, and M3 in closed
  // forest; K4 meets L4 by the shingle along the bay, and the Deepthorn's J4 in rock, sea and all.
  // Past them the world ends at M4 and L5, which are not built.
  const l2 = out.zones.find((z) => z.id === 'lanternwood_l2')!, k3 = out.zones.find((z) => z.id === 'eaves_k3')!;
  const m2 = out.zones.find((z) => z.id === 'lanternwood_m2')!, j3 = out.zones.find((z) => z.id === 'eaves_j3')!;
  const k2east = line(k2.x + k2.w - 1, k2.y, 0, 1, k2.h), l2west = line(l2.x, l2.y, 0, 1, l2.h), l2east = line(l2.x + l2.w - 1, l2.y, 0, 1, l2.h), m2west = line(m2.x, m2.y, 0, 1, m2.h);
  const wood = '%' + 'T'.repeat(21) + '=' + 'T'.repeat(8), river = '%' + 'T'.repeat(24) + '~~~~=~';
  ok(k2east === wood + 'T' && l2west === wood + 'M', `K2's east edge and L2's west edge are the wood on into Lanternwood, with the road through it, K2's corner over K3 pines (${k2east}; ${l2west})`);
  ok(l2east === river + '~' && m2west === river + 'T', `L2's east edge and M2's west edge are the wood, the river down the seam and the road over it by a ford (${l2east}; ${m2west})`);
  const m2south = line(m2.x, m2.y + m2.h - 1, 1, 0, m2.w), m2east = line(m2.x + m2.w - 1, m2.y, 0, 1, m2.h);
  ok([line(l2.x, l2.y, 1, 0, l2.w), line(m2.x, m2.y, 1, 0, m2.w)].every((l) => /^%+$/.test(l)) && m2east === '%' + 'M'.repeat(31) && m2south === 'T==MMMrr' + 'M'.repeat(24),
    `L2's and M2's north edges, the rim, are the world's end; M2's east edge is the range against N2 (#460), and its south edge the ridge against M3, with the road through it (${m2east}; ${m2south})`);
  const k2south = line(k2.x, k2.y + k2.h - 1, 1, 0, k2.w), k3north = line(k3.x, k3.y, 1, 0, k3.w);
  ok(k2south === 'cdddvvvvvrrrdd' + 'T'.repeat(18) && k3north === 'MdddvvvvvrrrddTTTTTTTTTTTTTTTTTM', `K2's south edge and K3's north edge are the gorge, square for square, with both lips through (${k2south}; ${k3north})`);
  const j2south = line(j2.x, j2.y + j2.h - 1, 1, 0, j2.w), j3north = line(j3.x, j3.y, 1, 0, j3.w), track = 'M'.repeat(14) + 'tt' + 'M'.repeat(16);
  ok(j2south === track && j3north === track, `J2's south edge and J3's north edge are the pines, but for the cutters' track (${j2south}; ${j3north})`);
  const j3east = line(j3.x + j3.w - 1, j3.y, 0, 1, j3.h), k3west = line(k3.x, k3.y, 0, 1, k3.h), lip3 = 'M'.repeat(27) + 'ddddM';
  ok(j3east === lip3 && k3west === lip3, `J3's east edge and K3's west edge are the pines, but for the west lip's dead wood (${j3east}; ${k3west})`);
  ok([line(j3.x, j3.y, 0, 1, j3.h), line(j3.x, j3.y + j3.h - 1, 1, 0, j3.w)].every((l) => /^M+$/.test(l)), 'J3\'s west and south edges stand closed against the Deepthorn\'s I3 and J4');
  // The depths (#203).
  const [l3, l4, k4, j4] = ['lanternwood_l3', 'lanternwood_l4', 'lanternwood_k4', 'deepthorn_j4'].map((id) => out.zones.find((z) => z.id === id)!);
  const southOf = (z: typeof l3): string => line(z.x, z.y + z.h - 1, 1, 0, z.w), northOf = (z: typeof l3): string => line(z.x, z.y, 1, 0, z.w);
  const westOf = (z: typeof l3): string => line(z.x, z.y, 0, 1, z.h), eastOf = (z: typeof l3): string => line(z.x + z.w - 1, z.y, 0, 1, z.h);
  ok(southOf(l2) === 'M'.repeat(28) + 'tt~~' && northOf(l3) === 'T'.repeat(28) + 'tt~T', `L2's south edge and L3's north edge are closed, but for the bank path and the river (${southOf(l2)}; ${northOf(l3)})`);
  ok(/^M+$/.test(eastOf(k3)) && /^T+$/.test(westOf(l3)), `K3's east edge and L3's west edge stand closed (${eastOf(k3)}; ${westOf(l3)})`);
  ok(southOf(k3) === 'M'.repeat(21) + 'ddddd' + 'M'.repeat(6) && northOf(k4) === 'r' + 'M'.repeat(20) + 'ddddd' + 'M'.repeat(6), `K3's south edge and K4's north edge are closed, but for the east lip's dead wood (${southOf(k3)}; ${northOf(k4)})`);
  ok(southOf(l3) === 'T'.repeat(16) + 'ttt~~tt' + 'T'.repeat(9) && northOf(l4) === 'T'.repeat(19) + '~~tt' + 'T'.repeat(8) + 'M', `L3's south edge and L4's north edge are the wood, the river and the path on its east bank (${southOf(l3)}; ${northOf(l4)})`);
  ok(eastOf(k4) === 'M' + 'T'.repeat(28) + '_~W' && westOf(l4) === 'T'.repeat(29) + '_~~', `K4's east edge and L4's west edge are closed forest, but for the shingle along the bay (${eastOf(k4)}; ${westOf(l4)})`);
  ok(/^r+$/.test(westOf(k4)) && eastOf(j4) === 'T'.repeat(17) + '_~~' + 'W'.repeat(12), `K4's west edge is rock against the Deepthorn's J4, its shore and its sea, so no way opens between the two areas (${westOf(k4)})`);
  ok(/^T+$/.test(eastOf(l3)) && eastOf(l4) === 'M'.repeat(31) + '%' && southOf(l4) === '~~~~' + '%'.repeat(28) && southOf(k4) === 'r' + 'W'.repeat(31), `L3's east edge is closed forest against M3, L4's east edge the range against M4 (#474), and L4's south edge and K4's the world's end and the bay (${eastOf(l4)}; ${southOf(l4)})`);
  // The Iron Fells' way in (M3, #457): in from M2 by the road over the ridge, Lanternwood's trees
  // closed against L3 on its west, and open land east into N3 (#458) with the trail through it; its
  // south edge's ridge and crag run on into M4 (#474), between the pines.
  const m3 = out.zones.find((z) => z.id === 'ironfells_m3')!;
  ok(northOf(m3) === 'T==pp' + 'T'.repeat(12) + 'M'.repeat(10) + '^'.repeat(5) && /^T+$/.test(westOf(m3)), `M3's north edge is the ridge under M2 with the road through it, and its west edge closed forest against L3 (${northOf(m3)})`);
  ok(eastOf(m3) === '^^' + ','.repeat(16) + 'p'.repeat(9) + '==' + ',,,' && southOf(m3) === 'T' + 'M'.repeat(11) + 'p'.repeat(8) + 'MMrrMM' + 'ppppp,',
    `M3's east edge is open land on into N3 with the trail through it, and its south edge pine but for the ridge and the crag, on into M4 (${eastOf(m3)}; ${southOf(m3)})`);
  // Anvilhall's box (N3, #458): open land on from M3 with the trail through it at rows 27 and 28, and
  // the trail out by the south edge into N4; the open fell on north into N2 (#460) and the crag over
  // the gate running on into N2's and O3's (#474), the terraces' east end shut by O3's crag, and the
  // hills and rock past them on into O3.
  const n3 = out.zones.find((z) => z.id === 'ironfells_n3')!;
  ok(westOf(n3) === ','.repeat(27) + '==' + ',,,' && southOf(n3) === ',,,,==' + ','.repeat(18) + 'r'.repeat(8),
    `N3's west edge is open land on from M3 with the trail through it, and its south edge open land with the trail out into N4 and rock at the corner (${westOf(n3)}; ${southOf(n3)})`);
  ok(northOf(n3) === ','.repeat(13) + '^' + 'M'.repeat(18) && eastOf(n3) === 'M'.repeat(9) + ':::ff:ff####::' + '^'.repeat(7) + 'rr',
    `N3's north edge is open fell on into N2 but for the crag, and its east edge the crag, the terraces' end and the hills (${northOf(n3)}; ${eastOf(n3)})`);
  // Erzkamm's box (N2, #460): the open fell on from N3 square for square, the crag over Anvilhall's
  // gate running on along it, but the corner, which faces O2's void on N2's side and O3's crag on N3's;
  // the rim over its north and east the world's end; and on its west the rim's mountain, then the hills
  // and the fell under it, against M2's range.
  const n2 = out.zones.find((z) => z.id === 'ironfells_n2')!;
  ok(southOf(n2) === northOf(n3).slice(0, -1) + '%' && /^%+$/.test(northOf(n2)) && /^%+$/.test(eastOf(n2)),
    `N2's south edge meets N3's north edge square for square but the corner, and its north and east edges, the rim, are the world's end (${southOf(n2)}; ${northOf(n2)}; ${eastOf(n2)})`);
  // The Fells' east (O3, #474): the hall's crag run on down its west edge against N3's crag and the
  // terraces' end, so nothing comes at the gate from this side, then the hills open on from N3's at
  // rows 21 to 29 and rock at the corner; its north edge the hills and the pines under the world's end
  // over O2, and its east edge, the mountain, the world's end against P3. On its south the hills and the
  // pines open on into O4, over the line from the Fells into the heart, with the mountain at the end.
  const o3 = out.zones.find((z) => z.id === 'ironfells_o3')!, o4 = out.zones.find((z) => z.id === 'kilnsheart_o4')!;
  ok(westOf(o3) === '%' + 'M'.repeat(20) + '^'.repeat(9) + 'rr' && northOf(o3) === '%%^^^^pp' + '%'.repeat(24) && /^%+$/.test(eastOf(o3)),
    `O3's west edge is the crag against N3's crag and terraces, then the hills on from N3's and rock at the corner; its north edge the hills and the pines under the void, and its east edge the world's end (${westOf(o3)}; ${northOf(o3)}; ${eastOf(o3)})`);
  ok(southOf(o3) === 'rr' + '^'.repeat(13) + 'p'.repeat(11) + 'M'.repeat(5) + '%' && northOf(o4) === 'rrr' + '^'.repeat(14) + 'p'.repeat(10) + 'M'.repeat(4) + '%',
    `O3's south edge and O4's north edge are the rock, the hills and the pines open across, and the mountain at the east end (${southOf(o3)}; ${northOf(o4)})`);
  ok(westOf(n2) === '%' + 'M'.repeat(19) + '^'.repeat(8) + ','.repeat(4),
    `N2's west edge is the rim's mountain, then the hills and the fell under it, against M2's range (${westOf(n2)})`);
  // The Tiefzeche's box (N4, #461), the heart's first: open land on from N3 with the trail through it
  // at columns 4 and 5, square for square with N3's south edge; the drove road out by the south edge
  // for N5, with the stream for the smelter at the corner; open grass, the knoll and the old workings'
  // ground on the west against M4, laid since (#474), and the first crags and the hills on the east
  // against O4, laid since too: the crags against its crag and the hills open across, with the stream
  // at the corner.
  const n4 = out.zones.find((z) => z.id === 'kilnsheart_n4')!;
  ok(northOf(n4) === southOf(n3) && southOf(n4) === ':'.repeat(11) + ','.repeat(9) + '=,,' + '^'.repeat(5) + ',,~~',
    `N4's north edge is N3's south edge, square for square, with the trail through it, and its south edge the old workings' ground, the grass and the drove road out for N5 (${northOf(n4)}; ${southOf(n4)})`);
  ok(westOf(n4) === ','.repeat(18) + '^^^,,f' + ':'.repeat(8) && eastOf(n4) === 'r'.repeat(14) + '^'.repeat(13) + ',,^^~',
    `N4's west edge is grass, the knoll and the old workings' ground against M4, and its east edge the crags and the hills against O4 (${westOf(n4)}; ${eastOf(n4)})`);
  // The heart's hills (O4, #474): its crag against N4's, the hills open across from N4's hills and grass
  // and the stream at the corner, run on into N4's and O5's; on the south the hills open into O5's at
  // columns 2 to 9, then the mountain against O5's mountain and hills, its corner the world's end; and
  // on the east, against P4, the mountain and the hills with the stream coming in at row 6, the
  // mountain the world's end.
  ok(westOf(o4) === 'r'.repeat(15) + '^'.repeat(16) + '~' && southOf(o4) === '~~' + '^'.repeat(11) + 'M'.repeat(18) + '%' && eastOf(o4) === '%'.repeat(6) + '~' + '^'.repeat(15) + '%'.repeat(10),
    `O4's west edge is the crag and the hills against N4's, with the stream at the corner; its south edge the stream, the hills and the mountain against O5; its east edge the hills and the stream under the world's end (${westOf(o4)}; ${southOf(o4)}; ${eastOf(o4)})`);
  // Gluthutte's box (N5, #463): in from N4 by the drove road at column 20 and the stream at the corner,
  // the slag heap's loose slag on the line; out by the south edge at column 12 for N6. The stream
  // leaves by the west edge at rows 25 and 26 against M5, beside the farms' fields and the woods; on the
  // east, against O5 (#464), the hills, the mountain and the cutters' track at row 24 in dirt, since the
  // atlas has no road there.
  const n5 = out.zones.find((z) => z.id === 'kilnsheart_n5')!;
  ok(northOf(n5) === ':::' + '"'.repeat(6) + '::' + ','.repeat(9) + '=,' + '^'.repeat(8) + '~~' && southOf(n5) === '^,,' + 't'.repeat(9) + '=' + 't'.repeat(9) + ','.repeat(10),
    `N5's north edge meets N4's with the drove road and the stream, and its south edge is the woods with the drove road out for N6 (${northOf(n5)}; ${southOf(n5)})`);
  ok(westOf(n5) === ':'.repeat(7) + 'f'.repeat(7) + 't'.repeat(11) + '~~t,,,^' && eastOf(n5) === '~^,^^^' + 'M'.repeat(11) + '^^^,,,,:' + ','.repeat(7),
    `N5's west edge is the smelter's ground, the fields, the woods and the stream against M5, and its east edge the hills, the mountain and the cutters' track against O5 (${westOf(n5)}; ${eastOf(n5)})`);
  // The roads south and west (N6 and M6, #467): N6 in from N5 square for square with the drove road at
  // column 12, out by the south edge at column 3 for Cairnmoor's N7 among the hills and the heather;
  // the grass and the heather on the east against O6. M6 meets N6 square for square, the branch at row
  // 18; on its north the stream comes in from M5 at columns 23 to 26 beside the farms, and on its west
  // the river goes out at rows 5 and 6 under the branch's last square, dirt, where the atlas has no road.
  const n6 = out.zones.find((z) => z.id === 'kilnsheart_n6')!, m6 = out.zones.find((z) => z.id === 'kilnmouth_m6')!;
  ok(northOf(n6) === southOf(n5) && southOf(n6) === '^^^=' + '^'.repeat(18) + 'h'.repeat(8) + '^^' && eastOf(n6) === ','.repeat(22) + 'h'.repeat(8) + '^^',
    `N6's north edge meets N5's with the drove road, its south edge is the hills and the heather with the drove road out for N7, and its east edge the grass and the heather against O6 (${southOf(n6)}; ${eastOf(n6)})`);
  ok(eastOf(m6) === westOf(n6) && westOf(n6) === '^^^' + ','.repeat(15) + '=' + ','.repeat(6) + '^'.repeat(7),
    `M6's east edge meets N6's west edge square for square, with the branch through it at row 18 (${westOf(n6)})`);
  ok(northOf(m6) === '_' + 'f'.repeat(22) + '~~~~f,,,^' && westOf(m6) === '_fff=~~' + 'f'.repeat(8) + ','.repeat(17) && southOf(m6) === ','.repeat(11) + '^,,,' + '^'.repeat(17),
    `M6's north edge is the farms with the stream in from M5, its west edge the farms, the branch and the river on into L6, and its south edge the grass and the hill against M7 (${northOf(m6)}; ${westOf(m6)}; ${southOf(m6)})`);
  // Kilnhaven's box (L6, #468): M6's west edge square for square on its east, the branch on into it at
  // row 4 and the river out at rows 5 and 6; the sea on its north and down its west, then the shore's
  // grass and the heath against K6's cut heath, and the heath and the grass on its south against L7.
  const l6 = out.zones.find((z) => z.id === 'kilnmouth_l6')!;
  ok(eastOf(l6) === westOf(m6) && northOf(l6) === 'W'.repeat(28) + 'B::_' && westOf(l6) === 'W'.repeat(16) + '~~,,,' + 'h'.repeat(11) && southOf(l6) === 'h'.repeat(25) + ','.repeat(7),
    `L6's east edge meets M6's west edge square for square, its north edge is the sea and the town's wall, its west the sea, the shore and the heath, and its south the heath and the grass (${northOf(l6)}; ${westOf(l6)}; ${southOf(l6)})`);
  // Kilnmouth's country (M4 and M5, #474). M4 meets M3's south edge square for square, the crag running
  // on across the seam and the pines open either side of it, and N4's west edge square for square, the
  // grass, the knoll and the old workings' ground the drovers' track climbs from; on its west the range's
  // crag and then trees against L4's mountain, so no climber crosses and the road stays the only way
  // between the two areas. M4's south edge and M5's north are open both sides. M5 meets N5's west edge
  // and M6's north edge square for square, the stream in from N5 and on into M6; on its west the range
  // down to the shingle, the world's end against cut L5.
  const m4 = out.zones.find((z) => z.id === 'kilnmouth_m4')!, m5 = out.zones.find((z) => z.id === 'kilnmouth_m5')!;
  ok(northOf(m4) === southOf(m3) && eastOf(m4) === westOf(n4) && westOf(m4) === 'T' + 'r'.repeat(22) + 'T'.repeat(9),
    `M4's north edge meets M3's south edge and its east edge N4's west edge square for square, and its west edge is crag and trees against L4's range (${northOf(m4)}; ${westOf(m4)})`);
  ok(southOf(m4) === 'T' + ','.repeat(10) + '^' + ','.repeat(6) + 'f'.repeat(11) + ':::' && northOf(m5) === '%,,,,,^^,,^^' + ','.repeat(6) + 'f'.repeat(11) + ':::',
    `M4's south edge and M5's north edge are the grass, the fields and the old workings' ground, open both sides (${southOf(m4)}; ${northOf(m5)})`);
  ok(eastOf(m5) === westOf(n5) && southOf(m5) === northOf(m6) && westOf(m5) === '%'.repeat(24) + '_'.repeat(8),
    `M5's east edge meets N5's west edge and its south edge M6's north edge square for square, the stream through both, and its west edge is the range and the shingle, the world's end against cut L5 (${westOf(m5)})`);
  // The Anvil Stone's box (O5, #464): in from N5 by the cutters' track at row 24 and over the open hills
  // and grass either side of it, the mountain between them on both sides of the seam and the stream at
  // the corner. The stream runs on at the north edge's corner into O4 (#474), past it the hills open
  // into O4's, the mountain against O4's hills and mountain, and the hills against O4's mountain; the
  // hills and the crag, run on to the rim, against P5, cut; and the grass, the hills and the crag
  // against O6 (#466).
  const o5 = out.zones.find((z) => z.id === 'kilnsheart_o5')!;
  ok(westOf(o5) === '~^^^^' + 'M'.repeat(10) + '^^^^' + ','.repeat(5) + ':' + ','.repeat(7) && northOf(o5) === '~~' + '^'.repeat(8) + 'M'.repeat(17) + '^'.repeat(5),
    `O5's west edge meets N5's with the cutters' track, the hills and the mountain, and its north edge is the stream at the corner, the hills and the mountain against O4 (${westOf(o5)}; ${northOf(o5)})`);
  ok(eastOf(o5) === '^'.repeat(22) + 'r'.repeat(10) && southOf(o5) === ',,,,,' + '^'.repeat(8) + 'r'.repeat(19),
    `O5's east edge is the hills and the crag against P5, and its south edge the grass, the hills and the crag against O6 (${eastOf(o5)}; ${southOf(o5)})`);
  // Feuerstollen's box (O6, #466): in from O5 over the grass and the hills square for square, the crag
  // running on across the seam, and from N6 over the grass and the heather square for square; no road
  // crosses either. On the south the hills and the grass against Cairnmoor's O7 (#477, below), square
  // for square but the corner, the box laid whole over the squares of High Moor's that lay in its
  // south; and on the east the crag, the hills and the ash against P6, cut; the mountain at the corner
  // the world's end.
  const o6 = out.zones.find((z) => z.id === 'kilnsheart_o6')!;
  ok(northOf(o6) === southOf(o5) && westOf(o6) === eastOf(n6),
    `O6's north edge meets O5's square for square with the grass, the hills and the crag, and its west edge N6's with the grass and the heather (${northOf(o6)}; ${westOf(o6)})`);
  ok(southOf(o6) === '^'.repeat(10) + ','.repeat(14) + '^'.repeat(7) + '%' && eastOf(o6) === 'rr^^' + 'a'.repeat(25) + '^%%',
    `O6's south edge is the hills and the grass against O7, and its east edge the crag, the hills and the ash against P6 (${southOf(o6)}; ${eastOf(o6)})`);
  // The road up onto the moor (N7, #476), Cairnmoor's first box: in from N6's hills by the drove road
  // at column 3, N6's heather running on south at columns 22 to 29; out by the south edge at column 7
  // for N8 among the heather, the snow and the marsh, the stream from the tarn clipping the corner; the
  // peat-cutter's track out by the east edge at row 22 in dirt against O7, since the atlas has no road
  // there, meeting O7's (#477); and on the west the grass, the snow, the heather and the hills against
  // M7 (#484), below.
  const n7 = out.zones.find((z) => z.id === 'highmoor_n7')!;
  ok(northOf(n7) === ',,,=,' + '^'.repeat(12) + ',,^^^' + 'h'.repeat(8) + '^^' && southOf(n7) === 'hh*hhhw=' + 'w'.repeat(6) + 'hhhh**' + 'h'.repeat(11) + '~',
    `N7's north edge meets N6's hills with the drove road at column 3, and its south edge is the heather, the snow and the marsh with the drove road out for N8 and the stream at the corner (${northOf(n7)}; ${southOf(n7)})`);
  ok(eastOf(n7) === '^'.repeat(11) + ',,' + 'h'.repeat(9) + ':' + 'h'.repeat(8) + '~' && westOf(n7) === ',,,,,,**hhhh^^^^' + 'h'.repeat(16),
    `N7's east edge is the hills and the heather against O7 with the peat-cutter's track out at row 22, and its west edge the grass, the snow, the heather and the hills against M7 (${eastOf(n7)}; ${westOf(n7)})`);
  // The Cairnfield (N8, #479): in from N7 by the drove road at column 7, the marsh beside it and the
  // stream from the tarn at the corner, N7's south edge square for square; on the west the crags and the
  // stream out against M8, and at the corner the Rimefells' shoulder, the world's end, which the road's
  // notch at 0,28 is taken through onto M9 once M9 is built (NOTCH), since the atlas's road crosses the
  // corner on a diagonal and no square of it can be walked off the edge; on the south the hills and the
  // heather against N9, whose fells stand closed against them (#497); on the east the heather and the
  // marsh against O8, the stream at the corner. M8 is (#484), below, the shoulder's mountain over the
  // corner against N8's at row 30.
  const n8 = out.zones.find((z) => z.id === 'cairnfield_n8')!;
  ok(northOf(n8) === southOf(n7).replace('hhhw=wwwwww', 'hhhh=wwwwhh') && southOf(n8) === 'MM' + '^'.repeat(15) + 'h'.repeat(15),
    `N8's north edge meets N7's south edge with the drove road at column 7 and the stream at the corner, and its south edge is the Rimefells' shoulder, the hills and the heather against N9 (${northOf(n8)}; ${southOf(n8)})`);
  ok(westOf(n8) === 'hhhhhhh~hhh' + 'r'.repeat(8) + 'h'.repeat(7) + 'rr^^MM' && eastOf(n8) === '~' + 'h'.repeat(21) + 'w'.repeat(6) + 'hhhh',
    `N8's west edge is the heather, the stream, the crags and the notch against M8, and its east edge the stream, the heather and the marsh against O8 (${westOf(n8)}; ${eastOf(n8)})`);
  // Rime Lodge's box (M9, #486), Rimewater's first: taken down onto from N8's notch, not walked, since
  // the two meet only at a corner across M8's, where both stand as the Rimefells' shoulder; on the
  // north the fells closed but for the pines and the grass of the corner against M8; on the east the
  // glacier's edge, closed against N9 (#434, call 7) but for the pines at rows 9 and 10, the way round
  // the fells' shoulder into N9 (#497), with rock at row 24 that shuts the hollow to a climber on the
  // wall; on the south the loch and its shores, the hills, the crag and the pines against M10 (#497); on
  // the west the stream from the fells, the grass, the hills and the road out at row 20 onto L9's
  // (#488). M8 is not built, so the world ends past it.
  const m9 = out.zones.find((z) => z.id === 'longmere_m9')!;
  ok(northOf(m9) === ',,,^^' + 'M'.repeat(27) && eastOf(m9) === 'M'.repeat(9) + 'pp' + 'M'.repeat(13) + 'r' + 'M'.repeat(7) && out.at(m9.x + 31, m9.y).ch === 'M' && out.at(n8.x, n8.y + 31).ch === 'M',
    `M9's north edge is the fells, closed but for its west corner against M8, its east edge the glacier's edge, closed against N9 but for the pines at rows 9 and 10 and the hollow's rock at row 24, and its corner and N8's the Rimefells' shoulder (${northOf(m9)}; ${eastOf(m9)})`);
  ok(southOf(m9) === ',_~~' + 'W'.repeat(9) + '~~,,,^^^MM' + 'p'.repeat(7) + 'MM' && westOf(m9) === ',p~~~p' + ','.repeat(6) + '^'.repeat(8) + '=' + ','.repeat(11),
    `M9's south edge is the loch, its shores, the hills, the crag and the pines against M10, and its west edge the stream, the grass, the hills and the road out at row 20 against L9 (${southOf(m9)}; ${westOf(m9)})`);
  // The country behind (M7 and M8, #484), the Cairnfield's west and south-west, off the road: M7's
  // north edge M6's south edge square for square, the grass and the hills under the Kilns' farms, but
  // the corner, which is N7's grass; its east edge N7's west edge square for square, the grass, the
  // snow, the heather and the hills; its south edge M8's north edge, the sea, the shore, the grass and
  // the heather. M8's east edge N8's west edge square for square, the heather, the stream and the
  // crags, but past the notch, where its crags close the notch's west side and the Rimefells' shoulder
  // stands at the corner (#479's NOTCH, walked only from N8's road); its south edge the grass and the hills of
  // M9's north-west corner square for square, and the shoulder's mountains over the rest. On the west
  // the grass, the shore and the sea against L7 and L8; neither is built, so the world ends past them.
  // No road crosses any of their edges.
  const m7 = out.zones.find((z) => z.id === 'cairnfield_m7')!, m8 = out.zones.find((z) => z.id === 'cairnfield_m8')!;
  ok(northOf(m7).slice(0, 31) === southOf(m6).slice(0, 31) && eastOf(m7) === westOf(n7) && southOf(m7) === northOf(m8) && northOf(m8) === 'W'.repeat(9) + '~~_' + ','.repeat(8) + 'h'.repeat(12),
    `M7's north edge meets M6's south edge square for square but the corner, its east edge N7's west edge, and its south edge M8's north edge (${northOf(m7)}; ${eastOf(m7)}; ${southOf(m7)})`);
  ok(eastOf(m8) === westOf(n8).slice(0, 28) + 'rrMM' && southOf(m8) === northOf(m9).slice(0, 31) + 'M',
    `M8's east edge meets N8's west edge square for square but the corner, its crags past the notch and the Rimefells' shoulder, and its south edge M9's north edge, the grass and the hills of its corner and the shoulder's mountains (${eastOf(m8)}; ${southOf(m8)})`);
  ok(westOf(m7) === ','.repeat(10) + '_~~' + 'W'.repeat(19) && westOf(m8) === 'W'.repeat(12) + '~~~_' + ','.repeat(16)
    && [...Array(32).keys()].every((i) => [out.at(m7.x - 1, m7.y + i), out.at(m8.x - 1, m8.y + i)].every((c) => c.ch === '%')),
    `M7's and M8's west edges are the grass, the shore and the sea against L7 and L8, where the world ends (${westOf(m7)}; ${westOf(m8)})`);
  // The long loch's shore (L9, #488): in from M9 by the drove road at row 20, its east edge M9's west
  // edge square for square; on the north Loch Fada's ice, its open water, the pines and the stream
  // going off north against L8; on the west the ice and the pines against K9, where Loch Fuar begins;
  // on the south the pines, the road out at columns 6 and 7 onto L10's, walked on across L10's corner for
  // K10, the ridge's tail and the grass. L8 is not built, so the world ends past it; K9 (#489) and L10
  // (#497) are, below.
  const l9 = out.zones.find((z) => z.id === 'longmere_l9')!;
  ok(eastOf(l9) === westOf(m9) && northOf(l9) === 'iiiiiiiWWWWWWii_pppppp~~~~~~ppp,',
    `L9's east edge meets M9's west edge square for square, the stream at rows 2 to 4 and the road at row 20, and its north edge is the loch's ice, its open water, the pines and the stream against L8 (${eastOf(l9)}; ${northOf(l9)})`);
  ok(westOf(l9) === 'ii' + 'p'.repeat(30) && southOf(l9) === 'pppppp==ppp' + 'M'.repeat(6) + 'p'.repeat(10) + ',,,,,',
    `L9's west edge is the ice and the pines against K9, and its south edge the pines, the road out at columns 6 and 7, the ridge's tail and the grass against L10 (${westOf(l9)}; ${southOf(l9)})`);
  // Loch Fuar (K9, #489): its east edge L9's west edge square for square, the ice at rows 0 and 1 and
  // the pines below, walked anywhere and crossed by no road; on the north the loch's open water and its
  // ice against K8, on the west the open water, the ice and the pines against J9 (#497), below; on the
  // south the pines, the hills, the grass, the ice and the loch's water running in at column 29 against
  // K10. K8 is not built, so the world ends past it; K10 is (#491), below.
  const k9 = out.zones.find((z) => z.id === 'coldmere_k9')!;
  ok(eastOf(k9) === westOf(l9) && northOf(k9) === 'W'.repeat(29) + 'iii' && westOf(k9) === 'W'.repeat(10) + 'ii' + 'p'.repeat(20),
    `K9's east edge meets L9's west edge square for square, the ice at rows 0 and 1 and the pines below, and its north and west edges are the loch's open water, its ice and the pines against K8 and J9 (${eastOf(k9)}; ${northOf(k9)}; ${westOf(k9)})`);
  // Loch Fuar's far shore (J9, #497): its east edge K9's west edge square for square, the open water at
  // rows 0 to 9, the ice at 10 and 11 and the pines below, walked under the pines; on the west the
  // mountain against I9's (#503), the pines at rows 0 to 7 against its ring; on the north the pines, the
  // ice and the open water against J8, and on the south the mountain and the pines against J10. Neither
  // J8 nor J10 is built, so the world ends past them.
  const j9 = out.zones.find((z) => z.id === 'coldmere_j9')!;
  ok(eastOf(j9) === westOf(k9) && j9.x + j9.w === k9.x && j9.y === k9.y && westOf(j9) === 'p'.repeat(8) + 'M'.repeat(23) + '%'
    && northOf(j9) === 'p'.repeat(10) + 'iii' + 'W'.repeat(19) && southOf(j9) === '%%%%' + 'p'.repeat(28)
    && [...Array(32).keys()].every((i) => [out.at(j9.x + i, j9.y - 1), out.at(j9.x + i, j9.y + 32)].every((c) => c.ch === '%')),
    `J9's east edge meets K9's west edge square for square, the open water, the ice and the pines, its west edge is the pines and the mountain against I9, and its north and south edges the pines, the ice and the open water against J8 and the mountain and the pines against J10, past which the world ends (${eastOf(j9)}; ${westOf(j9)}; ${northOf(j9)}; ${southOf(j9)})`);
  // The high pass (K10, #491): its north edge K9's south edge square for square, walked anywhere; on the
  // east the pines, the road at row 3, walked on across L10's corner (#497), the river and the lake
  // against L10; on the west the pines, the pass's shoulder, its two walls (the map's
  // ring, so the void) and the road out between them at row 19 against J10, taken on over the pass onto J11's road across
  // parked J10's corner (#499, SADDLE); on the south the pines and the lake's ice and water against K11 (#497), below.
  // J10 is not built, so the world ends past it; L10 is (#497), below.
  const k10 = out.zones.find((z) => z.id === 'coldmere_k10')!;
  ok(northOf(k10) === southOf(k9) && southOf(k9) === 'p'.repeat(13) + '^' + ','.repeat(7) + 'i'.repeat(8) + '~pp',
    `K9's south edge meets K10's north edge square for square, the pines, the hills, the grass, the ice and the loch's water at column 29 (${southOf(k9)}; ${northOf(k10)})`);
  ok(eastOf(k10) === 'ppp=ppp~~' + 'W'.repeat(23) && westOf(k10) === 'p'.repeat(9) + '^^^^%%%%%^=%%%^^' + 'p'.repeat(7) && southOf(k10) === 'p'.repeat(27) + 'iiWWW'
    && [...Array(32).keys()].every((i) => out.at(k10.x - 1, k10.y + i).ch === '%'),
    `K10's east edge is the pines, the road at row 3, the river and the lake against L10, its west edge the pines, the shoulder, the pass's walls and the road out at row 19 against J10, past which the world ends, and its south edge the pines and the lake against K11 (${eastOf(k10)}; ${westOf(k10)}; ${southOf(k10)})`);
  // The country behind (#497). The cold loch's head (L10): its north edge against L9's south edge, the
  // pines, the road in at columns 6 and 7, the ridge and the grass; its west edge against K10's east
  // edge, the pines, the road at row 3, walked, the river and the lake; on the east the meadow, the hills
  // and the pines against M10. The pines under the ridge's end (L11): its north edge against L10's south
  // edge, the lake, its shore ice, the pines and the ridge; on the west the lake and the pines against
  // K11, on the east the pines and the bog against M11, and on the south the pines and the mountain
  // (the ring, so the void) against L12. L12 is not built, so the world ends past it.
  const l10 = out.zones.find((z) => z.id === 'longmere_l10')!, l11 = out.zones.find((z) => z.id === 'longmere_l11')!;
  const [m10, m11, n9] = ['longmere_m10', 'longmere_m11', 'longmere_n9'].map((id) => out.zones.find((z) => z.id === id)!);
  ok(l9.y + l9.h === l10.y && northOf(l10) === 'pppppp==ppppMMMMMMpppppppppp,,,,' && westOf(l10) === 'ppp=ppp~~~' + 'W'.repeat(22),
    `L10's north edge meets L9's south edge, the pines, the road at columns 6 and 7, the ridge and the grass, and its west edge K10's east edge, the pines, the road at row 3, the river and the lake (${northOf(l10)}; ${westOf(l10)})`);
  ok(eastOf(l10) === ','.repeat(13) + '^^^^' + ','.repeat(10) + 'ppppp' && westOf(m10) === ','.repeat(13) + '^^^^' + ','.repeat(11) + 'pppp',
    `L10's east edge meets M10's west edge, the meadow, the hills and the pines (${eastOf(l10)}; ${westOf(m10)})`);
  ok(southOf(l10) === 'WWWWWiippppppppppMMMMppppppppppp' && northOf(l11) === 'WWWWWWiippppppppppMMMppppppppppp',
    `L10's south edge meets L11's north edge, the lake, its shore ice, the pines and the ridge (${southOf(l10)}; ${northOf(l11)})`);
  ok(southOf(l11) === 'p'.repeat(17) + '%'.repeat(15) && [...Array(32).keys()].every((i) => out.at(l11.x + i, l11.y + 32).ch === '%'),
    `L11's south edge is the pines and the mountain against L12, past which the world ends (${southOf(l11)})`);
  ok(eastOf(l11) === 'p'.repeat(9) + 'w'.repeat(11) + 'p'.repeat(6) + 'M'.repeat(5) + '%' && westOf(m11) === 'p'.repeat(11) + 'w'.repeat(8) + 'p'.repeat(7) + 'M'.repeat(5) + '%',
    `L11's east edge meets M11's west edge, the pines, the bog and the range, ending in the ring's void (${eastOf(l11)}; ${westOf(m11)})`);
  // Loch Fada's country behind the road (M10, M11 and N9, #497). M10 meets M9's south edge, the loch's
  // open water at columns 4 to 12, its shallows, its shores, the hills, the crag and the pines, its own
  // grass against M9's hills at column 18 and its pines against M9's closed corner; on the west the far
  // shore's grass and hills against L10, on the east the pines and the burn frozen at rows 18 and 19
  // against N10 (Glacier Foot, call 7). M11 meets M10's south edge, the pines either side of the
  // ridge; on the west the pines and the marsh against L11, and the range (the ring, so the void); on
  // the east the pines and the ridge down to the glacier against N11; on the south the rim's range. N9
  // meets M9's east edge with the pines at rows 9 and 10, its only way in, and stands closed elsewhere:
  // the Rimefells along the north against N8's hills and heather, and the glacier's wall along the east
  // and the south against O9 and N10. None of N10, N11, M12 and O9 is built, so the world ends past
  // them.
  ok(northOf(m10) === ',_~~' + 'W'.repeat(9) + '~~,,,,^^MM' + 'p'.repeat(9) && eastOf(m10) === 'p'.repeat(18) + 'ii' + 'p'.repeat(12),
    `M10's north edge meets M9's south edge, the loch's water, its shores, the hills, the crag and the pines, and its east edge the pines and the frozen burn against N10 (${northOf(m10)}; ${eastOf(m10)})`);
  ok(southOf(m10) === 'p'.repeat(20) + 'M'.repeat(5) + 'p'.repeat(7) && northOf(m11) === 'p'.repeat(20) + 'M'.repeat(6) + 'p'.repeat(6)
    && eastOf(m11) === 'p'.repeat(5) + '%'.repeat(13) + 'p' + '%'.repeat(13) && southOf(m11) === '%'.repeat(32),
    `M10's south edge meets M11's north edge, the pines either side of the ridge; M11's east edge is the pines and the ridge against N11, and its south edge the rim's range, the world's end (${southOf(m10)}; ${northOf(m11)}; ${eastOf(m11)})`);
  const n9Ways = [...Array(32).keys()].filter((y) => out.passable(n9.x - 1, n9.y + y) === 'ok' && out.passable(n9.x, n9.y + y) === 'ok');
  ok(northOf(n9) === 'M'.repeat(31) + '%' && westOf(n9) === 'M'.repeat(7) + 'p'.repeat(23) + 'M%' && eastOf(n9) === '%'.repeat(32) && southOf(n9) === '%'.repeat(32) && n9Ways.join() === '9,10',
    `N9's west edge meets M9's east edge with the pines at rows 9 and 10, its only way in, its north edge is the Rimefells closed against N8, and its east and south edges the glacier's wall against O9 and N10, the world's end (${northOf(n9)}; ${westOf(n9)}; ways in at rows ${n9Ways.join(', ')})`);
  // Monks' Vale (J11, #499), the Whitespine's first box: in over the pass from K10, taken, its road's
  // first square at 20,0 against J10's corner, where the atlas's road crosses, between the hills and the
  // pines; on the north otherwise the peaks and the mountain (the ring, so the void) against J10; on the
  // west the crest's mountain and peaks against I11 (#501), the summit's path going on over it at row 10;
  // on the south the peaks and the hills against J12; and on the east a peak, the hills and the vale's
  // grass against K11 (#497), below. Neither J10 nor J12 is built, so the world ends past them.
  const j11 = out.zones.find((z) => z.id === 'monksvale_j11')!;
  ok(northOf(j11) === '%%%%AAAA%%%%%^^^^^,,=pp%AAAAAA%%' && southOf(j11) === '%%%%' + 'A'.repeat(8) + '%'.repeat(6) + '^'.repeat(14)
    && [...Array(32).keys()].every((i) => [out.at(j11.x + i, j11.y + 32), out.at(j11.x + i, j11.y - 1)].every((c) => c.ch === '%')),
    `J11's north edge is the peaks, the hills, the road at column 20 and the pines against J10, and its south edge the peaks and the hills against J12, past which the world ends (${northOf(j11)}; ${southOf(j11)})`);
  ok(westOf(j11) === '%MM' + 'A'.repeat(7) + '*' + 'M'.repeat(9) + 'A'.repeat(8) + 'MMM%' && eastOf(j11) === '%MA' + 'M'.repeat(11) + '^^^^' + ','.repeat(13) + '^',
    `J11's west edge is the crest's mountain and peaks against I11, the summit's path crossing at row 10, and its east edge the mountain, a peak, the hills and the vale's grass against K11 (${westOf(j11)}; ${eastOf(j11)})`);
  // South of the pass (K11, #497): its north edge K10's south edge square for square, the pines, the ice
  // at 27 and 28 and the lake, walked anywhere; its west edge the mountain at rows 1 to 13 against J11's
  // mountain and peak, and J11's east edge square for square at 14 to 31, the hills and the vale's grass, walked; on the
  // east the lake, its ice and the pines against L11, and on the south the vale's grass, the pines and
  // the rim's crags against K12. K12 is not built, so the world ends past it; L11 is (#497), below.
  const k11 = out.zones.find((z) => z.id === 'coldmere_k11')!;
  ok(northOf(k11) === southOf(k10) && k11.y === k10.y + k10.h && k11.x === j11.x + j11.w && westOf(k11).slice(1, 14) === 'M'.repeat(13) && westOf(k11).slice(14) === eastOf(j11).slice(14)
    && eastOf(k11) === 'W'.repeat(7) + 'ii' + 'p'.repeat(23) && southOf(k11) === '^^,,,,' + 'p'.repeat(8) + '%'.repeat(9) + 'p'.repeat(9)
    && [...Array(32).keys()].every((i) => out.at(k11.x + i, k11.y + 32).ch === '%'),
    `K11's north edge meets K10's south edge square for square, its west edge J11's east edge at the hills and the grass, and its east edge is the lake, its ice and the pines against L11 and its south edge the vale's grass, the pines and the crags against K12, past which the world ends (${northOf(k11)}; ${westOf(k11)}; ${eastOf(k11)}; ${southOf(k11)})`);
  ok(k11.x + k11.w === l11.x && k11.y === l11.y && eastOf(k11) === 'W'.repeat(7) + 'ii' + 'p'.repeat(23) && westOf(l11) === 'W'.repeat(7) + '~~' + 'p'.repeat(23),
    `K11's east edge meets L11's west edge, the lake, its ice and the pines (${eastOf(k11)}; ${westOf(l11)})`);
  // The Peak Stone's box (I11, #501): its east edge meets J11's west edge square for square, the
  // summit's path crossing at row 10, walked; on the north the pines, the Sheer, the ridge trail at
  // 27,0 where the atlas's trail crosses, beside the Stone at 28,0, and the mountain against I10's
  // south edge (#502), the trail going on north; on the west Ashfall's pines, grass and ash under the
  // Sheer against H11; on the south the ash, the hills, the Sheer, the pines and the mountain against
  // I12. Neither H11 nor I12 is built, so the world ends past them.
  const i11 = out.zones.find((z) => z.id === 'highspine_i11')!, i10 = out.zones.find((z) => z.id === 'highspine_i10')!;
  ok(eastOf(i11) === 'MMM' + 'A'.repeat(7) + '*' + 'M'.repeat(7) + 'A'.repeat(9) + 'MMMM%' && [...Array(32).keys()].every((i) => out.at(i11.x + 32, i11.y + i).ch === westOf(j11)[i]),
    `I11's east edge is the crest's mountain and peaks against J11's west, the summit's path crossing at row 10 (${eastOf(i11)})`);
  ok(northOf(i11) === 'ppp||' + 'p'.repeat(20) + 'MM="MMM' && southOf(i11) === 'aaa^^pp||' + 'p'.repeat(17) + '%'.repeat(6) && westOf(i11) === 'ppppppp,' + 'a'.repeat(13) + ',' + 'a'.repeat(10)
    && [...Array(32).keys()].every((i) => [out.at(i11.x - 1, i11.y + i), out.at(i11.x + i, i11.y + 32)].every((c) => c.ch === '%') && out.at(i11.x + i, i11.y - 1).ch === southOf(i10)[i]),
    `I11's north edge is the pines, the Sheer, the trail at 27,0 and the Stone at 28,0 against I10's south edge, its west edge Ashfall's ground under the Sheer against H11 and its south edge the ash, the Sheer, the pines and the mountain against I12, past which the world ends (${northOf(i11)}; ${westOf(i11)}; ${southOf(i11)})`);
  // Stairwatch and the Stair's head (I10, #502): its south edge meets I11's north edge square for
  // square, the ridge trail crossing at 27, walked, the mountain closing the Stone's ring round above
  // it; on the north the Sheer, the pines and the trail at 18,0, where the atlas's trail crosses, then
  // the mountain and the peaks against I9's south edge (#503), the trail going on north; on the west
  // the Sheer, the Stair cut down through it at 0,20, and Ashfall's ground under it against H10's east
  // edge square for square (#510), the Stair going on down onto H10's 31,20; on the east the range
  // against J10. J10 is not built, so the world ends past it.
  ok(southOf(i10) === 'ppp||' + 'p'.repeat(21) + 'M=MMM%' && [...Array(32).keys()].every((i) => out.at(i10.x + i, i10.y + 32).ch === northOf(i11)[i]),
    `I10's south edge is the pines, the Sheer, the ridge trail at 27 and the mountain against I11's north (${southOf(i10)})`);
  const i9 = out.zones.find((z) => z.id === 'sheerpoint_i9')!, h9 = out.zones.find((z) => z.id === 'cindercoast_h9')!;
  ok(northOf(i10) === '|' + 'p'.repeat(17) + '=' + 'M'.repeat(5) + 'A'.repeat(7) + '%' && eastOf(i10) === '%%%' + 'A'.repeat(11) + '%%' + 'A'.repeat(7) + '%'.repeat(9)
    && [...Array(32).keys()].every((i) => [out.at(i10.x + 32, i10.y + i)].every((c) => c.ch === '%') && out.at(i10.x + i, i10.y - 1).ch === southOf(i9)[i]),
    `I10's north edge is the Sheer, the pines and the trail at 18,0 against I9's south and its east edge the range against J10, past which the world ends (${northOf(i10)}; ${eastOf(i10)})`);
  const h10 = out.zones.find((z) => z.id === 'cindercoast_h10')!;
  ok(westOf(i10) === '|'.repeat(20) + '=pppp' + 'aa' + 'p'.repeat(5) && h10.x + h10.w === i10.x && h10.y === i10.y && eastOf(h10) === westOf(i10),
    `I10's west edge, the Sheer with the Stair at 0,20 and Ashfall's ground under it, meets H10's east edge square for square, the Stair going on down at 31,20 (${westOf(i10)})`);
  // The ridge north (I9, #503), Sheer Point's first box: its south edge meets I10's north edge square
  // for square, the pines open across it and the ridge trail crossing at 18, walked; on the north the
  // sea and the shallows, the pines, the mountain and the peaks and the trail at 20,0, where the
  // atlas's trail crosses, against I8's south edge (#504), the trail going on north; on the west the
  // sea, the pines and the Sheer against H9; on the east Loch Fuar's mountain and peaks against J9's
  // mountain and pines (#497). Its west edge meets H9's east (#522), the sand and the pines open both
  // sides at rows 7 to 16 and the Sheer closing the rest.
  ok(southOf(i9) === '|' + 'p'.repeat(17) + '=' + 'MMMM' + 'A'.repeat(8) + 'M' && [...Array(32).keys()].every((i) => out.at(i9.x + i, i9.y + 32).ch === northOf(i10)[i]) && i9.x === i10.x && i9.y + i9.h === i10.y,
    `I9's south edge is the Sheer, the pines, the ridge trail at 18 and the mountain against I10's north (${southOf(i9)})`);
  const i8 = out.zones.find((z) => z.id === 'sheerpoint_i8')!;
  ok(northOf(i9) === 'WW~~ppp' + 'M'.repeat(7) + 'A'.repeat(6) + '=' + 'M'.repeat(11) && westOf(i9) === 'WWWW~~_' + 'p'.repeat(10) + '|'.repeat(15) && eastOf(i9) === 'M'.repeat(20) + 'A'.repeat(5) + 'M'.repeat(7)
    && h9.x + h9.w === i9.x && h9.y === i9.y && eastOf(h9) === 'W'.repeat(5) + '~~_' + 'p'.repeat(9) + '|'.repeat(15)
    && [...Array(10).keys()].every((i) => out.passable(i9.x, i9.y + 7 + i) === 'ok' && out.passable(h9.x + 31, h9.y + 7 + i) === 'ok')
    && [...Array(32).keys()].every((i) => out.at(i9.x - 1, i9.y + i).ch === eastOf(h9)[i] && out.at(i9.x + 32, i9.y + i).ch === westOf(j9)[i] && out.at(i9.x + i, i9.y - 1).ch === southOf(i8)[i]),
    `I9's north edge is the sea, the pines, the peaks and the trail at 20,0 against I8's south, its west edge the sea, the pines and the Sheer against H9's east edge, the pines open both sides at rows 7 to 16, and its east edge Loch Fuar's mountain against J9's west (${northOf(i9)}; ${westOf(i9)}; ${eastOf(h9)}; ${eastOf(i9)})`);
  // Sheer Point (I8, #504), the Point's tip: its south edge meets I9's north edge square for square, the
  // shallows and the pines open across it at 2 to 6 and the ridge trail crossing at 20, walked; on the
  // north and the west the sea; on the east the tip's hills and the pines down to the deserter's rocks
  // against unbuilt J8. The world ends past all three, the causeway stopping in the water short of
  // the north edge.
  ok(southOf(i8) === 'WW~~ppp' + 'M'.repeat(9) + 'A'.repeat(4) + '=' + 'M'.repeat(10) + 'r' && [...Array(32).keys()].every((i) => out.at(i8.x + i, i8.y + 32).ch === northOf(i9)[i]) && i8.x === i9.x && i8.y + i8.h === i9.y,
    `I8's south edge is the sea, the shallows and the pines, the mountain and the peaks and the ridge trail at 20 against I9's north (${southOf(i8)})`);
  ok(northOf(i8) === 'W'.repeat(32) && westOf(i8) === 'W'.repeat(32) && eastOf(i8) === 'W'.repeat(8) + '~~~' + '^'.repeat(8) + 'p'.repeat(11) + ':r'
    && [...Array(32).keys()].every((i) => [out.at(i8.x - 1, i8.y + i), out.at(i8.x + 32, i8.y + i), out.at(i8.x + i, i8.y - 1)].every((c) => c.ch === '%')),
    `I8's north and west edges are the sea and its east edge the tip's hills and the pines against J8, past which the world ends (${northOf(i8)}; ${westOf(i8)}; ${eastOf(i8)})`);
  // Cinderport's box (G10, #511), Ashfall's first, begun by sea and joined overland to the Waste's road west
  // of it (#517), the Stair's foot east of it (#510) and Fire Mountain's flank south of it (#513): on the
  // north the vines, the road at column 3 up the wall's west side, Cinderport's wall, the stream and the
  // grass against G9's shore; on the south the ash either side of Fire Mountain's foot against G11, built
  // (#513), so the foot stays mountain between the two; on the west the vines, the road out at rows 7 and
  // 8 and the ash meeting F10's east edge (#517); and on the east the vines, the ash and the stream at
  // rows 22 and 23 against H10's west edge, square for square but at row 11, where H10's shore track
  // comes out onto G10's vines (#510). Its north edge meets G9's south (#522): the road at 3, open both
  // sides, the town's wall against the sea wall's moles and the harbour, the stream and the grass.
  const g10 = out.zones.find((z) => z.id === 'cindercoast_g10')!, g9 = out.zones.find((z) => z.id === 'cindercoast_g9')!;
  ok(northOf(g10) === '&&&=' + 'B'.repeat(10) + '~~~,,,,^^,,,,,&&&&' && southOf(g10) === 'a'.repeat(6) + 'M'.repeat(15) + 'a'.repeat(11)
    && g9.x === g10.x && g9.y + g9.h === g10.y && southOf(g9) === '&&&=,B' + 'W'.repeat(7) + 'B~~~' + ','.repeat(14) + '&'
    && out.passable(g9.x + 3, g9.y + 31) === 'ok' && out.passable(g10.x + 3, g10.y) === 'ok',
    `G10's north edge is the vines, the road at column 3, the town's wall, the stream and the grass against G9's south edge, the road open both sides and the wall against the sea wall's moles and the harbour, and its south edge the ash either side of the mountain's foot against G11 (${northOf(g10)}; ${southOf(g9)}; ${southOf(g10)})`);
  ok(westOf(g10) === '&'.repeat(7) + '==' + '&'.repeat(5) + 'a'.repeat(18),
    `G10's west edge is the vines, the road out at rows 7 and 8 and the ash against F10 (${westOf(g10)})`);
  ok(eastOf(g10) === '&'.repeat(14) + 'a'.repeat(8) + '~~' + 'a'.repeat(8) && g10.x + g10.w === h10.x && g10.y === h10.y && westOf(h10) === eastOf(g10).slice(0, 11) + '=' + eastOf(g10).slice(12),
    `G10's east edge, the vines, the ash and the stream at rows 22 and 23, meets H10's west edge square for square but at row 11, H10's track out of the vines (${eastOf(g10)}; ${westOf(h10)})`);
  // Fire Mountain's flank (G11, #513): its north edge meets G10's south edge, each as the atlas cuts
  // it, the ash either side of the mountain's foot, walked across at columns 0 to 4 and 23 to 31; on the
  // west the ash, the cone's flank and the two flows leaving west against F11, built (#514), so the flank
  // stays mountain between the two; on the east the ash, Grimsforge's wall, the scavenger's rocks and the
  // south-east flow leaving against H11, the hole's far end open ash, the way down into Meridian Camp
  // (#22); on the south the ash against G12. Neither H11 nor G12 is built, so the world ends past them.
  const g11 = out.zones.find((z) => z.id === 'firemount_g11')!;
  ok(g11.x === g10.x && g11.y === g10.y + 32 && northOf(g11) === 'a'.repeat(5) + 'M'.repeat(18) + 'a'.repeat(9) && southOf(g11) === 'a'.repeat(32)
    && [...Array(32).keys()].every((i) => [out.at(g11.x + 32, g11.y + i), out.at(g11.x + i, g11.y + 32)].every((c) => c.ch === '%')),
    `G11's north edge meets G10's south edge, the ash either side of the mountain's foot, and its south edge is the ash against G12, past which the world ends (${northOf(g11)}; ${southOf(g11)})`);
  ok(westOf(g11) === 'a'.repeat(4) + 'M'.repeat(6) + '!!' + 'a'.repeat(9) + '!!!' + 'a'.repeat(8) && eastOf(g11) === 'a'.repeat(12) + 'BBaraar' + 'a'.repeat(8) + '!!!!a',
    `G11's west edge is the ash, the cone's flank and the two flows against F11, and its east edge the ash, Grimsforge, the scavenger's rocks and the south-east flow against H11, past which the world ends (${westOf(g11)}; ${eastOf(g11)})`);
  // The Stair's foot (H10, #510): on the north the vines, the grass of the shore, the pines and the Sheer
  // against H9's shore; on the south the ash, the stream at 4 and 5 and the pines under the Sheer against
  // H11. Its north edge meets H9's south (#522), open both sides from the west to the pines at 29; H11 is not
  // built, so the world ends past it.
  ok(northOf(h10) === '&'.repeat(7) + ','.repeat(22) + 'p||' && southOf(h10) === 'aaaa~~' + 'a'.repeat(22) + 'pppp'
    && h9.x === h10.x && h9.y + h9.h === h10.y && southOf(h9) === ',,,&&&&' + ','.repeat(22) + 'pp|'
    && [...Array(30).keys()].every((i) => out.passable(h9.x + i, h9.y + 31) === 'ok' && out.passable(h10.x + i, h10.y) === 'ok')
    && [...Array(32).keys()].every((i) => out.at(h10.x + i, h10.y + 32).ch === '%'),
    `H10's north edge is the vines, the grass, the pines and the Sheer against H9's south edge, open both sides from the west to the pines at 29, and its south edge the ash, the stream and the pines against H11, past which the world ends (${northOf(h10)}; ${southOf(h9)}; ${southOf(h10)})`);
  // The Ember Waste's road (F10 and E10, #517), joined to G10 alone, over its west edge. F10's east edge meets G10's
  // west square for square, the road at rows 7 and 8, and its west edge E10's east, the road at rows 29
  // and 30 (F10's rock at 0,31 against E10's ash). F10's north edge is the ash and the vines against F9
  // and its south the rocks and the road at columns 5 to 11, F11's corner, against F11; E10's north is
  // the hills, the steppe, the grass and the ash, square for square with the south edge of the Wold's E9
  // (#534), every square open both sides, its south the steppe, the hills, the ash and the flow's head
  // against E11, and its west the hills and the steppe, the road at row 6, against the Wold's D10. F11 is
  // built under F10 (#514), D10 beside E10 (#527), E9 over it (#534) and F9 over F10 (#522), its south edge
  // square for square with F10's north, every square open both sides; E11 is not, so the world ends past it.
  const f10 = out.zones.find((z) => z.id === 'emberwaste_f10')!, e10 = out.zones.find((z) => z.id === 'emberwaste_e10')!;
  const open = (x: number, y: number): boolean => out.passable(x, y) === 'ok';
  const f9 = out.zones.find((z) => z.id === 'cindercoast_f9')!;
  ok(f10.x + f10.w === g10.x && f10.y === g10.y && eastOf(f10) === westOf(g10) && [...Array(32).keys()].every((i) => open(f10.x + 31, f10.y + i) && open(g10.x, g10.y + i)),
    `F10's east edge meets G10's west edge square for square, the road at rows 7 and 8, every square open both sides (${eastOf(f10)})`);
  ok(e10.x + e10.w === f10.x && e10.y === f10.y && westOf(f10) === 'a'.repeat(29) + '==r' && eastOf(e10) === 'a'.repeat(29) + '==a'
    && [...Array(31).keys()].every((i) => open(e10.x + 31, e10.y + i) && open(f10.x, f10.y + i)),
    `F10's west edge meets E10's east edge square for square, the road at rows 29 and 30, F10's rock at the corner (${westOf(f10)}; ${eastOf(e10)})`);
  ok(northOf(f10) === 'a'.repeat(11) + '&'.repeat(21) && southOf(f10) === 'r'.repeat(5) + '='.repeat(7) + 'r'.repeat(3) + 'a'.repeat(17)
    && f9.x === f10.x && f9.y + f9.h === f10.y && southOf(f9) === northOf(f10) && [...Array(32).keys()].every((i) => open(f9.x + i, f9.y + 31) && open(f10.x + i, f10.y)),
    `F10's north edge is the ash and the vines, square for square with F9's south edge, every square open both sides, and its south edge the rocks and the road at columns 5 to 11 against F11 (${northOf(f10)}; ${southOf(f10)})`);
  const e9 = out.zones.find((z) => z.id === 'wold_e9')!;
  ok(northOf(e10) === 's'.repeat(7) + '^'.repeat(6) + 's'.repeat(3) + ','.repeat(3) + 'a'.repeat(13) && southOf(e9) === northOf(e10) && e9.x === e10.x && e9.y + 32 === e10.y
    && [...Array(32).keys()].every((i) => open(e10.x + i, e10.y) && open(e9.x + i, e9.y + 31))
    && southOf(e10) === 's'.repeat(9) + ',,' + '^'.repeat(9) + 'aaa!!' + 'a'.repeat(7) && westOf(e10) === 's' + '^'.repeat(5) + '=^' + 's'.repeat(24)
    && [...Array(32).keys()].every((i) => out.at(e10.x + i, e10.y + 32).ch === '%'),
    `E10's north edge is the hills, the steppe, the grass and the ash, square for square with E9's south edge, every square open both sides; its south the steppe, the hills, the ash and the flow's head against E11, past which the world ends, and its west the hills and the steppe, the road at row 6, against D10 (${northOf(e10)}; ${southOf(e10)}; ${westOf(e10)})`);
  // Old Cinder's and the Ember Stone's box (F11, #514), joined to F10 over its north edge and to G11 over its
  // east. Its north edge meets F10's south edge square for square, the rocks, the Waste's road at columns
  // 5 to 11 and the ash, every square of the ash open both sides; its east edge meets G11's west, the ash,
  // the mountain's foot, the west flow at rows 10 and 11 and the second flow at rows 21 to 23. On the
  // west the Waste's rock, the ash and the builders' rock against E11, the mountain's corner the ring; on
  // the south the corner, the ash and the second flow going on against F12. Neither E11 nor F12 is
  // built, so the world ends past them.
  const f11 = out.zones.find((z) => z.id === 'emberwaste_f11')!;
  ok(f11.x === f10.x && f11.y === f10.y + 32 && northOf(f11) === southOf(f10) && [...Array(17).keys()].every((i) => open(f11.x + 15 + i, f11.y) && open(f10.x + 15 + i, f10.y + 31)),
    `F11's north edge meets F10's south edge square for square, the rocks, the road at columns 5 to 11 and the ash, the ash open both sides (${northOf(f11)})`);
  ok(f11.x + f11.w === g11.x && f11.y === g11.y && eastOf(f11) === westOf(g11),
    `F11's east edge meets G11's west edge square for square, the ash, the mountain's foot and the two flows (${eastOf(f11)})`);
  ok(westOf(f11) === 'r'.repeat(19) + 'aa' + 'r'.repeat(5) + 'aaa' + '%%%' && southOf(f11) === '%'.repeat(4) + 'a'.repeat(23) + '!!' + 'aaa'
    && [...Array(32).keys()].every((i) => [out.at(f11.x - 1, f11.y + i), out.at(f11.x + i, f11.y + 32)].every((c) => c.ch === '%')),
    `F11's west edge is the rock and the ash against E11, and its south edge the ash and the second flow against F12, past which the world ends (${westOf(f11)}; ${southOf(f11)})`);
  // The steppe (D9, #525), the Wold's first box built, joined to E10 by D10 (#527) under it. Its north edge
  // is the steppe and the Riders' track at column 16, square for square with the south edge of Akordu's box,
  // D8 (#526); its west the steppe, the dunes and the road at row 21 against C9, the Glass's, not built, so
  // the world ends past it; its east the steppe, square for square with E9's west edge (#534). Its south, the dunes, the
  // steppe, the road at columns 22 and 23, where the atlas crosses, and the great mesa's rock, meets D10's
  // north edge.
  const d9 = out.zones.find((z) => z.id === 'wold_d9')!, d8 = out.zones.find((z) => z.id === 'wold_d8')!;
  ok(northOf(d9) === 's'.repeat(16) + ':' + 's'.repeat(15) && southOf(d8) === northOf(d9) && d8.x === d9.x && d8.y + 32 === d9.y
    && southOf(d9) === 'u'.repeat(6) + 's'.repeat(16) + '==' + 'r'.repeat(6) + 'ss'
    && westOf(d9) === 's'.repeat(4) + 'u'.repeat(17) + '=' + 'u'.repeat(10) && eastOf(d9) === 's'.repeat(32) && westOf(e9) === eastOf(d9) && e9.x === d9.x + 32 && e9.y === d9.y
    && [...Array(32).keys()].every((i) => out.at(d9.x - 1, d9.y + i).ch === '%'),
    `D9's north edge is the steppe and the Riders' track at column 16, square for square with D8's south edge, its west the steppe, the dunes and the road at row 21 against C9, past which the world ends, its east the steppe, square for square with E9's west edge, and its south the dunes, the steppe, the road at columns 22 and 23 and the rocks against D10 (${northOf(d9)}; ${southOf(d9)}; ${westOf(d9)}; ${eastOf(d9)})`);
  // Akordu's box (D8, #526): its south edge meets D9's north edge, the Riders' track at column 16 coming
  // up into the camp; its north edge the steppe and a knoll at columns 7 and 8 against D7, its west the
  // steppe and the hills against C8 (#528), square for square below, and its east the steppe against E8's
  // west edge (#534), every square open both sides. D7 is not built, so the world ends past it.
  ok(southOf(d8) === 's'.repeat(16) + ':' + 's'.repeat(15) && northOf(d8) === 's'.repeat(7) + '^^' + 's'.repeat(23)
    && westOf(d8) === 's'.repeat(18) + '^^' + 's'.repeat(5) + '^'.repeat(6) + 's' && eastOf(d8) === 's'.repeat(32)
    && [...Array(32).keys()].every((i) => out.at(d8.x + i, d8.y - 1).ch === '%'),
    `D8's south edge is the steppe and the Riders' track at column 16 against D9; its north the steppe and a knoll against D7, past which the world ends, its east the steppe against E8 and its west the steppe and the hills against C8 (${northOf(d8)}; ${westOf(d8)}; ${eastOf(d8)})`);
  // The country behind the road (#534): the hills behind E10 (E9) and the shore north of them (E8), on the
  // Wold's row. E9's south edge meets E10's north and its west D9's east, above. Its north edge meets E8's
  // south, the steppe, the sea grass and the sand open both sides from the west to the water; its east
  // edge meets F9's west, Ashfall's coast (#522), the sea, the sand, the grass, the hills and the ash square for
  // square, the land open both sides from the sand down. E8's
  // west edge meets D8's east, the strand's sand at the corner against the steppe, every square open both
  // sides; its north edge is the strand, the sea and an island's south end against E7 and its east the sea
  // against F8. Neither E7 nor F8 is built, so the world ends past them.
  const e8 = out.zones.find((z) => z.id === 'wold_e8')!;
  ok(e9.x === e8.x && e9.y === e8.y + 32 && northOf(e9) === 's'.repeat(16) + ',,,,__~~~' + 'W'.repeat(7) && southOf(e8) === 's'.repeat(16) + ',,,_~~~~' + 'W'.repeat(8)
    && [...Array(20).keys()].every((i) => open(e9.x + i, e9.y) && open(e8.x + i, e8.y + 31))
    && eastOf(e9) === 'W'.repeat(5) + '~~_' + ','.repeat(7) + '^'.repeat(10) + 'a'.repeat(7) && westOf(f9) === eastOf(e9) && f9.x === e9.x + 32 && f9.y === e9.y
    && [...Array(25).keys()].every((i) => open(e9.x + 31, e9.y + 7 + i) && open(f9.x, f9.y + 7 + i))
    && e8.x === d8.x + 32 && e8.y === d8.y && westOf(e8) === '_' + 's'.repeat(31) && [...Array(32).keys()].every((i) => open(e8.x, e8.y + i) && open(d8.x + 31, d8.y + i))
    && northOf(e8) === '__~~' + 'W'.repeat(8) + '~_' + ','.repeat(6) + '~~' + 'W'.repeat(10) && eastOf(e8) === 'W'.repeat(32)
    && [...Array(32).keys()].every((i) => [out.at(e8.x + 32, e8.y + i), out.at(e8.x + i, e8.y - 1)].every((c) => c.ch === '%')),
    `E9's north edge meets E8's south edge, the steppe, the sea grass and the sand open both sides from the west to the water; E9's east edge meets F9's west square for square, the sea, the sand, the grass, the hills and the ash, the land open both sides; E8's west edge meets D8's east, every square open both sides, and its north edge is the strand, the sea and an island's south end against E7 and its east the sea against F8, past all of which the world ends (${northOf(e9)}; ${southOf(e8)}; ${eastOf(e9)}; ${westOf(e8)}; ${northOf(e8)})`);
  // The mesas (D10, #527), the Wold's way in, between E10 and D9. Its east edge meets E10's west: the great
  // mesa's east face at rows 0 to 5 against E10's steppe and hills, the road at row 6, and the hills and the
  // steppe below it open both sides. Its north edge meets D9's south: the dunes and the hills against D9's
  // dunes, the steppe, the road at columns 22 and 23 open both sides, the scree under the mesa's north face
  // at 24 to 26 against D9's rock, and the mesa's rock. Its west, the dunes, the steppe and the small mesa,
  // lies against C10 and its south, the hills and the steppe, against D11, both the Glass's: the world ends.
  const d10 = out.zones.find((z) => z.id === 'wold_d10')!;
  ok(d10.x + d10.w === e10.x && d10.y === e10.y && eastOf(d10) === 'r'.repeat(6) + '=^' + 's'.repeat(24)
    && [...Array(26).keys()].every((i) => open(d10.x + 31, d10.y + 6 + i) && open(e10.x, e10.y + 6 + i)),
    `D10's east edge meets E10's west edge, the mesa's face at rows 0 to 5 against E10's steppe and hills, the road at row 6 and every square below it open both sides (${eastOf(d10)}; ${westOf(e10)})`);
  ok(d10.x === d9.x && d10.y === d9.y + 32 && northOf(d10) === 'u'.repeat(5) + '^^' + 's'.repeat(15) + '==^^^' + 'r'.repeat(5)
    && [...Array(24).keys()].every((i) => open(d10.x + i, d10.y) && open(d9.x + i, d9.y + 31)),
    `D10's north edge meets D9's south edge, the dunes, the hills, the steppe and the road at columns 22 and 23 open both sides, the scree at 24 to 26 against D9's rock (${northOf(d10)}; ${southOf(d9)})`);
  ok(westOf(d10) === 'u'.repeat(7) + 's'.repeat(8) + 'r'.repeat(8) + 's'.repeat(8) + '^' && southOf(d10) === '^s' + '^'.repeat(22) + 's'.repeat(8)
    && [...Array(32).keys()].every((i) => [out.at(d10.x - 1, d10.y + i), out.at(d10.x + i, d10.y + 32)].every((c) => c.ch === '%')),
    `D10's west edge is the dunes, the steppe, the small mesa's rock and the steppe again against C10, and its south the hills and the steppe against D11, past both of which the world ends (${westOf(d10)}; ${southOf(d10)})`);
  // The Scarp's edge (C8, #528): its east edge meets D8's west edge square for square, the steppe and the
  // hills; its north edge is the Scarp's lip, cliff over the Saltings' C7, the rock of the cleft at
  // columns 21 to 24 and the steppe where the lip bends north at the east end, open only at column 8, the
  // stair's last flight, which meets C7's flights cut up column 8 through the mountain from the notch; its
  // west edge the lip's end and the steppe against B8 (#529) and its south the steppe and the hills against
  // C9, parked. Neither is built, so the world ends past them.
  const c8 = out.zones.find((z) => z.id === 'wold_c8')!, c7 = out.zones.find((z) => z.id === 'saltings_c7')!;
  ok(c8.x + c8.w === d8.x && c8.y === d8.y && eastOf(c8) === westOf(d8) && c7.x === c8.x && c7.y + c7.h === c8.y
    && northOf(c8) === '|'.repeat(8) + '"' + '|'.repeat(12) + 'rrrr' + '|||' + 'ssss' && southOf(c7) === '%' + 'M'.repeat(7) + '"' + 'M'.repeat(22) + '%'
    && out.passable(c8.x + 8, c8.y - 1) === 'ok' && out.passable(c8.x + 8, c8.y) === 'ok'
    && westOf(c8) === '|' + 's'.repeat(31) && southOf(c8) === 's'.repeat(27) + '^^sss'
    && [...Array(32).keys()].every((i) => out.at(c8.x + i, c8.y + 32).ch === '%'),
    `C8's east edge meets D8's west edge square for square; its north edge is the Scarp's lip over C7's mountain, open only where the stair's last flight meets C7's flights at column 8; its west the lip's end and the steppe against B8 and its south the steppe and the hills against C9, past which the world ends (${northOf(c8)}; ${southOf(c7)}; ${westOf(c8)}; ${southOf(c8)})`);
  // The Wold's heart (B8, #529): its east edge meets C8's west edge square for square, the lip's end at row
  // 0 and the steppe under it open both sides from row 1 to 31; its north edge is the Scarp's lip, cliff,
  // against B7; its west edge is the rim, the map's mountain laid as the world's end, as a zone map's ring
  // is where it faces nothing built, the corners with it; its south edge the hills under the rim and the
  // steppe, square for square with the Glass's edge, B9 (#530). B7 and A8 are cut, so the world ends past them.
  const b8 = out.zones.find((z) => z.id === 'wold_b8')!;
  ok(b8.x + b8.w === c8.x && b8.y === c8.y && eastOf(b8) === westOf(c8) && [...Array(31).keys()].every((i) => open(b8.x + 31, b8.y + 1 + i) && open(c8.x, c8.y + 1 + i))
    && northOf(b8) === '%%' + '|'.repeat(30) && westOf(b8) === '%'.repeat(32) && southOf(b8) === '%' + '^'.repeat(7) + 's^' + 's'.repeat(22)
    && [...Array(32).keys()].every((i) => [out.at(b8.x + i, b8.y - 1), out.at(b8.x - 1, b8.y + i)].every((c) => c.ch === '%')),
    `B8's east edge meets C8's west edge square for square, open both sides under the lip; its north edge is the Scarp's lip against B7 and its west the rim, the world's end, against A8, past which the world ends, and its south the hills under the rim and the steppe against B9 (${eastOf(b8)}; ${northOf(b8)}; ${westOf(b8)}; ${southOf(b8)})`);
  // The Glass's edge (B9, #530): its north edge meets B8's south edge square for square, the hills under
  // the rim and the steppe, open both sides from column 1 to 31; its west edge is the rim and its south
  // the rim's foot, the map's mountain laid as the world's end against A9 and B10, the Glass's; its east
  // edge the steppe and the dunes against C9 down to row 13, the mesa's rock from 14 to 26, the gap's last
  // square at row 27, open, and the rim's foot under it. C9 and B10 are the reach's, not built, so the world
  // ends past them: the Glass is seen from the gap and not walked into.
  const b9 = out.zones.find((z) => z.id === 'wold_b9')!;
  ok(b9.x === b8.x && b9.y === b8.y + 32 && northOf(b9) === southOf(b8) && [...Array(31).keys()].every((i) => open(b9.x + 1 + i, b9.y) && open(b8.x + 1 + i, b8.y + 31))
    && westOf(b9) === '%'.repeat(32) && southOf(b9) === '%'.repeat(32) && eastOf(b9) === 's' + 'u'.repeat(13) + 'r'.repeat(13) + 'u' + '%'.repeat(4)
    && open(b9.x + 31, b9.y + 27) && !out.exitAt(b9.x + 31, b9.y + 27)
    && [...Array(32).keys()].every((i) => [out.at(b9.x - 1, b9.y + i), out.at(b9.x + 32, b9.y + i), out.at(b9.x + i, b9.y + 32)].every((c) => c.ch === '%')),
    `B9's north edge meets B8's south edge square for square, open both sides; its west the rim and its south the rim's foot, the world's end, and its east the steppe, the dunes and the mesa against C9 with the gap's last square at row 27, open, past all of which the world ends (${northOf(b9)}; ${westOf(b9)}; ${southOf(b9)}; ${eastOf(b9)})`);
  // Fionnlios's box (O7, #477): its west edge meets N7's east edge square for square, the peat-cutter's
  // track crossing at row 22 and the tarn's stream at the corner, out into N7's corner and O8's; its
  // north edge the hills and the Kilns' grass under O6, square for square with O6's south edge but its
  // corner; its east edge the hills under the rim, P7 being cut; its south edge the heather and the
  // hills against O8, and the rim's shoulder at the corner: an M at 30 now O8 is laid, the world's end at 31.
  const o7 = out.zones.find((z) => z.id === 'highmoor_o7')!;
  ok(westOf(o7) === eastOf(n7) && northOf(o7) === '^'.repeat(10) + ','.repeat(14) + '^'.repeat(8),
    `O7's west edge meets N7's east edge square for square, the track at row 22 and the stream at the corner, and its north edge is the hills and the grass under O6 (${westOf(o7)}; ${northOf(o7)})`);
  // O6 (#466), laid over the 388 squares of High Moor's that lay in its south, meets O7 there: its
  // south edge is O7's north edge square for square but the corner, the rim's mountain, the world's end,
  // where O7's is hills; no road, no river and no wall crosses the line.
  ok(southOf(o6).slice(0, 31) === northOf(o7).slice(0, 31) && southOf(o6)[31] === '%' && northOf(o7)[31] === '^' && !/[=~W]/.test(southOf(o6) + northOf(o7)),
    `O6's south edge meets O7's north edge square for square but the corner, hills, grass and hills again, with no road or water across it (${southOf(o6)}; ${northOf(o7)})`);
  ok(eastOf(o7) === '^'.repeat(30) + '%%' && southOf(o7) === '~' + 'h'.repeat(16) + '**hh' + '^'.repeat(9) + 'M%',
    `O7's east edge is the hills under the rim, and its south edge the heather and the hills against O8 with the stream out at the west corner and the rim's shoulder at the east (${eastOf(o7)}; ${southOf(o7)})`);
  // The bog (O8, #478): in from N8 by the heather and the marsh at the bog's edge, the stream at the
  // corner, N8's east edge square for square; on the north O7's south edge square for square, the
  // stream at the corner and the rim's shoulder at the other; on the east the hills against P8 and on
  // the south the heather and the hills against O9, the world's end, the first of the Rimefells at the
  // south-east corner.
  const o8 = out.zones.find((z) => z.id === 'highmoor_o8')!;
  ok(westOf(o8) === eastOf(n8) && northOf(o8) === southOf(o7),
    `O8's west edge meets N8's east edge square for square, and its north edge meets O7's south edge square for square, the stream, the heather, a drift and the hills (${westOf(o8)}; ${northOf(o8)})`);
  ok(eastOf(o8) === '%%' + '^'.repeat(18) + '%'.repeat(12) && southOf(o8) === 'h'.repeat(11) + '^'.repeat(17) + '%%%%',
    `O8's east edge is the hills against P8, and its south edge the heather and the hills against O9, the Rimefells' shoulders at the corners (${eastOf(o8)}; ${southOf(o8)})`);
  // West, the Downs: the Foreland's ring stands against F2 as mountains, with the Salt Road's gap.
  const west = line(sh.x, sh.y, 0, 1, sh.h);
  ok(west === '%' + 'M'.repeat(28) + '=M%', `the Foreland's west edge is mountains against the Downs, with the Salt Road through a gap (${west})`);
  const ridge = '%' + 'M'.repeat(8) + '=' + 'M'.repeat(21) + '%';
  ok(line(sh.x + sh.w - 1, sh.y, 0, 1, sh.h) === ridge && line(th.x, th.y, 0, 1, th.h) === ridge.slice(0, -1) + 'M', 'between them the ridge stands two squares thick with the pass through it, and runs out into the void at its north end and on Thornmark\'s side into the Deepthorn\'s edge at its south');
  // The ways: every one lands on open ground; none joins one zone to the next, which is walked, but the
  // drove road's notch, taken down from N8 onto M9 and back up, since the two meet only at a corner
  // across M8's (#479, #486), and the pass on from K10 over onto J11 and back, the two
  // meeting at no square across parked J10's corner (#499); no gate closes the road; and the towns and dungeons open
  // onto the outdoors.
  const maps = buildMaps();
  for (const d of PLAYED_DEFS) for (const e of d.exits ?? []) ok(maps[e.to]?.passable(e.tx, e.ty) === 'ok', `${d.id} -> ${e.to}: lands on an open square (${e.tx},${e.ty})`);
  const notchN8 = out.zones.find((z) => z.id === 'cairnfield_n8')!, notchM9 = out.zones.find((z) => z.id === 'longmere_m9')!;
  const taken = out.exits.filter((e) => e.to === OUTDOORS).map((e) => `${e.x},${e.y}`).sort().join(' ');
  ok(taken === [`${notchN8.x},${notchN8.y + 28}`, `${notchM9.x + 23},${notchM9.y + 8}`, `${k10.x},${k10.y + 19}`, `${j11.x + 20},${j11.y}`].sort().join(' '),
    `no exit joins one zone to the next but the notch between N8 and M9 and the pass between K10 and J11, each taken both ways: the way between them is walked (${taken})`);
  ok(out.gates.length === 0, `no gate closes the road through the outdoors${out.gates.length ? ' -> ' + out.gates.map((g) => `${g.x},${g.y}`).join(', ') : ''}`);
  { // The machinery stays for the story's own locks (EXPANSION §2.3): an exit into the zone next door
    // that asks for flags is laid as a gate on its square, and refuses the party until they are set.
    const defs = MAP_DEFS.map((d) => d.id !== 'shelf' ? d : { ...d, exits: d.exits!.map((e) => e.to !== 'thornmark' ? e : { ...e, needFlag: ['fixture_a', 'fixture_b'], blockedText: 'Fixture gate.' }) });
    const laid = layOutdoors(ATLAS, defs), fx = new GameMap(laid.find((d) => d.id === OUTDOORS)!);
    const g = fx.gates;
    ok(g.length === 1 && g[0].x === sh.x + 31 && g[0].y === sh.y + 9 && [g[0].needFlag].flat().join() === 'fixture_a,fixture_b' && g[0].blockedText === 'Fixture gate.', `an exit with flags into the zone next door is laid as a gate on its square, with its words (${g.map((q) => `${q.x},${q.y}`).join(', ')})`);
    const rng = makeRng(3), party = defaultParty(rng);
    const world = new World(Object.fromEntries(laid.map((d) => [d.id, new GameMap(d)])), party, rng);
    world.travel('shelf', 30, 9, EAST);
    const shut = world.move('forward');
    party.flags.fixture_a = 1;
    const half = world.move('forward');
    party.flags.fixture_b = 1;
    const open = world.move('forward');
    ok(shut.kind === 'blocked' && shut.reason === 'Fixture gate.' && half.kind === 'blocked' && open.kind === 'moved' && local(world).x === 31,
      `the gate refuses the party with its words until every flag is set, then lets it through (${shut.kind}, ${half.kind}, ${open.kind})`);
  }
  { // An exit into the zone next door that is shut while a condition holds is laid as a gate that
    // carries it, and refuses the party only while it holds (#157).
    const defs = MAP_DEFS.map((d) => d.id !== 'shelf' ? d : { ...d, exits: d.exits!.map((e) => e.to !== 'thornmark' ? e : { ...e, shut: { flag: 'fixture_c', member: { race: 'orcblood' as const } }, blockedText: 'Fixture shut.' }) });
    const laid = layOutdoors(ATLAS, defs), fx = new GameMap(laid.find((d) => d.id === OUTDOORS)!);
    const g = fx.gates;
    ok(g.length === 1 && g[0].x === sh.x + 31 && g[0].y === sh.y + 9 && g[0].needFlag === undefined && JSON.stringify(g[0].shut) === JSON.stringify({ flag: 'fixture_c', member: { race: 'orcblood' } }) && g[0].blockedText === 'Fixture shut.',
      `an exit shut on a condition into the zone next door is laid as a gate on its square that carries it (${g.map((q) => `${q.x},${q.y}`).join(', ')})`);
    const rng = makeRng(3), party = defaultParty(rng);
    const world = new World(Object.fromEntries(laid.map((d) => [d.id, new GameMap(d)])), party, rng);
    const go = (): string => { world.travel('shelf', 30, 9, EAST); const r = world.move('forward'); return r.kind === 'blocked' ? r.reason : r.kind; };
    const before = go();
    party.flags.fixture_c = 1;
    const shut = go();
    const orc = party.members.splice(party.members.findIndex((m) => m.race === 'orcblood'), 1);
    const without = go();
    party.members.push(...orc);
    ok(before === 'moved' && shut === 'Fixture shut.' && without === 'moved', `the shut gate lets the party through until its condition holds, refuses it while it does, and opens once it stops (${before}, ${shut}, ${without})`);
  }
  { // Helmstow's south gate, its bottom row, opens onto the road, and the harbour postern beside it
    // onto the Lodestone's track (#157); its north gate into the keep's ward.
    const harrow = PLAYED_DEFS.find((d) => d.id === 'harrow')!, bottom = harrow.exits!.filter((e) => e.y === harrow.rows.length - 1);
    const south = bottom.filter((e) => e.x === 7 || e.x === 8), postern = bottom.filter((e) => e.x !== 7 && e.x !== 8);
    ok(south.length > 0 && south.every((e) => e.to === OUTDOORS && e.tx === sh.x + 16 && e.ty === sh.y + 4), 'Helmstow\'s south gate opens onto the Foreland road, where it always did');
    ok(postern.length === 1 && postern[0].x === 13 && postern[0].to === OUTDOORS && postern[0].tx === sh.x + 18 && postern[0].ty === sh.y + 4, 'and the harbour postern beside it onto the track to the Lodestone');
    ok(harrow.exits!.filter((e) => e.y !== harrow.rows.length - 1).every((e) => e.y === 0 && e.to === 'keep'), 'and its only other way out is the north gate, into the keep\'s ward');
  }
  ok(sh.enter?.thornmark === 'Back through the pass to the Foreland.' && th.enter?.shelf === 'The pass opens onto old forest. Thornmark.', 'crossing from one zone to the other says what the exits used to');
  { // Every open square of the outdoors can be walked to from its start, given keys, secrets, water and climbing, and never through the void or the chasm,
    // but for a zone map laid before the one that joins it (CUT_OFF). A crossing a person sells
    // (game/passage.ts) puts the company down on its landing, so each landing on a zone map is
    // walked from too, and so is a town's way out onto one where the landing is in the town, as G10 is
    // reached through Cinderport (#512): the gate counts each a way in (`landings`, tools/tests/gate.ts).
    const reached = new Uint8Array(out.width * out.height);
    const stack = [[out.def.start.x, out.def.start.y]];
    for (const d of MAP_DEFS) for (const f of d.features ?? []) if (f.kind === 'npc') for (const p of f.passage ?? []) {
      const z = out.zones.find((q) => q.id === p.to);
      if (z) stack.push([z.x + p.x, z.y + p.y]);
      const town = MAP_DEFS.find((t) => t.id === p.to && t.kind === 'town');
      for (const e of town?.exits ?? []) { const w = out.zones.find((q) => q.id === e.to); if (w) stack.push([w.x + e.tx, w.y + e.ty]); }
    }
    // A way taken between two zone maps of the outdoors, as N8's notch is down onto M9 (#486), is walked
    // as a step: whoever stands on it is set down on its landing.
    const jumps = new Map((out.def.exits ?? []).filter((e) => e.to === OUTDOORS).map((e) => [e.y * out.width + e.x, [e.tx, e.ty]]));
    while (stack.length) {
      const [x, y] = stack.pop()!, k = y * out.width + x;
      if (reached[k] || stopsWalk(out, x, y)) continue;
      reached[k] = 1;
      const jump = jumps.get(k);
      if (jump) { stack.push(jump); continue; }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (out.inBounds(x + dx, y + dy)) stack.push([x + dx, y + dy]);
    }
    let open = 0, got = 0;
    const cut = new Map(Object.keys(CUT_OFF).map((id) => [id, { open: 0, got: 0 }]));
    for (let y = 0; y < out.height; y++) for (let x = 0; x < out.width; x++) {
      if (stopsWalk(out, x, y) || out.at(x, y).solid !== 'none') continue;
      const z = out.zones.find((q) => cut.has(q.id) && x >= q.x && x < q.x + q.w && y >= q.y && y < q.y + q.h), tally = z ? cut.get(z.id)! : null;
      if (tally) { tally.open++; if (reached[y * out.width + x]) tally.got++; continue; }
      open++; if (reached[y * out.width + x]) got++;
    }
    ok(open > 1500 && got === open, `every open square of the outdoors is reachable from its start (${got} of ${open})`);
    for (const [id, t] of cut) owed(t.open > 0 && t.got === t.open, `every open square of ${id} is reachable from the outdoors' start (${t.got} of ${t.open})`, CUT_OFF[id]);
  }
  // The composer refuses what the outdoors cannot hold: two zones keeping state under one id, or two zone maps on one square.
  const refusal = (f: () => unknown): string => { try { f(); return ''; } catch (e) { return e instanceof Error ? e.message : String(e); } };
  const clash: MapDef[] = MAP_DEFS.map((d) => (d.id === 'thornmark' ? { ...d, features: [...(d.features ?? []), { kind: 'event', x: 2, y: 2, id: 'coast', text: '' }] } : d));
  ok(/'coast'/.test(refusal(() => layOutdoors(ATLAS, clash))), 'two zones may not share a feature id: the outdoors keeps one record for both');
  const heaped = { ...ATLAS, zones: ATLAS.zones.map((z): AtlasZone => (z.id === 'thornmark' ? { ...z, maps: [{ map: 'thornmark', at: [220, 30] }] } : z)) };
  ok(/laid over/.test(refusal(() => layOutdoors(heaped, MAP_DEFS))), 'nor may two zone maps be laid on the same squares');

  // The line at a border (#166): the company's level against the floor of the land it steps into.
  // Three boxes in a row, the road's (the Downs, 4 to 5) then two of the Delta (10 to 11, 11 to 12),
  // laid on a strip of world of their own with the atlas's own rows for the two zones.
  {
    const row = (id: string): AtlasZone => ATLAS.zones.find((z) => z.id === id)!;
    const box = (id: string, rows: string[], band: [number, number], exits: MapDef['exits'] = []): MapDef => ({ id, name: id, kind: 'outdoor', density: 'country', band, start: { x: 2, y: 1, facing: EAST }, rows, exits });
    // With `jump`, steps down from the road's 2,1 to the fen's 2,1 and back up from its 3,1: ways that
    // jump from one zone map to another, as N8's notch does onto M9.
    const strip = (crossing?: AtlasZone['crossing'], label?: string, jump = false): Record<string, GameMap> => {
      const atlas = { ...ATLAS, width: 18, height: 3, zones: [
        { ...row('downs'), maps: [{ map: 'fx_road', at: [0, 0] as const }] },
        { ...row('delta'), ...(crossing ? { crossing } : {}), maps: [{ map: 'fx_fen', at: [6, 0] as const }, { map: 'fx_deeper', at: [12, 0] as const }] },
      ] };
      const defs = [
        box('fx_road', ['MMMMMM', 'M,,,,,', 'MMMMMM'], [4, 5], [
          ...(label ? [{ x: 5, y: 1, to: 'fx_fen', tx: 0, ty: 1, label }] : []),
          ...(jump ? [{ x: 2, y: 1, to: 'fx_fen', tx: 2, ty: 1, tf: EAST, label: 'Down the steps.' }] : []),
        ]),
        box('fx_fen', ['MMMMMM', ',,,,,,', 'MMMMMM'], [10, 11], jump ? [{ x: 3, y: 1, to: 'fx_road', tx: 3, ty: 1, tf: EAST, label: 'Back up the steps.' }] : []),
        box('fx_deeper', ['MMMMMM', ',,,,,M', 'MMMMMM'], [11, 12]),
      ];
      return Object.fromEntries(layOutdoors(atlas, defs).map((d) => [d.id, new GameMap(d)]));
    };
    /** What a company of `level` reads walking east from x0 to x1 along the strip. */
    const walk = (level: number, x0: number, x1: number, maps = strip()): string[] => {
      const party = defaultParty(makeRng(3));
      for (const m of party.members) m.level = level;
      const w = new World(maps, party, makeRng(3));
      w.travel(OUTDOORS, x0, 1, x1 > x0 ? EAST : 3);
      const said: string[] = [];
      for (let i = 0; i < Math.abs(x1 - x0); i++) { const r = w.move('forward'); if (r.kind === 'moved') said.push(...r.messages); }
      return said;
    };
    const warning = 'Nothing here would spare you. The road behind is still open.', harder = 'The land here is harder than the road behind.';
    const at7 = walk(7, 4, 7), at10 = walk(10, 4, 7), at9 = walk(9, 4, 7), at12 = walk(12, 4, 7);
    ok(at7.includes(`The Delta. ${warning}`), `a level-7 company stepping into the Delta reads the warning (${at7.join(' / ')})`);
    ok(at10.includes('The Delta.') && !at10.some((t) => t.includes(harder) || t.includes(warning)), `a level-10 one reads the name (${at10.join(' / ')})`);
    ok(at9.includes(`The Delta. ${harder}`) && at12.includes('The Delta.'), `one under, the land is harder than the road behind; over the band, the name alone (${at9.join(' / ')}; ${at12.join(' / ')})`);
    // Deeper into the same land: no name again, and only a floor that rises over the company is said.
    const deeper = walk(10, 8, 13), level = walk(11, 8, 13), down = walk(9, 13, 9);
    ok(deeper.length === 1 && deeper[0] === harder && level.length === 0, `deeper into the Delta a rising floor is said without the name, and a company at it hears nothing (${deeper.join(' / ')}; ${level.join(' / ') || 'nothing'})`);
    ok(down.length === 0, `and back down to a lower floor, still over the company, nothing is said (${down.join(' / ') || 'nothing'})`);
    // Straight back over the line and on again within the hour: nothing more.
    {
      const party = defaultParty(makeRng(3));
      for (const m of party.members) m.level = 7;
      const w = new World(strip(), party, makeRng(3));
      w.travel(OUTDOORS, 5, 1, EAST);
      const over = w.move('forward'), back = w.move('back'), again = w.move('forward');
      const lines = [over, back, again].map((r) => (r.kind === 'moved' ? r.messages.length : -1));
      ok(lines[0] === 1 && lines[1] === 0 && lines[2] === 0, `stepping back over the line and on again says nothing more (${lines.join(', ')} lines)`);
    }
    // The way's own arrival line names the place, so the feel follows it alone; and a zone's own words stand in for the world's.
    const arrival = walk(7, 4, 7, strip(undefined, 'The road drops into the fen.'));
    const own = walk(7, 4, 7, strip({ warning: 'The reeds close in.' })), ownHarder = walk(9, 4, 7, strip({ harder: 'The fen sucks at the boots.' }));
    ok(arrival.join(' / ') === `The road drops into the fen. ${warning}`, `after the way's own line, the feel alone, in the same entry of the log (${arrival.join(' / ')})`);
    // Every zone's line, its name and the longer feel, its own or the world's, wraps to two lines of the log at most.
    const long = ATLAS.zones.map((z) => [z.crossing?.harder ?? harder, z.crossing?.warning ?? warning].map((f) => `${z.name}. ${f}`)).flat().sort((a, b) => logLines(b).length - logLines(a).length)[0];
    ok(logLines(long).length <= 2, `every zone's crossing line fits two lines of the log (the longest ${logLines(long).length}: ${long})`);
    // And every way's arrival line between zone maps, with the longer feel folded in, keeps to the cap of three.
    const laid = layOutdoors(ATLAS, MAP_DEFS).find((d) => d.id === OUTDOORS)!.zones ?? [];
    const arrivals = laid.flatMap((z) => Object.values(z.enter ?? {}).map((a) => `${a} ${z.land?.crossing?.warning ?? warning}`)).sort((a, b) => logLines(b).length - logLines(a).length);
    ok(arrivals.length > 0 && logLines(arrivals[0]).length <= 3, `every arrival line with the warning after it fits three lines of the log (the longest ${logLines(arrivals[0] ?? '').length}: ${arrivals[0]})`);
    ok(own.includes('The Delta. The reeds close in.') && ownHarder.includes('The Delta. The fen sucks at the boots.'), `a zone's own words stand in for the world's (${own.join(' / ')}; ${ownHarder.join(' / ')})`);
    // A way jumped from one zone map to another says its label, then the line the border walked says;
    // straight back within the hour, its label alone.
    {
      /** What a company of `level` reads at each of `n` steps east from x on the strip with the steps. */
      const jump = (level: number, x: number, n: number): string[][] => {
        const party = defaultParty(makeRng(3));
        for (const m of party.members) m.level = level;
        const w = new World(strip(undefined, undefined, true), party, makeRng(3));
        w.travel(OUTDOORS, x, 1, EAST);
        return Array.from({ length: n }, () => w.move('forward')).map((r) => (r.kind === 'moved' ? r.messages : [r.kind]));
      };
      const down = [7, 9, 10].map((l) => [jump(l, 1, 1)[0].join(' / '), ['Down the steps.', ...walk(l, 4, 7)].join(' / ')]);
      ok(down.every(([j, s]) => j === s), `a jump into the Delta says the way's label, then the line walked into it, at 7, 9 and 10 (${down.map(([j]) => j).join('; ')})`);
      const back = jump(7, 1, 2)[1], up = jump(3, 8, 1)[0], walked = walk(3, 7, 4);
      ok(back.join(' / ') === 'Back up the steps.', `straight back up within the hour, the label alone (${back.join(' / ')})`);
      ok(walked.length === 1 && up.join(' / ') === `Back up the steps. / ${walked[0]}`, `up into the Downs, their line as walked into them (${up.join(' / ')})`);
    }
  }
}
