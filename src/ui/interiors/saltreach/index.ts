// Saltreach's businesses, all in Saltmouth: a scene to each, keyed by the interior its map feature
// names.
import type { Scene } from '../kit.ts';
import { SHRINE } from './saltmouth_shrine.ts';

export const SCENES = {
  saltmouth_shrine: SHRINE,
} satisfies Record<string, Scene>;
