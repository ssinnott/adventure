// Cairnmoor, box P7: the hills under the rim. Country, band 18-19, the bounds' first (#834): the hills
// of O7's east edge running on under deep snow to the rim, a block of them in the north with the herds'
// bothy, an old herd, a cairn and the ravens on the crag; the narrows down the rim's foot past a stone set
// on end; and in the south the long cairns of the old folk, three of them walking, and a ledge of white
// pebbles. The secret is the hill folk's earth-house behind the rock face, where the wind hoots. The rim's
// face at 5,24 is left bare for the lair's door (docs/areas/cairnmoor.md §12.5). O7's corner is shut
// with P6's: P7's north edge and its 0,0 are mountain, as O7's 31,0 is since (§9, #834's 3).
// The P column is 24 wide: cut by hand from the atlas, the void written '%'; docs/areas/cairnmoor.md
// §12.2 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST } from '../../../../game/types.ts';

export const HIGHMOOR_P7: MapDef = {
  id: 'highmoor_p7',
  name: 'High Moor',
  kind: 'outdoor',
  density: 'country',
  band: [18, 19],
  region: 'cairnmoor',
  start: { x: 0, y: 4, facing: EAST },
  rows: [
    'MMMMMMMMMM%%%%%%%%%%%%%%',
    '^MM^^^^^^M%%%%%%%%%%%%%%',
    '^^^^^^^^^^M%%%%%%%%%%%%%',
    '^^^^^^^^^^M%%%%%%%%%%%%%',
    '^^^^^^^^^^M%%%%%%%%%%%%%',
    '^^^^^^^^^M%%%%%%%%%%%%%%',
    '^^^^^^^^^M%%%%%%%%%%%%%%',
    '^^M^^^^^^^M%%%%%%%%%%%%%',
    '^^MMMrSrrMM%%%%%%%%%%%%%',
    '^^MMMr..rMM%%%%%%%%%%%%%',
    '^^MMMMr.rMM%%%%%%%%%%%%%',
    '^MMMMMrrrMM%%%%%%%%%%%%%',
    '^MMMMMMMMMM%%%%%%%%%%%%%',
    '^MMMMMMMMMM%%%%%%%%%%%%%',
    '^MMMMMMMMMM%%%%%%%%%%%%%',
    '^MMMMMMMMMM%%%%%%%%%%%%%',
    '^^MMMMMMMMM%%%%%%%%%%%%%',
    '^^MMMMMMMM%%%%%%%%%%%%%%',
    '^^^MMMMMMMM%%%%%%%%%%%%%',
    '^^^^MMMMMMM%%%%%%%%%%%%%',
    '^^^^MMMMMMM%%%%%%%%%%%%%',
    '^^^^MMMMMMMM%%%%%%%%%%%%',
    '^^^^^MMMMMMMMMM%%%%%%%%%',
    '^^^^^MMMMMMMMM%%%%%%%%%%',
    '^^^^^MMMMMMMMM%%%%%%%%%%',
    '^^^^^MMMMMMMMM%%%%%%%%%%',
    '^^^^^MMMMMMMM%%%%%%%%%%%',
    '^^^^^MMMMMMMM%%%%%%%%%%%',
    '^^^^^MMMMMMM%%%%%%%%%%%%',
    '^^^^^MMMMMMM%%%%%%%%%%%%',
    'M^^^MMMMMMMM%%%%%%%%%%%%',
    'M^^^MMMMMMMM%%%%%%%%%%%%',
  ],
  features: [
    // In over the hills from O7, the same moor.
    { kind: 'event', x: 1, y: 4, id: 'p7_hills', once: true, text: 'The hills climb on east under deep snow and stop at the rim. Few come up this far.' },
    // The north: the herds' bothy and the old herd at its door, the cairn on the last rise.
    { kind: 'camp', x: 2, y: 2, name: 'The herds\' bothy', text: 'A bothy of turf and stone in a fold of the hills, its roof patched with heather. Someone summers here.' },
    { kind: 'npc', x: 3, y: 2, name: 'An old herd', lines: [
      'An old herd in a plaid at the bothy\'s door, a crook across his knees and snow in his beard.',
      '"My folk went up to the tops when their time came. They lie along the rim\'s foot, past the narrows."',
      '"Some of them do not lie still."',
    ] },
    { kind: 'cairn', x: 7, y: 2, id: 'p7_cairn', text: 'A cairn on the last rise before the rim, every stone of it carried up from the moor.', gold: 120, items: ['potion_sp_great'] },
    // The secret: the wind hooting at the rock face, and the earth-house behind it, bending into the hill.
    { kind: 'event', x: 6, y: 7, id: 'p7_hoot', once: true, text: 'The wind hoots at the rock face here, low and steady, like breath across the mouth of a jar.' },
    { kind: 'event', x: 6, y: 9, id: 'p7_house', once: true, text: 'A passage of laid slabs bends away into the hill, dry and still: an earth-house of the hill folk.' },
    { kind: 'chest', x: 7, y: 10, id: 'p7_house_chest', gold: 250, items: ['elixir'] },
    // The narrows down the rim's foot, and the stone set on end in them.
    { kind: 'statue', x: 0, y: 13, id: 'p7_stone', name: 'A stone on end', text: 'A stone set on end in the narrows, taller than a man and grey with lichen. Words are cut below.', riddle: 'EVERY ONE WHO PASSES GIVES ME A STONE, AND I GROW. WHAT AM I?', answer: 'cairn', gift: { stat: 'luck' }, done: 'The stone on end in the narrows.' },
    // The south: the long cairns of the old folk, and the ledge of white pebbles.
    { kind: 'event', x: 1, y: 19, id: 'p7_graves', once: true, text: 'Long cairns lie along the rim\'s foot, each the length of a man, snow on their backs.' },
    { kind: 'shrine', x: 1, y: 29, id: 'p7_pebbles', text: 'A ledge in the rim\'s face, and along it a row of white quartz pebbles, one for each of the dead.', stat: 'endurance', done: 'The ledge of white pebbles.' },
  ],
  secrets: [{ x: 6, y: 8, hint: 'p7_hoot' }],
  encounters: [
    // Seven ravens on the crag in the north, the gentler, at 18; and three of the old folk walking at
    // their long cairns in the south, the hardest, at 19.
    { id: 'p7_ravens', x: 8, y: 5, monsters: ['raven', 'raven', 'raven', 'raven', 'raven', 'raven', 'raven'], aware: 3, respawn: 1440 },
    { id: 'p7_wights', x: 3, y: 20, monsters: ['cairn_wight', 'cairn_wight', 'cairn_wight'], aware: 3, respawn: 1440, roams: false },
  ],
};
