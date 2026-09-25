// The world map (M): Caldera as a cloth map, after the ones that came folded in the Might and Magic
// boxes. It is painted at runtime from the atlas and the real outdoor maps, like the rest of the
// art: paper, a per-pixel pass for the sea and the land's washes (fields in patchwork, salt pans,
// vine rows), inked coasts with ripple lines, rivers and roads, then peaks, trees and sites drawn
// over it. The cloth is several screens across, so the first time the map opens it is painted a
// slice a frame behind a progress bar; after that the arrows scroll it and Z shows it whole. Two
// modes: the map alone, and the zone overlay, which colours every area by its step on the road of
// levels, rules the zones inside each, and draws every way between them, built or planned.
import type { Game, Screen } from '../game/game.ts';
import type { Action } from '../input.ts';
import { is } from '../input.ts';
import { drawText, drawTextOutlined, measureText } from '../lib/engine/text.ts';
import { ATLAS } from '../content/atlas.ts';
import { MAP_DEFS } from '../content/maps/index.ts';
import { worldGrid, zoneEdges, worldPoint, homeMap, zoneOfMap, areaOf, areaBand, spline, lattice, noise, fbm, TERRAINS, TI } from '../game/atlas.ts';
import type { WorldTerrain, WorldGrid, AtlasSite, AtlasPlace, ZoneEdge, Pt } from '../game/atlas.ts';
import type { World } from '../game/world.ts';
import { drawFrameBackground } from './frame.ts';
import { MessageScreen } from './screens.ts';
import { BRASS, TEXT, TEXT_DIM, PANEL } from './palette.ts';
import { rgba, hexToRgb } from '../lib/art/palettes.ts';

// ---------------------------------------------------------------- layout

/** Cloth pixels per world cell. */
const S = 4;
/** The cloth's margin round the world, where the border band and its lettering go. */
const PAD = 16;
/** The whole cloth, in its own pixels. */
export const CLOTH = { w: ATLAS.width * S + PAD * 2, h: ATLAS.height * S + PAD * 2 } as const;
/** World cells to cloth pixels. */
const px = (wx: number): number => PAD + wx * S;
const py = (wy: number): number => PAD + wy * S;
/** Where the cloth shows on screen: inside the carved frame, above the key hints. */
const VIEW = { x: 8, y: 8, w: 624, h: 318 } as const;

/** Sepia ink, the red ink towns are lettered in, the blue waters are, and the paper labels are haloed with. */
const INK = '#3b2a1c';
const RED_INK = '#8a2c1a';
const WATER_INK = '#2c4a60';
const HALO = '#ecdfbf';
type RGB = [number, number, number];
const PAPER: RGB = [232, 218, 184];

// ---------------------------------------------------------------- noise

/**
 * A smooth field sampled every `step` cloth pixels and read back bilinearly: the per-pixel passes
 * read several of these a pixel, and evaluating the noise itself at every pixel of a cloth this size
 * would take seconds.
 */
function coarse(step: number, fn: (x: number, y: number) => number): (x: number, y: number) => number {
  const gw = Math.ceil(CLOTH.w / step) + 2, gh = Math.ceil(CLOTH.h / step) + 2;
  const a = new Float32Array(gw * gh);
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) a[j * gw + i] = fn(i * step, j * step);
  return (x, y) => {
    const fx = x / step, fy = y / step, i = Math.floor(fx), j = Math.floor(fy), tx = fx - i, ty = fy - j, k = j * gw + i;
    const top = a[k] + (a[k + 1] - a[k]) * tx, bot = a[k + gw] + (a[k + gw + 1] - a[k + gw]) * tx;
    return top + (bot - top) * ty;
  };
}
const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);
function canvas(w: number, h: number): HTMLCanvasElement {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  return cv;
}
const smooth = (a: number, b: number, v: number): number => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };
/** Cloth pixel to world cell. */
const wxOf = (X: number): number => (X + 0.5 - PAD) / S;
const wyOf = (Y: number): number => (Y + 0.5 - PAD) / S;

/** A box blur of a cell field, `r` cells each way, in two passes; cells marked in `keep` keep their value. */
function blur(f: Float32Array, W: number, H: number, r: number, keep?: Uint8Array): Float32Array {
  const tmp = new Float32Array(W * H), out = new Float32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let s = 0, n = 0;
    for (let d = -r; d <= r; d++) { const xx = x + d; if (xx >= 0 && xx < W) { s += f[y * W + xx]; n++; } }
    tmp[y * W + x] = s / n;
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let s = 0, n = 0;
    for (let d = -r; d <= r; d++) { const yy = y + d; if (yy >= 0 && yy < H) { s += tmp[yy * W + x]; n++; } }
    const i = y * W + x;
    out[i] = keep && keep[i] ? f[i] : s / n;
  }
  return out;
}

/** Bilinear reads of a cell field at world coordinates (cell centres at +0.5). */
function sampler(f: Float32Array, W: number, H: number): (wx: number, wy: number) => number {
  return (wx, wy) => {
    const fx = wx - 0.5, fy = wy - 0.5;
    const xf = Math.floor(fx), yf = Math.floor(fy), tx = fx - xf, ty = fy - yf;
    const x0 = xf < 0 ? 0 : xf >= W ? W - 1 : xf, y0 = yf < 0 ? 0 : yf >= H ? H - 1 : yf;
    const x1 = xf + 1 < 0 ? 0 : xf + 1 >= W ? W - 1 : xf + 1, y1 = yf + 1 < 0 ? 0 : yf + 1 >= H ? H - 1 : yf + 1;
    const a = f[y0 * W + x0], b = f[y0 * W + x1], c = f[y1 * W + x0], d = f[y1 * W + x1];
    return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
  };
}

// ---------------------------------------------------------------- the ground

/** Watercolour washes over the paper, per terrain. Roads and buildings are drawn over grass. */
const WASH: Record<WorldTerrain, RGB> = {
  void: PAPER, sea: [92, 138, 162], shallow: [150, 188, 192], grass: [184, 193, 122], farm: [196, 190, 120],
  steppe: [216, 198, 136], forest: [146, 166, 94], woods: [176, 190, 116], pine: [132, 156, 110], deadwood: [158, 152, 132],
  crystal: [168, 148, 176], hills: [202, 180, 122], heather: [170, 140, 138], marsh: [158, 164, 108],
  sand: [230, 210, 152], dunes: [232, 206, 140], salt: [236, 232, 222], glass: [206, 226, 218],
  vines: [176, 150, 110], ash: [148, 138, 126], lava: [196, 74, 34], snow: [238, 238, 230], ice: [214, 230, 238],
  rock: [192, 170, 136], dirt: [208, 184, 134], mountain: [188, 168, 132], peak: [214, 216, 210],
  cliff: [170, 146, 112], chasm: [52, 36, 62], volcano: [112, 96, 88], road: [184, 193, 122], building: [184, 193, 122],
};
const WASH_BY = TERRAINS.map((t) => WASH[t]);
const SHALLOW: RGB = [156, 192, 194];
const DEEP: RGB = [78, 124, 152];
const FOAM: RGB = [226, 238, 230];
const COAST: RGB = [72, 60, 46];
/** Crops in a patchwork of fields, and the hedges between them. */
const FIELDS: RGB[] = [[214, 196, 112], [176, 192, 102], [198, 170, 112], [204, 208, 132], [186, 158, 98], [166, 184, 96]];
const HEDGE: RGB = [104, 126, 64];
const PANS: RGB[] = [[238, 234, 226], [228, 222, 214], [242, 238, 232], [226, 214, 210]];

/**
 * The paper and everything washed onto it, one pixel at a time: which pixels are sea, land or bare
 * cloth; the land's terrain (a domain-warped look-up, so washes have soft organic edges); each
 * area's own grass; fields, pans and vineyards as patterns; the sea darkening away from the shore;
 * an inked coastline with three ripple lines outside it; a darker rim where one wash meets another,
 * the way pigment pools; folds, stains and worn edges. Leaves which pixels are what in `kind`.
 */
