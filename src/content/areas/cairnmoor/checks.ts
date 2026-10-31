// Cairnmoor's own rows of the suites (`AreaChecks`, src/content/area.ts): out of the game's build, found by
// tools/checks.ts as the runner finds a walkthrough (#897). Cairnmoor owes nothing: the Rim Troll, the
// last row, left it once Bearn Liath, its lair, placed it (#834).
import type { AreaChecks } from '../../area.ts';

export const CHECKS = {
  // Its rungs of the ladder (tools/harness.ts): the same with a plus from the Kilns' and Cairnmoor's boxes by 19.
  gear: {
    19: ['plate+3', 'forge_hammer+1', 'mattock+1', 'steel_bow+1', 'seax+1', 'kiln_robe+1', 'banded_staff+1'],
  },
  // Its ranged rung (#1115): the Kilns' Steel Bow +1, which its rung 19 holds, with the short bow and the
  // sling #1117 takes into `gear`.
  ranged: {
    19: ['steel_bow+1', 'steel_shortbow+1', 'wire_sling+1'],
  },
  // Its seams as built (tools/tests/outdoors.ts): each whose first box is its own.
  seamsAsBuilt: [
    { seam: 'cairnfield_n8/longmere_n9', walk: '2-31', why: 'the Rimefells stand along N9\'s north against N8\'s hills and heather' },
    { seam: 'cairnfield_m8|cairnfield_n8', walk: '28-29', why: 'M8\'s crags close the notch\'s west side against N8\'s hills' },
  ],
  // Its edges open on nothing (tools/tests/outdoors.ts).
  openOnNothing: [
    { edge: 'highmoor_o8 south', open: '0-27', why: 'O9 is Glacier Foot, the reach, shut until Phase 1.6' },
    { edge: 'cairnfield_l8 west', open: '31', why: 'K8 is the sea, where #828 plans no box' },
  ],
} satisfies AreaChecks;
