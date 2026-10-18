// Saltreach's items: Saltmouth's armourer's step on the ladder (#399), the same with a plus that its
// boxes and Wrackholm's give up by 13, the locksmith's picks and the Map Room's chart (#860), and the
// finds of its boxes.
import type { ItemDef } from '../../../game/items.ts';
import { W, A, P, core, MARTIAL, NO_CASTER_HEAVY, ARTIFACT_PRICE } from '../../items.ts';
import { ITEMS as FORELAND } from '../shelf/items.ts';

// Sold at Saltmouth's armourer (#177): a step past the Deepthorn's +2s for every class, at 11.
export const morningStar = W('morning_star', 'Morning Star', 700, 2, 6, { bonus: 3, classes: [...MARTIAL, 'cleric'] });
export const stiletto = W('stiletto', 'Stiletto', 700, 1, 8, { kind: 'light', bonus: 5 });
export const hornBow = W('horn_bow', 'Horn Bow', 750, 1, 12, { kind: 'bow', bonus: 4, ranged: true, twoHanded: true, classes: ['ranger'] });
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
// holy. Found and never sold; placed nowhere yet, for #830 lays its lair and puts it there.
export const telstok = W('telstok', 'The Telstok', ARTIFACT_PRICE, 1, 10, { kind: 'staff', bonus: 14, twoHanded: true, classes: ['cleric', 'sorcerer', 'druid', 'monk'], element: 'holy', artifact: true, text: [
  'A staff of black bog oak, its foot worn round on a stone floor.',
  'Struck on stone, it rings like a bell under water.',
] });

export const ITEMS: readonly ItemDef[] = [
  morningStar,
  stiletto,
  hornBow,
  longAxe,
  ironshodStaff,
  sharkskin,
  tidefolkRobe,
  setOfPicks,
  guildChart,
  // Found, not sold, by 13: the Drowned Temples' two, Rietum's two and the pans'
  // (docs/areas/saltreach.md §4). Wrackholm's are in its own table.
  P(morningStar, 1),
  P(stiletto, 1),
  P(ironshodStaff, 1),
  P(tidefolkRobe, 1),
  P(hornBow, 1),
  // C5's secret (#170): a shard from the barge drowned under the causeway, which the plinth does not take.
  // C4's hide (#171) holds another.
  { id: 'brine_shard', name: 'Brine Shard', slot: 'none', price: 0 },
  // C4's secret (#171): the crews' hide in the reeds.
  P(core('longsword'), 1),
  // Rietum's cache under the quay (#172), beside the ladder's Stiletto +1 and Tidefolk Robe +1: the old
  // smuggler's mail and his sword.
  P(FORELAND.find((i) => i.id === 'chain')!, 1),
  P(core('shortsword'), 2, { id: 'smugglers_sword', name: "Auke's Count, Short Sword +2" }),
  // The Night-Light (#56's 21): Nynke's shard in its jar, for the priest at the sluice or for Tobin.
  // A Brine Shard in kind, but its own, so that a hand-in never takes C4's or C5's in its place.
  { id: 'night_light', name: 'Nynke\'s Night-Light', slot: 'none', price: 0, text: ['A shard of green glass the size of a thumb, cool, and by day only glass. By night there is a light in it, slow as a sleeper\'s breath, and it is brighter when the river is up.'] },
  // The Star That Moved (#56's 24): the pilots' slate at the foot of their stone on the pans, for
  // Hiske's press or for Tallis.
  { id: 'pilots_slate', name: 'The Pilots\' Slate', slot: 'none', price: 0, text: [
    'A slate the size of a book, greasy with hands, chalked and re-chalked.',
    'Down the left, dates, from midsummer on. Down the right, a bearing for the pilots\' star over the Scarp, and beside each a pilot\'s initials. The bearing walks, a little each night, all one way.',
    'The last line, in a fresh hand: SHE\'S NOT IN THE CHART. NOBODY SAY.',
  ] },
  // C6's find (#176): in a crate of the crews' cargo on the quay.
  P(core('scale'), 1),
  // C7's secret (#178): the salter's hoard in the sealed pan, beside the ladder's Horn Bow +1.
  P(core('buckler'), 2, { id: 'crabshell_buckler', name: 'Crab-Shell Buckler +2' }),
  // The Drowned Temples (#175): the bell the Choirmaster beats time on, for the priestess at B6's dry
  // door (#56's 23); and the god's silver in the sacristy, a mace and the Holy Symbol of the Tide,
  // which its bearer carries against the cold (#555).
  { id: 'tide_bell', name: 'The Tide Bell', slot: 'none', price: 0 },
  P(morningStar, 1, { id: 'silver_mace', name: 'Silver Mace +1', price: 850 }),
  { id: 'tide_symbol', name: 'Holy Symbol of the Tide', slot: 'none', price: 400, resist: ['cold'], text: ['A disc of silver on a cord, worn thin at the back by a chest. Round its rim a tide is cut, a wave and two open hands, and a name: TIJSJONGER.', 'Nobody at the temples said it. The wave goes out between the hands, not in.'] },
  // The Compact's first task (#182): the warehouse clerk's cask, carried to the Keel past the customs house.
  { id: 'brandy_cask', name: 'Cask of Brandy', slot: 'none', price: 0 },
  telstok,
];
