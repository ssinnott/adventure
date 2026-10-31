// The ground's detail in the nearest rows (#1102): what a look paints into the company's own square and the one
// ahead (`GroundLook.near`), where the floor fills half the view under the horizon, at the scale those rows allow.
// Each piece falls on a lattice over the square, jittered by the square's seed (its cell's, as the marks are), is
// sized by the plane it lies on, so the square ahead's are about half the size of the company's own, and is drawn
// in whole pixels, flat and hard-edged, one fill a colour. What would fall below the view is left out. The pieces
// here are the looks' to colour and choose from: blades, stones, cracks, ripples, needles and leaves.

import { shade } from '../../../lib/art/palettes.ts';
import { hash } from '../../paint/brush.ts';
import { fog, floorPt, unitIn } from '../common.ts';
import type { Paint } from '../common.ts';
import type { Square } from './look.ts';

/**
 * A piece of detail where it falls: on the screen (whole pixels), its size there (`k`, a pixel on the square
 * ahead's middle, two on the company's own), its width in pixels (`w`), two hashes of its own and its place in
 * the square, `s` deep and `t` across.
 */
interface Spot { x: number; y: number; k: number; w: number; a: number; b: number; i: number; s: number; t: number }

/**
 * Where a square's detail falls: a lattice `rows` deep by `cols` across, each point jittered within its cell
 * by the square's seed and `salt`, and those below the view left out.
 */
export function spots(p: Paint, sq: Square, rows: number, cols: number, salt: number): Spot[] {
  const { cx, horizon, h } = p, { d, l, seed } = sq, foot = horizon + h / 2 + 2, out: Spot[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const i = r * cols + c, s = (r + 0.15 + 0.7 * hash(seed, salt, i)) / rows, t = (c + 0.15 + 0.7 * hash(seed, salt + 1, i)) / cols;
    const [x, y] = floorPt(cx, horizon, h, d, l, s, t);
    if (y > foot) continue;
    const k = unitIn(d, s, h) / 64;
    out.push({ x: Math.round(x), y: Math.round(y), k, w: k > 1.5 ? 2 : 1, a: hash(seed, salt + 2, i), b: hash(seed, salt + 3, i), i, s, t });
  }
  return out;
}

/** Rectangles in whole pixels, gathered by colour and filled once a colour, in the order each colour was first put. */
export interface Pixels { put: (c: string, x: number, y: number, w: number, h: number) => void; fill: (p: Paint) => void }
export function pixels(): Pixels {
  const by = new Map<string, number[]>();
  return {
    put: (c, x, y, w, h) => {
      const rx = Math.round(x), ry = Math.round(y), rw = Math.round(x + w) - rx, rh = Math.round(y + h) - ry;
      if (rw <= 0 || rh <= 0) return;
      let a = by.get(c);
      if (!a) by.set(c, a = []);
      a.push(rx, ry, rw, rh);
    },
    fill: ({ ctx }) => {
      ctx.save();
      for (const [c, a] of by) { ctx.beginPath(); for (let k = 0; k < a.length; k += 4) ctx.rect(a[k], a[k + 1], a[k + 2], a[k + 3]); ctx.fillStyle = c; ctx.fill(); }
      ctx.restore();
    },
  };
}

/** A colour of the square's detail: the ground's colour shaded by `f`, or a colour of its own, then fogged as the floor is. */
export const tone = (p: Paint, sq: Square, c: string | number, base: string): string => fog(p, typeof c === 'number' ? shade(base, c) : c, sq.d);

/** A blade from its root up, `tall` pixels and leaning `lean` whole steps over at its tip, `w` wide: in `lit`, its right side in `dark`. */
export function blade(px: Pixels, x: number, y: number, tall: number, lean: number, w: number, lit: string, dark?: string): void {
  const n = Math.abs(lean) + 1, dir = Math.sign(lean);
  for (let j = 0; j < n; j++) {
    const y0 = Math.round(y - (tall * (j + 1)) / n), y1 = Math.round(y - (tall * j) / n), x0 = x + j * dir * w;
    px.put(lit, x0, y0, w, y1 - y0);
    if (dark) px.put(dark, x0 + w, y0, w, y1 - y0);
  }
}

/** A line of whole pixels from one point to another, `w` square. */
function dots(px: Pixels, c: string, x0: number, y0: number, x1: number, y1: number, w: number): void {
  const n = Math.max(1, Math.round(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) / w));
  for (let j = 0; j <= n; j++) px.put(c, x0 + ((x1 - x0) * j) / n, y0 + ((y1 - y0) * j) / n, w, w);
}

/** How a look's blades stand: the lattice, how tall (pixels at the square ahead's middle, least and most), how far they lean, their two tones and what share of spots stand none. */
interface Blades { rows: number; cols: number; tall: [number, number]; lean: number; lit: string | number; dark: string | number; bare?: number; salt?: number; tuft?: boolean; bias?: number; turns?: boolean }

