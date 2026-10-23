// Cairnmoor's own rows of the suites (`AreaChecks`, src/content/area.ts): out of the game's build, found by
// tools/checks.ts as the runner finds a walkthrough (#897).
import type { AreaChecks } from '../../area.ts';

export const CHECKS = {
  // What is drawn before the map that places it (tools/tests/maps.ts): the Rim Troll waits for its lair, the
  // cleft in the rim at P7 that #834's lair pull request builds. It leaves this row once a group there holds it.
  owes: { unplaced: { rim_troll: '#834' } },
} satisfies AreaChecks;
