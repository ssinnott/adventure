// Saltmouth's harbour tavern, which is the Salt Compact's hall to those who know: a low stone
// vault against the sea wall, casks, a fire, a card table and sawdust, and at the back a door ajar
// on the fence's room, its scales and its crates under the customs seal.
import { shade, rgba, mix } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, beam, planks, stones, flagstones, windowIn, skyFill, line, smudge, fillPoly, slab, pool, contact } from '../kit.ts';
import { K, shelf, bottle, tankard, kegEnd, crate, hearth, stool, lantern, candle } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { table, bottleCandle } from '../taverns.ts';

const VAULT = '#76746c', OAK = '#4a3a2c', SEAL = '#a82a22';

/** The low vault overhead: a dark curve of stone springing from both walls. */
function vault(ctx: CanvasRenderingContext2D, spring: number): void {
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(STAGE_W, 0); ctx.lineTo(STAGE_W, spring);
  ctx.ellipse(STAGE_W / 2, spring, STAGE_W / 2, spring - 6, 0, 0, Math.PI, true); ctx.closePath();
  ctx.fillStyle = shade(VAULT, 0.45); ctx.fill();
  ctx.save(); ctx.clip();
  for (let i = 0; i < 9; i++) { const u = i / 8, a = Math.PI + u * Math.PI; line(ctx, [STAGE_W / 2 + Math.cos(a) * STAGE_W / 2, spring + Math.sin(a) * (spring - 6), STAGE_W / 2 + Math.cos(a) * STAGE_W * 0.7, spring + Math.sin(a) * spring * 1.6], rgba('#0a0808', 0.5), 1); }
  ctx.restore();
  ctx.beginPath(); ctx.ellipse(STAGE_W / 2, spring, STAGE_W / 2, spring - 6, 0, Math.PI, 0); ctx.strokeStyle = '#120c14'; ctx.lineWidth = 2; ctx.stroke();
}

/** A crate under the customs seal: a cord round it and a disc of red wax stamped where the cord crosses. */
function sealedCrate(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seed: number): void {
  crate(ctx, x, y, w, h, '#8a7a5a', seed);
  line(ctx, [x + w / 2, y - h, x + w / 2, y], '#c8b890', 1.2); line(ctx, [x, y - h / 2, x + w, y - h / 2], '#c8b890', 1.2);
  glossBall(ctx, K, x + w / 2, y - h / 2, Math.max(2.5, w * 0.1), SEAL, { gloss: 0.6 });
  ctx.fillStyle = shade(SEAL, 0.7); ctx.fillRect(Math.round(x + w / 2) - 1, Math.round(y - h / 2) - 1, 2, 2);
}

/** The fence's scales, a big brass balance on its post, its pans level. Foot on y. */
function balance(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  const brass = '#c8a048';
  slab(ctx, x - h * 0.2, y - h * 0.08, h * 0.4, h * 0.08, OAK, { lit: 1 });
  line(ctx, [x, y - h * 0.08, x, y - h], '#120c14', 3.5); line(ctx, [x, y - h * 0.08, x, y - h], brass, 2);
  line(ctx, [x - h * 0.45, y - h * 0.92, x + h * 0.45, y - h * 0.92], '#120c14', 3.5); line(ctx, [x - h * 0.45, y - h * 0.92, x + h * 0.45, y - h * 0.92], brass, 2);
  for (const sd of [-1, 1]) {
    const px = x + sd * h * 0.45, pan = y - h * 0.5;
    line(ctx, [px, y - h * 0.92, px - h * 0.1, pan], '#8a7a4a', 1); line(ctx, [px, y - h * 0.92, px + h * 0.1, pan], '#8a7a4a', 1);
    glossPoly(ctx, K, [px - h * 0.14, pan, px + h * 0.14, pan, px + h * 0.09, pan + h * 0.06, px - h * 0.09, pan + h * 0.06], brass, { gloss: 0.7 });
  }
  for (let i = 0; i < 3; i++) glossEllipse(ctx, K, x - h * 0.45, y - h * 0.5 - 1 - i * 1.5, 3, 1.2, '#e0b840', 0, { gloss: 0.7 });
}

