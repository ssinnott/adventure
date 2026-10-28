// The atlas as cells: worldGrid lays the strokes of the plan and every built outdoor map, 1:1 where
// it sits, into one grid of the world, a terrain to each square the party walks, and settles every
// land square into a zone. And the boxes the world is cut into, `square` cells a side from A1's
// corner, one outdoor map each, and the faults of a map laid that is not one box. Pure: nothing
// here draws.
import type { MapDef } from '../mapdef.ts';
import type { Atlas, Pt, ZoneMap } from './schema.ts';
import { TERRAINS, TI, MAP_TERRAIN, isWater, noise, fbm, spline, resample, riverCourse, trailLine, fillRing, inMask } from './painter.ts';
import type { WorldTerrain, Course, Mask } from './painter.ts';

// ---------------------------------------------------------------- the grid

export interface WorldGrid {
  width: number;
  height: number;
  /** One index into TERRAINS per cell, row-major. */
  terrain: Uint8Array;
  /** 1 where the cell is a built map's own cell. */
  built: Uint8Array;
  /** 1 on an atlas river (the painter draws those as strokes, not as a wash). */
  river: Uint8Array;
  /** 1 on a planned road; the cell keeps its terrain (a road through a wood, over a pass, across a ford). */
  road: Uint8Array;
  /** Index into the atlas's zones, -1 for void and deep water. */
  zone: Int16Array;
  /** The rivers' courses and the trails' lines, as the grid laid them. */
  courses: Course[];
  trails: Pt[][];
  at(x: number, y: number): WorldTerrain;
  /** Terrain index at a cell, void off the grid. */
  t(x: number, y: number): number;
}

/** How dear a cell is to cross when zones settle their borders; void and deep water are never crossed. */
const CROSS: Partial<Record<WorldTerrain, number>> = {
  grass: 2, farm: 2, road: 2, steppe: 2, sand: 2, dirt: 2, building: 2, woods: 2, forest: 3, pine: 3, heather: 3,
  vines: 3, salt: 3, marsh: 4, deadwood: 4, dunes: 4, ash: 4, glass: 4, hills: 5, rock: 5, snow: 6, ice: 6,
  crystal: 8, tidal: 8, shallow: 16, lava: 20, mountain: 16, volcano: 30, peak: 30, cliff: 40, chasm: 60,
};
/** Terrain that foothills and beaches may be laid over. */
const SOFT = new Set<number>([TI.grass, TI.farm, TI.steppe, TI.heather, TI.dirt, TI.woods]);

/**
 * The world as cells. In order: the rim (nothing beyond it, a band of mountains inside it), the
 * seas and the isles raised from them, the patches of country, the lakes, the ranges with their
 * foothills, shallows along every shore, the rivers, beaches, the tidal ground, and last the built maps, whose ring
 * of edge mountains is only their closed border, so edge cells that are mountain keep the atlas's
 * terrain (the sea south of the Foreland, the ridge between the Foreland and Thornmark) and any
 * other edge cell, like the road through the pass, is the map's. Then every land cell is given to a
 * zone, and the planned roads are marked over it all.
 */
