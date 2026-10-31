// The ash's look (#1030): the vents' fall, drifted and rippled, cinders in it and an ember now and then,
// glowing by night; it is warm and greys the snow that falls on it. Its variants across the land (#1101):
// a fine fall, the cinders and a crust cracked over the fire, the cracks glowing by night.

import { shade } from '../../../lib/art/palettes.ts';
import { TERRAIN_COLORS } from '../../palette.ts';
import { hash } from '../../paint/brush.ts';
import { fog, unitIn, floorPt } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark, Square } from './look.ts';
import { cracks as craze, ripples, stones } from './near.ts';
import type { Pixels } from './near.ts';

/** An ember, a drift, ripples, then cinders. */
function mark(p: Paint, m: Mark): void {
  const { ctx, cx, horizon, h, dark, env } = p, { i, s, t, x, y, sc, base, seed, d, l } = m;
  // Ash drifted and rippled by the wind, a cinder or two in it; now and then an ember, dull by
  // day and glowing by night. A deep snow hides them.
  if (env.cover > 0.55) return;
  if (i === 0) {
    if (hash(seed, 58) > 0.25) return;
    const ew = Math.max(1, Math.round(3 * sc)), eh = Math.max(1, Math.round(1.5 * sc)), ex = Math.round(x), ey = Math.round(y - sc);
    if (dark) { ctx.fillStyle = 'rgba(224, 100, 42, 0.3)'; ctx.beginPath(); ctx.ellipse(ex + ew / 2, ey + eh / 2, ew * 1.4, eh * 1.6, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = dark ? '#e0642a' : fog(p, '#7a3a26', d);
    ctx.fillRect(ex, ey, ew, eh);
  } else if (i === 1) {
    // A drift, kept inside its square, so it never reaches the foot of a wall beyond.
    if (d > 2) return;
    const ds = 0.25 + 0.45 * s, [px, py] = floorPt(cx, horizon, h, d, l, ds, 0.25 + 0.5 * t), pw = unitIn(d, ds, h) * (0.22 + 0.12 * hash(seed, 57)), ph = pw * 0.16;
    ctx.beginPath(); ctx.ellipse(px, py, pw, ph, 0, 0, Math.PI * 2); ctx.fillStyle = fog(p, shade(base, 1.22), d); ctx.fill();
  } else if (i < 4) {
    ctx.strokeStyle = fog(p, shade(base, 1.7), d); ctx.lineWidth = Math.max(1, sc * 0.8);
    ctx.beginPath(); ctx.moveTo(x - 5 * sc, y); ctx.quadraticCurveTo(x, y - 1.4 * sc, x + 5 * sc, y); ctx.stroke();
  } else {
    ctx.fillStyle = fog(p, i % 2 ? '#181616' : shade(base, 1.5), d);
    ctx.beginPath(); ctx.ellipse(x, y, 1.4 * sc + 0.4, 0.9 * sc + 0.3, 0, 0, Math.PI * 2); ctx.fill();
  }
}

/** The fine fall's: an ember now and then as the cinders' has, then long ripples and nothing else. */
function fine(p: Paint, m: Mark): void {
  if (m.i < 1) { mark(p, m); return; }
  const { ctx, env } = p, { x, y, sc, base, d } = m;
  if (env.cover > 0.55) return;
  ctx.strokeStyle = fog(p, shade(base, 1.35), d); ctx.lineWidth = Math.max(1, sc * 0.8);
  ctx.beginPath(); ctx.moveTo(x - 7 * sc, y); ctx.quadraticCurveTo(x, y - 1.2 * sc, x + 7 * sc, y); ctx.stroke();
}

/**
 * The crust's cracks, kept inside the square: dark by day, and by night the fire under them shows through,
 * as an ember does; a deep snow covers them.
 */
function cracks(p: Paint, base: string, sq: Square): void {
  const { ctx, cx, horizon, h, dark, env } = p, { d, l, seed } = sq;
  if (d > 3 || env.cover > 0.55) return;
  const P = (s: number, t: number): [number, number] => floorPt(cx, horizon, h, d, l, s, t), w = Math.max(1, unitIn(d, 0.5, h) / 40);
  const inside = (v: number): number => Math.max(0.08, Math.min(0.92, v));
  // Three cracks, two across the square and one along it, each jagged at four points by a hash.
  ctx.beginPath();
  for (let k = 0; k < 3; k++) {
    const at = 0.2 + 0.6 * hash(seed, 61, k);
    [0.08, 0.36, 0.64, 0.92].forEach((u, j) => {
      const v = inside(at + (hash(seed, 62 + j, k) - 0.5) * 0.3), [x, y] = k === 1 ? P(u, v) : P(v, u);
      if (j) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    });
  }
  if (dark) { ctx.strokeStyle = 'rgba(224, 100, 42, 0.3)'; ctx.lineWidth = w * 3; ctx.stroke(); }
  ctx.strokeStyle = dark ? '#e0642a' : fog(p, shade(base, 0.45), d); ctx.lineWidth = w; ctx.stroke();
}

// Near to (#1102, near.ts): cinders, black lumps lit grey on their tops, in the ash; the fine fall in soft ripples;
// the crust crazed between its cracks, the crazing glowing by night as the cracks do. A deep snow hides them all.

/** The cinders near to. */
function cinders(p: Paint, base: string, sq: Square): Pixels { return stones(p, base, sq, { rows: 8, cols: 10, size: [1.5, 4.5], bare: 0.4, body: '#1c1a1a', lit: 1.7, shadow: '#0e0c0c' }); }

/** The fine fall's: long soft ripples. */
function drifted(p: Paint, base: string, sq: Square): Pixels { return ripples(p, base, sq, { rows: 8, cols: 1, half: 22, lit: 1.45, shadow: 0.7 }); }

/** The crust's crazing: short cracks every way between the long ones, dark by day and lit by the fire under them by night. */
function crazed(p: Paint, base: string, sq: Square): Pixels { return craze(p, sq, 9, p.dark ? '#b8501e' : fog(p, shade(base, 0.4), sq.d)); }

export const ash: GroundLook = { color: () => TERRAIN_COLORS.ash, drift: { toward: ['#141212', '#6e6a66'], by: 0.6 }, snow: 0.65, wets: true, splashes: true, ripples: false, vary: 0.08, lies: { marks: 6, mark },
  scatter: ['stump', 'steam', 'cinder'], rank: 1, near: cinders,
  // A fine fall lying pale and smooth; the cinders; a crust, blacker, cracked over the fire.
  variants: { scale: 4, looks: [
    { name: 'fine fall', share: 0.35, shift: { toward: '#8a8480', by: 0.35 }, lies: { marks: 4, mark: fine }, near: drifted },
    { name: 'cinders', share: 0.4 },
    { name: 'crust', share: 0.25, shift: { toward: '#0c0a0a', by: 0.5 }, lays: cracks, lies: { marks: 1, mark }, near: crazed },
  ] } };
