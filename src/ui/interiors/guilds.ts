// What the Lanterns' two guilds share: the bookcases and the lectern. The scenes are in
// ./<area>/, one to a business.
import { shade, rgba } from '../../lib/art/palettes.ts';
import type { Stage } from './kit.ts';
import { beam, line, slab, contact } from './kit.ts';
import { K, books } from './props.ts';
import { glossPoly } from '../monsters/gloss.ts';

export const SPINES = ['#6a2a2a', '#2a3a6a', '#2a5a3a', '#6a5a2a', '#4a2a5a', '#8a6a3a', '#3a3a3a', '#7a3a1a'];

/** A bookcase from the floor at y up to `top`: shelves packed with books, a cornice on top. */
export function bookcase(ctx: CanvasRenderingContext2D, x: number, top: number, w: number, y: number, wood: string, seed: number, shelves = 5): void {
  slab(ctx, x, top, w, y - top, shade(wood, 0.6), { lit: 2, dark: 0.08 });
  const inner = x + 4, iw = w - 8, sh = (y - top - 14) / shelves;
  for (let i = 0; i < shelves; i++) {
    const sy = top + 10 + (i + 1) * sh;
    ctx.fillStyle = '#1a1210'; ctx.fillRect(inner, sy - sh + 3, iw, sh - 3);
    books(ctx, inner + 1, sy, iw - 2, sh - 5, seed * 13 + i, SPINES);
    beam(ctx, x + 2, sy, w - 4, 4, wood, seed + i);
  }
  beam(ctx, x - 3, top, w + 6, 8, wood, seed + 9);
  slab(ctx, x - 2, y - 6, w + 4, 6, shade(wood, 0.9));
}

/** A lectern, foot on y, an open book on its slope; `glow` makes the book's runes shine. */
export function lectern(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, h: number, wood: string, glow?: string): void {
  contact(ctx, x, y, h * 0.6);
  glossPoly(ctx, K, [x - h * 0.3, y, x - h * 0.14, y - h * 0.1, x + h * 0.14, y - h * 0.1, x + h * 0.3, y], wood, {});
  glossPoly(ctx, K, [x - h * 0.08, y - h * 0.1, x - h * 0.06, y - h * 0.78, x + h * 0.06, y - h * 0.78, x + h * 0.08, y - h * 0.1], wood, { spread: 0.7 });
  glossPoly(ctx, K, [x - h * 0.42, y - h * 0.74, x + h * 0.42, y - h * 0.74, x + h * 0.34, y - h * 0.98, x - h * 0.34, y - h * 0.98], shade(wood, 1.1), {});
  // The book, open.
  glossPoly(ctx, K, [x - h * 0.4, y - h * 0.78, x - h * 0.02, y - h * 0.8, x - h * 0.02, y - h * 1.02, x - h * 0.34, y - h * 1.0], '#f0e8d4', {});
  glossPoly(ctx, K, [x + h * 0.02, y - h * 0.8, x + h * 0.4, y - h * 0.78, x + h * 0.34, y - h * 1.0, x + h * 0.02, y - h * 1.02], '#e8e0c8', {});
  for (let i = 0; i < 4; i++) {
    const ly = y - h * (0.86 + i * 0.035);
    line(ctx, [x - h * 0.32, ly, x - h * 0.08, ly - 1], glow ?? rgba('#3a2a30', 0.55), 1);
    line(ctx, [x + h * 0.08, ly - 1, x + h * 0.32, ly], glow ?? rgba('#3a2a30', 0.55), 1);
  }
  if (glow) s.lights.push({ k: 'glow', x, y: y - h * 0.9, r: h * 0.45, color: glow, a: 0.4 });
}
