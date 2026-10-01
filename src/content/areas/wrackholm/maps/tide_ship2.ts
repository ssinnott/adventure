// The Tide Ship, the lower deck: the crews' quarters, their hammocks and the rats in the bilge
// forward; the hatch down to the hold aft, where the Hand keeps a post; the captain's cabin behind
// its door at the stern, with the ship's papers and its log on the table and his sea chest. Band
// 12-13; docs/areas/wrackholm.md §4.5 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

export const TIDE_SHIP2: MapDef = {
  id: 'tide_ship2',
  name: 'The Lower Deck',
  kind: 'dungeon',
  band: [12, 13],
  region: 'wrackholm',
  start: { x: 8, y: 4, facing: SOUTH },
  palette: { wall: '#5a4634', wallDark: '#3a2c20', floor: '#3e3024', ceiling: '#2a2018', door: '#3e2e20', wallStyle: 'brick', ceilingStyle: 'beams', banner: '#2a3a4a' },
  rows: [
    '################',
    '#######..#######',
    '######....######',
    '#####......#####',
    '####........####',
    '####.o.o..o.####',
    '####........####',
    '####.o.o..o.####',
    '####........####',
    '####........####',
    '####........####',
    '#########D######',
    '#####......#####',
    '#####......#####',
    '######....######',
    '################',
  ],
  exits: [
    { x: 8, y: 4, to: 'tide_ship', tx: 8, ty: 5, tf: SOUTH, label: 'You climb the ladder up into the night on the weather deck.' },
    { x: 4, y: 10, to: 'tide_ship3', tx: 4, ty: 10, tf: NORTH, label: 'You go down through the grating into the hold.' },
  ],
  features: [
    { kind: 'event', x: 8, y: 5, id: 'ts2_in', once: true, text: 'Down the ladder into dark and the smell of men. Hammocks hang in rows, slack and empty, and swing all together as the ship rolls.' },
    { kind: 'event', x: 9, y: 6, id: 'ts2_quarters', once: true, text: 'Sea chests under the hammocks, a knife in a beam, dice left mid game. Compact knots on the lids, a grey hand painted over each.' },
    { kind: 'event', x: 7, y: 2, id: 'ts2_rats', once: true, text: 'Bilge water slops under the boards, and in it rats, fat as cats on the ship\'s stores, that do not run when the light finds them.' },
    { kind: 'event', x: 6, y: 9, id: 'ts2_hatch', once: true, text: 'The hatch to the hold, a stool either side and a chain on a nail. Up through the grating comes a sound of iron, shifting, never still.' },
    { kind: 'event', x: 9, y: 12, id: 'ts2_cabin', once: true, text: 'The captain\'s cabin. A table with the charts weighted at the corners, a lamp turned low, a coat on the chair. The chair is cold.' },
    { kind: 'event', x: 8, y: 14, id: 'ts2_window', once: true, text: 'The stern window, black water under it going away to nothing. The lamp behind you makes the glass a mirror and the sea a wall.' },
    // On the captain's table, the papers and the log; in his sea chest, his cutlass. The log is read
    // at Lantern Watch (#204).
    { kind: 'chest', x: 7, y: 13, id: 'ts2_table', gold: 0, items: ['ships_papers', 'ships_log'] },
    { kind: 'chest', x: 10, y: 13, id: 'ts2_sea_chest', gold: 1000, items: ['tide_cutlass'] },
  ],
  encounters: [
    { id: 'ts2_rats', x: 7, y: 6, monsters: new Array(8).fill('bilge_rat'), aware: 2, respawn: 1440 },
    { id: 'ts2_post', x: 5, y: 10, monsters: ['ashen_overseer', 'ashen_overseer', 'ashen_overseer'], aware: 2, roams: false },
  ],
};
