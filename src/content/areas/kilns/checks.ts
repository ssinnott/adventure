// The Kilns' own rows of the suites (`AreaChecks`, src/content/area.ts): out of the game's build, found by
// tools/checks.ts as the runner finds a walkthrough (#897).
import type { AreaChecks } from '../../area.ts';

export const CHECKS = {
  // What is drawn before the map that places it (tools/tests/maps.ts): the Steiger waits for its lair, the old
  // working in the crag under the rim at P5 that #831's lair pull request builds. It leaves this row once a group there holds it.
  owes: { unplaced: { steiger: '#831' } },
} satisfies AreaChecks;
