// Cinderport's chandler, who keeps the Riders' trade on trading days: a saddle on its trestle over a
// saddle cloth woven in their bands, bridles and a halter on the pegs; lamp oil in a cask with its
// tap and the clay lamps it burns in on the shelf, jars of it beside them; the fish off the racks
// under the wall, split and dried flat and tied in bundles on the counter; the mountain through the
// window over the cask.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, beam, floorboards, windowIn, line, contact, slab } from '../kit.ts';
import { K, counter, shelf, jar, jug, sack, crate, kegEnd, lantern, candle } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { TIMBER, IRON, CLAY, basaltWall, ashDust, mountain } from './basalt.ts';

const FLOOR = 198, LEATHER = '#6a4026', RED = '#9a2e22', OCHRE = '#c8902e', HEMP = '#c8b080', FISH = '#c8b48a', BRASS = '#c9a34a';

/** The Riders' saddle on a trestle, the floor at y, centred on x: the trestle's splayed legs, the cloth over its beam in red and ochre bands, the saddle's seat between a high pommel and cantle, a stirrup down each side. */
function saddle(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  const top = y - 44;
  contact(ctx, x, y, w * 1.1, 0.45);
  for (const sd of [-1, 1]) for (const k of [-0.3, 0.3]) { line(ctx, [x + sd * w * 0.42, top + 2, x + sd * w * 0.5 + k * 8, y], '#120c14', 5); line(ctx, [x + sd * w * 0.42, top + 2, x + sd * w * 0.5 + k * 8, y], TIMBER, 3); }
  slab(ctx, x - w * 0.5, top - 2, w, 6, shade(TIMBER, 1.1), { lit: 1 });
  const cloth = [x - w * 0.36, top - 8, x + w * 0.36, top - 8, x + w * 0.38, top + 26, x - w * 0.38, top + 26];
  glossPoly(ctx, K, cloth, RED, { gloss: 0.1, spread: 0.8 });
  for (let i = 0; i < 3; i++) { const by = top - 2 + i * 9; line(ctx, [x - w * 0.36, by, x + w * 0.37, by], OCHRE, 2); }
  for (let i = 0; i < 9; i++) line(ctx, [x - w * 0.34 + i * w * 0.085, top + 26, x - w * 0.34 + i * w * 0.085, top + 30], OCHRE, 1);
  glossPoly(ctx, K, [x - w * 0.3, top - 8, x - w * 0.34, top - 26, x - w * 0.26, top - 22, x - w * 0.1, top - 14, x + w * 0.14, top - 14, x + w * 0.28, top - 20, x + w * 0.32, top - 32, x + w * 0.38, top - 26, x + w * 0.3, top - 8], LEATHER, { gloss: 0.4, spread: 0.6 });
  line(ctx, [x - w * 0.2, top - 16, x + w * 0.2, top - 16], rgba('#2a1a10', 0.6), 1);
  for (const sd of [-1, 1]) {
    const sx = x + sd * w * 0.08;
    line(ctx, [sx, top - 10, sx + sd * 2, top + 34], '#2a1a10', 2.5);
    glossPoly(ctx, K, [sx + sd * 2 - 5, top + 34, sx + sd * 2 + 5, top + 34, sx + sd * 2 + 4, top + 42, sx + sd * 2 - 4, top + 42], IRON, { gloss: 0.5 });
  }
}

/** A bridle on its peg at (x, y): the headstall's loops of leather, the browband across, the bit and its rings below, the reins hung down in a loop. */
function bridle(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.ellipse(x, y + h * 0.4, h * 0.2, h * 0.4, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = LEATHER; ctx.lineWidth = 2; ctx.stroke();
  line(ctx, [x - h * 0.2, y + h * 0.22, x + h * 0.2, y + h * 0.22], BRASS, 2);
  line(ctx, [x - h * 0.24, y + h * 0.82, x + h * 0.24, y + h * 0.82], IRON, 2);
  for (const sd of [-1, 1]) { ctx.strokeStyle = IRON; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x + sd * h * 0.24, y + h * 0.82, 3, 0, Math.PI * 2); ctx.stroke(); }
  line(ctx, [x - h * 0.24, y + h * 0.85, x - h * 0.1, y + h * 1.3, x + h * 0.1, y + h * 1.3, x + h * 0.24, y + h * 0.85], LEATHER, 1.5);
  glossBall(ctx, K, x, y, 2.5, TIMBER, {});
}

/** A halter of hemp on its peg at (x, y): the noseband and the crown in loops, the lead rope coiled under. */
function halter(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  for (const [ry, rx] of [[0.35, 0.22], [0.75, 0.16]]) { ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, y + h * ry, h * rx, h * 0.3, 0, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = HEMP; ctx.lineWidth = 1.5; ctx.stroke(); }
  for (let i = 0; i < 3; i++) { ctx.strokeStyle = shade(HEMP, 0.85 + i * 0.07); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x + 2, y + h * 1.12 + i, h * 0.18 - i, h * 0.08, 0, 0, Math.PI * 2); ctx.stroke(); }
  glossBall(ctx, K, x, y, 2.5, TIMBER, {});
}

