// The chasm's look (#1030): the drop (`drop`), dark as it goes down and its own colour underground too, its
// far wall under the rim and a lit lip where ground stands before it; no rain, snow or splash.

import { shade, mix } from '../../../lib/art/palettes.ts';
import { TERRAIN_COLORS } from '../../palette.ts';
import { hash } from '../../paint/brush.ts';
import { fog, unit, unitIn, floorPt, quad, line } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Square } from './look.ts';

/**
 * The chasm: the drop, dark as it goes down. Where ground stands beyond it, its far wall shows under
 * the rim, rock in bands darkening into the depth; where ground stands before it, a lit lip.
 */
function drawChasm(p: Paint, base: string, d: number, l: number, seed: number, rims: { near: boolean; far: boolean }): void {
  const { ctx, cx, horizon, h } = p;
  const pt = (s: number, t: number): [number, number] => floorPt(cx, horizon, h, d, l, s, t);
  quad(ctx, pt(0, 0), pt(0, 1), pt(1, 1), pt(1, 0), fog(p, base, d));
  if (rims.far) {
    // The far wall hangs from the rim toward the eye, down past the chasm's own floor; the ground
    // before the chasm is painted after it, over its foot.
    const uF = unitIn(d, 1, h), y0 = horizon + uF, x0 = cx + (l - 0.5) * 2 * uF, x1 = cx + (l + 0.5) * 2 * uF, drop = uF * 2.4, bands = 7;
    const rock = '#9a92a4';
    for (let k = 0; k < bands; k++) {
      const ya = y0 + (drop * k) / bands, yb = y0 + (drop * (k + 1)) / bands + 1;
      ctx.fillStyle = fog(p, mix(shade(rock, 1 - 0.06 * (k % 2)), base, Math.min(1, (k / bands) * 1.15)), d);
      // Each band spans the column as it widens toward the eye, a half pixel over each edge, so walls
      // side by side meet with no seam.
      const ua = ya - horizon, ub = yb - horizon, col = (u: number, e: number): number => cx + (l - 0.5 + e) * 2 * u + (e - 0.5);
      quad(ctx, [col(ua, 0), ya], [col(ua, 1), ya], [col(ub, 1), yb], [col(ub, 0), yb], ctx.fillStyle as string);
      // Strata: a crack or two across each band.
      if (k < bands - 2) {
        ctx.strokeStyle = fog(p, mix(shade(rock, 0.6), base, k / bands), d); ctx.lineWidth = 1;
        const yy = ya + (yb - ya) * (0.3 + 0.4 * hash(seed, 83, k));
        const uy = yy - horizon, xa = col(uy, 0), xb = col(uy, 1);
        ctx.beginPath(); ctx.moveTo(xa, yy); for (let q = 1; q <= 4; q++) ctx.lineTo(xa + ((xb - xa) * q) / 4, yy + (hash(seed, 84, k, q) - 0.5) * (yb - ya) * 0.6); ctx.stroke();
      }
    }
    ctx.strokeStyle = fog(p, shade(rock, 1.3), d); ctx.lineWidth = Math.max(1, uF * 0.02); line(ctx, [x0, y0], [x1, y0]);
  }
  if (rims.near) { ctx.strokeStyle = fog(p, '#8a8290', d); ctx.lineWidth = Math.max(1, unit(d, h) * 0.03); line(ctx, pt(0, 0), pt(0, 1)); }
}

/** The drop in place of the floor, its rims where the scene found ground before it and beyond it. */
function drop(p: Paint, sq: Square): void { drawChasm(p, TERRAIN_COLORS.chasm, sq.d, sq.l, sq.seed, sq.rims ?? { near: false, far: false }); }

export const chasm: GroundLook = { color: () => TERRAIN_COLORS.chasm, snow: 0, wets: false, splashes: false, ripples: false, vary: 0.08, drop };
