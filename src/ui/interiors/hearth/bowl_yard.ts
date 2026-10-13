// The Sergeant's Tent in the Bowl (#762), where Sergeant Aelfric, a Warden stranded with the
// pilgrims, trains a company to 32: a wall tent of the Wardens' grey on a ridge and two poles, its
// back wall rolled up on the drill ground, where a pell of sacking on a tent pole stands against the
// rim. Inside, a ring worn in the grass by footwork, the practice arms in their rack, his chest with
// the old helm on it and his sword against it, his grey cloak on the pole with the old badge, and a
// lantern from the ridge.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, line, fillPoly, contact, slab, beam, clipRect, pool, DAY_POOL } from '../kit.ts';
import { K, sword, staff, shield, lantern } from '../props.ts';
import { ground, armsRack } from '../yards.ts';
import { glossPoly, glossEllipse, glossCapsule, glossBall } from '../../monsters/gloss.ts';
import { canvasFace, seam, bowlView } from './camp.ts';

const RIDGE = 14, EAVE = 92, FLOOR = 192, VX = 200, CANVAS = '#9a9ea4', WOOD = '#7a5a3a', GREY = '#6a6e76', IRON = '#3a3438', STEEL = '#aab2be', SACKING = '#a89070', ROPE = '#b8a074';
/** The rolled-up stretch of the back wall, open on the drill ground. */
const OPEN_X0 = 146, OPEN_X1 = 290, OPEN_Y = EAVE + 12;

/** The pell on the drill ground, the grass at y: a spare tent pole driven in, a sack of straw lashed to it and cut about. */
function pell(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  contact(ctx, x, y, 22, 0.45);
  line(ctx, [x, y, x, y - h], '#120c14', 5); line(ctx, [x, y, x, y - h], WOOD, 3);
  glossPoly(ctx, K, [x - 9, y - h * 0.3, x - 11, y - h * 0.6, x - 7, y - h * 0.86, x + 7, y - h * 0.88, x + 11, y - h * 0.6, x + 9, y - h * 0.3], SACKING, { gloss: 0.05, spread: 0.8, tex: 'stipple', seed: 761, amount: 0.4 });
  for (const f of [0.38, 0.6, 0.8]) line(ctx, [x - 10, y - h * f + 1, x + 10, y - h * f - 1], ROPE, 1.5);
  for (const [u, v] of [[-4, 0.5], [3, 0.68], [-2, 0.74]]) line(ctx, [x + u - 3, y - h * v, x + u + 3, y - h * v - 2], '#e8dcb4', 1);
}

