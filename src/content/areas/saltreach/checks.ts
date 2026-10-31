// Saltreach's own rows of the suites (`AreaChecks`, src/content/area.ts): out of the game's build, found by
// tools/checks.ts as the runner finds a walkthrough (#897); moved onto it from the suites' tables (#968).
import type { AreaChecks } from '../../area.ts';

export const CHECKS = {
  // Its rungs of the ladder (tools/harness.ts): Saltmouth's armourer's step from 11.
  gear: {
    11: ['morning_star', 'stiletto', 'horn_bow', 'long_axe', 'ironshod_staff', 'sharkskin', 'tidefolk_robe'],
  },
  // Its ranged rung (#1115): the Horn Bow's, with the short bow and the sling #1117 takes into `gear`.
  ranged: {
    11: ['horn_bow', 'horn_shortbow', 'sharkskin_sling'],
  },
  // Its seams as built (tools/tests/outdoors.ts): each whose first box is its own.
  seamsAsBuilt: [
    { seam: 'delta_c5|delta_d5', walk: '17-20', water: '17-20', road: '0-1 3-4', why: 'the road crosses the line on a slant, and the shore steps across it, C5\'s sand against D5\'s shallows' },
    { seam: 'upperwater_c2|downs_d2', walk: '2', why: 'the mountain at the north end runs a square further down D2\'s side, against C2\'s hills' },
    { seam: 'upperwater_c2/upperwater_c3', walk: '26 29-31', why: 'the end of C3\'s ring stands as mountains against C2\'s grass, C2\'s own mountain meeting it at 27 and 28' },
    { seam: 'upperwater_c3|downs_d3', walk: '0-10', why: 'the Upper Water\'s ring stands as mountains against D3\'s grass under the cliff' },
    { seam: 'upperwater_c3/delta_c4', walk: '31', why: 'C3\'s ring\'s mountain at its corner stands over C4\'s grass' },
    { seam: 'saltings_c7/wold_c8', walk: '28-30', why: 'the steppe where the Scarp\'s lip bends north at C8\'s east end lies under C7\'s ring' },
    { seam: 'upperwater_b3|upperwater_c3', water: '12', why: 'Rietum\'s diep runs in from B3 against the sluice-house on C3\'s west edge' },
    { seam: 'upperwater_b3/delta_b4', walk: '12-13 15', water: '13 15', why: 'the stream steps a square east at the line, and B3\'s trees end a square after B4\'s' },
    { seam: 'delta_b4|delta_c4', walk: '8', water: '8', why: 'the shore steps a square at the line, B4\'s shallows against C4\'s sand' },
  ],
} satisfies AreaChecks;
