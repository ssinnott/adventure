// Saltreach's businesses, all in Saltmouth: a scene to each, keyed by the interior its map feature
// names.
import type { Scene } from '../kit.ts';
import { CHANDLERY } from './saltmouth_chandlery.ts';

export const SCENES = {
  saltmouth_chandlery: CHANDLERY,
} satisfies Record<string, Scene>;
