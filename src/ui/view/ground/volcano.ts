// The volcano's look (#1030): the cone's black rock, whose warmth thins the snow, and the cone it draws for
// a mountain, the fire in its lip dull by day and bright by night.

import { TERRAIN_COLORS } from '../../palette.ts';
import { drawVolcanoSprite } from '../../scenery.ts';
import { hash } from '../../paint/brush.ts';
import type { GroundLook } from './look.ts';

export const volcano: GroundLook = { color: () => TERRAIN_COLORS.volcano, snow: 0.4, wets: true, splashes: true, ripples: false, vary: 0.08,
  boards: { mountain: (p, b) => drawVolcanoSprite(p.ctx, b.x, b.y, b.u, b.tone, Math.floor(hash(b.mx, b.my, 3) * 3), false, p.dark ? 1 : 0.35, 0.6 * p.env.cover) } };
