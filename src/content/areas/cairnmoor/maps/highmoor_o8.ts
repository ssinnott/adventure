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
    // The Ring on the Bog Body (#56's 38, #482): the peat-cutter kept the body's ring, and puts where
    // it goes. Put back on its hand, the body is laid in its cutting and gets up no more.
    { kind: 'event', x: 2, y: 3, id: 'o8_body', once: true, until: { flag: 'q_ring_back' }, text: 'Beside the hut a body lies on a hurdle, brown as the peat, a rope round its neck.' },
    { kind: 'npc', x: 5, y: 3, name: 'A peat-cutter', flag: 'q_bog_ring', lines: [
      'A peat-cutter at his hut door, black to the elbows, his spade stood in the turf.',
      '"Dug him out of my cutting with a rope round his neck and a ring on his hand. The ring I kept."',
      '"Every night he gets up and goes back to his cutting, feeling in the peat. Every morning I fetch him."',
      '"There is a cutting out east I stopped at. I have not been back."',
    ], says: [
      { after: { flag: 'q_bog_ring' }, until: [{ flag: 'q_ring_sold' }, { flag: 'q_ring_elves' }, { flag: 'q_ring_back' }], lines: [
        'He holds the ring out on his palm: heavy, black from the peat, a crest cut deep in it.',
        '"There is a man at the Lodge buys old gold for Tallis. Or the elves would want it. Or it goes back on his hand, and I sleep."',
      ], choice: { ask: '"Which?"', answers: [
        { label: 'Sell it to Tallis\'s man.', sets: 'q_ring_sold', pay: { xp: 1200 }, says: [
          'He spits on the ring and rubs it on his sleeve.',
          '"Down on the next coach, then. Tallis pays for a crest."',
        ] },
        { label: 'Give it to the elves.', sets: 'q_ring_elves', gives: 'bog_ring', pay: { xp: 1200 }, says: [
          'He drops it in your hand and wipes his palm on his coat.',
          '"Elves, then. You carry it. I am not walking to Thornhold."',
        ] },
        { label: 'Put it back on his hand.', sets: 'q_ring_back', pay: { xp: 1200 }, says: [
          'At the hurdle you work the ring back onto the brown finger. The peat-cutter takes up his spade.',
          '"Back in his cutting, then. Deep, this time."',
        ] },
      ] } },
      { after: { flag: 'q_ring_back' }, lines: [
        'The peat-cutter is at his stack, his back to the old cutting.',
        '"Not a stir out of him. Not one night."',
      ] },
      { after: [{ flag: 'q_ring_sold' }, { flag: 'q_ring_elves' }], lines: [
        'The peat-cutter does not look up from his spade.',
        '"He was at the door again last night, feeling at the latch."',
      ] },
    ] },
    { kind: 'event', x: 6, y: 6, id: 'o8_cuttings', once: true, text: 'Peat cuttings in rows, their banks black and wet, the turves stacked to dry on the heather.' },
    { kind: 'event', x: 8, y: 7, id: 'o8_lies', once: true, until: { flag: 'q_ring_back' }, text: 'An old cutting, and pressed into its wet floor the shape of a man lying down.' },
    { kind: 'event', x: 8, y: 7, id: 'o8_laid', once: true, after: { flag: 'q_ring_back' }, text: 'The old cutting is filled in, the turves laid back over it and trodden flat.' },
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
    // The Faces on the Tors (#56's 39, #482): the stonecutter puts it. Home, he goes down to Rime
    // Lodge, whose words are Rimewater's; let finish, he cuts the last face whole, and its tor never
    // stands (`o8_last_tor`).
    { kind: 'npc', x: 17, y: 25, name: 'A stonecutter', flag: 'q_faces', lines: [
      'A stonecutter at his fire under the tors, his chisels laid out in a row on a cloth.',
      '"Every tor up there has a face. My father cut most of them. The last is mine."',
      '"I stop at dark. You would do well to."',
    ], says: [
      { after: { flag: 'q_faces' }, until: [{ flag: 'q_faces_home' }, { flag: 'q_faces_finished' }], lines: [
        'He turns a chisel over in his hands.',
        '"The Lodge wants me home. They say the trolls get up because I give them faces. They got up when the ring began to talk."',
      ], choice: { ask: '"One face left. Do I finish it, or go home?"', answers: [
        { label: 'Go home to the Lodge.', sets: 'q_faces_home', pay: { xp: 1800 }, says: [
          'He rolls his chisels in the cloth and ties it.',
          '"Then the last one looks at the sky with one eye."',
        ] },
        { label: 'Finish the last face.', sets: 'q_faces_finished', pay: { xp: 1800 }, says: [
          'He is up the last tor before you have done saying it, and cuts till the light goes.',
          '"Done. Both eyes."',
        ] },
      ] } },
      { after: { flag: 'q_faces_finished' }, lines: [
        'The stonecutter sits at his fire, looking up at the last tor.',
        '"It has its face now. It stays where it is."',
      ] },
    ], until: { flag: 'q_faces_home' } },
    { kind: 'event', x: 12, y: 26, id: 'o8_face', once: true, when: { hours: 'day' }, text: 'A tor of grey slabs. In the top slab a face is cut, its eyes shut, its mouth a long crack.' },
    { kind: 'event', x: 19, y: 26, id: 'o8_face_old', once: true, when: { hours: 'day' }, text: 'Another tor, another face: an old man\'s, frowning, lichen thick in its brows.' },
    { kind: 'event', x: 24, y: 27, id: 'o8_half', once: true, until: { flag: 'q_faces_finished' }, text: 'The last tor. Its face is half cut: a brow and one eye, and the chisel marks fresh below.' },
    { kind: 'event', x: 24, y: 27, id: 'o8_whole', once: true, after: { flag: 'q_faces_finished' }, text: 'The last tor\'s face is whole now, both eyes open, the chisel marks still white.' },
    { kind: 'shrine', x: 6, y: 29, id: 'o8_shrine', text: 'A stone of the hill folk\'s by the bog\'s edge, a cup cut in its top, the water in it skinned with ice.', stat: 'speed', done: 'The cup-stone, its water skinned with ice.' },
  ],
  secrets: [{ x: 18, y: 12, hint: 'o8_cutting' }],
  encounters: [
    // By night: the bog bodies up out of the cuttings by the hut, the body that walks among them,
    // until its ring is back on its hand (#56's 38); the lights over the bog, two flights of them,
    // draining spell points; the moor hounds on the hills east; and on the tors, two trolls and the
    // ravens, the box's hardest, mended each round unless burned (#537), the last tor's troll alone
    // until its face is finished (#56's 39). By day the bog is empty and the trolls are tors.
    { id: 'o8_bodies', x: 7, y: 8, monsters: ['bog_body', 'bog_body', 'bog_body', 'bog_body'], aware: 2, respawn: 1440, when: { hours: 'night' }, until: { flag: 'q_ring_back' } },
    { id: 'o8_lights_west', x: 6, y: 14, monsters: ['bog_light', 'bog_light', 'bog_light'], aware: 4, respawn: 2880, when: { hours: 'night' } },
    { id: 'o8_lights_east', x: 15, y: 19, monsters: ['bog_light', 'bog_light', 'bog_light'], aware: 4, respawn: 2880, when: { hours: 'night' } },
    { id: 'o8_hounds', x: 27, y: 14, monsters: ['moor_hound', 'moor_hound', 'moor_hound'], aware: 5, respawn: 2880, when: { hours: 'night' } },
    { id: 'o8_trolls', x: 22, y: 28, monsters: ['tor_troll', 'raven', 'raven', 'raven', 'raven'], aware: 3, respawn: 2880, roams: false, when: { hours: 'night' } },
    { id: 'o8_last_tor', x: 26, y: 28, monsters: ['tor_troll'], aware: 3, respawn: 2880, roams: false, when: { hours: 'night' }, until: { flag: 'q_faces_finished' } },
  ],
};
