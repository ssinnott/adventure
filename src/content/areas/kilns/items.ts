// The Kilns' items: Anvilhall's forge's step on the ladder (#535), the same with a plus that the
// Kilns' boxes and the Tiefzeche give up by 19 (Cairnmoor's share is in its own table), what
// Kilnhaven's smith asks for the forge's wares, what the thane asks for the Stone, the finds of its
// boxes and its dungeon off the ladder, and the parts its machines carry. Made ahead of the area
// (#535) until its first box (#457) took the table
// into its Area; the forge (#459) sells the step and the smith (#469) the same at a quarter more.
// docs/areas/kilns.md §8 and §9 have the sums.
import type { ItemDef } from '../../../game/items.ts';
import { W, A, P, MARTIAL, MAIL, NO_CASTER_HEAVY } from '../../items.ts';
import { ITEMS as THORNMARK } from '../thornmark/items.ts';
import { ITEMS as SUNDERWOOD } from '../sunderwood/items.ts';
import { sharkskin } from '../saltreach/items.ts';

const plate = THORNMARK.find((i) => i.id === 'plate')!;
const watchStaff = SUNDERWOOD.find((i) => i.id === 'watch_staff')!;
const ironwoodBow = SUNDERWOOD.find((i) => i.id === 'ironwood_bow')!;

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

export const ITEMS: readonly ItemDef[] = [
  ...WARES,
  // Found, not sold, by 19: N3's tithe-cellar, the Tiefzeche's side room, Erzkamm's hoard, the first
  // dwarves' shelter on O6, the lime kiln on M6 and Kilnhaven's bonded store (docs/areas/kilns.md
  // §4). The plate is plate's wearers' step past the forge's shield, as the Sunder's was past the Watch's.
  P(plate, 3),
  P(forgeHammer, 1),
  P(mattock, 1),
  P(steelBow, 1),
  P(seax, 1),
  P(kilnRobe, 1),
  // M3's secret (#457): in the Hand's wagon stage behind the walled adit, the drover's, off the ladder.
  P(watchStaff, 2, { id: 'drovers_goad', name: "Drover's Goad +2" }),
  // N3's secret (#458): a piece of the Stone boxed in the tithe-cellar, a keepsake as the Brine and
  // Sunder Shards are; O5's cutter keeps the second (#464).
  { id: 'anvil_shard', name: 'Anvil Shard', slot: 'none', price: 0 },
  // N4's secret (#461): in the wagon yard behind the headworks, left in a cage by the cargo, which came
  // from the coast; off the ladder, a coat the medium wearers have a level before the forge's mail.
  P(sharkskin, 2),
  // N5's secret (#463): in the smiths' shard store under the slag heap, their own work, off the
  // ladder as #535's 4 leaves it, the forge's shield with a plus.
  P(forgeShield, 1),
  // The Tiefzeche's old workings (#462): in the Hand's cages on the rails, what the cargo left, off the
  // ladder, for the classes the Fells' finds miss: this bow, and a Warden's Dirk +2 (Sunderwood's), each
  // at the forge's blow a level before it.
  P(ironwoodBow, 2),
  // The parts the machines carry, which no shop buys and no hand-in takes (MONSTERS §2): a plate off a
  // knocker, the Mender's spool of wire and the Foreman's slate, its list with nothing ticked.
  { id: 'knocker_plate', name: "Knocker's Plate", slot: 'none', price: 0 },
  { id: 'mender_spool', name: "Mender's Spool", slot: 'none', price: 0 },
  { id: 'foreman_slate', name: "The Foreman's Slate", slot: 'none', price: 0, text: [
    'A slate of the same smooth grey as the knockers, rows cut down it close in the old script.',
    'At the end of every row, a box. None is ticked.',
  ] },
  // O5's find (#464): in the cutters' foreman's shed, his own, off the ladder: a second hammer with a
  // plus beside the Tiefzeche's, for the forge's hammer has three hands, the knight's, the paladin's
  // and the cleric's.
  P(forgeHammer, 1, { id: 'cutters_hammer', name: "Cutter's Hammer +1" }),
];
