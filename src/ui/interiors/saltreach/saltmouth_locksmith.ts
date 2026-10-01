// Saltmouth's locksmith, where the Thief first trains: a narrow walnut room, a wall of keys and
// padlocks, a strongbox stood open on its wards, and the bench under a lamp whose water-globe
// throws one bright spot on the work.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, beam, planks, floorboards, windowIn, skyFill, line, smudge, fillPoly, slab, pool, contact, flame } from '../kit.ts';
import { K, shelf, jar, bottle } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';

const WALNUT = '#3e2a20', BRASS = '#c8a048', IRON = '#4a4a54', STEEL = '#a8b0bc';

/** A key hung by its bow from a pin at (x, y), `len` long: the bow, the shank, the bit. */
function key(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, metal: string, seed: number): void {
  const r = len * 0.17;
  glossBall(ctx, K, x, y - 1, 1.2, '#2a2228', {});
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y + r, r, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = metal; ctx.lineWidth = 1.6; ctx.stroke();
  line(ctx, [x, y + r * 2, x, y + len], '#120c14', 3); line(ctx, [x, y + r * 2, x, y + len], metal, 1.6);
  const bits = 1 + Math.floor(rnd(seed, 1) * 3);
  for (let i = 0; i < bits; i++) fillPoly(ctx, [x, y + len - i * 3, x + 3 + rnd(seed, i, 2) * 3, y + len - i * 3, x + 3 + rnd(seed, i, 2) * 3, y + len - i * 3 - 2, x, y + len - i * 3 - 2], metal);
}

/** A padlock hung from a pin: the shackle and the body with its keyhole. Top of the shackle at y. */
function padlock(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, metal: string): void {
  glossBall(ctx, K, x, y - 1, 1.2, '#2a2228', {});
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = w * 0.22 + 2; ctx.beginPath(); ctx.arc(x, y + w * 0.4, w * 0.3, Math.PI, 0); ctx.stroke();
  ctx.strokeStyle = STEEL; ctx.lineWidth = w * 0.22; ctx.stroke();
  glossPoly(ctx, K, [x - w / 2, y + w * 0.4, x + w / 2, y + w * 0.4, x + w / 2, y + w * 1.1, x - w / 2, y + w * 1.1], metal, { gloss: 0.6, spread: 0.6 });
  ctx.fillStyle = '#120c14'; ctx.fillRect(Math.round(x) - 1, Math.round(y + w * 0.62), 2, Math.max(2, Math.round(w * 0.24)));
}

/** The strongbox stood open: an iron box, its door swung out to the right showing the bolts and levers of the works. Foot on y. */
function strongbox(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  contact(ctx, x + w / 2, y, w * 1.2, 0.5);
  slab(ctx, x, y - h, w, h, IRON, { lit: 2, dark: 0.25 });
  for (let i = 0; i < 4; i++) for (const yy of [y - h + 4, y - 6]) glossBall(ctx, K, x + 6 + i * (w - 12) / 3, yy, 1.8, '#6a6a74', {});
  // The inside: dark, a shelf, a bag of coin.
  ctx.fillStyle = '#1a161c'; ctx.fillRect(x + 6, y - h + 10, w - 12, h - 20);
  line(ctx, [x + 6, y - h * 0.5, x + w - 6, y - h * 0.5], '#3a3640', 2);
  glossPoly(ctx, K, [x + w * 0.3, y - 12, x + w * 0.26, y - h * 0.3, x + w * 0.4, y - h * 0.38, x + w * 0.54, y - h * 0.3, x + w * 0.5, y - 12], '#7a5a3a', { gloss: 0.1 });
  // The door, open toward us, its back plate off to show the works.
  const dx = x + w, dw = w * 0.55;
  glossPoly(ctx, K, [dx, y - h, dx + dw, y - h + 8, dx + dw, y + 6, dx, y], shade(IRON, 1.1), { gloss: 0.4, spread: 0.7 });
  fillPoly(ctx, [dx + 4, y - h + 8, dx + dw - 4, y - h + 14, dx + dw - 4, y - 2, dx + 4, y - 8], '#2a262c');
  for (let i = 0; i < 3; i++) {
    const by = y - h + 22 + i * (h - 40) / 2;
    glossPoly(ctx, K, [dx + 2, by - 2, dx + dw - 8, by + 2, dx + dw - 8, by + 6, dx + 2, by + 2], STEEL, { gloss: 0.7 });
  }
  for (let i = 0; i < 4; i++) glossPoly(ctx, K, [dx + 8 + i * 5, y - h * 0.55, dx + 11 + i * 5, y - h * 0.55, dx + 11 + i * 5, y - h * 0.3 + i * 2, dx + 8 + i * 5, y - h * 0.3 + i * 2], BRASS, { gloss: 0.7 });
  glossBall(ctx, K, dx + dw * 0.5, y - h * 0.2, 4, BRASS, { gloss: 0.7 });
}

