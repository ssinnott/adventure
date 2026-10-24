// Sunderwood's own rows of the suites (`AreaChecks`, src/content/area.ts): out of the game's build, found by
// tools/checks.ts as the runner finds a walkthrough (#897); moved onto it from the suites' tables (#968).
import type { AreaChecks } from '../../area.ts';

export const CHECKS = {
  // Its rungs of the ladder (tools/harness.ts): Lantern Watch's stores from 14; theirs with a plus from the Sunder by 16.
  gear: {
    14: ['flail', 'wardens_dirk', 'ironwood_bow', 'great_axe', 'watch_staff', 'lamellar', 'watch_habit', 'watch_shield'],
    16: ['flail+1', 'ironwood_bow+1', 'plate+2', 'wardens_dirk+1', 'lanterns_staff', 'great_axe+1'],
  },
  // Its seams as built (tools/tests/outdoors.ts): each whose first box is its own.
  seamsAsBuilt: [
    { seam: 'eaves_i2/deepthorn_i3', walk: '4-9 13-15', why: 'I2\'s mountains stand over I3\'s hills and woods, the stream going on between them at 3' },
    { seam: 'eaves_j2|eaves_k2', walk: '23 26-27 29', road: '23', why: 'the road, two squares wide on J2\'s side, meets the rope bridge\'s one, and J2\'s trees face K2\'s dead wood south of it' },
    { seam: 'lanternwood_l2|lanternwood_m2', water: '31', why: 'the river at L2\'s corner meets M2\'s trees' },
    { seam: 'lanternwood_l2/lanternwood_l3', water: '31', why: 'the river at L2\'s corner meets L3\'s trees' },
    { seam: 'lanternwood_m2|ironfells_n2', walk: '20-31', why: 'N2\'s hills and fell under the rim stand against M2\'s range' },
    { seam: 'lanternwood_m2/ironfells_m3', walk: '3-4 27-31', why: 'M3\'s pines beside the road and its hills at the east end stand against the ridge on M2\'s side' },
    { seam: 'lanternwood_l3/lanternwood_l4', walk: '16-18', why: 'L3\'s woods west of the river stand against L4\'s trees, the path going on east of it' },
  ],
} satisfies AreaChecks;
