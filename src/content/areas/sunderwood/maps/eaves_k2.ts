// Sunderwood, box K2: Sunderfall and the rope bridge. Core, band 15: the Sunder down the box's west,
// the gorge J2's lip looks across, with glass trees along both lips; the east road over it by the rope
// bridge and on through the pines for Lantern Watch; and Sunderfall, where the river from the rim goes
// over the east lip, with its shrine, its hermit and the ledge behind the water.
// Cut from the atlas by tools/scaffold.ts; docs/areas/sunderwood.md §4.4 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST } from '../../../../game/types.ts';

export const EAVES_K2: MapDef = {
  id: 'eaves_k2',
  name: 'Sunderfall',
  kind: 'outdoor',
  density: 'core',
  band: [15, 15],
  region: 'sunderwood',
  start: { x: 0, y: 24, facing: EAST },
  rows: [
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'vvvvvvvccddddTTTTTTTTTTTT~~TTTTM',
    'vvvvvvvvcdddddTTTTTTTTTT~~TTTTTM',
    'vvvvvvvvdcdddddTTTTTTTTT~TTTTTTM',
    'vvvvvvvcdddddddTTTTTTTT~~TTTTTTM',
    'vvvvvvvddddddddTTTTTTTT~TTTTTTTM',
    'vvvvvvvvddddccdTTTTTTT~~TTTTTTTM',
    'vvvvvvvvcddddcdTTTTTTT~TTTTTTTTM',
    'vvvvvvvvvcddddcdddddT~~TTTTTTTTM',
    'vvvvvvvvvcddddddddddT~TTTTTTTTTM',
    'vvvvvvvvddddddddcdddddttTTTTTTTM',
    'vvvvvvvvcdddddddcddT~TTtttttttTM',
    'vvvvvvvddddcdcddddT~~TTTttttttTM',
    'vvvvvvvcddddcdddddT~TTTTttttttTM',
    'vvvvvvvvcddddddddT~~TTTTtttttTTM',
    'vvvvvvvvdcdddddddd~TTTTTTTtTTTTM',
    'vvvvvvvdddddddddd~~TTTTTTTtTTTTM',
    'vvvvvvvdcdccddddd~TTTTTTTTtTTTTM',
    'vvvvvvvddddcdddd~~TTTTTTTTtTTTTM',
    'vvvvvvvcdddddccd~TTTTTTTTTtTTTTM',
    'vvvvvvvccdddddd~~TTTTTTTTTtTTTTM',
    'vvvvvvvvddddcdd~TTTTTTTTTTtTTTTM',
    'vvvvvvvvdddddd~~TTTTTTT=========',
    'vdvvvvvvdddddd~TTT======TTTTTTTM',
    '===================TTTTTTTTTTTTM',
    'cdvvvvvvddcd~~ddddTTTTTTTTTTTTTM',
    'ddcvvvvvddd~~dddcTTTTTTTTTTTTTTM',
    'dddvvvvv~~~~ddddTTTTTTTTTTTTTTTM',
    'cddcvvvvvr~dddddTTTTTTTTTTTTTTTM',
    'ddddvvvvv.SddddTTTTTTTTTTTTTTTTM',
    'cdcdvvvvvrrrddTTTTTTTTTTTTTTTTTM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
  ],
  features: [
    // The rope bridge over the gorge: the step.
    { kind: 'event', x: 5, y: 24, id: 'k2_bridge', once: true, text: 'Rope and planks over the gorge, swaying. Rain goes down past your boots and never lands that you can hear.' },
    // The west lip, south of the road.
    { kind: 'camp', x: 1, y: 27, name: 'Bridgehead camp', text: 'A ring of blackened stones by the bridgehead, in the lee of the last pine not gone to glass. Rope-ends and a bent nail: others have slept here and gone over.' },
    // The east lip: the lookout down the gorge, the glass.
    { kind: 'event', x: 8, y: 5, id: 'k2_lookout', once: true, text: 'The far lip is a grey line and the floor is nowhere. Below, where the face was sheer, it is cut square, ledge under ledge, and a path to them goes south along the wall.' },
    { kind: 'event', x: 14, y: 16, id: 'k2_stumps', once: true, text: 'Glass pines along the lip, and among them stumps sawn flat, the cut faces clear as water. A grey hand-print on one, set in the resin.' },
    // East of the river: the cairn in the pines, and a Lantern's lamp by the road on.
    { kind: 'cairn', x: 27, y: 13, id: 'k2_cairn', text: 'A cairn in the pines east of the river, the stones laid close and dry. The ones on top have been lifted and put back the wrong way up, lichen down.', gold: 180, items: ['potion_sp_great'] },
    { kind: 'event', x: 23, y: 23, id: 'k2_lamp', once: true, text: 'A squared stone by the road, a flame cut in its east face and the cut scrubbed clean. The needles stop at it; from there the road has been swept.' },
    // The dam where the river leaves the pines.
    { kind: 'event', x: 21, y: 10, id: 'k2_dam', once: true, text: 'A dam of pine trunks and turf across the river, new-cut. The water backs up brown behind it. The sluice is down to a trickle.' },
    // Sunderfall: the river over the lip, gone quiet since the dam, the shrine and its keeper.
    { kind: 'event', x: 9, y: 26, id: 'k2_fall', once: true, text: 'Sunderfall. A thread down wet rock, and a quiet where the roar should be.' },
    { kind: 'shrine', x: 12, y: 28, id: 'k2_shrine', text: 'A shrine on the lip beside the fall, a sword cut in its face worn near to a line. The spray that kept its moss green has stopped, and the moss is going brown.', stat: 'personality', done: 'The sword on the shrine, worn near to a line.' },
    { kind: 'npc', x: 14, y: 27, name: 'Orm, keeper of the shrine', lines: [
      'A man in a hide coat on a stone by the shrine, the coat gone black with spray. It is dry today, and he keeps feeling it.',
      '"Eleven days back it went in an hour. Loud, then less, then that thread. I stood here and listened to it go."',
      '"Forty years I have kept this to the sound of water. You stop hearing it. Then it stops, and you hear nothing else."',
    ] },
    // The secret: the rocks under the fall, and the ledge behind the water.
    { kind: 'event', x: 11, y: 29, id: 'k2_rocks', once: true, text: 'Every rock under the fall is green with its spray, the green going brown. One is bare, and worn.' },
    { kind: 'event', x: 9, y: 29, id: 'k2_ledge', once: true, text: 'A ledge behind the thread, dry as a loft. A tally in fives on the back wall, the chalk gone the colour of the rock, one word left to read: BELOW. Under it, something in a wrap of hide.' },
    { kind: 'chest', x: 9, y: 29, id: 'k2_ledge_chest', gold: 200, items: ['longsword+2'] },
  ],
  secrets: [{ x: 10, y: 29, hint: 'k2_rocks' }],
  encounters: [
    // At the bridge's far end the hounds and a spider in the glass; the gleaners and their dog at the
    // dam where the river leaves the pines; and on the road on east, where Lanternwood begins, the glass bears.
    { id: 'k2_hounds', x: 9, y: 22, monsters: ['sunder_hound', 'sunder_hound', 'sunder_hound', 'glass_spider'], aware: 5, respawn: 2880 },
    { id: 'k2_dam', x: 18, y: 11, monsters: ['ashen_gleaner', 'ashen_gleaner', 'ashen_gleaner', 'sunder_hound'], aware: 4, respawn: 2880 },
    { id: 'k2_bears', x: 30, y: 22, monsters: ['glass_bear', 'glass_bear'], aware: 5, respawn: 2880, roams: false },
  ],
};
