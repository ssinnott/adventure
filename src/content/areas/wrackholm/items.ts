// Wrackholm's items: the finds of its maps.
import type { ItemDef } from '../../../game/items.ts';
import { P } from '../../items.ts';
import { ITEMS as THORNMARK } from '../thornmark/items.ts';

const plate = THORNMARK.find((i) => i.id === 'plate')!;

export const ITEMS: readonly ItemDef[] = [
  // Kelp Hole's (#188): the crews' strongbox, the first plate with a plus on the road.
  P(plate, 1),
];
