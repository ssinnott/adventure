// The Foreland's own rows of the suites (`AreaChecks`, src/content/area.ts): out of the game's build,
// found by tools/checks.ts as the runner finds a walkthrough (#897).
import type { AreaChecks } from '../../area.ts';

export const CHECKS = {
  // The ladder's first two rungs (tools/harness.ts): by 3 the band's gear from Mottram's and the kits'
  // weapons with a plus from the Downs' first boxes; by 5 the kits' armour with a plus and the Downs' last finds.
  gear: {
    3: ['longsword', 'axe', 'longbow', 'shield', 'scale', 'chain', 'dagger+1', 'mace+1', 'shortsword+1', 'staff+1'],
    5: ['robe+1', 'leather+1', 'buckler+1', 'captains_sword', 'queens_sword', 'captains_mail', 'halberd+1', 'spear+1', 'longbow+1', 'shield+1'],
  },
  // Its seams as built (tools/tests/outdoors.ts): each whose first box is the Foreland's, D4/D5 with Saltreach's.
  seamsAsBuilt: [
    { seam: 'downs_f2|shelf', walk: '1-28 30-31', why: 'the Foreland\'s ring stands against the Downs as mountains, but for the Salt Road\'s gap at 29' },
    { seam: 'downs_e3|downs_f3', walk: '5-9 12-17', why: 'the rocks either side of the road are E3\'s against F3\'s fields, grass and sand, then F3\'s against E3\'s grass and sand' },
    { seam: 'downs_e2/downs_e3', walk: '29', water: '29', why: 'the stream leaves E2 two squares wide and goes on into E3 one wide' },
    { seam: 'downs_d3/downs_d4', walk: '0-7', why: 'D3\'s corner, the void and the rocks under the cliff, stands over D4\'s grass' },
    { seam: 'downs_d4/delta_d5', road: '0', why: 'the road bends at the line: D5\'s first square of it meets D4\'s grass, and the two go on together at 1' },
  ],
  // Its edges open on nothing (tools/tests/outdoors.ts).
  openOnNothing: [
    { edge: 'downs_f3 east', open: '0-1', why: 'G3 is a crumb, left unbuilt (#828)' },
    { edge: 'downs_e3 south', open: '0-10', why: 'E4 is unbuilt: #837 builds it' },
    { edge: 'downs_d4 east', open: '0-10', why: 'E4 is unbuilt: #837 builds it' },
  ],
} satisfies AreaChecks;
