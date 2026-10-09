// The Riders' trader's tent at Akordu (#526): white felt over a lattice, the roof poles running up to
// the ring at the crown and the smoke hole's light coming down; rugs in the Riders' red and ochre on
// the beaten floor and a brazier of dung burning low; the trader's leather coats hung from a pole,
// a horse's skull on the lattice with its brow painted red, and by the low painted chest the sacks of
// meal, the jars and the draughts.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, line, fillPoly, contact, slab, smudge, pool, DAY_POOL, FLAME_POOL } from '../kit.ts';
import { K, sack, jar, bottle } from '../props.ts';
import { glossPoly, glossEllipse } from '../../monsters/gloss.ts';

const FLOOR = 196, WALL = 86, FELT = '#e4dac8', POLE = '#9a6a3a', LEATHER = '#7a4a2a', RED = '#9a2e22', OCHRE = '#c8902e', BONE = '#ddd2b8', IRON = '#3a3438';

/** A leather coat hung by its shoulders from the pole at (x, y), `h` long: the sleeves down its sides, a red stitched band and a fringe of thongs at the hem. */
function coat(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, col: string, seed: number): void {
  const w = h * 0.56;
  for (const sd of [-1, 1]) glossPoly(ctx, K, [x + sd * w * 0.36, y + 3, x + sd * w * 0.62, y + h * 0.56, x + sd * w * 0.46, y + h * 0.6, x + sd * w * 0.26, y + 12], shade(col, 0.78), { gloss: 0.2 });
  glossPoly(ctx, K, [x - w * 0.38, y + 3, x - w * 0.12, y - 1, x + w * 0.12, y - 1, x + w * 0.38, y + 3, x + w * 0.47, y + h, x - w * 0.47, y + h], col, { gloss: 0.35, spread: 0.7 });
  line(ctx, [x, y + 2, x + 1, y + h], rgba('#2a1a10', 0.7), 1.5);
  line(ctx, [x - w * 0.45, y + h - 7, x + w * 0.45, y + h - 7], RED, 2.5);
  for (let i = 0; i < 9; i++) { const fx = x - w * 0.43 + i * w * 0.107; line(ctx, [fx, y + h, fx + (rnd(seed, i) - 0.5) * 4, y + h + 8], shade(col, 0.9), 1.5); }
  line(ctx, [x, y - 7, x, y + 2], '#120c14', 2.5);
}

/** A horse's skull hung on the lattice at (x, y): the long face down, the eye sockets, the brow painted red. */
function skull(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  const w = h * 0.42;
  glossPoly(ctx, K, [x - w * 0.5, y, x + w * 0.5, y, x + w * 0.42, y + h * 0.35, x + w * 0.2, y + h, x - w * 0.2, y + h, x - w * 0.42, y + h * 0.35], BONE, { gloss: 0.3 });
  fillPoly(ctx, [x - w * 0.46, y + 2, x + w * 0.46, y + 2, x + w * 0.4, y + h * 0.22, x - w * 0.4, y + h * 0.22], RED);
  for (const sd of [-1, 1]) glossEllipse(ctx, K, x + sd * w * 0.28, y + h * 0.3, w * 0.12, h * 0.07, '#2a2018', 0, {});
  for (let i = 0; i < 3; i++) line(ctx, [x - w * 0.12, y + h * (0.86 + i * 0.04), x + w * 0.12, y + h * (0.86 + i * 0.04)], rgba('#5a4a3a', 0.7), 1);
  line(ctx, [x, y - 8, x, y + 1], '#120c14', 2);
}

