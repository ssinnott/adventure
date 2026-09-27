// The Green Man, Thornhold's inn: grown rather than built, the fire burning under a face of leaves.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, plaster, floorboards, windowIn, forestFill, line, fillPoly, trunk } from '../kit.ts';
import { K, logCounter, shelf, bottle, jar, jug, cup, candle, lantern, kegEnd, herbs, hearth } from '../props.ts';
import { glossPoly, glossBall, blob, softLine } from '../../monsters/gloss.ts';

const BARK = '#5a4632', GOLDWOOD = '#a8844e', DAUB = '#b8ae84', LEAF = '#4a7a3a';

/** A leaf, pointed at both ends, from its stalk at (x, y) out along angle a. */
function leaf(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, a: number, col: string): void {
  const ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux, w = len * 0.32;
  glossPoly(ctx, K, [x, y, x + ux * len * 0.35 + nx * w, y + uy * len * 0.35 + ny * w, x + ux * len, y + uy * len, x + ux * len * 0.35 - nx * w, y + uy * len * 0.35 - ny * w], col, { gloss: 0.15, spread: 0.7 });
  line(ctx, [x + ux * len * 0.1, y + uy * len * 0.1, x + ux * len * 0.85, y + uy * len * 0.85], rgba('#1a1208', 0.35), 1);
}

/**
 * The Green Man himself, carved in oak over the fire: a broad face whose hair and beard are
 * leaves, with more leaves growing from the corners of his mouth.
 */
function greenManFace(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
  const oak = '#9a7a44';
  for (let i = 0; i < 13; i++) {
    const a = Math.PI + (i / 12) * Math.PI;
    leaf(ctx, cx + Math.cos(a) * r * 0.55, cy + Math.sin(a) * r * 0.6, r * 0.85, a, i % 2 ? '#7a8a3a' : '#5a7a34');
  }
  for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) leaf(ctx, cx + sd * r * 0.3, cy + r * 0.6, r * (0.7 - i * 0.1), Math.PI / 2 + sd * (0.35 + i * 0.4), i % 2 ? '#6a8a3a' : '#4a6a2e');
  blob(ctx, K, oak, [{ k: 'curve', pts: [cx - r * 0.72, cy - r * 0.5, cx, cy - r * 0.78, cx + r * 0.72, cy - r * 0.5, cx + r * 0.66, cy + r * 0.35, cx + r * 0.3, cy + r * 0.78, cx - r * 0.3, cy + r * 0.78, cx - r * 0.66, cy + r * 0.35], wobble: 0.03, seed: 8, sub: 2 }], { h: r * 4, formK: 0.6, spread: 0.7, tex: 'cracks', seed: 8, amount: 0.3 });
  // A heavy brow over deep eyes, a broad nose, and a mouth open on a leaf.
  for (const sd of [-1, 1]) {
    ctx.beginPath(); ctx.ellipse(cx + sd * r * 0.3, cy - r * 0.1, r * 0.16, r * 0.1, 0, 0, Math.PI * 2); ctx.fillStyle = '#1a1208'; ctx.fill();
    ctx.fillStyle = '#c8ffb0'; ctx.fillRect(Math.round(cx + sd * r * 0.3) - 1, Math.round(cy - r * 0.12), 2, 1);
    softLine(ctx, K, [cx + sd * r * 0.55, cy - r * 0.18, cx + sd * r * 0.12, cy - r * 0.32], oak, Math.max(2, r * 0.12), 0.8);
  }
  glossPoly(ctx, K, [cx - r * 0.1, cy - r * 0.2, cx + r * 0.1, cy - r * 0.2, cx + r * 0.18, cy + r * 0.22, cx - r * 0.18, cy + r * 0.22], shade(oak, 1.08), { spread: 0.7 });
  ctx.beginPath(); ctx.ellipse(cx, cy + r * 0.45, r * 0.22, r * 0.1, 0, 0, Math.PI * 2); ctx.fillStyle = '#1a1208'; ctx.fill();
  leaf(ctx, cx, cy + r * 0.45, r * 0.5, Math.PI / 2, '#6a9a3a');
}

/** A lantern of green glass hung from a bough. */
function greenLantern(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, size: number, top: number): void {
  lantern(ctx, s, x, y, size, '#4a3a2a', top, size * 10, '#d8f0a0');
}

/** The house cask, lying on its cradle: seen end-on, its tap over a drip-cup. Centre (x, y). */
function cask(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  for (const sd of [-1, 1]) fillPoly(ctx, [x + sd * r * 0.9, y + r * 0.5, x + sd * r * 0.7, y + r * 1.25, x + sd * r * 0.5, y + r * 1.25, x + sd * r * 0.55, y + r * 0.7], shade(BARK, 1.2));
  kegEnd(ctx, x, y, r, '#9a6a3a', '#3a3440', '#c9a34a');
  cup(ctx, x, y + r * 1.25, r * 0.5, GOLDWOOD);
}

