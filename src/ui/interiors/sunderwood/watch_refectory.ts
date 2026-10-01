// The refectory in Lantern Watch, where the tower eats and travellers sleep: one long table and its
// benches, the hearth with the pot on, the reader's lectern at the table's head, cots under the
// windows on the wood, and moths on the glass.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, stones, beam, planks, flagstones, windowIn, forestFill, line, fillPoly, path, ink, smudge, contact, slab } from '../kit.ts';
import { K, loaf, cup, jug, candle, hearth, shelf, plate, jar } from '../props.ts';
import { glossPoly, glossEllipse } from '../../monsters/gloss.ts';
import { lectern } from '../guilds.ts';

const GREY = '#7a766c', OAK = '#5a4230', BOARD = '#8a6a48', WOOL = '#6a6858';
const FLOOR = 186;

/** A moth at rest on the glass, wings spread, pale as ash. */
function moth(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, a: number): void {
  ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  for (const sd of [-1, 1]) {
    fillPoly(ctx, [0, -r * 0.2, sd * r, -r * 0.7, sd * r * 1.1, r * 0.1, 0, r * 0.3], '#d8d0b8');
    fillPoly(ctx, [0, r * 0.2, sd * r * 0.7, r * 0.5, sd * r * 0.3, r * 0.9, 0, r * 0.6], '#b8b098');
  }
  ctx.fillStyle = '#5a5040'; ctx.fillRect(-0.5, -r * 0.4, 1, r);
  ctx.restore();
}

/** A traveller's cot against the wall: a low frame, a straw tick, a grey blanket folded back, foot on y. */
function cot(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, seed: number): void {
  contact(ctx, x + w / 2, y, w, 0.35);
  for (const lx of [x + 2, x + w - 7]) slab(ctx, lx, y - 14, 5, 14, shade(OAK, 0.8), { lit: 1 });
  slab(ctx, x, y - 18, w, 6, OAK, { lit: 1 });
  glossPoly(ctx, K, [x + 2, y - 18, x + 4, y - 24, x + w - 4, y - 24, x + w - 2, y - 18], '#c8b480', { gloss: 0.1 });
  const fold = x + w * (0.45 + rnd(seed) * 0.15);
  glossPoly(ctx, K, [fold, y - 17, fold + 2, y - 26, x + w - 3, y - 26, x + w - 1, y - 17], WOOL, { gloss: 0.1, tex: 'stipple', seed, amount: 0.3 });
  line(ctx, [fold + 6, y - 25, x + w - 6, y - 25], shade(WOOL, 1.3), 1);
  line(ctx, [fold + 6, y - 21, x + w - 6, y - 21], '#8a3a2a', 1.5);
  glossEllipse(ctx, K, x + 12, y - 25, 9, 4, '#d8ccaa', 0, { gloss: 0.1 });
}

/** The refectory's table, long and scarred: its top from y back to y - d, trestles to the floor. */
function longTable(ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number, d: number, foot: number): void {
  for (const lx of [x0 + 20, (x0 + x1) / 2 - 4, x1 - 28]) { slab(ctx, lx, y + 6, 8, foot - y - 6, shade(OAK, 0.75), { lit: 1, dark: 0.3 }); line(ctx, [lx - 8, foot - 10, lx + 16, foot - 10], '#120c14', 3); }
  slab(ctx, x0, y, x1 - x0, 7, shade(BOARD, 0.75), { lit: 1, dark: 0.35 });
  const top = [x0, y, x0 + d, y - d, x1 - d, y - d, x1, y];
  fillPoly(ctx, top, shade(BOARD, 1.15));
  ctx.save(); path(ctx, top); ctx.clip();
  for (let i = 1; i < 3; i++) { const t = i / 3; line(ctx, [x0 + d * t, y - d * t, x1 - d * t, y - d * t], rgba(shade(BOARD, 0.7), 0.7), 1); }
  // Knife scars and rings from four hundred years of bowls.
  for (let i = 0; i < 16; i++) { const sx = x0 + 20 + rnd(71, i) * (x1 - x0 - 40), sy = y - 2 - rnd(72, i) * (d - 4); line(ctx, [sx, sy, sx + 4 + rnd(73, i) * 6, sy - 1], rgba('#3a2414', 0.4), 1); }
  for (let i = 0; i < 6; i++) { ctx.strokeStyle = rgba('#3a2414', 0.25); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x0 + 30 + rnd(74, i) * (x1 - x0 - 60), y - d * 0.5, 5, 2, 0, 0, Math.PI * 2); ctx.stroke(); }
  ctx.restore();
  path(ctx, top); ink(ctx);
}

/** A bench along the table's near side, seat at y, its legs to the bottom of the stage. */
function bench(ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number): void {
  for (const lx of [x0 + 10, x1 - 18]) slab(ctx, lx, y + 4, 7, STAGE_H - y, shade(OAK, 0.7), { lit: 1 });
  beam(ctx, x0, y, x1 - x0, 7, BOARD, 75);
}

