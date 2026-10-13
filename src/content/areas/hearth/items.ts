// Hearth Isle's items, begun by the isle (H6, #753): the first of the Hand's steel, the Grey Knife, in
// the picket's chest at the cleft's head and dropped by the Ashen Champions; the Smelling Salts in the
// cache under the north rim; and the pilgrims' three tokens (57). The east rim (I6, #754) adds the Grey
// Staff in the Hand's camp's chest and the Grey Mail in its hoard. The rest of the band's rung at 28,
// found and never sold, is #746's (docs/areas/hearth_isle.md §8).
import type { ItemDef } from '../../../game/items.ts';
import { W, A, NO_CASTER_HEAVY } from '../../items.ts';

/** The Hand's knife, a point past Cinderport's Marlinspike (1d8+13): light, the thief's (§8; §9.1, 41). */
export const greyKnife = W('grey_knife', 'Grey Knife', 6400, 1, 8, { kind: 'light', bonus: 14 });
/** The Hand's staff, a point past Cinderport's Battle Staff (1d10+12): the casters' (§8; §9.1, 41). */
export const greyStaff = W('grey_staff', 'Grey Staff', 6200, 1, 10, { kind: 'staff', bonus: 13, twoHanded: true });
/** The Hand's mail, a point past Cinderport's Drakeskin Coat (ac 13), for the same wearers (§8; §9.1, 41). */
export const greyMail = A('grey_mail', 'Grey Mail', 7000, 14, { classes: NO_CASTER_HEAVY });

export const ITEMS: readonly ItemDef[] = [
  greyKnife,
  greyStaff,
  greyMail,
  // Three in a pouch in the north rim's cache: each wakes one member from sleep or paralysis, used up
  // (§9.1, 37). Named apart from Lantern Oil, which the store sells.
  { id: 'smelling_salts', name: 'Smelling Salts', slot: 'none', price: 0, use: { cure: ['asleep', 'paralysed'] } },
  // The pilgrims' tokens (57), each given by its pilgrim in the Bowl: a piece for its claimant at the
  // Council, and who stands at the bottom where no claimant's verdict carried.
  { id: 'wardens_badge', name: 'Wardens\' Badge', slot: 'none', price: 0 },
  { id: 'treaty_seal', name: 'Treaty Seal', slot: 'none', price: 0 },
  { id: 'tallis_tally', name: 'Tallis\'s Tally', slot: 'none', price: 0 },
];
