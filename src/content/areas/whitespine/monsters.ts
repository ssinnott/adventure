// The Whitespine's monsters, band 22-24: Monks' Vale and Highcell, the High Spine, Sheer Point and
// the Giants' Stair. `sprite` names the drawing (src/ui/sprites.ts); the numbers are the combat
// model's. A group on a map is a list of these ids, and any area's maps may place them.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings the Whitespine's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'brother', 'bell_ringer', 'abbot',
  'spine_eagle', 'snow_troll', 'mason',
  'stair_giant', 'stair_king',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the monastery and Monks' Vale (#499, #500), a soldier on MONSTERS §4.4's line at 22: a machine under the robe
  { id: 'brother', name: 'Brother', plural: 'Brothers', sprite: 'brother', kind: 'machine', look: 'A monk, walking as if someone had described walking to it.', level: 22, hp: 317, ac: 22, attack: 13, dice: 4, sides: 8, bonus: 2, speed: 11, xp: 873, gold: [0, 0], tint: '#6e5a45', size: 1.1 },
  // the monastery's towers and the chapter house (#500), a controller on MONSTERS §4.4's line at 23: its bell holds at 0.2 a
  // hit (§8.1), and it is heard from the back rank, as the devilfish reaches from it, so the bells hold the front row while
  // the brothers close
  { id: 'bell_ringer', name: 'Bell-ringer', plural: 'Bell-ringers', sprite: 'bell_ringer', kind: 'machine', look: 'Eleven strokes, a gap, and eleven more.', level: 23, hp: 284, ac: 23, attack: 13, dice: 4, sides: 8, bonus: 2, speed: 12, xp: 913, gold: [0, 0], ranged: true, inflict: { cond: 'paralysed', chance: 0.2 }, tint: '#a39a86', size: 1.1 },
  // the chapter house's seat (#500), Highcell's boss at 24; it never comes back, and its robe falls open as it falls. Off
  // MONSTERS §4.4's boss line (1,381 hp, 24d8+24, won 59% at 23 and 80% at 25), its hit points and its blow are set for
  // #500's gate: two times in three at its floor, 23, which keeps the lower house's floor with its one other fight, and
  // nearly always at 25
  { id: 'abbot', name: 'The Abbot', plural: 'Abbots', sprite: 'abbot', kind: 'machine', look: 'The abbot keeps the hours, and it is time.', level: 24, hp: 1700, ac: 25, attack: 16, dice: 19, sides: 8, bonus: 16, speed: 13, xp: 15253, gold: [0, 0], tint: '#3a2f3b', size: 1.4 },
  // over the High Spine, from J11 on (#499, #501, #504), a skirmisher on MONSTERS §4.4's line at 22: it flies, reaching the back row
  { id: 'spine_eagle', name: 'Spine Eagle', plural: 'Spine Eagles', sprite: 'spine_eagle', kind: 'beast', look: 'It takes the light out of the sky as it comes down.', level: 22, hp: 328, ac: 22, attack: 13, dice: 3, sides: 7, bonus: 6, speed: 15, xp: 873, gold: [0, 0], ranged: true, tint: '#4a3828', size: 0.9 },
  // the High Spine's snow, from J11 on (#499, #501, #503), a brute at 23 as MONSTERS §3.3 makes a troll (#537): three quarters of
  // the line's hit points, mending a tenth of them each round but a round fire struck it; a tall one, drawn inside TALL_REACH
  { id: 'snow_troll', name: 'Snow Troll', plural: 'Snow Trolls', sprite: 'snow_troll', kind: 'beast', look: 'A drift that stood up.', level: 23, hp: 474, ac: 21, attack: 14, dice: 5, sides: 7, bonus: 8, speed: 8, xp: 1827, gold: [0, 0], regen: 47, tint: '#dce4ea', size: 1.6 },
  // on the causeway at Sheer Point (#504), a soldier on MONSTERS §4.4's line at 23: the Hand, so it never breaks
  { id: 'ashen_mason', name: 'Ashen Mason', plural: 'Ashen Masons', sprite: 'mason', kind: 'person', steady: true, look: 'A hammer from below, and a shard to set.', level: 23, hp: 319, ac: 23, attack: 13, dice: 4, sides: 8, bonus: 2, speed: 11, xp: 913, gold: [45, 100], tint: '#5a5250', size: 0.95 },
  // the Giants' Stair (#502), a brute on MONSTERS §4.4's line at 23, size 2 and drawn inside TALL_REACH: people, so they
  // break when their king falls (the leader of I10's group); a sweeper, so the brute come down whole to 0.85 of its line
  // (632 hit points and 5d7+8 to 537 and 4d7+8), its arm sweeping the front row a turn in four (MONSTERS §3.3, #545)
  { id: 'stair_giant', name: 'Stair Giant', plural: 'Stair Giants', sprite: 'stair_giant', kind: 'person', look: 'A man as tall as a house, holding out his hand.', level: 23, hp: 537, ac: 21, attack: 14, dice: 4, sides: 7, bonus: 8, speed: 8, xp: 1827, gold: [70, 160], sweep: { chance: 0.25 }, tint: '#6c6152', size: 2 },
  // the Stair's head (#502), its boss at 24 with two giants, sweeping as they do; tuned by #502's gate from the boss
  // line's 1,381 and 24d8+24 to 1,650 and 16d8+16, won about half the time at 22 and 23 and nearly always at 25; the
  // toll's coin in his purse
  { id: 'stair_king', name: 'The Stair-king', plural: 'Stair-kings', sprite: 'stair_king', kind: 'person', look: 'He has taken the toll here since before Helmstow.', level: 24, hp: 1650, ac: 25, attack: 16, dice: 16, sides: 8, bonus: 16, speed: 13, xp: 15253, gold: [250, 500], sweep: { chance: 0.25 }, tint: '#4f5560', size: 2 },
];
