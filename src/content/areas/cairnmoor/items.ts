// Cairnmoor's items: its share of the plus finds past Anvilhall's forge (#535), by 19. Made ahead of
// the area (#535), as the Kilns' were, until its first box (#476) took the table into its Area. N7's
// cache and O8's hoard hold seconds of the Kilns' Forge Hammer +1 and Seax +1, which need no line here.
import type { ItemDef } from '../../../game/items.ts';
import { P } from '../../items.ts';
import { bandedStaff } from '../kilns/items.ts';

export const ITEMS: readonly ItemDef[] = [
  // O7's (#477): the ladder's plus for a caster, in the hollow under the ring's fallen stone.
  P(bandedStaff, 1),
];
