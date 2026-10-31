// The vines' look (#1030): dark loam under the shore's creepers, leaves and runners on it, and the shore's
// trees hung with creepers at the sides of each square; the creepers keep some snow off.

import { shade, mix } from '../../../lib/art/palettes.ts';
import { TERRAIN_COLORS } from '../../palette.ts';
import { drawVineSprite } from '../../scenery.ts';
import { hash } from '../../paint/brush.ts';
import { fog, grassColor } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark } from './look.ts';

/** The ground under the shore's creepers: dark loam and moss, greener in the summer. */
function vinesColor(day: number): string { return mix(TERRAIN_COLORS.vines, grassColor(day), 0.3); }

/** Three leaves, then runners. */
function mark(p: Paint, m: Mark): void {
  const { ctx, env } = p, { i, x, y, sc, base, seed, d } = m;
  // Fallen leaves and a creeper's runners over the dark ground, buried by a deep snow.
  if (env.cover > 0.55) return;
  if (i < 3) {
    ctx.fillStyle = fog(p, ['#2e5a26', '#4a3a24', '#4a7a2e'][Math.floor(hash(seed, 54, i) * 3)], d);
    ctx.fillRect(Math.round(x), Math.round(y - sc), Math.max(1, Math.round(3 * sc)), Math.max(1, Math.round(1.5 * sc)));
  } else {
    ctx.strokeStyle = fog(p, shade(base, 1.5), d); ctx.lineWidth = Math.max(1, sc * 0.8);
    ctx.beginPath(); ctx.moveTo(x - 5 * sc, y); ctx.bezierCurveTo(x - 2 * sc, y - 2 * sc, x + 2 * sc, y + sc, x + 5 * sc, y - sc); ctx.stroke();
  }
}

export const vines: GroundLook = { color: vinesColor, drift: { toward: ['#143c1e', '#3e6a2e'], by: 0.4 }, snow: 0.7, wets: true, splashes: true, ripples: false, vary: 0.08, lies: { marks: 6, mark },
  sides: { bare: 0.3, size: 0.5, spread: 0.2, tree: (p, x, y, s, tone, pick) => drawVineSprite(p.ctx, x, y, s, tone, Math.floor(pick * 3), p.env.trees) } };
