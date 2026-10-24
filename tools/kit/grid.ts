// The floods and tests over a map's squares that the walkthroughs wrote out each for itself (#985):
// what a company reaches in a box of the outdoors or on a map from a square, how far each square
// lies, whether a door shuts part of a box off, and a row of a box's squares as open or not. The map
// (a walkthrough's `out`, the outdoors, or one map) and the box (a zone of the outdoors) are given;
// a square is its key on the map, y * width + x. Nothing here takes a walkthrough or an area's file.
import { GameMap } from '../../src/game/map.ts';
import type { Can, MapDef, MapZone } from '../../src/game/map.ts';

/** A square: x, y. */
export type Cell = readonly [number, number];
/** A box on a map: a zone of the outdoors, or any rectangle of squares. */
export interface Box { x: number; y: number; w: number; h: number }

/** The zone of the outdoors `map` whose id is `id`. */
export const zone = (map: GameMap, id: string): MapZone => map.zones.find((z) => z.id === id)!;

/** The key on `map` of square x, y of box `z`. */
export const square = (map: GameMap, z: Box, x: number, y: number): number => (z.y + y) * map.width + z.x + x;

/** What a company that can swim, climb and float can do: a flood with it asks only where a wall stands. */
export const ALL: Can = { swim: true, climb: true, float: true };

/**
 * The squares of box `z` a company that can `can` reaches from `from` (a square of the box), never
 * through `door` (one of the box's) and never out of the box: their keys on `map`.
 */
export function reach(map: GameMap, z: Box, from: Cell, can: Can, door?: Cell): Set<number> {
  const seen = new Set<number>(), todo = [[z.x + from[0], z.y + from[1]]];
  while (todo.length) {
    const [x, y] = todo.pop()!, k = y * map.width + x;
    if (seen.has(k) || (door && x === z.x + door[0] && y === z.y + door[1]) || x < z.x || x >= z.x + z.w || y < z.y || y >= z.y + z.h || map.passable(x, y, can) !== 'ok') continue;
    seen.add(k);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
  }
  return seen;
}

/**
 * Whether `door` shuts part of box `z` off: what a company that can do all reaches from `from`
 * without passing it, in the box or in `also`'s boxes beside it, how many squares, and whether
 * `prize` is among them. Every square is the box's own.
 */
export function shut(map: GameMap, z: Box, from: Cell, door: Cell, prize: Cell, also: readonly Box[] = []): { size: number; reached: boolean } {
  const inside = (x: number, y: number): boolean => [z, ...also].some((q) => x >= q.x && x < q.x + q.w && y >= q.y && y < q.y + q.h);
  const seen = new Set<number>(), todo = [[z.x + from[0], z.y + from[1]]];
  while (todo.length) {
    const [x, y] = todo.pop()!, k = y * map.width + x;
    if (seen.has(k) || !inside(x, y) || (x === z.x + door[0] && y === z.y + door[1]) || map.passable(x, y, ALL) !== 'ok') continue;
    seen.add(k);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
  }
  return { size: seen.size, reached: seen.has((z.y + prize[1]) * map.width + z.x + prize[0]) };
}

/**
 * Whether `to` is reached from `from` on map `m` (a map, or a fresh one built from its def) by a
 * company that can do all, never through a secret door: the way a map is walked without searching.
 */
export function reached(m: GameMap | MapDef, from: Cell, to: Cell): boolean {
  const g = m instanceof GameMap ? m : new GameMap(m), seen = new Set<number>(), todo = [[from[0], from[1]]];
  while (todo.length) {
    const [x, y] = todo.pop()!, k = y * g.width + x;
    if (seen.has(k) || !g.inBounds(x, y) || g.at(x, y).door === 'secret' || g.passable(x, y, ALL) !== 'ok') continue;
    seen.add(k);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
  }
  return seen.has(to[1] * g.width + to[0]);
}

/** The squares reached from x0, y0, square by square, over those `along` lets by: their keys on `map`, nearest first. */
export function spread(map: GameMap, x0: number, y0: number, along: (x: number, y: number) => boolean): Set<number> {
  const key = (x: number, y: number): number => y * map.width + x;
  const seen = new Set([key(x0, y0)]), q = [[x0, y0]];
  for (let i = 0; i < q.length; i++) {
    const [x, y] = q[i];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = key(x + dx, y + dy); if (!seen.has(k) && along(x + dx, y + dy)) { seen.add(k); q.push([x + dx, y + dy]); } }
  }
  return seen;
}

