// The outdoors as one map: the zone maps laid in 1:1 where the atlas puts them, the void round them,
// the seams between them by one rule, and every open square reachable.
import { buildMaps, PLAYED_DEFS, GRID } from '../../src/content/maps.ts';
import { MAP_DEFS, CLIMATES, AREAS } from '../../src/content/index.ts';
import type { Area, SeamAsBuilt as AsBuilt, OpenOnNothing as OnNothing } from '../../src/content/area.ts';
import { GameMap } from '../../src/game/map.ts';
import type { MapDef, MapZone, Can, Cell } from '../../src/game/map.ts';
import { layOutdoors, OUTDOORS, LOOK } from '../../src/game/outdoors.ts';
import { ATLAS } from '../../src/content/index.ts';
import { areaOf, boxAt, mapAt, zoneEdges, TERRAINS } from '../../src/game/atlas.ts';
import type { Atlas, AtlasZone } from '../../src/game/atlas.ts';
import { World, VIEW_DEPTH, VIEW_LATERAL, viewCell } from '../../src/game/world.ts';
import type { Facing } from '../../src/game/types.ts';
import { defaultParty } from '../../src/game/party.ts';
import { makeRng } from '../../src/lib/engine/rng.ts';
import { EAST, FACING_DX, FACING_DY } from '../../src/game/types.ts';
import { findWeather, weatherAt, weatherSight } from '../../src/game/weather.ts';
import { daylightAt } from '../../src/game/calendar.ts';
import { areaRows, areaLists, gather, once } from '../kit/checks.ts';
import { ok, owed, local, stopsWalk, fxMap } from './lib.ts';
import { logLines } from '../../src/ui/frame.ts';

/**
 * Zone maps laid before the map that joins them to the rest, owed by their areas to the issue whose map
 * that is (`Owes.cutOff`): their squares are reported as that issue's while none can be walked to, and
 * fail once they all can, so the row is dropped; a map owed twice is refused.
 */
const cutOff = gather(areaRows((c) => c.owes?.cutOff));

/** What a seam can fail: passable ground, water, road, and a way between two areas the atlas does not join. */
const SEAM_KINDS = ['walk', 'water', 'road', 'way'] as const;
type SeamKind = (typeof SEAM_KINDS)[number];

/**
 * The seams of built boxes that disagree as they were built (#898), each with its reason, held by the
 * area of the first box its key names (`AreaChecks.seamsAsBuilt`). Along the edge two touching boxes
 * share, passable ground, water and road agree square for square, and a way between two areas opens
 * only where the atlas joins them (`seams`); these squares do not. `a|b` is a's east edge against b's
 * west and `a/b` a's south edge against b's north, a square counted from the north or the west, 0 to 31.
 * Each kind lists exactly the squares that fail it, so a square that comes to agree is refused, and so
 * is a row no seam needs. A box built since draws its edges to agree and adds no row.
 */
const seamsOn = areaLists((c) => c.seamsAsBuilt);
/**
 * The open squares of every edge of a built box that faces no built box (#898), exactly, each row with
 * the box it faces and why that is unbuilt, held by the area whose box the edge is
 * (`AreaChecks.openOnNothing`). Past such an edge is the void, which refuses every company, so a square
 * open on it is the world's end in reach. `edge` is a map and its side, `'delta_b5 west'`, a square
 * counted from the north or the west, 0 to 31; an edge with no open square has no row. A square open
 * that no row holds is refused, a square a row holds that is shut, and a row whose edge faces a built
 * box: the box built there meets the seam rule, and its pull request deletes the row. The border check
 * of the bounds (#828) in embryo, which will allow open squares only onto the reach and the crumbs.
 */
const edgesOn = areaLists((c) => c.openOnNothing);
/** Every seam as built and every edge open on nothing, the areas' in road order. */
const AS_BUILT: readonly AsBuilt[] = seamsOn.map(([, r]) => r);
const ON_NOTHING: readonly OnNothing[] = edgesOn.map(([, r]) => r);

/** The rows on an area that are another's, by their keys: a seam (`a|b`, `a/b`) or an edge (`a east`) is the area's of the first box it names. */
export const notTheirs = (rows: readonly (readonly [string, string])[], areas: readonly Pick<Area, 'id' | 'maps'>[] = AREAS): string[] =>
  rows.filter(([id, key]) => !areas.find((a) => a.id === id)?.maps.some((d) => d.id === key.split(/[|/ ]/)[0])).map(([id, key]) => `${key} on ${id}`);

/**
 * The companies a way between two areas is looked for with: a walker, a climber, a swimmer, a floater,
 * and one that does all three, as a company can at once (`partyCan`, and Levitate): an ability only ever
 * opens more, so the last crosses wherever any mix of them would.
 */
const COMPANIES: readonly Can[] = [{}, { climb: true }, { swim: true }, { float: true }, { climb: true, swim: true, float: true }];

