// The snow's look (#1030): white, wholly so under more, a glint or two on it.

import { TERRAIN_COLORS } from '../../palette.ts';
import { fog } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark } from './look.ts';

/** A glint. */
function mark(p: Paint, m: Mark): void {
  const { ctx } = p, { x, y, d } = m;
  ctx.fillStyle = fog(p, '#ffffff', d); ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
}

export const snow: GroundLook = { color: () => TERRAIN_COLORS.snow, drift: { toward: ['#d0dceb', '#f8fafc'], by: 0.5 }, snow: 1, wets: true, splashes: true, ripples: false, vary: 0.08, lies: { marks: 2, mark } };
