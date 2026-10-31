// The horizon cast from the atlas (#1095): from the party's world cell a ray to each column's bearing walks the
// world's grid (`GRID`, content/maps.ts) past the fourth square, out to the rim or to `REACH`, and `castHorizon`
// gives what it met. Over the horizon, each column's land standing there, near to far, each part taller than the
// one before it: the ranges high, a wood a treeline, hills low, open ground and water flat (`STAND`), stylised,
// no taller than the two bands before them, and fading slowly with distance. Under it, the ground band: a world
// cell to each row of pixels down to the fourth row's floor, hidden behind the nearest range. Ask `standsOver`
// how high the land nearer than a distance stands in a column (a landmark, #1096). `drawSkyline` paints the first
// (sky.ts) and `drawLand` the second (compositor.ts), each colour darker by night, white under lying snow and on
// the peaks always, faded into the region's haze with distance and lost in murk. It reads the grid alone, which
// never changes as a game runs, so a square's horizon is painted once, with its scene (kept.ts). Land and water
// only: no building, site or feature is cast, and a building's square is the grass it stands on.

import type { WorldGrid, WorldTerrain } from '../../game/atlas.ts';
import { TERRAINS, TI, fbm } from '../../game/atlas.ts';
import { LEGEND } from '../../game/map.ts';
import { LOOK } from '../../game/outdoors.ts';
import type { Terrain } from '../../game/mapdef.ts';
import { FACING_DX, FACING_DY } from '../../game/types.ts';
import type { Facing } from '../../game/types.ts';
import { VIEW_DEPTH } from '../../game/world.ts';
import { shade, mix } from '../../lib/art/palettes.ts';
import { hash } from '../paint/brush.ts';
import { unit, grassColor, SNOW } from './common.ts';
import type { Paint, ViewRect } from './common.ts';
import { GROUND, groundColor } from './ground/index.ts';

/**
 * How far a ray runs at most, in squares: past it a square is narrower than a column of the view's 268 rows,
 * so a column's ray would miss squares between it and the next, and a range would flicker as the company
 * steps. The band's first row under the horizon lies there; past it the sky's foot takes over.
 */
export const REACH = 240;

/** A kind of land that stands: how many pixels over the horizon close by, at most, its colour by day (or on a day of the year) and how white lying snow makes it, a peak white always. */
interface Stand { h: number; day: string | ((day: number) => string); snow: number }

/** The world's terrains that stand over the horizon: the ranges high, a wood a treeline, hills low. Every other terrain lies flat. */
const STAND: Readonly<Partial<Record<WorldTerrain, Stand>>> = {
  peak: { h: 56, day: '#e4eaf0', snow: 1 },
  volcano: { h: 56, day: '#56607c', snow: 0.4 },
  mountain: { h: 44, day: '#64769a', snow: 0.85 },
  cliff: { h: 30, day: '#8a7a68', snow: 0.6 },
  pine: { h: 18, day: '#2a4a3a', snow: 0.6 },
  forest: { h: 16, day: (d) => mix('#30563a', grassColor(d), 0.3), snow: 0.6 },
  crystal: { h: 14, day: '#9c8cbc', snow: 0.4 },
  woods: { h: 11, day: (d) => mix('#43703e', grassColor(d), 0.3), snow: 0.6 },
  rock: { h: 10, day: '#807a70', snow: 0.8 },
  deadwood: { h: 9, day: '#6c6458', snow: 0.6 },
  hills: { h: 7, day: (d) => shade(GROUND.hills.color(d, 0), 0.85), snow: 0.8 },
  dunes: { h: 4, day: (d) => shade(GROUND.dunes.color(d, 0), 0.9), snow: 0.8 },
};

/** The most any land stands close by, in pixels: a peak's, as the far band stood at its highest. */
const TALLEST = 56;

/**
 * Which land a standing kind is deep in, for how high it stands there: a range (and the void past the rim, which
 * is drawn as the rim's mountain), a wood or rising ground; none for flat.
 */
const GROUP: Readonly<Partial<Record<WorldTerrain, number>>> = {
  void: 1, peak: 1, volcano: 1, mountain: 1, cliff: 1, pine: 2, forest: 2, crystal: 2, woods: 2, deadwood: 2, rock: 3, hills: 3, dunes: 3,
};

