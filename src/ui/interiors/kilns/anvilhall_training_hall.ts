// Anvilhall's training hall, to 19: an old working the dwarves train in, timbered like a gallery
// of the mine and broken out through the hill's side onto the sky. Lifting stones graded down to
// a boy's, a round of oak with throwing axes in it, a pell hacked half through and the practice
// arms racked on the rock. Frog lamps on the timbers.
import { shade, rgba, mix } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, beam, line, fillPoly, path, ink, slab, pool, contact, DAY_POOL } from '../kit.ts';
import { K, shield } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { ground } from '../yards.ts';
import { ROCK, IRON, hewn, oldScript, terraceView } from './hold.ts';

const FLOOR = 204, PROP = '#5a4430', ASH = '#a08a64';
/** The breach in the hill's side: its outline, ragged where the rock fell away. */
const BREACH = [232, FLOOR, 228, 120, 236, 84, 250, 66, 272, 58, 296, 62, 314, 76, 326, 100, 330, 140, 334, FLOOR];

/** A timber set as the miners prop a gallery: two posts and a cap across them, from `top` to the floor at y. */
function timberSet(ctx: CanvasRenderingContext2D, x0: number, x1: number, top: number, y: number, w: number, seed: number): void {
  beam(ctx, x0, top + w * 0.6, w, y - top - w * 0.6, PROP, seed);
  beam(ctx, x1 - w, top + w * 0.6, w, y - top - w * 0.6, PROP, seed + 1);
  beam(ctx, x0 - w * 0.4, top, x1 - x0 + w * 0.8, w * 0.9, shade(PROP, 1.08), seed + 2);
  // The wedges driven between cap and post.
  for (const px of [x0 + w * 0.5, x1 - w * 0.5]) fillPoly(ctx, [px - w * 0.5, top + w * 0.9, px + w * 0.5, top + w * 0.9, px, top + w * 1.4], shade(PROP, 0.8));
}

/** The breach, and the hillside through it: sky and the heart by day, stars and the far fires by night. */
function breach(ctx: CanvasRenderingContext2D, s: Stage): void {
  const out = BREACH.map((v, i) => i % 2 ? v : v);
  // The rock's broken lip round it, lit along its lower edges by the day.
  const lip = BREACH.map((v, i) => i % 2 ? v - (v < FLOOR ? 6 : 0) : v + (v < 280 ? -7 : 7));
  fillPoly(ctx, lip, shade(ROCK, 0.6)); path(ctx, lip); ink(ctx);
  ctx.save(); path(ctx, out); ctx.clip();
  terraceView(224, 56, 112, FLOOR - 56, s.daylight, 11)(ctx);
  // The ledge outside, the terrace's edge.
  fillPoly(ctx, [224, FLOOR, 224, FLOOR - 14, 340, FLOOR - 10, 340, FLOOR], mix('#100c0c', '#7a6a58', s.daylight));
  ctx.restore();
  path(ctx, out); ink(ctx);
  if (s.daylight > 0.15) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(330, 0, 150, 0); g.addColorStop(0, rgba('#e8f0ff', 0.22 * s.daylight)); g.addColorStop(1, rgba('#e8f0ff', 0));
    fillPoly(ctx, [232, FLOOR, 330, FLOOR, 230, STAGE_H, 90, STAGE_H], g);
    ctx.restore();
    pool(s, 280, 150, 220, DAY_POOL, 0.85 * s.daylight);
    pool(s, 200, 236, 140, '#d8e0ec', 0.45 * s.daylight);
  }
}

/** A lifting stone, a boulder dressed round, sat on y; the heaviest has an iron ring let into its top. */
function liftStone(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, ring = false): void {
  contact(ctx, x, y, r * 2.3, 0.55);
  glossBall(ctx, K, x, y - r * 0.92, r, shade(ROCK, 1.1), { gloss: 0.25, spread: 0.75, h: 80, tex: 'cracks', seed: Math.round(x), amount: 0.35 });
  if (!ring) return;
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, y - r * 1.9, r * 0.36, r * 0.42, 0, Math.PI, Math.PI * 2.02); ctx.stroke();
  ctx.strokeStyle = shade(IRON, 1.5); ctx.lineWidth = 2; ctx.stroke();
  glossEllipse(ctx, K, x, y - r * 1.84, r * 0.2, r * 0.07, IRON, 0, {});
}

