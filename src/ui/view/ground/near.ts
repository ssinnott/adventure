// The ground's detail in the nearest rows (#1102): what a look paints into the company's own square and the one
// ahead (`GroundLook.near`), where the floor fills half the view under the horizon, at the scale those rows allow.
// Each piece falls on a lattice over the square, jittered by the square's seed (its cell's, as the marks are), is
// sized by the plane it lies on, so the square ahead's are about half the size of the company's own, and is drawn
// in whole pixels, flat and hard-edged, a colour at a time. A piece stands where its root is (`Footing`,
// view/ground/edges.ts): a tongue's are rooted under it alone, what lies flat of them kept to it and what stands
// filled over every tongue (`Pixels`); a square's own lie under its marks and tongues, those rooted under a tongue
// kept to the square. The pieces here are the looks' to colour and choose from: blades, fronds, stones, cracks,
// ripples, needles and leaves.

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

/** Past this size a piece is two pixels wide: on the company's own square (2 and more), never on the one ahead (1.9 at most). */
export const WIDE = 1.9;

/** Where a point `x` down and `y` across a lattice falls on the square, `s` deep and `t` across: its footing's lattice, or the square's own. */
const placed = (sq: Square, x: number, y: number): [number, number] => sq.foot?.lattice?.at(x, y) ?? [x, y];

/**
 * Where a square's detail falls: a lattice `rows` deep by `cols` across, laid over the square or, for a tongue,
 * along its edge (its rows shrunk to the tongue's span), each point jittered within its cell by the square's seed
 * and `salt`; those its footing does not keep, those below the view and those more than half the view's height
 * past its sides (no piece reaches so far: the squares at the sides of the nearest rows lie off the view) left out.
 */
export function spots(p: Paint, sq: Square, rows: number, cols: number, salt: number): Spot[] {
  const { cx, horizon, h } = p, { d, l, seed, foot } = sq, bottom = horizon + h / 2 + 2, out: Spot[] = [];
  const n = Math.max(1, Math.round(rows * (foot?.lattice?.span ?? 1)));
  for (let r = 0; r < n; r++) for (let c = 0; c < cols; c++) {
    const i = r * cols + c, [s, t] = placed(sq, (r + 0.15 + 0.7 * hash(seed, salt, i)) / n, (c + 0.15 + 0.7 * hash(seed, salt + 1, i)) / cols);
    if (foot?.keep && !foot.keep(s, t)) continue;
    const [x, y] = floorPt(cx, horizon, h, d, l, s, t);
    if (y > bottom || Math.abs(x - cx) > cx + h / 2) continue;
    const k = unitIn(d, s, h) / 64;
    out.push({ x: Math.round(x), y: Math.round(y), k, w: k > WIDE ? 2 : 1, a: hash(seed, salt + 2, i), b: hash(seed, salt + 3, i), i, s, t });
  }
  return out;
}

/** Rectangles in whole pixels, gathered by colour and filled a colour at a time, in the order each colour was first put. */
interface Layer { put: (c: string, x: number, y: number, w: number, h: number) => void; fill: (p: Paint) => void }
function layer(): Layer {
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
      for (const [c, a] of by) { ctx.fillStyle = c; for (let k = 0; k < a.length; k += 4) ctx.fillRect(a[k], a[k + 1], a[k + 2], a[k + 3]); }
      ctx.restore();
    },
  };
}

/** A square's detail as gathered: what lies flat, filled under the marks and the tongues, and what stands up, filled over them. */
export interface Pixels { flat: Layer; up: Layer }
export const pixels = (): Pixels => ({ flat: layer(), up: layer() });

/** A colour of the square's detail: the ground's colour shaded by `f`, or a colour of its own, then fogged as the floor is. */
export const tone = (p: Paint, sq: Square, c: string | number, base: string): string => fog(p, typeof c === 'number' ? shade(base, c) : c, sq.d);

