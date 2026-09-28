// Thornmark's monsters, band 5-10: the forest, the barrow and the tower, the Grove Roots and the Cut
// Stone. `sprite` names the drawing (src/ui/sprites.ts); the numbers are the combat model's. A group
// on a map is a list of these ids, and any area's maps may place them.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings Thornmark's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'dire_wolf', 'thorn_spider', 'brigand', 'brigand_archer', 'zealot', 'adept', 'rift_hound',
  'bone_knight', 'wraith', 'riftling_elder', 'ogre', 'ashen_hand', 'cut_warden', 'owl',
  'bramble', 'rootwalker', 'heartwood',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  { id: 'dire_wolf', name: 'Dire Wolf', plural: 'Dire Wolves', sprite: 'dire_wolf', kind: 'beast', level: 6, hp: 24, ac: 14, attack: 5, dice: 1, sides: 10, bonus: 1, speed: 15, xp: 120, gold: [0, 0], tint: '#3a3a48', size: 0.75 },
  { id: 'thorn_spider', name: 'Thorn Spider', plural: 'Thorn Spiders', sprite: 'thorn_spider', kind: 'beast', level: 6, hp: 22, ac: 15, attack: 5, dice: 1, sides: 6, bonus: 1, speed: 14, xp: 130, gold: [0, 0], tint: '#3a5a2a', size: 0.65, inflict: { cond: 'poisoned', chance: 0.4 } },
  { id: 'brigand', name: 'Brigand', plural: 'Brigands', sprite: 'brigand', kind: 'person', level: 6, hp: 26, ac: 15, attack: 5, dice: 1, sides: 10, bonus: 1, speed: 11, xp: 140, gold: [8, 25], tint: '#4a5a3a', size: 0.92, drops: [{ item: 'longsword', chance: 0.05 }, { item: 'potion_heal', chance: 0.15 }] },
  { id: 'brigand_archer', name: 'Brigand Archer', plural: 'Brigand Archers', sprite: 'brigand_archer', kind: 'person', level: 7, hp: 20, ac: 14, attack: 6, dice: 1, sides: 8, bonus: 1, speed: 12, xp: 150, gold: [6, 20], ranged: true, missile: true, tint: '#5a6a3a', size: 0.9, drops: [{ item: 'crossbow', chance: 0.05 }] },
  { id: 'zealot', name: 'Ashen Zealot', plural: 'Ashen Zealots', sprite: 'zealot', kind: 'person', level: 7, hp: 30, ac: 14, attack: 6, dice: 1, sides: 8, bonus: 2, speed: 11, xp: 190, gold: [10, 30], tint: '#6a3a3a', size: 0.92, drops: [{ item: 'potion_sp', chance: 0.2 }] },
  { id: 'ashen_adept', name: 'Ashen Adept', plural: 'Ashen Adepts', sprite: 'adept', kind: 'person', level: 8, hp: 24, ac: 15, attack: 7, dice: 2, sides: 6, bonus: 0, speed: 12, xp: 240, gold: [15, 40], ranged: true, tint: '#8a4a2a', size: 0.95, drops: [{ item: 'potion_sp_great', chance: 0.1 }] },
  { id: 'rift_hound', name: 'Rift Hound', plural: 'Rift Hounds', sprite: 'rift_hound', kind: 'rift', level: 7, hp: 30, ac: 15, attack: 6, dice: 2, sides: 6, bonus: 0, speed: 17, xp: 250, gold: [0, 0], tint: '#c04a2a', size: 0.7, inflict: { cond: 'paralysed', chance: 0.1 } },
  { id: 'bone_knight', name: 'Bone Knight', plural: 'Bone Knights', sprite: 'bone_knight', kind: 'dead', level: 8, hp: 40, ac: 17, attack: 7, dice: 1, sides: 12, bonus: 2, speed: 9, xp: 280, gold: [0, 15], tint: '#9a9088', size: 1.0, drops: [{ item: 'warhammer', chance: 0.05 }] },
  { id: 'wraith', name: 'Wraith', plural: 'Wraiths', sprite: 'wraith', kind: 'dead', level: 9, hp: 32, ac: 17, attack: 7, dice: 2, sides: 6, bonus: 0, speed: 13, xp: 330, gold: [0, 0], tint: '#8aa0c0', size: 0.95, inflict: { cond: 'paralysed', chance: 0.2 } },
  { id: 'riftling_elder', name: 'Riftling Elder', plural: 'Riftling Elders', sprite: 'riftling_elder', kind: 'rift', level: 9, hp: 45, ac: 16, attack: 7, dice: 3, sides: 4, bonus: 2, speed: 15, xp: 440, gold: [0, 0], tint: '#e0603a', size: 0.9, inflict: { cond: 'paralysed', chance: 0.15 } },
  { id: 'ogre', name: 'Ogre', plural: 'Ogres', sprite: 'ogre', kind: 'person', level: 7, hp: 60, ac: 14, attack: 7, dice: 2, sides: 8, bonus: 2, speed: 8, xp: 520, gold: [15, 50], tint: '#7a8a5a', size: 1.25, drops: [{ item: 'battleaxe', chance: 0.05 }, { item: 'elixir', chance: 0.1 }] },
  // The Grove Stone's cutters and what their cut let through.
  { id: 'ashen_hand', name: 'Hand of Ash', plural: 'Hands of Ash', sprite: 'ashen_hand', kind: 'person', level: 10, hp: 110, ac: 17, attack: 9, dice: 2, sides: 8, bonus: 4, speed: 13, xp: 2000, gold: [100, 200], tint: '#2a1a2a', size: 1.1, drops: [{ item: 'ashen_chisel', chance: 1 }, { item: 'runed_robe+1', chance: 1 }] },
  { id: 'cut_warden', name: 'Warden of the Cut', plural: 'Wardens of the Cut', sprite: 'cut_warden', kind: 'rift', level: 10, hp: 140, ac: 18, attack: 9, dice: 3, sides: 6, bonus: 3, speed: 12, xp: 3000, gold: [50, 100], tint: '#8a8aa0', size: 1.15, immune: ['asleep'], drops: [{ item: 'meridian_journal', chance: 1 }] },
  // ---- the Deepthorn: unplaced until #49 places them ----
  { id: 'great_owl', name: 'Great Owl', plural: 'Great Owls', sprite: 'owl', kind: 'beast', look: 'Wings as wide as a cart, and not a sound.', level: 8, hp: 28, ac: 15, attack: 6, dice: 2, sides: 6, bonus: 0, speed: 15, xp: 250, gold: [0, 0], ranged: true, tint: '#8a6a40', size: 0.8 },
  { id: 'bramble', name: 'Bramble', plural: 'Brambles', sprite: 'bramble', kind: 'beast', look: 'A thicket that closes behind you.', level: 8, hp: 28, ac: 15, attack: 6, dice: 1, sides: 8, bonus: 0, speed: 6, xp: 250, gold: [0, 0], tint: '#4c4a30', size: 0.9, inflict: { cond: 'paralysed', chance: 0.3 } },
  { id: 'rootwalker', name: 'Rootwalker', plural: 'Rootwalkers', sprite: 'rootwalker', kind: 'beast', look: 'A stump walking on its roots, its bark like plate.', level: 9, hp: 39, ac: 18, attack: 6, dice: 2, sides: 6, bonus: 1, speed: 8, xp: 320, gold: [0, 0], tint: '#6a5842', size: 1.0 },
  { id: 'heartwood', name: 'Heartwood', plural: 'Heartwoods', sprite: 'heartwood', kind: 'beast', look: 'An oak that has decided to move.', level: 10, hp: 65, ac: 15, attack: 8, dice: 2, sides: 8, bonus: 3, speed: 8, xp: 700, gold: [0, 0], tint: '#5e4c38', size: 1.8 },
];
