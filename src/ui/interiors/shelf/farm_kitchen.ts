// The farm's kitchen on the Foreland road, where the store sells the farm's own food over a plain
// counter: low beams hung with the curing, a long table of loaves and cheeses, flagstones, and the
// yard through the window.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, plaster, beam, planks, flagstones, windowIn, skyFill, line, fillPoly, path, ink, smudge, contact, slab } from '../kit.ts';
import { K, counter, shelf, jar, jug, cup, plate, loaf, cheese, candle, sack, ham, garlic, herbs, hearth, stool } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';

const ELM = '#6e4a2c', ELM_DARK = '#46301e', LIME = '#e4d8bc', STONE = '#8e8272', CROCK = '#b89a6a';

/** The yard through the window: sky, the far hedge, a hayrick and the gate, dimmed with the day. */
function yard(x: number, y: number, w: number, h: number, daylight: number) {
  return (ctx: CanvasRenderingContext2D): void => {
    skyFill(ctx, x, y, w, h, daylight, 97);
    const d = 0.25 + daylight * 0.75, gy = y + h * 0.62;
    fillPoly(ctx, [x, gy, x + w * 0.3, gy - 4, x + w * 0.7, gy - 2, x + w, gy - 5, x + w, y + h, x, y + h], shade('#4a6a34', d));
    ctx.fillStyle = shade('#8a7a4a', d); ctx.fillRect(x, gy + h * 0.14, w, h);
    glossPoly(ctx, K, [x + w * 0.56, gy + 6, x + w * 0.6, gy - 12, x + w * 0.74, gy - 18, x + w * 0.88, gy - 12, x + w * 0.92, gy + 6], shade('#c8a850', d), { gloss: 0.1 });
    for (const px of [x + 4, x + w * 0.22, x + w * 0.4]) line(ctx, [px, gy + 12, px, gy - 2], shade('#5a4430', d), 2);
    for (const py of [gy + 2, gy + 7]) line(ctx, [x, py, x + w * 0.44, py], shade('#6a5438', d), 1.5);
  };
}

/** The farmhouse table, long and scrubbed, seen from the room: its top from y back to y - d, legs to the floor at foot. */
function longTable(ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number, d: number, foot: number, wood: string): void {
  const top = [x0, y, x0 + d, y - d, x1 - d, y - d, x1, y];
  for (const lx of [x0 + 6, x1 - 12]) slab(ctx, lx, y + 6, 7, foot - y - 6, shade(wood, 0.7), { lit: 1, dark: 0.3 });
  slab(ctx, x0, y, x1 - x0, 7, shade(wood, 0.8), { lit: 1, dark: 0.35 });
  fillPoly(ctx, top, shade(wood, 1.25));
  for (let i = 1; i < 4; i++) { const t = i / 4; line(ctx, [x0 + d * t, y - d * t, x1 - d * t, y - d * t], rgba(shade(wood, 0.8), 0.6), 1); }
  path(ctx, top); ink(ctx);
}

/** A tall stoneware crock with a cloth tied over its mouth, foot on y. */
function crock(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  const w = h * 0.7;
  contact(ctx, x, y, w * 1.1);
  glossPoly(ctx, K, [x - w * 0.36, y, x - w * 0.5, y - h * 0.45, x - w * 0.4, y - h * 0.9, x + w * 0.4, y - h * 0.9, x + w * 0.5, y - h * 0.45, x + w * 0.36, y], CROCK, { gloss: 0.5, spread: 0.7 });
  ctx.fillStyle = '#6a4a2a'; ctx.fillRect(Math.round(x - w * 0.5), Math.round(y - h * 0.62), Math.round(w), 2);
  glossPoly(ctx, K, [x - w * 0.44, y - h * 0.88, x - w * 0.36, y - h, x + w * 0.36, y - h, x + w * 0.44, y - h * 0.88, x + w * 0.2, y - h * 0.8, x - w * 0.2, y - h * 0.8], '#e8e0c8', {});
  line(ctx, [x - w * 0.4, y - h * 0.88, x + w * 0.4, y - h * 0.88], '#8a3a2a', 1.5);
}

