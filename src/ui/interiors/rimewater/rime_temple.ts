// Rime Lodge's temple, the hill folk's, where the lodge is cured: a steep gable of logs over a
// stone with a cup in it, as the moor's shrines are, snow in the cup and lights round its foot; the
// smoke hole letting the day down onto it; the healer's cot under a fur, warming stones in a
// brazier, linen on a line and herbs drying from the beam.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, rnd, beam, floorboards, skyFill, line, fillPoly, path, ink, smudge, contact, slab, pool, flame } from '../kit.ts';
import { K, shelf, jar, herbs, cloth } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { LOG, SNOW, IRON, BEAR, WOOL, STRIPE, logWall, pelt } from './lodge.ts';

const GRANITE = '#8a8a82', LICHEN = '#a8a868', DARK = '#3e3228', LINEN = '#e4dcc8';
const FLOOR = 196, EAVE = 70, RIDGE = -6;

/** The gable's slope at x: the roof comes down from the ridge in the middle to the eaves at either side. */
const slope = (x: number): number => RIDGE + (EAVE - RIDGE) * Math.abs(x - 200) / 200;

/** The roof's underside either side of the gable, its rafters running back into the dark, black with smoke. */
function roof(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = shade(DARK, 0.6); ctx.fillRect(0, 0, STAGE_W, EAVE + 4);
  for (let i = 0; i < 9; i++) {
    const u = i / 8, x = u * STAGE_W, y = slope(x);
    line(ctx, [x, y, x < 200 ? x - 60 : x + 60, -10], '#120c14', 6); line(ctx, [x, y, x < 200 ? x - 60 : x + 60, -10], shade(DARK, 0.9), 4);
  }
}

/** The smoke hole at the ridge, the sky through it, and the day coming down in a shaft onto the floor at (tx, ty). */
function smokeHole(ctx: CanvasRenderingContext2D, s: Stage, x: number, w: number, tx: number, ty: number): void {
  const y0 = 0, h = 16;
  skyFill(ctx, x, y0, w, h, s.daylight, 471);
  fillPoly(ctx, [x - 2, y0 + h, x + w + 2, y0 + h, x + w + 6, y0 + h + 4, x - 6, y0 + h + 4], shade(DARK, 0.8));
  path(ctx, [x, y0, x + w, y0, x + w, y0 + h, x, y0 + h]); ink(ctx);
  if (s.daylight > 0.15) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(0, y0 + h, 0, ty);
    g.addColorStop(0, rgba('#dce8f8', 0.3 * s.daylight)); g.addColorStop(1, rgba('#dce8f8', 0.06 * s.daylight));
    fillPoly(ctx, [x + 2, y0 + h, x + w - 2, y0 + h, tx + w * 1.4, ty, tx - w * 1.4, ty], g);
    ctx.restore();
    s.lights.push({ k: 'motes', x: x - 10, y: y0 + h + 10, w: w + 20, h: ty - y0 - h - 30, color: '#e8f0ff', n: 14, rise: -0.06 });
    pool(s, tx, ty - 30, 170, '#d0e0f4', 0.75 * s.daylight);
  }
}

/**
 * The stone with a cup in it, foot on y: a grey boulder with lichen on its shoulders, a hollow
 * worn in its top with snow in it, and smaller cups pecked down its face.
 */
