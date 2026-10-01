// Wrackholm's items: the finds of its maps, and its share of the plus finds past Saltmouth's
// armourer (#399), by 13.
import type { ItemDef } from '../../../game/items.ts';
import { P } from '../../items.ts';
import { ITEMS as THORNMARK } from '../thornmark/items.ts';
import { longAxe } from '../saltreach/items.ts';

const plate = THORNMARK.find((i) => i.id === 'plate')!;

export const ITEMS: readonly ItemDef[] = [
  // Kelp Hole's (#188): the crews' strongbox, the first plate with a plus on the road, and the
  // ladder's for plate's wearers (#399).
  P(plate, 1),
  // The Tide Ship's (#190).
  P(longAxe, 1),
  // F6's (#189): the founder's seal, in his grave under the cairn on the east rocks; the Compact's
  // hall takes it (#182).
  { id: 'founders_seal', name: "Founder's Seal", slot: 'none', price: 0 },
];
