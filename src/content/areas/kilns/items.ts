// The Kilns' items: Anvilhall's forge's step on the ladder (#535), the same with a plus that the
// Kilns' boxes and the Tiefzeche give up by 19 (Cairnmoor's share is in its own table), what
// Kilnhaven's smith asks for the forge's wares, what the thane asks for the Stone, the finds of its
// boxes and its dungeon off the ladder, and the parts its machines carry. Made ahead of the area
// (#535) until its first box (#457) took the table
// into its Area; the forge (#459) sells the step and the smith (#469) the same at a quarter more.
// docs/areas/kilns.md §8 and §9 have the sums.
import type { ItemDef } from '../../../game/items.ts';
import { W, A, P, MARTIAL, MAIL, NO_CASTER_HEAVY, ARTIFACT_PRICE } from '../../items.ts';
import { plate } from '../thornmark/public.ts';
import { watchStaff, ironwoodBow } from '../sunderwood/public.ts';
import { sharkskin } from '../saltreach/public.ts';

// Sold at Anvilhall's forge (#459): a step past the Sunder's finds for every class, at 17.
export const forgeHammer = W('forge_hammer', 'Forge Hammer', 1400, 2, 10, { bonus: 3, classes: [...MARTIAL, 'cleric'] });
export const seax = W('seax', 'Seax', 1400, 1, 8, { kind: 'light', bonus: 9 });
export const steelBow = W('steel_bow', 'Steel Bow', 1500, 1, 12, { kind: 'bow', bonus: 8, ranged: true, twoHanded: true, classes: ['ranger'] });
export const mattock = W('mattock', 'Mattock', 1500, 2, 10, { bonus: 4, twoHanded: true, classes: MARTIAL });
export const bandedStaff = W('banded_staff', 'Banded Staff', 1300, 1, 10, { kind: 'staff', bonus: 8, twoHanded: true });
export const dwarfMail = A('dwarf_mail', 'Dwarf Mail', 2000, 11, { classes: NO_CASTER_HEAVY });
export const kilnRobe = A('kiln_robe', 'Kiln Robe', 1300, 9);
export const forgeShield: ItemDef = { id: 'forge_shield', name: 'Forge Shield', slot: 'shield', price: 1100, ac: 6, classes: MAIL };
const WARES = [forgeHammer, seax, steelBow, mattock, bandedStaff, dwarfMail, kilnRobe, forgeShield];

/** The forge's stock, the act's first step (#459); Kilnhaven's smith stocks the same (#469). */
export const FORGE: readonly string[] = WARES.map((d) => d.id);

/** A quarter more than an item's own price, in whole gold: what Kilnhaven's smith asks (#434's call 1). */
export const quarterMore = (price: number): number => Math.ceil((price * 5) / 4);

/** Kilnhaven's smith's prices for the forge's stock, a shop's `prices` (#469). */
export const SMITH_PRICES: Readonly<Record<string, number>> = Object.fromEntries(WARES.map((d) => [d.id, quarterMore(d.price)]));

/**
 * What the thane asks for the Anvil Stone (#434's call 1), for the great hall's question (#459): so
 * much that a clear of the Fells and the Tiefzeche can just pay it (docs/areas/kilns.md §8).
 */
export const ANVIL_STONE_PRICE = 6000;

// The Kilns' of the bounds' eight (DESIGN §9, #847): the Grey Mail's 14 and a point, for its wearers,
// and speed raised by 5 while it is worn. Found and never sold: it lies in the smith's kist at the
// face of the Dark Seam, the Randzeche's lower level, past the Steiger (#831).
export const erzhemd = A('erzhemd', 'The Erzhemd', ARTIFACT_PRICE, 15, { classes: NO_CASTER_HEAVY, stat: { speed: 5 }, artifact: true, text: [
  'A shirt of mail in rings darker than iron, and no heavier than wool.',
  'Inside the collar a smith\'s mark is cut, and a knocker\'s eye beside it.',
] });

