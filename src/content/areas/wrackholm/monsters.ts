// Wrackholm's monsters, band 12-14: the smugglers' isle, Kelp Hole and the Tide Ship at anchor.
// `sprite` names the drawing (src/ui/sprites.ts); the numbers are the combat model's. A group on a
// map is a list of these ids, and any area's maps may place them.
// Drawn ahead of the area's first map, so src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings Wrackholm's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'wrack_smuggler',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the cove and the Tide Ship's deck (#187, #188, #190), a soldier on MONSTERS §4.4's line at 12
  { id: 'wrack_smuggler', name: 'Wrack Smuggler', plural: 'Wrack Smugglers', sprite: 'wrack_smuggler', kind: 'person', look: 'A Compact knife in a Helmstow coat.', level: 12, hp: 100, ac: 17, attack: 8, dice: 2, sides: 6, bonus: 2, speed: 11, xp: 473, gold: [15, 40], drops: [{ item: 'dagger', chance: 0.1 }, { item: 'potion_heal', chance: 0.15 }], tint: '#7a3a32', size: 0.92 },
];