/** A blade from its root up, `tall` pixels and leaning `lean` whole steps over at its tip, `w` wide: in `lit`, its right side in `dark`. */
export function blade(up: Layer, x: number, y: number, tall: number, lean: number, w: number, lit: string, dark?: string): void {
  const n = Math.abs(lean) + 1, dir = Math.sign(lean);
  for (let j = 0; j < n; j++) {
    const y0 = Math.round(y - (tall * (j + 1)) / n), y1 = Math.round(y - (tall * j) / n), x0 = x + j * dir * w;
    up.put(lit, x0, y0, w, y1 - y0);
    if (dark) up.put(dark, x0 + w, y0, w, y1 - y0);
  }
}

/** A line of whole pixels `w` square, laid a pixel at a time (`at`), each run of them along a row or down a column put as one. */
function trace(on: Layer, c: string, w: number): { at: (x: number, y: number) => void; end: () => void } {
  let rx = 0, ry = 0, rw = 0, rh = 0;
  return {
    at: (fx, fy) => {
      const x = Math.round(fx), y = Math.round(fy);
      if (rw && x >= rx && x + w <= rx + rw && y >= ry && y + w <= ry + rh) return;
      if (rw && rh === w && y === ry && (x === rx + rw || x + w === rx)) { rx = Math.min(rx, x); rw += w; return; }
      if (rw && rw === w && x === rx && (y === ry + rh || y + w === ry)) { ry = Math.min(ry, y); rh += w; return; }
      if (rw) on.put(c, rx, ry, rw, rh);
      rx = x; ry = y; rw = w; rh = w;
    },
    end: () => { if (rw) on.put(c, rx, ry, rw, rh); rw = 0; },
  };
}

/** A line of whole pixels from one point to another, `w` square. */
function dots(on: Layer, c: string, x0: number, y0: number, x1: number, y1: number, w: number): void {
  const n = Math.max(1, Math.round(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) / w)), line = trace(on, c, w);
  for (let j = 0; j <= n; j++) line.at(x0 + ((x1 - x0) * j) / n, y0 + ((y1 - y0) * j) / n);
  line.end();
}

/** How a look's blades stand: the lattice, how tall (pixels at the square ahead's middle, least and most), how far they lean, their two tones and what share of spots stand none. */
interface Blades { rows: number; cols: number; tall: [number, number]; lean: number; lit: string | number; dark: string | number; bare?: number; salt?: number; tuft?: boolean; bias?: number; turns?: boolean }

/**
 * Blades, standing: at each spot one, or a tuft of three, leaning a little either way (or `bias` steps one way)
 * and lit on their left, or (`turns`) each in one tone, lit and dark by turns; buried by a deep snow. A spot
 * `bare` of the time stands none.
 */
export function blades(p: Paint, base: string, sq: Square, o: Blades, px = pixels()): Pixels {
  if (p.env.cover > 0.55) return px;
  const lit = tone(p, sq, o.lit, base), dark = tone(p, sq, o.dark, base);
  for (const q of spots(p, sq, o.rows, o.cols, o.salt ?? 101)) {
    if (q.a < (o.bare ?? 0)) continue;
    const tall = (o.tall[0] + (o.tall[1] - o.tall[0]) * q.b) * q.k, lean = Math.round((q.b * 2 - 1) * o.lean + (o.bias ?? 0));
    const [c, side] = o.turns ? [q.i % 2 ? lit : dark, undefined] : [lit, dark];
    blade(px.up, q.x, q.y, tall, lean, q.w, c, side);
    // A tuft splays from one foot: a blade either side of the first, leaning away from it.
    if (o.tuft) { blade(px.up, q.x - q.w, q.y, tall * 0.7, -1, q.w, c, side); blade(px.up, q.x + q.w, q.y, tall * 0.8, 1, q.w, c, side); }
  }
  return px;
}

/** A sward near to, the grass's, a hill's and a pasture's: short blades lit on their left. */
export const sward = (p: Paint, base: string, sq: Square): Pixels => blades(p, base, sq, { rows: 7, cols: 9, tall: [4, 7], lean: 1, lit: 1.2, dark: 0.8, bare: 0.3 });

