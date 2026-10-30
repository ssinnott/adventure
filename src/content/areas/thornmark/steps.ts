// Thornmark's chain (#1033): the steps of its chapter of the one quest, The Grove Stone, in order
// (`STEPS`: over the pass, to Sylvane, under the Grove, the chisel back and the treaty's seal), for a
// company Sylvane has already hired (`FROM_SYLVANE`), for one that goes to the Stone before Thornhold
// (`STONE_FIRST`) and for one Senara shows the seal (`SHOWN`), with the pass and Sylvane's meeting
// they call (`pass`, `sylvane`). Thornmark's walkthrough plays them, and a later chapter's walkthrough
// or steps.ts replays them by this file, never by the walkthrough; nothing in the game imports it.
import { walkThrough, meetWho, see, fight } from '../../../../tools/kit/walk.ts';
import type { Step, Walk } from '../../../../tools/kit/walk.ts';
import { EAST, NORTH } from '../../../game/types.ts';

/** Over the pass, walked: the road has to let a company by. */
export const pass = (w: Walk): void => walkThrough(w, 'shelf', 30, 9, EAST, 'thornmark');
/** Into Thornhold by its gate, and Sylvane met: she sets the company on the Stone. */
export const sylvane = (w: Walk): void => { walkThrough(w, 'thornmark', 23, 5, NORTH, 'thornhold'); meetWho(w, 'q_grove'); };
/** Under the Grove: the Stone seen, the Hand of Ash and the Warden of the Cut fought. */
const stone = (w: Walk): void => { see(w, 'grove2:g2_stone'); fight(w, 'grove2:g2_hand'); fight(w, 'grove2:g2_warden'); };

/** The treaty in Henlys's hall, its seal seen. */
const TREATY: Step = { name: 'the treaty', play: (w) => see(w, 'deepthorn_i4:i4_treaty') };

/** The chapter in order: the pass, to Sylvane, under the Grove, the chisel back and the seal seen. */
export const STEPS: readonly Step[] = [
  { name: 'the pass', play: pass },
  { name: 'to Thornhold', play: sylvane },
  { name: 'the Stone', play: stone },
  { name: 'the chisel', play: (w) => meetWho(w, 'ashen_chisel') },
  TREATY,
];
/** The chapter for a company Sylvane has already hired. */
export const FROM_SYLVANE = STEPS.slice(2);
/**
 * The chapter for a company that goes straight to the Stone and never meets Sylvane till it has
 * the chisel: she takes it at the first meeting, and never hires.
 */
export const STONE_FIRST: readonly Step[] = [
  STEPS[0],
  { name: 'the Stone, unsent', play: stone },
  { name: 'the chisel, to someone who knows', play: (w) => { walkThrough(w, 'thornmark', 23, 5, NORTH, 'thornhold'); meetWho(w, 'ashen_chisel'); } },
  TREATY,
];
/** The chapter to the chisel, and then the seal shown by Senara from her square: the treaty's is never stepped on. */
export const SHOWN: readonly Step[] = [...STEPS.slice(0, 4), { name: 'Senara shows the seal', play: (w) => meetWho(w, 'q_mark') }];
