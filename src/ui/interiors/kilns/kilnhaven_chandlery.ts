// Kilnhaven's chandlery, a chandler's in the old sense: candles hung in pairs by their wicks from
// the rods, lamps of every make hung over the counter, the ships' and the miners' frog lamps among
// them, the oil cask on its cradle with the copper measures by it, jars of oil and boxes of wick on
// the shelves, provisions for the road and the sea and the street through a dusty window.
import { shade, rgba, mix } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, beam, planks, floorboards, windowIn, skyFill, line, fillPoly, slab, contact } from '../kit.ts';
import { K, counter, shelf, lantern, candle, barrel, sack, jar, bottle, kegEnd } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { TAR, IRON, oreDust } from './port.ts';
import { frogLamp } from './hold.ts';

const FLOOR = 204, PINE = '#7a5e42', COPPER = '#b86a3a', BRASS = '#c8a048', WAX = '#efe4c8', TALLOW = '#e4d6a8';

/** A pair of dipped candles hung over a rod by their joined wick, the rod at (x, y), `len` long. */
function candlePair(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, wax: string): void {
  ctx.strokeStyle = '#3a3028'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y + 1, 2.5, Math.PI, 0); ctx.stroke();
  for (const dx of [-2.5, 2.5]) {
    line(ctx, [x + dx, y + 1, x + dx, y + 3], '#3a3028', 1);
    glossPoly(ctx, K, [x + dx - 1.2, y + 3, x + dx + 1.2, y + 3, x + dx + 1.8, y + 3 + len, x + dx - 1.8, y + 3 + len], wax, { gloss: 0.25 });
  }
}

/** A lantern for sale, unlit, hung on its ring from `top`: horn or glass dark in its cage. Its ring at (x, y). */
function darkLantern(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, metal: string, top: number, round = false): void {
  line(ctx, [x, top, x, y], '#120c14', 1.5);
  const w = size, h = size * 1.3, gy = y + size * 0.5;
  glossPoly(ctx, K, [x - w * 0.6, gy, x - w * 0.24, y + size * 0.12, x + w * 0.24, y + size * 0.12, x + w * 0.6, gy], metal, { gloss: 0.5 });
  if (round) glossEllipse(ctx, K, x, gy + h * 0.38, w * 0.5, h * 0.4, mix('#5a5440', '#c8c0a0', 0.3), 0, { gloss: 0.7 });
  else { ctx.fillStyle = mix('#4a4434', '#a8a088', 0.35); ctx.fillRect(x - w * 0.44, gy, w * 0.88, h * 0.72); ctx.fillStyle = shade(metal, 0.8); for (const bx of [x - w * 0.44, x - 0.5, x + w * 0.44 - 1]) ctx.fillRect(Math.round(bx), Math.round(gy), 1, Math.round(h * 0.72)); ctx.strokeStyle = '#120c14'; ctx.lineWidth = 1; ctx.strokeRect(Math.round(x - w * 0.44) + 0.5, Math.round(gy) + 0.5, Math.round(w * 0.88), Math.round(h * 0.72)); }
  glossPoly(ctx, K, [x - w * 0.6, gy + h * 0.76, x + w * 0.6, gy + h * 0.76, x + w * 0.4, gy + h * 0.94, x - w * 0.4, gy + h * 0.94], metal, { gloss: 0.5 });
}

