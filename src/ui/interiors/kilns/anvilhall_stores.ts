// Anvilhall's stores, provisions at list price: a storeroom cut in the rock, racks of timber to the
// roof with meal and cheese and lamp oil on them, sausage and hams hung from the beams, the mine's
// own tub on its rails full of potatoes, picks and shovels for sale, the counter with its scale
// and the loading door open onto the terrace.
import { shade, rgba, mix } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, beam, flagstones, line, fillPoly, slab, pool, contact, skyFill, planks, DAY_POOL } from '../kit.ts';
import { K, counter, sack, jar, jug, ham, garlic, candle, lantern } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { ROCK, IRON, BRASS, hewn, oldScript, frogLamp, hammerPick } from './hold.ts';

const FLOOR = 198, PINE = '#6a4e32', DARK = '#4a3424';

/**
 * A rack of timber against the rock, from the floor at y up to `top`: uprights and three shelves
 * of boards. Returns the shelves' tops.
 */
function rack(ctx: CanvasRenderingContext2D, x: number, top: number, w: number, y: number, seed: number): number[] {
  const tops: number[] = [];
  for (let i = 0; i < 3; i++) { const sy = top + 14 + i * ((y - top - 14) / 3); tops.push(sy + 40); }
  for (const sy of tops) { ctx.fillStyle = rgba('#0a0608', 0.35); ctx.fillRect(x, sy - 40, w, 40); }
  for (const px of [x, x + w / 2 - 4, x + w - 8]) beam(ctx, px, top, 8, y - top, DARK, seed + px);
  for (const sy of tops) beam(ctx, x - 2, sy, w + 4, 6, PINE, seed + sy);
  return tops;
}

/** A wheel of cheese on y, its rind waxed red or left to go brown. */
function cheeseWheel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, rind: string): void {
  glossPoly(ctx, K, [x - w / 2, y, x - w / 2, y - w * 0.32, x + w / 2, y - w * 0.32, x + w / 2, y], rind, { gloss: 0.3, spread: 0.8 });
  glossEllipse(ctx, K, x, y - w * 0.32, w / 2, w * 0.12, shade(rind, 1.15), 0, { gloss: 0.2 });
}

/** Sausages hung in loops from a beam at `top`, the lowest link at about y. */
function sausages(ctx: CanvasRenderingContext2D, x: number, top: number, y: number, n: number, seed: number): void {
  for (let i = 0; i < n; i++) {
    const sx = x + i * 9, low = y - rnd(seed, i) * 14;
    line(ctx, [sx, top, sx, top + 4], '#c8b890', 1);
    const pts: number[] = [];
    for (let k = 0; k <= 6; k++) { const u = k / 6; pts.push(sx + Math.sin(u * Math.PI) * 4, top + 4 + (low - top - 4) * u); }
    line(ctx, pts, '#120c14', 6); line(ctx, pts, i % 2 ? '#8a3a24' : '#7a4a2a', 4);
    for (let k = 1; k < 4; k++) { const j = k * 2; ctx.fillStyle = '#c8b890'; ctx.fillRect(Math.round(pts[j]) - 2, Math.round(pts[j + 1]), 4, 1); }
  }
}

/** A miner's pick or shovel stood against the rock, foot on y. */
function tool(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, kind: 'pick' | 'shovel', lean = 4): void {
  const tx = x + lean, ty = y - len;
  line(ctx, [x, y, tx, ty], '#120c14', 4); line(ctx, [x, y, tx, ty], '#a08a64', 2.4);
  if (kind === 'pick') glossPoly(ctx, K, [tx - 14, ty + 6, tx - 2, ty - 3, tx + 2, ty - 3, tx + 16, ty + 4, tx + 1, ty + 2, tx - 1, ty + 2], '#7a828e', { gloss: 0.5 });
  else glossPoly(ctx, K, [x - 8, y - 2, x - 8, y - 18, x - 2, y - 22, x + 2, y - 22, x + 8, y - 18, x + 8, y - 2, x, y + 2], '#7a828e', { gloss: 0.5 });
}

/**
 * The mine's tub on its rails: a box of planks bound with iron on four small wheels, its handle at
 * the back, heaped with potatoes. The rails run across the floor at y.
 */
