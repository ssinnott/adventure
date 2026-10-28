// The atlas's terrain and strokes: the table of terrains a world cell is an index into, the noise,
// the curve through a stroke's points, a river's course, a trail's line and the masks an outline
// is filled by. The grid lays the world with them and the world map paints it with them, so the
// two agree. Pure: nothing here draws.
import type { Pt, River, Trail } from './schema.ts';

// ---------------------------------------------------------------- terrain

/** Every terrain a world cell can be. The order is fixed: cells store an index into it. */
export const TERRAINS = [
  'void', 'sea', 'shallow', 'grass', 'farm', 'steppe', 'forest', 'woods', 'pine', 'deadwood', 'crystal', 'hills',
  'heather', 'marsh', 'sand', 'dunes', 'salt', 'glass', 'vines', 'ash', 'lava', 'snow', 'ice', 'rock',
  'dirt', 'mountain', 'peak', 'cliff', 'chasm', 'volcano', 'road', 'building', 'tidal',
] as const;
export type WorldTerrain = (typeof TERRAINS)[number];
/** Index of each terrain in TERRAINS. */
export const TI = Object.fromEntries(TERRAINS.map((t, i) => [t, i])) as Record<WorldTerrain, number>;

/** What a built map's legend characters are on the world map. */
export const MAP_TERRAIN: Record<string, WorldTerrain> = {
  ',': 'grass', '^': 'hills', 'f': 'farm', 't': 'woods', 'd': 'deadwood', 'c': 'crystal', 'v': 'chasm', '-': 'salt', 'h': 'heather', ';': 'tidal', 'a': 'ash', 'p': 'pine', 'i': 'ice', ':': 'dirt', '=': 'road', '_': 'sand', '~': 'shallow', 'W': 'sea', 'w': 'marsh', '!': 'lava',
  '*': 'snow', 'T': 'forest', 'r': 'rock', 'M': 'mountain', '"': 'rock', 'B': 'building', 'D': 'building',
  'A': 'peak', '|': 'cliff',
  's': 'steppe', 'u': 'dunes', '&': 'vines', 'V': 'volcano', '@': 'volcano',
  'L': 'building', 'S': 'building', '#': 'building', 'o': 'building', '.': 'dirt',
};

/** Water: deep water needs a boat, shallows can be waded. */
export const isWater = (t: number): boolean => t === TI.sea || t === TI.shallow;

// ---------------------------------------------------------------- noise

