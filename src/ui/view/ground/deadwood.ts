// Dead wood's look (#1030): grey ground, fallen limbs and twigs on it, and dead trees at the sides of each
// square as the woods stand theirs.

import { TERRAIN_COLORS } from '../../palette.ts';
import { drawDeadTreeSprite } from '../../scenery.ts';
import { hash } from '../../paint/brush.ts';
import { fog } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark } from './look.ts';

/** A fallen limb or a twig. */
function mark(p: Paint, m: Mark): void {
  const { ctx, env } = p, { i, x, y, sc, seed, d } = m;
  // Fallen limbs and bleached twigs, grey on grey, buried by a deep snow.
  if (env.cover > 0.55) return;
  const a = (hash(seed, 45, i) - 0.5) * 1.2, len = (3 + 4 * hash(seed, 47, i)) * sc;
  ctx.strokeStyle = fog(p, i % 2 ? '#b0a898' : '#5e5850', d); ctx.lineWidth = Math.max(1, sc * (i < 2 ? 1.2 : 0.7));
  ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * len, y - Math.sin(a) * len * 0.4); ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len * 0.4); ctx.stroke();
}

export const deadwood: GroundLook = { color: () => TERRAIN_COLORS.deadwood, drift: { toward: ['#4e4a46', '#867c6a'], by: 0.45 }, snow: 0.85, wets: true, splashes: true, ripples: false, vary: 0.08, lies: { marks: 5, mark },
  sides: { bare: 0.3, size: 0.5, spread: 0.2, tree: (p, x, y, s, tone, pick) => drawDeadTreeSprite(p.ctx, x, y, s, tone, Math.floor(pick * 3), p.env.cover) } };
