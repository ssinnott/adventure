// Saltreach's items: the finds of its boxes.
import type { ItemDef } from '../../../game/items.ts';
import { P, core } from '../../items.ts';

export const ITEMS: readonly ItemDef[] = [
  // C5's secret (#170): a shard from the barge drowned under the causeway, which the plinth does not take.
  { id: 'brine_shard', name: 'Brine Shard', slot: 'none', price: 0 },
  // C6's find (#176): in a crate of the crews' cargo on the quay.
  P(core('scale'), 1),
  // C7's secret (#178): the salter's hoard in the crab-hole under a pan's wall.
  P(core('buckler'), 2, { id: 'crabshell_buckler', name: 'Crab-Shell Buckler +2' }),
];
