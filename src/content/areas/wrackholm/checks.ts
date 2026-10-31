// Wrackholm's own rows of the suites (`AreaChecks`, src/content/area.ts): out of the game's build, found by
// tools/checks.ts as the runner finds a walkthrough (#897). Wrackholm owes nothing: Old Nick, the last
// row, left it once Nick's Locker, its lair, placed it (#835).
import type { AreaChecks } from '../../area.ts';

export const CHECKS = {
  // Its rungs of the ladder (tools/harness.ts): the same with a plus from Saltreach's and Wrackholm's boxes by 13.
  gear: {
    13: ['morning_star+1', 'stiletto+1', 'ironshod_staff+1', 'tidefolk_robe+1', 'horn_bow+1', 'plate+1', 'long_axe+1'],
  },
  // Its ranged rung (#1115), the Horn Bow +1's, Saltreach's bow on Wrackholm's rung: the short bow and the
  // sling #1117 takes into `gear`.
  ranged: {
    13: ['horn_bow+1', 'horn_shortbow+1', 'sharkskin_sling+1'],
  },
} satisfies AreaChecks;
