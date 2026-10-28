// The roofs (#1028): a building's one roof over its house squares, whichever way it is seen, its slopes,
// hips and valleys, its chimney and its colour, white under lying snow.

import { shade, mix, rgba } from '../../lib/art/palettes.ts';
import { hash } from '../paint/brush.ts';
import { env, fog, SNOW, quad, line, addPoly } from './common.ts';

/** The roof colour for a house: terracotta, slate or thatch, fixed per building; white under lying snow. */
function roofColor(bseed: number): string {
  const r = hash(bseed, 2), c = r < 0.55 ? '#a8503a' : r < 0.8 ? '#5a6070' : '#b89050';
  return env.cover > 0.1 ? mix(c, SNOW, Math.min(0.85, env.cover)) : c;
}

// A building has one roof, whichever way it is seen, projected with the same unit() as the walls.
// In view space X runs across in half cells (cell l spans 2l-1 .. 2l+1), k runs ahead in cells,
// and Y runs down in half cells (eaves at -1, ground at 1): a point lands at cx + X*u(k),
// horizon + Y*u(k). Every outside wall carries a slope that overhangs it by EAVE and climbs RISE to
// a ridge RIDGE in from the wall; slopes meet in a hip at an outside corner and in a valley at an
// inside one, and the flat inside the ridges is out of sight from the street. The pitch is steep
// enough that even the slope over the wall beside the party faces the eye, so each slope drawn is
// one the eye could see, and a front slope and a side slope meet along their hip, not across it.
const EAVE = 0.16, RIDGE = 0.44, RISE = 1.0;

export type At = (X: number, k: number, Y: number) => [number, number];

/**
 * The part of its building's roof that one house cell carries: the slope over its front wall if
 * the cell in front is not a house, and over its wall toward the middle of the view if that cell
 * is not. A slope's end is hipped where the next cell along is not a house, runs on where it is and
 * carries the same slope, and meets the other slope in a valley where the building turns.
 * `under` draws, before the cell's walls, the undersides of the overhangs on its walls that face
 * away: the walls hide most of them, and what shows past a wall's end is the eave turning the corner.
 */
export function drawRoof(ctx: CanvasRenderingContext2D, at: At, d: number, l: number, houseAt: (d: number, l: number) => boolean, bseed: number, dark: boolean, haze: string | null, under: boolean): void {
  const end = (next: boolean, same: boolean): number => !next ? 1 : same ? 0 : -1;
  const s = Math.sign(l);
  if (under) {
    const kE = EAVE / 2;
    ctx.beginPath();
    if (!houseAt(d + 1, l)) addPoly(ctx, [at(2 * l - 1 - EAVE, d + 0.5, -1), at(2 * l + 1 + EAVE, d + 0.5, -1), at(2 * l + 1 + EAVE, d + 0.5 + kE, -1), at(2 * l - 1 - EAVE, d + 0.5 + kE, -1)]);
    for (const o of [-1, 1]) {
      // The wall toward l + o faces away unless it faces the middle of the view.
      if (o * l < 0 || houseAt(d, l + o)) continue;
      const xW = 2 * l + o, xE = xW + o * EAVE, k0 = Math.max(0, d - 0.5 - kE), k1 = d + 0.5 + kE;
      addPoly(ctx, [at(xW, k0, -1), at(xE, k0, -1), at(xE, k1, -1), at(xW, k1, -1)]);
    }
    ctx.fillStyle = fog('#2e2218', d, dark, haze); ctx.fill();
    return;
  }
  const slopes: ((soffit: boolean) => void)[] = [];
  // An end runs under the slope beyond it when that one is painted after this one: the next cell in
  // along a front, the next cell nearer along a side, or the other slope of a valley.
  if (l !== 0 && !houseAt(d, l - s)) {
    // Beside the party (d = 0) the near end is clipped at k = 0, as the wall under it is.
    const tn = d === 0 ? 0 : end(houseAt(d - 1, l), !houseAt(d - 1, l - s)), tf = end(houseAt(d + 1, l), !houseAt(d + 1, l - s));
    const xW = 2 * l - s;
    slopes.push((soffit) => drawSlope(ctx, soffit, (a, b) => at(slopeAt(b, xW, xW - s * EAVE, xW + s * RIDGE), a, -1 - RISE * Math.max(0, b)), false,
      d - 0.5, d + 0.5, tn, tf, d > 0 && tn === 0, false, d, s > 0 ? 0.85 : 0.75, bseed, dark, haze));
  }
  if (d > 0 && !houseAt(d - 1, l)) {
    const tl = end(houseAt(d, l - 1), !houseAt(d - 1, l - 1)), tr = end(houseAt(d, l + 1), !houseAt(d - 1, l + 1));
    const kW = d - 0.5;
    slopes.push((soffit) => drawSlope(ctx, soffit, (a, b) => at(a, slopeAt(b, kW, kW - EAVE / 2, kW + RIDGE / 2), -1 - RISE * Math.max(0, b)), true,
      2 * l - 1, 2 * l + 1, tl, tr, tl < 0 || (tl === 0 && l > 0), tr < 0 || (tr === 0 && l < 0), d, 1, bseed, dark, haze));
  }
  // The undersides of the overhangs, carried on under the slopes, go down first as one shape, so
  // no line of sky shows where a slope meets its overhang or the next slope round a corner; then
  // the slopes over them.
  ctx.beginPath(); for (const slope of slopes) slope(true);
  ctx.fillStyle = fog('#2e2218', d, dark, haze); ctx.fill();
  for (const slope of slopes) slope(false);
}

