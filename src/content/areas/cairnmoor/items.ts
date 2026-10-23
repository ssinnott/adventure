// Cairnmoor's items: its share of the plus finds past Anvilhall's forge (#535), by 19, and its finds
// off the ladder. Made ahead of the area (#535), as the Kilns' were, until its first box (#476) took the
// table into its Area. N7's cache and O8's hoard hold seconds of the Kilns' Forge Hammer +1 and Seax +1,
// which need no line here.
import type { ItemDef } from '../../../game/items.ts';
import { W, P, MAIL, MARTIAL, ARTIFACT_PRICE } from '../../items.ts';
import { bandedStaff, forgeHammer, dwarfMail } from '../kilns/items.ts';

/**
 * A hammer whose blows carry fire (#862, docs/areas/cairnmoor.md §4.8): the forge hammer's steel, the
 * plain piece where the ladder wears the plus from 19, so the 1d6 of fire is the gain; a troll it lands
 * on stops mending (`burnt`). Found in a cairn off the drove road, off the ladder (no `GEAR` row), sold
 * by no shop. Priced under the area's dearest find (the curve's line for it stays) and in its window.
 */
export const beaconHammer: ItemDef = { ...forgeHammer, id: 'beacon_hammer', name: 'Beacon Hammer', price: 1600, element: 'fire' };

/**
 * A mail that raises might by 3 while it is worn (#862): the ladder's mail at 17, dwarf mail's armour
 * and wearers, so the might is the gain. Found in a locked chest behind a secret door of Carn Dubh, off
 * the ladder, sold by no shop, priced as the hammer is.
 */
export const cairnbuildersMail: ItemDef = { ...dwarfMail, id: 'cairnbuilders_mail', name: "Cairnbuilder's Mail", price: 1600, stat: { might: 3 } };

/**
 * The oldest dead's mace (#834, the enclave, docs/areas/cairnmoor.md §12.5): a head of polished stone on
 * the ice axe's numbers (Rimewater's `ice_axe`, 2d12+3, named here by its numbers), its blows carrying
 * holy, the plain piece where the ladder wears the plus from 22, so the holy die is the gain, as the Beacon
 * Hammer's fire is. In Carn Fada's cist alone and sold nowhere, inside the enclave's window, Rimewater's
 * 4,500 (EXPANSION §5.2, #845's 3).
 */
export const sunwiseMace: ItemDef = W('sunwise_mace', 'Sunwise Mace', 2000, 2, 12, { bonus: 3, classes: [...MARTIAL, 'cleric'], element: 'holy', text: [
  'A mace with a head of polished stone, spirals cut round it sunwise.',
  'The stone is warm to the hand, as if it had lain all day in the sun.',
] });

// Cairnmoor's of the bounds' eight (DESIGN §9, #847): the Grey Shield's 8 and a point, for its bearers,
// and its bearer mending by the hour. Found and never sold; placed nowhere yet, for #834 lays its lair
// and puts it there.
export const torhide: ItemDef = { id: 'torhide', name: 'Torhide', slot: 'shield', price: ARTIFACT_PRICE, ac: 9, classes: MAIL, regen: true, artifact: true, text: [
  'A round shield faced with grey hide, and every cut in it closed over.',
  'It is warm to hold, and warmer by night.',
] };

export const ITEMS: readonly ItemDef[] = [
  // O7's (#477): the ladder's plus for a caster, in the hollow under the ring's fallen stone.
  P(bandedStaff, 1),
  // Carn Dubh's (#480): the hill folk's own piece, off the ladder, in the cell off the stair; and the
  // first page of the Watcher's tally, a letter read from the pack, under his hands (#56's 37, #482).
  { id: 'hill_torc', name: 'Hill Torc', slot: 'none', price: 1500, resist: ['cold'], text: [
    'A torc of gold rods twisted together, heavy as a hand, its ends two hounds\' heads biting.',
  ] },
  { id: 'watchers_page', name: "The Watcher's Page", slot: 'none', price: 0, text: [
    'The first page of a tally in a careful hand: strokes in fives, a row to a night, the ink gone brown.',
    'Beside eleven of the rows, a ring drawn small in the margin. At the head of the page a year, four hundred years gone.',
    'The rows go on over the page. The next is not here.',
  ] },
  // O8's (#478): the bog body's ring, given by the peat-cutter to carry for the elves (#56's 38, #482).
  // Its crest is seen, and whose it is never said (DESIGN §10.1).
  { id: 'bog_ring', name: 'The Bog Body\'s Ring', slot: 'none', price: 0, text: [
    'A man\'s ring, gone black in the peat and heavy for its size.',
    'A crest is cut deep in its bezel, worn soft and still whole.',
  ] },
  // The two finds off the ladder (#862): the hammer under a cairn at the marsh's edge on N8, the mail
  // in the locked chest of a cell off Carn Dubh's end cell. No `GEAR` row, no shop (docs §4.8).
  beaconHammer,
  cairnbuildersMail,
  torhide,
  // Carn Fada's (#834, the enclave): the oldest dead's mace, in the cist under the bears' den.
  sunwiseMace,
];