function* paintGround(ctx: CanvasRenderingContext2D, grid: WorldGrid, kind: Uint8Array): Generator<number, void> {
  const W = grid.width, H = grid.height, N = W * H, T = grid.terrain;
  const wet = new Float32Array(N), empty = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const t = T[i];
    wet[i] = (t === TI.sea || t === TI.shallow) && !grid.river[i] ? 1 : 0;
    empty[i] = t === TI.void ? 1 : 0;
  }
  // Soften the land's edges; a built map keeps its single-cell river.
  const wetS = sampler(blur(wet, W, H, 1, grid.built), W, H), emptyS = sampler(blur(blur(empty, W, H, 1), W, H, 1), W, H);
  // Each area's grass, blended across its borders.
  const tint = [new Float32Array(N), new Float32Array(N), new Float32Array(N)];
  const zoneTint = ATLAS.zones.map((z) => { const a = ATLAS.areas.find((q) => q.id === z.area); return a?.tint ? hexToRgb(a.tint) : WASH.grass; });
  for (let i = 0; i < N; i++) { const z = grid.zone[i], c = z >= 0 ? zoneTint[z] : WASH.grass; tint[0][i] = c[0]; tint[1][i] = c[1]; tint[2][i] = c[2]; }
  const [tr, tg, tb] = tint.map((f) => blur(blur(f, W, H, 3), W, H, 3));
  const tintAt = (wx: number, wy: number, o: Float32Array): void => {
    const fx = wx - 0.5, fy = wy - 0.5, xf = Math.floor(fx), yf = Math.floor(fy), tx = fx - xf, ty = fy - yf;
    const x0 = Math.min(W - 1, Math.max(0, xf)), y0 = Math.min(H - 1, Math.max(0, yf)), x1 = Math.min(W - 1, Math.max(0, xf + 1)), y1 = Math.min(H - 1, Math.max(0, yf + 1));
    const a = y0 * W + x0, b = y0 * W + x1, c = y1 * W + x0, d = y1 * W + x1;
    const w0 = (1 - tx) * (1 - ty), w1 = tx * (1 - ty), w2 = (1 - tx) * ty, w3 = tx * ty;
    o[0] = tr[a] * w0 + tr[b] * w1 + tr[c] * w2 + tr[d] * w3;
    o[1] = tg[a] * w0 + tg[b] * w1 + tg[c] * w2 + tg[d] * w3;
    o[2] = tb[a] * w0 + tb[b] * w1 + tb[c] * w2 + tb[d] * w3;
  };
  const tc = new Float32Array(3);
  // What a river cell is painted as: the land along its banks, since the river is drawn as a stroke.
  const bank = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    if (!grid.river[i]) continue;
    const x = i % W, y = (i - x) / W;
    bank[i] = TI.grass;
    search: for (let r = 1; r <= 3; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      const t = grid.t(x + dx, y + dy);
      if (t !== TI.sea && t !== TI.shallow && t !== TI.void && t !== TI.road && t !== TI.building) { bank[i] = t; break search; }
    }
  }
  yield 0.03;

  const paperN = coarse(4, (x, y) => fbm(x * 0.045, y * 0.045, 3, 4));
  const stainN = coarse(8, (x, y) => fbm(x * 0.009 + 3.1, y * 0.009, 41, 3));
  const wobble = coarse(4, (x, y) => fbm(wxOf(x) * 0.21, wyOf(y) * 0.21, 7) - 0.5);
  const warpX = coarse(4, (x, y) => fbm(wxOf(x) * 0.33 + 11.3, wyOf(y) * 0.33, 13) - 0.5);
  const warpY = coarse(4, (x, y) => fbm(wxOf(x) * 0.33, wyOf(y) * 0.33 + 5.7, 17) - 0.5);
  const mottle = coarse(3, (x, y) => fbm(wxOf(x) * 0.55, wyOf(y) * 0.55, 21, 2) - 0.5);
  const streakN = coarse(4, (x, y) => noise(wxOf(x) * 0.8, wyOf(y) * 2.6, 51) - 0.5);
  const fieldAng = coarse(16, (x, y) => (noise(wxOf(x) / 34, wyOf(y) / 34, 91) - 0.5) * 1.3);
  yield 0.08;

  const SW = CLOTH.w, SH = CLOTH.h, NP = SW * SH;
  const land = new Uint8Array(NP);
  const paper = new Float32Array(NP);
  // Creases where the cloth was folded in four one way and three the other.
  const crease = (n: number, folds: number[]): Float32Array => {
    const c = new Float32Array(n);
    for (let i = 0; i < n; i++) for (const f of folds) { const d = i - f; c[i] += d === 0 ? -0.07 : d === 1 ? 0.04 : d > -6 && d < 6 ? -0.012 : 0; }
    return c;
  };
  const creaseX = crease(SW, [1, 2, 3].map((k) => Math.round((SW * k) / 4))), creaseY = crease(SH, [1, 2].map((k) => Math.round((SH * k) / 3)));
  for (let Y = 0; Y < SH; Y++) {
    for (let X = 0; X < SW; X++) {
      const p = Y * SW + X;
      // The cloth: mottled, stained, worn at the edges, creased where it was folded.
      let f = 1 + (paperN(X, Y) - 0.5) * 0.11 + (lattice(X, Y, 5) - 0.5) * 0.035 + creaseX[X] + creaseY[Y];
      const stain = stainN(X, Y);
      if (stain > 0.6) f -= (stain - 0.6) * 0.45;
      const edge = Math.min(X, Y, SW - 1 - X, SH - 1 - Y);
      if (edge < 12) f -= 0.2 * (1 - edge / 12) ** 2;
      paper[p] = f;
      const wx = wxOf(X), wy = wyOf(Y);
      if (wx < 0 || wy < 0 || wx >= W || wy >= H) continue;
      const n = wobble(X, Y);
      if (emptyS(wx, wy) + n * 0.7 > 0.5) continue;
      const cell = Math.floor(wy) * W + Math.floor(wx);
      const wv = wetS(wx, wy) + n * (grid.built[cell] ? 0.3 : 0.42);
      if (wv > 0.5) { kind[p] = 1; continue; }
      kind[p] = 2;
      const warp = grid.built[cell] ? 0.9 : 1.9;
      const sx = Math.floor(wx + warpX(X, Y) * warp), sy = Math.floor(wy + warpY(X, Y) * warp);
      let t = sx < 0 || sy < 0 || sx >= W || sy >= H ? TI.void : T[sy * W + sx];
      if (t === TI.sea || t === TI.shallow || t === TI.void) {
        const own = T[cell];
        t = grid.river[cell] ? bank[cell] : own === TI.sea || own === TI.shallow ? TI.sand : own === TI.void ? TI.mountain : own;
      }
      if (t === TI.road || t === TI.building) t = TI.grass;
      land[p] = t;
    }
    if ((Y & 63) === 63) yield 0.08 + 0.3 * (Y / SH);
  }

  // Distance from the shore, for the ripple lines and the deepening sea (chamfer 3-4, in thirds of a pixel).
  const dist = new Float32Array(NP);
  for (let p = 0; p < NP; p++) dist[p] = kind[p] === 1 ? 1e6 : 0;
  for (let j = 0; j < SH; j++) for (let i = 0; i < SW; i++) {
    const p = j * SW + i;
    if (!dist[p]) continue;
    let d = dist[p];
    if (i > 0) d = Math.min(d, dist[p - 1] + 3);
    if (j > 0) { d = Math.min(d, dist[p - SW] + 3); if (i > 0) d = Math.min(d, dist[p - SW - 1] + 4); if (i < SW - 1) d = Math.min(d, dist[p - SW + 1] + 4); }
    dist[p] = d;
  }
  for (let j = SH - 1; j >= 0; j--) for (let i = SW - 1; i >= 0; i--) {
    const p = j * SW + i;
    if (!dist[p]) continue;
    let d = dist[p];
    if (i < SW - 1) d = Math.min(d, dist[p + 1] + 3);
    if (j < SH - 1) { d = Math.min(d, dist[p + SW] + 3); if (i < SW - 1) d = Math.min(d, dist[p + SW + 1] + 4); if (i > 0) d = Math.min(d, dist[p + SW - 1] + 4); }
    dist[p] = d;
  }
  yield 0.45;

  const img = ctx.createImageData(SW, SH);
  const out = img.data;
  for (let Y = 0; Y < SH; Y++) {
    for (let X = 0; X < SW; X++) {
      const p = Y * SW + X;
      const k = kind[p];
      let r: number, g: number, b: number;
      if (k === 1) {
        const d = dist[p] / 3;
        const s = smooth(1, 26, d);
        r = SHALLOW[0] + (DEEP[0] - SHALLOW[0]) * s; g = SHALLOW[1] + (DEEP[1] - SHALLOW[1]) * s; b = SHALLOW[2] + (DEEP[2] - SHALLOW[2]) * s;
        const streak = 1 + streakN(X, Y) * 0.08;
        r *= streak; g *= streak; b *= streak;
        const foam = Math.abs(d - 2.4) < 0.5 ? 0.42 : Math.abs(d - 4.8) < 0.45 ? 0.26 : Math.abs(d - 7.6) < 0.45 ? 0.13 : 0;
        if (foam) { r += (FOAM[0] - r) * foam; g += (FOAM[1] - g) * foam; b += (FOAM[2] - b) * foam; }
      } else if (k === 2) {
        const t = land[p];
        const wx = wxOf(X), wy = wyOf(Y);
        if (t === TI.grass || t === TI.woods) { tintAt(wx, wy, tc); r = tc[0]; g = tc[1]; b = tc[2]; }
        else if (t === TI.farm) {
          // A patchwork of fields, turned a little this way and that, with hedges between most of them.
          const a = fieldAng(X, Y), ca = Math.cos(a), sa = Math.sin(a);
          const u = (wx * ca + wy * sa) / 2.4, fu = Math.floor(u), stag = lattice(fu, 0, 91) * 0.7;
          const v = (wy * ca - wx * sa) / 1.7 + stag, fv = Math.floor(v);
          const c = FIELDS[Math.floor(lattice(fu, fv, 93) * FIELDS.length)];
          const hedge = (u - fu < 0.09 || v - fv < 0.12) && lattice(fu, fv, 97) < 0.8;
          const hc = hedge ? HEDGE : c;
          r = hc[0]; g = hc[1]; b = hc[2];
        } else if (t === TI.salt) {
          const u = wx / 1.6, v = wy / 1.25, fu = Math.floor(u), fv = Math.floor(v);
          const c = u - fu < 0.12 || v - fv < 0.14 ? [170, 160, 150] : PANS[Math.floor(lattice(fu, fv, 95) * PANS.length)];
          r = c[0]; g = c[1]; b = c[2];
        } else if (t === TI.vines) {
          // Terraces of vines across the slope, each a row of green dots on warm soil.
          const v = (wy + wx * 0.35) / 1.15, dv = v - Math.floor(v);
          const u = (wx - wy * 0.35) / 0.5, du = u - Math.floor(u);
          const c = dv < 0.36 ? (du < 0.6 ? [92, 122, 60] : [160, 128, 90]) : dv < 0.46 ? [150, 118, 84] : [184, 154, 108];
          r = c[0]; g = c[1]; b = c[2];
        } else { const c = WASH_BY[t]; r = c[0]; g = c[1]; b = c[2]; }
        const m = 1 + mottle(X, Y) * 0.13;
        r *= m; g *= m; b *= m;
        if (t === TI.ash && lattice(X, Y, 61) < 0.1) { r *= 0.8; g *= 0.8; b *= 0.8; }
        else if (t === TI.glass && lattice(X, Y, 62) < 0.03) { r = 250; g = 255; b = 255; }
        else if (t === TI.lava) { const hot = noise(wx * 1.3, wy * 1.3, 71); if (hot > 0.55) { const h = Math.min(1, (hot - 0.55) * 2.4); r += (255 - r) * h; g += (176 - g) * h; b += (64 - b) * h; } }
        else if (t === TI.chasm && lattice(X, Y, 63) < 0.04) { r = 196; g = 150; b = 240; }
        // Where two washes meet the pigment pools a little darker; the shore is inked.
        let shore = false, seam = false, cloth = false;
        if (X > 0 && X < SW - 1 && Y > 0 && Y < SH - 1) {
          const a = kind[p - 1], b = kind[p + 1], c = kind[p - SW], e = kind[p + SW];
          shore = a === 1 || b === 1 || c === 1 || e === 1;
          cloth = a === 0 || b === 0 || c === 0 || e === 0;
          seam = (a === 2 && land[p - 1] !== t) || (b === 2 && land[p + 1] !== t) || (c === 2 && land[p - SW] !== t) || (e === 2 && land[p + SW] !== t);
        }
        if (shore) { r = COAST[0]; g = COAST[1]; b = COAST[2]; }
        else {
          if (seam && t !== TI.farm && t !== TI.salt && t !== TI.vines) { r *= 0.92; g *= 0.92; b *= 0.9; }
          if (cloth) { r += (PAPER[0] - r) * 0.35; g += (PAPER[1] - g) * 0.35; b += (PAPER[2] - b) * 0.35; }
        }
      } else { r = PAPER[0]; g = PAPER[1]; b = PAPER[2]; }
      const f = paper[p];
      out[p * 4] = r * f; out[p * 4 + 1] = g * f; out[p * 4 + 2] = b * f; out[p * 4 + 3] = 255;
    }
    if ((Y & 63) === 63) yield 0.45 + 0.25 * (Y / SH);
  }
  ctx.putImageData(img, 0, 0);
}

// ---------------------------------------------------------------- scattering

/**
 * Points for glyphs over the cells that match, at least `gap` cells apart (a greedy dart throw in a
 * stable order), jittered inside their cells. Built cells may take a tighter gap, so a map's own
 * copse keeps one tree per tree. Roads through planned country are left clear.
 */
function scatter(grid: WorldGrid, match: (t: number) => boolean, gap: number, seed: number, builtGap = gap): { x: number; y: number; r: number }[] {
  const W = grid.width;
  const cand: number[] = [];
  for (let i = 0; i < grid.terrain.length; i++) if (match(grid.terrain[i]) && !grid.road[i]) cand.push(i);
  const key = new Float32Array(grid.terrain.length);
  for (const i of cand) key[i] = lattice(i, 7, seed);
  cand.sort((a, b) => key[a] - key[b]);
  const out: { x: number; y: number; r: number }[] = [];
  const buckets = new Map<number, number[]>();
  const bk = (bx: number, by: number): number => by * 4096 + bx;
  for (const i of cand) {
    const x = (i % W) + 0.2 + lattice(i, 1, seed) * 0.6, y = Math.floor(i / W) + 0.2 + lattice(i, 2, seed) * 0.6;
    const g = grid.built[i] ? builtGap : gap;
    const bx = Math.floor(x / 2), by = Math.floor(y / 2);
    let ok = true;
    for (let dy = -2; dy <= 2 && ok; dy++) for (let dx = -2; dx <= 2 && ok; dx++) {
      for (const o of buckets.get(bk(bx + dx, by + dy)) ?? []) { const q = out[o]; if ((q.x - x) ** 2 + (q.y - y) ** 2 < g * g) { ok = false; break; } }
    }
    if (!ok) continue;
    const k = bk(bx, by);
    let list = buckets.get(k);
    if (!list) { list = []; buckets.set(k, list); }
    list.push(out.length);
    out.push({ x, y, r: lattice(i, 3, seed) });
  }
  return out;
}

/** How many cells a mountain cell is from the nearest cell that is not mountain (bigger peaks inside a range). */
function rangeDepth(grid: WorldGrid, x: number, y: number): number {
  const high = (t: number): boolean => t === TI.mountain || t === TI.peak || t === TI.void;
  for (let r = 1; r <= 4; r++) {
    for (let d = -r; d <= r; d++) {
      if (!high(grid.t(x + d, y - r)) || !high(grid.t(x + d, y + r)) || !high(grid.t(x - r, y + d)) || !high(grid.t(x + r, y + d))) return r;
    }
  }
  return 5;
}

// ---------------------------------------------------------------- glyphs

interface Glyph { y: number; draw(ctx: CanvasRenderingContext2D): void }

function poly(ctx: CanvasRenderingContext2D, pts: readonly number[], fill: string | null, stroke?: string): void {
  ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
}

/** A peak in the old manner: a lit west face, a hatched east face, inked ridges, snow on the high ones. */
function peak(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, lean: number, kind: 'rock' | 'snow' | 'rim'): void {
  const ax = x + lean * w * 0.2, ay = y - h;
  const mx = ax + w * 0.06;
  const lit = kind === 'snow' ? '#f4f3ec' : kind === 'rim' ? '#b9aa90' : '#d6c5a2';
  const dark = kind === 'snow' ? '#a6b4c4' : kind === 'rim' ? '#7a6a56' : '#9a8464';
  // A shoulder on the shaded side breaks up the triangle.
  const sx = ax + (x + w / 2 - ax) * 0.55, sy = ay + h * 0.38;
  poly(ctx, [x - w / 2, y, ax, ay, mx, y], lit);
  poly(ctx, [mx, y, ax, ay, sx, sy, x + w / 2, y], dark);
  ctx.strokeStyle = rgba(INK, 0.45); ctx.lineWidth = 1;
  for (let k = 1; k <= 3; k++) {
    const t = k / 4, hx = ax + (sx - ax) * t + (x + w / 2 - sx) * t * t * 0.6, hy = ay + (y - ay) * t * 0.85;
    ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx - w * 0.1, Math.min(y, hy + h * 0.3)); ctx.stroke();
  }
  if (kind !== 'rock' && h > 5) {
    const s = kind === 'snow' ? 0.46 : 0.26;
    poly(ctx, [ax - (ax - (x - w / 2)) * s, ay + h * s, ax, ay, ax + (sx - ax) * s * 1.6, ay + h * s * 0.9, ax + w * 0.04, ay + h * s * 0.7], kind === 'snow' ? '#ffffff' : '#e8e2d4');
  }
  ctx.strokeStyle = INK; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(ax, ay); ctx.lineTo(sx, sy); ctx.lineTo(x + w / 2, y); ctx.stroke();
}

function tree(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, tone: number): void {
  ctx.fillStyle = '#5a4028'; ctx.fillRect(Math.round(x), Math.round(y - 1), 1, 2);
  const cy = y - r - 0.6;
  const base = tone > 0.66 ? '#4c7031' : tone > 0.33 ? '#577c37' : '#5f853b';
  ctx.fillStyle = '#2e3d1e'; ctx.beginPath(); ctx.arc(x + 0.5, cy + 0.5, r + 0.6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = base; ctx.beginPath(); ctx.arc(x, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#80a757'; ctx.beginPath(); ctx.arc(x - r * 0.35, cy - r * 0.35, r * 0.5, 0, Math.PI * 2); ctx.fill();
}

function pine(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, frost: boolean): void {
  ctx.fillStyle = '#4a3624'; ctx.fillRect(Math.round(x), Math.round(y - 1), 1, 2);
  poly(ctx, [x - h * 0.34, y - 0.5, x, y - h, x + h * 0.34, y - 0.5], '#3f6446', '#23321f');
  poly(ctx, [x - h * 0.3, y - 1, x, y - h + 0.5, x, y - 1], frost ? '#b8d0c4' : '#5f8a5c');
}

function deadTree(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, lean: number): void {
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#4a4038';
  ctx.beginPath();
  ctx.moveTo(x, y); ctx.lineTo(x + lean, y - h);
  ctx.moveTo(x + lean * 0.45, y - h * 0.5); ctx.lineTo(x + lean * 0.45 - 2, y - h * 0.78);
  ctx.moveTo(x + lean * 0.7, y - h * 0.68); ctx.lineTo(x + lean * 0.7 + 2, y - h * 0.95);
  ctx.stroke();
}

function crystal(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  glow(ctx, x, y - h * 0.5, h * 1.2, '#c890ff', 0.3);
  for (const [dx, k, lean] of [[-1.8, 0.65, -0.3], [0, 1, 0.05], [1.8, 0.55, 0.35]]) {
    const hh = h * k, bx = x + dx, tx = bx + lean * hh;
    poly(ctx, [bx - 1.2, y, tx, y - hh, bx + 1.2, y], '#8a5ac8', '#2a1a3a');
    poly(ctx, [bx - 0.9, y - 0.6, tx, y - hh + 1, bx, y - 0.6], '#e2c8ff');
  }
}

function hill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, heath: boolean): void {
  ctx.beginPath(); ctx.ellipse(x, y, w / 2, h, 0, Math.PI, 0); ctx.closePath();
  ctx.fillStyle = heath ? '#b8969a' : '#d6bf88'; ctx.fill();
  ctx.save(); ctx.clip();
  ctx.fillStyle = heath ? '#8a6a72' : '#a88c5a'; ctx.fillRect(x + w * 0.05, y - h, w / 2, h);
  ctx.restore();
  ctx.strokeStyle = INK; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(x, y, w / 2, h, 0, Math.PI, 0); ctx.stroke();
}

function tuft(ctx: CanvasRenderingContext2D, x: number, y: number, color = '#56603a'): void {
  ctx.strokeStyle = color; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - 2, y + 0.5); ctx.lineTo(x + 2, y + 0.5);
  ctx.moveTo(x - 1.2, y); ctx.lineTo(x - 1.6, y - 1.6);
  ctx.moveTo(x, y); ctx.lineTo(x, y - 2.4);
  ctx.moveTo(x + 1.2, y); ctx.lineTo(x + 1.6, y - 1.6);
  ctx.stroke();
}

