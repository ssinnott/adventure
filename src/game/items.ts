// What an item is. Content, not state: a character's inventory holds item ids and the tables say
// what those ids do (src/content/items.ts, and each area's items.ts). Weapons roll `dice` d`sides` +
// `bonus`; armour adds `ac`. A +N item's plus is counted in its `bonus` or `ac` already; a weapon's
// adds to to-hit too (`attackBonus`). Past a plus, an item may raise a stat while it is borne
// (`statOf`) and a weapon's blows may carry an element (an added die, `ELEMENT_DIE`). An artifact is
// one marked so (#847): one in the world, never sold, past the ladder's top.
import { ITEMS } from '../content/index.ts';
import type { Feature } from './map.ts';
import type { Condition, Party, Stat } from './party.ts';
import type { Element } from './spells.ts';
import type { SkillId } from './skills.ts';
import { skilled } from './skills.ts';

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
  /**
   * An artifact (#847, DESIGN §9): one in the world, found in its lair and never sold. No shop stocks
   * one or takes one (`REFUSED`), and by this mark alone no rung of the ladder and no price window
   * holds one. Its one power is of the five kinds: a stat it raises (`stat`, by `ARTIFACT_RAISE` at
   * most) and the element its blows carry (`element`), each as on any item; a spell it casts so many
   * times a day (`casts`), regeneration (`regen`) and a ward against one condition (`ward`).
   */
  artifact?: true;
  /**
   * A spell its bearer casts from it in a fight, `times` a day (`ARTIFACT_CASTINGS` at most): their
   * turn and a charge, no spell points, rolled at their level held at `ARTIFACT_LEVEL`, unranked. The
   * charges spent are the company's (`Party.spent`) and come back whole at dawn (`passClock`).
   */
  casts?: { spell: string; times: number };
  /** Regeneration: its bearer mends a tenth of their most hit points each whole hour the clock passes (`passClock`), never in a fight. */
  regen?: true;
  /** A ward: its bearer never takes this condition (`immuneTo`), one of `WARDABLE`; one already taken stays. */
  ward?: Condition;
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

/** The most an artifact raises a stat by while it is borne (`ItemDef.stat`), where a found item raises by 3 (DESIGN §9). */
export const ARTIFACT_RAISE = 5;
/** The most castings a day an artifact's spell has (`ItemDef.casts`, DESIGN §9). */
export const ARTIFACT_CASTINGS = 3;
/** The level an artifact's spell rolls at, its bearer's held to it, with no rank, tier, trait or song (DESIGN §9). */
export const ARTIFACT_LEVEL = 10;
/** Regeneration's share of the most hit points, mended each whole hour (`ItemDef.regen`): a tenth, the trolls' (MONSTERS §3.3). */
export const REGEN_PART = 10;
/** The castings of an artifact's spell left until dawn (`ItemDef.casts`): its number less those the company has spent. */
export const chargesLeft = (party: Pick<Party, 'spent'>, id: string): number => Math.max(0, (item(id).casts?.times ?? 0) - (party.spent?.[id] ?? 0));
/** What a shop says to an artifact offered it (`ItemDef.artifact`): it takes none. */
export const REFUSED = '"Keep it. There is no price on a thing like that."';

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
 * nothing is never bought; two thirds, rounded down, with a Merchant standing or an item that does
 * a Merchant's work carried (`skilled`, #857).
 */
export function sellPrice(party: Party, price: number): number {
  return skilled(party, 'merchant') ? Math.floor((price * 2) / 3) : Math.floor(price / 2);
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
