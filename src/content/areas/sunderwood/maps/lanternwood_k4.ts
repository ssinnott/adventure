// Sunderwood, box K4: the Sunder's Foot. Country, band 15-16: the gorge's last reach down to Sunder
// Bay, dead wood on both lips and the glass grown into it; the chasm closes to a crack above the
// shingle and the sea goes in under it. The Hand's gleaners carry east along the shore, and on the west lip, a pocket reached only round the foot, the depths'
// Lanterns' boathouse behind the rock. It opens north to K3's east lip and east to L4 by the shore;
// its west stands closed against the Deepthorn's J4, sea and all.
// Cut from the atlas by tools/scaffold.ts; docs/areas/sunderwood.md §4.10 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const LANTERNWOOD_K4: MapDef = {
  id: 'lanternwood_k4',
  name: 'The Sunder\'s Foot',
  kind: 'outdoor',
  density: 'country',
  band: [15, 16],
  region: 'sunderwood',
  start: { x: 23, y: 0, facing: SOUTH },
  rows: [
    'rMMMMMMMMMMMMMMMMMMMMdddddMMMMMM',
    'rddddddvvdddcccccccccdddddTTTTTT',
    'rddddddvvdddcccccccccdddddTTTTTT',
    'rddddddvvdddccccccccddddddTTTTTT',
    'rddddddvvvdddcccccccdddddddTTTTT',
    'rddddddvvvdddccccccdddddddddTTTT',
    'rddddddvvvddddddddddddddddddTTTT',
    'rdddddddvvddddddddddddddddddTTTT',
    'rdddddddvvddddddddddddddddddTTTT',
    'rdddddddvvvdddddddddddddddddTTTT',
    'rTTdddddvvvdddddddddddddddddTTTT',
    'rTTTdddddvvddddddddddddddddddTTT',
    'rTTddddddvvvddddddddddddddddTTTT',
    'rTTTdddddvvvddddddddddddddddTTTT',
    'r::TddddddvvdddddddddddddddTTTTT',
    'r::TddddddvvvddddddddddddddTTTTT',
    'r::TdddddddvvddddddddddddddTTTTT',
    'rTSddddddddvvvdddddddddddddTTTTT',
    'r~~~dddddddvvvdddddddddddddTTTTT',
    'r~~~_dddddddvvdddddddddddddTTTTT',
    'rWW~~dddddddvvvddddddddddddTTTTT',
    'rWWW~~dddddddvvdddddddddddTTTTTT',
    'rWWWW~~ddddddvvdddddddddddTTTTTT',
    'rWWWWW~~~ddddddddddddddddTTTTTTT',
    'rWWWWWW~~~ddddddddddddddTTTTTTTT',
    'rWWWWWWWW~~~~dd~ddddddddTTTTTTTT',
    'rWWWWWWWWW~~~~~~~~~ddddd___TTTTT',
    'rWWWWWWWWWWWW~~W~~~~~~~~~~____TT',
    'rWWWWWWWWWWWWWWWWWW~~~~~W~~~~__T',
    'rWWWWWWWWWWWWWWWWWWWWWWWWWWWW~__',
    'rWWWWWWWWWWWWWWWWWWWWWWWWWWWWW~~',
    'rWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  ],
  features: [
    { kind: 'event', x: 23, y: 1, id: 'k4_way', once: true, text: 'In from the Sunder\'s mouth by the dead wood, the trunks grey and the ground grey under them. The gorge on your right narrows as it goes, and the sea is loud.' },
    { kind: 'event', x: 10, y: 3, id: 'k4_glass', once: true, text: 'The east lip, where the dead wood has gone past dead: glass grown up out of it, solid, white light in it. Nothing stands here now, and the light does not care.' },
    { kind: 'cairn', x: 22, y: 13, id: 'k4_cairn', text: 'A cairn in the dead wood, the stones laid dry and the top one glass with its light inside it. Moths on it by day, asleep.', gold: 180, items: ['potion_sp_great'] },
    { kind: 'event', x: 16, y: 18, id: 'k4_shingle', once: true, text: 'The dead wood thins and gives out, the last trunks standing in shingle. Drag marks in the stones going east, and grey hand-prints on the trunks.' },
    { kind: 'event', x: 12, y: 23, id: 'k4_foot', once: true, text: 'The Sunder\'s foot. The chasm closes to a crack above the shingle and stops there, and the sea goes in under it, and does not come out.' },
    { kind: 'camp', x: 22, y: 25, name: 'The last trunks', text: 'A hollow among the last dead trunks above the shingle, dry, the wind over it. By night the gorge ticks as the cold gets into the glass, and the sea answers.' },
    // The west lip, round the foot.
    { kind: 'event', x: 4, y: 3, id: 'k4_mark', once: true, text: 'A Lantern mark cut on a dead trunk on the west lip, a flame, the cut gone to glass with the wood. It faces the sea, not the wood, as a mark for boats is cut.' },
    // The secret: the steps down the west lip to a blank face, and the boathouse behind it.
    { kind: 'event', x: 4, y: 17, id: 'k4_steps', once: true, text: 'Steps cut down the west lip, old, the edges worn round. They go down to a blank face of rock and stop, and the sea is on the other side of it.' },
    { kind: 'event', x: 2, y: 16, id: 'k4_boathouse', once: true, text: 'A boathouse in the rock at the gorge\'s foot, the sea door silted shut from without. A boat dry on its trestles, a chest under its stern, a roll of names on the wall.' },
    { kind: 'chest', x: 1, y: 15, id: 'k4_boathouse_chest', gold: 300, items: ['flail+2', 'lanterns_roll'] },
  ],
  secrets: [{ x: 2, y: 17, hint: 'k4_steps' }],
  encounters: [
    // Two of the Hand's gleaners and their hound at the foot, carrying east along the shore; and on
    // the west lip by night two deathsheads, the box's group at 16.
    { id: 'k4_gleaners', x: 17, y: 23, monsters: ['ashen_gleaner', 'ashen_gleaner', 'sunder_hound'], aware: 4, respawn: 2880 },
    { id: 'k4_deathshead', x: 4, y: 12, monsters: ['deathshead', 'deathshead'], aware: 5, respawn: 1440, when: { hours: 'night' } },
  ],
};
