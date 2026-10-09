// The Compact's house at Cinderport, the factor's: the ledgers in a row on the high shelf, all one
// binding, and one open on the counting table by the ink, the takings, the scales and the manifests
// on their spike; the strongbox; bales and crates of the trade under the window on the quay, where
// the Compact's ship lies; and in the corner, apart, a crate under the Helmstow customs seal.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, beam, plaster, floorboards, windowIn, line, slab, contact } from '../kit.ts';
import { K, counter, shelf, crate, candle, lantern } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { WASH, TIMBER, IRON, basaltWall, ashDust, sound } from './basalt.ts';

const FLOOR = 196, DADO = 122, CALF = '#6a4a30', LABEL = '#8a2a22', PAPER = '#ece2c8', BRASS = '#c9a34a', SEAL = '#a8281e', HEMP = '#c8b890', BALE = '#a89a7e';

/** The ledgers stood on the shelf at y, n of them from x: one binding for all, a red label high on each spine and a gilt rule at its head and foot. */
function ledgers(ctx: CanvasRenderingContext2D, x: number, y: number, n: number): void {
  for (let i = 0; i < n; i++) {
    const lx = x + i * 13, h = 36 - (i % 4 === 3 ? 3 : 0);
    slab(ctx, lx, y - h, 12, h, shade(CALF, 0.92 + (i % 2) * 0.08), { lit: 2, dark: 0.3, outline: true });
    slab(ctx, lx + 2, y - h + 6, 8, 6, LABEL, { lit: 1 });
    ctx.fillStyle = rgba(BRASS, 0.8); ctx.fillRect(lx + 4, y - h + 16, 4, 1); ctx.fillRect(lx + 4, y - 6, 4, 1);
  }
}

/** The strongbox on the boards, foot on y: oak bound in iron straps, a hasp and its lock. */
function strongbox(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  contact(ctx, x + w / 2, y, w * 1.1, 0.5);
  glossPoly(ctx, K, [x, y, x, y - h, x + w * 0.1, y - h - 6, x + w * 0.9, y - h - 6, x + w, y - h, x + w, y], '#5a4030', { gloss: 0.2, spread: 0.8 });
  line(ctx, [x, y - h, x + w, y - h], '#120c14', 1.5);
  for (const u of [0.18, 0.82]) { line(ctx, [x + u * w, y - 1, x + u * w, y - h - 6], '#120c14', 4); line(ctx, [x + u * w, y - 1, x + u * w, y - h - 6], IRON, 2.5); }
  slab(ctx, x + w / 2 - 5, y - h - 2, 10, 12, IRON, { lit: 1 });
  ctx.fillStyle = '#0a0808'; ctx.fillRect(x + w / 2 - 1, y - h + 4, 2, 4);
}

/** A bale of the trade's cloth, foot on y: a pad of sacking bound with cord twice round. */
function bale(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seed: number): void {
  contact(ctx, x + w / 2, y, w * 1.05, 0.45);
  glossPoly(ctx, K, [x + 2, y, x, y - h * 0.5, x + 3, y - h, x + w - 3, y - h, x + w, y - h * 0.5, x + w - 2, y], shade(BALE, 0.9 + (seed % 3) * 0.06), { gloss: 0.1, spread: 0.8, tex: 'stipple', seed, amount: 0.4 });
  for (const u of [0.3, 0.7]) line(ctx, [x + u * w, y, x + u * w + 1, y - h], HEMP, 1.5);
}

/** A crate under the Helmstow customs seal, foot on y: a cord round it both ways and a disc of red wax stamped where the cords cross. */
function sealedCrate(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  crate(ctx, x, y, w, h, '#8a7a5a', 611);
  line(ctx, [x + w / 2, y - h, x + w / 2, y], HEMP, 1.2); line(ctx, [x, y - h / 2, x + w, y - h / 2], HEMP, 1.2);
  glossBall(ctx, K, x + w / 2, y - h / 2, Math.max(2.5, w * 0.1), SEAL, { gloss: 0.6 });
  ctx.fillStyle = shade(SEAL, 0.7); ctx.fillRect(Math.round(x + w / 2) - 1, Math.round(y - h / 2) - 1, 2, 2);
}

