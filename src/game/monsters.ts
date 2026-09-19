// Monster definitions for the slice. `sprite` names the vector drawing in ui/sprites.ts; the
// numbers are the combat model's. A group on a map is a list of these ids (see map.ts).

export type MonsterSprite = 'rat' | 'wolf' | 'bandit' | 'cultist' | 'skeleton' | 'slime' | 'riftling' | 'boar' | 'spider';

export interface MonsterDef {
  id: string;
  name: string;
  plural: string;
  sprite: MonsterSprite;
  hp: number;
  ac: number;
  /** To-hit bonus. */
  attack: number;
  dice: number; sides: number; bonus: number;
  speed: number;
  xp: number;
  /** Ranged monsters can hit the back row from the start. */
  ranged?: boolean;
  /** Chance per hit to inflict the condition. */
  inflict?: { cond: 'poisoned' | 'diseased' | 'asleep' | 'paralysed'; chance: number };
  /** Gold dropped per monster, as a range. */
  gold: [number, number];
  drops?: readonly { item: string; chance: number }[];
  /** Immune to sleep and such. */
  mindless?: boolean;
  /** Tint of the sprite. */
  tint: string;
  /** Sprite height relative to a wall (1 = a full cell). */
  size: number;
}

const M = (d: MonsterDef): [string, MonsterDef] => [d.id, d];

export const MONSTERS: Record<string, MonsterDef> = Object.fromEntries([
  M({ id: 'rat', name: 'Giant Rat', plural: 'Giant Rats', sprite: 'rat', hp: 4, ac: 11, attack: 1, dice: 1, sides: 3, bonus: 0, speed: 12, xp: 6, gold: [0, 2], tint: '#7a6a5a', size: 0.35, inflict: { cond: 'diseased', chance: 0.1 } }),
  M({ id: 'slime', name: 'Cellar Slime', plural: 'Cellar Slimes', sprite: 'slime', hp: 7, ac: 9, attack: 1, dice: 1, sides: 4, bonus: 0, speed: 6, xp: 8, gold: [0, 0], mindless: true, tint: '#6fbf6f', size: 0.4 }),
  M({ id: 'wolf', name: 'Wolf', plural: 'Wolves', sprite: 'wolf', hp: 9, ac: 12, attack: 2, dice: 1, sides: 6, bonus: 0, speed: 14, xp: 14, gold: [0, 0], tint: '#8a8a90', size: 0.55 }),
  M({ id: 'boar', name: 'Wild Boar', plural: 'Wild Boars', sprite: 'boar', hp: 14, ac: 12, attack: 3, dice: 1, sides: 8, bonus: 1, speed: 10, xp: 22, gold: [0, 0], tint: '#6a4a3a', size: 0.55 }),
  M({ id: 'spider', name: 'Marsh Spider', plural: 'Marsh Spiders', sprite: 'spider', hp: 8, ac: 13, attack: 2, dice: 1, sides: 4, bonus: 0, speed: 13, xp: 16, gold: [0, 0], tint: '#3a3a44', size: 0.45, inflict: { cond: 'poisoned', chance: 0.3 } }),
  M({ id: 'bandit', name: 'Bandit', plural: 'Bandits', sprite: 'bandit', hp: 10, ac: 13, attack: 2, dice: 1, sides: 8, bonus: 0, speed: 10, xp: 18, gold: [3, 12], tint: '#8a6a4a', size: 0.9, drops: [{ item: 'dagger', chance: 0.1 }, { item: 'potion_heal', chance: 0.1 }] }),
  M({ id: 'bandit_archer', name: 'Bandit Archer', plural: 'Bandit Archers', sprite: 'bandit', hp: 8, ac: 12, attack: 3, dice: 1, sides: 6, bonus: 0, speed: 11, xp: 20, gold: [3, 10], ranged: true, tint: '#6a7a4a', size: 0.9 }),
  M({ id: 'cultist', name: 'Ashen Cultist', plural: 'Ashen Cultists', sprite: 'cultist', hp: 12, ac: 12, attack: 3, dice: 1, sides: 6, bonus: 2, speed: 10, xp: 28, gold: [5, 20], tint: '#5a4a5a', size: 0.9, drops: [{ item: 'potion_sp', chance: 0.15 }] }),
  M({ id: 'skeleton', name: 'Skeleton', plural: 'Skeletons', sprite: 'skeleton', hp: 13, ac: 13, attack: 3, dice: 1, sides: 8, bonus: 1, speed: 8, xp: 30, gold: [0, 6], mindless: true, tint: '#d8d0c0', size: 0.9 }),
  M({ id: 'riftling', name: 'Riftling', plural: 'Riftlings', sprite: 'riftling', hp: 11, ac: 14, attack: 3, dice: 2, sides: 4, bonus: 0, speed: 15, xp: 34, gold: [0, 0], tint: '#c05a3a', size: 0.7, inflict: { cond: 'paralysed', chance: 0.1 } }),
  M({ id: 'rift_warden', name: 'Rift Warden', plural: 'Rift Wardens', sprite: 'riftling', hp: 40, ac: 15, attack: 5, dice: 2, sides: 6, bonus: 2, speed: 12, xp: 150, gold: [20, 40], tint: '#e07a3a', size: 1.0, mindless: true, drops: [{ item: 'survey_wand', chance: 1 }] }),
]);

export function monster(id: string): MonsterDef {
  const d = MONSTERS[id];
  if (!d) throw new Error(`unknown monster '${id}'`);
  return d;
}
