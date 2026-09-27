// Thornmark's items: the tier a band 5-10 party buys in the Armoury and finds, and the chisel and
// the journal the Cut Stone gives up.
import type { ItemDef } from '../../../game/items.ts';
import { W, A, MARTIAL, MAIL, NO_CASTER_HEAVY } from '../../items.ts';

export const ITEMS: readonly ItemDef[] = [
  W('warhammer', 'War Hammer', 300, 1, 10, { bonus: 2, classes: [...MARTIAL, 'cleric'] }),
  W('battleaxe', 'Battle Axe', 380, 1, 12, { bonus: 1, twoHanded: true, classes: MARTIAL }),
  W('greatsword', 'Great Sword', 450, 2, 6, { bonus: 1, twoHanded: true, classes: MARTIAL }),
  W('crossbow', 'Crossbow', 260, 1, 10, { ranged: true, twoHanded: true, classes: [...MARTIAL, 'thief'] }),
  W('elfbow', 'Thornmark Bow', 420, 1, 10, { bonus: 2, ranged: true, twoHanded: true, classes: ['ranger'] }),
  W('rune_dagger', 'Rune Dagger', 320, 1, 6, { bonus: 3 }),
  W('grove_staff', 'Grove Staff', 280, 1, 8, { bonus: 2, twoHanded: true }),
  A('runed_robe', 'Runed Robe', 350, 3),
  A('brigandine', 'Brigandine', 400, 5, { classes: NO_CASTER_HEAVY }),
  A('plate', 'Plate Mail', 1200, 9, { classes: ['knight', 'paladin'] }),
  { id: 'tower_shield', name: 'Tower Shield', slot: 'shield', price: 400, ac: 3, classes: MAIL },
  { id: 'potion_sp_great', name: 'Sapphire Vial', slot: 'none', price: 120, use: { sp: 25 } },
  { id: 'lantern_oil', name: 'Lantern Oil', slot: 'none', price: 40, use: { cure: ['poisoned', 'diseased', 'paralysed'] } },
  { id: 'ashen_chisel', name: 'Underdeep Chisel', slot: 'none', price: 0 },
  { id: 'meridian_journal', name: 'Meridian Journal, vol. I', slot: 'none', price: 0 },
];
