// Salt's look (#1030): the pans' white crust, cracked into plates.

import { shade } from '../../../lib/art/palettes.ts';
import { TERRAIN_COLORS } from '../../palette.ts';
import { hash } from '../../paint/brush.ts';
import { fog } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark } from './look.ts';

/** A crack between plates. */
function mark(p: Paint, m: Mark): void {
  const { ctx, env } = p, { i, x, y, sc, base, seed, d } = m;
  // The crust cracked into plates, the cracks grey where the brine dried in them; snow hides them.
  if (env.cover > 0.55) return;
  const a = hash(seed, 53, i) * Math.PI, len = (4 + 4 * hash(seed, 54, i)) * sc, b = a + 0.9 + hash(seed, 55, i);
  ctx.strokeStyle = fog(p, shade(base, 0.72), d); ctx.lineWidth = Math.max(1, sc * 0.8);
  ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * len, y - Math.sin(a) * len * 0.4); ctx.lineTo(x, y); ctx.lineTo(x + Math.cos(b) * len, y + Math.sin(b) * len * 0.4); ctx.stroke();
}

export const salt: GroundLook = { color: () => TERRAIN_COLORS.salt, drift: { toward: ['#bab09a', '#fafaf6'], by: 0.6 }, snow: 0.6, wets: true, splashes: true, ripples: false, vary: 0.08, lies: { marks: 5, mark } };
