// Wrackholm's items: the finds of its maps, and its share of the plus finds past Saltmouth's
// armourer (#399), by 13.
import type { ItemDef } from '../../../game/items.ts';
import { W, P, core, ARTIFACT_PRICE } from '../../items.ts';
import { ITEMS as THORNMARK } from '../thornmark/items.ts';
import { longAxe, morningStar, sharkskin } from '../saltreach/items.ts';
import { marlinspike } from '../ashfall/items.ts';

const plate = THORNMARK.find((i) => i.id === 'plate')!;

// Wrackholm's of the bounds' eight (DESIGN §9, #847): the Grey Knife's 1d8+14 and a point, for the
// thief, the bard and the sorcerer, and Grasping Roots cast from it three times a day. Found and never
// sold; it lies in Nick's Locker, the lair under F5's reef, on the ship's master past Old Nick (#835).
export const holdfast = W('holdfast', 'Holdfast', ARTIFACT_PRICE, 1, 8, { kind: 'light', bonus: 15, classes: ['thief', 'bard', 'sorcerer'], casts: { spell: 'roots', times: 3 }, artifact: true, text: [
  'A smuggler\'s knife, its haft wound with kelp that has not rotted.',
  'Wet, the weed on it moves.',
] });

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
  // The vaults' (#22): a hold keeper's yoke and pail, heaped in a pen, which no shop buys either; and in another
  // pen's straw the named piece, Cinderport's marlinspike with a plus of 5, at 3,050, inside the window of the
  // Glasswold's 6,000 that the curve holds a map at 27 to.
  { id: 'keeper_yoke', name: 'Hold Keeper\'s Yoke', slot: 'none', price: 0 },
  { id: 'keeper_pail', name: 'Hold Keeper\'s Pail', slot: 'none', price: 0 },
  P(marlinspike, 5, { id: 'fishers_spike', name: 'Fisher\'s Spike +5', text: [
    'A splicing spike, its grip bound in tarred cord, its point worn down to a needle.',
  ] }),
  // The counting house's (#22): the orders in the out-tray, read from the pack, an order to a runner in the
  // founder's hand, which a company takes without a fight (the Thief's, #448; the Factor's rung asks for them);
  // and in a bin of spent nibs by the desk a clerk's counting frame and a nib, which no shop buys.
  { id: 'compact_orders', name: 'The Compact\'s Orders', slot: 'none', price: 0, text: [
    'A sheet folded in four and sealed with the Compact\'s knot. The hand is the founder\'s, and it never once shakes.',
    '"To the runner on the Scarp Stair. The coin to the Riders, as before. The count to the cleft under the lip. Back by the stair."',
    'Under it the knot again, where a name would go.',
  ] },
  { id: 'clerk_frame', name: 'Tally Clerk\'s Frame', slot: 'none', price: 0 },
  { id: 'tally_nib', name: 'Tallymaster\'s Nib', slot: 'none', price: 0 },
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
  // The hollow in the east rocks' face (#861), behind the door the drag-marks end at, and off the ladder: no GEAR row
  // dresses a company in either, no shop sells either, and each is priced under the dearest find the curve holds
  // Wrackholm to (Plate Mail +1, 1,350) inside its window of 2,500. The Morning Star of the ladder's 11, the plain, where
  // the ladder wears the plus from 13 and the Flail from 14, with the sailors' cold flame on its head: its steel the
  // ladder's, so the lightning die is the gain (hits 13.5 against 11 and 12). Locked, in the iron-bound chest.
  { ...morningStar, id: 'corposant', name: 'Corposant, Morning Star', price: 1150, element: 'lightning' },
  // The Sharkskin Coat of the ladder's 11 a point lighter in the armour, and cut to run in: +3 speed while worn, which
  // the armour slot makes one coat at a time. In the plain chest beside the locked one.
  { ...sharkskin, id: 'runners_coat', name: "Runner's Coat", price: 1250, ac: 8, stat: { speed: 3 } },
  // The Brokenback's strongbox (#835, the enclave, docs/areas/wrackholm.md §12.5): the Seawall Armoury's long axe, the
  // master's own, its blows carrying cold: the plain piece where the ladder wears the Sunderwood's Great Axe from 14,
  // the die the gain (hits 14.5 against the Great Axe's 13, and its plus's 14 from 16). Found there alone and sold
  // nowhere, inside the enclave's window, the Sunderwood's 3,000 (EXPANSION §5.2, #845's 3).
  { ...longAxe, id: 'keelhaul', name: 'Keelhaul, Long Axe', price: 1600, element: 'cold', text: [
    'A long axe, its head gone dark and its haft grey with salt. The steel stays cold in the sun.',
    'Cut in the head, a name worn nearly smooth. The sea has had most of it.',
  ] },
  holdfast,
];