/** Two built boxes that share an edge, the letters along it on each side, and the squares that fail each kind. */
interface Seam { key: string; name: string; areas: readonly [string, string]; joined: boolean; edge: readonly [string, string]; fails: Record<SeamKind, number[]> }

/**
 * Every pair of built boxes that share an edge, found from their places on the grid (EXPANSION §8.2,
 * each laid map one whole box), and where the edge between them fails the seam rule: square for
 * square, the two sides disagree on passable ground (open to a company with no skill), on water (never
 * the void, which stays the void for every rule) or on road; or, between two areas no road joins (a
 * map's exits and the atlas's links, `zoneEdges`), a walker, a climber, a swimmer or a floater crosses.
 * The other declared crossing, the door marked as one (`Exit.crosses`, tools/tests/weather.ts), is a
 * dungeon's door, no seam.
 */
function seams(out: GameMap, atlas: Atlas, defs: readonly MapDef[]): Seam[] {
  const boxes = new Map(out.zones.map((z) => [`${z.x},${z.y}`, z]));
  const area = (id: string): string => areaOf(atlas, id)?.name ?? id;
  const joined = new Set(zoneEdges(atlas, defs).filter((e) => e.kind === 'road').map((e) => [area(e.from), area(e.to)].sort().join('|')));
  const named = (z: { x: number; y: number }): string => boxAt(atlas, z.x, z.y) ?? `${z.x},${z.y}`;
  const open = (x: number, y: number, can: Can = {}): boolean => out.passable(x, y, can) === 'ok';
  const wet = (c: Cell): boolean => c.terrain === 'water' || c.terrain === 'deep';
  const list: Seam[] = [];
  for (const a of out.zones) for (const east of [true, false]) {
    const b = boxes.get(east ? `${a.x + a.w},${a.y}` : `${a.x},${a.y + a.h}`);
    if (!b) continue;
    const areas = [area(a.id), area(b.id)] as const, join = areas[0] === areas[1] || joined.has([...areas].sort().join('|'));
    const fails: Record<SeamKind, number[]> = { walk: [], water: [], road: [], way: [] };
    let mine = '', theirs = '';
    for (let i = 0; i < (east ? Math.min(a.h, b.h) : Math.min(a.w, b.w)); i++) {
      const [ax, ay, bx, by] = east ? [a.x + a.w - 1, a.y + i, b.x, b.y + i] : [a.x + i, a.y + a.h - 1, b.x + i, b.y];
      const ca = out.at(ax, ay), cb = out.at(bx, by);
      mine += ca.ch; theirs += cb.ch;
      if (open(ax, ay) !== open(bx, by)) fails.walk.push(i);
      if (wet(ca) !== wet(cb)) fails.water.push(i);
      if ((ca.terrain === 'road') !== (cb.terrain === 'road')) fails.road.push(i);
      if (!join && COMPANIES.some((can) => open(ax, ay, can) && open(bx, by, can))) fails.way.push(i);
    }
    list.push({ key: `${a.id}${east ? '|' : '/'}${b.id}`, name: `${named(a)}${east ? '|' : '/'}${named(b)}`, areas, joined: join, edge: [mine, theirs], fails });
  }
  return list;
}

/** Squares written `'3-7 9'`, in order. */
const squaresOf = (s = ''): number[] => s.split(' ').filter(Boolean).flatMap((r) => {
  const [a, b = a] = r.split('-').map(Number);
  return Array.from({ length: b - a + 1 }, (_, k) => a + k);
});

/** Squares as a row writes them: runs, in order, `'3-7 9'`. */
const writeSquares = (xs: readonly number[]): string => xs.reduce<number[][]>((runs, x) => {
  const run = runs.at(-1);
  if (run && run.at(-1) === x - 1) run.push(x); else runs.push([x]);
  return runs;
}, []).map((r) => (r.length > 1 ? `${r[0]}-${r.at(-1)}` : `${r[0]}`)).join(' ');

const FAILS: Record<SeamKind, string> = { walk: 'passable ground', water: 'water', road: 'road', way: 'a way the atlas does not draw' };

/**
 * Each seam against the rows: what it fails that no row holds, and each square a row holds that it no
 * longer fails, which no seam needs; and the rows that name no seam of two built boxes that touch, or
 * name one twice, or give no square, squares out of order or no reason.
 */
