// Saltreach's items: Saltmouth's armourer's step on the ladder (#399), the same with a plus that its
// boxes and Wrackholm's give up by 13, and the finds of its boxes.
import type { ItemDef } from '../../../game/items.ts';
import { W, A, P, core, MARTIAL, NO_CASTER_HEAVY } from '../../items.ts';

// Sold at Saltmouth's armourer (#177): a step past the Deepthorn's +2s for every class, at 11.
export const morningStar = W('morning_star', 'Morning Star', 700, 2, 6, { bonus: 3, classes: [...MARTIAL, 'cleric'] });
export const stiletto = W('stiletto', 'Stiletto', 700, 1, 8, { kind: 'light', bonus: 5 });
export const hornBow = W('horn_bow', 'Horn Bow', 750, 1, 12, { kind: 'bow', bonus: 4, ranged: true, twoHanded: true, classes: ['ranger'] });
export const longAxe = W('long_axe', 'Long Axe', 750, 2, 6, { bonus: 4, twoHanded: true, classes: MARTIAL });
export const ironshodStaff = W('ironshod_staff', 'Ironshod Staff', 600, 1, 10, { kind: 'staff', bonus: 4, twoHanded: true });
export const sharkskin = A('sharkskin', 'Sharkskin Coat', 1100, 9, { classes: NO_CASTER_HEAVY });
export const tidefolkRobe = A('tidefolk_robe', 'Tidefolk Robe', 650, 6);

export const ITEMS: readonly ItemDef[] = [
  morningStar,
  stiletto,
  hornBow,
  longAxe,
  ironshodStaff,
  sharkskin,
  tidefolkRobe,
  // Found, not sold, by 13: the Drowned Temples' two, Rietum's two and the pans'
  // (docs/areas/saltreach.md §4). Wrackholm's are in its own table.
  P(morningStar, 1),
  P(stiletto, 1),
  P(ironshodStaff, 1),
  P(tidefolkRobe, 1),
  P(hornBow, 1),
  // C5's secret (#170): a shard from the barge drowned under the causeway, which the plinth does not take.
  { id: 'brine_shard', name: 'Brine Shard', slot: 'none', price: 0 },
  // C6's find (#176): in a crate of the crews' cargo on the quay.
  P(core('scale'), 1),
  // The Compact's first task (#182): the warehouse clerk's cask, carried to the Keel past the customs house.
  { id: 'brandy_cask', name: 'Cask of Brandy', slot: 'none', price: 0 },
];
