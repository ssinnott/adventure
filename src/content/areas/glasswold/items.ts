// The Glasswold's items. The Wold takes no step on the gear ladder (#542): the Riders' trader at Akordu
// sells the band's consumables and their own leather, nothing of steel (#443, calls 5 and 7), and the
// boxes' finds are theirs; what came out of the Glass is the Cartographers' to buy at Cinderport (#56's 51).
import type { ItemDef } from '../../../game/items.ts';
import { W, A, P, MARTIAL, NO_CASTER_HEAVY, ARTIFACT_PRICE } from '../../items.ts';
import { basaltShield } from '../ashfall/items.ts';

/** In the basilisk's hoard on the great mesa (D10, #527): Cinderport's step (#542) with a plus, at 1,700. */
export const hoardShield = P(basaltShield, 2);

// The Riders' own coat of horsehide, sold at list by their trader at Akordu (D8, #526): a coat a step
// under Cinderport's Drakeskin, off the ladder; the Riders keep one with a plus in their hoard.
export const leatherCoat = A('leather_coat', 'Leather Coat', 2400, 12, { classes: NO_CASTER_HEAVY });

// The Glasswold's of the bounds' eight (DESIGN §9, #847): the Grey Bow's 1d12+13 and a point, the
// ranger's, and accuracy raised by 5 while it is borne. Found and never sold; placed nowhere yet, for
// #833 lays its lair and puts it there.
export const akkush = W('akkush', 'Akkush', ARTIFACT_PRICE, 1, 12, { kind: 'bow', bonus: 14, ranged: true, twoHanded: true, classes: ['ranger'], stat: { accuracy: 5 }, artifact: true, text: [
  'A Rider\'s bow of white horn and sinew, its grip worn to one hand.',
  'Bound under the grip is a feather longer than your arm.',
] });

// In the eldest khan's cell in Karaordu, the enclave (#833): a Rider's sabre of old steel, one-handed, its
// blows carrying cold. Found there alone and sold nowhere, inside the enclave's window, the Hearth's 7,000
// (EXPANSION §5.2, #845's 3), at the Levin Mace's price for the same blade and an element.
export const khansSabre = W('khans_sabre', 'Khan\'s Sabre', 6950, 2, 12, { bonus: 5, classes: MARTIAL, element: 'cold', text: [
  'A curved blade of dark old steel, its grip bound in horsehide and gold wire.',
  'It is cold in the hand, and frost comes up on the steel in the warmest air.',
] });

export const ITEMS: readonly ItemDef[] = [
  // In the hollow of the fallen walker's chest on D9 (#525): no shop buys it. Eadmer, the scholar at the
  // Glass's edge (B9), takes it at the first meeting that holds it, for the Sorcerer's third (#807).
  { id: 'etched_glass', name: 'Etched Glass', slot: 'none', price: 0 },
  hoardShield,
  leatherCoat,
  // In the Riders' hoard behind the dry well at Akordu (D8, #526): the Riders' own make, with a plus.
  P(leatherCoat, 2),
  // With the Compact's last three drops in the cleft under the Scarp's lip on C8 (#528): nobody on the
  // Wold reads it; Hendra, the Compact's factor at Cinderport, takes it unread for 200 gold (#735).
  { id: 'cipher_letter', name: 'Letter in Cipher', slot: 'none', price: 0 },
  // In the cache in the half-buried walker's chest at the Glass's edge, B9 (#530): no shop buys it. Eadmer,
  // the scholar in the gap, asks for it once the etched glass is his, and reads the one by it (#807).
  { id: 'glass_light', name: 'Glass with a Light', slot: 'none', price: 0, text: [
    'A piece of glass the size of a fist, smooth on every side, and in it a light, cold green-white, that does not flicker.',
    'It is no warmer for the light, nor for your hand. Turned, shaken or covered, it is the same.',
  ] },
  // The side quests' things carried (#532), none sold or bought: what sat the horse that came back,
  // lifted down whole for the Chart House at Cinderport (#56's 51); the Compact's orders the runner on
  // the Scarp stair gives up, read from the pack (#56's 54); and the mother's son out of the garden of
  // glass at Akordu, carried to the Harbour Temple (#56's 55).
  { id: 'saddle_walker', name: 'Walker from the Saddle', slot: 'none', price: 0 },
  { id: 'riders_orders', name: 'Orders for the Riders', slot: 'none', price: 0, text: [
    'Orders folded in four under black wax and the Compact\'s knot, a purse of silver sewn to them. The wax lifts, and goes back.',
    '"To the eldest at Akordu. The silver, as before, and the Riders tell nobody what walks out of the Glass."',
  ] },
  { id: 'glass_boy', name: 'Boy of Glass', slot: 'none', price: 0 },
  // At the back of the herders' store on E9, behind the slab where their path stops (#858): no shop buys it.
  // Mergen, the old Rider who drilled the Riders and hides in D10's small mesa, takes it at the first meeting
  // that holds it, the favour his teaching of the Master of arms waits on.
  { id: 'drill_bow', name: 'Drill Bow', slot: 'none', price: 0, text: [
    'A bow of horn and sinew, black with handling. The grip is worn in two places, by thumb and heel, to one hand.',
  ] },
  akkush,
  khansSabre,
];
