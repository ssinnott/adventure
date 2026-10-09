// Ashfall's items: Cinderport's armourer's step on the ladder (#542), the act's one, by 25, the stone
// cure (#546) and the boxes' new finds: the Great Axe +2 in the scavenger's hole (G11, #513) and the
// Horn Bow +2 in the grave in the Cinder Hills (E10, #517); and Old Cinder's finds, the Ember Stone's
// second part and the founding stone among them (#515); and the Ember Stone's, the fourth Meridian
// journal among them (#516). The step and the cure were made ahead of
// the area, as the Kilns' were: the first box (G10, #511) took the table into its Area, the armourer
// (#512) sells the step and the chandler the cure.
// docs/areas/ashfall.md §8 and §9 have the sums.
import type { ItemDef } from '../../../game/items.ts';
import { W, A, P, MARTIAL, MAIL, NO_CASTER_HEAVY } from '../../items.ts';
import { ITEMS as SUNDERWOOD } from '../sunderwood/items.ts';
import { hornBow } from '../saltreach/items.ts';
import { dwarfMail } from '../kilns/items.ts';

// Sold at Cinderport's armourer (#512): a step past Rime Lodge's finds for every class, at 25.
export const slagMace = W('slag_mace', 'Slag Mace', 2300, 2, 12, { bonus: 5, classes: [...MARTIAL, 'cleric'] });
export const marlinspike = W('marlinspike', 'Marlinspike', 2300, 1, 8, { kind: 'light', bonus: 13 });
export const ashwoodBow = W('ashwood_bow', 'Ashwood Bow', 2400, 1, 12, { kind: 'bow', bonus: 12, ranged: true, twoHanded: true, classes: ['ranger'] });
export const flamberge = W('flamberge', 'Flamberge', 2400, 2, 12, { bonus: 6, twoHanded: true, classes: MARTIAL });
export const battleStaff = W('battle_staff', 'Battle Staff', 2000, 1, 10, { kind: 'staff', bonus: 12, twoHanded: true });
export const drakeskin = A('drakeskin', 'Drakeskin Coat', 3100, 13, { classes: NO_CASTER_HEAVY });
export const cinderRobe = A('cinder_robe', 'Cinder Robe', 2000, 12);
export const basaltShield: ItemDef = { id: 'basalt_shield', name: 'Basalt Shield', slot: 'shield', price: 1400, ac: 7, classes: MAIL };
const WARES = [slagMace, marlinspike, ashwoodBow, flamberge, battleStaff, drakeskin, cinderRobe, basaltShield];

/** The armourer's stock, the act's one step (#512); the Wold has no town and buys here by the Rider's ride (#547). */
export const ARMOURER: readonly string[] = WARES.map((d) => d.id);

/**
 * The stone cure (#546; MONSTERS §3.3): poured on one turned to glass, it lifts the stone. At the
 * temple's price for a member of 25, Cinderport's step: it saves the ride, not the gold.
 */
export const quickening: ItemDef = { id: 'quickening', name: 'Quickening Draught', slot: 'none', price: 2000, use: { cure: ['stoned'] } };
/** The chandler's cure (#512), which the Riders' trader at Akordu carries too (#526); the Wold has no temple nearer. */
export const CURES: readonly string[] = [quickening.id];

/** The scavenger's find in his hole beside the vents (G11, #513; #56's 52), at 1,500: inside the window. */
export const scavengersAxe = P(SUNDERWOOD.find((i) => i.id === 'great_axe')!, 2);

/** The find in the grave in the Cinder Hills (E10, #517): the brief's Horn Bow +2, Saltreach's bow with a plus. */
export const graveBow = P(hornBow, 2);

/**
 * The Ember Stone's first part (#22; docs/areas/ashfall.md §5, #548), in the furnace's mouth in the
 * stokers' furnace room on Meridian Camp's first level: a quest item for the Stone's hand-in of three
 * (#516), which takes each part at the first meeting. Old Cinder's undercroft holds the second (#515) and
 * the iron corridors' end the third (meridian_camp2).
 */
export const emberPart1: ItemDef = { id: 'ember_part1', name: 'Ember Stone\'s First Part', slot: 'none', price: 0, text: [
  'A piece of grey iron the size of a loaf, warm through, and heavier than it looks.',
  'One face of it is cut to fit something, exactly.',
] };

/**
 * The Ember Stone's third part (#22; docs/areas/ashfall.md §5), at the end of Meridian Camp's iron
 * corridors (meridian_camp2): a quest item for the Stone's hand-in of three (#516), as the first is.
 */
export const emberPart3: ItemDef = { id: 'ember_part3', name: 'Ember Stone\'s Third Part', slot: 'none', price: 0, text: [
  'A wedge of grey iron the length of a forearm, warm through, and heavier than it looks.',
  'Its broad face is cut to fit something, exactly.',
] };

/**
 * The Company's kit in its second camp, cold, on the iron corridors (#22; meridian_camp.md §4.2): the
 * Kilns' dwarf mail with a plus of 3, named, at 2,450, inside Ashfall's window of 5,500.
 */