/** The fence's room through the door ajar: lamplit, crates under the seal stacked against its wall, the scales on a table. */
function backRoom(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = '#2a2420'; ctx.fillRect(x, y, w, h);
  stones(ctx, x, y, w, h * 0.78, '#6a5a4a', 6, 351);
  flagstones(ctx, y + h * 0.78, x + w / 2, y + h * 0.4, '#5a5048', 4, 352);
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  sealedCrate(ctx, x + 4, y + h * 0.86, 30, 26, 1); sealedCrate(ctx, x + 8, y + h * 0.86 - 26, 24, 20, 2);
  sealedCrate(ctx, x + 30, y + h * 0.9, 22, 18, 3);
  slab(ctx, x + w * 0.56, y + h * 0.62, w * 0.44, 5, OAK, { lit: 1 });
  for (const lx of [x + w * 0.6, x + w * 0.94]) line(ctx, [lx, y + h * 0.62 + 5, lx, y + h * 0.9], '#120c14', 3);
  balance(ctx, x + w * 0.78, y + h * 0.62, 30);
  const g = ctx.createRadialGradient(x + w * 0.7, y + h * 0.3, 2, x + w * 0.7, y + h * 0.3, w);
  g.addColorStop(0, rgba('#ffd890', 0.35)); g.addColorStop(1, rgba('#ffd890', 0));
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  ctx.restore();
  lantern(ctx, s, x + w * 0.7, y + 8, 7, '#3a3a40', y, 90, '#ffe0a0');
}

/** A hand of cards fanned on the table and the rest of the deck squared beside it. */
function cards(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  for (let i = 0; i < 5; i++) {
    const a = -0.5 + i * 0.25, cx = x + Math.sin(a) * 6, cy = y - Math.cos(a) * 2;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(a);
    ctx.fillStyle = '#ece4d0'; ctx.fillRect(-3, -7, 6, 8); ctx.strokeStyle = '#120c14'; ctx.lineWidth = 0.8; ctx.strokeRect(-3, -7, 6, 8);
    ctx.fillStyle = i % 2 ? '#a82a22' : '#1a1a20'; ctx.fillRect(-1, -5, 2, 2);
    ctx.restore();
  }
  slab(ctx, x + 18, y - 4, 8, 4, '#3a4a6a', { lit: 1 });
}