/** The ground each world terrain is drawn as, as the void's looks are (game/outdoors.ts): a building's square the grass it stands on. */
const GROUND_OF: readonly Terrain[] = TERRAINS.map((t) => (t === 'building' ? 'grass' : LEGEND[LOOK[t]].terrain));

/** How a standing kind's height varies over the land, by its group: a range by peaks and saddles some squares apart, a wood by its clumps, rising ground by its swells. */
const SHAPE: readonly ((x: number, y: number) => number)[] = [
  () => 1,
  (x, y) => 0.5 + 0.5 * Math.max(0, Math.min(1, (fbm(x / 3, y / 3, 1095, 2) - 0.25) / 0.5)),
  (x, y) => 0.75 + 0.25 * hash(x, y, 1095),
  (x, y) => 0.6 + 0.4 * fbm(x / 4, y / 4, 1096, 2),
];

/** The land a cast walks: a grid's terrain, one to each world cell. */
export type Land = Pick<WorldGrid, 'width' | 'height' | 'terrain'>;

/**
 * Each world cell's height over the horizon close by, in pixels: its kind's, lower at the edge of its range or wood
 * than at its heart, and as its group's shape has it there. Worked out once a grid.
 */
const heights = new WeakMap<Land, Uint8Array>();
export function heightsOf(grid: Land): Uint8Array {
  const had = heights.get(grid);
  if (had) return had;
  const { width: W, height: H, terrain } = grid, group = new Uint8Array(W * H), hs = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) group[i] = GROUP[TERRAINS[terrain[i]]] ?? 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, g = group[i];
    if (!g) continue;
    let n = 0;
    for (let v = Math.max(0, y - 2); v <= Math.min(H - 1, y + 2); v++) for (let u = Math.max(0, x - 2); u <= Math.min(W - 1, x + 2); u++) if (group[v * W + u] === g) n++;
    hs[i] = Math.round((STAND[TERRAINS[terrain[i]]] ?? STAND.mountain!).h * (0.6 + 0.4 * (n / 25)) * SHAPE[g](x, y));
  }
  // A range's heights are smoothed over the squares about each (a weighted three by three), so it is not cut into
  // teeth: its edge stands at least half as high as it would, and a flat square in its heart (a lava flow down Fire
  // Mountain, a road over a pass) stands with the range about it.
  const smooth: [number, number][] = [];
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const i = y * W + x, g = group[i];
    if (g > 1) continue;
    let n = 0, sum = 0;
    for (let v = -1; v <= 1; v++) for (let u = -1; u <= 1; u++) {
      const j = i + v * W + u;
      if (group[j] === 1) { n++; sum += hs[j] * (u ? 2 : 4) / (v ? 2 : 1); }
    }
    if (g === 1) smooth.push([i, Math.max(Math.round(hs[i] / 2), Math.round(sum / 16))]);
    else if (n >= 5) smooth.push([i, Math.round(sum / 16)]);
  }
  for (const [i, v] of smooth) hs[i] = v;
  heights.set(grid, hs);
  return hs;
}

/** Land that stands over the horizon in a column: its top in pixels over the horizon, its world terrain, its cell (`y * width + x`, -1 past the grid) and how many squares ahead it lies. */
interface Span { top: number; t: number; cell: number; d: number }

/** What a cast met (`castHorizon`), for a view `cols.length` wide. */
export interface Horizon {
  /** The grid's width, to find a cell's square. */
  width: number;
  /** Each column's land standing over the horizon, near to far, each part taller than the one before it. */
  cols: Span[][];
  /** How far each column's ray ran, in squares: to the rim, the first square past the world's edge, or to `REACH`. */
  end: Int16Array;
  /** The ground band's rows, the horizon's first; then for each row, a column at a time, the world cell shown, its terrain and how far ahead it lies, the nearest range where one hides the ground. */
  rows: number; cells: Int32Array; ts: Uint8Array; ds: Int16Array;
}

/**
 * The horizon from world cell `at` facing `f`, for a view `w` by `h`: a ray to each column's bearing, through the
 * square that column shows at each depth past the fourth (`unit`), walks `grid` until it passes the world's
 * edge or `REACH`. The world's edge stands as the rim's mountain, as the void's look is drawn. `tall` is the
 * land's heights (`heightsOf`), which move with it.
 */