function heath(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  const X = Math.round(x), Y = Math.round(y);
  ctx.fillStyle = '#6e3e6c'; ctx.fillRect(X - 2, Y, 1, 1); ctx.fillRect(X + 1, Y - 1, 1, 1); ctx.fillRect(X + 2, Y + 1, 1, 1);
  ctx.fillStyle = '#b87cb4'; ctx.fillRect(X, Y - 1, 1, 1); ctx.fillRect(X - 1, Y, 1, 1);
  ctx.fillStyle = '#4e5a32'; ctx.fillRect(X, Y + 1, 1, 1);
}

function boulder(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, dark = false): void {
  ctx.fillStyle = dark ? '#2e2a28' : '#6a5a48'; ctx.beginPath(); ctx.ellipse(x + 0.4, y + 0.3, r + 0.5, r * 0.8 + 0.4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = dark ? '#5a524c' : '#b3a186'; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = dark ? '#8a8078' : '#d8ccb4'; ctx.fillRect(Math.round(x - r * 0.5), Math.round(y - r * 0.5), 1, 1);
}

function dune(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#b08c48'; ctx.beginPath(); ctx.moveTo(x - w / 2, y + 1); ctx.quadraticCurveTo(x - w * 0.1, y - w * 0.3, x + w / 2, y + 1.5); ctx.stroke();
  ctx.strokeStyle = '#fff4d0'; ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.quadraticCurveTo(x - w * 0.2, y - w * 0.3, x + w * 0.1, y - w * 0.12); ctx.stroke();
}

function sparkle(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  const X = Math.round(x), Y = Math.round(y);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(X, Y - 2, 1, 5); ctx.fillRect(X - 2, Y, 5, 1);
  ctx.fillStyle = '#7ad0dc'; ctx.fillRect(X + 1, Y + 1, 1, 1); ctx.fillRect(X - 1, Y - 1, 1, 1);
}

function crack(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, r: number): void {
  ctx.strokeStyle = '#8eb0c6'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w * 0.1, y - 1.5 + r * 3); ctx.lineTo(x + w * 0.2, y - 0.5); ctx.lineTo(x + w / 2, y + 1); ctx.stroke();
}


/** A splinter of the rift: dark, lit violet from inside. */
function riftShard(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  glow(ctx, x, y, 5, '#b070ff', 0.22);
  poly(ctx, [x - 2 - r, y - 0.5, x - 0.5, y - 2.5, x + 2 + r, y + 0.8, x + 0.4, y + 2], '#140a1e', '#7a48b8');
}

/** A farmstead among the fields. */
function cottage(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  box(ctx, x - 2, y - 2, 4, 2, '#e4d6b4');
  roof(ctx, x - 2.5, y - 2, 5, 2.5, '#a8392a');
}

/** Every terrain glyph on the map, drawn back to front so nearer peaks and trees overlap farther ones. */
function* paintGlyphs(ctx: CanvasRenderingContext2D, grid: WorldGrid): Generator<number, void> {
  const glyphs: Glyph[] = [];
  const add = (y: number, draw: (c: CanvasRenderingContext2D) => void): void => { glyphs.push({ y, draw }); };
  const one = (k: number) => (t: number): boolean => t === k;
  for (const m of scatter(grid, (t) => t === TI.mountain || t === TI.peak, 2.0, 11, 1.4)) {
    const cx = Math.floor(m.x), cy = Math.floor(m.y);
    const t = grid.t(cx, cy);
    const deep = rangeDepth(grid, cx, cy);
    const nearCloth = [[-3, 0], [3, 0], [0, -3], [0, 3]].some(([dx, dy]) => grid.t(cx + dx, cy + dy) === TI.void);
    const big = 0.72 + Math.min(deep, 4) * 0.16 + m.r * 0.34;
    const kind = t === TI.peak ? 'snow' : nearCloth ? 'rim' : 'rock';
    add(py(m.y), (c) => peak(c, px(m.x), py(m.y), S * 2.6 * big, S * 2.25 * big, m.r - 0.5, kind));
  }
  yield 0.72;
  for (const f of scatter(grid, one(TI.forest), 0.95, 12, 0.9)) add(py(f.y), (c) => tree(c, px(f.x), py(f.y), S * 0.62 + f.r * 0.5, f.r));
  for (const f of scatter(grid, one(TI.woods), 2.1, 29, 1.6)) add(py(f.y), (c) => tree(c, px(f.x), py(f.y), S * 0.55 + f.r * 0.6, f.r));
  for (const f of scatter(grid, one(TI.pine), 0.95, 13)) add(py(f.y), (c) => pine(c, px(f.x), py(f.y), S * 1.7 + f.r * 2, grid.t(Math.floor(f.x), Math.floor(f.y) + 1) === TI.snow || f.r > 0.85));
  for (const f of scatter(grid, one(TI.deadwood), 1.2, 18)) add(py(f.y), (c) => deadTree(c, px(f.x), py(f.y), S * 1.5 + f.r * 3, (f.r - 0.5) * 3));
  for (const f of scatter(grid, one(TI.crystal), 1.7, 19)) add(py(f.y), (c) => crystal(c, px(f.x), py(f.y), S * 1.2 + f.r * 3));
  for (const f of scatter(grid, one(TI.hills), 2.4, 14)) add(py(f.y), (c) => hill(c, px(f.x), py(f.y), S * 2.4 + f.r * 3, S * 0.9 + f.r * 1.4, false));
  for (const f of scatter(grid, one(TI.heather), 1.5, 20)) {
    if (f.r > 0.9) add(py(f.y), (c) => hill(c, px(f.x), py(f.y), S * 2.3, S * 0.75, true));
    else add(py(f.y), (c) => heath(c, px(f.x), py(f.y)));
  }
  for (const f of scatter(grid, one(TI.marsh), 1.5, 15)) add(py(f.y), (c) => tuft(c, px(f.x), py(f.y)));
  for (const f of scatter(grid, one(TI.steppe), 2.3, 25)) add(py(f.y), (c) => tuft(c, px(f.x), py(f.y), '#a08850'));
  for (const f of scatter(grid, one(TI.rock), 1.3, 16)) add(py(f.y), (c) => boulder(c, px(f.x), py(f.y), 0.8 + f.r * 1.1, false));
  for (const f of scatter(grid, one(TI.ash), 3.2, 21)) if (f.r > 0.55) add(py(f.y), (c) => boulder(c, px(f.x), py(f.y), 0.8 + f.r, true));
  for (const f of scatter(grid, one(TI.dunes), 2.6, 22)) add(py(f.y), (c) => dune(c, px(f.x), py(f.y), S * 2.4 + f.r * 4));
  for (const f of scatter(grid, one(TI.glass), 2.3, 23)) add(py(f.y), (c) => sparkle(c, px(f.x), py(f.y)));
  for (const f of scatter(grid, one(TI.ice), 2.2, 24)) add(py(f.y), (c) => crack(c, px(f.x), py(f.y), S * 1.8, f.r));
  for (const f of scatter(grid, one(TI.chasm), 1.1, 27)) add(py(f.y), (c) => riftShard(c, px(f.x), py(f.y), f.r));
  for (const f of scatter(grid, one(TI.farm), 7, 28)) if (f.r > 0.4) add(py(f.y), (c) => cottage(c, px(f.x), py(f.y)));
  yield 0.76;
  glyphs.sort((a, b) => a.y - b.y);
  for (let k = 0; k < glyphs.length; k++) {
    glyphs[k].draw(ctx);
    if ((k & 2047) === 2047) yield 0.76 + 0.1 * (k / glyphs.length);
  }
}

// ---------------------------------------------------------------- rivers and roads

/** A river's stroke width in cloth pixels. */
const riverPx = (w: number): number => Math.max(2, w * S * 0.72);

/**
 * The rivers, inked banks and a pale water line, thickening towards the mouth. Only the stretches
 * over land are drawn: where a river runs through a lake or into the sea, the water is the wash's.
 */
function paintRivers(ctx: CanvasRenderingContext2D, grid: WorldGrid): void {
  const runs: { pts: Pt[]; w: number }[] = [];
  for (const c of grid.courses) {
    let run: Pt[] = [], ws: number[] = [];
    const flush = (): void => {
      // Pieces of steady width, so the stroke can thicken along its length.
      for (let k = 0; k < run.length - 1; k += 16) runs.push({ pts: run.slice(k, Math.min(run.length, k + 17)), w: ws[Math.min(ws.length - 1, k + 8)] });
      run = []; ws = [];
    };
    c.pts.forEach((p, k) => {
      const x = Math.floor(p[0]), y = Math.floor(p[1]), t = grid.t(x, y), i = y * grid.width + x;
      const land = !(t === TI.sea || t === TI.shallow || t === TI.void) || grid.river[i] === 1;
      if (land) { run.push(p); ws.push(c.width[k]); } else { if (run.length) { run.push(p); ws.push(c.width[k]); } flush(); }
    });
    flush();
  }
  const stroke = (pts: Pt[], lw: number, color: string): void => {
    ctx.beginPath(); ctx.moveTo(px(pts[0][0]), py(pts[0][1]));
    for (let k = 1; k < pts.length; k++) ctx.lineTo(px(pts[k][0]), py(pts[k][1]));
    ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.stroke();
  };
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const r of runs) stroke(r.pts, riverPx(r.w) + 2, rgba(INK, 0.8));
  for (const r of runs) stroke(r.pts, riverPx(r.w), '#8ec0cc');
  for (const r of runs) if (riverPx(r.w) >= 4) stroke(r.pts, 1, 'rgba(236,246,244,0.55)');
  ctx.restore();
}

/**
 * The escarpments, drawn from their lines the way a surveyor draws a cliff: an inked lip with a
 * lit edge, and hachures down the face, which is on the right of the way the line runs.
 */
function paintCliffs(ctx: CanvasRenderingContext2D): void {
  ctx.save();
  ctx.lineCap = 'round';
  for (const rg of ATLAS.ridges) {
    if (rg.kind !== 'cliff') continue;
    const line = spline(rg.pts, false, 8);
    const pts: { x: number; y: number; nx: number; ny: number }[] = [];
    for (let k = 1; k < line.length; k++) {
      const [x0, y0] = line[k - 1], [x1, y1] = line[k], len = Math.hypot(x1 - x0, y1 - y0);
      if (!len) continue;
      const n = Math.max(1, Math.round(len / 0.55));
      for (let j = 0; j < n; j++) pts.push({ x: px(x0 + ((x1 - x0) * j) / n), y: py(y0 + ((y1 - y0) * j) / n), nx: -(y1 - y0) / len, ny: (x1 - x0) / len });
    }
    // The face: hachures of uneven length, shaded, then the lip over them.
    ctx.strokeStyle = rgba(INK, 0.75); ctx.lineWidth = 1;
    ctx.beginPath();
    pts.forEach((p, k) => {
      const l = S * (1.1 + ((k * 7) % 5) * 0.28) * (rg.width / 2.2);
      ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + p.nx * l + p.ny * 0.8, p.y + p.ny * l - p.nx * 0.8);
    });
    ctx.stroke();
    const lip = (dx: number, dy: number, color: string, w: number): void => {
      ctx.strokeStyle = color; ctx.lineWidth = w;
      ctx.beginPath(); pts.forEach((p, k) => (k ? ctx.lineTo(p.x + dx * p.nx, p.y + dy * p.ny) : ctx.moveTo(p.x + dx * p.nx, p.y + dy * p.ny))); ctx.stroke();
    };
    lip(-1.2, -1.2, '#eee0bc', 1);
    lip(0, 0, INK, 1.4);
  }
  ctx.restore();
}

/** A plank bridge centred on (x, y), laid along `ang`, `len` pixels long. */
function bridge(ctx: CanvasRenderingContext2D, x: number, y: number, ang: number, len: number): void {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y)); ctx.rotate(ang);
  ctx.fillStyle = INK; ctx.fillRect(-len / 2 - 1, -2.5, len + 2, 5);
  ctx.fillStyle = '#b08a58'; ctx.fillRect(-len / 2, -1.5, len, 3);
  ctx.fillStyle = '#7a5a34'; for (let k = -len / 2 + 1.5; k < len / 2; k += 2) ctx.fillRect(k, -1.5, 0.6, 3);
  ctx.restore();
}

