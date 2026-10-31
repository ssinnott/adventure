// The Kilns' own rows of the suites (`AreaChecks`, src/content/area.ts): out of the game's build, found by
// tools/checks.ts as the runner finds a walkthrough (#897). The Kilns owe nothing: the Steiger's row went
// once the Randzeche, its lair, placed it (#831), and O4's and O5's plain views' once #1106 broke them up.
import type { AreaChecks } from '../../area.ts';

export const CHECKS = {
  // Its rungs of the ladder (tools/harness.ts): Anvilhall's forge from 17.
  gear: {
    17: ['forge_hammer', 'seax', 'steel_bow', 'mattock', 'banded_staff', 'dwarf_mail', 'kiln_robe', 'forge_shield'],
  },
  // Its ranged rung (#1115): the Steel Bow's, with the short bow and the sling #1117 takes into `gear`.
  ranged: {
    17: ['steel_bow', 'steel_shortbow', 'wire_sling'],
  },
  // How far over the next floor its clear leaves a company, held as built (tools/tests/curve.ts).
  overRoad: { level: 19.5, why: 'the bosses pay the line\'s (MONSTERS §4.3 and §4.4), and the country behind the road (#474) and the bounds (#831) add to it' },
  // Its seams as built (tools/tests/outdoors.ts): each whose first box is its own.
  seamsAsBuilt: [
    { seam: 'ironfells_n3|ironfells_o3', walk: '9-16', why: 'the hall\'s crag runs down O3\'s west edge against N3\'s terraces, so nothing comes at the gate from this side' },
    { seam: 'kilnsheart_n4|kilnsheart_o4', walk: '14', why: 'N4\'s hills start a square north of O4\'s, against O4\'s crag' },
    { seam: 'kilnsheart_n5|kilnsheart_o5', walk: '5 15-16', why: 'the mountain between them steps a square at the line' },
    { seam: 'ironfells_o3/kilnsheart_o4', walk: '2 26', why: 'the rock and the mountain at the pines\' east end each step a square at the line' },
    { seam: 'kilnsheart_o4/kilnsheart_o5', walk: '10-12 27-30', why: 'O4\'s hills meet O5\'s mountain at 10 to 12, and O5\'s hills run on under O4\'s mountain at the east end' },
  ],
  // Its edges open on nothing (tools/tests/outdoors.ts).
  openOnNothing: [
    { edge: 'kilnmouth_l6 north', open: '29-31', why: 'L5 is the sea along here, where #828 plans no box' },
    { edge: 'kilnmouth_m5 west', open: '24-31', why: 'L5 is the sea along here, where #828 plans no box' },
    { edge: 'ironfells_o3 north', open: '2-7', why: 'O2 is a crumb, left unbuilt (#828)' },
  ],
} satisfies AreaChecks;
