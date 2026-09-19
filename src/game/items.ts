// Item definitions. Content, not state: a character's inventory holds item ids and the tables here
// say what those ids do. Weapons roll `dice` d`sides` + `bonus`; armour adds `ac`.

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

const W = (id: string, name: string, price: number, dice: number, sides: number, extra: Partial<ItemDef> = {}): ItemDef =>
  ({ id, name, slot: 'weapon', price, dice, sides, bonus: 0, ...extra });
const A = (id: string, name: string, price: number, ac: number, extra: Partial<ItemDef> = {}): ItemDef =>
  ({ id, name, slot: 'armor', price, ac, ...extra });

const MARTIAL = ['knight', 'paladin', 'ranger'] as const;
const NO_CASTER_HEAVY = ['knight', 'paladin', 'ranger', 'thief'] as const;

export const ITEMS: Record<string, ItemDef> = Object.fromEntries(([
  W('club', 'Club', 5, 1, 6),
  W('dagger', 'Dagger', 12, 1, 4, { bonus: 1 }),
  W('staff', 'Quarterstaff', 8, 1, 6, { twoHanded: true }),
  W('shortsword', 'Short Sword', 40, 1, 8, { classes: [...MARTIAL, 'thief'] }),
  W('mace', 'Mace', 45, 1, 8, { bonus: 1, classes: [...MARTIAL, 'cleric'] }),
  W('longsword', 'Long Sword', 120, 1, 10, { bonus: 1, classes: MARTIAL }),
  W('axe', 'Hand Axe', 90, 1, 10, { classes: MARTIAL }),
  W('spear', 'Spear', 60, 1, 8, { twoHanded: true, classes: MARTIAL }),
  W('sling', 'Sling', 15, 1, 4, { ranged: true }),
  W('shortbow', 'Short Bow', 80, 1, 6, { ranged: true, twoHanded: true, classes: [...MARTIAL, 'thief'] }),
  W('longbow', 'Long Bow', 200, 1, 8, { bonus: 1, ranged: true, twoHanded: true, classes: ['ranger', 'knight'] }),
  A('robe', 'Robe', 10, 1),
  A('leather', 'Leather Armour', 60, 3, { classes: NO_CASTER_HEAVY }),
  A('scale', 'Scale Mail', 220, 5, { classes: MARTIAL }),
  A('chain', 'Chain Mail', 500, 7, { classes: MARTIAL }),
  { id: 'buckler', name: 'Buckler', slot: 'shield', price: 40, ac: 1, classes: [...MARTIAL, 'cleric'] },
  { id: 'shield', name: 'Kite Shield', slot: 'shield', price: 150, ac: 2, classes: MARTIAL },
  { id: 'potion_heal', name: 'Healing Draught', slot: 'none', price: 30, use: { heal: 15 } },
  { id: 'potion_sp', name: 'Blue Vial', slot: 'none', price: 45, use: { sp: 10 } },
  { id: 'antidote', name: 'Antidote', slot: 'none', price: 25, use: { cure: ['poisoned'] } },
  { id: 'rations', name: 'Rations', slot: 'none', price: 4, use: { food: 5 } },
  { id: 'torch', name: 'Torch', slot: 'none', price: 2 },
  { id: 'key_iron', name: 'Iron Key', slot: 'none', price: 0 },
  { id: 'survey_wand', name: 'Cracked Survey Wand', slot: 'none', price: 0 },
] satisfies ItemDef[]).map((i) => [i.id, i]));

export function item(id: string): ItemDef {
  const d = ITEMS[id];
  if (!d) throw new Error(`unknown item '${id}'`);
  return d;
}
