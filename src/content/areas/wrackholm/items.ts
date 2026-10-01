// Wrackholm's items: the finds of its maps.
import type { ItemDef } from '../../../game/items.ts';
import { P } from '../../items.ts';
import { ITEMS as THORNMARK } from '../thornmark/items.ts';

const plate = THORNMARK.find((i) => i.id === 'plate')!;

export const ITEMS: readonly ItemDef[] = [
  // Kelp Hole's (#188): the crews' strongbox, the first plate with a plus on the road.
  P(plate, 1),
  // F6's (#189): the founder's seal, in his grave under the cairn on the east rocks; the Compact's
  // hall takes it (#182).
  { id: 'founders_seal', name: "Founder's Seal", slot: 'none', price: 0 },
];
