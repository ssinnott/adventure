// Thornmark's items: the tier a band 5-10 party buys in the Armoury, the same with a plus that it
// finds, and the chisel and the journal the Cut Stone gives up.
import type { ItemDef } from '../../../game/items.ts';
import { W, A, P, MARTIAL, MAIL, NO_CASTER_HEAVY } from '../../items.ts';

const warhammer = W('warhammer', 'War Hammer', 300, 1, 10, { bonus: 2, classes: [...MARTIAL, 'cleric'] });
const greatsword = W('greatsword', 'Great Sword', 450, 2, 6, { bonus: 1, twoHanded: true, classes: MARTIAL });
const elfbow = W('elfbow', 'Thornmark Bow', 420, 1, 10, { bonus: 2, ranged: true, twoHanded: true, classes: ['ranger'] });
const runeDagger = W('rune_dagger', 'Rune Dagger', 320, 1, 6, { bonus: 3 });
const groveStaff = W('grove_staff', 'Grove Staff', 280, 1, 8, { bonus: 2, twoHanded: true });
const runedRobe = A('runed_robe', 'Runed Robe', 350, 3);
const brigandine = A('brigandine', 'Brigandine', 400, 5, { classes: NO_CASTER_HEAVY });

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
  { id: 'tower_shield', name: 'Tower Shield', slot: 'shield', price: 400, ac: 3, classes: MAIL },
  // Found, not sold: the chests' and the Hand of Ash's. No plate with a plus: it would pass 1,200.
  P(warhammer, 1),
  P(greatsword, 1),
  P(elfbow, 1),
  P(runeDagger, 1),
  P(groveStaff, 1),
  P(runedRobe, 1),
  P(brigandine, 1),
  P(brigandine, 2),
  { id: 'potion_sp_great', name: 'Sapphire Vial', slot: 'none', price: 120, use: { sp: 25 } },
  { id: 'lantern_oil', name: 'Lantern Oil', slot: 'none', price: 40, use: { cure: ['poisoned', 'diseased', 'paralysed'] } },
  { id: 'ashen_chisel', name: 'Underdeep Chisel', slot: 'none', price: 0 },
  { id: 'meridian_journal', name: 'Meridian Journal, vol. I', slot: 'none', price: 0 },
];
