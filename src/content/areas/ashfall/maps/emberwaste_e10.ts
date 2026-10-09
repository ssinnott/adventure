// Ashfall, box E10: the Ember Waste's road over the Cinder Hills to the Wold. Country, band 24-26: the
// road in off F10 over the Waste's ash, past the cinder cones and the lava flow's head at the south
// edge, up into the Hills and through their notch, where a Rider's waymark stands, and down their west
// foot onto the grass of the steppe and out over the west edge. On the crest the cairns, all facing the
// steppe, their stones standing on the rises, the sky-stone, the hermit who has looked down on the Stone's field all his life and two
// drakes over the road at the far end; and in the hills south of the notch the one cairn that looks
// back, a grave. West of the Hills the steppe.
// Laid whole for the Waste (#517) as the atlas cuts it, the Wold's steppe and grass with it: the Wold's
// monsters, its outriders and its crossing line land here with #524. Joined only to F10, on its east
// edge; the west edge ends the world against D10 and the north and south edges against E9 and E11.
// Cut from the atlas by tools/scaffold.ts; docs/areas/ashfall.md §4.9 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { WEST } from '../../../../game/types.ts';

export const EMBERWASTE_E10: MapDef = {
  id: 'emberwaste_e10',
  name: 'The Ember Waste',
  kind: 'outdoor',
  density: 'country',
  band: [24, 26],
  region: 'ashfall',
  start: { x: 31, y: 29, facing: WEST },
  rows: [
    'sssssss^^^^^^sss,,,aaaaaaaaaaaaa',
    '^^^^^ss^^^^^^sss,,,aaaaaaaaaaaaa',
    '^^^^^^s^^^^^^sss,,,aaaaaaaaaaaaa',
    '^^^^^^s^^^^^^sss,,aaaaaaaaaaaaaa',
    '^^^r^^s^^^^^^ss,,,aaaaaaaaaaaaaa',
    '^^^^^^ss^^^^^s,,,,aaaaaaaaaaaaaa',
    '==^^^^^s^^^^^s,,,,aaaaaaaaaaaaaa',
    '^=^^^^^^^^^^^,,,,aaaaaaaaaaaaaaa',
    's==^^^^^^^^^^^,aaaaaaaaaaaaaaaaa',
    'ss==^^^^^r^^^^,aaaaaaaaaaaaaaaaa',
    'ss^===^^^^^^^^,aaaaaaaaaaaaaaaaa',
    'ss^^^==^^^^r^^,aaaaaaaaaaaaaaaaa',
    's^^^^^==s^^^^^^,aaaaaaaaaaaaaaaa',
    's^^^^^^==s^^^^^aaaaaaaaaaaaaaaaa',
    's^^^^^ss===^^^^aaaaaaaaaaaaaaaaa',
    's^^^^sssss==^^^aaaaaaaaaaaaaaaaa',
    's^^^^sssss^==^^^aaaaaaaaaaaaaaaa',
    'ss^^^sssss^^==^raaaaaaaaaaaaaaaa',
    'ss^^sssssss^^==^aaaaaaaaaaaaaaaa',
    'sssssssssss^^^==aaaaaaaaaaaaaaaa',
    'sssssssssss^^^^===aaaaaaaaaaaaaa',
    'sssssssssss^^^^^^==aaaaaaaaaaaaa',
    'sssssssssss^^^^^^a==aaaaaaaaaaaa',
    'sssssssssss^^^^^r^a==aaaaaaaaaaa',
    'ssssssssss,^^^^^^^aa===aaaaaaaaa',
    'sssssssssss^^^^^^^^aaa==aaaaaaaa',
    'sssssssssss^^^^rrrr,aaa===aaaaaa',
    'ssssssssss^^^^^r^^S,aaaaa===aaaa',
    'sssssssssss^^^^rrrr,aaaaaaa===aa',
    'ssssssssss,^r^^^^^^^aaaaaaaaa===',
    'ssssssssss,^^^^^^^^^aaaaaaaaaaa=',
    'sssssssss,,^^^^^^^^^aaa!!aaaaaaa',
  ],
  features: [
    // On the Waste's ash: the cinder cones, the wind off the hills, and at the south edge the head of
    // the lava flow that seals the Glass (#443, call 5), seen and not crossed.
    { kind: 'event', x: 25, y: 4, id: 'e10_cones', once: true, text: 'Cinder cones stand up out of the ash, knee high, each with a cold black mouth.' },
    { kind: 'event', x: 27, y: 16, id: 'e10_veils', once: true, text: 'The wind comes down off the hills and lifts the ash in long grey veils.' },
    { kind: 'event', x: 24, y: 30, id: 'e10_flow', once: true, text: 'At your feet the head of a lava flow, black and red in the cracks, running away south-west. It is hot through boots.' },
    // The notch the road takes through the Hills, and a Rider's waymark in it.
    { kind: 'event', x: 14, y: 20, id: 'e10_waymark', once: true, text: 'In the notch a Rider\'s waymark: a stone on end, a horse cut in it running west.' },
    // The crest: the cairn that gives, the cairns on every rise, the Riders' sky-stone and the hermit.
    { kind: 'cairn', x: 14, y: 16, id: 'e10_cairn', text: 'A cairn on the crest, a flat stone set in its west face, toward the steppe.', gold: 250, items: ['potion_sp_great'] },
    { kind: 'event', x: 12, y: 23, id: 'e10_cairns', once: true, text: 'A cairn on every rise of the hills, and in the west face of each a flat stone, toward the steppe.' },
    { kind: 'shrine', x: 8, y: 3, id: 'e10_shrine', text: 'A stone on the crest worn flat on top, a ring cut in it and a hole through the middle for the sky.', stat: 'accuracy', done: 'The sky-stone, rain standing in its ring.' },
    { kind: 'npc', x: 13, y: 13, name: 'A hermit', lines: [
      'A hermit in a hut of black stones on the crest, a goat on a rope by the door.',
      '"Every day of my life I have looked down on the Stone\'s field. Every day it has stood there dark."',
      '"They say it will be lit one day. I have stopped looking."',
    ] },
    // South of the notch, the cairn that looks back: a grave, its mouth among the stones.
    { kind: 'event', x: 19, y: 27, id: 'e10_back', once: true, text: 'The Hills\' cairns all look west to the steppe. This one looks back at the Stone.' },
    { kind: 'event', x: 17, y: 27, id: 'e10_rider', once: true, text: 'Under the stones a woman laid out on her saddle, a bow across her. The silver on the saddle has gone black.' },
    { kind: 'chest', x: 16, y: 27, id: 'e10_grave', gold: 700, items: ['horn_bow+2'] },
    // West of the Hills the steppe, the Wold's (#524), to the world's end for now.
    { kind: 'event', x: 1, y: 11, id: 'e10_steppe', once: true, text: 'West of the hills the steppe, flat and yellow, runs on to the sky.' },
    { kind: 'event', x: 4, y: 21, id: 'e10_wind', once: true, text: 'The wind comes over the steppe and the grass goes down before it in waves.' },
    { kind: 'event', x: 5, y: 27, id: 'e10_hooves', once: true, text: 'Hoofprints in the grass, unshod, a great many, going north-west.' },
  ],
  secrets: [{ x: 18, y: 27, hint: 'e10_back' }],
  encounters: [
    // Two cinder drakes on the Hills' crest at the far end, by the road coming down to the steppe, the
    // box's group at 25: one alone is too light a fight for the gate, and no roaming monster stands at
    // 26 before the Stone (§7). The brief's beetles are cut for the pay. Nothing of the Wold's yet (#524).
    { id: 'e10_drakes', x: 6, y: 9, monsters: ['cinder_drake', 'cinder_drake'], aware: 5, respawn: 2880 },
  ],
};
