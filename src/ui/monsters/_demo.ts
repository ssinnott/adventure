// Temporary demo family for tools/gallery.ts --family _demo: an organic wolf and a Xeen-like
// tentacled beast built with blob(), next to nothing else. Delete me.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer } from './common.ts';
import { B, groundShadow, eye } from './common.ts';
import { blob, softLine, glow } from './gloss.ts';
import type { Part } from './gloss.ts';
import { shade, mix } from '../../lib/art/palettes.ts';
import { celBall, celPoly } from '../../lib/art/shading.ts';

export const KINDS: readonly MonsterSprite[] = ['wolf', 'slime'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  if (kind === 'wolf') return wolf(ctx, x, y, h, p.base, p.dark, p.light, p.amber, p.frame, p.breathe);
  return beast(ctx, x, y, h, p.tone, p.frame, p.breathe);
};

function wolf(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, base: string, dark: string, light: string, amber: string, frame: number, br: number): void {
  const w = h * 1.45, b = br * h * 0.01;
  groundShadow(ctx, x + w * 0.05, y + 1, w * 0.95);
  // Far legs: their own darker mass, behind.
  blob(ctx, B, dark, [
    { k: 'cap', x0: x - w * 0.2, y0: y - h * 0.45, x1: x - w * 0.3, y1: y - h * 0.22, r0: h * 0.07, r1: h * 0.05 },
    { k: 'cap', x0: x - w * 0.3, y0: y - h * 0.22, x1: x - w * 0.26, y1: y - h * 0.02, r0: h * 0.05, r1: h * 0.045 },
    { k: 'cap', x0: x + w * 0.14, y0: y - h * 0.45, x1: x + w * 0.09, y1: y - h * 0.02, r0: h * 0.065, r1: h * 0.045 },
  ], { h, formK: 0.4 });
  // The fur: tail, body, ruff, neck, head, muzzle, ears, near legs, all one mass.
  const ring = (cx: number, cy: number, r: number, n = 10) => { const o: number[] = []; for (let i = 0; i < n; i++) o.push(cx + Math.cos(i / n * Math.PI * 2) * r, cy + Math.sin(i / n * Math.PI * 2) * r); return o; };
  const fur: Part[] = [
    { k: 'curve', pts: [x - w * 0.4, y - h * 0.6, x - w * 0.62, y - h * 0.52 + b, x - w * 0.72, y - h * 0.3 + b * 2, x - w * 0.6, y - h * 0.3, x - w * 0.44, y - h * 0.46], wobble: 0.05, spiky: 0.09, seed: 7, sub: 3 },
    { k: 'curve', pts: [x - w * 0.42, y - h * 0.5, x - w * 0.36, y - h * 0.7 + b, x - w * 0.1, y - h * 0.78 + b, x + w * 0.14, y - h * 0.74 + b, x + w * 0.24, y - h * 0.56, x + w * 0.16, y - h * 0.32, x - w * 0.14, y - h * 0.28, x - w * 0.38, y - h * 0.34], wobble: 0.035, spiky: 0.03, seed: 1, sub: 3 },
    { k: 'curve', pts: ring(x + w * 0.2, y - h * 0.62 + b, h * 0.21), wobble: 0.04, spiky: 0.09, seed: 3, sub: 2 },
    { k: 'cap', x0: x + w * 0.2, y0: y - h * 0.65 + b, x1: x + w * 0.36, y1: y - h * 0.72 + b, r0: h * 0.13 },
    { k: 'curve', pts: ring(x + w * 0.4, y - h * 0.72 + b, h * 0.17, 12), wobble: 0.03, spiky: 0.02, seed: 4, sub: 2 },
    { k: 'cap', x0: x + w * 0.45, y0: y - h * 0.66 + b, x1: x + w * 0.64, y1: y - h * 0.58 + b, r0: h * 0.11, r1: h * 0.07 },
    { k: 'poly', pts: [x + w * 0.3, y - h * 0.82 + b, x + w * 0.27, y - h * 0.99 + b, x + w * 0.39, y - h * 0.86 + b] },
    { k: 'poly', pts: [x + w * 0.42, y - h * 0.85 + b, x + w * 0.45, y - h * 1.01 + b, x + w * 0.51, y - h * 0.86 + b] },
    { k: 'cap', x0: x - w * 0.14, y0: y - h * 0.46, x1: x - w * 0.2, y1: y - h * 0.22, r0: h * 0.085, r1: h * 0.06 },
    { k: 'cap', x0: x - w * 0.2, y0: y - h * 0.22, x1: x - w * 0.13, y1: y - h * 0.03, r0: h * 0.055, r1: h * 0.05 },
    { k: 'cap', x0: x + w * 0.26, y0: y - h * 0.46, x1: x + w * 0.29, y1: y - h * 0.22, r0: h * 0.08, r1: h * 0.055 },
    { k: 'cap', x0: x + w * 0.29, y0: y - h * 0.22, x1: x + w * 0.31, y1: y - h * 0.03, r0: h * 0.05, r1: h * 0.048 },
    { k: 'ell', x: x - w * 0.12, y: y - h * 0.03, rx: h * 0.075, ry: h * 0.035 },
    { k: 'ell', x: x + w * 0.32, y: y - h * 0.03, rx: h * 0.075, ry: h * 0.035 },
  ];
  blob(ctx, B, base, fur, { h, tex: 'fur', seed: 1, amount: 0.7, formK: 0.55, creases: [
    { x0: x + w * 0.24, y0: y - h * 0.8 + b, x1: x + w * 0.2, y1: y - h * 0.48, r: h * 0.03, a: 0.3 },
    { x0: x - w * 0.22, y0: y - h * 0.52, x1: x - w * 0.1, y1: y - h * 0.47, r: h * 0.025, a: 0.3 },
    { x0: x + w * 0.2, y0: y - h * 0.5, x1: x + w * 0.3, y1: y - h * 0.46, r: h * 0.025, a: 0.3 },
    { x0: x - w * 0.36, y0: y - h * 0.36, x1: x + w * 0.1, y1: y - h * 0.3, r: h * 0.03, a: 0.25 },
  ] });
  // Pale muzzle and chest, inside the fur, no line.
  blob(ctx, B, light, [
    { k: 'cap', x0: x + w * 0.5, y0: y - h * 0.6 + b, x1: x + w * 0.63, y1: y - h * 0.55 + b, r0: h * 0.06, r1: h * 0.05 },
    { k: 'ell', x: x + w * 0.24, y: y - h * 0.5 + b, rx: h * 0.1, ry: h * 0.12 },
  ], { outline: false, formK: 0.3 });
  // Inner ear, eye with a brow, nose, mouth and teeth.
  softLine(ctx, B, [x + w * 0.31, y - h * 0.84 + b, x + w * 0.3, y - h * 0.94 + b], base, h * 0.03, 0.5);
  eye(ctx, x + w * 0.44, y - h * 0.75 + b, h * 0.04, amber);
  softLine(ctx, B, [x + w * 0.38, y - h * 0.8 + b, x + w * 0.48, y - h * 0.79 + b], base, h * 0.03, 0.7);
  celBall(ctx, B, x + w * 0.66, y - h * 0.6 + b, h * 0.035, shade('#1a1418', 1), false);
  softLine(ctx, B, [x + w * 0.5, y - h * 0.56 + b, x + w * 0.64, y - h * 0.54 + b], base, h * 0.025, 0.8);
  ctx.fillStyle = B.col('#f4eee0');
  for (let i = 0; i < 3; i++) { const tx = x + w * (0.52 + i * 0.04); ctx.beginPath(); ctx.moveTo(tx - h * 0.012, y - h * 0.56 + b); ctx.lineTo(tx, y - h * 0.5 + b); ctx.lineTo(tx + h * 0.012, y - h * 0.56 + b); ctx.fill(); }
  void celPoly; void mix;
}

