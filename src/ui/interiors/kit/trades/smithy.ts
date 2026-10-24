// A smithy's props: the suit of plate on its stand, the mail on its peg and the anvil, which the
// armourers, the forges and the smiths' scenes stand in their rooms. Sorted out of ../props.ts by the
// trade that uses them (#983); the old path, src/ui/interiors/props.ts, re-exports them.
import { shade, rgba } from '../../../../lib/art/palettes.ts';
import { glossPoly, glossEllipse, glossBall } from '../../../paint/gloss.ts';
import { K } from '../props.ts';
import { line, slab } from '../stage.ts';

/**
 * A suit of plate on its stand, foot on y: helm with a visor slit, pauldrons, a breastplate with a
 * ridge down it, tassets over the hips, and the stand's post and cross-foot showing below.
 */
export function armourStand(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, metal = '#aab2be'): void {
  const u = h / 100;
  line(ctx, [x, y, x, y - 40 * u], '#120c14', 5); line(ctx, [x, y, x, y - 40 * u], '#6a4626', 3);
  line(ctx, [x - 14 * u, y, x + 14 * u, y], '#120c14', 5); line(ctx, [x - 14 * u, y, x + 14 * u, y], '#6a4626', 3);
  // Tassets and cuirass.
  glossPoly(ctx, K, [x - 17 * u, y - 44 * u, x + 17 * u, y - 44 * u, x + 19 * u, y - 32 * u, x + 4 * u, y - 30 * u, x, y - 34 * u, x - 4 * u, y - 30 * u, x - 19 * u, y - 32 * u], shade(metal, 0.9), { gloss: 0.5, spread: 0.6 });
  glossPoly(ctx, K, [x - 20 * u, y - 80 * u, x + 20 * u, y - 80 * u, x + 17 * u, y - 58 * u, x + 13 * u, y - 44 * u, x - 13 * u, y - 44 * u, x - 17 * u, y - 58 * u], metal, { gloss: 0.7, spread: 0.6 });
  line(ctx, [x, y - 79 * u, x, y - 46 * u], rgba('#ffffff', 0.55), 1.5);
  line(ctx, [x - 13 * u, y - 50 * u, x + 13 * u, y - 50 * u], rgba('#1a1418', 0.5), 1);
  // Pauldrons.
  for (const sd of [-1, 1]) glossEllipse(ctx, K, x + sd * 22 * u, y - 78 * u, 9 * u, 7 * u, metal, sd * 0.3, { gloss: 0.7 });
  // The gorget and helm.
  glossPoly(ctx, K, [x - 8 * u, y - 80 * u, x + 8 * u, y - 80 * u, x + 7 * u, y - 86 * u, x - 7 * u, y - 86 * u], shade(metal, 0.85), { gloss: 0.5 });
  glossPoly(ctx, K, [x - 9 * u, y - 86 * u, x - 10 * u, y - 97 * u, x - 5 * u, y - 104 * u, x + 5 * u, y - 104 * u, x + 10 * u, y - 97 * u, x + 9 * u, y - 86 * u], metal, { gloss: 0.8, spread: 0.6 });
  ctx.fillStyle = '#120c14'; ctx.fillRect(Math.round(x - 7 * u), Math.round(y - 96 * u), Math.round(14 * u), Math.max(1, Math.round(1.6 * u)));
  line(ctx, [x, y - 104 * u, x, y - 88 * u], rgba('#ffffff', 0.5), 1);
  glossPoly(ctx, K, [x - 2 * u, y - 104 * u, x, y - 110 * u, x + 2 * u, y - 104 * u], '#a83a2a', {});
}

/** Chain mail hung on a peg, its top at y: a shirt of rings with short sleeves. */
export function mail(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, metal = '#9aa2ae'): void {
  const w = h * 0.8;
  glossPoly(ctx, K, [x - w * 0.2, y, x + w * 0.2, y, x + w * 0.5, y + h * 0.08, x + w * 0.52, y + h * 0.3, x + w * 0.36, y + h * 0.3, x + w * 0.38, y + h, x - w * 0.38, y + h, x - w * 0.36, y + h * 0.3, x - w * 0.52, y + h * 0.3, x - w * 0.5, y + h * 0.08], metal, { gloss: 0.3, spread: 0.7, h: 100, tex: 'mail', seed: Math.round(x), amount: 1 });
  glossBall(ctx, K, x, y - 2, 2.5, '#6a4626', {});
}

/** An anvil on its block, foot on y: the horn to the left, the face, the heel. */
export function anvil(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  slab(ctx, x - w * 0.28, y - w * 0.36, w * 0.56, w * 0.36, '#6a4a2e');
  glossPoly(ctx, K, [x - w * 0.18, y - w * 0.36, x - w * 0.12, y - w * 0.5, x + w * 0.12, y - w * 0.5, x + w * 0.18, y - w * 0.36], '#3e3c44', { gloss: 0.4 });
  glossPoly(ctx, K, [x - w * 0.5, y - w * 0.62, x - w * 0.22, y - w * 0.66, x + w * 0.4, y - w * 0.66, x + w * 0.4, y - w * 0.52, x - w * 0.22, y - w * 0.52], '#4a4852', { gloss: 0.6, spread: 0.6 });
  line(ctx, [x - w * 0.2, y - w * 0.655, x + w * 0.38, y - w * 0.655], rgba('#ffffff', 0.5), 1);
}
