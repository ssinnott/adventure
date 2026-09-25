// The world map (M): Caldera as a cloth map, after the ones that came folded in the Might and Magic
// boxes. Painted once at runtime from the atlas and the real outdoor maps, like the rest of the art:
// paper, a per-pixel pass for the sea and the land washes, inked coasts with ripple lines, then
// peaks, trees and sites drawn over it. The cloth is bigger than the screen, so the arrows scroll
// it. Two modes: the map alone, and the zone overlay, which puts every map in the game (built and
// planned) over it, numbered along the road of levels, with the ways between them.
import type { Game, Screen } from '../game/game.ts';
import type { Action } from '../input.ts';
import { is } from '../input.ts';
import { drawText, drawTextOutlined, measureText } from '../lib/engine/text.ts';
import { ATLAS } from '../content/atlas.ts';
import { MAP_DEFS } from '../content/maps/index.ts';
import { worldGrid, zoneEdges, regionRect, worldPoint, homeRegion, regionOfMap } from '../game/atlas.ts';
import type { WorldTerrain, WorldGrid, AtlasSite, AtlasZone, ZoneEdge } from '../game/atlas.ts';
import type { World } from '../game/world.ts';
import { drawFrameBackground } from './frame.ts';
import { BRASS, BRASS_DARK, TEXT, TEXT_DIM, PANEL } from './palette.ts';
import { rgba, hexToRgb } from '../lib/art/palettes.ts';

// ---------------------------------------------------------------- layout

/** Cloth pixels per world cell. */
const S = 5;
/** The cloth's margin round the world grid, where the border band and its sector letters go. */
const PAD = 16;
/** The whole cloth, in its own pixels. */
export const CLOTH = { w: ATLAS.width * S + PAD * 2, h: ATLAS.height * S + PAD * 2 } as const;
/** World cells to cloth pixels. */
const px = (wx: number): number => PAD + wx * S;
const py = (wy: number): number => PAD + wy * S;
/** Where the cloth shows on screen: inside the carved frame, above the key hints. */
const VIEW = { x: 8, y: 8, w: 624, h: 318 } as const;
/** Sector size for the lettered border, in cells, like the A1..E4 squares of the old box maps. */
const SECTOR = 16;

/** Sepia ink, the red ink towns are lettered in, and the paper colour labels are haloed with. */
const INK = '#3b2a1c';
const RED_INK = '#8a2c1a';
const HALO = '#ecdfbf';
const PAPER: RGB = [232, 218, 184];

type RGB = [number, number, number];

// ---------------------------------------------------------------- noise

