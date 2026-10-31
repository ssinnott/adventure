// Heather's look (#1030): the moor, purple-brown and purple while it flowers, low clumps on it; and its
// variants across the land (#1101): the heather, bog cotton white on the wet ground through the summer,
// and peat cut in pits with the turves stacked to dry beside them.

import { shade, mix } from '../../../lib/art/palettes.ts';
import { hash } from '../../paint/brush.ts';
import { fog, floorPt, quad } from '../common.ts';
import { heatherBloom } from '../model.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark, Square } from './look.ts';
import { blades, pixels, spots, stones, tone } from './near.ts';
import type { Pixels } from './near.ts';

/** The moor: a purple-brown through the year, purple while the heather flowers. */
function heatherColor(day: number): string { return mix('#644a48', '#7a4a6c', heatherBloom(day)); }

/** A clump, tipped purple in flower. */
function mark(p: Paint, m: Mark): void {
  const { ctx, env } = p, { i, x, y, sc, base, seed, d } = m;
  // Low clumps, dark and wiry, purple-tipped while the heather flowers; a deep snow buries them.
  if (env.cover > 0.55) return;
  const bloom = heatherBloom(env.day);
  ctx.fillStyle = fog(p, shade(base, 0.7), d);
  ctx.beginPath(); ctx.ellipse(x, y - sc, 3 * sc + 0.5, 1.6 * sc + 0.5, 0, 0, Math.PI * 2); ctx.fill();
  if (hash(seed, 56, i) < bloom) { ctx.fillStyle = fog(p, '#a05a94', d); ctx.fillRect(Math.round(x - sc), Math.round(y - 2.5 * sc), Math.max(1, Math.round(2 * sc)), Math.max(1, Math.round(sc))); }
}

/** Bog cotton's heads are out from late Sowing to the end of Harvest. */
function cotton(day: number): number { return Math.max(0, Math.min(1, (day - 24) / 6, (60 - day) / 6)); }

/** Sedge, its white head on it while the cotton is out. */
function sedge(p: Paint, m: Mark): void {
  const { ctx, env } = p, { i, x, y, sc, base, seed, d } = m;
  if (env.cover > 0.55) return;
  ctx.strokeStyle = fog(p, shade(base, 1.25), d); ctx.lineWidth = Math.max(1, sc * 0.7);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 0.8 * sc, y - 4.5 * sc); ctx.moveTo(x + sc, y); ctx.lineTo(x + 1.6 * sc, y - 5.5 * sc); ctx.stroke();
  if (hash(seed, 59, i) < cotton(env.day) && env.cover <= 0.05) {
    const r = Math.max(1, Math.round(1.6 * sc));
    ctx.fillStyle = fog(p, '#f4f2ea', d); ctx.fillRect(Math.round(x + 1.6 * sc - r / 2), Math.round(y - 5.5 * sc - r), r, r);
  }
}

/**
 * A peat pit on two squares in five, dark, its far face cut clean; each its own size and place, so the
 * cuttings never stand in a grid, and none reaching the square's edges.
 */
function pit(p: Paint, base: string, sq: Square): void {
  const { cx, horizon, h, env } = p, { d, l, seed } = sq;
  if (d > 3 || env.cover > 0.55 || hash(seed, 75) > 0.4) return;
  const P = (s: number, t: number): [number, number] => floorPt(cx, horizon, h, d, l, s, t);
  const s0 = 0.2 + 0.2 * hash(seed, 76), s1 = s0 + 0.2 + 0.2 * hash(seed, 77), t0 = 0.12 + 0.25 * hash(seed, 78), t1 = t0 + 0.25 + 0.25 * hash(seed, 79);
  quad(p.ctx, P(s0, t0), P(s0, t1), P(s1, t1), P(s1, t0), fog(p, shade(base, 0.6), d));
  quad(p.ctx, P(s1 - 0.07, t0), P(s1 - 0.07, t1), P(s1, t1), P(s1, t0), fog(p, mix(base, '#6a4630', 0.6), d));
}

