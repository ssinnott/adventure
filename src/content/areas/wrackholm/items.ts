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
    'A manifest in a clerk\'s hand, ruled in columns: DATE, CARGO, FROM, TO, PASSED. Every page bears the Helmstow customs seal, crisp, not one smudged.',
    'Brandy and salt fill the early pages. Then the TO column changes, every entry the same word: BELOW. The CARGO column counts heads.',
    'Midway, in the same hand: "The girl from Gullwick. Delivered below, as instructed, by way of the dwarves\' deepest mine." The date is months gone. PASSED.',
  ] },
  { id: 'ships_log', name: 'The Ship\'s Log', slot: 'none', price: 0, text: [
    'A log in a cramped hand, the dates plain and the rest not: letters you know in an order you do not, or a script that only looks like one.',
    'One mark comes back page on page, a hooked line like a step. At the foot of each entry something is set in another ink, small and sure, the way a name is.',
  ] },
  P(core('shortsword'), 2, { id: 'tide_cutlass', name: 'Slack Water, Cutlass +2' }),
  { id: 'tide_stone', name: 'The Tide Stone', slot: 'none', price: 0 },
];
