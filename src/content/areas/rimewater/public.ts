// The way into Rimewater from another area, and the only one (#992; EXPANSION §8.2): the flags and
// exits the others take, declared here and imported back by the files they stood in, and every item by name.

// From chapter.ts.
/** The beds under Loch Fuar seen: `sb2_beds` sets it, the once. The act turns on it. */
export const SLEEPERS_SEEN = 'q_sleepers_seen';

// From maps/rime_lodge.ts.
/** Her words at the door once the company is back up from the beds: she goes to the lodge (§5, #492). */
export const WENNA_LODGE = 'q_wenna_lodge';

// Every item by name, with the rest of items.ts.
export * from './items.ts';

// Every flag it sets, each with what holding it means (#995).
export { FLAGS } from './flags.ts';