/** A butter churn: a staved tub narrowing to its lid, the dasher standing up through it. Foot on y. */
function churn(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  const w = h * 0.42;
  contact(ctx, x, y, w * 1.2);
  line(ctx, [x, y - h * 0.8, x, y - h * 1.3], '#120c14', 4); line(ctx, [x, y - h * 0.8, x, y - h * 1.3], '#b08a5a', 2);
  glossPoly(ctx, K, [x - w * 0.5, y, x - w * 0.36, y - h * 0.82, x + w * 0.36, y - h * 0.82, x + w * 0.5, y], '#9a7048', { gloss: 0.2, spread: 0.8 });
  for (const f of [0.15, 0.7]) line(ctx, [x - w * (0.5 - f * 0.14), y - h * f, x + w * (0.5 - f * 0.14), y - h * f], '#3a3440', 2);
  glossEllipse(ctx, K, x, y - h * 0.83, w * 0.4, w * 0.12, '#7a5434', 0, {});
}

/** A basket of eggs on y. */
function eggs(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  for (let i = 0; i < 6; i++) glossBall(ctx, K, x - w * 0.3 + (i % 3) * w * 0.3 + (i > 2 ? w * 0.12 : 0), y - w * 0.3 - (i > 2 ? 3 : 0), w * 0.14, i % 2 ? '#f0e4cc' : '#d8a878', { gloss: 0.5 });
  glossPoly(ctx, K, [x - w / 2, y - w * 0.28, x + w / 2, y - w * 0.28, x + w * 0.4, y, x - w * 0.4, y], '#b08a4a', { gloss: 0.1 });
  for (let i = 1; i < 4; i++) line(ctx, [x - w / 2 + i * w / 4, y - w * 0.28, x - w * 0.4 + i * w * 0.2, y], '#7a5a2a', 1);
  ctx.strokeStyle = '#7a5a2a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y - w * 0.28, w * 0.4, w * 0.5, 0, Math.PI, 0); ctx.stroke();
}

