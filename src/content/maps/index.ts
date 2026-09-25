import { GameMap } from '../../game/map.ts';
import type { MapDef } from '../../game/map.ts';
import { layOutdoors } from '../../game/outdoors.ts';
import { ATLAS } from '../atlas.ts';
import { HARROW } from './harrow.ts';
import { SHELF } from './shelf.ts';
import { MILL } from './mill.ts';
import { GREYWATER1 } from './greywater1.ts';
import { GREYWATER2 } from './greywater2.ts';
import { THORNMARK } from './thornmark.ts';
import { THORNHOLD } from './thornhold.ts';
import { GROVE1 } from './grove1.ts';
import { GROVE2 } from './grove2.ts';

/** The maps as written, Harrow first: a new game starts on the first map. The outdoor ones are zones the atlas places. */
export const MAP_DEFS: readonly MapDef[] = [HARROW, SHELF, MILL, GREYWATER1, GREYWATER2, THORNMARK, THORNHOLD, GROVE1, GROVE2];

/**
 * The maps as played: the outdoors as one map with the Shelf and Thornmark laid into it where the
 * atlas puts them (game/outdoors.ts), and the towns and dungeons, whose ways out lead onto it.
 */
export const PLAYED_DEFS: readonly MapDef[] = layOutdoors(ATLAS, MAP_DEFS);

/** Fresh GameMap instances (cells are mutable: doors unlock, secrets open). */
export function buildMaps(): Record<string, GameMap> {
  return Object.fromEntries(PLAYED_DEFS.map((d) => [d.id, new GameMap(d)]));
}
