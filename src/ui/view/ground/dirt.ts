// Dirt's look (#1030): bare earth, a clod or two on it, and puddles after rain.

import { shade } from '../../../lib/art/palettes.ts';
import { TERRAIN_COLORS } from '../../palette.ts';
import { hash } from '../../paint/brush.ts';
import { fog } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark, Square } from './look.ts';
import { cracks, stones, tone } from './near.ts';

/** A clod. */
function mark(p: Paint, m: Mark): void {
  const { ctx } = p, { i, x, y, sc, base, seed, d } = m;
  ctx.fillStyle = fog(p, shade(base, 0.7 + hash(seed, i) * 0.6), d);
  ctx.beginPath(); ctx.ellipse(x, y, 1.5 * sc + 0.5, 1 * sc + 0.4, 0, 0, Math.PI * 2); ctx.fill();
}

/** Near to (#1102, near.ts): pebbles lit on their tops, and the earth cracked between them. */
export function pebbled(p: Paint, base: string, sq: Square): void {
  const px = stones(p, base, sq, { rows: 7, cols: 9, size: [2, 4], bare: 0.45, body: 0.82, lit: 1.32, shadow: 0.6 });
  cracks(p, sq, 3, tone(p, sq, 0.6, base), px).fill(p);
}

export const dirt: GroundLook = { color: () => TERRAIN_COLORS.dirt, drift: { toward: ['#4e3a28', '#b49a6c'], by: 0.6 }, snow: 0.9, wets: true, splashes: true, ripples: false, vary: 0.08, lies: { marks: 3, mark }, puddles: true,
  scatter: ['stone'], rank: 2, near: pebbled };