/** A stable hash of an integer lattice point, 0..1. */
function lattice(x: number, y: number, seed: number): number {
  let h = Math.imul(x | 0, 0x27d4eb2d) ^ Math.imul(y | 0, 0x165667b1) ^ Math.imul(seed | 0, 0x3c6ef372);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
/** Smooth value noise, 0..1. */
function noise(x: number, y: number, seed: number): number {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = lattice(xi, yi, seed), b = lattice(xi + 1, yi, seed), c = lattice(xi, yi + 1, seed), d = lattice(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
/** A few octaves of `noise`, 0..1. */
function fbm(x: number, y: number, seed: number, octaves = 3): number {
  let t = 0, amp = 1, norm = 0, f = 1;
  for (let i = 0; i < octaves; i++) { t += noise(x * f, y * f, seed + i * 31) * amp; norm += amp; amp *= 0.5; f *= 2.03; }
  return t / norm;
}
/**
 * A smooth field sampled every `step` cloth pixels and read back bilinearly: the per-pixel pass
 * reads eight of these a pixel, and evaluating the noise itself at every pixel of a cloth this size
 * would take the better part of a second.
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
const smooth = (a: number, b: number, v: number): number => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };

// ---------------------------------------------------------------- the ground

/** Watercolour washes over the paper, per terrain. Roads and buildings are drawn over grass. */
const WASH: Record<WorldTerrain, RGB> = {
  void: PAPER, grass: [184, 193, 122], forest: [146, 166, 94], pine: [132, 156, 110], deadwood: [158, 152, 132],
  crystal: [168, 148, 176], hills: [202, 180, 122], heather: [170, 140, 138], mountain: [188, 168, 132],
  peak: [214, 216, 210], volcano: [112, 96, 88], marsh: [158, 164, 108], sand: [230, 210, 152],
  dunes: [232, 206, 140], glass: [206, 226, 218], shallow: [150, 188, 192], sea: [92, 138, 162], ice: [214, 230, 238],
  ash: [148, 138, 126], lava: [196, 74, 34], snow: [238, 238, 230], rock: [192, 170, 136], dirt: [208, 184, 134],
  road: [184, 193, 122], building: [184, 193, 122],
};
const SHALLOW: RGB = [156, 192, 194];
const DEEP: RGB = [78, 124, 152];
const FOAM: RGB = [226, 238, 230];
const COAST: RGB = [72, 60, 46];
const LAND_ORDER: WorldTerrain[] = ['grass', 'forest', 'pine', 'deadwood', 'crystal', 'hills', 'heather', 'mountain', 'peak', 'volcano', 'marsh', 'sand', 'dunes', 'glass', 'ice', 'ash', 'lava', 'snow', 'rock', 'dirt'];

/**
 * The paper and everything washed onto it, one pixel at a time: which pixels are sea, land or bare
 * cloth; the land's terrain (a domain-warped look-up, so washes have soft organic edges); each
 * area's own grass; the sea darkening away from the shore; an inked coastline with three ripple
 * lines outside it; a darker rim where one wash meets another, the way pigment pools; folds,
 * stains and worn edges.
 */
function paintGround(ctx: CanvasRenderingContext2D, grid: WorldGrid): void {
  const W = grid.width, H = grid.height;
  const wet = new Float32Array(W * H), empty = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const t = grid.cells[i];
    wet[i] = t === 'sea' || t === 'shallow' ? 1 : 0;
    empty[i] = t === 'void' ? 1 : 0;
  }
  // Soften the sketch's two-cell steps; a built map keeps its single-cell river.
  const soften = (f: Float32Array, keepBuilt: boolean, rad = 1): Float32Array => {
    const o = new Float32Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x;
      if (keepBuilt && grid.built[i]) { o[i] = f[i]; continue; }
      let s = 0, n = 0;
      for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
        s += f[yy * W + xx]; n++;
      }
      o[i] = s / n;
    }
    return o;
  };
  const wetS = soften(wet, true), emptyS = soften(soften(empty, false), false);
  // Each area's grass, blended across its borders.
  const tint = [new Float32Array(W * H), new Float32Array(W * H), new Float32Array(W * H)];
  for (let i = 0; i < W * H; i++) for (let c = 0; c < 3; c++) tint[c][i] = WASH.grass[c];
  for (const reg of ATLAS.regions) {
    if (!reg.tint) continue;
    const rgb = hexToRgb(reg.tint), rr = regionRect(reg);
    for (let y = rr.y; y < rr.y + rr.h; y++) for (let x = rr.x; x < rr.x + rr.w; x++) if (x >= 0 && y >= 0 && x < W && y < H) for (let c = 0; c < 3; c++) tint[c][y * W + x] = rgb[c];
  }
  const tintS = tint.map((t) => soften(soften(t, false, 2), false, 2));
  const bil = (f: Float32Array, wx: number, wy: number): number => {
    const fx = wx - 0.5, fy = wy - 0.5;
    const x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0;
    const at = (x: number, y: number): number => f[Math.max(0, Math.min(H - 1, y)) * W + Math.max(0, Math.min(W - 1, x))];
    const a = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * tx;
    const b = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * tx;
    return a + (b - a) * ty;
  };

  const wxOf = (X: number): number => (X + 0.5 - PAD) / S, wyOf = (Y: number): number => (Y + 0.5 - PAD) / S;
  const paperN = coarse(4, (x, y) => fbm(x * 0.045, y * 0.045, 3, 4));
  const stainN = coarse(8, (x, y) => fbm(x * 0.011 + 3.1, y * 0.011, 41, 3));
  const wobble = coarse(4, (x, y) => fbm(wxOf(x) * 0.21, wyOf(y) * 0.21, 7) - 0.5);
  const warpX = coarse(3, (x, y) => fbm(wxOf(x) * 0.33 + 11.3, wyOf(y) * 0.33, 13) - 0.5);
  const warpY = coarse(3, (x, y) => fbm(wxOf(x) * 0.33, wyOf(y) * 0.33 + 5.7, 17) - 0.5);
  const mottle = coarse(3, (x, y) => fbm(wxOf(x) * 0.55, wyOf(y) * 0.55, 21) - 0.5);

  const SW = CLOTH.w, SH = CLOTH.h, N = SW * SH;
  const kind = new Uint8Array(N);              // 0 cloth, 1 water, 2 land
  const land = new Uint8Array(N);              // index into LAND_ORDER
  const paper = new Float32Array(N);
  const landIndex = new Map(LAND_ORDER.map((t, i) => [t, i]));
  const foldsX = [1, 2, 3].map((k) => Math.round((SW * k) / 4)), foldsY = [1, 2].map((k) => Math.round((SH * k) / 3));
  for (let Y = 0; Y < SH; Y++) for (let X = 0; X < SW; X++) {
    const p = Y * SW + X;
    // The cloth: mottled, stained, worn at the edges, creased where it was folded.
    let f = 1 + (paperN(X, Y) - 0.5) * 0.11 + (lattice(X, Y, 5) - 0.5) * 0.035;
    const stain = stainN(X, Y);
    if (stain > 0.6) f -= (stain - 0.6) * 0.45;
    const edge = Math.min(X, Y, SW - 1 - X, SH - 1 - Y);
    if (edge < 12) f -= 0.2 * (1 - edge / 12) ** 2;
    for (const fx of foldsX) { const d = X - fx; if (d === 0) f -= 0.07; else if (d === 1) f += 0.04; else if (d > -6 && d < 6) f -= 0.012; }
    for (const fy of foldsY) { const d = Y - fy; if (d === 0) f -= 0.07; else if (d === 1) f += 0.04; else if (d > -6 && d < 6) f -= 0.012; }
    paper[p] = f;
    const wx = wxOf(X), wy = wyOf(Y);
    if (wx < 0 || wy < 0 || wx >= W || wy >= H) continue;
    const n = wobble(X, Y);
    if (bil(emptyS, wx, wy) + n * 0.7 > 0.5) continue;
    const cell = Math.floor(wy) * W + Math.floor(wx);
    const wv = bil(wetS, wx, wy) + n * (grid.built[cell] ? 0.3 : 0.42);
    if (wv > 0.5) { kind[p] = 1; continue; }
    kind[p] = 2;
    const warp = grid.built[cell] ? 0.9 : 1.9;
    let t = grid.at(Math.floor(wx + warpX(X, Y) * warp), Math.floor(wy + warpY(X, Y) * warp));
    if (t === 'sea' || t === 'shallow' || t === 'void') {
      t = grid.at(Math.floor(wx), Math.floor(wy));
      if (t === 'sea' || t === 'shallow') t = 'sand';
      else if (t === 'void') t = 'mountain';
    }
    if (t === 'road' || t === 'building') t = 'grass';
    land[p] = landIndex.get(t) ?? 0;
  }

  // Distance from the shore, for the ripple lines and the deepening sea (chamfer 3-4, in thirds of a pixel).
  const dist = new Float32Array(N);
  for (let p = 0; p < N; p++) dist[p] = kind[p] === 1 ? 1e6 : 0;
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

  const img = ctx.createImageData(SW, SH);
  const out = img.data;
  const grassIdx = landIndex.get('grass');
  for (let Y = 0; Y < SH; Y++) for (let X = 0; X < SW; X++) {
    const p = Y * SW + X;
    const k = kind[p];
    let r: number, g: number, b: number;
    if (k === 1) {
      const d = dist[p] / 3;
      const s = smooth(1, 22, d);
      r = SHALLOW[0] + (DEEP[0] - SHALLOW[0]) * s; g = SHALLOW[1] + (DEEP[1] - SHALLOW[1]) * s; b = SHALLOW[2] + (DEEP[2] - SHALLOW[2]) * s;
      const streak = 1 + (noise(wxOf(X) * 0.8, wyOf(Y) * 2.6, 51) - 0.5) * 0.08;
      r *= streak; g *= streak; b *= streak;
      const foam = Math.abs(d - 2.6) < 0.55 ? 0.42 : Math.abs(d - 5.4) < 0.5 ? 0.26 : Math.abs(d - 8.8) < 0.5 ? 0.13 : 0;
      if (foam) { r += (FOAM[0] - r) * foam; g += (FOAM[1] - g) * foam; b += (FOAM[2] - b) * foam; }
    } else if (k === 2) {
      const li = land[p];
      const t = LAND_ORDER[li];
      if (li === grassIdx) { const wx = wxOf(X), wy = wyOf(Y); r = bil(tintS[0], wx, wy); g = bil(tintS[1], wx, wy); b = bil(tintS[2], wx, wy); }
      else { const c = WASH[t]; r = c[0]; g = c[1]; b = c[2]; }
      const m = 1 + mottle(X, Y) * 0.13;
      r *= m; g *= m; b *= m;
      if (t === 'ash' && lattice(X, Y, 61) < 0.1) { r *= 0.8; g *= 0.8; b *= 0.8; }
      else if (t === 'glass' && lattice(X, Y, 62) < 0.03) { r = 250; g = 255; b = 255; }
      else if (t === 'lava') { const hot = noise(wxOf(X) * 1.3, wyOf(Y) * 1.3, 71); if (hot > 0.55) { const h = Math.min(1, (hot - 0.55) * 2.4); r += (255 - r) * h; g += (176 - g) * h; b += (64 - b) * h; } }
      // Where two washes meet the pigment pools a little darker; the shore is inked.
      let shore = false, seam = false, cloth = false;
      if (X > 0 && X < SW - 1 && Y > 0 && Y < SH - 1) for (const q of [p - 1, p + 1, p - SW, p + SW]) {
        if (kind[q] === 1) shore = true;
        else if (kind[q] === 0) cloth = true;
        else if (land[q] !== li) seam = true;
      }
      if (shore) { r = COAST[0]; g = COAST[1]; b = COAST[2]; }
      else {
        if (seam) { r *= 0.92; g *= 0.92; b *= 0.9; }
        if (cloth) { r += (PAPER[0] - r) * 0.35; g += (PAPER[1] - g) * 0.35; b += (PAPER[2] - b) * 0.35; }
      }
    } else { r = PAPER[0]; g = PAPER[1]; b = PAPER[2]; }
    const f = paper[p];
    out[p * 4] = r * f; out[p * 4 + 1] = g * f; out[p * 4 + 2] = b * f; out[p * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
}

// ---------------------------------------------------------------- scattering

/**
 * Points for glyphs over the cells that match, at least `gap` cells apart (a greedy dart throw in a
 * stable order), jittered inside their cells. Built cells may take a tighter gap, so a map's own
 * copse keeps one tree per tree.
 */
function scatter(grid: WorldGrid, match: (t: WorldTerrain) => boolean, gap: number, seed: number, builtGap = gap): { x: number; y: number; r: number }[] {
  const W = grid.width;
  const cand: number[] = [];
  for (let i = 0; i < grid.cells.length; i++) if (match(grid.cells[i])) cand.push(i);
  cand.sort((a, b) => lattice(a, 7, seed) - lattice(b, 7, seed));
  const out: { x: number; y: number; r: number }[] = [];
  const buckets = new Map<number, number[]>();
  const key = (bx: number, by: number): number => by * 1000 + bx;
  for (const i of cand) {
    const x = (i % W) + 0.2 + lattice(i, 1, seed) * 0.6, y = Math.floor(i / W) + 0.2 + lattice(i, 2, seed) * 0.6;
    const g = grid.built[i] ? builtGap : gap;
    const bx = Math.floor(x / 2), by = Math.floor(y / 2);
    let ok = true;
    for (let dy = -2; dy <= 2 && ok; dy++) for (let dx = -2; dx <= 2 && ok; dx++) {
      for (const o of buckets.get(key(bx + dx, by + dy)) ?? []) { const q = out[o]; if ((q.x - x) ** 2 + (q.y - y) ** 2 < g * g) { ok = false; break; } }
    }
    if (!ok) continue;
    const k = key(bx, by);
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k)!.push(out.length);
    out.push({ x, y, r: lattice(i, 3, seed) });
  }
  return out;
}

/** How many cells a mountain cell is from the nearest cell that is not mountain (bigger peaks inside a range). */
function rangeDepth(grid: WorldGrid, x: number, y: number): number {
  const hill = (t: WorldTerrain): boolean => t === 'mountain' || t === 'peak' || t === 'void';
  for (let r = 1; r <= 4; r++) {
    for (let d = -r; d <= r; d++) {
      if (!hill(grid.at(x + d, y - r)) || !hill(grid.at(x + d, y + r)) || !hill(grid.at(x - r, y + d)) || !hill(grid.at(x + r, y + d))) return r;
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
  for (let k = 1; k <= 4; k++) {
    const t = k / 5, hx = ax + (sx - ax) * t + (x + w / 2 - sx) * t * t * 0.6, hy = ay + (y - ay) * t * 0.85;
    ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx - w * 0.1, Math.min(y, hy + h * 0.3)); ctx.stroke();
  }
  if (kind !== 'rock' && h > 6) {
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
  ctx.moveTo(x + lean * 0.45, y - h * 0.5); ctx.lineTo(x + lean * 0.45 - 2.5, y - h * 0.78);
  ctx.moveTo(x + lean * 0.7, y - h * 0.68); ctx.lineTo(x + lean * 0.7 + 2.5, y - h * 0.95);
  ctx.stroke();
  ctx.fillStyle = '#a89c90'; ctx.fillRect(Math.round(x - 1), Math.round(y - h * 0.4), 1, Math.round(h * 0.35));
}

function crystal(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  glow(ctx, x, y - h * 0.5, h * 1.2, '#c890ff', 0.3);
  for (const [dx, k, lean] of [[-2.2, 0.65, -0.3], [0, 1, 0.05], [2.2, 0.55, 0.35]]) {
    const hh = h * k, bx = x + dx, tx = bx + lean * hh;
    poly(ctx, [bx - 1.4, y, tx, y - hh, bx + 1.4, y], '#8a5ac8', '#2a1a3a');
    poly(ctx, [bx - 1.1, y - 0.6, tx, y - hh + 1, bx, y - 0.6], '#e2c8ff');
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

function tuft(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.strokeStyle = '#56603a'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - 2.5, y + 0.5); ctx.lineTo(x + 2.5, y + 0.5);
  ctx.moveTo(x - 1.5, y); ctx.lineTo(x - 2, y - 2);
  ctx.moveTo(x, y); ctx.lineTo(x, y - 3);
  ctx.moveTo(x + 1.5, y); ctx.lineTo(x + 2, y - 2);
  ctx.stroke();
}

function heath(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  const X = Math.round(x), Y = Math.round(y);
  ctx.fillStyle = '#6e3e6c'; ctx.fillRect(X - 2, Y, 1, 1); ctx.fillRect(X + 1, Y - 1, 1, 1); ctx.fillRect(X - 1, Y - 2, 1, 1); ctx.fillRect(X + 2, Y + 1, 1, 1);
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

/** Every terrain glyph on the map, drawn back to front so nearer peaks and trees overlap farther ones. */
function paintGlyphs(ctx: CanvasRenderingContext2D, grid: WorldGrid): void {
  const glyphs: Glyph[] = [];
  const add = (y: number, draw: (c: CanvasRenderingContext2D) => void): void => { glyphs.push({ y, draw }); };
  for (const m of scatter(grid, (t) => t === 'mountain' || t === 'peak', 2.0, 11, 1.4)) {
    const cx = Math.floor(m.x), cy = Math.floor(m.y);
    const t = grid.at(cx, cy);
    const deep = rangeDepth(grid, cx, cy);
    const nearCloth = [[-3, 0], [3, 0], [0, -3], [0, 3]].some(([dx, dy]) => grid.at(cx + dx, cy + dy) === 'void');
    const big = 0.72 + Math.min(deep, 4) * 0.14 + m.r * 0.32;
    const kind = t === 'peak' ? 'snow' : nearCloth ? 'rim' : 'rock';
    add(py(m.y), (c) => peak(c, px(m.x), py(m.y), S * 2.5 * big, S * 2.15 * big, m.r - 0.5, kind));
  }
  for (const f of scatter(grid, (t) => t === 'forest', 0.95, 12, 0.9)) add(py(f.y), (c) => tree(c, px(f.x), py(f.y), S * 0.62 + f.r * 0.6, f.r));
  for (const f of scatter(grid, (t) => t === 'pine', 0.95, 13)) add(py(f.y), (c) => pine(c, px(f.x), py(f.y), S * 1.7 + f.r * 2, grid.at(Math.floor(f.x), Math.floor(f.y) + 1) === 'snow' || f.r > 0.8));
  for (const f of scatter(grid, (t) => t === 'deadwood', 1.2, 18)) add(py(f.y), (c) => deadTree(c, px(f.x), py(f.y), S * 1.5 + f.r * 3, (f.r - 0.5) * 3));
  for (const f of scatter(grid, (t) => t === 'crystal', 1.7, 19)) add(py(f.y), (c) => crystal(c, px(f.x), py(f.y), S * 1.2 + f.r * 4));
  for (const f of scatter(grid, (t) => t === 'hills', 2.4, 14)) add(py(f.y), (c) => hill(c, px(f.x), py(f.y), S * 2.3 + f.r * 3, S * 0.85 + f.r * 1.5, false));
  for (const f of scatter(grid, (t) => t === 'heather', 1.5, 20)) {
    if (f.r > 0.9) add(py(f.y), (c) => hill(c, px(f.x), py(f.y), S * 2.2, S * 0.7, true));
    else add(py(f.y), (c) => heath(c, px(f.x), py(f.y)));
  }
  for (const f of scatter(grid, (t) => t === 'marsh', 1.5, 15)) add(py(f.y), (c) => tuft(c, px(f.x), py(f.y)));
  for (const f of scatter(grid, (t) => t === 'rock', 1.3, 16)) add(py(f.y), (c) => boulder(c, px(f.x), py(f.y), 1 + f.r * 1.2, false));
  for (const f of scatter(grid, (t) => t === 'ash', 3.2, 21)) if (f.r > 0.55) add(py(f.y), (c) => boulder(c, px(f.x), py(f.y), 1 + f.r, true));
  for (const f of scatter(grid, (t) => t === 'dunes', 2.6, 22)) add(py(f.y), (c) => dune(c, px(f.x), py(f.y), S * 2.4 + f.r * 4));
  for (const f of scatter(grid, (t) => t === 'glass', 2.3, 23)) add(py(f.y), (c) => sparkle(c, px(f.x), py(f.y)));
  for (const f of scatter(grid, (t) => t === 'ice', 2.2, 24)) add(py(f.y), (c) => crack(c, px(f.x), py(f.y), S * 1.8, f.r));
  glyphs.sort((a, b) => a.y - b.y);
  for (const g of glyphs) g.draw(ctx);
}

/** The roads of the built maps, and the planned trails, dotted the way a surveyor draws them, with a plank bridge where a road crosses water. */
function paintRoads(ctx: CanvasRenderingContext2D, grid: WorldGrid): void {
  const W = grid.width, H = grid.height;
  const road = (x: number, y: number): boolean => grid.at(x, y) === 'road';
  const wet = (x: number, y: number): boolean => { const t = grid.at(x, y); return t === 'sea' || t === 'shallow'; };
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const path = new Path2D();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!road(x, y)) continue;
    if (road(x + 1, y)) { path.moveTo(px(x + 0.5), py(y + 0.5)); path.lineTo(px(x + 1.5), py(y + 0.5)); }
    if (road(x, y + 1)) { path.moveTo(px(x + 0.5), py(y + 0.5)); path.lineTo(px(x + 0.5), py(y + 1.5)); }
  }
  for (const t of ATLAS.trails) {
    path.moveTo(px(t[0][0]), py(t[0][1]));
    for (let i = 1; i < t.length; i++) {
      const [x0, y0] = t[i - 1], [x1, y1] = t[i];
      // A little wander, so a planned trail does not read as a ruled line.
      const mx = (x0 + x1) / 2 + (lattice(i, t.length, 9) - 0.5) * 2, my = (y0 + y1) / 2 + (lattice(i, t.length, 10) - 0.5) * 2;
      path.quadraticCurveTo(px(mx), py(my), px(x1), py(y1));
    }
  }
  ctx.strokeStyle = rgba('#fff4d8', 0.55); ctx.lineWidth = 2.4; ctx.stroke(path);
  ctx.strokeStyle = '#7a5530'; ctx.lineWidth = 1; ctx.setLineDash([2.5, 1.6]); ctx.stroke(path);
  ctx.setLineDash([]);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!road(x, y)) continue;
    const across = wet(x, y - 1) && wet(x, y + 1), along = wet(x - 1, y) && wet(x + 1, y);
    if (!across && !along) continue;
    const cx = Math.round(px(x + 0.5)), cy = Math.round(py(y + 0.5));
    ctx.fillStyle = INK;
    if (along) { ctx.fillRect(cx - S - 1, cy - 2, S * 2 + 2, 5); ctx.fillStyle = '#b08a58'; ctx.fillRect(cx - S, cy - 1, S * 2, 3); }
    else { ctx.fillRect(cx - 2, cy - S - 1, 5, S * 2 + 2); ctx.fillStyle = '#b08a58'; ctx.fillRect(cx - 1, cy - S, 3, S * 2); }
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

/** The icon for a site, standing on (x, y). */
function drawSite(ctx: CanvasRenderingContext2D, icon: AtlasSite['icon'], x: number, y: number): void {
  const STONE = '#ddd2b8', STONE_D = '#a8997c', RED = '#a8392a', GREEN = '#3f7a3a', WOOD = '#8a6038';
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
    case 'port': {
      ctx.strokeStyle = INK; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(x, y - 3, 3, 0.15 * Math.PI, 0.85 * Math.PI); ctx.moveTo(x, y - 9); ctx.lineTo(x, y); ctx.moveTo(x - 2.5, y - 7); ctx.lineTo(x + 2.5, y - 7); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y - 9.5, 1.2, 0, Math.PI * 2); ctx.stroke();
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
      glow(ctx, x, y - 16, 14, '#ff7a28', 0.45);
      ctx.fillStyle = rgba('#4a4440', 0.5);
      for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(x - 2 + i * 2.5, y - 20 - i * 3.5, 2.4 + i * 0.9, 0, Math.PI * 2); ctx.fill(); }
      poly(ctx, [x - 15, y, x - 3, y - 15, x + 3, y - 15, x + 15, y], '#5e524c');
      poly(ctx, [x + 0.5, y - 15, x + 3, y - 15, x + 15, y, x + 3, y], '#3e3632');
      ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 15, y); ctx.lineTo(x - 3, y - 15); ctx.lineTo(x + 3, y - 15); ctx.lineTo(x + 15, y); ctx.stroke();
      ctx.strokeStyle = '#ff9a38'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(x - 1, y - 15); ctx.quadraticCurveTo(x - 4, y - 8, x - 7, y - 1); ctx.moveTo(x + 1, y - 15); ctx.quadraticCurveTo(x + 2, y - 7, x + 5, y - 1); ctx.stroke();
      ctx.fillStyle = '#ffd070'; ctx.fillRect(r(x - 2), r(y - 16), 4, 1);
      ctx.lineWidth = 1;
      return;
    }
    case 'sunken': {
      for (const [dx, hh] of [[-5, 5], [-2, 8], [1, 3], [4, 6]]) box(ctx, x + dx, y - hh, 2, hh, STONE);
      ctx.fillStyle = rgba('#5a8aa0', 0.7); ctx.fillRect(r(x - 7), r(y - 2), 14, 2);
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
    case 'label': return;
  }
}