/** The bench vice, jaws up, bolted to the bench's edge at (x, y). */
function vice(ctx: CanvasRenderingContext2D, x: number, y: number, s: number): void {
  glossPoly(ctx, K, [x - s, y, x - s, y - s * 0.6, x + s * 0.2, y - s * 0.6, x + s * 0.2, y], IRON, { gloss: 0.5 });
  for (const sd of [-1, 1]) glossPoly(ctx, K, [x - s * 0.4 + sd * s * 0.22 - s * 0.16, y - s * 0.6, x - s * 0.4 + sd * s * 0.22 - s * 0.16, y - s * 1.3, x - s * 0.4 + sd * s * 0.22 + s * 0.16, y - s * 1.3, x - s * 0.4 + sd * s * 0.22 + s * 0.16, y - s * 0.6], shade(IRON, 1.15), { gloss: 0.5 });
  glossPoly(ctx, K, [x - s * 0.5, y - s * 1.3, x - s * 0.5, y - s * 1.55, x - s * 0.3, y - s * 1.55, x - s * 0.3, y - s * 1.3], BRASS, { gloss: 0.6 });
  line(ctx, [x + s * 0.2, y - s * 0.95, x + s * 1.1, y - s * 0.95], '#120c14', 3.5); line(ctx, [x + s * 0.2, y - s * 0.95, x + s * 1.1, y - s * 0.95], STEEL, 2);
  glossBall(ctx, K, x + s * 1.1, y - s * 0.95, 2.4, STEEL, {});
}

/** The roll of small tools laid open: leather with picks, rakes and tension wrenches in its pockets. */
function toolRoll(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  const d = 14;
  glossPoly(ctx, K, [x, y, x + 6, y - d, x + w + 6, y - d, x + w, y], '#7a4a2a', { gloss: 0.1 });
  for (let i = 0; i < 9; i++) {
    const px = x + 8 + i * (w - 12) / 9;
    line(ctx, [px, y - 2, px + 4, y - d - 6 - (i % 3) * 2], '#120c14', 2.5);
    line(ctx, [px, y - 2, px + 4, y - d - 6 - (i % 3) * 2], i % 4 === 0 ? BRASS : STEEL, 1.2);
    if (i % 2) fillPoly(ctx, [px + 3, y - d - 6 - (i % 3) * 2, px + 7, y - d - 8 - (i % 3) * 2, px + 5, y - d - 4 - (i % 3) * 2], STEEL);
  }
  fillPoly(ctx, [x, y, x + 3, y - 6, x + w + 3, y - 6, x + w, y], '#6a3a20');
  line(ctx, [x + w, y - 2, x + w + 22, y + 2], '#5a3018', 2);
}

