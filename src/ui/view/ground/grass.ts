// The grass's look (#1030): the grass of the year, its tiles varying more than most, tufts on it and a
// flower or two from Sowing into Leafturn.

import { shade } from '../../../lib/art/palettes.ts';
import { hash } from '../../paint/brush.ts';
import { fog, grassColor } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark } from './look.ts';

/** How many flowers are out: none before Sowing or after Leafturn. */
function flowering(day: number): number { return Math.max(0, Math.min(1, (day - 12) / 8, (72 - day) / 10)); }

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

export const grass: GroundLook = { color: grassColor, drift: { toward: ['#3a7e30', '#a6a058'], by: 0.6 }, snow: 0.92, wets: true, splashes: true, ripples: false, vary: 0.08, lies: { marks: 7, mark } };