function judgeSeams(list: readonly Seam[], rows: readonly AsBuilt[]): { verdicts: { seam: Seam; wrong: string[] }[]; stray: string[] } {
  const verdicts = list.map((seam) => {
    const row = rows.find((r) => r.seam === seam.key), wrong: string[] = [], [mine, theirs] = seam.edge;
    for (const k of SEAM_KINDS) {
      const want = squaresOf(row?.[k]), got = seam.fails[k];
      for (const i of got) if (!want.includes(i)) wrong.push(k === 'way'
        ? `square ${i} opens a way between ${seam.areas.join(' and ')}, which the atlas does not join, '${mine[i]}' against '${theirs[i]}'`
        : `square ${i} disagrees on ${FAILS[k]}, '${mine[i]}' against '${theirs[i]}'`);
      for (const i of want) if (!got.includes(i)) wrong.push(`seamsAsBuilt holds square ${i} for ${FAILS[k]}, which the seam no longer fails`);
    }
    return { seam, wrong };
  });
  const edges = new Map(list.map((s) => [s.key, s.edge[0].length]));
  const stray = rows.filter((r, n) => !edges.has(r.seam) || rows.findIndex((q) => q.seam === r.seam) !== n || !r.why
    || !SEAM_KINDS.some((k) => r[k]) || !SEAM_KINDS.every((k) => written(r[k], edges.get(r.seam) ?? 0))).map((r) => r.seam);
  return { verdicts, stray };
}

/** Whether squares are written as a row writes them, in order and each on an edge of n squares. */
const written = (s: string | undefined, n: number): boolean => {
  const xs = squaresOf(s);
  return writeSquares(xs) === (s ?? '') && xs.every((x, j) => x < n && (j === 0 || x > xs[j - 1]));
};

/** An edge of a built box that faces no built box: the box it faces, its letters and the squares along it open to a walker. */
interface Bare { key: string; name: string; faces: string; line: string; open: number[] }

const SIDES = ['north', 'east', 'south', 'west'] as const;

/**
 * Every edge of a built box that faces no built box on the grid (EXPANSION §8.2), the box it faces, and
 * the squares along it, corners with them, open to a walker; every other edge is a seam's.
 */
function edgesOnNothing(out: GameMap, atlas: Atlas): Bare[] {
  const list: Bare[] = [];
  for (const a of out.zones) for (const side of SIDES) {
    const ew = side === 'east' || side === 'west', [dx, dy] = { north: [0, -1], east: [1, 0], south: [0, 1], west: [-1, 0] }[side];
    if (out.zones.some((b) => (ew ? b.y === a.y && b.x === (dx > 0 ? a.x + a.w : a.x - b.w) : b.x === a.x && b.y === (dy > 0 ? a.y + a.h : a.y - b.h)))) continue;
    const sq = Array.from({ length: ew ? a.h : a.w }, (_, i) => (ew ? [dx > 0 ? a.x + a.w - 1 : a.x, a.y + i] : [a.x + i, dy > 0 ? a.y + a.h - 1 : a.y]) as [number, number]);
    const [mx, my] = sq[sq.length >> 1];
    list.push({ key: `${a.id} ${side}`, name: `${boxAt(atlas, a.x, a.y)} ${side}`, faces: boxAt(atlas, mx + dx, my + dy) ?? 'past the grid',
      line: sq.map(([x, y]) => out.at(x, y).ch).join(''), open: sq.flatMap(([x, y], i) => (out.passable(x, y) === 'ok' ? [i] : [])) });
  }
  return list;
}

/**
 * Each edge on nothing against the rows: a square open that no row holds, and a square a row holds that
 * is shut; the rows whose edge faces a built box, which the seam rule holds; and the rows that name no
 * edge of a built box, or name one twice, or give no square, squares out of order or no reason.
 */
