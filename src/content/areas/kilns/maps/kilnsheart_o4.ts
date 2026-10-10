// The Kilns, box O4: the heart's hills. Country, band 16-18: the quarries cut into the crag's foot in
// the north-west, their spoil tipped down the hill and the quarrymen's camp below it; the Fells' pines
// coming down out of O3 across the north; the stream down from the east edge to the south-west corner,
// where it runs on into O5 and N4; and over it the bare hills under the mountain, run on east to the
// world's end. In from N4 over the hills, from O3 under the pines and from O5 at either end of its
// mountain; no road. Cut from the atlas by tools/scaffold.ts; docs/areas/kilns.md §4.15 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST } from '../../../../game/types.ts';

export const KILNSHEART_O4: MapDef = {
  id: 'kilnsheart_o4',
  name: 'The Kilns',
  kind: 'outdoor',
  density: 'country',
  band: [16, 18],
  region: 'kilns',
  start: { x: 1, y: 20, facing: EAST },
  rows: [
    'rrr^^^^^^^^^^^^^^ppppppppppMMMMM',
    'rrr^^^^^^^^^^^^^^^ppppppppppMMMM',
    'rrr^^^^^^^^^^^^^^^^^pp^ppppppMMM',
    'rrrr^^^^^^^^^^^^^^^^^^^^^^^ppMMM',
    'rrrr^^^^^^^^^^^^^^^^^^^^^^^^^^MM',
    'rrrrrr^^^^^^^^^^^^^^^^^^^^^^^^MM',
    'rrrr"""""^^^^^^^^^^^^^^^^^^^^^^~',
    'r""S"""""^^^^^^^^^^^^^^^^^^^^~~^',
    'rrrr"""""::^^^^^^^^^^^^^^^^^~~^^',
    'rrrr""""":::^^^^^^^^^^^^^^^~~^^^',
    'rrrr"""""::::^^^^^^^^^^^^^~^^^^^',
    'rrrr"""""^^:^^^^^^^^^^^^^~^^^^^^',
    'rrrrr^^^^^^^^^^^^^^^^^^~~^^^^^^^',
    'rr^r^^^^^^^^^^^^^^^^^^~~^^^^^^^^',
    'rr^^^^^^^^^^^^^^^^^^^~~^^^^^^^^^',
    '^^^^^^^^^^^^^^^^^^^^~~^^^^^^^^^^',
    '^^^^^^^^^^^^^^^^^^^~~^^^^^^^^^^^',
    '^^^^^^^^^^^^^^^^^^~~^^^^^^^^^^^^',
    '^^^^^^^^^^^^^^^^^~~^^^^^^^^^^^^^',
    '^^^^^^^^^^^^^^^^~~^^^^^^^^^^^^^^',
    '^^^^^^^^^^^^^^^~~^^^^^^^^^^^^^^^',
    '^^^^^^^^^^^^^~~^^^^^^^^^^^^^^^^^',
    '^^^^^^^^^^^^~~^^^^^^^^^^^^^^^^^M',
    '^^^^^^^^^^~~~^^^^^^^^^^^^^^^^MMM',
    '^^^^^^^^^~~^^^^^^^^^^^^^^^^MMMMM',
    '^^^^^^^^~~^^^^^^^^^^^^^^^MMMMMMM',
    '^^^^^^~~~^^^^^^^^^^^^^^^MMMMMMMM',
    '^^^^^~~^^^^^^^^^^^^^^^MMMMMMMMMM',
    '^^^^~~^^^^^^^^^^^^^^MMMMMMMMMMMM',
    '^^^~~^^^^^^^^^^^^^MMMMMMMMMMMMMM',
    '^~~~^^^^^^^^^^^^MMMMMMMMMMMMMMMM',
    '~~^^^^^^^^^^^MMMMMMMMMMMMMMMMMMM',
  ],
  features: [
    // The quarries in the crag's foot: the faces, the crane on the lip and the spoil down the hill.
    { kind: 'event', x: 6, y: 7, id: 'o4_quarry', once: true, text: 'Quarries cut square into the crag\'s foot, ledge under ledge, the faces grey and the wedge-marks sharp.' },
    { kind: 'event', x: 9, y: 6, id: 'o4_crane', once: true, text: 'A crane of squared timbers on the quarry\'s lip, its jib swung out, a cut block still hanging in its chains.' },
    { kind: 'event', x: 10, y: 9, id: 'o4_spoil', once: true, text: 'Spoil from the quarries tipped down the hill in grey fans. Nothing grows on it yet.' },
    // The block never taken from the face, and the quarrymen's pay-hole behind it.
    { kind: 'event', x: 4, y: 7, id: 'o4_face', once: true, text: 'Every block taken from this face has left its wedge-marks round it. One was never taken: its joints are mortared.' },
    { kind: 'event', x: 2, y: 7, id: 'o4_payhole', once: true, text: 'A room cut square into the rock behind it: a bench, a lamp-niche black with soot and a strongbox.' },
    { kind: 'chest', x: 1, y: 7, id: 'o4_payhole_chest', gold: 250, items: ['potion_sp_great'] },
    // The quarrymen's camp, and the one left at it.
    { kind: 'camp', x: 12, y: 16, name: 'The quarrymen\'s camp', text: 'The quarrymen\'s camp under the spoil: a lean-to of cut slabs, a hearth, a grindstone for the wedges.' },
    { kind: 'npc', x: 13, y: 17, name: 'A quarryman', lines: [
      'A quarryman sharpening wedges at the grindstone, alone. The quarry is quiet behind him.',
      '"Salamanders come up through the warm stone. Split a block, and as like as not one comes out of it."',
      '"The hall pays in iron, and late. The others went down to the kilns. I stayed for the stone."',
    ] },
    // The Fells' pines across the north, a block the sledge never brought down, and the stream.
    { kind: 'event', x: 22, y: 2, id: 'o4_pines', once: true, text: 'The Fells\' pines come down this far and stop, as if at a line. Below them the hills are bare.' },
    { kind: 'event', x: 3, y: 26, id: 'o4_block', once: true, text: 'A cut block on the hillside, a sledge\'s broken runners under it. It got no further.' },
    { kind: 'event', x: 10, y: 21, id: 'o4_stream', once: true, text: 'A stream down off the hills, warm to the hand. It steams where it runs over stone.' },
    // Over the stream, the bare hills under the mountain, and the haze where the world ends.
    { kind: 'cairn', x: 25, y: 16, id: 'o4_cairn', text: 'A cairn on the bare hill over the stream, a quarryman\'s wedge laid on its top.', gold: 110, items: ['potion_sp_great'] },
    { kind: 'event', x: 29, y: 11, id: 'o4_edge', once: true, text: 'East the hills fall away into a haze that does not lift. Nothing shows through it.' },
    { kind: 'event', x: 15, y: 27, id: 'o4_ridge', once: true, text: 'South, the mountain\'s shoulder, and over it a shimmer of heat where the Stone\'s hills are.' },
  ],
  secrets: [{ x: 3, y: 7, hint: 'o4_face' }],
  encounters: [
    // The salamanders on the quarry floor, come up out of the warm stone; and further in, under the
    // pines' edge, a pair of rock worms, the box's top.
    { id: 'o4_salamanders', x: 6, y: 10, monsters: ['salamander', 'salamander', 'salamander'], aware: 3, respawn: 1440 },
    { id: 'o4_worms', x: 25, y: 4, monsters: ['rock_worm', 'rock_worm'], aware: 2, respawn: 2880, roams: false },
  ],
};
