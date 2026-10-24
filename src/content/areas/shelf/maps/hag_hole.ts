// Hag Hole, the Foreland's lair (#845, #846): the sea cave behind the mouth in E4's low cliff, 3,6,
// where the Hag lies in the dark the tide leaves. In at the mouth, the passage runs north into the
// cliff and bends twice, the tide's weed hung along its walls and its pools left lying; where it
// narrows to one body's width the Hag stands, the lair's guardian at 32 (MONSTERS §13), the one way
// on. Past it the cave at the passage's end, the wrack heaped where the sea leaves it and a box of
// black wood in the wrack, the Hagstone in it; over the pool in the cave's west end lamp smoke on the
// roof, and behind the fall of rock above it the dry ledge where the last one who came for the stone
// sat out the dark. One level, band 30-32; docs/areas/shelf.md §12.3 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

export const HAG_HOLE: MapDef = {
  id: 'hag_hole',
  name: 'Hag Hole',
  kind: 'dungeon',
  band: [30, 32],
  enclave: true,
  region: 'shelf',
  start: { x: 7, y: 14, facing: NORTH },
  // The cliff's dark rock wet through, the floor grey sand the tide leaves, the roof black.
  palette: { wall: '#4e5356', wallDark: '#2e3235', floor: '#6a675f', ceiling: '#1c1f21', door: '#4e5356', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#3a5a5e' },
  bare: true,
  rows: [
    '################',
    '################',
    '##..############',
    '###S############',
    '#~~.....~#######',
    '#~~.......######',
    '###.......######',
    '#######.########',
    '#######.########',
    '######..########',
    '#####~.#########',
    '######..~#######',
    '#######.########',
    '#######.########',
    '#######.########',
    '################',
  ],
  exits: [
    { x: 7, y: 14, to: 'downs_e4', tx: 3, ty: 7, tf: SOUTH, label: 'Out at the mouth onto the strand, the grey sand and the sea, and the down above.' },
  ],
  features: [
    // The mouth, the passage the tide floods and the narrows.
    { kind: 'event', x: 7, y: 13, id: 'hh_mouth', once: true, text: 'In under the cliff the light goes at once. The rock drips, and the sea talks somewhere ahead.' },
    { kind: 'event', x: 6, y: 10, id: 'hh_tide', once: true, text: 'Weed hangs on the walls at the height of a man\'s head. The tide fills the passage to there.' },
    { kind: 'event', x: 7, y: 9, id: 'hh_narrows', once: true, text: 'The passage narrows to one body\'s width. The dark past it is warm, and smells of what the sea leaves.' },
    // The cave at the passage's end, the wrack and the box in it.
    { kind: 'event', x: 7, y: 6, id: 'hh_cave', once: true, text: 'A cave the sea has hollowed, its floor wet sand and its pools black and still.' },
    { kind: 'event', x: 8, y: 5, id: 'hh_wrack', once: true, text: 'Wrack heaped where the sea leaves it: weed, staves and bones picked white. A box of black wood is wedged in it.' },
    { kind: 'chest', x: 9, y: 5, id: 'hh_box', gold: 0, items: ['hagstone'] },
    // The secret: lamp smoke over the pool, and the dry ledge behind the fall of rock above it.
    { kind: 'event', x: 3, y: 4, id: 'hh_smoke', once: true, text: 'Lamp smoke, old and black, on the roof over the pool. No lamp could stand in that water.' },
    { kind: 'event', x: 3, y: 2, id: 'hh_ledge', once: true, text: 'A dry ledge above the tide\'s reach, and on it a lamp burnt dry and a purse. Someone sat out the dark here.' },
    { kind: 'chest', x: 2, y: 2, id: 'hh_purse', gold: 500, items: [] },
  ],
  secrets: [{ x: 3, y: 3, hint: 'hh_smoke' }],
  encounters: [
    // The guardian: the Hag in the narrows, the one way to the cave, a boss at 32 that never comes back.
    { id: 'hh_hag', x: 7, y: 7, monsters: ['hag'], roams: false, boss: true, slainText: 'The Hag sinks into the wrack and is still, and the dark in the cave is only dark.' },
  ],
};
