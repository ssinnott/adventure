// Rimewater, box L12: the rim south of Loch Fuar. Country, band 20-21, the bounds' second (#832): the
// pines of L11's south edge running on under the rim's mountain, a triangle of them narrowing to a point
// in the south-west, a dead end under the world's end. In the north the resin-gatherers' old fire, a
// spring that does not freeze and a cairn; along the rim's foot the bears' den-mouth trodden in the snow
// and, at the point, two ice bears denned under it; and where the pines are scored in long cuts, behind
// the rock, the gatherers' store. In the rim's face at 11,4 a cave goes down into Creag Fionn, the enclave
// (#845, docs/areas/rimewater.md §12.4). In from L11 (#497) over its north edge and from K12 (#832) over its
// west, square for square; past the east and south edges the rim stands and the world ends.
// Laid whole in Loch Fada, its larger zone. Cut by hand from the atlas, the void written '%', the pines at
// 16,0 drawn where the atlas has the rim, to meet L11's; docs/areas/rimewater.md §12.3 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { anchored } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';
import { RESPAWN } from '../../../../game/keys.ts';

export const LONGMERE_L12: MapDef = {
  id: 'longmere_l12',
  name: 'Loch Fada',
  kind: 'outdoor',
  density: 'country',
  band: [20, 21],
  region: 'rimewater',
  start: { x: 10, y: 0, facing: SOUTH },
  anchors: { from_creag_fionn: { x: 11, y: 3, facing: NORTH } },
  rows: [
    'pppppppppppppppppMMMMMMMMMMMMMMM',
    'ppppppppppppppMMMMMMMMMMMMMMMMMM',
    'ppppppppppppppMMMMMMMMMMMMMMMMMM',
    'pppppppppppppMMMMMMMMMMMMMMMMMMM',
    'ppppppppppM"MMMMMMMMMMMMMMMMMMMM',
    'ppppppMMMMMMMMMMMMMMMMMMMMMMMM%%',
    'ppprSrMMMMMMMMMMMMMMMMMMMMMM%%%%',
    'pMMr.rMMMMMMMMMMMMMMMMMMM%%%%%%%',
    'MMMr.rMMMMMMMMMMMMMMM%%%%%%%%%%%',
    'MMMrrrMMMMMMMMMMMMM%%%%%%%%%%%%%',
    'MMMMMMMMMMMMMMMMMM%%%%%%%%%%%%%%',
    'MMMMMMMMMMMMMMM%%%%%%%%%%%%%%%%%',
    'MMMMMMMMMM%%%%%%%%%%%%%%%%%%%%%%',
    'MMMMMMMM%%%%%%%%%%%%%%%%%%%%%%%%',
    'MMMM%%%M%%%%%%%%%%%%%%%%%%%%%%%%',
    'M%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
  ],
  // Creag Fionn, the enclave (#845): the cave in the rim's face at 11,4, walked into from the pines at 11,3.
  exits: [
    anchored({ x: 11, y: 4, to: 'creag_fionn', at: 'start', label: 'You stoop into a cave in the rim\'s face and down a ramp of packed snow, into dark that smells of wet fur.' }),
  ],
  features: [
    // The north: the resin-gatherers' old fire, a spring under the rim's foot that does not freeze, and
    // a cairn on the way down.
    { kind: 'camp', x: 13, y: 1, name: 'The gatherers\' fire', text: 'A ring of black stones under the pines, a tripod of poles over it and a ladle hung stiff on one.' },
    { kind: 'shrine', x: 16, y: 0, id: 'l12_spring', text: 'A spring comes out of the rim\'s foot and runs black over the stones, and the snow round it is bare.', stat: 'intellect', done: 'The spring under the rim, black and running.' },
    { kind: 'cairn', x: 8, y: 1, id: 'l12_cairn', text: 'A cairn of rim-stones in the pines, a gatherer\'s pot turned upside down on its top.', gold: 100, items: ['potion_sp_great'] },
    // The rim's face, and in the south-west the bears' den-mouth trodden in the snow.
    { kind: 'event', x: 6, y: 4, id: 'l12_rim', once: true, text: 'The rim goes straight up out of the pines, grey, and the wind off its top drags the snow out in a flag.' },
    { kind: 'event', x: 2, y: 5, id: 'l12_den', once: true, text: 'A hollow in the rim\'s foot, the snow trodden hard round its mouth, the pine roots bare and rank.' },
    // The secret: the pines scored in long cuts and the stack of empty pots under the rim; the search
    // there, and the gatherers' store dug into the rim's foot, a room of one by two with its door at the
    // north end.
    { kind: 'event', x: 4, y: 5, id: 'l12_cuts', once: true, text: 'The pines are scored in long cuts down their trunks, the resin dried in them, and under the rim stands a stack of empty pots.' },
    { kind: 'event', x: 4, y: 7, id: 'l12_store', once: true, text: 'A store dug into the rim\'s foot and turfed over: pots in rows on the floor, and a strongbox at the back.' },
    { kind: 'chest', x: 4, y: 8, id: 'l12_strongbox', gold: 200, items: ['elixir'] },
  ],
  secrets: [{ x: 4, y: 6, hint: 'l12_cuts' }],
  encounters: [
    // The box's one group and its hardest: a pair of ice bears denned under the rim at the point.
    { id: 'l12_bears', x: 1, y: 6, monsters: ['ice_bear', 'ice_bear'], aware: 3, respawn: RESPAWN.twoDays, roams: false },
  ],
};
