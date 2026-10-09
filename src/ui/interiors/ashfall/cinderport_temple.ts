// Cinderport's temple: a plain nave of basalt between two columns, the round window over the altar
// on the Sound with the column of light standing in it; on the altar a basin of Scaldwell's water,
// carried up hot from the springs, steaming, a candle at each end and a tall one each side; the
// healer's cot with its linen by the wall, and a brazier to keep the sick warm.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, beam, flagstones, windowIn, line, contact, slab, smudge, pool } from '../kit.ts';
import { K, altar, pillar, candle, jar } from '../props.ts';
import { glossPoly, glossEllipse } from '../../monsters/gloss.ts';
import { TIMBER, IRON, SLIP, basaltWall, ashDust, sound } from './basalt.ts';

const FLOOR = 196, STONE = '#5e5c62', LINEN = '#d8d0bc', BLANKET = '#6a6660', WATER = '#7a9a94';

/** A tall iron candlestick on three feet, the floor at y, its candle burning at `top`. */
function candlestick(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, top: number): void {
  contact(ctx, x, y, 18, 0.45);
  for (const sd of [-1, 0, 1]) line(ctx, [x, y - 10, x + sd * 8, y + (sd ? 0 : 2)], '#120c14', 3);
  line(ctx, [x, y - 6, x, top], '#120c14', 4); line(ctx, [x, y - 6, x, top], IRON, 2);
  glossEllipse(ctx, K, x, top, 7, 2.2, IRON, 0, { gloss: 0.5 });
  candle(ctx, s, x, top - 1, 16, '#efe4c8', 90);
}

/** The healer's cot along the wall, its foot on y from x0 to x1: the frame on its legs, a grey blanket over the straw tick, the bolster, linen folded at its foot. */
function cot(ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number): void {
  contact(ctx, (x0 + x1) / 2, y, x1 - x0 + 6, 0.45);
  for (const lx of [x0 + 3, x1 - 5]) slab(ctx, lx, y - 16, 4, 16, shade(TIMBER, 0.85));
  slab(ctx, x0, y - 22, x1 - x0, 7, TIMBER, { lit: 1 });
  glossPoly(ctx, K, [x0 + 2, y - 22, x0 + 4, y - 30, x1 - 4, y - 31, x1 - 1, y - 22], '#c8b88a', { gloss: 0.1, spread: 0.8 });
  glossPoly(ctx, K, [x0 + 26, y - 21, x0 + 28, y - 33, x1 - 2, y - 34, x1 + 2, y - 20, x1 - 4, y - 14, x0 + 30, y - 14], BLANKET, { gloss: 0.1, spread: 0.8, tex: 'stipple', seed: 561, amount: 0.4 });
  line(ctx, [x0 + 40, y - 30, x0 + 44, y - 16], rgba('#120c14', 0.4), 1);
  glossEllipse(ctx, K, x0 + 14, y - 32, 12, 5, LINEN, -0.05, { gloss: 0.2 });
}

/** A brazier on its three legs, the floor at y: an iron bowl of coals that glow and warm the room round it. */
function brazier(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, r: number): void {
  contact(ctx, x, y, r * 2, 0.5);
  for (const sd of [-1, 0, 1]) { line(ctx, [x + sd * r * 0.4, y - r * 1.4, x + sd * r * 0.9, y + (sd ? 0 : 3)], '#120c14', 3); line(ctx, [x + sd * r * 0.4, y - r * 1.4, x + sd * r * 0.9, y + (sd ? 0 : 3)], IRON, 1.5); }
  glossPoly(ctx, K, [x - r, y - r * 1.9, x + r, y - r * 1.9, x + r * 0.6, y - r * 1.3, x - r * 0.6, y - r * 1.3], IRON, { gloss: 0.4 });
  glossEllipse(ctx, K, x, y - r * 1.9, r, r * 0.3, '#5a2a1a', 0, { tex: 'stipple', seed: 562, amount: 0.6 });
  s.lights.push({ k: 'glow', x, y: y - r * 1.95, r: r * 1.2, color: '#ff7030', a: 0.6 });
  pool(s, x, y - r * 2, 120, '#ff9050', 0.6);
}

export const CINDERPORT_TEMPLE: Scene = {
  ambient: ['#24242e', '#8a8a90'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    basaltWall(ctx, 0, 12, STAGE_W, FLOOR - 12, 9, 563);
    ashDust(ctx, 0, FLOOR - 22, STAGE_W, 22, 564, 0.3);
    flagstones(ctx, FLOOR, 200, 100, '#56545a', 6, 565);
    beam(ctx, 0, 0, STAGE_W, 13, shade(TIMBER, 0.85), 566);
    // The round window over the altar, on the Sound: the column of light stands in it.
    const wx = 170, wy = 30, ww = 60;
    windowIn(ctx, s, wx, wy, ww, ww, STONE, { round: true, view: sound(wx, wy, ww, ww, s, { light: 0.5, seed: 567 }) });
    pillar(ctx, 64, 13, FLOOR + 4, 26, STONE);
    pillar(ctx, 336, 13, FLOOR + 4, 26, STONE);
    // The altar, its linen and red border; the basin of the springs' water on it, steaming; a candle at each end.
    altar(ctx, 146, 254, 150, 14, FLOOR + 18, STONE, LINEN, SLIP);
    glossEllipse(ctx, K, 200, 160, 26, 6, '#6a686e', 0, { gloss: 0.3 });
    glossEllipse(ctx, K, 200, 157, 22, 4, WATER, 0, { gloss: 0.8 });
    for (let i = 0; i < 4; i++) smudge(ctx, 194 + i * 4, 146 - i * 9, 9 + i * 2, '#e8ecf0', 0.22 - i * 0.04);
    s.lights.push({ k: 'motes', x: 184, y: 112, w: 32, h: 40, color: '#e8eef4', n: 9, rise: 0.25 });
    candle(ctx, s, 156, 158, 12, '#efe4c8', 110);
    candle(ctx, s, 244, 158, 12, '#efe4c8', 110);
    candlestick(ctx, s, 118, FLOOR + 20, 120);
    candlestick(ctx, s, 282, FLOOR + 20, 120);
    // The healer's cot by the wall, a jar of salve at its head; the brazier by the sick.
    cot(ctx, 8, 104, FLOOR + 40);
    jar(ctx, 116, FLOOR + 42, 12, 16, '#8a6a4a', '#3a2a1a');
    brazier(ctx, s, 354, FLOOR + 46, 18);
  },
};
