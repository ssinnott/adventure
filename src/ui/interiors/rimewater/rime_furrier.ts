// Rime Lodge's furrier, the band's gear for the ice: pelts laced in hoops and hung from the beam by
// their noses, a bearskin coat on its stand with its hood up, a fur robe on a peg, the hunters' arms
// racked (the bear spear, the ice axe, the bow and the guide's staff) and in front the fleshing beam
// with a hide over it, the skinning knife on a block by it.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, beam, planks, floorboards, windowIn, line, fillPoly, contact } from '../kit.ts';
import { K, lantern, bow, staff } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { armsRack } from '../yards.ts';
import { LOG, IRON, BEAR, WHITE_BEAR, LYNX, logWall, pelt, frost, loch } from './lodge.ts';

const DARK = '#4a3a2c', WILLOW = '#9a7a4a', HAFT = '#6a4626', STEEL = '#c0c6d0', ROBE = '#3a4a5a', HIDE = '#c8a878';
const FLOOR = 198;

/** A pelt laced into a hoop of bent willow to stretch and dry, hung on the wall: centre (x, y), radius r. */
function hoop(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fur: string, seed: number, spots?: string): void {
  ctx.fillStyle = rgba('#0a0608', 0.3); ctx.beginPath(); ctx.ellipse(x + 3, y + 4, r, r, 0, 0, Math.PI * 2); ctx.fill();
  pelt(ctx, x, y - r * 0.82, r * 1.5, r * 1.5, fur, seed, { spots, tail: 0.06 });
  // The lacing from the hide's edge out to the hoop.
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; line(ctx, [x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.62, x + Math.cos(a) * r, y + Math.sin(a) * r], rgba('#d8c8a0', 0.8), 1); }
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(x, y, r, r, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = WILLOW; ctx.lineWidth = 3; ctx.stroke();
  line(ctx, [x, y - r, x, y - r - 6], '#120c14', 2); glossBall(ctx, K, x, y - r - 7, 2, '#5a4430', {});
}

/** A small pelt hung from the beam by its nose on a thong, its nose at y. */
function hung(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, fur: string, seed: number, top: number, spots?: string): void {
  line(ctx, [x, top, x, y], '#c8b890', 1);
  pelt(ctx, x, y, len * 0.55, len, fur, seed, { spots, tail: 0.2 });
}

/**
 * The bearskin coat on its stand, foot on y: a post and a crossbar for the shoulders, the coat hung
 * long and heavy with horn toggles down it, its hood up and empty, the bear's ears left on it.
 */
