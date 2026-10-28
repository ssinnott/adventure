// The tents (#1028): a tent's low felt wall, its door flap and its roof of felt over poles up to a crown.
// Which squares are a tent, and which tent, is the model's (`isTent`, `tentOf`).

import type { MapPalette } from '../../game/mapdef.ts';
import { FACING_DX, FACING_DY } from '../../game/types.ts';
import type { Facing } from '../../game/types.ts';
import { shade } from '../../lib/art/palettes.ts';
import { fog, outlineRect, line, addPoly } from './common.ts';
import type { Tent } from './model.ts';
import type { At } from './roofs.ts';

// A tent (a building's square, or its door, under a felt palette, outside a town) stands lower than a
// wall: its felt wall comes up a little over the eye, and its roof of felt over poles runs from an eave
// round the wall up to a crown over the tent's middle, as the trader's at Akordu is seen from inside
// (ui/interiors/glasswold/akordu_trader.ts). Tent squares that fill a rectangle are one tent.

/** A tent's felt wall's top, in view space (Y, down, in half squares): a little over the eye. */
export const TENT_WALL = -0.12;
/** How far a tent's roof stands out past its wall, in half squares, and how far its eave hangs under the wall's top. */
const TENT_EAVE = 0.16, TENT_DROOP = 0.07;
/** How high a tent's crown stands over its wall, in half squares, for a tent one square across; a wider one's stands higher. */
const TENT_RISE = 1.35;
/** The band of felt round a tent's foot, as the trader's is inside, and its lozenges. */
const OCHRE = '#c8902e';
/** A tent's walls in view space: X across in half squares, k ahead in squares, as `At` takes them. */
interface TentView { X0: number; X1: number; K0: number; K1: number }

export const inTent = (t: Tent, p: { x: number; y: number }): boolean => p.x >= t.x0 && p.x <= t.x1 && p.y >= t.y0 && p.y <= t.y1;

export function tentView(t: Tent, px: number, py: number, f: Facing): TentView {
  const rf = ((f + 1) & 3) as Facing, ks: number[] = [], xs: number[] = [];
  for (const [mx, my] of [[t.x0 - 0.5, t.y0 - 0.5], [t.x1 + 0.5, t.y1 + 0.5]]) {
    ks.push((mx - px) * FACING_DX[f] + (my - py) * FACING_DY[f]);
    xs.push(2 * ((mx - px) * FACING_DX[rf] + (my - py) * FACING_DY[rf]));
  }
  return { X0: Math.min(...xs), X1: Math.max(...xs), K0: Math.min(...ks), K1: Math.max(...ks) };
}

