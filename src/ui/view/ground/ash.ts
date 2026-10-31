// The ash's look (#1030): the vents' fall, drifted and rippled, cinders in it and an ember now and then,
// glowing by night; it is warm and greys the snow that falls on it.

import { shade } from '../../../lib/art/palettes.ts';
import { TERRAIN_COLORS } from '../../palette.ts';
import { hash } from '../../paint/brush.ts';
import { fog, unitIn, floorPt } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark } from './look.ts';

/** An ember, a drift, ripples, then cinders. */
function mark(p: Paint, m: Mark): void {
  const { ctx, cx, horizon, h, dark, env } = p, { i, s, t, x, y, sc, base, seed, d, l } = m;
  // Ash drifted and rippled by the wind, a cinder or two in it; now and then an ember, dull by
  // day and glowing by night. A deep snow hides them.
  if (env.cover > 0.55) return;
  if (i === 0) {
    if (hash(seed, 58) > 0.25) return;
    const ew = Math.max(1, Math.round(3 * sc)), eh = Math.max(1, Math.round(1.5 * sc)), ex = Math.round(x), ey = Math.round(y - sc);
    if (dark) { ctx.fillStyle = 'rgba(224, 100, 42, 0.3)'; ctx.beginPath(); ctx.ellipse(ex + ew / 2, ey + eh / 2, ew * 1.4, eh * 1.6, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = dark ? '#e0642a' : fog(p, '#7a3a26', d);
    ctx.fillRect(ex, ey, ew, eh);
  } else if (i === 1) {
    // A drift, kept inside its square, so it never reaches the foot of a wall beyond.
    if (d > 2) return;
    const ds = 0.25 + 0.45 * s, [px, py] = floorPt(cx, horizon, h, d, l, ds, 0.25 + 0.5 * t), pw = unitIn(d, ds, h) * (0.22 + 0.12 * hash(seed, 57)), ph = pw * 0.16;
    ctx.beginPath(); ctx.ellipse(px, py, pw, ph, 0, 0, Math.PI * 2); ctx.fillStyle = fog(p, shade(base, 1.22), d); ctx.fill();
  } else if (i < 4) {
    ctx.strokeStyle = fog(p, shade(base, 1.7), d); ctx.lineWidth = Math.max(1, sc * 0.8);
    ctx.beginPath(); ctx.moveTo(x - 5 * sc, y); ctx.quadraticCurveTo(x, y - 1.4 * sc, x + 5 * sc, y); ctx.stroke();
  } else {
    ctx.fillStyle = fog(p, i % 2 ? '#181616' : shade(base, 1.5), d);
    ctx.beginPath(); ctx.ellipse(x, y, 1.4 * sc + 0.4, 0.9 * sc + 0.3, 0, 0, Math.PI * 2); ctx.fill();
  }
}

export const ash: GroundLook = { color: () => TERRAIN_COLORS.ash, drift: { toward: ['#1c1a1a', '#5e5a56'], by: 0.6 }, snow: 0.65, wets: true, splashes: true, ripples: false, vary: 0.08, lies: { marks: 6, mark } };
