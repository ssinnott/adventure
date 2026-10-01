// Sunderwood's businesses, all in Lantern Watch: a scene to each, keyed by the interior its map
// feature names.
import type { Scene } from '../kit.ts';
import { WATCH_HALL } from './watch_hall.ts';
import { REFECTORY } from './watch_refectory.ts';

export const SCENES = {
  watch_hall: WATCH_HALL,
  watch_refectory: REFECTORY,
} satisfies Record<string, Scene>;
