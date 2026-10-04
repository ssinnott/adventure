// The Kilns, box N6: the drove road's last reach. Country, band 16-18: the road on south from N5 out of
// the charcoal woods over the open grass to the fork, the branch west to Kilnhaven, and on south past
// the drovers' camp to the moor's first heather and Cairnmoor's border at the south edge; the coach's
// old halt by the road, and east the grass running to the hills under O6's smoking ridge.
// Cut from the atlas by tools/scaffold.ts; docs/areas/kilns.md §4.12 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const KILNSHEART_N6: MapDef = {
  id: 'kilnsheart_n6',
  name: 'The Kilns',
  kind: 'outdoor',
  density: 'country',
  band: [16, 18],
  region: 'kilns',
  start: { x: 12, y: 0, facing: SOUTH },
  rows: [
    '^,,ttttttttt=ttttttttt,,,,,,,,,,',
    '^^,,,ttttttt=tttttt,,,,,,,,,,,,,',
    '^,,,,,,tttt==tttttt,,,,,,,,,,,,,',
    ',,,,,,,,,,,=ttttt,,,,,,,,,,,,,,,',
    ',,,,,,,,,,==,,,,,,,,,,,,,,,,,,,,',
    ',,,,,,,,,,=,,,,,,,,,,,,,,,,,,,,,',
    ',,,,,,,,,==,,,,,,,,,,,,,,,,,,,,,',
    ',,,,,,,,,=,,,,,,,,,,,,,,,,,,,,,,',
    ',,,,,,,,==,,,,,,,,,,,,,,,,,,,,,,',
    ',,,,^^^^=,,,,,,,,,,,,,,,,,,,,,,,',
    ',,,,^^^==,,,,,,,,,,,,,,,,,,,,,,,',
    ',,,,,^^=,,,,,,,,,,,,,,,,,,,,,,,,',
    ',,,,,^==,^^,,,,,,,,,,,,,,,,,,,,,',
    ',,,,,,=,,^,,,,,,,,,,,,,,,,,,,,,,',
    ',,,,,,=,,^,,,,,,,,,,,,,,,,,,,,,,',
    ',,,,,==,,,,,,,,,,,,,,,,,,,,,,,,,',
    ',,,,,=,,,,,,,,,,,,,,,,,,,,,,,,,,',
    ',,,,==,,,,,,,,,,,,,,,,,,,,,,,,,,',
    '=====,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    ',,,,=,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    ',,,==,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    ',,,=,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    ',,,=,,,,,,,,,,,,,,,,,,,,,,hhhhhh',
    ',,,=,BBBB,,,,,,,,,,,,,,,hhhhhhhh',
    ',,,=,S..B,,,,,,,,,,,,,hhhhhhhhhh',
    '^,,=,BBBB,,,,,,,,,,,hhhhhhhhhhhh',
    '^,,=,,,,,,,,,,,,,,hhhhhhhhhhhhhh',
    '^^^=,,,,,,,,,,,,hhhhhhhhhhhhhhhh',
    '^,^=^,,^^^,,,,hhhhhhhhhhhhhhhhhh',
    '^,^=^^^^^^^,hhhhhh^^hhhhhhhhhhhh',
    '^^^=^^^^^^^^^^^hh^^^^^hhhhhhhhh^',
    '^^^=^^^^^^^^^^^^^^^^^^hhhhhhhh^^',
  ],
  features: [
    // Down the drove road out of the woods: the drovers' stone, and by day a dwarf caravan coming up.
    { kind: 'shrine', x: 9, y: 4, id: 'n6_shrine', text: 'A drovers\' stone by the road, a horseshoe set in its face and worn bright by hands going south.', stat: 'speed', done: 'The drovers\' stone, worn bright.' },
    { kind: 'event', x: 6, y: 13, id: 'n6_caravan', once: true, when: { hours: 'day' }, text: 'A dwarf caravan comes up the road, ore carts under tarpaulin and guards walking beside. They watch you by and do not stop.' },
    // The fork: the milestone, the drovers' camp and a drover with a rumour from Rime Lodge.
    { kind: 'event', x: 4, y: 18, id: 'n6_milestone', once: true, text: 'A milestone at the fork: ANVILHALL 13 up the road, KILNHAVEN 4 down the branch, and on its south face nothing.' },
    { kind: 'camp', x: 7, y: 18, name: 'The drovers\' camp', text: 'The drovers\' camp at the fork: a ring of stones, a turf windbreak and the grass grazed short all round.' },
    { kind: 'npc', x: 7, y: 20, name: 'A drover', lines: [
      'A drover by the fire, his dogs at his feet and his cattle on the grass behind him.',
      '"Rime Lodge? Something came up out of the ice there last winter. Stood on the shore a night, and went back down."',
      '"Nobody I know saw it. Everybody I know says so."',
    ] },
    // The grass east of the road, the herds' country, running to the hills under O6's ridge.
    { kind: 'event', x: 24, y: 5, id: 'n6_dewpond', once: true, text: 'A dew pond in the grass, lined with clay, the ground round it trodden to mud by cattle.' },
    { kind: 'event', x: 16, y: 15, id: 'n6_cattle', once: true, text: 'Black cattle on the grass, a drover\'s notch cut in every ear. They lift their heads and watch you go.' },
    { kind: 'event', x: 27, y: 14, id: 'n6_ridge', once: true, text: 'East, past the grass, the hills rise to a ridge that smokes from end to end. The air over it shakes.' },
    // The moor's first heather, coming in from the south-east, and the border on the road.
    { kind: 'event', x: 24, y: 23, id: 'n6_heather', once: true, text: 'The grass goes over to heather here, and the wind comes off the moor with nothing to stop it.' },
    { kind: 'event', x: 27, y: 28, id: 'n6_curlew', once: true, text: 'The heather runs south to the skyline. A curlew calls, once, and nothing answers.' },
    { kind: 'cairn', x: 6, y: 30, id: 'n6_cairn', text: 'A cairn by the road where the heather starts, a cattle skull on its top, facing south.', gold: 110, items: ['potion_sp_great'] },
    { kind: 'event', x: 3, y: 30, id: 'n6_border', once: true, text: 'The road goes on south into heather and wind. Cairns on the skyline, and no smoke anywhere.' },
    // The coach's old halt: the worn verge, the shelter's stopped door, and inside the bill.
    { kind: 'event', x: 4, y: 24, id: 'n6_verge', once: true, text: 'The verge here is worn wide and flat, as if wheels stood on it often. Nothing stops here now.' },
    { kind: 'event', x: 6, y: 24, id: 'n6_halt', once: true, text: 'A stone shelter, a bench along one wall. On the other a coach bill, faded: RIME LODGE, ALL WEATHERS.' },
    { kind: 'chest', x: 7, y: 24, id: 'n6_halt_chest', gold: 230, items: ['potion_heal'] },
  ],
  secrets: [{ x: 5, y: 24, hint: 'n6_verge' }],
  encounters: [
    // Fire beetles on the road's verge out of the woods, and at the far end a rock worm under the grass
    // by the heather, the box's top.
    { id: 'n6_beetles', x: 11, y: 9, monsters: ['fire_beetle', 'fire_beetle', 'fire_beetle', 'fire_beetle'], aware: 4, respawn: 1440 },
    { id: 'n6_worm', x: 13, y: 28, monsters: ['rock_worm'], aware: 2, respawn: 2880, roams: false },
  ],
};