/** The built maps' roads cell to cell, and the planned roads as surveyed curves, dotted; bridges where they cross water. */
function paintRoads(ctx: CanvasRenderingContext2D, grid: WorldGrid): void {
  const W = grid.width, H = grid.height;
  const road = (x: number, y: number): boolean => grid.t(x, y) === TI.road && grid.built[y * W + x] === 1;
  const wet = (x: number, y: number): boolean => { const t = grid.t(x, y); return t === TI.sea || t === TI.shallow; };
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const path = new Path2D();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!road(x, y)) continue;
    if (road(x + 1, y)) { path.moveTo(px(x + 0.5), py(y + 0.5)); path.lineTo(px(x + 1.5), py(y + 0.5)); }
    if (road(x, y + 1)) { path.moveTo(px(x + 0.5), py(y + 0.5)); path.lineTo(px(x + 0.5), py(y + 1.5)); }
  }
  for (const t of grid.trails) {
    path.moveTo(px(t[0][0]), py(t[0][1]));
    for (let i = 1; i < t.length; i++) path.lineTo(px(t[i][0]), py(t[i][1]));
  }
  ctx.strokeStyle = rgba('#fff4d8', 0.55); ctx.lineWidth = 2.4; ctx.stroke(path);
  ctx.strokeStyle = '#7a5530'; ctx.lineWidth = 1; ctx.setLineDash([2.5, 1.6]); ctx.stroke(path);
  ctx.setLineDash([]);
  // The built maps' bridges: a road cell with water either side.
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!road(x, y)) continue;
    const across = wet(x, y - 1) && wet(x, y + 1), along = wet(x - 1, y) && wet(x + 1, y);
    if (across) bridge(ctx, px(x + 0.5), py(y + 0.5), Math.PI / 2, S * 2 + 2);
    else if (along) bridge(ctx, px(x + 0.5), py(y + 0.5), 0, S * 2 + 2);
  }
  // The planned roads' bridges: wherever a road's line runs over a river.
  for (const t of grid.trails) {
    let start = -1;
    const steps: Pt[] = [];
    for (let k = 1; k < t.length; k++) {
      const [x0, y0] = t[k - 1], [x1, y1] = t[k], n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 0.3));
      for (let j = 0; j < n; j++) steps.push([x0 + ((x1 - x0) * j) / n, y0 + ((y1 - y0) * j) / n]);
    }
    steps.forEach((p, k) => {
      const i = Math.floor(p[1]) * W + Math.floor(p[0]);
      const over = grid.river[i] === 1;
      if (over && start < 0) start = k;
      if (!over && start >= 0) {
        const a = steps[Math.max(0, start - 1)], b = steps[k], mid = steps[(start + k) >> 1];
        bridge(ctx, px(mid[0]), py(mid[1]), Math.atan2(b[1] - a[1], b[0] - a[0]), Math.hypot(b[0] - a[0], b[1] - a[1]) * S + 4);
        start = -1;
      }
    });
  }
  ctx.restore();
}

// ---------------------------------------------------------------- sites

const r = Math.round;
/** A filled, ink-outlined rectangle on whole pixels. */
function box(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill: string): void {
  ctx.fillStyle = INK; ctx.fillRect(r(x) - 1, r(y) - 1, w + 2, h + 2);
  ctx.fillStyle = fill; ctx.fillRect(r(x), r(y), w, h);
}
function roof(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill: string): void {
  poly(ctx, [r(x) - 0.5, r(y) + 0.5, r(x) + w / 2, r(y) - h, r(x) + w + 0.5, r(y) + 0.5], fill, INK);
}
function flag(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
  ctx.fillStyle = INK; ctx.fillRect(r(x), r(y) - 5, 1, 5);
  ctx.fillStyle = color; ctx.fillRect(r(x) + 1, r(y) - 5, 3, 2);
}
function glow(ctx: CanvasRenderingContext2D, x: number, y: number, rad: number, color: string, a: number): void {
  const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
  g.addColorStop(0, rgba(color, a)); g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
}
function smoke(ctx: CanvasRenderingContext2D, x: number, y: number, n: number, grow: number): void {
  ctx.fillStyle = rgba('#5a524c', 0.5);
  for (let i = 0; i < n; i++) { ctx.beginPath(); ctx.arc(x + i * 1.6, y - i * 3.2, 1.6 + i * grow, 0, Math.PI * 2); ctx.fill(); }
}
function anchor(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.strokeStyle = INK; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(x, y - 3, 3, 0.15 * Math.PI, 0.85 * Math.PI); ctx.moveTo(x, y - 9); ctx.lineTo(x, y); ctx.moveTo(x - 2.5, y - 7); ctx.lineTo(x + 2.5, y - 7); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y - 9.5, 1.2, 0, Math.PI * 2); ctx.stroke();
}

const STONE = '#ddd2b8', STONE_D = '#a8997c', RED = '#a8392a', GREEN = '#3f7a3a', WOOD = '#8a6038';

/** The icon for a site, standing on (x, y). */
function drawSite(ctx: CanvasRenderingContext2D, icon: AtlasSite['icon'], x: number, y: number): void {
  switch (icon) {
    case 'city': {
      box(ctx, x - 9, y - 5, 18, 5, STONE);
      for (let i = 0; i < 9; i++) { ctx.fillStyle = INK; ctx.fillRect(r(x - 9) + i * 2, r(y - 7), 1, 1); ctx.fillStyle = STONE; ctx.fillRect(r(x - 9) + i * 2, r(y - 6), 1, 1); }
      box(ctx, x - 10, y - 10, 4, 10, STONE_D); roof(ctx, x - 10.5, y - 10, 5, 4, RED);
      box(ctx, x + 6, y - 10, 4, 10, STONE_D); roof(ctx, x + 5.5, y - 10, 5, 4, RED);
      box(ctx, x - 3, y - 12, 6, 12, STONE); roof(ctx, x - 3.5, y - 12, 7, 5, RED); flag(ctx, x, y - 17, RED);
      ctx.fillStyle = INK; ctx.fillRect(r(x - 1), r(y - 3), 2, 3);
      return;
    }
    case 'port': {
      // A walled harbour town: towers, a quay running out into the water, a moored ship.
      box(ctx, x - 8, y - 5, 16, 5, STONE);
      box(ctx, x - 9, y - 10, 4, 10, STONE_D); roof(ctx, x - 9.5, y - 10, 5, 4, RED);
      box(ctx, x - 2, y - 11, 5, 11, STONE); roof(ctx, x - 2.5, y - 11, 6, 5, RED); flag(ctx, x, y - 16, RED);
      box(ctx, x + 4, y - 8, 4, 8, STONE_D); roof(ctx, x + 3.5, y - 8, 5, 3, '#6a4a3a');
      box(ctx, x + 8, y - 1, 9, 2, WOOD);
      ctx.fillStyle = INK; ctx.fillRect(r(x + 14), r(y - 10), 1, 9);
      poly(ctx, [x + 15, y - 9, x + 19, y - 5, x + 15, y - 4], '#f2ead6', INK);
      return;
    }
    case 'town': {
      box(ctx, x - 7, y - 4, 14, 4, STONE);
      box(ctx, x - 6, y - 9, 5, 5, '#d8c49a'); roof(ctx, x - 6.5, y - 9, 6, 4, RED);
      box(ctx, x + 1, y - 11, 4, 7, STONE_D); roof(ctx, x + 0.5, y - 11, 5, 4, RED); flag(ctx, x + 3, y - 15, RED);
      return;
    }
    case 'village': {
      for (const [dx, dy, c] of [[-6, 0, RED], [0, -3, '#6a4a3a'], [5, 1, RED]] as const) { box(ctx, x + dx - 2, y + dy - 3, 4, 3, '#e0d0ac'); roof(ctx, x + dx - 2.5, y + dy - 3, 5, 3, c); }
      return;
    }
    case 'hold': {
      ctx.fillStyle = '#2e3d1e'; ctx.beginPath(); ctx.arc(x + 0.5, y - 12, 7.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#4f7a36'; ctx.beginPath(); ctx.arc(x, y - 12.5, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#79a552'; ctx.beginPath(); ctx.arc(x - 2.5, y - 15, 3, 0, Math.PI * 2); ctx.fill();
      box(ctx, x - 1, y - 7, 2, 7, WOOD);
      box(ctx, x - 7, y - 4, 5, 4, '#c8a878'); roof(ctx, x - 7.5, y - 4, 6, 3, GREEN);
      box(ctx, x + 2, y - 4, 5, 4, '#c8a878'); roof(ctx, x + 1.5, y - 4, 6, 3, GREEN);
      flag(ctx, x + 6, y - 7, GREEN);
      return;
    }
    case 'farm': {
      ctx.strokeStyle = '#8a7040'; ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x + 2, y - 1 - i * 1.6); ctx.lineTo(x + 9, y - 1 - i * 1.6); ctx.stroke(); }
      box(ctx, x - 6, y - 4, 6, 4, '#d8c49a'); roof(ctx, x - 6.5, y - 4, 7, 4, RED);
      box(ctx, x - 1, y - 3, 3, 3, WOOD);
      return;
    }
    case 'cave': case 'mine': {
      ctx.beginPath(); ctx.ellipse(x, y, 7, 6, 0, Math.PI, 0); ctx.closePath();
      ctx.fillStyle = icon === 'mine' ? '#b89868' : '#9a8a72'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = '#16100c'; ctx.beginPath(); ctx.ellipse(x, y, 2.6, 3.4, 0, Math.PI, 0); ctx.closePath(); ctx.fill();
      if (icon === 'mine') { ctx.fillStyle = WOOD; ctx.fillRect(r(x - 3), r(y - 4), 1, 4); ctx.fillRect(r(x + 2), r(y - 4), 1, 4); ctx.fillRect(r(x - 3), r(y - 4), 6, 1); }
      return;
    }
    case 'tower': {
      box(ctx, x - 2, y - 11, 5, 11, STONE_D);
      ctx.fillStyle = '#e8dcc0'; ctx.fillRect(r(x + 1), r(y - 11), 2, 3); ctx.fillRect(r(x - 2), r(y - 11), 1, 1);
      ctx.fillStyle = INK; ctx.fillRect(r(x), r(y - 6), 1, 2);
      return;
    }
    case 'lighthouse': {
      glow(ctx, x + 0.5, y - 13, 9, '#ffe8a0', 0.6);
      poly(ctx, [x - 3, y, x - 2, y - 11, x + 3, y - 11, x + 4, y], '#f0e8dc', INK);
      ctx.fillStyle = RED; ctx.fillRect(r(x - 2), r(y - 8), 5, 2); ctx.fillRect(r(x - 2), r(y - 4), 6, 2);
      box(ctx, x - 1, y - 14, 3, 3, '#ffe08a'); roof(ctx, x - 1.5, y - 14, 4, 2, INK);
      return;
    }
    case 'barrow': {
      ctx.beginPath(); ctx.ellipse(x, y, 7, 4.5, 0, Math.PI, 0); ctx.closePath();
      ctx.fillStyle = '#8c9a5c'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = '#16100c'; ctx.fillRect(r(x - 1), r(y - 3), 3, 3);
      box(ctx, x + 4, y - 7, 1, 4, STONE_D);
      return;
    }
    case 'grove': {
      glow(ctx, x, y - 4, 9, '#d8f0a0', 0.5);
      for (const [dx, dy] of [[-6, 0], [6, 0], [-4, -4], [4, -4], [0, -6]]) tree(ctx, x + dx, y + dy, 2.6, 0.8);
      box(ctx, x - 1, y - 5, 2, 5, '#c8c0b0');
      return;
    }
    case 'stone': {
      glow(ctx, x, y - 3, 6, '#9ad0ff', 0.55);
      box(ctx, x - 1, y - 6, 3, 6, '#cfc8bc');
      ctx.fillStyle = '#5a86b8'; ctx.fillRect(r(x), r(y - 5), 1, 2);
      return;
    }
    case 'hearth': {
      box(ctx, x - 4, y - 5, 8, 5, '#efe6d0');
      ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(x, y - 5, 4.5, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#f4ecd6'; ctx.beginPath(); ctx.arc(x, y - 5, 3.5, Math.PI, 0); ctx.fill();
      for (const cx of [-3, -1, 1, 3]) { ctx.fillStyle = INK; ctx.fillRect(r(x + cx), r(y - 4), 1, 4); }
      return;
    }
    case 'monastery': {
      box(ctx, x - 6, y - 5, 9, 5, STONE); roof(ctx, x - 6.5, y - 5, 10, 3, '#5a5a6a');
      box(ctx, x + 3, y - 12, 4, 12, STONE); roof(ctx, x + 2.5, y - 12, 5, 4, '#5a5a6a');
      ctx.fillStyle = '#c9a34a'; ctx.fillRect(r(x + 4), r(y - 10), 2, 2);
      return;
    }
    case 'forge': {
      glow(ctx, x, y - 3, 8, '#ff8a30', 0.55);
      smoke(ctx, x + 3, y - 12, 4, 0.7);
      box(ctx, x - 5, y - 5, 8, 5, '#a8906c'); roof(ctx, x - 5.5, y - 5, 9, 3, '#6a4a3a');
      box(ctx, x + 2, y - 10, 2, 5, '#6a5a4a');
      ctx.fillStyle = '#ffb040'; ctx.fillRect(r(x - 2), r(y - 3), 2, 2);
      return;
    }
    case 'fortress': {
      poly(ctx, [x - 9, y, x - 4, y - 12, x + 4, y - 12, x + 9, y], '#9a8a70', INK);
      box(ctx, x - 3, y - 7, 6, 7, '#6a5a4a');
      ctx.fillStyle = '#16100c'; ctx.fillRect(r(x - 2), r(y - 5), 4, 5);
      ctx.fillStyle = '#c9a34a'; ctx.fillRect(r(x - 3), r(y - 8), 6, 1);
      box(ctx, x - 6, y - 6, 1, 6, STONE); box(ctx, x + 5, y - 6, 1, 6, STONE);
      return;
    }
    case 'volcano': {
      glow(ctx, x, y - 18, 16, '#ff7a28', 0.45);
      ctx.fillStyle = rgba('#4a4440', 0.5);
      for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(x - 2 + i * 2.5, y - 22 - i * 3.5, 2.4 + i * 0.9, 0, Math.PI * 2); ctx.fill(); }
      poly(ctx, [x - 18, y, x - 3, y - 17, x + 3, y - 17, x + 18, y], '#5e524c');
      poly(ctx, [x + 0.5, y - 17, x + 3, y - 17, x + 18, y, x + 3, y], '#3e3632');
      ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 18, y); ctx.lineTo(x - 3, y - 17); ctx.lineTo(x + 3, y - 17); ctx.lineTo(x + 18, y); ctx.stroke();
      ctx.strokeStyle = '#ff9a38'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(x - 1, y - 17); ctx.quadraticCurveTo(x - 4, y - 9, x - 8, y - 1); ctx.moveTo(x + 1, y - 17); ctx.quadraticCurveTo(x + 2, y - 8, x + 6, y - 1); ctx.stroke();
      ctx.fillStyle = '#ffd070'; ctx.fillRect(r(x - 2), r(y - 18), 4, 1);
      ctx.lineWidth = 1;
      return;
    }
    case 'sunken': {
      for (const [dx, hh] of [[-5, 5], [-2, 8], [1, 3], [4, 6]]) box(ctx, x + dx, y - hh, 2, hh, STONE);
      ctx.fillStyle = rgba('#5a8aa0', 0.7); ctx.fillRect(r(x - 7), r(y - 2), 14, 2);
      return;
    }
    case 'ruin': {
      for (const [dx, hh] of [[-6, 4], [-3, 7], [2, 5], [5, 2]]) box(ctx, x + dx, y - hh, 2, hh, STONE_D);
      box(ctx, x - 4, y - 8, 5, 1, STONE);
      ctx.fillStyle = rgba('#5a524c', 0.6); ctx.fillRect(r(x - 7), r(y), 14, 1);
      return;
    }
    case 'gate': {
      box(ctx, x - 2, y - 9, 4, 9, STONE_D); roof(ctx, x - 2.5, y - 9, 5, 3, RED); flag(ctx, x, y - 12, RED);
      ctx.fillStyle = RED; ctx.fillRect(r(x + 2), r(y - 3), 4, 1); ctx.fillStyle = '#f0e8d8'; ctx.fillRect(r(x + 4), r(y - 3), 2, 1);
      return;
    }
    case 'wreck': {
      poly(ctx, [x - 8, y - 3, x + 6, y - 1, x + 4, y + 2, x - 6, y + 1], '#6a4a30', INK);
      ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 1, y - 2); ctx.lineTo(x + 3, y - 12); ctx.moveTo(x + 1, y - 7); ctx.lineTo(x + 5, y - 6); ctx.stroke();
      ctx.fillStyle = rgba('#d8e8ec', 0.8); ctx.fillRect(r(x - 9), r(y + 1), 4, 1); ctx.fillRect(r(x + 4), r(y + 2), 5, 1);
      return;
    }
    case 'rift': {
      glow(ctx, x, y - 3, 14, '#b070ff', 0.5);
      poly(ctx, [x - 10, y - 1, x - 5, y - 3, x - 2, y - 1, x + 2, y - 5, x + 5, y - 2, x + 10, y - 4, x + 5, y, x + 1, y - 2, x - 3, y + 1, x - 6, y - 1], '#1a0c26', '#6a3aa0');
      ctx.fillStyle = '#e8c8ff'; ctx.fillRect(r(x), r(y - 2), 1, 1); ctx.fillRect(r(x - 5), r(y - 2), 1, 1);
      return;
    }
    case 'ring': {
      for (let k = 0; k < 7; k++) {
        const a = (k / 7) * Math.PI * 2, sx = x + Math.cos(a) * 8, sy = y - 3 + Math.sin(a) * 3.5;
        box(ctx, sx - 0.5, sy - 4, 2, 4, k % 2 ? STONE : STONE_D);
      }
      return;
    }
    case 'lodge': {
      smoke(ctx, x + 4, y - 11, 3, 0.6);
      box(ctx, x - 6, y - 5, 12, 5, '#a07848');
      poly(ctx, [x - 8, y - 4.5, x, y - 11, x + 8, y - 4.5], '#f4f4f0', INK);
      ctx.fillStyle = '#ffd070'; ctx.fillRect(r(x - 3), r(y - 3), 2, 2);
      box(ctx, x + 1, y - 3, 2, 3, '#5a3a20');
      return;
    }
    case 'obelisk': {
      glow(ctx, x, y - 8, 10, '#8ae0f0', 0.35);
      poly(ctx, [x - 3, y, x - 2, y - 15, x, y - 18, x + 2, y - 15, x + 3, y], '#3a3e44', INK);
      ctx.fillStyle = '#8ae0f0'; ctx.fillRect(r(x), r(y - 14), 1, 11);
      ctx.fillStyle = '#e6d29a'; ctx.fillRect(r(x - 6), r(y - 1), 12, 2);
      return;
    }
    case 'camp': {
      for (const [dx, dy, c] of [[-6, 0, '#d8c8a0'], [0, -3, '#c8a878'], [5, 1, '#e0d4b4']] as const) poly(ctx, [x + dx - 3.5, y + dy, x + dx, y + dy - 6, x + dx + 3.5, y + dy], c, INK);
      flag(ctx, x, y - 9, RED);
      return;
    }
    case 'falls': {
      glow(ctx, x, y + 2, 7, '#e8f6ff', 0.6);
      ctx.fillStyle = '#e8f4f6'; ctx.fillRect(r(x - 2), r(y - 8), 4, 9);
      ctx.fillStyle = '#7ab0c8'; ctx.fillRect(r(x - 2), r(y - 8), 1, 9); ctx.fillRect(r(x + 1), r(y - 6), 1, 7);
      ctx.fillStyle = '#ffffff'; for (const [dx, dy] of [[-4, 1], [3, 2], [-1, 3], [4, 0]]) ctx.fillRect(r(x + dx), r(y + dy), 1, 1);
      return;
    }
    case 'springs': {
      ctx.fillStyle = '#7ec0c8'; ctx.beginPath(); ctx.ellipse(x, y - 1, 5, 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.stroke();
      ctx.strokeStyle = rgba('#ffffff', 0.85);
      for (const dx of [-2.5, 0.5, 3]) { ctx.beginPath(); ctx.moveTo(x + dx, y - 3); ctx.quadraticCurveTo(x + dx - 2, y - 6, x + dx, y - 8); ctx.quadraticCurveTo(x + dx + 2, y - 10, x + dx, y - 12); ctx.stroke(); }
      return;
    }
    case 'label': case 'water': return;
  }
}