function tub(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  for (let i = 0; i < 12; i++) { const sx = 4 + i * 36; slab(ctx, sx, y - 2, 24, 6, shade('#5a4430', 0.9), { lit: 1, dark: 0.4 }); }
  for (const ry of [y - 1, y + 4]) { line(ctx, [0, ry, STAGE_W, ry], '#120c14', 3); line(ctx, [0, ry, STAGE_W, ry], shade(IRON, 1.6), 1.5); }
  const h = w * 0.56, top = y - 6 - h;
  contact(ctx, x, y + 2, w * 1.1, 0.5);
  for (const wx of [x - w * 0.3, x + w * 0.3]) { glossBall(ctx, K, wx, y - 4, 6, IRON, { gloss: 0.5 }); glossBall(ctx, K, wx, y - 4, 2, shade(IRON, 1.6), {}); }
  // The heap first, so the box's lip sits over it.
  for (let i = 0; i < 30; i++) { const u = rnd(721, i), px = x - w * 0.44 + u * w * 0.88, py = top + 1 - Math.sin(u * Math.PI) * 15 + rnd(722, i) * 6; glossBall(ctx, K, px, py, 4 + rnd(723, i) * 1.5, '#a07848', { gloss: 0.15 }); }
  planks(ctx, x - w / 2, top, w, h, '#7a5a3a', 3, false, 724);
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 1; ctx.strokeRect(Math.round(x - w / 2) + 0.5, Math.round(top) + 0.5, Math.round(w) - 1, Math.round(h) - 1);
  for (const bx of [x - w / 2, x + w / 2 - 5]) slab(ctx, bx, top - 1, 5, h + 2, IRON, { lit: 1 });
  slab(ctx, x - w / 2 - 1, top - 2, w + 2, 4, shade(IRON, 1.2), { lit: 1 });
  line(ctx, [x + w / 2, top + 4, x + w / 2 + 12, top - 6], '#120c14', 3.5); line(ctx, [x + w / 2, top + 4, x + w / 2 + 12, top - 6], shade(IRON, 1.4), 1.8);
}

/** The loading door onto the terrace, its leaves stood open: the terrace's stones and the sky outside. */
function loadingDoor(ctx: CanvasRenderingContext2D, s: Stage, x: number, top: number, w: number): void {
  const d = s.daylight;
  ctx.fillStyle = '#120c14'; ctx.fillRect(x - 4, top - 4, w + 8, FLOOR - top + 4);
  ctx.save(); ctx.beginPath(); ctx.rect(x, top, w, FLOOR - top); ctx.clip();
  skyFill(ctx, x, top, w, FLOOR - top, d, 725);
  fillPoly(ctx, [x, FLOOR - 40, x + w * 0.4, FLOOR - 52, x + w, FLOOR - 44, x + w, FLOOR, x, FLOOR], mix('#100c0e', '#6a7a5a', d));
  ctx.fillStyle = mix('#141012', '#9a8a70', d); ctx.fillRect(x, FLOOR - 22, w, 22);
  for (let i = 0; i < 4; i++) line(ctx, [x, FLOOR - 22 + i * 6, x + w, FLOOR - 22 + i * 6], rgba('#0a0608', 0.3), 1);
  // A barrow left on the terrace.
  glossPoly(ctx, K, [x + w * 0.5, FLOOR - 16, x + w * 0.86, FLOOR - 16, x + w * 0.8, FLOOR - 6, x + w * 0.56, FLOOR - 6], mix('#141012', '#6a4a2a', d), {});
  ctx.restore();
  // The leaves folded back against the rock, the lintel over the door with its line of script.
  for (const [lx, sd] of [[x - 20, -1], [x + w + 4, 1]] as [number, number][]) { planks(ctx, lx, top, 16, FLOOR - top, DARK, 3, true, 726 + sd); for (const hy of [top + 14, FLOOR - 22]) slab(ctx, lx, hy, 16, 3, IRON, { lit: 1 }); }
  slab(ctx, x - 8, top - 10, w + 16, 8, shade(ROCK, 1.1), { lit: 1 });
  oldScript(ctx, x + w / 2, top - 22, w, 727, 5);
  if (d > 0.15) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(x, FLOOR, x - 120, STAGE_H); g.addColorStop(0, rgba('#e8f0ff', 0.25 * d)); g.addColorStop(1, rgba('#e8f0ff', 0));
    fillPoly(ctx, [x, FLOOR, x + w, FLOOR, x + w - 30, STAGE_H, x - 110, STAGE_H], g);
    ctx.restore();
    pool(s, x + w / 2, FLOOR - 50, 200, DAY_POOL, 0.85 * d);
    pool(s, x, FLOOR + 30, 130, '#d8e0ec', 0.45 * d);
  }
}