function bearskinCoat(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  const u = h / 100, top = y - h;
  contact(ctx, x, y, 40 * u, 0.45);
  line(ctx, [x - 16 * u, y, x + 16 * u, y], '#120c14', 5); line(ctx, [x - 16 * u, y, x + 16 * u, y], HAFT, 3);
  line(ctx, [x, y, x, y - 20 * u], '#120c14', 5); line(ctx, [x, y, x, y - 20 * u], HAFT, 3);
  // The coat, shoulders to hem, the fur falling in long locks; the sleeves hung either side.
  for (const sd of [-1, 1]) glossPoly(ctx, K, [x + sd * 18 * u, top + 26 * u, x + sd * 27 * u, top + 30 * u, x + sd * 30 * u, top + 70 * u, x + sd * 21 * u, top + 72 * u, x + sd * 17 * u, top + 40 * u], shade(BEAR, 0.92), { gloss: 0.05, spread: 0.8, h: 120, tex: 'fur', seed: 501 + sd, amount: 0.8 });
  const coat = [x - 19 * u, top + 24 * u, x + 19 * u, top + 24 * u, x + 23 * u, top + 60 * u, x + 25 * u, top + 82 * u];
  for (let i = 8; i >= 0; i--) coat.push(x - 25 * u + 50 * u * (i / 8), top + 82 * u + Math.abs(Math.sin(i * 1.9)) * 4 * u);
  coat.push(x - 23 * u, top + 60 * u);
  glossPoly(ctx, K, coat, BEAR, { gloss: 0.05, spread: 0.8, h: 120, tex: 'fur', seed: 503, amount: 0.9 });
  line(ctx, [x, top + 30 * u, x + 1, top + 80 * u], rgba('#1a1210', 0.6), 1.5);
  for (let i = 0; i < 3; i++) glossBall(ctx, K, x + 3 * u, top + (38 + i * 12) * u, 1.6 * u, '#d8ccb0', { gloss: 0.3 });
  // The hood up and empty, a deep cowl of the same fur, the bear's small round ears left on it.
  for (const sd of [-1, 1]) glossBall(ctx, K, x + sd * 9 * u, top + 3 * u, 3.6 * u, shade(BEAR, 0.95), { gloss: 0.05 });
  glossPoly(ctx, K, [x - 17 * u, top + 28 * u, x - 15 * u, top + 10 * u, x - 8 * u, top + 1 * u, x + 8 * u, top + 1 * u, x + 15 * u, top + 10 * u, x + 17 * u, top + 28 * u], shade(BEAR, 1.05), { gloss: 0.05, spread: 0.8, h: 120, tex: 'fur', seed: 504, amount: 0.8 });
  fillPoly(ctx, [x - 9 * u, top + 28 * u, x - 9 * u, top + 15 * u, x - 4 * u, top + 9 * u, x + 4 * u, top + 9 * u, x + 9 * u, top + 15 * u, x + 9 * u, top + 28 * u], '#140e0c');
  line(ctx, [x - 9 * u, top + 15 * u, x - 4 * u, top + 9 * u, x + 4 * u, top + 9 * u, x + 9 * u, top + 15 * u], rgba(shade(BEAR, 1.5), 0.8), 1.5);
}

/** The fur robe on its peg, its shoulders at y: long, dyed dark, the collar and the hem in white fur. */
function furRobe(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  const w = h * 0.42;
  glossPoly(ctx, K, [x - w * 0.24, y, x + w * 0.24, y, x + w * 0.5, y + h * 0.12, x + w * 0.42, y + h * 0.5, x + w * 0.56, y + h, x - w * 0.56, y + h, x - w * 0.42, y + h * 0.5, x - w * 0.5, y + h * 0.12], ROBE, { gloss: 0.1, spread: 0.7, h: 120, tex: 'folds', seed: 505, amount: 0.6 });
  glossPoly(ctx, K, [x - w * 0.56, y + h * 0.9, x + w * 0.56, y + h * 0.9, x + w * 0.6, y + h, x - w * 0.6, y + h], WHITE_BEAR, { gloss: 0.05, h: 120, tex: 'fur', seed: 506, amount: 0.6 });
  glossPoly(ctx, K, [x - w * 0.34, y - 2, x + w * 0.34, y - 2, x + w * 0.1, y + h * 0.3, x - w * 0.1, y + h * 0.3], WHITE_BEAR, { gloss: 0.05, h: 120, tex: 'fur', seed: 507, amount: 0.6 });
  glossBall(ctx, K, x, y - 3, 2.5, '#5a4430', {});
}

/** The bear spear: a long ash shaft, a broad leaf of a head and the crossbar under it that stops the bear coming up the shaft. Foot on y. */
function bearSpear(ctx: CanvasRenderingContext2D, x: number, y: number, len: number): void {
  const top = y - len;
  glossPoly(ctx, K, [x - 1.8, y, x - 1.8, top + len * 0.16, x + 1.8, top + len * 0.16, x + 1.8, y], HAFT, { spread: 0.7 });
  glossPoly(ctx, K, [x, top, x + len * 0.05, top + len * 0.09, x + 2, top + len * 0.17, x - 2, top + len * 0.17, x - len * 0.05, top + len * 0.09], STEEL, { gloss: 0.6 });
  glossPoly(ctx, K, [x - len * 0.07, top + len * 0.19, x + len * 0.07, top + len * 0.19, x + len * 0.07, top + len * 0.21, x - len * 0.07, top + len * 0.21], IRON, { gloss: 0.4 });
  for (let i = 0; i < 4; i++) line(ctx, [x - 2, y - len * 0.5 + i * 3, x + 2, y - len * 0.5 + i * 3 - 1], '#3a2a1a', 1);
}

