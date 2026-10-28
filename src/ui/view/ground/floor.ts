// The floor's look (#1030): a built floor in its own colour, plain outdoors and in the towns; in a dungeon
// flagstones set in mortar, varying more, a crack or a puddle on some (`dungeon`).

import { shade } from '../../../lib/art/palettes.ts';
import { TERRAIN_COLORS } from '../../palette.ts';
import { hash } from '../../paint/brush.ts';
import { fog } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark } from './look.ts';

/** A crack across a flagstone, or a puddle catching the light, on about half of them. */
function mark(p: Paint, m: Mark): void {
  const { ctx } = p, { i, x, y, sc, base, seed, d } = m;
  if (hash(seed, 51, i) > 0.5) return;
  if (i === 0) {
    // A crack.
    ctx.strokeStyle = fog(p, shade(base, 0.5), d); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 3 * sc, y - 2 * sc); ctx.lineTo(x + 5 * sc, y - 5 * sc); ctx.lineTo(x + 9 * sc, y - 6 * sc); ctx.stroke();
  } else {
    // A puddle catching the light.
    ctx.beginPath(); ctx.ellipse(x, y, 5 * sc, 1.6 * sc, 0, 0, Math.PI * 2); ctx.fillStyle = fog(p, shade(base, 0.6), d); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x - sc, y - 0.4 * sc, 2 * sc, 0.5 * sc, 0, 0, Math.PI * 2); ctx.fillStyle = fog(p, '#a0a8c0', d); ctx.fill();
  }
}

const plain: GroundLook = { color: () => TERRAIN_COLORS.floor, snow: 0.8, wets: true, splashes: true, ripples: false, vary: 0.08 };
export const floor: GroundLook = { ...plain, dungeon: { ...plain, vary: 0.16, mortar: true, lies: { marks: 2, mark } } };
