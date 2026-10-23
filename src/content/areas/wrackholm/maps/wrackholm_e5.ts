// Wrackholm, box E5: the north strand's west end. Country, band 12-13, the bounds' first (#835): the
// moor's grass running down from E6 to a strand of sand and weed, and the open sea north and west. A
// ship's figurehead stood upright in the sand, a riddle cut in her block; at the strand's east end a
// stack of rock with soot on its face, and behind the face a hollow where a lamp with a red glass was
// kept, with a sea chest. In the black rocks at the strand's west end, at 18,28, the break in the
// wreck's side: the way into the Brokenback, the enclave (docs/areas/wrackholm.md §12.5). In from E6
// (#187) over its south edge, square for square; the strand runs on east into F5 (#835). No group.
// Laid whole in Wrackholm, cut from the atlas with the rocks drawn in; docs/areas/wrackholm.md §12.2
// is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

export const WRACKHOLM_E5: MapDef = {
  id: 'wrackholm_e5',
  name: 'Wrackholm',
  kind: 'outdoor',
  density: 'country',
  band: [12, 13],
  region: 'wrackholm',
  start: { x: 24, y: 31, facing: NORTH },
  rows: [
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWW~~rrr~~',
    'WWWWWWWWWWWWWWWWWWWWWW~~~~~r"r~~',
    'WWWWWWWWWWWWWWWWWWW~W~~~~_,rSr,,',
    'WWWWWWWWWWWWWWWWWW~~~~___,,,,,,,',
    'WWWWWWWWWWWWWWWWWr"r~_,,,,,,,,,,',
    'WWWWWWWWWWWWWWWW~~_,_,,,,,,,,,,,',
    'WWWWWWWWWWWWWWW~~_,,,,,,,,,,,,,,',
    'WWWWWWWWWWWWWW~__,,,,,,,,,,,,,,,',
  ],
  // The Brokenback, the enclave (#845): the break in the wreck's side at 18,28, drawn as stone among the
  // black rocks and walked onto from the strand at 18,29.
  exits: [
    { x: 18, y: 28, to: 'brokenback', tx: 7, ty: 1, tf: SOUTH, label: 'You climb in at the break in her side, over the black rocks and the torn planks.' },
  ],
  features: [
    // In from E6's moor, the grass running down to the strand.
    { kind: 'event', x: 24, y: 30, id: 'e5_strand', once: true, text: 'North of the moor the grass runs down to a strand, weed and timber along the tide\'s line, and the open sea.' },
    // A ship's figurehead stood up above the tide, a riddle cut in her block.
    { kind: 'statue', x: 25, y: 28, id: 'e5_figurehead', name: 'A figurehead', text: 'A ship\'s figurehead stood up in the turf, salt-white to the eyes. Words are cut in her block.', riddle: 'I AM LET GO SO THE SHIP WILL STAY, AND HAULED HOME SO SHE CAN SAIL. WHAT AM I?', answer: 'anchor', gift: { stat: 'endurance' }, done: 'The figurehead in the turf, salt-white to the eyes.' },
    // The secret: soot on the stack's face where a lamp burned, and behind the face the hollow where it
    // was kept, its glass red, with a sea chest.
    { kind: 'event', x: 28, y: 27, id: 'e5_soot', once: true, text: 'Soot on the rock\'s face above head height, old and thick, as if a lamp burned there night after night.' },
    { kind: 'event', x: 28, y: 25, id: 'e5_lamp', once: true, text: 'A hollow in the rock, and a lamp in it with a red glass. Under a sail behind it, a sea chest.' },
    { kind: 'chest', x: 28, y: 25, id: 'e5_chest', gold: 150, items: ['elixir'] },
  ],
  secrets: [{ x: 28, y: 26, hint: 'e5_soot' }],
};
