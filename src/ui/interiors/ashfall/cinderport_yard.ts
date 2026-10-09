// Cinderport's trainer's yard, where a company is trained to 27: ash raked smooth inside a wall of
// basalt with the vines come over its top, Fire Mountain over the wall, smoking by day and red at
// its mouth by night; a pell of driftwood wrapped in vine rope and cut about, the practice arms in
// their rack, the butt for the bow, and fire-baskets on posts lit for the dark.
import { shade, rgba, mix } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, line, fillPoly, contact, slab, flame } from '../kit.ts';
import { K, sword, spear } from '../props.ts';
import { ground, target, armsRack } from '../yards.ts';
import { glossPoly, glossEllipse } from '../../monsters/gloss.ts';
import { TIMBER, IRON, ASH, basaltWall, vines, mountain } from './basalt.ts';

const WALL = 112, FOOT = 166, DRIFT = '#8a7a66', VINE_ROPE = '#5a6a3a';

/** The pell: a post of driftwood sunk in the ash, the floor at y, wrapped in vine rope and cut about where the blows land. */
function pell(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  contact(ctx, x, y, 34, 0.5);
  glossPoly(ctx, K, [x - 9, y, x - 8, y - h, x - 3, y - h - 3, x + 7, y - h - 1, x + 9, y], DRIFT, { gloss: 0.15, spread: 0.8, tex: 'stipple', seed: 591, amount: 0.4 });
  for (let i = 0; i < 4; i++) line(ctx, [x - 6 + i * 4, y - 4, x - 5 + i * 4, y - h + 6], rgba('#4a4036', 0.5), 1);
  for (let i = 0; i < 7; i++) { const ry = y - h * 0.3 - i * 5; line(ctx, [x - 9, ry + 2, x + 9, ry - 2], '#120c14', 3); line(ctx, [x - 9, ry + 2, x + 9, ry - 2], VINE_ROPE, 1.5); }
  for (const [u, v] of [[-0.3, 0.72], [0.2, 0.78], [-0.1, 0.86], [0.3, 0.64]]) line(ctx, [x + u * 18 - 3, y - h * v, x + u * 18 + 3, y - h * v - 2], '#d8ccb4', 1);
}

/** A fire-basket on its iron post, the ground at y: the basket of bars at the top and, by night, its fire. */
function fireBasket(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, h: number): void {
  contact(ctx, x, y, 14, 0.45);
  line(ctx, [x, y, x, y - h], '#120c14', 4); line(ctx, [x, y, x, y - h], IRON, 2);
  const top = y - h;
  glossPoly(ctx, K, [x - 9, top - 12, x + 9, top - 12, x + 5, top, x - 5, top], '#1e1a1e', { gloss: 0.3 });
  for (let i = -2; i <= 2; i++) line(ctx, [x + i * 4, top - 12, x + i * 2.4, top], IRON, 1.2);
  if (s.daylight < 0.5) flame(s, x, top - 12, 7, 150, 0.9);
  else glossEllipse(ctx, K, x, top - 12, 8, 2.2, '#3a3436', 0, {});
}

export const CINDERPORT_YARD: Scene = {
  ambient: ['#2c2c3a', '#e8e4e0'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const d = s.daylight;
    mountain(0, 0, STAGE_W, WALL + 6, s, { at: 0.62, seed: 592 })(ctx);
    basaltWall(ctx, 0, WALL, STAGE_W, FOOT - WALL, 4, 593);
    slab(ctx, -2, WALL - 5, STAGE_W + 4, 6, shade('#5e5c62', 1.05), { lit: 1, dark: 0.3 });
    for (const [vx, vw] of [[14, 70], [178, 46], [300, 84]] as [number, number][]) vines(ctx, vx, WALL - 2, vw, 40, 594 + vx);
    ground(ctx, FOOT, mix('#3a3836', '#a8a39a', d), 595);
    // The ash raked smooth, the rake's lines curving round where the drills are run.
    for (let i = 0; i < 9; i++) { const ry = FOOT + 10 + i * 10; ctx.strokeStyle = rgba(mix('#1e1c1c', '#7a766e', d), 0.5); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(170, ry + 40, 160 + i * 8, 40, 0, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke(); }
    for (let i = 0; i < 16; i++) { const fx = 200 + i * 9, fy = 232 - i * 2 + (i % 2) * 3; ctx.fillStyle = rgba(mix('#1a1818', '#6a665e', d), 0.6); ctx.beginPath(); ctx.ellipse(fx, fy, 2.4, 1, 0, 0, Math.PI * 2); ctx.fill(); }
    // The fire-baskets, the rack of practice arms against the wall, the butt for the bow.
    fireBasket(ctx, s, 28, FOOT + 14, 70);
    fireBasket(ctx, s, 372, FOOT + 14, 70);
    armsRack(ctx, 236, FOOT + 6, 76, 56, TIMBER);
    for (let i = 0; i < 3; i++) spear(ctx, 246 + i * 10, FOOT + 4, 82 - i * 5);
    sword(ctx, 284, FOOT + 4, 56, { blade: '#8a7458', hilt: '#5a4430' });
    sword(ctx, 298, FOOT + 4, 52, { blade: '#8a7458', hilt: '#5a4430' });
    target(ctx, 346, FOOT - 8, 15, 596);
    // The pell in the ash, and the ash kicked up round its foot.
    pell(ctx, 118, 222, 84);
    fillPoly(ctx, [96, 224, 106, 220, 132, 220, 142, 225, 118, 228], rgba(ASH, 0.5 * d + 0.2));
  },
};
