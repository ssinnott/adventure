// The swamp's look (#1030): wet ground, reeds standing in it.

import { TERRAIN_COLORS } from '../../palette.ts';
import { fog } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark } from './look.ts';

/** A pair of reeds. */
function mark(p: Paint, m: Mark): void {
  const { ctx } = p, { x, y, sc, d } = m;
  ctx.strokeStyle = fog(p, '#6a7a3a', d); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 0.5 * sc, y - 7 * sc); ctx.moveTo(x + 2 * sc, y); ctx.lineTo(x + 1.5 * sc, y - 5 * sc); ctx.stroke();
}

export const swamp: GroundLook = { color: () => TERRAIN_COLORS.swamp, drift: { toward: ['#3e5a34', '#7e8044'], by: 0.5 }, snow: 0.5, wets: true, splashes: true, ripples: false, vary: 0.08, lies: { marks: 3, mark } };
