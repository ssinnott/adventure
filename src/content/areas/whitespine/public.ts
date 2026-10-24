// The way into the Whitespine from another area, and the only one (#992; EXPANSION §8.2): the flags and
// exits the others take, declared here and imported back by the files they stood in, and every item by name.

// From maps/highspine_i10.ts.
/**
 * The Stair stood on below the king's step, looking down into the ash: `i10_top` sets it, the
 * once. The Whitespine's chapter, The Bells, is done on it, and Ashfall's (#518) reads it.
 */
export const STAIR_TOP = 'q_stair_top';

// From maps/highspine_i11.ts.
export const NEST_WATCH = 'q_nest_watch';

// From maps/monastery.ts.
/** The Novice told, back from his mother: he walks out at the gate, home to Anvilhall (#56's 45, #506). */
export const NOVICE_TOLD = 'q_novice_told';
/** The Novice told only that his mother is well: he keeps the fasts in his cell. */
export const NOVICE_KEPT = 'q_novice_kept';

// From maps/sheerpoint_i8.ts.
export const MASON_PASSAGE = 'q_mason_passage';

// Every item by name, with the rest of items.ts.
export * from './items.ts';

// Every flag it sets, each with what holding it means (#995).
export { FLAGS } from './flags.ts';
