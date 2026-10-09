// Cairnmoor, box M7: the drovers' summer grazing. Country, band 18-19: the Cairnfield's grass west
// of the road under the Kilns' hills, off the road; in from N7's heather and the snow at its edge, and
// from M6's grass and hills over the Kilns' farms; the shielings on the grass under the hills, the
// sheep on them and the hounds' marks by the shore; the hills across the middle with the drovers'
// cairn; and in the south the fold, round, of grey stones, and the dead ewe the ravens are at. West,
// the sea and L7's coast, cut.
// Cut from the atlas by tools/scaffold.ts; docs/areas/cairnmoor.md §4.7 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { WEST } from '../../../../game/types.ts';

export const CAIRNFIELD_M7: MapDef = {
  id: 'cairnfield_m7',
  name: 'The Cairnfield',
  kind: 'outdoor',
  density: 'country',
  band: [18, 19],
  region: 'cairnmoor',
  start: { x: 31, y: 24, facing: WEST },
  rows: [
    ',,,,,,,,,,,^,,,^^^^^^^^^^^^^^^^,',
    ',,,,,,,,,,,,,,,,^^^^^^^^^^^^^^,,',
    ',,,,,,,,,,,,,,,,,,,^^^^^^^^^^,,,',
    ',,,,,,,,,,,,,,,,,,,^^^^^^^^^^,,,',
    ',,,,,,,,,,,,,,,,,,,,^^^^^^^^^,,,',
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    ',,,,,,,,BB,,B,,,,,,,,,,,,,,,,h**',
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,,hh**',
    ',,,,,,,,,,,,,,,,,,,,,,,,,,hhhhhh',
    ',,,,,,,,,,,,,,,,,,,,,,,,,hhhhhhh',
    '_,,,,,,,,,,,,,,,hhhhhh,,hhhhhhhh',
    '~__,,,,,,,,,,hhhhhhhhhhhhhhhhhhh',
    '~~~__,,,,,,,hhhhhhhhhhhhhhhhhhh^',
    'W~~_~_,,,,,,hhhhhhhhhhhhh^^^^^^^',
    'WW~~~_,,,,,hhhhh^^^^^^^^^^^^^^^^',
    'WWW~~~_,,,,^^^^^^^^^^^^^^^^^^^^^',
    'WWWW~~_,,,^^^^^^^^^^^^^^^^^^hhhh',
    'WWWWW~~_,,^^^^^^^^^^^^^^^hhhhhhh',
    'WWWWW~~_,^^^^^^^^^^^^^^^hhhhhhhh',
    'WWWWWW~~_,^^^^^^^^^^hhhhhhhhhhhh',
    'WWWWWW~~_,,^^^^,,hhhhhhhhhhhhhhh',
    'WWWWWWW~~_,,,,,,hhhhhhhhhhhhhhhh',
    'WWWWWWW~~_,,,,,,hhhhhhhhhhhhhhhh',
    'WWWWWWW~~_,,rrrrrrrhhhhhhhhhhhhh',
    'WWWWWWW~~__,r:r,,,rhhhhhhhhhhhhh',
    'WWWWWWWW~~~_r:S,,,,hhhhhhhhhhhhh',
    'WWWWWWWWW~~_rrr,,,rhhhhhhhhhhhhh',
    'WWWWWWWWW~~_,,rrrrrhhhhhhhhhhhhh',
    'WWWWWWWWW~~_,,,,,,,hhhhhhhhhhhhh',
    'WWWWWWWWW~~_,,,,,,,hhhhhhhhhhhhh',
    'WWWWWWWWW~~_,,,,,,,,hhhhhhhhhhhh',
    'WWWWWWWWW~~_,,,,,,,,hhhhhhhhhhhh',
  ],
  features: [
    // Under the Kilns' hills: their farms north, the sheep of the grazing on the hill, the old snow
    // at the moor's edge by N7; the drovers' shielings and their fire, the shepherd at them, who knows
    // where the fold's stones came from; and the hounds' marks by the shore.
    { kind: 'event', x: 6, y: 1, id: 'm7_kilns', once: true, text: 'North, the Kilns\' farms run down to the sea, their walls grey on the green.' },
    { kind: 'event', x: 20, y: 3, id: 'm7_sheep', once: true, text: 'Black-faced sheep on the hill, a red mark on every shoulder: the drovers\' own.' },
    { kind: 'event', x: 30, y: 7, id: 'm7_snow', once: true, text: 'Old snow in a hollow at the moor\'s edge, grey with grit.' },
    { kind: 'event', x: 9, y: 7, id: 'm7_shielings', once: true, text: 'The drovers\' shielings: low huts of turf on stone, a peat stack at each door.' },
    { kind: 'camp', x: 10, y: 7, name: 'The shielings', text: 'The drovers\' fire before the shielings, ringed with stones, a peat stack to hand.' },
    { kind: 'npc', x: 10, y: 6, name: 'A shepherd', lines: [
      'A shepherd at the shielings, an old dog flat in the grass at his feet.',
      '"Black dogs come down off the moor by night for the ewes. Mine will not go out to them."',
      '"The fold is my grandfather\'s. He built it out of an old cairn. Said the stones were lying spare."',
    ] },
    { kind: 'event', x: 5, y: 11, id: 'm7_tracks', once: true, text: 'Paw marks in the soft ground by the shore, each as broad as a hand.' },
    // The hills across the middle, the moor seen from them and the drovers' cairn on the top (#45).
    { kind: 'event', x: 24, y: 15, id: 'm7_view', once: true, text: 'From the hills the moor rises east to the ring, and north the Kilns\' smoke lies on the sky.' },
    { kind: 'cairn', x: 17, y: 17, id: 'm7_cairn', text: 'A drovers\' cairn on the hill, a stone for every crossing, the top ones new.', gold: 120, items: ['potion_sp_great'] },
    // South, the shore; the ewe the ravens are at; and the fold, built of an old cairn's stones, one
    // with the hill folk's cup and rings on it, and behind it the cairn's own cist, walled in.
    { kind: 'event', x: 10, y: 21, id: 'm7_shore', once: true, text: 'The grass gives out on grey sand, and past it the sea, as grey.' },
    { kind: 'event', x: 22, y: 24, id: 'm7_ewe', once: true, text: 'A ewe dead in the heather, her eyes gone, the ravens walking round her.' },
    { kind: 'event', x: 18, y: 25, id: 'm7_fold', once: true, text: 'A sheepfold, round, its grey stones head high, a hurdle across its gap.' },
    { kind: 'event', x: 15, y: 25, id: 'm7_cupmark', once: true, text: 'Low in the fold\'s back wall, one stone has a cup cut in it, and rings round the cup.' },
    { kind: 'event', x: 13, y: 25, id: 'm7_cist', once: true, text: 'Behind the wall, a cist of four slabs. In it, bones, and gold rings slipped from the fingers.' },
    { kind: 'chest', x: 13, y: 24, id: 'm7_rings', gold: 160, items: [] },
    { kind: 'event', x: 11, y: 29, id: 'm7_wrack', once: true, text: 'Wrack along the tide line, and the ribs of a boat sunk in the sand.' },
    { kind: 'event', x: 24, y: 29, id: 'm7_peat', once: true, text: 'A peat bank cut into the heather, the turves stood up in fours to dry.' },
  ],
  secrets: [{ x: 14, y: 25, hint: 'm7_cupmark' }],
  encounters: [
    // The ravens at the dead ewe by the fold, and by night the moor hounds down off the moor onto the
    // grazing below the shielings.
    { id: 'm7_ravens', x: 23, y: 25, monsters: ['raven', 'raven', 'raven', 'raven', 'raven'], aware: 4, respawn: 1440, roams: false },
    { id: 'm7_hounds', x: 14, y: 9, monsters: ['moor_hound', 'moor_hound', 'moor_hound'], aware: 5, respawn: 2880, when: { hours: 'night' } },
  ],
};
