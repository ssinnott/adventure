// Rimewater's own rows of the suites (`AreaChecks`, src/content/area.ts): out of the game's build, found by
// tools/checks.ts as the runner finds a walkthrough (#897). Rimewater owes nothing: the Infirmarer, the last
// row, left it once the Spittal, its lair, placed it (#832).
import type { AreaChecks } from '../../area.ts';

export const CHECKS = {
  // Its rungs of the ladder (tools/harness.ts): Rime Lodge's furrier from 21; theirs with a plus from Rimewater by 22.
  gear: {
    21: ['ice_axe', 'skinning_knife', 'hunters_bow', 'bear_spear', 'guides_staff', 'bearskin', 'fur_robe'],
    22: ['ice_axe+1', 'skinning_knife+1', 'bear_spear+1', 'guides_staff+1', 'hunters_bow+1', 'plate+4'],
  },
  // Its seams as built (tools/tests/outdoors.ts): each whose first box is its own.
  seamsAsBuilt: [
    { seam: 'longmere_m9|longmere_n9', walk: '7-8 11-29', why: 'the glacier\'s edge stands down M9\'s east against N9\'s pines but at 9 and 10, its only way in' },
    { seam: 'longmere_m9/longmere_m10', walk: '30-31', why: 'M10\'s pines stand under M9\'s closed corner' },
    { seam: 'longmere_l9/longmere_l10', walk: '11 17', why: 'the ridge\'s tail steps a square east at the line' },
    { seam: 'coldmere_k11|longmere_l11', walk: '7-8', water: '7-8', why: 'K11\'s shore ice meets L11\'s open water' },
    { seam: 'longmere_l10/longmere_l11', walk: '5 17', water: '5', why: 'the lake\'s shore ice and the ridge each step a square at the line' },
    { seam: 'longmere_m10/longmere_m11', walk: '25', why: 'the ridge widens by a square across the line' },
  ],
} satisfies AreaChecks;
