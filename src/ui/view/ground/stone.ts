// Stone's look (#1030): bare rock in its own colour, nothing on it.

import { TERRAIN_COLORS } from '../../palette.ts';
import type { GroundLook } from './look.ts';

export const stone: GroundLook = { color: () => TERRAIN_COLORS.stone, snow: 0.85, wets: true, splashes: true, ripples: false, vary: 0.08 };
