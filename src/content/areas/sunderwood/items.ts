// Sunderwood's items: the finds of its boxes.
import type { ItemDef } from '../../../game/items.ts';
import { P } from '../../items.ts';
import { ITEMS as FORELAND } from '../shelf/items.ts';

const halberd = FORELAND.find((i) => i.id === 'halberd')!;

export const ITEMS: readonly ItemDef[] = [
  // I2's secret (#195): the Watch's last patrol's, under the milestone.
  P(halberd, 1, { id: 'wardens_halberd', name: "Warden's Halberd +1" }),
];
