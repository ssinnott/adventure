// Saltreach's items: Saltmouth's armourer's step on the ladder (#399), the same with a plus that its
// boxes and Wrackholm's give up by 13, the locksmith's picks and the Map Room's chart (#860), and the
// finds of its boxes.
import type { ItemDef } from '../../../game/items.ts';
import { W, A, P, core, MARTIAL, NO_CASTER_HEAVY, ARTIFACT_PRICE } from '../../items.ts';
import { chain } from '../shelf/public.ts';

// Sold at Saltmouth's armourer (#177): a step past the Deepthorn's +2s for every class, at 11.
export const morningStar = W('morning_star', 'Morning Star', 700, 2, 6, { bonus: 3, classes: [...MARTIAL, 'cleric'] });
export const stiletto = W('stiletto', 'Stiletto', 700, 1, 8, { kind: 'light', bonus: 5 });
export const hornBow = W('horn_bow', 'Horn Bow', 750, 1, 12, { kind: 'bow', bonus: 4, ranged: true, twoHanded: true, classes: MARTIAL });
// The Horn Bow's short bow and sling (#1115): its die a size smaller and two, so a step and two behind it
// by `hits`, at three quarters of its price (562.5, down to a whole 5) and half; a plus where it has one.
export const hornShortbow = W('horn_shortbow', 'Horn Short Bow', 560, 1, 10, { kind: 'bow', short: true, bonus: 4, ranged: true, twoHanded: true, classes: [...MARTIAL, 'thief', 'bard'] });
export const sharkskinSling = W('sharkskin_sling', 'Sharkskin Sling', 375, 1, 8, { kind: 'light', bonus: 4, ranged: true });
export const longAxe = W('long_axe', 'Long Axe', 750, 2, 6, { bonus: 4, twoHanded: true, classes: MARTIAL });
export const ironshodStaff = W('ironshod_staff', 'Ironshod Staff', 600, 1, 10, { kind: 'staff', bonus: 4, twoHanded: true });
export const sharkskin = A('sharkskin', 'Sharkskin Coat', 1100, 9, { classes: NO_CASTER_HEAVY });
export const tidefolkRobe = A('tidefolk_robe', 'Tidefolk Robe', 650, 6);

// Sold in Saltmouth's two trades (#860), slotless and carried: each does a skill's work for a company
// without the skill, as the Kilns' copybook does a Linguist's (`ItemDef.skill`, #857). Pender's picks
// open a locked chest and keep an iron key; the Map Room's chart maps a square further. Both sit inside
// Saltreach's 2,000 window, off the ladder, and a shop buys either back at half.
export const setOfPicks: ItemDef = { id: 'set_of_picks', name: 'Set of Picks', slot: 'none', price: 750, skill: 'lockpick', text: [
  'A roll of oiled leather and a dozen slim picks, each worn bright at the tip. A key is burned into the leather, its bit filed to a point.',
] };
export const guildChart: ItemDef = { id: 'guild_chart', name: 'Guild Chart', slot: 'none', price: 400, skill: 'cartographer', text: [
  'Waxed linen ruled in squares, the road inked in and the rest left white. The Guild\'s stamp is in the corner.',
] };

// Saltreach's of the bounds' eight (DESIGN §9, #847): the Grey Staff's 1d10+13 and a point, its blows
// holy. Found and never sold; it lies on the stone by the Old Chanter's place in Sjongwierde's
// undercroft, the lair under A5's drowned mound (#830).
export const telstok = W('telstok', 'The Telstok', ARTIFACT_PRICE, 1, 10, { kind: 'staff', bonus: 14, twoHanded: true, classes: ['cleric', 'sorcerer', 'druid', 'monk'], element: 'holy', artifact: true, text: [
  'A staff of black bog oak, its foot worn round on a stone floor.',
  'Struck on stone, it rings like a bell under water.',
] });

