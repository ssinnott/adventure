// The Cartographers' Guild's second hall, at Cinderport: the far side as the Guild has it pinned to
// the limewash, the coast inked and the land behind it blank where the ink stops; the Meridian
// journals' shelf, three in their matching bindings and a gap for the fourth before the stone that
// holds them up; the charts rolled in their pigeonholes, and one spread on the table under weights
// of basalt with the dividers and the rule.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, beam, plaster, floorboards, line, fillPoly, slab, contact } from '../kit.ts';
import { K, counter, shelf, candle, lantern } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { WASH, TIMBER, IRON, SLIP, BASALT, basaltWall, ashDust } from './basalt.ts';

const FLOOR = 196, DADO = 124, PARCH = '#dccca4', INK = '#3a2a20', JOURNAL = '#2e4a3a', BRASS = '#c9a34a';

/**
 * The far side pinned to the wall at (x, y), w by h: the coast inked down the right with the Sound
 * hatched beyond it, the Sheer's cliffs hachured across the top, the mountain's cone with its smoke,
 * the road dotted west from the port to where the ink stops and the land behind left blank; a pin
 * at each camp and a rose in the corner.
 */
function farSide(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  const at = (u: number, v: number): [number, number] => [x + u * w, y + v * h];
  glossPoly(ctx, K, [x, y, x + w, y + 1, x + w - 1, y + h, x + 1, y + h - 1], PARCH, { gloss: 0.05, spread: 0.9 });
  ctx.strokeStyle = rgba('#8a6a40', 0.35); ctx.lineWidth = 3; ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
  const coast = [[0.76, 0.03], [0.72, 0.16], [0.78, 0.28], [0.69, 0.42], [0.72, 0.55], [0.63, 0.66], [0.67, 0.8], [0.6, 0.97]].flatMap(([u, v]) => at(u, v));
  for (let i = 0; i < 11; i++) { const v = 0.08 + i * 0.08, [cx] = at(0.8 - (i % 3) * 0.04, v); for (let k = 0; k < 3; k++) { const [lx, ly] = [cx + 4 + k * 9 + (i % 2) * 4, y + v * h]; if (lx < x + w - 6) line(ctx, [lx, ly, lx + 5, ly], rgba(INK, 0.45), 1); } }
  line(ctx, coast, INK, 1.4);
  const sheer = [[0.08, 0.1], [0.3, 0.07], [0.52, 0.12], [0.72, 0.1]].flatMap(([u, v]) => at(u, v));
  line(ctx, sheer, INK, 1.2);
  for (let i = 0; i < 16; i++) { const u = 0.1 + i * 0.038, [hx, hy] = at(u, 0.09 + Math.sin(i) * 0.012); line(ctx, [hx, hy + 1, hx - 1, hy + 5], rgba(INK, 0.7), 1); }
  const [mx, my] = at(0.44, 0.6);
  line(ctx, [mx - 10, my + 7, mx - 2, my - 6, mx + 2, my - 6, mx + 10, my + 7], INK, 1.3);
  line(ctx, [mx, my - 8, mx + 2, my - 12, mx - 1, my - 15, mx + 2, my - 19], rgba(INK, 0.6), 1);
  ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(mx - 16, my + 12, 3, 0, Math.PI * 2); ctx.stroke();
  const [tx, ty] = at(0.69, 0.42);
  ctx.fillStyle = INK; ctx.fillRect(Math.round(tx) - 4, Math.round(ty) - 2, 4, 4);
  for (let i = 0; i < 12; i++) { const u = 0.67 - i * 0.04, [rx, ry] = at(u, 0.42 + Math.sin(i * 0.8) * 0.03 + i * 0.008); ctx.fillRect(Math.round(rx), Math.round(ry), 2, 1); }
  for (const [u, v] of [[0.6, 0.18], [0.3, 0.46], [0.5, 0.82]]) { const [px, py] = at(u, v); glossBall(ctx, K, px, py, 2.2, SLIP, { gloss: 0.7 }); }
  const [ox, oy] = at(0.14, 0.8);
  ctx.strokeStyle = rgba(INK, 0.8); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(ox, oy, 7, 0, Math.PI * 2); ctx.stroke();
  line(ctx, [ox, oy - 11, ox, oy + 11], INK, 1); line(ctx, [ox - 11, oy, ox + 11, oy], INK, 1);
  fillPoly(ctx, [ox - 2, oy - 2, ox, oy - 11, ox + 2, oy - 2], INK);
  for (const [u, v] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const [nx, ny] = at(u * 0.96 + 0.02, v * 0.94 + 0.03); glossBall(ctx, K, nx, ny, 1.8, IRON, { gloss: 0.6 }); }
}

