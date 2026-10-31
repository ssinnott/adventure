// The grass's look (#1030): the grass of the year, its tiles varying more than most, tufts on it and a
// flower or two from Sowing into Leafturn; and its variants across the land (#1101): the turf, a meadow
// in flower through the summer, the rough in tussocks and bracken, russet from Leafturn.

import { shade, mix } from '../../../lib/art/palettes.ts';
import { hash } from '../../paint/brush.ts';
import { fog, grassColor } from '../common.ts';
import { rampColor } from '../model.ts';
import type { Paint } from '../common.ts';
import type { Ramp } from '../model.ts';
import type { GroundLook, Mark, Square } from './look.ts';
import { blades, fronds, spots, sward, tone } from './near.ts';
import type { Pixels } from './near.ts';

/** How many flowers are out: none before Sowing or after Leafturn. */
export function flowering(day: number): number { return Math.max(0, Math.min(1, (day - 12) / 8, (72 - day) / 10)); }

/** Five tufts, then two flowers. */
function mark(p: Paint, m: Mark): void {
  const { ctx, env } = p, { i, x, y, sc, base, seed, d } = m;
  if (i >= 5) {
    // A flower or two, from Sowing into Leafturn, and none under snow.
    if (hash(seed, 41, i) > 0.45 * flowering(env.day) || env.cover > 0.1) return;
    ctx.fillStyle = fog(p, ['#f0e060', '#ffffff', '#e05a6a', '#c080e0'][Math.floor(hash(seed, 42, i) * 4)], d);
    ctx.fillRect(Math.round(x), Math.round(y - 2 * sc), Math.max(1, Math.round(2 * sc)), Math.max(1, Math.round(2 * sc)));
    return;
  }
  // Tufts poke up through a light snow and are buried by a deep one.
  if (env.cover > 0.55) return;
  const tuft = fog(p, env.cover > 0.05 ? shade(grassColor(env.day), 0.85) : shade(base, 1.3), d);
  ctx.strokeStyle = tuft; ctx.lineWidth = Math.max(1, sc);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 1.5 * sc, y - 4 * sc); ctx.moveTo(x, y); ctx.lineTo(x + 1 * sc, y - 4.5 * sc); ctx.moveTo(x, y); ctx.lineTo(x + 2.5 * sc, y - 3 * sc); ctx.stroke();
}

/** Bracken through the year: dead and brown through the winter, green fronds from late Sowing, russet from Leafturn. */
const BRACKEN: Ramp = [[0, '#7a5232'], [20, '#7a5a34'], [28, '#7a9a2a'], [58, '#7a9a2a'], [66, '#a0622a'], [74, '#a8542a'], [100, '#82502e'], [120, '#7a5232']];

// The variants' marks stand where the turf's do and within a tuft's reach of the spot, so the grass lies as
// flat as it did (the smoke's tones and edges across the square ahead): they differ in colour and in kind.

/** The meadow's: three tufts, then flowers through the summer where the turf has its other tufts and its flowers. */
function meadow(p: Paint, m: Mark): void {
  const { ctx, env } = p, { i, x, y, sc, seed, d } = m;
  if (i < 3) { mark(p, m); return; }
  if (hash(seed, 43, i) > 0.85 * flowering(env.day) || env.cover > 0.1) return;
  ctx.fillStyle = fog(p, ['#f0e060', '#ffffff', '#e05a6a', '#c080e0', '#ffffff'][Math.floor(hash(seed, 44, i) * 5)], d);
  ctx.fillRect(Math.round(x), Math.round(y - 2 * sc), Math.max(1, Math.round(2 * sc)), Math.max(1, Math.round(2 * sc)));
}

/** The rough's: the turf's tufts coarse, dark blades and dead straw by turns; no flowers. */
function coarse(p: Paint, m: Mark): void {
  const { ctx, env } = p, { i, x, y, sc, base, d } = m;
  if (i >= 5 || env.cover > 0.55) return;
  ctx.strokeStyle = fog(p, env.cover > 0.05 ? shade(base, 0.8) : i % 2 ? mix(base, '#c8bc78', 0.5) : shade(base, 0.68), d); ctx.lineWidth = Math.max(1, sc);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 1.5 * sc, y - 4 * sc); ctx.moveTo(x, y); ctx.lineTo(x + 1 * sc, y - 4.5 * sc); ctx.moveTo(x, y); ctx.lineTo(x + 2.5 * sc, y - 3 * sc); ctx.stroke();
}

