// The hills' look (#1030): hill grass through the year, and the mound each square of it rises in (`mound`):
// its body and the light on its crest (`hillBody`, which the smoke holds to its outline) and tufts on it.
// A region's look names its hills' kind (#1105): chalk downs, granite tors, slag heaps, cinder cones or
// scree, each drawn over the hill's colour and its marks laid at a rate (`HILL_MARKS`); with none named a
// hill is as it was, call for call (tools/tests/hills.ts).

import { shade, mix } from '../../../lib/art/palettes.ts';
import { celPoly } from '../../../lib/art/shading.ts';
import { hash } from '../../paint/brush.ts';
import { B } from '../../monsters/kit/common.ts';
import { fog, unit, unitIn, floorPt, grassColor, SNOW } from '../common.ts';
import type { Paint } from '../common.ts';
import type { AreaLook } from '../../../content/area.ts';
import type { GroundLook } from './look.ts';

/** Hill grass: the grass of the year, thinner and drier on the rise. */
function hillColor(day: number): string { return mix(grassColor(day), '#8a8450', 0.3); }

/** A kind of hill, as an area's look names it. */
type Kind = NonNullable<AreaLook['hills']>;

/**
 * The marks each kind lays on its hills, so that a range of them reads and is no clutter: the share of its
 * hills that carry them, by the square's seed, and the most one carries. One or two chalk scars on a down,
 * a tor on a moor's hill, a thread of smoke over a slag heap, one or two runs of fire down a cinder cone,
 * and a fan of scree. The rest of each kind is its body alone.
 */
export const HILL_MARKS: Readonly<Record<Kind, { share: number; most: number }>> = {
  downs: { share: 0.5, most: 2 }, tors: { share: 0.35, most: 1 }, slag: { share: 0.2, most: 1 }, cinder: { share: 0.5, most: 2 }, scree: { share: 0.5, most: 1 },
};

/** How many marks a hill of a kind carries, by its square's seed. */
export function hillMarks(kind: Kind, seed: number): number {
  const m = HILL_MARKS[kind];
  return hash(seed, 64) < m.share ? 1 + Math.floor(hash(seed, 65) * m.most) : 0;
}

/** The kinds' own colours, before the weather: chalk, granite, scree, slag, cinder, smoke, and a cone's fire by day and by night. */
const CHALK = '#eee8d4', GRANITE = '#8e8b84', SCREE = '#a4a29a', SLAG = '#36322e', CINDER = '#241e1e', SMOKE = '#9c968e', EMBERS = '#5a2418', FIRE = '#ff4a1c';

/**
 * A colour under the weather as the ground's is (`groundColor`): darker wet, and whitened by lying snow,
 * `hold` of the way the ground's look goes. What fades it with distance, the night and murk is `fog`'s.
 */
function weathered(p: Paint, c: string, hold: number): string {
  const { wet, cover } = p.env, w = wet > 0 ? shade(c, 1 - 0.18 * wet) : c;
  return cover * hold > 0 ? mix(w, SNOW, cover * hold) : w;
}

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

/**
 * A hill's outline on the screen: its foot from lx to rx at ly, the curve over its crest and how high it
 * rises; a heap's or a cone's (`peak`, the middle of its top) is straight-sided in place of the curve.
 */
interface HillShape { outline: Path2D; lx: number; ly: number; rx: number; top: number; c1: [number, number]; c2: [number, number]; rise: number; peak?: [number, number] }

/** The point on a round hill's crest `t` of the way across it. */
function onCrest(s: HillShape, t: number): [number, number] {
  const m = 1 - t;
  return [m * m * m * s.lx + 3 * m * m * t * s.c1[0] + 3 * m * t * t * s.c2[0] + t * t * t * s.rx, m * m * m * s.ly + 3 * m * m * t * s.top + 3 * m * t * t * s.top + t * t * t * s.ly];
}

/**
 * A hill's body: the mound and the light on its crest, and nothing outside its outline, which is
 * returned for the tufts and for the smoke test to hold it to. The crest light is clipped to the
 * outline, so it cannot float clear of the hill with a sliver of sky beneath, as a line drawn off
 * the outline does; so are a down's chalk scars and a fan of scree. A slag heap and a cinder cone
 * are bodies of their own (`heap`).
 */