export function worldGrid(atlas: Atlas, defs: readonly MapDef[]): WorldGrid {
  const W = atlas.width, H = atlas.height, N = W * H, seed = atlas.seed;
  const terrain = new Uint8Array(N), built = new Uint8Array(N), river = new Uint8Array(N);
  // One smooth displacement per cell; every outline reads its mask through it, scaled by its roughness.
  const wx = new Float32Array(N), wy = new Float32Array(N);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x;
    wx[i] = (fbm(x / 15, y / 15, seed + 1) - 0.5) * 2.6;
    wy[i] = (fbm(x / 15 + 7.3, y / 15 + 2.1, seed + 2) - 0.5) * 2.6;
  }
  const inside = (m: Mask, i: number, rough: number): boolean => {
    const x = i % W, y = (i - x) / W;
    return inMask(m, x + 0.5 + wx[i] * rough, y + 0.5 + wy[i] * rough);
  };
  const each = (ring: readonly Pt[], rough: number, fn: (i: number) => void): void => {
    const m = fillRing(spline(ring, true), W, H);
    const pad = Math.ceil(rough * 1.4) + 1;
    const xa = Math.max(0, m.x0 - pad), ya = Math.max(0, m.y0 - pad), xb = Math.min(W, m.x0 + m.w + pad), yb = Math.min(H, m.y0 + m.h + pad);
    for (let y = ya; y < yb; y++) for (let x = xa; x < xb; x++) { const i = y * W + x; if (inside(m, i, rough)) fn(i); }
  };

  // The rim, and the band of mountains inside it.
  each(atlas.rim.pts, atlas.rim.rough ?? 4, (i) => { terrain[i] = TI.grass; });
  // The world is one piece: a crumb of rim the wandering edge cut off from the rest is nothing.
  {
    const comp = new Int32Array(N).fill(-1), stack = new Int32Array(N);
    let best = -1, most = 0, id = 0;
    for (let i = 0; i < N; i++) {
      if (terrain[i] === TI.void || comp[i] >= 0) continue;
      let sp = 0, n = 0;
      stack[sp++] = i; comp[i] = id;
      while (sp) {
        const j = stack[--sp], x = j % W, y = (j - x) / W;
        n++;
        if (x > 0 && terrain[j - 1] !== TI.void && comp[j - 1] < 0) { comp[j - 1] = id; stack[sp++] = j - 1; }
        if (x < W - 1 && terrain[j + 1] !== TI.void && comp[j + 1] < 0) { comp[j + 1] = id; stack[sp++] = j + 1; }
        if (y > 0 && terrain[j - W] !== TI.void && comp[j - W] < 0) { comp[j - W] = id; stack[sp++] = j - W; }
        if (y < H - 1 && terrain[j + W] !== TI.void && comp[j + W] < 0) { comp[j + W] = id; stack[sp++] = j + W; }
      }
      if (n > most) { most = n; best = id; }
      id++;
    }
    for (let i = 0; i < N; i++) if (terrain[i] !== TI.void && comp[i] !== best) terrain[i] = TI.void;
  }
  const fromVoid = chamfer(W, H, (i) => terrain[i] === TI.void, true);
  // Water, and the isles raised back out of it; then the country, then the lakes.
  const water = new Uint8Array(N);
  for (const s of atlas.seas) each(s.pts, s.rough ?? 4, (i) => { water[i] = 1; });
  for (const s of atlas.isles) each(s.pts, s.rough ?? 2, (i) => { water[i] = 0; });
  for (const p of atlas.patches) {
    const t = TI[p.t];
    each(p.pts, p.rough ?? 3, (i) => { if (terrain[i] !== TI.void && !water[i]) terrain[i] = t; });
  }
  for (const s of atlas.lakes) each(s.pts, s.rough ?? 1.5, (i) => { water[i] = 1; });
  // Open country rolls: hills gather here and there, and the rim throws foothills inward.
  for (let i = 0; i < N; i++) {
    if (terrain[i] === TI.void) continue;
    if (water[i]) { terrain[i] = TI.sea; continue; }
    const x = i % W, y = (i - x) / W;
    const band = atlas.rim.width + (noise(x / 7, y / 7, seed + 3) - 0.5) * 5;
    const foot = 2 + fbm(x / 9, y / 9, seed + 4) * 8;
    if (fromVoid[i] < band) terrain[i] = TI.mountain;
    else if (fromVoid[i] < band + foot && SOFT.has(terrain[i])) terrain[i] = TI.hills;
    else if ((terrain[i] === TI.grass || terrain[i] === TI.steppe) && fbm(x / 10, y / 10, seed + 7) > 0.66) terrain[i] = TI.hills;
  }
  // The ranges: the crest, the range either side of it, then its foothills.
  for (const rg of atlas.ridges) {
    const kind = rg.kind ?? 'mountains';
    const core = kind === 'hills' ? TI.hills : kind === 'cliff' ? TI.cliff : kind === 'chasm' ? TI.chasm : kind === 'lava' ? TI.lava : TI.mountain;
    const foot = rg.foot ?? (kind === 'mountains' ? 3 : 0), footT = TI[rg.footT ?? 'hills'];
    const half = rg.width / 2, reach = half * 1.3 + foot + 4;
    // Wide ranges wander more at their edges; lines of cliff, chasm and lava keep to their course.
    const jitter = kind === 'cliff' || kind === 'chasm' ? 0 : kind === 'lava' ? 0.5 : 1.6 + half * 0.14;
    const st = stamp(W, H, resample(spline(rg.pts, false, 8), 0.5), () => reach);
    for (let j = 0; j < st.cells.length; j++) {
      const i = st.cells[j], d0 = st.d[j];
      if (terrain[i] === TI.void || water[i]) continue;
      const x = i % W, y = (i - x) / W;
      const d = d0 + wx[i] * jitter;
      // Snow lies on the high crest, in fields rather than one unbroken white line.
      if (d <= half) terrain[i] = rg.snow && d <= half * 0.55 && noise(x / 6, y / 6, seed + 9) > 0.46 ? TI.peak : core;
      else if (d <= half + foot && (SOFT.has(terrain[i]) || (footT !== TI.hills && terrain[i] !== core && terrain[i] !== TI.peak))) terrain[i] = footT;
    }
  }
  // Shallows along every shore, deep water further out.
  const fromLand = chamfer(W, H, (i) => terrain[i] !== TI.sea && terrain[i] !== TI.void, false);
  for (let i = 0; i < N; i++) if (terrain[i] === TI.sea && fromLand[i] <= 2) terrain[i] = TI.shallow;
  // Rivers run over whatever land they cross, cutting gorges through ranges.
  const courses = atlas.rivers.map((r, k) => riverCourse(r, seed + 40 + k));
  for (const c of courses) {
    const line = c.pts.map((p) => ({ x: p[0], y: p[1] }));
    const st = stamp(W, H, line, (j) => c.width[j] / 2 + 1);
    for (let j = 0; j < st.cells.length; j++) {
      const i = st.cells[j];
      if (terrain[i] === TI.void || isWater(terrain[i])) continue;
      if (st.d[j] <= Math.max(0.55, c.width[st.k[j]] / 2)) { terrain[i] = TI.shallow; river[i] = 1; }
    }
  }
  // Beaches where soft country meets open water, in runs rather than cell by cell.
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const i = y * W + x;
    if (!SOFT.has(terrain[i])) continue;
    const shore = [i - 1, i + 1, i - W, i + W].some((q) => isWater(terrain[q]) && !river[q]);
    if (shore && noise(x / 11, y / 11, seed + 5) > 0.36) terrain[i] = TI.sand;
  }
  // Tidal ground: inside a tide's outline, the sea's shallows that touch the land. A river keeps its
  // water, and the beach above stays sand, the dry way round at high water.
  for (const tide of atlas.tides ?? []) {
    const flats: number[] = [];
    each(tide.pts, tide.rough ?? 2, (i) => {
      const x = i % W;
      if (terrain[i] !== TI.shallow || river[i] || x === 0 || x === W - 1 || i < W || i >= N - W) return;
      if ([i - 1, i + 1, i - W, i + W].some((q) => !isWater(terrain[q]) && terrain[q] !== TI.void && terrain[q] !== TI.tidal)) flats.push(i);
    });
    for (const i of flats) terrain[i] = TI.tidal;
  }
  // The built maps, stamped 1:1.
  for (const z of atlas.zones) for (const { map, at } of z.maps ?? []) {
    const def = defs.find((d) => d.id === map);
    if (!def) continue;
    const [ax, ay] = at;
    const mh = def.rows.length, mw = Math.max(...def.rows.map((s) => s.length));
    for (let my = 0; my < mh; my++) for (let mx = 0; mx < mw; mx++) {
      const ch = def.rows[my][mx] ?? 'M';
      const edge = mx === 0 || my === 0 || mx === mw - 1 || my === mh - 1;
      if (edge && ch === 'M') continue;
      const x = ax + mx, y = ay + my;
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const i = y * W + x;
      terrain[i] = TI[MAP_TERRAIN[ch] ?? 'grass'];
      built[i] = 1; river[i] = 0;
    }
  }
  const zone = settleZones(atlas, defs, terrain, W, H);
  // Planned roads, marked over everything but the built maps and open water: over a river they are
  // a bridge or a ford, over a range a pass.
  const road = new Uint8Array(N);
  const trails = atlas.trails.map(trailLine);
  for (const line of trails) {
    for (const p of resample(line, 0.35)) {
      const x = Math.floor(p.x), y = Math.floor(p.y);
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const i = y * W + x;
      if (built[i] || terrain[i] === TI.void || terrain[i] === TI.sea) continue;
      road[i] = 1;
    }
  }
  const t = (x: number, y: number): number => (x < 0 || y < 0 || x >= W || y >= H ? TI.void : terrain[y * W + x]);
  return { width: W, height: H, terrain, built, river, road, zone, courses, trails, t, at: (x, y) => TERRAINS[t(x, y)] };
}

