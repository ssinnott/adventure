// Sunderwood's businesses, all in Lantern Watch: a scene to each, keyed by the interior its map
// feature names.
import type { Scene } from '../kit.ts';
import { WATCH_HALL } from './watch_hall.ts';
import { REFECTORY } from './watch_refectory.ts';
import { STORES } from './watch_stores.ts';
import { PRIORS_ROOM } from './priors_room.ts';
import { WATCH_GALLERY } from './watch_gallery.ts';

export const SCENES = {
  watch_hall: WATCH_HALL,
  watch_refectory: REFECTORY,
  watch_stores: STORES,
  priors_room: PRIORS_ROOM,
  watch_gallery: WATCH_GALLERY,
} satisfies Record<string, Scene>;
