// Kilnmouth, box M6: the way to Kilnhaven. Country, band 16-18: the branch in from N6's fork, up
// through the farms and over the stream to the river's bank and west along it to Kilnhaven's gate;
// the lime kilns in a row on the hill over the fields, the lookout from its top over the port and the
// sea, and the grass under the hill running down to the shore.
// Cut from the atlas by tools/scaffold.ts; docs/areas/kilns.md §4.12 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { WEST } from '../../../../game/types.ts';

export const KILNMOUTH_M6: MapDef = {
  id: 'kilnmouth_m6',
  name: 'Kilnmouth',
  kind: 'outdoor',
  density: 'country',
  band: [16, 18],
  region: 'kilns',
  start: { x: 31, y: 18, facing: WEST },
  rows: [
    '_ffffffffffffffffffffff~~~~f,,,^',
    'ffffBBffffffffffffff~~~~~~ff,,,^',
    'ffffBBfffffffffff~~~~~~fffff,,^^',
    'fffffffffff==========ffffffff,,,',
    ':===========~~~~~fff==ffffff,,,,',
    '~~~~~~~~~~~~~~~ffffff==fffff,,,,',
    '~~~~~~~~~~~~~fffffffff==fff,,,,,',
    'ffff~~~~~~~ffffffffffff==ff,,,,,',
    'ffffffffffffffffffffffff==,,,,,,',
    'ffffffffffffffffffffffff,==,,,,,',
    'fffffffffffffffffffffff,,,==,,,,',
    'ffffffffffffffffffffff,,,,,=,,,,',
    'ffffffffffffffffffff,,,,,,,==,,,',
    'fffffffffffffffff,f,,,,,,,,,==,,',
    'f,ffffffffffff,,,,,,,,,,,,,,,==,',
    ',,fffffffffff,,,,,,,,,,,,,,,,,=,',
    ',,,,,,fffff,,,,,,,,,,,,,,,,,,,=,',
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,=,',
    ',,,,,,,,,,,,,,,,,,^^^^^^,,,,,,==',
    ',,,,,,,,,,,,,,,,:::::::::::,,,,,',
    ',,,,,,,,,,,,,,,,B:B:BSB:B:B,,,,,',
    ',,,,,,,,,,,,,,,^BBBBB.BBBBB^^,,,',
    ',,,,,,,,,,,,,,,^^^^^B.B^^^^^^^,,',
    ',,,,,,,,,,,,,,^^^^^^^B^^^,,,,^^,',
    ',,,,,,,,,,,,,,^^^^^^^^^^^,,,,^^,',
    ',,,,,,,,,,,,,,^^^^^^^^^^^^,,,^^^',
    ',,,,,,,,,,,,,^^^^^^^^^^^^^^^^^^^',
    ',,,,,,,,,,,,,^^^^^^^^^^^^^^^^^^^',
    ',,,,,,,,,,,,^^^^^^^^^^^^^^^^^^^^',
    ',,,,,,,,,,,,^^^^^^^^^^^^^^^^^^^^',
    ',,,,,,,,,,,^^^^^^^^^^^^^^^^^^^^^',
    ',,,,,,,,,,,^,,,^^^^^^^^^^^^^^^^^',
  ],
  features: [
    // Up the branch from N6: a lime cart by the road, a shrine at a field's corner and the bridge.
    { kind: 'event', x: 28, y: 14, id: 'm6_cart', once: true, text: 'A lime cart by the road, its wheels white to the hubs and its horse cropping the verge.' },
    { kind: 'shrine', x: 27, y: 4, id: 'm6_shrine', text: 'A limewashed stone at a field\'s corner, a posy of cornflowers at its foot. The farmers\' shrine.', stat: 'personality', done: 'The limewashed stone.' },
    { kind: 'event', x: 16, y: 3, id: 'm6_bridge', once: true, text: 'The road crosses the stream on a bridge of white stone, the parapets limed against the weather.' },
    // The farms: the farmer at his gate north of the road, the fields over the river, the barn.
    { kind: 'npc', x: 6, y: 3, name: 'A farmer at his gate', lines: [
      'A farmer at his gate, lime on his boots and on his hands, watching the road.',
      '"My boy went up to the Tiefzeche at harvest. Better money than lime, he said."',
      '"He writes. The letters come down with the ore. They say he is well and they say nothing else."',
    ] },
    { kind: 'event', x: 16, y: 11, id: 'm6_fields', once: true, text: 'Fields white with lime, spread to sweeten them, the furrows running down to the river.' },
    { kind: 'event', x: 4, y: 19, id: 'm6_barn', once: true, text: 'A field barn, its door off and its loft full of hay. Swallows go in and out over your head.' },
    // West along the river to the port.
    { kind: 'event', x: 2, y: 4, id: 'm6_port', once: true, text: 'The road runs on west along the river to Kilnhaven\'s wall. Gulls, and red ore dust on the wind.' },
    // The lime kilns in the hill: the row, the stopped one, and behind it the drover's cache.
    { kind: 'event', x: 21, y: 19, id: 'm6_kilns', once: true, text: 'Lime kilns in a row in the hillside, warm, each open at its draw-hole. One is stopped with a dressed stone.' },
    { kind: 'event', x: 21, y: 21, id: 'm6_cache', once: true, text: 'No lime in this kiln: a drover\'s cache, bolts of cloth and a strongbox with the Compact\'s seal on it, broken.' },
    { kind: 'chest', x: 21, y: 22, id: 'm6_cache_chest', gold: 250, items: ['seax+1'] },
    // The hill over the kilns, its quarry, and the grass running down to the shore.
    { kind: 'event', x: 22, y: 25, id: 'm6_lookout', once: true, text: 'From the kilns\' hill, Kilnhaven: a harbour wall, a quay black with ore and a ship at anchor. Then the sea.' },
    { kind: 'event', x: 12, y: 26, id: 'm6_quarry', once: true, text: 'A quarry in the hill\'s flank, the white stone cut back in steps and a sledge left at the face.' },
    { kind: 'cairn', x: 4, y: 26, id: 'm6_cairn', text: 'A cairn of white stones on the grass, the lime-burners\' mark scratched on the topmost.', gold: 150, items: ['potion_sp_great'] },
  ],
  secrets: [{ x: 21, y: 20, hint: 'm6_kilns' }],
  encounters: [
    // Fire beetles in the warm kilns at either end of the row, and a rock worm under the fields
    // past the river, the box's top.
    { id: 'm6_beetles_east', x: 25, y: 19, monsters: ['fire_beetle', 'fire_beetle', 'fire_beetle'], aware: 4, respawn: 1440 },
    { id: 'm6_beetles_west', x: 17, y: 19, monsters: ['fire_beetle', 'fire_beetle', 'fire_beetle'], aware: 4, respawn: 1440 },
    { id: 'm6_worm', x: 6, y: 12, monsters: ['rock_worm'], aware: 2, respawn: 2880, roams: false },
  ],
};
