// The hills' look (#1030): hill grass through the year, and the mound each square of it rises in (`mound`):
// its body and the light on its crest (`hillBody`, which the smoke holds to its outline) and tufts on it.

import { shade, mix } from '../../../lib/art/palettes.ts';
import { hash } from '../../paint/brush.ts';
import { fog, unit, unitIn, floorPt, grassColor } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook } from './look.ts';

/** Hill grass: the grass of the year, thinner and drier on the rise. */
function hillColor(day: number): string { return mix(grassColor(day), '#8a8450', 0.3); }

/** The part of a cubic Bézier from t = a to t = b, as a cubic of its own (de Casteljau). */
function subCubic(p0: [number, number], p1: [number, number], p2: [number, number], p3: [number, number], a: number, b: number): [number, number][] {
  const at = (t: number, q: [number, number][]): [number, number][] => {
    const lerp = (u: [number, number], v: [number, number]): [number, number] => [u[0] + (v[0] - u[0]) * t, u[1] + (v[1] - u[1]) * t];
    const [q0, q1, q2, q3] = q, r0 = lerp(q0, q1), r1 = lerp(q1, q2), r2 = lerp(q2, q3), s0 = lerp(r0, r1), s1 = lerp(r1, r2);
    return [q0, r0, s0, lerp(s0, s1), s1, r2, q3];
  };
  // Split at b, keep the first part; split that at a / b, keep the second.
  const first = at(b, [p0, p1, p2, p3]).slice(0, 4);
  return at(a / b, first).slice(3);
}

/** A hill's outline on the screen: its foot from lx to rx at ly, and the curve over its crest. */
interface HillShape { outline: Path2D; lx: number; ly: number; rx: number; top: number; c1: [number, number]; c2: [number, number] }

/**
 * A hill's body: the mound and the light on its crest, and nothing outside its outline, which is
 * returned for the tufts and for the smoke test to hold it to. The crest light is clipped to the
 * outline, so it cannot float clear of the hill with a sliver of sky beneath, as a line drawn off
 * the outline does.
 */
export function hillBody(p: Paint, base: string, d: number, l: number, seed: number, hillL: boolean, hillR: boolean): HillShape {
  const { ctx, cx, horizon, h } = p;
  const [lx, ly] = floorPt(cx, horizon, h, d, l, 0.02, hillL ? -0.25 : 0.02);
  const [rx] = floorPt(cx, horizon, h, d, l, 0.02, hillR ? 1.25 : 0.98);
  const w = rx - lx, rise = unitIn(d, 0.5, h) * (0.4 + 0.5 * hash(seed, 61)), lean = (hash(seed, 62) - 0.5) * 0.4 * w;
  const top = ly - rise / 0.75;
  const c1: [number, number] = [lx + w * 0.3 + lean, top], c2: [number, number] = [rx - w * 0.3 + lean, top];
  const outline = new Path2D();
  outline.moveTo(lx, ly); outline.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], rx, ly); outline.closePath();
  const g = ctx.createLinearGradient(0, ly - rise, 0, ly);
  // Lit on the crest, shadowed down the flank, and at the foot the ground again, so no seam shows
  // where the hill meets the floor in front of it.
  g.addColorStop(0, fog(p, shade(base, 1.1), d)); g.addColorStop(0.6, fog(p, shade(base, 0.86), d)); g.addColorStop(1, fog(p, base, d - 0.5));
  ctx.fillStyle = g; ctx.fill(outline);
  const crest = subCubic([lx, ly], c1, c2, [rx, ly], 0.15, 0.85);
  ctx.save(); ctx.clip(outline);
  ctx.strokeStyle = fog(p, shade(base, 1.14), d); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(...crest[0]); ctx.bezierCurveTo(...crest[1], ...crest[2], ...crest[3]); ctx.stroke();
  ctx.restore();
  return { outline, lx, ly, rx, top, c1, c2 };
}

/**
 * Rising ground: a round-shouldered mound on the square, lit on its crest, running on into the next
 * hill beside it. What it hides from lower ground (`hillOver`, game/world.ts) the scene leaves undrawn.
 */
function drawHill(p: Paint, base: string, d: number, l: number, seed: number, hillL: boolean, hillR: boolean): void {
  const { ctx, h, env } = p;
  const { lx, ly, rx, top, c1, c2 } = hillBody(p, base, d, l, seed, hillL, hillR);
  // Tufts on the crest, buried by a deep snow: grass, which stands above the outline.
  if (d > 2 || env.cover > 0.55) return;
  const u = unit(d, h), sc = u / unit(1, h);
  ctx.strokeStyle = fog(p, shade(hillColor(env.day), env.cover > 0.05 ? 0.85 : 1.25), d); ctx.lineWidth = Math.max(1, sc);
  for (let i = 0; i < 5; i++) {
    const t = 0.2 + 0.6 * hash(seed, 63, i), m = 1 - t;
    const x = m * m * m * lx + 3 * m * m * t * c1[0] + 3 * m * t * t * c2[0] + t * t * t * rx;
    const y = m * m * m * ly + 3 * m * m * t * top + 3 * m * t * t * top + t * t * t * ly + 2 * sc;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 1.5 * sc, y - 4 * sc); ctx.moveTo(x, y); ctx.lineTo(x + 1.5 * sc, y - 3.5 * sc); ctx.stroke();
  }
}

export const hills: GroundLook = { color: hillColor, drift: { toward: ['#3a7232', '#ac9658'], by: 0.6 }, snow: 0.92, wets: true, splashes: true, ripples: false, vary: 0.08, mound: drawHill };