/**
 * Blades: at each spot one, or a tuft of three, leaning a little either way (or `bias` steps one way) and lit on
 * their left, or (`turns`) each in one tone, lit and dark by turns; buried by a deep snow. A spot `bare` of the
 * time stands none.
 */
export function blades(p: Paint, base: string, sq: Square, o: Blades, px = pixels()): Pixels {
  if (p.env.cover > 0.55) return px;
  const lit = tone(p, sq, o.lit, base), dark = tone(p, sq, o.dark, base);
  for (const q of spots(p, sq, o.rows, o.cols, o.salt ?? 101)) {
    if (q.a < (o.bare ?? 0)) continue;
    const tall = (o.tall[0] + (o.tall[1] - o.tall[0]) * q.b) * q.k, lean = Math.round((q.b * 2 - 1) * o.lean + (o.bias ?? 0));
    const [c, side] = o.turns ? [q.i % 2 ? lit : dark, undefined] : [lit, dark];
    blade(px, q.x, q.y, tall, lean, q.w, c, side);
    // A tuft splays from one foot: a blade either side of the first, leaning away from it.
    if (o.tuft) { blade(px, q.x - q.w, q.y, tall * 0.7, -1, q.w, c, side); blade(px, q.x + q.w, q.y, tall * 0.8, 1, q.w, c, side); }
  }
  return px;
}

/** A sward near to, the grass's, a hill's and a pasture's: short blades lit on their left. */
export function sward(p: Paint, base: string, sq: Square): void { blades(p, base, sq, { rows: 7, cols: 9, tall: [4, 7], lean: 1, lit: 1.2, dark: 0.8, bare: 0.3 }).fill(p); }

/** How a look's stones lie: the lattice, their width in pixels at the square ahead's middle (least and most), what share of spots hold none, and their body, lit top and shadow. */
interface Stones { rows: number; cols: number; size: [number, number]; bare: number; body: string | number; lit: string | number; shadow: string | number; salt?: number }

/** Stones: flat rounded ovals of whole pixels, their top row a pixel in at each end and lit from the left, a shadow under each; buried by a deep snow. */
export function stones(p: Paint, base: string, sq: Square, o: Stones, px = pixels()): Pixels {
  if (p.env.cover > 0.55) return px;
  const body = tone(p, sq, o.body, base), lit = tone(p, sq, o.lit, base), shadow = tone(p, sq, o.shadow, base);
  for (const q of spots(p, sq, o.rows, o.cols, o.salt ?? 111)) {
    if (q.a < o.bare) continue;
    const w = Math.max(2, Math.round((o.size[0] + (o.size[1] - o.size[0]) * q.b * q.b) * q.k)), hh = Math.max(q.w, Math.round(w * 0.5)), x = q.x - Math.floor(w / 2), top = q.y - hh;
    px.put(shadow, x + q.w, q.y, w - q.w, q.w);
    px.put(body, x, top + q.w, w, hh - q.w);
    const rim = w > 2 * q.w + 1 ? q.w : 0;
    px.put(body, x + rim, top, w - 2 * rim, q.w);
    px.put(lit, x + rim, top, Math.max(q.w, Math.round((w - 2 * rim) * 0.6)), q.w);
  }
  return px;
}

/**
 * Cracks: `n` of them, each from a point of the square in three jagged steps, a pixel wide (two on the company's
 * own square), kept inside the square; buried by a deep snow.
 */
export function cracks(p: Paint, sq: Square, n: number, c: string, px = pixels(), salt = 121): Pixels {
  if (p.env.cover > 0.55) return px;
  const { cx, horizon, h } = p, { d, l, seed } = sq, w = unitIn(d, 0.9, h) > 96 ? 2 : 1, at = (v: number): number => Math.max(0.06, Math.min(0.94, v));
  for (let j = 0; j < n; j++) {
    let s = 0.2 + 0.6 * hash(seed, salt, j), t = 0.15 + 0.7 * hash(seed, salt + 1, j), [x, y] = floorPt(cx, horizon, h, d, l, s, t);
    const dir = hash(seed, salt + 2, j) * Math.PI;
    for (let k = 0; k < 3; k++) {
      const turn = dir + (hash(seed, salt + 3, j, k) - 0.5) * 1.4, len = 0.08 + 0.08 * hash(seed, salt + 4, j, k);
      s = at(s + Math.sin(turn) * len); t = at(t + Math.cos(turn) * len);
      const [x1, y1] = floorPt(cx, horizon, h, d, l, s, t);
      dots(px, c, x, y, x1, y1, w);
      x = x1; y = y1;
    }
  }
  return px;
}

