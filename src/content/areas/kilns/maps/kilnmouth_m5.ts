// Kilnmouth, box M5: Kilnmouth's farms. Country, band 16-18: the drovers' track in off the smelter's
// ground on the east, west between the fields to the farmstead, its barn and its well; the lime pits in
// the ridge, where the worms bore the white stone; the long fields down to the shingle on the west,
// where the world ends at the sea, and the stream on from N5 to M6 under the hill. Behind the barn's
// end wall, a loft nobody goes into.
// Cut from the atlas by tools/scaffold.ts; docs/areas/kilns.md §4.15 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { WEST } from '../../../../game/types.ts';

export const KILNMOUTH_M5: MapDef = {
  id: 'kilnmouth_m5',
  name: 'Kilnmouth',
  kind: 'outdoor',
  density: 'country',
  band: [16, 18],
  region: 'kilns',
  start: { x: 31, y: 3, facing: WEST },
  rows: [
    'M,,,,,^^,,^^,,,,,,fffffffffff:::',
    'M,,,,,^^,,^^,,,,,,fffffffffff:::',
    'M,,,,,^^,,,,,,,,,,ffffffffffff::',
    'M,,,,,,^,,,,,,,^,,,fffffffffff::',
    'M,,,,,,,,,,,,,,,::::::::::::::::',
    'M,,,,,,BBBBBBBBB:,,fffffffffff::',
    'M,,,,,,B....S..B:,,,,ffffffffff:',
    'M,,,,,,BB.BBBBBB:^,,,fffffffffff',
    'M,,,,,,,:::::::::^,,,,ffffffffff',
    'M,,,BBB,,,,,,,,^^^^^,,ffffffffff',
    'M,,,BBB,,,,,,,^^^rrrrr^fffffffff',
    'M,,,,,,,,,,,,,,^^:::::^^ffffffff',
    'M,,,,,,,,,,,,,,^^^:::^^^ffffffff',
    'M,,,,,,,,,,,,,,^^^^^^^^^,fffffff',
    'M,,,,,,,,,,,,,,,^^^^^^^^^,ffffft',
    'M,,,,,,,,,,fffffff^^,,,,,,^^^^tt',
    'M,,,,,ffffffffffffff,,,,,^^^^,tt',
    'M,,,,ffffffffffffffff,,,^^^^,,tt',
    'M,,,ffffffffffffffffff,,,^^^,,tt',
    'M,,fffffffffffffffffff,,,^^^^ttt',
    'M,fffffffffffffffffffff,,^^^^ttt',
    'Mffffffffffffffffffffff,,^^^^ttt',
    'Mffffffffffffffffffffffff^^^^^tt',
    'Mffffffffffffffffffffffff^^^^^tt',
    '_ffffffffffffffffffffffffff^^^tt',
    '_ffffffffffffffffffffffffff^^^~~',
    '_ffffffffffffffffffffffffff^^~~~',
    '_fffffffffffffffffffffffffff~~~t',
    '_ffffffffffffffffffffffffff~~~^,',
    '_fffffffffffffffffffffffff~~~^^,',
    '_ffffffffffffffffffffffff~~~^^^,',
    '_ffffffffffffffffffffff~~~~f,,,^',
  ],
  features: [
    // In off the smelter's ground by the drovers' track, west between the fields.
    { kind: 'event', x: 27, y: 4, id: 'm5_track', once: true, text: 'The drovers\' track comes off the smelter\'s ground and runs west between the fields, trodden to white dust.' },
    // The farmstead: the barn, its swallows, the well and the woman at the churn.
    { kind: 'event', x: 16, y: 6, id: 'm5_swallows', once: true, text: 'Swallows in and out of a hole high in the barn\'s end wall, over and over, with mud for their nests.' },
    { kind: 'event', x: 10, y: 6, id: 'm5_barn', once: true, text: 'The barn: hay stacked to the rafters against a bare end wall of white stone. Not a swallow in here.' },
    { kind: 'event', x: 13, y: 6, id: 'm5_loft', once: true, text: 'Behind the end wall, nests along a beam, and under them in the droppings a strongbox, its key rusted in the lock.' },
    { kind: 'chest', x: 14, y: 6, id: 'm5_loft_chest', gold: 200, items: ['elixir'] },
    { kind: 'well', x: 5, y: 7, text: 'The farm\'s well, a bucket on a chain. The water is hard with lime and as cold as iron.' },
    { kind: 'npc', x: 5, y: 11, name: 'A woman at a churn', lines: [
      'A woman at a churn by the farmhouse door, her arms white to the elbow.',
      '"The ground was warm before ever there were kilns. My gran said so, and hers before her."',
      '"Lime in the butter, lime in the bread. You stop tasting it."',
    ] },
    // The lime pits in the ridge, and the hill over the stream.
    { kind: 'event', x: 19, y: 12, id: 'm5_pits', once: true, text: 'Lime pits dug into the ridge, the white faces cut back in steps and water standing milky in the bottoms.' },
    { kind: 'event', x: 27, y: 19, id: 'm5_hill', once: true, text: 'From the hill over the stream: Gluthutte\'s smoke to the east, the kilns\' to the south, and the farms between.' },
    { kind: 'event', x: 24, y: 28, id: 'm5_stream', once: true, text: 'The stream comes down under the hill over white stones, and a heron stands in it and does not move.' },
    { kind: 'event', x: 30, y: 30, id: 'm5_bank', once: true, text: 'On the stream\'s far bank under the hill, an otter\'s slide worn down the clay into the water.' },
    // The long fields down to the shingle.
    { kind: 'event', x: 16, y: 19, id: 'm5_kale', once: true, text: 'Kale in rows down the long field, every leaf white with dust, and the furrows running down to the shore.' },
    { kind: 'event', x: 12, y: 28, id: 'm5_scarecrow', once: true, text: 'A scarecrow in the turnips in a dwarf\'s helmet, dented, its crest knocked off. The crows sit on it.' },
    { kind: 'cairn', x: 5, y: 24, id: 'm5_cairn', text: 'A cairn of white field stones where the fields meet the shingle, a crab\'s shell on the top one.', gold: 100, items: ['potion_sp_great'] },
    { kind: 'event', x: 2, y: 29, id: 'm5_shore', once: true, text: 'The fields stop at a strip of white shingle, and past it the sea, grey, with nothing on it.' },
  ],
  secrets: [{ x: 12, y: 6, hint: 'm5_swallows' }],
  encounters: [
    // Two rock worms in the lime pits, boring the white stone: the box's group, at 17.
    { id: 'm5_worms', x: 20, y: 11, monsters: ['rock_worm', 'rock_worm'], aware: 3, respawn: 2880, roams: false },
  ],
};
