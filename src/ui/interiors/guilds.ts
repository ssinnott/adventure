// What the Lanterns' two guilds share: bookcases, the map of Caldera, the armillary, the wand rack
// and the lectern. The scenes are in ./<area>/, one to a business.
import { shade, rgba } from '../../lib/art/palettes.ts';
import type { Stage } from './kit.ts';
import { rnd, beam, line, smudge, fillPoly, path, slab, contact, pool } from './kit.ts';
import { K, books, staff } from './props.ts';
import { glossPoly, glossBall } from '../monsters/gloss.ts';
import { drawText } from '../../lib/engine/text.ts';

export const GOLD = '#d8b050';
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

/**
 * The great map of Caldera: a ring of land round the inland sea, the Hearth burning at the heart
 * of it, the Shelf and Thornmark marked, a compass rose in the corner. Painted into (x, y, w, h).
 */
export function calderaMap(x: number, y: number, w: number, h: number) {
  return (ctx: CanvasRenderingContext2D): void => {
    const g = ctx.createRadialGradient(x + w / 2, y + h / 2, 4, x + w / 2, y + h / 2, w * 0.7);
    g.addColorStop(0, '#efe2c0'); g.addColorStop(1, '#c8b088');
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    const cx = x + w / 2, cy = y + h / 2, R = Math.min(w, h) * 0.42;
    // The land: a lumpy ring, green on the Shelf, dark forest in Thornmark, grey in the north.
    const ring: number[] = [];
    for (let i = 0; i < 40; i++) { const a = (i / 40) * Math.PI * 2, r = R * (1 + (rnd(7, i) - 0.5) * 0.14); ring.push(cx + Math.cos(a) * r * 1.25, cy + Math.sin(a) * r); }
    fillPoly(ctx, ring, '#9ab070');
    ctx.save(); path(ctx, ring); ctx.clip();
    fillPoly(ctx, [cx, cy, x + w, y, x + w, y + h], '#5a7a44');
    fillPoly(ctx, [cx, cy, x, y, x + w, y], '#a8a08a');
    ctx.restore();
    path(ctx, ring); ctx.strokeStyle = '#5a4a30'; ctx.lineWidth = 1; ctx.stroke();
    // The sea inside the ring, and the Hearth on its island.
    const sea: number[] = [];
    for (let i = 0; i < 32; i++) { const a = (i / 32) * Math.PI * 2, r = R * 0.55 * (1 + (rnd(8, i) - 0.5) * 0.18); sea.push(cx + Math.cos(a) * r * 1.25, cy + Math.sin(a) * r); }
    fillPoly(ctx, sea, '#6a9ac0'); path(ctx, sea); ctx.strokeStyle = '#3a5a7a'; ctx.stroke();
    for (let i = 0; i < 6; i++) line(ctx, [cx - R * 0.4 + i * 6, cy + R * 0.1 + (i % 2) * 4, cx - R * 0.36 + i * 6, cy + R * 0.1 + (i % 2) * 4], rgba('#ffffff', 0.5), 1);
    glossBall(ctx, K, cx, cy, 3, '#c8b070', {});
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; smudge(ctx, cx, cy, 12, '#ffd070', 0.8); ctx.restore();
    // Stones marked round the ring, and the rose.
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i / 5) * Math.PI * 2; ctx.fillStyle = '#8a2a2a'; ctx.fillRect(Math.round(cx + Math.cos(a) * R * 0.82 * 1.25) - 1, Math.round(cy + Math.sin(a) * R * 0.82) - 1, 3, 3); }
    const rx = x + w - 12, ry = y + 12;
    fillPoly(ctx, [rx, ry - 8, rx + 2, ry, rx, ry + 8, rx - 2, ry], '#4a3a2a'); fillPoly(ctx, [rx - 8, ry, rx, ry - 2, rx + 8, ry, rx, ry + 2], '#4a3a2a');
    drawText(ctx, 'CALDERA', x + 6, y + h - 12, { size: 1, color: '#5a4a30', shadow: false });
  };
}

/**
 * An armillary on its stand, foot on y: brass rings round a glowing core, the Hearth as the
 * Lanterns model it. The core is a Light, so it breathes.
 */
export function armillary(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, r: number): void {
  glossPoly(ctx, K, [x - r * 0.7, y, x - r * 0.4, y - r * 0.3, x + r * 0.4, y - r * 0.3, x + r * 0.7, y], shade(GOLD, 0.8), { gloss: 0.5 });
  glossPoly(ctx, K, [x - r * 0.1, y - r * 0.3, x - r * 0.08, y - r * 1.2, x + r * 0.08, y - r * 1.2, x + r * 0.1, y - r * 0.3], GOLD, { gloss: 0.5 });
  const cy = y - r * 2.1;
  glossBall(ctx, K, cx(), cy, r * 0.22, '#fff0c0', { gloss: 0.8 });
  for (const [rx, ry, rot] of [[r, r, 0], [r, r * 0.35, 0.2], [r * 0.35, r, -0.1], [r * 0.95, r * 0.5, -0.9]] as [number, number, number][]) {
    ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.ellipse(x, cy, rx, ry, rot, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = GOLD; ctx.lineWidth = 1.8; ctx.stroke();
  }
  s.lights.push({ k: 'glow', x, y: cy, r: r * 1.3, color: '#ffc860', a: 0.5 });
  pool(s, x, cy, r * 6, '#ffd890', 0.7);
  function cx(): number { return x; }
}

/** A stand of survey wands, the Lanterns' instruments: rods with crystal heads that glow faintly. Foot on y. */
export function wandRack(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, n: number): void {
  slab(ctx, x - n * 6 - 4, y - 10, n * 12 + 8, 10, '#5a3a24', { lit: 1 });
  for (let i = 0; i < n; i++) {
    const wx = x - n * 6 + 6 + i * 12, len = 50 + rnd(9, i) * 14;
    staff(ctx, wx, y - 6, len, i % 2 ? '#e8e0d0' : '#8a6a42', '#9ae0ff');
    s.lights.push({ k: 'glow', x: wx, y: y - 6 - len - 4, r: 8, color: '#8ad8ff', a: 0.45 });
  }
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