/** A lock in pieces: the case off, the levers fanned out, a spring, two screws and the bolt. Centre (x, y). */
function lockParts(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  glossPoly(ctx, K, [x - 18, y, x - 16, y - 12, x + 2, y - 12, x, y], BRASS, { gloss: 0.6 });
  fillPoly(ctx, [x - 14, y - 3, x - 13, y - 10, x - 3, y - 10, x - 4, y - 3], '#2a2228');
  for (let i = 0; i < 4; i++) glossPoly(ctx, K, [x + 6 + i * 2, y - 2, x + 10 + i * 5, y - 14 + i, x + 13 + i * 5, y - 13 + i, x + 9 + i * 2, y - 1], i % 2 ? BRASS : shade(BRASS, 0.85), { gloss: 0.6 });
  glossPoly(ctx, K, [x + 32, y - 2, x + 32, y - 7, x + 46, y - 7, x + 46, y - 2], STEEL, { gloss: 0.6 });
  ctx.strokeStyle = STEEL; ctx.lineWidth = 1; ctx.beginPath();
  for (let i = 0; i <= 12; i++) { const px = x - 30 + i * 1.5, py = y - 3 + (i % 2 ? -2 : 2); if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
  ctx.stroke();
  for (const sx of [x - 34, x + 24]) glossBall(ctx, K, sx, y - 1, 1.6, '#8a8a94', {});
}

/** The bench lamp behind its globe of water: the flame, the glass ball full of water, and the bright spot it throws on the work. */
function globeLamp(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, spotX: number, spotY: number): void {
  // The oil lamp, behind.
  glossPoly(ctx, K, [x + 16, y, x + 12, y - 8, x + 28, y - 8, x + 24, y], BRASS, { gloss: 0.6 });
  line(ctx, [x + 20, y - 8, x + 20, y - 12], '#2a2020', 1);
  flame(s, x + 20, y - 13, 2.5, 110, 0.75);
  // The globe on its stand, in front of the flame.
  line(ctx, [x, y, x, y - 14], '#120c14', 4); line(ctx, [x, y, x, y - 14], WALNUT, 2.5);
  glossEllipse(ctx, K, x, y, 8, 2.5, WALNUT, 0, {});
  const gy = y - 24;
  const g = ctx.createRadialGradient(x - 3, gy - 3, 1, x, gy, 11);
  g.addColorStop(0, '#f4fbff'); g.addColorStop(0.4, '#b8d4e0'); g.addColorStop(1, '#5a7a8a');
  ctx.beginPath(); ctx.arc(x, gy, 11, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = rgba('#ffffff', 0.85); ctx.fillRect(Math.round(x - 5), Math.round(gy - 6), 2, 2);
  s.lights.push({ k: 'glow', x, y: gy, r: 16, color: '#fff0c0', a: 0.4 });
  // The spot it throws: a small hard pool on the bench.
  fillPoly(ctx, [x - 8, gy + 4, spotX - 14, spotY - 3, spotX + 14, spotY + 3, x + 8, gy + 8], rgba('#fff4d0', 0.08));
  s.lights.push({ k: 'glow', x: spotX, y: spotY, r: 18, color: '#fff2c8', a: 0.45 });
  pool(s, spotX, spotY, 46, '#fff4d8', 1);
  pool(s, x, gy, 120, '#ffc880', 0.5);
}

export const LOCKSMITH: Scene = {
  ambient: ['#2e2a34', '#7e7872'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 196;
    // A narrow room, panelled in walnut gone near black, a low beam and a small barred window high up.
    planks(ctx, 0, 0, STAGE_W, FLOOR, WALNUT, 18, true, 311);
    beam(ctx, 0, 0, STAGE_W, 14, shade(WALNUT, 0.8), 312);
    beam(ctx, 0, 132, STAGE_W, 6, shade(WALNUT, 1.2), 313);
    floorboards(ctx, FLOOR, 200, 110, '#4a3428', 8, 311);
    windowIn(ctx, s, 30, 34, 44, 34, shade(WALNUT, 1.3), { panes: [1, 1], view: (c) => { skyFill(c, 30, 34, 44, 34, s.daylight, 314); c.fillStyle = rgba('#c8ccc8', 0.5 * s.daylight + 0.1); c.fillRect(30, 34, 44, 34); } });
    for (let i = 1; i < 4; i++) { line(ctx, [30 + i * 11, 34, 30 + i * 11, 68], '#120c14', 3.5); line(ctx, [30 + i * 11, 34, 30 + i * 11, 68], '#5a5a62', 2); }
    // The wall of keys: a board of pins, rank on rank, and padlocks along its foot.
    slab(ctx, 98, 24, 196, 102, shade(WALNUT, 1.25), { lit: 2, dark: 0.08 });
    for (let r = 0; r < 3; r++) for (let i = 0; i < 16; i++) {
      const kx = 108 + i * 11.6 + (r % 2) * 4, seed = r * 31 + i;
      key(ctx, kx, 32 + r * 26, 14 + rnd(315, seed) * 8, rnd(316, seed) > 0.6 ? STEEL : rnd(317, seed) > 0.3 ? BRASS : '#8a6a3a', seed);
    }
    for (let i = 0; i < 7; i++) padlock(ctx, 112 + i * 26, 106, 10 + (i % 3) * 2, i % 2 ? BRASS : '#6a6a74');
    // Right: a shelf of oils over the bench's end.
    shelf(ctx, 304, 62, 90, shade(WALNUT, 1.3));
    jar(ctx, 316, 62, 10, 12, '#5a4a3a', '#2a2020'); bottle(ctx, 336, 62, 16, '#8a6a2a', { squat: true }); jar(ctx, 358, 62, 12, 10, '#3a3a40'); bottle(ctx, 380, 62, 14, '#3a5a4a');
    // A lock on the wall, as big as a door's, cut open to show its levers: the shop's sign within.
    slab(ctx, 22, 84, 56, 40, BRASS, { lit: 2, dark: 0.25 });
    fillPoly(ctx, [28, 90, 72, 90, 72, 118, 28, 118], '#2a2228');
    for (let i = 0; i < 4; i++) glossPoly(ctx, K, [32, 94 + i * 5, 58 + i * 2, 96 + i * 5, 58 + i * 2, 99 + i * 5, 32, 97 + i * 5], i % 2 ? BRASS : shade(BRASS, 0.8), { gloss: 0.6 });
    glossPoly(ctx, K, [58, 106, 74, 106, 74, 112, 58, 112], STEEL, { gloss: 0.7 });
    // The bench across the front: the vice, the tool roll, a lock in pieces under the lamp's spot, the strongbox stood open on its wards.
    slab(ctx, 0, 206, STAGE_W, 10, shade(WALNUT, 1.5), { lit: 2, dark: 0.3 });
    fillPoly(ctx, [0, 206, 8, 192, STAGE_W - 8, 192, STAGE_W, 206], shade(WALNUT, 1.7));
    for (let i = 0; i < 6; i++) line(ctx, [20 + rnd(318, i) * 340, 196 + rnd(319, i) * 8, 40 + rnd(318, i) * 340, 197 + rnd(320, i) * 8], rgba('#1a1210', 0.4), 1);
    planks(ctx, 0, 216, STAGE_W, STAGE_H - 216, shade(WALNUT, 1.1), 2, false, 321);
    // Its drawers of blanks and wards, brass pulls on each.
    for (let i = 0; i < 4; i++) { const x = 14 + i * 98; slab(ctx, x, 224, 82, 30, shade(WALNUT, 1.25), { lit: 1, dark: 0.2 }); glossBall(ctx, K, x + 41, 239, 3, BRASS, { gloss: 0.7 }); }
    vice(ctx, 48, 206, 18);
    toolRoll(ctx, 98, 204, 84);
    lockParts(ctx, 238, 204);
    globeLamp(ctx, s, 300, 202, 238, 198);
    strongbox(ctx, 326, 200, 42, 48);
    smudge(ctx, 238, 200, 30, '#fff4d8', 0.18);
  },
};
