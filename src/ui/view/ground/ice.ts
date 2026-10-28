// The ice's look (#1030): a frozen lake through the year, its tiles even, black ice and hairlines in it;
// it takes all the snow that falls.

import { shade } from '../../../lib/art/palettes.ts';
import { hash } from '../../paint/brush.ts';
import { fog, unitIn, floorPt } from '../common.ts';
import { iceColor } from '../model.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark } from './look.ts';

/** The black ice and the light along it, then hairlines. */
function mark(p: Paint, m: Mark): void {
  const { ctx, cx, horizon, h, env } = p, { i, s, t, x, y, sc, base, seed, d, l } = m;
  // A frozen lake: a patch of black ice, the light lying along it and hairlines frozen into it.
  // A deep snow lies over all of it.
  if (env.cover > 0.55) return;
  if (i < 2) {
    // The black ice and the light along it, kept inside the square, so neither reaches the foot of a wall beyond.
    if (d > 2) return;
    const ds = 0.25 + 0.45 * s, [px, py] = floorPt(cx, horizon, h, d, l, ds, 0.25 + 0.5 * t), pw = unitIn(d, ds, h) * (i ? 0.3 : 0.18 + 0.1 * hash(seed, 59)), ph = pw * (i ? 0.08 : 0.2);
    ctx.beginPath(); ctx.ellipse(px, py, pw, ph, 0, 0, Math.PI * 2); ctx.fillStyle = fog(p, shade(base, i ? 1.12 : 0.78), d); ctx.fill();
  } else {
    const a = (hash(seed, 60, i) - 0.5) * 1.6, len = (4 + 5 * hash(seed, 61, i)) * sc, b = a + (hash(seed, 62, i) - 0.5);
    ctx.strokeStyle = fog(p, shade(base, 1.2), d); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * len, y - Math.sin(a) * len * 0.4); ctx.lineTo(x, y); ctx.lineTo(x + Math.cos(b) * len, y + Math.sin(b) * len * 0.4); ctx.stroke();
  }
}

export const ice: GroundLook = { color: iceColor, snow: 0.8, wets: true, splashes: true, ripples: false, vary: 0.04, lies: { marks: 4, mark } };