/** Cloth position of a site: region-relative sites are placed from their region's corner. */
function sitePos(s: AtlasSite): [number, number] {
  const reg = s.region ? ATLAS.regions.find((x) => x.id === s.region) : undefined;
  const wx = (reg ? reg.at[0] : 0) + s.at[0], wy = (reg ? reg.at[1] : 0) + s.at[1];
  return [px(wx), py(wy)];
}

/** Lettering: sepia with a paper halo so it reads over the washes, spaced capitals for regions. */
function letter(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, opts: { color?: string; spacing?: number; align?: 'left' | 'center' | 'right'; size?: number } = {}): void {
  drawTextOutlined(ctx, text, r(x), r(y), { size: opts.size ?? 1, color: opts.color ?? INK, outline: HALO, thickness: 1, shadow: false, spacing: opts.spacing ?? 1, align: opts.align ?? 'center' });
}

function paintSites(ctx: CanvasRenderingContext2D): void {
  for (const s of ATLAS.sites) { const [x, y] = sitePos(s); drawSite(ctx, s.icon, x, y); }
  for (const s of ATLAS.sites) {
    const [x, y] = sitePos(s);
    const town = s.icon === 'city' || s.icon === 'hold' || s.icon === 'fortress' || s.icon === 'lodge' || (s.icon === 'port' && s.name !== 'Harbour');
    const color = town ? RED_INK : INK;
    if (s.icon === 'label') { letter(ctx, s.name, x, y - 3, { color: s.region ? '#5a3a24' : '#2c4a60', spacing: 2 }); continue; }
    switch (s.label ?? 'below') {
      case 'none': break;
      case 'below': letter(ctx, s.name, x, y + 4, { color }); break;
      case 'above': letter(ctx, s.name, x, y - 24, { color }); break;
      case 'right': letter(ctx, s.name, x + 11, y - 8, { color, align: 'left' }); break;
      case 'left': letter(ctx, s.name, x - 11, y - 8, { color, align: 'right' }); break;
    }
  }
  for (const reg of ATLAS.regions) letter(ctx, reg.name, px(reg.label[0]), py(reg.label[1]), { color: '#6a2a18', spacing: 3 });
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

/** Little wave marks on open water, the smugglers' sloop and the Compact's ship, a serpent, a whirlpool. */
function paintSea(ctx: CanvasRenderingContext2D, grid: WorldGrid): void {
  const hx = px(96), hy = py(79);
  ctx.strokeStyle = rgba('#e8f2ee', 0.7); ctx.lineWidth = 1;
  for (const w of scatter(grid, (t) => t === 'sea', 6, 17)) {
    const x = px(w.x), y = py(w.y);
    if (Math.hypot(x - hx, y - hy) < 34) continue;
    ctx.beginPath(); ctx.moveTo(x - 3, y); ctx.quadraticCurveTo(x - 1.5, y - 2, x, y); ctx.quadraticCurveTo(x + 1.5, y - 2, x + 3, y); ctx.stroke();
  }
  ship(ctx, px(53), py(59), '#a8392a');
  ship(ctx, px(57), py(88), '#3a5aa0');
  serpent(ctx, px(124), py(70));
  whirlpool(ctx, px(112), py(92));
}

// ---------------------------------------------------------------- the border, the title, the rose

/** The cloth's border: two rules with a band between, lettered by sector like the old box maps. */
function paintBorder(ctx: CanvasRenderingContext2D): void {
  const w = CLOTH.w, h = CLOTH.h, B = PAD - 3;
  ctx.fillStyle = rgba('#b89a64', 0.22);
  ctx.fillRect(3, 3, w - 6, B - 2); ctx.fillRect(3, h - B + 1, w - 6, B - 2);
  ctx.fillRect(3, B + 1, B - 2, h - B * 2 - 2); ctx.fillRect(w - B + 1, B + 1, B - 2, h - B * 2 - 2);
  ctx.strokeStyle = INK; ctx.lineWidth = 1;
  ctx.strokeRect(2.5, 2.5, w - 5, h - 5);
  ctx.strokeRect(B + 0.5, B + 0.5, w - B * 2 - 1, h - B * 2 - 1);
  ctx.strokeStyle = rgba(INK, 0.5); ctx.strokeRect(B - 1.5, B - 1.5, w - B * 2 + 3, h - B * 2 + 3);
  const cols = Math.round(ATLAS.width / SECTOR), rows = Math.round(ATLAS.height / SECTOR), cw = SECTOR * S;
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
    drawText(ctx, n, 3 + (B - 2) / 2, cy - 3, { color: INK, shadow: false, align: 'center' });
    drawText(ctx, n, w - B + 1 + (B - 2) / 2, cy - 3, { color: INK, shadow: false, align: 'center' });
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
  const x = PAD + 14, y = PAD + 12, w = 176, h = 56;
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
  drawText(ctx, "CARTOGRAPHERS' GUILD", x + w / 2, y + 43, { color: '#7a5a3a', align: 'center', shadow: false });
}

/** An eight-point compass rose, top right. */
function paintCompass(ctx: CanvasRenderingContext2D): void {
  const cx = CLOTH.w - PAD - 44, cy = PAD + 44, R = 28;
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
  const x = PAD + 16, y = CLOTH.h - PAD - 20, seg = 8 * S;
  for (let i = 0; i < 4; i++) { ctx.fillStyle = i % 2 ? '#efe4c6' : INK; ctx.fillRect(x + i * seg, y, seg, 3); }
  ctx.strokeStyle = INK; ctx.strokeRect(x + 0.5, y + 0.5, seg * 4 - 1, 3);
  drawText(ctx, '0', x, y - 9, { color: INK, shadow: false, align: 'center' });
  drawText(ctx, '16', x + seg * 2, y - 9, { color: INK, shadow: false, align: 'center' });
  drawText(ctx, '32 SQUARES', x + seg * 4 - 2, y - 9, { color: INK, shadow: false, align: 'left' });
}

// ---------------------------------------------------------------- the painted map, cached

let artCache: HTMLCanvasElement | null = null;

/** The whole painted cloth, drawn once. */
export function worldArt(): HTMLCanvasElement {
  if (artCache) return artCache;
  const cv = document.createElement('canvas'); cv.width = CLOTH.w; cv.height = CLOTH.h;
  const ctx = cv.getContext('2d')!;
  const grid = worldGrid(ATLAS, MAP_DEFS);
  paintGround(ctx, grid);
  paintRoads(ctx, grid);
  paintSea(ctx, grid);
  paintGlyphs(ctx, grid);
  paintSites(ctx);
  paintBorder(ctx);
  paintCartouche(ctx);
  paintCompass(ctx);
  paintScale(ctx);
  artCache = cv;
  return cv;
}

/** The Hearth burns over the painted sea: a warm pool on the water and a flickering column. Cloth coordinates. */
function drawHearth(ctx: CanvasRenderingContext2D, frame: number): void {
  const x = px(96), y = py(79) - 4;
  const flick = 0.82 + 0.18 * Math.sin(frame / 7) * Math.sin(frame / 3.1);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  glow(ctx, x, y + 2, 44, '#ffc070', 0.32 * flick);
  const col = ctx.createLinearGradient(0, y - 56, 0, y);
  col.addColorStop(0, rgba('#fff0c0', 0)); col.addColorStop(1, rgba('#ffe0a0', 0.7 * flick));
  ctx.fillStyle = col; ctx.fillRect(x - 2, y - 56, 4, 56);
  ctx.fillStyle = rgba('#fff6dc', 0.8 * flick); ctx.fillRect(x - 0.5, y - 46, 1, 46);
  ctx.restore();
}

// ---------------------------------------------------------------- the zone overlay

/** Step numbers the way the old games numbered their maps' quarters. */
export function roman(n: number): string {
  let s = '';
  for (const [v, t] of [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']] as const) while (n >= v) { s += t; n -= v; }
  return s;
}

/** A plate's box for a zone: one line, the name and the band, with a mark for its kind. */
interface Plate { zone: AtlasZone; name: string; band: string; x: number; y: number; w: number; h: number; built: boolean }

function plates(): Plate[] {
  return ATLAS.zones.map((z) => {
    const def = MAP_DEFS.find((d) => d.id === z.id);
    const base = (def?.name ?? z.name ?? z.id).toUpperCase();
    const name = z.order != null ? `${roman(z.order)} ${base}` : base;
    const b = def?.band ?? z.band;
    const band = b ? (b[0] === b[1] ? `${b[0]}` : `${b[0]}-${b[1]}`) : '';
    const w = 14 + measureText(name) + (band ? measureText(band) + 6 : 0), h = 13;
    return { zone: z, name, band, x: r(px(z.at[0]) - w / 2), y: r(py(z.at[1]) - h / 2), w, h, built: !!def };
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
const PLANNED_WAY = '#c8c0d8';

/** A tiny boat for the middle of a sea route. */
function boat(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  poly(ctx, [x - 5, y, x + 5, y, x + 3, y + 3, x - 3, y + 3], '#8a5a34', '#120c14');
  ctx.fillStyle = '#120c14'; ctx.fillRect(r(x), r(y - 8), 1, 8);
  poly(ctx, [x + 1, y - 8, x + 5, y - 3, x + 1, y - 2], '#f2ead6', '#120c14');
}

function drawEdge(ctx: CanvasRenderingContext2D, e: ZoneEdge, find: (id: string) => Plate | undefined, centre: (id: string) => [number, number] | undefined): void {
  const endAt = (id: string, p: readonly [number, number] | undefined): { pt: [number, number]; plate?: Plate } | null => {
    if (p) return { pt: [px(p[0]), py(p[1])] };
    const pl = find(id);
    if (pl) return { pt: [pl.x + pl.w / 2, pl.y + pl.h / 2], plate: pl };
    const c = centre(id);
    return c ? { pt: c } : null;
  };
  const A = endAt(e.from, e.a), B = endAt(e.to, e.b);
  if (!A || !B) return;
  let [ax, ay] = A.pt, [bx, by] = B.pt;
  if (A.plate) [ax, ay] = clipToBox(bx, by, A.plate);
  if (B.plate) [bx, by] = clipToBox(ax, ay, B.plate);
  // A way across a shared border is only a cell or two long; stretch it so it reads as an arrow.
  const len = Math.hypot(bx - ax, by - ay);
  if (len < 36 && !A.plate && !B.plate) {
    const ux = (bx - ax) / (len || 1), uy = (by - ay) / (len || 1), grow = (36 - len) / 2;
    ax -= ux * grow; ay -= uy * grow; bx += ux * grow; by += uy * grow;
  }
  const bow = e.kind === 'sea' ? 0.24 : 0;
  const mx = (ax + bx) / 2 - (by - ay) * bow, my = (ay + by) / 2 + (bx - ax) * bow;
  const path = (): void => { ctx.beginPath(); ctx.moveTo(ax, ay); ctx.quadraticCurveTo(mx, my, bx, by); };
  const main = e.kind === 'road' || e.kind === 'sea';
  const color = e.planned && e.kind !== 'sea' && e.kind !== 'deep' ? PLANNED_WAY : EDGE_COLOR[e.kind];
  ctx.save();
  ctx.lineCap = 'round';
  const wide = main ? 3 : 2;
  if (e.planned) ctx.setLineDash(e.kind === 'sea' ? [5, 3] : [3, 3]);
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = wide + 2; path(); ctx.stroke();
  ctx.strokeStyle = color; ctx.lineWidth = wide; path(); ctx.stroke();
  ctx.setLineDash([]);
  arrowHead(ctx, bx, by, Math.atan2(by - my, bx - mx), color, main ? 6 : 5);
  if (e.both) arrowHead(ctx, ax, ay, Math.atan2(ay - my, ax - mx), color, main ? 6 : 5);
  const qx = 0.25 * ax + 0.5 * mx + 0.25 * bx, qy = 0.25 * ay + 0.5 * my + 0.25 * by;
  if (e.kind === 'sea') boat(ctx, qx, qy - 2);
  // What the way waits on: a padlock and the quests for a built gate, the step for a planned one.
  const lines: { text: string; color: string }[] = [];
  if (e.gate.length) lines.push({ text: e.gate.map((f) => f.replace(/^q_/, '').replace(/_done$/, '')).join(' + ').toUpperCase(), color: '#ff8a7a' });
  if (e.note) lines.push({ text: e.note.toUpperCase(), color: e.kind === 'sea' ? '#a8dcf8' : e.kind === 'deep' ? '#d8b0ff' : '#e0d8f0' });
  if (e.opens) lines.push({ text: `OPENS AFTER ${roman(e.opens)}`, color: '#ffb86a' });
  if (e.gate.length) {
    ctx.fillStyle = '#120c14'; ctx.fillRect(r(qx) - 4, r(qy) - 3, 9, 8);
    ctx.fillStyle = '#e0453c'; ctx.fillRect(r(qx) - 3, r(qy) - 1, 7, 5);
    ctx.strokeStyle = '#e0453c'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(r(qx) + 0.5, r(qy) - 1, 2.5, Math.PI, 0); ctx.stroke();
  }
  // Notes go where the atlas puts them; otherwise beside a way that runs up and down, and under one
  // that runs across.
  const vertical = Math.abs(by - ay) > Math.abs(bx - ax) * 1.4;
  const at = e.noteAt ? [px(e.noteAt[0]), py(e.noteAt[1])] : null;
  lines.forEach((l, i) => {
    const tw = measureText(l.text);
    const tx = at ? r(at[0] - tw / 2) : vertical ? r(qx) + 9 : r(qx) - tw / 2;
    const ty = at ? r(at[1]) - lines.length * 5 + i * 10 : vertical ? r(qy) - 4 - (lines.length - 1) * 5 + i * 10 : r(qy) + 8 + i * 10;
    ctx.fillStyle = 'rgba(14,10,16,0.78)'; ctx.fillRect(tx - 2, ty - 1, tw + 4, 9);
    drawText(ctx, l.text, tx, ty, { color: l.color });
  });
  ctx.restore();
}

function drawPlate(ctx: CanvasRenderingContext2D, p: Plate, here: boolean, frame: number): void {
  const { x, y, w, h } = p;
  ctx.fillStyle = rgba(PANEL, p.built ? 0.94 : 0.84); ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 1; ctx.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1);
  if (p.built) { ctx.strokeStyle = here && (frame >> 4) & 1 ? '#fff0b0' : BRASS; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); }
  else { ctx.setLineDash([2, 2]); ctx.strokeStyle = '#8a8aa0'; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); ctx.setLineDash([]); }
  // The kind: a roof for a town, an arch for a dungeon, a spiral for the Underdeep.
  const kx = x + 4, ky = y + 3, c = p.built ? BRASS : '#9a9ab0';
  ctx.fillStyle = c;
  if (p.zone.kind === 'town') { ctx.fillRect(kx, ky + 3, 5, 4); poly(ctx, [kx - 1, ky + 3.5, kx + 2.5, ky, kx + 6, ky + 3.5], c); }
  else if (p.zone.kind === 'dungeon') { ctx.fillRect(kx, ky + 1, 5, 6); ctx.fillStyle = '#120c14'; ctx.fillRect(kx + 1, ky + 3, 3, 4); }
  else { ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(kx + 2.5, ky + 3.5, 3, 0, Math.PI * 1.6); ctx.stroke(); ctx.beginPath(); ctx.arc(kx + 2.5, ky + 3.5, 1.2, 0, Math.PI * 2); ctx.stroke(); }
  drawText(ctx, p.name, x + 12, y + 3, { color: p.built ? TEXT : '#c4c0d4' });
  if (p.band) drawText(ctx, p.band, x + w - 4, y + 3, { color: p.built ? BRASS : '#9a9ab4', align: 'right' });
  if (here) drawText(ctx, 'YOU ARE HERE', x + w / 2, y + h + 3, { color: '#ffe08a', align: 'center' });
}

/**
 * The zones over the whole cloth: every outdoor area as its real footprint, numbered along the road
 * of levels (a built one in brass with its map's band, a planned one dashed); every town, dungeon
 * and Underdeep step as a plate; and an arrow for every way between them, taken from the maps' exits
 * where they exist, with the step after which a planned way opens. Cloth coordinates.
 */
export function drawZones(ctx: CanvasRenderingContext2D, world: World | null, frame: number): void {
  const B = PAD - 3;
  ctx.fillStyle = 'rgba(14,10,16,0.44)'; ctx.fillRect(B + 1, B + 1, CLOTH.w - B * 2 - 2, CLOTH.h - B * 2 - 2);
  const here = world?.state.mapId;
  const ps = plates();
  const find = (id: string): Plate | undefined => ps.find((p) => p.zone.id === id);
  const centre = (id: string): [number, number] | undefined => {
    const reg = ATLAS.regions.find((q) => q.id === id || q.map === id);
    if (!reg) return undefined;
    const rr = regionRect(reg);
    return [px(rr.x + rr.w / 2), py(rr.y + rr.h / 2)];
  };
  for (const reg of ATLAS.regions) {
    const rr = regionRect(reg);
    const def = reg.map ? MAP_DEFS.find((d) => d.id === reg.map) : undefined;
    const X = px(rr.x), Y = py(rr.y), Wd = rr.w * S, Ht = rr.h * S;
    ctx.fillStyle = def ? 'rgba(224,176,64,0.13)' : 'rgba(150,160,200,0.10)'; ctx.fillRect(X, Y, Wd, Ht);
    ctx.save();
    if (def) {
      ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3; ctx.strokeRect(X + 0.5, Y + 0.5, Wd - 1, Ht - 1);
      ctx.strokeStyle = def.id === here && (frame >> 4) & 1 ? '#fff0b0' : BRASS; ctx.lineWidth = 1; ctx.strokeRect(X + 0.5, Y + 0.5, Wd - 1, Ht - 1);
    } else { ctx.setLineDash([4, 3]); ctx.strokeStyle = '#a8b4c8'; ctx.lineWidth = 1; ctx.strokeRect(X + 0.5, Y + 0.5, Wd - 1, Ht - 1); }
    ctx.restore();
    // The step badge, then the name and band on a tab.
    const num = roman(reg.order);
    const bw = measureText(num) + 8;
    ctx.fillStyle = def ? BRASS : '#6a6a84'; ctx.fillRect(X + 1, Y + 1, bw, 13);
    drawText(ctx, num, X + 1 + bw / 2, Y + 4, { color: def ? '#1c1408' : '#f0f0ff', align: 'center', shadow: false });
    const band = def?.band ?? reg.band;
    const title = reg.name.toUpperCase() + (band ? `  ${band[0]}-${band[1]}` : '');
    const tw = measureText(title) + 8;
    ctx.fillStyle = def ? rgba('#3a2a10', 0.94) : rgba('#20202c', 0.88); ctx.fillRect(X + 1 + bw, Y + 1, tw, 13);
    drawText(ctx, title, X + 5 + bw, Y + 4, { color: def ? '#ffe08a' : '#d0d0e4' });
    const sub = def ? `BUILT  ${def.rows[0].length}X${def.rows.length}` : 'PLANNED';
    const sw = measureText(sub) + 8;
    ctx.fillStyle = 'rgba(14,10,16,0.7)'; ctx.fillRect(X + 1, Y + 14, sw, 10);
    drawText(ctx, sub, X + 5, Y + 15, { color: def ? BRASS : '#9a9ab8' });
  }
  for (const e of zoneEdges(ATLAS, MAP_DEFS)) drawEdge(ctx, e, find, centre);
  for (const p of ps) drawPlate(ctx, p, p.zone.id === here, frame);
  if (world) {
    const pt = worldPoint(ATLAS, world.state.mapId, world.state.x, world.state.y);
    if (pt) {
      const cx = px(pt[0]), cy = py(pt[1]), f = world.state.facing, s = 5;
      const pts = f === 0 ? [cx, cy - s, cx - s, cy + s, cx + s, cy + s] : f === 1 ? [cx + s, cy, cx - s, cy - s, cx - s, cy + s] : f === 2 ? [cx, cy + s, cx - s, cy - s, cx + s, cy - s] : [cx - s, cy, cx + s, cy - s, cx + s, cy + s];
      poly(ctx, pts, (frame >> 4) & 1 ? '#ff5a4a' : '#ffb0a0', '#120c14');
      ctx.fillStyle = 'rgba(14,10,16,0.78)'; ctx.fillRect(r(cx) + 7, r(cy) - 5, measureText('YOU') + 4, 9);
      drawText(ctx, 'YOU', r(cx) + 9, r(cy) - 4, { color: '#ffe08a' });
    }
  }
}

/** The overlay's legend: one line on the frame under the cloth, so nothing on the map is covered. */
function drawLegend(ctx: CanvasRenderingContext2D, y: number): void {
  let x = 14;
  const label = (t: string, color = TEXT): void => { drawText(ctx, t, x, y, { color }); x += measureText(t) + 12; };
  ctx.fillStyle = BRASS; ctx.fillRect(x, y - 1, 11, 9); drawText(ctx, 'I', x + 6, y, { color: '#1c1408', align: 'center', shadow: false }); x += 15;
  label('STEP');
  ctx.strokeStyle = BRASS; ctx.lineWidth = 2; ctx.strokeRect(x + 1, y, 9, 6); ctx.lineWidth = 1; x += 14;
  label('BUILT');
  ctx.setLineDash([2, 2]); ctx.strokeStyle = '#a8b4c8'; ctx.strokeRect(x + 1.5, y + 0.5, 9, 6); ctx.setLineDash([]); x += 14;
  label('PLANNED', '#c4c0d4');
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
  way('enter', true, 'PLANNED WAY');
  way('sea', true, 'BY SEA');
  way('deep', true, 'DOWN');
  ctx.fillStyle = '#e0453c'; ctx.fillRect(x + 1, y + 1, 7, 5); x += 12;
  label('QUEST GATE');
}

/** The whole cloth, small, with the part on screen boxed: top right of the view. Screen coordinates. */
function drawLocator(ctx: CanvasRenderingContext2D, vx: number, vy: number, alpha: number): void {
  const w = 104, h = Math.round((w * CLOTH.h) / CLOTH.w), x = VIEW.x + VIEW.w - w - 6, y = VIEW.y + 6;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#120c14'; ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(worldArt(), 0, 0, CLOTH.w, CLOTH.h, x, y, w, h);
  ctx.imageSmoothingEnabled = false;
  ctx.strokeStyle = BRASS; ctx.lineWidth = 1; ctx.strokeRect(x - 1.5, y - 1.5, w + 3, h + 3);
  const k = w / CLOTH.w;
  ctx.strokeStyle = '#fff0b0'; ctx.strokeRect(r(x + vx * k) + 0.5, r(y + vy * k) + 0.5, r(VIEW.w * k), r(VIEW.h * k));
  ctx.restore();
}

// ---------------------------------------------------------------- the screen

export type WorldMapMode = 'art' | 'zones';

/** Where on the cloth the party is: its cell on a built area, else its town or dungeon's plate. */
function partyOnCloth(world: World | null): [number, number] | null {
  if (!world) return null;
  const pt = worldPoint(ATLAS, world.state.mapId, world.state.x, world.state.y);
  if (pt) return [px(pt[0]), py(pt[1])];
  const z = ATLAS.zones.find((q) => q.id === world.state.mapId);
  if (z) return [px(z.at[0]), py(z.at[1])];
  const home = homeRegion(MAP_DEFS, world.state.mapId);
  const reg = home ? regionOfMap(ATLAS, home.id) : undefined;
  if (reg) { const rr = regionRect(reg); return [px(rr.x + rr.w / 2), py(rr.y + rr.h / 2)]; }
  return null;
}

/**
 * M opens it on the party; the arrows scroll the cloth; Tab or Space turns the zone overlay on and
 * off; M or Esc closes it. Nothing is pinned over the cloth at rest: a locator shows while it scrolls.
 */
export class WorldMapScreen implements Screen {
  private vx = 0; private vy = 0; private tx = 0; private ty = 0;
  private placed = false;
  /** Steps since the last scroll, for fading the locator out in the art mode. */
  private still = 999;

  constructor(public mode: WorldMapMode = 'art') {}

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
    if (a) {
      if (is(a, 'cancel') || is(a, 'map')) { g.pop(); return; }
      if (is(a, 'next') || is(a, 'interact')) this.mode = this.mode === 'art' ? 'zones' : 'art';
      const step = 64;
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
    const vx = Math.round(this.vx), vy = Math.round(this.vy);
    ctx.drawImage(worldArt(), vx, vy, VIEW.w, VIEW.h, VIEW.x, VIEW.y, VIEW.w, VIEW.h);
    const world = g.world ?? null;
    ctx.save();
    ctx.beginPath(); ctx.rect(VIEW.x, VIEW.y, VIEW.w, VIEW.h); ctx.clip();
    ctx.translate(VIEW.x - vx, VIEW.y - vy);
    drawHearth(ctx, frame);
    if (this.mode === 'zones') drawZones(ctx, world, frame);
    ctx.restore();
    if (this.still < 90) drawLocator(ctx, vx, vy, Math.min(1, (90 - this.still) / 30));
    // Keys and where the party is, on the frame under the cloth; the zones' legend above them.
    const yy = 343;
    let where = '';
    if (world) {
      const m = world.map, home = homeRegion(MAP_DEFS, m.id);
      where = m.kind === 'outdoor' || !home ? m.name : `${m.name}, ${home.name}`;
      if (m.def.band) where += `  LEVELS ${m.def.band[0]}-${m.def.band[1]}`;
    }
    if (this.mode === 'zones') drawLegend(ctx, 331);
    drawText(ctx, `ARROWS SCROLL   TAB ${this.mode === 'art' ? 'ZONES' : 'MAP ONLY'}   M CLOSE`, 14, yy, { color: BRASS });
    if (where) drawText(ctx, where.toUpperCase(), 626, yy, { color: TEXT_DIM, align: 'right' });
  }
}

/** The whole cloth in one image, for tools/worldmap.ts: the art, or the art with the zones over it. */
export function renderCloth(mode: WorldMapMode, world: World | null = null, frame = 0): HTMLCanvasElement {
  const cv = document.createElement('canvas'); cv.width = CLOTH.w; cv.height = CLOTH.h;
  const ctx = cv.getContext('2d')!;
  ctx.drawImage(worldArt(), 0, 0);
  drawHearth(ctx, frame);
  if (mode === 'zones') drawZones(ctx, world, frame);
  return cv;
}
