// The Lamp Gallery at the top of Lantern Watch, where the Watch trains: the walk round the great
// lamp, open to the weather, the lamp-house's glass and the flame lit in daylight, a straw pell
// lashed to the parapet, staves racked against the lamp-house's foot, the gorge far below and moths
// at the glass by night.
import { shade, rgba, mix } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, block, flagstones, skyFill, line, fillPoly, path, ink, smudge, contact, slab, pool, flame } from '../kit.ts';
import { K, staff, sword } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';

const GREY = '#7e7a70', IRON = '#34323a', COPPER = '#5a8a7a', GLASS = '#a8e8e0', STRAW = '#c8b070', HEMP = '#b8a478';
const FLOOR = 196, PARAPET = 150;

/** The gorge from the tower's top: the far lip and its glass trees, the cleft, the wood on this side, in rain. */
function gorge(ctx: CanvasRenderingContext2D, daylight: number): void {
  skyFill(ctx, 0, 0, STAGE_W, PARAPET, daylight * 0.75, 271);
  // Low cloud over all of it: no stars in the rain.
  ctx.fillStyle = rgba(mix('#16161e', '#9aa4ae', daylight), 0.8); ctx.fillRect(0, 0, STAGE_W, PARAPET);
  const d = 0.2 + daylight * 0.6, lip = 112;
  fillPoly(ctx, [0, lip + 4, 90, lip - 2, 160, lip + 1, 260, lip - 4, STAGE_W, lip + 2, STAGE_W, PARAPET, 0, PARAPET], shade('#3a4038', d));
  for (let i = 0; i < 16; i++) {
    const tx = 6 + rnd(272, i) * (STAGE_W - 12), th = 6 + rnd(273, i) * 9, ty = lip + 1 - Math.sin(tx / 60) * 2;
    fillPoly(ctx, [tx - 2.5, ty, tx, ty - th, tx + 2.5, ty], i % 3 ? shade('#2a3a2a', d) : shade(GLASS, d + 0.2));
  }
  // The cleft, opening down into nothing, and the bridge a thread across it.
  const g = ctx.createLinearGradient(0, lip, 0, PARAPET);
  g.addColorStop(0, shade('#2a2a30', d)); g.addColorStop(1, '#060608');
  fillPoly(ctx, [24, lip + 3, 104, lip + 2, 76, PARAPET, 54, PARAPET], g);
  line(ctx, [18, lip + 9, 110, lip + 8], rgba(mix('#0a0a0e', '#4a4038', daylight), 0.9), 1);
  // Mist in the gorge, and the rain slanting over everything.
  const mist = ctx.createLinearGradient(0, lip - 20, 0, PARAPET);
  mist.addColorStop(0, rgba(mix('#20262e', '#c8ccc8', daylight), 0)); mist.addColorStop(1, rgba(mix('#20262e', '#c8ccc8', daylight), 0.45));
  ctx.fillStyle = mist; ctx.fillRect(0, lip - 20, STAGE_W, PARAPET - lip + 20);
  for (let i = 0; i < 70; i++) {
    const rx = rnd(274, i) * (STAGE_W + 40), ry = rnd(275, i) * PARAPET;
    line(ctx, [rx, ry, rx - 4, ry + 11], rgba(mix('#8a90a8', '#e8eef4', daylight), 0.35), 1);
  }
}

/** The parapet round the gallery, its coping at PARAPET, from x0 to x1: big wet blocks. */
function parapet(ctx: CanvasRenderingContext2D, x0: number, x1: number): void {
  for (let r = 0; r < 2; r++) {
    let x = x0 - (r ? 14 : 0), j = 0;
    while (x < x1) { const w = 30 + rnd(276, r, j) * 16; block(ctx, x, PARAPET + 8 + r * 19, Math.min(w, x1 - x), 19, GREY, 277 + r * 31 + j); x += w; j++; }
  }
  slab(ctx, x0 - 4, PARAPET, x1 - x0 + 8, 9, shade(GREY, 1.1), { lit: 2, dark: 0.3 });
  ctx.fillStyle = rgba('#d8e4ec', 0.18); ctx.fillRect(x0 - 4, PARAPET + 1, x1 - x0 + 8, 1);
}

/**
 * The lamp-house in the middle of the gallery: a stone drum, the iron cage of glass on it with the
 * great lamp burning inside before its dish, and the copper cap over all. Lit day and night.
 */
