// The Foreland's monsters, band 1-5: the road, the woods and the cellar, then Brandy Hole's caves.
// `sprite` names the drawing (src/ui/sprites.ts); the numbers are the combat model's. A group on a
// map is a list of these ids, and any area's maps may place them.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings the Foreland's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'rat', 'slime', 'wolf', 'boar', 'spider', 'bandit', 'archer', 'cultist', 'skeleton', 'riftling',
  'warden', 'crab', 'smuggler', 'smuggler_bow', 'smuggler_captain', 'drowned', 'ghoul', 'acolyte',
  'rift_crawler', 'deacon', 'crow', 'wrecker', 'lampman', 'black_dog',
  'barrow_guard', 'barrow_captain',
  'chalk_wolf', 'tusker', 'barn_rat', 'footpad', 'hedge_archer',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  { id: 'rat', name: 'Giant Rat', plural: 'Giant Rats', sprite: 'rat', kind: 'beast', level: 1, hp: 4, ac: 11, attack: 1, dice: 1, sides: 3, bonus: 0, speed: 12, xp: 10, gold: [0, 2], tint: '#7a6a5a', size: 0.35, inflict: { cond: 'diseased', chance: 0.1 } },
  { id: 'slime', name: 'Cellar Slime', plural: 'Cellar Slimes', sprite: 'slime', kind: 'beast', level: 1, hp: 7, ac: 9, attack: 1, dice: 1, sides: 4, bonus: 0, speed: 6, xp: 14, gold: [0, 0], immune: ['asleep'], tint: '#6fbf6f', size: 0.4 },
  { id: 'wolf', name: 'Wolf', plural: 'Wolves', sprite: 'wolf', kind: 'beast', level: 2, hp: 9, ac: 12, attack: 2, dice: 1, sides: 6, bonus: 0, speed: 14, xp: 25, gold: [0, 0], tint: '#8a8a90', size: 0.55 },
  { id: 'boar', name: 'Wild Boar', plural: 'Wild Boars', sprite: 'boar', kind: 'beast', level: 3, hp: 14, ac: 12, attack: 3, dice: 1, sides: 8, bonus: 1, speed: 10, xp: 40, gold: [0, 0], tint: '#6a4a3a', size: 0.55 },
  { id: 'spider', name: 'Marsh Spider', plural: 'Marsh Spiders', sprite: 'spider', kind: 'beast', level: 2, hp: 8, ac: 13, attack: 2, dice: 1, sides: 4, bonus: 0, speed: 13, xp: 28, gold: [0, 0], tint: '#3a3a44', size: 0.45, inflict: { cond: 'poisoned', chance: 0.3 } },
  { id: 'bandit', name: 'Bandit', plural: 'Bandits', sprite: 'bandit', kind: 'person', level: 2, hp: 10, ac: 13, attack: 2, dice: 1, sides: 8, bonus: 0, speed: 10, xp: 32, gold: [3, 12], tint: '#8a6a4a', size: 0.9, drops: [{ item: 'dagger', chance: 0.1 }, { item: 'potion_heal', chance: 0.1 }] },
  { id: 'bandit_archer', name: 'Bandit Archer', plural: 'Bandit Archers', sprite: 'archer', kind: 'person', level: 3, hp: 8, ac: 12, attack: 3, dice: 1, sides: 6, bonus: 0, speed: 11, xp: 35, gold: [3, 10], ranged: true, missile: true, tint: '#6a7a4a', size: 0.9 },
  { id: 'cultist', name: 'Ashen Cultist', plural: 'Ashen Cultists', sprite: 'cultist', kind: 'person', level: 2, hp: 12, ac: 12, attack: 3, dice: 1, sides: 6, bonus: 2, speed: 10, xp: 50, gold: [5, 20], tint: '#5a4a5a', size: 0.9, drops: [{ item: 'potion_sp', chance: 0.15 }] },
  { id: 'skeleton', name: 'Skeleton', plural: 'Skeletons', sprite: 'skeleton', kind: 'dead', level: 4, hp: 13, ac: 13, attack: 3, dice: 1, sides: 8, bonus: 1, speed: 8, xp: 55, gold: [0, 6], tint: '#d8d0c0', size: 0.9 },
  { id: 'riftling', name: 'Riftling', plural: 'Riftlings', sprite: 'riftling', kind: 'rift', level: 6, hp: 11, ac: 14, attack: 3, dice: 2, sides: 4, bonus: 0, speed: 15, xp: 60, gold: [0, 0], tint: '#c05a3a', size: 0.7, inflict: { cond: 'paralysed', chance: 0.1 } },
  { id: 'rift_warden', name: 'Rift Warden', plural: 'Rift Wardens', sprite: 'warden', kind: 'rift', level: 4, hp: 40, ac: 15, attack: 5, dice: 2, sides: 6, bonus: 2, speed: 12, xp: 300, gold: [20, 40], tint: '#e07a3a', size: 1.0, immune: ['asleep'], drops: [{ item: 'survey_wand', chance: 1 }] },
  // ---- Brandy Hole: band 2-5, the caves between the cellar and the pass ----
  { id: 'shore_crab', name: 'Shore Crab', plural: 'Shore Crabs', sprite: 'crab', kind: 'beast', level: 2, hp: 16, ac: 15, attack: 3, dice: 1, sides: 6, bonus: 1, speed: 8, xp: 60, gold: [0, 0], immune: ['asleep'], tint: '#b0603a', size: 0.5 },
  { id: 'smuggler', name: 'Smuggler', plural: 'Smugglers', sprite: 'smuggler', kind: 'person', level: 3, hp: 18, ac: 13, attack: 4, dice: 1, sides: 8, bonus: 1, speed: 11, xp: 70, gold: [6, 18], tint: '#4a5a7a', size: 0.9, drops: [{ item: 'potion_heal', chance: 0.15 }, { item: 'shortsword', chance: 0.05 }] },
  { id: 'smuggler_bowman', name: 'Smuggler Bowman', plural: 'Smuggler Bowmen', sprite: 'smuggler_bow', kind: 'person', level: 3, hp: 14, ac: 13, attack: 4, dice: 1, sides: 6, bonus: 1, speed: 12, xp: 75, gold: [5, 15], ranged: true, missile: true, tint: '#3a6a6a', size: 0.9, drops: [{ item: 'shortbow', chance: 0.05 }] },
  { id: 'smuggler_captain', name: 'Smuggler Captain', plural: 'Smuggler Captains', sprite: 'smuggler_captain', kind: 'person', level: 4, hp: 45, ac: 14, attack: 5, dice: 1, sides: 10, bonus: 2, speed: 12, xp: 400, gold: [40, 80], tint: '#2a3a5a', size: 1.0, drops: [{ item: 'axe', chance: 0.5 }] },
  { id: 'drowned', name: 'Drowned Man', plural: 'Drowned Men', sprite: 'drowned', kind: 'dead', level: 3, hp: 20, ac: 13, attack: 4, dice: 1, sides: 8, bonus: 0, speed: 9, xp: 100, gold: [0, 8], tint: '#5a8a80', size: 0.85, inflict: { cond: 'diseased', chance: 0.15 } },
  { id: 'ghoul', name: 'Ghoul', plural: 'Ghouls', sprite: 'ghoul', kind: 'dead', level: 4, hp: 22, ac: 13, attack: 4, dice: 1, sides: 6, bonus: 2, speed: 9, xp: 95, gold: [0, 6], tint: '#8aa070', size: 0.9, inflict: { cond: 'paralysed', chance: 0.1 } },
  { id: 'ashen_acolyte', name: 'Ashen Acolyte', plural: 'Ashen Acolytes', sprite: 'acolyte', kind: 'person', level: 4, hp: 20, ac: 13, attack: 5, dice: 2, sides: 4, bonus: 1, speed: 11, xp: 110, gold: [8, 20], ranged: true, tint: '#7a4a4a', size: 0.9, drops: [{ item: 'potion_sp', chance: 0.2 }] },
  { id: 'rift_crawler', name: 'Rift Crawler', plural: 'Rift Crawlers', sprite: 'rift_crawler', kind: 'rift', level: 4, hp: 20, ac: 14, attack: 4, dice: 1, sides: 6, bonus: 1, speed: 14, xp: 115, gold: [0, 0], tint: '#c0503a', size: 0.55, inflict: { cond: 'poisoned', chance: 0.25 } },
  { id: 'ashen_deacon', name: 'Ashen Deacon', plural: 'Ashen Deacons', sprite: 'deacon', kind: 'person', level: 5, hp: 80, ac: 15, attack: 6, dice: 2, sides: 6, bonus: 2, speed: 12, xp: 1000, gold: [60, 120], tint: '#3a2a3a', size: 1.0, drops: [{ item: 'elixir', chance: 1 }] },
  { id: 'carrion_crow', name: 'Carrion Crow', plural: 'Carrion Crows', sprite: 'crow', kind: 'beast', look: 'Crows, too many to count, and all of them watching.', level: 2, hp: 6, ac: 11, attack: 1, dice: 1, sides: 4, bonus: 0, speed: 14, xp: 12, gold: [0, 0], ranged: true, tint: '#26242c', size: 0.3 },
  // ---- the Downs' own, on the Foreland's frames: statted on MONSTERS §4.4's line for their roles ----
  { id: 'chalk_wolf', name: 'Chalk Wolf', plural: 'Chalk Wolves', sprite: 'chalk_wolf', kind: 'beast', look: 'Pale as the chalk it runs on, and leaner than the Foreland\'s.', level: 4, hp: 24, ac: 13, attack: 4, dice: 1, sides: 6, bonus: 3, speed: 15, xp: 86, gold: [0, 0], tint: '#c8c2b0', size: 0.6 },
  { id: 'tusker', name: 'Tusker', plural: 'Tuskers', sprite: 'tusker', kind: 'beast', look: 'A boar grown old and huge on beech mast.', level: 4, hp: 67, ac: 12, attack: 5, dice: 3, sides: 5, bonus: 2, speed: 8, xp: 173, gold: [0, 0], tint: '#3e2e26', size: 0.75 },
  { id: 'barn_rat', name: 'Barn Rat', plural: 'Barn Rats', sprite: 'barn_rat', kind: 'beast', look: 'Rats, fat on someone\'s grain.', level: 3, hp: 7, ac: 12, attack: 2, dice: 1, sides: 7, bonus: 0, speed: 12, xp: 32, gold: [0, 0], tint: '#5c4c3c', size: 0.38, inflict: { cond: 'diseased', chance: 0.1 } },
  { id: 'footpad', name: 'Footpad', plural: 'Footpads', sprite: 'footpad', kind: 'person', look: 'A short blade, and a coat taken off someone better dressed.', level: 3, hp: 17, ac: 13, attack: 3, dice: 1, sides: 6, bonus: 2, speed: 11, xp: 64, gold: [4, 14], tint: '#6e5a3a', size: 0.9 },
  { id: 'hedge_archer', name: 'Hedge Archer', plural: 'Hedge Archers', sprite: 'hedge_archer', kind: 'person', look: 'A bow in the hedge, and the hedge moves.', level: 3, hp: 16, ac: 13, attack: 4, dice: 1, sides: 5, bonus: 1, speed: 12, xp: 64, gold: [3, 12], ranged: true, missile: true, tint: '#55663a', size: 0.9 },
  // ---- the Downs: unplaced until their issues place them ----
  // the wreckers (#47): Gullwick's beach and the Salt Road
  { id: 'wrecker', name: 'Wrecker', plural: 'Wreckers', sprite: 'wrecker', kind: 'person', level: 3, hp: 13, ac: 13, attack: 3, dice: 1, sides: 8, bonus: 0, speed: 10, xp: 60, gold: [4, 14], tint: '#8c7a36', size: 0.9 },
  { id: 'lampman', name: 'Lampman', plural: 'Lampmen', sprite: 'lampman', kind: 'person', level: 3, hp: 11, ac: 13, attack: 4, dice: 1, sides: 6, bonus: 0, speed: 11, xp: 65, gold: [3, 12], ranged: true, missile: true, tint: '#4e4638', size: 1.0 },
  // the Black Dog (#69): the chalk hills round the Berth, by night
  { id: 'black_dog', name: 'Black Dog', plural: 'Black Dogs', sprite: 'black_dog', kind: 'beast', look: 'A black dog the size of a calf, with eyes like coals.', level: 4, hp: 16, ac: 13, attack: 4, dice: 1, sides: 8, bonus: 0, speed: 15, xp: 80, gold: [0, 0], inflict: { cond: 'paralysed', chance: 0.1 }, tint: '#1c1a20', size: 0.75 },
  // the Queen's guard (#70): the Berth's passage, two by two
  { id: 'barrow_guard', name: 'Barrow Guard', plural: 'Barrow Guards', sprite: 'barrow_guard', kind: 'dead', level: 4, hp: 20, ac: 15, attack: 4, dice: 1, sides: 10, bonus: 0, speed: 8, xp: 110, gold: [0, 6], tint: '#7a8088', size: 0.95 },
  // the Queen's captain (#70): at her bier
  { id: 'barrow_captain', name: 'Barrow Captain', plural: 'Barrow Captains', sprite: 'barrow_captain', kind: 'dead', level: 5, hp: 60, ac: 15, attack: 6, dice: 2, sides: 6, bonus: 2, speed: 12, xp: 800, gold: [40, 80], tint: '#8a8e96', size: 1.1 },
];
