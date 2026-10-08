// Cairnmoor, box N7: the road up onto the moor. Core, band 18: the drove road on south from the
// Kilns' N6 over the low hills, the milestone on their top and the drovers' shelter at their foot;
// the moor beyond under its first snow, with the first cairn by the road, the ravens on it and a
// stone under it that lifts; the peat-cutter's track east for the ring; the marsh beside the road
// where the bog bodies come up out of the peat; and the road on south for N8.
// Cut from the atlas by tools/scaffold.ts; docs/areas/cairnmoor.md §4.2 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const HIGHMOOR_N7: MapDef = {
  id: 'highmoor_n7',
  name: 'High Moor',
  kind: 'outdoor',
  density: 'core',
  band: [18, 18],
  region: 'cairnmoor',
  start: { x: 3, y: 0, facing: SOUTH },
  rows: [
    ',,,=,^^^^^^^^^^^^,,^^^hhhhhhhh^^',
    ',,,=,,,,^^^^^^^^^,,,^,,hhhhh,,,^',
    ',,,=,,,,^^^^**^^^,,,,,,,,,,,,,,^',
    ',,,==,,,^^^^**^^^,,,,,,,,,,,,,,^',
    ',,,,=,,,,,^^*,^^^^,,,,,rrrr,,,,^',
    ',,,,=,,,,,,,,,^^^^,,,,,r,,r,,,^^',
    '**,,=^^^^,,,,^^^^^^,,,,r,rr,,^^^',
    '**,,=^^^^,,,,^^^^^,,,,,,,,,,,^^^',
    'h,,,=^^^^,,,,,^^^^,,,,,,,^^^^^^^',
    'hh,,=,,^^,,,,,^^^^^^^^^^^^^^^^^^',
    'hhh,=,,,,^^^^^^^^^^^^**^^^^^^^^^',
    'hh^^==^^^***^^^^^^^^^^***^^^^^^,',
    '^^^^^=^^^^***^^^^^^^^^^*^*,,,,,,',
    '^^^^^=^^*^^*^^^^^^^^,,,,,,,,,,,h',
    '^^^^^=^**^^^^^^^^,,,,,,,,,,,,,,h',
    '^^^^^=rrr^hhhhhhhh,,,,,,,,,,,hhh',
    'hhhh^=hhhhhhh**hhh,,,,,,,,,,**hh',
    'h**hh=hhhhhhh***hhh,,,,,,,hhh**h',
    'hh**h=hhhhhhhhhhhhhhh***hhhhhh*h',
    'hhhhh==hhhhhhhhhhhhhhh***hhhhhhh',
    'hhhhhh=::::::::::hhhhhh*hhhhhhhh',
    'hhhhhh=hrrrhhhhh:::::::::hhhhhhh',
    'hhhhhh=hr:rhhh**hhhhhhhh::::::::',
    'hh**hh=hrSrhhhh*hhhhhhhhhhhhhhhh',
    'h***hh=hwwhwhhhhhhhhhhhhhhh**hhh',
    'hh*hhh=wwwwwwwwhhhh**hhhhh****hh',
    'hhhhhh=wwwwwwwwwhh****hhhhh**hhh',
    'hhhhhw=wwwwwwwwwwhh**hhhhhhhhhhh',
    'hhhhhw==wwwwwwwwwhhhhhhhhhhhhhhh',
    'h**hhww=wwwwwwwwhhhhhhhh**hhhhhh',
    'hh**hww=wwwwwwwhh**hhhhhh***hhhh',
    'hh*hhhw=wwwwwwhhhh**hhhhhhhhhhh~',
  ],
  features: [
    // Up out of the Kilns over the low hills: the drove's tracks, the first snow in a hollow, a fold,
    // the boundary stone, and behind, the ridge that smokes.
    { kind: 'event', x: 2, y: 5, id: 'n7_drove', once: true, text: 'The drove has trodden the grass to black mud here, frozen hard in every hoofprint.' },
    { kind: 'event', x: 12, y: 3, id: 'n7_first_snow', once: true, text: 'Old snow in a hollow of the hills, grey under its crust. There was none behind.' },
    { kind: 'event', x: 25, y: 1, id: 'n7_grouse', once: true, text: 'A grouse goes up from under your feet and away low over the heather: GO-BACK, GO-BACK.' },
    { kind: 'event', x: 29, y: 3, id: 'n7_ridge', once: true, text: 'Behind, to the north-east, the ridge still smokes. The snow stops short of it.' },
    { kind: 'event', x: 24, y: 7, id: 'n7_fold', once: true, text: 'Boulders rolled into a ring in the lee of the hill, a fold for the herds. Empty, the dung in it frozen.' },
    { kind: 'event', x: 9, y: 8, id: 'n7_march', once: true, text: 'A boundary stone in the grass: a hammer cut in its north face, and in its south a cup.' },
    // The hills' top: the snow on the crest, and the moor opening east.
    { kind: 'event', x: 11, y: 12, id: 'n7_crest', once: true, text: 'Snow in the dips of the hills\' top, packed hard by a wind that does not stop.' },
    { kind: 'event', x: 24, y: 12, id: 'n7_moor', once: true, text: 'The hills end here. South and east the moor runs on, white and brown, to the rim.' },
    // Where the hills give out: the milestone and the coach going by it, the drovers' shelter, a drover
    // in it with his rumour, and the hill folk's cup-stone.
    { kind: 'event', x: 5, y: 15, id: 'n7_milestone', once: true, text: 'A milestone where the hills give out: RIME LODGE 6 on its south face, ANVILHALL 15 on its north.' },
    { kind: 'event', x: 5, y: 15, id: 'n7_coach', once: true, when: { hours: 'day' }, text: 'A coach comes down off the hills at a trot, its blinds down, and goes by the milestone without slowing.' },
    { kind: 'camp', x: 6, y: 16, name: 'The drovers\' shelter', text: 'The drovers\' shelter at the hills\' foot: boulders in a row against the wind, and old ash.' },
    { kind: 'npc', x: 7, y: 16, name: 'A drover', lines: [
      'A drover in the lee of the wall, wrapped to the eyes, his dog pressed against his legs.',
      '"The lights were out over the bog last night. All of them."',
      '"And the ring was lit. Nobody goes up to the ring."',
    ] },
    { kind: 'shrine', x: 1, y: 19, id: 'n7_shrine', text: 'A stone of the hill folk\'s in the heather, a cup cut in its top and snow in the cup.', stat: 'intellect', done: 'The cup-stone, snow in its cup.' },
    // The fork, and the peat-cutter's track east over the moor toward the ring.
    { kind: 'sign', x: 7, y: 20, text: 'THE CUTTINGS. KEEP TO THE TRACK.' },
    { kind: 'event', x: 13, y: 20, id: 'n7_peat', once: true, text: 'Peat stacked to dry along the track, each stack thatched with heather against the snow.' },
    { kind: 'event', x: 20, y: 21, id: 'n7_cuttings', once: true, text: 'Old cuttings beside the track, square and black, water standing in them under ice.' },
    { kind: 'event', x: 28, y: 22, id: 'n7_ring', once: true, when: { hours: 'day' }, text: 'The track runs on east over the moor. On a rise ahead stands a ring of stones.' },
    { kind: 'event', x: 28, y: 22, id: 'n7_lights', once: true, when: { hours: 'night' }, text: 'East, round a rise on the moor, lights drift low over the snow, where nobody walks.' },
    // The first cairn by the road: its cache, the ravens' mark on it, and under it the drovers' own.
    { kind: 'cairn', x: 9, y: 24, id: 'n7_cairn', text: 'The moor\'s first cairn, waist high, its stones grey with lichen.', gold: 260, items: ['potion_sp_great'] },
    { kind: 'event', x: 9, y: 24, id: 'n7_droppings', once: true, text: 'The cairn\'s top is white with droppings, and black feathers lie caught in its chinks.' },
    { kind: 'event', x: 9, y: 22, id: 'n7_hollow', once: true, text: 'Under the cairn, a hollow lined with flat stones, dry as a cupboard. A purse, and a hammer in oiled cloth.' },
    { kind: 'chest', x: 9, y: 22, id: 'n7_cache', gold: 1150, items: ['forge_hammer+1'] },
    // The marsh beside the road, the moor west of it, and south the field of cairns on the skyline.
    { kind: 'event', x: 11, y: 27, id: 'n7_steps', once: true, text: 'Peat cut away in steps down to black water. On the lowest step, a handprint, its fingers to the bank.' },
    { kind: 'event', x: 2, y: 25, id: 'n7_prints', once: true, text: 'Prints in the snow, each wider than a hand, going round in a ring and away south.' },
    { kind: 'event', x: 20, y: 28, id: 'n7_spring', once: true, text: 'A spring comes up under a lip of turf, black and quick, and has not frozen.' },
    { kind: 'event', x: 27, y: 27, id: 'n7_cairnfield', once: true, text: 'South, the moor runs on to a field of cairns, a score of them, dark on the snow. Nothing sits on any.' },
  ],
  secrets: [{ x: 9, y: 23, hint: 'n7_droppings' }],
  encounters: [
    // Ravens on the first cairn; bog bodies out of the peat in the marsh beside the road, two groups;
    // and on the road's southern reach by night, three moor hounds, the box's group at 19.
    { id: 'n7_ravens', x: 11, y: 22, monsters: ['raven', 'raven', 'raven', 'raven', 'raven', 'raven', 'raven', 'raven'], aware: 4, respawn: 1440, roams: false },
    { id: 'n7_bodies_north', x: 9, y: 26, monsters: ['bog_body', 'bog_body', 'bog_body', 'bog_body'], aware: 2, respawn: 1440 },
    { id: 'n7_bodies_south', x: 13, y: 29, monsters: ['bog_body', 'bog_body', 'bog_body', 'bog_body'], aware: 2, respawn: 1440 },
    { id: 'n7_hounds', x: 7, y: 31, monsters: ['moor_hound', 'moor_hound', 'moor_hound'], aware: 5, respawn: 2880, when: { hours: 'night' } },
  ],
};
