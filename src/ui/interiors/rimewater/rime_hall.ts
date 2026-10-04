// The Lanterns' hall at Rime Lodge, their fourth: the spells shelved by tier up a tall case, the
// seventh's few on the top shelf; an iron stove; the order's banner by the window on the loch, the
// keepers' fire out on the ice; their lanterns on the pegs for the night's watch at the hole, one
// peg empty; and on the counter a rubbing of an inscription the Lanterns copy from the deep.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, beam, planks, floorboards, windowIn, line, smudge, contact, slab, pool } from '../kit.ts';
import { K, counter, books, candle, lantern, lanternRing, banner } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { drawText } from '../../../lib/engine/text.ts';
import { bookcase } from '../guilds.ts';
import { LOG, IRON, logWall, frost, loch } from './lodge.ts';

const GOLD = '#d8b050', RED = '#9a3426', DARK = '#4a3a2c', WALNUT = '#5a3e2a';
const FLOOR = 200;
/** The seventh tier's bindings: new, pale, gilt. */
const NEW = ['#e8e4d8', '#c8d8e4', '#e0d0b0', '#b8c8d8'];

/**
 * The case the spells are shelved in, by tier: seven shelves from the first at the foot to the
 * seventh at the top, a brass plate at each shelf's end with its number, and only a few books on
 * the top one, new and pale. From the floor at y up to `top`.
 */
function tierCase(ctx: CanvasRenderingContext2D, x: number, top: number, w: number, y: number): void {
  bookcase(ctx, x, top, w, y, WALNUT, 3, 7);
  const sh = (y - top - 14) / 7, inner = x + 4, iw = w - 8;
  // The top shelf cleared to its few.
  const sy = top + 10 + sh;
  ctx.fillStyle = '#1a1210'; ctx.fillRect(inner, sy - sh + 3, iw, sh - 3);
  books(ctx, inner + iw * 0.36, sy, iw * 0.3, sh - 5, 31, NEW);
  beam(ctx, x + 2, sy, w - 4, 4, WALNUT, 3);
  for (let i = 0; i < 7; i++) {
    const py = Math.round(top + 10 + (i + 1) * sh - sh / 2 - 5);
    slab(ctx, x - 4, py, 11, 11, shade(GOLD, 0.9), { lit: 1, dark: 0.25 });
    drawText(ctx, String(7 - i), x + 2, py + 2, { size: 1, color: '#3a2410', align: 'center', shadow: false });
  }
}

/** The stove: an iron drum on legs, its door's grate glowing, the flue going up through the roof. Foot on y. */
function stove(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, w: number): void {
  const h = w * 1.25, top = y - h;
  contact(ctx, x, y, w * 1.4, 0.5);
  line(ctx, [x, top - 6, x, 0], '#120c14', 9); line(ctx, [x, top - 6, x, 0], IRON, 7);
  ctx.fillStyle = rgba('#ffffff', 0.12); ctx.fillRect(Math.round(x - 3), 0, 1, top - 6);
  for (const sd of [-1, 1]) line(ctx, [x + sd * w * 0.36, y - 8, x + sd * w * 0.44, y], '#120c14', 3);
  glossPoly(ctx, K, [x - w / 2, y - 8, x - w * 0.5, top + 8, x - w * 0.36, top, x + w * 0.36, top, x + w * 0.5, top + 8, x + w / 2, y - 8], IRON, { gloss: 0.45, spread: 0.7 });
  for (const f of [0.18, 0.8]) { ctx.fillStyle = shade(IRON, 1.4); ctx.fillRect(Math.round(x - w / 2), Math.round(top + h * f), Math.round(w), 2); }
  glossEllipse(ctx, K, x, top, w * 0.36, 3, shade(IRON, 1.2), 0, { gloss: 0.5 });
  const gx = x - w * 0.24, gy = top + h * 0.38, gw = w * 0.48, gh = h * 0.3;
  ctx.fillStyle = '#1a1014'; ctx.fillRect(gx, gy, gw, gh);
  for (let i = 0; i < 4; i++) { ctx.fillStyle = i % 2 ? '#ff8a30' : '#ffc060'; ctx.fillRect(Math.round(gx + 2 + i * gw / 4), Math.round(gy + gh * 0.35), Math.max(1, Math.round(gw / 8)), Math.round(gh * 0.55)); }
  for (let i = 1; i < 4; i++) { ctx.fillStyle = '#120c14'; ctx.fillRect(Math.round(gx), Math.round(gy + i * gh / 4), Math.round(gw), 1); }
  s.lights.push({ k: 'glow', x, y: gy + gh * 0.6, r: w * 0.8, color: '#ff9040', a: 0.45 });
  pool(s, x, gy + gh, 150, '#ff9a48', 0.65);
}

/** A keeper's lantern, cold, hung on a peg by its ring: brass cap, smoked glass, a dish under. Ring at (x, y). */
function coldLantern(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  const w = size, gy = y + size * 0.55, gy1 = gy + size;
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y + 1, size * 0.18, 0, Math.PI * 2); ctx.stroke();
  glossPoly(ctx, K, [x - w * 0.62, gy, x - w * 0.25, y + size * 0.15, x + w * 0.25, y + size * 0.15, x + w * 0.62, gy], GOLD, { gloss: 0.5, spread: 0.7 });
  glossPoly(ctx, K, [x - w * 0.46, gy, x - w * 0.46, gy1, x + w * 0.46, gy1, x + w * 0.46, gy], '#4a5250', { gloss: 0.8, spread: 0.6 });
  line(ctx, [x, gy + 1, x, gy1 - 1], shade(GOLD, 0.7), 1);
  glossPoly(ctx, K, [x - w * 0.62, gy1, x + w * 0.62, gy1, x + w * 0.4, gy1 + size * 0.28, x - w * 0.4, gy1 + size * 0.28], GOLD, { gloss: 0.5, spread: 0.7 });
}