/** How a look's ripples lie: the lattice, how long (pixels either side at the square ahead's middle), their crest and shadow, and whether a deep snow leaves them (the snow's own). */
interface Ripples { rows: number; cols: number; half: number; lit: string | number; shadow: string | number; snowy?: boolean; salt?: number }

/** Ripples: across the square, each a low arc of pixels lit along its crest with its shadow under it; buried by a deep snow but the snow's own. */
export function ripples(p: Paint, base: string, sq: Square, o: Ripples, px = pixels()): Pixels {
  if (p.env.cover > 0.55 && !o.snowy) return px;
  const l = tone(p, sq, o.lit, base), sh = tone(p, sq, o.shadow, base);
  for (const q of spots(p, sq, o.rows, o.cols, o.salt ?? 131)) {
    const half = Math.round(o.half * (0.7 + 0.6 * q.b) * q.k), rise = Math.max(1, Math.round(q.k * 0.8));
    dots(px, sh, q.x - half, q.y + q.w, q.x, q.y + q.w - rise, q.w); dots(px, sh, q.x, q.y + q.w - rise, q.x + half, q.y + q.w, q.w);
    dots(px, l, q.x - half, q.y, q.x, q.y - rise, q.w); dots(px, l, q.x, q.y - rise, q.x + half, q.y, q.w);
  }
  return px;
}

/** How a look's needles or sticks lie: the lattice, their two tones, how long (pixels at the square ahead's middle, least and most). */
interface Needles { rows: number; cols: number; a: string | number; b: string | number; len?: [number, number]; salt?: number }

/** Needles, or sticks: short straight strokes of pixels at every angle in two tones; buried by a deep snow. */
export function needles(p: Paint, base: string, sq: Square, o: Needles, px = pixels()): Pixels {
  if (p.env.cover > 0.55) return px;
  const ca = tone(p, sq, o.a, base), cb = tone(p, sq, o.b, base), [l0, l1] = o.len ?? [2, 4.5];
  for (const q of spots(p, sq, o.rows, o.cols, o.salt ?? 141)) {
    const ang = q.a * Math.PI, len = (l0 + (l1 - l0) * q.b) * q.k, dx = Math.cos(ang) * len, dy = Math.sin(ang) * len * 0.45;
    dots(px, q.i % 2 ? ca : cb, q.x - dx / 2, q.y - dy / 2, q.x + dx / 2, q.y + dy / 2, q.w);
  }
  return px;
}

/** How a look's fronds stand: the lattice, how long (pixels at the square ahead's middle, least and most), their stem and leaflets, and what share of spots stand none. */
interface Fronds { rows: number; cols: number; len: [number, number]; lit: string | number; dark: string | number; bare: number; salt?: number }

/** Fronds: a stem arching over to one side or the other, a leaflet hanging under every other step of it; buried by a deep snow. */
export function fronds(p: Paint, base: string, sq: Square, o: Fronds, px = pixels()): Pixels {
  if (p.env.cover > 0.55) return px;
  const lit = tone(p, sq, o.lit, base), dark = tone(p, sq, o.dark, base);
  for (const q of spots(p, sq, o.rows, o.cols, o.salt ?? 171)) {
    if (q.a < o.bare) continue;
    const len = (o.len[0] + (o.len[1] - o.len[0]) * q.b) * q.k, dir = q.i % 2 ? 1 : -1, n = Math.max(4, Math.round(len / q.w));
    for (let j = 0; j <= n; j++) {
      const f = j / n, x = q.x + dir * len * 0.75 * f, y = q.y - len * 0.9 * Math.sin(f * Math.PI * 0.75);
      px.put(lit, x, y, q.w, q.w);
      if (j > 1 && j % 2 === 0) px.put(dark, x, y + q.w, q.w, Math.round(2 * q.k * (1.2 - f)) + q.w);
    }
  }
  return px;
}

/** Leaves: small flat leaves of whole pixels in the colours given, each a little lit along its top; buried by a deep snow. */
export function leaves(p: Paint, base: string, sq: Square, rows: number, cols: number, colours: readonly string[], px = pixels(), salt = 151): Pixels {
  if (p.env.cover > 0.55) return px;
  const cs = colours.map((c) => tone(p, sq, c, base)), lits = colours.map((c) => fog(p, shade(c, 1.18), sq.d));
  for (const q of spots(p, sq, rows, cols, salt)) {
    const j = Math.floor(q.a * cs.length), w = Math.max(2, Math.round((3 + 2 * q.b) * q.k)), hh = Math.max(2, Math.round(1.6 * q.k));
    px.put(cs[j], q.x - w / 2, q.y - hh, w, hh);
    px.put(lits[j], q.x - w / 2, q.y - hh, Math.max(1, Math.round(w / 2)), Math.max(1, Math.round(hh / 2)));
  }
  return px;
}