export const AKORDU_TRADER: Scene = {
  ambient: ['#2a2420', '#a89a88'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    // The felt, the roof over its poles to the crown's ring, and the lattice of the wall under it.
    ctx.fillStyle = FELT; ctx.fillRect(0, 0, STAGE_W, FLOOR);
    for (let i = 0; i <= 16; i++) {
      const bx = -60 + i * 32;
      fillPoly(ctx, [200, -36, bx, WALL, bx + 32, WALL], rgba('#6a5a48', 0.08 + rnd(611, i) * 0.1));
      line(ctx, [200, -36, bx, WALL], '#120c14', 4); line(ctx, [200, -36, bx, WALL], POLE, 2.5);
    }
    ctx.save(); ctx.beginPath(); ctx.rect(0, WALL, STAGE_W, FLOOR - WALL); ctx.clip();
    for (let i = -8; i < 30; i++) { const lx = i * 18; line(ctx, [lx, WALL, lx + 110, FLOOR], rgba(POLE, 0.55), 1.5); line(ctx, [lx + 110, WALL, lx, FLOOR], rgba(POLE, 0.55), 1.5); }
    ctx.restore();
    slab(ctx, 0, WALL - 4, STAGE_W, 7, shade(POLE, 0.9), { lit: 1 });
    glossEllipse(ctx, K, 200, -6, 70, 26, shade(POLE, 0.85), 0, { gloss: 0.2 });
    glossEllipse(ctx, K, 200, -8, 52, 17, '#c8d4e0', 0, { gloss: 0.1 });
    pool(s, 200, 10, 190, DAY_POOL, 0.25 + s.daylight * 0.45);
    // A band of red and ochre felt round the wall's foot, and the beaten floor under the rugs.
    slab(ctx, 0, FLOOR - 16, STAGE_W, 10, RED, { lit: 1 });
    for (let i = 0; i < 25; i++) fillPoly(ctx, [i * 16 + 4, FLOOR - 13, i * 16 + 10, FLOOR - 9, i * 16 + 4, FLOOR - 9], OCHRE);
    ctx.fillStyle = '#6e5a46'; ctx.fillRect(0, FLOOR - 6, STAGE_W, STAGE_H - FLOOR + 6);
    const rug = [70, FLOOR + 6, 330, FLOOR + 6, 392, STAGE_H, 8, STAGE_H];
    glossPoly(ctx, K, rug, RED, { gloss: 0.1, spread: 0.9 });
    for (const t of [0.18, 0.5, 0.82]) line(ctx, [70 - 62 * t, FLOOR + 6 + (STAGE_H - FLOOR - 6) * t, 330 + 62 * t, FLOOR + 6 + (STAGE_H - FLOOR - 6) * t], OCHRE, 3);
    // The pole of coats on the left, the skull on the lattice behind the chest.
    line(ctx, [20, 100, 160, 100], '#120c14', 6); line(ctx, [20, 100, 160, 100], POLE, 4);
    for (const px of [24, 156]) { line(ctx, [px, 94, px, FLOOR - 8], '#120c14', 6); line(ctx, [px, 94, px, FLOOR - 8], POLE, 4); }
    coat(ctx, 50, 104, 74, LEATHER, 612); coat(ctx, 92, 104, 70, '#8a5a32', 613); coat(ctx, 132, 104, 66, '#6a3e22', 614);
    skull(ctx, 288, 104, 40);
    // The low chest, painted red with ochre lozenges, the jars and the draughts on it; the sacks of meal.
    slab(ctx, 246, FLOOR - 4, 92, 34, RED, { lit: 1 });
    for (let i = 0; i < 4; i++) { const cx = 258 + i * 22; fillPoly(ctx, [cx, FLOOR + 4, cx + 7, FLOOR + 13, cx, FLOOR + 22, cx - 7, FLOOR + 13], OCHRE); }
    contact(ctx, 292, FLOOR + 31, 96, 0.5);
    jar(ctx, 262, FLOOR - 4, 16, 24, '#8a6a4a', '#3a2a1a'); jar(ctx, 284, FLOOR - 4, 14, 20, '#a07850');
    for (let i = 0; i < 3; i++) bottle(ctx, 304 + i * 12, FLOOR - 4, 18, ['#c8e0d0', '#b04030', '#3a5a8a'][i], { cork: '#6a4a2a' });
    sack(ctx, 368, FLOOR + 30, 44, 50, '#c0a47a', { open: '#e8d8a8', seed: 615 });
    sack(ctx, 226, FLOOR + 22, 30, 34, '#b0946a', { seed: 616 });
    // The brazier in the middle, dung burning low in an iron bowl on three legs.
    contact(ctx, 196, 262, 70, 0.55);
    for (const lx of [-22, 0, 22]) line(ctx, [196 + lx * 0.6, 240, 196 + lx, 262], IRON, 3);
    glossPoly(ctx, K, [164, 228, 228, 228, 216, 244, 176, 244], IRON, { gloss: 0.4 });
    for (let i = 0; i < 6; i++) glossEllipse(ctx, K, 176 + i * 8, 228 - rnd(617, i) * 3, 5, 3, ['#d0602a', '#8a2e1a'][i % 2], 0, {});
    smudge(ctx, 196, 226, 40, '#ff9050', 0.35);
    s.lights.push({ k: 'fire', x: 196, y: 228, w: 36, h: 20 });
    s.lights.push({ k: 'motes', x: 176, y: 140, w: 40, h: 80, color: '#c8b8a0', n: 10, rise: 0.3 });
    pool(s, 196, 214, s.daylight > 0.5 ? 150 : 220, FLAME_POOL, 0.85);
  },
};
