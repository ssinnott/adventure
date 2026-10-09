// The Glasswold's items. The Wold sells nothing and takes no step on the gear ladder (#542): its finds
// are the boxes', and what came out of the Glass is the Cartographers' to buy at Cinderport (#56's 51).
import type { ItemDef } from '../../../game/items.ts';
import { P } from '../../items.ts';
import { basaltShield } from '../ashfall/items.ts';

/** In the basilisk's hoard on the great mesa (D10, #527): Cinderport's step (#542) with a plus, at 1,700. */
export const hoardShield = P(basaltShield, 2);

export const ITEMS: readonly ItemDef[] = [
  // In the hollow of the fallen walker's chest on D9 (#525): no shop buys it.
  { id: 'etched_glass', name: 'Etched Glass', slot: 'none', price: 0 },
  hoardShield,
];
