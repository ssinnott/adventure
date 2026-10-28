// Water's look (#1030): never darkened by rain or splashed, never snowed on, its tiles shading by a
// chequer (`ripples`), a ripple or two on it.

import { shade } from '../../../lib/art/palettes.ts';
import { TERRAIN_COLORS } from '../../palette.ts';
import { fog } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark } from './look.ts';

/** A ripple. */
function mark(p: Paint, m: Mark): void {
  const { ctx } = p, { x, y, sc, base, d } = m;
  ctx.strokeStyle = fog(p, shade(base, 1.4), d); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x - 4 * sc, y); ctx.quadraticCurveTo(x, y - 1.5 * sc, x + 4 * sc, y); ctx.stroke();
}

export const water: GroundLook = { color: () => TERRAIN_COLORS.water, snow: 0, wets: false, splashes: false, ripples: true, vary: 0.08, lies: { marks: 3, mark } };
