// Crystal's look (#1030): the ground the glass trees stand on, and the glass tree it draws for a tree,
// catching the sun by day.

import { TERRAIN_COLORS } from '../../palette.ts';
import { drawCrystalSprite } from '../../scenery.ts';
import { hash } from '../../paint/brush.ts';
import type { GroundLook } from './look.ts';

export const crystal: GroundLook = { color: () => TERRAIN_COLORS.crystal, snow: 0.5, wets: true, splashes: true, ripples: false, vary: 0.08,
  boards: { tree: (p, b) => drawCrystalSprite(p.ctx, b.x, b.y, b.u, b.tone, Math.floor(hash(b.mx, b.my) * 3), p.dark ? 0 : p.daylight * (1 - b.cloud)) } };