/** Cloth position of a site: map-relative sites are placed from their built map's corner. */
function sitePos(s: AtlasSite): [number, number] {
  const z = s.map ? zoneOfMap(ATLAS, s.map) : undefined;
  const wx = (z?.at?.[0] ?? 0) + s.at[0], wy = (z?.at?.[1] ?? 0) + s.at[1];
  return [px(wx), py(wy)];
}

/** Lettering: sepia with a paper halo so it reads over the washes, spaced capitals for areas. */
function letter(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, opts: { color?: string; spacing?: number; align?: 'left' | 'center' | 'right'; size?: number } = {}): void {
  drawTextOutlined(ctx, text, r(x), r(y), { size: opts.size ?? 1, color: opts.color ?? INK, outline: HALO, thickness: 1, shadow: false, spacing: opts.spacing ?? 1, align: opts.align ?? 'center' });
}

const TOWNISH = new Set<AtlasSite['icon']>(['city', 'town', 'port', 'hold', 'fortress', 'lodge']);

function paintSites(ctx: CanvasRenderingContext2D): void {
  for (const s of ATLAS.sites) { const [x, y] = sitePos(s); drawSite(ctx, s.icon, x, y); }
  for (const s of ATLAS.sites) {
    const [x, y] = sitePos(s);
    const color = TOWNISH.has(s.icon) ? RED_INK : INK;
    const size = s.size ?? 1;
    if (s.icon === 'label') { letter(ctx, s.name.toUpperCase(), x, y - 3 * size, { color: '#5a3a24', spacing: 2, size }); continue; }
    if (s.icon === 'water') { letter(ctx, s.name.toUpperCase(), x, y - 3 * size, { color: WATER_INK, spacing: 2, size }); continue; }
    const name = s.name.toUpperCase();
    switch (s.label ?? 'below') {
      case 'none': break;
      case 'below': letter(ctx, name, x, y + 4, { color }); break;
      case 'above': letter(ctx, name, x, y - 26, { color }); break;
      case 'right': letter(ctx, name, x + 12, y - 8, { color, align: 'left' }); break;
      case 'left': letter(ctx, name, x - 12, y - 8, { color, align: 'right' }); break;
    }
  }
}

/** An area's name as the map alone letters it: large spaced capitals, on a sprite of its own so the zone overlay can leave it off. */
interface NameSprite { img: HTMLCanvasElement; x: number; y: number }
function nameSprites(): NameSprite[] {
  return ATLAS.areas.map((a) => {
    const t = a.name.toUpperCase(), w = measureText(t, 2, 2) + 6, h = 20;
    const img = canvas(w, h), ctx = img.getContext('2d')!;
    letter(ctx, t, w / 2, 3, { color: '#6a2a18', spacing: 2, size: 2 });
    return { img, x: r(px(a.label[0]) - w / 2), y: r(py(a.label[1]) - 10) };
  });
}
function drawNames(ctx: CanvasRenderingContext2D, names: readonly NameSprite[], vx: number, vy: number, vw: number, vh: number): void {
  for (const n of names) if (n.x < vx + vw && n.y < vy + vh && n.x + n.img.width > vx && n.y + n.img.height > vy) ctx.drawImage(n.img, n.x, n.y);
}

// ---------------------------------------------------------------- sea furniture

function ship(ctx: CanvasRenderingContext2D, x: number, y: number, flagColor: string): void {
  poly(ctx, [x - 7, y - 2, x + 7, y - 2, x + 5, y + 1, x - 5, y + 1], '#8a5a34', INK);
  ctx.fillStyle = INK; ctx.fillRect(r(x), r(y - 13), 1, 11);
  poly(ctx, [x + 1, y - 12, x + 7, y - 7, x + 1, y - 4], '#f2ead6', INK);
  poly(ctx, [x - 0.5, y - 11, x - 6, y - 5, x - 0.5, y - 4], '#e8dcc0', INK);
  ctx.fillStyle = flagColor; ctx.fillRect(r(x) + 1, r(y - 15), 3, 2);
  ctx.fillStyle = rgba('#e8f2ee', 0.8); ctx.fillRect(r(x - 10), r(y + 1), 3, 1); ctx.fillRect(r(x + 8), r(y + 1), 3, 1);
}

function serpent(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.lineWidth = 2.2; ctx.strokeStyle = INK;
  const hump = (hx: number, w: number): void => { ctx.beginPath(); ctx.arc(hx, y, w, Math.PI, 0); ctx.stroke(); };
  hump(x - 8, 3); hump(x, 3.5); hump(x + 8, 2.5);
  ctx.lineWidth = 1.4; ctx.strokeStyle = '#4f7a5a';
  hump(x - 8, 3); hump(x, 3.5); hump(x + 8, 2.5);
  ctx.lineWidth = 1;
  poly(ctx, [x - 12, y - 1, x - 15, y - 6, x - 19, y - 5, x - 16, y - 3, x - 13, y], '#4f7a5a', INK);
  ctx.fillStyle = '#ffe08a'; ctx.fillRect(r(x - 17), r(y - 5), 1, 1);
}

function whirlpool(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.strokeStyle = rgba('#e8f2ee', 0.75); ctx.lineWidth = 1;
  ctx.beginPath();
  for (let a = 0; a < Math.PI * 5; a += 0.2) { const rr = 1 + a * 1.1; const X = x + Math.cos(a) * rr, Y = y + Math.sin(a) * rr * 0.55; if (a === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); }
  ctx.stroke();
}

/** The Hearth's place on the cloth, from its site. */
function hearthAt(): [number, number] {
  const s = ATLAS.sites.find((q) => q.icon === 'hearth');
  return s ? sitePos(s) : [CLOTH.w / 2, CLOTH.h / 2];
}

/** Little wave marks on open water; ships on the crossings, a serpent, a whirlpool. Only where there is deep water. */
function paintSea(ctx: CanvasRenderingContext2D, grid: WorldGrid): void {
  const [hx, hy] = hearthAt();
  const deep = (wx: number, wy: number): boolean => grid.t(Math.floor(wx), Math.floor(wy)) === TI.sea;
  ctx.strokeStyle = rgba('#e8f2ee', 0.7); ctx.lineWidth = 1;
  for (const w of scatter(grid, (t) => t === TI.sea, 7, 17)) {
    const x = px(w.x), y = py(w.y);
    if (Math.hypot(x - hx, y - hy) < 40) continue;
    if (!deep(w.x - 1, w.y) || !deep(w.x + 1, w.y)) continue;
    ctx.beginPath(); ctx.moveTo(x - 3, y); ctx.quadraticCurveTo(x - 1.5, y - 2, x, y); ctx.quadraticCurveTo(x + 1.5, y - 2, x + 3, y); ctx.stroke();
  }
  const put = (wx: number, wy: number, draw: (x: number, y: number) => void): void => { if (deep(wx, wy)) draw(px(wx), py(wy)); };
  put(128, 186, (x, y) => ship(ctx, x, y, '#2a2a2a'));
  put(212, 132, (x, y) => ship(ctx, x, y, '#c9a34a'));
  put(318, 214, (x, y) => ship(ctx, x, y, '#3a5aa0'));
  put(328, 146, (x, y) => serpent(ctx, x, y));
  put(222, 232, (x, y) => serpent(ctx, x, y));
  put(286, 196, (x, y) => whirlpool(ctx, x, y));
}

// ---------------------------------------------------------------- the border, the title, the rose

