// A peak's look (#1030): the scree under it, which takes snow as the hills do, and the summit it draws for
// a mountain, its snow lower in the winter and under lying snow.

import { TERRAIN_COLORS } from '../../palette.ts';
import { drawPeakSprite } from '../../scenery.ts';
import { hash } from '../../paint/brush.ts';
import { cold } from '../model.ts';
import type { GroundLook } from './look.ts';

export const peak: GroundLook = { color: () => TERRAIN_COLORS.peak, snow: 0.9, wets: true, splashes: true, ripples: false, vary: 0.08,
  boards: { mountain: (p, b) => drawPeakSprite(p.ctx, b.x, b.y, b.u, b.tone, Math.floor(hash(b.mx, b.my, 3) * 3), 0.5 + 0.18 * cold(p.env.day) + 0.3 * p.env.cover) } };
