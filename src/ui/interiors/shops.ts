// What the two shops share: a flask on a shelf and a spill of coins. The scenes are in
// ./<area>/, one to a business.
import { rgba } from '../../lib/art/palettes.ts';
import { rnd } from './kit.ts';
import { K } from './props.ts';
import { glossPoly, glossEllipse, glossBall } from '../monsters/gloss.ts';

export const BRASS = '#c9a34a';

/** A round-bellied flask with a long neck, stoppered, its foot on y: the apothecary's shape. */
export function flask(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, liquid: string): void {
  glossPoly(ctx, K, [x - r * 0.28, y - r * 1.6, x - r * 0.28, y - r * 2.6, x + r * 0.28, y - r * 2.6, x + r * 0.28, y - r * 1.6], '#c8d8e0', { gloss: 0.8 });
  glossBall(ctx, K, x, y - r, r, liquid, { gloss: 0.9, spread: 0.7 });
  ctx.fillStyle = rgba('#ffffff', 0.35); ctx.fillRect(Math.round(x - r * 0.5), Math.round(y - r * 1.5), 2, Math.max(1, Math.round(r * 0.5)));
  ctx.fillStyle = '#a07850'; ctx.fillRect(Math.round(x - r * 0.3), Math.round(y - r * 2.9), Math.round(r * 0.6), Math.max(2, Math.round(r * 0.35)));
}

/** A little stack of coins on y. */
export function coins(ctx: CanvasRenderingContext2D, x: number, y: number, n: number, metal = '#e0b840'): void {
  for (let i = 0; i < n; i++) glossEllipse(ctx, K, x + (rnd(3, i) - 0.5) * 2, y - 1 - i * 2, 4.5, 1.8, metal, 0, { gloss: 0.7 });
}
