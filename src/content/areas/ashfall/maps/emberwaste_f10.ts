// Ashfall, box F10: the Ember Waste's road. Country, band 24-26: the road in from Cinderport's box over
// G10's west edge, out of the vines where Cindercoast ends and south-west over the bare ash past the
// Riders' ring, then west along the rocks of the south rows, the atlas's, from F11's corner to E10 and
// the Wold. North, the vines' edge and a dead tree in them; in the north-west, far from the road, a rock
// outcrop and the Archdruid in its lee (#448); on the ash a cairn, a shrine, the drifts and the beetles;
// in the south the flow's end, warm, the drake on the rocks and the milestone where the road turns west.
// Joined to G10 on its east edge and E10 on its west. The north edge ends the world
// against F9 and the south against F11, which the road runs along at columns 5 to 11.
// Cut from the atlas by tools/scaffold.ts; docs/areas/ashfall.md §4.9 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { WEST } from '../../../../game/types.ts';

export const EMBERWASTE_F10: MapDef = {
  id: 'emberwaste_f10',
  name: 'The Ember Waste',
  kind: 'outdoor',
  density: 'country',
  band: [24, 26],
  region: 'ashfall',
  start: { x: 31, y: 7, facing: WEST },
  rows: [
    'aaaaaaaaaaa&&&&&&&&&&&&&&&&&&&&&',
    'aarrraaaaaaa&&&&&&&&&&&&&&&&&&&&',
    'arrrrraaaaaa&&&&&&&&&&&&&&&&&&&&',
    'aarrrraaaaaa&&&&&&&&&&&&&&&&&&&&',
    'aaarraaaaaaa&&&&&&&&&&&&&&&&&&&&',
    'aaaaaaaaaaaaa&&&&&&&&&&&&&&&&&&&',
    'aaaaaaaaaaaaaa&&&&&&&&&&&&&&&&&&',
    'aaaaaaaaaaaaaa&&&&&&&&&&&&&&&&&=',
    'aaaaaaaaaaaaaaa&&&&&&&&&&&&&&&==',
    'aaaaaaaaaaaaaaaaaaaa&&&&&&&&&&=&',
    'aaaaaaaaaaaaaaaaaaaaa&&&&&&&&==&',
    'aaaaaaaaaaaaaaaaaaaaa&&&&&&&&=&&',
    'aaaaaaaaaaaaaaaaaaaaaaaa&&&&==&&',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaa==aa&',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaa=aaaa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaa==aaaa',
    'aaaaaaaaaaaaaaaaaaaaaaaaa==aaaaa',
    'aaaaaaaaaaaaaaaaaaaaaaaaa=aaaaaa',
    'aaaaaaaaaaaaaaaaaaaaaaaa==aaaaaa',
    'aaaaaaaaaaaaaaaaaaaaaaa==aaaaaaa',
    'aaaaaaaaaaaaaaaaaaaaaaa=aaaaaaaa',
    'aaaaaaaaaaaaaaaaaaaaaa==aaaaaaaa',
    'aaaaaaaaaaaaaaaaaaaaa==aaaaaaaaa',
    'aaaaaaaaaaaaaaaaaaaaa=aaaaaaaaaa',
    'aaaaaaaaaaaaaaaaaaaa==aaaaaaaaaa',
    'aaaaaaaaaaaaaaaaaaa==aaaaaaaaaaa',
    'aaaaaaaaaaaaaaaaaa==aaaaaaaaaaaa',
    'aaaaaaaaaarraaaaa==aaaaaaaaaaaaa',
    'aaaaarrrrrrrraaa==aaaaaaaaaaaaaa',
    '==raarrrrrrrrrr==aaaaaaaaaaaaaaa',
    '======rrrrr=====aaaaaaaaaaaaaaaa',
    'rrrrr=======rrraaaaaaaaaaaaaaaaa',
  ],
  features: [
    // Out of the vines where Cindercoast ends: the road onto bare ash, the vines' edge along the north
    // and a tree they killed.
    { kind: 'event', x: 26, y: 13, id: 'f10_vines', once: true, text: 'The road comes out of the vines onto bare ash. The last of them are short and grey.' },
    { kind: 'event', x: 12, y: 5, id: 'f10_edge', once: true, text: 'The vines stop here as if cut with a knife. On this side the ash, and nothing growing in it.' },
    { kind: 'event', x: 24, y: 3, id: 'f10_tree', once: true, text: 'A grey tree in the vines, killed long ago, its ropes of vine hanging nearly to the ground.' },
    // The outcrop in the north-west, far from the road, and the Archdruid in its lee: his trainer and
    // his quest are #448's.
    { kind: 'npc', x: 6, y: 3, name: 'The Archdruid', lines: [
      'An old man in the lee of the rocks, his robe gone from green to grey. Seedlings stand round him in pots of ash.',
      '"I came out of the Grove to see whether anything would grow here. I am still seeing."',
      '"Something will. Something always does. It will not be what you planted."',
    ] },
    // On the ash: the cairn, the shrine, the drifts and the Riders' ring by the road.
    { kind: 'cairn', x: 14, y: 12, id: 'f10_cairn', text: 'A cairn on the bare ash, its stones black, a strip of red cloth tied in the top.', gold: 250, items: ['potion_sp_great'] },
    { kind: 'shrine', x: 5, y: 13, id: 'f10_shrine', text: 'A stone set on end in the ash, a hand pressed into its black face while it was soft.', stat: 'endurance', done: 'The stone on end, ash lying in the print of the hand.' },
    { kind: 'event', x: 13, y: 20, id: 'f10_drifts', once: true, text: 'The ash lies in drifts here like snow, and the wind takes the tops off them.' },
    { kind: 'camp', x: 20, y: 22, name: 'The Riders\' ring', text: 'A ring of black stones by the road, where the Riders stop on the way down. Ash banked over the embers.' },
    // The flow's end in the south, warm, and the milestone where the road turns west along the rocks.
    { kind: 'event', x: 27, y: 30, id: 'f10_flow', once: true, text: 'The ash is warm underfoot. South, a flow off the mountain ends in a black lip, and it still smokes.' },
    { kind: 'event', x: 3, y: 29, id: 'f10_milestone', once: true, text: 'A milestone where the road runs west along the rocks: THE WOLD 2, CINDERPORT 4. Ash lies in the letters.' },
  ],
  encounters: [
    // Cinder beetles on the ash below the vines, nearest the way in, and a cinder drake on the rocks
    // over the road's west run, the box's group at 25, as no roaming monster stands at 26 before the
    // Stone (§7). The brief's second beetles and the salamanders at the flow's end are cut for the pay.
    { id: 'f10_beetles', x: 22, y: 16, monsters: ['cinder_beetle', 'cinder_beetle', 'cinder_beetle', 'cinder_beetle'], aware: 3, respawn: 1440 },
    { id: 'f10_drake', x: 9, y: 26, monsters: ['cinder_drake'], aware: 5, respawn: 2880 },
    // Once the Stone is lit (#449), two sentries by the road back from F11's corner toward Cinderport, the
    // box's top at 26, where nothing stood the day before.
    { id: 'f10_sentries', x: 18, y: 29, monsters: ['sentry', 'sentry'], aware: 4, respawn: 2880, after: { flag: 'q_ember_lit' } },
  ],
};