export const BOWL_YARD: Scene = {
  ambient: ['#22242c', '#b4b8be'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const d = s.daylight;
    // The grass inside, and a ring worn in it by the drill's footwork.
    ground(ctx, FLOOR, '#6e6e48', 762, true);
    ctx.strokeStyle = rgba('#3a3424', 0.4); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(VX, 234, 128, 22, 0, 0, Math.PI * 2); ctx.stroke();
    // The near slope overhead, the far slope and the back wall under it, their seams running down from the ridge.
    fillPoly(ctx, [0, 0, STAGE_W, 0, STAGE_W, RIDGE, 0, RIDGE], shade(CANVAS, 0.7));
    canvasFace(ctx, [0, RIDGE, STAGE_W, RIDGE, STAGE_W, EAVE, 0, EAVE], shade(CANVAS, 0.86), 763);
    canvasFace(ctx, [0, EAVE, STAGE_W, EAVE, STAGE_W, FLOOR, 0, FLOOR], CANVAS, 764);
    for (let k = -3; k <= 11; k++) {
      const x = k * 50, xe = VX + (x - VX) * 0.82;
      seam(ctx, x, RIDGE, xe, EAVE, shade(CANVAS, 0.86));
      seam(ctx, xe, EAVE, xe, FLOOR, CANVAS);
    }
    fillPoly(ctx, [0, FLOOR - 7, STAGE_W, FLOOR - 7, STAGE_W, FLOOR, 0, FLOOR], rgba('#3a3424', 0.35));
    // The wall rolled up on the drill ground: the grass, the rim and the pell against it.
    ctx.save(); clipRect(ctx, OPEN_X0, OPEN_Y, OPEN_X1 - OPEN_X0, FLOOR - OPEN_Y);
    bowlView(ctx, s, OPEN_X0, OPEN_Y, OPEN_X1 - OPEN_X0, FLOOR - OPEN_Y, 150, 765);
    pell(ctx, 246, 184, 64);
    ctx.restore();
    for (const ex of [OPEN_X0, OPEN_X1]) line(ctx, [ex, OPEN_Y - 4, ex, FLOOR], '#120c14', 1.5);
    glossCapsule(ctx, K, OPEN_X0 - 4, EAVE + 6, OPEN_X1 + 4, EAVE + 6, 7, CANVAS, { gloss: 0.15, spread: 0.8 });
    for (const tx of [168, 268]) { line(ctx, [tx, EAVE - 1, tx, EAVE + 13], ROPE, 2.5); line(ctx, [tx, EAVE + 13, tx + 3, EAVE + 22], ROPE, 1.5); }
    // The ridge and the two poles; the grey lets a little of the day through.
    beam(ctx, -2, RIDGE - 8, STAGE_W + 4, 9, WOOD, 766);
    for (const px of [34, 357]) { contact(ctx, px + 4, 230, 22, 0.5); beam(ctx, px, RIDGE, 9, 230 - RIDGE, WOOD, 767 + px); }
    pool(s, VX, 50, 280, DAY_POOL, 0.3 * d);
    // The practice arms in their rack: two wasters, two staves, a round shield of plain wood at its foot.
    armsRack(ctx, 74, FLOOR + 14, 66, 58, WOOD);
    sword(ctx, 86, FLOOR + 12, 54, { blade: '#a07a4a', hilt: '#5a4430' });
    sword(ctx, 98, FLOOR + 12, 50, { blade: '#946e42', hilt: '#5a4430' });
    staff(ctx, 114, FLOOR + 12, 84, '#7a5a34');
    staff(ctx, 126, FLOOR + 12, 80, '#86643a');
    shield(ctx, 140, FLOOR + 6, 13, '#8a6a40', 'round');
    // His chest, the old helm on it and his sword in its scabbard against it.
    contact(ctx, 336, 234, 92, 0.5);
    slab(ctx, 292, FLOOR + 10, 88, 30, '#5a4a3a', { lit: 1 });
    for (const bx of [292, 374]) slab(ctx, bx, FLOOR + 10, 6, 30, IRON);
    slab(ctx, 332, FLOOR + 16, 8, 9, IRON);
    glossEllipse(ctx, K, 318, FLOOR + 2, 13, 9, '#7e8692', 0, { gloss: 0.5 });
    slab(ctx, 304, FLOOR + 4, 28, 5, '#5e646e');
    glossCapsule(ctx, K, 378, 238, 388, 176, 3.2, '#3a2a20', { gloss: 0.3 });
    line(ctx, [380, 176, 396, 178], '#120c14', 4); line(ctx, [380, 176, 396, 178], STEEL, 2);
    line(ctx, [388, 176, 390, 164], '#120c14', 4); line(ctx, [388, 176, 390, 164], GREY, 2.5);
    glossBall(ctx, K, 390, 162, 3, STEEL, { gloss: 0.6 });
    // His grey cloak on the pole, the old badge at its breast.
    line(ctx, [356, 96, 368, 94], '#120c14', 4); line(ctx, [356, 96, 368, 94], WOOD, 2);
    glossPoly(ctx, K, [358, 98, 366, 98, 374, 128, 380, 180, 368, 186, 352, 184, 342, 178, 350, 128], GREY, { gloss: 0.1, spread: 0.8 });
    glossPoly(ctx, K, [364, 99, 374, 104, 372, 124, 365, 118], shade(GREY, 0.8), { gloss: 0.05 });
    for (const fx of [354, 361, 368]) line(ctx, [fx, 118, fx + (fx - 361) * 0.6, 182], rgba('#2a2c32', 0.5), 1);
    glossBall(ctx, K, 357, 116, 3.4, '#c8ccd4', { gloss: 0.8 });
    // The lantern from the ridge.
    lantern(ctx, s, 214, 58, 11, IRON, RIDGE, 240);
  },
};
