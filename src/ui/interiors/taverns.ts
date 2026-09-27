// What the two taverns share: a round table in the foreground and a candle in a bottle. The scenes
// are in ./<area>/, one to a business.
import { shade, rgba } from '../../lib/art/palettes.ts';
import type { Stage } from './kit.ts';
import { STAGE_H, rnd, line, flame } from './kit.ts';
import { K, bottle, candle } from './props.ts';
import { glossPoly, glossEllipse } from '../monsters/gloss.ts';

/**
 * A round table in the foreground seen from above, centre of its top at (x, y), `w` across: an
 * elliptical top on a pedestal.
 */
export function table(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, wood: string): void {
  line(ctx, [x, y + w * 0.1, x, STAGE_H + 4], '#120c14', w * 0.14 + 2); line(ctx, [x, y + w * 0.1, x, STAGE_H + 4], shade(wood, 0.7), w * 0.14);
  glossEllipse(ctx, K, x, y + 3, w / 2, w * 0.2, shade(wood, 0.7), 0, {});
  glossEllipse(ctx, K, x, y, w / 2, w * 0.2, wood, 0, { gloss: 0.2, spread: 0.8 });
  ctx.strokeStyle = rgba(shade(wood, 0.6), 0.6); ctx.lineWidth = 1;
  for (let i = 1; i < 3; i++) { ctx.beginPath(); ctx.ellipse(x, y, (w / 2) * (i / 3), w * 0.2 * (i / 3), 0, 0, Math.PI * 2); ctx.stroke(); }
}

/** A candle stuck in the neck of a bottle, wax run down its sides. Foot on y. */
export function bottleCandle(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, h: number): void {
  bottle(ctx, x, y, h, '#2a4a3a');
  for (let i = 0; i < 4; i++) { ctx.fillStyle = '#efe4c8'; ctx.fillRect(Math.round(x - 2 + i * 1.5), Math.round(y - h), 1.5, Math.round(3 + rnd(x, i) * h * 0.4)); }
  glossPoly(ctx, K, [x - 2, y - h - 1, x - 2, y - h - 8, x + 2, y - h - 8, x + 2, y - h - 1], '#efe4c8', {});
  flame(s, x, y - h - 9, 2.4, 90, 0.75);
}
