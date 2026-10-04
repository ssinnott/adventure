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
 * Wrackholm's isle is reached by the smugglers' boat from Saltmouth (#177), a crossing's landing.
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
  ok(southOf(l3) === 'T'.repeat(16) + 'ttt~~tt' + 'T'.repeat(9) && northOf(l4) === 'T'.repeat(19) + '~~tt' + 'T'.repeat(8) + '%', `L3's south edge and L4's north edge are the wood, the river and the path on its east bank (${southOf(l3)}; ${northOf(l4)})`);
  ok(eastOf(k4) === 'M' + 'T'.repeat(28) + '_~W' && westOf(l4) === 'T'.repeat(29) + '_~~', `K4's east edge and L4's west edge are closed forest, but for the shingle along the bay (${eastOf(k4)}; ${westOf(l4)})`);
  ok(/^r+$/.test(westOf(k4)) && eastOf(j4) === 'T'.repeat(17) + '_~~' + 'W'.repeat(12), `K4's west edge is rock against the Deepthorn's J4, its shore and its sea, so no way opens between the two areas (${westOf(k4)})`);
  ok(/^T+$/.test(eastOf(l3)) && /^%+$/.test(eastOf(l4)) && southOf(l4) === '~~~~' + '%'.repeat(28) && southOf(k4) === 'r' + 'W'.repeat(31), `L3's east edge is closed forest against M3, and L4's east and south edges, and K4's, are the world's end and the bay (${southOf(l4)})`);
  // The Iron Fells' way in (M3, #457): in from M2 by the road over the ridge, Lanternwood's trees
  // closed against L3 on its west, and open land east into N3 (#458) with the trail through it; its
  // south edge's ridge and crag are the world's end above M4, between the pines.
  const m3 = out.zones.find((z) => z.id === 'ironfells_m3')!;
  ok(northOf(m3) === 'T==pp' + 'T'.repeat(12) + 'M'.repeat(10) + '^'.repeat(5) && /^T+$/.test(westOf(m3)), `M3's north edge is the ridge under M2 with the road through it, and its west edge closed forest against L3 (${northOf(m3)})`);
  ok(eastOf(m3) === '^^' + ','.repeat(16) + 'p'.repeat(9) + '==' + ',,,' && southOf(m3) === 'T' + '%'.repeat(11) + 'p'.repeat(8) + '%%rr%%' + 'ppppp,',
    `M3's east edge is open land on into N3 with the trail through it, and its south edge pine but for the ridge and the crag, the world's end over M4 (${eastOf(m3)}; ${southOf(m3)})`);
  // Anvilhall's box (N3, #458): open land on from M3 with the trail through it at rows 27 and 28, and
  // the trail out by the south edge into N4; the open fell on north into N2 (#460) and the crag over
  // the gate running on into N2's, and the terraces' east end and the hills and rock past them under O3.
  const n3 = out.zones.find((z) => z.id === 'ironfells_n3')!;
  ok(westOf(n3) === ','.repeat(27) + '==' + ',,,' && southOf(n3) === ',,,,==' + ','.repeat(18) + 'r'.repeat(8),
    `N3's west edge is open land on from M3 with the trail through it, and its south edge open land with the trail out into N4 and rock at the corner (${westOf(n3)}; ${southOf(n3)})`);
  ok(northOf(n3) === ','.repeat(13) + '^' + 'M'.repeat(17) + '%' && eastOf(n3) === '%'.repeat(9) + ':::ff:ff####::' + '^'.repeat(7) + 'rr',
    `N3's north edge is open fell on into N2 but for the crag, and its east edge the crag, the terraces' end and the hills (${northOf(n3)}; ${eastOf(n3)})`);
  // Erzkamm's box (N2, #460): the open fell on from N3 square for square, the crag over Anvilhall's
  // gate running on along it; the rim over its north and east the world's end; and on its west the
  // rim's mountain, then the hills and the fell under it, against M2's range.
  const n2 = out.zones.find((z) => z.id === 'ironfells_n2')!;
  ok(southOf(n2) === northOf(n3) && /^%+$/.test(northOf(n2)) && /^%+$/.test(eastOf(n2)),
    `N2's south edge meets N3's north edge square for square, and its north and east edges, the rim, are the world's end (${southOf(n2)}; ${northOf(n2)}; ${eastOf(n2)})`);
  ok(westOf(n2) === '%' + 'M'.repeat(19) + '^'.repeat(8) + ','.repeat(4),
    `N2's west edge is the rim's mountain, then the hills and the fell under it, against M2's range (${westOf(n2)})`);
  // The Tiefzeche's box (N4, #461), the heart's first: open land on from N3 with the trail through it
  // at columns 4 and 5, square for square with N3's south edge; the drove road out by the south edge
  // for N5, with the stream for the smelter at the corner; open grass, the knoll and the old workings'
  // ground on the west against M4, and the first crags and the hills on the east against O4, none of
  // them built, so the world ends past them.
  const n4 = out.zones.find((z) => z.id === 'kilnsheart_n4')!;
  ok(northOf(n4) === southOf(n3) && southOf(n4) === ':'.repeat(11) + ','.repeat(9) + '=,,' + '^'.repeat(5) + ',,~~',
    `N4's north edge is N3's south edge, square for square, with the trail through it, and its south edge the old workings' ground, the grass and the drove road out for N5 (${northOf(n4)}; ${southOf(n4)})`);
  ok(westOf(n4) === ','.repeat(18) + '^^^,,f' + ':'.repeat(8) && eastOf(n4) === 'r'.repeat(14) + '^'.repeat(13) + ',,^^~',
    `N4's west edge is grass, the knoll and the old workings' ground against M4, and its east edge the crags and the hills against O4 (${westOf(n4)}; ${eastOf(n4)})`);
  // Gluthutte's box (N5, #463): in from N4 by the drove road at column 20 and the stream at the corner,
  // the slag heap's loose slag on the line; out by the south edge at column 12 for N6. The stream
  // leaves by the west edge at rows 25 and 26 against M5, beside the farms' fields and the woods; on the
  // east, against O5, the hills, the mountain, the world's end where its ring faces nothing built, and
  // the cutters' track at row 24 in dirt, since the atlas has no road there.
  const n5 = out.zones.find((z) => z.id === 'kilnsheart_n5')!;
  ok(northOf(n5) === ':::' + '"'.repeat(6) + '::' + ','.repeat(9) + '=,' + '^'.repeat(8) + '~~' && southOf(n5) === '^,,' + 't'.repeat(9) + '=' + 't'.repeat(9) + ','.repeat(10),
    `N5's north edge meets N4's with the drove road and the stream, and its south edge is the woods with the drove road out for N6 (${northOf(n5)}; ${southOf(n5)})`);
  ok(westOf(n5) === ':'.repeat(7) + 'f'.repeat(7) + 't'.repeat(11) + '~~t,,,^' && eastOf(n5) === '~^,^^^' + '%'.repeat(11) + '^^^,,,,:' + ','.repeat(7),
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
  ok(northOf(m6) === '_' + 'f'.repeat(22) + '~~~~f,,,^' && westOf(m6) === '_fff:~~' + 'f'.repeat(8) + ','.repeat(17) && southOf(m6) === ','.repeat(11) + '^,,,' + '^'.repeat(17),
    `M6's north edge is the farms with the stream in from M5, its west edge the farms, the branch's dirt and the river against L6, and its south edge the grass and the hill against M7 (${northOf(m6)}; ${westOf(m6)}; ${southOf(m6)})`);
  // The road up onto the moor (N7, #476), Cairnmoor's first box: in from N6's hills by the drove road
  // at column 3, N6's heather running on south at columns 22 to 29; out by the south edge at column 7
  // for N8 among the heather, the snow and the marsh, the stream from the tarn clipping the corner; the
  // peat-cutter's track out by the east edge at row 22 in dirt against O7, since the atlas has no road
  // there; and on the west the grass, the snow, the heather and the hills against M7. None of N8, O7
  // and M7 is built, so the world ends past them.
  const n7 = out.zones.find((z) => z.id === 'highmoor_n7')!;
  ok(northOf(n7) === ',,,=,' + '^'.repeat(12) + ',,^^^' + 'h'.repeat(8) + '^^' && southOf(n7) === 'hh*hhhw=' + 'w'.repeat(6) + 'hhhh**' + 'h'.repeat(11) + '~',
    `N7's north edge meets N6's hills with the drove road at column 3, and its south edge is the heather, the snow and the marsh with the drove road out for N8 and the stream at the corner (${northOf(n7)}; ${southOf(n7)})`);
  ok(eastOf(n7) === '^'.repeat(11) + ',,' + 'h'.repeat(9) + ':' + 'h'.repeat(8) + '~' && westOf(n7) === ',,,,,,**hhhh^^^^' + 'h'.repeat(16),
    `N7's east edge is the hills and the heather against O7 with the peat-cutter's track out at row 22, and its west edge the grass, the snow, the heather and the hills against M7 (${eastOf(n7)}; ${westOf(n7)})`);
  // West, the Downs: the Foreland's ring stands against F2 as mountains, with the Salt Road's gap.
  const west = line(sh.x, sh.y, 0, 1, sh.h);
  ok(west === '%' + 'M'.repeat(28) + '=M%', `the Foreland's west edge is mountains against the Downs, with the Salt Road through a gap (${west})`);
  const ridge = '%' + 'M'.repeat(8) + '=' + 'M'.repeat(21) + '%';
  ok(line(sh.x + sh.w - 1, sh.y, 0, 1, sh.h) === ridge && line(th.x, th.y, 0, 1, th.h) === ridge.slice(0, -1) + 'M', 'between them the ridge stands two squares thick with the pass through it, and runs out into the void at its north end and on Thornmark\'s side into the Deepthorn\'s edge at its south');
  // The ways: every one lands on open ground; none joins one zone to the next, which is walked; no
  // gate closes the road; and the towns and dungeons open onto the outdoors.
  const maps = buildMaps();
  for (const d of PLAYED_DEFS) for (const e of d.exits ?? []) ok(maps[e.to]?.passable(e.tx, e.ty) === 'ok', `${d.id} -> ${e.to}: lands on an open square (${e.tx},${e.ty})`);
  ok(!out.exits.some((e) => e.to === OUTDOORS), 'no exit joins one zone to the next: the way between them is walked');
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
    // walked from too, as the gate counts it a way in (`landings`, tools/tests/gate.ts).
    const reached = new Uint8Array(out.width * out.height);
    const stack = [[out.def.start.x, out.def.start.y]];
    for (const d of MAP_DEFS) for (const f of d.features ?? []) if (f.kind === 'npc') for (const p of f.passage ?? []) {
      const z = out.zones.find((q) => q.id === p.to);
      if (z) stack.push([z.x + p.x, z.y + p.y]);
    }
    while (stack.length) {
      const [x, y] = stack.pop()!, k = y * out.width + x;
      if (reached[k] || stopsWalk(out, x, y)) continue;
      reached[k] = 1;
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
    const strip = (crossing?: AtlasZone['crossing'], label?: string): Record<string, GameMap> => {
      const atlas = { ...ATLAS, width: 18, height: 3, zones: [
        { ...row('downs'), maps: [{ map: 'fx_road', at: [0, 0] as const }] },
        { ...row('delta'), ...(crossing ? { crossing } : {}), maps: [{ map: 'fx_fen', at: [6, 0] as const }, { map: 'fx_deeper', at: [12, 0] as const }] },
      ] };
      const defs = [
        box('fx_road', ['MMMMMM', 'M,,,,,', 'MMMMMM'], [4, 5], label ? [{ x: 5, y: 1, to: 'fx_fen', tx: 0, ty: 1, label }] : []),
        box('fx_fen', ['MMMMMM', ',,,,,,', 'MMMMMM'], [10, 11]),
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
  }
}
