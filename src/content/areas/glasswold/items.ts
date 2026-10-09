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
  // The side quests' things carried (#532), none sold or bought: what sat the horse that came back,
  // lifted down whole for the Chart House at Cinderport (#56's 51); the Compact's orders the runner on
  // the Scarp stair gives up, read from the pack (#56's 54); and the mother's son out of the garden of
  // glass at Akordu, carried to the Harbour Temple (#56's 55).
  { id: 'saddle_walker', name: 'Walker from the Saddle', slot: 'none', price: 0 },
  { id: 'riders_orders', name: 'Orders for the Riders', slot: 'none', price: 0, text: [
    'Orders folded in four under black wax and the Compact\'s knot, a purse of silver sewn to them. The wax lifts, and goes back.',
    '"To the eldest at Akordu. The silver, as before, and the Riders tell nobody what walks out of the Glass."',
  ] },
  { id: 'glass_boy', name: 'Boy of Glass', slot: 'none', price: 0 },
];
