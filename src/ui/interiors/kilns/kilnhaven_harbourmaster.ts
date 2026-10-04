// Kilnhaven's harbourmaster's office, where the manifests are read: a bay of small panes over the
// harbour, the ore quay and the ship at anchor and the sea's light coming in off them; the desk
// with the manifests open on it, the dockets on their spike and the seal; the chart of the coast,
// the pigeonholes of old papers, the board of sailings and the glass on its tripod.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, plaster, beam, planks, floorboards, line, fillPoly, ink, slab, pool, contact, inkRect } from '../kit.ts';
import { K, lantern, counter } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { drawText } from '../../../lib/engine/text.ts';
import { TAR, IRON, SEA_POOL, oreDust, harbour } from './port.ts';

const FLOOR = 206, WASH = '#cdc8bc', PAPER = '#e4dac2', BRASS = '#c09a48';
/** The bay: its left and right, its head and its sill and the two mullions that part its lights. */
const WX0 = 96, WX1 = 304, WY0 = 30, WY1 = 146, MULLIONS = [165, 235];

/** The bay window over the harbour: three lights of small panes in tarred frames, one view behind them all. */
function bay(ctx: CanvasRenderingContext2D, s: Stage): void {
  const w = WX1 - WX0, h = WY1 - WY0;
  slab(ctx, WX0 - 10, WY0 - 10, w + 20, h + 20, TAR, { lit: 2, dark: 0.15 });
  ctx.save(); ctx.beginPath(); ctx.rect(WX0, WY0, w, h); ctx.clip();
  harbour(WX0, WY0, w, h, s.daylight, 3)(ctx);
  // The glazing: panes four across a light and five down, and the old glass's sheen.
  for (let i = 0; i < 3; i++) {
    const lx0 = i === 0 ? WX0 : MULLIONS[i - 1], lx1 = i === 2 ? WX1 : MULLIONS[i];
    for (let c = 1; c < 4; c++) { const gx = lx0 + ((lx1 - lx0) * c) / 4; ctx.fillStyle = TAR; ctx.fillRect(Math.round(gx) - 1, WY0, 2, h); }
    for (let r = 1; r < 5; r++) { const gy = WY0 + (h * r) / 5; ctx.fillStyle = TAR; ctx.fillRect(lx0, Math.round(gy) - 1, lx1 - lx0, 2); }
  }
  const sheen = ctx.createLinearGradient(WX0, WY0, WX1, WY1);
  sheen.addColorStop(0, rgba('#ffffff', 0.12)); sheen.addColorStop(0.5, rgba('#ffffff', 0.02)); sheen.addColorStop(1, rgba('#ffffff', 0.08));
  ctx.fillStyle = sheen; ctx.fillRect(WX0, WY0, w, h);
  ctx.restore();
  for (const mx of MULLIONS) slab(ctx, mx - 4, WY0, 8, h, TAR, { lit: 1, dark: 0.3 });
  inkRect(ctx, WX0, WY0, w, h);
  // The deep sill, red with the ore's dust.
  slab(ctx, WX0 - 16, WY1 + 2, w + 32, 9, shade(TAR, 1.3), { lit: 2, dark: 0.3 });
  oreDust(ctx, WX0 - 14, WY1 + 2, w + 28, 4, 811, 0.6);
  if (s.daylight > 0.15) {
    pool(s, 200, 90, 260, SEA_POOL, 0.95 * s.daylight);
    pool(s, 200, 230, 200, '#d4e0ea', 0.5 * s.daylight);
  }
}

/** The chart of the coast pinned to the wall: a sheet gone yellow, the shore inked down it, soundings off it, a rose in the corner. */
function chart(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = rgba('#0a0608', 0.25); ctx.fillRect(x + 3, y + 3, w, h);
  slab(ctx, x, y, w, h, PAPER, { lit: 1, dark: 0.08 });
  const shore: number[] = []; for (let i = 0; i <= 12; i++) shore.push(x + w * (0.35 + Math.sin(i * 1.3) * 0.12 + (i % 3) * 0.04), y + 4 + ((h - 8) * i) / 12);
  fillPoly(ctx, [...shore, x + w - 2, y + h - 4, x + w - 2, y + 4], '#d0c4a0');
  line(ctx, shore, '#5a4a3a', 1);
  for (let i = 0; i < 26; i++) { ctx.fillStyle = rgba('#4a4a5a', 0.6); ctx.fillRect(Math.round(x + 4 + rnd(812, i) * w * 0.3), Math.round(y + 6 + rnd(813, i) * (h - 12)), 1, 1); }
  ctx.strokeStyle = rgba('#6a2a20', 0.7); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x + 12, y + h - 13, 7, 0, Math.PI * 2); ctx.stroke();
  line(ctx, [x + 12, y + h - 22, x + 12, y + h - 4], rgba('#6a2a20', 0.7), 1); line(ctx, [x + 3, y + h - 13, x + 21, y + h - 13], rgba('#6a2a20', 0.7), 1);
  for (const [px, py] of [[x + 3, y + 3], [x + w - 3, y + 3], [x + 3, y + h - 3], [x + w - 3, y + h - 3]]) glossBall(ctx, K, px, py, 1.5, BRASS, {});
}