function judgeEdges(list: readonly Bare[], rows: readonly OnNothing[], laid: readonly MapZone[]): { verdicts: { edge: Bare; wrong: string[] }[]; faced: string[]; stray: string[] } {
  const verdicts = list.map((edge) => {
    const want = squaresOf(rows.find((r) => r.edge === edge.key)?.open), wrong: string[] = [];
    for (const i of edge.open) if (!want.includes(i)) wrong.push(`square ${i} is open, '${edge.line[i]}', which no openOnNothing row holds`);
    for (const i of want) if (!edge.open.includes(i)) wrong.push(`openOnNothing holds square ${i} open, which is shut, '${edge.line[i]}'`);
    return { edge, wrong };
  });
  const bare = new Set(list.map((e) => e.key)), side = (r: OnNothing): MapZone | undefined => {
    const [id, s, more] = r.edge.split(' ');
    return more === undefined && (SIDES as readonly string[]).includes(s) ? laid.find((z) => z.id === id) : undefined;
  };
  const faced = rows.filter((r) => side(r) && !bare.has(r.edge)).map((r) => r.edge);
  const stray = rows.filter((r, n) => !side(r) || rows.findIndex((q) => q.edge === r.edge) !== n || !r.why || !r.open
    || !written(r.open, ['east', 'west'].includes(r.edge.split(' ')[1]) ? side(r)!.h : side(r)!.w)).map((r) => r.edge);
  return { verdicts, faced, stray };
}

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
  // The void is drawn as the world map paints it (#829): every void square has a look, the atlas's
  // ground where nothing is built, and inside a zone map's box (its ring, and the void its author
  // wrote) the mountain it closes with, but where the atlas has water there, which runs on as the
  // coast. For every rule it is still the void.
  const can = { climb: true, swim: true, float: true, keys: 1 }, kinds = new Set<object>();
  let voids = 0, looked = 0, agree = 0, shut = 0;
  for (let y = 0; y < out.height; y++) for (let x = 0; x < out.width; x++) {
    const c = out.at(x, y);
    if (c.solid !== 'void') continue;
    voids++; kinds.add(c);
    const ground = LOOK[TERRAINS[GRID.terrain[y * out.width + x]]];
    const want = !out.zoneAt(x, y) ? ground : ground === LOOK.sea || ground === LOOK.shallow ? ground : 'M';
    if (c.look) looked++;
    if (c.look?.ch === want) agree++;
    if (out.passable(x, y, can) === 'void') shut++;
  }
  ok(looked === voids, `every void square is drawn as the land, the sea or the mountain, and none as pink (${looked} of ${voids})`);
  ok(agree === voids, `each as the world map paints it, a ring's mountain as its author drew it but where the atlas has water (${agree} of ${voids})`);
  ok(shut === voids, `and each refuses a company that can climb, swim and float, as the void always has (${shut} of ${voids})`);
  ok([...kinds].every((c) => Object.isFrozen(c)) && kinds.size <= new Set(Object.values(LOOK)).size + 1, `the void's cells are frozen and shared, one to each look, however much of it there is (${kinds.size})`);
  // So no walkable square has the pink in view: no bare void within the view's reach of one.
  let pink = 0;
  for (let y = 0; y < out.height; y++) for (let x = 0; x < out.width; x++) {
    if (out.passable(x, y) !== 'ok') continue;
    for (let f = 0; f < 4; f++) for (let d = 0; d <= VIEW_DEPTH; d++) for (let l = -VIEW_LATERAL; l <= VIEW_LATERAL; l++) {
      const v = viewCell(x, y, f as Facing, d, l), c = out.at(v.x, v.y);
      if (c.solid === 'void' && !c.look) pink++;
    }
  }
  ok(pink === 0, `no walkable outdoor square has the pink in view, four squares ahead and three to a side (${pink})`);
  // The seams (#898): every two built boxes that share an edge, found from their places, agree along it
  // square for square, on passable ground, water and road, and open a way between two areas only where
  // the atlas joins them. The areas' seamsAsBuilt hold what disagrees as built, each row with its reason.
  const all = seams(out, ATLAS, MAP_DEFS), { verdicts, stray } = judgeSeams(all, AS_BUILT);
  const held = AS_BUILT.reduce((n, r) => n + new Set(SEAM_KINDS.flatMap((k) => squaresOf(r[k]))).size, 0);
  ok(all.length >= 153, `the seam rule takes every pair of built boxes that share an edge: ${all.length} pairs, ${all.filter((s) => s.areas[0] !== s.areas[1]).length} of them between two areas, ${all.reduce((n, s) => n + s.edge[0].length, 0)} squares, ${held} of them as built in ${AS_BUILT.length} rows`);
  for (const { seam: s, wrong } of verdicts) {
    const row = AS_BUILT.find((r) => r.seam === s.key);
    const between = s.areas[0] === s.areas[1] ? '' : `, between ${s.areas.join(' and ')}, which the atlas ${s.joined ? 'joins' : 'does not join'}`;
    const as = row ? `, but as built (${SEAM_KINDS.filter((k) => row[k]).map((k) => `${k} ${row[k]}`).join(', ')})` : '';
    ok(!wrong.length, `seam ${s.name}, ${s.key}: passable ground, water and road agree square for square${between}${as}${wrong.length ? `: ${wrong.join('; ')}` : ''}`);
  }
  ok(!stray.length, `every seamsAsBuilt row names a seam of two built boxes that touch, once, with its squares in order and its reason${stray.length ? ` (not ${stray.join(', ')})` : ''}`);
  // The edges on nothing: every edge of a built box that faces no built box is open to a walker exactly
  // where an area's openOnNothing holds it, each row with the box it faces and why that is unbuilt; the border
  // check of the bounds (#828) in embryo.
  const bare = edgesOnNothing(out, ATLAS), edged = judgeEdges(bare, ON_NOTHING, out.zones);
  ok(4 * out.zones.length === 2 * all.length + bare.length, `every side of a built box is a seam's or faces no built box: ${bare.length} edges on nothing, ${bare.reduce((n, e) => n + e.line.length, 0)} squares, ${bare.reduce((n, e) => n + e.open.length, 0)} of them open in ${ON_NOTHING.length} rows`);
  for (const { edge: e, wrong } of edged.verdicts) {
    const row = ON_NOTHING.find((r) => r.edge === e.key);
    ok(!wrong.length, `edge ${e.name}, ${e.key}, facing no built box (${e.faces}): shut to a walker${row ? `, but as built (open ${row.open})` : ''}${wrong.length ? `: ${wrong.join('; ')}` : ''}`);
  }
  ok(!edged.faced.length, `no openOnNothing row names an edge that faces a built box, which the seam rule holds: the box's pull request deletes the row${edged.faced.length ? ` (not ${edged.faced.join(', ')})` : ''}`);
  ok(!edged.stray.length, `every openOnNothing row names an edge of a built box, once, with its squares in order and its reason${edged.stray.length ? ` (not ${edged.stray.join(', ')})` : ''}`);
  // A seam's row and an edge's stand on the area of the first box they name (#897).
  const astray = notTheirs([...seamsOn.map(([id, r]) => [id, r.seam] as const), ...edgesOn.map(([id, r]) => [id, r.edge] as const)]);
  ok(!astray.length, `and each on an area is the area's of the first box it names${astray.length ? ` (not: ${astray.join(', ')})` : ''}`);
  ok(notTheirs([['shelf', 'downs_d4/delta_d5'], ['saltreach', 'downs_d4/delta_d5'], ['saltreach', 'upperwater_c2|downs_d2'], ['shelf', 'downs_d4 east'], ['saltreach', 'downs_d4 east']]).join() === 'downs_d4/delta_d5 on saltreach,downs_d4 east on saltreach',
    'a seam between two areas on the area of its second box is refused, and so is an edge on another area than its box\'s, where on its first box\'s area each is read');
  { // A broken seam fails the rule, there alone: copies of D4, I5 and the Foreland's shelf made here, not in
    // the tree, D4 with a wall at 0,5 where C4 has grass, I5 with grass at 0,31 where its rock met I6's
    // grass, which opens a way to Hearth Isle and leaves the row's square 0 needing nothing (and, a corner,
    // opens I5's west edge onto H5), and the shelf with grass at 12,0, on its north edge, the world's end.
    // Each is said against the verdicts as built, so
    // a seam that fails as built is not said twice. A row naming no seam is refused, and one naming an
    // edge that faces a built box.
    const broken = MAP_DEFS.map((d) => d.id === 'downs_d4' ? { ...d, rows: d.rows.map((r, y) => (y === 5 ? '#' + r.slice(1) : r)) }
      : d.id === 'deepthorn_i5' ? { ...d, rows: d.rows.map((r, y) => (y === 31 ? ',' + r.slice(1) : r)) }
      : d.id === 'shelf' ? { ...d, rows: d.rows.map((r, y) => (y === 0 ? r.slice(0, 12) + ',' + r.slice(13) : r)) } : d);
    const laid = new GameMap(layOutdoors(ATLAS, broken).find((d) => d.id === OUTDOORS)!);
    const asBuilt = new Map([...verdicts.map((v) => [v.seam.key, v.wrong] as const), ...edged.verdicts.map((v) => [v.edge.key, v.wrong] as const)]);
    const fresh = (key: string, name: string, wrong: readonly string[]): string[] => {
      const w = wrong.filter((x) => !asBuilt.get(key)?.includes(x));
      return w.length ? [`${name}: ${w.join('; ')}`] : [];
    };
    const said = judgeSeams(seams(laid, ATLAS, broken), AS_BUILT).verdicts.flatMap((v) => fresh(v.seam.key, v.seam.name, v.wrong)).sort();
    ok(said.join(' / ') === "C4|D4: square 5 disagrees on passable ground, ',' against '#' / I5/I6: seamsAsBuilt holds square 0 for passable ground, which the seam no longer fails; square 0 opens a way between Thornmark and Hearth Isle, which the atlas does not join, ',' against ','",
      `a wall where the neighbour has grass fails the seam rule, and so do a way the atlas does not draw and a row no seam needs, there alone (${said.join(' / ')})`);
    const opened = judgeEdges(edgesOnNothing(laid, ATLAS), ON_NOTHING, laid.zones).verdicts.flatMap((v) => fresh(v.edge.key, v.edge.name, v.wrong));
    ok(opened.join(' / ') === "G2 north: square 12 is open, ',', which no openOnNothing row holds / I5 west: square 31 is open, ',', which no openOnNothing row holds",
      `a square opened onto the world's end, on an edge that faces no built box, fails there alone, the shelf's and I5's corner, which faces H5, unbuilt (${opened.join(' / ')})`);
    const sloppy = AS_BUILT.map((r) => (r.seam === 'downs_f2|shelf' ? { ...r, walk: '30-31 1-28' } : r));
    const extra = judgeSeams(all, [...sloppy, { seam: 'shelf|downs_f2', walk: '0', why: 'Fixture.' }]).stray;
    ok(extra.join() === 'downs_f2|shelf,shelf|downs_f2', `a row with its squares out of order is refused, and so is one naming no seam of two built boxes that touch (${extra.join(', ')})`);
    const misnamed = judgeEdges(bare, [...ON_NOTHING, { edge: 'downs_d4 west', open: '0', why: 'Fixture.' }, { edge: 'shelf up', open: '0', why: 'Fixture.' }], out.zones);
    ok(misnamed.faced.join() === 'downs_d4 west' && misnamed.stray.join() === 'shelf up',
      `an openOnNothing row naming an edge that faces a built box is refused, and so is one naming no edge of a built box (${misnamed.faced.join(', ')}; ${misnamed.stray.join(', ')})`);
    const doubled = [judgeSeams(all, [...AS_BUILT, AS_BUILT[0]]).stray, judgeEdges(bare, [...ON_NOTHING, ON_NOTHING[0]], out.zones).stray];
    ok(doubled.map((s) => s.join()).join(' / ') === `${AS_BUILT[0].seam} / ${ON_NOTHING[0].edge}`,
      `a seam's or an edge's row given twice, on one area or two, is refused by its own check (${doubled.map((s) => s.join(', ')).join('; ')})`);
  }
  const sh = out.zones.find((z) => z.id === 'shelf')!, th = out.zones.find((z) => z.id === 'thornmark')!;
  // The ways: every one lands on open ground; none joins one zone to the next, which is walked, but the
  // drove road's notch, taken down from N8 onto M9 and back up, since the two meet only at a corner
  // across M8's (#479, #486) (the pass from K10 over onto J11 was taken too, across parked J10's corner,
  // until J10 was laid and the road walked, #499, #508); no gate closes the road; and the towns and
  // dungeons open onto the outdoors.
  const maps = buildMaps();
  for (const d of PLAYED_DEFS) for (const e of d.exits ?? []) ok(maps[e.to]?.passable(e.tx, e.ty) === 'ok', `${d.id} -> ${e.to}: lands on an open square (${e.tx},${e.ty})`);
  const notchN8 = out.zones.find((z) => z.id === 'cairnfield_n8')!, notchM9 = out.zones.find((z) => z.id === 'longmere_m9')!;
  const taken = out.exits.filter((e) => e.to === OUTDOORS).map((e) => `${e.x},${e.y}`).sort().join(' ');
  ok(taken === [`${notchN8.x},${notchN8.y + 28}`, `${notchM9.x + 23},${notchM9.y + 8}`].sort().join(' '),
    `no exit joins one zone to the next but the notch between N8 and M9, taken both ways: the way between them is walked (${taken})`);
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
    // carries it, and refuses the party only while it holds (#157) and its lifts does not (#749).
    const defs = MAP_DEFS.map((d) => d.id !== 'shelf' ? d : { ...d, exits: d.exits!.map((e) => e.to !== 'thornmark' ? e : { ...e, shut: { flag: 'fixture_c', member: { race: 'orcblood' as const } }, lifts: { flag: 'fixture_d' }, blockedText: 'Fixture shut.' }) });
    const laid = layOutdoors(ATLAS, defs), fx = new GameMap(laid.find((d) => d.id === OUTDOORS)!);
    const g = fx.gates;
    ok(g.length === 1 && g[0].x === sh.x + 31 && g[0].y === sh.y + 9 && g[0].needFlag === undefined && JSON.stringify(g[0].shut) === JSON.stringify({ flag: 'fixture_c', member: { race: 'orcblood' } }) && JSON.stringify(g[0].lifts) === JSON.stringify({ flag: 'fixture_d' }) && g[0].blockedText === 'Fixture shut.',
      `an exit shut on a condition into the zone next door is laid as a gate on its square that carries it and its lifts (${g.map((q) => `${q.x},${q.y}`).join(', ')})`);
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
    party.flags.fixture_d = 1;
    const lifted = go();
    delete party.flags.fixture_d;
    const again = go();
    ok(lifted === 'moved' && again === 'Fixture shut.', `and opens while its lifts holds, shutting again once it stops (${lifted}, ${again})`);
  }
  { // An exit into the zone next door that is there only `after` a condition is no way across before
    // it holds: its gate refuses the party until then (#749). On the overlay it is the way it is, with
    // no padlock, since an appearance is no lock.
    const defs = MAP_DEFS.map((d) => d.id !== 'shelf' ? d : { ...d, exits: d.exits!.map((e) => e.to !== 'thornmark' ? e : { ...e, after: { flag: 'fixture_e' }, blockedText: 'Fixture after.' }) });
    const laid = layOutdoors(ATLAS, defs);
    const rng = makeRng(3), party = defaultParty(rng);
    const world = new World(Object.fromEntries(laid.map((d) => [d.id, new GameMap(d)])), party, rng);
    const go = (): string => { world.travel('shelf', 30, 9, EAST); const r = world.move('forward'); return r.kind === 'blocked' ? r.reason : r.kind; };
    const before = go();
    party.flags.fixture_e = 1;
    const after = go();
    const road = zoneEdges(ATLAS, defs).find((e) => [e.from, e.to].sort().join() === 'shelf,thornmark');
    ok(before === 'Fixture after.' && after === 'moved' && !!road && !road.gate.length, `an exit there only after a condition is no way across until it holds, and no gate on the overlay (${before}, ${after}, ${road?.gate.join() ?? 'no way'})`);
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
    // but for a zone map laid before the one that joins it (`Owes.cutOff`). A crossing a person sells
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
    const cut = new Map(Object.keys(cutOff.all).map((id) => [id, { open: 0, got: 0 }]));
    for (let y = 0; y < out.height; y++) for (let x = 0; x < out.width; x++) {
      if (stopsWalk(out, x, y) || out.at(x, y).solid !== 'none') continue;
      const z = out.zones.find((q) => cut.has(q.id) && x >= q.x && x < q.x + q.w && y >= q.y && y < q.y + q.h), tally = z ? cut.get(z.id)! : null;
      if (tally) { tally.open++; if (reached[y * out.width + x]) tally.got++; continue; }
      open++; if (reached[y * out.width + x]) got++;
    }
    ok(open > 1500 && got === open, `every open square of the outdoors is reachable from its start (${got} of ${open})`);
    for (const [id, t] of cut) owed(t.open > 0 && t.got === t.open, `every open square of ${id} is reachable from the outdoors' start (${t.got} of ${t.open})`, cutOff.all[id]);
    ok(...once('every zone map owed its joining is owed once', cutOff.twice));
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
    const box = (id: string, rows: string[], band: [number, number], exits: MapDef['exits'] = []): MapDef => ({ id, name: id, kind: 'outdoor', region: 'shelf', density: 'country', band, start: { x: 2, y: 1, facing: EAST }, rows, exits });
    // With `jump`, steps down from the road's 2,1 to the fen's 2,1 and back up from its 3,1: ways that
    // jump from one zone map to another, as N8's notch does onto M9.
    const strip = (crossing?: AtlasZone['crossing'], label?: string, jump = false): Record<string, GameMap> => {
      const atlas = { ...ATLAS, width: 18, height: 3, zones: [
        { ...row('downs'), maps: [{ map: 'fx_road', at: [0, 0] as const }] },
        { ...row('delta'), ...(crossing ? { crossing } : {}), maps: [{ map: 'fx_fen', at: [6, 0] as const }, { map: 'fx_deeper', at: [12, 0] as const }] },
      ] };
      const defs = [
        box('fx_road', ['MMMMMM', 'M,,,,,', 'MMMMMM'], [4, 5], [
          ...(label ? [{ x: 5, y: 1, to: fxMap('fx_fen'), tx: 0, ty: 1, label }] : []),
          ...(jump ? [{ x: 2, y: 1, to: fxMap('fx_fen'), tx: 2, ty: 1, tf: EAST, label: 'Down the steps.' }] : []),
        ]),
        box('fx_fen', ['MMMMMM', ',,,,,,', 'MMMMMM'], [10, 11], jump ? [{ x: 3, y: 1, to: fxMap('fx_road'), tx: 3, ty: 1, tf: EAST, label: 'Back up the steps.' }] : []),
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

  { // The automap tells nothing hidden (#889): in clear weather by day, a company before a secret door of the outdoors has
    // mapped nothing behind it, nor with a Cartographer; the door found, it has mapped what lies behind from the doorway.
    // Every secret door, from every side a company can stand on that has an open square behind the door.
    const rng = makeRng(5), party = defaultParty(rng), world = new World(buildMaps(), party, rng), map = world.maps[OUTDOORS], seed = world.state.weatherSeed!;
    const clear = (_: unknown, m: number): boolean => daylightAt(m) >= 0.6 && Object.values(CLIMATES).every((c) => weatherSight(weatherAt(seed, m, c)) >= 4);
    const when = findWeather(seed, world.state.minutes, CLIMATES.shelf, clear);
    world.state.minutes = when;
    party.members[1].skills = ['perception'];
    let doors = 0, sides = 0, told = 0, shown = 0;
    for (let y = 0; y < map.height; y++) for (let x = 0; x < map.width; x++) {
      if (map.at(x, y).door !== 'secret') continue;
      doors++;
      for (const f of [0, 1, 2, 3] as Facing[]) {
        const dx = FACING_DX[f], dy = FACING_DY[f];
        if (map.passable(x - dx, y - dy) !== 'ok' || map.passable(x + dx, y + dy) !== 'ok') continue;
        sides++;
        let leak = false;
        for (const cartographer of [false, true]) {
          party.members[0].skills = cartographer ? ['cartographer'] : [];
          world.travel(OUTDOORS, x - dx, y - dy, f);
          world.mapState.explored.fill(0);
          world.reveal();
          if ([1, 2].some((k) => world.explored(x + k * dx, y + k * dy))) leak = true;
        }
        if (leak) told++;
        // Found (Perception is a sure find), and stood in: the square behind it is the next one on.
        world.search();
        world.travel(OUTDOORS, x, y, f);
        if (world.explored(x + dx, y + dy)) shown++;
        map.at(x, y).door = 'secret';
        delete world.mapState.doors[`${x},${y}`];
      }
    }
    ok(when >= 0 && sides > 100 && told === 0 && shown === sides,
      `in clear weather by day a company before any of the outdoors' ${doors} secret doors has mapped nothing behind it, nor with a Cartographer, from any of ${sides} sides, and found, from its doorway, has mapped what lies behind (${told} sides told; ${shown} shown)`);
    // Nor aslant: the square behind each of those sides and every chest of its hide, where no run of squares that do not
    // stop the view, joined side to side, leads to the side the company stands on. From every square a company stands on
    // within two of one, three with a Cartographer, facing any way, none is mapped: no step slips between two that stop it.
    const W = map.width, run = new Int32Array(W * map.height).fill(-1);
    const runOf = (x0: number, y0: number): number => {
      const i0 = y0 * W + x0;
      if (run[i0] >= 0) return run[i0];
      run[i0] = i0;
      for (const todo = [i0]; todo.length;) {
        const i = todo.pop()!, x = i % W, y = (i - x) / W;
        for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
          const j = ny * W + nx;
          if (map.inBounds(nx, ny) && run[j] < 0 && !map.blocksView(nx, ny)) { run[j] = i0; todo.push(j); }
        }
      }
      return i0;
    };
    const hid = new Set<number>(), chestAt = new Set(map.features.flatMap((c) => (c.kind === 'chest' && !map.blocksView(c.x, c.y) ? [c.y * W + c.x] : [])));
    for (let y = 0; y < map.height; y++) for (let x = 0; x < W; x++) {
      if (map.at(x, y).door !== 'secret') continue;
      for (const f of [0, 1, 2, 3] as Facing[]) {
        const dx = FACING_DX[f], dy = FACING_DY[f];
        if (map.passable(x - dx, y - dy) !== 'ok' || map.passable(x + dx, y + dy) !== 'ok') continue;
        const k = runOf(x + dx, y + dy);
        if (k === runOf(x - dx, y - dy)) continue;
        hid.add((y + dy) * W + x + dx);
        for (const i of chestAt) if (runOf(i % W, Math.floor(i / W)) === k) hid.add(i);
      }
    }
    const marked = new Map<string, string>(); // a square mapped: the first square it was mapped from
    let stands = 0, marks = 0;
    for (const i of hid) {
      const hx = i % W, hy = (i - hx) / W, k = runOf(hx, hy);
      for (let sy = hy - 3; sy <= hy + 3; sy++) for (let sx = hx - 3; sx <= hx + 3; sx++) {
        if (!map.inBounds(sx, sy) || map.passable(sx, sy) !== 'ok' || map.at(sx, sy).door !== 'none' || runOf(sx, sy) === k) continue;
        stands++;
        for (const cartographer of [false, true]) {
          if (Math.max(Math.abs(sx - hx), Math.abs(sy - hy)) > (cartographer ? 3 : 2)) continue;
          party.members[0].skills = cartographer ? ['cartographer'] : [];
          for (const f of [0, 1, 2, 3] as Facing[]) {
            Object.assign(world.state, { x: sx, y: sy, facing: f });
            world.mapState.explored.fill(0);
            world.reveal();
            if (!world.explored(hx, hy)) continue;
            marks++;
            if (!marked.has(`${hx},${hy}`)) marked.set(`${hx},${hy}`, `${sx},${sy}${cartographer ? ' with a Cartographer' : ''}`);
          }
        }
      }
    }
    party.members[0].skills = [];
    const chests = [...hid].filter((i) => chestAt.has(i)).length;
    ok(hid.size > 100 && chests > 50 && stands > 500 && marks === 0,
      `nor aslant: of the ${hid.size} squares behind them or in their hides, ${chests} of them chests, none is mapped from any of ${stands} squares a company stands on within two, three with a Cartographer, facing any way (${marks} marks${[...marked].map(([sq, from]) => `; ${sq} from ${from}`).join('')})`);
    // A landmark is seen over a wall (#844), as the view draws Highcell's towers over its own: its gate is an exit, stood
    // on by none, and from the road's end before it, five squares, the company has mapped Highcell, facing any way.
    const cell = map.landmarks.find((l) => l.kind === 'monastery')!, gate = map.at(cell.x, cell.y - 1).door !== 'none' && !!map.exitAt(cell.x, cell.y - 1);
    const road = [-2, -1, 0, 1, 2].flatMap((k) => ([0, 1, 2, 3] as Facing[]).map((f) => {
      Object.assign(world.state, { x: cell.x + k, y: cell.y - 2, facing: f });
      world.mapState.explored.fill(0);
      world.reveal();
      return world.explored(cell.x, cell.y);
    }));
    ok(gate && road.every(Boolean), `Highcell (${cell.x},${cell.y}) is mapped over its wall from the road's end before its gate, five squares, facing any way (${road.filter(Boolean).length} of ${road.length})`);
  }
}