/** The ice axe: a short haft, an adze at one side of the head and a pick at the other, a spike at the foot. Foot on y. */
function iceAxe(ctx: CanvasRenderingContext2D, x: number, y: number, len: number): void {
  const top = y - len;
  glossPoly(ctx, K, [x - 2, y - 4, x - 2, top, x + 2, top, x + 2, y - 4], HAFT, { spread: 0.7 });
  glossPoly(ctx, K, [x - 2, y - 4, x, y + 3, x + 2, y - 4], IRON, { gloss: 0.5 });
  glossPoly(ctx, K, [x - len * 0.24, top + 6, x - len * 0.04, top - 2, x + len * 0.04, top - 2, x + len * 0.18, top + 1, x + len * 0.2, top + 5, x + len * 0.04, top + 4, x - len * 0.04, top + 4, x - len * 0.22, top + 8], STEEL, { gloss: 0.6 });
}

/** The skinning knife: a short curved blade and an antler handle, lying on y. */
function skinningKnife(ctx: CanvasRenderingContext2D, x: number, y: number, len: number): void {
  glossPoly(ctx, K, [x, y, x + len * 0.42, y - 2, x + len * 0.44, y + 1, x, y + 2], '#c8b8a0', { gloss: 0.2 });
  glossPoly(ctx, K, [x + len * 0.44, y - 1, x + len * 0.9, y - 3, x + len, y - 1, x + len * 0.9, y + 1, x + len * 0.44, y + 1], STEEL, { gloss: 0.7 });
}

/**
 * The fleshing beam in front, side on: a rounded beam with its foot on the floor at (x0, y), rising
 * to the furrier's end at (x1, top) on two splayed legs, a hide thrown over the high end and hanging
 * down both sides, the two-handled scraper lying across it.
 */
function fleshingBeam(ctx: CanvasRenderingContext2D, x0: number, y: number, x1: number, top: number): void {
  contact(ctx, (x0 + x1) / 2, y, x1 - x0, 0.35);
  for (const sd of [-1, 1]) { line(ctx, [x1 - 8, top + 4, x1 - 8 + sd * 12, y], '#120c14', 6); line(ctx, [x1 - 8, top + 4, x1 - 8 + sd * 12, y], HAFT, 4); }
  const r = 6, dx = x1 - x0, dy = top - y, l = Math.hypot(dx, dy), nx = -dy / l * r, ny = dx / l * r;
  glossPoly(ctx, K, [x0 - nx, y - ny, x1 - nx, top - ny, x1 + nx, top + ny, x0 + nx, y + ny], shade(LOG, 1.15), { gloss: 0.15, spread: 0.7 });
  glossEllipse(ctx, K, x1, top, r * 0.7, r, shade(LOG, 1.4), 0, {});
  // The hide over the high end, hanging down both sides in a fold.
  const at = (t: number): [number, number] => [x0 + dx * t, y + dy * t];
  const [ax, ay] = at(0.42), [bx, by] = at(0.92);
  glossPoly(ctx, K, [ax - 2, ay - 7, bx + 2, by - 7, bx + 8, by + 22, bx - 6, by + 30, ax + 10, ay + 26, ax - 6, ay + 18], HIDE, { gloss: 0.15, spread: 0.7 });
  for (let i = 0; i < 5; i++) { const [px, py] = at(0.48 + i * 0.09); line(ctx, [px, py - 4, px + 2, py + 20], rgba('#8a6a48', 0.55), 1); }
  // The scraper across it: a curved blade between two handles.
  const [sx, sy] = at(0.66);
  line(ctx, [sx - 10, sy - 9, sx + 8, sy - 6], '#120c14', 3.5); line(ctx, [sx - 10, sy - 9, sx + 8, sy - 6], STEEL, 2);
  for (const hx of [sx - 13, sx + 10]) glossPoly(ctx, K, [hx - 2, sy - 13, hx + 2, sy - 13, hx + 2, sy - 3, hx - 2, sy - 3], HAFT, {});
}