/** The cells within reach of a line's points, with each one's distance to the nearest point and which point that is. */
interface Stamp { cells: Int32Array; d: Float32Array; k: Int32Array }
function stamp(W: number, H: number, pts: readonly { x: number; y: number }[], reach: (k: number) => number): Stamp {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  pts.forEach((p, k) => { const r = reach(k); minX = Math.min(minX, p.x - r); minY = Math.min(minY, p.y - r); maxX = Math.max(maxX, p.x + r); maxY = Math.max(maxY, p.y + r); });
  const bx = Math.max(0, Math.floor(minX)), by = Math.max(0, Math.floor(minY));
  const bw = Math.max(0, Math.min(W, Math.ceil(maxX) + 1) - bx), bh = Math.max(0, Math.min(H, Math.ceil(maxY) + 1) - by);
  const dist = new Float32Array(bw * bh).fill(Infinity), near = new Int32Array(bw * bh).fill(-1);
  pts.forEach((p, k) => {
    const r = reach(k);
    for (let y = Math.max(by, Math.floor(p.y - r)); y <= Math.min(by + bh - 1, Math.ceil(p.y + r)); y++) {
      for (let x = Math.max(bx, Math.floor(p.x - r)); x <= Math.min(bx + bw - 1, Math.ceil(p.x + r)); x++) {
        const dd = Math.hypot(x + 0.5 - p.x, y + 0.5 - p.y), q = (y - by) * bw + (x - bx);
        if (dd <= r && dd < dist[q]) { dist[q] = dd; near[q] = k; }
      }
    }
  });
  let n = 0;
  for (let q = 0; q < near.length; q++) if (near[q] >= 0) n++;
  const cells = new Int32Array(n), d = new Float32Array(n), k = new Int32Array(n);
  for (let q = 0, j = 0; q < near.length; q++) {
    if (near[q] < 0) continue;
    cells[j] = (by + Math.floor(q / bw)) * W + bx + (q % bw); d[j] = dist[q]; k[j] = near[q]; j++;
  }
  return { cells, d, k };
}