export const GREEN_MAN: Scene = {
  ambient: ['#3a3a40', '#9aa088'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 206;
    ctx.fillStyle = '#2a2016'; ctx.fillRect(0, 0, STAGE_W, STAGE_H);
    plaster(ctx, 0, 20, STAGE_W, FLOOR - 20, DAUB, 31);
    floorboards(ctx, FLOOR, 210, 96, '#8a6a42', 8, 33);
    // The hearth in the left bay, built into the roots, and the Green Man over it.
    const fb = hearth(ctx, s, 40, 44, 104, FLOOR + 6, '#8a8672', 34, { mantel: GOLDWOOD, reach: 250 });
    greenManFace(ctx, 92, 86, 22);
    const mantelY = fb.y - fb.w * 0.36;
    cup(ctx, 52, mantelY, 9, GOLDWOOD); cup(ctx, 64, mantelY, 9, '#8a6a3a', true); candle(ctx, s, 132, mantelY, 11, '#e8e0c0', 80);
    // The middle bay, behind the counter: the house cask on its cradle under a shelf of bottles.
    shelf(ctx, 176, 96, 80, GOLDWOOD);
    for (let i = 0; i < 5; i++) bottle(ctx, 186 + i * 15, 96, 15 + rnd(12, i) * 7, ['#4a7a4a', '#8a6a2a', '#6a3a5a'][i % 3], { squat: i % 2 === 1 });
    cask(ctx, 216, 150, 24);
    // Shelves of cups and jars in the right bay, under a round window onto the forest.
    windowIn(ctx, s, 304, 40, 58, 58, GOLDWOOD, { round: true, panes: [2, 2], view: (c) => forestFill(c, 304, 40, 58, 58, s.daylight, 9) });
    shelf(ctx, 290, 116, 84, GOLDWOOD);
    for (let i = 0; i < 5; i++) cup(ctx, 300 + i * 16, 116, 10, i % 2 ? GOLDWOOD : '#7a5a34', i === 2);
    shelf(ctx, 290, 152, 84, GOLDWOOD);
    jar(ctx, 304, 152, 14, 18, '#6a8a6a', '#a8844e'); jar(ctx, 326, 152, 12, 16, '#c8a060'); jar(ctx, 346, 152, 14, 20, '#7a5a8a', '#6a4428'); jar(ctx, 364, 152, 10, 13, '#a86a3a');
    // Great trunks rising out of the floor and leaning together overhead: the room's frame.
    trunk(ctx, [4, 268, 16, 170, 22, 90, 50, 30, 100, -10], 26, 12, BARK, 1);
    trunk(ctx, [396, 268, 386, 170, 378, 90, 350, 30, 300, -10], 26, 12, BARK, 2);
    trunk(ctx, [156, 210, 158, 150, 162, 90, 180, 40, 204, 0], 11, 7, shade(BARK, 1.1), 3);
    trunk(ctx, [276, 210, 274, 150, 270, 90, 252, 40, 226, 0], 11, 7, shade(BARK, 1.1), 4);
    // The canopy: boughs across the top, thick with leaves.
    for (let i = 0; i < 70; i++) {
      const lx = rnd(6, i) * STAGE_W, ly = rnd(7, i) * 30 - 6;
      leaf(ctx, lx, ly, 10 + rnd(8, i) * 8, rnd(9, i) * Math.PI * 2, i % 3 ? LEAF : '#5a8a3a');
    }
    trunk(ctx, [0, 18, 120, 8, 220, 16, 320, 8, 400, 16], 6, 6, BARK, 5);
    // Garlands of dried flowers and herbs along the bough, and lanterns of green glass.
    for (let i = 0; i < 6; i++) herbs(ctx, 20 + i * 64 + (i > 2 ? 10 : 0), 30, 12, 18, ['#8a9a4a', '#a0708a', '#c8a050'][i % 3], i + 40);
    greenLantern(ctx, s, 214, 40, 11, 16);
    greenLantern(ctx, s, 290, 64, 9, 16);
    // The counter: one split log, and the evening's cups and apples on it.
    logCounter(ctx, 140, STAGE_W, 190, 12, STAGE_H, GOLDWOOD, BARK, 7);
    cup(ctx, 236, 200, 12, GOLDWOOD); jug(ctx, 262, 200, 20, '#c86a3a', '#e8d8b0');
    cup(ctx, 300, 200, 12, GOLDWOOD); cup(ctx, 318, 200, 12, '#7a5a34');
    cup(ctx, 172, 202, 26, '#7a5a34', true);
    for (let i = 0; i < 5; i++) glossBall(ctx, K, 164 + (i % 3) * 7 + (i > 2 ? 3 : 0), 196 - (i > 2 ? 6 : 0), 4, i % 2 ? '#c83a2a' : '#8ab83a', { gloss: 0.5 });
    candle(ctx, s, 370, 200, 13, '#e8e0c0', 110);
  },
};
