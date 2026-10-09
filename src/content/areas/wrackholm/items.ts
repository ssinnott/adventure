// Wrackholm's items: the finds of its maps, and its share of the plus finds past Saltmouth's
// armourer (#399), by 13.
import type { ItemDef } from '../../../game/items.ts';
import { P, core } from '../../items.ts';
import { ITEMS as THORNMARK } from '../thornmark/items.ts';
import { longAxe } from '../saltreach/items.ts';

const plate = THORNMARK.find((i) => i.id === 'plate')!;

export const ITEMS: readonly ItemDef[] = [
  // Kelp Hole's (#188): the crews' strongbox, the first plate with a plus on the road, and the
  // ladder's for plate's wearers (#399).
  P(plate, 1),
  // The Tide Ship's (#190): the ladder's for the barbarian, in the Hand's strongbox in the forward hold.
  P(longAxe, 1),
  // F6's (#189): the founder's seal, in his grave under the cairn on the east rocks; the Compact's
  // hall takes it (#182).
  { id: 'founders_seal', name: "Founder's Seal", slot: 'none', price: 0 },
  // The Tide Ship's (#190): the ship's papers and its log on the captain's table, read from the pack;
  // the log is read at Lantern Watch (#204). The captain's cutlass in his sea chest, named. The Tide
  // Stone in its Rift's hoard, a plain quest item (#151, call 6), carried home by #191.
  { id: 'ships_papers', name: 'The Ship\'s Papers', slot: 'none', price: 0, text: [
    'A manifest in a clerk\'s hand, ruled in columns: DATE, CARGO, FROM, TO, PASSED. Each page is sealed at the foot, the wax gone soft with bilge and the device past making out.',
    'Brandy and salt fill the early pages. Then the TO column changes, every entry the same word: BELOW. The CARGO column counts heads.',
    'Midway, in the same hand: "The girl from Gullwick. Delivered below, as instructed, by way of the dwarves\' deepest mine." The date is months gone. PASSED.',
  ] },
  { id: 'ships_log', name: 'The Ship\'s Log', slot: 'none', price: 0, text: [
    'A log in a cramped hand, the dates plain and the rest not: letters you know in an order you do not, or a script that only looks like one.',
    'One mark comes back page on page, a hooked line like a step. At the foot of each entry something is set in another ink, small and sure, the way a name is.',
  ] },
  P(core('shortsword'), 2, { id: 'tide_cutlass', name: 'Slack Water, Cutlass +2' }),
  { id: 'tide_stone', name: 'The Tide Stone', slot: 'none', price: 0 },
  // The Dead-Drop's (#22): the parts a loader shed against the rails' end in the drop, which no shop buys and
  // no hand-in takes (MONSTERS §2), as the stokers' and the flue walker's.
  { id: 'loader_port', name: 'Loader\'s Fire Port', slot: 'none', price: 0 },
  { id: 'loader_iron', name: 'Loader\'s Crate Iron', slot: 'none', price: 0 },
  // The side quests' letters (#192): Colan's to his brother, sealed (The Captain's Brother); the
  // founder's last, which Merryn carried ten years (The Hermit of the Point); and the clerk's
  // book from the Tide Ship's cabin, every name the hold carried (Every Name in the Column).
  { id: 'colans_letter', name: 'Colan\'s Letter', slot: 'none', price: 0, text: [
    'A paper folded small and sealed with grey wax, thumbed soft at the corners. On the outside, in a careful hand: KITTO. Nothing else.',
    'The seal is whole. It is not yours to break.',
  ] },
  { id: 'founders_letter', name: 'The Founder\'s Letter', slot: 'none', price: 0, text: [
    'A paper gone brown and soft, folded in four, with the Compact\'s knot drawn at the head in a hand that shook.',
    '"To the hall, by my own hand, and the last time. The orders you\'ve had since the spring aren\'t mine. They come up from below the ship, and they\'re signed how I sign, and I never wrote one. I\'m too sick to come and say it. Whoever reads this in the back room: it\'s you they\'re running now, not me. I don\'t know who. I know what they\'re buying, and I\'d not have sold it."',
    'No name. A knot, and under it, small: "Bury me where I can see the ships."',
  ] },
  { id: 'clerks_book', name: 'The Clerk\'s Book', slot: 'none', price: 0, text: [
    'A roll of names in a clerk\'s hand, salt-stained, ruled in a column down each page. Down the left, names and homes: Gullwick, Reedholm, Brockholt, Ashcombe. Down the right, a tick for each in a different ink, and beside some, in the same grey ink as the tick: DELIVERED BELOW, BY THE DEEP MINE.',
    'The ticks stop a third of the way down the last page. The names go on.',
    'Halfway down the first page: Wenna, of Gullwick. Delivered below, by the deep mine.',
  ] },
];