/** The bracken's: a frond arching over to the right, a leaflet down each side, green or russet by the year. */
function frond(p: Paint, m: Mark): void {
  const { ctx, env } = p, { i, x, y, sc, d } = m;
  if (i >= 5 || env.cover > 0.55) return;
  const c = rampColor(BRACKEN, env.day);
  ctx.strokeStyle = fog(p, i % 2 ? c : shade(c, 0.8), d); ctx.lineWidth = Math.max(1, sc);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 0.4 * sc, y - 4.5 * sc, x + 2.5 * sc, y - 3 * sc);
  ctx.moveTo(x + 0.8 * sc, y - 3.4 * sc); ctx.lineTo(x - 0.8 * sc, y - 2 * sc); ctx.moveTo(x + 1.6 * sc, y - 3.4 * sc); ctx.lineTo(x + 2 * sc, y - 1.6 * sc); ctx.stroke();
}

// Near to (#1102, near.ts): the turf's blades lit on their left, the meadow's flowers on their stalks among them, the
// rough's coarse tussocks with dead straw in them and the bracken's fronds arching over, each a blade's width.

/** The meadow's: its sward, and flowers on their stalks from Sowing into Leafturn, none under snow. */
function meadowNear(p: Paint, base: string, sq: Square): Pixels {
  const px = blades(p, base, sq, { rows: 8, cols: 10, tall: [4, 7], lean: 1, lit: 1.18, dark: 0.82, bare: 0.25 });
  if (p.env.cover <= 0.1) {
    const stalk = tone(p, sq, 0.72, base);
    for (const q of spots(p, sq, 4, 6, 161)) {
      if (q.a > 0.5 * flowering(p.env.day)) continue;
      const c = ['#f0e060', '#ffffff', '#e05a6a', '#c080e0', '#ffffff'][Math.floor(q.b * 5)], top = q.y - Math.round((2 + 2 * q.b) * q.k), w = 2 * q.w;
      px.up.put(stalk, q.x, top, q.w, q.y - top);
      px.up.put(fog(p, c, sq.d), q.x - q.w, top - w, w + q.w, w);
      px.up.put(fog(p, c === '#f0e060' ? '#c08a30' : '#f0d040', sq.d), q.x, top - w, q.w, q.w);
    }
  }
  return px;
}

/** The rough's: tussocks of long coarse blades, a tussock dark or dead straw. */
function roughNear(p: Paint, base: string, sq: Square): Pixels { return blades(p, base, sq, { rows: 5, cols: 7, tall: [6, 10], lean: 1, lit: mix(base, '#c8bc78', 0.45), dark: 0.66, bare: 0.45, tuft: true, turns: true }); }

/** The bracken's: fronds arching over to one side or the other, a leaflet hanging under each step, green or russet by the year. */
function brackenNear(p: Paint, base: string, sq: Square): Pixels {
  const c = rampColor(BRACKEN, p.env.day);
  return fronds(p, base, sq, { rows: 4, cols: 5, len: [9, 15], lit: shade(c, 1.15), dark: shade(c, 0.72), bare: 0.15 });
}

export const grass: GroundLook = { color: grassColor, drift: { toward: ['#24702a', '#bcae5e'], by: 0.6 }, snow: 0.92, wets: true, splashes: true, ripples: false, vary: 0.08, lies: { marks: 7, mark },
  scatter: ['bush', 'boulder', 'thistle', 'molehill'], rank: 4, near: sward,
  // Turf, the meadow lighter and flowering, the rough darker and coarse, bracken by the year.
  variants: { scale: 5, looks: [
    { name: 'meadow', share: 0.22, shift: { toward: '#b8c860', by: 0.5 }, lies: { marks: 7, mark: meadow }, near: meadowNear },
    { name: 'turf', share: 0.4 },
    { name: 'rough', share: 0.22, shift: { toward: '#2e4022', by: 0.5 }, lies: { marks: 5, mark: coarse }, near: roughNear },
    { name: 'bracken', share: 0.16, shift: { toward: (day) => rampColor(BRACKEN, day), by: 0.7 }, lies: { marks: 5, mark: frond }, near: brackenNear },
  ] } };
