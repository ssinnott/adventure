// Ashfall, box F9: the Sound's shore west of Cinderport. Country, band 24-25, behind the road: the bay's
// black sand and the fishers' hamlet on it, two huts, their boats and their racks; the grass between the
// Wold's hills and the ridge, the stone with a fish cut in it, the cairn on the west hill and the ash of
// the Waste coming up the slope from the south, where drakes hunt the seals; and in the ridge, where a
// path from the shore stops, the fishers' store behind the rock.
// In from F10 (#517) over its south edge, walked: F10's 0,0 to 31,0 meets 0,31 to 31,31 here square for
// square, the ash at 0 to 10 and the vines; and from the Wold's E9 (#534) over its west edge, walked, the
// sea, the sand, the grass at rows 8 to 14, the hills and the ash square for square with E9's 31,0 to
// 31,31, where the crossing line names Cindercoast. G9 is east of it; F8 is the sea.
// Cut from the atlas by tools/scaffold.ts; docs/areas/ashfall.md §4.10 is its brief (#522).
import type { MapDef } from '../../../../game/map.ts';
import { NORTH } from '../../../../game/types.ts';

export const CINDERCOAST_F9: MapDef = {
  id: 'cindercoast_f9',
  name: 'Cindercoast',
  kind: 'outdoor',
  density: 'country',
  band: [24, 25],
  region: 'ashfall',
  start: { x: 16, y: 31, facing: NORTH },
  rows: [
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '~~~WWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '~~~~~WWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '___~~~WWWWWWWWWWWWWWWWWWWWWWWWWW',
    ',,,__~~WWWWWWWWWWWWWWWWWWWWWWWWW',
    ',,,,_~~~WWWWWWWWWWWWWWWWWWWWWWWW',
    ',,,,,__~~WWWWWWWWWWWWWWWWWWWWWWW',
    ',,,,,,_~~WWWWWWWWWWWWWWWWWWWWWWW',
    ',,,,,,_~~~WWWWW~WW~WWWWWWWWWWWWW',
    ',,^^,,,_~~~W~~~~~~~~WWWWWWWWWWWW',
    ',^^^^,,,__~~~~~_~~_~~~WWWWWWWWWW',
    '^^^^^,,,,,_~___,__,_~~~~WWWWWWWW',
    '^^^^,,,BB,,,,,,,,,,,,^~~~WWW~WWW',
    '^^^^,,,,,,,,BB,,,,,,,^^^~~~~~~W~',
    '^^^^,,,,,,,,,,,,,,,,,^^^^~~~^~~~',
    '^^^^^,,,,,,,,,,,,,,,^^^^^^^^^_~_',
    '^^^^^^,,,,,,,,,,,,,^^^^^^^^^,,_,',
    '^^^^^^,,,,,,,,,,,,,^^^^^^^^^,,,,',
    '^^^^^^,,,,,,,,,,,,^^^^^^r^^^,,,,',
    '^^^^^^,,,,,,,,,,,,,^^^^r:r^^,,,,',
    '^^^^^^,,,,,,,,,,,,,,^^^rSr^^,,,,',
    'aaaaaa,,,,,,,,,,,,,,,^^^^^^^,,,,',
    'aaaaaa,,,,,,,,,,,,,,,^^^^^^^,,,,',
    'aaaaaa,,,,,,,,,,,,,,,^^^^^^,,,,,',
    'aaaaaaa,,,,,,,,,,,,,,,^^^^^,,,,,',
    'aaaaaaaaa,,,,,,,,,,,,,^^^^,,,&,,',
    'aaaaaaaaaa,,,&,&&&,&,,,^^^,&&&&&',
    'aaaaaaaaaaa&&&&&&&&&&&&&&&&&&&&&',
  ],
  features: [
    // In from F10's vines, the ash of the Waste giving out on the slope, and a seal the drake left.
    { kind: 'event', x: 16, y: 29, id: 'f9_in', once: true, text: 'Out of the vines onto grass, and past the grass, the Sound.' },
    { kind: 'event', x: 5, y: 27, id: 'f9_ash', once: true, text: 'The ash comes up out of the south this far, and the grass stops it.' },
    { kind: 'event', x: 11, y: 25, id: 'f9_seal', once: true, text: 'A seal on the grass, far from the water and half eaten. The grass round it is scorched in a ring.' },
    // The bay: the fishers' boats on the black sand, a fisherman at his door, the racks above the strand.
    { kind: 'event', x: 13, y: 15, id: 'f9_boats', once: true, text: 'Boats drawn up on the black sand, keels to the sea, nets spread over them to dry.' },
    { kind: 'npc', x: 9, y: 16, name: 'A fisherman', lines: [
      'A fisherman at a hut\'s door, mending a net, his hands black with tar to the wrist.',
      '"We sell in Cinderport. The Compact takes its tenth at the quay and calls it harbour dues."',
      '"The drakes come down off the mountain for the seals. Let them have the seals."',
    ] },
    { kind: 'camp', x: 10, y: 18, name: 'The racks', text: 'Racks of split fish drying in the wind, and a smoke-hut with its fire banked under turf.' },
    // The hills: the Wold to the west, the cairn on the west hill, the fish stone on the grass between.
    { kind: 'event', x: 2, y: 10, id: 'f9_wold', once: true, text: 'West, the grass rolls on over low hills to the Wold. Horses on it, far off.' },
    { kind: 'cairn', x: 2, y: 19, id: 'f9_cairn', text: 'A cairn on the hill\'s crown, a whale\'s rib stood up in the top of it.', gold: 100, items: ['potion_sp_great'] },
    { kind: 'shrine', x: 14, y: 22, id: 'f9_shrine', text: 'A standing stone with a fish cut in it, and salt crusted white in the cut.', stat: 'might', done: 'The fish stone. Salt in the cut, and now on your hand.' },
    // The ridge over the east shore, and the town along it.
    { kind: 'event', x: 22, y: 19, id: 'f9_ridge', once: true, text: 'From the ridge, east along the shore, the masts of Cinderport over its wall.' },
    // The secret: a path up the ridge from the shore, fish scales in it, stopping at a rock; the fishers'
    // store behind the rock, and what they keep from the Compact.
    { kind: 'event', x: 24, y: 26, id: 'f9_track', once: true, text: 'A path trodden up the ridge from the shore, fish scales in it. It stops at a rock.' },
    { kind: 'event', x: 24, y: 23, id: 'f9_store', once: true, text: 'A hole in the rock, dry. Casks of salt fish, and under them a box the Compact never saw.' },
    { kind: 'chest', x: 24, y: 23, id: 'f9_box', gold: 50, items: ['potion_sp_great', 'potion_heal'] },
  ],
  secrets: [{ x: 24, y: 24, hint: 'f9_track' }],
  encounters: [
    // The box's one fight: two drakes down on the Waste's ash at the slope's foot, hunting the shore.
    { id: 'f9_drakes', x: 3, y: 28, monsters: ['cinder_drake', 'cinder_drake'], aware: 5, respawn: 2880 },
  ],
};