// Found, not sold, by 13: the Drowned Temples' two, Rietum's two and the pans'
// (docs/areas/saltreach.md §4). Wrackholm's are in its own table.
export const morningStarPlus1 = P(morningStar, 1);
export const stilettoPlus1 = P(stiletto, 1);
export const ironshodStaffPlus1 = P(ironshodStaff, 1);
export const tidefolkRobePlus1 = P(tidefolkRobe, 1);
export const hornBowPlus1 = P(hornBow, 1);
export const hornShortbowPlus1 = P(hornShortbow, 1);
export const sharkskinSlingPlus1 = P(sharkskinSling, 1);
// C5's secret (#170): a shard from the barge drowned under the causeway, which the plinth does not take.
// C4's hide (#171) holds another.
export const brineShard: ItemDef = { id: 'brine_shard', name: 'Brine Shard', slot: 'none', price: 0 };
// C4's secret (#171): the crews' hide in the reeds.
export const longswordPlus1 = P(core('longsword'), 1);
// Rietum's cache under the quay (#172), beside the ladder's Stiletto +1 and Tidefolk Robe +1: the old
// smuggler's mail and his sword.
export const chainPlus1 = P(chain, 1);
export const smugglersSword = P(core('shortsword'), 2, { id: 'smugglers_sword', name: "Auke's Count, Short Sword +2" });
// The Night-Light (#56's 21): Nynke's shard in its jar, for the priest at the sluice or for Tobin.
// A Brine Shard in kind, but its own, so that a hand-in never takes C4's or C5's in its place.
export const nightLight: ItemDef = { id: 'night_light', name: 'Nynke\'s Night-Light', slot: 'none', price: 0, text: ['A shard of green glass the size of a thumb, cool, and by day only glass. By night there is a light in it, slow as a sleeper\'s breath, and it is brighter when the river is up.'] };
// The Star That Moved (#56's 24): the pilots' slate at the foot of their stone on the pans, for
// Hiske's press or for Tallis.
export const pilotsSlate: ItemDef = { id: 'pilots_slate', name: 'The Pilots\' Slate', slot: 'none', price: 0, text: [
  'A slate the size of a book, greasy with hands, chalked and re-chalked.',
  'Down the left, dates, from midsummer on. Down the right, a bearing for the pilots\' star over the Scarp, and beside each a pilot\'s initials. The bearing walks, a little each night, all one way.',
  'The last line, in a fresh hand: SHE\'S NOT IN THE CHART. NOBODY SAY.',
] };
// C6's find (#176): in a crate of the crews' cargo on the quay.
export const scalePlus1 = P(core('scale'), 1);
// C7's secret (#178): the salter's hoard in the sealed pan, beside the ladder's Horn Bow +1.
export const crabshellBuckler = P(core('buckler'), 2, { id: 'crabshell_buckler', name: 'Crab-Shell Buckler +2' });
// B2's secret (#830): the shepherd's cell under the beehive hut, the one piece of Saltmouth's step
// with a plus that no box gave. C2's cleft holds the Tide Ship's Long Axe +1 in kind (Wrackholm's table).
export const sharkskinPlus1 = P(sharkskin, 1);
// The Drowned Temples (#175): the bell the Choirmaster beats time on, for the priestess at B6's dry
// door (#56's 23); and the god's silver in the sacristy, a mace and the Holy Symbol of the Tide,
// which its bearer carries against the cold (#555).
export const tideBell: ItemDef = { id: 'tide_bell', name: 'The Tide Bell', slot: 'none', price: 0 };
export const silverMace = P(morningStar, 1, { id: 'silver_mace', name: 'Silver Mace +1', price: 850 });
export const tideSymbol: ItemDef = { id: 'tide_symbol', name: 'Holy Symbol of the Tide', slot: 'none', price: 400, resist: ['cold'], text: ['A disc of silver on a cord, worn thin at the back by a chest. Round its rim a tide is cut, a wave and two open hands, and a name: TIJSJONGER.', 'Nobody at the temples said it. The wave goes out between the hands, not in.'] };
// The Compact's first task (#182): the warehouse clerk's cask, carried to the Keel past the customs house.
export const brandyCask: ItemDef = { id: 'brandy_cask', name: 'Cask of Brandy', slot: 'none', price: 0 };

export const ITEMS: readonly ItemDef[] = [
  morningStar,
  stiletto,
  hornBow,
  hornShortbow,
  sharkskinSling,
  longAxe,
  ironshodStaff,
  sharkskin,
  tidefolkRobe,
  setOfPicks,
  guildChart,
  morningStarPlus1,
  stilettoPlus1,
  ironshodStaffPlus1,
  tidefolkRobePlus1,
  hornBowPlus1,
  hornShortbowPlus1,
  sharkskinSlingPlus1,
  brineShard,
  longswordPlus1,
  chainPlus1,
  smugglersSword,
  nightLight,
  pilotsSlate,
  scalePlus1,
  crabshellBuckler,
  sharkskinPlus1,
  tideBell,
  silverMace,
  tideSymbol,
  brandyCask,
  telstok,
  // Wytgat's strongbox (#830, the enclave): Saltmouth's Stiletto with a blade of brine glass, its blows
  // carrying lightning as the brinelings' bites do. Found there alone and sold nowhere, inside the
  // enclave's window, Wrackholm's 2,500 (EXPANSION §5.2, #845's 3).
  { ...stiletto, id: 'brine_needle', name: 'Brine Needle, Stiletto', price: 1150, element: 'lightning', text: [
    'A stiletto whose blade is a sliver of brine glass, ground to a point and bound to its grip with black cord.',
    'In the dark a green light crawls up the blade and back.',
  ] },
];
