// Hearth Isle's own rows of the suites (`AreaChecks`, src/content/area.ts): out of the game's build, found by
// tools/checks.ts as the runner finds a walkthrough (#897); moved onto it from the suites' tables (#968).
import type { AreaChecks } from '../../area.ts';

export const CHECKS = {
  // Its rungs of the ladder (tools/harness.ts): the Hand's steel from 28, found on Hearth Isle and never sold.
  gear: {
    28: ['grey_blade', 'grey_axe', 'grey_knife', 'grey_bow', 'grey_staff', 'old_lanterns_staff', 'grey_mail', 'grey_robe', 'grey_shield'],
  },
  // Its seams as built (tools/tests/outdoors.ts): each whose first box is its own.
  seamsAsBuilt: [
    { seam: 'hearthisle_h6|hearthisle_i6', walk: '0-1 19-20 24 27-28', why: 'the rim\'s rock and the Bowl\'s grass each step at the line, and the pocket behind the tally-house at 24 is shut against H6\'s rock' },
  ],
} satisfies AreaChecks;
