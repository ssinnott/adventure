// Sjongwierde, Saltreach's artifact lair (#845, #847), level one: the drowned mound in the fen under the
// rim, entered by the stair in its crown at A5's 26,23. Down through the clay into the church the mound's
// folk built on its top, silted to the knee when the water came over: its nave on its piers, the singers'
// benches in the west bay with their hymns in notes and never a number, and the chancel, its stalls
// carved with mouths open in song; at the chancel's end the stair down to the undercroft
// (`sjongwierde2`), where the Old Chanter keeps the Telstok. It holds no group and no find. Band 30-32,
// the cap's, out of Saltreach's figures; docs/areas/saltreach/plan.md §12.13 is its brief (#830).
import type { MapDef } from '../../../../game/mapdef.ts';
import { anchored } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

export const SJONGWIERDE: MapDef<'sjongwierde'> = {
  id: 'sjongwierde',
  name: 'Sjongwierde',
  kind: 'dungeon',
  band: [30, 32],
  enclave: true,
  region: 'saltreach',
  start: { x: 7, y: 1, facing: SOUTH },
  anchors: { from_sjongwierde2: { x: 7, y: 12, facing: NORTH } },
  // The church's grey stone under the fen's silt, and the green of the old song's chanter.
  palette: { wall: '#5a5648', wallDark: '#36332a', floor: '#3e3c32', ceiling: '#16150f', door: '#3a3226', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#3e5448' },
  rows: [
    '################',
    '#######.########',
    '#######.########',
    '####.......#####',
    '####.o...o.#####',
    '#..#.......#####',
    '#..........#####',
    '#..#.......#####',
    '####.o...o.#####',
    '####.......#####',
    '#######.########',
    '#####.....######',
    '#####.....######',
    '#######.########',
    '################',
    '################',
  ],
  exits: [
    anchored({ x: 7, y: 1, to: 'delta_a5', at: 'from_sjongwierde', label: 'Up the stair and out on the mound\'s crown, into the wind off the fen.' }),
    anchored({ x: 7, y: 13, to: 'sjongwierde2', at: 'start', label: 'Down the stair under the chancel, into the mound\'s heart.' }),
  ],
  features: [
    // The stair down through the crown's clay, and the church under the mound.
    { kind: 'event', x: 7, y: 2, id: 'sw_crown', once: true, text: 'A stair cut down through the mound\'s clay, its steps slick. The walls sweat, and the cold is a well\'s.' },
    { kind: 'event', x: 7, y: 4, id: 'sw_nave', once: true, text: 'A church under the mound, silted to the knee. The water came in at its windows long ago, and stayed.' },
    // The singers' benches in the west bay, their hymns in notes.
    { kind: 'event', x: 1, y: 6, id: 'sw_boards', once: true, text: 'The singers\' benches, a board over each with its hymns in notes. On no board is there a number.' },
    // The chancel, and the stair down to the undercroft at its end.
    { kind: 'event', x: 7, y: 10, id: 'sw_chancel', once: true, text: 'The chancel step, worn hollow. The stalls either side are carved with heads, every mouth open in song.' },
    { kind: 'event', x: 7, y: 12, id: 'sw_stair', once: true, text: 'A stair goes down under the chancel. Up it comes a voice, one voice, singing a song you do not know.' },
  ],
};