/** Cells to the nearest cell that is `from`, chamfer 3-4, in cells; off the grid counts as `from` when `edge`. */
function chamfer(W: number, H: number, from: (i: number) => boolean, edge: boolean): Float32Array {
  const BIG = 1e6, d = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) d[i] = from(i) ? 0 : BIG;
  const off = edge ? 0 : BIG;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x;
    if (!d[i]) continue;
    let v = d[i];
    v = Math.min(v, (x > 0 ? d[i - 1] : off) + 3, (y > 0 ? d[i - W] : off) + 3);
    v = Math.min(v, (x > 0 && y > 0 ? d[i - W - 1] : off) + 4, (x < W - 1 && y > 0 ? d[i - W + 1] : off) + 4);
    d[i] = v;
  }
  for (let y = H - 1; y >= 0; y--) for (let x = W - 1; x >= 0; x--) {
    const i = y * W + x;
    if (!d[i]) continue;
    let v = d[i];
    v = Math.min(v, (x < W - 1 ? d[i + 1] : off) + 3, (y < H - 1 ? d[i + W] : off) + 3);
    v = Math.min(v, (x < W - 1 && y < H - 1 ? d[i + W + 1] : off) + 4, (x > 0 && y < H - 1 ? d[i + W - 1] : off) + 4);
    d[i] = v;
  }
  for (let i = 0; i < W * H; i++) d[i] /= 3;
  return d;
}

/**
 * Which zone every land cell is in: the cheapest walk to it from any zone's seeds, where a range, a
 * river or a cliff costs far more to cross than open country, so two zones meet along the ridge or
 * the river between them. A built zone starts from all its maps.
 */
