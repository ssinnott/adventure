// Sand's look (#1030): pale sand, a grain or two darker on it.

import { shade } from '../../../lib/art/palettes.ts';
import { TERRAIN_COLORS } from '../../palette.ts';
import { fog } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark, Square } from './look.ts';
import { ripples } from './near.ts';

/** A darker grain. */
function mark(p: Paint, m: Mark): void {
  const { ctx } = p, { x, y, base, d } = m;
  ctx.fillStyle = fog(p, shade(base, 0.8), d); ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
}

/** Near to (#1102, near.ts): the wind's ripple marks, each lit along its crest with its shadow under it. */
function rippled(p: Paint, base: string, sq: Square): void { ripples(p, base, sq, { rows: 8, cols: 2, half: 13, lit: 1.12, shadow: 0.84 }).fill(p); }

export const sand: GroundLook = { color: () => TERRAIN_COLORS.sand, drift: { toward: ['#b0965e', '#f4ead0'], by: 0.6 }, snow: 0.6, wets: true, splashes: true, ripples: false, vary: 0.08, lies: { marks: 4, mark },
  scatter: ['driftwood', 'shells'], rank: 3, near: rippled };
