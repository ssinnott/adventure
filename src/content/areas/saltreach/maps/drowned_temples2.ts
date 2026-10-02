// The Drowned Temples, level two: the choir, dry, below the nave's stair. A lone drowned man at the
// stair's foot; the stalls north, four chanters counting behind two drowned men, and two more in the
// west bay's stalls; the chancel at the choir's end, where the Choirmaster beats the count on the
// Tide Bell alone, blessing itself, and the vestry behind it with the ladder's finds. The
// sacristy at the back, where the priests drowned themselves, is cut off from the chancel by their
// pool and reached only by the wet stair from B6's far roof, the secret: the god's silver is there.
// When the Choirmaster falls the count stops, and the chanters do not come back. Band 11-12;
// docs/areas/saltreach.md §4.7 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';
import { COUNT_STOPPED } from './drowned_temples.ts';

export const DROWNED_TEMPLES2: MapDef = {
  id: 'drowned_temples2',
  name: 'The Choir',
  kind: 'dungeon',
  band: [11, 12],
  region: 'saltreach',
  start: { x: 7, y: 14, facing: NORTH },
  palette: { wall: '#4a5652', wallDark: '#2c3432', floor: '#323c3a', ceiling: '#121a1a', door: '#3e3a2e', wallStyle: 'smooth', ceilingStyle: 'vault', banner: '#3a4a5a' },
  rows: [
    '################',
    '#######...#W...#',
    '#####......W...#',
    '#####......W...#',
    '#####o...o##...#',
    '#...#o...o######',
    '#........o######',
    '#...#o...o######',
    '#...#o...o######',
    '#####o...o######',
    '#####.....######',
    '######...#######',
    '######...#######',
    '#######.########',
    '#######.########',
    '################',
  ],
  exits: [
    { x: 7, y: 14, to: 'drowned_temples', tx: 8, ty: 2, tf: SOUTH, label: 'You climb the stair back up to the nave.' },
    { x: 14, y: 1, to: 'delta_b6', tx: 8, ty: 22, tf: NORTH, label: 'You climb the wet stair to the far roof\'s ledge.' },
  ],
  features: [
    // The stair's foot: the count loud ahead, until it stops.
    { kind: 'event', x: 7, y: 13, id: 'dt2_in', once: true, until: COUNT_STOPPED, text: 'The choir. Dressed stone, dry, and the count loud ahead, many voices on one number, and a bell struck under it, slow, keeping them to it.' },
    { kind: 'event', x: 7, y: 13, id: 'dt2_quiet', once: true, after: COUNT_STOPPED, text: 'The stair\'s foot, the choir quiet ahead. Dry stone, dry air, and your own steps loud in it. You find you are counting them, and stop.' },
    // The stalls, the west bay, the chancel and the vestry behind it; the chancel quiet once the count stops.
    { kind: 'event', x: 7, y: 10, id: 'dt2_choir', once: true, text: 'The stalls, oak, their seats up, run north to the chancel. The chanters stand in them with their hands on the rails and their eyes shut and count, and the front row sleeps on its feet.' },
    { kind: 'event', x: 1, y: 5, id: 'dt2_psalters', once: true, text: 'The west bay\'s stalls, a psalter open on each desk. The pages are tides, in and out, notes above them. On the last page the notes stop and the numbers go on.' },
    { kind: 'event', x: 6, y: 3, id: 'dt2_chancel', once: true, until: COUNT_STOPPED, text: 'The chancel step, worn to a dish. Beyond it the bell, mouth up on the stone, and the beat on it that you have heard since the door, once to each number and once after the breath.' },
    { kind: 'event', x: 6, y: 3, id: 'dt2_chancel_after', once: true, after: COUNT_STOPPED, text: 'The chancel step, worn to a dish. The stone beyond it is bare, a ring worn in it where the bell sat, and nothing beats. Water laps somewhere behind.' },
    { kind: 'event', x: 8, y: 1, id: 'dt2_vestry_look', once: true, text: 'The vestry behind the chancel, copes on their pegs in a row, rotting to the hem, the gold thread the one thing on them that has held. One peg is bare.' },
    { kind: 'chest', x: 9, y: 1, id: 'dt2_vestry', gold: 300, items: ['morning_star+1', 'ironshod_staff+1', 'potion_sp'] },
    // The sacristy, in from the far roof's wet stair, and the priests' pool between it and the chancel,
    // each quiet once the count stops.
    { kind: 'event', x: 14, y: 2, id: 'dt2_back', once: true, until: COUNT_STOPPED, text: 'The sacristy, in from the wet stair, the tideline along its wall a hand above your head. Through the stone the count comes, near as the next room, and the bell under it.' },
    { kind: 'event', x: 14, y: 2, id: 'dt2_back_quiet', once: true, after: COUNT_STOPPED, text: 'The sacristy, the tideline along its wall above your head. The wall is quiet. Water drips off the stair behind you, and that is the only time kept.' },
    { kind: 'event', x: 12, y: 2, id: 'dt2_pool', once: true, until: COUNT_STOPPED, text: 'A pool fills the floor to the chancel, deep and clear. The priests lie on its bottom, stones roped on, faces up. Across it the Choirmaster beats on, back to them.' },
    { kind: 'event', x: 12, y: 2, id: 'dt2_pool_after', once: true, after: COUNT_STOPPED, text: 'A pool fills the floor to the chancel, deep and clear. The priests lie on its bottom, stones roped on, faces up. Across it the step is bare, and nothing moves.' },
    { kind: 'chest', x: 12, y: 4, id: 'dt2_silver', gold: 250, items: ['silver_mace', 'tide_symbol'] },
  ],
  encounters: [
    // A drowned man alone at the stair's foot.
    { id: 'dt2_verger', x: 7, y: 12, monsters: ['temple_drowned'], aware: 2, roams: false, respawn: 2880 },
    // The choir (MONSTERS §6.1): four chanters behind two drowned men, the front row asleep while the
    // chanters count; and two more in the west bay. Neither comes back once the count has stopped.
    { id: 'dt2_choir', x: 7, y: 6, monsters: ['temple_drowned', 'temple_drowned', 'drowned_chanter', 'drowned_chanter', 'drowned_chanter', 'drowned_chanter'], back: 4, aware: 3, roams: false, respawn: 2880, until: COUNT_STOPPED },
    { id: 'dt2_stalls', x: 2, y: 7, monsters: ['drowned_chanter', 'drowned_chanter'], aware: 3, roams: false, respawn: 2880, until: COUNT_STOPPED },
    // The Choirmaster on the chancel step, alone: the area's boss, which never comes back, and the
    // count stops with it.
    { id: 'dt2_choirmaster', x: 8, y: 2, monsters: ['choirmaster'], aware: 1, roams: false, slainText: 'The bell rolls from its hands and rings once on the stone. The count stops at seven, and nobody takes it up.' },
  ],
};
