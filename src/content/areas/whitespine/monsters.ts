// The Whitespine's monsters, band 22-24: Monks' Vale, the High Spine, Sheer Point and the Giants'
// Stair. `sprite` names the drawing (src/ui/sprites.ts); the numbers are the combat model's. A group
// on a map is a list of these ids, and any area's maps may place them.
// Drawn ahead of the area's first map, so src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings the Whitespine's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'spine_eagle', 'snow_troll', 'mason',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // over the High Spine, from J11 on (#499, #501, #504), a skirmisher on MONSTERS §4.4's line at 22: it flies, reaching the back row
  { id: 'spine_eagle', name: 'Spine Eagle', plural: 'Spine Eagles', sprite: 'spine_eagle', kind: 'beast', look: 'It takes the light out of the sky as it comes down.', level: 22, hp: 328, ac: 22, attack: 13, dice: 3, sides: 7, bonus: 6, speed: 15, xp: 873, gold: [0, 0], ranged: true, tint: '#4a3828', size: 0.9 },
  // the High Spine's snow, from J11 on (#499, #501, #503), a brute at 23 as MONSTERS §3.3 makes a troll (#537): three quarters of
  // the line's hit points, mending a tenth of them each round but a round fire struck it; a tall one, drawn inside TALL_REACH
  { id: 'snow_troll', name: 'Snow Troll', plural: 'Snow Trolls', sprite: 'snow_troll', kind: 'beast', look: 'A drift that stood up.', level: 23, hp: 474, ac: 21, attack: 14, dice: 5, sides: 7, bonus: 8, speed: 8, xp: 1827, gold: [0, 0], regen: 47, tint: '#dce4ea', size: 1.6 },
  // on the causeway at Sheer Point (#504), a soldier on MONSTERS §4.4's line at 23: the Hand, so it never breaks
  { id: 'ashen_mason', name: 'Ashen Mason', plural: 'Ashen Masons', sprite: 'mason', kind: 'person', steady: true, look: 'A hammer from below, and a shard to set.', level: 23, hp: 319, ac: 23, attack: 13, dice: 4, sides: 8, bonus: 2, speed: 11, xp: 913, gold: [45, 100], tint: '#5a5250', size: 0.95 },
];
