// The Glasswold's items. The Wold takes no step on the gear ladder (#542): the Riders' trader at Akordu
// sells the band's consumables and their own leather, nothing of steel (#443, calls 5 and 7), and the
// boxes' finds are theirs; what came out of the Glass is the Cartographers' to buy at Cinderport (#56's 51).
import type { ItemDef } from '../../../game/items.ts';
import { A, P, NO_CASTER_HEAVY } from '../../items.ts';
import { basaltShield } from '../ashfall/items.ts';

/** In the basilisk's hoard on the great mesa (D10, #527): Cinderport's step (#542) with a plus, at 1,700. */
export const hoardShield = P(basaltShield, 2);

// The Riders' own coat of horsehide, sold at list by their trader at Akordu (D8, #526): a coat a step
// under Cinderport's Drakeskin, off the ladder; the Riders keep one with a plus in their hoard.
export const leatherCoat = A('leather_coat', 'Leather Coat', 2400, 12, { classes: NO_CASTER_HEAVY });

export const ITEMS: readonly ItemDef[] = [
  // In the hollow of the fallen walker's chest on D9 (#525): no shop buys it.
  { id: 'etched_glass', name: 'Etched Glass', slot: 'none', price: 0 },
  hoardShield,
  leatherCoat,
  // In the Riders' hoard behind the dry well at Akordu (D8, #526): the Riders' own make, with a plus.
  P(leatherCoat, 2),
  // With the Compact's last three drops in the cleft under the Scarp's lip on C8 (#528): nobody on the
  // Wold reads it; Lantern Watch's reader (#204) or the Compact's hall at Cinderport is owed it.
  { id: 'cipher_letter', name: 'Letter in Cipher', slot: 'none', price: 0 },
  // In the cache in the half-buried walker's chest at the Glass's edge, B9 (#530): no shop buys it, and it
  // does nothing until the reach (Phase 1.6) gives it something to do.
  { id: 'glass_light', name: 'Glass with a Light', slot: 'none', price: 0, text: [
    'A piece of glass the size of a fist, smooth on every side, and in it a light, cold green-white, that does not flicker.',
    'It is no warmer for the light, nor for your hand. Turned, shaken or covered, it is the same.',
  ] },
];
