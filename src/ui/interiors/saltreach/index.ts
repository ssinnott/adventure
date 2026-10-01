// Saltreach's businesses, all in Saltmouth: a scene to each, keyed by the interior its map feature
// names.
import type { Scene } from '../kit.ts';
import { MAP_ROOM } from './cartographers_room.ts';

export const SCENES = {
  cartographers_room: MAP_ROOM,
} satisfies Record<string, Scene>;
