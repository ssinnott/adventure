// The swamp's look (#1030): wet ground, reeds standing in it; and its variants across the land (#1101):
// the reeds, open pools holding a little of the sky and tussocks.

import { shade, mix, rgba } from '../../../lib/art/palettes.ts';
import { TERRAIN_COLORS } from '../../palette.ts';
import { hash } from '../../paint/brush.ts';
import { fog, floorPt, unitIn } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark, Square } from './look.ts';

/** A pair of reeds. */
function mark(p: Paint, m: Mark): void {
  const { ctx } = p, { x, y, sc, d } = m;
  ctx.strokeStyle = fog(p, '#6a7a3a', d); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 0.5 * sc, y - 7 * sc); ctx.moveTo(x + 2 * sc, y); ctx.lineTo(x + 1.5 * sc, y - 5 * sc); ctx.stroke();
}

/**
 * A pool on half the squares, its size and place by a hash and kept inside the square, so the pools never
 * stand in a grid: dark water with the sky in it, and ice under a hard snow.
 */
function pool(p: Paint, base: string, sq: Square): void {
  const { ctx, cx, horizon, h, haze, env } = p, { d, l, seed } = sq;
  if (d > 4 || hash(seed, 81) > 0.5) return;
  const [x, y] = floorPt(cx, horizon, h, d, l, 0.35 + 0.3 * hash(seed, 82), 0.3 + 0.4 * hash(seed, 83)), w = unitIn(d, 0.5, h) * (0.25 + 0.2 * hash(seed, 84)), ht = w * 0.32;
  ctx.beginPath(); ctx.ellipse(x, y, w, ht, 0, 0, Math.PI * 2); ctx.fillStyle = fog(p, env.cover > 0.55 ? shade(base, 0.92) : mix(shade(base, 0.6), '#4a6a7a', 0.5), d); ctx.fill();
  if (env.cover > 0.55) return;
  ctx.beginPath(); ctx.ellipse(x - w * 0.2, y - ht * 0.25, w * 0.5, ht * 0.35, 0, 0, Math.PI * 2); ctx.fillStyle = rgba(fog(p, haze ?? '#8a94a4', d), 0.5); ctx.fill();
}

/** A tussock: a clump of rush, dark at its foot. */
function tussock(p: Paint, m: Mark): void {
  const { ctx, env } = p, { x, y, sc, base, d } = m;
  if (env.cover > 0.55) return;
  ctx.fillStyle = fog(p, shade(base, 0.7), d);
  ctx.beginPath(); ctx.ellipse(x, y - sc, 3 * sc + 0.5, 1.6 * sc + 0.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = fog(p, mix(base, '#9aa858', 0.5), d); ctx.lineWidth = Math.max(1, sc * 0.7);
  ctx.beginPath(); for (const k of [-2, -0.7, 0.6, 1.9]) { ctx.moveTo(x + k * sc, y - sc); ctx.lineTo(x + k * 1.6 * sc, y - 5.5 * sc); } ctx.stroke();
}

export const swamp: GroundLook = { color: () => TERRAIN_COLORS.swamp, drift: { toward: ['#2e4a2c', '#8c8a48'], by: 0.6 }, snow: 0.5, wets: true, splashes: true, ripples: false, vary: 0.08, lies: { marks: 3, mark },
  scatter: ['reeds', 'snag'],
  // Pools where the ground is wettest, the reeds about them, tussocks on the drier ground.
  variants: { scale: 4, looks: [
    { name: 'pools', share: 0.3, shift: { toward: '#2a4034', by: 0.5 }, lays: pool, lies: { marks: 1, mark } },
    { name: 'reeds', share: 0.4 },
    { name: 'tussocks', share: 0.3, shift: { toward: '#8a9444', by: 0.55 }, lies: { marks: 4, mark: tussock } },
  ] } };