/** A clay lamp of the kind the oil is burned in: a shallow body, its spout to the right, a ring handle; foot on y. */
function oilLamp(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  glossPoly(ctx, K, [x - w * 0.5, y - w * 0.12, x - w * 0.3, y - w * 0.32, x + w * 0.2, y - w * 0.32, x + w * 0.62, y - w * 0.22, x + w * 0.5, y - w * 0.1, x + w * 0.2, y, x - w * 0.3, y], CLAY, { gloss: 0.4 });
  ctx.fillStyle = '#1a1010'; ctx.beginPath(); ctx.ellipse(x - w * 0.04, y - w * 0.3, w * 0.14, w * 0.05, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x - w * 0.56, y - w * 0.2, w * 0.1, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = CLAY; ctx.lineWidth = 1.2; ctx.stroke();
}

/** A bundle of split fish dried flat on the racks, stacked and tied with twine, lying on y. */
function fishBundle(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, n: number): void {
  for (let i = 0; i < n; i++) {
    const fy = y - i * 3.5, col = shade(FISH, 0.85 + (i % 2) * 0.12);
    glossPoly(ctx, K, [x - w * 0.5, fy - 1, x - w * 0.62, fy - 4, x - w * 0.62, fy + 1, x - w * 0.4, fy - 1.5, x + w * 0.3, fy - 4, x + w * 0.5, fy - 2, x + w * 0.3, fy + 0.5], col, { gloss: 0.3 });
  }
  for (const u of [-0.15, 0.2]) line(ctx, [x + u * w, y + 1, x + u * w, y - n * 3.5 - 2], '#8a6a3a', 1.5);
}

export const CINDERPORT_CHANDLERY: Scene = {
  ambient: ['#26242a', '#8a8684'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    basaltWall(ctx, 0, 12, STAGE_W, FLOOR - 12, 9, 581);
    ashDust(ctx, 0, FLOOR - 20, STAGE_W, 20, 582, 0.3);
    floorboards(ctx, FLOOR, 200, 110, '#6a5440', 8, 583);
    beam(ctx, 0, 0, STAGE_W, 13, shade(TIMBER, 0.85), 584);
    // The pegs: two bridles and a halter; the saddle on its trestle under them.
    beam(ctx, 14, 62, 128, 7, TIMBER, 585);
    bridle(ctx, 34, 70, 40); bridle(ctx, 74, 70, 36); halter(ctx, 116, 70, 36);
    saddle(ctx, 76, FLOOR + 26, 104);
    // The shelf of lamps and oil, the window on the mountain over the cask.
    shelf(ctx, 160, 98, 116, TIMBER);
    shelf(ctx, 160, 140, 116, TIMBER);
    for (let i = 0; i < 4; i++) oilLamp(ctx, 178 + i * 27, 98, 18);
    for (let i = 0; i < 4; i++) jar(ctx, 172 + i * 28, 140, 18, 26, ['#7a5a3e', CLAY][i % 2], '#3a2a1a');
    const wx = 306, wy = 30, ww = 64, wh = 52;
    windowIn(ctx, s, wx, wy, ww, wh, shade(TIMBER, 0.9), { panes: [2, 1], view: mountain(wx, wy, ww, wh, s, { at: 0.45, vines: true, seed: 586 }) });
    // The oil cask on its cradle, its tap and the jug under it.
    slab(ctx, 304, FLOOR - 14, 72, 14, shade(TIMBER, 0.9), { lit: 1 });
    for (const lx of [308, 366]) slab(ctx, lx, FLOOR - 2, 6, 10, shade(TIMBER, 0.7));
    kegEnd(ctx, 340, FLOOR - 46, 32, '#7a5232', IRON, BRASS);
    jug(ctx, 340, FLOOR + 8, 16, CLAY, '#c8b080');
    contact(ctx, 340, FLOOR + 8, 26, 0.4);
    // The counter: the fish in bundles, the scale and the takings, a candle; the lamp from the beam.
    counter(ctx, 136, 296, 206, 11, STAGE_H, '#6a5038', 587, { panels: 2, trim: BRASS });
    fishBundle(ctx, 168, 215, 40, 4); fishBundle(ctx, 212, 213, 36, 3);
    glossEllipse(ctx, K, 256, 213, 9, 2.5, BRASS, 0, { gloss: 0.7 });
    line(ctx, [256, 212, 256, 196], '#120c14', 2); line(ctx, [244, 196, 268, 196], BRASS, 1.5);
    for (const px of [244, 268]) { line(ctx, [px, 196, px - 4, 204, px + 4, 204, px, 196], rgba(BRASS, 0.8), 1); glossEllipse(ctx, K, px, 205, 5, 1.5, BRASS, 0, {}); }
    candle(ctx, s, 284, 215, 10, '#efe4c8', s.daylight > 0.5 ? 80 : 140);
    lantern(ctx, s, 220, 60, 9, IRON, 13, s.daylight > 0.5 ? 110 : 260);
    // A sack of meal open on the boards in front, and a crate.
    sack(ctx, 40, 262, 46, 52, '#c0a47a', { open: '#e8d8a8', seed: 7 });
    crate(ctx, 344, 270, 52, 38, '#8a6a44', 588);
  },
};