export function castHorizon(grid: Land, at: { x: number; y: number }, f: Facing, w: number, h: number, tall = heightsOf(grid)): Horizon {
  const { width: W, height: H, terrain } = grid;
  const fx = FACING_DX[f], fy = FACING_DY[f], rx = FACING_DX[(f + 1) & 3], ry = FACING_DY[(f + 1) & 3];
  // `unit(k, h)` is U / (k + 0.5): a square k ahead lies that far under the horizon and is twice that across.
  const U = unit(0, h) / 2, first = VIEW_DEPTH + 1, rows = Math.ceil(unit(VIEW_DEPTH + 0.5, h)), rim = STAND.mountain!.h;
  const cols: Span[][] = [], end = new Int16Array(w), cells = new Int32Array(rows * w), ts = new Uint8Array(rows * w), ds = new Int16Array(rows * w);
  const along = new Int32Array(REACH + 1);
  for (let c = 0; c < w; c++) {
    const s = (c + 0.5 - w / 2) / (2 * U), spans: Span[] = [];
    let top = 0, k = first;
    for (; k <= REACH; k++) {
      // The ray crosses this depth `lat` squares across, in the square the column shows there; its height is
      // drawn from the squares either side, so a range slopes and peaks across the columns rather than in blocks.
      // Once nothing farther could stand over what stands, only the square shown is wanted.
      const lat = s * (k + 0.5), l0 = Math.floor(lat), fr = lat - l0, ax = at.x + k * fx + l0 * rx, ay = at.y + k * fy + l0 * ry;
      if (top >= TALLEST * (1 - k / REACH)) {
        const ix = fr < 0.5 ? ax : ax + rx, iy = fr < 0.5 ? ay : ay + ry, i = ix >= 0 && iy >= 0 && ix < W && iy < H ? iy * W + ix : -1;
        if (i < 0 || terrain[i] === TI.void) break;
        along[k] = i;
        continue;
      }
      const bx = ax + rx, by = ay + ry;
      const a = ax >= 0 && ay >= 0 && ax < W && ay < H ? ay * W + ax : -1, b = bx >= 0 && by >= 0 && bx < W && by < H ? by * W + bx : -1;
      const i = fr < 0.5 ? a : b, ha = a < 0 ? rim : tall[a], hb = b < 0 ? rim : tall[b];
      const up = ha || hb ? Math.round((ha + (hb - ha) * fr) * (1 - k / REACH)) : 0, most = ha >= hb ? a : b;
      const past = i < 0 || terrain[i] === TI.void;
      if (up > top) { spans.push({ top: up, t: most < 0 ? TI.void : terrain[most], cell: i, d: k }); top = up; }
      if (past) break;
      along[k] = i;
    }
    end[c] = Math.min(k, REACH);
    cols.push(spans);
    // A range hides the ground behind it; a wood or a hill lies on the ground as the world map paints it.
    const hide = spans.find((p) => GROUP[TERRAINS[p.t]] === 1), last = k - 1;
    for (let j = 0; j < rows; j++) {
      const o = j * w + c, kk = Math.max(first, Math.min(last, Math.round(U / (j + 0.5) - 0.5)));
      if (hide && hide.d <= kk) { cells[o] = hide.cell; ts[o] = hide.t; ds[o] = hide.d; }
      else { cells[o] = along[kk]; ts[o] = terrain[along[kk]]; ds[o] = kk; }
    }
  }
  return { width: W, cols, end, rows, cells, ts, ds };
}

/** How high the land nearer than `d` squares stands over the horizon in column `c`, in pixels: what hides a thing that far off standing no taller. */
export function standsOver(cast: Horizon, c: number, d: number): number {
  let top = 0;
  for (const s of cast.cols[c] ?? []) if (s.d < d) top = s.top;
  return top;
}

/** The light the land on the horizon is seen in, as the bands before it were: the daylight and the night, murk, the snow lying and the day of the year, and the haze far things fade into (`hazeOf`, the region's air in it). */
interface Light { daylight: number; dark: boolean; murk: number; cover: number; day: number; haze: string }

/** The colour of standing land `d` squares ahead: its own by day and the night's blue by night, white under lying snow as it holds it (a peak always), faded into the haze with distance and lost in murk. */
function standColor(t: number, d: number, o: Light): string {
  const s = STAND[TERRAINS[t]] ?? STAND.mountain!;
  const day = mix(typeof s.day === 'string' ? s.day : s.day(o.day), SNOW, s.snow >= 1 ? 1 : o.cover * s.snow);
  const c = mix(mix('#101426', day, o.daylight), o.haze, Math.min(1, 0.06 + (0.4 * d) / REACH + o.murk * 1.3));
  return o.dark ? shade(c, 0.5) : c;
}

