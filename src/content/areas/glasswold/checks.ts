// The Glasswold's own rows of the suites (`AreaChecks`, src/content/area.ts): out of the game's build, found by
// tools/checks.ts as the runner finds a walkthrough (#897). The Glasswold owes nothing: the Foal-taker, the
// last row, left it once Kushdag, its lair, placed it (#833).
import type { AreaChecks } from '../../area.ts';

export const CHECKS = {
  // Its seams as built (tools/tests/outdoors.ts): each whose first box is its own.
  seamsAsBuilt: [
    { seam: 'wold_d10|emberwaste_e10', walk: '0-5', why: 'the great mesa\'s east face stands against E10\'s steppe and hills' },
    { seam: 'wold_d9/wold_d10', walk: '24-26 30-31', why: 'the scree under the mesa\'s north face meets D9\'s rock, and the mesa\'s rock D9\'s steppe' },
    { seam: 'wold_e8/wold_e9', walk: '20-21', water: '20-21', why: 'the shore steps two squares at the line' },
  ],
} satisfies AreaChecks;
