// Saltreach's businesses, all in Saltmouth: a scene to each, keyed by the interior its map feature
// names.
import type { Scene } from '../kit.ts';
import { LOCKSMITH } from './saltmouth_locksmith.ts';

export const SCENES = {
  saltmouth_locksmith: LOCKSMITH,
} satisfies Record<string, Scene>;