/** The oil cask on its cradle, its brass tap over a drip tray, the copper measures hung on the wall beside it. Foot on y. */
function oilCask(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  for (const sd of [-1, 1]) { line(ctx, [x + sd * r * 0.9, y, x + sd * r * 0.5, y - r * 0.9], '#120c14', 5); line(ctx, [x + sd * r * 0.9, y, x + sd * r * 0.5, y - r * 0.9], PINE, 3); }
  contact(ctx, x, y + 2, r * 2.2, 0.45);
  kegEnd(ctx, x, y - r * 1.15, r, '#6a4a30', IRON, BRASS);
  glossEllipse(ctx, K, x, y - 4, r * 0.5, 3, '#3a3a40', 0, { gloss: 0.5 });
  ctx.beginPath(); ctx.ellipse(x, y - 4.5, r * 0.38, 1.8, 0, 0, Math.PI * 2); ctx.fillStyle = '#c8a050'; ctx.fill();
  // The measures, a gill to a gallon, on their hooks.
  for (let i = 0; i < 4; i++) {
    const mx = x + r * 1.5 + i * 11, my = y - r * 2.2 + i * 2, mh = 7 + i * 2.5;
    glossBall(ctx, K, mx, my - 2, 1.2, IRON, {});
    glossPoly(ctx, K, [mx - mh * 0.35, my + mh, mx - mh * 0.28, my, mx + mh * 0.28, my, mx + mh * 0.35, my + mh], COPPER, { gloss: 0.7, spread: 0.6 });
    line(ctx, [mx + mh * 0.3, my + 2, mx + mh * 0.55, my + mh * 0.5, mx + mh * 0.33, my + mh * 0.8], '#120c14', 1.5);
  }
}

/** The street through the window: a wall of the port opposite, red with the ore, a lamp on it lit by night. */
function street(x: number, y: number, w: number, h: number, daylight: number) {
  return (ctx: CanvasRenderingContext2D): void => {
    const d = daylight;
    skyFill(ctx, x, y, w, h, d, 921);
    ctx.fillStyle = mix('#14121a', '#7a7470', d); ctx.fillRect(x, y + h * 0.3, w, h * 0.7);
    for (let r = 0; r < 6; r++) for (let i = 0; i < 6; i++) { ctx.fillStyle = shade(mix('#14121a', '#7a7470', d), 0.85 + rnd(922, r, i) * 0.3); ctx.fillRect(Math.round(x + (i + (r % 2) * 0.5) * (w / 5)), Math.round(y + h * 0.32 + r * h * 0.1), Math.round(w / 6), Math.round(h * 0.08)); }
    oreDust(ctx, x, y + h * 0.6, w, h * 0.4, 923, 0.5 * d + 0.1);
    fillPoly(ctx, [x, y + h * 0.3, x + w * 0.5, y + h * 0.12, x + w, y + h * 0.3], mix('#0e0c12', '#4a3a32', d));
    if (d < 0.5) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; smudgeLamp(ctx, x + w * 0.7, y + h * 0.45, h * 0.25, 1 - d * 2); ctx.restore(); }
  };
}

/** A lamp's glow on a wall outside, and its flame a point. */
function smudgeLamp(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, a: number): void {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba('#ffc070', 0.8 * a)); g.addColorStop(1, rgba('#ffc070', 0));
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.fillStyle = rgba('#fff0c0', a); ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
}

