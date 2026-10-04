// The Wardstones the company may restore (DESIGN §9): the Hearth is the quest's measure, and each
// restored Stone brightens it, in the night sky, on the title's horizon and in the almanac
// (game/stones.ts, #168). Each is restored once its `restored` holds, a quest-log condition the
// save already keeps, so nothing new is saved. A Stone whose area is not built has none yet; its
// area fills it in. The check (tools/tests/stones.ts) holds every Stone the atlas names
// here, but the Lodestone, which is whole from the start, and each `restored` flag to something that
// sets it, or to the issue that owes it.
import type { When } from '../game/quests.ts';

export interface Wardstone {
  /** As the atlas names it (`AtlasArea.stone`). */
  name: string;
  area: string;
  /** Restored once this holds; absent until its area writes it. */
  restored?: When;
  /** The issue that sets the flag `restored` waits on, while nothing does. */
  owed?: string;
}

/** The Stone whole from the start: never restored, so it never counts. */
export const WHOLE = 'Lodestone';

export const STONES: readonly Wardstone[] = [
  // Set back on its plinth at the end of Act II's second chapter: the Hearth's first step.
  // Its flag is set by the plinth at Stienwierde when it takes the Stone (#191), and ends the Tide Stone too.
  { name: 'Tide Stone', area: 'saltreach', restored: { flag: 'q_tide_home' } },
  // Not the Grove's end (q_grove_done): it counts once a Lantern has mended it (#56's 18).
  { name: 'Grove Stone', area: 'thornmark', restored: { flag: 'q_grove_mended' }, owed: '#56' },
  // Counts once the Warden of the Anvil has fallen and the tear is closed, bought back or taken alike: the thane's
  // choice is how the Stone came to the company, not what restores it (docs/areas/kilns.md §9, #540). The Rift sets its
  // flag on the first step after the Warden falls (#465), and the Kilns' chapter reads it (#470).
  { name: 'Anvil Stone', area: 'kilns', restored: { flag: 'q_anvil_closed' } },
  { name: 'Peak Stone', area: 'whitespine' },
  { name: 'Ember Stone', area: 'ashfall' },
];
