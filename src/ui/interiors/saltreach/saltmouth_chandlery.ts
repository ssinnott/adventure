// Saltmouth's provisioner, a chandlery on the quay: a warehouse with a counter at the front, rope in
// coils, blocks and tackle from the beams, casks of pitch and oil, hard tack in sacks, lanterns
// for sale, and the quay through the great door.
import { shade, rgba, mix } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, beam, planks, floorboards, skyFill, line, smudge, fillPoly, slab, pool, contact, DAY_POOL } from '../kit.ts';
import { K, counter, shelf, lantern, barrel, kegEnd, sack, crate, jar } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';

const BOARD = '#6a5a48', GREEN = '#4a6a5e', TAR = '#2e2622', HEMP = '#c8b080', BRASS = '#c8a048';

/** The quay through the great door: a hull alongside, its mast going up into the fog, bollards and the wet stones. */
function quay(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, daylight: number): void {
  skyFill(ctx, x, y, w, h, daylight, 291);
  ctx.fillStyle = mix('#121a26', '#566a74', daylight); ctx.fillRect(x, y + h * 0.5, w, h * 0.2);
  const hull = mix('#0c0a0c', '#4a3a2e', daylight);
  fillPoly(ctx, [x - 4, y + h * 0.48, x + w * 0.9, y + h * 0.44, x + w * 0.8, y + h * 0.66, x - 4, y + h * 0.68], hull);
  ctx.fillStyle = shade(hull, 1.4); ctx.fillRect(x, Math.round(y + h * 0.5), Math.round(w * 0.86), 2);
  ctx.fillStyle = hull; ctx.fillRect(Math.round(x + w * 0.4), y, 3, Math.round(h * 0.46));
  line(ctx, [x + w * 0.42, y + h * 0.04, x + w * 0.95, y + h * 0.44], rgba('#06080e', 0.7), 1);
  line(ctx, [x + w * 0.2, y + h * 0.16, x + w * 0.64, y + h * 0.16], rgba('#06080e', 0.8), 2);
  ctx.fillStyle = rgba(mix('#20262e', '#d4d8d4', daylight), 0.4); ctx.fillRect(x, y, w, h * 0.7);
  const stone = mix('#141418', '#7a7468', daylight);
  ctx.fillStyle = stone; ctx.fillRect(x, y + h * 0.7, w, h * 0.3);
  for (let r = 0; r < 4; r++) for (let i = 0; i < 6; i++) { ctx.fillStyle = shade(stone, 0.8 + rnd(292, r, i) * 0.4); ctx.fillRect(Math.round(x + (i + (r % 2) * 0.5) * w / 5), Math.round(y + h * (0.72 + r * 0.07)), Math.round(w / 6), 2); }
  for (const bx of [0.2, 0.72]) glossPoly(ctx, K, [x + w * bx - 5, y + h * 0.86, x + w * bx - 5, y + h * 0.76, x + w * bx - 3, y + h * 0.73, x + w * bx + 3, y + h * 0.73, x + w * bx + 5, y + h * 0.76, x + w * bx + 5, y + h * 0.86], mix('#0e0e12', '#3a3a40', daylight), {});
  if (daylight < 0.5) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; smudge(ctx, x + w * 0.6, y + h * 0.36, h * 0.12, '#ffc070', 0.6 * (1 - daylight * 2)); ctx.restore(); }
}

/** A coil of rope lying flaked down on the floor, centre of its top at (x, y). */
function coil(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, col = HEMP): void {
  contact(ctx, x, y + r * 0.5, r * 2.4, 0.45);
  for (let i = 0; i < 5; i++) {
    const ry = r * 0.36, yy = y + r * 0.4 - i * r * 0.14;
    ctx.strokeStyle = '#120c14'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, yy, r - i * 0.6, ry, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = i % 2 ? col : shade(col, 0.88); ctx.lineWidth = 2.5; ctx.stroke();
  }
  ctx.strokeStyle = rgba('#3a2a1a', 0.4); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y - r * 0.2, r * 0.45, r * 0.15, 0, 0, Math.PI * 2); ctx.stroke();
}

/** A coil hung on a peg from the wall, centre (x, y). */
function hungCoil(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, col = HEMP): void {
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = '#120c14'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, y + i * 1.5, r - i * 0.8, r * 1.1 - i * 0.6, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = i % 2 ? col : shade(col, 0.88); ctx.lineWidth = 2.5; ctx.stroke();
  }
  glossBall(ctx, K, x, y - r * 1.1, 2.5, '#4a3a2a', {});
}

