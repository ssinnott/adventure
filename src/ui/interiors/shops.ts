// What the two shops share: the flask on a shelf. The scenes are in ./<area>/, one to a business.
import { rgba } from '../../lib/art/palettes.ts';
import { K } from './props.ts';
import { glossPoly, glossBall } from '../monsters/gloss.ts';

/** A round-bellied flask with a long neck, stoppered, its foot on y: the apothecary's shape. */
export function flask(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, liquid: string): void {
  glossPoly(ctx, K, [x - r * 0.28, y - r * 1.6, x - r * 0.28, y - r * 2.6, x + r * 0.28, y - r * 2.6, x + r * 0.28, y - r * 1.6], '#c8d8e0', { gloss: 0.8 });
  glossBall(ctx, K, x, y - r, r, liquid, { gloss: 0.9, spread: 0.7 });
  ctx.fillStyle = rgba('#ffffff', 0.35); ctx.fillRect(Math.round(x - r * 0.5), Math.round(y - r * 1.5), 2, Math.max(1, Math.round(r * 0.5)));
  ctx.fillStyle = '#a07850'; ctx.fillRect(Math.round(x - r * 0.3), Math.round(y - r * 2.9), Math.round(r * 0.6), Math.max(2, Math.round(r * 0.35)));
}