/** How many steps each square reached from x0, y0 over those `along` lets by lies from it: keys on `map`. */
export function paces(map: GameMap, x0: number, y0: number, along: (x: number, y: number) => boolean): Map<number, number> {
  const d = new Map([[y0 * map.width + x0, 0]]), q = [[x0, y0]];
  for (let i = 0; i < q.length; i++) {
    const [x, y] = q[i], n = d.get(y * map.width + x)!;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = (y + dy) * map.width + x + dx; if (!d.has(k) && along(x + dx, y + dy)) { d.set(k, n + 1); q.push([x + dx, y + dy]); } }
  }
  return d;
}

/**
 * The squares `along` lets by, and a square where it turns a corner: open, or between the boxes,
 * with `along` on either side of it one way and on either side the other.
 */
export const corner = (map: GameMap, along: (x: number, y: number) => boolean) => (x: number, y: number): boolean => along(x, y) || ((map.passable(x, y) === 'ok' || !map.zoneAt(x, y)) && [-1, 1].some((d) => along(x + d, y)) && [-1, 1].some((d) => along(x, y + d)));

/** A road's square: one drawn on a box (`=`), or between the boxes one of the world's grid's roads. */
export const drove = (map: GameMap, grid: { road: ArrayLike<unknown> }) => (x: number, y: number): boolean => map.at(x, y).ch === '=' || (!map.zoneAt(x, y) && !!grid.road[y * map.width + x]);

/** What `f` says of 0 to n - 1, joined: a row of squares as open or not. */
export const each = (n: number, f: (i: number) => boolean): string => Array.from({ length: n }, (_, i) => f(i)).join();

/** Row `y` of box `z`, each of its 32 squares open or not to a company that can `can`. */
export const row = (map: GameMap, z: Box, y: number, can: Can = {}): string => each(32, (i) => map.passable(z.x + i, z.y + y, can) === 'ok');

/** Column `x` of box `z`, each of its 32 squares open or not to a company that can `can`. */
export const col = (map: GameMap, z: Box, x: number, can: Can = {}): string => each(32, (i) => map.passable(z.x + x, z.y + i, can) === 'ok');

/** Whether a square is on `map` and open to a company that can do nothing: the floor a flood walks. */
export const floor = (map: GameMap) => (x: number, y: number): boolean => x >= 0 && y >= 0 && x < map.width && y < map.height && map.passable(x, y) === 'ok';

/** How many steps each square of `map` lies over its floor from the nearest of `from`: -1 where none reaches. */
export function flood(map: GameMap, from: readonly Cell[]): Int32Array {
  const { width, height } = map, on = floor(map);
  const d = new Int32Array(width * height).fill(-1), todo: number[] = [];
  for (const [x, y] of from) { d[y * width + x] = 0; todo.push(y * width + x); }
  for (let i = 0; i < todo.length; i++) {
    const x = todo[i] % width, y = Math.floor(todo[i] / width);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (on(nx, ny) && d[ny * width + nx] < 0) { d[ny * width + nx] = d[y * width + x] + 1; todo.push(ny * width + nx); }
    }
  }
  return d;
}

/**
 * How far `q` lies from the squares on a shortest walk from `a` to `b` on `def` (every way a company
 * can take between them, not one), by the way a company walks (a secret door as the floor it is) and
 * as the crow flies (the larger of the two differences); and the walk's steps.
 */
export function apartFrom(def: MapDef, a: Cell, b: Cell, q: Cell): { steps: number; walking: number; crow: number } {
  const map = new GameMap(def), { width, height } = map;
  const fromA = flood(map, [a]), fromB = flood(map, [b]), steps = fromA[b[1] * width + b[0]], road: [number, number][] = [];
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (fromA[y * width + x] >= 0 && fromA[y * width + x] + fromB[y * width + x] === steps) road.push([x, y]);
  return { steps, walking: flood(map, road)[q[1] * width + q[0]], crow: Math.min(...road.map(([x, y]) => Math.max(Math.abs(x - q[0]), Math.abs(y - q[1])))) };
}
