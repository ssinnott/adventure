// Hearth Isle's businesses, the pilgrims' camp's three tents in the Bowl (#762): a scene to each,
// keyed by the interior its map feature names.
import type { Scene } from '../kit.ts';
import { BOWL_STORE } from './bowl_store.ts';
import { BOWL_YARD } from './bowl_yard.ts';
import { BOWL_LANTERN } from './bowl_lantern.ts';

export const SCENES = {
  bowl_store: BOWL_STORE,
  bowl_yard: BOWL_YARD,
  bowl_lantern: BOWL_LANTERN,
} satisfies Record<string, Scene>;