function beast(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, tone: number, frame: number, br: number): void {
  const purple = shade('#b040c8', tone), deep = shade('#6a2080', tone);
  groundShadow(ctx, x, y + 1, h * 0.9);
  glow(ctx, B, x, y - h * 0.45, h * 0.55, '#8a30b0', 0.25, '#e080ff');
  const parts: Part[] = [
    { k: 'curve', pts: [x - h * 0.3, y - h * 0.04, x - h * 0.44, y - h * 0.4, x - h * 0.3, y - h * 0.78, x, y - h * 0.98 + br * h * 0.02, x + h * 0.3, y - h * 0.78, x + h * 0.44, y - h * 0.4, x + h * 0.3, y - h * 0.04], wobble: 0.06, seed: 2, sub: 3, gloss: 0.7 },
  ];
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) {
    const a = Math.sin(frame / 9 + i * 1.3 + s) * h * 0.04;
    const bx = x + s * h * 0.3, by = y - h * (0.3 + i * 0.22), mx = x + s * h * (0.62 + i * 0.05), my = by - h * 0.12 + a, ex = x + s * h * (0.85 + i * 0.08), ey = by - h * (0.34 + i * 0.1) - a;
    parts.push({ k: 'tube', pts: [bx, by, mx, my, ex, ey, ex + s * h * 0.05, ey - h * 0.12 + a], r0: h * 0.075, r1: h * 0.022, gloss: 0.5 });
  }
  blob(ctx, B, purple, parts, { h, tex: 'stipple', seed: 5, amount: 0.35, formK: 0.6, gloss: 0.5, creases: [{ x0: x - h * 0.2, y0: y - h * 0.62, x1: x + h * 0.2, y1: y - h * 0.62, r: h * 0.03, a: 0.25 }] });
  // The maw: a separate material, so it keeps a line; teeth on top.
  blob(ctx, B, shade('#8a1020', tone), [{ k: 'curve', pts: [x - h * 0.3, y - h * 0.5, x - h * 0.1, y - h * 0.58, x + h * 0.12, y - h * 0.57, x + h * 0.3, y - h * 0.48, x + h * 0.12, y - h * 0.36, x - h * 0.12, y - h * 0.35], wobble: 0.05, seed: 9, sub: 2 }], { h, formK: 0.8, spread: 0.5 });
  ctx.fillStyle = B.col('#f8f0e0');
  for (let i = -3; i <= 3; i++) { const tx = x + i * h * 0.075, k = 1 - Math.abs(i) * 0.15; ctx.beginPath(); ctx.moveTo(tx - h * 0.02, y - h * 0.56); ctx.lineTo(tx, y - h * (0.56 - 0.1 * k)); ctx.lineTo(tx + h * 0.02, y - h * 0.56); ctx.fill(); }
  for (let i = -2; i <= 2; i++) { const tx = x + i * h * 0.08 + h * 0.04; ctx.beginPath(); ctx.moveTo(tx - h * 0.018, y - h * 0.36); ctx.lineTo(tx, y - h * 0.43); ctx.lineTo(tx + h * 0.018, y - h * 0.36); ctx.fill(); }
  eye(ctx, x - h * 0.13, y - h * 0.76, h * 0.055, '#f8e040'); eye(ctx, x + h * 0.13, y - h * 0.76, h * 0.055, '#f8e040');
  softLine(ctx, B, [x - h * 0.2, y - h * 0.84, x - h * 0.07, y - h * 0.82], purple, h * 0.03, 0.7);
  softLine(ctx, B, [x + h * 0.07, y - h * 0.82, x + h * 0.2, y - h * 0.84], purple, h * 0.03, 0.7);
  void deep;
}
