// What an item is. Content, not state: a character's inventory holds item ids and the tables say
// what those ids do (src/content/items.ts, and each area's items.ts). Weapons roll `dice` d`sides` +
// `bonus`; armour adds `ac`. A +N item's plus is counted in its `bonus` or `ac` already; a weapon's
// adds to to-hit too (`attackBonus`). Past a plus, an item may raise a stat while it is borne
// (`statOf`) and a weapon's blows may carry an element (an added die, `ELEMENT_DIE`).
import { ITEMS } from '../content/index.ts';
import type { Feature } from './map.ts';
import type { Party, Stat } from './party.ts';
import type { Element } from './spells.ts';
import type { SkillId } from './skills.ts';
import { isDown } from './party.ts';

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
  /**
   * What sort of weapon it is, where a prestige's perk asks (DESIGN §5): a light weapon (a dagger, a
   * short sword, a sling), a staff, or a bow. A +N copy keeps its base's.
   */
  kind?: 'light' | 'staff' | 'bow';
  /** Armour class contribution. */
  ac?: number;
  /** A +N item's plus, counted in `bonus` or `ac` already; a weapon's also adds to to-hit (`attackBonus`). */
  plus?: number;
  /** Classes that may equip it; absent = anyone. */
  classes?: readonly string[];
  /** Consumable effect. */
  use?: { heal?: number; sp?: number; cure?: readonly string[]; food?: number };
  /** Elements its bearer takes half from: worn where it has a slot, carried in the pack where it has none. */
  resist?: readonly Element[];
  /**
   * Stats it raises while it is borne, by the rule of `resist` (`statOf`). Might, accuracy, speed and
   * personality are read in a fight; endurance, intellect and luck have no live effect (DESIGN §5). It
   * never touches `Character.stats`, so a save holds no raise.
   */
  stat?: Partial<Record<Stat, number>>;
  /** The element a weapon's blows carry: an added die of it on each blow that lands (`ELEMENT_DIE`, DESIGN §6). */
  element?: Element;
  /** Words to read: a letter, read from the pack. */
  text?: readonly string[];
  /**
   * A secondary skill it does the work of while anyone in the company carries it, as a member who has
   * the skill would (game/skills.ts): a scholar's copybook reads Kiln-script as a Linguist does, a
   * chart maps as a Cartographer does and a set of picks opens a lock as a Lockpick does (#857).
   */
  skill?: SkillId;
}

export function item(id: string): ItemDef {
  const d = ITEMS[id];
  if (!d) throw new Error(`unknown item '${id}'`);
  return d;
}

/** The added die of an elemental weapon's blow (`ItemDef.element`): 1d6 of its element, through `elementDamage`. */
export const ELEMENT_DIE = 6;

/**
 * A weapon's mean blow, its bonus counted and an element's die at its mean: the harness's measure of
 * a weapon, the ladder's and the pilot's (`better`, #719).
 */
export const hits = (d: ItemDef): number => ((d.dice ?? 1) * ((d.sides ?? 4) + 1)) / 2 + (d.bonus ?? 0) + (d.element ? (ELEMENT_DIE + 1) / 2 : 0);

type Shop = Extract<Feature, { kind: 'shop' }>;

/** What a shop charges for an item: its own price for it, or else the item's. */
export function priceIn(shop: Shop, id: string): number {
  return shop.prices?.[id] ?? item(id).price;
}

/**
 * What a shop pays the company for an item of this price: half, rounded down, so one priced at
 * nothing is never bought; two thirds, rounded down, with a Merchant standing (#857). The skill is
 * read off the members' lists inline, as `partyCan` reads its own (game/party.ts): this module sits
 * under the content index, which game/skills.ts would pull in before its maps are made. The skills
 * test holds it to `skilled`.
 */
export function sellPrice(party: Party, price: number): number {
  const merchant = party.members.some((m) => !isDown(m) && !!m.skills?.includes('merchant'));
  return merchant ? Math.floor((price * 2) / 3) : Math.floor(price / 2);
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
