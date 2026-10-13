// What the pilgrims' three tents in the Bowl share (#762): canvas, stretched and weathered, its
// seams; and the Bowl seen through a tent's opening, the warm grass rising to the rim's rock and,
// where it is in view, the column of light. The scenes are the files beside this one, one to a tent.
import { shade, rgba, mix } from '../../../lib/art/palettes.ts';
import type { Stage } from '../kit.ts';
import { rnd, line, fillPoly, path, ink, smudge, skyFill, pool, DAY_POOL } from '../kit.ts';

/** Canvas over the polygon `pts`: `base`, mottled where the weather has had it, inked round. */
export function canvasFace(ctx: CanvasRenderingContext2D, pts: readonly number[], base: string, seed: number): void {
  fillPoly(ctx, pts, base);
  const xs = pts.filter((_, i) => i % 2 === 0), ys = pts.filter((_, i) => i % 2 === 1);
  const x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) - x0, h = Math.max(...ys) - y0;
  ctx.save(); path(ctx, pts); ctx.clip();
  for (let i = 0; i < 12; i++) smudge(ctx, x0 + rnd(seed, i) * w, y0 + rnd(seed, i, 1) * h, 12 + rnd(seed, i, 2) * 26, shade(base, rnd(seed, i, 3) > 0.5 ? 1.1 : 0.84), 0.3);
  ctx.restore();
  path(ctx, pts); ink(ctx, 1.5);
}

/** A seam sewn across canvas of `base` from (x0, y0) to (x1, y1): the fold's shadow and the lit edge beside it. */
export function seam(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, base: string): void {
  const len = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / len, ny = (x1 - x0) / len;
  line(ctx, [x0, y0, x1, y1], rgba(shade(base, 0.6), 0.55), 1.5);
  line(ctx, [x0 + nx * 1.5, y0 + ny * 1.5, x1 + nx * 1.5, y1 + ny * 1.5], rgba(shade(base, 1.2), 0.45), 1);
}

/**
 * The Bowl through an opening, painted into the current clip over the box (x, y, w, h): the sky for
 * the hour, the rim's rock along the horizon at `hy`, the warm grass rising to it and, at `column`,
 * the column of light standing out of the grass into the sky, which lights the opening by night as
 * the day does by day.
 */
export function bowlView(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, w: number, h: number, hy: number, seed: number, column?: number): void {
  const d = s.daylight;
  skyFill(ctx, x, y, w, hy - y, d, seed);
  const rim: number[] = [x - 2, y + h];
  for (let i = 0; i <= 10; i++) rim.push(x + (w * i) / 10, hy - 4 - (Math.abs(i - 5) / 5) * 12 - rnd(seed, i) * 7);
  rim.push(x + w + 2, y + h);
  fillPoly(ctx, rim, mix('#22202a', '#8a8278', d));
  for (let i = 0; i < 6; i++) { const rx = x + rnd(seed, i, 1) * w; line(ctx, [rx, hy - 3 - rnd(seed, i, 2) * 8, rx + 3, hy], rgba(mix('#14121a', '#5a544e', d), 0.7), 1); }
  const g = ctx.createLinearGradient(0, hy, 0, y + h);
  g.addColorStop(0, mix('#1e2a24', '#a4bc62', d)); g.addColorStop(1, mix('#141c18', '#6e8e3e', d));
  ctx.fillStyle = g; ctx.fillRect(x, hy, w, y + h - hy);
  if (column !== undefined) {
    const foot = hy + 2;
    smudge(ctx, column, foot - 18, 34, '#fff4d8', 0.3 + 0.3 * (1 - d));
    const shaft = ctx.createLinearGradient(column - 6, 0, column + 6, 0);
    shaft.addColorStop(0, rgba('#fff0c0', 0)); shaft.addColorStop(0.5, '#fffaf0'); shaft.addColorStop(1, rgba('#fff0c0', 0));
    ctx.fillStyle = shaft; ctx.fillRect(column - 6, y, 12, foot - y);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(column - 1, y, 2, foot - y);
    s.lights.push({ k: 'glow', x: column, y: foot - 6, r: 18, color: '#fff0c8', a: 0.45 });
    pool(s, column, (y + foot) / 2, 160, '#fff0d0', 0.85 - 0.35 * d);
  }
  if (d > 0.15) pool(s, x + w / 2, y + h * 0.6, Math.max(w, h) * 1.8, DAY_POOL, 0.55 * d);
}