/** A stable hash of an integer lattice point, 0..1. */
export function lattice(x: number, y: number, seed: number): number {
  let h = Math.imul(x | 0, 0x27d4eb2d) ^ Math.imul(y | 0, 0x165667b1) ^ Math.imul(seed | 0, 0x3c6ef372);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
/** Smooth value noise, 0..1. */
export function noise(x: number, y: number, seed: number): number {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = lattice(xi, yi, seed), b = lattice(xi + 1, yi, seed), c = lattice(xi, yi + 1, seed), d = lattice(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
/** A few octaves of `noise`, 0..1. */
export function fbm(x: number, y: number, seed: number, octaves = 3): number {
  let t = 0, amp = 1, norm = 0, f = 1;
  for (let i = 0; i < octaves; i++) { t += noise(x * f, y * f, seed + i * 31) * amp; norm += amp; amp *= 0.5; f *= 2.03; }
  return t / norm;
}

// ---------------------------------------------------------------- lines and outlines

/** A Catmull-Rom curve through the points, `n` pieces per span; a closed ring wraps round. */
export function spline(pts: readonly Pt[], closed: boolean, n = 6): Pt[] {
  const m = pts.length;
  if (m < 3) return pts.slice();
  const at = (i: number): Pt => (closed ? pts[((i % m) + m) % m] : pts[Math.max(0, Math.min(m - 1, i))]);
  const out: Pt[] = [];
  const spans = closed ? m : m - 1;
  for (let i = 0; i < spans; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      const c = (a: number, b: number, c2: number, d: number): number =>
        0.5 * (2 * b + (c2 - a) * t + (2 * a - 5 * b + 4 * c2 - d) * t2 + (3 * b - a - 3 * c2 + d) * t3);
      out.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  if (!closed) out.push(pts[m - 1]);
  return out;
}

interface Sample { x: number; y: number; s: number; dx: number; dy: number }

/** Points along a polyline every `step` cells, with the distance along it and its heading at each. */
export function resample(line: readonly Pt[], step: number): Sample[] {
  const out: Sample[] = [];
  let s = 0, carry = 0;
  for (let i = 1; i < line.length; i++) {
    const [x0, y0] = line[i - 1], [x1, y1] = line[i];
    const len = Math.hypot(x1 - x0, y1 - y0);
    if (!len) continue;
    const dx = (x1 - x0) / len, dy = (y1 - y0) / len;
    let t = carry;
    while (t <= len) { out.push({ x: x0 + dx * t, y: y0 + dy * t, s: s + t, dx, dy }); t += step; }
    carry = t - len;
    s += len;
  }
  const last = line[line.length - 1];
  if (out.length) { const p = out[out.length - 1]; out.push({ x: last[0], y: last[1], s, dx: p.dx, dy: p.dy }); }
  return out;
}

/** A river's course as the grid and the painter both draw it: the curve through its points, meandering. */
export interface Course { pts: Pt[]; width: number[] }
export function riverCourse(r: River, seed: number): Course {
  const [w0, w1] = r.width ?? [1, 2];
  const line = resample(spline(r.pts, false, 8), 0.5);
  const total = line.length ? line[line.length - 1].s : 0;
  const pts: Pt[] = [], width: number[] = [];
  for (const p of line) {
    const t = total ? p.s / total : 0;
    // Wander side to side, less near the source and not at all at the mouth.
    const taper = Math.min(1, t * 6) * Math.min(1, (1 - t) * 10);
    const off = (noise(p.s / 9, 0.5, seed) - 0.5) * 3.2 * taper;
    pts.push([p.x - p.dy * off, p.y + p.dx * off]);
    width.push(w0 + (w1 - w0) * t);
  }
  return { pts, width };
}

/** A trail's line as drawn: the curve through its points. */
export const trailLine = (t: Trail): Pt[] => spline(t.pts, false, 6);

/** Cells inside a closed ring, even-odd, over the ring's box. */
export interface Mask { x0: number; y0: number; w: number; h: number; d: Uint8Array }
export function fillRing(ring: readonly Pt[], W: number, H: number): Mask {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of ring) { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); }
  const x0 = Math.max(0, Math.floor(minX)), y0 = Math.max(0, Math.floor(minY));
  const x1 = Math.min(W, Math.ceil(maxX + 1)), y1 = Math.min(H, Math.ceil(maxY + 1));
  const w = Math.max(0, x1 - x0), h = Math.max(0, y1 - y0);
  const d = new Uint8Array(w * h);
  const xs: number[] = [];
  for (let j = 0; j < h; j++) {
    const cy = y0 + j + 0.5;
    xs.length = 0;
    for (let i = 0, k = ring.length - 1; i < ring.length; k = i++) {
      const [ax, ay] = ring[k], [bx, by] = ring[i];
      if ((ay <= cy && by > cy) || (by <= cy && ay > cy)) xs.push(ax + ((cy - ay) / (by - ay)) * (bx - ax));
    }
    xs.sort((a, b) => a - b);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const a = Math.max(0, Math.ceil(xs[k] - 0.5 - x0)), b = Math.min(w - 1, Math.floor(xs[k + 1] - 0.5 - x0));
      for (let i = a; i <= b; i++) d[j * w + i] = 1;
    }
  }
  return { x0, y0, w, h, d };
}
export const inMask = (m: Mask, x: number, y: number): boolean => {
  const i = Math.floor(x) - m.x0, j = Math.floor(y) - m.y0;
  return i >= 0 && j >= 0 && i < m.w && j < m.h && m.d[j * m.w + i] === 1;
};
