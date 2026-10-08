// Cairnmoor's items: its share of the plus finds past Anvilhall's forge (#535), by 19, and its finds
// off the ladder. Made ahead of the area (#535), as the Kilns' were, until its first box (#476) took the
// table into its Area. N7's cache and O8's hoard hold seconds of the Kilns' Forge Hammer +1 and Seax +1,
// which need no line here.
import type { ItemDef } from '../../../game/items.ts';
import { P } from '../../items.ts';
import { bandedStaff } from '../kilns/items.ts';

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
];
