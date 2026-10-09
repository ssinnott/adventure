// Ashfall's items: Cinderport's armourer's step on the ladder (#542), the act's one, by 25, and the
// stone cure (#546). Made ahead of the area (ITEMS_AHEAD in content/index.ts), as the Kilns' were: the
// first box (#510) takes the table into its Area, the armourer (#512) sells the step and the chandler
// the cure. docs/areas/ashfall.md §8 and §9 have the sums.
import type { ItemDef } from '../../../game/items.ts';
import { W, A, MARTIAL, MAIL, NO_CASTER_HEAVY } from '../../items.ts';

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

export const ITEMS: readonly ItemDef[] = [...WARES, quickening];
