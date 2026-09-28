// What an item is. Content, not state: a character's inventory holds item ids and the tables say
// what those ids do (src/content/items.ts, and each area's items.ts). Weapons roll `dice` d`sides` +
// `bonus`; armour adds `ac`. A +N item's plus is counted in its `bonus` or `ac` already; a weapon's
// adds to to-hit too (`attackBonus`).
import { ITEMS } from '../content/index.ts';

export type ItemSlot = 'weapon' | 'armor' | 'shield' | 'none';

export interface ItemDef {
  id: string;
  name: string;
  slot: ItemSlot;
  price: number;
  /** Damage dice for weapons. */
  dice?: number;
  sides?: number;
  bonus?: number;
  /** Two-handed weapons cannot be used with a shield. */
  twoHanded?: boolean;
  /** Ranged weapons may attack from the back row. */
  ranged?: boolean;
  /** Armour class contribution. */
  ac?: number;
  /** A +N item's plus, counted in `bonus` or `ac` already; a weapon's also adds to to-hit (`attackBonus`). */
  plus?: number;
  /** Classes that may equip it; absent = anyone. */
  classes?: readonly string[];
  /** Consumable effect. */
  use?: { heal?: number; sp?: number; cure?: readonly string[]; food?: number };
}

export function item(id: string): ItemDef {
  const d = ITEMS[id];
  if (!d) throw new Error(`unknown item '${id}'`);
  return d;
}
