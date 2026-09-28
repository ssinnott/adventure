// The items no area owns: the class kits, the starting bag and the iron key, which src/game names by
// id, and the helpers the areas' item tables are written with. Content, not state: a character's
// inventory holds item ids and the tables say what those ids do. Weapons roll `dice` d`sides` +
// `bonus`; armour adds `ac`. `P` makes a +N copy of a weapon, armour or shield: its plus is counted in
// its `bonus` or `ac`, and a weapon's adds to to-hit as well.
import type { ItemDef } from '../game/items.ts';

export const W = (id: string, name: string, price: number, dice: number, sides: number, extra: Partial<ItemDef> = {}): ItemDef =>
  ({ id, name, slot: 'weapon', price, dice, sides, bonus: 0, ...extra });
export const A = (id: string, name: string, price: number, ac: number, extra: Partial<ItemDef> = {}): ItemDef =>
  ({ id, name, slot: 'armor', price, ac, ...extra });

/** Gold a point of plus adds to its base's price. */
export const PLUS_PRICE = 150;
/** A +n copy of `base` (`longsword+1`, "Long Sword +1"); `extra` names a find under an id of its own. */
export const P = (base: ItemDef, n: number, extra: Partial<ItemDef> = {}): ItemDef => {
  if (base.slot === 'none') throw new Error(`'${base.id}' is not gear and takes no plus`);
  if (base.plus) throw new Error(`'${base.id}' has a plus already`);
  if (!Number.isInteger(n) || n < 1) throw new Error(`a plus of ${n} on '${base.id}'`);
  const more = base.slot === 'weapon' ? { bonus: (base.bonus ?? 0) + n } : { ac: (base.ac ?? 0) + n };
  return { ...base, id: `${base.id}+${n}`, name: `${base.name} +${n}`, price: base.price + PLUS_PRICE * n, plus: n, ...more, ...extra };
};
/** One of the items below by id, for an area's table to give a plus. */
export const core = (id: string): ItemDef => {
  const d = ITEMS.find((i) => i.id === id);
  if (!d) throw new Error(`no core item '${id}'`);
  return d;
};

// Class ids as plain strings: content never imports the party model.
export const MARTIAL = ['knight', 'paladin', 'ranger', 'barbarian'] as const;
export const MAIL = ['knight', 'paladin', 'ranger'] as const;
export const NO_CASTER_HEAVY = ['knight', 'paladin', 'ranger', 'thief', 'barbarian', 'bard', 'druid'] as const;

export const ITEMS: readonly ItemDef[] = [
  W('club', 'Club', 5, 1, 6),
  W('dagger', 'Dagger', 12, 1, 4, { bonus: 1 }),
  W('staff', 'Quarterstaff', 8, 1, 6, { twoHanded: true }),
  W('shortsword', 'Short Sword', 40, 1, 8, { classes: [...MARTIAL, 'thief', 'bard'] }),
  W('mace', 'Mace', 45, 1, 8, { bonus: 1, classes: [...MARTIAL, 'cleric'] }),
  W('longsword', 'Long Sword', 120, 1, 10, { bonus: 1, classes: MARTIAL }),
  W('axe', 'Hand Axe', 90, 1, 10, { classes: MARTIAL }),
  W('sling', 'Sling', 15, 1, 4, { ranged: true }),
  W('shortbow', 'Short Bow', 80, 1, 6, { ranged: true, twoHanded: true, classes: [...MARTIAL, 'thief', 'bard'] }),
  A('robe', 'Robe', 10, 1),
  A('leather', 'Leather Armour', 60, 3, { classes: NO_CASTER_HEAVY }),
  A('scale', 'Scale Mail', 220, 5, { classes: MAIL }),
  { id: 'buckler', name: 'Buckler', slot: 'shield', price: 40, ac: 1, classes: [...MARTIAL, 'cleric'] },
  { id: 'potion_heal', name: 'Healing Draught', slot: 'none', price: 30, use: { heal: 15 } },
  { id: 'torch', name: 'Torch', slot: 'none', price: 2 },
  { id: 'key_iron', name: 'Iron Key', slot: 'none', price: 0 },
];