export function hillBody(p: Paint, base: string, d: number, l: number, seed: number, hillL: boolean, hillR: boolean, kind?: Kind): HillShape {
  const { ctx, cx, horizon, h } = p;
  const [lx, ly] = floorPt(cx, horizon, h, d, l, 0.02, hillL ? -0.25 : 0.02);
  const [rx] = floorPt(cx, horizon, h, d, l, 0.02, hillR ? 1.25 : 0.98);
  const w = rx - lx, rise = unitIn(d, 0.5, h) * (0.4 + 0.5 * hash(seed, 61)), lean = (hash(seed, 62) - 0.5) * 0.4 * w;
  const top = ly - rise / 0.75;
  const c1: [number, number] = [lx + w * 0.3 + lean, top], c2: [number, number] = [rx - w * 0.3 + lean, top];
  const s: HillShape = { outline: new Path2D(), lx, ly, rx, top, c1, c2, rise };
  if (kind === 'slag' || kind === 'cinder') { heap(p, s, base, d, seed, lean, kind); return s; }
  const outline = s.outline;
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
  if (kind === 'downs') scars(p, s, base, d, seed);
  else if (kind === 'scree') fan(p, s, base, d, seed);
  ctx.restore();
  return s;
}

/** A down's chalk: pale scars where the turf is broken, each from under the crest down and out along the flank. */
function scars(p: Paint, s: HillShape, base: string, d: number, seed: number): void {
  const { ctx } = p, sc = unit(d, p.h) / unit(1, p.h), w = s.rx - s.lx;
  ctx.fillStyle = fog(p, mix(base, weathered(p, CHALK, 0.92), 0.8), d);
  for (let i = 0; i < hillMarks('downs', seed); i++) {
    const t = 0.22 + 0.56 * hash(seed, 66, i), [x, y] = onCrest(s, t), out = (t - 0.5) * w * 0.5;
    const y0 = y + s.rise * 0.08, y1 = y + s.rise * (0.5 + 0.3 * hash(seed, 67, i)), ym = (y0 + y1) / 2, a = 2 * sc, b = 4.5 * sc;
    ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x + out * 0.5 + b, ym); ctx.lineTo(x + out + a, y1); ctx.lineTo(x + out - a, y1); ctx.lineTo(x + out * 0.5 - b * 0.7, ym + a);
    ctx.closePath(); ctx.fill();
  }
}

/** A fan of scree down one flank, from under the crest to the foot, its stones the larger the lower they lie. */
function fan(p: Paint, s: HillShape, base: string, d: number, seed: number): void {
  if (!hillMarks('scree', seed)) return;
  const { ctx } = p, sc = unit(d, p.h) / unit(1, p.h), w = s.rx - s.lx, dir = hash(seed, 68) < 0.5 ? -1 : 1;
  const [x, y] = onCrest(s, 0.5 + dir * (0.1 + 0.12 * hash(seed, 69))), ay = y + s.rise * 0.05, fx = x + dir * w * 0.1, spread = w * 0.13;
  const edge = (k: number, side: number): [number, number] => { const f = k / 4; return [x + (fx - x) * f + side * spread * f * (0.85 + 0.3 * hash(seed, 79, k + side)), ay + (s.ly + 2 - ay) * f]; };
  const pts = [[x, ay] as [number, number], ...[1, 2, 3, 4].map((k) => edge(k, 1)), ...[4, 3, 2, 1].map((k) => edge(k, -1))];
  ctx.fillStyle = fog(p, mix(base, weathered(p, SCREE, 0.6), 0.55), d);
  ctx.beginPath(); ctx.moveTo(...pts[0]); for (const q of pts.slice(1)) ctx.lineTo(...q); ctx.closePath(); ctx.fill();
  const lit = fog(p, weathered(p, SCREE, 0.5), d), under = fog(p, shade(weathered(p, SCREE, 0.3), 0.62), d);
  for (let k = 0; k < 5; k++) {
    const f = 0.22 + 0.72 * (k + hash(seed, 80, k)) / 5, sx = x + (fx - x) * f + (hash(seed, 81, k) - 0.5) * spread * f * 1.4, sy = ay + (s.ly - ay) * f, r = (1.2 + 2.4 * f) * sc;
    const stone = [sx - r, sy, sx - r * 0.6, sy - r * 0.7, sx + r * 0.5, sy - r * 0.8, sx + r, sy - r * 0.1, sx + r * 0.6, sy + r * 0.3];
    for (const [c, dy] of [[under, Math.max(1, sc)], [lit, 0]] as const) {
      ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(stone[0], stone[1] + dy);
      for (let i = 2; i < stone.length; i += 2) ctx.lineTo(stone[i], stone[i + 1] + dy);
      ctx.closePath(); ctx.fill();
    }
  }
}

/**
 * A slag heap or a cinder cone, in place of the round hill: straight-sided, a heap flat along its top where
 * the tubs were tipped and a cone narrow to its crater, dark, lit along the top and at the foot the ground
 * again. Pale runs of tipped slag go down a heap; a cone's crater and its runs of fire are lit red by night,
 * whatever the dark, and dull by day.
 */
