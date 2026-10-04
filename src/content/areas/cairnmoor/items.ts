// Cairnmoor's items: its share of the plus finds past Anvilhall's forge (#535), by 19. Made ahead of
// the area (ITEMS_AHEAD in content/index.ts), as the Kilns' are; its first box (#476) takes the table
// into its Area.
import type { ItemDef } from '../../../game/items.ts';
import { P } from '../../items.ts';
import { bandedStaff } from '../kilns/items.ts';

export const ITEMS: readonly ItemDef[] = [
  // O7's (#477): the ladder's plus for a caster, in the hollow under the ring's fallen stone.
  P(bandedStaff, 1),
];