/** A wooden block, a ship's pulley: the shell, its sheave showing, a hook on top. Hung from `top`, its top at y. */
function block(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, top: number): void {
  line(ctx, [x, top, x, y - s * 0.3], '#120c14', 2.5); line(ctx, [x, top, x, y - s * 0.3], HEMP, 1.2);
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y - s * 0.15, s * 0.18, Math.PI, 0); ctx.stroke();
  ctx.strokeStyle = '#6a6a74'; ctx.lineWidth = 1.5; ctx.stroke();
  glossEllipse(ctx, K, x, y + s * 0.55, s * 0.36, s * 0.55, '#9a7a4e', 0, { gloss: 0.3, spread: 0.7 });
  ctx.fillStyle = '#2a1a12'; ctx.fillRect(Math.round(x - 1), Math.round(y + s * 0.15), 2, Math.round(s * 0.8));
  glossBall(ctx, K, x, y + s * 0.5, s * 0.08, '#6a6a74', {});
}

/** An oil jar: a tall glazed amphora with a pinched neck and a cork, foot on y. */
function oilJar(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, glaze: string): void {
  const w = h * 0.5;
  contact(ctx, x, y, w * 1.1);
  glossPoly(ctx, K, [x - w * 0.18, y, x - w * 0.5, y - h * 0.4, x - w * 0.4, y - h * 0.72, x - w * 0.14, y - h * 0.84, x - w * 0.14, y - h * 0.94, x + w * 0.14, y - h * 0.94, x + w * 0.14, y - h * 0.84, x + w * 0.4, y - h * 0.72, x + w * 0.5, y - h * 0.4, x + w * 0.18, y], glaze, { gloss: 0.6, spread: 0.7 });
  ctx.fillStyle = '#a07850'; ctx.fillRect(Math.round(x - w * 0.12), Math.round(y - h), Math.round(w * 0.24), Math.round(h * 0.07));
  for (let i = 0; i < 3; i++) smudge(ctx, x + w * (0.1 - i * 0.12), y - h * (0.5 - i * 0.12), 2, '#2a1a10', 0.5);
}

/** A steelyard hung from the beam: the long arm, the hook with its sack, the poise slid out along the scale. */
function steelyard(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, top: number): void {
  line(ctx, [x, top, x, y], '#120c14', 2); line(ctx, [x, top, x, y], '#6a6a74', 1);
  const x0 = x - len * 0.2, x1 = x + len * 0.8, y0 = y + 2, y1 = y - 2;
  line(ctx, [x0, y0, x1, y1], '#120c14', 4); line(ctx, [x0, y0, x1, y1], BRASS, 2);
  for (let i = 1; i < 9; i++) { const u = 0.3 + i * 0.07; ctx.fillStyle = '#5a4a2a'; ctx.fillRect(Math.round(x0 + (x1 - x0) * u), Math.round(y0 + (y1 - y0) * u) - 2, 1, 2); }
  const px = x0 + (x1 - x0) * 0.72, py = y0 + (y1 - y0) * 0.72;
  line(ctx, [px, py, px, py + 8], '#120c14', 1.5);
  glossPoly(ctx, K, [px - 3, py + 8, px + 3, py + 8, px + 4, py + 16, px - 4, py + 16], '#4a4a52', { gloss: 0.5 });
  line(ctx, [x0, y0, x0, y0 + 12], '#120c14', 1.5);
  sack(ctx, x0, y0 + 40, 22, 28, '#b8a478', { seed: 9 });
}

/** The day-book open on the counter, its foot on y. */
function daybook(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  glossPoly(ctx, K, [x - w / 2, y, x - w * 0.45, y - w * 0.2, x + w * 0.45, y - w * 0.2, x + w / 2, y], '#2a3a3a', {});
  glossPoly(ctx, K, [x - w * 0.46, y - 2, x - w * 0.42, y - w * 0.18, x - 1, y - w * 0.15, x - 1, y - 1], '#ece4cc', {});
  glossPoly(ctx, K, [x + 1, y - 1, x + 1, y - w * 0.15, x + w * 0.42, y - w * 0.18, x + w * 0.46, y - 2], '#e4dcc4', {});
  for (let i = 0; i < 4; i++) for (const sd of [-1, 1]) line(ctx, [x + sd * w * 0.08, y - w * 0.14 + i * 2.6, x + sd * w * 0.38, y - w * 0.15 + i * 2.6], rgba('#3a2a30', 0.5), 1);
  line(ctx, [x + w * 0.2, y - 3, x + w * 0.6, y - w * 0.4], '#e8e0d0', 1.5);
}

