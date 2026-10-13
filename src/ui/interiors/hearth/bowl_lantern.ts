// The Lantern's Tent in the Bowl (#762), for the dead and the sick: a round pavilion of white linen on
// one pole, its valance red and stitched in gold with the Lanterns' ring, and two lanterns hung from an
// iron hoop on the pole. On the left the sick's pallet, its blanket turned back, a candle at its head
// and a basin at its foot; on the right the dead on a bier under a shroud, the ring laid on the
// breast and a candle standing at the head.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, line, fillPoly, contact, slab, beam, pool, DAY_POOL } from '../kit.ts';
import { K, candle, lantern, lanternRing } from '../props.ts';
import { ground } from '../yards.ts';
import { glossPoly, glossEllipse } from '../../monsters/gloss.ts';
import { canvasFace, seam } from './camp.ts';

const VX = 200, LINEN = '#e4dece', RED = '#8a2a22', GOLD = '#e8c050', WOOD = '#7a5a3a', IRON = '#3a3438', BRASS = '#a88a40', SHROUD = '#ece6d6', BLANKET = '#5a6a7e', TICK = '#cfc4a0';
/** The ring of the eave and the ring of the wall's foot, the far half of each, as they curve away round the tent. */
const eave = (x: number): number => 92 - 40 * ((x - VX) / 210) ** 2;
const foot = (x: number): number => 194 + 40 * ((x - VX) / 210) ** 2;
const XS = Array.from({ length: 21 }, (_, i) => i * 20);

/** A tall iron candlestick on three feet, the ground at y, its candle burning at `top`. */
function pricket(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, top: number): void {
  contact(ctx, x, y, 18, 0.45);
  for (const sd of [-1, 0, 1]) line(ctx, [x, y - 9, x + sd * 8, y + (sd ? 0 : 2)], '#120c14', 3);
  line(ctx, [x, y - 6, x, top], '#120c14', 4); line(ctx, [x, y - 6, x, top], IRON, 2);
  glossEllipse(ctx, K, x, top, 6, 2, IRON, 0, { gloss: 0.5 });
  candle(ctx, s, x, top - 1, 14, '#efe4c8', 120);
}

export const BOWL_LANTERN: Scene = {
  ambient: ['#201e26', '#c8c4bc'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    ground(ctx, 190, '#7a7650', 771, true);
    // The cone of the roof over its seams, and the wall round under it.
    canvasFace(ctx, [0, 0, STAGE_W, 0, ...XS.slice().reverse().flatMap((x) => [x, eave(x)])], shade(LINEN, 0.86), 772);
    canvasFace(ctx, [...XS.flatMap((x) => [x, eave(x)]), ...XS.slice().reverse().flatMap((x) => [x, foot(x)])], LINEN, 773);
    for (let x = 10; x < STAGE_W; x += 40) { seam(ctx, VX, -90, x, eave(x), shade(LINEN, 0.86)); seam(ctx, x, eave(x), x, foot(x), LINEN); }
    pool(s, VX, 30, 330, DAY_POOL, 0.55 * s.daylight);
    // The valance: red scallops under the eave, edged in gold, the ring on every other one.
    const val: number[] = XS.flatMap((x) => [x, eave(x) - 1]);
    for (let x = STAGE_W; x >= 0; x -= 5) val.push(x, eave(x) + 6 + 8 * Math.abs(Math.sin((x / 20) * Math.PI)));
    glossPoly(ctx, K, val, RED, { gloss: 0.1, spread: 0.9 });
    line(ctx, val.slice(XS.length * 2), GOLD, 1.5);
    for (let x = 10; x < STAGE_W; x += 40) lanternRing(ctx, x, eave(x) + 7, 3, GOLD);
    // The pole, the hoop round it and the two lanterns hung from the hoop.
    ctx.strokeStyle = '#120c14'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(VX, 60, 36, 7, 0, 0, Math.PI); ctx.stroke();
    ctx.strokeStyle = IRON; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(VX, 60, 36, 7, 0, 0, Math.PI); ctx.stroke();
    contact(ctx, VX, 242, 26, 0.5);
    beam(ctx, VX - 5, 0, 10, 242, WOOD, 774);
    ctx.strokeStyle = '#120c14'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(VX, 60, 36, 7, 0, Math.PI, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = IRON; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(VX, 60, 36, 7, 0, Math.PI, Math.PI * 2); ctx.stroke();
    lantern(ctx, s, VX - 30, 72, 10, BRASS, 57, 180);
    lantern(ctx, s, VX + 30, 72, 10, BRASS, 57, 180);
    // The sick's pallet: the straw tick, the bolster, the blanket turned back; a candle at its head, a basin at its foot.
    contact(ctx, 86, 240, 136, 0.45);
    glossPoly(ctx, K, [22, 238, 150, 238, 146, 224, 26, 224], TICK, { gloss: 0.1, spread: 0.8 });
    glossPoly(ctx, K, [66, 225, 147, 225, 151, 238, 62, 238], BLANKET, { gloss: 0.1, spread: 0.8, tex: 'stipple', seed: 775, amount: 0.4 });
    fillPoly(ctx, [62, 225, 72, 225, 70, 238, 60, 238], shade(LINEN, 0.95));
    glossEllipse(ctx, K, 42, 222, 16, 6, LINEN, 0, { gloss: 0.2 });
    candle(ctx, s, 14, 248, 10, '#efe4c8', 100);
    glossEllipse(ctx, K, 168, 250, 14, 5, '#8a6a4a', 0, { gloss: 0.3 });
    glossEllipse(ctx, K, 168, 248, 11, 3, '#9ab4b8', 0, { gloss: 0.8 });
    fillPoly(ctx, [156, 247, 166, 246, 164, 256, 157, 255], LINEN);
    // The dead on the bier under the shroud, the ring on the breast; the candle at the head.
    contact(ctx, 312, 248, 140, 0.45);
    for (const lx of [256, 364]) slab(ctx, lx, 214, 5, 32, shade(WOOD, 0.85));
    slab(ctx, 248, 208, 128, 7, WOOD, { lit: 1 });
    glossPoly(ctx, K, [252, 209, 372, 209, 372, 201, 362, 195, 352, 199, 304, 198, 290, 192, 276, 194, 270, 188, 260, 187, 253, 193, 250, 202], SHROUD, { gloss: 0.15, spread: 0.85 });
    fillPoly(ctx, [250, 208, 374, 208, 372, 219, 252, 219], shade(SHROUD, 0.9));
    for (const fx of [272, 300, 330, 356]) line(ctx, [fx, 209, fx - 2, 219], rgba('#8a8478', 0.5), 1);
    lanternRing(ctx, 292, 196, 4, GOLD);
    pricket(ctx, s, 232, 250, 192);
  },
};
