// Saltreach's items: the finds of its boxes.
import type { ItemDef } from '../../../game/items.ts';
import { P, core } from '../../items.ts';

export const ITEMS: readonly ItemDef[] = [
  // C5's secret (#170): a shard from the barge drowned under the causeway, which the plinth does not take.
  // C4's hide (#171) holds another.
  { id: 'brine_shard', name: 'Brine Shard', slot: 'none', price: 0 },
  // C4's secret (#171): the crews' hide in the reeds.
  P(core('longsword'), 1),
];
