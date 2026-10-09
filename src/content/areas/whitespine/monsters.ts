// The Whitespine's monsters, band 22-24: Monks' Vale and Highcell, the High Spine, Sheer Point and
// the Giants' Stair. `sprite` names the drawing (src/ui/sprites.ts); the numbers are the combat
// model's. A group on a map is a list of these ids, and any area's maps may place them. Drawn ahead
// of the area's first map, so src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings the Whitespine's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'brother', 'bell_ringer', 'abbot',
  'spine_eagle', 'snow_troll', 'mason',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the monastery and Monks' Vale (#499, #500), a soldier on MONSTERS §4.4's line at 22: a machine under the robe
  { id: 'brother', name: 'Brother', plural: 'Brothers', sprite: 'brother', kind: 'machine', look: 'A monk, walking as if someone had described walking to it.', level: 22, hp: 317, ac: 22, attack: 13, dice: 4, sides: 8, bonus: 2, speed: 11, xp: 873, gold: [0, 0], tint: '#6e5a45', size: 1.1 },
  // the monastery's towers and the chapter house (#500), a controller on MONSTERS §4.4's line at 23: its bell holds at 0.2 a
  // hit (§8.1), and it is heard from the back rank, as the devilfish reaches from it, so the bells hold the front row while
  // the brothers close
  { id: 'bell_ringer', name: 'Bell-ringer', plural: 'Bell-ringers', sprite: 'bell_ringer', kind: 'machine', look: 'Eleven strokes, a gap, and eleven more.', level: 23, hp: 284, ac: 23, attack: 13, dice: 4, sides: 8, bonus: 2, speed: 12, xp: 913, gold: [0, 0], ranged: true, inflict: { cond: 'paralysed', chance: 0.2 }, tint: '#a39a86', size: 1.1 },
  // the chapter house (#500), its boss at 24 on MONSTERS §4.4's boss line, for #500's gate to tune; its robe falls open
  { id: 'abbot', name: 'The Abbot', plural: 'Abbots', sprite: 'abbot', kind: 'machine', look: 'The abbot keeps the hours, and it is time.', level: 24, hp: 1381, ac: 25, attack: 16, dice: 24, sides: 8, bonus: 24, speed: 13, xp: 15253, gold: [0, 0], tint: '#3a2f3b', size: 1.4 },
  // over the High Spine, from J11 on (#499, #501, #504), a skirmisher on MONSTERS §4.4's line at 22: it flies, reaching the back row
  { id: 'spine_eagle', name: 'Spine Eagle', plural: 'Spine Eagles', sprite: 'spine_eagle', kind: 'beast', look: 'It takes the light out of the sky as it comes down.', level: 22, hp: 328, ac: 22, attack: 13, dice: 3, sides: 7, bonus: 6, speed: 15, xp: 873, gold: [0, 0], ranged: true, tint: '#4a3828', size: 0.9 },
  // the High Spine's snow, from J11 on (#499, #501, #503), a brute at 23 as MONSTERS §3.3 makes a troll (#537): three quarters of
  // the line's hit points, mending a tenth of them each round but a round fire struck it; a tall one, drawn inside TALL_REACH
  { id: 'snow_troll', name: 'Snow Troll', plural: 'Snow Trolls', sprite: 'snow_troll', kind: 'beast', look: 'A drift that stood up.', level: 23, hp: 474, ac: 21, attack: 14, dice: 5, sides: 7, bonus: 8, speed: 8, xp: 1827, gold: [0, 0], regen: 47, tint: '#dce4ea', size: 1.6 },
  // on the causeway at Sheer Point (#504), a soldier on MONSTERS §4.4's line at 23: the Hand, so it never breaks
  { id: 'ashen_mason', name: 'Ashen Mason', plural: 'Ashen Masons', sprite: 'mason', kind: 'person', steady: true, look: 'A hammer from below, and a shard to set.', level: 23, hp: 319, ac: 23, attack: 13, dice: 4, sides: 8, bonus: 2, speed: 11, xp: 913, gold: [45, 100], tint: '#5a5250', size: 0.95 },
];
