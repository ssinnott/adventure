// Farmland's look (#1030): each field's crop through the year (`cropColor`), its tiles even, and over
// them the crop's rows or the furrows and the hedges round the field (`plot`, `lays`).

import { shade, mix } from '../../../lib/art/palettes.ts';
import { FACING_DX, FACING_DY } from '../../../game/types.ts';
import { hash } from '../../paint/brush.ts';
import { fog, floorPt, quad, unitIn, SNOW } from '../common.ts';
import { cropColor, CROPS, fieldAt, hedgeColor } from '../model.ts';
import { WIDE, blade, pixels, sward } from './near.ts';
import type { Pixels } from './near.ts';
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

/**
 * Near to (#1102, near.ts): the crop along its rows, the grain's stalks growing from Sowing and eared from Harvest
 * and its stubble once cut, the roots' leaves, clods along the furrows of a field lying ploughed; a pasture's sward.
 */
function cropNear(p: Paint, base: string, sq: Square): Pixels {
  const { cx, horizon, h, env } = p, { d, l, seed, plot } = sq, day = env.day;
  if (!plot || env.cover > 0.55) return pixels();
  const c = plot.crop % CROPS.length;
  if (c === 2) return sward(p, base, sq);
  const [sown, cut, ploughed] = c === 3 ? [22, 70, 84] : [18, 60, 78], px = pixels(), foot = horizon + h / 2 + 2;
  const lit = fog(p, shade(base, 1.25), d), dark = fog(p, shade(base, 0.72), d), ear = fog(p, mix(base, '#f0dc8c', 0.55), d);
  // The crop keeps off its field's hedges, and nothing of it rises over the far one.
  const [hn, hf, hl, hr] = plot.hedge, edge = 0.09, roof = hf ? floorPt(cx, horizon, h, d, l, 1 - edge, 0.5)[1] : -Infinity;
  for (let r = 0; r < 4; r++) for (let j = 0; j < 12; j++) {
    const along = (j + 0.2 + 0.6 * hash(seed, 251, r, j)) / 12, across = r / 4 + 1 / 8 + (hash(seed, 252, r, j) - 0.5) * 0.05;
    const [s, t] = plot.away ? [along, across] : [across, along], [fx, fy] = floorPt(cx, horizon, h, d, l, s, t);
    if (fy > foot || (hn && s < edge) || (hf && s > 1 - edge) || (hl && t < edge) || (hr && t > 1 - edge)) continue;
    const k = unitIn(d, s, h) / 64, w = k > WIDE ? 2 : 1, x = Math.round(fx), y = Math.round(fy), b = hash(seed, 253, r, j), room = y - roof;
    if (day < sown || day >= ploughed) { const cw = Math.max(2, Math.round((2 + 2 * b) * k)); if (room > w + 1) { px.flat.put(dark, x - cw / 2, y - w, cw, w + 1); px.flat.put(lit, x - cw / 2, y - w - 1, cw - 1, 1); } }
    else if (day >= cut) blade(px.up, x, y, Math.min(Math.max(2, 2.5 * k), room), 0, w, lit, dark);
    else if (c === 3) { if (room > 3 * k) { px.flat.put(dark, x - 2 * k, y - 2 * k, 4 * k, 2 * k); px.flat.put(lit, x - k, y - 3 * k, 2 * k, k + 1); } }
    else {
      const eared = day >= 40, tall = Math.min((3 + 9 * Math.min(1, (day - sown) / (cut - sown - 12))) * k * (0.8 + 0.4 * b), room - (eared ? 2 * k : 0));
      if (tall < 1) continue;
      blade(px.up, x, y, tall, Math.round(b * 2 - 1), w, lit, dark);
      if (eared) px.up.put(ear, x + Math.round(b * 2 - 1) * w, y - tall - 2 * k, 2 * w, 2 * k);
    }
  }
  return px;
}

export const farm: GroundLook = { color: (day, crop) => cropColor(crop, day), snow: 0.9, wets: true, splashes: true, ripples: false, vary: 0.04, plot: farmPlot, lays: rows, near: cropNear };
