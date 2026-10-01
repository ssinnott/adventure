// Sunderwood's items: the finds of its boxes.
import type { ItemDef } from '../../../game/items.ts';
import { P, W, MARTIAL, core } from '../../items.ts';
import { ITEMS as FORELAND } from '../shelf/items.ts';

const halberd = FORELAND.find((i) => i.id === 'halberd')!;
const greatAxe = W('great_axe', 'Great Axe', 600, 2, 8, { bonus: 1, twoHanded: true, classes: MARTIAL });

export const ITEMS: readonly ItemDef[] = [
  // I2's secret (#195): the Watch's last patrol's, under the milestone.
  P(halberd, 1, { id: 'wardens_halberd', name: "Warden's Halberd +1" }),
  // J2's secret (#196): in the bear's cave, with the gleaner's sack.
  P(greatAxe, 1),
  // K2's secret (#197): on the ledge behind Sunderfall's water.
  P(core('longsword'), 2),
];
