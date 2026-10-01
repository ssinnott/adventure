// The prior's room high in Lantern Watch, where the papers are read: a desk under the window on the
// gorge, the papers spread and the seal beside them, a cut wick in a dish, the survey of the
// Sunder's ledges on the wall, two chairs and a hearth gone cold.
import { shade, rgba, mix } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, stones, beam, planks, floorboards, windowIn, skyFill, line, fillPoly, path, ink, smudge, contact, slab, pool } from '../kit.ts';
import { K, candle, painting, books, jar } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { SPINES } from '../guilds.ts';

const GREY = '#74706a', OAK = '#4e3826', GLASS = '#a8e8e0';
const FLOOR = 200;

/** The gorge through the window: the far lip and its glass trees, the drop, and the rain across it all. */
function gorge(x: number, y: number, w: number, h: number, daylight: number) {
  return (ctx: CanvasRenderingContext2D): void => {
    skyFill(ctx, x, y, w, h, daylight * 0.7, 211);
    const d = 0.2 + daylight * 0.6;
    // The far lip, and the glass trees standing along it.
    const lip = y + h * 0.36;
    fillPoly(ctx, [x, lip, x + w * 0.4, lip - 3, x + w, lip + 2, x + w, y + h, x, y + h], shade('#3a4038', d));
    for (let i = 0; i < 7; i++) {
      const tx = x + 4 + rnd(212, i) * (w - 8), th = 10 + rnd(213, i) * 10;
      fillPoly(ctx, [tx - 3, lip, tx, lip - th, tx + 3, lip], i % 2 ? shade(GLASS, d + 0.15) : shade('#2a3a2a', d));
    }
    // The drop: a cleft opening down the middle, into nothing.
    const g = ctx.createLinearGradient(0, lip, 0, y + h);
    g.addColorStop(0, shade('#2a2a30', d)); g.addColorStop(1, '#060608');
    fillPoly(ctx, [x + w * 0.28, lip + 4, x + w * 0.62, lip + 6, x + w * 0.5, y + h, x + w * 0.4, y + h], g);
    // Rain, slanting.
    for (let i = 0; i < 40; i++) { const rx = x + rnd(214, i) * w, ry = y + rnd(215, i) * h; line(ctx, [rx, ry, rx - 2, ry + 7], rgba(mix('#8a90a0', '#e0e8f0', daylight), 0.45), 1); }
  };
}

/**
 * The survey of the Sunder's ledges pinned on the wall: the gorge in section, the ledges
 * switchbacking down its face, the landings marked and a line ruled off at the bottom where the
 * paper stops. Painted into (x, y, w, h).
 */
function survey(x: number, y: number, w: number, h: number) {
  return (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = '#e4d6b4'; ctx.fillRect(x, y, w, h);
    smudge(ctx, x + w * 0.7, y + h * 0.3, w * 0.4, '#c8b088', 0.5);
    // The two faces of the gorge.
    for (const sd of [-1, 1]) { const pts: number[] = []; for (let i = 0; i <= 8; i++) pts.push(x + w / 2 + sd * (w * 0.3 - i * w * 0.02 + (rnd(216, i, sd) - 0.5) * 4), y + 4 + i * (h - 10) / 8); line(ctx, pts, '#4a3a2a', 1); }
    // The ledges down the west face, and the landings.
    const zig: number[] = [];
    for (let i = 0; i < 7; i++) zig.push(x + w * (i % 2 ? 0.26 : 0.46), y + 8 + i * (h - 18) / 6);
    line(ctx, zig, '#8a2a2a', 1);
    for (let i = 0; i < 7; i += 2) { ctx.fillStyle = '#8a2a2a'; ctx.fillRect(Math.round(zig[i * 2]) - 1, Math.round(zig[i * 2 + 1]) - 1, 3, 3); }
    // The floor, ruled straight across, and nothing drawn under it.
    line(ctx, [x + w * 0.16, y + h - 6, x + w * 0.84, y + h - 6], '#2a2a2a', 1.5);
    for (let i = 0; i < 5; i++) line(ctx, [x + w * 0.62, y + 10 + i * 5, x + w * 0.86, y + 10 + i * 5], rgba('#4a3a2a', 0.5), 1);
  };
}

