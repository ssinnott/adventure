// Rime Lodge's trainer's yard, under the open sky inside the stockade: trodden snow, a bear of straw
// and old hide reared up on its post for the spear, the butt for the bow with snow on it, the arms
// racked and fire-baskets on poles for the dark; over the stakes, the glacier coming down from the
// rim.
import { shade, rgba, mix } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, rnd, skyFill, line, fillPoly, path, ink, contact, pool } from '../kit.ts';
import { K, spear, axe } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { clouds, ground, target, armsRack } from '../yards.ts';
import { LOG, SNOW, IRON, BEAR } from './lodge.ts';

const STRAW = '#c8b070', HAFT = '#6a4626', ROCK = '#4a4c56';
const STAKES = 118, FOOT = 172;

/** The rim and the fells against the sky, and the glacier coming down between them to its snout over the stakes. */
function glacier(ctx: CanvasRenderingContext2D, d: number): void {
  const rock = mix('#1c1e28', ROCK, d * 0.8 + 0.2), snow = mix('#4a5468', '#f0f4f8', d), ice = mix('#3a4a62', '#b8d4e8', d), deep = mix('#202c40', '#6a96c0', d);
  // The rim, high and far, and the fells' near shoulders either side.
  const rim = [0, 70, 40, 54, 90, 60, 150, 42, 210, 50, 260, 34, 330, 40, 400, 30, 400, STAKES, 0, STAKES];
  fillPoly(ctx, rim, mix(rock, '#8a9ab0', 0.3 * d));
  for (let i = 0; i < 9; i++) { const x = 20 + i * 44, y = 46 + rnd(551, i) * 14; fillPoly(ctx, [x - 16, y + 6, x, y - 6, x + 18, y + 7], rgba(snow, 0.9)); }
  fillPoly(ctx, [0, 78, 60, 70, 120, 84, 170, 104, 190, STAKES, 0, STAKES], rock);
  fillPoly(ctx, [0, 78, 60, 70, 100, 78, 70, 84, 30, 86], snow);
  // The ice: a tongue from the gap in the rim, widening down to its snout, its crevasses bent with the flow.
  const tongue = [250, 38, 300, 36, 352, 40, 400, 52, 400, STAKES - 4, 372, STAKES - 10, 330, STAKES - 6, 286, STAKES - 12, 236, STAKES - 4, 214, STAKES, 226, 90, 238, 60];
  fillPoly(ctx, tongue, mix(ice, snow, 0.35));
  ctx.save(); path(ctx, tongue); ctx.clip();
  for (let i = 0; i < 10; i++) {
    const y = 46 + i * 7.5, pts: number[] = [];
    for (let k = 0; k <= 8; k++) { const x = 220 + k * 24; pts.push(x, y + Math.sin(k * 0.6 + 0.5) * (2 + i * 0.6) + (k > 4 ? (k - 4) * 0.8 : 0)); }
    line(ctx, pts, rgba(deep, 0.75), 1);
    line(ctx, pts.map((v, j) => j % 2 ? v - 1.5 : v), rgba(snow, 0.7), 1);
  }
  line(ctx, [290, 38, 300, 70, 296, STAKES], rgba(mix('#141418', '#5a5a60', d), 0.7), 3);
  ctx.restore();
  path(ctx, tongue); ctx.strokeStyle = rgba('#120c14', 0.6); ctx.lineWidth = 1; ctx.stroke();
  // The snout: a wall of ice under its snow, the snow lying on all of it.
  fillPoly(ctx, [214, STAKES, 236, STAKES - 12, 286, STAKES - 20, 330, STAKES - 14, 372, STAKES - 18, 400, STAKES - 10, 400, STAKES + 2, 214, STAKES + 2], mix(ice, snow, 0.55));
  for (let i = 0; i < 12; i++) { const x = 220 + i * 15; line(ctx, [x, STAKES - 14 + rnd(552, i) * 4, x + 2, STAKES + 1], rgba(deep, 0.45), 1); }
  // Pines at the ice's foot, dark against it.
  const pine = mix('#060a0a', '#1e3428', d);
  for (let i = 0; i < 26; i++) { const px = 4 + i * 15.5 + rnd(553, i) * 6, ph = 12 + rnd(554, i) * 14; fillPoly(ctx, [px - 6, STAKES + 2, px, STAKES - ph, px + 6, STAKES + 2], pine); }
}

