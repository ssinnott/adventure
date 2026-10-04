// Kilnhaven's training hall, to 19: an ore shed off the quay given over to it, tarred boards under
// a row of high windows, the crane beam still across it with an ore tub on the hoist to hit, a
// ring roped off on boards red with the ore's dust, practice cutlasses and boarding axes on the
// wall, baskets of ore to lift and sacks of it stacked at the back.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, beam, planks, floorboards, skyFill, line, fillPoly, inkRect, slab, pool, contact, DAY_POOL } from '../kit.ts';
import { K, lantern, sack } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { TAR, ORE, IRON, HEMP, oreDust, oreLump } from './port.ts';

const FLOOR = 206, WOOD = '#5e5248', ASH = '#a08a64';

/** The high windows under the eaves, small panes of grey sky; by day the light slants down from each. */
function clerestory(ctx: CanvasRenderingContext2D, s: Stage, xs: readonly number[], y: number, w: number, h: number): void {
  for (const x of xs) {
    slab(ctx, x - 4, y - 4, w + 8, h + 8, TAR, { lit: 1, dark: 0.2 });
    skyFill(ctx, x, y, w, h, s.daylight, Math.round(x));
    ctx.fillStyle = rgba('#c8d4dc', 0.2 * s.daylight); ctx.fillRect(x, y, w, h);
    ctx.fillStyle = TAR; ctx.fillRect(Math.round(x + w / 2) - 1, y, 2, h); ctx.fillRect(x, Math.round(y + h / 2) - 1, w, 2);
    inkRect(ctx, x, y, w, h);
  }
  if (s.daylight <= 0.15) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const x of xs) {
    const g = ctx.createLinearGradient(0, y + h, 0, FLOOR + 30); g.addColorStop(0, rgba('#e0ecff', 0.2 * s.daylight)); g.addColorStop(1, rgba('#e0ecff', 0));
    fillPoly(ctx, [x, y + h, x + w, y + h, x + w + 50, FLOOR + 30, x + 34, FLOOR + 30], g);
  }
  ctx.restore();
  for (const x of xs) pool(s, x + w / 2 + 30, FLOOR - 20, 110, DAY_POOL, 0.6 * s.daylight);
  pool(s, 200, 40, 260, DAY_POOL, 0.5 * s.daylight);
}

/** The crane beam across the shed with its trolley and hoist chain, and the ore tub hung from it to be hit. The tub's rim at y. */
function hoistAndTub(ctx: CanvasRenderingContext2D, x: number, beamY: number, y: number, w: number): void {
  beam(ctx, 0, beamY, STAGE_W, 12, shade(TAR, 1.2), 871);
  for (const px of [6, 388]) slab(ctx, px, beamY + 12, 6, 10, IRON, { lit: 1 });
  // The trolley: two wheels on the beam's top and a block under it.
  for (const dx of [-8, 8]) glossBall(ctx, K, x + dx, beamY - 2, 4, IRON, { gloss: 0.5 });
  slab(ctx, x - 12, beamY + 12, 24, 10, IRON, { lit: 1 });
  line(ctx, [x, beamY + 22, x, y - w * 0.4], '#120c14', 2.5);
  for (let cy = beamY + 24; cy < y - w * 0.4; cy += 4) { ctx.fillStyle = (cy / 4) % 2 ? '#6a6a72' : '#4a4a52'; ctx.fillRect(Math.round(x) - 1, Math.round(cy), 3, 3); }
  // The bail and the tub of riveted iron, its ore heaped, dented where it has been hit.
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - w * 0.5, y + 2); ctx.quadraticCurveTo(x, y - w * 0.7, x + w * 0.5, y + 2); ctx.stroke();
  ctx.strokeStyle = shade(IRON, 1.5); ctx.lineWidth = 2; ctx.stroke();
  for (let i = 0; i < 12; i++) { const u = rnd(872, i); oreLump(ctx, x - w * 0.4 + u * w * 0.8, y - 1 - Math.sin(u * Math.PI) * 6 - rnd(888, i) * 3, 3.6, 872 + i); }
  glossPoly(ctx, K, [x - w * 0.5, y, x + w * 0.5, y, x + w * 0.42, y + w * 0.9, x - w * 0.42, y + w * 0.9], '#4a4448', { gloss: 0.35, spread: 0.7 });
  for (const f of [0.15, 0.85]) { const yy = y + w * 0.9 * f, half = w * (0.5 - f * 0.08); for (let i = 0; i < 6; i++) glossBall(ctx, K, x - half + 3 + (i * (half * 2 - 6)) / 5, yy, 1, '#8a8a92', {}); }
  glossEllipse(ctx, K, x + w * 0.1, y + w * 0.45, w * 0.12, w * 0.08, '#3a3438', 0, {});
  oreDust(ctx, x - w * 0.42, y + w * 0.5, w * 0.84, w * 0.4, 873, 0.6);
}

/**
 * The ring: four posts and two ropes round, the near posts tall at its front corners and the far
 * ones shorter behind, its boards dusted red. Near posts at nx0 and nx1 standing on ny, far ones
 * at fx0 and fx1 on fy.
 */
