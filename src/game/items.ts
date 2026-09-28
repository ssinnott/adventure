// What an item is. Content, not state: a character's inventory holds item ids and the tables say
// what those ids do (src/content/items.ts, and each area's items.ts). Weapons roll `dice` d`sides` +
// `bonus`; armour adds `ac`.
import { ITEMS } from '../content/index.ts';
import type { Feature } from './map.ts';
import type { Party } from './party.ts';

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

type Shop = Extract<Feature, { kind: 'shop' }>;

/** What a shop charges for an item: its own price for it, or else the item's. */
export function priceIn(shop: Shop, id: string): number {
  return shop.prices?.[id] ?? item(id).price;
}

/** Buy an item from a shop: null when the party is short of gold; food goes to the stores, the rest to the bag. */
export function buy(party: Party, shop: Shop, id: string): ItemDef | null {
  const d = item(id), price = priceIn(shop, id);
  if (party.gold < price) return null;
  party.gold -= price;
  if (d.use?.food) party.food += d.use.food;
  else party.bag.push(id);
  return d;
}