export const CHANDLERY: Scene = {
  ambient: ['#30343c', '#9a9a94'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 188;
    // The warehouse: rough boards, sea-green paint flaking off them, beams overhead.
    planks(ctx, 0, 0, STAGE_W, FLOOR, BOARD, 20, true, 291);
    for (let i = 0; i < 40; i++) { const px = rnd(293, i) * STAGE_W, py = rnd(294, i) * FLOOR; ctx.fillStyle = rgba(GREEN, 0.55); ctx.fillRect(Math.round(px), Math.round(py), Math.round(8 + rnd(295, i) * 20), Math.round(3 + rnd(296, i) * 10)); }
    const g = ctx.createLinearGradient(0, 60, 0, FLOOR);
    g.addColorStop(0, rgba(GREEN, 0)); g.addColorStop(1, rgba(GREEN, 0.4));
    ctx.fillStyle = g; ctx.fillRect(0, 60, STAGE_W, FLOOR - 60);
    floorboards(ctx, FLOOR, 160, 90, '#7a6a56', 9, 291);
    beam(ctx, 0, 0, STAGE_W, 14, TAR, 297);
    beam(ctx, 0, 40, STAGE_W, 10, TAR, 298);
    for (const bx of [120, 270]) beam(ctx, bx, 50, 10, FLOOR - 50, TAR, bx);
    // The great door on the quay, right, its leaves folded back.
    const dx = 290, dy = 58, dw = 92;
    ctx.fillStyle = '#120c14'; ctx.fillRect(dx - 3, dy - 3, dw + 6, FLOOR - dy + 3);
    ctx.save(); ctx.beginPath(); ctx.rect(dx, dy, dw, FLOOR - dy); ctx.clip(); quay(ctx, dx, dy, dw, FLOOR - dy, s.daylight); ctx.restore();
    planks(ctx, dx - 18, dy, 15, FLOOR - dy, shade(GREEN, 0.9), 2, true, 299);
    planks(ctx, dx + dw + 3, dy, 15, FLOOR - dy, shade(GREEN, 0.9), 2, true, 300);
    if (s.daylight > 0.15) { pool(s, dx + dw / 2, 140, 230, DAY_POOL, 0.75 * s.daylight); pool(s, dx + dw / 2, 230, 140, '#e8e4d8', 0.35 * s.daylight); }
    // Stores stacked to the beam at the back: pitch casks, crates, hard tack in sacks.
    for (let i = 0; i < 3; i++) kegEnd(ctx, 20 + i * 34, FLOOR - 17, 16, i === 1 ? '#5a4a38' : TAR, '#2a2a30', '#5a5a62');
    for (let i = 0; i < 2; i++) kegEnd(ctx, 37 + i * 34, FLOOR - 47, 16, '#5a4a38', '#2a2a30', '#5a5a62');
    crate(ctx, 136, FLOOR, 46, 38, '#8a7a5a', 1);
    for (let i = 0; i < 3; i++) sack(ctx, 210 + i * 24, FLOOR + 2 - (i === 1 ? 0 : 0), 28, 32, i % 2 ? '#c0a87a' : '#b09868', { seed: 10 + i });
    sack(ctx, 222, FLOOR - 26, 26, 28, '#c8b088', { open: '#d8c49a', seed: 13 });
    // Coils and blocks: rope on its pegs along the wall, blocks and tackle down from the beam.
    for (let i = 0; i < 4; i++) hungCoil(ctx, 140 + i * 34, 82, 12, i % 2 ? HEMP : '#5a4a32');
    for (let i = 0; i < 3; i++) block(ctx, 22 + i * 40, 64 + (i % 2) * 14, 14, 50);
    steelyard(ctx, 240, 108, 38, 50);
    // The lanterns for sale on a rail, and one lit for the evening over the casks.
    beam(ctx, 132, 102, 96, 4, TAR, 301);
    for (let i = 0; i < 4; i++) {
      const lx = 144 + i * 22;
      line(ctx, [lx, 106, lx, 110], '#120c14', 2);
      glossPoly(ctx, K, [lx - 6, 116, lx - 3, 110, lx + 3, 110, lx + 6, 116], '#3a3a40', { gloss: 0.5 });
      ctx.fillStyle = mix('#4a5458', '#a8b8b8', 0.5); ctx.fillRect(lx - 5, 116, 10, 13);
      ctx.fillStyle = '#3a3a40'; for (const bx of [lx - 5, lx - 0.5, lx + 4]) ctx.fillRect(Math.round(bx), 116, 1, 13);
      glossPoly(ctx, K, [lx - 6, 129, lx + 6, 129, lx + 4, 132, lx - 4, 132], '#3a3a40', {});
    }
    lantern(ctx, s, 100, 104, 11, '#3a3a40', 50, 200, '#ffe0a0');
    // The counter at the front, with the day-book, the oil jars and a coil off the shelf.
    counter(ctx, 0, 262, 204, 10, STAGE_H + 4, TAR, 302, { panels: 3 });
    daybook(ctx, 86, 214, 46);
    oilJar(ctx, 150, 214, 28, '#7a5a3a'); oilJar(ctx, 172, 214, 24, '#4a5a4a');
    jar(ctx, 196, 214, 14, 16, '#3a3030', '#2a2020');
    coil(ctx, 234, 206, 14, '#5a4a32');
    glossBall(ctx, K, 30, 210, 4, '#e8dcc0', { gloss: 0.2 }); glossBall(ctx, K, 40, 211, 4, '#e0d4b4', { gloss: 0.2 });
    // On the floor by the door: a great coil and a cask of tar with its lid off.
    coil(ctx, 312, 236, 30);
    barrel(ctx, 372, STAGE_H + 4, 42, 50, TAR, '#2a2a30');
    glossEllipse(ctx, K, 372, STAGE_H - 46, 19, 4.5, '#120c10', 0, { gloss: 0.8 });
  },
};