function lampHouse(ctx: CanvasRenderingContext2D, s: Stage, cx: number): void {
  const w = 128, x0 = cx - w / 2, drum = 148, cage = 46;
  // The drum: dressed stone, a door in it to the stair.
  for (let r = 0; r < 3; r++) { let x = x0, j = 0; while (x < x0 + w) { const bw = 22 + rnd(278, r, j) * 14; block(ctx, x, drum + r * 16, Math.min(bw, x0 + w - x), 16, shade(GREY, 1.05), 279 + r * 17 + j); x += bw; j++; } }
  fillPoly(ctx, [cx - 13, FLOOR, cx - 13, drum + 18, cx, drum + 10, cx + 13, drum + 18, cx + 13, FLOOR], '#1a1418');
  path(ctx, [cx - 13, FLOOR, cx - 13, drum + 18, cx, drum + 10, cx + 13, drum + 18, cx + 13, FLOOR]); ink(ctx);
  slab(ctx, x0 - 6, drum - 6, w + 12, 7, shade(GREY, 1.15), { lit: 2, dark: 0.3 });
  // The glass, and the light inside it: brightest by night, still lit at noon.
  const glow = ctx.createRadialGradient(cx, 100, 4, cx, 100, 70);
  glow.addColorStop(0, '#fff8d8'); glow.addColorStop(0.35, mix('#ffc870', '#ffe0a0', s.daylight)); glow.addColorStop(1, mix('#7a4a20', '#b8c8c0', s.daylight));
  ctx.fillStyle = glow; ctx.fillRect(x0 + 6, cage, w - 12, drum - 6 - cage);
  // The dish behind the flame, and the lamp's bowl and burner.
  glossEllipse(ctx, K, cx, 100, 30, 34, mix('#c89a40', '#e8d8a8', 0.4), 0, { gloss: 0.8, spread: 0.6 });
  glossEllipse(ctx, K, cx, 100, 20, 23, '#fff0c0', 0, { gloss: 0.9 });
  glossPoly(ctx, K, [cx - 12, 124, cx - 8, 112, cx + 8, 112, cx + 12, 124], '#6a5a3a', { gloss: 0.6 });
  slab(ctx, cx - 4, 124, 8, drum - 130, IRON, { lit: 1 });
  flame(s, cx, 110, 6, 300, 0.9);
  s.lights.push({ k: 'glow', x: cx, y: 100, r: 90, color: '#ffc070', a: s.daylight > 0.5 ? 0.18 : 0.4 });
  // The cage: iron mullions and a band across, the panes catching the rain.
  for (let i = 0; i <= 6; i++) { const mx = x0 + 6 + i * (w - 12) / 6; slab(ctx, mx - 2, cage, 4, drum - 6 - cage, IRON, { lit: 1 }); }
  slab(ctx, x0 + 4, 92, w - 8, 4, IRON, { lit: 1 });
  for (let i = 0; i < 18; i++) { const px = x0 + 10 + rnd(280, i) * (w - 20), py = cage + 4 + rnd(281, i) * (drum - cage - 16); line(ctx, [px, py, px - 1, py + 5], rgba('#ffffff', 0.35), 1); }
  // The copper cap, gone green, its vent and the ball on top.
  glossPoly(ctx, K, [x0 - 4, cage + 2, cx - 8, 10, cx + 8, 10, x0 + w + 4, cage + 2], COPPER, { gloss: 0.4, spread: 0.7 });
  for (let i = 1; i < 6; i++) line(ctx, [x0 - 4 + i * (w + 8) / 6, cage + 1, cx - 8 + i * 16 / 6, 11], rgba('#1a2a24', 0.5), 1);
  slab(ctx, cx - 9, 2, 18, 9, shade(COPPER, 0.8), { lit: 1 });
  glossBall(ctx, K, cx, 0, 5, shade(COPPER, 1.1), { gloss: 0.5 });
  pool(s, cx, 120, 180, '#ffd090', s.daylight > 0.5 ? 0.35 : 0.8);
}

/** A moth at the glass, pale wings out. */
function moth(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, a: number): void {
  ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  for (const sd of [-1, 1]) {
    fillPoly(ctx, [0, -r * 0.2, sd * r, -r * 0.7, sd * r * 1.1, r * 0.1, 0, r * 0.3], '#e0d8c0');
    fillPoly(ctx, [0, r * 0.2, sd * r * 0.7, r * 0.5, sd * r * 0.3, r * 0.9, 0, r * 0.6], '#c0b8a0');
  }
  ctx.fillStyle = '#5a5040'; ctx.fillRect(-0.5, -r * 0.4, 1, r);
  ctx.restore();
}

