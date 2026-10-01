// Saltreach's businesses, all in Saltmouth: a scene to each, keyed by the interior its map feature
// names.
import type { Scene } from '../kit.ts';
import { HARBOUR_TAVERN } from './harbour_tavern.ts';

export const SCENES = {
  harbour_tavern: HARBOUR_TAVERN,
} satisfies Record<string, Scene>;
