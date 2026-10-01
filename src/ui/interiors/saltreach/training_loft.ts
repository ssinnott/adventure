// Saltmouth's training hall, a sailors' loft over a warehouse: silvered rafters, a sanded floor,
// ropes and rings from the tie beam, practice blades on the wall, a stevedore's weights, and the
// loading door stood open on the quay with the hoist over it.
import { shade, rgba, mix } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, beam, planks, floorboards, skyFill, line, smudge, fillPoly, slab, pool, contact, DAY_POOL } from '../kit.ts';
import { K, lantern, sword, sack, crate } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';

const SILVER = '#9a968a', RAFTER = '#6a665e', HEMP = '#c8b88a', IRON = '#3a3a42';

/** The quay out of the loading door, from a floor up: masts and yards in the fog, the water, a roof across the way. */
function quayFromAbove(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, daylight: number): void {
  skyFill(ctx, x, y, w, h, daylight, 255);
  const fogCol = mix('#20262e', '#d4d8d4', daylight);
  ctx.fillStyle = mix('#121a26', '#566a74', daylight); ctx.fillRect(x, y + h * 0.5, w, h * 0.5);
  for (let i = 0; i < 4; i++) ctx.fillStyle = rgba('#ffffff', 0.12 * daylight), ctx.fillRect(Math.round(x + rnd(256, i) * w), Math.round(y + h * (0.6 + i * 0.08)), 8, 1);
  for (let i = 0; i < 3; i++) {
    const mx = x + w * (0.2 + i * 0.32), near = i !== 1, top = y + h * (near ? 0.02 : 0.18);
    ctx.fillStyle = rgba(mix('#06080e', '#3a3c42', daylight), near ? 0.9 : 0.5);
    ctx.fillRect(Math.round(mx), Math.round(top), near ? 2 : 1, Math.round(y + h * 0.56 - top));
    for (const f of [0.14, 0.3]) line(ctx, [mx - w * 0.13, top + h * f, mx + w * 0.13, top + h * f], rgba('#06080e', near ? 0.75 : 0.4), 1);
    line(ctx, [mx, top, mx - w * 0.16, y + h * 0.54], rgba('#06080e', 0.5), 1);
    fillPoly(ctx, [mx - w * 0.16, y + h * 0.54, mx + w * 0.18, y + h * 0.54, mx + w * 0.12, y + h * 0.62, mx - w * 0.1, y + h * 0.62], mix('#0a0a10', '#40382e', daylight));
  }
  const g = ctx.createLinearGradient(0, y, 0, y + h * 0.7);
  g.addColorStop(0, rgba(fogCol, 0.15)); g.addColorStop(1, rgba(fogCol, 0.5));
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h * 0.7);
  // The warehouse roof across the way, close below the door.
  fillPoly(ctx, [x, y + h, x, y + h * 0.78, x + w * 0.6, y + h * 0.7, x + w, y + h * 0.8, x + w, y + h], mix('#16141a', '#6a5a4e', daylight));
  for (let i = 0; i < 8; i++) line(ctx, [x + i * w / 7, y + h * 0.76, x + i * w / 7 - 3, y + h], rgba('#0a0608', 0.4), 1);
  if (daylight < 0.5) {
    for (const [lx, ly] of [[0.14, 0.5], [0.7, 0.46]] as [number, number][]) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; smudge(ctx, x + w * lx, y + h * ly, h * 0.16, '#ffc070', 0.6 * (1 - daylight * 2)); ctx.restore();
      ctx.fillStyle = '#ffe8b0'; ctx.fillRect(Math.round(x + w * lx), Math.round(y + h * ly), 2, 2);
    }
  }
}

/** A shutter swung back against the wall: boards on a Z of ledges. */
function shutter(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seed: number): void {
  planks(ctx, x, y, w, h, '#7a7466', 3, true, seed);
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 1; ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, Math.round(w) - 1, Math.round(h) - 1);
  for (const f of [0.15, 0.85]) slab(ctx, x + 1, y + h * f - 3, w - 2, 5, '#6a6458', { lit: 1 });
  line(ctx, [x + 2, y + h * 0.85 - 2, x + w - 2, y + h * 0.15 + 2], '#5a5448', 3);
}