/** Each standing kind's colour at each distance, worked out once a paint. */
function standColors(o: Light): (t: number, d: number) => string {
  const memo = new Map<number, string>();
  return (t, d) => {
    let c = memo.get(t * 4096 + d);
    if (c === undefined) memo.set(t * 4096 + d, (c = standColor(t, d, o)));
    return c;
  };
}

/** Rows of runs of one colour across the columns: each row is drawn as the runs its columns make, `fill` taking each with its first column and width. */
function runs(w: number, colour: (c: number) => string, fill: (c: number, n: number, col: string) => void): void {
  let from = 0, col = colour(0);
  for (let c = 1; c <= w; c++) {
    const now = c < w ? colour(c) : '';
    if (now !== col) { fill(from, c - from, col); from = c; col = now; }
  }
}

/** The skyline over the horizon of `r`, as `castHorizon` gave it: each column's land standing, near to far, in its colour. */
export function drawSkyline(ctx: CanvasRenderingContext2D, r: ViewRect, cast: Horizon, o: Light): void {
  const horizon = r.y + r.h / 2, colour = standColors(o), w = cast.cols.length;
  // Layer by layer up the columns: the nth part of each column's land, where it has one, from the top of the one below it.
  const most = Math.max(0, ...cast.cols.map((s) => s.length));
  for (let n = 0; n < most; n++) {
    const part = (c: number): string => { const s = cast.cols[c][n]; return s ? `${cast.cols[c][n - 1]?.top ?? 0} ${s.top} ${colour(s.t, s.d)}` : ''; };
    runs(w, part, (c, k, key) => {
      if (!key) return;
      const [below, top, col] = key.split(' ');
      ctx.fillStyle = col; ctx.fillRect(r.x + c, horizon - Number(top), k, Number(top) - Number(below));
    });
  }
}

/**
 * The ground band under the horizon of `p`'s view, as `castHorizon` gave it, a row of pixels at a time: each column's
 * land in its colour, as the band before it was (`groundColor` at its world cell, darkened, and faded toward the
 * haze near the horizon), and what stands hiding it in its own colour. Where `brow` gives a colour for the square a
 * column shows past the fourth, by its lateral (a hill seen from below it, #53), the band there is that colour.
 * The last row runs on down to the view's foot.
 */
export function drawLand(p: Paint, r: ViewRect, cast: Horizon, o: Light, floorPal: string, brow: (l: number) => string | undefined): void {
  const { ctx, horizon, dark } = p, w = cast.cols.length, U = unit(0, r.h) / 2, fall = unit(VIEW_DEPTH + 0.5, r.h), stand = standColors(o);
  const ground = new Map<number, string>(), brows = new Map<number, string | undefined>();
  const groundAt = (i: number, t: number): string => {
    let c = ground.get(i);
    if (c === undefined) ground.set(i, (c = shade(groundColor(p, GROUND_OF[t], floorPal, i % cast.width, Math.floor(i / cast.width)), dark ? 0.2 : 0.55)));
    return c;
  };
  const browAt = (c: number): string | undefined => {
    const l = Math.round(((c + 0.5 - w / 2) / (2 * U)) * (VIEW_DEPTH + 1.5));
    if (!brows.has(l)) brows.set(l, brow(l));
    return brows.get(l);
  };
  for (let j = 0; j < cast.rows; j++) {
    const fade = (dark ? 0.1 : 0.5) * Math.max(0, 1 - (j + 0.5) / fall), tall = j === cast.rows - 1 ? r.h / 2 - j : 1;
    runs(w, (c) => {
      const o2 = j * w + c, t = cast.ts[o2], b = browAt(c);
      if (b) return mix(b, o.haze, fade);
      return STAND[TERRAINS[t]] || cast.cells[o2] < 0 ? stand(t, cast.ds[o2]) : mix(groundAt(cast.cells[o2], t), o.haze, fade);
    }, (c, n, col) => { ctx.fillStyle = col; ctx.fillRect(r.x + c, horizon + j, n, tall); });
  }
}