/** A chair, its feet on y: a plain back, a rush seat, seen a little from the side. */
function chair(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, facing: 1 | -1): void {
  const w = h * 0.5, back = x - facing * w * 0.45;
  contact(ctx, x, y, w * 1.6, 0.35);
  for (const lx of [x - w * 0.45, x + w * 0.45]) line(ctx, [lx, y - h * 0.5, lx, y], '#120c14', 4);
  for (const lx of [x - w * 0.45, x + w * 0.45]) line(ctx, [lx, y - h * 0.5, lx, y], OAK, 2.5);
  line(ctx, [back, y - h * 0.5, back - facing * 2, y - h], '#120c14', 5); line(ctx, [back, y - h * 0.5, back - facing * 2, y - h], shade(OAK, 1.1), 3);
  for (const f of [0.68, 0.84]) line(ctx, [back - facing * 1, y - h * f, back + facing * w * 0.3, y - h * f - 1], shade(OAK, 0.9), 2.5);
  glossPoly(ctx, K, [x - w * 0.55, y - h * 0.5, x - w * 0.45, y - h * 0.58, x + w * 0.45, y - h * 0.58, x + w * 0.55, y - h * 0.5], '#a8904a', { gloss: 0.1, tex: 'stipple', seed: Math.round(x), amount: 0.4 });
}

/** The prior's seal: a brass matrix on its turned handle, and a stick of red wax beside it. Foot on y. */
function seal(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  glossEllipse(ctx, K, x, y - 1, 5, 2, '#b08a3a', 0, { gloss: 0.7 });
  glossPoly(ctx, K, [x - 2, y - 2, x - 3, y - 10, x + 3, y - 10, x + 2, y - 2], '#3a2a20', { gloss: 0.4 });
  glossBall(ctx, K, x, y - 11, 3, '#3a2a20', { gloss: 0.5 });
  glossPoly(ctx, K, [x + 8, y, x + 9, y - 3, x + 22, y - 4, x + 21, y - 1], '#9a2222', { gloss: 0.5 });
}