/** The stockade round the yard: stakes of whole pine, pointed, lashed to a rail, snow capping each. Their feet at FOOT. */
function stockade(ctx: CanvasRenderingContext2D): void {
  for (let i = 0; i < 25; i++) {
    const x = -6 + i * 17, top = STAKES + 4 + rnd(555, i) * 6, w = 15;
    const col = shade(LOG, 0.86 + rnd(556, i) * 0.26), g = ctx.createLinearGradient(x, 0, x + w, 0);
    g.addColorStop(0, shade(col, 1.25)); g.addColorStop(0.4, col); g.addColorStop(1, shade(col, 0.6));
    const pts = [x, FOOT, x, top + 6, x + w / 2, top, x + w, top + 6, x + w, FOOT];
    fillPoly(ctx, pts, g); path(ctx, pts); ink(ctx);
    fillPoly(ctx, [x + 1, top + 6, x + w / 2, top, x + w - 1, top + 6, x + w * 0.7, top + 8, x + w * 0.3, top + 7], SNOW);
    line(ctx, [x + 4, top + 16, x + 5, FOOT - 6], rgba('#1a1210', 0.4), 1);
  }
  for (const ry of [STAKES + 22, FOOT - 16]) { line(ctx, [0, ry, STAGE_W, ry + 1], '#120c14', 5); line(ctx, [0, ry, STAGE_W, ry + 1], shade(LOG, 0.8), 3); line(ctx, [0, ry - 2, STAGE_W, ry - 1], rgba(SNOW, 0.9), 1.5); }
}

/**
 * The bear for the spear: straw bound in bundles to the shape of a bear reared up on its hind legs,
 * an old hide over its back and head, on a post driven into the snow; holes in its chest where the
 * spears go in, and one left in it. Foot on y.
 */
function strawBear(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  const u = h / 100;
  contact(ctx, x, y, 50 * u, 0.4);
  line(ctx, [x, y, x, y - 60 * u], '#120c14', 6); line(ctx, [x, y, x, y - 60 * u], HAFT, 4);
  const straw = { gloss: 0.1, spread: 0.8, h: 120, tex: 'bristle' as const, amount: 0.6 };
  // The hind legs and the body, bound in bundles.
  for (const sd of [-1, 1]) glossPoly(ctx, K, [x + sd * 6 * u, y - 40 * u, x + sd * 18 * u, y - 44 * u, x + sd * 20 * u, y - 8 * u, x + sd * 10 * u, y - 6 * u], shade(STRAW, 0.9), { ...straw, seed: 560 + sd });
  glossPoly(ctx, K, [x - 22 * u, y - 36 * u, x - 26 * u, y - 62 * u, x - 18 * u, y - 82 * u, x + 18 * u, y - 82 * u, x + 26 * u, y - 62 * u, x + 22 * u, y - 36 * u, x + 10 * u, y - 30 * u, x - 10 * u, y - 30 * u], STRAW, { ...straw, seed: 562 });
  // The forelegs out and down, as a bear comes at a man, sticks for claws.
  for (const sd of [-1, 1]) {
    glossPoly(ctx, K, [x + sd * 14 * u, y - 82 * u, x + sd * 30 * u, y - 86 * u, x + sd * 46 * u, y - 70 * u, x + sd * 40 * u, y - 64 * u, x + sd * 24 * u, y - 70 * u], shade(STRAW, 0.95), { ...straw, seed: 563 + sd });
    for (let c = 0; c < 3; c++) line(ctx, [x + sd * (42 + c * 2) * u, y - (66 + c * 2) * u, x + sd * (48 + c * 2) * u, y - (60 + c * 2) * u], '#2a1e14', 1.5);
  }
  for (const f of [0.45, 0.6, 0.74]) line(ctx, [x - 24 * u, y - h * f, x + 24 * u, y - h * f + 1], '#6a4a2a', 1.5);
  // The old hide over its shoulders and its head of straw, the mask's eyes cut out, the ears worn flat.
  glossPoly(ctx, K, [x - 26 * u, y - 64 * u, x - 20 * u, y - 86 * u, x - 10 * u, y - 92 * u, x + 10 * u, y - 92 * u, x + 20 * u, y - 86 * u, x + 26 * u, y - 64 * u, x + 14 * u, y - 72 * u, x, y - 68 * u, x - 14 * u, y - 72 * u], BEAR, { gloss: 0.05, spread: 0.8, h: 120, tex: 'fur', seed: 565, amount: 0.8 });
  for (const sd of [-1, 1]) glossPoly(ctx, K, [x + sd * 6 * u, y - 104 * u, x + sd * 12 * u, y - 112 * u, x + sd * 14 * u, y - 102 * u], shade(BEAR, 0.9), {});
  glossPoly(ctx, K, [x - 13 * u, y - 92 * u, x - 13 * u, y - 102 * u, x - 6 * u, y - 108 * u, x + 6 * u, y - 108 * u, x + 13 * u, y - 102 * u, x + 13 * u, y - 92 * u, x + 6 * u, y - 86 * u, x - 6 * u, y - 86 * u], shade(BEAR, 1.1), { gloss: 0.05, h: 120, tex: 'fur', seed: 566, amount: 0.6 });
  glossPoly(ctx, K, [x - 6 * u, y - 86 * u, x - 6 * u, y - 94 * u, x + 6 * u, y - 94 * u, x + 6 * u, y - 86 * u, x, y - 83 * u], shade(BEAR, 1.35), {});
  glossBall(ctx, K, x, y - 92 * u, 2 * u, '#1a1416', { gloss: 0.6 });
  for (const sd of [-1, 1]) { ctx.fillStyle = '#100a08'; ctx.beginPath(); ctx.ellipse(x + sd * 6 * u, y - 99 * u, 2.4 * u, 1.4 * u, sd * 0.3, 0, Math.PI * 2); ctx.fill(); }
  for (let i = 0; i < 8; i++) line(ctx, [x - 10 * u + i * 3 * u, y - 108 * u, x - 11 * u + i * 3 * u + rnd(569, i) * 4, y - 113 * u], shade(STRAW, 1.05), 1);
  // The holes in its chest, and a spear left in it.
  for (let i = 0; i < 5; i++) { ctx.fillStyle = '#3a2a14'; ctx.beginPath(); ctx.ellipse(x - 8 * u + rnd(567, i) * 16 * u, y - (46 + rnd(568, i) * 14) * u, 1.6, 1.2, 0, 0, Math.PI * 2); ctx.fill(); }
  line(ctx, [x + 4 * u, y - 52 * u, x + 70 * u, y - 18 * u], '#120c14', 4); line(ctx, [x + 4 * u, y - 52 * u, x + 70 * u, y - 18 * u], HAFT, 2.5);
}