/** A straw pell for blade work: a post wrapped in bound straw, lashed by its top to the parapet. Foot on y. */
function pell(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  contact(ctx, x, y, 34, 0.45);
  slab(ctx, x - 4, y - h - 8, 8, h + 8, '#5a4430', { lit: 1 });
  glossPoly(ctx, K, [x - 11, y - 6, x - 13, y - h * 0.5, x - 10, y - h, x + 10, y - h, x + 13, y - h * 0.5, x + 11, y - 6], STRAW, { gloss: 0.15, spread: 0.8 });
  for (let i = 0; i < 14; i++) { const sy = y - 10 - rnd(282, i) * (h - 14); line(ctx, [x - 10, sy, x - 4 + rnd(283, i) * 14, sy + 3], rgba('#8a7040', 0.6), 1); }
  // The cords that bind it, and the gashes the blades have left.
  for (const f of [0.2, 0.55, 0.85]) line(ctx, [x - 12, y - h * f, x + 12, y - h * f + 1], '#5a4028', 2);
  for (let i = 0; i < 4; i++) { const gy = y - h * (0.3 + i * 0.13); line(ctx, [x - 6, gy, x + 7, gy - 4], '#3a2a14', 1.5); }
  // The lashing to the parapet's coping.
  line(ctx, [x + 2, y - h - 4, x + 26, PARAPET + 2], '#120c14', 3); line(ctx, [x + 2, y - h - 4, x + 26, PARAPET + 2], HEMP, 1.6);
  line(ctx, [x - 2, y - h - 2, x - 24, PARAPET + 3], '#120c14', 3); line(ctx, [x - 2, y - h - 2, x - 24, PARAPET + 3], HEMP, 1.6);
}

export const WATCH_GALLERY: Scene = {
  ambient: ['#1c1c28', '#8c929c'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    gorge(ctx, s.daylight);
    parapet(ctx, 0, STAGE_W);
    // The gallery's floor, wet flags round the lamp-house, shining under it.
    flagstones(ctx, FLOOR, 200, 92, '#6a665c', 8, 284);
    ctx.fillStyle = rgba('#0a0a12', 0.25); ctx.fillRect(0, PARAPET + 46, STAGE_W, FLOOR - PARAPET - 46);
    slab(ctx, 0, PARAPET + 44, STAGE_W, FLOOR - PARAPET - 44, shade(GREY, 0.7), { lit: 1 });
    lampHouse(ctx, s, 200);
    smudge(ctx, 200, FLOOR + 30, 80, '#ffd090', s.daylight > 0.5 ? 0.12 : 0.3);
    for (let i = 0; i < 6; i++) { const rx = 160 + rnd(285, i) * 80; line(ctx, [rx, FLOOR + 14 + i * 7, rx + 14, FLOOR + 14 + i * 7], rgba('#ffe0a0', 0.25), 1); }
    // The pell on the left, lashed to the parapet against the wind.
    pell(ctx, 78, FLOOR + 34, 74);
    // Staves racked against the lamp-house's foot on the right, a waster leaning with them.
    slab(ctx, 266, FLOOR - 30, 46, 5, '#5a4430', { lit: 1 });
    for (let i = 0; i < 4; i++) staff(ctx, 272 + i * 11, FLOOR + 4, 92 - i * 6, i % 2 ? '#7a5a34' : '#6a4a2a');
    sword(ctx, 318, FLOOR + 6, 62, { blade: '#b89a68', hilt: '#5a4a3a', w: 2.2 });
    // A sand bucket and an oil can by the door, in case of the lamp.
    contact(ctx, 352, FLOOR + 26, 30);
    glossPoly(ctx, K, [340, FLOOR + 26, 338, FLOOR + 2, 366, FLOOR + 2, 364, FLOOR + 26], '#6a5a44', { gloss: 0.2, spread: 0.8 });
    glossEllipse(ctx, K, 352, FLOOR + 2, 14, 3.5, '#c8b088', 0, { gloss: 0.2 });
    glossPoly(ctx, K, [372, FLOOR + 28, 372, FLOOR + 10, 386, FLOOR + 10, 386, FLOOR + 28], '#4a4a52', { gloss: 0.6 });
    line(ctx, [386, FLOOR + 14, 396, FLOOR + 6], '#120c14', 3); line(ctx, [386, FLOOR + 14, 396, FLOOR + 6], '#5a5a62', 1.5);
    // Moths at the glass by night, and a few by day asleep on the panes.
    const n = s.daylight > 0.5 ? 4 : 22;
    for (let i = 0; i < n; i++) moth(ctx, 144 + rnd(286, i) * 112, 50 + rnd(287, i) * 90, 2.5 + rnd(288, i) * 2.5, (rnd(289, i) - 0.5) * 1.2);
  },
};
