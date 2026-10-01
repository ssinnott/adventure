// Saltreach's businesses, all in Saltmouth: a scene to each, keyed by the interior its map feature
// names.
import type { Scene } from '../kit.ts';
import { SALTMOUTH_INN } from './saltmouth_inn.ts';

export const SCENES = {
  saltmouth_inn: SALTMOUTH_INN,
} satisfies Record<string, Scene>;
