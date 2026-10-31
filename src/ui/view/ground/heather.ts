// Heather's look (#1030): the moor, purple-brown and purple while it flowers, low clumps on it.

import { shade, mix } from '../../../lib/art/palettes.ts';
import { hash } from '../../paint/brush.ts';
import { fog } from '../common.ts';
import { heatherBloom } from '../model.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark } from './look.ts';

/** The moor: a purple-brown through the year, purple while the heather flowers. */
function heatherColor(day: number): string { return mix('#644a48', '#7a4a6c', heatherBloom(day)); }

/** A clump, tipped purple in flower. */
function mark(p: Paint, m: Mark): void {
  const { ctx, env } = p, { i, x, y, sc, base, seed, d } = m;
  // Low clumps, dark and wiry, purple-tipped while the heather flowers; a deep snow buries them.
  if (env.cover > 0.55) return;
  const bloom = heatherBloom(env.day);
  ctx.fillStyle = fog(p, shade(base, 0.7), d);
  ctx.beginPath(); ctx.ellipse(x, y - sc, 3 * sc + 0.5, 1.6 * sc + 0.5, 0, 0, Math.PI * 2); ctx.fill();
  if (hash(seed, 56, i) < bloom) { ctx.fillStyle = fog(p, '#a05a94', d); ctx.fillRect(Math.round(x - sc), Math.round(y - 2.5 * sc), Math.max(1, Math.round(2 * sc)), Math.max(1, Math.round(sc))); }
}

export const heather: GroundLook = { color: heatherColor, drift: { toward: ['#943e88', '#4a3426'], by: 0.6 }, snow: 0.85, wets: true, splashes: true, ripples: false, vary: 0.04, lies: { marks: 7, mark },
  scatter: ['gorse', 'boulder', 'peat'] };
