// Cairnmoor, box M8: the tarn under the mountains. Country, band 18-19: the Cairnfield's heather and
// grass south-west of the road, off it; in from N8's heather, and from M7's grass and heather over the
// grazing; the stream from the moor across the north, stepping stones over it, and a boat on the sand;
// the crags in the east where the ravens sit, and a lone tor on its rise in the middle, a face worn
// in it; south, the tarn under the Rimefells, an old man fishing it, and a howff under a boulder by it.
// The Rimefells close the south and the corner, but for the grass and the hills onto M9's north-west
// corner; west, the sea and L8's coast, cut.
// Cut from the atlas by tools/scaffold.ts; docs/areas/cairnmoor.md §4.7 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { WEST } from '../../../../game/types.ts';

export const CAIRNFIELD_M8: MapDef = {
  id: 'cairnfield_m8',
  name: 'The Cairnfield',
  kind: 'outdoor',
  density: 'country',
  band: [18, 19],
  region: 'cairnmoor',
  start: { x: 31, y: 22, facing: WEST },
  rows: [
    'WWWWWWWWW~~_,,,,,,,,hhhhhhhhhhhh',
    'WWWWWWWWW~~_,,,,,,,,hhhhhhhhhhhh',
    'WWWWWWWWW~~_,,,,,,,,hhhhhhhhhhhh',
    'WWWWWWWWW~~_,,,,,,,,hhhhhhhhhhhh',
    'WWWWWWWW~~~~~,,,,,,,,hhhhhhhhhhh',
    'WWWWWWWW~~~~~~~~~,,,,hhhhhhhhhhh',
    'WWWWWWWW~~_,,~~~~:~~~~~~~~hhhhhh',
    'WWWWWWW~~_,,,,,,,,~~~~~~~~~~~~~~',
    'WWWWW~~~~_,,,,,,,,hhhhhhhhhhhhhh',
    'WWW~~~~__,,,,,,,,hhhhhhhhhhhhhhh',
    'WW~~~__,,,,,,,,,hhhhhhhhhhhhhhhh',
    'W~~__,,,,,,,,,hhhhhhhhhhhhhhhhrr',
    '~~_,,,,,,,,,,hhhhhhhhhhhhhhhhrrr',
    '~_,,,,,,,,,,hhhhhhhhhhhhhhhrrrrr',
    '~_,,,,,,,,,hhh^^^^hhhhhhhhhrrrrr',
    '_,,,,,,,,,,hh^^rr^^hhhhhhhhrrrrr',
    ',,,,,,,,,,hhh^^rr^^hhhhhhhhrrrrr',
    ',,,,,,,,,hhhhh^^^^hhhhhhhhhrrrrr',
    ',,,,,,,,hhhhhhhhhhhhhhhhhhhhrrrr',
    ',,,,,,,hhhhhhhhhhhhhhhhhhhhhrrrh',
    ',,,,,,,hhhhhhhhhhhhhhhhhhhhhhhhh',
    ',,,,,,,,hhhhhhhhhhhhhhhhhhhhhhhh',
    ',,,,,,,,hhhhhhhhhhhhhhhhhhhhhhhh',
    ',,,,,,,,,hhhhhhhhhhhhhhhhhhhhhhh',
    ',,,,,,,,,,,hhhhhhhhhhhhhhhhhhhhh',
    ',,,,,,,,,,,,,hhhhhhhhhhhhhhhhhhh',
    ',,,rrrr,,,~~~,,,,,hhhhhhhhhhhhrr',
    ',,,r::S^^~~WW~~,,hhhhhhhhhhhhhrr',
    ',,,rrrr^~~WWW~~,hhhhhhhhhhhhhhrr',
    ',,,,^^^^^~~~~~,,hhhhhhhhhhhhhhrr',
    ',,,,^^^^MMMMMMMM^^^hhhhhhh^^^^MM',
    ',,,^^MMMMMMMMMMMMMMMMMMMMMMMMMMM',
  ],
  features: [
    // North of the stream: the shore, and the grazing's sheep strayed into the heather; the stream
    // from the moor, its stepping stones the one way over it.
    { kind: 'event', x: 12, y: 2, id: 'm8_boat', once: true, text: 'A boat drawn up on the sand, its planks sprung, grass growing in it.' },
    { kind: 'event', x: 24, y: 2, id: 'm8_strays', once: true, text: 'Sheep strayed down off the grazing into the heather, a red mark on every shoulder.' },
    { kind: 'event', x: 17, y: 6, id: 'm8_ford', once: true, text: 'Stepping stones over the stream, green with weed, one rocking underfoot.' },
    { kind: 'event', x: 25, y: 8, id: 'm8_stream', once: true, text: 'The stream comes off the moor black and quick, and slows through the grass to the sea.' },
    // The heather: the crags east where the ravens sit, and the lone tor on its rise, its face worn
    // nearly smooth by day; by night its troll is up beside it (#537). West, the shore and the grazing.
    { kind: 'event', x: 26, y: 18, id: 'm8_bones', once: true, text: 'Under the crags, sheep\'s bones picked white, and a raven on every ledge.' },
    { kind: 'event', x: 15, y: 17, id: 'm8_face', once: true, when: { hours: 'day' }, text: 'A lone tor on its rise, grey slabs heaped. In the top slab a face, worn nearly smooth.' },
    { kind: 'event', x: 1, y: 17, id: 'm8_shingle', once: true, text: 'The grass runs down to the sea in a slope of shingle, gulls along the tide line.' },
    { kind: 'event', x: 6, y: 21, id: 'm8_grazing', once: true, text: 'The grazing runs on south, cropped short, the sheep\'s paths worn through it.' },
    // South, the tarn under the Rimefells and the old man who fishes it; by it a great boulder, the
    // heather under it worn and its rock smoked black, and in under it a howff, walled in (#45).
    { kind: 'event', x: 15, y: 28, id: 'm8_tarn', once: true, text: 'A tarn under the mountains, black and still, the Rimefells standing in it upside down.' },
    { kind: 'npc', x: 14, y: 29, name: 'A fisher', lines: [
      'An old man on a stone by the tarn, his line out in the black water.',
      '"Char in it, black as the water. My father fished it, and his father."',
      '"There was a troll on the lone tor when my father was a boy. There is a troll on it yet."',
    ] },
    { kind: 'event', x: 7, y: 27, id: 'm8_smoke', once: true, text: 'Under a great boulder the heather is worn to the earth, the rock over it black with old smoke.' },
    { kind: 'event', x: 5, y: 27, id: 'm8_howff', once: true, text: 'A howff under the boulder: a bed of heather, a hearth, and a box pushed to the back.' },
    { kind: 'chest', x: 4, y: 27, id: 'm8_box', gold: 60, items: ['forge_shield+1'] },
    { kind: 'cairn', x: 18, y: 30, id: 'm8_cairn', text: 'A cairn at the mountains\' foot, a ram\'s skull set on its top.', gold: 120, items: ['potion_sp_great'] },
    { kind: 'event', x: 24, y: 30, id: 'm8_rimefells', once: true, text: 'South, the Rimefells, white from their feet to their tops.' },
  ],
  secrets: [{ x: 6, y: 27, hint: 'm8_smoke' }],
  encounters: [
    // The ravens on the crags by the way in from N8, and by night the lone tor's troll, up beside its
    // rise, mended each round unless burned (#537).
    { id: 'm8_ravens', x: 26, y: 21, monsters: ['raven', 'raven', 'raven', 'raven', 'raven', 'raven', 'raven', 'raven'], aware: 4, respawn: 1440, roams: false },
    { id: 'm8_troll', x: 17, y: 16, monsters: ['tor_troll'], aware: 3, respawn: 2880, roams: false, when: { hours: 'night' } },
  ],
};
