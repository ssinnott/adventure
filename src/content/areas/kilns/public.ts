// The way into the Kilns from another area, and the only one (#992; EXPANSION §8.2): the flags and
// exits the others take, declared here and imported back by the files they stood in, and every item by name.
import type { Exit } from '../../../game/map.ts';
import { NORTH } from '../../../game/types.ts';

// From guilds.ts.
/** Act II done: Act III opens the fourth ranks, and Captain Ordgar keeps the Drillyard (#455). */
export const FOURTH_RANKS_OPEN = 'q_salt_done';

// From maps/anvilhall.ts.
/** The miners' hymn heard whole, its last verse sung by the oldest miner: a verse for the Bard's third (#56's 36, #448). */
export const HYMN_SUNG = 'q_hymn_sung';

// From maps/ironfells_n3.ts.
/**
 * The gate into Anvilhall (#459): a door on the gate's square in the crag's dressed front, into the
 * town's start inside its own gate, saying the town's gate line (docs/areas/kilns.md §4.4) as the
 * company goes in; the town's way back lands on 28,9, facing south.
 */
export const IRONFELLS_GATE: Exit = { x: 28, y: 8, to: 'anvilhall', tx: 7, ty: 14, tf: NORTH,
  label: 'A door in the hill, iron-bound, and the hammering behind it. Over the lintel, words cut deep and painted red.' };

// Every item by name, with the rest of items.ts.
export * from './items.ts';
