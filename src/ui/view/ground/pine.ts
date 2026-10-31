// The pinewoods' look (#1030): needles and moss, cones and needles on them, and pines at the sides of each
// square, closer and taller than the woods' trees; the pines keep some snow off.

import { shade, mix } from '../../../lib/art/palettes.ts';
import { TERRAIN_COLORS } from '../../palette.ts';
import { drawTreeSprite } from '../../scenery.ts';
import { hash } from '../../paint/brush.ts';
import { fog, grassColor } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark } from './look.ts';

/** The pinewoods' floor: needles and moss, brown through the year and a little greener in the spring. */
function pineColor(day: number): string { return mix(TERRAIN_COLORS.pine, grassColor(day), 0.18); }

/** Two cones, then needles. */
function mark(p: Paint, m: Mark): void {
  const { ctx, env } = p, { i, x, y, sc, base, seed, d } = m;
  // Cones and needles under the pines, buried by a deep snow.
  if (env.cover > 0.55) return;
  if (i < 2) {
    ctx.fillStyle = fog(p, i ? '#6a4a2a' : '#7e5c34', d);
    ctx.beginPath(); ctx.ellipse(x, y - sc, 1.6 * sc + 0.4, 1 * sc + 0.3, 0, 0, Math.PI * 2); ctx.fill();
  } else {
    const a = (hash(seed, 46, i) - 0.5) * 1.4, len = (2 + 3 * hash(seed, 48, i)) * sc;
    ctx.strokeStyle = fog(p, i % 2 ? '#8a6a3c' : shade(base, 0.7), d); ctx.lineWidth = Math.max(1, sc * 0.7);
    ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * len, y - Math.sin(a) * len * 0.4); ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len * 0.4); ctx.stroke();
  }
}

export const pine: GroundLook = { color: pineColor, drift: { toward: ['#3a7032', '#b07a46'], by: 0.6 }, snow: 0.72, wets: true, splashes: true, ripples: false, vary: 0.08, lies: { marks: 6, mark },
  sides: { bare: 0.15, size: 0.55, spread: 0.25, tree: (p, x, y, s, tone, pick) => drawTreeSprite(p.ctx, x, y, s, tone, 3 + Math.floor(pick * 2), p.env.trees) } };