/** Where a slope's cross-section is at b: -1 at the wall, 0 at the eave, 1 at the ridge. */
function slopeAt(b: number, wall: number, eave: number, ridge: number): number { return b < 0 ? eave + (eave - wall) * b : eave + (ridge - eave) * b; }

/**
 * One slope: `pt(a, b)` is the point `a` along it (X across the front, k along a side) at b = 0 on
 * the eave, 1 on the ridge and -1 on the wall under the overhang. `lo..hi` is the cell's stretch of
 * wall, and each end is hipped (1), runs on (0) or meets another slope in a valley (-1); `grow0`
 * and `grow1` carry an end on under the slope beyond it, so that one's edge, painted later, falls
 * on solid tiles and not on the sky. Tiles sit at fixed places along the roof, so they carry on
 * from one cell's slope into the next; a side slope's are fogged by their own depth, as a side
 * wall's blocks are. With `soffit`, it only adds the underside of its overhang to the path, and
 * the slope above it, which the slope then covers.
 */
function drawSlope(ctx: CanvasRenderingContext2D, soffit: boolean, pt: (a: number, b: number) => [number, number], front: boolean, lo: number, hi: number, t0: number, t1: number, grow0: boolean, grow1: boolean, d: number, tone: number, bseed: number, dark: boolean, haze: string | null): void {
  const sc = front ? 1 : 0.5;                            // `a` runs in half cells across, whole cells in depth
  const clip = (a: number) => front ? a : Math.max(0, a);
  const eave = [clip(lo - t0 * EAVE * sc), hi + t1 * EAVE * sc], ridge = [clip(lo + t0 * RIDGE * sc), hi - t1 * RIDGE * sc];
  const wall = [clip(lo - Math.min(t0, 0) * EAVE * sc), hi + Math.min(t1, 0) * EAVE * sc];
  const g0 = grow0 ? 0.2 * sc : 0, g1 = grow1 ? 0.2 * sc : 0;
  const E = [clip(eave[0] - g0), eave[1] + g1], R = [clip(ridge[0] - g0), ridge[1] + g1], W = [clip(wall[0] - g0), wall[1] + g1];
  const base = roofColor(bseed), fd = (a: number) => front ? d : a;
  if (soffit) { addPoly(ctx, [pt(W[0], -1), pt(W[1], -1), pt(E[1], 0), pt(R[1], 1), pt(R[0], 1), pt(E[0], 0)]); return; }
  // The slope, then its tiles clipped to it: rows each a shade off the next, the lip of the row
  // above shadowing the one below, and staggered joints six to a cell.
  const c0 = pt(E[0], 0), c1 = pt(E[1], 0), c2 = pt(R[1], 1), c3 = pt(R[0], 1);
  ctx.beginPath(); ctx.moveTo(c0[0], c0[1]); ctx.lineTo(c1[0], c1[1]); ctx.lineTo(c2[0], c2[1]); ctx.lineTo(c3[0], c3[1]); ctx.closePath();
  ctx.fillStyle = fog(shade(base, tone), d, dark, haze); ctx.fill();
  ctx.save(); ctx.clip();
  const a0 = Math.min(E[0], R[0]), a1 = Math.max(E[1], R[1]), step = sc / 3, rows = 6;
  const mid = (a0 + a1) / 2, rowH = Math.abs(pt(mid, 1)[1] - pt(mid, 0)[1]) / rows;
  for (let i = 0; i < rows; i++) {
    const b0 = i / rows, b1 = (i + 1) / rows, v = i % 2 ? 1 : 1 + (hash(bseed, 3, i) - 0.5) * 0.1;
    for (let a = Math.floor(a0 / step) * step - (i % 2) * step / 2; a < a1; a += step) {
      const p = Math.max(a, a0), q = Math.min(a + step, a1);
      quad(ctx, pt(p, b0), pt(q, b0), pt(q, b1), pt(p, b1), fog(shade(base, tone * v), fd(clip((p + q) / 2)), dark, haze));
      if (rowH > 2.5 && a > a0) { ctx.strokeStyle = rgba('#000000', 0.22); ctx.lineWidth = 1; line(ctx, pt(a, b0), pt(a, b1)); }
    }
    if (rowH > 2.5 && i > 0) { ctx.strokeStyle = fog(shade(base, tone * 0.72), d, dark, haze); ctx.lineWidth = 1; line(ctx, pt(a0, b0), pt(a1, b0)); }
  }
  ctx.restore();
  // The eave board, then caps along the ridge and the hips, and the outline where the slope ends.
  const lip = (a: number, b: number, t: number) => pt(a + (b - a) * t, t);
  quad(ctx, pt(E[0], 0), pt(E[1], 0), lip(E[1], R[1], 0.08), lip(E[0], R[0], 0.08), fog('#4a3020', d, dark, haze));
  const r0 = pt(ridge[0], 1), r1 = pt(ridge[1], 1), e0 = pt(eave[0], 0), e1 = pt(eave[1], 0), g = [pt(R[0], 1), pt(R[1], 1)];
  ctx.lineCap = 'butt'; ctx.strokeStyle = fog(shade(base, tone * 1.18), d, dark, haze); ctx.lineWidth = Math.max(1, rowH * 0.45);
  ctx.beginPath(); ctx.moveTo(g[0][0], g[0][1]); ctx.lineTo(g[1][0], g[1][1]);
  if (t0 === 1) { ctx.moveTo(e0[0], e0[1]); ctx.lineTo(r0[0], r0[1]); }
  if (t1 === 1) { ctx.moveTo(e1[0], e1[1]); ctx.lineTo(r1[0], r1[1]); }
  ctx.stroke();
  ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(r0[0], r0[1]); ctx.lineTo(r1[0], r1[1]);
  if (t0 !== 0) { ctx.moveTo(e0[0], e0[1]); ctx.lineTo(r0[0], r0[1]); }
  if (t1 !== 0) { ctx.moveTo(e1[0], e1[1]); ctx.lineTo(r1[0], r1[1]); }
  ctx.stroke();
}

