// Thornmark's items: the tier a band 5-10 party buys in the Armoury, the same with a plus that it
// finds, the Deepthorn's next step, the chisel and the journal the Cut Stone gives up and the side quests' things.
import type { ItemDef } from '../../../game/items.ts';
import { W, A, P, MARTIAL, MAIL, NO_CASTER_HEAVY } from '../../items.ts';

export const warhammer = W('warhammer', 'War Hammer', 300, 1, 10, { bonus: 2, classes: [...MARTIAL, 'cleric'] });
export const greatsword = W('greatsword', 'Great Sword', 450, 2, 6, { bonus: 1, twoHanded: true, classes: MARTIAL });
export const elfbow = W('elfbow', 'Thornmark Bow', 420, 1, 10, { kind: 'bow', bonus: 2, ranged: true, twoHanded: true, classes: MARTIAL });
// Its short bow and sling (#1115), as the Long Bow's: a step and two behind it, the plus finds' too.
export const thornmarkShortbow = W('thornmark_shortbow', 'Thornmark Short Bow', 315, 1, 8, { kind: 'bow', short: true, bonus: 2, ranged: true, twoHanded: true, classes: [...MARTIAL, 'thief', 'bard'] });
export const deerskinSling = W('deerskin_sling', 'Deerskin Sling', 210, 1, 6, { kind: 'light', bonus: 2, ranged: true });
export const runeDagger = W('rune_dagger', 'Rune Dagger', 320, 1, 6, { kind: 'light', bonus: 3 });
export const groveStaff = W('grove_staff', 'Grove Staff', 280, 1, 8, { kind: 'staff', bonus: 2, twoHanded: true });
export const runedRobe = A('runed_robe', 'Runed Robe', 350, 3);
export const brigandine = A('brigandine', 'Brigandine', 400, 5, { classes: NO_CASTER_HEAVY });
export const towerShield: ItemDef = { id: 'tower_shield', name: 'Tower Shield', slot: 'shield', price: 400, ac: 3, classes: MAIL };