export const HARBOUR_TAVERN: Scene = {
  ambient: ['#2a262c', '#625e5c'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 194;
    // Rough grey stone against the sea wall, under a low vault, sawdust on the floor.
    stones(ctx, 0, 0, STAGE_W, FLOOR, VAULT, 11, 353, { long: 1.3, mottle: '#4a5a4a' });
    const damp = ctx.createLinearGradient(0, FLOOR - 30, 0, FLOOR);
    damp.addColorStop(0, rgba('#1a2018', 0)); damp.addColorStop(1, rgba('#1a2018', 0.4));
    ctx.fillStyle = damp; ctx.fillRect(0, FLOOR - 30, STAGE_W, 30);
    vault(ctx, 64);
    flagstones(ctx, FLOOR, 200, 100, '#6a645a', 7, 353);
    ctx.save(); ctx.beginPath(); ctx.rect(0, FLOOR, STAGE_W, STAGE_H - FLOOR); ctx.clip();
    for (let i = 0; i < 320; i++) { ctx.fillStyle = rgba(i % 3 ? '#c8aa7a' : '#a88a5a', 0.6); ctx.fillRect(Math.round(rnd(354, i) * STAGE_W), Math.round(FLOOR + rnd(355, i) * (STAGE_H - FLOOR)), 1 + (i % 4 === 0 ? 1 : 0), 1); }
    ctx.restore();
    // The fire, left, in a plain hearth: what lights the room at night.
    const fb = hearth(ctx, s, 8, 70, 104, FLOOR + 4, '#7a7468', 353, { mantel: OAK, reach: 260 });
    const mantelY = fb.y - fb.w * 0.36;
    bottle(ctx, 22, mantelY, 16, '#2a4a3a'); tankard(ctx, 44, mantelY, 12, '#8a8e96', { band: '#5a5e68' }); bottle(ctx, 96, mantelY, 14, '#3a5a3a', { squat: true });
    // A small shuttered window high in the sea wall, on the fog.
    windowIn(ctx, s, 132, 70, 30, 30, OAK, { panes: [2, 2], view: (c) => { skyFill(c, 132, 70, 30, 30, s.daylight, 356); c.fillStyle = rgba(mix('#2a3038', '#d4d8d4', s.daylight), 0.5); c.fillRect(132, 70, 30, 30); } });
    planks(ctx, 120, 68, 10, 34, OAK, 1, true, 357);
    // At the back, the door ajar on the fence's room.
    const dx = 192, dy = 92, dw = 76;
    ctx.fillStyle = '#120c14'; ctx.fillRect(dx - 3, dy - 3, dw + 6, FLOOR - dy + 3);
    backRoom(ctx, s, dx, dy, dw, FLOOR - dy);
    beam(ctx, dx - 6, dy - 8, dw + 12, 8, OAK, 358);
    planks(ctx, dx - 18, dy + 2, 15, FLOOR - dy - 2, shade(OAK, 0.9), 2, true, 359);
    glossBall(ctx, K, dx - 8, dy + (FLOOR - dy) / 2, 2, '#3a3a40', {});
    pool(s, dx + dw * 0.7, FLOOR - 30, 70, '#ffd890', 0.4);
    // The casks, right, racked to the vault, and the shelf of green bottles.
    for (let i = 0; i < 3; i++) kegEnd(ctx, 292 + i * 38, FLOOR - 18, 18, '#5a4a38', '#2a2a30', '#8a8a96');
    for (let i = 0; i < 2; i++) kegEnd(ctx, 311 + i * 38, FLOOR - 54, 18, '#5a4a38', '#2a2a30', '#8a8a96');
    beam(ctx, 272, FLOOR - 2, 128, 4, OAK, 360);
    shelf(ctx, 274, 104, 118, OAK);
    for (let i = 0; i < 8; i++) bottle(ctx, 284 + i * 14.5, 104, 14 + rnd(361, i) * 6, i % 3 ? '#2a4a3a' : '#3a5a2a', { squat: i % 4 === 3 });
    lantern(ctx, s, 262, 70, 8, '#3a3a40', 40, 110, '#ffd890');
    // The card table in the foreground: a hand fanned, coin on the board, the night's drink and a candle in a bottle.
    table(ctx, 170, 238, 120, OAK);
    cards(ctx, 140, 238);
    for (let i = 0; i < 4; i++) glossEllipse(ctx, K, 186 + i * 3, 243 - i * 1.4, 3.5, 1.4, '#e0b840', 0, { gloss: 0.7 });
    tankard(ctx, 206, 236, 13, '#8a8e96', { band: '#5a5e68' }); tankard(ctx, 124, 244, 12, '#6a4a30', { band: '#2a1e18', handleLeft: true });
    bottleCandle(ctx, s, 170, 232, 12);
    stool(ctx, 92, 268, 30, '#5a4a38'); stool(ctx, 252, 268, 30, '#5a4a38');
    // The trapdoor in the floor, right, with its iron ring: a cellar under a cellar.
    fillPoly(ctx, [300, 222, 372, 222, 386, 258, 290, 258], shade(OAK, 0.85));
    for (let i = 1; i < 4; i++) line(ctx, [300 + i * 18, 222, 290 + i * 24, 258], rgba('#0a0606', 0.6), 1);
    for (const yy of [230, 250]) line(ctx, [298, yy, 378, yy], '#3a3a40', 2.5);
    ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(338, 242, 7, 3, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#6a6a74'; ctx.lineWidth = 1.5; ctx.stroke();
    line(ctx, [300, 222, 372, 222, 386, 258, 290, 258, 300, 222], '#120c14', 1);
    contact(ctx, 338, 258, 90, 0.2);
    candle(ctx, s, 380, 196, 10, '#e8dcc0', 80);
    smudge(ctx, 60, FLOOR + 16, 70, '#ff9a48', 0.2);
  },
};
