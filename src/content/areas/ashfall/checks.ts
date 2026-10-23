// Ashfall's own rows of the suites (`AreaChecks`, src/content/area.ts): out of the game's build, found by
// tools/checks.ts as the runner finds a walkthrough (#897).
import type { AreaChecks } from '../../area.ts';

export const CHECKS = {
  // What is drawn before the map that places it (tools/tests/maps.ts): the Grave Drake waits for its lair, the grave
  // where the flow stopped, under F12's dam of rock, that #836's lair pull request builds. It leaves this row once a group there holds it.
  owes: { unplaced: { grave_drake: '#836' } },
} satisfies AreaChecks;
