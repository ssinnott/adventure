// Lava's look (#1030): never darkened by rain nor snowed on, and a glow over each square.

import { TERRAIN_COLORS } from '../../palette.ts';
import { unit, floorPt } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Square } from './look.ts';

/** The glow over a square of it. */
function glow(p: Paint, _base: string, sq: Square): void {
  const { ctx, cx, horizon, h } = p, { d, l } = sq;
  const u = unit(d, h);
  const [x, y] = floorPt(cx, horizon, h, d, l, 0.5, 0.5);
  const gg = ctx.createRadialGradient(x, y, 0, x, y, u * 0.8); gg.addColorStop(0, 'rgba(255,200,80,0.7)'); gg.addColorStop(1, 'rgba(255,120,40,0)');
  ctx.fillStyle = gg; ctx.fillRect(x - u, y - u, u * 2, u * 2);
}

export const lava: GroundLook = { color: () => TERRAIN_COLORS.lava, snow: 0, wets: false, splashes: true, ripples: false, vary: 0.08, lays: glow };