/** A felt wall's front: the felt, the eave's shadow on it, two girth ropes and the band round its foot. */
export function drawFeltFront(ctx: CanvasRenderingContext2D, pal: MapPalette, x0: number, x1: number, top: number, bottom: number, d: number, dark: boolean, haze: string | null, joinL: boolean, joinR: boolean): void {
  const X0 = Math.round(x0), X1 = Math.round(x1), T = Math.round(top), B = Math.round(bottom), w = x1 - x0, h = bottom - top;
  ctx.fillStyle = fog(pal.wall, d, dark, haze); ctx.fillRect(X0, T, X1 - X0, B - T);
  const sh = ctx.createLinearGradient(0, T, 0, T + h * 0.22);
  sh.addColorStop(0, 'rgba(0,0,0,0.28)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = sh; ctx.fillRect(X0, T, X1 - X0, Math.round(h * 0.22));
  ctx.fillStyle = fog(shade(pal.wall, 0.6), d, dark, haze);
  for (const t of [0.3, 0.58]) ctx.fillRect(X0, Math.round(top + h * t), X1 - X0, Math.max(1, Math.round(h * 0.03)));
  const b0 = Math.round(bottom - h * 0.2), b1 = Math.round(bottom - h * 0.07);
  ctx.fillStyle = fog(pal.banner, d, dark, haze); ctx.fillRect(X0, b0, X1 - X0, b1 - b0);
  if (b1 - b0 >= 4) {
    const n = Math.max(3, Math.round(w / 14)), lw = w / n / 2, mid = (b0 + b1) / 2, lh = (b1 - b0) * 0.36;
    ctx.fillStyle = fog(OCHRE, d, dark, haze);
    for (let i = 0; i < n; i++) { const lx = x0 + (i + 0.5) * w / n; ctx.beginPath(); ctx.moveTo(lx - lw * 0.5, mid); ctx.lineTo(lx, mid - lh); ctx.lineTo(lx + lw * 0.5, mid); ctx.lineTo(lx, mid + lh); ctx.closePath(); ctx.fill(); }
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1; outlineRect(ctx, X0, T, X1, B, !joinL, !joinR);
}

/**
 * A door in felt: the doorway's dark under a flap of the door's colour hung from a rolled head, its
 * lower corner turned back.
 */
export function drawFlap(ctx: CanvasRenderingContext2D, x0: number, x1: number, top: number, bottom: number, pal: MapPalette, d: number, dark: boolean, haze: string | null): void {
  const w = x1 - x0, h = bottom - top, dw = w * 0.38, x = x0 + (w - dw) / 2, y = bottom - h * 0.8;
  ctx.fillStyle = '#120d0a'; ctx.fillRect(Math.round(x), Math.round(y), Math.round(dw), Math.round(bottom - y));
  const fx = x + dw, fy = y + (bottom - y) * 0.5, tx = x + dw * 0.42;
  ctx.fillStyle = fog(pal.door, d, dark, haze);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(fx, y); ctx.lineTo(fx, fy); ctx.lineTo(tx, bottom); ctx.lineTo(x, bottom); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.lineWidth = 1; ctx.stroke();
  // The corner turned back: its lining, lighter, folded up over the flap.
  ctx.fillStyle = fog(shade(pal.door, 1.45), d, dark, haze);
  ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(tx, bottom); ctx.lineTo(x + dw * 0.6, fy + (bottom - fy) * 0.15); ctx.closePath(); ctx.fill();
  ctx.fillStyle = fog(shade(pal.door, 0.7), d, dark, haze);
  ctx.fillRect(Math.round(x - dw * 0.08), Math.round(y - h * 0.05), Math.round(dw * 1.16), Math.max(2, Math.round(h * 0.08)));
}

/** A polygon in view space (X, k) cut to the rectangle, as Sutherland and Hodgman cut it; its winding is kept. */
function clipRect(poly: [number, number][], x0: number, x1: number, k0: number, k1: number): [number, number][] {
  const cut = (pts: [number, number][], i: 0 | 1, v: number, keep: 1 | -1): [number, number][] => {
    const out: [number, number][] = [];
    for (let n = 0; n < pts.length; n++) {
      const a = pts[n], b = pts[(n + 1) % pts.length], ia = (a[i] - v) * keep >= 0, ib = (b[i] - v) * keep >= 0;
      if (ia) out.push(a);
      if (ia !== ib) { const t = (v - a[i]) / (b[i] - a[i]); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
    }
    return out;
  };
  return cut(cut(cut(cut(poly, 0, x0, 1), 0, x1, -1), 1, k0, 1), 1, k1, -1);
}

/** Twice a screen polygon's area: negative where its points run anticlockwise as the eye sees them. */
function area2(pts: [number, number][]): number {
  let a = 0;
  for (let n = 0; n < pts.length; n++) { const p = pts[n], q = pts[(n + 1) % pts.length]; a += p[0] * q[1] - q[0] * p[1]; }
  return a;
}

/**
 * The part of a tent's roof over one of its squares (d, l). The roof is a pyramid of felt from its
 * eave round the walls up to the crown over the tent's middle; each face that looks toward the eye is
 * cut to the square (out to the eave where the square is on the tent's edge, and never behind k = 0)
 * and shaded as it faces, its seams running up to the crown and its hem dark along the eave. The
 * crown's ring goes on last, by every square it stands on, so the one painted last has it over all.
 */
export function drawTentRoof(ctx: CanvasRenderingContext2D, at: At, v: TentView, d: number, l: number, pal: MapPalette, dark: boolean, haze: string | null): void {
  const E = TENT_EAVE, e = E / 2, ax0 = v.X0 - E, ax1 = v.X1 + E, ak0 = v.K0 - e, ak1 = v.K1 + e;
  const Xc = (v.X0 + v.X1) / 2, Kc = (v.K0 + v.K1) / 2, across = Math.min(v.X1 - v.X0, 2 * (v.K1 - v.K0)) / 2;
  const Ye = TENT_WALL + TENT_DROOP, Ya = TENT_WALL - TENT_RISE * (2 + across) / 3;
  const sx0 = 2 * l - 1 <= v.X0 + 1e-6 ? ax0 : 2 * l - 1, sx1 = 2 * l + 1 >= v.X1 - 1e-6 ? ax1 : 2 * l + 1;
  const sk0 = Math.max(0, d - 0.5 <= v.K0 + 1e-6 ? ak0 : d - 0.5), sk1 = d + 0.5 >= v.K1 - 1e-6 ? ak1 : d + 0.5;
  // Toward the crown along a seam, stopping short of k = 0 where the crown is behind the eye.
  const crown = (X: number, k: number): [number, number] => {
    if (Kc >= 0.05) return at(Xc, Kc, Ya);
    const t = (k - 0.05) / (k - Kc);
    return at(X + (Xc - X) * t, 0.05, Ye + (Ya - Ye) * t);
  };
  // Each face: its eave's ends, left then right as seen from outside it; how far up it a point is; its shade.
  const faces: [[number, number], [number, number], (X: number, k: number) => number, number][] = [
    [[ax0, ak0], [ax1, ak0], (_X, k) => (k - ak0) / (Kc - ak0), 1],
    [[ax1, ak1], [ax0, ak1], (_X, k) => (ak1 - k) / (ak1 - Kc), 0.7],
    [[ax0, ak1], [ax0, ak0], (X) => (X - ax0) / (Xc - ax0), 0.88],
    [[ax1, ak0], [ax1, ak1], (X) => (ax1 - X) / (ax1 - Xc), 0.76],
  ];
  for (const [a, b, up, tone] of faces) {
    const ground = clipRect([a, b, [Xc, Kc]], sx0, sx1, sk0, sk1);
    if (ground.length < 3) continue;
    const pts = ground.map(([X, k]) => at(X, k, Ye + (Ya - Ye) * up(X, k)));
    if (area2(pts) > -1) continue;
    ctx.beginPath(); addPoly(ctx, pts);
    ctx.fillStyle = fog(shade(pal.wall, tone), d, dark, haze); ctx.fill();
    ctx.save(); ctx.clip();
    const ea = at(a[0], Math.max(a[1], 0.05), Ye), eb = at(b[0], Math.max(b[1], 0.05), Ye), len = Math.hypot(eb[0] - ea[0], eb[1] - ea[1]);
    ctx.strokeStyle = fog(shade(pal.wall, tone * 0.8), d, dark, haze); ctx.lineWidth = 1;
    const seams = Math.max(2, Math.min(8, Math.round(len / 12)));
    for (let i = 1; i < seams; i++) {
      const sX = a[0] + (b[0] - a[0]) * i / seams, sk = a[1] + (b[1] - a[1]) * i / seams;
      if (sk >= 0.05) line(ctx, at(sX, sk, Ye), crown(sX, sk));
    }
    // The hem along the eave. The eave stands TENT_EAVE out past the wall and goes down after any wall
    // beside the tent, so a tent hard against a wall would lay it over a few pixels of that wall's side
    // near to (8 to 13 at a square's distance); no map puts a tent against a wall.
    ctx.strokeStyle = fog(shade(pal.wall, 0.55), d, dark, haze); ctx.lineWidth = Math.max(1.5, len * 0.012);
    line(ctx, ea, eb);
    ctx.restore();
    ctx.strokeStyle = 'rgba(0,0,0,0.45)'; ctx.lineWidth = 1; ctx.stroke();
  }
  if (Kc < 0.05 || Xc < 2 * l - 1 - 1e-6 || Xc > 2 * l + 1 + 1e-6 || Kc < d - 0.5 - 1e-6 || Kc > d + 0.5 + 1e-6) return;
  // The crown: the ring the poles run up to, standing a little proud of the felt, and the felt cover
  // over its smoke hole.
  const [cx, cy] = at(Xc, Kc, Ya), r = Math.abs(at(Xc + 0.3, Kc, Ya)[0] - cx), ry = Math.max(1, r * 0.32), rise = r * 0.45;
  ctx.fillStyle = fog('#7a5430', d, dark, haze);
  ctx.beginPath(); ctx.moveTo(cx - r, cy - rise); ctx.lineTo(cx + r, cy - rise); ctx.lineTo(cx + r, cy); ctx.ellipse(cx, cy, r, ry, 0, 0, Math.PI); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = fog(shade(pal.wall, 0.94), d, dark, haze);
  ctx.beginPath(); ctx.ellipse(cx, cy - rise, r * 1.05, Math.max(1, r * 0.6), 0, Math.PI, Math.PI * 2); ctx.closePath(); ctx.fill(); ctx.stroke();
}