export const CINDERPORT_FACTOR: Scene = {
  ambient: ['#262430', '#8e8a8a'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    plaster(ctx, 0, 0, STAGE_W, DADO, WASH, 612);
    basaltWall(ctx, 0, DADO, STAGE_W, FLOOR - DADO, 4, 613);
    slab(ctx, 0, DADO - 3, STAGE_W, 5, shade(WASH, 0.7), { lit: 1, dark: 0.25 });
    ashDust(ctx, 0, FLOOR - 18, STAGE_W, 18, 614, 0.25);
    floorboards(ctx, FLOOR, 200, 110, '#6a5240', 8, 615);
    beam(ctx, 0, 0, STAGE_W, 14, TIMBER, 616);
    // The ledgers on the high shelf.
    shelf(ctx, 16, 72, 146, TIMBER);
    ledgers(ctx, 22, 72, 10);
    // The window on the quay: the Compact's ship lying at it.
    const wx = 232, wy = 34, ww = 76, wh = 60;
    windowIn(ctx, s, wx, wy, ww, wh, shade(TIMBER, 0.9), { panes: [2, 2], view: sound(wx, wy, ww, wh, s, { ship: true, light: 0.8, seed: 617 }) });
    // The trade along the wall: crates and bales; the sealed crate apart in the corner.
    crate(ctx, 214, FLOOR + 10, 50, 38, '#8a6a44', 618);
    bale(ctx, 266, FLOOR + 12, 54, 34, 619);
    bale(ctx, 270, FLOOR - 22, 46, 26, 620);
    sealedCrate(ctx, 344, FLOOR + 22, 46, 40);
    strongbox(ctx, 14, FLOOR + 26, 58, 30);
    // The counting table: the ledger open by the ink and the quill, the takings, the scales, the manifests on their spike.
    counter(ctx, 92, 312, 206, 12, STAGE_H, '#5a3e2c', 621, { panels: 2, trim: BRASS });
    glossPoly(ctx, K, [120, 216, 124, 207, 150, 206, 151, 215], PAPER, {});
    glossPoly(ctx, K, [151, 215, 150, 206, 176, 207, 180, 216], shade(PAPER, 0.95), {});
    for (let i = 0; i < 3; i++) { line(ctx, [126, 208.5 + i * 2.4, 147, 208.5 + i * 2.4], rgba('#3a2a30', 0.5), 1); line(ctx, [154, 208.5 + i * 2.4, 175, 208.5 + i * 2.4], rgba('#3a2a30', 0.5), 1); }
    glossEllipse(ctx, K, 192, 212, 4, 2.5, '#1a1a22', 0, { gloss: 0.7 });
    line(ctx, [192, 210, 202, 196], '#e8e0d0', 1.5);
    for (let i = 0; i < 5; i++) glossEllipse(ctx, K, 214 + (i % 2), 215 - i * 2, 4.5, 1.8, '#e0b840', 0, { gloss: 0.7 });
    line(ctx, [250, 214, 250, 194], '#120c14', 2); line(ctx, [236, 194, 264, 194], BRASS, 1.5);
    for (const px of [236, 264]) { line(ctx, [px, 194, px - 4, 203, px + 4, 203, px, 194], rgba(BRASS, 0.8), 1); glossEllipse(ctx, K, px, 204, 5, 1.5, BRASS, 0, {}); }
    slab(ctx, 278, 210, 10, 5, TIMBER, { lit: 1 });
    line(ctx, [283, 210, 283, 194], IRON, 1.5);
    for (let i = 0; i < 4; i++) glossPoly(ctx, K, [277, 206 - i * 3, 289, 205 - i * 3, 290, 208 - i * 3, 276, 209 - i * 3], shade(PAPER, 0.9 + (i % 2) * 0.08), {});
    candle(ctx, s, 300, 214, 10, '#efe4c8', s.daylight > 0.5 ? 80 : 140);
    lantern(ctx, s, 196, 120, 9, IRON, 14, s.daylight > 0.5 ? 110 : 220);
  },
};
