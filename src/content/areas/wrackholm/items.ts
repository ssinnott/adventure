// Wrackholm's items: its share of the plus finds past Saltmouth's armourer (#399), by 13.
import type { ItemDef } from '../../../game/items.ts';
import { P } from '../../items.ts';
import { ITEMS as THORNMARK } from '../thornmark/items.ts';
import { longAxe } from '../saltreach/items.ts';

const plate = THORNMARK.find((i) => i.id === 'plate')!;

export const ITEMS: readonly ItemDef[] = [
  // Kelp Hole's (#188): the crews' strongbox, the first plate with a plus on the road.
  P(plate, 1),
  // The Tide Ship's (#190).
  P(longAxe, 1),
];
