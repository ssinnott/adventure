// Deep water's look (#1030): as water's, darker, and nothing on it.

import { TERRAIN_COLORS } from '../../palette.ts';
import type { GroundLook } from './look.ts';

export const deep: GroundLook = { color: () => TERRAIN_COLORS.deep, snow: 0, wets: false, splashes: false, ripples: true, vary: 0.08 };
