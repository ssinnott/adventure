// The Whitespine's monsters, band 22-24: Monks' Vale and Highcell, the High Spine, Sheer Point and
// the Giants' Stair. `sprite` names the drawing (src/ui/sprites.ts); the numbers are the combat
// model's. A group on a map is a list of these ids, and any area's maps may place them. Drawn ahead
// of the area's first map, so src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings the Whitespine's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'brother', 'bell_ringer', 'abbot',
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
];
