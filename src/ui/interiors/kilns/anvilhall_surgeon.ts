// Anvilhall's mine-surgeon's, where the crushed and the burned and the gassed are brought up out of
// the workings: rock limewashed clean, the surgeon's table under a lamp with a reflector, the
// instruments laid out on linen, salves and splints and bandage on the shelves, a canary in the
// window like the ones the miners carry down and a niche where the dead lie under the hammer
// and pick with a lamp kept lit at their head.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, plaster, flagstones, line, smudge, fillPoly, path, ink, slab, pool, contact, block } from '../kit.ts';
import { K, shelf, jar, bottle, jug } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { ROCK, IRON, BRASS, BLACK, hewn, oldScript, frogLamp, rockWindow, terraceView, hammerPick } from './hold.ts';

const FLOOR = 204, LIME = '#d2cdc2', OAK = '#5a3e28', LINEN = '#e8e2d4';

/** The canary in its cage, hung from a hook at (x, y): a domed cage of wire, the bird yellow on its perch. */
function canary(ctx: CanvasRenderingContext2D, x: number, y: number, s: number): void {
  line(ctx, [x, y, x, y + s * 0.3], '#120c14', 1.5);
  const top = y + s * 0.3, foot = y + s * 1.5, r = s * 0.42;
  // The bars, back half first, then the bird, then the front.
  ctx.strokeStyle = rgba('#3a3428', 0.8); ctx.lineWidth = 1;
  for (let i = 0; i <= 6; i++) { const u = i / 6 - 0.5, bx = x + u * r * 2; ctx.beginPath(); ctx.moveTo(bx, foot); ctx.lineTo(bx, top + r * 0.6); ctx.quadraticCurveTo(bx, top, x, top); ctx.stroke(); }
  line(ctx, [x - r * 0.8, foot - s * 0.42, x + r * 0.8, foot - s * 0.42], '#6a4a2a', 1.2);
  const by = foot - s * 0.42;
  glossEllipse(ctx, K, x, by - s * 0.14, s * 0.13, s * 0.1, '#f0cc30', -0.3, { gloss: 0.4 });
  glossBall(ctx, K, x + s * 0.1, by - s * 0.26, s * 0.07, '#f4d440', { gloss: 0.4 });
  fillPoly(ctx, [x + s * 0.16, by - s * 0.27, x + s * 0.22, by - s * 0.25, x + s * 0.16, by - s * 0.23], '#d88a30');
  fillPoly(ctx, [x - s * 0.1, by - s * 0.12, x - s * 0.26, by - s * 0.02, x - s * 0.08, by - s * 0.06], '#d8b028');
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(x, foot, r, r * 0.22, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = BRASS; ctx.lineWidth = 1; ctx.stroke();
  glossBall(ctx, K, x, top - 1, 1.6, BRASS, {});
}

/**
 * The surgeon's lamp, hung low over the table on its chain from the vault: a flame under a deep
 * brass reflector that throws its light down onto the table. The reflector's mouth at (x, y).
 */
function surgeonLamp(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, w: number): void {
  line(ctx, [x, 0, x, y - w * 0.5], '#120c14', 2);
  for (let cy = 2; cy < y - w * 0.5; cy += 4) { ctx.fillStyle = shade(IRON, 1.5); ctx.fillRect(Math.round(x) - 1, Math.round(cy), 2, 2); }
  glossPoly(ctx, K, [x - w * 0.5, y, x - w * 0.16, y - w * 0.46, x + w * 0.16, y - w * 0.46, x + w * 0.5, y], BRASS, { gloss: 0.8, spread: 0.6 });
  ctx.beginPath(); ctx.ellipse(x, y, w * 0.5, w * 0.1, 0, 0, Math.PI); ctx.fillStyle = '#fff4d0'; ctx.fill();
  s.lights.push({ k: 'glow', x, y: y + 2, r: w * 0.7, color: '#ffe0a0', a: 0.5 });
  s.lights.push({ k: 'flame', x, y: y + 1, s: 2.4 });
  pool(s, x, y + 70, 150, '#ffe8b8', 0.95);
  pool(s, x, y + 10, 60, '#ffd890', 0.6);
}

/**
 * The surgeon's table, heavy oak with a padded top of leather, a rolled bolster at its head, the
 * straps hung down its side; the top's back edge at `top`, its feet on y.
 */
function table(ctx: CanvasRenderingContext2D, x0: number, x1: number, top: number, y: number): void {
  const w = x1 - x0, front = top + 14;
  contact(ctx, (x0 + x1) / 2, y, w + 20, 0.45);
  for (const lx of [x0 + 10, x1 - 22]) slab(ctx, lx, front + 8, 12, y - front - 8, shade(OAK, 0.8), { lit: 1 });
  slab(ctx, x0 + 10, y - 26, w - 20, 6, shade(OAK, 0.7), { lit: 1 });
  slab(ctx, x0, front, w, 9, OAK, { lit: 2, dark: 0.3 });
  fillPoly(ctx, [x0, front, x0 + 8, top, x1 - 8, top, x1, front], '#6a2e22');
  ctx.save(); path(ctx, [x0, front, x0 + 8, top, x1 - 8, top, x1, front]); ctx.clip();
  for (let i = 1; i < 6; i++) { const bx = x0 + (w * i) / 6; glossBall(ctx, K, bx, top + 7, 1.2, '#4a1e16', {}); }
  ctx.restore();
  path(ctx, [x0, front, x0 + 8, top, x1 - 8, top, x1, front]); ink(ctx);
  glossEllipse(ctx, K, x0 + 22, top + 6, 13, 6, '#7a3a2a', 0, { gloss: 0.25 });
  // Straps with their buckles hanging down the front.
  for (const sx of [x0 + w * 0.42, x0 + w * 0.72]) { line(ctx, [sx, front + 2, sx + 1, front + 26], '#120c14', 4); line(ctx, [sx, front + 2, sx + 1, front + 26], '#4a2a1a', 2.5); glossPoly(ctx, K, [sx - 3, front + 20, sx + 4, front + 20, sx + 4, front + 25, sx - 3, front + 25], BRASS, { gloss: 0.6 }); }
}

/** The instruments laid on linen: a bone saw, a knife, forceps, a probe. The cloth's top edge at y. */
function instruments(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  fillPoly(ctx, [x, y + 10, x + 6, y, x + w - 6, y, x + w, y + 10], LINEN);
  path(ctx, [x, y + 10, x + 6, y, x + w - 6, y, x + w, y + 10]); ink(ctx);
  // The saw: a bow of steel with its toothed blade, an oak grip.
  const sx = x + 10;
  line(ctx, [sx + 10, y + 7, sx + 36, y + 3], '#120c14', 2.5); line(ctx, [sx + 10, y + 7, sx + 36, y + 3], '#c0c6d0', 1);
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(sx + 12, y + 7); ctx.quadraticCurveTo(sx + 22, y - 6, sx + 34, y + 3); ctx.stroke();
  ctx.strokeStyle = '#8a929e'; ctx.lineWidth = 1.2; ctx.stroke();
  glossPoly(ctx, K, [sx, y + 9, sx + 10, y + 6, sx + 12, y + 9, sx + 2, y + 12], OAK, {});
  // The knife and the forceps.
  glossPoly(ctx, K, [x + w * 0.56, y + 7, x + w * 0.74, y + 4, x + w * 0.75, y + 6, x + w * 0.57, y + 9], '#c8ced8', { gloss: 0.7 });
  glossPoly(ctx, K, [x + w * 0.48, y + 8, x + w * 0.56, y + 7, x + w * 0.57, y + 9, x + w * 0.49, y + 10], '#2a1a12', {});
  line(ctx, [x + w * 0.78, y + 8, x + w * 0.94, y + 3], '#120c14', 2); line(ctx, [x + w * 0.78, y + 8, x + w * 0.94, y + 3], '#a8aeb8', 1);
  line(ctx, [x + w * 0.78, y + 9, x + w * 0.94, y + 6], '#120c14', 2); line(ctx, [x + w * 0.78, y + 9, x + w * 0.94, y + 6], '#a8aeb8', 1);
}

/** Rolls of bandage, stacked on a shelf whose top is y. */
function bandages(ctx: CanvasRenderingContext2D, x: number, y: number, n: number): void {
  for (let i = 0; i < n; i++) { const bx = x + (i % 3) * 11 + (i >= 3 ? 5 : 0), by = y - 5 - (i >= 3 ? 9 : 0); glossEllipse(ctx, K, bx, by, 5, 5, LINEN, 0, { gloss: 0.15 }); ctx.strokeStyle = rgba('#a89a80', 0.7); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(bx, by, 2.4, 0, Math.PI * 2); ctx.stroke(); }
}

/** A bundle of splints, slats of ash tied with cord, stood on y and leaning on the wall. */
function splints(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  for (let i = 0; i < 5; i++) { const dx = (i - 2) * 2.5, lean = 6 + dx * 0.3; line(ctx, [x + dx, y, x + dx + lean, y - h], '#120c14', 3.5); line(ctx, [x + dx, y, x + dx + lean, y - h], '#c8b088', 2); }
  for (const f of [0.3, 0.7]) line(ctx, [x - 7 + f * 6, y - h * f, x + 7 + f * 6, y - h * f], '#8a3a2a', 1.5);
}

/** The stretcher the dead and the hurt come up on: two poles and the canvas between, stood on end against the wall. Foot on y. */
function stretcher(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  const w = 22;
  fillPoly(ctx, [x + 3, y - 10, x + w - 3, y - 10, x + w - 1, y - h + 12, x + 5, y - h + 12], '#b8aa8a');
  for (let i = 1; i < 5; i++) line(ctx, [x + 4, y - 10 - i * (h - 22) / 5, x + w - 2, y - 10 - i * (h - 22) / 5], rgba('#6a5a40', 0.4), 1);
  for (const px of [x, x + w]) { line(ctx, [px, y, px + 4, y - h], '#120c14', 4); line(ctx, [px, y, px + 4, y - h], '#7a5a34', 2.5); }
}

/**
 * The niche for the dead, cut low and wide into the rock under a flat arch: a bier of stone along
 * it, a black pall over the bier with the hammer and pick in brass and a miner's lamp burning at
 * its head. The niche from x across w, its floor at y, its arch's crown `h` above.
 */
function niche(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, w: number, h: number): void {
  const spring = y - h * 0.55, mouth = (g: number): void => { ctx.beginPath(); ctx.moveTo(x - g, y + g * 0.4); ctx.lineTo(x - g, spring); ctx.quadraticCurveTo(x + w / 2, y - h * 1.3 - g * 1.5, x + w + g, spring); ctx.lineTo(x + w + g, y + g * 0.4); ctx.closePath(); };
  mouth(7); ctx.fillStyle = shade(LIME, 0.84); ctx.fill(); ink(ctx);
  mouth(0); ctx.save(); ctx.clip();
  hewn(ctx, x, y - h * 1.2, w, h * 1.2, 691, shade(ROCK, 0.75));
  const g = ctx.createLinearGradient(0, y - h, 0, y); g.addColorStop(0, rgba('#0a0608', 0.55)); g.addColorStop(1, rgba('#0a0608', 0.2));
  ctx.fillStyle = g; ctx.fillRect(x, y - h * 1.2, w, h * 1.2);
  ctx.restore();
  mouth(0); ink(ctx);
  oldScript(ctx, x + w / 2, y - h - 16, w * 0.7, 692, 4, LIME);
  // The bier along the niche, and the pall over it, fringed.
  const bt = y - 22;
  block(ctx, x + 4, bt + 6, w - 8, y - bt - 6, shade(ROCK, 1.05), 693);
  fillPoly(ctx, [x + 2, bt + 6, x + 6, bt, x + w - 6, bt, x + w - 2, bt + 6], shade(ROCK, 1.25));
  glossPoly(ctx, K, [x + 14, bt + 2, x + 22, bt - 9, x + w * 0.5, bt - 12, x + w - 22, bt - 9, x + w - 12, bt + 2, x + w - 10, bt + 18, x + 12, bt + 18], BLACK, { gloss: 0.3, spread: 0.8 });
  for (let i = 0; i < 16; i++) line(ctx, [x + 13 + i * (w - 26) / 15, bt + 18, x + 13 + i * (w - 26) / 15, bt + 21], BRASS, 1);
  hammerPick(ctx, x + w / 2, bt + 3, 9);
  frogLamp(ctx, s, x + 10, spring - 6, 9, 90);
}

export const SURGEON: Scene = {
  ambient: ['#24202a', '#7c7a78'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    plaster(ctx, 0, 0, STAGE_W, FLOOR, LIME, 695);
    // The rock shows dark through the lime where the damp has lifted it, low and in the corners.
    for (let i = 0; i < 9; i++) smudge(ctx, rnd(696, i) * STAGE_W, FLOOR - rnd(697, i) * 30, 8 + rnd(698, i) * 14, shade(ROCK, 0.8), 0.35);
    flagstones(ctx, FLOOR, 200, 110, '#8a847a', 6, 699);
    // The rock overhead, left as cut, and the lime's edge under it.
    hewn(ctx, 0, 0, STAGE_W, 18, 700, shade(ROCK, 0.7));
    line(ctx, [0, 18, STAGE_W, 18], '#120c14', 1.5);
    // Left: the window and the canary in it, a shelf of salves under it.
    rockWindow(ctx, s, 34, 46, 46, 56, terraceView(34, 46, 46, 56, s.daylight, 5), { splay: 10, base: LIME });
    canary(ctx, 57, 46, 26);
    shelf(ctx, 22, 126, 72, OAK);
    for (let i = 0; i < 4; i++) jar(ctx, 32 + i * 17, 126, 12, 15, ['#8a6a4a', '#5a6a5a', '#9a8a6a', '#6a5a4a'][i], '#c8b890');
    // The shelves behind the table: spirits and salves, bandage, a bowl.
    shelf(ctx, 148, 52, 124, OAK);
    for (let i = 0; i < 7; i++) bottle(ctx, 156 + i * 17, 52, 15 + rnd(701, i) * 7, ['#5a3a2a', '#2a4a3a', '#6a5a2a', '#3a3a5a'][i % 4], { squat: i % 3 === 1, label: i % 2 ? LINEN : undefined });
    shelf(ctx, 148, 92, 124, OAK);
    bandages(ctx, 160, 92, 6);
    for (let i = 0; i < 3; i++) jar(ctx, 210 + i * 20, 92, 14, 18, ['#b8a88a', '#8a7a6a', '#a89878'][i], '#6a5a4a');
    glossPoly(ctx, K, [264, 92, 260, 82, 272, 82, 268, 92], '#c8ced8', { gloss: 0.6 });
    stretcher(ctx, 100, FLOOR + 2, 120);
    splints(ctx, 134, FLOOR + 2, 60);
    // Right: the niche where the dead are laid.
    niche(ctx, s, 292, FLOOR - 4, 100, 64);
    // The table under the lamp, and the instruments on their linen at its foot.
    surgeonLamp(ctx, s, 214, 150, 30);
    table(ctx, 120, 312, 196, STAGE_H + 4);
    instruments(ctx, 210, 199, 92);
    // A basin and its ewer on a small table in front.
    contact(ctx, 44, STAGE_H - 2, 70, 0.4);
    for (const lx of [16, 66]) slab(ctx, lx, 240, 6, STAGE_H - 240, OAK, { lit: 1 });
    slab(ctx, 8, 234, 74, 7, shade(OAK, 1.1), { lit: 2 });
    glossEllipse(ctx, K, 36, 230, 18, 5, '#b8bec8', 0, { gloss: 0.7 });
    ctx.beginPath(); ctx.ellipse(36, 229, 14, 3, 0, 0, Math.PI * 2); ctx.fillStyle = '#9aa8b4'; ctx.fill();
    jug(ctx, 66, 234, 22, '#d8d2c4', '#5a6a8a');
  },
};
