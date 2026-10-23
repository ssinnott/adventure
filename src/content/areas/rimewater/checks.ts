// Rimewater's own rows of the suites (`AreaChecks`, src/content/area.ts): out of the game's build, found by
// tools/checks.ts as the runner finds a walkthrough (#897).
import type { AreaChecks } from '../../area.ts';

export const CHECKS = {
  // What is drawn before the map that places it (tools/tests/maps.ts): the Infirmarer waits for its lair, the door
  // under the pass on K12's rim face at 2,15 that #832's lair pull request builds. It leaves this row once a group there holds it.
  owes: { unplaced: { infirmarer: '#832' } },
} satisfies AreaChecks;
