// Monster definitions for the slice. `sprite` names the vector drawing in ui/sprites.ts; the
// numbers are the combat model's. A group on a map is a list of these ids (see map.ts).

/** One kind per distinct drawing; kinds that share a family module share a frame but not a look. */
export type MonsterSprite =
  | 'rat' | 'slime' | 'boar' | 'ogre' | 'wraith'
  | 'wolf' | 'dire_wolf' | 'rift_hound'
  | 'spider' | 'thorn_spider'
  | 'bandit' | 'archer' | 'brigand' | 'brigand_archer'
  | 'smuggler' | 'smuggler_bow' | 'smuggler_captain'
  | 'cultist' | 'zealot' | 'adept' | 'ashen_hand'
  | 'skeleton' | 'bone_knight'
  | 'riftling' | 'riftling_elder' | 'warden' | 'cut_warden';

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
  M({ id: 'rat', name: 'Giant Rat', plural: 'Giant Rats', sprite: 'rat', hp: 4, ac: 11, attack: 1, dice: 1, sides: 3, bonus: 0, speed: 12, xp: 10, gold: [0, 2], tint: '#7a6a5a', size: 0.35, inflict: { cond: 'diseased', chance: 0.1 } }),
  M({ id: 'slime', name: 'Cellar Slime', plural: 'Cellar Slimes', sprite: 'slime', hp: 7, ac: 9, attack: 1, dice: 1, sides: 4, bonus: 0, speed: 6, xp: 14, gold: [0, 0], mindless: true, tint: '#6fbf6f', size: 0.4 }),
  M({ id: 'wolf', name: 'Wolf', plural: 'Wolves', sprite: 'wolf', hp: 9, ac: 12, attack: 2, dice: 1, sides: 6, bonus: 0, speed: 14, xp: 25, gold: [0, 0], tint: '#8a8a90', size: 0.55 }),
  M({ id: 'boar', name: 'Wild Boar', plural: 'Wild Boars', sprite: 'boar', hp: 14, ac: 12, attack: 3, dice: 1, sides: 8, bonus: 1, speed: 10, xp: 40, gold: [0, 0], tint: '#6a4a3a', size: 0.55 }),
  M({ id: 'spider', name: 'Marsh Spider', plural: 'Marsh Spiders', sprite: 'spider', hp: 8, ac: 13, attack: 2, dice: 1, sides: 4, bonus: 0, speed: 13, xp: 28, gold: [0, 0], tint: '#3a3a44', size: 0.45, inflict: { cond: 'poisoned', chance: 0.3 } }),
  M({ id: 'bandit', name: 'Bandit', plural: 'Bandits', sprite: 'bandit', hp: 10, ac: 13, attack: 2, dice: 1, sides: 8, bonus: 0, speed: 10, xp: 32, gold: [3, 12], tint: '#8a6a4a', size: 0.9, drops: [{ item: 'dagger', chance: 0.1 }, { item: 'potion_heal', chance: 0.1 }] }),
  M({ id: 'bandit_archer', name: 'Bandit Archer', plural: 'Bandit Archers', sprite: 'archer', hp: 8, ac: 12, attack: 3, dice: 1, sides: 6, bonus: 0, speed: 11, xp: 35, gold: [3, 10], ranged: true, tint: '#6a7a4a', size: 0.9 }),
  M({ id: 'cultist', name: 'Ashen Cultist', plural: 'Ashen Cultists', sprite: 'cultist', hp: 12, ac: 12, attack: 3, dice: 1, sides: 6, bonus: 2, speed: 10, xp: 50, gold: [5, 20], tint: '#5a4a5a', size: 0.9, drops: [{ item: 'potion_sp', chance: 0.15 }] }),
  M({ id: 'skeleton', name: 'Skeleton', plural: 'Skeletons', sprite: 'skeleton', hp: 13, ac: 13, attack: 3, dice: 1, sides: 8, bonus: 1, speed: 8, xp: 55, gold: [0, 6], mindless: true, tint: '#d8d0c0', size: 0.9 }),
  M({ id: 'riftling', name: 'Riftling', plural: 'Riftlings', sprite: 'riftling', hp: 11, ac: 14, attack: 3, dice: 2, sides: 4, bonus: 0, speed: 15, xp: 60, gold: [0, 0], tint: '#c05a3a', size: 0.7, inflict: { cond: 'paralysed', chance: 0.1 } }),
  M({ id: 'rift_warden', name: 'Rift Warden', plural: 'Rift Wardens', sprite: 'warden', hp: 40, ac: 15, attack: 5, dice: 2, sides: 6, bonus: 2, speed: 12, xp: 300, gold: [20, 40], tint: '#e07a3a', size: 1.0, mindless: true, drops: [{ item: 'survey_wand', chance: 1 }] }),
  // ---- Greywater: band 2-5, the caves between the cellar and the pass ----
  M({ id: 'shore_crab', name: 'Shore Crab', plural: 'Shore Crabs', sprite: 'spider', hp: 16, ac: 15, attack: 3, dice: 1, sides: 6, bonus: 1, speed: 8, xp: 60, gold: [0, 0], mindless: true, tint: '#b0603a', size: 0.5 }),
  M({ id: 'smuggler', name: 'Smuggler', plural: 'Smugglers', sprite: 'smuggler', hp: 18, ac: 13, attack: 4, dice: 1, sides: 8, bonus: 1, speed: 11, xp: 70, gold: [6, 18], tint: '#4a5a7a', size: 0.9, drops: [{ item: 'potion_heal', chance: 0.15 }, { item: 'shortsword', chance: 0.05 }] }),
  M({ id: 'smuggler_bowman', name: 'Smuggler Bowman', plural: 'Smuggler Bowmen', sprite: 'smuggler_bow', hp: 14, ac: 13, attack: 4, dice: 1, sides: 6, bonus: 1, speed: 12, xp: 75, gold: [5, 15], ranged: true, tint: '#3a6a6a', size: 0.9, drops: [{ item: 'shortbow', chance: 0.05 }] }),
  M({ id: 'smuggler_captain', name: 'Smuggler Captain', plural: 'Smuggler Captains', sprite: 'smuggler_captain', hp: 45, ac: 14, attack: 5, dice: 1, sides: 10, bonus: 2, speed: 12, xp: 400, gold: [40, 80], tint: '#2a3a5a', size: 1.0, drops: [{ item: 'axe', chance: 0.5 }] }),
  M({ id: 'drowned', name: 'Drowned Man', plural: 'Drowned Men', sprite: 'wraith', hp: 20, ac: 13, attack: 4, dice: 1, sides: 8, bonus: 0, speed: 9, xp: 100, gold: [0, 8], mindless: true, tint: '#5a8a80', size: 0.85, inflict: { cond: 'diseased', chance: 0.15 } }),
  M({ id: 'ghoul', name: 'Ghoul', plural: 'Ghouls', sprite: 'skeleton', hp: 22, ac: 13, attack: 4, dice: 1, sides: 6, bonus: 2, speed: 9, xp: 95, gold: [0, 6], mindless: true, tint: '#8aa070', size: 0.9, inflict: { cond: 'paralysed', chance: 0.1 } }),
  M({ id: 'ashen_acolyte', name: 'Ashen Acolyte', plural: 'Ashen Acolytes', sprite: 'cultist', hp: 20, ac: 13, attack: 5, dice: 2, sides: 4, bonus: 1, speed: 11, xp: 110, gold: [8, 20], ranged: true, tint: '#7a4a4a', size: 0.9, drops: [{ item: 'potion_sp', chance: 0.2 }] }),
  M({ id: 'rift_crawler', name: 'Rift Crawler', plural: 'Rift Crawlers', sprite: 'spider', hp: 20, ac: 14, attack: 4, dice: 1, sides: 6, bonus: 1, speed: 14, xp: 115, gold: [0, 0], tint: '#c0503a', size: 0.55, inflict: { cond: 'poisoned', chance: 0.25 } }),
  M({ id: 'ashen_deacon', name: 'Ashen Deacon', plural: 'Ashen Deacons', sprite: 'cultist', hp: 80, ac: 15, attack: 6, dice: 2, sides: 6, bonus: 2, speed: 12, xp: 1000, gold: [60, 120], tint: '#3a2a3a', size: 1.0, drops: [{ item: 'elixir', chance: 1 }] }),
  // ---- Thornmark: band 5-10 ----
  M({ id: 'dire_wolf', name: 'Dire Wolf', plural: 'Dire Wolves', sprite: 'dire_wolf', hp: 24, ac: 14, attack: 5, dice: 1, sides: 10, bonus: 1, speed: 15, xp: 120, gold: [0, 0], tint: '#3a3a48', size: 0.75 }),
  M({ id: 'thorn_spider', name: 'Thorn Spider', plural: 'Thorn Spiders', sprite: 'thorn_spider', hp: 22, ac: 15, attack: 5, dice: 1, sides: 6, bonus: 1, speed: 14, xp: 130, gold: [0, 0], tint: '#3a5a2a', size: 0.65, inflict: { cond: 'poisoned', chance: 0.4 } }),
  M({ id: 'brigand', name: 'Brigand', plural: 'Brigands', sprite: 'brigand', hp: 26, ac: 15, attack: 5, dice: 1, sides: 10, bonus: 1, speed: 11, xp: 140, gold: [8, 25], tint: '#4a5a3a', size: 0.92, drops: [{ item: 'longsword', chance: 0.05 }, { item: 'potion_heal', chance: 0.15 }] }),
  M({ id: 'brigand_archer', name: 'Brigand Archer', plural: 'Brigand Archers', sprite: 'brigand_archer', hp: 20, ac: 14, attack: 6, dice: 1, sides: 8, bonus: 1, speed: 12, xp: 150, gold: [6, 20], ranged: true, tint: '#5a6a3a', size: 0.9, drops: [{ item: 'crossbow', chance: 0.05 }] }),
  M({ id: 'zealot', name: 'Ashen Zealot', plural: 'Ashen Zealots', sprite: 'zealot', hp: 30, ac: 14, attack: 6, dice: 1, sides: 8, bonus: 2, speed: 11, xp: 190, gold: [10, 30], tint: '#6a3a3a', size: 0.92, drops: [{ item: 'potion_sp', chance: 0.2 }] }),
  M({ id: 'ashen_adept', name: 'Ashen Adept', plural: 'Ashen Adepts', sprite: 'adept', hp: 24, ac: 15, attack: 7, dice: 2, sides: 6, bonus: 0, speed: 12, xp: 240, gold: [15, 40], ranged: true, tint: '#8a4a2a', size: 0.95, drops: [{ item: 'potion_sp_great', chance: 0.1 }] }),
  M({ id: 'rift_hound', name: 'Rift Hound', plural: 'Rift Hounds', sprite: 'rift_hound', hp: 30, ac: 15, attack: 6, dice: 2, sides: 6, bonus: 0, speed: 17, xp: 250, gold: [0, 0], tint: '#c04a2a', size: 0.7, inflict: { cond: 'paralysed', chance: 0.1 } }),
  M({ id: 'bone_knight', name: 'Bone Knight', plural: 'Bone Knights', sprite: 'bone_knight', hp: 40, ac: 17, attack: 7, dice: 1, sides: 12, bonus: 2, speed: 9, xp: 280, gold: [0, 15], mindless: true, tint: '#9a9088', size: 1.0, drops: [{ item: 'warhammer', chance: 0.05 }] }),
  M({ id: 'wraith', name: 'Wraith', plural: 'Wraiths', sprite: 'wraith', hp: 32, ac: 17, attack: 7, dice: 2, sides: 6, bonus: 0, speed: 13, xp: 330, gold: [0, 0], mindless: true, tint: '#8aa0c0', size: 0.95, inflict: { cond: 'paralysed', chance: 0.2 } }),
  M({ id: 'riftling_elder', name: 'Riftling Elder', plural: 'Riftling Elders', sprite: 'riftling_elder', hp: 45, ac: 16, attack: 7, dice: 3, sides: 4, bonus: 2, speed: 15, xp: 440, gold: [0, 0], tint: '#e0603a', size: 0.9, inflict: { cond: 'paralysed', chance: 0.15 } }),
  M({ id: 'ogre', name: 'Ogre', plural: 'Ogres', sprite: 'ogre', hp: 60, ac: 14, attack: 7, dice: 2, sides: 8, bonus: 2, speed: 8, xp: 520, gold: [15, 50], tint: '#7a8a5a', size: 1.25, drops: [{ item: 'battleaxe', chance: 0.05 }, { item: 'elixir', chance: 0.1 }] }),
  // The Grove Stone's cutters and what their cut let through.
  M({ id: 'ashen_hand', name: 'Hand of Ash', plural: 'Hands of Ash', sprite: 'ashen_hand', hp: 110, ac: 17, attack: 9, dice: 2, sides: 8, bonus: 4, speed: 13, xp: 2000, gold: [100, 200], tint: '#2a1a2a', size: 1.1, drops: [{ item: 'ashen_chisel', chance: 1 }, { item: 'runed_robe', chance: 1 }] }),
  M({ id: 'cut_warden', name: 'Warden of the Cut', plural: 'Wardens of the Cut', sprite: 'cut_warden', hp: 140, ac: 18, attack: 9, dice: 3, sides: 6, bonus: 3, speed: 12, xp: 3000, gold: [50, 100], tint: '#8a8aa0', size: 1.15, mindless: true, drops: [{ item: 'meridian_journal', chance: 1 }] }),
]);

export function monster(id: string): MonsterDef {
  const d = MONSTERS[id];
  if (!d) throw new Error(`unknown monster '${id}'`);
  return d;
}
