// The Kilns' monsters, band 16-18: the Iron Fells, the Kilns' heart and Kilnmouth. `sprite` names the
// drawing (src/ui/sprites.ts); the numbers are the combat model's. A group on a map is a list of
// these ids, and any area's maps may place them.
// Drawn ahead of the area's first map, so src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings the Kilns' monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'salamander', 'great_salamander',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the tubes and the spoil heaps (#458, #463, #466), a skirmisher on MONSTERS §4.4's line at 16: fire does not touch it, and cold bites
  { id: 'salamander', name: 'Salamander', plural: 'Salamanders', sprite: 'salamander', kind: 'beast', look: 'A lizard with the fire showing through its skin.', level: 16, hp: 179, ac: 19, attack: 10, dice: 3, sides: 8, bonus: 2, speed: 15, xp: 633, gold: [0, 0], immune: ['fire'], weak: ['cold'], tint: '#3a2c28', size: 0.68 },
  // the tubes' deepest chamber (#466), the tubes' boss at 18, on MONSTERS §4.4's boss line: fire does not touch it, and
  // cold bites, as its kin's; it shrugs off sleep, as the road's beasts that are bosses do
  { id: 'great_salamander', name: 'Great Salamander', plural: 'Great Salamanders', sprite: 'great_salamander', kind: 'beast', look: 'The fire in the rock, with a head.', level: 18, hp: 961, ac: 22, attack: 13, dice: 17, sides: 8, bonus: 20, speed: 13, xp: 11413, gold: [0, 0], immune: ['asleep', 'fire'], weak: ['cold'], tint: '#4a423c', size: 1.6 },
];
