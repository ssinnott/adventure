// Mottram's Stores in Helmstow, where a party buys its first clubs and rations and torches.
import { rgba } from '../../../lib/art/palettes.ts';
import { rnd, STAGE_W, STAGE_H, plaster, beam, planks, floorboards, windowIn, line, fillPoly, inkRect, slab } from '../kit.ts';
import { K, counter, bottle, jar, sack, crate, barrel, candle, lantern, herbs, sword, spear, mace, club, staff, bow, shield } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import type { Scene, Stage } from '../kit.ts';
import { drawText } from '../../../lib/engine/text.ts';
import { flask } from '../shops.ts';

const BRASS = '#c9a34a';

/** A little stack of coins on y. */
function coins(ctx: CanvasRenderingContext2D, x: number, y: number, n: number, metal = '#e0b840'): void {
  for (let i = 0; i < n; i++) glossEllipse(ctx, K, x + (rnd(3, i) - 0.5) * 2, y - 1 - i * 2, 4.5, 1.8, metal, 0, { gloss: 0.7 });
}

const PINE = '#8a6038', PINE_DARK = '#5a3a22', WALL = '#e6d8b8';

/** The shop's brass scale on the counter, foot on y: a post, a beam, two pans on chains, a weight in one. */
function scale(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  glossPoly(ctx, K, [x - h * 0.22, y, x - h * 0.16, y - h * 0.08, x + h * 0.16, y - h * 0.08, x + h * 0.22, y], PINE_DARK, {});
  glossPoly(ctx, K, [x - 1.5, y - h * 0.08, x - 1.5, y - h, x + 1.5, y - h, x + 1.5, y - h * 0.08], BRASS, { gloss: 0.6 });
  const tilt = h * 0.04, bx0 = x - h * 0.45, bx1 = x + h * 0.45, by0 = y - h * 0.92 + tilt, by1 = y - h * 0.92 - tilt;
  line(ctx, [bx0, by0, bx1, by1], '#120c14', 4); line(ctx, [bx0, by0, bx1, by1], BRASS, 2);
  glossBall(ctx, K, x, y - h * 0.94, h * 0.05, BRASS, { gloss: 0.7 });
  for (const [px, py] of [[bx0, by0], [bx1, by1]] as [number, number][]) {
    const pan = py + h * 0.42;
    line(ctx, [px, py, px - h * 0.12, pan], '#8a7a4a', 1); line(ctx, [px, py, px + h * 0.12, pan], '#8a7a4a', 1);
    glossPoly(ctx, K, [px - h * 0.16, pan, px + h * 0.16, pan, px + h * 0.1, pan + h * 0.07, px - h * 0.1, pan + h * 0.07], BRASS, { gloss: 0.7 });
  }
  glossPoly(ctx, K, [bx0 - 3, by0 + h * 0.42, bx0 - 2, by0 + h * 0.34, bx0 + 2, by0 + h * 0.34, bx0 + 3, by0 + h * 0.42], '#5a5460', { gloss: 0.4 });
}

/** The ledger, open on the counter, with its quill in the inkpot beside it. Foot on y. */
function ledger(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  glossPoly(ctx, K, [x - w / 2, y, x - w * 0.45, y - w * 0.22, x + w * 0.45, y - w * 0.22, x + w / 2, y], '#6a2a20', {});
  glossPoly(ctx, K, [x - w * 0.46, y - 2, x - w * 0.42, y - w * 0.2, x - 1, y - w * 0.16, x - 1, y - 1], '#f0e8d0', {});
  glossPoly(ctx, K, [x + 1, y - 1, x + 1, y - w * 0.16, x + w * 0.42, y - w * 0.2, x + w * 0.46, y - 2], '#e8e0c8', {});
  for (let i = 0; i < 4; i++) { line(ctx, [x - w * 0.38, y - w * 0.16 + i * 3, x - w * 0.08, y - w * 0.15 + i * 3], rgba('#3a2a30', 0.5), 1); line(ctx, [x + w * 0.08, y - w * 0.15 + i * 3, x + w * 0.38, y - w * 0.16 + i * 3], rgba('#3a2a30', 0.5), 1); }
  const ix = x + w * 0.72;
  glossPoly(ctx, K, [ix - 4, y, ix - 5, y - 6, ix + 5, y - 6, ix + 4, y], '#2a2a3a', { gloss: 0.6 });
  line(ctx, [ix, y - 6, ix + 8, y - 22], '#e8e0d0', 2);
  fillPoly(ctx, [ix + 4, y - 14, ix + 12, y - 26, ix + 9, y - 16], '#f4f0e8');
}

