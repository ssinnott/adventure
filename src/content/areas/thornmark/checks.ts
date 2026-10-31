// Thornmark's own rows of the suites (`AreaChecks`, src/content/area.ts): out of the game's build, found by
// tools/checks.ts as the runner finds a walkthrough (#897); moved onto it from the suites' tables (#968).
import type { AreaChecks } from '../../area.ts';

export const CHECKS = {
  // Its rungs of the ladder (tools/harness.ts): Thornmark's armoury from 8, where plate is dear; its chests' gear with a plus by 9; the Deepthorn's +2s by 10.
  gear: {
    8: ['warhammer', 'battleaxe', 'greatsword', 'crossbow', 'elfbow', 'rune_dagger', 'grove_staff', 'runed_robe', 'brigandine', 'plate', 'tower_shield'],
    9: ['warhammer+1', 'rune_dagger+1', 'elfbow+1', 'grove_staff+1', 'greatsword+1', 'brigandine+1', 'brigandine+2', 'runed_robe+1'],
    10: ['warhammer+2', 'greatsword+2', 'elfbow+2', 'rune_dagger+2', 'runed_robe+2', 'brigandine+3', 'tower_shield+1', 'eldests_bough'],
  },
  // Its ranged rungs (#1115): the Thornmark Bow's, with the short bow and the sling #1117 takes into `gear`.
  ranged: {
    8: ['elfbow', 'thornmark_shortbow', 'deerskin_sling'],
    9: ['elfbow+1', 'thornmark_shortbow+1', 'deerskin_sling+1'],
    10: ['elfbow+2', 'thornmark_shortbow+2', 'deerskin_sling+2'],
  },
  // Its seams as built (tools/tests/outdoors.ts): each whose first box is its own.
  seamsAsBuilt: [
    { seam: 'thornmark/deepthorn_h3', walk: '3-7 9-14', water: '0-2', why: 'Thornmark\'s ring stands against the Deepthorn\'s water, sand and woods as mountains, with the elves\' road through a gap at 8' },
    { seam: 'deepthorn_i3/deepthorn_i4', road: '12', why: 'the road out of I3 goes on into I4 as a dirt track' },
    { seam: 'deepthorn_i4|deepthorn_j4', walk: '18-19', why: 'J4\'s clearing runs two squares further south than I4\'s, into I4\'s trees' },
    { seam: 'deepthorn_i5|deepthorn_j5', walk: '18-19', why: 'I5\'s sand starts two squares north of J5\'s, against J5\'s trees' },
    { seam: 'deepthorn_i5/hearthisle_i6', walk: '0-2', way: '3-4', why: 'the Deepthorn\'s rock stands against the isle\'s grass and hills; the shallows meet at 3 and 4, but on I5\'s side they are a pocket of seven squares shut by rock and deep water, so no company reaches the isle by them' },
    { seam: 'deepthorn_j4|lanternwood_k4', walk: '17', water: '18-31', why: 'K4\'s rock stands against J4\'s shore and its sea, so no way opens between Thornmark and the Sunderwood here' },
  ],
  // Its edges open on nothing (tools/tests/outdoors.ts).
  openOnNothing: [
    { edge: 'deepthorn_h3 south', open: '14-16', why: 'H4 is a crumb, left unbuilt (#828)' },
  ],
} satisfies AreaChecks;
