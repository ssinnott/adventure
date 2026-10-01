// Sunderwood's items: Lantern Watch's stores, the act's last step on the ladder (#399), the same
// with a plus that the Sunder and the boxes round it give up by 16, and the finds of its boxes.
import type { ItemDef } from '../../../game/items.ts';
import { W, A, P, MARTIAL, MAIL, NO_CASTER_HEAVY } from '../../items.ts';
import { ITEMS as FORELAND } from '../shelf/items.ts';
import { ITEMS as THORNMARK } from '../thornmark/items.ts';

const halberd = FORELAND.find((i) => i.id === 'halberd')!;
const plate = THORNMARK.find((i) => i.id === 'plate')!;

// Sold in the Watch's stores (#201): a step past Saltmouth's finds for every class, at 14.
const flail = W('flail', 'Flail', 1100, 2, 8, { bonus: 3, classes: [...MARTIAL, 'cleric'] });
const wardensDirk = W('wardens_dirk', "Warden's Dirk", 1100, 1, 8, { kind: 'light', bonus: 7 });
const ironwoodBow = W('ironwood_bow', 'Ironwood Bow', 1200, 1, 12, { kind: 'bow', bonus: 6, ranged: true, twoHanded: true, classes: ['ranger'] });
const greatAxe = W('great_axe', 'Great Axe', 1200, 2, 8, { bonus: 4, twoHanded: true, classes: MARTIAL });
const watchStaff = W('watch_staff', 'Watch Staff', 1000, 1, 10, { kind: 'staff', bonus: 6, twoHanded: true });
const lamellar = A('lamellar', 'Lamellar', 1600, 10, { classes: NO_CASTER_HEAVY });
const watchHabit = A('watch_habit', 'Watch Habit', 1000, 8);
const watchShield: ItemDef = { id: 'watch_shield', name: 'Watch Shield', slot: 'shield', price: 900, ac: 5, classes: MAIL };

export const ITEMS: readonly ItemDef[] = [
  flail,
  wardensDirk,
  ironwoodBow,
  greatAxe,
  watchStaff,
  lamellar,
  watchHabit,
  watchShield,
  // Found, not sold, by 16: the Sunder's, K3's and L2's, and J2's below (docs/areas/sunderwood.md
  // §4). The plate is a step past the stores' lamellar, for those who wear plate.
  P(flail, 1),
  P(ironwoodBow, 1),
  P(plate, 2),
  P(wardensDirk, 1),
  P(watchStaff, 1, { id: 'lanterns_staff', name: "Lantern's Staff +1" }),
  // J2's secret (#196): in the bear's cave, with the gleaner's sack.
  P(greatAxe, 1),
  // I2's secret (#195): the Watch's last patrol's, under the milestone.
  P(halberd, 1, { id: 'wardens_halberd', name: "Warden's Halberd +1" }),
];
