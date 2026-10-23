// Blackdraw, Ashfall's enclave (#845): a flue of the Underdeep's exhaust, its mouth in the mountain's
// face under the west wall of F12 at 10,3, and its far end a furnace gone cold where the flow came in
// and set. The flue goes down lined with iron plates, black with soot, where a flue walker still walks
// it; past it a clerks' room behind one plate knocked bright, and at the flue's foot the cold furnace,
// where an inspector and its deep knocker keep the mouth: the farthest and the hardest.
// Band 27-28, a band over F12's 25-26, out of the area's figures; docs/areas/ashfall.md §12.3 is its
// brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

export const BLACKDRAW: MapDef = {
  id: 'blackdraw',
  name: 'Blackdraw',
  kind: 'dungeon',
  band: [27, 28],
  enclave: true,
  region: 'ashfall',
  start: { x: 7, y: 1, facing: SOUTH },
  palette: { wall: '#3c3836', wallDark: '#24211f', floor: '#2e2b29', ceiling: '#0e0d0c', door: '#6a5e52', wallStyle: 'smooth', ceilingStyle: 'vault', banner: '#7a3a1e' },
  rows: [
    '################',
    '#######.########',
    '#######.########',
    '#######......###',
    '####...#####.###',
    '####...#####.###',
    '#####S######.###',
    '###..........###',
    '###.############',
    '###.############',
    '##........######',
    '##........######',
    '##........######',
    '##........######',
    '################',
    '################',
  ],
  exits: [
    { x: 7, y: 1, to: 'emberwaste_f12', tx: 10, ty: 2, tf: NORTH, label: 'Up the flue and out at its mouth, onto the ash under the mountain\'s wall.' },
  ],
  features: [
    // The mouth and the flue going down, lined with iron plates black with soot.
    { kind: 'event', x: 7, y: 2, id: 'bd_mouth', once: true, text: 'Soot lies thick and soft underfoot, and the air hangs still. Nothing has drawn up here in years.' },
    { kind: 'event', x: 10, y: 3, id: 'bd_plates', once: true, text: 'The flue is lined with plates of iron, riveted edge to edge and black with soot from floor to roof.' },
    { kind: 'event', x: 12, y: 7, id: 'bd_irons', once: true, text: 'Up the plates go pairs of bright scratches, where something with irons on its feet climbs and climbs.' },
    // The secret: one plate of the wall knocked bright among the soot, and behind it the clerks' room.
    { kind: 'event', x: 5, y: 7, id: 'bd_bright', once: true, text: 'One plate of the wall is knocked bright, where every other is black with soot.' },
    { kind: 'event', x: 5, y: 5, id: 'bd_clerks', once: true, text: 'A clerks\' room behind the plate: a stool and a sloped desk, and the flue\'s heats scratched in rows on the walls.' },
    { kind: 'chest', x: 4, y: 4, id: 'bd_pay', gold: 300, items: ['elixir', 'potion_sp_great'] },
    // The cold furnace at the flue's foot, the flow set through its back, and the stokers' locker.
    { kind: 'event', x: 6, y: 11, id: 'bd_furnace', once: true, text: 'The furnace, cold. Its doors hang open on a firebox heaped with grey clinker, its bars rusted through.' },
    { kind: 'event', x: 9, y: 12, id: 'bd_flow', once: true, text: 'Through the furnace\'s back the flow came in and set, a black tongue of rock across the floor, still glassy.' },
    { kind: 'event', x: 2, y: 13, id: 'bd_stoker', once: true, text: 'A stoker lies on its back by the furnace door, its shovel still in its hands, run down where it fell.' },
    { kind: 'chest', x: 8, y: 13, id: 'bd_locker', gold: 400, items: ['kindler'] },
  ],
  secrets: [{ x: 5, y: 6, hint: 'bd_bright' }],
  encounters: [
    // A flue walker in the flue below its first turn, a square wide: the nearer and the gentler, at 27.
    { id: 'bd_walker', x: 12, y: 5, monsters: ['flue_walker'], aware: 3, roams: false, respawn: 2880 },
    // An inspector with a deep knocker, and more it calls, just inside the furnace's mouth: the farthest
    // and the hardest, at 28.
    { id: 'bd_inspector', x: 3, y: 10, monsters: ['inspector', 'deep_knocker'], aware: 2, roams: false, respawn: 2880 },
  ],
};
