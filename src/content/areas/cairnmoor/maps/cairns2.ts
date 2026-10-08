// Carn Dubh, level two: under the cairn. The stair comes down through the bedrock to where the tool
// marks stop, and the hall the cairn was built over opens at its head, its walls too smooth for the
// hill folk who laid their dead in rows down both sides of it, heads to the wall and feet to the stair,
// wights over the rows on either side. At its end the Cairn King on a seat, alone, and behind the seat a door in the
// smooth wall that nothing opens, with nothing beside it at a girl's shoulder. Beside the stair's head
// a cell the hill folk walled up, its dead laid the other way about, with the richest grave-gold and
// the Hill Torc. Band 19-20; docs/areas/cairnmoor.md §4.6 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, WEST } from '../../../../game/types.ts';

export const CAIRNS2: MapDef = {
  id: 'cairns2',
  name: 'Under Carn Dubh',
  kind: 'dungeon',
  band: [19, 20],
  region: 'cairnmoor',
  start: { x: 7, y: 14, facing: NORTH },
  // The Sunder's smooth wall, one face with no join (docs/areas/sunderwood.md §4.6), seen again and not named.
  palette: { wall: '#6a6668', wallDark: '#4a4648', floor: '#34323a', ceiling: '#0a090e', door: '#6a6668', wallStyle: 'smooth', ceilingStyle: 'vault', banner: '#2c2e38' },
  bare: true,
  // The door behind the seat: a wall with a door in it, as a seam, that nobody walks through.
  legend: { Z: { solid: 'wall', door: 'door' } },
  rows: [
    '################',
    '#######Z########',
    '######...#######',
    '#####.....######',
    '#####.....######',
    '#####.....######',
    '#####.....######',
    '#####.....######',
    '#####.....######',
    '#######.########',
    '##....S.########',
    '##....#.########',
    '##....#.########',
    '#######.########',
    '#######.########',
    '################',
  ],
  exits: [
    { x: 7, y: 14, to: 'cairns', tx: 13, ty: 8, tf: WEST, label: 'You climb the stair a long way, up into the cairn.' },
  ],
  features: [
    // The stair through the bedrock, and where the tool marks stop.
    { kind: 'event', x: 7, y: 13, id: 'cd2_stair', once: true, text: 'The stair goes down through the bedrock, the marks of the tools on every step.' },
    { kind: 'event', x: 7, y: 11, id: 'cd2_smooth', once: true, text: 'The tool marks stop. Past them the walls are smooth, and go up out of the light without a join.' },
    // The hint: the rows, every one laid the same way.
    { kind: 'event', x: 7, y: 10, id: 'cd2_rows', once: true, text: 'At the stair\'s head a hall opens. The dead lie in rows down both sides of it, heads to the wall and feet to the stair.' },
    // The seat at the hall's end, and the door behind it: the first mark a company looks for and does not find.
    { kind: 'event', x: 7, y: 5, id: 'cd2_seat', once: true, text: 'At the hall\'s end a seat cut from one stone, and on it a king, crowned.' },
    { kind: 'event', x: 7, y: 2, id: 'cd2_door', once: true, text: 'Behind the seat the smooth wall has a door in it, fine as a hair at its edges, and nothing to open it by. Beside it, at a girl\'s shoulder, nothing.' },
    // The secret: the cell off the stair, its dead laid the other way about.
    { kind: 'event', x: 5, y: 10, id: 'cd2_cell', once: true, text: 'A cell of the dead laid close, heads to the stair and feet to the hall. The gold at their throats is the richest yet.' },
    { kind: 'chest', x: 3, y: 11, id: 'cd2_cell_chest', gold: 900, items: ['hill_torc'] },
  ],
  secrets: [{ x: 6, y: 10, hint: 'cd2_rows' }],
  encounters: [
    // Wights over the rows, four to a side: the King's court.
    { id: 'cd2_wights1', x: 5, y: 7, monsters: ['cairn_wight', 'cairn_wight', 'cairn_wight', 'cairn_wight'], aware: 2, respawn: 2880, roams: false },
    { id: 'cd2_wights2', x: 9, y: 5, monsters: ['cairn_wight', 'cairn_wight', 'cairn_wight', 'cairn_wight'], aware: 2, respawn: 2880, roams: false },
    // The Cairn King on its seat, alone: it never comes back, and the door stays shut when it falls.
    { id: 'cd2_king', x: 7, y: 3, monsters: ['cairn_king'], aware: 2, roams: false, slainText: 'The King sinks back on its seat, and the crown rolls ringing down the hall. Behind it the door stays shut.' },
  ],
};
