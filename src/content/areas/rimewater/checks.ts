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
  // Its ranged rungs (#1115): the Hunter's Bow's, with the short bow and the sling #1117 takes into `gear`.
  ranged: {
    21: ['hunters_bow', 'hunters_shortbow', 'hide_sling'],
    22: ['hunters_bow+1', 'hunters_shortbow+1', 'hide_sling+1'],
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
  // Its edges open on nothing (tools/tests/outdoors.ts).
  openOnNothing: [
    { edge: 'coldmere_k9 north', open: '29-31', why: 'K8 is the sea, where #828 plans no box' },
    { edge: 'longmere_m10 east', open: '0-31', why: 'N10 is Glacier Foot, the reach, shut until Phase 1.6' },
    { edge: 'longmere_m11 east', open: '0-4 18', why: 'N11 is Glacier Foot, the reach, shut until Phase 1.6' },
  ],
} satisfies AreaChecks;
