// The grass's look (#1030): the grass of the year, its tiles varying more than most, tufts on it and a
// flower or two from Sowing into Leafturn; and its variants across the land (#1101): the turf, a meadow
// in flower through the summer, the rough in tussocks and bracken, russet from Leafturn.

import { shade, mix } from '../../../lib/art/palettes.ts';
import { hash } from '../../paint/brush.ts';
import { fog, grassColor } from '../common.ts';
import { rampColor } from '../model.ts';
import type { Paint } from '../common.ts';
import type { Ramp } from '../model.ts';
import type { GroundLook, Mark } from './look.ts';

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

/** The meadow's: three tufts, then flowers through the summer, more than the turf's. */
function meadow(p: Paint, m: Mark): void {
  const { ctx, env } = p, { i, x, y, sc, seed, d } = m;
  if (i < 3) { mark(p, m); return; }
  if (hash(seed, 43, i) > 0.85 * flowering(env.day) || env.cover > 0.1) return;
  ctx.fillStyle = fog(p, ['#f0e060', '#ffffff', '#e05a6a', '#c080e0', '#ffffff'][Math.floor(hash(seed, 44, i) * 5)], d);
  ctx.fillRect(Math.round(x), Math.round(y - 2 * sc), Math.max(1, Math.round(2 * sc)), Math.max(1, Math.round(2 * sc)));
}

/** The rough's: a tussock, a dark clump with blades and dead straw standing out of it. */
function tussock(p: Paint, m: Mark): void {
  const { ctx, env } = p, { x, y, sc, base, d } = m;
  if (env.cover > 0.55) return;
  ctx.fillStyle = fog(p, shade(base, 0.72), d);
  ctx.beginPath(); ctx.ellipse(x, y - sc, 3.4 * sc + 0.5, 1.7 * sc + 0.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = fog(p, env.cover > 0.05 ? shade(base, 0.8) : mix(base, '#c8bc78', 0.45), d); ctx.lineWidth = Math.max(1, sc * 0.8);
  ctx.beginPath(); for (const k of [-2.5, -1, 0.5, 2]) { ctx.moveTo(x + k * sc, y - sc); ctx.lineTo(x + k * 1.8 * sc, y - 6 * sc); } ctx.stroke();
}

/** The bracken's: a frond arching out of the ground, its leaflets down both sides, green or russet by the year. */
function frond(p: Paint, m: Mark): void {
  const { ctx, env } = p, { x, y, sc, seed, i, d } = m;
  if (env.cover > 0.55) return;
  const lean = hash(seed, 47, i) < 0.5 ? -1 : 1, c = rampColor(BRACKEN, env.day);
  ctx.strokeStyle = fog(p, i % 2 ? c : shade(c, 0.8), d); ctx.lineWidth = Math.max(1, sc * 0.9);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + lean * sc, y - 7 * sc, x + lean * 5 * sc, y - 5 * sc);
  for (const k of [0.3, 0.5, 0.7]) { const fx = x + lean * k * 4.5 * sc, fy = y - (4 + 2.5 * k) * sc; ctx.moveTo(fx, fy); ctx.lineTo(fx - lean * 1.5 * sc, fy + 2 * sc); ctx.moveTo(fx, fy); ctx.lineTo(fx + lean * 1.2 * sc, fy + 2.2 * sc); }
  ctx.stroke();
}

export const grass: GroundLook = { color: grassColor, drift: { toward: ['#24702a', '#bcae5e'], by: 0.6 }, snow: 0.92, wets: true, splashes: true, ripples: false, vary: 0.08, lies: { marks: 7, mark },
  scatter: ['bush', 'boulder', 'thistle', 'molehill'],
  // Turf, the meadow lighter and flowering, the rough darker in tussocks, bracken by the year.
  variants: { scale: 5, looks: [
    { name: 'meadow', share: 0.22, shift: { toward: '#b8c860', by: 0.5 }, lies: { marks: 9, mark: meadow } },
    { name: 'turf', share: 0.4 },
    { name: 'rough', share: 0.22, shift: { toward: '#2e4022', by: 0.5 }, lies: { marks: 4, mark: tussock } },
    { name: 'bracken', share: 0.16, shift: { toward: (day) => rampColor(BRACKEN, day), by: 0.7 }, lies: { marks: 6, mark: frond } },
  ] } };