/** How a look's stones lie: the lattice, their width in pixels at the square ahead's middle (least and most), what share of spots hold none, and their body, lit top and shadow. */
interface Stones { rows: number; cols: number; size: [number, number]; bare: number; body: string | number; lit: string | number; shadow: string | number; salt?: number }

/** Stones, lying: flat rounded ovals of whole pixels, their top row a pixel in at each end and lit from the left, a shadow under each; buried by a deep snow. */
export function stones(p: Paint, base: string, sq: Square, o: Stones, px = pixels()): Pixels {
  if (p.env.cover > 0.55) return px;
  const body = tone(p, sq, o.body, base), lit = tone(p, sq, o.lit, base), shadow = tone(p, sq, o.shadow, base);
  for (const q of spots(p, sq, o.rows, o.cols, o.salt ?? 111)) {
    if (q.a < o.bare) continue;
    const w = Math.max(2, Math.round((o.size[0] + (o.size[1] - o.size[0]) * q.b * q.b) * q.k)), hh = Math.max(q.w, Math.round(w * 0.5)), x = q.x - Math.floor(w / 2), top = q.y - hh;
    px.flat.put(shadow, x + q.w, q.y, w - q.w, q.w);
    px.flat.put(body, x, top + q.w, w, hh - q.w);
    const rim = w > 2 * q.w + 1 ? q.w : 0;
    px.flat.put(body, x + rim, top, w - 2 * rim, q.w);
    px.flat.put(lit, x + rim, top, Math.max(q.w, Math.round((w - 2 * rim) * 0.6)), q.w);
  }
  return px;
}

/**
 * Cracks, lying: `n` of them, each from a point of the lattice in three jagged steps, a pixel wide (two on the
 * company's own square), kept inside the square; buried by a deep snow.
 */
export function cracks(p: Paint, sq: Square, n: number, c: string, px = pixels(), salt = 121): Pixels {
  if (p.env.cover > 0.55) return px;
  const { cx, horizon, h } = p, { d, l, seed, foot } = sq, w = unitIn(d, 0.9, h) / 64 > WIDE ? 2 : 1, at = (v: number): number => Math.max(0.06, Math.min(0.94, v));
  const screen = (x: number, y: number): [number, number] => floorPt(cx, horizon, h, d, l, ...placed(sq, x, y));
  for (let j = 0; j < n; j++) {
    let x = 0.2 + 0.6 * hash(seed, salt, j), y = 0.15 + 0.7 * hash(seed, salt + 1, j), [sx, sy] = screen(x, y);
    if (foot?.keep && !foot.keep(...placed(sq, x, y))) continue;
    const dir = hash(seed, salt + 2, j) * Math.PI;
    for (let k = 0; k < 3; k++) {
      const turn = dir + (hash(seed, salt + 3, j, k) - 0.5) * 1.4, len = 0.08 + 0.08 * hash(seed, salt + 4, j, k);
      x = at(x + Math.sin(turn) * len); y = at(y + Math.cos(turn) * len);
      const [x1, y1] = screen(x, y);
      dots(px.flat, c, sx, sy, x1, y1, w);
      sx = x1; sy = y1;
    }
  }
  return px;
}

/** How a look's ripples lie: the lattice, how long (pixels either side at the square ahead's middle), their crest and shadow, and whether a deep snow leaves them (the snow's own). */
interface Ripples { rows: number; cols: number; half: number; lit: string | number; shadow: string | number; snowy?: boolean; salt?: number }

/** Ripples, lying: across the square, each a low arc of pixels lit along its crest with its shadow under it; buried by a deep snow but the snow's own. */
export function ripples(p: Paint, base: string, sq: Square, o: Ripples, px = pixels()): Pixels {
  if (p.env.cover > 0.55 && !o.snowy) return px;
  const l = tone(p, sq, o.lit, base), sh = tone(p, sq, o.shadow, base);
  for (const q of spots(p, sq, o.rows, o.cols, o.salt ?? 131)) {
    const half = Math.round(o.half * (0.7 + 0.6 * q.b) * q.k), rise = Math.max(1, Math.round(q.k * 0.8));
    dots(px.flat, sh, q.x - half, q.y + q.w, q.x, q.y + q.w - rise, q.w); dots(px.flat, sh, q.x, q.y + q.w - rise, q.x + half, q.y + q.w, q.w);
    dots(px.flat, l, q.x - half, q.y, q.x, q.y - rise, q.w); dots(px.flat, l, q.x, q.y - rise, q.x + half, q.y, q.w);
  }
  return px;
}

