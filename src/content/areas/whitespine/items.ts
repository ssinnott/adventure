// The Whitespine's items: no step of the gear ladder is here (#542), so its finds are gold, potions
// and Rimewater's rung, and these, which no shop sells (one buys them back at half).
import type { ItemDef } from '../../../game/items.ts';
import { P } from '../../items.ts';
import { iceAxe, skinningKnife } from '../rimewater/items.ts';

export const ITEMS: readonly ItemDef[] = [
  // I11's (#501): in the eagles' nest above the Peak Stone, a Lantern's badge among the bones and a
  // part torn from something that does not bleed (#56's 46, whose hand-in is #506's; a part is what the
  // Stair-king takes in place of gold, #56's 47). Whose either is, the company finds for itself.
  { id: 'lantern_badge', name: 'The Lantern\'s Badge', slot: 'none', price: 0, text: [
    'A Lanterns\' badge of brass, the lamp on it worn smooth by a thumb.',
    'Its pin is bent back, as if it were torn from a coat.',
  ] },
  { id: 'grey_part', name: 'Smooth Grey Part', slot: 'none', price: 0, text: [
    'A curved plate of something smooth and grey, light as a shell and as hard as iron. It is not bone.',
    'Along one edge runs a row of holes, all the same size.',
  ] },
  // And under the unfrosted slab in the Stone's ring, what the Lantern who surveyed it left there: a
  // thing the Lanterns' halls take (#56's 46).
  { id: 'lantern_instruments', name: 'The Lantern\'s Instruments', slot: 'none', price: 0, text: [
    'A case of stiff leather stamped with the Lanterns\' lamp: a sighting glass, a level and a chain.',
    'Inside the lid, a list of Stones in a small hand. The Peak Stone is the last, and not ticked.',
  ] },
  // The side quests (#506; docs/areas/whitespine.md §6). The Novice (#56's 45): his letter from the last
  // cell at Highcell to his mother at Anvilhall, who takes it.
  { id: 'novice_letter', name: 'The Novice\'s Letter', slot: 'none', price: 0, text: [
    'To my mother at Anvilhall. The brothers keep every fast, and I have never once seen one of them eat.',
    'I am hungry all the time. I pray it passes, and I grow as holy as they are.',
  ] },
  // The Mason's Tally (#56's 48): the causeway's true tally, which the deserter gives a company that
  // swaps its page; he goes back with a count chalked short.
  { id: 'masons_tally', name: 'The Masons\' Tally', slot: 'none', price: 0, text: [
    'A slate off the causeway\'s tally, chalked in fives in a careful hand.',
    'Under the last row: ELEVEN.',
  ] },
  // The hollow in J12's rock, behind the second door of the pine pocket's tip (#863), and off the ladder: no GEAR
  // row dresses a company in either, no shop sells either and no monster drops either. Each is priced inside the
  // window of 5,000 and a little under the dearest find the curve holds the area to (the Bear Spear +1, 2,050), so
  // that line stands. The axe is the ladder's Ice Axe of 21, the plain, where the ladder wears the Ice Axe +1 from 22,
  // with lightning on its head: its steel a rung under, so the die is the gain (hits 19.5 against 17). It lies in the
  // iron-bound chest.
  { ...iceAxe, id: 'thunderhead_axe', name: 'Thunderhead Axe', price: 2000, element: 'lightning' },
  // The Skinning Knife +1 of the ladder's 22, plus and all, with +3 accuracy over it while it is borne, which the
  // weapon slot makes one blade at a time: one more point of aim than the ladder's, and no more damage. In the plain
  // chest beside the iron-bound one.
  { ...P(skinningKnife, 1), id: 'talon_knife', name: 'Talon Knife', price: 2000, stat: { accuracy: 3 } },
];