export const CHANDLERY: Scene = {
  ambient: ['#28262c', '#8a8682'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    planks(ctx, 0, 0, STAGE_W, FLOOR, PINE, 20, true, 924);
    oreDust(ctx, 0, FLOOR - 40, STAGE_W, 40, 925, 0.35);
    floorboards(ctx, FLOOR, 200, 100, '#7a6450', 9, 926);
    oreDust(ctx, 0, FLOOR, STAGE_W, STAGE_H - FLOOR, 927, 0.28);
    beam(ctx, 0, 0, STAGE_W, 12, TAR, 928);
    // The window on the street, its sill red with the dust that comes in under it.
    windowIn(ctx, s, 26, 56, 82, 76, TAR, { panes: [3, 3], view: street(26, 56, 82, 76, s.daylight) });
    oreDust(ctx, 18, 136, 98, 5, 929, 0.7);
    // The shelves: oil in jars and bottles, boxes of wick, tallow in blocks, provisions in crocks.
    shelf(ctx, 140, 118, 250, TAR);
    for (let i = 0; i < 6; i++) jar(ctx, 152 + i * 18, 118, 14, 20, ['#7a5a3a', '#5a4a3a', '#8a6a4a'][i % 3], '#c8b890');
    for (let i = 0; i < 6; i++) bottle(ctx, 266 + i * 19, 118, 17 + rnd(930, i) * 5, ['#3a4a3a', '#6a5a2a', '#4a3a2a'][i % 3], { squat: i % 2 === 0, label: i % 3 === 1 ? '#e8dcc0' : undefined });
    shelf(ctx, 140, 164, 176, TAR);
    for (let i = 0; i < 4; i++) slab(ctx, 148 + i * 26, 150, 22, 14, ['#8a6a3a', '#6a5a3a', '#7a5a34', '#5a4a30'][i], { lit: 1, dark: 0.3 });
    for (let i = 0; i < 5; i++) slab(ctx, 256 + i * 11, 156 - (i % 2) * 2, 9, 8 + (i % 2) * 2, TALLOW, { lit: 1, dark: 0.3 });
    // Overhead, the rods: candles in pairs by their wicks, lamps of every make, none lit for sale.
    for (const hx of [126, 394]) { line(ctx, [hx, 12, hx, 27], '#120c14', 3); line(ctx, [hx, 12, hx, 27], IRON, 1.5); }
    line(ctx, [120, 26, STAGE_W, 26], '#120c14', 4); line(ctx, [120, 26, STAGE_W, 26], shade(PINE, 0.8), 2);
    for (let i = 0; i < 18; i++) candlePair(ctx, 130 + i * 15, 26, 22 + (i % 3) * 4, i % 4 === 1 ? TALLOW : WAX);
    darkLantern(ctx, 150, 62, 12, BRASS, 12);
    frogLamp(ctx, s, 184, 58, 11, 0, BRASS, false);
    darkLantern(ctx, 222, 66, 10, IRON, 12, true);
    frogLamp(ctx, s, 254, 60, 10, 0, '#8a8a92', false);
    lantern(ctx, s, 292, 64, 13, '#6a4a2a', 12, 180, '#ffe0a0');
    frogLamp(ctx, s, 330, 58, 11, 0, BRASS, false);
    darkLantern(ctx, 364, 62, 11, BRASS, 12, true);
    // The oil cask at the back corner and its measures.
    oilCask(ctx, 352, FLOOR, 22);
    // The counter, the lamp the chandler keeps lit on it, the funnel, the day-book, a candle.
    counter(ctx, -4, 300, 214, 10, STAGE_H + 4, '#5a4432', 931, { panels: 3, trim: BRASS });
    lantern(ctx, s, 120, 196, 13, BRASS, null, 200, '#ffe8b0');
    glossPoly(ctx, K, [52, 214, 47, 206, 69, 206, 64, 214], COPPER, { gloss: 0.7 });
    glossPoly(ctx, K, [56, 216, 60, 216, 59, 222, 57, 222], COPPER, { gloss: 0.7 });
    glossPoly(ctx, K, [176, 223, 180, 216, 222, 216, 226, 223], '#2a3a3a', {});
    glossPoly(ctx, K, [180, 221, 183, 216, 202, 216, 202, 221], '#ece4cc', {});
    glossPoly(ctx, K, [203, 221, 203, 216, 220, 216, 223, 221], '#e4dcc4', {});
    candle(ctx, s, 252, 224, 12, WAX, 100);
    for (let i = 0; i < 3; i++) glossEllipse(ctx, K, 276 + i * 2, 222 - i * 2, 4.5, 1.8, '#e0b840', 0, { gloss: 0.7 });
    // Provisions on the floor in front: a barrel of salt fish, sacks of hard tack.
    barrel(ctx, 342, STAGE_H + 4, 44, 50, '#6a4a30', IRON, 932);
    for (let i = 0; i < 5; i++) glossPoly(ctx, K, [326 + i * 7, STAGE_H - 46, 332 + i * 7, STAGE_H - 52, 338 + i * 7, STAGE_H - 46, 332 + i * 7, STAGE_H - 44], '#a8b0b0', { gloss: 0.7 });
    sack(ctx, 384, STAGE_H + 4, 30, 40, '#c0a87a', { seed: 933 });
  },
};
