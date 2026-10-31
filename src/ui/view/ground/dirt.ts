// Dirt's look (#1030): bare earth, a clod or two on it, and puddles after rain.

import { shade } from '../../../lib/art/palettes.ts';
import { TERRAIN_COLORS } from '../../palette.ts';
import { hash } from '../../paint/brush.ts';
import { fog } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark } from './look.ts';

/** A clod. */
function mark(p: Paint, m: Mark): void {
  const { ctx } = p, { i, x, y, sc, base, seed, d } = m;
  ctx.fillStyle = fog(p, shade(base, 0.7 + hash(seed, i) * 0.6), d);
  ctx.beginPath(); ctx.ellipse(x, y, 1.5 * sc + 0.5, 1 * sc + 0.4, 0, 0, Math.PI * 2); ctx.fill();
}

export const dirt: GroundLook = { color: () => TERRAIN_COLORS.dirt, drift: { toward: ['#5e4630', '#a88e62'], by: 0.45 }, snow: 0.9, wets: true, splashes: true, ripples: false, vary: 0.08, lies: { marks: 3, mark }, puddles: true };