/** Pigeonholes of old manifests, rolled and tied: a case of tarred wood, from the floor of the case at y up `h`. */
function pigeonholes(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  slab(ctx, x, y - h, w, h, shade(TAR, 1.2), { lit: 2, dark: 0.08 });
  const cols = 4, rows = 3, cw = (w - 6) / cols, rh = (h - 6) / rows;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const cx = x + 3 + c * cw, cy = y - h + 3 + r * rh;
    ctx.fillStyle = '#140e0c'; ctx.fillRect(Math.round(cx + 1), Math.round(cy + 1), Math.round(cw - 2), Math.round(rh - 2));
    for (let i = 0; i < 2 + Math.floor(rnd(814, r, c) * 3); i++) { const sr = 2.6, sx = cx + 4 + i * 4.5, sy = cy + rh - sr - 2; glossBall(ctx, K, sx, sy, sr, rnd(815, r, c, i) < 0.5 ? PAPER : '#c8b890', { gloss: 0.1 }); }
  }
}

/** The board of sailings by the bay: black, the ports lettered on it, a peg by each for the day's tag. */
function sailings(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  const h = 44;
  line(ctx, [x + w / 2, y - 9, x + 8, y], '#3a2a20', 1); line(ctx, [x + w / 2, y - 9, x + w - 8, y], '#3a2a20', 1);
  glossBall(ctx, K, x + w / 2, y - 9, 1.5, IRON, {});
  slab(ctx, x, y, w, h, '#1e2424', { lit: 2, dark: 0.12 });
  ['SALTMOUTH', 'CINDERPORT'].forEach((t, i) => {
    drawText(ctx, t, x + 5, y + 9 + i * 16, { size: 1, color: '#e0d8c0', shadow: false });
    glossBall(ctx, K, x + w - 7, y + 12 + i * 16, 1.6, BRASS, {});
    fillPoly(ctx, [x + w - 9, y + 14 + i * 16, x + w - 5, y + 14 + i * 16, x + w - 5, y + 21 + i * 16, x + w - 9, y + 21 + i * 16], i ? '#c83a2a' : '#e8dcc0');
  });
  ctx.fillStyle = rgba('#e0d8c0', 0.25); ctx.fillRect(x + 4, y + 22, w - 8, 1);
}

/** The glass on its tripod, foot on y, its tube laid toward the bay. */
function telescope(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  const top = y - h;
  contact(ctx, x, y, 30, 0.4);
  for (const dx of [-12, 0, 12]) { line(ctx, [x, top, x + dx, y], '#120c14', 3.5); line(ctx, [x, top, x + dx, y], '#6a4a2e', 2); }
  glossPoly(ctx, K, [x - 22, top - 13, x + 18, top + 4, x + 16, top + 9, x - 24, top - 8], BRASS, { gloss: 0.7, spread: 0.6 });
  glossPoly(ctx, K, [x - 34, top - 19, x - 20, top - 13, x - 22, top - 8, x - 36, top - 14], shade(BRASS, 0.85), { gloss: 0.7 });
  glossBall(ctx, K, x, top, 2.5, IRON, {});
}

