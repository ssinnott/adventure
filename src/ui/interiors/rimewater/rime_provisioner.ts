// Rime Lodge's provisioner, the guides' outfitter: fish drying in a row under the beam, a hand
// sledge hung on the wall over the counter and ice creepers on their nails, rope, lamp oil for the
// long nights and the potions, peat heaped for the fire on the ice; sacks and the salt-fish barrel
// on the boards.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, beam, planks, floorboards, windowIn, line, fillPoly, contact, slab } from '../kit.ts';
import { K, counter, shelf, jar, bottle, sack, crate, barrel, candle, lantern } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { flask } from '../shops.ts';
import { LOG, IRON, logWall, frost } from './lodge.ts';

const DARK = '#4a3a2c', ASH = '#a8865a', HEMP = '#c8a870', PEAT = '#4a3424', FISH = '#c8b48a', BRASS = '#c9a34a';
const FLOOR = 200;

/** A fish dried whole and hung by its tail from a cord at y: the forked tail up, the body narrowing to it, the head at the foot with its eye and gill. */
function driedFish(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, seed: number): void {
  const w = len * 0.24, col = shade(FISH, 0.88 + rnd(seed) * 0.22);
  line(ctx, [x, y - 4, x, y + 3], '#c8b890', 1);
  glossPoly(ctx, K, [x, y + len * 0.14, x - w * 0.7, y, x - w * 0.36, y + len * 0.04, x - w * 0.08, y + len * 0.16, x + w * 0.08, y + len * 0.16, x + w * 0.36, y + len * 0.04, x + w * 0.7, y], shade(col, 0.85), { gloss: 0.2 });
  glossPoly(ctx, K, [x - w * 0.12, y + len * 0.15, x - w * 0.5, y + len * 0.5, x - w * 0.42, y + len * 0.86, x, y + len, x + w * 0.42, y + len * 0.86, x + w * 0.5, y + len * 0.5, x + w * 0.12, y + len * 0.15], col, { gloss: 0.35, spread: 0.7 });
  line(ctx, [x - w * 0.38, y + len * 0.8, x, y + len * 0.74, x + w * 0.38, y + len * 0.8], rgba('#6a4a2a', 0.7), 1);
  ctx.fillStyle = '#1a1414'; ctx.fillRect(Math.round(x - w * 0.22), Math.round(y + len * 0.88), 2, 2);
  line(ctx, [x - w * 0.3, y + len * 0.4, x - w * 0.26, y + len * 0.68], rgba('#ffffff', 0.4), 1);
}

/** A hand sledge hung on the wall by its rope, its bed at y: two runners turned up at the front, slats across, a pulling rope. From x across w. */
function sledge(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  for (let i = 0; i < 7; i++) slab(ctx, x + 8 + i * (w - 20) / 6, y - 8, 7, 9, shade(ASH, 0.92 + (i % 2) * 0.1), { lit: 1, dark: 0.3 });
  for (const dy of [0, 7]) {
    const pts = [x + 4, y + dy, x + w - 14, y + dy];
    line(ctx, [...pts, x + w - 4, y + dy - 6, x + w - 2, y + dy - 14], '#120c14', 5);
    line(ctx, [...pts, x + w - 4, y + dy - 6, x + w - 2, y + dy - 14], ASH, 3);
  }
  for (let i = 0; i < 4; i++) line(ctx, [x + 10 + i * (w - 24) / 3, y - 1, x + 10 + i * (w - 24) / 3, y + 7], '#5a4430', 2);
  line(ctx, [x + w - 2, y - 14, x + w * 0.6, y - 34, x + w * 0.3, y - 14], HEMP, 1.5);
  glossBall(ctx, K, x + w * 0.6, y - 35, 2, '#5a4430', {});
}

/** A pair of ice creepers hung on a nail: an iron frame each with its spikes down and a strap, the nail at (x, y). */
function creepers(ctx: CanvasRenderingContext2D, x: number, y: number, s: number): void {
  for (const dx of [-s * 0.3, s * 0.3]) {
    line(ctx, [x, y, x + dx, y + s * 0.4], '#3a2a20', 1.5);
    glossPoly(ctx, K, [x + dx - s * 0.22, y + s * 0.4, x + dx + s * 0.22, y + s * 0.4, x + dx + s * 0.2, y + s * 1.1, x + dx - s * 0.2, y + s * 1.1], IRON, { gloss: 0.5 });
    for (let i = 0; i < 3; i++) fillPoly(ctx, [x + dx - s * 0.2 + i * s * 0.18, y + s * 1.1, x + dx - s * 0.14 + i * s * 0.18, y + s * 1.32, x + dx - s * 0.08 + i * s * 0.18, y + s * 1.1], '#5a5a62');
    line(ctx, [x + dx - s * 0.26, y + s * 0.62, x + dx + s * 0.26, y + s * 0.62], '#6a4a2a', 2);
  }
  ctx.fillStyle = '#2a2020'; ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 3, 3);
}

/** A coil of rope on a peg, centre (x, y). */
function rope(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = '#120c14'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, y + i * 1.5, r - i * 0.8, r * 0.9 - i * 0.6, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = i % 2 ? HEMP : shade(HEMP, 0.9); ctx.lineWidth = 2.5; ctx.stroke();
  }
  line(ctx, [x, y - r, x, y - r - 4], '#6a4626', 3);
}

