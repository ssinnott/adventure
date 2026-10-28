// A vent's look (#1030): a mouth smoking in the cone, whose fire takes all the snow, and the cone it draws
// for a mountain with the vent's fire in it.

import { TERRAIN_COLORS } from '../../palette.ts';
import { drawVolcanoSprite } from '../../scenery.ts';
import { hash } from '../../paint/brush.ts';
import type { GroundLook } from './look.ts';

export const vent: GroundLook = { color: () => TERRAIN_COLORS.vent, snow: 0, wets: true, splashes: true, ripples: false, vary: 0.08,
  boards: { mountain: (p, b) => drawVolcanoSprite(p.ctx, b.x, b.y, b.u, b.tone, Math.floor(hash(b.mx, b.my, 3) * 3), true, p.dark ? 1 : 0.35, 0.6 * p.env.cover) } };
