import { GameMap } from '../../game/map.ts';
import type { MapDef } from '../../game/map.ts';
import { HARROW } from './harrow.ts';
import { SHELF } from './shelf.ts';
import { MILL } from './mill.ts';

export const MAP_DEFS: readonly MapDef[] = [HARROW, SHELF, MILL];

/** Fresh GameMap instances (cells are mutable: doors unlock, secrets open). */
export function buildMaps(): Record<string, GameMap> {
  return Object.fromEntries(MAP_DEFS.map((d) => [d.id, new GameMap(d)]));
}