/**
 * The round of oak the dwarves throw at: a slice of trunk on a stand of timbers, its rings and
 * its scars, three axes stood in it. Centre (x, y), radius r; the stand's feet on `foot`.
 */
function axeRound(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, foot: number): void {
  for (const sd of [-1, 1]) { line(ctx, [x + sd * r * 0.5, y, x + sd * r * 0.9, foot], '#120c14', 6); line(ctx, [x + sd * r * 0.5, y, x + sd * r * 0.9, foot], PROP, 4); }
  contact(ctx, x, foot, r * 2.2, 0.45);
  glossBall(ctx, K, x, y, r, '#8a6038', { gloss: 0.1 });
  glossBall(ctx, K, x, y, r * 0.88, '#c89a62', { gloss: 0.15, spread: 0.8 });
  ctx.strokeStyle = rgba('#7a5230', 0.55); ctx.lineWidth = 1;
  for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.arc(x, y, r * 0.88 * (i / 6), 0, Math.PI * 2); ctx.stroke(); }
  // The scars of a thousand throws.
  for (let i = 0; i < 18; i++) { const a = rnd(651, i) * Math.PI * 2, d = Math.sqrt(rnd(652, i)) * r * 0.78, sx = x + Math.cos(a) * d, sy = y + Math.sin(a) * d, t = rnd(653, i) * Math.PI; line(ctx, [sx - Math.cos(t) * 3, sy - Math.sin(t) * 3, sx + Math.cos(t) * 3, sy + Math.sin(t) * 3], rgba('#4a2e16', 0.7), 1); }
  // Three axes stood in it, bitten in to the beard, their hafts out toward the thrower.
  for (const [dx, dy, lean] of [[-0.34, -0.3, -0.4], [0.22, 0.04, 0.3], [-0.08, 0.4, -0.1]] as [number, number, number][]) {
    const hx = x + dx * r, hy = y + dy * r, ex = hx + 16 + lean * 8, ey = hy + 20;
    line(ctx, [hx, hy, ex, ey], '#120c14', 3.8); line(ctx, [hx, hy, ex, ey], ASH, 2.2);
    glossPoly(ctx, K, [hx - 2, hy - 5, hx + 4, hy - 3, hx + 3, hy + 3, hx - 4, hy + 6, hx - 7, hy + 2, hx - 6, hy - 3], '#9aa2ae', { gloss: 0.6 });
    line(ctx, [hx - 6, hy - 3, hx - 4, hy + 5], rgba('#2a1a10', 0.8), 1.5);
  }
}

/** An iron cresset on a pole, foot on y: a basket of hoops with the fire in it as a Light. */
function cresset(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, h: number): void {
  const top = y - h;
  line(ctx, [x, y, x, top + 10], '#120c14', 4.5); line(ctx, [x, y, x, top + 10], shade(IRON, 1.3), 2.5);
  for (const sd of [-1, 1]) { line(ctx, [x, top + 12, x + sd * 9, top - 4], '#120c14', 3); line(ctx, [x, top + 12, x + sd * 9, top - 4], shade(IRON, 1.4), 1.5); }
  line(ctx, [x, top + 12, x, top - 6], '#120c14', 3); line(ctx, [x, top + 12, x, top - 6], shade(IRON, 1.4), 1.5);
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, top - 3, 9, 2.5, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = shade(IRON, 1.4); ctx.lineWidth = 1.5; ctx.stroke();
  glossBall(ctx, K, x, top + 2, 6, '#ff8a3a', { gloss: 0.4 });
  s.lights.push({ k: 'fire', x, y: top - 2, w: 16, h: 20 });
  pool(s, x, top, 190, '#ff8a3a', 0.85);
}