/** The desk of manifests across the front: its top's back edge at `top`, running off the foot of the stage. */
function desk(ctx: CanvasRenderingContext2D, s: Stage, x0: number, x1: number, top: number): void {
  const front = top + 12;
  counter(ctx, x0, x1, top, 12, STAGE_H + 4, shade(TAR, 1.9), 816, { panels: 4, trim: BRASS });
  // The manifests, open: a fat book of ruled pages.
  const bx = (x0 + x1) / 2 - 6;
  glossPoly(ctx, K, [bx - 40, front - 1, bx - 36, top + 1, bx + 36, top + 1, bx + 40, front - 1], '#4a2a20', {});
  glossPoly(ctx, K, [bx - 37, front - 2, bx - 33, top + 2, bx - 1, top + 3, bx - 1, front - 1], PAPER, {});
  glossPoly(ctx, K, [bx + 1, front - 1, bx + 1, top + 3, bx + 33, top + 2, bx + 37, front - 2], shade(PAPER, 0.96), {});
  for (let i = 0; i < 3; i++) for (const sd of [-1, 1]) line(ctx, [bx + sd * 6, top + 5 + i * 2.5, bx + sd * 31, top + 5 + i * 2.5], rgba('#3a2a30', 0.5), 1);
  // Papers in a tied stack, the dockets on their spike, the seal and its wax, the ink and the pen.
  for (let i = 0; i < 5; i++) slab(ctx, x0 + 18 + (i % 2), top + 4 - i * 2, 40, 3, i % 2 ? PAPER : shade(PAPER, 0.92), { lit: 1, dark: 0.3, outline: i === 4 });
  line(ctx, [x0 + 38, top - 6, x0 + 38, top + 7], '#8a3a2a', 1.5);
  line(ctx, [x1 - 54, top + 6, x1 - 54, top - 14], '#120c14', 2.5); line(ctx, [x1 - 54, top + 6, x1 - 54, top - 14], shade(IRON, 1.6), 1);
  for (let i = 0; i < 4; i++) fillPoly(ctx, [x1 - 61, top - 1 - i * 3, x1 - 47, top - 2 - i * 3, x1 - 47, top - i * 3, x1 - 61, top + 1 - i * 3], i % 2 ? PAPER : '#d8cca8');
  glossPoly(ctx, K, [x1 - 34, top + 7, x1 - 32, top - 3, x1 - 26, top - 3, x1 - 24, top + 7], BRASS, { gloss: 0.6 });
  glossPoly(ctx, K, [x1 - 20, top + 8, x1 - 2, top + 4, x1 - 1, top + 7, x1 - 19, top + 11], '#b02a20', { gloss: 0.4 });
  glossPoly(ctx, K, [bx + 52, top + 7, bx + 51, top + 1, bx + 61, top + 1, bx + 60, top + 7], '#2a2a3a', { gloss: 0.6 });
  line(ctx, [bx + 56, top + 1, bx + 64, top - 16], '#e8e0d0', 1.5);
  // The desk lamp: a brass foot and a glass chimney, lit day and night.
  const lx = x0 + 78, ly = top + 4;
  glossPoly(ctx, K, [lx - 7, ly, lx - 4, ly - 6, lx + 4, ly - 6, lx + 7, ly], BRASS, { gloss: 0.7 });
  glossEllipse(ctx, K, lx, ly - 10, 6, 5, BRASS, 0, { gloss: 0.7 });
  glossPoly(ctx, K, [lx - 3, ly - 14, lx - 4, ly - 26, lx + 4, ly - 26, lx + 3, ly - 14], '#e8f0f0', { gloss: 0.9 });
  s.lights.push({ k: 'flame', x: lx, y: ly - 15, s: 2.2 });
  s.lights.push({ k: 'glow', x: lx, y: ly - 19, r: 12, color: '#ffe0a0', a: 0.4 });
  pool(s, lx, ly - 20, 150, '#ffc878', 0.85);
}

export const HARBOURMASTER: Scene = {
  ambient: ['#262a34', '#8a8e92'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    plaster(ctx, 0, 0, STAGE_W, 150, WASH, 817);
    planks(ctx, 0, 150, STAGE_W, FLOOR - 150, shade(TAR, 1.3), 18, true, 818);
    slab(ctx, 0, 147, STAGE_W, 6, TAR, { lit: 1 });
    oreDust(ctx, 0, FLOOR - 26, STAGE_W, 26, 819, 0.35);
    floorboards(ctx, FLOOR, 200, 110, '#6a5a4a', 9, 820);
    oreDust(ctx, 0, FLOOR, STAGE_W, STAGE_H - FLOOR, 821, 0.3);
    beam(ctx, 0, 0, STAGE_W, 14, TAR, 822);
    bay(ctx, s);
    // Left: the chart of the coast, and the pigeonholes of old manifests under it.
    chart(ctx, 14, 30, 66, 70);
    pigeonholes(ctx, 14, 146, 66, 38);
    // Right: the board of sailings, the ship's bell on its bracket, a lantern for the evening.
    sailings(ctx, 318, 36, 74);
    line(ctx, [356, 96, 380, 96], '#120c14', 3); line(ctx, [356, 96, 380, 96], IRON, 1.5);
    glossPoly(ctx, K, [366, 100, 368, 97, 374, 97, 376, 100, 378, 112, 364, 112], BRASS, { gloss: 0.8, spread: 0.6 });
    glossBall(ctx, K, 371, 114, 1.8, shade(BRASS, 0.8), {});
    line(ctx, [326, 92, 342, 92], '#120c14', 3); line(ctx, [326, 92, 342, 92], IRON, 1.5); line(ctx, [326, 88, 326, 98], '#120c14', 3);
    lantern(ctx, s, 340, 100, 10, IRON, 92, 170);
    telescope(ctx, 326, FLOOR + 2, 70);
    desk(ctx, s, 60, 340, 222);
  },
};