/** The cloth's border: two rules with a band between, lettered by square like the old box maps. */
function paintBorder(ctx: CanvasRenderingContext2D): void {
  const w = CLOTH.w, h = CLOTH.h, B = PAD - 3;
  ctx.fillStyle = rgba('#b89a64', 0.22);
  ctx.fillRect(3, 3, w - 6, B - 2); ctx.fillRect(3, h - B + 1, w - 6, B - 2);
  ctx.fillRect(3, B + 1, B - 2, h - B * 2 - 2); ctx.fillRect(w - B + 1, B + 1, B - 2, h - B * 2 - 2);
  ctx.strokeStyle = INK; ctx.lineWidth = 1;
  ctx.strokeRect(2.5, 2.5, w - 5, h - 5);
  ctx.strokeRect(B + 0.5, B + 0.5, w - B * 2 - 1, h - B * 2 - 1);
  ctx.strokeStyle = rgba(INK, 0.5); ctx.strokeRect(B - 1.5, B - 1.5, w - B * 2 + 3, h - B * 2 + 3);
  const cols = Math.round(ATLAS.width / ATLAS.square), rows = Math.round(ATLAS.height / ATLAS.square), cw = ATLAS.square * S;
  ctx.fillStyle = rgba(INK, 0.1);
  for (let i = 1; i < cols; i++) { const gx = PAD + i * cw; for (let yy = B + 2; yy < h - B - 2; yy += 3) ctx.fillRect(gx, yy, 1, 1); }
  for (let j = 1; j < rows; j++) { const gy = PAD + j * cw; for (let xx = B + 2; xx < w - B - 2; xx += 3) ctx.fillRect(xx, gy, 1, 1); }
  for (let i = 0; i < cols; i++) {
    const cx = PAD + (i + 0.5) * cw, ch = String.fromCharCode(65 + i);
    drawText(ctx, ch, cx, 4, { color: INK, align: 'center', shadow: false });
    drawText(ctx, ch, cx, h - B + 2, { color: INK, align: 'center', shadow: false });
    ctx.fillStyle = INK; ctx.fillRect(PAD + i * cw, 3, 1, B - 2); ctx.fillRect(PAD + i * cw, h - B + 1, 1, B - 2);
  }
  for (let j = 0; j < rows; j++) {
    const cy = PAD + (j + 0.5) * cw, n = String(j + 1);
    drawText(ctx, n, 3 + (B - 2) / 2, cy - 3, { color: INK, shadow: false, align: 'center', spacing: 0 });
    drawText(ctx, n, w - B + 1 + (B - 2) / 2, cy - 3, { color: INK, shadow: false, align: 'center', spacing: 0 });
    ctx.fillStyle = INK; ctx.fillRect(3, PAD + j * cw, B - 2, 1); ctx.fillRect(w - B + 1, PAD + j * cw, B - 2, 1);
  }
  for (const [cx, cy] of [[3, 3], [w - B + 1, 3], [3, h - B + 1], [w - B + 1, h - B + 1]]) {
    ctx.fillStyle = '#8a2c1a'; ctx.fillRect(cx, cy, B - 2, B - 2);
    ctx.fillStyle = '#e8c070'; ctx.fillRect(cx + 3, cy + 3, B - 8, B - 8);
    ctx.fillStyle = INK; ctx.fillRect(cx + (B - 2) / 2 - 0.5, cy + (B - 2) / 2 - 0.5, 1, 1);
  }
}

/** The title cartouche: a scroll with the realm's name, top left over the blank cloth beyond the rim. */
function paintCartouche(ctx: CanvasRenderingContext2D): void {
  const x = PAD + 12, y = PAD + 10, w = 196, h = 64;
  ctx.fillStyle = rgba('#3b2a1c', 0.25); ctx.fillRect(x + 3, y + 3, w, h);
  ctx.fillStyle = '#efe4c6'; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  ctx.strokeStyle = '#8a2c1a'; ctx.strokeRect(x + 2.5, y + 2.5, w - 5, h - 5);
  for (const ex of [x - 5, x + w - 2]) {
    ctx.fillStyle = '#d8c89e'; ctx.fillRect(ex, y - 3, 7, h + 6);
    ctx.strokeStyle = INK; ctx.strokeRect(ex + 0.5, y - 2.5, 6, h + 5);
    ctx.fillStyle = '#b8a47a'; ctx.fillRect(ex + 4, y - 2, 2, h + 4);
  }
  drawTextOutlined(ctx, 'CALDERA', x + w / 2, y + 8, { size: 3, color: '#8a2c1a', outline: '#efe4c6', thickness: 1, shadow: false, spacing: 2, align: 'center' });
  drawText(ctx, 'THE LANDS ABOUT THE HEARTH', x + w / 2, y + 34, { color: INK, align: 'center', shadow: false });
  drawText(ctx, "CARTOGRAPHERS' GUILD", x + w / 2, y + 44, { color: '#7a5a3a', align: 'center', shadow: false });
  drawText(ctx, `${ATLAS.width} BY ${ATLAS.height} SQUARES`, x + w / 2, y + 53, { color: '#7a5a3a', align: 'center', shadow: false });
}

/** An eight-point compass rose, top right. */
function paintCompass(ctx: CanvasRenderingContext2D): void {
  const cx = CLOTH.w - PAD - 46, cy = PAD + 46, R = 30;
  ctx.strokeStyle = rgba(INK, 0.6); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, R - 6, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, R - 9, 0, Math.PI * 2); ctx.stroke();
  for (let k = 0; k < 32; k++) { const a = (k / 32) * Math.PI * 2; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (R - 9), cy + Math.sin(a) * (R - 9)); ctx.lineTo(cx + Math.cos(a) * (R - 6), cy + Math.sin(a) * (R - 6)); ctx.stroke(); }
  const point = (a: number, len: number, wid: number, lit: string, dark: string): void => {
    const dx = Math.sin(a), dy = -Math.cos(a), nx = -dy, ny = dx;
    poly(ctx, [cx, cy, cx + dx * len, cy + dy * len, cx + nx * wid, cy + ny * wid], lit, INK);
    poly(ctx, [cx, cy, cx + dx * len, cy + dy * len, cx - nx * wid, cy - ny * wid], dark, INK);
  };
  for (let k = 0; k < 4; k++) point(Math.PI / 4 + (k * Math.PI) / 2, R * 0.62, 4, '#efe4c6', '#b8a47a');
  for (let k = 0; k < 4; k++) point((k * Math.PI) / 2, R, 5, k === 0 ? '#c8402c' : '#efe4c6', k === 0 ? '#8a2c1a' : '#8a7a5a');
  ctx.fillStyle = '#c9a34a'; ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = INK; ctx.stroke();
  letter(ctx, 'N', cx, cy - R - 11, { color: '#8a2c1a' });
}

/** A scale bar in squares, the unit the party walks in. */
function paintScale(ctx: CanvasRenderingContext2D): void {
  const x = PAD + 18, y = CLOTH.h - PAD - 22, seg = 16 * S;
  for (let i = 0; i < 4; i++) { ctx.fillStyle = i % 2 ? '#efe4c6' : INK; ctx.fillRect(x + i * seg, y, seg, 3); }
  ctx.strokeStyle = INK; ctx.strokeRect(x + 0.5, y + 0.5, seg * 4 - 1, 3);
  drawText(ctx, '0', x, y - 9, { color: INK, shadow: false, align: 'center' });
  drawText(ctx, '32', x + seg * 2, y - 9, { color: INK, shadow: false, align: 'center' });
  drawText(ctx, '64 SQUARES', x + seg * 4 - 2, y - 9, { color: INK, shadow: false, align: 'left' });
}

// ---------------------------------------------------------------- the zone overlay

/** Step numbers the way the old games numbered their maps' quarters. */
export function roman(n: number): string {
  let s = '';
  for (const [v, t] of [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']] as const) while (n >= v) { s += t; n -= v; }
  return s;
}

/** The colour of a step on the road of levels: green for the first, through gold and red to violet for the last. */
function stepColor(order: number): RGB {
  const max = Math.max(...ATLAS.areas.map((a) => a.order));
  const t = (order - 1) / Math.max(1, max - 1);
  const stops: [number, RGB][] = [[0, [104, 204, 96]], [0.3, [206, 212, 84]], [0.55, [238, 156, 64]], [0.8, [226, 78, 72]], [1, [176, 96, 226]]];
  for (let k = 1; k < stops.length; k++) {
    const [t1, c1] = stops[k], [t0, c0] = stops[k - 1];
    if (t <= t1) { const u = (t - t0) / (t1 - t0); return [c0[0] + (c1[0] - c0[0]) * u, c0[1] + (c1[1] - c0[1]) * u, c0[2] + (c1[2] - c0[2]) * u]; }
  }
  return stops[stops.length - 1][1];
}
const css = (c: RGB, a = 1): string => `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`;

/** A plate: a town, dungeon or Underdeep step, one line with its name and band, marked by kind. */
interface Plate { place: AtlasPlace; name: string; band: string; x: number; y: number; w: number; h: number; built: boolean }

function plates(): Plate[] {
  return ATLAS.places.map((z) => {
    const def = MAP_DEFS.find((d) => d.id === z.id);
    const base = (def?.name ?? z.name ?? z.id).toUpperCase();
    const name = z.order != null ? `${roman(z.order)} ${base}` : base;
    const b = def?.band ?? z.band;
    const band = b ? (b[0] === b[1] ? `${b[0]}` : `${b[0]}-${b[1]}`) : '';
    const w = 14 + measureText(name) + (band ? measureText(band) + 6 : 0), h = 13;
    return { place: z, name, band, x: r(px(z.at[0]) - w / 2), y: r(py(z.at[1]) - h / 2), w, h, built: !!def };
  });
}

/** The point where a line from (x, y) towards a box's centre meets the box's edge. */
function clipToBox(x: number, y: number, b: { x: number; y: number; w: number; h: number }): [number, number] {
  const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
  const dx = x - cx, dy = y - cy;
  if (!dx && !dy) return [cx, cy];
  const t = Math.min(Math.abs((b.w / 2 + 1) / (dx || 1e-9)), Math.abs((b.h / 2 + 1) / (dy || 1e-9)));
  return [cx + dx * Math.min(1, t), cy + dy * Math.min(1, t)];
}

function arrowHead(ctx: CanvasRenderingContext2D, x: number, y: number, ang: number, color: string, size = 5): void {
  const a = size, b = size * 0.6;
  poly(ctx, [x, y, x - Math.cos(ang) * a + Math.sin(ang) * b, y - Math.sin(ang) * a - Math.cos(ang) * b, x - Math.cos(ang) * a - Math.sin(ang) * b, y - Math.sin(ang) * a + Math.cos(ang) * b], color, '#120c14');
}

const EDGE_COLOR: Record<ZoneEdge['kind'], string> = { road: '#ffd760', enter: '#f4ead2', stairs: '#ffd760', sea: '#7ec8f0', deep: '#c08af0' };
const PLANNED_WAY = '#d8d0e8';

/** A tiny boat for the middle of a sea route. */
function boat(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  poly(ctx, [x - 5, y, x + 5, y, x + 3, y + 3, x - 3, y + 3], '#8a5a34', '#120c14');
  ctx.fillStyle = '#120c14'; ctx.fillRect(r(x), r(y - 8), 1, 8);
  poly(ctx, [x + 1, y - 8, x + 5, y - 3, x + 1, y - 2], '#f2ead6', '#120c14');
}

/** Where a zone's or an area's arrows start when the atlas gives no point: its label, else its first seed, else its map's middle. */
function centreOf(id: string): [number, number] | undefined {
  const z = ATLAS.zones.find((q) => q.id === id || q.map === id);
  if (z) {
    const p = z.label ?? z.seeds?.[0];
    if (p) return [px(p[0]), py(p[1])];
    if (z.at) return [px(z.at[0] + 16), py(z.at[1] + 16)];
  }
  const a = ATLAS.areas.find((q) => q.id === id);
  return a ? [px(a.label[0]), py(a.label[1])] : undefined;
}

function drawEdge(ctx: CanvasRenderingContext2D, e: ZoneEdge, find: (id: string) => Plate | undefined): void {
  const endAt = (id: string, p: Pt | undefined): { pt: [number, number]; plate?: Plate } | null => {
    if (p) return { pt: [px(p[0]), py(p[1])] };
    const pl = find(id);
    if (pl) return { pt: [pl.x + pl.w / 2, pl.y + pl.h / 2], plate: pl };
    const c = centreOf(id);
    return c ? { pt: c } : null;
  };
  const A = endAt(e.from, e.a), B = endAt(e.to, e.b);
  if (!A || !B) return;
  const via = (e.via ?? []).map((p): [number, number] => [px(p[0]), py(p[1])]);
  let [ax, ay] = A.pt, [bx, by] = B.pt;
  if (A.plate) [ax, ay] = clipToBox(via[0]?.[0] ?? bx, via[0]?.[1] ?? by, A.plate);
  if (B.plate) [bx, by] = clipToBox(via[via.length - 1]?.[0] ?? ax, via[via.length - 1]?.[1] ?? ay, B.plate);
  // A way across a shared border is only a cell or two long; stretch it so it reads as an arrow.
  const len = Math.hypot(bx - ax, by - ay);
  if (!via.length && len < 36 && !A.plate && !B.plate) {
    const ux = (bx - ax) / (len || 1), uy = (by - ay) / (len || 1), grow = (36 - len) / 2;
    ax -= ux * grow; ay -= uy * grow; bx += ux * grow; by += uy * grow;
  }
  // The way's line: a curve through its points, bowed a little when it is a crossing with none.
  let pts: [number, number][];
  if (via.length) pts = spline([[ax, ay], ...via, [bx, by]], false, 10).map((p): [number, number] => [p[0], p[1]]);
  else {
    const bow = e.kind === 'sea' ? 0.2 : 0;
    const mx = (ax + bx) / 2 - (by - ay) * bow, my = (ay + by) / 2 + (bx - ax) * bow;
    pts = [];
    for (let k = 0; k <= 16; k++) { const t = k / 16; pts.push([(1 - t) * (1 - t) * ax + 2 * (1 - t) * t * mx + t * t * bx, (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * my + t * t * by]); }
  }
  const path = (): void => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) ctx.lineTo(p[0], p[1]); };
  const main = e.kind === 'road' || e.kind === 'sea';
  const color = e.planned && e.kind !== 'sea' && e.kind !== 'deep' ? PLANNED_WAY : EDGE_COLOR[e.kind];
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const wide = main ? 3 : 2;
  if (e.planned) ctx.setLineDash(e.kind === 'sea' ? [6, 4] : [3, 3]);
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = wide + 2; path(); ctx.stroke();
  ctx.strokeStyle = color; ctx.lineWidth = wide; path(); ctx.stroke();
  ctx.setLineDash([]);
  const n = pts.length, end = pts[n - 1], pre = pts[Math.max(0, n - 3)], beg = pts[0], post = pts[Math.min(n - 1, 2)];
  arrowHead(ctx, end[0], end[1], Math.atan2(end[1] - pre[1], end[0] - pre[0]), color, main ? 6 : 5);
  if (e.both) arrowHead(ctx, beg[0], beg[1], Math.atan2(beg[1] - post[1], beg[0] - post[0]), color, main ? 6 : 5);
  const [qx, qy] = pts[n >> 1];
  if (e.kind === 'sea') boat(ctx, qx, qy - 2);
  // What the way waits on: a padlock and the quests for a built gate, the step for a planned one.
  const lines: { text: string; color: string }[] = [];
  if (e.gate.length) lines.push({ text: e.gate.map((f) => f.replace(/^q_/, '').replace(/_done$/, '')).join(' + ').toUpperCase(), color: '#ff8a7a' });
  if (e.note) lines.push({ text: e.note.toUpperCase(), color: e.kind === 'sea' ? '#a8dcf8' : e.kind === 'deep' ? '#d8b0ff' : '#e8e0f4' });
  if (e.opens) lines.push({ text: `OPENS AFTER ${roman(e.opens)}`, color: '#ffb86a' });
  if (e.gate.length || e.opens) {
    const lx = r(qx) + (e.kind === 'sea' ? 8 : 0), ly = r(qy) + (e.kind === 'sea' ? -3 : 0);
    ctx.fillStyle = '#120c14'; ctx.fillRect(lx - 4, ly - 3, 9, 8);
    ctx.fillStyle = e.gate.length ? '#e0453c' : '#e0903c'; ctx.fillRect(lx - 3, ly - 1, 7, 5);
    ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(lx + 0.5, ly - 1, 2.5, Math.PI, 0); ctx.stroke();
  }
  // Notes go where the atlas puts them; otherwise beside a way that runs up and down, and under one that runs across.
  const vertical = Math.abs(by - ay) > Math.abs(bx - ax) * 1.4;
  const at = e.noteAt ? [px(e.noteAt[0]), py(e.noteAt[1])] : null;
  lines.forEach((l, i) => {
    const tw = measureText(l.text);
    const tx = at ? r(at[0] - tw / 2) : vertical ? r(qx) + 9 : r(qx) - tw / 2;
    const ty = at ? r(at[1]) - lines.length * 5 + i * 10 : vertical ? r(qy) - 4 - (lines.length - 1) * 5 + i * 10 : r(qy) + 8 + i * 10;
    ctx.fillStyle = 'rgba(14,10,16,0.8)'; ctx.fillRect(tx - 2, ty - 1, tw + 4, 9);
    drawText(ctx, l.text, tx, ty, { color: l.color });
  });
  ctx.restore();
}

function drawPlate(ctx: CanvasRenderingContext2D, p: Plate): void {
  const { x, y, w, h } = p;
  ctx.fillStyle = rgba(PANEL, p.built ? 0.95 : 0.86); ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 1; ctx.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1);
  if (p.built) { ctx.strokeStyle = BRASS; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); }
  else { ctx.setLineDash([2, 2]); ctx.strokeStyle = '#8a8aa0'; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); ctx.setLineDash([]); }
  // The kind: a roof for a town, an arch for a dungeon, a spiral for the Underdeep.
  const kx = x + 4, ky = y + 3, c = p.built ? BRASS : '#a4a4bc';
  ctx.fillStyle = c;
  if (p.place.kind === 'town') { ctx.fillRect(kx, ky + 3, 5, 4); poly(ctx, [kx - 1, ky + 3.5, kx + 2.5, ky, kx + 6, ky + 3.5], c); }
  else if (p.place.kind === 'dungeon') { ctx.fillRect(kx, ky + 1, 5, 6); ctx.fillStyle = '#120c14'; ctx.fillRect(kx + 1, ky + 3, 3, 4); }
  else { ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(kx + 2.5, ky + 3.5, 3, 0, Math.PI * 1.6); ctx.stroke(); ctx.beginPath(); ctx.arc(kx + 2.5, ky + 3.5, 1.2, 0, Math.PI * 2); ctx.stroke(); }
  drawText(ctx, p.name, x + 12, y + 3, { color: p.built ? TEXT : '#cac6da' });
  if (p.band) drawText(ctx, p.band, x + w - 4, y + 3, { color: p.built ? BRASS : '#a4a4c0', align: 'right' });
}

