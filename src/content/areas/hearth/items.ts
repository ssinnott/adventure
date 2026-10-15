// Hearth Isle's items, begun by the isle (H6, #753): the first of the Hand's steel, the Grey Knife, in
// the picket's chest at the cleft's head and dropped by the Ashen Champions; the Smelling Salts in the
// cache under the north rim; and the pilgrims' three tokens (57). The east rim (I6, #754) adds the Grey
// Staff in the Hand's camp's chest and the Grey Mail in its hoard; the temple (#755), the Grey Blade and
// the Grey Bow in its treasury and the sacristan's key to it (56); the crypt (#756), the Grey Robe in
// the dead champion's pack; the Ways (#757), the Grey Shield in the keepers' store and the Old Lantern's
// Staff behind the crack (61); the Stair (#758), the Grey Axe in the rearguard's chest and Jowan's letter
// home (58). The rest of the band's rung at 28, found and never sold, is #746's
// (docs/areas/hearth_isle.md §8).
import type { ItemDef } from '../../../game/items.ts';
import { W, A, MARTIAL, MAIL, NO_CASTER_HEAVY } from '../../items.ts';

/** The Hand's knife, a point past Cinderport's Marlinspike (1d8+13): light, the thief's (§8; §9.1, 41). */
export const greyKnife = W('grey_knife', 'Grey Knife', 6400, 1, 8, { kind: 'light', bonus: 14 });
/** The Hand's staff, a point past Cinderport's Battle Staff (1d10+12): the casters' (§8; §9.1, 41). */
export const greyStaff = W('grey_staff', 'Grey Staff', 6200, 1, 10, { kind: 'staff', bonus: 13, twoHanded: true });
/** The Hand's mail, a point past Cinderport's Drakeskin Coat (ac 13), for the same wearers (§8; §9.1, 41). */
export const greyMail = A('grey_mail', 'Grey Mail', 7000, 14, { classes: NO_CASTER_HEAVY });
/** The Hand's blade, a point past Cinderport's Slag Mace (2d12+5): the martial classes' and the cleric's. */
export const greyBlade = W('grey_blade', 'Grey Blade', 6600, 2, 12, { bonus: 6, classes: [...MARTIAL, 'cleric'] });
/** The Hand's bow, a point past Cinderport's Ashwood Bow (1d12+12): the ranger's. */
export const greyBow = W('grey_bow', 'Grey Bow', 6800, 1, 12, { kind: 'bow', bonus: 13, ranged: true, twoHanded: true, classes: ['ranger'] });
/** The Hand's robe, a point past Cinderport's Cinder Robe (ac 12): anyone's to wear, as that is. */
export const greyRobe = A('grey_robe', 'Grey Robe', 6200, 13);
/** The rearguard's axe, a point past Cinderport's Flamberge (2d12+6): two-handed, the martial classes' (§8; §9.1, 41). */
export const greyAxe = W('grey_axe', 'Grey Axe', 6800, 2, 12, { bonus: 7, twoHanded: true, classes: MARTIAL });
/** The keepers' shield, a point past Cinderport's Basalt Shield (ac 7): the shield bearers'. */
export const greyShield: ItemDef = { id: 'grey_shield', name: 'Grey Shield', slot: 'shield', price: 4000, ac: 8, classes: MAIL };
/**
 * The staff from the Lanterns' hall the Sunder swallowed (61), a point past the Grey Staff (1d10+13): a
 * staff anyone may carry, as the Battle Staff is. Its holiness is its lamp's, in its words: no weapon
 * carries an element.
 */
export const oldLanternsStaff = W('old_lanterns_staff', 'Old Lantern\'s Staff', 7000, 1, 10, { kind: 'staff', bonus: 14, twoHanded: true, text: ['A staff of the old Lanterns, the lamp in its head still lit after four hundred years.'] });

export const ITEMS: readonly ItemDef[] = [
  greyKnife,
  greyStaff,
  greyMail,
  // In the temple's treasury (#755).
  greyBlade,
  greyBow,
  // In the dead champion's pack in the crypt's side vault (#756).
  greyRobe,
  // In the keepers' store behind the Ways' first west frame, and behind the crack for a company that widens it (#757).
  greyShield,
  oldLanternsStaff,
  // In the rearguard's chest on the Stair's first landing (#758).
  greyAxe,
  // The sacristan's key to the treasury (56): it opens that door, and only it does.
  { id: 'fane_key', name: 'Sacristan\'s Key', slot: 'none', price: 0 },
  // Three in a pouch in the north rim's cache: each wakes one member from sleep or paralysis, used up
  // (§9.1, 37). Named apart from Lantern Oil, which the store sells.
  { id: 'smelling_salts', name: 'Smelling Salts', slot: 'none', price: 0, use: { cure: ['asleep', 'paralysed'] } },
  // The pilgrims' tokens (57), each given by its pilgrim in the Bowl: a piece for its claimant at the
  // Council, and who stands at the bottom where no claimant's verdict carried.
  { id: 'wardens_badge', name: 'Wardens\' Badge', slot: 'none', price: 0 },
  { id: 'treaty_seal', name: 'Treaty Seal', slot: 'none', price: 0 },
  { id: 'tallis_tally', name: 'Tallis\'s Tally', slot: 'none', price: 0 },
  // Under a dead champion's hands on the Stair (58): read from the pack, and taken home to Gullwick (#765).
  { id: 'gullwick_letter', name: 'Letter for Gullwick', slot: 'none', price: 0, text: [
    'A letter sealed with a knot of rope, the seal Gullwick\'s.',
    '"To my mother, at the third house from the slip. We are on the isle. The grey men say the door opens tomorrow, and after that everything is different, and I will come home then and explain."',
    '"I was never cargo. I chose this. Tell Wenna\'s mother I saw her girl, and she is well, and she is not afraid, which is more than I am. Your son, Jowan."',
  ] },
];
