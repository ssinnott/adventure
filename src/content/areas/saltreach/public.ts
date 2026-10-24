// The way into Saltreach from another area, and the only one (#992; EXPANSION §8.2): the flags and
// exits the others take, declared here and imported back by the files they stood in, and every item by name.
import type { QuestCond } from '../../../game/quests.ts';

// From maps/drowned_temples.ts.
/** The Tide Bell back on its frame: the priestess's hand-in at B6's dry door (#56's 23). */
export const BELL_HUNG: QuestCond = { flag: 'q_tide_bell_done' };

// From maps/saltmouth.ts.
/**
 * Ruan's choice at the Keel (#635), put once the Factor's rung is paid: the orders handed to the Wardens
 * or the Compact taken over. Either way it takes no more of the Tallymaster's orders (docs/areas/
 * dead_drop.md §5); each answer sets its own flag, and only Ruan's words read them.
 */
export const COMPACT_WARDENS = 'q_compact_wardens';
export const COMPACT_OVER = 'q_compact_over';

// Every item by name, with the rest of items.ts.
export * from './items.ts';

// Every flag it sets, each with what holding it means (#995).
export { FLAGS } from './flags.ts';