function ring(ctx: CanvasRenderingContext2D, nx0: number, nx1: number, ny: number, fx0: number, fx1: number, fy: number): void {
  const nh = 64, fh = 46;
  fillPoly(ctx, [fx0, fy, fx1, fy, nx1, ny, nx0, ny], rgba(ORE, 0.25));
  const post = (x: number, y: number, h: number, w: number): void => { contact(ctx, x, y, w * 3, 0.5); beam(ctx, x - w / 2, y - h, w, h, WOOD, Math.round(x)); glossBall(ctx, K, x, y - h, w * 0.6, shade(WOOD, 1.1), { gloss: 0.2 }); };
  const rope = (pts: number[]): void => { line(ctx, pts, '#120c14', 3); line(ctx, pts, HEMP, 1.6); };
  post(fx0, fy, fh, 7); post(fx1, fy, fh, 7);
  for (const f of [0.45, 0.8]) rope([fx0, fy - fh * f, fx1, fy - fh * f]);
  for (const f of [0.45, 0.8]) { rope([nx0, ny - nh * f, fx0, fy - fh * f]); rope([nx1, ny - nh * f, fx1, fy - fh * f]); }
  post(nx0, ny, nh, 10); post(nx1, ny, nh, 10);
  for (const f of [0.45, 0.8]) { const sag = 4; const pts: number[] = []; for (let i = 0; i <= 10; i++) { const u = i / 10; pts.push(nx0 + (nx1 - nx0) * u, ny - nh * f + Math.sin(u * Math.PI) * sag); } rope(pts); }
}

/** A basket of ore to lift, wicker heaped with red stone, foot on y. */
function oreBasket(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  const h = w * 0.7, top = y - h;
  contact(ctx, x, y, w * 1.1, 0.5);
  for (let i = 0; i < 14; i++) { const u = rnd(874, x, i); oreLump(ctx, x - w * 0.4 + u * w * 0.8, top + 1 - Math.sin(u * Math.PI) * w * 0.16 - rnd(889, x, i) * 3, w * 0.09, 874 + i + Math.round(x)); }
  glossPoly(ctx, K, [x - w / 2, top, x - w * 0.4, y, x + w * 0.4, y, x + w / 2, top], '#9a7a4a', { gloss: 0.1, h: 60, tex: 'bristle', seed: Math.round(x), amount: 0.5 });
  for (let i = 1; i < 4; i++) line(ctx, [x - w * 0.49 + i * 0.6, top + (h * i) / 4, x + w * 0.49 - i * 0.6, top + (h * i) / 4], rgba('#4a3418', 0.6), 1);
  for (const sd of [-1, 1]) { ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x + sd * w * 0.5, top + h * 0.3, w * 0.1, sd < 0 ? Math.PI * 0.5 : -Math.PI * 0.5, sd < 0 ? Math.PI * 1.5 : Math.PI * 0.5); ctx.stroke(); ctx.strokeStyle = '#9a7a4a'; ctx.lineWidth = 1.5; ctx.stroke(); }
}

/** Practice arms of the sea on the boards: wooden cutlasses and boarding axes on their pegs, the rail's top at y. */
function seaRack(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  beam(ctx, x, y, w, 5, TAR, 875);
  for (let i = 0; i < 5; i++) {
    const px = x + 10 + i * (w - 20) / 4;
    glossBall(ctx, K, px, y + 2, 1.6, IRON, {});
    if (i % 2) {
      line(ctx, [px, y + 4, px + 2, y + 66], '#120c14', 3.5); line(ctx, [px, y + 4, px + 2, y + 66], ASH, 2);
      glossPoly(ctx, K, [px + 1, y + 8, px + 12, y + 2, px + 14, y + 12, px + 2, y + 16], '#8a6a46', { gloss: 0.15 });
    } else {
      glossPoly(ctx, K, [px - 2, y + 8, px + 2, y + 8, px + 6, y + 50, px + 1, y + 62, px - 3, y + 50], '#9a7a50', { gloss: 0.15 });
      ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(px - 3, y + 12, 5, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke();
      ctx.strokeStyle = '#6a5a3a'; ctx.lineWidth = 1.5; ctx.stroke();
    }
  }
}

export const KILNHAVEN_TRAINING: Scene = {
  ambient: ['#2a2830', '#7a7c80'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    planks(ctx, 0, 0, STAGE_W, FLOOR, shade(TAR, 1.6), 22, true, 876);
    oreDust(ctx, 0, FLOOR - 60, STAGE_W, 60, 877, 0.5);
    floorboards(ctx, FLOOR, 200, 100, '#6a5a4c', 9, 878);
    oreDust(ctx, 0, FLOOR, STAGE_W, STAGE_H - FLOOR, 879, 0.45);
    beam(ctx, 0, 0, STAGE_W, 12, TAR, 880);
    for (const px of [100, 300]) beam(ctx, px - 6, 12, 12, FLOOR - 12, TAR, px);
    clerestory(ctx, s, [26, 132, 222, 330], 22, 30, 20);
    // Sacks of ore stacked at the back behind the ring.
    for (let i = 0; i < 4; i++) sack(ctx, 236 + i * 34, FLOOR + 2, 34, 36, i % 2 ? '#8a6a4a' : '#7a5a3e', { seed: 881 + i });
    for (let i = 0; i < 2; i++) sack(ctx, 252 + i * 34, FLOOR - 26, 32, 32, '#846446', { seed: 885 + i });
    seaRack(ctx, 18, 84, 70);
    lantern(ctx, s, 112, 94, 10, IRON, 64, 230);
    lantern(ctx, s, 306, 94, 10, IRON, 64, 230);
    hoistAndTub(ctx, 160, 54, 132, 34);
    ring(ctx, 196, 392, 250, 232, 366, 206);
    // Baskets of ore to lift at the front, and an iron bar laid by them.
    oreBasket(ctx, 40, 252, 40);
    oreBasket(ctx, 92, 258, 34);
    line(ctx, [116, 262, 178, 250], '#120c14', 5); line(ctx, [116, 262, 178, 250], shade(IRON, 1.3), 3);
  },
};
