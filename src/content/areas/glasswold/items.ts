// The Glasswold's items. The Wold takes no step on the gear ladder (#542): the Riders' trader at Akordu
// sells the band's consumables and their own leather, nothing of steel (#443, calls 5 and 7), and the
// boxes' finds are theirs; what came out of the Glass is the Cartographers' to buy at Cinderport (#56's 51).
import type { ItemDef } from '../../../game/items.ts';
import { A, P, NO_CASTER_HEAVY } from '../../items.ts';

// The Riders' own coat of horsehide, sold at list by their trader at Akordu (D8, #526): a coat a step
// under Cinderport's Drakeskin, off the ladder; the Riders keep one with a plus in their hoard.
export const leatherCoat = A('leather_coat', 'Leather Coat', 2400, 12, { classes: NO_CASTER_HEAVY });

export const ITEMS: readonly ItemDef[] = [
  // In the hollow of the fallen walker's chest on D9 (#525): no shop buys it.
  { id: 'etched_glass', name: 'Etched Glass', slot: 'none', price: 0 },
  leatherCoat,
  // In the Riders' hoard behind the dry well at Akordu (D8, #526): the Riders' own make, with a plus.
  P(leatherCoat, 2),
];
