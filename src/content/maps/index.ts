import { GameMap } from '../../game/map.ts';
import type { MapDef } from '../../game/map.ts';
import { HARROW } from './harrow.ts';
import { SHELF } from './shelf.ts';
import { MILL } from './mill.ts';
import { THORNMARK } from './thornmark.ts';
import { THORNHOLD } from './thornhold.ts';
import { GROVE1 } from './grove1.ts';
import { GROVE2 } from './grove2.ts';

/** Harrow first: a new game starts on the first map. */
export const MAP_DEFS: readonly MapDef[] = [HARROW, SHELF, MILL, THORNMARK, THORNHOLD, GROVE1, GROVE2];

/** Fresh GameMap instances (cells are mutable: doors unlock, secrets open). */
export function buildMaps(): Record<string, GameMap> {
  return Object.fromEntries(MAP_DEFS.map((d) => [d.id, new GameMap(d)]));
}
