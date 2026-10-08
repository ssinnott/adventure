// Carn Dubh, level one: the cairn. The door of slabs in its west side lets onto a low passage of laid
// stone, a count cut in its wall and the bog's dead come in along it, east to a chamber under the
// cairn's roof slab; cells open off it north and south with the hill folk's dead laid in rows, a wight
// over each row, and past the north cell the Watcher's cell, newer than the rest, his tally's first page
// under his hands and his wight over him. East, the end cell, where a stair goes down into the hill's
// own rock. Nothing hangs on the walls and nothing burns. Band 18-20; docs/areas/cairnmoor.md §4.6 is
// its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST, NORTH, WEST } from '../../../../game/types.ts';

export const CAIRNS: MapDef = {
  id: 'cairns',
  name: 'Carn Dubh',
  kind: 'dungeon',
  band: [18, 20],
  region: 'cairnmoor',
  start: { x: 1, y: 8, facing: EAST },
  // Laid slabs, grey with lichen at the door and black further in, the floor peat trodden hard.
  palette: { wall: '#76726a', wallDark: '#4c4943', floor: '#3a352d', ceiling: '#1a1815', door: '#76726a', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#5e3f28' },
  bare: true,
  rows: [
    '################',
    '################',
    '########...#...#',
    '########...D...#',
    '########...#...#',
    '#########.######',
    '#########.######',
    '########...#...#',
    '#..............#',
    '########...#...#',
    '#########.######',
    '#########.######',
    '########...#####',
    '########...#####',
    '########...#####',
    '################',
  ],
  exits: [
    // The door of slabs, back out onto the road on N8 (DOOR).
    { x: 1, y: 8, to: 'cairnfield_n8', tx: 5, ty: 18, tf: WEST, label: 'You stoop out of the cairn\'s side into the wind.' },
    // The stair cut down into the rock, to the hall under the cairn.
    { x: 14, y: 8, to: 'cairns2', tx: 7, ty: 14, tf: NORTH, label: 'You go down the stair cut in the rock, a long way down.' },
  ],
  features: [
    // The passage: in from the door, the count cut in its wall (no script a reader reads), the chamber.
    { kind: 'event', x: 2, y: 8, id: 'cd1_in', once: true, text: 'A passage of laid slabs runs in under the cairn, low enough to stoop. It smells of the bog.' },
    { kind: 'event', x: 6, y: 8, id: 'cd1_count', once: true, text: 'Strokes cut in the passage wall in fives, row under row, on into the dark.' },
    { kind: 'event', x: 9, y: 8, id: 'cd1_chamber', once: true, text: 'A chamber under one great slab of roof. Cells open off it on three sides.' },
    // The side cells, the dead in rows, the grave-gold at their throats.
    { kind: 'event', x: 9, y: 4, id: 'cd1_north', once: true, text: 'A cell of the dead, laid in three rows, a twist of gold at every throat. Over each row a shroud stands.' },
    { kind: 'chest', x: 8, y: 2, id: 'cd1_north_gold', gold: 250, items: [] },
    { kind: 'event', x: 9, y: 12, id: 'cd1_south', once: true, text: 'Another cell of the dead in rows, the gold at their throats gone green.' },
    { kind: 'chest', x: 9, y: 14, id: 'cd1_south_gold', gold: 250, items: [] },
    // The Watcher's cell (#56's 37): newer, and the first page of his tally under his hands.
    { kind: 'event', x: 13, y: 3, id: 'cd1_watcher', once: true, text: 'This cell is newer, its stones squared and mortared. A man lies on the slab in a watchman\'s coat, hands folded on a page.' },
    { kind: 'chest', x: 14, y: 3, id: 'cd1_page', gold: 0, items: ['watchers_page'] },
    // The end cell and the stair down.
    { kind: 'event', x: 13, y: 8, id: 'cd1_stair', once: true, text: 'In the end cell the floor is the hill\'s own rock, and a stair is cut down into it.' },
  ],
  encounters: [
    // The bog's dead, come in along the passage.
    { id: 'cd1_bodies1', x: 4, y: 8, monsters: ['bog_body', 'bog_body', 'bog_body', 'bog_body'], aware: 2, respawn: 2880, roams: false },
    { id: 'cd1_bodies2', x: 7, y: 8, monsters: ['bog_body', 'bog_body', 'bog_body', 'bog_body'], aware: 2, respawn: 2880, roams: false },
    // A wight over each row, three to a cell.
    { id: 'cd1_wights1', x: 9, y: 3, monsters: ['cairn_wight', 'cairn_wight', 'cairn_wight'], aware: 2, respawn: 2880, roams: false },
    { id: 'cd1_wights2', x: 9, y: 13, monsters: ['cairn_wight', 'cairn_wight', 'cairn_wight'], aware: 2, respawn: 2880, roams: false },
    // The Watcher's wight, over him: it never comes back.
    { id: 'cd1_watcher', x: 12, y: 3, monsters: ['cairn_wight'], aware: 1, roams: false, slainText: 'The Watcher\'s wight falls across his feet and lies still. His hands are still on the page.' },
  ],
};
