// The road's look (#1030): cobbles packed in a jittered grid out to the third square, each lit along its
// top, and puddles after rain.

import { shade } from '../../../lib/art/palettes.ts';
import { TERRAIN_COLORS } from '../../palette.ts';
import { hash } from '../../paint/brush.ts';
import { fog, unit, unitIn, floorPt } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Square } from './look.ts';

/** Cobbles: rounded stones packed in a jittered grid, each with a lit top edge. */
function cobbles(p: Paint, base: string, sq: Square): void {
  const { ctx, cx, horizon, h } = p, { d, l, seed } = sq;
  if (d > 3) return;
  const u = unit(d, h);
  const cols = d <= 1 ? 6 : 4, rows = d <= 1 ? 5 : 3;
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
    const s = (i + 0.5 + (hash(seed, 31, i, j) - 0.5) * 0.4) / rows, t = (j + 0.5 + (hash(seed, 32, i, j) - 0.5) * 0.4) / cols;
    const [x, y] = floorPt(cx, horizon, h, d, l, s, t);
    const sc = unitIn(d, s, h) / u;
    const rx = (u / cols) * 0.8 * sc * 0.9, ry = rx * 0.45;
    const col = fog(p, shade(base, 0.85 + hash(seed, 33, i, j) * 0.35), d);
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill();
    if (rx > 3) { ctx.beginPath(); ctx.ellipse(x, y - ry * 0.35, rx * 0.7, ry * 0.4, 0, 0, Math.PI * 2); ctx.fillStyle = fog(p, shade(base, 1.2), d); ctx.fill(); }
    ctx.strokeStyle = fog(p, shade(base, 0.55), d); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
  }
}

export const road: GroundLook = { color: () => TERRAIN_COLORS.road, snow: 0.72, wets: true, splashes: true, ripples: false, vary: 0.08, lays: cobbles, puddles: true };