export const PRIORS_ROOM: Scene = {
  ambient: ['#1c1c24', '#6c707c'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    stones(ctx, 0, 0, STAGE_W, FLOOR, GREY, 11, 221);
    planks(ctx, 0, 0, STAGE_W, 10, shade(OAK, 0.7), 1, false, 222);
    beam(ctx, 0, 10, STAGE_W, 9, OAK, 223);
    floorboards(ctx, FLOOR, 200, 120, '#6a4e34', 9, 224);
    // The window on the gorge, deep in the tower's wall, the rain on it.
    const wx = 150, wy = 32, ww = 100, wh = 104;
    windowIn(ctx, s, wx, wy, ww, wh, shade(GREY, 0.8), { arched: true, panes: [3, 4], view: gorge(wx, wy, ww, wh, s.daylight) });
    for (let i = 0; i < 12; i++) { const rx = wx + 4 + rnd(225, i) * (ww - 8), ry = wy + ww * 0.4 + rnd(226, i) * (wh - ww * 0.5); line(ctx, [rx, ry, rx + (rnd(227, i) - 0.5) * 2, ry + 4 + rnd(228, i) * 8], rgba('#e8f0ff', 0.35), 1); }
    if (s.daylight > 0.15) pool(s, 200, 150, 200, '#b8c8e0', 0.45 * s.daylight);
    // The survey of the ledges on the left wall.
    painting(ctx, 30, 40, 74, 96, survey(30, 40, 74, 96), '#6a5238');
    // The cold hearth on the right: ash, no fire, a poker leant on the cheek.
    const hx = 300, hw = 92, htop = 56;
    slab(ctx, hx, htop, hw, FLOOR - htop, shade(GREY, 0.85), { lit: 2 });
    stones(ctx, hx + 2, htop + 2, hw - 4, FLOOR - htop - 4, shade(GREY, 0.9), 8, 229);
    const fx = hx + hw * 0.2, fw = hw * 0.6, fy = FLOOR - 52;
    const mouth = (): void => { ctx.beginPath(); ctx.moveTo(fx, FLOOR); ctx.lineTo(fx, fy + 12); ctx.quadraticCurveTo(fx + fw / 2, fy - 14, fx + fw, fy + 12); ctx.lineTo(fx + fw, FLOOR); ctx.closePath(); };
    mouth(); ctx.fillStyle = '#100c0c'; ctx.fill(); ink(ctx);
    glossEllipse(ctx, K, fx + fw / 2, FLOOR - 4, fw * 0.38, 4, '#5a5654', 0, { tex: 'stipple', seed: 230, amount: 0.5 });
    for (let i = 0; i < 2; i++) line(ctx, [fx + fw * 0.25 + i * 10, FLOOR - 6, fx + fw * 0.7 + i * 4, FLOOR - 9], '#1c1814', 4);
    beam(ctx, hx - 6, htop - 8, hw + 12, 8, OAK, 231);
    jar(ctx, hx + 18, htop - 8, 10, 13, '#5a6a6a', '#3a3030');
    books(ctx, hx + 50, htop - 8, 30, 12, 232, SPINES);
    line(ctx, [hx + hw - 4, FLOOR, hx + hw + 2, FLOOR - 50], '#120c14', 3); line(ctx, [hx + hw - 4, FLOOR, hx + hw + 2, FLOOR - 50], '#4a4450', 1.5);
    // The two chairs, either side of the desk.
    chair(ctx, 98, 250, 66, 1);
    chair(ctx, 314, 250, 66, -1);
    // The desk under the window, the papers spread on it.
    const dy = 214;
    for (const lx of [124, 270]) slab(ctx, lx, dy + 6, 9, STAGE_H - dy, shade(OAK, 0.75), { lit: 1 });
    slab(ctx, 112, dy, 176, 8, shade(OAK, 0.85), { lit: 1, dark: 0.35 });
    fillPoly(ctx, [112, dy, 124, dy - 16, 276, dy - 16, 288, dy], shade(OAK, 1.2));
    path(ctx, [112, dy, 124, dy - 16, 276, dy - 16, 288, dy]); ink(ctx);
    // The papers: the manifests in a fan, the log open, one sheet with the customs seal on it.
    for (let i = 0; i < 6; i++) {
      const px = 140 + i * 14 + rnd(233, i) * 4, py = dy - 4 - rnd(234, i) * 6, a = (rnd(235, i) - 0.5) * 0.5;
      ctx.save(); ctx.translate(px, py); ctx.rotate(a);
      glossPoly(ctx, K, [-10, 0, -9, -10, 10, -11, 10, 0], i % 2 ? '#ece2c8' : '#e2d6b8', {});
      for (let l = 0; l < 3; l++) line(ctx, [-7, -8 + l * 3, 6, -8 + l * 3], rgba('#3a2a30', 0.5), 1);
      if (i === 3) glossBall(ctx, K, 5, -3, 2.4, '#8a2222', { gloss: 0.4 });
      ctx.restore();
    }
    glossPoly(ctx, K, [222, dy - 3, 224, dy - 14, 248, dy - 15, 248, dy - 3], '#e8dcc0', {});
    glossPoly(ctx, K, [248, dy - 3, 248, dy - 15, 270, dy - 14, 272, dy - 3], '#e0d4b6', {});
    for (let l = 0; l < 3; l++) { line(ctx, [228, dy - 12 + l * 3, 244, dy - 12 + l * 3], rgba('#3a2a30', 0.5), 1); line(ctx, [252, dy - 12 + l * 3, 266, dy - 12 + l * 3], rgba('#3a2a30', 0.5), 1); }
    seal(ctx, 132, dy - 3);
    // The cut wick in its dish, and the one candle.
    glossEllipse(ctx, K, 210, dy - 4, 7, 2.2, '#8a8478', 0, { gloss: 0.5 });
    line(ctx, [207, dy - 5, 212, dy - 6], '#1a1414', 1.5);
    ctx.fillStyle = '#e8e0d0'; ctx.fillRect(213, dy - 7, 2, 2);
    if (s.daylight > 0.5) {
      // By day the candle stands cold, the window's light enough to read by.
      glossEllipse(ctx, K, 192, dy - 8, 4.4, 1.4, '#b08a3a', 0, { gloss: 0.6 });
      glossPoly(ctx, K, [190.5, dy - 9, 190.5, dy - 20, 193.5, dy - 20, 193.5, dy - 9], '#efe4c8', { gloss: 0.3 });
      line(ctx, [192, dy - 20, 192, dy - 22], '#2a2020', 1);
    } else {
      candle(ctx, s, 192, dy - 8, 12, '#efe4c8', 170);
      smudge(ctx, 192, dy - 20, 30, '#ffb060', 0.15);
    }
  },
};
