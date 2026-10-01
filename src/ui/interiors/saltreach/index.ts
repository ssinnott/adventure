// Saltreach's businesses, all in Saltmouth: a scene to each, keyed by the interior its map feature
// names.
import type { Scene } from '../kit.ts';
import { ARMOURER } from './saltmouth_armourer.ts';

export const SCENES = {
  saltmouth_armourer: ARMOURER,
} satisfies Record<string, Scene>;