/** A pell: a post of oak set in the floor and hacked half through at a dwarf's height. Foot on y. */
function pell(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, w: number): void {
  contact(ctx, x, y, w * 2.4, 0.5);
  beam(ctx, x - w / 2, y - h, w, h, '#7a5a3a', 654);
  glossEllipse(ctx, K, x, y - h, w / 2, w * 0.16, '#b08a5a', 0, {});
  for (let i = 0; i < 9; i++) { const cy = y - h * (0.3 + rnd(655, i) * 0.35), dir = rnd(656, i) > 0.5 ? 1 : -1; line(ctx, [x - w / 2, cy, x - w / 2 + w * 0.6, cy + dir * 3], '#2a1a10', 1.5); line(ctx, [x - w / 2, cy + 1, x - w / 2 + w * 0.6, cy + dir * 3 + 1], rgba('#e8c890', 0.6), 1); }
  // Its foot wedged in a socket cut in the rock floor.
  slab(ctx, x - w * 0.9, y - 6, w * 1.8, 6, shade(ROCK, 1.0), { lit: 1 });
}

/** The practice arms on the rock: axes and hammers of ash with blunt wooden heads, a rail at y. */
function practiceRack(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  beam(ctx, x, y, w, 5, PROP, 657);
  beam(ctx, x, y + 74, w, 5, PROP, 658);
  for (let i = 0; i < 5; i++) {
    const hx = x + 10 + i * (w - 20) / 4, top = y - 16 - (i % 2) * 6;
    line(ctx, [hx, top, hx, y + 78], '#120c14', 3.5); line(ctx, [hx, top, hx, y + 78], ASH, 2);
    if (i % 2) glossPoly(ctx, K, [hx - 7, top - 2, hx + 7, top - 2, hx + 7, top + 9, hx - 7, top + 9], '#7a5a3a', { gloss: 0.15 });
    else glossPoly(ctx, K, [hx - 1, top, hx + 11, top - 6, hx + 13, top + 6, hx + 3, top + 12, hx - 1, top + 8], '#8a6a46', { gloss: 0.15 });
  }
}

export const ANVILHALL_TRAINING: Scene = {
  ambient: ['#241e22', '#5a5658'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    hewn(ctx, 0, 0, STAGE_W, FLOOR, 661, ROCK);
    const soot = ctx.createLinearGradient(0, 0, 0, 90); soot.addColorStop(0, rgba('#0a0606', 0.6)); soot.addColorStop(1, rgba('#0a0606', 0));
    ctx.fillStyle = soot; ctx.fillRect(0, 0, STAGE_W, 90);
    ground(ctx, FLOOR, '#6a5e50', 662);
    // A chalk line on the floor for the throwers to stand at.
    line(ctx, [40, 236, 236, 230], rgba('#e8e0d0', 0.55), 2);
    breach(ctx, s);
    oldScript(ctx, 281, 40, 72, 663, 5);
    // The timbers of the old working: a set against the rock, and one framing the near end.
    timberSet(ctx, 14, 386, 22, FLOOR + 2, 12, 664);
    cresset(ctx, s, 34, FLOOR + 10, 116);
    cresset(ctx, s, 366, FLOOR + 10, 116);
    practiceRack(ctx, 48, 98, 118);
    shield(ctx, 186, 92, 13, '#5a3a24', 'round', '#3a2a1a');
    axeRound(ctx, 186, 150, 28, FLOOR + 6);
    // The lifting stones in a row down to a boy's, and the pell on its own.
    liftStone(ctx, 66, 250, 19, true);
    liftStone(ctx, 108, 246, 14);
    liftStone(ctx, 140, 242, 10);
    liftStone(ctx, 162, 238, 7);
    pell(ctx, 344, 252, 70, 16);
    timberSet(ctx, -10, 410, -6, STAGE_H + 20, 18, 665);
  },
};