export const FARM_KITCHEN: Scene = {
  ambient: ['#403440', '#a89a84'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 196;
    // Limewashed walls under a low ceiling, the joists close overhead, and a heavy beam across.
    plaster(ctx, 0, 0, STAGE_W, FLOOR, LIME, 97);
    flagstones(ctx, FLOOR, 200, 90, STONE, 7, 97);
    planks(ctx, 0, 0, STAGE_W, 24, ELM_DARK, 1, false, 97);
    for (let i = 0; i < 12; i++) { const jx = 4 + i * 36; fillPoly(ctx, [jx, 0, jx + 10, 0, jx + 9, 22, jx + 1, 22], shade(ELM_DARK, 0.8)); }
    beam(ctx, 0, 22, STAGE_W, 16, ELM, 971);
    beam(ctx, 150, 38, 10, FLOOR - 38, ELM, 972);
    beam(ctx, 270, 38, 10, FLOOR - 38, ELM, 973);
    // The hearth, left: a pot on its hook, and a jug, plates, a jar and a candle on the mantel.
    const fb = hearth(ctx, s, 10, 38, 128, FLOOR + 4, STONE, 97, { mantel: ELM, reach: 280 });
    line(ctx, [fb.x + fb.w * 0.5, fb.y + 2, fb.x + fb.w * 0.5, fb.y + 16], '#2a2226', 2);
    glossEllipse(ctx, K, fb.x + fb.w * 0.5, fb.y + 24, 14, 10, '#2e2a30', 0, { gloss: 0.4, spread: 0.7 });
    const mantelY = fb.y - fb.w * 0.36;
    jug(ctx, 24, mantelY, 16, '#a86a3a', '#e8dcc0');
    plate(ctx, 50, mantelY, 8, '#ece4d4', '#4a6a9a'); plate(ctx, 70, mantelY, 8, '#ece4d4', '#4a6a9a');
    jar(ctx, 96, mantelY, 10, 13, '#6a7a5a', '#4a3a2a');
    candle(ctx, s, 122, mantelY, 11, '#efe4c8', 90);
    // The window on the yard, and the dresser under it with the everyday crocks.
    windowIn(ctx, s, 180, 56, 58, 52, ELM_DARK, { panes: [2, 2], view: yard(180, 56, 58, 52, s.daylight) });
    shelf(ctx, 168, 138, 82, ELM_DARK, 4);
    for (let i = 0; i < 4; i++) plate(ctx, 180 + i * 19, 138, 8, '#ece4d4', i % 2 ? '#a84a3a' : '#4a6a9a');
    shelf(ctx, 168, 168, 82, ELM_DARK, 4);
    jar(ctx, 182, 168, 14, 18, CROCK, '#6a4428'); jug(ctx, 206, 168, 18, '#5a7aa8', '#e8e0d0'); jar(ctx, 232, 168, 12, 14, '#a86a3a');
    // Right: the plain counter the rations go over, and the stores on the shelf behind it.
    shelf(ctx, 286, 92, 108, ELM_DARK, 4);
    for (let i = 0; i < 5; i++) jar(ctx, 298 + i * 21, 92, 13, 14 + rnd(97, i) * 8, i % 2 ? CROCK : '#d8c8a0', '#6a4428');
    shelf(ctx, 286, 140, 108, ELM_DARK, 4);
    for (let i = 0; i < 4; i++) loaf(ctx, 300 + i * 26, 140, 20);
    counter(ctx, 280, STAGE_W, 190, 11, STAGE_H, ELM, 97, { panels: 2 });
    eggs(ctx, 306, 201, 26);
    cheese(ctx, 344, 201, 22);
    candle(ctx, s, 372, 201, 12, '#efe4c8', 120);
    // The curing hung from the beam: hams, garlic, herbs drying.
    ham(ctx, 176, 46, 15, 38); garlic(ctx, 204, 44, 8, 38, 5); herbs(ctx, 226, 44, 15, 38, '#6a8a3a', 1);
    herbs(ctx, 248, 44, 13, 38, '#8a9a5a', 2); ham(ctx, 300, 46, 13, 38); garlic(ctx, 330, 44, 8, 38, 4);
    herbs(ctx, 354, 44, 14, 38, '#5a7a3a', 3); ham(ctx, 384, 46, 12, 38);
    // The fire's warmth across the flags.
    smudge(ctx, 74, FLOOR + 18, 80, '#ff9a48', 0.22);
    // The long table, with the day's bread and the farm's cheeses on it, and a stool drawn up.
    contact(ctx, 208, 262, 190, 0.35);
    longTable(ctx, 110, 300, 222, 16, STAGE_H + 2, '#8a6440');
    loaf(ctx, 142, 214, 26); loaf(ctx, 170, 212, 20);
    cheese(ctx, 204, 214, 26); cheese(ctx, 236, 212, 18);
    jug(ctx, 262, 216, 18, '#a86a3a', '#e8dcc0');
    cup(ctx, 282, 216, 10, '#7a5a34');
    candle(ctx, s, 224, 218, 12, '#efe4c8', 130);
    stool(ctx, 94, 266, 30, '#7a5236');
    // By the door, bottom right, the sacks and the churn; bottom left, the crock.
    sack(ctx, 344, 266, 42, 50, '#c0a47a', { seed: 5 });
    sack(ctx, 384, 268, 36, 44, '#b0946a', { open: '#e8d8a8', seed: 6 });
    crock(ctx, 30, 264, 38);
    churn(ctx, 318, 262, 40);
  },
};