export const battleaxe = W('battleaxe', 'Battle Axe', 380, 1, 12, { bonus: 1, twoHanded: true, classes: MARTIAL });
export const crossbow = W('crossbow', 'Crossbow', 260, 1, 10, { ranged: true, twoHanded: true, classes: [...MARTIAL, 'thief'] });
export const plate = A('plate', 'Plate Mail', 1200, 9, { classes: ['knight', 'paladin'] });
// Found, not sold: the chests' and the Hand of Ash's. No plate with a plus: it would pass 1,200.
export const warhammerPlus1 = P(warhammer, 1);
export const greatswordPlus1 = P(greatsword, 1);
export const elfbowPlus1 = P(elfbow, 1);
export const thornmarkShortbowPlus1 = P(thornmarkShortbow, 1);
export const deerskinSlingPlus1 = P(deerskinSling, 1);
export const runeDaggerPlus1 = P(runeDagger, 1);
export const groveStaffPlus1 = P(groveStaff, 1);
export const runedRobePlus1 = P(runedRobe, 1);
export const brigandinePlus1 = P(brigandine, 1);
export const brigandinePlus2 = P(brigandine, 2);
// The Deepthorn's, the top of Act I's gear ladder: a +2 or better for every class by 10, inside
// the window's 1,200 gold. The Monk's is a staff of its own, and the torc a keepsake that sells.
export const warhammerPlus2 = P(warhammer, 2);
export const greatswordPlus2 = P(greatsword, 2);
export const elfbowPlus2 = P(elfbow, 2);
export const thornmarkShortbowPlus2 = P(thornmarkShortbow, 2);
export const deerskinSlingPlus2 = P(deerskinSling, 2);
export const runeDaggerPlus2 = P(runeDagger, 2);
export const runedRobePlus2 = P(runedRobe, 2);
export const brigandinePlus3 = P(brigandine, 3);
export const towerShieldPlus1 = P(towerShield, 1);
export const eldestsBough = P(groveStaff, 2, { id: 'eldests_bough', name: "Eldest's Bough +2" });
export const silverTorc: ItemDef = { id: 'silver_torc', name: 'Silver Torc', slot: 'none', price: 400 };
export const potionSpGreat: ItemDef = { id: 'potion_sp_great', name: 'Sapphire Vial', slot: 'none', price: 120, use: { sp: 25 } };
export const lanternOil: ItemDef = { id: 'lantern_oil', name: 'Lantern Oil', slot: 'none', price: 40, use: { cure: ['poisoned', 'diseased', 'paralysed'] } };
export const ashenChisel: ItemDef = { id: 'ashen_chisel', name: 'Underdeep Chisel', slot: 'none', price: 0 };
export const meridianJournal: ItemDef = { id: 'meridian_journal', name: 'Meridian Journal, vol. I', slot: 'none', price: 0, text: [
  'Green boards with the Guild\'s mark, water-stained; the first pages in Fane\'s hand.',
  '"Day one. Eleven of us out of Saltmouth by the shore road, the route book left with the Guild." On the last page, alone: The heart opens for whoever makes it whole.',
] };
// The side quests' (#219): no shop buys them. The coin stays in the pack whichever way A Coin Not
// From Caldera goes; the Reader takes the glass, and Edith the kit; the sliver is Edith's gift.
export const facelessCoin: ItemDef = { id: 'faceless_coin', name: 'Faceless Coin', slot: 'none', price: 0 };
export const markerGlass: ItemDef = { id: 'marker_glass', name: 'Marker Glass', slot: 'none', price: 0 };
export const mendingKit: ItemDef = { id: 'mending_kit', name: 'Mending Kit', slot: 'none', price: 0 };
export const groveSliver: ItemDef = { id: 'grove_sliver', name: 'Sliver of the Grove Stone', slot: 'none', price: 0 };
// The Older Mark (#218): the rubbing of Penspern's standing stone, Senara's ask; she takes it.
export const stoneRubbing: ItemDef = { id: 'stone_rubbing', name: 'The Stone\'s Rubbing', slot: 'none', price: 0 };
// Hale's Sergeant (#558): Hale's pass-token, Wystan's gift either way. Hale knows it in the Tide
// Ship's hold and leaves it with the company; nothing takes it (#56's 41 may).
export const haleToken: ItemDef = { id: 'hale_token', name: 'Hale\'s Token', slot: 'none', price: 0 };
// How Did He Know (#214): the survey's orders, a letter read from the pack, found in H3's fire-pit.
export const surveyOrders: ItemDef = { id: 'survey_orders', name: 'The Survey\'s Orders', slot: 'none', price: 0, text: [
  'Grey Lantern paper, burnt along one edge so that every line ends early. Dated three days before the Queen died, and sealed with the Regent\'s seal, whole where the fire missed it.',
  '"To the survey, four: by the Salt Road past Gullwick to Ashcombe, and the cellar beneath it. Survey the ground below the farm as far as the seam and no further. Report what the seam does, and when. To me alone; nothing to the Guildhall, nothing to the"',
  'The rest is ash. Beneath, in a clerk\'s hand: "the Grove next, if the ground answers".',
] };

export const ITEMS: readonly ItemDef[] = [
  warhammer,
  battleaxe,
  greatsword,
  crossbow,
  elfbow,
  thornmarkShortbow,
  deerskinSling,
  runeDagger,
  groveStaff,
  runedRobe,
  brigandine,
  plate,
  towerShield,
  warhammerPlus1,
  greatswordPlus1,
  elfbowPlus1,
  thornmarkShortbowPlus1,
  deerskinSlingPlus1,
  runeDaggerPlus1,
  groveStaffPlus1,
  runedRobePlus1,
  brigandinePlus1,
  brigandinePlus2,
  warhammerPlus2,
  greatswordPlus2,
  elfbowPlus2,
  thornmarkShortbowPlus2,
  deerskinSlingPlus2,
  runeDaggerPlus2,
  runedRobePlus2,
  brigandinePlus3,
  towerShieldPlus1,
  eldestsBough,
  silverTorc,
  potionSpGreat,
  lanternOil,
  ashenChisel,
  meridianJournal,
  facelessCoin,
  markerGlass,
  mendingKit,
  groveSliver,
  stoneRubbing,
  haleToken,
  surveyOrders,
];