export const meridianMail = P(dwarfMail, 3, { id: 'meridian_mail', name: 'Meridian Mail +3', text: [
  'A coat of fine rings left spread on a bedroll, its lining burnt through across the shoulders.',
] });

/**
 * The Company's kit in its last camp, Fane's, at the bottom of Meridian Camp (meridian_camp3; #22, §4.3):
 * the armourer's battle staff with a plus of 4, named, at 2,600, inside Ashfall's window of 5,500.
 */
export const meridianStaff = P(battleStaff, 4, { id: 'meridian_staff', name: 'Meridian Staff +4', text: [
  'A staff shod with iron, notched along its length in spans and half-spans, the notches worn smooth.',
] });

/**
 * Oriel Fane's map (#22; meridian_camp.md §4.3; #443, call 4), which he gives at the first meeting: a quest
 * item, sewn shut, with nothing a player can read. Its giving sets `meridian_map`, the Lost Expedition
 * done; the Wold's scout takes it, looks, and gives it back (#447).
 */
export const faneMap: ItemDef = { id: 'fane_map', name: 'Fane\'s Map', slot: 'none', price: 0, text: [
  'A roll of oilcloth the length of a forearm, sewn shut along its seam with sail thread.',
  'It is heavier than paper has any right to be.',
] };

/**
 * The parts the machines shed, which no shop buys and no hand-in takes (MONSTERS §2): the stokers' on the
 * vents' furnace room's heap, and the flue walker's on the heap at the iron corridors' end (#22).
 */
const PARTS: ItemDef[] = [
  { id: 'stoker_firebar', name: 'Stoker\'s Firebar', slot: 'none', price: 0 },
  { id: 'stoker_blade', name: 'Stoker\'s Shovel Blade', slot: 'none', price: 0 },
  { id: 'walker_damper', name: 'Flue Walker\'s Damper', slot: 'none', price: 0 },
  { id: 'walker_iron', name: 'Flue Walker\'s Climbing Iron', slot: 'none', price: 0 },
];

/**
 * Old Cinder's finds (#515): the ladder's plus at the square, on the stall the Old Drake sleeps beside;
 * the town's founding stone in its niche in the undercroft, for the Cinderport potter (#56's 50, its quest
 * #519's); the Ember Stone's second part, set in the floor beside the dark lamp at the undercroft's
 * bottom, a quest item for the Stone's hand-in of three (#516; docs/areas/ashfall.md §5); and in the
 * lamp-keeper's own cellar his holy symbol, which its bearer carries against fire, with a Plate Mail +2.
 */
export const squareFlamberge = P(flamberge, 1);
export const foundingStone: ItemDef = { id: 'founding_stone', name: 'The Founding Stone', slot: 'none', price: 0, text: [
  'A block of grey stone, a cup cut in its face and names under it, worn smooth.',
  'It is heavy, and someone kept it dusted.',
] };
export const emberPart2: ItemDef = { id: 'ember_part2', name: 'Ember Stone\'s Second Part', slot: 'none', price: 0, text: [
  'A wedge of grey iron, warm through, and heavier than it looks.',
  'Two of its faces are cut to fit something, exactly.',
] };
export const hearthSymbol: ItemDef = { id: 'hearth_symbol', name: 'Holy Symbol of the Hearth', slot: 'none', price: 400, resist: ['fire'], text: [
  'A disc of iron on a cord, black with soot. On its face a flame is cut in a ring of hands.',
  'It is warm to hold, even down here.',
] };

/**
 * The Ember Stone's finds (#516): on the builders' benches the ladder's Battle Staff +1 and, for the
 * brief's Scale Mail +1 in older words (docs/areas/ashfall.md §9, #542's 6), its Drakeskin Coat +1; the
 * Sentinel's visor, a part no shop buys and no hand-in takes (MONSTERS §2); and in the lower gallery
 * under the housing the Meridian Company's fourth journal, the one Cinderport's shelf lacks: a quest
 * item kept in the pack, since the Cartographers' Surveyor's rung asks it found, never handed in (#635).
 */
export const benchStaff = P(battleStaff, 1);
export const benchCoat = P(drakeskin, 1);
export const sentinelVisor: ItemDef = { id: 'sentinel_visor', name: 'The Sentinel\'s Visor', slot: 'none', price: 0, text: [
  'A plate of iron the width of two hands with a slit across it, black round the slit where the fire looked out.',
] };
export const meridianJournal4: ItemDef = { id: 'meridian_journal4', name: 'Meridian Journal, vol. IV', slot: 'none', price: 0, text: [
  'Green boards with the Guild\'s mark, the last pages in Fane\'s hand.',
  '"Camped under the Stone. Its builders left their tools on the benches, as if called away. The vents tomorrow."',
] };

export const ITEMS: readonly ItemDef[] = [...WARES, quickening, scavengersAxe, graveBow, emberPart1, emberPart3, meridianMail, meridianStaff, faneMap, ...PARTS, squareFlamberge, foundingStone, emberPart2, hearthSymbol, benchStaff, benchCoat, sentinelVisor, meridianJournal4];