function settleZones(atlas: Atlas, defs: readonly MapDef[], terrain: Uint8Array, W: number, H: number): Int16Array {
  const N = W * H;
  const cost = new Float32Array(TERRAINS.length);
  TERRAINS.forEach((t, k) => { cost[k] = CROSS[t] ?? Infinity; });
  const zone = new Int16Array(N).fill(-1);
  const dist = new Float32Array(N).fill(Infinity);
  const heap = new Heap(N);
  const seedAt = (i: number, z: number): void => {
    if (!Number.isFinite(cost[terrain[i]]) || dist[i] === 0) return;
    dist[i] = 0; zone[i] = z; heap.push(i, 0);
  };
  atlas.zones.forEach((z, k) => {
    for (const { map, at } of z.maps ?? []) {
      const def = defs.find((d) => d.id === map);
      if (!def) continue;
      for (let my = 0; my < def.rows.length; my++) for (let mx = 0; mx < def.rows[my].length; mx++) {
        const x = at[0] + mx, y = at[1] + my;
        if (x >= 0 && y >= 0 && x < W && y < H) seedAt(y * W + x, k);
      }
    }
    for (const [sx, sy] of z.seeds ?? []) {
      const i = landNear(terrain, cost, W, H, Math.floor(sx), Math.floor(sy));
      if (i >= 0) seedAt(i, k);
    }
  });
  while (heap.size) {
    const i = heap.pop();
    const x = i % W, y = (i - x) / W, di = dist[i];
    for (let n = 0; n < 4; n++) {
      const nx = n === 0 ? x - 1 : n === 1 ? x + 1 : x, ny = n === 2 ? y - 1 : n === 3 ? y + 1 : y;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const q = ny * W + nx, c = cost[terrain[q]];
      if (!Number.isFinite(c)) continue;
      const nd = di + (c + cost[terrain[i]]) / 2;
      if (nd < dist[q]) { dist[q] = nd; zone[q] = zone[i]; heap.push(q, nd); }
    }
  }
  // Land no walk reaches, an islet off the coast, goes with the nearest zone across the water.
  const near = Int16Array.from(zone), queue = new Int32Array(N);
  let head = 0, tail = 0;
  for (let i = 0; i < N; i++) if (zone[i] >= 0) queue[tail++] = i;
  while (head < tail) {
    const i = queue[head++], x = i % W, y = (i - x) / W;
    for (let n = 0; n < 4; n++) {
      const nx = n === 0 ? x - 1 : n === 1 ? x + 1 : x, ny = n === 2 ? y - 1 : n === 3 ? y + 1 : y;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const q = ny * W + nx;
      if (near[q] >= 0 || terrain[q] === TI.void) continue;
      near[q] = near[i]; queue[tail++] = q;
      if (Number.isFinite(cost[terrain[q]])) zone[q] = near[i];
    }
  }
  return zone;
}

/** The nearest cell to (x, y) a zone can stand on, searching outwards a little. */
function landNear(terrain: Uint8Array, cost: Float32Array, W: number, H: number, x: number, y: number): number {
  for (let r = 0; r < 8; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
    if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
    const xx = x + dx, yy = y + dy;
    if (xx >= 0 && yy >= 0 && xx < W && yy < H && Number.isFinite(cost[terrain[yy * W + xx]])) return yy * W + xx;
  }
  return -1;
}

/** A binary min-heap of cell indices keyed by distance. Stale entries are left in and skipped by the caller. */
class Heap {
  private ids: Int32Array; private keys: Float32Array; size = 0;
  constructor(cap: number) { this.ids = new Int32Array(cap); this.keys = new Float32Array(cap); }
  push(id: number, key: number): void {
    if (this.size >= this.ids.length) {
      const ids = new Int32Array(this.ids.length * 2), keys = new Float32Array(this.keys.length * 2);
      ids.set(this.ids); keys.set(this.keys); this.ids = ids; this.keys = keys;
    }
    let i = this.size++;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.keys[p] <= key) break;
      this.ids[i] = this.ids[p]; this.keys[i] = this.keys[p]; i = p;
    }
    this.ids[i] = id; this.keys[i] = key;
  }
  pop(): number {
    const top = this.ids[0];
    const id = this.ids[--this.size], key = this.keys[this.size];
    let i = 0;
    for (;;) {
      let c = i * 2 + 1;
      if (c >= this.size) break;
      if (c + 1 < this.size && this.keys[c + 1] < this.keys[c]) c++;
      if (this.keys[c] >= key) break;
      this.ids[i] = this.ids[c]; this.keys[i] = this.keys[c]; i = c;
    }
    this.ids[i] = id; this.keys[i] = key;
    return top;
  }
}

// ---------------------------------------------------------------- the boxes

/**
 * The world is cut into boxes of `square` cells a side, from A1's corner at `corner` and on both
 * ways from it; a box cut by the world's edge to under half a box is a strip of rim, unlettered, and
 * the rest are lettered by column (A, B...) and row (1, 2...). Every outdoor map is one box.
 */
export interface Box { name: string; x: number; y: number; w: number; h: number }