/** A journal of the Meridian Company stood on the shelf at y: tall, in the green calf they were all bound in, two raised bands and brass at the corners. */
function journal(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  slab(ctx, x, y - h, w, h, JOURNAL, { lit: 2, dark: 0.3, outline: true });
  for (const f of [0.25, 0.7]) line(ctx, [x + 1, y - h * f, x + w - 1, y - h * f], shade(JOURNAL, 0.6), 2);
  for (const f of [0.25, 0.7]) line(ctx, [x + 1, y - h * f - 1.5, x + w - 1, y - h * f - 1.5], rgba(shade(JOURNAL, 1.6), 0.6), 1);
  for (const cy of [y - h + 1, y - 3]) { ctx.fillStyle = BRASS; ctx.fillRect(Math.round(x + 1), Math.round(cy), 2, 2); ctx.fillRect(Math.round(x + w - 3), Math.round(cy), 2, 2); }
}

/** The pigeonholes of rolled charts, the floor at y: a tall case from x across w to `top`, a roll seen end on in each hole, tied with its tape. */
function chartRack(ctx: CanvasRenderingContext2D, x: number, top: number, w: number, y: number): void {
  slab(ctx, x, top, w, y - top, shade(TIMBER, 0.75), { lit: 2, dark: 0.1, outline: true });
  const cols = 3, rows = 7, cw = (w - 6) / cols, ch = (y - top - 16) / rows;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const cx = x + 3 + c * cw, cy = top + 4 + r * ch;
    ctx.fillStyle = '#1a1214'; ctx.fillRect(Math.round(cx + 1), Math.round(cy + 1), Math.round(cw - 2), Math.round(ch - 2));
    if ((r * 3 + c) % 5 === 3) continue;
    const n = 1 + ((r + c) % 3);
    for (let k = 0; k < n; k++) {
      const rx = cx + cw * (0.3 + k * 0.22), ry = cy + ch * 0.62, rr = Math.min(cw, ch) * 0.2;
      glossBall(ctx, K, rx, ry, rr, shade(PARCH, 0.9 + k * 0.05), { gloss: 0.2 });
      ctx.strokeStyle = rgba('#8a6a40', 0.7); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(rx, ry, rr * 0.45, 0, Math.PI * 1.6); ctx.stroke();
      if (k === 0) line(ctx, [rx - rr, ry - rr * 0.2, rx + rr, ry + rr * 0.2], SLIP, 1);
    }
  }
  slab(ctx, x - 2, y - 8, w + 4, 8, shade(TIMBER, 0.9));
}

export const CINDERPORT_CARTOGRAPHERS: Scene = {
  ambient: ['#262634', '#8c8a8e'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    plaster(ctx, 0, 0, STAGE_W, DADO, WASH, 601);
    basaltWall(ctx, 0, DADO, STAGE_W, FLOOR - DADO, 4, 602);
    slab(ctx, 0, DADO - 3, STAGE_W, 5, shade(WASH, 0.7), { lit: 1, dark: 0.25 });
    ashDust(ctx, 0, FLOOR - 20, STAGE_W, 20, 603, 0.25);
    floorboards(ctx, FLOOR, 200, 110, '#6e5640', 8, 604);
    beam(ctx, 0, 0, STAGE_W, 14, TIMBER, 605);
    // The far side on the wall.
    farSide(ctx, 18, 26, 188, 92);
    // The journals' shelf: three, the gap for the fourth, and the stone that holds them up.
    shelf(ctx, 222, 88, 96, TIMBER);
    for (let i = 0; i < 3; i++) journal(ctx, 230 + i * 13, 88, 12, 34);
    glossPoly(ctx, K, [284, 88, 283, 72, 290, 66, 300, 68, 304, 78, 303, 88], BASALT, { gloss: 0.3, tex: 'stipple', seed: 606, amount: 0.5 });
    // The charts in their pigeonholes.
    chartRack(ctx, 332, 34, 62, FLOOR + 6);
    // The table: a chart spread under the weights, the dividers and the rule, the lamp.
    counter(ctx, 30, 300, 206, 16, STAGE_H, '#6a5038', 607, { panels: 3, trim: BRASS });
    glossPoly(ctx, K, [70, 208, 234, 207, 246, 221, 60, 222], PARCH, { gloss: 0.05, spread: 0.9 });
    line(ctx, [92, 214, 120, 211, 150, 216, 182, 212, 214, 215], rgba(INK, 0.7), 1);
    for (const [wx, wy] of [[70, 209], [232, 208], [244, 220], [62, 221]] as [number, number][]) glossEllipse(ctx, K, wx, wy - 1, 5, 3, BASALT, 0, { gloss: 0.4 });
    line(ctx, [150, 210, 140, 219], '#120c14', 2.5); line(ctx, [150, 210, 140, 219], '#a8aab0', 1.2);
    line(ctx, [150, 210, 164, 218], '#120c14', 2.5); line(ctx, [150, 210, 164, 218], '#a8aab0', 1.2);
    glossBall(ctx, K, 150, 210, 1.8, BRASS, {});
    glossPoly(ctx, K, [176, 219, 226, 216, 227, 218, 177, 221], '#b89a6a', { gloss: 0.3 });
    candle(ctx, s, 270, 214, 12, '#efe4c8', s.daylight > 0.5 ? 90 : 150);
    lantern(ctx, s, 214, 128, 9, IRON, 14, s.daylight > 0.5 ? 120 : 220);
    contact(ctx, 363, FLOOR + 6, 66, 0.4);
  },
};
