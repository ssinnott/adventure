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
} satisfies AreaChecks;