export const RIME_FURRIER: Scene = {
  ambient: ['#262634', '#8e9098'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    logWall(ctx, 0, 22, STAGE_W, FLOOR - 22, 12, 511);
    floorboards(ctx, FLOOR, 220, 110, '#74593f', 8, 512);
    planks(ctx, 0, 0, STAGE_W, 12, shade(DARK, 0.8), 1, false, 513);
    beam(ctx, 0, 10, STAGE_W, 13, DARK, 514);
    // The window on the left, frosted, the loch's light through it; the robe on its peg under it.
    const wx = 18, wy = 40, ww = 46, wh = 44;
    windowIn(ctx, s, wx, wy, ww, wh, shade(LOG, 0.8), { panes: [2, 2], view: (c) => { loch(wx, wy, ww, wh, s, { at: 0.7, shore: 0.42, seed: 515, near: 0.5 })(c); frost(c, wx, wy, ww, wh, 516, 0.9); } });
    furRobe(ctx, 41, 106, 84);
    // The hoops on the back wall, a lynx and a white bear's cub laced in them to dry.
    hoop(ctx, 122, 88, 34, LYNX, 517, '#5a4a36');
    hoop(ctx, 196, 74, 26, WHITE_BEAR, 518);
    // Pelts hung from the beam by their noses, across the top.
    for (let i = 0; i < 5; i++) hung(ctx, 236 + i * 32, 30 + (i % 2) * 4, 42 + (i % 3) * 6, [LYNX, shade(BEAR, 1.2), WHITE_BEAR, LYNX, shade(BEAR, 1.4)][i], 520 + i, 23, i % 3 === 0 ? '#5a4a36' : undefined);
    // The arms on their rack on the right: bear spear, ice axe, hunter's bow, guide's staff.
    armsRack(ctx, 300, FLOOR + 4, 86, 70, HAFT);
    bearSpear(ctx, 310, FLOOR, 128);
    iceAxe(ctx, 330, FLOOR, 62);
    bow(ctx, 356, FLOOR - 4, 96, '#7a4a2a', true);
    staff(ctx, 378, FLOOR, 124, '#8a6a42');
    glossPoly(ctx, K, [376, FLOOR - 2, 378, FLOOR + 6, 380, FLOOR - 2], IRON, { gloss: 0.5 });
    ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(378, FLOOR - 128, 4.5, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = IRON; ctx.lineWidth = 2; ctx.stroke();
    // The bearskin coat on its stand in the middle of the floor.
    bearskinCoat(ctx, 250, FLOOR + 26, 132);
    // The lamp on its chain from the beam, the room's light by night.
    lantern(ctx, s, 150, 128, 10, '#3a3440', 23, s.daylight > 0.5 ? 110 : 200);
    // The fleshing beam in front, a hide over it.
    fleshingBeam(ctx, 14, 262, 176, 222);
    // A block of a log beside it, the skinning knife laid on it.
    contact(ctx, 222, 264, 44, 0.4);
    glossPoly(ctx, K, [202, 262, 202, 238, 242, 238, 242, 262], shade(LOG, 1.05), { gloss: 0.1, spread: 0.8 });
    glossEllipse(ctx, K, 222, 238, 20, 6, shade(LOG, 1.45), 0, { gloss: 0.1 });
    for (let k = 1; k < 4; k++) { ctx.strokeStyle = rgba('#3a2a1a', 0.35); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(222, 238, 20 * k / 4, 6 * k / 4, 0, 0, Math.PI * 2); ctx.stroke(); }
    skinningKnife(ctx, 206, 238, 30);
    // A tub of bark liquor in the corner, the hides soaking.
    contact(ctx, 352, 262, 70, 0.4);
    glossPoly(ctx, K, [318, 266, 314, 230, 390, 230, 386, 266], '#7a5a3a', { gloss: 0.1, spread: 0.8 });
    for (const f of [0.25, 0.75]) { ctx.fillStyle = IRON; ctx.fillRect(316, Math.round(230 + 36 * f), 72, 3); }
    glossEllipse(ctx, K, 352, 230, 38, 6, '#4a2e18', 0, { gloss: 0.5 });
    glossPoly(ctx, K, [334, 229, 340, 224, 362, 225, 366, 230], HIDE, {});
  },
};