/** A chimney stack on the flat of the roof over the middle of its cell, with a capped top. */
export function drawChimney(ctx: CanvasRenderingContext2D, at: At, d: number, l: number, dark: boolean, haze: string | null): void {
  const X = 2 * l, hx = 0.15, k0 = d - 0.08, k1 = d + 0.08, y0 = -1 - RISE, y1 = y0 - 1.0;
  const f0 = at(X - hx, k0, y0), f1 = at(X + hx, k0, y0), f2 = at(X + hx, k0, y1), f3 = at(X - hx, k0, y1);
  // The front and, off the centre line, the side toward the middle of the view, filled as one
  // shape in the side's shade so the corner between them has no seam; then the front over it.
  const xs = X - Math.sign(l) * hx;
  ctx.beginPath(); addPoly(ctx, [f0, f1, f2, f3]);
  if (l !== 0) addPoly(ctx, [at(xs, k0, y0), at(xs, k1, y0), at(xs, k1, y1), at(xs, k0, y1)]);
  ctx.fillStyle = fog(shade('#7a6a60', 0.75), d, dark, haze); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1; ctx.stroke();
  quad(ctx, f0, f1, f2, f3, fog('#7a6a60', d, dark, haze));
  quad(ctx, at(X - hx * 1.3, k0 - 0.02, y1), at(X + hx * 1.3, k0 - 0.02, y1), at(X + hx * 1.3, k0 - 0.02, y1 + 0.15), at(X - hx * 1.3, k0 - 0.02, y1 + 0.15), fog('#5a4a44', d, dark, haze));
}
