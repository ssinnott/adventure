// Wrackholm's own rows of the suites (`AreaChecks`, src/content/area.ts): out of the game's build, found by
// tools/checks.ts as the runner finds a walkthrough (#897).
import type { AreaChecks } from '../../area.ts';

export const CHECKS = {
  // What is drawn before the map that places it (tools/tests/maps.ts): Old Nick waits for its lair, the sea cave
  // under the east rocks at F5's reef that #835's lair pull request builds. It leaves this row once a group there holds it.
  owes: { unplaced: { old_nick: '#835' } },
} satisfies AreaChecks;
