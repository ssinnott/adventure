// Cairnmoor, box O8: the bog. Country, band 18-19: High Moor's peat bog below the ring, off the road,
// the lights' own ground; in from N8's heather and O7's foot, where the tarn's stream clips the corner;
// the peat-cutter's hut at the bog's north-west edge, the body he dug up laid out beside it and his
// cuttings below; the bog in the middle, pools and cuttings and duckboards half sunk, and out east the
// cutting he stopped at; on the hills south the tors with faces cut in them, the stonecutter's fire
// under them, and the first of the Rimefells at the south-east corner.
// Cut from the atlas by tools/scaffold.ts; docs/areas/cairnmoor.md §4.4 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const HIGHMOOR_O8: MapDef = {
  id: 'highmoor_o8',
  name: 'High Moor',
  kind: 'outdoor',
  density: 'country',
  band: [18, 19],
  region: 'cairnmoor',
  start: { x: 6, y: 1, facing: SOUTH },
  rows: [
    '~hhhhhhhhhhhhhhhh**hh^^^^^^^^^MM',
    'hhhhhhhhhhhhhhhhhhhhhh^rrrrr^^^M',
    'hhhhhhhhhhhhhhhhhhhhh^^^rrr^^^^^',
    'hhhBBhhhhhhhhh**hhhhhh^^^^^^^^^^',
    'hhhhhhhhhhhhhhhhhhhhhhh^^^^^^**^',
    'hhhhwwwwwwwwhhhhhhhhhhhh^^^^^^^^',
    'hhhw::w::wwwwwhhhhhhhhhh^^^^^^^^',
    'hhww::w::w~~wwwwhhhhhhhhh^^^^^^^',
    'hhwwwwwww~~~wwwwwwhhhhhhh^^^^^^^',
    'hhw~~ww:wwwwww::wwwwhhhhhh^^^^^^',
    'hhw~WW~w:wwwww::wwwwwhhhhh^^^^^^',
    'hhw~WWW~w:wwwwwwwwrrrrwhhhh^^^^^',
    'hhw~~WW~w:www~~wwwS::rwhhhh^^^^^',
    'hhww~~~ww:ww~~W~wwrrrrwwhhh^^^^^',
    'hhwwwwwww:www~~wwwwwwwwwhhh^^^^^',
    'hhhwwwww:wwwwwwwww::wwwwhhhh^^^^',
    'hhhww~ww:wwwww~~ww::wwwwwhhh^^^^',
    'hhhwww~w::wwww~W~wwwwww~wwhh^^^^',
    'hhhwwwwww:wwwww~~wwwww~~wwhhh^^^',
    'hhhhwwwwww::wwwwwwww~~~wwhhhh^^^',
    'hhhhwwww~~ww:wwwwwwwwwwwhhhhh^MM',
    'hhhwwww~~wwww::wwwwwwwwhhhhh^^MM',
    'wwwwwwwwwwwwww:wwwwwwhhhhhhh^^MM',
    'wwwwww~~wwwwwwwwwwwhhhhhhhhh^^MM',
    'wwwww~~wwwwwwwwwwhhhhhhhhhhh^^MM',
    'wwwwwwwwwwwwwhhhhhhh^^^hhh^^^^MM',
    'wwwwwwwhhhhhhhhh^^^^rr^^^^^^^MMM',
    'wwwhhhhhhh^^rr^^^^^^rr^^^rr^^MMM',
    'hhhhhhhhh^^^rr^^^^^^^^^^^r*^^MMM',
    'hhhhhhhhh^^^^^^^^^^^^^^^^^^^MMMM',
    'hhhhhhhhhh^^^^^^^*^^^^^^^^^^MMMM',
    'hhhhhhhhhhh^^^^^^^^^^^^^^^^^MMMM',
  ],
  features: [
    // In from N8's heather and O7's foot, where the tarn's stream clips the corner; the peat-cutter at
    // his hut, the body he dug up laid out beside it (#56's 38, #482), and his cuttings below, one of
    // them the body's own, where it lies down again.
    { kind: 'event', x: 1, y: 1, id: 'o8_stream', once: true, text: 'The tarn\'s stream comes down out of the north, black and quick, and goes off west.' },
    { kind: 'event', x: 12, y: 4, id: 'o8_view', once: true, text: 'Below, the bog: brown and flat to the hills, pools shining in it, the cuttings in black lines.' },
    { kind: 'event', x: 2, y: 3, id: 'o8_body', once: true, text: 'Beside the hut a body lies on a hurdle, brown as the peat, a rope round its neck.' },
    { kind: 'npc', x: 5, y: 3, name: 'A peat-cutter', lines: [
      'A peat-cutter at his hut door, black to the elbows, his spade stood in the turf.',
      '"Dug him out of my cutting with a rope round his neck and a ring on his hand."',
      '"Every night he gets up and goes back to his cutting. Every morning I fetch him."',
      '"There is a cutting out east I stopped at. I have not been back."',
    ] },
    { kind: 'event', x: 6, y: 6, id: 'o8_cuttings', once: true, text: 'Peat cuttings in rows, their banks black and wet, the turves stacked to dry on the heather.' },
    { kind: 'event', x: 8, y: 7, id: 'o8_lies', once: true, text: 'An old cutting, and pressed into its wet floor the shape of a man lying down.' },
    // The hills east of the bog: the rocks over it and the cairn on the top (#45).
    { kind: 'event', x: 24, y: 3, id: 'o8_rocks', once: true, text: 'Rocks on the hill above the bog, and from them the whole bog laid out, and the tors beyond.' },
    { kind: 'cairn', x: 28, y: 7, id: 'o8_cairn', text: 'A cairn on the hilltop, its stones furred with frost, a raven\'s feather caught in them.', gold: 260, items: ['potion_sp_great'] },
    // The bog: the duckboards out over it, a pool, and the cutting the peat-cutter stopped at, black,
    // where the lights come up by night; the bog's edge west against the Cairnfield's marsh.
    { kind: 'event', x: 9, y: 12, id: 'o8_boards', once: true, text: 'Duckboards out over the bog, the old ones sunk to the slats, new ones laid over them.' },
    { kind: 'event', x: 17, y: 12, id: 'o8_cutting', once: true, text: 'A cutting left half dug, the spade marks old on its face. The peat in it is black as pitch.' },
    { kind: 'event', x: 16, y: 12, id: 'o8_rising', once: true, when: { hours: 'night' }, text: 'Out of one cutting a light comes up, then another. They drift away north toward the ring.' },
    { kind: 'event', x: 19, y: 12, id: 'o8_gold', once: true, text: 'In the black peat at the cutting\'s end, gold: rings, a torc, and a seax in a sheath gone hard as horn.' },
    { kind: 'chest', x: 20, y: 12, id: 'o8_hoard', gold: 1140, items: ['seax+1'] },
    { kind: 'event', x: 16, y: 16, id: 'o8_pool', once: true, text: 'A pool in the bog, still and black. Bubbles come up in it slowly, from a long way down.' },
    { kind: 'event', x: 2, y: 22, id: 'o8_west', once: true, text: 'West, the bog runs on into the Cairnfield\'s marsh, crusted with ice.' },
    // South, the tors on the hills, each with a face cut in it by day, and the last face half cut
    // (#56's 39, #482); the stonecutter's fire under them; and the Rimefells' first mountain.
    { kind: 'event', x: 19, y: 23, id: 'o8_tors', once: true, text: 'South the hills rise to tors, three of them, grey slabs heaped up on the skyline.' },
    { kind: 'event', x: 27, y: 22, id: 'o8_rimefells', once: true, text: 'The first of the Rimefells stands up out of the moor, white from its foot to its top.' },
    { kind: 'camp', x: 16, y: 25, name: 'Under the tors', text: 'A fire under the tors, ringed with stones, chippings of granite trodden into the ash.' },
    { kind: 'npc', x: 17, y: 25, name: 'A stonecutter', lines: [
      'A stonecutter at his fire under the tors, his chisels laid out in a row on a cloth.',
      '"Every tor up there has a face. My father cut most of them. The last is mine."',
      '"I stop at dark. You would do well to."',
    ] },
    { kind: 'event', x: 12, y: 26, id: 'o8_face', once: true, when: { hours: 'day' }, text: 'A tor of grey slabs. In the top slab a face is cut, its eyes shut, its mouth a long crack.' },
    { kind: 'event', x: 19, y: 26, id: 'o8_face_old', once: true, when: { hours: 'day' }, text: 'Another tor, another face: an old man\'s, frowning, lichen thick in its brows.' },
    { kind: 'event', x: 24, y: 27, id: 'o8_half', once: true, text: 'The last tor. Its face is half cut: a brow and one eye, and the chisel marks fresh below.' },
    { kind: 'shrine', x: 6, y: 29, id: 'o8_shrine', text: 'A stone of the hill folk\'s by the bog\'s edge, a cup cut in its top, the water in it skinned with ice.', stat: 'speed', done: 'The cup-stone, its water skinned with ice.' },
  ],
  secrets: [{ x: 18, y: 12, hint: 'o8_cutting' }],
  encounters: [
    // By night: the bog bodies up out of the cuttings by the hut, the body that walks among them
    // (#56's 38); the lights over the bog, two flights of them, draining spell points; the moor
    // hounds on the hills east; and on the tors, two trolls and the ravens, the box's hardest, mended
    // each round unless burned (#537). By day the bog is empty and the trolls are tors.
    { id: 'o8_bodies', x: 7, y: 8, monsters: ['bog_body', 'bog_body', 'bog_body', 'bog_body'], aware: 2, respawn: 1440, when: { hours: 'night' } },
    { id: 'o8_lights_west', x: 6, y: 14, monsters: ['bog_light', 'bog_light', 'bog_light'], aware: 4, respawn: 2880, when: { hours: 'night' } },
    { id: 'o8_lights_east', x: 15, y: 19, monsters: ['bog_light', 'bog_light', 'bog_light'], aware: 4, respawn: 2880, when: { hours: 'night' } },
    { id: 'o8_hounds', x: 27, y: 14, monsters: ['moor_hound', 'moor_hound', 'moor_hound'], aware: 5, respawn: 2880, when: { hours: 'night' } },
    { id: 'o8_trolls', x: 22, y: 28, monsters: ['tor_troll', 'tor_troll', 'raven', 'raven', 'raven', 'raven'], aware: 3, respawn: 2880, roams: false, when: { hours: 'night' } },
  ],
};
