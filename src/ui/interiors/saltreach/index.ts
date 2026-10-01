// Saltreach's businesses, all in Saltmouth: a scene to each, keyed by the interior its map feature
// names.
import type { Scene } from '../kit.ts';
import { SALTMOUTH_INN } from './saltmouth_inn.ts';
import { TRAINING_LOFT } from './training_loft.ts';

export const SCENES = {
  saltmouth_inn: SALTMOUTH_INN,
  training_loft: TRAINING_LOFT,
} satisfies Record<string, Scene>;
