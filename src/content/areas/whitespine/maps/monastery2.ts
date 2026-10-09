// Highcell, level two: the lower house. The night stair comes down into the chapter house, its vault
// on four columns and benches round its walls, where brothers stand in front of two bell-ringers and at
// the far end the Abbot keeps the hours on its seat. The seat stands a hand off the hollows its feet
// have worn in the floor; behind it, through the wall, the undercroft: the monks of Highcell in their
// niches, every niche filled, and the last one's lip cut with a count in Kiln-script that ends on
// eleven, and the monks' things laid by. Band 23-24; docs/areas/whitespine.md §4.3 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH, WEST } from '../../../../game/types.ts';

export const MONASTERY2: MapDef = {
  id: 'monastery2',
  name: 'Highcell',
  kind: 'dungeon',
  band: [23, 24],
  region: 'whitespine',
  start: { x: 7, y: 1, facing: SOUTH },
  // The same stone, unwashed, darker below, and the undercroft's rock black with age.
  palette: { wall: '#8a8478', wallDark: '#5c574e', floor: '#47423b', ceiling: '#191714', door: '#4a3828', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#3a2f3b' },
  bare: true,
  rows: [
    '################',
    '#######.########',
    '#######.########',
    '###.........####',
    '###.........####',
    '###..o...o..####',
    '###.........####',
    '###.........####',
    '###..o...o..####',
    '###.........####',
    '###.........####',
    '#######S########',
    '##............##',
    '##............##',
    '################',
    '################',
  ],
  exits: [
    { x: 7, y: 1, to: 'monastery', tx: 12, ty: 13, tf: WEST, label: 'You climb the night stair, up into the cloister.' },
  ],
  features: [
    // The stair's foot, and the chapter house.
    { kind: 'event', x: 7, y: 2, id: 'hc2_stair', once: true, text: 'The night stair comes down into the lower house, under a vault of ribbed stone.' },
    { kind: 'event', x: 7, y: 3, id: 'hc2_chapter', once: true, text: 'The chapter house, benches round its walls. At the far end, on a seat of stone, the Abbot keeps the hours.' },
    // The hint: the seat, stood off its own worn place.
    { kind: 'event', x: 7, y: 10, id: 'hc2_seat', once: true, text: 'The Abbot\'s seat, cut from one stone. It stands a hand off the hollows its feet have worn in the floor.' },
    // The secret: the undercroft behind the seat, the monks in their niches, the last cut with a count.
    { kind: 'event', x: 7, y: 12, id: 'hc2_niches', once: true, text: 'Niches cut in the rock down both walls, a monk of Highcell laid in each. Every niche is full.' },
    { kind: 'sign', x: 13, y: 12, id: 'hc2_tally', text: 'The lip of the last niche is cut with marks in the old script, in a row.', read: 'ONE. TWO. THREE. FOUR. FIVE. SIX. SEVEN. EIGHT. NINE. TEN. ELEVEN.' },
    { kind: 'chest', x: 2, y: 13, id: 'hc2_things', gold: 600, items: ['ice_axe+1', 'skinning_knife+1'] },
  ],
  secrets: [{ x: 7, y: 11, hint: 'hc2_seat' }],
  encounters: [
    // The chapter house: brothers in front of two bell-ringers, the bells holding the front row while the
    // brothers close (MONSTERS §8.1).
    { id: 'hc2_chapter', x: 7, y: 6, monsters: ['brother', 'brother', 'bell_ringer', 'bell_ringer'], aware: 2, respawn: 2880, roams: false },
    // The Abbot on its seat: it never comes back, and its robe falls open as it falls.
    { id: 'hc2_abbot', x: 7, y: 9, monsters: ['abbot'], aware: 2, roams: false, slainText: 'The Abbot falls, and its robe falls open on grey plate. Overhead the bells ring the hour all the same.' },
  ],
};
