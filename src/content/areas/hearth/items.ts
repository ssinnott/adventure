// Hearth Isle's items, begun by the isle (H6, #753): the first of the Hand's steel, the Grey Knife, in
// the picket's chest at the cleft's head and dropped by the Ashen Champions; the Smelling Salts in the
// cache under the north rim; and the pilgrims' three tokens (57). The rest of the band's rung at 28,
// found and never sold, is #746's (docs/areas/hearth_isle.md §8).
import type { ItemDef } from '../../../game/items.ts';
import { W } from '../../items.ts';

/** The Hand's knife, a point past Cinderport's Marlinspike (1d8+13): light, the thief's (§8; §9.1, 41). */
export const greyKnife = W('grey_knife', 'Grey Knife', 6400, 1, 8, { kind: 'light', bonus: 14 });

export const ITEMS: readonly ItemDef[] = [
  greyKnife,
  // Three in a pouch in the north rim's cache: each wakes one member from sleep or paralysis, used up
  // (§9.1, 37). Named apart from Lantern Oil, which the store sells.
  { id: 'smelling_salts', name: 'Smelling Salts', slot: 'none', price: 0, use: { cure: ['asleep', 'paralysed'] } },
  // The pilgrims' tokens (57), each given by its pilgrim in the Bowl: a piece for its claimant at the
  // Council, and who stands at the bottom where no claimant's verdict carried.
  { id: 'wardens_badge', name: 'Wardens\' Badge', slot: 'none', price: 0 },
  { id: 'treaty_seal', name: 'Treaty Seal', slot: 'none', price: 0 },
  { id: 'tallis_tally', name: 'Tallis\'s Tally', slot: 'none', price: 0 },
];
