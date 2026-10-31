// The snow's look (#1030): white, wholly so under more, a glint or two on it.

import { TERRAIN_COLORS } from '../../palette.ts';
import { fog } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark, Square } from './look.ts';
import { ripples } from './near.ts';

/** A glint. */
function mark(p: Paint, m: Mark): void {
  const { ctx } = p, { x, y, d } = m;
  ctx.fillStyle = fog(p, '#ffffff', d); ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
}

/** Near to (#1102, near.ts): the wind's ridges in it, lit white along their crests over a blue shadow. */
function ridged(p: Paint, base: string, sq: Square): void { ripples(p, base, sq, { rows: 6, cols: 3, half: 10, lit: '#ffffff', shadow: '#a4b6cc', snowy: true }).fill(p); }

export const snow: GroundLook = { color: () => TERRAIN_COLORS.snow, drift: { toward: ['#c4d2e4', '#ffffff'], by: 0.6 }, snow: 1, wets: true, splashes: true, ripples: false, vary: 0.08, lies: { marks: 2, mark },
  scatter: ['drift'], rank: 7, near: ridged };
