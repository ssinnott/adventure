// Sunderwood's monsters, band 14-16: the Eaves, Lanternwood and the Sunder between them.
// `sprite` names the drawing (src/ui/sprites.ts); the numbers are the combat model's. A group on a
// map is a list of these ids, and any area's maps may place them.
// Drawn ahead of the area's first map, so src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings Sunderwood's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'gleaner',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the Sunder's ledges (#198), a soldier on MONSTERS §4.4's line at 15: the Hand, quarrying the Rift
  { id: 'ashen_gleaner', name: 'Ashen Gleaner', plural: 'Ashen Gleaners', sprite: 'gleaner', kind: 'person', steady: true, look: 'A sack of glowing shards, and a knife for the next.', level: 15, hp: 155, ac: 19, attack: 9, dice: 3, sides: 5, bonus: 3, speed: 11, xp: 593, gold: [25, 60], tint: '#54484e', size: 0.92 },
];
