// What the trainers' two yards, under the open sky, share: clouds, the ground, dummies, targets, the
// arms rack and a torch on a post. The scenes are in ./<area>/, one to a business.
import { shade, rgba, mix } from '../../lib/art/palettes.ts';
import type { Stage } from './kit.ts';
import { STAGE_W, STAGE_H, rnd, stones, line, fillPoly, contact, beam, flame } from './kit.ts';
import { K } from './props.ts';
import { glossPoly, glossEllipse, glossBall } from '../monsters/gloss.ts';

/** Clouds for the hour: pale by day, dark shapes lit from below at dusk, all but gone at night. */
export function clouds(ctx: CanvasRenderingContext2D, daylight: number, y: number, seed: number): void {
  const lit = mix('#2a2a44', '#ffffff', daylight), under = mix('#20203a', '#b0c4dc', daylight);
  for (let i = 0; i < 5; i++) {
    const cx = rnd(seed, i) * STAGE_W, cy = y + rnd(seed, i, 1) * 36, w = 40 + rnd(seed, i, 2) * 50, h = 7 + rnd(seed, i, 3) * 6;
    for (let j = 0; j < 4; j++) {
      const bx = cx + (j - 1.5) * w * 0.22, by = cy + (j % 2) * h * 0.3, br = h * (0.7 + rnd(seed, i, j, 4) * 0.6);
      ctx.beginPath(); ctx.arc(bx, by + br * 0.3, br, 0, Math.PI * 2); ctx.fillStyle = rgba(under, 0.85); ctx.fill();
      ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fillStyle = rgba(lit, 0.9); ctx.fill();
    }
  }
}

/** Ground seen from standing height, from y0 down: `base` darkening toward the viewer, with tufts, stones and scuffs. */
export function ground(ctx: CanvasRenderingContext2D, y0: number, base: string, seed: number, grass = false): void {
  const g = ctx.createLinearGradient(0, y0, 0, STAGE_H);
  g.addColorStop(0, shade(base, 1.05)); g.addColorStop(1, shade(base, 0.8));
  ctx.fillStyle = g; ctx.fillRect(0, y0, STAGE_W, STAGE_H - y0);
  for (let i = 0; i < 90; i++) {
    const px = rnd(seed, i) * STAGE_W, t = rnd(seed, i, 1), py = y0 + t * t * (STAGE_H - y0), sc = 0.5 + t * 1.2;
    if (grass && i % 2) { line(ctx, [px, py, px - 1.5 * sc, py - 4 * sc], shade('#5a8a3a', 0.9 + rnd(seed, i, 2) * 0.3), 1); line(ctx, [px, py, px + 1.5 * sc, py - 3.5 * sc], '#6a9a44', 1); continue; }
    ctx.fillStyle = shade(base, rnd(seed, i, 3) > 0.5 ? 1.2 : 0.7); ctx.beginPath(); ctx.ellipse(px, py, 1.5 * sc, 0.8 * sc, 0, 0, Math.PI * 2); ctx.fill();
  }
}

