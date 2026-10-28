// The tidal ground's look (#1030): wet sand at low water, ripples and a pool on it, and drawn as the sea
// at high water (`drawnAs`); the sea washes off its snow.

import { shade, rgba } from '../../../lib/art/palettes.ts';
import { TERRAIN_COLORS } from '../../palette.ts';
import { hash } from '../../paint/brush.ts';
import { fog, unitIn } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark } from './look.ts';

/** A pool holding the sky, then ripples. */
function mark(p: Paint, m: Mark): void {
  const { ctx, h, haze } = p, { i, s, x, y, sc, base, seed, d } = m;
  // Wet sand the sea has just left: ripples, and a pool that holds the sky.
  if (i === 0 && d <= 3) {
    const pw = unitIn(d, s, h) * (0.16 + 0.12 * hash(seed, 57, i)), ph = pw * 0.22;
    ctx.beginPath(); ctx.ellipse(x, y, pw, ph, 0, 0, Math.PI * 2); ctx.fillStyle = fog(p, shade(base, 0.62), d); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x - pw * 0.15, y - ph * 0.2, pw * 0.6, ph * 0.4, 0, 0, Math.PI * 2); ctx.fillStyle = rgba(fog(p, haze ?? '#8a94a4', d), 0.6); ctx.fill();
    return;
  }
  ctx.strokeStyle = fog(p, shade(base, 0.78), d); ctx.lineWidth = Math.max(1, sc * 0.8);
  ctx.beginPath(); ctx.moveTo(x - 5 * sc, y); ctx.quadraticCurveTo(x - 2.5 * sc, y - 1.2 * sc, x, y); ctx.quadraticCurveTo(x + 2.5 * sc, y + 1.2 * sc, x + 5 * sc, y); ctx.stroke();
}

export const tidal: GroundLook = { color: () => TERRAIN_COLORS.tidal, snow: 0, wets: true, splashes: true, ripples: false, vary: 0.08, drawnAs: (env) => (env.tide === 'high' ? 'water' : 'tidal'), lies: { marks: 5, mark } };
