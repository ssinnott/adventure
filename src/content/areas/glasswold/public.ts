// The way into the Glasswold from another area, and the only one (#992; EXPANSION §8.2): the flags and
// exits the others take, declared here and imported back by the files they stood in, and every item by name.

// From maps/wold_c8.ts.
export const ORDERS_ASKED = 'q_scarp';
export const ORDERS_SEALED = 'q_scarp_sealed', ORDERS_TOLD = 'q_scarp_told', ORDERS_BURNED = 'q_scarp_burned';

// From maps/wold_d8.ts.
/**
 * The Warning's done flag (#531), set at the horse-lines once the eldest and the watch are heard and the
 * Glass is seen from the gap: the company turned east for Cinderport and the last crossing. Phase 1.5's
 * chapter starts on it.
 */
export const ROAD_EAST = 'q_road_east';
export const HORSE_ASKED = 'q_horse', HORSE_BROKEN = 'q_horse_broken', HORSE_WHOLE = 'q_horse_whole';
export const GARDEN_BROUGHT = 'q_garden_brought';
export const GARDEN_LIFTED = 'q_garden_lifted', GARDEN_DRAUGHT = 'q_garden_draught';

// Every item by name, with the rest of items.ts.
export * from './items.ts';

// Every flag it sets, each with what holding it means (#995).
export { FLAGS } from './flags.ts';