function cupStone(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  contact(ctx, x, y, w * 1.2, 0.5);
  const pts = [x - w * 0.5, y, x - w * 0.54, y - h * 0.45, x - w * 0.42, y - h * 0.86, x - w * 0.16, y - h, x + w * 0.2, y - h * 0.98, x + w * 0.44, y - h * 0.84, x + w * 0.54, y - h * 0.4, x + w * 0.48, y];
  glossPoly(ctx, K, pts, GRANITE, { gloss: 0.1, spread: 0.7, h: 120, tex: 'stipple', seed: 472, amount: 0.6 });
  ctx.save(); path(ctx, pts); ctx.clip();
  for (let i = 0; i < 6; i++) { ctx.fillStyle = rgba(i % 2 ? LICHEN : '#c8c890', 0.4); ctx.beginPath(); ctx.ellipse(x + (rnd(473, i) - 0.5) * w * 0.9, y - h * (0.7 + rnd(474, i) * 0.25), 3 + rnd(475, i) * 5, 2, 0, 0, Math.PI * 2); ctx.fill(); }
  // The small cups down the face, each with its ring round it.
  for (const [cx, cy, r] of [[-0.2, 0.55, 3.2], [0.14, 0.42, 2.6], [-0.02, 0.26, 2.2]] as [number, number, number][]) {
    const px = x + cx * w, py = y - cy * h;
    ctx.strokeStyle = rgba('#3a3a36', 0.6); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(px, py, r * 2, r * 1.6, 0, 0, Math.PI * 2); ctx.stroke();
    glossEllipse(ctx, K, px, py, r, r * 0.8, '#4a4a46', 0, {});
  }
  ctx.restore();
  // The great cup in its top, snow heaped in it.
  const ty = y - h * 0.97;
  glossEllipse(ctx, K, x + w * 0.02, ty, w * 0.24, h * 0.07, '#4a4a46', 0, {});
  glossEllipse(ctx, K, x + w * 0.02, ty - 1.5, w * 0.19, h * 0.05, SNOW, 0, { gloss: 0.3 });
}

/** A healer's cot along the wall: a low frame, a bear's fur over it and a grey blanket folded at its foot, foot on y. */
function cot(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, seed: number): void {
  contact(ctx, x + w / 2, y, w, 0.4);
  for (const lx of [x + 4, x + w - 9]) slab(ctx, lx, y - 15, 5, 15, shade(DARK, 1.3), { lit: 1 });
  slab(ctx, x, y - 21, w, 7, shade(DARK, 1.5), { lit: 1, dark: 0.3 });
  // The fur laid over it and hanging in lumps over its front edge.
  const top = y - 31, pts = [x - 3, top + 5, x + w * 0.35, top, x + w * 0.7, top + 1, x + w * 0.73, y - 10];
  for (let i = 10; i >= 0; i--) { const u = i / 10; pts.push(x - 3 + w * 0.76 * u, y - 8 - Math.abs(Math.sin(u * 9 + seed)) * 3 - rnd(seed, i) * 2); }
  glossPoly(ctx, K, pts, BEAR, { gloss: 0.05, spread: 0.8, h: 120, tex: 'fur', seed, amount: 0.8 });
  glossEllipse(ctx, K, x + 13, top + 2, 11, 5, LINEN, 0, { gloss: 0.1 });
  // The grey blanket folded at its foot.
  glossPoly(ctx, K, [x + w * 0.71, y - 20, x + w * 0.73, y - 32, x + w - 1, y - 32, x + w + 1, y - 20], WOOL, { gloss: 0.1 });
  line(ctx, [x + w * 0.74, y - 27, x + w - 1, y - 27], shade(WOOL, 1.3), 1);
  ctx.fillStyle = STRIPE; ctx.fillRect(Math.round(x + w * 0.73), Math.round(y - 25), Math.round(w * 0.27), 3);
}

/** The brazier where the warming stones are heated: an iron dish of coals on legs, round stones in the coals. Foot on y. */
function brazier(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, w: number): void {
  contact(ctx, x, y, w * 1.3, 0.5);
  const bowl = y - w * 0.7;
  for (const [a, b] of [[-0.3, -0.5], [0.3, 0.5], [0, 0.05]] as [number, number][]) { line(ctx, [x + w * a, bowl, x + w * b, y], '#120c14', 4.5); line(ctx, [x + w * a, bowl, x + w * b, y], IRON, 2.5); }
  glossPoly(ctx, K, [x - w / 2, bowl - w * 0.18, x + w / 2, bowl - w * 0.18, x + w * 0.34, bowl + w * 0.08, x - w * 0.34, bowl + w * 0.08], IRON, { gloss: 0.4, spread: 0.7 });
  const coal = ctx.createLinearGradient(0, bowl - w * 0.26, 0, bowl - w * 0.14);
  coal.addColorStop(0, '#ffc060'); coal.addColorStop(1, '#a8301a');
  ctx.beginPath(); ctx.ellipse(x, bowl - w * 0.18, w * 0.46, w * 0.08, 0, 0, Math.PI * 2); ctx.fillStyle = coal; ctx.fill();
  for (let i = 0; i < 5; i++) glossBall(ctx, K, x - w * 0.32 + i * w * 0.16, bowl - w * 0.24 - (i % 2) * 2, w * 0.08, shade('#7a6a5a', 0.9 + rnd(476, i) * 0.2), { gloss: 0.2 });
  s.lights.push({ k: 'glow', x, y: bowl - w * 0.22, r: w * 0.9, color: '#ff8a3a', a: 0.45 });
  s.lights.push({ k: 'motes', x: x - w * 0.3, y: bowl - w * 1.6, w: w * 0.6, h: w * 1.3, color: '#ffc060', n: 6, rise: 0.4 });
  pool(s, x, bowl - w * 0.3, 190, '#ff8a3a', 0.85);
}