/** A rope hung from the beam at (x, top) to y, knotted for climbing. */
function climbRope(ctx: CanvasRenderingContext2D, x: number, top: number, y: number, sway: number): void {
  const pts = [x, top, x + sway * 0.5, (top + y) / 2, x + sway, y];
  line(ctx, pts, '#120c14', 4); line(ctx, pts, HEMP, 2.4);
  for (let k = top + 10; k < y; k += 6) { const u = (k - top) / (y - top); line(ctx, [x + sway * u - 1, k, x + sway * u + 1, k + 2], rgba('#6a5a3a', 0.6), 1); }
  for (let i = 1; i <= 4; i++) { const u = i / 4.4, kx = x + sway * u, ky = top + (y - top) * u; glossEllipse(ctx, K, kx, ky, 3.2, 2.6, shade(HEMP, 0.95), 0, { gloss: 0.2 }); }
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, top, 4, 2, 0, 0, Math.PI * 2); ctx.stroke();
}

/** A pair of iron rings hung on ropes from the beam, bottoms at y. */
function rings(ctx: CanvasRenderingContext2D, x: number, top: number, y: number, gap: number): void {
  for (const sd of [-1, 1]) {
    const rx = x + sd * gap / 2, r = 7;
    line(ctx, [rx, top, rx, y - r * 2], '#120c14', 3); line(ctx, [rx, top, rx, y - r * 2], HEMP, 1.6);
    ctx.strokeStyle = '#120c14'; ctx.lineWidth = 4.5; ctx.beginPath(); ctx.arc(rx, y - r, r, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#7a7a84'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.strokeStyle = rgba('#ffffff', 0.45); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(rx, y - r, r, Math.PI * 1.05, Math.PI * 1.45); ctx.stroke();
  }
}

/** The hoist over the loading door: a beam out over the street, its sheave, the fall of rope and the cargo hook. */
function hoist(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, hookY: number): void {
  beam(ctx, x - 10, y, len + 10, 9, RAFTER, 257);
  const px = x + len - 8;
  glossBall(ctx, K, px, y + 12, 6, '#5a5650', { gloss: 0.3 });
  glossBall(ctx, K, px, y + 12, 2, IRON, {});
  for (const dx of [-5, 5]) line(ctx, [px + dx, y + 12, px + dx, hookY - 10], '#120c14', 2.6);
  for (const dx of [-5, 5]) line(ctx, [px + dx, y + 12, px + dx, hookY - 10], HEMP, 1.4);
  glossPoly(ctx, K, [px - 5, hookY - 12, px + 5, hookY - 12, px + 4, hookY - 4, px - 4, hookY - 4], '#6a5a44', { gloss: 0.2 });
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(px, hookY + 4, 6, Math.PI * 1.5, Math.PI * 0.95, false); ctx.stroke();
  ctx.strokeStyle = '#6a6a74'; ctx.lineWidth = 3; ctx.stroke();
  line(ctx, [px, hookY - 4, px, hookY - 2], IRON, 3);
}

/** A stevedore's iron weight: a squat round lump with a handle cast on it. Foot on y. */
function weight(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  contact(ctx, x, y, w * 1.2, 0.5);
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = w * 0.2 + 2; ctx.beginPath(); ctx.arc(x, y - w * 0.62, w * 0.28, Math.PI, 0); ctx.stroke();
  ctx.strokeStyle = IRON; ctx.lineWidth = w * 0.2; ctx.stroke();
  glossPoly(ctx, K, [x - w / 2, y, x - w / 2, y - w * 0.38, x - w * 0.36, y - w * 0.6, x + w * 0.36, y - w * 0.6, x + w / 2, y - w * 0.38, x + w / 2, y], IRON, { gloss: 0.45, spread: 0.7 });
}

/** A practice cutlass: a broad curved blade of ash, a basket guard bound in hide. Point up, hilt at (x, y). */
function wasterCutlass(ctx: CanvasRenderingContext2D, x: number, y: number, len: number): void {
  const w = 3.2, g = y - len * 0.22;
  glossPoly(ctx, K, [x - w, g, x - w * 0.6, y - len * 0.7, x + w * 0.6, y - len, x + w * 1.6, y - len * 0.72, x + w, g], '#b89a68', { gloss: 0.2, spread: 0.7 });
  glossPoly(ctx, K, [x - w * 0.7, y, x - w * 0.7, g, x + w * 0.7, g, x + w * 0.7, y], '#3a2416', {});
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(x - w * 1.4, g + len * 0.1, len * 0.11, -Math.PI * 0.5, Math.PI * 0.5); ctx.stroke();
  ctx.strokeStyle = '#7a5a3a'; ctx.lineWidth = 2; ctx.stroke();
}

export const TRAINING_LOFT: Scene = {
  ambient: ['#34364a', '#a8a8a2'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 198, TIE = 58;
    // The gable end: silvered boards upright, under the roof's two pitches.
    ctx.fillStyle = '#1a181c'; ctx.fillRect(0, 0, STAGE_W, FLOOR);
    planks(ctx, 0, 0, STAGE_W, FLOOR, SILVER, 22, true, 255);
    const roof = (sd: number): number[] => sd < 0 ? [0, 0, 200, 0, 0, 92] : [200, 0, STAGE_W, 0, STAGE_W, 92];
    for (const sd of [-1, 1]) fillPoly(ctx, roof(sd), shade(SILVER, 0.42));
    for (let i = 0; i < 7; i++) {
      const u = i / 6;
      line(ctx, [200 - u * 200, 0, -u * 4, 92 * u], rgba('#0a0608', 0.4), 1);
      line(ctx, [200 + u * 200, 0, STAGE_W + u * 4, 92 * u], rgba('#0a0608', 0.4), 1);
    }
    // The principal rafters, the collar and the tie beam the ropes hang from.
    for (const sd of [-1, 1]) {
      const pts = sd < 0 ? [196, -6, 206, -2, 8, 100, -4, 96] : [204, -6, 194, -2, 392, 100, 404, 96];
      glossPoly(ctx, K, pts, RAFTER, { gloss: 0.1, spread: 0.8 });
    }
    beam(ctx, 0, TIE, STAGE_W, 12, RAFTER, 258);
    beam(ctx, 196, 0, 8, TIE, RAFTER, 259);
    // The sanded floor, pale and scuffed, a ring worn in it where the bouts are fought.
    floorboards(ctx, FLOOR, 200, 92, '#c8b894', 10, 255);
    ctx.save(); ctx.beginPath(); ctx.rect(0, FLOOR, STAGE_W, STAGE_H - FLOOR); ctx.clip();
    for (let i = 0; i < 260; i++) { ctx.fillStyle = rgba(i % 3 ? '#e8dcb8' : '#8a7a5a', 0.5); ctx.fillRect(Math.round(rnd(260, i) * STAGE_W), Math.round(FLOOR + rnd(261, i) * (STAGE_H - FLOOR)), 1, 1); }
    ctx.strokeStyle = rgba('#7a6a4a', 0.4); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(200, 236, 104, 20, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
    // The loading door stood open in the gable, its shutters back, the quay below and the hoist over it.
    const dx = 160, dy = 92, dw = 80;
    ctx.fillStyle = '#120c14'; ctx.fillRect(dx - 3, dy - 3, dw + 6, FLOOR - dy + 3);
    ctx.save(); ctx.beginPath(); ctx.rect(dx, dy, dw, FLOOR - dy); ctx.clip(); quayFromAbove(ctx, dx, dy, dw, FLOOR - dy, s.daylight); ctx.restore();
    beam(ctx, dx - 8, dy - 8, dw + 16, 8, RAFTER, 262);
    slab(ctx, dx - 4, FLOOR - 6, dw + 8, 6, shade(RAFTER, 1.1), { lit: 1 });
    shutter(ctx, dx - 38, dy + 2, 32, 96, 263); shutter(ctx, dx + dw + 6, dy + 2, 32, 96, 264);
    if (s.daylight > 0.15) { pool(s, 200, 150, 240, DAY_POOL, 0.75 * s.daylight); pool(s, 200, 228, 150, '#e8e4d8', 0.35 * s.daylight); }
    hoist(ctx, 200, TIE + 12, 34, 168);
    // The practice blades on their pegs, left: wasters, cutlasses of ash, a boathook and a staff.
    beam(ctx, 14, 112, 100, 5, RAFTER, 265);
    for (let i = 0; i < 4; i++) sword(ctx, 24 + i * 12, 178, 58, { blade: '#b89a68', hilt: '#5a4a3a', w: 2.2 });
    for (let i = 0; i < 2; i++) wasterCutlass(ctx, 78 + i * 16, 180, 56);
    line(ctx, [108, 192, 110, 104], '#120c14', 4); line(ctx, [108, 192, 110, 104], '#8a6a42', 2.4);
    ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(114, 106, 4, Math.PI, Math.PI * 1.9); ctx.stroke(); ctx.strokeStyle = '#6a6a74'; ctx.lineWidth = 2; ctx.stroke();
    // Ropes and rings from the tie beam.
    rings(ctx, 300, TIE + 12, 150, 28);
    climbRope(ctx, 362, TIE + 12, 182, -4);
    // The stevedore's weights, right: bales to lift, iron weights, a cargo hook on a peg.
    sack(ctx, 300, FLOOR + 10, 44, 40, '#b8a478', { seed: 3 });
    sack(ctx, 342, FLOOR + 8, 40, 36, '#a89468', { seed: 4 });
    crate(ctx, 356, FLOOR - 6, 38, 30, '#8a7a5a', 5);
    weight(ctx, 280, FLOOR + 18, 20); weight(ctx, 306, FLOOR + 22, 16); weight(ctx, 386, FLOOR + 26, 24);
    glossBall(ctx, K, 262, 120, 2.5, '#4a3a2a', {});
    ctx.strokeStyle = '#120c14'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(262, 140, 7, Math.PI * 1.5, Math.PI * 0.95, false); ctx.stroke(); ctx.strokeStyle = '#6a6a74'; ctx.lineWidth = 2.5; ctx.stroke();
    line(ctx, [262, 122, 262, 133], '#120c14', 3); line(ctx, [262, 122, 262, 133], '#6a6a74', 1.5);
    // Lanterns on the tie beam for the evening's bouts.
    lantern(ctx, s, 140, 86, 10, '#3a3a40', TIE + 12, 150, '#ffe0a0');
    lantern(ctx, s, 300, 82, 10, '#3a3a40', TIE + 12, 150, '#ffe0a0');
    // A bench and a water bucket in the foreground, a towel over the bench.
    contact(ctx, 70, 262, 110, 0.35);
    slab(ctx, 10, 244, 120, 7, '#7a6a52', { lit: 2, dark: 0.3 });
    for (const lx of [18, 118]) slab(ctx, lx, 251, 6, STAGE_H - 251, '#5a4c3a', { lit: 1 });
    glossPoly(ctx, K, [40, 244, 66, 244, 68, 258, 62, 262, 46, 262, 38, 256], '#d8d0c0', { gloss: 0.1 });
    contact(ctx, 160, 266, 26);
    glossPoly(ctx, K, [148, 266, 146, 244, 174, 244, 172, 266], '#7a6a52', { gloss: 0.2, spread: 0.8 });
    for (const f of [0.25, 0.8]) line(ctx, [147, 266 - 22 * f, 173, 266 - 22 * f], IRON, 2);
    glossEllipse(ctx, K, 160, 244, 14, 3.5, '#3a5a6a', 0, { gloss: 0.6 });
    ctx.strokeStyle = '#120c14'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(160, 244, 12, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  },
};
