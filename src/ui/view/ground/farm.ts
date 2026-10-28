// Farmland's look (#1030): each field's crop through the year (`cropColor`), its tiles even, and over
// them the crop's rows or the furrows and the hedges round the field (`plot`, `lays`).

import { shade, mix } from '../../../lib/art/palettes.ts';
import { FACING_DX, FACING_DY } from '../../../game/types.ts';
import { fog, floorPt, quad, SNOW } from '../common.ts';
import { cropColor, CROPS, fieldAt, hedgeColor } from '../model.ts';
import type { GameMap } from '../../../game/map.ts';
import type { Facing } from '../../../game/types.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Square, Plot } from './look.ts';

/** A farm square's plot (`Plot`), seen facing `f`: its field's crop and rows, and a hedge wherever the next square is another field. */
function farmPlot(map: GameMap, x: number, y: number, f: Facing): Plot {
  const here = fieldAt(x, y), rf = ((f + 1) & 3) as Facing;
  const parted = (dx: number, dy: number): boolean => map.at(x + dx, y + dy).terrain === 'farm' && fieldAt(x + dx, y + dy).id !== here.id;
  const fx = FACING_DX[f], fy = FACING_DY[f], rx = FACING_DX[rf], ry = FACING_DY[rf];
  return { crop: here.crop, away: here.rowsEW === (fx !== 0), hedge: [parted(-fx, -fy), parted(fx, fy), parted(-rx, -ry), parted(rx, ry)] };
}

/**
 * How plainly a crop's rows show on a day: furrows plain while the field lies ploughed, rows softer
 * as the crop grows over them. Pasture (crop 2) has none.
 */
function rowDepth(crop: number, day: number): number {
  if (crop % CROPS.length === 2) return 0;
  const [sown, cut, ploughed] = crop % CROPS.length === 3 ? [22, 70, 84] : [18, 60, 78];
  return day < sown || day >= ploughed ? 0.2 : day >= cut ? 0.12 : 0.08;
}

/** Rows of a crop, or furrows, and the hedges round the field. */
function drawFarm(p: Paint, base: string, plot: Plot, d: number, l: number): void {
  const { ctx, cx, horizon, h, env } = p;
  const P = (s: number, t: number): [number, number] => floorPt(cx, horizon, h, d, l, s, t);
  const depth = rowDepth(plot.crop, env.day) * (1 - 0.5 * env.cover);
  if (d <= 3 && depth > 0) {
    // Four rows a square, centred so they meet the next square's whichever way the eye faces.
    const row = fog(p, shade(base, 1 - depth), d);
    for (let k = 0; k < 4; k++) {
      const a = k / 4 + 1 / 16, b = k / 4 + 3 / 16;
      if (plot.away) quad(ctx, P(0, a), P(0, b), P(1, b), P(1, a), row);
      else quad(ctx, P(a, 0), P(a, 1), P(b, 1), P(b, 0), row);
    }
  }
  const [near, far, left, right] = plot.hedge;
  if (!(near || far || left || right)) return;
  const hedge = fog(p, mix(hedgeColor(env.day), SNOW, env.cover * 0.7), d);
  // Each strip runs a little past the square's ends, as the floor tiles overlap, so a hedge along
  // two squares shows no hairline where they meet.
  const w = 0.07, a = -0.01, b = 1.01;
  if (near) quad(ctx, P(0, a), P(0, b), P(w, b), P(w, a), hedge);
  if (far) quad(ctx, P(1 - w, a), P(1 - w, b), P(1, b), P(1, a), hedge);
  if (left) quad(ctx, P(a, 0), P(a, w), P(b, w), P(b, 0), hedge);
  if (right) quad(ctx, P(a, 1 - w), P(a, 1), P(b, 1), P(b, 1 - w), hedge);
}

/** The rows and the hedges, on a farm square the scene worked out the plot of. */
function rows(p: Paint, base: string, sq: Square): void { if (sq.plot) drawFarm(p, base, sq.plot, sq.d, sq.l); }

export const farm: GroundLook = { color: (day, crop) => cropColor(crop, day), snow: 0.9, wets: true, splashes: true, ripples: false, vary: 0.04, plot: farmPlot, lays: rows };
