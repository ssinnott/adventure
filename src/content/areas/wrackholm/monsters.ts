// Wrackholm's monsters, band 12-14: the smugglers' isle, Kelp Hole and the Tide Ship at anchor.
// `sprite` names the drawing (src/ui/sprites.ts); the numbers are the combat model's. A group on a
// map is a list of these ids, and any area's maps may place them.
// Drawn ahead of the area's first map, so src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings Wrackholm's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'tide_elder',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the Tide Ship's forward hold (#190), an elite on MONSTERS §4.4's line at 13: it paralyses
  { id: 'tide_elder', name: 'Tide Elder', plural: 'Tide Elders', sprite: 'tide_elder', kind: 'rift', look: 'A shard of the sea, stood up.', level: 13, hp: 131, ac: 18, attack: 9, dice: 3, sides: 8, bonus: 3, speed: 15, xp: 1027, gold: [0, 0], tint: '#2e8a78', size: 0.95, inflict: { cond: 'paralysed', chance: 0.15 } },
];
