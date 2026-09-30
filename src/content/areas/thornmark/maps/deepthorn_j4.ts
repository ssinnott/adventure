// The Deepthorn, box J4: the Hoarhills' end. Country, band 8-10: the long glade down the box's west
// side, carrying the road from Henlys (I4) on to the head; the Hoarhills' last crag over Sunder Bay,
// with Sunderwood's dead wood white across the water; the Eaves' forest north-east of the ridge,
// closed, its dead wood painted over as forest so that dead wood is still new in Sunderwood; and the
// bay shore east to the box's edge. Cut from the atlas by tools/scaffold.ts; docs/areas/thornmark.md
// §4.5 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST, WEST } from '../../../../game/types.ts';
import { TEAR_CLOSED } from './grove2.ts';

export const DEEPTHORN_J4: MapDef = {
  id: 'deepthorn_j4',
  name: 'The Deepthorn',
  kind: 'outdoor',
  density: 'country',
  band: [8, 10],
  region: 'thornmark',
  start: { x: 1, y: 12, facing: EAST },
  rows: [
    'MMMMMTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'MMMMMMTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TMMMMMTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TMMMMMMTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TTMMMMMTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TTMMMMMMTTTTTTTTTTTTTTTTTTTTTTTT',
    'TTTMMMMMTTTTTTTTTTTTTTTTTTTTTTTT',
    'TTTTMMMMTTTTTTTTTTTTTTTTTTTTTTTT',
    ',TTTTMMMMTTTTTTTTTTTTTTTTTTTTTTT',
    ',,,^TTMMMTTTTTTTTTTTTTTTTTTTTTTT',
    ',,,,TTTMMMTTTTTTTTTTTTTTTTTTTTTT',
    ',,,,,TTMMMMTTTTTTTTTTTTTTTTTTTTT',
    ':::::^^TMMMTTTTTTTTTTTTTTTTTTTTT',
    ',,,,:,^^MMMMTTTTTTTTTTTTTTTTTTTT',
    ',,,,:,^^^MMMMTTTTTTTTTTTTTTTTTTT',
    ',,,,:,,^^MMMMM^^,,TTTTTTTTTTTTTT',
    ',,,,:,,^^^MM,M^^,,,,,TTTTTTTTTTT',
    ',,,,:,,,^^MM,M^^,,,,,,,^^TT,____',
    ',,,,:,,,^^^MS^^^,,,,,,,,^,,_~~~~',
    ',,,,:,,,^^^^^^^,,,,,,,,,,~~~~~~~',
    'T,,,:,,,,^^^^,,,____~~~~~~~~WWWW',
    'T,,,:::::::::::_~~~~~~~~~WWWWWWW',
    'T,,,:,,,,,,,,,_~~~~~WWWWWWWWWWWW',
    'T,,,:,,,,,,,,,_~~WWWWWWWWWWWWWWW',
    'TT,,:,,,,,,,__~~WWWWWWWWWWWWWWWW',
    'TT,,:,,,,,,_~~~WWWWWWWWWWWWWWWWW',
    'TT,,:,,,,,,_~~WWWWWWWWWWWWWWWWWW',
    'TT,,:,,,,,,_~~WWWWWWWWWWWWWWWWWW',
    'TT,,:,,,,,_~~WWWWWWWWWWWWWWWWWWW',
    'TT,,:,,,,,_~~WWWWWWWWWWWWWWWWWWW',
    'TT,,:,,,,,_~~WWWWWWWWWWWWWWWWWWW',
    'TT,,:,,,,_~~WWWWWWWWWWWWWWWWWWWW',
  ],
  exits: [
    { x: 0, y: 12, to: 'deepthorn_i4', tx: 30, ty: 12, tf: WEST },
  ],
  features: [
    // The glade road, and the Hoarhills' end.
    { kind: 'event', x: 2, y: 10, id: 'j4_glade', once: true, text: 'The long glade, grass down the wood\'s east side like a road nobody built, between the oaks and the Hoarhills.' },
    { kind: 'event', x: 4, y: 16, id: 'j4_prints', once: true, text: 'Boot prints in the glade\'s turf, many, deep and all going south: people carrying weight. A few turn off east, towards the crag.' },
    { kind: 'sign', x: 5, y: 21, text: 'South: the head. East along the shore: the dead wood. Nobody\'s road.' },
    { kind: 'event', x: 13, y: 19, id: 'j4_lookout', once: true, text: 'The last crag of the Hoarhills, and all Sunder Bay under it. Across the water a wood stands white as bone against the green.' },
    { kind: 'event', x: 17, y: 16, id: 'j4_eaves', once: true, text: 'Past the ridge\'s end the trees are another wood\'s: closed, pathless, and quiet in a way the deep is not.' },
    // The secret: the carriers' cleft in the crag, behind a door in the rock.
    { kind: 'event', x: 12, y: 17, id: 'j4_cleft', once: true, text: 'A cleft in the crag, dry, and lived in: rope, sacking, a cold fire, and a knife with a Saltmouth maker\'s mark.' },
    { kind: 'chest', x: 12, y: 16, id: 'j4_cleft_box', gold: 140, items: ['warhammer+2'] },
    // The wilderness (#45).
    { kind: 'shrine', x: 2, y: 24, id: 'j4_shrine', text: 'A shrine at the glade\'s edge, three stones and a green bough, where the elves turn back.', stat: 'luck', done: 'The bough on the shrine is green still.' },
    { kind: 'camp', x: 9, y: 22, name: 'The lee of the crag', text: 'A camp in the lee of the crag, out of the bay\'s wind, its ring of stones black from other fires.' },
    { kind: 'cairn', x: 18, y: 20, id: 'j4_cairn', text: 'A cairn on the shore above the tideline, and a pine-cutter\'s axe-head wedged among its stones.', gold: 60, items: ['potion_sp_great'] },
    // The hermit on the shore under the crag.
    { kind: 'npc', x: 15, y: 21, name: 'a hermit on the shore', lines: [
      'An old man sits on a rock above the tideline with his back to the deep, watching the far shore, and has been watching it for longer than you have been alive.',
      '"You\'ve seen it, then. The white wood. Don\'t ask its name; it had one, and it was a good wood, and I cut pine in it thirty years. Then one night the ground under it opened like a mouth, and the mouth was a mile long, and everything that stood near it went to glass."',
      '"That\'s a Rift, that is, let run. Yours under the Grove was caught, I hear. That one nobody caught. Nobody was there to." He spits. "I sit here so I don\'t forget it. Somebody should."',
    ], flag: 'q_hermit', says: [
      { after: { flag: 'q_hermit', slain: 'grove2:g2_warden' }, lines: [
        '"Yours is shut, they say. The one under the Grove." He does not turn round. "Good. Then you know what you were looking at over there, and what you weren\'t. Sit a while. It doesn\'t get any less white."',
      ] },
    ] },
  ],
  secrets: [{ x: 12, y: 18, hint: 'j4_prints' }],
  encounters: [
    // The gentlest first: thorn spiders where the glade comes in, dire wolves down it, great owls
    // over it by night, rootwalkers under the crag and the heartwood alone at the glade's south end.
    { id: 'j4_spiders', x: 2, y: 15, monsters: ['thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider'], aware: 4, respawn: 1440 },
    { id: 'j4_wolves', x: 7, y: 17, monsters: ['dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf'], aware: 5, respawn: 1440 },
    { id: 'j4_owls', x: 7, y: 25, monsters: ['great_owl', 'great_owl', 'great_owl', 'great_owl'], aware: 5, respawn: 1440, when: { hours: 'night' }, until: TEAR_CLOSED },
    { id: 'j4_rootwalkers', x: 10, y: 20, monsters: ['rootwalker', 'rootwalker', 'rootwalker', 'rootwalker'], aware: 3, respawn: 2880, until: TEAR_CLOSED },
    { id: 'j4_heartwood', x: 6, y: 29, monsters: ['heartwood'], aware: 3, respawn: 2880, until: TEAR_CLOSED },
  ],
};
