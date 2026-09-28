// The Foreland's items: what Helmstow sells past the kits, what Brandy Hole's chests hold, and the
// wand and the ledger Vask and Hale want.
import type { ItemDef } from '../../../game/items.ts';
import { W, A, MARTIAL, MAIL } from '../../items.ts';

export const ITEMS: readonly ItemDef[] = [
  W('spear', 'Spear', 60, 1, 8, { twoHanded: true, classes: [...MARTIAL, 'monk', 'druid'] }),
  W('longbow', 'Long Bow', 200, 1, 8, { bonus: 1, ranged: true, twoHanded: true, classes: ['ranger', 'knight'] }),
  A('chain', 'Chain Mail', 500, 7, { classes: MAIL }),
  { id: 'shield', name: 'Kite Shield', slot: 'shield', price: 150, ac: 2, classes: MAIL },
  { id: 'elixir', name: 'Elixir', slot: 'none', price: 90, use: { heal: 40 } },
  { id: 'potion_sp', name: 'Blue Vial', slot: 'none', price: 45, use: { sp: 10 } },
  { id: 'antidote', name: 'Antidote', slot: 'none', price: 25, use: { cure: ['poisoned'] } },
  { id: 'rations', name: 'Rations', slot: 'none', price: 4, use: { food: 5 } },
  { id: 'survey_wand', name: 'Cracked Survey Wand', slot: 'none', price: 0 },
  { id: 'greywater_ledger', name: 'Cargo Ledger', slot: 'none', price: 0 },
];