export const RIME_TEMPLE: Scene = {
  ambient: ['#22242e', '#868c98'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    roof(ctx);
    // The gable end, logs up to the roof's slopes.
    ctx.save(); path(ctx, [0, FLOOR, 0, EAVE, 200, RIDGE, STAGE_W, EAVE, STAGE_W, FLOOR]); ctx.clip();
    logWall(ctx, 0, RIDGE, STAGE_W, FLOOR - RIDGE, 15, 477);
    ctx.restore();
    line(ctx, [0, EAVE, 200, RIDGE, STAGE_W, EAVE], '#120c14', 2);
    for (const sd of [-1, 1]) { const pts = [200, RIDGE + 2, 200 + sd * 200, EAVE + 2]; line(ctx, pts, '#120c14', 9); line(ctx, pts, shade(LOG, 0.8), 7); }
    floorboards(ctx, FLOOR, 200, 104, '#6a5642', 8, 478);
    // A tie beam across, the herbs hung from it to dry.
    beam(ctx, 0, 92, STAGE_W, 9, shade(LOG, 0.85), 479);
    for (let i = 0; i < 6; i++) herbs(ctx, 26 + i * 18, 112 + (i % 2) * 6, 13, 101, i % 3 ? '#6a7a3a' : '#8a9a5a', 480 + i);
    for (let i = 0; i < 4; i++) herbs(ctx, 300 + i * 22, 112 + (i % 2) * 5, 14, 101, i % 2 ? '#7a8a4a' : '#5a6a3a', 486 + i);
    // The smoke hole at the ridge and the day it lets down onto the stone.
    smokeHole(ctx, s, 186, 28, 200, FLOOR + 10);
    // The healer's shelf of salves on the left wall, her cot under it.
    shelf(ctx, 22, 154, 96, shade(LOG, 0.9));
    for (let i = 0; i < 5; i++) jar(ctx, 34 + i * 18, 154, 11 + (i % 2) * 3, 13 + (i % 3) * 2, ['#8a7a5a', '#5a6a6a', '#a08a6a'][i % 3], ['#4a3a2a', '#e4dcc8'][i % 2]);
    cot(ctx, 6, FLOOR + 14, 112, 491);
    // The brazier on the right, the warming stones in it; linen strips on a line by it.
    line(ctx, [292, 150, 392, 154], '#c8b890', 1);
    for (let i = 0; i < 4; i++) cloth(ctx, 300 + i * 22, 314 + i * 22, 151 + i, 26 + (i % 2) * 8, LINEN, 492 + i);
    brazier(ctx, s, 336, FLOOR + 24, 44);
    // The stone, and the lights set round its foot.
    cupStone(ctx, 200, FLOOR + 22, 92, 74);
    for (let i = 0; i < 7; i++) {
      const a = Math.PI * (0.12 + i * 0.127), lx = 200 - Math.cos(a) * 70, ly = FLOOR + 30 + Math.sin(a) * 10;
      glossEllipse(ctx, K, lx, ly, 4, 1.6, '#7a7468', 0, {});
      glossPoly(ctx, K, [lx - 1.5, ly - 1, lx - 1.5, ly - 7, lx + 1.5, ly - 7, lx + 1.5, ly - 1], '#e8dcb8', { gloss: 0.2 });
      flame(s, lx, ly - 8, 1.8, 50, 0.45);
    }
    // A bear's hide on the boards in front.
    pelt(ctx, 92, 236, 150, 70, shade(BEAR, 1.15), 497, { flat: 0.42 });
    smudge(ctx, 336, FLOOR + 10, 60, '#ff8a3a', 0.12);
  },
};
