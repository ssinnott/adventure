// Rimewater, box K12: Monks' Vale's east under the pass. Country, band 20-22, the bounds' first (#832):
// south of K11 the pines and the vale's grass running on to the rim, a spur of it cutting the box in two.
// In the west the vale's grass, a bear-hunter at his fire and a brother of stone with a riddle; in the
// pines two ice bears on their kill and four lynxes waiting on it; at the rim's foot a path of flat stones
// that stops at the rock, and behind the rock the cell where Fuar's folk walled up their kirk's plate
// when the loch rose. East of the spur, reached from K11 or L12 only, old pines and a cairn. The rim's
// face at 2,15, on the vale's land, is drawn as stone, the door into the Spittal, the Wakerobe's lair
// (docs/areas/rimewater.md §12.5).
// In from K11 (#497) over its north edge and from J12 (#508) over its west, square for square; the east
// edge meets L12's west (#832) square for square, and past the south edge the world ends.
// Laid whole in Loch Fuar, its larger zone, the vale's land played at the loch's band. Cut by hand from
// the atlas, the void written '%' and the rim's peaks drawn as its mountain, the peaks being the
// Whitespine's own (its novelty); docs/areas/rimewater.md §12.2 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const COLDMERE_K12: MapDef = {
  id: 'coldmere_k12',
  name: 'Loch Fuar',
  kind: 'outdoor',
  density: 'country',
  band: [20, 22],
  region: 'rimewater',
  start: { x: 8, y: 0, facing: SOUTH },
  rows: [
    '^^,,,pppppppppMMMMMMMMMppppppppp',
    '^,,,pppppppppppMMMMMMMMppppppppp',
    ',,,,pppppppppppMMMMMMMMppppppppp',
    ',,,ppppppppppppMMMMMMMMMpppppppp',
    ',,,pppppppppppppMMMMMMMMpppppppp',
    ',,ppppppppppppppMMMMMMMMpppppppp',
    ',,pppppppppppppppMMMMMMMMppppppp',
    ',,pppppppppppppppMMMMMMMMppppp^p',
    ',,pppppppppppppppMMMMMMMMM^^^^^M',
    ',pppppppppppppppppMMMMMMMM^MMMMM',
    ',pppppppppppppppppMMMMMMMMMMMMMM',
    'pppppppppppppMMppMMMMMMMMMMMMMMM',
    'pppppppppppMMMMMMMMMMMMMMMMMMMMM',
    'ppppppppMrSrMMMMMMMMMMMMMMMMMMMM',
    'pppppMMMMr.rrMMMMMMMMMMMMMMMMMMM',
    'pM"MMMMMMr..rMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMrrrrMMMMMMMMMMMMMMM%%%%',
    'MMMMMMMMMMMMMMMMMMMMMMMMM%%%%%%%',
    'MMMMMMMMMMMMMMMMMMMMMMM%M%%%%%%%',
    'MMMMMMMMMMMMMMMMMMMM%%%%%%%%%%%%',
    'MMMMMMMMMMMMMM%MMMMM%%%%%%%%%%%%',
    'MMMMMMMMMMMM%%%%%%%%%%%%%%%%%%%%',
    'MMMMMMMMMMM%%%%%%%%%%%%%%%%%%%%%',
    'MMMMMMMM%%%%%%%%%%%%%%%%%%%%%%%%',
    'MMMMMM%%%%%%%%%%%%%%%%%%%%%%%%%%',
    'MMMM%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    'MMM%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    'M%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
  ],
  exits: [
    // The door in the rim's face at 2,15, walked into from the vale's pines at 2,14: the Spittal, the
    // Wakerobe's lair (#832, docs/areas/rimewater.md §12.5).
    { x: 2, y: 15, to: 'spittal', tx: 7, ty: 1, tf: SOUTH, label: 'A door cut square in the rim\'s face, a bell-rope beside it worn smooth by hands. It is not barred.' },
  ],
  features: [
    // In from K11 under the pines, the vale's grass coming round from the west.
    { kind: 'event', x: 8, y: 1, id: 'k12_in', once: true, text: 'South of the pass the pines go on to the rim, and the vale\'s grass comes round under it from the west.' },
    // The vale's grass: the bear-hunter at his fire, and the brother of stone with his riddle.
    { kind: 'camp', x: 1, y: 5, name: 'The hunter\'s fire', text: 'A fire-ring in the lee of a knoll, banked with turf, a spear\'s butt-mark in the snow beside it.' },
    { kind: 'npc', x: 2, y: 5, name: 'A bear-hunter', lines: [
      'A bear-hunter at his fire, a spear across his knees, watching the pines.',
      '"The furrier at the lodge pays for a white skin. Two bears have a kill in there, and they keep it."',
      '"Four cats wait on it for the leavings, and they would sooner have me. I have the one spear."',
    ] },
    { kind: 'statue', x: 2, y: 9, id: 'k12_brother', name: 'A brother of stone', text: 'A brother cut in stone at the vale\'s edge, hooded, a finger to his lips. Words are cut below.', riddle: 'I HAVE A TONGUE AND NO MOUTH, AND I CALL THE BROTHERS IN. WHAT AM I?', answer: 'bell', gift: { stat: 'personality' }, done: 'The brother of stone at the vale\'s edge.' },
    // The pines: the bear's kill, the cats' tracks round it and the spur of the rim beyond.
    { kind: 'event', x: 13, y: 5, id: 'k12_kill', once: true, text: 'A stag dragged in under the pines and opened, the snow trodden flat round it and pink.' },
    { kind: 'event', x: 11, y: 9, id: 'k12_cats', once: true, text: 'Lynx tracks circle the pines at a distance from the kill, round and round, never closer.' },
    { kind: 'event', x: 16, y: 10, id: 'k12_spur', once: true, text: 'A spur of the rim runs north between the pines, sheer and grey, and its far side is out of sight.' },
    { kind: 'event', x: 6, y: 12, id: 'k12_rim', once: true, text: 'The rim stands over the pines, too steep for snow to lie on, and no path goes up it.' },
    // The secret: the path of flat stones that stops at the rock, and behind the rock the cell where
    // Fuar's folk walled up their kirk's plate when the loch rose, two squares in and a step east.
    { kind: 'event', x: 10, y: 12, id: 'k12_stones', once: true, text: 'Flat stones laid in the snow make a path from the pines to the rock face, and stop at it.' },
    { kind: 'event', x: 10, y: 14, id: 'k12_cell', once: true, text: 'A cell walled up in the rock, dry as a kist: Fuar\'s kirk plate wrapped in sacking, and a strongbox.' },
    { kind: 'chest', x: 11, y: 15, id: 'k12_strongbox', gold: 250, items: ['elixir'] },
    // East of the spur, reached from K11 or L12 only: the old pines and a cairn.
    { kind: 'event', x: 26, y: 2, id: 'k12_east', once: true, text: 'East of the spur the pines stand old and black, and the snow under them is unmarked.' },
    { kind: 'cairn', x: 28, y: 6, id: 'k12_cairn', text: 'A cairn of grey stones under the pines, a pilgrim\'s bell hung from a stick in its top.', gold: 120, items: ['potion_sp_great'] },
  ],
  secrets: [{ x: 10, y: 13, hint: 'k12_stones' }],
  encounters: [
    // Four lynxes in the pines nearer the way in, waiting on the bears' leavings, the gentler, at 20; and
    // the two ice bears on their kill, the hardest, at 21.
    { id: 'k12_cats', x: 9, y: 4, monsters: ['snow_lynx', 'snow_lynx', 'snow_lynx', 'snow_lynx'], aware: 3, respawn: 1440, roams: false },
    { id: 'k12_bears', x: 14, y: 7, monsters: ['ice_bear', 'ice_bear'], aware: 3, respawn: 2880, roams: false },
  ],
};