/**
 * The zones over the whole cloth, painted once: a veil, every area washed in its step's colour with
 * a bright rule round it and a dotted one between its zones, the built maps' real footprints in
 * brass, each area's step, name and band on a badge and each zone's name, every town, dungeon and
 * Underdeep step as a plate, and an arrow for every way between them, from the maps' exits where
 * they exist, with the step after which a planned way opens. Cloth coordinates.
 */
function* paintOverlay(ctx: CanvasRenderingContext2D, grid: WorldGrid, kind: Uint8Array): Generator<number, void> {
  const SW = CLOTH.w, SH = CLOTH.h, NP = SW * SH, W = grid.width;
  const areaIdx = ATLAS.zones.map((z) => ATLAS.areas.findIndex((a) => a.id === z.area));
  const colors = ATLAS.areas.map((a) => stepColor(a.order));
  const warpX = coarse(3, (x, y) => fbm(wxOf(x) * 0.3 + 3.3, wyOf(y) * 0.3, 113) - 0.5);
  const warpY = coarse(3, (x, y) => fbm(wxOf(x) * 0.3, wyOf(y) * 0.3 + 8.1, 117) - 0.5);
  const zid = new Int16Array(NP).fill(-1);
  for (let Y = 0; Y < SH; Y++) {
    for (let X = 0; X < SW; X++) {
      const p = Y * SW + X;
      if (kind[p] !== 2) continue;
      const wx = wxOf(X), wy = wyOf(Y);
      let z = grid.zone[Math.floor(wy + warpY(X, Y) * 1.2) * W + Math.floor(wx + warpX(X, Y) * 1.2)] ?? -1;
      if (z < 0) z = grid.zone[Math.floor(wy) * W + Math.floor(wx)];
      zid[p] = z;
    }
    if ((Y & 127) === 127) yield 0.9 + 0.03 * (Y / SH);
  }
  // Rules: 2 between areas, 1 between zones of one area.
  const rule = new Uint8Array(NP);
  const differs = (z: number, zq: number): number => (zq < 0 || zq === z ? 0 : areaIdx[zq] !== areaIdx[z] ? 2 : 1);
  for (let Y = 1; Y < SH - 1; Y++) for (let X = 1; X < SW - 1; X++) {
    const p = Y * SW + X, z = zid[p];
    if (z >= 0) rule[p] = Math.max(differs(z, zid[p - 1]), differs(z, zid[p + 1]), differs(z, zid[p - SW]), differs(z, zid[p + SW]));
  }
  const img = ctx.createImageData(SW, SH), d = img.data;
  const B = PAD - 3;
  for (let Y = B + 1; Y < SH - B - 1; Y++) {
    for (let X = B + 1; X < SW - B - 1; X++) {
      const p = Y * SW + X, o = p * 4, k = kind[p], z = zid[p];
      let c: RGB = [14, 10, 16], a = k === 1 ? 0.46 : 0.36;
      if (k === 2 && z >= 0) {
        const ai = areaIdx[z], col = colors[ai];
        const outline = !rule[p] && (rule[p - 1] === 2 || rule[p + 1] === 2 || rule[p - SW] === 2 || rule[p + SW] === 2);
        if (rule[p] === 2) { c = [252, 240, 206]; a = 0.95; }
        else if (outline) { c = [14, 10, 16]; a = 0.85; }
        else if (rule[p] === 1 && ((X >> 1) + (Y >> 1)) % 2 === 0) { c = [240, 232, 214]; a = 0.6; }
        else { c = [col[0] * 0.55, col[1] * 0.55, col[2] * 0.55]; a = 0.44; }
      }
      d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = Math.round(a * 255);
    }
    if ((Y & 127) === 127) yield 0.93 + 0.03 * (Y / SH);
  }
  ctx.putImageData(img, 0, 0);
  // The built maps' own footprints: square, because a map is.
  for (const z of ATLAS.zones) {
    const def = z.map ? MAP_DEFS.find((q) => q.id === z.map) : undefined;
    if (!def || !z.at) continue;
    const X = px(z.at[0]), Y = py(z.at[1]), w = def.rows[0].length * S, h = def.rows.length * S;
    ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3; ctx.strokeRect(X + 0.5, Y + 0.5, w - 1, h - 1);
    ctx.strokeStyle = BRASS; ctx.lineWidth = 1; ctx.strokeRect(X + 0.5, Y + 0.5, w - 1, h - 1);
    const tag = `BUILT ${def.rows[0].length}X${def.rows.length}`;
    ctx.fillStyle = 'rgba(14,10,16,0.8)'; ctx.fillRect(X + 1, Y + 1, measureText(tag) + 6, 10);
    drawText(ctx, tag, X + 4, Y + 2, { color: BRASS });
  }
  // Zones' names, small; then the areas' badges over them.
  for (const z of ATLAS.zones) {
    // A built zone is named by its map; a zone that is its whole area is named by the area's badge.
    if (z.map || ATLAS.areas.find((a) => a.id === z.area)?.name === z.name) continue;
    const p = z.label ?? z.seeds?.[0];
    if (!p) continue;
    const t = z.name.toUpperCase(), tw = measureText(t);
    ctx.fillStyle = 'rgba(14,10,16,0.55)'; ctx.fillRect(r(px(p[0]) - tw / 2) - 2, r(py(p[1])) - 1, tw + 4, 9);
    drawText(ctx, t, r(px(p[0]) - tw / 2), r(py(p[1])), { color: '#e6dcc4' });
  }
  for (const a of ATLAS.areas) {
    const col = stepColor(a.order), num = roman(a.order);
    const band = areaBand(ATLAS, MAP_DEFS, a.id);
    const name = a.name.toUpperCase(), bt = band ? `${band[0]}-${band[1]}` : '';
    const nw = measureText(num) + 8, tw = measureText(name) + (bt ? measureText(bt) + 10 : 0) + 8;
    const X = r(px(a.label[0]) - (nw + tw) / 2), Y = r(py(a.label[1]) - 7);
    ctx.fillStyle = '#120c14'; ctx.fillRect(X - 1, Y - 1, nw + tw + 2, 15);
    ctx.fillStyle = css(col); ctx.fillRect(X, Y, nw, 13);
    drawText(ctx, num, X + nw / 2, Y + 3, { color: '#1c1408', align: 'center', shadow: false });
    ctx.fillStyle = 'rgba(28,23,32,0.95)'; ctx.fillRect(X + nw, Y, tw, 13);
    drawText(ctx, name, X + nw + 4, Y + 3, { color: '#f4ecd8' });
    if (bt) drawText(ctx, bt, X + nw + tw - 4, Y + 3, { color: css(col), align: 'right' });
  }
  const ps = plates();
  const find = (id: string): Plate | undefined => ps.find((q) => q.place.id === id);
  for (const e of zoneEdges(ATLAS, MAP_DEFS)) drawEdge(ctx, e, find);
  for (const q of ps) drawPlate(ctx, q);
  yield 0.99;
}

// ---------------------------------------------------------------- the painted map, cached

interface Painted { cloth: HTMLCanvasElement; overlay: HTMLCanvasElement; thumb: HTMLCanvasElement; names: NameSprite[] }
let painted: Painted | null = null;
let job: Generator<number, Painted> | null = null;
let progress = 0;

/** Everything the map shows, painted in slices: the cloth, the zone overlay, and a thumbnail for the locator. */
function* paintAll(): Generator<number, Painted> {
  const cloth = canvas(CLOTH.w, CLOTH.h), ctx = cloth.getContext('2d')!;
  const grid = worldGrid(ATLAS, MAP_DEFS);
  yield 0.02;
  const kind = new Uint8Array(CLOTH.w * CLOTH.h);
  yield* paintGround(ctx, grid, kind);
  paintRivers(ctx, grid);
  paintCliffs(ctx);
  paintRoads(ctx, grid);
  paintSea(ctx, grid);
  yield 0.71;
  yield* paintGlyphs(ctx, grid);
  paintSites(ctx);
  paintBorder(ctx);
  paintCartouche(ctx);
  paintCompass(ctx);
  paintScale(ctx);
  yield 0.88;
  const overlay = canvas(CLOTH.w, CLOTH.h);
  yield* paintOverlay(overlay.getContext('2d')!, grid, kind);
  const thumb = canvas(128, Math.round((128 * CLOTH.h) / CLOTH.w)), tctx = thumb.getContext('2d')!;
  tctx.imageSmoothingEnabled = true; tctx.imageSmoothingQuality = 'high';
  tctx.drawImage(cloth, 0, 0, thumb.width, thumb.height);
  return { cloth, overlay, thumb, names: nameSprites() };
}

/** Paint for up to `ms` milliseconds; the finished map once it is done, null until then. */
function advance(ms: number): Painted | null {
  if (painted) return painted;
  job ??= paintAll();
  const t0 = performance.now();
  for (;;) {
    const step = job.next();
    if (step.done) { painted = step.value; job = null; progress = 1; return painted; }
    progress = step.value;
    if (performance.now() - t0 >= ms) return null;
  }
}

/** The whole painted map, finished now if it is not already. */
function paintedNow(): Painted {
  return advance(Infinity)!;
}

/** The painted cloth alone, drawn once. */
export function worldArt(): HTMLCanvasElement { return paintedNow().cloth; }

/** The Hearth burns over the painted sea: a warm pool on the water and a flickering column. Cloth coordinates. */
function drawHearth(ctx: CanvasRenderingContext2D, frame: number): void {
  const [x, hy] = hearthAt(), y = hy - 4;
  const flick = 0.82 + 0.18 * Math.sin(frame / 7) * Math.sin(frame / 3.1);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  glow(ctx, x, y + 2, 48, '#ffc070', 0.32 * flick);
  const col = ctx.createLinearGradient(0, y - 64, 0, y);
  col.addColorStop(0, rgba('#fff0c0', 0)); col.addColorStop(1, rgba('#ffe0a0', 0.7 * flick));
  ctx.fillStyle = col; ctx.fillRect(x - 2, y - 64, 4, 64);
  ctx.fillStyle = rgba('#fff6dc', 0.8 * flick); ctx.fillRect(x - 0.5, y - 52, 1, 52);
  ctx.restore();
}

