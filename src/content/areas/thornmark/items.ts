// Thornmark's items: the tier a band 5-10 party buys in the Armoury, the same with a plus that it
// finds, the Deepthorn's next step, the chisel and the journal the Cut Stone gives up and the side quests' things.
import type { ItemDef } from '../../../game/items.ts';
import { W, A, P, MARTIAL, MAIL, NO_CASTER_HEAVY } from '../../items.ts';

const warhammer = W('warhammer', 'War Hammer', 300, 1, 10, { bonus: 2, classes: [...MARTIAL, 'cleric'] });
const greatsword = W('greatsword', 'Great Sword', 450, 2, 6, { bonus: 1, twoHanded: true, classes: MARTIAL });
const elfbow = W('elfbow', 'Thornmark Bow', 420, 1, 10, { bonus: 2, ranged: true, twoHanded: true, classes: ['ranger'] });
const runeDagger = W('rune_dagger', 'Rune Dagger', 320, 1, 6, { bonus: 3 });
const groveStaff = W('grove_staff', 'Grove Staff', 280, 1, 8, { bonus: 2, twoHanded: true });
const runedRobe = A('runed_robe', 'Runed Robe', 350, 3);
const brigandine = A('brigandine', 'Brigandine', 400, 5, { classes: NO_CASTER_HEAVY });
const towerShield: ItemDef = { id: 'tower_shield', name: 'Tower Shield', slot: 'shield', price: 400, ac: 3, classes: MAIL };

export const ITEMS: readonly ItemDef[] = [
  warhammer,
  W('battleaxe', 'Battle Axe', 380, 1, 12, { bonus: 1, twoHanded: true, classes: MARTIAL }),
  greatsword,
  W('crossbow', 'Crossbow', 260, 1, 10, { ranged: true, twoHanded: true, classes: [...MARTIAL, 'thief'] }),
  elfbow,
  runeDagger,
  groveStaff,
  runedRobe,
  brigandine,
  A('plate', 'Plate Mail', 1200, 9, { classes: ['knight', 'paladin'] }),
  towerShield,
  // Found, not sold: the chests' and the Hand of Ash's. No plate with a plus: it would pass 1,200.
  P(warhammer, 1),
  P(greatsword, 1),
  P(elfbow, 1),
  P(runeDagger, 1),
  P(groveStaff, 1),
  P(runedRobe, 1),
  P(brigandine, 1),
  P(brigandine, 2),
  // The Deepthorn's, the top of Act I's gear ladder: a +2 or better for every class by 10, inside
  // the window's 1,200 gold. The Monk's is a staff of its own, and the torc a keepsake that sells.
  P(warhammer, 2),
  P(greatsword, 2),
  P(elfbow, 2),
  P(runeDagger, 2),
  P(runedRobe, 2),
  P(brigandine, 3),
  P(towerShield, 1),
  P(groveStaff, 2, { id: 'eldests_bough', name: "Eldest's Bough +2" }),
  { id: 'silver_torc', name: 'Silver Torc', slot: 'none', price: 400 },
  { id: 'potion_sp_great', name: 'Sapphire Vial', slot: 'none', price: 120, use: { sp: 25 } },
  { id: 'lantern_oil', name: 'Lantern Oil', slot: 'none', price: 40, use: { cure: ['poisoned', 'diseased', 'paralysed'] } },
  { id: 'ashen_chisel', name: 'Underdeep Chisel', slot: 'none', price: 0 },
  { id: 'meridian_journal', name: 'Meridian Journal, vol. I', slot: 'none', price: 0 },
  // The side quests' (#219): no shop buys them. The coin stays in the pack whichever way A Coin Not
  // From Caldera goes; the Reader takes the glass, and Edith the kit; the sliver is Edith's gift.
  { id: 'faceless_coin', name: 'Faceless Coin', slot: 'none', price: 0 },
  { id: 'marker_glass', name: 'Marker Glass', slot: 'none', price: 0 },
  { id: 'mending_kit', name: 'Mending Kit', slot: 'none', price: 0 },
  { id: 'grove_sliver', name: 'Sliver of the Grove Stone', slot: 'none', price: 0 },
  // How Did He Know (#214): the survey's orders, a letter read from the pack, found in H3's fire-pit.
  { id: 'survey_orders', name: 'The Survey\'s Orders', slot: 'none', price: 0, text: [
    'Grey Lantern paper, burnt along one edge so that every line ends early. Dated three days before the Queen died, and sealed with the Regent\'s seal, whole where the fire missed it.',
    '"To the survey, four: by the Salt Road past Gullwick to Ashcombe, and the cellar beneath it. Survey the ground below the farm as far as the seam and no further. Report what the seam does, and when. To me alone; nothing to the Guildhall, nothing to the"',
    'The rest is ash. Beneath, in a clerk\'s hand: "the Grove next, if the ground answers".',
  ] },
];
