// The maps as played. Kept apart from the tables in ./index.ts, so what imports an item or a monster
// does not lay out the whole outdoors.
import { GameMap } from '../game/map.ts';
import type { MapDef } from '../game/map.ts';
import { layOutdoors } from '../game/outdoors.ts';
import { worldGrid } from '../game/atlas.ts';
import type { WorldGrid } from '../game/atlas.ts';
import { ATLAS, MAP_DEFS } from './index.ts';

/**
 * The world as cells, as the world map paints it: built once, for the void's looks here and for the
 * map's paint (ui/worldmap.ts).
 */
export const GRID: WorldGrid = worldGrid(ATLAS, MAP_DEFS);

/**
 * The maps as played: the outdoors as one map with the Foreland and Thornmark laid into it where
 * the atlas puts them (game/outdoors.ts), its void drawn as the atlas paints it, and the towns and
 * dungeons, whose ways out lead onto it.
 */
export const PLAYED_DEFS: readonly MapDef[] = layOutdoors(ATLAS, MAP_DEFS, GRID);

/** Fresh GameMap instances (cells are mutable: doors unlock, secrets open). */
export function buildMaps(): Record<string, GameMap> {
  return Object.fromEntries(PLAYED_DEFS.map((d) => [d.id, new GameMap(d)]));
}