/** The counter's scale, brass pans on a beam, foot on y. */
function scale(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  glossPoly(ctx, K, [x - h * 0.2, y, x - h * 0.14, y - h * 0.08, x + h * 0.14, y - h * 0.08, x + h * 0.2, y], DARK, {});
  line(ctx, [x, y - h * 0.08, x, y - h], '#120c14', 3.5); line(ctx, [x, y - h * 0.08, x, y - h], BRASS, 2);
  line(ctx, [x - h * 0.46, y - h * 0.9, x + h * 0.46, y - h * 0.94], '#120c14', 3.5); line(ctx, [x - h * 0.46, y - h * 0.9, x + h * 0.46, y - h * 0.94], BRASS, 1.8);
  for (const [px, py] of [[x - h * 0.46, y - h * 0.9], [x + h * 0.46, y - h * 0.94]] as [number, number][]) {
    line(ctx, [px, py, px - h * 0.12, py + h * 0.4], '#8a7a4a', 1); line(ctx, [px, py, px + h * 0.12, py + h * 0.4], '#8a7a4a', 1);
    glossPoly(ctx, K, [px - h * 0.16, py + h * 0.4, px + h * 0.16, py + h * 0.4, px + h * 0.1, py + h * 0.47, px - h * 0.1, py + h * 0.47], BRASS, { gloss: 0.7 });
  }
}

export const STORES: Scene = {
  ambient: ['#201c20', '#5a5654'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    hewn(ctx, 0, 0, STAGE_W, FLOOR, 731, ROCK);
    flagstones(ctx, FLOOR, 200, 110, '#5e5650', 7, 732);
    beam(ctx, 0, 0, STAGE_W, 14, DARK, 733);
    for (const bx of [96, 300]) beam(ctx, bx - 5, 14, 10, 8, DARK, bx);
    // Left: picks and shovels for the workings, stood against the rock, a coil of rope over them.
    tool(ctx, 18, FLOOR + 2, 96, 'pick'); tool(ctx, 40, FLOOR + 2, 104, 'shovel', 3); tool(ctx, 60, FLOOR + 2, 98, 'pick', 5); tool(ctx, 80, FLOOR + 2, 106, 'shovel', 2);
    for (let i = 0; i < 4; i++) { ctx.strokeStyle = '#120c14'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(52, 60 + i * 1.5, 13 - i * 0.8, 15 - i * 0.6, 0, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = i % 2 ? '#c8a870' : '#b89860'; ctx.lineWidth = 2.5; ctx.stroke(); }
    glossBall(ctx, K, 52, 44, 2.2, IRON, {});
    // The racks: meal in sacks, cheeses, crocks, lamp oil, candles in bundles.
    const [s0, s1, s2] = rack(ctx, 112, 26, 170, FLOOR, 734);
    for (let i = 0; i < 5; i++) cheeseWheel(ctx, 128 + i * 16, s0, 15, i % 2 ? '#a83a2a' : '#c8a050');
    for (let i = 0; i < 3; i++) jar(ctx, 214 + i * 22, s0, 16, 22, ['#8a6a4a', '#6a5a4a', '#9a7a5a'][i], '#c8b890');
    for (let i = 0; i < 4; i++) jar(ctx, 126 + i * 18, s1, 14, 24, '#5a4a3a', '#2a2020');
    for (let i = 0; i < 3; i++) jug(ctx, 210 + i * 24, s1, 22, ['#8a7a5a', '#6a5a48', '#7a6a50'][i], '#3a2a20');
    for (let i = 0; i < 4; i++) sack(ctx, 132 + i * 40, s2, 34, 34, i % 2 ? '#b8a07a' : '#c8b088', { seed: 735 + i, open: i === 1 ? '#e0d0a8' : undefined });
    // From the beams: sausage, hams and garlic.
    sausages(ctx, 120, 22, 58, 5, 736);
    ham(ctx, 196, 30, 14, 22); ham(ctx, 222, 34, 13, 22);
    garlic(ctx, 252, 30, 10, 22, 5);
    sausages(ctx, 268, 22, 56, 3, 737);
    loadingDoor(ctx, s, 312, 62, 64);
    frogLamp(ctx, s, 296, 70, 11, 150);
    lantern(ctx, s, 104, 96, 11, IRON, 14, 190);
    // The tub on its rails across the floor, and the counter at the front.
    tub(ctx, 96, 228, 74);
    counter(ctx, 214, STAGE_W + 4, 218, 10, STAGE_H + 4, '#5a4030', 738, { panels: 3, trim: BRASS });
    scale(ctx, 252, 228, 34);
    for (let i = 0; i < 3; i++) glossEllipse(ctx, K, 290 + (rnd(739, i) - 0.5) * 2, 227 - i * 2, 4.5, 1.8, '#e0b840', 0, { gloss: 0.7 });
    candle(ctx, s, 316, 228, 10, '#efe4c8', 100);
    cheeseWheel(ctx, 356, 228, 22, '#c8a050');
    hammerPick(ctx, 356, 248, 12, '#2a1a12');
  },
};