/** A fire-basket on a pole, foot on y: an iron cage of split pine at the top, burning after dusk. */
function cresset(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, h: number): void {
  contact(ctx, x, y, 14, 0.4);
  line(ctx, [x, y, x, y - h], '#120c14', 6); line(ctx, [x, y, x, y - h], IRON, 4);
  const top = y - h;
  for (let i = -2; i <= 2; i++) line(ctx, [x + i * 2.5, top, x + i * 4.5, top - 14], '#120c14', 2);
  glossPoly(ctx, K, [x - 11, top - 14, x + 11, top - 14, x + 9, top - 11, x - 9, top - 11], IRON, { gloss: 0.4 });
  if (s.daylight < 0.45) {
    s.lights.push({ k: 'fire', x, y: top - 12, w: 18, h: 18 });
    pool(s, x, top - 16, 160, '#ff9a48', 0.9);
  } else {
    for (let i = 0; i < 4; i++) line(ctx, [x - 7 + i * 4, top - 12, x - 5 + i * 4, top - 18], '#2a2020', 2.5);
    glossEllipse(ctx, K, x, top - 17, 9, 2.5, SNOW, 0, {});
  }
}

export const RIME_YARD: Scene = {
  ambient: ['#2c3248', '#eef0f4'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    skyFill(ctx, 0, 0, STAGE_W, STAKES + 10, s.daylight, 571);
    clouds(ctx, s.daylight, 6, 572);
    glacier(ctx, s.daylight);
    stockade(ctx);
    ground(ctx, FOOT, mix('#5a6478', '#e4eaf0', s.daylight), 573);
    // Trodden snow where the drills are run, and a track of feet out to the butt.
    for (const [cx, cy, rx] of [[120, 226, 84], [300, 200, 50]] as [number, number, number][]) { ctx.fillStyle = rgba(mix('#2a3044', '#9aaabb', s.daylight), 0.45); ctx.beginPath(); ctx.ellipse(cx, cy, rx, rx * 0.16, 0, 0, Math.PI * 2); ctx.fill(); }
    for (let i = 0; i < 18; i++) { const fx = 170 + i * 7, fy = 214 - i * 1.2 + (i % 2) * 3; ctx.fillStyle = rgba('#5a6a80', 0.5); ctx.beginPath(); ctx.ellipse(fx, fy, 2.2, 1, 0, 0, Math.PI * 2); ctx.fill(); }
    // The arms on their rack against the stakes, snow along its bars.
    armsRack(ctx, 196, FOOT + 4, 70, 58, HAFT);
    for (let i = 0; i < 3; i++) spear(ctx, 206 + i * 10, FOOT + 2, 84 - i * 4);
    axe(ctx, 240, FOOT + 2, 52); axe(ctx, 254, FOOT + 2, 48, true);
    for (const ry of [FOOT + 4 - 58 * 0.62, FOOT + 4 - 58 * 0.2]) line(ctx, [194, ry - 1, 268, ry - 1], rgba(SNOW, 0.95), 2);
    // The butt for the bow out by the stakes, the snow lying on its top.
    target(ctx, 330, 178, 18, 574);
    glossEllipse(ctx, K, 330, 160, 13, 3.5, SNOW, 0, {});
    // The straw bear reared up in the middle of the yard, a spear in it.
    strawBear(ctx, 118, 236, 104);
    // The fire-baskets on their poles at the front.
    cresset(ctx, s, 26, 262, 96);
    cresset(ctx, s, 376, 258, 92);
    // A log for a bench, where the company waits its turn, snow brushed off one end.
    contact(ctx, 270, 258, 110, 0.35);
    glossPoly(ctx, K, [216, 258, 216, 240, 326, 240, 326, 258], shade(LOG, 1.05), { gloss: 0.1, spread: 0.8 });
    glossEllipse(ctx, K, 326, 249, 5, 9, shade(LOG, 1.4), 0, {});
    glossPoly(ctx, K, [252, 241, 256, 236, 324, 236, 326, 241], SNOW, { gloss: 0.1 });
    if (s.daylight > 0.3) pool(s, 200, 100, 320, '#f4f8ff', 0.6 * s.daylight);
  },
};