/** The party's mark: a blinking arrow the way it faces, and YOU beside it. Cloth coordinates. */
function drawParty(ctx: CanvasRenderingContext2D, at: [number, number], facing: number, frame: number, scale = 1): void {
  const [cx, cy] = at, s = 5;
  const pts = facing === 0 ? [cx, cy - s, cx - s, cy + s, cx + s, cy + s] : facing === 1 ? [cx + s, cy, cx - s, cy - s, cx - s, cy + s] : facing === 2 ? [cx, cy + s, cx - s, cy - s, cx + s, cy - s] : [cx - s, cy, cx + s, cy - s, cx + s, cy + s];
  poly(ctx, pts, (frame >> 4) & 1 ? '#ff5a4a' : '#ffb0a0', '#120c14');
  if (scale >= 1) {
    ctx.fillStyle = 'rgba(14,10,16,0.8)'; ctx.fillRect(r(cx) + 7, r(cy) - 5, measureText('YOU') + 4, 9);
    drawText(ctx, 'YOU', r(cx) + 9, r(cy) - 4, { color: '#ffe08a' });
  }
}

/** The overlay's legend: one line on the frame under the cloth, so nothing on the map is covered. */
function drawLegend(ctx: CanvasRenderingContext2D, y: number): void {
  let x = 14;
  const label = (t: string, color = TEXT): void => { drawText(ctx, t, x, y, { color }); x += measureText(t) + 10; };
  // The steps' colours, first to last.
  const steps = ATLAS.areas.map((a) => a.order).sort((a, b) => a - b);
  for (const o of steps) { ctx.fillStyle = css(stepColor(o)); ctx.fillRect(x, y, 4, 7); x += 4; }
  x += 4;
  label('STEP I TO XII');
  ctx.strokeStyle = BRASS; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, 9, 6); x += 13;
  label('BUILT');
  const way = (kind: ZoneEdge['kind'], planned: boolean, t: string): void => {
    const c = planned && kind !== 'sea' && kind !== 'deep' ? PLANNED_WAY : EDGE_COLOR[kind];
    ctx.save(); ctx.lineCap = 'round';
    if (planned) ctx.setLineDash([3, 3]);
    ctx.strokeStyle = '#120c14'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + 1, y + 3); ctx.lineTo(x + 11, y + 3); ctx.stroke();
    ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 1, y + 3); ctx.lineTo(x + 11, y + 3); ctx.stroke();
    ctx.restore();
    arrowHead(ctx, x + 15, y + 3, 0, c, 4);
    x += 20;
    label(t);
  };
  way('road', false, 'WAY');
  way('enter', true, 'PLANNED');
  way('sea', true, 'BY SEA');
  way('deep', true, 'DOWN');
  ctx.fillStyle = '#e0453c'; ctx.fillRect(x + 1, y + 1, 7, 5); x += 12;
  label('QUEST');
  ctx.fillStyle = '#e0903c'; ctx.fillRect(x + 1, y + 1, 7, 5); x += 12;
  label('LATER STEP');
}

/** The whole cloth, small, with the part on screen boxed: top right of the view. Screen coordinates. */
function drawLocator(ctx: CanvasRenderingContext2D, thumb: HTMLCanvasElement, vx: number, vy: number, alpha: number): void {
  const w = thumb.width, h = thumb.height, x = VIEW.x + VIEW.w - w - 6, y = VIEW.y + 6;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#120c14'; ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
  ctx.drawImage(thumb, x, y);
  ctx.strokeStyle = BRASS; ctx.lineWidth = 1; ctx.strokeRect(x - 1.5, y - 1.5, w + 3, h + 3);
  const k = w / CLOTH.w;
  ctx.strokeStyle = '#fff0b0'; ctx.strokeRect(r(x + vx * k) + 0.5, r(y + vy * k) + 0.5, r(VIEW.w * k), r(VIEW.h * k));
  ctx.restore();
}

// ---------------------------------------------------------------- the screen

export type WorldMapMode = 'art' | 'zones';

/** Where on the cloth the party is: its cell on a built map, else its town or dungeon's plate, else its home map's middle. */
function partyOnCloth(world: World | null): [number, number] | null {
  if (!world) return null;
  const pt = worldPoint(ATLAS, world.state.mapId, world.state.x, world.state.y);
  if (pt) return [px(pt[0]), py(pt[1])];
  const pl = ATLAS.places.find((q) => q.id === world.state.mapId);
  if (pl) return [px(pl.at[0]), py(pl.at[1])];
  const home = homeMap(MAP_DEFS, world.state.mapId);
  const z = home ? zoneOfMap(ATLAS, home.id) : undefined;
  if (z?.at) return [px(z.at[0] + 16), py(z.at[1] + 16)];
  return null;
}

/** The whole cloth fitted to the view, for Z. */
const WHOLE = (() => {
  const k = Math.min(VIEW.w / CLOTH.w, VIEW.h / CLOTH.h);
  const w = Math.round(CLOTH.w * k), h = Math.round(CLOTH.h * k);
  return { k, w, h, x: VIEW.x + Math.round((VIEW.w - w) / 2), y: VIEW.y + Math.round((VIEW.h - h) / 2) };
})();

/**
 * M opens it on the party; the arrows scroll the cloth; Tab turns the zone overlay on and off; Z
 * shows the whole cloth at once, where the arrows move the frame of what Z goes back to; Space
 * opens the almanac (where the party is, the date, the season and the weather); M or Esc closes it.
 * The first time it opens the cloth is painted behind a progress bar.
 */
export class WorldMapScreen implements Screen {
  private vx = 0; private vy = 0; private tx = 0; private ty = 0;
  private placed = false;
  /** Frames since the last scroll, for fading the locator out. */
  private still = 999;
  whole = false;

  constructor(public mode: WorldMapMode = 'art') {}

  /** Whether the cloth is painted yet (the first opening paints it behind a progress bar). */
  get ready(): boolean { return painted !== null; }

  private place(g: Game): void {
    const at = partyOnCloth(g.world ?? null) ?? [CLOTH.w / 2, CLOTH.h / 2];
    this.tx = at[0] - VIEW.w / 2; this.ty = at[1] - VIEW.h / 2;
    this.clamp();
    this.vx = this.tx; this.vy = this.ty;
    this.placed = true;
  }

  private clamp(): void {
    this.tx = Math.max(0, Math.min(CLOTH.w - VIEW.w, this.tx));
    this.ty = Math.max(0, Math.min(CLOTH.h - VIEW.h, this.ty));
  }

  /** Scroll so the view's top-left is at (x, y) on the cloth; tools and tests use it. */
  scrollTo(x: number, y: number): void { this.tx = x; this.ty = y; this.clamp(); this.vx = this.tx; this.vy = this.ty; this.placed = true; }

  update(g: Game, a: Action | null): void {
    if (!this.placed) this.place(g);
    if (a && (is(a, 'cancel') || is(a, 'map'))) { g.pop(); return; }
    if (!painted) return;
    if (a) {
      if (is(a, 'next')) this.mode = this.mode === 'art' ? 'zones' : 'art';
      if (is(a, 'zoom')) this.whole = !this.whole;
      if (is(a, 'interact') && g.world) {
        const w = g.world;
        g.push(new MessageScreen(`${w.map.name}\n\nBand: levels ${w.map.def.band?.join('-') ?? '?'}.\nSteps taken: ${w.state.steps}.\n\n${w.almanac()}`, undefined, 'ALMANAC'));
        return;
      }
      const step = this.whole ? 160 : 96;
      let moved = true;
      if (is(a, 'up')) this.ty -= step;
      else if (is(a, 'down')) this.ty += step;
      else if (is(a, 'left')) this.tx -= step;
      else if (is(a, 'right')) this.tx += step;
      else moved = false;
      if (moved) { this.clamp(); this.still = 0; }
    }
    this.vx += (this.tx - this.vx) * 0.3; this.vy += (this.ty - this.vy) * 0.3;
    if (Math.abs(this.tx - this.vx) < 0.5) this.vx = this.tx;
    if (Math.abs(this.ty - this.vy) < 0.5) this.vy = this.ty;
    this.still++;
  }

  render(g: Game, ctx: CanvasRenderingContext2D, frame: number): void {
    if (!this.placed) this.place(g);
    drawFrameBackground(ctx);
    const art = advance(28);
    if (!art) { this.renderProgress(ctx); return; }
    const world = g.world ?? null;
    const party = partyOnCloth(world);
    if (this.whole) this.renderWhole(ctx, art, party, world?.state.facing ?? 0, frame);
    else {
      const vx = Math.round(this.vx), vy = Math.round(this.vy);
      ctx.drawImage(art.cloth, vx, vy, VIEW.w, VIEW.h, VIEW.x, VIEW.y, VIEW.w, VIEW.h);
      ctx.save();
      ctx.beginPath(); ctx.rect(VIEW.x, VIEW.y, VIEW.w, VIEW.h); ctx.clip();
      ctx.translate(VIEW.x - vx, VIEW.y - vy);
      drawHearth(ctx, frame);
      if (this.mode === 'zones') {
        ctx.drawImage(art.overlay, vx, vy, VIEW.w, VIEW.h, vx, vy, VIEW.w, VIEW.h);
        if (party) drawParty(ctx, party, world?.state.facing ?? 0, frame);
      } else drawNames(ctx, art.names, vx, vy, VIEW.w, VIEW.h);
      ctx.restore();
      if (this.still < 90) drawLocator(ctx, art.thumb, vx, vy, Math.min(1, (90 - this.still) / 30));
    }
    // Keys and where the party is, on the frame under the cloth; the zones' legend above them.
    const yy = 343;
    let where = '';
    if (world) {
      const m = world.map, home = homeMap(MAP_DEFS, m.id);
      const area = areaOf(ATLAS, m.kind === 'outdoor' ? m.id : home?.id ?? m.id);
      where = m.kind === 'outdoor' || !home ? m.name : `${m.name}, ${home.name}`;
      if (area) where = `${roman(area.order)} ${where}`;
      if (m.def.band) where += `  LEVELS ${m.def.band[0]}-${m.def.band[1]}`;
    }
    if (this.mode === 'zones') drawLegend(ctx, 331);
    drawText(ctx, `ARROWS SCROLL  TAB ${this.mode === 'art' ? 'ZONES' : 'MAP ONLY'}  Z ${this.whole ? 'CLOSER' : 'WHOLE MAP'}  SPACE ALMANAC  M CLOSE`, 14, yy, { color: BRASS });
    if (where) drawText(ctx, where.toUpperCase(), 626, yy, { color: TEXT_DIM, align: 'right' });
  }

  /** The cloth being painted: a bar, and what the cartographer is at. */
  private renderProgress(ctx: CanvasRenderingContext2D): void {
    const w = 260, x = VIEW.x + (VIEW.w - w) / 2, y = VIEW.y + VIEW.h / 2;
    ctx.fillStyle = '#120c14'; ctx.fillRect(VIEW.x, VIEW.y, VIEW.w, VIEW.h);
    drawText(ctx, 'UNROLLING THE MAP OF CALDERA', VIEW.x + VIEW.w / 2, y - 18, { color: TEXT, align: 'center' });
    ctx.fillStyle = '#2a2430'; ctx.fillRect(x, y, w, 8);
    ctx.fillStyle = BRASS; ctx.fillRect(x, y, Math.round(w * progress), 8);
    ctx.strokeStyle = '#4a3f52'; ctx.strokeRect(x - 0.5, y - 0.5, w + 1, 9);
    drawText(ctx, 'M CLOSE', 14, 343, { color: BRASS });
  }

  /** The whole cloth fitted to the view: the overlay's colours with each step's numeral, the party, and a frame round what Z goes back to. */
  private renderWhole(ctx: CanvasRenderingContext2D, art: Painted, party: [number, number] | null, facing: number, frame: number): void {
    const { k, w, h, x, y } = WHOLE;
    ctx.fillStyle = '#120c14'; ctx.fillRect(VIEW.x, VIEW.y, VIEW.w, VIEW.h);
    ctx.save();
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(art.cloth, x, y, w, h);
    if (this.mode === 'zones') ctx.drawImage(art.overlay, x, y, w, h);
    ctx.restore();
    const at = (cx: number, cy: number): [number, number] => [x + cx * k, y + cy * k];
    if (this.mode === 'zones') {
      for (const a of ATLAS.areas) {
        const [ax, ay] = at(px(a.label[0]), py(a.label[1])), num = roman(a.order), tw = measureText(num) + 6;
        ctx.fillStyle = '#120c14'; ctx.fillRect(r(ax - tw / 2) - 1, r(ay) - 5, tw + 2, 11);
        ctx.fillStyle = css(stepColor(a.order)); ctx.fillRect(r(ax - tw / 2), r(ay) - 4, tw, 9);
        drawText(ctx, num, r(ax), r(ay) - 3, { color: '#1c1408', align: 'center', shadow: false });
      }
    } else {
      for (const a of ATLAS.areas) {
        const [ax, ay] = at(px(a.label[0]), py(a.label[1]));
        drawTextOutlined(ctx, a.name.toUpperCase(), r(ax), r(ay) - 3, { size: 1, color: '#6a2a18', outline: HALO, thickness: 1, shadow: false, align: 'center' });
      }
    }
    if (party) { const [cx, cy] = at(party[0], party[1]); drawParty(ctx, [cx, cy], facing, frame, 0); }
    const [fx, fy] = at(this.vx, this.vy);
    ctx.strokeStyle = '#fff0b0'; ctx.lineWidth = 1; ctx.strokeRect(r(fx) + 0.5, r(fy) + 0.5, r(VIEW.w * k), r(VIEW.h * k));
  }
}

/** The whole cloth in one image, for tools/worldmap.ts: the art, or the art with the zones over it. */
export function renderCloth(mode: WorldMapMode, world: World | null = null, frame = 0): HTMLCanvasElement {
  const art = paintedNow();
  const cv = canvas(CLOTH.w, CLOTH.h);
  const ctx = cv.getContext('2d')!;
  ctx.drawImage(art.cloth, 0, 0);
  drawHearth(ctx, frame);
  if (mode === 'art') drawNames(ctx, art.names, 0, 0, CLOTH.w, CLOTH.h);
  if (mode === 'zones') {
    ctx.drawImage(art.overlay, 0, 0);
    const party = partyOnCloth(world);
    if (party) drawParty(ctx, party, world?.state.facing ?? 0, frame);
  }
  return cv;
}