function heap(p: Paint, s: HillShape, base: string, d: number, seed: number, lean: number, kind: 'slag' | 'cinder'): void {
  const { ctx, h, env } = p, { lx, ly, rx, rise } = s, w = rx - lx, top = ly - rise, mid = (lx + rx) / 2 + lean * 0.5, sc = unit(d, h) / unit(1, h);
  const tl: [number, number] = kind === 'slag' ? [mid - w * (0.17 + 0.05 * hash(seed, 75)), top + rise * 0.06] : [mid - w * 0.1, top];
  const tr: [number, number] = kind === 'slag' ? [mid + w * (0.17 + 0.05 * hash(seed, 77)), top + rise * 0.08] : [mid + w * 0.1, top + rise * 0.03];
  // A cone's flanks are steeper toward the top; its crater is a notch between its lips.
  const crater: [number, number][] = kind === 'cinder' ? [[mid - w * 0.04, top + rise * 0.08], [mid + w * 0.04, top + rise * 0.07]] : [[(tl[0] + tr[0]) / 2 + w * 0.06 * (hash(seed, 76) - 0.5), top]];
  const flank = (foot: number, lip: [number, number]): [number, number] => (kind === 'cinder' ? [foot + (lip[0] - foot) * 0.62, ly - rise * 0.5] : [(foot + lip[0]) / 2, (ly + lip[1]) / 2]);
  const pts: [number, number][] = [[lx, ly], flank(lx, tl), tl, ...crater, tr, flank(rx, tr), [rx, ly]];
  const o = s.outline;
  o.moveTo(...pts[0]); for (const q of pts.slice(1)) o.lineTo(...q); o.closePath();
  s.peak = kind === 'cinder' ? [mid, top + rise * 0.07] : crater[0];
  const body = mix(base, weathered(p, kind === 'slag' ? SLAG : CINDER, 0.92), 0.85), glow = kind === 'cinder' ? 1 - p.daylight : 0;
  // Fire seen through murk fades into it; by night nothing else darkens it.
  const fire = (c: string): string => (env.murk > 0 && p.haze ? mix(c, p.haze, Math.min(0.6, d * env.murk * 0.25)) : c);
  const g = ctx.createLinearGradient(0, top, 0, ly);
  g.addColorStop(0, mix(fog(p, shade(body, 1.4), d), fire(EMBERS), glow * 0.5)); g.addColorStop(0.55, fog(p, body, d)); g.addColorStop(1, fog(p, base, d - 0.5));
  ctx.fillStyle = g; ctx.fill(o);
  ctx.save(); ctx.clip(o);
  ctx.lineWidth = Math.max(1, 1.2 * sc);
  if (kind === 'slag') {
    ctx.strokeStyle = fog(p, mix(body, weathered(p, '#8a8278', 0.92), 0.4), d);
    for (let i = 0; i < 3; i++) {
      const t = 0.15 + 0.7 * ((i + hash(seed, 82, i)) / 3), x0 = tl[0] + (tr[0] - tl[0]) * t, x1 = lx + w * (0.1 + 0.8 * ((i + hash(seed, 83, i)) / 3));
      ctx.beginPath(); ctx.moveTo(x0, top + rise * 0.04); ctx.lineTo(x1, ly); ctx.stroke();
    }
  } else {
    ctx.strokeStyle = mix(fog(p, shade(EMBERS, 0.7), d), fire(shade(FIRE, 0.8)), glow);
    for (let i = 0; i < hillMarks('cinder', seed); i++) {
      const dir = (i + Math.floor(hash(seed, 84) * 2)) % 2 ? 1 : -1, x0 = mid + dir * w * 0.05, y1 = ly - rise * (0.15 + 0.2 * hash(seed, 85, i));
      ctx.beginPath(); ctx.moveTo(x0, top + rise * 0.06); ctx.lineTo(x0 + dir * w * 0.08, top + rise * 0.45); ctx.lineTo(x0 + dir * w * (0.1 + 0.08 * hash(seed, 86, i)), y1); ctx.stroke();
    }
  }
  // The top: a heap's lit where the tubs ran, a cone's lips about its fire.
  ctx.lineWidth = 2;
  ctx.strokeStyle = kind === 'slag' ? fog(p, shade(body, 1.7), d) : mix(fog(p, EMBERS, d), fire(FIRE), glow);
  ctx.beginPath(); ctx.moveTo(...tl); for (const q of crater) ctx.lineTo(...q); ctx.lineTo(...tr); ctx.stroke();
  ctx.restore();
}