/** One way's cuts: where each lettered column or row starts in world cells, and how many cells it spans. */
function cuts(corner: number, square: number, extent: number): { at: number; len: number }[] {
  const out: { at: number; len: number }[] = [];
  const first = Math.floor(-corner / square), last = Math.floor((extent - 1 - corner) / square);
  for (let k = first; k <= last; k++) {
    const start = corner + k * square;
    const lo = Math.max(0, start), hi = Math.min(extent, start + square);
    if (hi - lo >= square / 2) out.push({ at: lo, len: hi - lo });
  }
  return out;
}

/** A column or a row of the grid: its name (a letter or a number), where it starts and how many cells it spans. */
export interface Cut { name: string; at: number; len: number }

/** A column's letters: A to Z, then AA on. */
const colName = (k: number): string => (k >= 26 ? colName(Math.floor(k / 26) - 1) : '') + String.fromCharCode(65 + (k % 26));

/** What the grid is cut from: the world's size, a box's side and where A1's corner falls. */
export type Grid = Pick<Atlas, 'width' | 'height' | 'square' | 'corner'>;

/** The grid's columns and rows as cut to the world, A and 1 first. */
export function gridCuts(atlas: Grid): { cols: Cut[]; rows: Cut[] } {
  return {
    cols: cuts(atlas.corner[0], atlas.square, atlas.width).map((c, k) => ({ name: colName(k), ...c })),
    rows: cuts(atlas.corner[1], atlas.square, atlas.height).map((c, k) => ({ name: String(k + 1), ...c })),
  };
}

/** The name of the box a world cell is in (`G2`); undefined in a strip or off the world. */
export function boxAt(atlas: Atlas, x: number, y: number): string | undefined {
  const { cols, rows } = gridCuts(atlas);
  const c = cols.find((q) => x >= q.at && x < q.at + q.len), r = rows.find((q) => y >= q.at && y < q.at + q.len);
  return c && r ? c.name + r.name : undefined;
}

/** A box by its name, as cut to the world; undefined if the grid has no such box. */
export function box(atlas: Grid, name: string): Box | undefined {
  const { cols, rows } = gridCuts(atlas);
  const m = /^([A-Z]+)(\d+)$/.exec(name);
  const c = cols.find((q) => q.name === m?.[1]), r = rows.find((q) => q.name === m?.[2]);
  return c && r ? { name, x: c.at, y: r.at, w: c.len, h: r.len } : undefined;
}

/**
 * A zone's map laid in its box (#993): the box its id ends in (`highmoor_n7` lies in N7), or the
 * one named where the id names none (the Foreland's `shelf` in G2), its place the box's corner.
 * Throws where the grid has no such box.
 */
export function laid(grid: Grid, map: string, name = /_([a-z]+\d+)$/.exec(map)?.[1].toUpperCase()): ZoneMap {
  const b = name === undefined ? undefined : box(grid, name);
  if (!b) throw new Error(`map ${map} is laid in ${name ? `${name}, which is no box of the grid` : 'no box: its id names none, and none is named'}`);
  return { map, at: [b.x, b.y] };
}

/**
 * How the atlas lays its outdoor maps against the grid, one line a fault: a map laid twice, or one
 * that is not one whole box (a box of `square` a side, or one the world's edge cuts). Empty when
 * every laid map is a box. A check for the tests: fixtures lay off the grid on purpose.
 */
export function gridFaults(atlas: Atlas, defs: readonly MapDef[]): string[] {
  const faults: string[] = [];
  const seen = new Map<string, string>();
  for (const z of atlas.zones) for (const { map, at } of z.maps ?? []) {
    const was = seen.get(map);
    if (was) { faults.push(`map ${map} is laid twice, by ${was} and by ${z.id}`); continue; }
    seen.set(map, z.id);
    const def = defs.find((d) => d.id === map);
    if (!def) continue;
    const w = Math.max(...def.rows.map((r) => r.length)), h = def.rows.length;
    const name = boxAt(atlas, at[0], at[1]);
    const b = name ? box(atlas, name) : undefined;
    if (!b) { faults.push(`map ${map} at ${at[0]},${at[1]} lies in no box of the grid`); continue; }
    if (b.x !== at[0] || b.y !== at[1] || b.w !== w || b.h !== h) {
      faults.push(`map ${map} at ${at[0]},${at[1]} (${w}x${h}) is not one box: it starts in ${b.name}, which is ${b.x},${b.y} (${b.w}x${b.h})`);
    }
  }
  return faults;
}
