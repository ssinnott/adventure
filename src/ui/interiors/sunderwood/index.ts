// Sunderwood's businesses, all in Lantern Watch: a scene to each, keyed by the interior its map
// feature names.
import type { Scene } from '../kit.ts';
import { WATCH_HALL } from './watch_hall.ts';

export const SCENES = {
  watch_hall: WATCH_HALL,
} satisfies Record<string, Scene>;
