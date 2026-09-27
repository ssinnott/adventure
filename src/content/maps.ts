// The maps as played. Kept apart from the tables in ./index.ts, so what imports an item or a monster
// does not lay out the whole outdoors.
import { GameMap } from '../game/map.ts';
import type { MapDef } from '../game/map.ts';
import { layOutdoors } from '../game/outdoors.ts';
import { ATLAS, MAP_DEFS } from './index.ts';

/**
 * The maps as played: the outdoors as one map with the Shelf and Thornmark laid into it where the
 * atlas puts them (game/outdoors.ts), and the towns and dungeons, whose ways out lead onto it.
 */
export const PLAYED_DEFS: readonly MapDef[] = layOutdoors(ATLAS, MAP_DEFS);

/** Fresh GameMap instances (cells are mutable: doors unlock, secrets open). */
export function buildMaps(): Record<string, GameMap> {
  return Object.fromEntries(PLAYED_DEFS.map((d) => [d.id, new GameMap(d)]));
}