/** The pot: a black iron cauldron on its three feet, steam off the top. Foot on y. */
function pot(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, r: number): void {
  for (const fx of [-0.6, 0, 0.6]) line(ctx, [x + fx * r, y - r * 0.3, x + fx * r * 1.1, y], '#120c14', 2.5);
  glossEllipse(ctx, K, x, y - r * 0.8, r, r * 0.75, '#2e2a30', 0, { gloss: 0.5, spread: 0.7 });
  glossEllipse(ctx, K, x, y - r * 1.45, r * 0.85, r * 0.2, '#6a4a2a', 0, {});
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y - r * 1.45, r * 0.9, Math.PI, 0); ctx.stroke();
  s.lights.push({ k: 'motes', x: x - r * 0.6, y: y - r * 4, w: r * 1.2, h: r * 2.4, color: '#e8e4dc', n: 6, rise: 0.25 });
}

export const REFECTORY: Scene = {
  ambient: ['#2c2830', '#8e8a88'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    // Old tower stone, the vault's beams low overhead.
    stones(ctx, 0, 0, STAGE_W, FLOOR, GREY, 12, 81);
    const soot = ctx.createLinearGradient(0, 0, 0, 70);
    soot.addColorStop(0, rgba('#120a06', 0.55)); soot.addColorStop(1, rgba('#120a06', 0));
    ctx.fillStyle = soot; ctx.fillRect(0, 0, STAGE_W, 70);
    flagstones(ctx, FLOOR, 200, 90, '#6e6a60', 7, 82);
    planks(ctx, 0, 0, STAGE_W, 14, shade(OAK, 0.7), 1, false, 83);
    beam(ctx, 0, 14, STAGE_W, 10, OAK, 84);
    // The windows on the wood, moths on the glass whatever the hour.
    for (const [i, wx] of [[0, 18], [1, 92], [2, 166]] as [number, number][]) {
      const w = 40, top = 40, h = 64;
      windowIn(ctx, s, wx, top, w, h, shade(OAK, 0.9), { arched: true, panes: [2, 3], view: (c) => forestFill(c, wx, top, w, h, s.daylight, 90 + wx) });
      const n = s.daylight > 0.3 ? 2 : 5;
      for (let m = 0; m < n; m++) moth(ctx, wx + 6 + rnd(85, i, m) * (w - 12), top + 22 + rnd(86, i, m) * (h - 28), 3 + rnd(87, i, m) * 1.5, (rnd(88, i, m) - 0.5) * 1.2);
    }
    // The cots under them, for whoever comes up the road.
    cot(ctx, 8, FLOOR + 6, 70, 1);
    cot(ctx, 84, FLOOR + 6, 70, 2);
    cot(ctx, 160, FLOOR + 6, 62, 3);
    // The hearth on the right, the pot on its hook, the bowls and the bread on the mantel.
    const fb = hearth(ctx, s, 252, 34, 136, FLOOR + 4, GREY, 89, { mantel: OAK, reach: 300 });
    line(ctx, [fb.x + fb.w * 0.5, fb.y + 2, fb.x + fb.w * 0.5, fb.y + 14], '#2a2226', 2);
    pot(ctx, s, fb.x + fb.w * 0.5, fb.y + 34, 13);
    const mantelY = fb.y - fb.w * 0.36;
    for (let i = 0; i < 4; i++) cup(ctx, 266 + i * 14, mantelY, 11, '#7a5a34', true);
    plate(ctx, 336, mantelY, 9, '#d8ccb0', '#6a5a40');
    jar(ctx, 362, mantelY, 12, 15, '#7a6a52', '#4a3a2a');
    candle(ctx, s, 380, mantelY, 10, '#efe4c8', 80);
    // A shelf of the house's crocks between the cots and the fire.
    shelf(ctx, 226, 110, 22, OAK, 3);
    jug(ctx, 237, 110, 14, '#8a5a3a');
    smudge(ctx, 320, FLOOR + 20, 90, '#ff9a48', 0.2);
    // The long table, the day's bread and the pot's bowls on it.
    contact(ctx, 200, 252, 300, 0.35);
    longTable(ctx, 46, 370, 226, 18, STAGE_H + 2);
    loaf(ctx, 92, 218, 24); loaf(ctx, 120, 216, 18);
    for (let i = 0; i < 6; i++) cup(ctx, 150 + i * 30, 220 - (i % 2) * 4, 13, '#7a5a34', true);
    jug(ctx, 330, 218, 18, '#8a5a3a', '#e8dcc0');
    candle(ctx, s, 250, 214, 12, '#efe4c8', 130);
    bench(ctx, 60, 360, 246);
    // The reader's lectern at the table's head, where one reads while the rest eat.
    lectern(ctx, s, 24, 262, 50, '#5a4230');
    candle(ctx, s, 66, 222, 9, '#efe4c8', 90);
  },
};