/** A bundle of torches: pitch-headed sticks tied together, leaning, foot on y. */
function torches(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, n = 5): void {
  for (let i = 0; i < n; i++) {
    const dx = (i - (n - 1) / 2) * 3.5, lean = dx * 0.35;
    line(ctx, [x + dx, y, x + dx + lean, y - h], '#120c14', 4); line(ctx, [x + dx, y, x + dx + lean, y - h], '#8a6a42', 2.5);
    glossEllipse(ctx, K, x + dx + lean, y - h, 2.8, 4.5, '#3a2a1e', 0, { gloss: 0.3 });
  }
  line(ctx, [x - n * 2, y - h * 0.35, x + n * 2, y - h * 0.35], '#c8b890', 2);
}

/** A coil of rope hung from a peg, centre (x, y). */
function rope(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = '#120c14'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, y + i * 1.5, r - i * 0.8, r * 0.9 - i * 0.6, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = i % 2 ? '#c8a870' : '#b89860'; ctx.lineWidth = 2.5; ctx.stroke();
  }
  line(ctx, [x, y - r, x, y - r - 4], '#6a4626', 3);
}

/** A leather jerkin on a hook, its top at y. */
function jerkin(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  const w = h * 0.78;
  glossPoly(ctx, K, [x - w * 0.18, y, x + w * 0.18, y, x + w * 0.46, y + h * 0.1, x + w * 0.4, y + h * 0.36, x + w * 0.36, y + h, x - w * 0.36, y + h, x - w * 0.4, y + h * 0.36, x - w * 0.46, y + h * 0.1], '#8a5a32', { gloss: 0.2, spread: 0.7, h: 100, tex: 'stipple', seed: 4, amount: 0.3 });
  line(ctx, [x, y + h * 0.06, x, y + h], '#4a2e1a', 1.5);
  for (let i = 0; i < 4; i++) glossBall(ctx, K, x + 2.5, y + h * (0.2 + i * 0.18), 1.4, BRASS, { gloss: 0.6 });
  line(ctx, [x - w * 0.36, y + h * 0.7, x + w * 0.36, y + h * 0.7], '#4a2e1a', 2);
}

