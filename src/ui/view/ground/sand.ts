// Sand's look (#1030): pale sand, a grain or two darker on it.

import { shade } from '../../../lib/art/palettes.ts';
import { TERRAIN_COLORS } from '../../palette.ts';
import { fog } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark } from './look.ts';

/** A darker grain. */
function mark(p: Paint, m: Mark): void {
  const { ctx } = p, { x, y, base, d } = m;
  ctx.fillStyle = fog(p, shade(base, 0.8), d); ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
}

export const sand: GroundLook = { color: () => TERRAIN_COLORS.sand, drift: { toward: ['#c4a870', '#f0e2b4'], by: 0.45 }, snow: 0.6, wets: true, splashes: true, ripples: false, vary: 0.08, lies: { marks: 4, mark } };