/** A tor on a hill's crest: two or three granite slabs piled, lit and shadowed as a rock is, snow on each top once it lies. */
function tor(p: Paint, s: HillShape, d: number, seed: number): void {
  const { ctx, h, env } = p, u = unit(d, h), stone = fog(p, weathered(p, GRANITE, 0.25), d);
  const [x0, y0] = onCrest(s, 0.38 + 0.24 * hash(seed, 70)), n = 2 + Math.floor(hash(seed, 71) * 2);
  let x = x0, y = y0 + u * 0.04, bw = u * (0.34 + 0.1 * hash(seed, 72));
  for (let i = 0; i < n; i++) {
    const bh = bw * (0.36 + 0.1 * hash(seed, 73, i));
    celPoly(ctx, B, [x - bw / 2, y, x - bw / 2, y - bh * 0.65, x - bw * 0.38, y - bh, x + bw * 0.4, y - bh, x + bw / 2, y - bh * 0.6, x + bw / 2, y], stone, 0.38, 0.25);
    if (env.cover > 0.2) {
      ctx.fillStyle = mix(shade(stone, 1.15), fog(p, SNOW, d), Math.min(1, env.cover * 1.2));
      ctx.beginPath(); ctx.moveTo(x - bw * 0.38, y - bh); ctx.lineTo(x + bw * 0.4, y - bh); ctx.lineTo(x + bw * 0.46, y - bh * 0.78); ctx.lineTo(x - bw * 0.46, y - bh * 0.78); ctx.closePath(); ctx.fill();
    }
    y -= bh * 0.96; x += (hash(seed, 74, i) - 0.5) * bw * 0.25; bw *= 0.78;
  }
}

/** A thread of smoke from a slag heap's top, going up and bending away on the wind, the same way over every heap. */
function smoke(p: Paint, s: HillShape, d: number, seed: number): void {
  if (!s.peak) return;
  const { ctx, h } = p, u = unit(d, h), sc = u / unit(1, h), [x0, y0] = s.peak;
  ctx.strokeStyle = fog(p, SMOKE, d);
  for (const [from, to, lw] of [[0, 3, 2], [3, 7, 1.2]] as const) {
    ctx.lineWidth = Math.max(1, lw * sc); ctx.beginPath();
    for (let k = from; k <= to; k++) {
      const f = k / 7, x = x0 + u * 0.3 * f * f + Math.sin(f * 6 + hash(seed, 87) * 6) * u * 0.035;
      if (k === from) ctx.moveTo(x, y0 - u * 0.85 * f); else ctx.lineTo(x, y0 - u * 0.85 * f);
    }
    ctx.stroke();
  }
}

/**
 * Rising ground: a round-shouldered mound on the square, lit on its crest, running on into the next
 * hill beside it, or the heap or the cone its kind is. What stands on its crest is drawn after its
 * body and stands over the outline: tufts of grass, a tor, a slag heap's smoke. What it hides from
 * lower ground (`hillOver`, game/world.ts) the scene leaves undrawn, whatever its kind.
 */
function drawHill(p: Paint, base: string, d: number, l: number, seed: number, hillL: boolean, hillR: boolean, kind?: Kind): void {
  const { ctx, h, env } = p;
  const s = hillBody(p, base, d, l, seed, hillL, hillR, kind), { lx, ly, rx, top, c1, c2 } = s;
  if (kind === 'slag') { if (hillMarks('slag', seed)) smoke(p, s, d, seed); return; }
  if (kind === 'cinder') return;
  // Tufts on the crest, buried by a deep snow: grass, which stands above the outline.
  if (d <= 2 && env.cover <= 0.55) {
    const u = unit(d, h), sc = u / unit(1, h);
    ctx.strokeStyle = fog(p, shade(hillColor(env.day), env.cover > 0.05 ? 0.85 : 1.25), d); ctx.lineWidth = Math.max(1, sc);
    for (let i = 0; i < 5; i++) {
      const t = 0.2 + 0.6 * hash(seed, 63, i), m = 1 - t;
      const x = m * m * m * lx + 3 * m * m * t * c1[0] + 3 * m * t * t * c2[0] + t * t * t * rx;
      const y = m * m * m * ly + 3 * m * m * t * top + 3 * m * t * t * top + t * t * t * ly + 2 * sc;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 1.5 * sc, y - 4 * sc); ctx.moveTo(x, y); ctx.lineTo(x + 1.5 * sc, y - 3.5 * sc); ctx.stroke();
    }
  }
  if (kind === 'tors' && hillMarks('tors', seed)) tor(p, s, d, seed);
}

export const hills: GroundLook = { color: hillColor, drift: { toward: ['#3a7232', '#ac9658'], by: 0.6 }, snow: 0.92, wets: true, splashes: true, ripples: false, vary: 0.08, mound: drawHill };