export const PROVISIONER: Scene = {
  ambient: ['#463a44', '#b0a290'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 206;
    plaster(ctx, 0, 0, STAGE_W, FLOOR, WALL, 51);
    floorboards(ctx, FLOOR, 200, 100, '#86603c', 9, 52);
    planks(ctx, 0, 0, STAGE_W, 20, PINE_DARK, 1, false, 53);
    beam(ctx, 0, 16, STAGE_W, 12, PINE, 54);
    beam(ctx, 126, 28, 10, FLOOR - 28, PINE, 55);
    beam(ctx, 270, 28, 10, FLOOR - 28, PINE, 56);
    // Left: the weapon wall. A rack of pegs, the shop's arms on it, a buckler and a jerkin above.
    shield(ctx, 32, 62, 15, '#8a6a42', 'round', '#6a3a2a');
    jerkin(ctx, 78, 36, 52);
    beam(ctx, 8, 104, 96, 6, PINE_DARK, 57);
    beam(ctx, 8, 176, 96, 6, PINE_DARK, 58);
    club(ctx, 18, 176, 58); mace(ctx, 34, 176, 56); sword(ctx, 52, 176, 66); sword(ctx, 68, 176, 40, { w: 2.2 }); bow(ctx, 96, 180, 70);
    // A spear and a quarterstaff stood in the corner against the post.
    spear(ctx, 110, FLOOR, 162); staff(ctx, 118, FLOOR, 150);
    // A sling hung from the lower rail.
    line(ctx, [30, 182, 26, 200, 34, 200, 30, 182], '#6a4a2a', 1.5);
    // Middle: pigeonholes behind the counter, potions and simples in them, and the shop's board over them.
    const px = 142, pw = 118, pt = 44;
    slab(ctx, px, pt, pw, 150, PINE_DARK, { lit: 2, dark: 0.1 });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const cx = px + 6 + c * 28, cy = pt + 6 + r * 36;
      ctx.fillStyle = '#2a1a10'; ctx.fillRect(cx, cy, 24, 32);
      ctx.fillStyle = rgba('#000000', 0.35); ctx.fillRect(cx, cy, 24, 4);
      const k = (r * 4 + c) % 8, foot = cy + 32;
      if (k === 0 || k === 5) for (let i = 0; i < 3; i++) flask(ctx, cx + 5 + i * 7, foot, 3.6, '#c83a3a');
      else if (k === 1 || k === 6) for (let i = 0; i < 3; i++) bottle(ctx, cx + 5 + i * 7, foot, 16, '#4a8a4a', { squat: true, cork: '#a07850' });
      else if (k === 2) torches(ctx, cx + 12, foot, 26);
      else if (k === 3) for (let i = 0; i < 3; i++) slab(ctx, cx + 1, foot - 7 - i * 7, 22, 7, ['#8a4a8a', '#4a5a8a', '#8a7a5a'][i], { lit: 1, dark: 0.3 });
      else if (k === 4) jar(ctx, cx + 12, foot, 18, 24, '#b88a4a', '#6a4428');
      else if (k === 7) for (let i = 0; i < 2; i++) glossBall(ctx, K, cx + 7 + i * 10, foot - 6, 5.5, '#d8c8a0', { h: 60, tex: 'stipple', seed: i });
    }
    inkRect(ctx, px, pt, pw, 150);
    slab(ctx, 150, 20, 102, 20, '#3a5a3a', { lit: 2, dark: 0.3 });
    drawText(ctx, 'PROVISIONS', 201, 27, { size: 1, color: '#e8d080', align: 'center', shadowColor: '#120c14' });
    // Right: the window, and the stores under it.
    windowIn(ctx, s, 300, 42, 64, 58, PINE_DARK, { panes: [3, 2] });
    rope(ctx, 290, 124, 11);
    herbs(ctx, 380, 36, 14, 28, '#7a8a3a', 7);
    barrel(ctx, 312, FLOOR + 4, 36, 46, '#8a5a32');
    for (let i = 0; i < 7; i++) glossBall(ctx, K, 300 + (i % 4) * 8 + (i > 3 ? 4 : 0), FLOOR - 44 - (i > 3 ? 5 : 0), 4, i % 3 ? '#c83a2a' : '#9ac83a', { gloss: 0.6 });
    sack(ctx, 356, FLOOR + 6, 34, 44, '#c8b088', { open: '#e0c070', seed: 3 });
    crate(ctx, 364, FLOOR - 36, 32, 24, '#a07848');
    lantern(ctx, s, 330, 128, 11, '#3a3440', 28, 160);
    // The counter, with the scale, the ledger and a few coins on it.
    counter(ctx, 126, 290, 194, 11, STAGE_H, PINE, 60, { panels: 2, trim: BRASS });
    scale(ctx, 160, 204, 34);
    ledger(ctx, 226, 204, 40);
    coins(ctx, 196, 204, 4); coins(ctx, 205, 204, 2);
    flask(ctx, 276, 204, 5, '#c83a3a');
    // Stock stood on the floor in front: sacks of meal, and a basket of torches.
    sack(ctx, 40, 256, 44, 56, '#c0a47a', { seed: 1 });
    sack(ctx, 84, 262, 40, 50, '#b0946a', { open: '#e8d8a8', seed: 2 });
    crate(ctx, 318, 266, 56, 44, '#9a7040');
    torches(ctx, 346, 222, 36, 6);
    candle(ctx, s, 250, 204, 12, '#efe4c8', 100);
  },
};
