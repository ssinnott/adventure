// The Tiefzeche, level three: the bottom. The steep stair comes down into the last of the dwarves'
// tunnel, where the pick marks stop at a face of smooth wall with a square hole cut through it, and
// crusts on a ledge beside the hole. Through it, the clean corridor, square and lit from nowhere and
// humming: west past the knockers and a wall they keep swept before, behind which is the room where
// they stack what they carry; north past more of them; east to the Foreman, before the door marked
// CREW ONLY, which is a wall with a door drawn in it and opens for nobody the company has (#22; it
// opens from the other side in Act V, #56's 60). East of the hole the service ladder comes down out
// of the ceiling. Band 17-18; docs/areas/kilns.md §4.7 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH } from '../../../../game/types.ts';

export const DEEP_MINES3: MapDef = {
  id: 'deep_mines3',
  name: 'The Clean Corridor',
  kind: 'dungeon',
  band: [17, 18],
  region: 'kilns',
  start: { x: 13, y: 14, facing: NORTH },
  // The corridor is the hull's, one face with no join; the dwarves' tunnel ends in rock at its face.
  palette: { wall: '#9ea2a6', wallDark: '#6e7276', floor: '#5e6266', ceiling: '#2e3236', door: '#9ea2a6', wallStyle: 'smooth', ceilingStyle: 'vault', banner: '#5c6068' },
  bare: true,
  // The door marked CREW ONLY: a wall with a door drawn in it, as a seam, that nobody walks through.
  legend: { Z: { solid: 'wall', door: 'door' } },
  rows: [
    '################',
    '################',
    '################',
    '#.............Z#',
    '#.##############',
    '#.##############',
    '#.##############',
    '#.##############',
    '#.##....########',
    '#.##....######.#',
    '#.###S########.#',
    '#..............#',
    '#############.##',
    '############:::#',
    '############:::#',
    '################',
  ],
  exits: [
    { x: 14, y: 14, to: 'deep_mines2', tx: 14, ty: 13, tf: NORTH, label: 'You climb the steep stair to the old workings.' },
    // The service ladder, up the shaft to the old workings.
    { x: 14, y: 9, to: 'deep_mines2', tx: 5, ty: 11, tf: NORTH, label: 'You climb the rungs up out of the hum, a long way, to the old workings.' },
  ],
  features: [
    // The end of the dwarves' tunnel, and the hole into the corridor; the crusts on their ledge, where
    // the crust-bearer's son is (#56's 33, #471).
    { kind: 'event', x: 13, y: 13, id: 'dm3_end', once: true, text: 'The pick marks stop. Past them the wall is smooth, and the air hums.' },
    { kind: 'event', x: 12, y: 13, id: 'dm3_ledge', once: true, text: 'A ledge cut in the rock by the hole, and crusts on it in a row, the oldest gone hard as stone. None has been eaten.' },
    { kind: 'event', x: 13, y: 11, id: 'dm3_mouth', once: true, text: 'Through the hole, a corridor, square and clean and lit from nowhere. It runs both ways further than the light.' },
    { kind: 'event', x: 14, y: 10, id: 'dm3_rungs', once: true, text: 'Iron rungs come down the wall out of a square hole in the ceiling, cold to the hand.' },
    // The secret: the knockers' tracks run to a wall as often as along the corridor, the dust swept in
    // arcs before it; searched there, it gives on their room, and what the cargo dropped among the parts.
    { kind: 'event', x: 5, y: 11, id: 'dm3_tracks', once: true, text: 'Small tracks in the dust, as many going to the wall here as along the corridor. Before the wall the dust is swept in arcs.' },
    { kind: 'event', x: 5, y: 9, id: 'dm3_parts', once: true, text: 'A room swept clean, parts stacked by kind, plates with plates and pins with pins. One stack is combs and buttons and a spoon.' },
    { kind: 'chest', x: 6, y: 9, id: 'dm3_parts_chest', gold: 1250, items: ['forge_hammer+1', 'knocker_plate'] },
    { kind: 'event', x: 1, y: 11, id: 'dm3_corner', once: true, text: 'The corridor turns, square, and runs on north. The hum is louder here.' },
    { kind: 'event', x: 1, y: 3, id: 'dm3_far', once: true, text: 'The corridor turns east. At its far end something tall stands before a door, quite still.' },
    // The door: the chapter's step (#470). No flag, no lock, nothing in content/locks.ts (#434's 4).
    { kind: 'event', x: 13, y: 3, id: 'dm3_door', once: true, text: 'CREW ONLY, in the old script. In the dust, hundreds of footprints walking down, in a line. On the frame, at a girl\'s shoulder, a loop inside a loop.' },
  ],
  secrets: [{ x: 5, y: 10, hint: 'dm3_tracks' }],
  encounters: [
    // The clean corridor: six knockers and a mender, twice (MONSTERS §7.1's first fight).
    { id: 'dm3_knockers1', x: 9, y: 11, monsters: ['knocker', 'knocker', 'knocker', 'knocker', 'knocker', 'knocker', 'mender'], aware: 3, respawn: 2880, roams: false },
    { id: 'dm3_knockers2', x: 1, y: 6, monsters: ['knocker', 'knocker', 'knocker', 'knocker', 'knocker', 'knocker', 'mender'], aware: 3, respawn: 2880, roams: false },
    // The Foreman before the door: it never comes back, and the door stays shut when it falls.
    { id: 'dm3_foreman', x: 11, y: 3, monsters: ['foreman'], aware: 2, roams: false, slainText: 'The Foreman folds down over its slate, the stylus at a box it never ticked. Behind it the door stays shut.' },
  ],
};
