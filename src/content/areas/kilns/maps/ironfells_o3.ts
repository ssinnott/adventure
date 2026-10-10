// The Kilns, box O3: the Fells' east, behind Anvilhall. Country, band 16-18: bare hills in from N3's
// under the terraces, rising east into the high pines and the bare mountain, and past it the world's
// end; the hall's crag run on down the west edge, shutting the terraces and the gate off from this
// side; a rock worm's warren in the pines under the mountain, a pitch-burner's camp at the pines' foot,
// and a hunter's cache in a cleft at the end of a path that goes nowhere.
// Cut from the atlas by tools/scaffold.ts (its void the world's end at the north-east corner);
// docs/areas/kilns.md §4.15 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST } from '../../../../game/types.ts';

export const IRONFELLS_O3: MapDef = {
  id: 'ironfells_o3',
  name: 'The Iron Fells',
  kind: 'outdoor',
  density: 'country',
  band: [16, 18],
  region: 'kilns',
  start: { x: 1, y: 25, facing: EAST },
  rows: [
    'MM^^^^ppMMMMMMMMMMMM%%%%%%%%%%%%',
    'MM^^^^pppMMMMMMMMMMM%%%%%%%%%%%%',
    'MM^^^^ppppMMMMMMMMMMMM%%%%%%%%%%',
    'MM^^^^pppppMMMMMMMMMMMM%%%%%%%%%',
    'MM^^^^ppppppMMMMMMMMMMMMM%%%%%%%',
    'MM^^^^pppppppMMMMMMMMMMMMM%%%%%%',
    'MM^^^^^pppppppMMMMMMMMMMMM%%%%%%',
    'MM^^^^^ppppppppMMMMMMMMMMMM%%%%%',
    'MM^^^^^^ppppppppMMMMMMMMMMMM%%%%',
    'M^^^^^^^pppppppppMMMMMMMMMMMM%%%',
    'M^^^^^^^pppppppppMMMMMMMMMMMM%%%',
    'M^^^^^^^^pppppppppMMMMMMMMMMM%%%',
    'M^^^^^^^^^ppppppppprrrrMMMMMMM%%',
    'M^^^^^^^^^pppppppppS""rMMMMMMM%%',
    'M^^^^^^^^^ppppppppprrrrMMMMMMM%%',
    'M^^^^^^^^^^ppppppppppMMMMMMMMMM%',
    'M^^^^^^^^^pppppppppppMMMMMMMMMMM',
    'M^^^^^^^^^ppppppppppppMMMMMMMMMM',
    'M^^^^^^^^ppppppppppppppMMMMMMMMM',
    'M^^^^^^^^^ppppppppppppppMMMMMMMM',
    'M^^^^^^^^pppppppppppppppppMMMMMM',
    '^^^^^^^^^^pppppppppppppprppMMMMM',
    '^^^^^^^^^^pppppppppppppppppMMMMM',
    '^^^^^^^^^^pppppppppppprpprpMMMMM',
    '^^^^^^^^^^^ppppppppppppppppMMMMM',
    '^^^^^^^^^^^pppppppppppppppMMMMMM',
    '^^^^^^^^^^^^ppppppppppppppMMMMMM',
    '^^^^^^^^^^^^pppppppppppppMMMMMMM',
    '^^^^^^^^^^^^^^pppppppppppMMMMMMM',
    '^^^^^^^^^^^^^^pppppppppppMMMMMMM',
    'r^^^^^^^^^^^^^^ppppppppppMMMMMMM',
    'rr^^^^^^^^^^^^^pppppppppppMMMMMM',
  ],
  features: [
    // In from N3 over the hills under the terraces, the hall's crag along the west edge.
    { kind: 'event', x: 3, y: 24, id: 'o3_hills', once: true, text: 'Bare hills behind the hall, stony, rising east into pine. The hall\'s smoke stands over the crag to the west.' },
    { kind: 'event', x: 4, y: 5, id: 'o3_crag', once: true, text: 'The crag over the hall runs on east, sheer and black, and the wind comes down off it cold.' },
    { kind: 'cairn', x: 5, y: 14, id: 'o3_cairn', text: 'A cairn on the bare hill, an iron spike driven into its top and rusted to the stones.', gold: 120, items: ['potion_sp_great'] },
    // The high pines, and the mountain past them.
    { kind: 'event', x: 10, y: 6, id: 'o3_pines', once: true, text: 'The high pines, tall and straight as masts, their tops loud in the wind. Under them it is still, and dim at noon.' },
    { kind: 'event', x: 22, y: 28, id: 'o3_mountain', once: true, text: 'East the mountain stands up bare out of the pines, and past its shoulder there is only sky.' },
    // The rock worms' warren under the mountain.
    { kind: 'event', x: 22, y: 21, id: 'o3_warren', once: true, text: 'The ground under the pines heaved and broken, holes in it a man could stand in. Roots hang in them, chewed through.' },
    // The pitch-burner at his kiln, with a word on the worms.
    { kind: 'camp', x: 13, y: 26, name: 'The pitch-burner\'s camp', text: 'A pitch-burner\'s camp at the pines\' foot: a turf kiln smoking, tar in pots, pine roots stacked to dry.' },
    { kind: 'npc', x: 14, y: 28, name: 'A pitch-burner', lines: [
      'A pitch-burner at his kiln, black to the elbows. He does not get up.',
      '"The worms came up under the pines in my father\'s day. They eat the rock, and what stands on it."',
      '"The hall buys my pitch for its torches. Down there they never let one go out."',
    ] },
    // The path through the needles that ends at the rock, and the hunter's cache in the cleft behind it.
    { kind: 'event', x: 17, y: 13, id: 'o3_path', once: true, text: 'A path trodden through the needles to the foot of the rock, and no further.' },
    { kind: 'event', x: 20, y: 13, id: 'o3_cache', once: true, text: 'A dry cleft in the rock, a hunter\'s cache: snares on a peg, a bow-stave unstrung and a purse under a stone.' },
    { kind: 'chest', x: 21, y: 13, id: 'o3_cache_chest', gold: 180, items: ['potion_heal'] },
  ],
  secrets: [{ x: 19, y: 13, hint: 'o3_path' }],
  encounters: [
    // The warren's pair, under the pines at the mountain's foot: the box's one fight, and its top.
    { id: 'o3_worms', x: 23, y: 22, monsters: ['rock_worm', 'rock_worm'], aware: 2, respawn: 2880, roams: false },
  ],
};