/** A training dummy on a post, foot on y: a stuffed sack of a body on a crossbar, a dented helm, straw at the seams. */
export function dummy(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, lean = 0): void {
  contact(ctx, x, y, h * 0.5);
  line(ctx, [x, y, x + lean, y - h * 0.62], '#120c14', 6); line(ctx, [x, y, x + lean, y - h * 0.62], '#7a5a34', 4);
  const cx = x + lean, top = y - h;
  line(ctx, [cx - h * 0.36, top + h * 0.34, cx + h * 0.36, top + h * 0.3], '#120c14', 6); line(ctx, [cx - h * 0.36, top + h * 0.34, cx + h * 0.36, top + h * 0.3], '#8a6a42', 4);
  glossPoly(ctx, K, [cx - h * 0.2, top + h * 0.3, cx + h * 0.2, top + h * 0.28, cx + h * 0.24, top + h * 0.5, cx + h * 0.16, top + h * 0.66, cx - h * 0.16, top + h * 0.66, cx - h * 0.22, top + h * 0.5], '#c8a870', { spread: 0.8, h: 80, tex: 'folds', seed: Math.round(x), amount: 0.6 });
  line(ctx, [cx - h * 0.1, top + h * 0.34, cx + h * 0.02, top + h * 0.62], rgba('#6a4a2a', 0.8), 1);
  for (let i = 0; i < 5; i++) line(ctx, [cx + h * 0.16, top + h * 0.5 + i * 2, cx + h * 0.24 + rnd(x, i) * 4, top + h * 0.47 + i * 3], '#e0c060', 1);
  glossBall(ctx, K, cx, top + h * 0.2, h * 0.12, '#c8a870', { h: 80, tex: 'folds', seed: 3 });
  glossPoly(ctx, K, [cx - h * 0.14, top + h * 0.2, cx - h * 0.13, top + h * 0.06, cx - h * 0.06, top, cx + h * 0.06, top, cx + h * 0.13, top + h * 0.06, cx + h * 0.14, top + h * 0.2], '#8a909a', { gloss: 0.6, spread: 0.6 });
  glossBall(ctx, K, cx + h * 0.05, top + h * 0.09, h * 0.025, shade('#8a909a', 0.7), {});
}

/** An archery butt of straw on a tripod, centre (x, y), painted with rings, arrows in it. */
export function target(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, seed: number): void {
  for (const [a, b] of [[-0.7, 1.4], [0.7, 1.4], [0, 1.6]] as [number, number][]) { line(ctx, [x, y - r * 0.2, x + a * r, y + b * r], '#120c14', 5); line(ctx, [x, y - r * 0.2, x + a * r, y + b * r], '#7a5a34', 3); }
  glossBall(ctx, K, x, y, r, '#d8c080', { h: 100, tex: 'fur', seed, amount: 0.5 });
  for (const [f, col] of [[0.8, '#e8e0d0'], [0.6, '#3a5ab0'], [0.4, '#c83a2a'], [0.2, '#e0c040']] as [number, string][]) { ctx.beginPath(); ctx.arc(x, y, r * f, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); }
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 3; i++) {
    const ax = x + (rnd(seed, i) - 0.5) * r * 0.9, ay = y + (rnd(seed, i, 1) - 0.5) * r * 0.9;
    line(ctx, [ax, ay, ax + r * 0.5, ay + r * 0.15], '#6a4a2a', 1.5);
    fillPoly(ctx, [ax + r * 0.45, ay + r * 0.1, ax + r * 0.65, ay + r * 0.05, ax + r * 0.6, ay + r * 0.2], i % 2 ? '#e8e0d0' : '#c83a2a');
  }
}

/** An A-frame rack of practice arms, foot on y, `w` across. */
export function armsRack(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, wood: string): void {
  for (const sx of [x, x + w]) { line(ctx, [sx - 6, y, sx, y - h, sx + 6, y], '#120c14', 5); line(ctx, [sx - 6, y, sx, y - h, sx + 6, y], wood, 3); }
  beam(ctx, x - 2, y - h * 0.62, w + 4, 4, wood);
  beam(ctx, x - 2, y - h * 0.2, w + 4, 4, wood);
}

/** A torch on a post, foot on y; it burns after dusk. */
export function torchPost(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, h: number): void {
  line(ctx, [x, y, x, y - h], '#120c14', 6); line(ctx, [x, y, x, y - h], '#6a4a2a', 4);
  glossPoly(ctx, K, [x - 5, y - h - 8, x + 5, y - h - 8, x + 3, y - h, x - 3, y - h], '#3a3440', { gloss: 0.4 });
  if (s.daylight < 0.45) { flame(s, x, y - h - 8, 4, 120, 0.9); }
  else { glossEllipse(ctx, K, x, y - h - 9, 4, 2, '#2a2020', 0, {}); }
}
