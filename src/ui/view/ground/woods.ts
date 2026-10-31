// The woods' look (#1030): the grass of the year in the trees' shade, leaf litter and ferns on it, and a
// tree or two at the sides of each square, the way through it open.

import { shade, mix } from '../../../lib/art/palettes.ts';
import { drawTreeSprite, treeOf } from '../../scenery.ts';
import { hash } from '../../paint/brush.ts';
import { fog, grassColor } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark, Square } from './look.ts';
import { fronds, leaves, needles } from './near.ts';
import type { Pixels } from './near.ts';

/** The floor of the woods: the grass of the year in the trees' shade, over moss and leaf litter. */
function woodsColor(day: number): string { return mix(grassColor(day), '#3e5028', 0.45); }

/** Three leaves, then ferns. */
function mark(p: Paint, m: Mark): void {
  const { ctx, env } = p, { i, x, y, sc, base, seed, d } = m;
  // Leaf litter and ferns under the trees, buried by a deep snow.
  if (env.cover > 0.55) return;
  if (i < 3) {
    ctx.fillStyle = fog(p, ['#6a4a2a', '#8a6a2e', '#4e5a2c'][Math.floor(hash(seed, 43, i) * 3)], d);
    ctx.fillRect(Math.round(x), Math.round(y - sc), Math.max(1, Math.round(3 * sc)), Math.max(1, Math.round(1.5 * sc)));
  } else {
    ctx.strokeStyle = fog(p, shade(base, 1.45), d); ctx.lineWidth = Math.max(1, sc);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 4 * sc, y - 3 * sc); ctx.moveTo(x, y); ctx.lineTo(x, y - 5 * sc); ctx.moveTo(x, y); ctx.lineTo(x + 4 * sc, y - 3 * sc); ctx.stroke();
  }
}

/** Near to (#1102, near.ts): leaf litter in browns and ochre, twigs fallen across it and ferns arching over it. */
function litter(p: Paint, base: string, sq: Square): Pixels {
  const px = leaves(p, base, sq, 10, 12, ['#6a4a2a', '#7a6030', '#4e5a2c', '#84603a'].map((c) => mix(c, base, 0.3)));
  needles(p, base, sq, { rows: 3, cols: 4, a: '#3e2e1e', b: '#5a4630', len: [5, 9], salt: 241 }, px);
  return fronds(p, base, sq, { rows: 7, cols: 9, len: [7, 11], lit: 1.28, dark: 0.75, bare: 0.3, salt: 245 }, px);
}

export const woods: GroundLook = { color: woodsColor, drift: { toward: ['#24401e', '#a08a50'], by: 0.6 }, snow: 0.75, wets: true, splashes: true, ripples: false, vary: 0.08, lies: { marks: 6, mark }, near: litter,
  sides: { bare: 0.3, size: 0.5, spread: 0.2, tree: (p, x, y, s, tone, pick, trees) => drawTreeSprite(p.ctx, x, y, s, tone, treeOf(trees?.forest, pick), p.env.trees) } };