// Found, not sold, by 19: N3's tithe-cellar, the Tiefzeche's side room, Erzkamm's hoard, the first
// dwarves' shelter on O6, the lime kiln on M6 and Kilnhaven's bonded store (docs/areas/kilns.md
// §4). The plate is plate's wearers' step past the forge's shield, as the Sunder's was past the Watch's.
export const platePlus3 = P(plate, 3);
export const forgeHammerPlus1 = P(forgeHammer, 1);
export const mattockPlus1 = P(mattock, 1);
export const steelBowPlus1 = P(steelBow, 1);
export const seaxPlus1 = P(seax, 1);
export const kilnRobePlus1 = P(kilnRobe, 1);
// M3's secret (#457): in the Hand's wagon stage behind the walled adit, the drover's, off the ladder.
export const droversGoad = P(watchStaff, 2, { id: 'drovers_goad', name: "Drover's Goad +2" });
// N3's secret (#458): a piece of the Stone boxed in the tithe-cellar, a keepsake as the Brine and
// Sunder Shards are; O5's cutter keeps the second (#464).
export const anvilShard: ItemDef = { id: 'anvil_shard', name: 'Anvil Shard', slot: 'none', price: 0 };
// N4's secret (#461): in the wagon yard behind the headworks, left in a cage by the cargo, which came
// from the coast; off the ladder, a coat the medium wearers have a level before the forge's mail.
export const sharkskinPlus2 = P(sharkskin, 2);
// N5's secret (#463): in the smiths' shard store under the slag heap, their own work, off the
// ladder as #535's 4 leaves it, the forge's shield with a plus.
export const forgeShieldPlus1 = P(forgeShield, 1);
// The Tiefzeche's old workings (#462): in the Hand's cages on the rails, what the cargo left, off the
// ladder, for the classes the Fells' finds miss: this bow, and a Warden's Dirk +2 (Sunderwood's), each
// at the forge's blow a level before it.
export const ironwoodBowPlus2 = P(ironwoodBow, 2);
// The parts the machines carry, which no shop buys and no hand-in takes (MONSTERS §2): a plate off a
// knocker, the Mender's spool of wire and the Foreman's slate, its list with nothing ticked.
export const knockerPlate: ItemDef = { id: 'knocker_plate', name: "Knocker's Plate", slot: 'none', price: 0 };
export const menderSpool: ItemDef = { id: 'mender_spool', name: "Mender's Spool", slot: 'none', price: 0 };
export const foremanSlate: ItemDef = { id: 'foreman_slate', name: "The Foreman's Slate", slot: 'none', price: 0, text: [
  'A slate of the same smooth grey as the knockers, rows cut down it close in the old script.',
  'At the end of every row, a box. None is ticked.',
] };
// O5's find (#464): in the cutters' foreman's shed, his own, off the ladder: a second hammer with a
// plus beside the Tiefzeche's, for the forge's hammer has three hands, the knight's, the paladin's
// and the cleric's.
export const cuttersHammer = P(forgeHammer, 1, { id: 'cutters_hammer', name: "Cutter's Hammer +1" });
// The Anvil Stone's Rift (#465): the first cutter's tools in the hollow against the Stone's cut face,
// off the ladder, a pick and a chisel the forge's mattock and seax with a plus under names of their
// own; and the Warden's heart, a keepsake as the Heart of the Sunder is, which no hand-in takes.
export const cuttersPick = P(mattock, 1, { id: 'cutters_pick', name: "Cutter's Pick +1" });
export const cuttersChisel = P(seax, 1, { id: 'cutters_chisel', name: "Cutter's Chisel +1" });
export const anvilHeart: ItemDef = { id: 'anvil_heart', name: 'Heart of the Anvil', slot: 'none', price: 0 };
// Feuerstollen's deepest chamber (#466): the Great Salamander's hide, which it drops, carried against
// fire as the Tide's symbol is carried against cold.
export const salamanderHide: ItemDef = { id: 'salamander_hide', name: "Great Salamander's Hide", slot: 'none', price: 500, resist: ['fire'], text: [
  'A hide gone grey as slate, cool to the hand however long it is held.',
] };
// The side quests (#471; docs/areas/kilns.md §6). The Crust-Bearer (#56's 33): the ring off the
// mother's braid at N3's well, which her son at the bottom of the Tiefzeche knows and takes.
export const braidRing: ItemDef = { id: 'braid_ring', name: 'The Braid-Ring', slot: 'none', price: 0, text: [
  'An iron ring off a dwarf woman\'s braid, worn smooth on the inside.',
] };
// The Primer (#56's 34): the scholar's copybook at Erzkamm, which reads Kiln-script as a Linguist
// does while anyone in the company carries it (#538).
export const copybook: ItemDef = { id: 'copybook', name: 'The Scholar\'s Copybook', slot: 'none', price: 0, skill: 'linguist', text: [
  'A copybook in a careful hand: the old script\'s marks down one side, the Crown\'s letters across from each.',
  'Its covers are Helmstow paper.',
] };
// A Crown to Order (#56's 35): the crown off Gluthutte's anvil, sewn up for Tallis's man at
// Kilnhaven, who takes it. It is never named.
export const crownParcel: ItemDef = { id: 'crown_parcel', name: 'A Parcel in Sacking', slot: 'none', price: 0, text: [
  'Sewn up in sacking, heavy for its size. It does not rattle.',
  'A tag on the string: KILNHAVEN. INTO WIEBE\'S HANDS.',
] };
// The Seestollen's strongbox (#831, the enclave, docs/areas/kilns.md §12.7): the forge's mattock, its
// head lain in the drowned quay, its blows carrying cold: the plain piece where the ladder wears the
// plus from 19, so the cold is the gain, as Cairnmoor's Beacon Hammer carries fire. Found there alone
// and sold nowhere, inside the enclave's window, Cairnmoor's 4,000 (EXPANSION §5.2, #845's 3).
export const durchschlag: ItemDef = { ...mattock, id: 'durchschlag', name: 'Durchschlag, Mattock', price: 1700, element: 'cold', text: [
  'A mattock with a head of dark steel, as cold as the black water it lay beside.',
  'Cut on the haft, in the old script: the day the gallery broke through.',
] };

export const ITEMS: readonly ItemDef[] = [
  ...WARES,
  platePlus3,
  forgeHammerPlus1,
  mattockPlus1,
  steelBowPlus1,
  seaxPlus1,
  kilnRobePlus1,
  droversGoad,
  anvilShard,
  sharkskinPlus2,
  forgeShieldPlus1,
  ironwoodBowPlus2,
  knockerPlate,
  menderSpool,
  foremanSlate,
  cuttersHammer,
  cuttersPick,
  cuttersChisel,
  anvilHeart,
  salamanderHide,
  braidRing,
  copybook,
  crownParcel,
  durchschlag,
  erzhemd,
];