/** Turves stacked to dry, in a corner of half the squares. */
function turves(p: Paint, m: Mark): void {
  const { ctx, env } = p, { i, sc, base, d, l, seed } = m;
  if (env.cover > 0.55 || hash(seed, 74, i) > 0.5) return;
  const [x, y] = floorPt(p.cx, p.horizon, p.h, d, l, 0.15 + 0.7 * (i % 2), 0.12 + 0.76 * ((i + 1) % 2));
  const w = Math.max(2, Math.round(4 * sc)), hh = Math.max(1, Math.round(2 * sc));
  ctx.fillStyle = fog(p, shade(base, 0.55), d); ctx.fillRect(Math.round(x - w / 2), Math.round(y - hh), w, hh);
  ctx.fillStyle = fog(p, mix(base, '#5a3c26', 0.7), d); ctx.fillRect(Math.round(x - w / 2), Math.round(y - hh), w, Math.max(1, Math.round(hh / 2)));
}

// Near to (#1102, near.ts): the heather's wiry sprigs, a shoot either side and purple at the tip in flower; the bog
// cotton's sedge, its white heads on it while the cotton is out; the peat crumbled dark between the cuttings.

/** The heather's sprigs near to. */
function sprigs(p: Paint, base: string, sq: Square): Pixels {
  if (p.env.cover > 0.55) return pixels();
  const px = pixels(), stem = tone(p, sq, 0.62, base), lit = tone(p, sq, 1.22, base), bloom = heatherBloom(p.env.day), tip = fog(p, '#a05a94', sq.d);
  for (const q of spots(p, sq, 8, 10, 181)) {
    if (q.a < 0.2) continue;
    const tall = Math.max(3, Math.round((4 + 4 * q.b) * q.k));
    px.up.put(stem, q.x, q.y - tall, q.w, tall);
    for (let j = q.w; j < tall - q.w; j += 2 * q.w) px.up.put(j % (4 * q.w) ? stem : lit, q.x + (j % (4 * q.w) ? q.w : -q.w), q.y - j - q.w, q.w, q.w);
    if (q.b < bloom) px.up.put(tip, q.x - q.w, q.y - tall - q.w, 3 * q.w, q.w);
  }
  return px;
}

/** The bog cotton's: pale sedge, and its white heads on stalks while the cotton is out. */
function cottonNear(p: Paint, base: string, sq: Square): Pixels {
  const px = blades(p, base, sq, { rows: 7, cols: 9, tall: [6, 10], lean: 1, lit: 1.3, dark: 0.85, bare: 0.3 });
  if (p.env.cover <= 0.05) {
    const stalk = tone(p, sq, 0.8, base), head = fog(p, '#f4f2ea', sq.d), under = fog(p, '#c8c4b4', sq.d);
    for (const q of spots(p, sq, 4, 6, 191)) {
      if (q.a > 0.6 * cotton(p.env.day)) continue;
      const top = q.y - Math.round((7 + 4 * q.b) * q.k), w = Math.max(2, Math.round(2.4 * q.k));
      px.up.put(stalk, q.x, top, q.w, q.y - top);
      px.up.put(head, q.x - Math.floor(w / 2), top - w, w, w);
      px.up.put(under, q.x - Math.floor(w / 2), top - q.w, w, q.w);
    }
  }
  return px;
}

/** The peat's: crumbs of it, dark, each lit on its top. */
function crumbs(p: Paint, base: string, sq: Square): Pixels { return stones(p, base, sq, { rows: 7, cols: 9, size: [2, 4], bare: 0.35, body: 0.6, lit: 1.2, shadow: 0.42 }); }

export const heather: GroundLook = { color: heatherColor, drift: { toward: ['#943e88', '#4a3426'], by: 0.6 }, snow: 0.85, wets: true, splashes: true, ripples: false, vary: 0.04, lies: { marks: 7, mark },
  scatter: ['gorse', 'boulder', 'peat'], rank: 6, near: sprigs,
  // The heather; bog cotton on greener, wetter ground; peat cut out of a darker moor.
  variants: { scale: 4, looks: [
    { name: 'bog cotton', share: 0.25, shift: { toward: '#7a8a4a', by: 0.5 }, lies: { marks: 7, mark: sedge }, near: cottonNear },
    { name: 'heather', share: 0.55 },
    { name: 'peat', share: 0.2, shift: { toward: '#3a2820', by: 0.5 }, lays: pit, lies: { marks: 2, mark: turves }, near: crumbs },
  ] } };
