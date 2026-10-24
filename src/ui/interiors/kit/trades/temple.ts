// A temple's props: the stained glass, the altar, the pew and the Lanterns' ring, which the chapels
// and the Lanterns' halls take. Sorted out of ../props.ts by the trade that uses them (#983); the old
// path, src/ui/interiors/props.ts, re-exports them.
import { shade, rgba } from '../../../../lib/art/palettes.ts';
import { glossBall } from '../../../paint/gloss.ts';
import { INK } from '../../../paint/ink.ts';
import { smudge } from '../../../paint/flame.ts';
import { K, cloth } from '../props.ts';
import { ramp, rnd, fillPoly, inkRect, line, slab, beam, block } from '../stage.ts';

/**
 * Stained glass: panes of colour in lead round the Lanterns' ring and flame. It glows with the
 * day behind it, and keeps a little colour at night from the lamps inside.
 */
export function stainedGlass(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, daylight: number, colors: readonly string[], seed = 0): void {
  const lit = 0.3 + 0.7 * daylight;
  const cols = 4, rows = Math.max(4, Math.round(h / (w / cols)));
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const col = colors[Math.floor(rnd(seed, r, c) * colors.length)];
    ctx.fillStyle = shade(col, lit * (0.85 + rnd(seed, r, c, 1) * 0.3));
    const px = x + (w / cols) * c, py = y + (h / rows) * r, jx = (rnd(seed, r, c, 2) - 0.5) * 4;
    fillPoly(ctx, [px + jx, py, px + w / cols + jx, py, px + w / cols, py + h / rows, px, py + h / rows], ctx.fillStyle as string);
  }
  const cx = x + w / 2, cy = y + h * 0.42, r = w * 0.3;
  ctx.fillStyle = shade('#f0d890', lit); ctx.beginPath(); ctx.arc(cx, cy, r * 0.8, 0, Math.PI * 2); ctx.fill();
  lanternRing(ctx, cx, cy, r, shade('#e8c050', lit), shade('#fff0c0', lit));
  // The leading: every pane edge, and rays from the ring.
  ctx.strokeStyle = '#1a1418'; ctx.lineWidth = 1.5;
  for (let c = 1; c < cols; c++) { ctx.beginPath(); ctx.moveTo(x + (w / cols) * c, y); ctx.lineTo(x + (w / cols) * c, y + h); ctx.stroke(); }
  for (let r2 = 1; r2 < rows; r2++) { ctx.beginPath(); ctx.moveTo(x, y + (h / rows) * r2); ctx.lineTo(x + w, y + (h / rows) * r2); ctx.stroke(); }
  if (daylight > 0.2) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; smudge(ctx, cx, cy, r * 1.8, '#ffe0a0', 0.25 * daylight); ctx.restore(); }
}

/** An altar: a stone table, its top seen from a little above, a cloth hung down its front with an emblem and a fringe. */
export function altar(ctx: CanvasRenderingContext2D, x0: number, x1: number, top: number, depth: number, bottom: number, stone: string, drape: string, trim: string, emblem?: (cx: number, cy: number, r: number) => void): void {
  const w = x1 - x0, fy = top + depth, t = ramp(stone);
  ctx.fillStyle = shade(stone, 0.85); ctx.fillRect(x0 + 6, fy, w - 12, bottom - fy);
  for (let i = 0; i < 3; i++) block(ctx, x0 + 6, fy + 6 + i * ((bottom - fy - 6) / 3), w - 12, (bottom - fy - 6) / 3 - 1, shade(stone, 0.8 + i * 0.05), i);
  inkRect(ctx, x0 + 6, fy, w - 12, bottom - fy);
  const g = ctx.createLinearGradient(0, top, 0, fy);
  g.addColorStop(0, shade(stone, 0.8)); g.addColorStop(1, t.hi);
  ctx.fillStyle = g; ctx.fillRect(x0, top, w, depth);
  slab(ctx, x0, fy, w, 6, stone);
  inkRect(ctx, x0, top, w, depth + 6);
  // The cloth down the middle of the front.
  const cw = w * 0.5, cx0 = x0 + (w - cw) / 2, ch = (bottom - fy) * 0.78;
  cloth(ctx, cx0, cx0 + cw, fy + 1, ch, drape);
  ctx.fillStyle = trim; ctx.fillRect(Math.round(cx0 + 2), Math.round(fy + 3), Math.round(cw - 4), 2);
  for (let i = 0; i < 12; i++) line(ctx, [cx0 + 3 + ((cw - 6) * i) / 11, fy + ch - 1, cx0 + 3 + ((cw - 6) * i) / 11, fy + ch + 3], trim, 1);
  if (emblem) emblem(cx0 + cw / 2, fy + ch * 0.48, cw * 0.18);
}

/** The back of a pew, seen from behind: a top rail at y, the back board below it, an end post. From x0 to x1. */
export function pew(ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number, h: number, wood: string, endLeft = true): void {
  slab(ctx, x0, y + 5, x1 - x0, h - 5, shade(wood, 0.72), { lit: 1, dark: 0.2 });
  for (let i = 1; i < 6; i++) line(ctx, [x0 + ((x1 - x0) * i) / 6, y + 7, x0 + ((x1 - x0) * i) / 6, y + h], rgba(ramp(wood).deep, 0.5), 1);
  beam(ctx, x0 - 2, y, x1 - x0 + 4, 6, wood);
  const px = endLeft ? x0 - 4 : x1 - 6;
  slab(ctx, px, y - 8, 10, h + 8, shade(wood, 0.9));
  glossBall(ctx, K, px + 5, y - 9, 4, shade(wood, 1.05), { gloss: 0.3 });
}

/** The Lanterns' emblem: a ring round a flame. */
export function lanternRing(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string, flameCol = '#ffd070'): void {
  ctx.strokeStyle = INK; ctx.lineWidth = Math.max(2, r * 0.34); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = color; ctx.lineWidth = Math.max(1, r * 0.2); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy - r * 0.6); ctx.quadraticCurveTo(cx + r * 0.4, cy, cx, cy + r * 0.45); ctx.quadraticCurveTo(cx - r * 0.4, cy, cx, cy - r * 0.6); ctx.closePath();
  ctx.fillStyle = flameCol; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.stroke();
}
