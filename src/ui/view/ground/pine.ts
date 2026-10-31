// The pinewoods' look (#1030): needles and moss, cones and needles on them, and pines at the sides of each
// square, closer and taller than the woods' trees; the pines keep some snow off. Its floor's variants
// across the land (#1101): moss, the needles and bilberry.

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

/** The moss's: a cushion, lit on its top. */
function cushion(p: Paint, m: Mark): void {
  const { ctx, env } = p, { x, y, sc, base, d } = m;
  if (env.cover > 0.55) return;
  ctx.fillStyle = fog(p, shade(base, 0.8), d);
  ctx.beginPath(); ctx.ellipse(x, y - sc, 3.2 * sc + 0.5, 1.8 * sc + 0.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = fog(p, mix(base, '#8ab84a', 0.45), d);
  ctx.beginPath(); ctx.ellipse(x - 0.4 * sc, y - 1.6 * sc, 2.2 * sc + 0.3, 1 * sc + 0.3, 0, 0, Math.PI * 2); ctx.fill();
}

/** The bilberry's: a low bush, its berries blue-black in late summer and its leaves red in the autumn. */
function bilberry(p: Paint, m: Mark): void {
  const { ctx, env } = p, { i, x, y, sc, base, seed, d } = m;
  if (env.cover > 0.55) return;
  const red = Math.max(0, Math.min(1, (env.day - 62) / 8, (96 - env.day) / 8));
  ctx.fillStyle = fog(p, mix(mix(base, '#2e4a22', 0.6), '#9a3a2a', red), d);
  for (const [dx, dy, r] of [[-1.6, -1, 1.6], [0.8, -1.4, 1.8], [2.4, -0.8, 1.3]]) { ctx.beginPath(); ctx.ellipse(x + dx * sc, y + dy * sc, r * sc + 0.4, r * 0.7 * sc + 0.3, 0, 0, Math.PI * 2); ctx.fill(); }
  if (env.day >= 34 && env.day <= 62 && hash(seed, 73, i) < 0.7) { ctx.fillStyle = fog(p, '#2a2a4e', d); ctx.fillRect(Math.round(x), Math.round(y - 2 * sc), Math.max(1, Math.round(sc)), Math.max(1, Math.round(sc))); }
}

export const pine: GroundLook = { color: pineColor, drift: { toward: ['#3a7032', '#b07a46'], by: 0.6 }, snow: 0.72, wets: true, splashes: true, ripples: false, vary: 0.08, lies: { marks: 6, mark },
  sides: { bare: 0.15, size: 0.55, spread: 0.25, tree: (p, x, y, s, tone, pick) => drawTreeSprite(p.ctx, x, y, s, tone, 3 + Math.floor(pick * 2), p.env.trees) },
  // Moss green under the trees, the needles brown, bilberry dark in low bushes.
  variants: { scale: 4, looks: [
    { name: 'moss', share: 0.3, shift: { toward: '#4e8a34', by: 0.65 }, lies: { marks: 5, mark: cushion } },
    { name: 'needles', share: 0.45 },
    { name: 'bilberry', share: 0.25, shift: { toward: '#2a4226', by: 0.6 }, lies: { marks: 5, mark: bilberry } },
  ] } };
