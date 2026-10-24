// The Whitespine's own rows of the suites (`AreaChecks`, src/content/area.ts): out of the game's build, found by
// tools/checks.ts as the runner finds a walkthrough (#897); moved onto it from the suites' tables (#968).
import type { AreaChecks } from '../../area.ts';

export const CHECKS = {
  // Its seams as built (tools/tests/outdoors.ts): each whose first box is its own.
  seamsAsBuilt: [
    { seam: 'monksvale_j11|coldmere_k11', walk: '0', why: 'J11\'s mountain at its corner meets K11\'s pines' },
    { seam: 'monksvale_j11/monksvale_j12', walk: '18', why: 'J12\'s mountain runs a square further east than J11\'s' },
    { seam: 'highspine_i11/highspine_i12', walk: '26', why: 'the mountain steps a square at the line' },
    { seam: 'highspine_i10/highspine_i11', walk: '25 28', why: 'the mountain closing the Stone\'s ring above the trail meets I10\'s pines, and the Stone at I11\'s 28,0 stands under I10\'s mountain' },
    { seam: 'sheerpoint_i9|coldmere_j9', walk: '1-7', why: 'I9\'s mountain stands against J9\'s pines' },
    { seam: 'monksvale_j10|coldmere_k10', walk: '13-17 20-22 31', why: 'K10\'s pass, its shoulder and its walls either side of the road, stand against J10\'s pines, and J10\'s corner against K10\'s' },
  ],
} satisfies AreaChecks;