/** Peat cut in turves and heaped to dry, foot on y: rough dark sods, each its own shape, the heap narrowing to its top. Centred on x, w across, h high. */
function peatHeap(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  contact(ctx, x, y, w * 1.05, 0.45);
  const rows = Math.round(h / 9);
  for (let r = 0; r < rows; r++) {
    const rw = w * (1 - r / (rows + 1)), ry = y - (r + 1) * 9, n = Math.max(1, Math.round(rw / 16));
    for (let i = 0; i < n; i++) {
      const bx = x - rw / 2 + i * (rw / n) + (rnd(531, r, i) - 0.5) * 3, bw = rw / n - 1, j = (k: number): number => (rnd(531, r, i, k) - 0.5) * 2.5;
      glossPoly(ctx, K, [bx + j(1), ry + 9, bx + j(2), ry + 2 + j(3), bx + bw * 0.4, ry + j(4), bx + bw + j(5), ry + 1 + j(6), bx + bw + j(7), ry + 9], shade(PEAT, 0.8 + rnd(531, r, i, 8) * 0.35), { gloss: 0.05, spread: 0.8, h: 120, tex: 'stipple', seed: r * 11 + i, amount: 0.5 });
      line(ctx, [bx + 2, ry + 3 + j(9), bx + bw - 2, ry + 4 + j(10)], rgba('#8a6a48', 0.5), 1);
    }
  }
}

export const RIME_PROVISIONER: Scene = {
  ambient: ['#262632', '#8e9096'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    logWall(ctx, 0, 22, STAGE_W, FLOOR - 22, 12, 532);
    floorboards(ctx, FLOOR, 200, 110, '#76593e', 8, 533);
    planks(ctx, 0, 0, STAGE_W, 12, shade(DARK, 0.8), 1, false, 534);
    beam(ctx, 0, 10, STAGE_W, 13, DARK, 535);
    // The fish drying in a row from a cord under the beam.
    line(ctx, [0, 30, STAGE_W, 32], '#c8b890', 1);
    for (let i = 0; i < 12; i++) driedFish(ctx, 14 + i * 33, 31 + (i % 2) * 2, 32 + (i % 3) * 4, 536 + i);
    // The shelves on the left: lamp oil in jars, and the potions.
    shelf(ctx, 6, 110, 112, shade(LOG, 0.9));
    shelf(ctx, 6, 150, 112, shade(LOG, 0.9));
    for (let i = 0; i < 4; i++) jar(ctx, 20 + i * 26, 110, 18, 24, ['#8a6a4a', '#6a5a4a'][i % 2], '#3a2a1a');
    for (let i = 0; i < 6; i++) flask(ctx, 18 + i * 16, 150, 5, ['#c83a3a', '#3a6ac8', '#c83a3a', '#4a9a4a', '#c83a3a', '#e0c040'][i]);
    // The window high on the back wall, frosted over: the day, and not much else.
    const wx = 150, wy = 46, ww = 44, wh = 36;
    windowIn(ctx, s, wx, wy, ww, wh, shade(LOG, 0.8), { panes: [2, 2], view: (c) => frost(c, wx, wy, ww, wh, 537, 1.2) });
    // The sledge hung over the counter, the creepers and the rope beside it.
    sledge(ctx, 208, 104, 96);
    creepers(ctx, 324, 70, 16);
    creepers(ctx, 350, 76, 16);
    rope(ctx, 380, 78, 12);
    // Peat heaped by the far wall for the fire on the ice, the salt-fish barrel and a sack by it.
    peatHeap(ctx, 350, FLOOR + 6, 92, 54);
    barrel(ctx, 270, FLOOR + 18, 40, 50, '#7a5232', IRON);
    for (let i = 0; i < 4; i++) { const tx = 258 + i * 8; fillPoly(ctx, [tx, FLOOR - 32, tx - 4, FLOOR - 42, tx + 4, FLOOR - 42], '#a8b4bc'); line(ctx, [tx, FLOOR - 32, tx, FLOOR - 28], '#8a9aa4', 2); }
    sack(ctx, 360, FLOOR + 24, 40, 46, '#b8a078', { open: '#e0d0a0', seed: 4 });
    // The counter, the day book and the takings on it; the lamp from the beam.
    counter(ctx, 120, 300, 206, 11, STAGE_H, '#6a5038', 538, { panels: 2, trim: BRASS });
    glossPoly(ctx, K, [186, 215, 190, 207, 214, 206, 216, 215], '#f0e8d0', {});
    glossPoly(ctx, K, [216, 215, 216, 206, 240, 207, 244, 215], '#e8e0c8', {});
    for (let i = 0; i < 3; i++) { line(ctx, [192, 208 + i * 2.5, 212, 208 + i * 2.5], rgba('#3a2a30', 0.5), 1); line(ctx, [220, 208 + i * 2.5, 238, 208 + i * 2.5], rgba('#3a2a30', 0.5), 1); }
    for (let i = 0; i < 4; i++) glossEllipse(ctx, K, 262 + (i % 2), 214 - i * 2, 4.5, 1.8, '#e0b840', 0, { gloss: 0.7 });
    bottle(ctx, 150, 215, 16, '#3a5a4a', { squat: true });
    candle(ctx, s, 284, 215, 10, '#efe4c8', s.daylight > 0.5 ? 80 : 140);
    lantern(ctx, s, 120, 134, 10, '#3a3440', 23, s.daylight > 0.5 ? 120 : 200);
    // Stock on the boards in front: a sack of oats open, a crate.
    sack(ctx, 50, 262, 46, 54, '#c0a47a', { open: '#e8d8a8', seed: 5 });
    crate(ctx, 332, 268, 56, 40, '#8a6a44', 6);
  },
};
