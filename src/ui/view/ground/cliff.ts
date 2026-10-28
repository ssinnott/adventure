// A cliff's look (#1030): the foot of the escarpment, sheltered from the snow by its face, and the face it
// draws for a mountain, snow along its top.

import { TERRAIN_COLORS } from '../../palette.ts';
import { drawCliffSprite } from '../../scenery.ts';
import { hash } from '../../paint/brush.ts';
import { cold } from '../model.ts';
import type { GroundLook } from './look.ts';

export const cliff: GroundLook = { color: () => TERRAIN_COLORS.cliff, snow: 0.6, wets: true, splashes: true, ripples: false, vary: 0.08,
  boards: { mountain: (p, b) => drawCliffSprite(p.ctx, b.x, b.y, b.u, b.tone, Math.floor(hash(b.mx, b.my, 3) * 3), 0.3 * cold(p.env.day) + p.env.cover) } };