/**
 * A rubbing taken off an inscription in the deep, pinned to the counter's back: charcoal over the
 * paper, and the marks standing pale out of it, square-cut and in rows. Into (x, y, w, h).
 */
function rubbing(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  glossPoly(ctx, K, [x, y + 2, x + w, y, x + w + 1, y + h, x + 1, y + h + 1], '#e4dcc8', {});
  ctx.fillStyle = rgba('#2a2626', 0.75); ctx.fillRect(x + 3, y + 3, w - 5, h - 5);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) {
    const mx = x + 6 + c * (w - 10) / 5, my = y + 6 + r * (h - 10) / 4, k = rnd(451, r, c);
    const m = k < 0.33 ? [mx, my, mx + 3, my, mx + 3, my + 4] : k < 0.66 ? [mx, my + 4, mx, my, mx + 3, my + 2] : [mx, my, mx + 3, my + 4, mx, my + 4];
    line(ctx, m, rgba('#e8e0d0', 0.85), 1);
  }
  for (const px of [x + 3, x + w - 3]) glossBall(ctx, K, px, y + 3, 1.5, '#8a8478', {});
}

export const RIME_HALL: Scene = {
  ambient: ['#24263a', '#8a90a0'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    logWall(ctx, 0, 22, STAGE_W, FLOOR - 22, 12, 461);
    floorboards(ctx, FLOOR, 210, 110, '#6e5640', 8, 462);
    planks(ctx, 0, 0, STAGE_W, 12, shade(DARK, 0.8), 1, false, 463);
    beam(ctx, 0, 10, STAGE_W, 13, DARK, 464);
    // The stove on the left, a basket of birch by it.
    stove(ctx, s, 52, FLOOR + 6, 44);
    contact(ctx, 96, FLOOR + 10, 30);
    glossPoly(ctx, K, [82, FLOOR + 10, 80, FLOOR - 10, 112, FLOOR - 10, 110, FLOOR + 10], '#8a6a42', { gloss: 0.1, spread: 0.8 });
    for (let i = 0; i < 5; i++) { const by = FLOOR - 12 - (i % 2) * 4, bx = 84 + i * 5; line(ctx, [bx, by, bx + 3, by - 14], '#120c14', 5); line(ctx, [bx, by, bx + 3, by - 14], '#e8e4dc', 3); line(ctx, [bx - 1, by - 4, bx + 1, by - 7], '#2a2a2a', 1); }
    // The spells, shelved by tier.
    tierCase(ctx, 120, 34, 124, FLOOR + 4);
    // The order's banner, and the window on the loch with the keepers' fire out on the ice.
    banner(ctx, 252, 34, 34, 92, RED, { trim: GOLD, tail: 'swallow', emblem: (cx, cy, r) => lanternRing(ctx, cx, cy, r, GOLD) });
    const wx = 294, wy = 46, ww = 58, wh = 92;
    windowIn(ctx, s, wx, wy, ww, wh, shade(LOG, 0.8), { panes: [2, 3], view: (c) => { loch(wx, wy, ww, wh, s, { at: 0.42, shore: 0.4, seed: 465, near: 0.42 })(c); frost(c, wx, wy, ww, wh, 466, 0.7); } });
    // The keepers' lanterns on their pegs, cold till dark; one peg empty, its keeper out at the hole.
    beam(ctx, 360, 58, 40, 5, DARK, 467);
    for (let i = 0; i < 4; i++) { const lx = 366 + i * 10; ctx.fillStyle = '#2a2020'; ctx.fillRect(lx - 1, 62, 2, 4); if (i !== 2) coldLantern(ctx, lx, 66, 6); }
    // The hall's own lamp from the beam.
    lantern(ctx, s, 200, 24, 10, GOLD, 10, s.daylight > 0.5 ? 140 : 220);
    s.lights.push({ k: 'motes', x: 130, y: 40, w: 110, h: 120, color: '#e8f0ff', n: 12, rise: 0.08 });
    // The counter across the front on the right: the spellbook open, the rubbing, ink and a candle.
    counter(ctx, 236, STAGE_W + 4, 214, 10, STAGE_H, WALNUT, 468, { panels: 2, trim: GOLD });
    glossPoly(ctx, K, [262, 222, 266, 214, 290, 213, 292, 222], '#f0e8d4', {});
    glossPoly(ctx, K, [292, 222, 292, 213, 316, 214, 320, 222], '#e8e0c8', {});
    for (let i = 0; i < 3; i++) { line(ctx, [268, 215 + i * 2.5, 288, 215 + i * 2.5], rgba('#3a2a30', 0.55), 1); line(ctx, [296, 215 + i * 2.5, 314, 215 + i * 2.5], rgba('#3a2a30', 0.55), 1); }
    lanternRing(ctx, 278, 219, 2, GOLD);
    rubbing(ctx, 330, 196, 30, 24);
    glossPoly(ctx, K, [370, 223, 369, 216, 379, 216, 378, 223], '#2a2a3a', { gloss: 0.6 });
    line(ctx, [374, 216, 382, 202], '#e8e0d0', 2);
    candle(ctx, s, 250, 222, 12, '#efe4c8', s.daylight > 0.5 ? 90 : 160);
    smudge(ctx, 52, FLOOR + 20, 70, '#ff9a48', 0.15);
  },
};