/** How a look's needles or sticks lie: the lattice, their two tones, how long (pixels at the square ahead's middle, least and most). */
interface Needles { rows: number; cols: number; a: string | number; b: string | number; len?: [number, number]; salt?: number }

/** Needles, or sticks, lying: short straight strokes of pixels at every angle in two tones; buried by a deep snow. */
export function needles(p: Paint, base: string, sq: Square, o: Needles, px = pixels()): Pixels {
  if (p.env.cover > 0.55) return px;
  const ca = tone(p, sq, o.a, base), cb = tone(p, sq, o.b, base), [l0, l1] = o.len ?? [2, 4.5];
  for (const q of spots(p, sq, o.rows, o.cols, o.salt ?? 141)) {
    const ang = q.a * Math.PI, len = (l0 + (l1 - l0) * q.b) * q.k, dx = Math.cos(ang) * len, dy = Math.sin(ang) * len * 0.45;
    dots(px.flat, q.i % 2 ? ca : cb, q.x - dx / 2, q.y - dy / 2, q.x + dx / 2, q.y + dy / 2, q.w);
  }
  return px;
}

/** How a look's fronds stand: the lattice, how long (pixels at the square ahead's middle, least and most), their stem and leaflets, and what share of spots stand none. */
interface Fronds { rows: number; cols: number; len: [number, number]; lit: string | number; dark: string | number; bare: number; salt?: number }

/** Fronds, standing: a stem arching over to one side or the other, a leaflet hanging under every other step of it; buried by a deep snow. */
export function fronds(p: Paint, base: string, sq: Square, o: Fronds, px = pixels()): Pixels {
  if (p.env.cover > 0.55) return px;
  const lit = tone(p, sq, o.lit, base), dark = tone(p, sq, o.dark, base);
  for (const q of spots(p, sq, o.rows, o.cols, o.salt ?? 171)) {
    if (q.a < o.bare) continue;
    const len = (o.len[0] + (o.len[1] - o.len[0]) * q.b) * q.k, dir = q.i % 2 ? 1 : -1, n = Math.max(4, Math.round(len / q.w)), stem = trace(px.up, lit, q.w);
    for (let j = 0; j <= n; j++) {
      const f = j / n, x = q.x + dir * len * 0.75 * f, y = q.y - len * 0.9 * Math.sin(f * Math.PI * 0.75);
      stem.at(x, y);
      if (j > 1 && j % 2 === 0) px.up.put(dark, x, y + q.w, q.w, Math.round(2 * q.k * (1.2 - f)) + q.w);
    }
    stem.end();
  }
  return px;
}

/** Leaves, lying: small flat leaves of whole pixels in the colours given, each a little lit along its top; buried by a deep snow. */
export function leaves(p: Paint, base: string, sq: Square, rows: number, cols: number, colours: readonly string[], px = pixels(), salt = 151): Pixels {
  if (p.env.cover > 0.55) return px;
  const cs = colours.map((c) => tone(p, sq, c, base)), lits = colours.map((c) => fog(p, shade(c, 1.18), sq.d));
  for (const q of spots(p, sq, rows, cols, salt)) {
    const j = Math.floor(q.a * cs.length), w = Math.max(2, Math.round((3 + 2 * q.b) * q.k)), hh = Math.max(2, Math.round(1.6 * q.k));
    px.flat.put(cs[j], q.x - w / 2, q.y - hh, w, hh);
    px.flat.put(lits[j], q.x - w / 2, q.y - hh, Math.max(1, Math.round(w / 2)), Math.max(1, Math.round(hh / 2)));
  }
  return px;
}
