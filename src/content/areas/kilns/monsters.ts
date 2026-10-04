// The Kilns' monsters, band 16-18: the Iron Fells, the Kilns' heart and Kilnmouth. `sprite` names
// the drawing (src/ui/sprites.ts); the numbers are the combat model's. A group on a map is a list of
// these ids, and any area's maps may place them.
// Drawn ahead of the area's first map, so src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings the Kilns' monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'fire_beetle',
  'slagling', 'slag_elder', 'anvil_warden',
  'rock_worm',
  'anvil_guard',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the spoil heaps, the forges and the kilns (#457, #458, #461, #463, #467, #468), armoured on MONSTERS §4.4's line at 16; fire does not touch it
  { id: 'fire_beetle', name: 'Fire Beetle', plural: 'Fire Beetles', sprite: 'fire_beetle', kind: 'beast', look: 'A beetle with a coal in its back.', level: 16, hp: 249, ac: 21, attack: 10, dice: 3, sides: 7, bonus: 6, speed: 8, xp: 844, gold: [0, 0], immune: ['fire'], tint: '#2e2622', size: 0.72 },
  // the Anvil Stone's Rift and its tear (#458, #464, #465), a skirmisher on MONSTERS §4.4's line at 16: it paralyses, at 0.1 a hit; cold bites the slag, and fire does half
  { id: 'slagling', name: 'Slagling', plural: 'Slaglings', sprite: 'slagling', kind: 'rift', look: 'Slag, walking, with a red iron heart.', level: 16, hp: 179, ac: 19, attack: 10, dice: 3, sides: 8, bonus: 2, speed: 15, xp: 633, gold: [0, 0], inflict: { cond: 'paralysed', chance: 0.1 }, weak: ['cold'], resist: ['fire'], tint: '#3e3633', size: 0.74 },
  // the old workings and the surface's adits and cuts (#457, #460, #461, #462), a brute on MONSTERS §4.4's line at 17
  { id: 'rock_worm', name: 'Rock Worm', plural: 'Rock Worms', sprite: 'rock_worm', kind: 'beast', look: 'This tunnel was not dug by dwarves.', level: 17, hp: 422, ac: 18, attack: 11, dice: 4, sides: 8, bonus: 5, speed: 8, xp: 1347, gold: [0, 0], tint: '#6a6056', size: 1.6 },
  // the Anvil Stone's approach, only after the Stone is taken (#464), armoured on MONSTERS §4.4's line at 17: the dwarves, crossed
  { id: 'anvil_guard', name: 'Anvil Guard', plural: 'Anvil Guards', sprite: 'anvil_guard', kind: 'person', look: 'Short, broad, and in the thane\'s iron.', level: 17, hp: 263, ac: 22, attack: 10, dice: 3, sides: 7, bonus: 7, speed: 8, xp: 898, gold: [30, 70], tint: '#4a4c54', size: 0.8 },
  // the Anvil Stone's Rift (#465), an elite on MONSTERS §4.4's line at 18: it paralyses, at 0.15 a hit; cold bites the slag, and fire does half
  { id: 'slag_elder', name: 'Slag Elder', plural: 'Slag Elders', sprite: 'slag_elder', kind: 'rift', look: 'Iron runs off it like sweat.', level: 18, hp: 383, ac: 21, attack: 12, dice: 4, sides: 8, bonus: 3, speed: 15, xp: 1427, gold: [0, 0], inflict: { cond: 'paralysed', chance: 0.15 }, weak: ['cold'], resist: ['fire'], tint: '#4a3a33', size: 0.95 },
  // the Anvil Stone's Rift, standing up out of the cut (#465), the area's boss at 18 on MONSTERS §4.4's boss line, for #465's gate to tune; cold bites it, and fire does half
  { id: 'anvil_warden', name: 'Warden of the Anvil', plural: 'Wardens of the Anvil', sprite: 'anvil_warden', kind: 'rift', look: 'The Stone\'s heat, standing up out of the cut.', level: 18, hp: 961, ac: 22, attack: 13, dice: 17, sides: 8, bonus: 20, speed: 13, xp: 11413, gold: [0, 0], immune: ['asleep'], weak: ['cold'], resist: ['fire'], tint: '#3a2e2a', size: 1.45 },
];
