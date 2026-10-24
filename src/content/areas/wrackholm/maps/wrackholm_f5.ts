// Wrackholm, box F5: the north strand's east end. Country, band 13-14, the bounds' first (#835): the
// strand running on east from E5 under the east rocks' north face, the grass of F6's north end above
// it and the open sea north and east. A cairn of shore stones above the weed; a stack of rock with fish
// scales dried on its foot, and behind its face the store where the smugglers kept the bait. In the
// reef at the strand's east end, in sight of the hermit's point, at 16,30, the way in under the reef:
// the door of Nick's Locker, the lair, Old Nick's sea cave (docs/areas/wrackholm.md §12.6). In from F6
// (#189) over its south edge and from E5 (#835) over its west, square for square. No group. Laid whole
// in Wrackholm, cut from the atlas with the rocks drawn in; docs/areas/wrackholm.md §12.3 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { anchored } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

export const WRACKHOLM_F5: MapDef<'wrackholm_f5'> = {
  id: 'wrackholm_f5',
  name: 'Wrackholm',
  kind: 'outdoor',
  density: 'country',
  band: [13, 14],
  region: 'wrackholm',
  start: { x: 7, y: 31, facing: NORTH },
  anchors: { from_nicks_locker: { x: 16, y: 31, facing: SOUTH } },
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
    '~~~~~~~WWWWWWWWWWWWWWWWWWWWWWWWW',
    '~~~~~~~~rrrWWWWWWWWWWWWWWWWWWWWW',
    ',,,,,,,~r"rWWWWWWWWWWWWWWWWWWWWW',
    ',,,,,,,~rSr~~WWWWWWWWWWWWWWWWWWW',
    ',,,,,,,,,,~~~~~WWWWWWWWWWWWWWWWW',
    ',,,,,,,,,,,,,~~~~WWWWWWWWWWWWWWW',
    ',,,,,,,,,,,,,,_r"r~WWWWWWWWWWWWW',
    ',,,,,,,,,,,,,,,____~~~WWWWWWWWWW',
  ],
  exits: [
    anchored({ x: 16, y: 30, to: 'nicks_locker', at: 'start', label: 'You duck in under the reef where the sea goes in, into the dark and the smell of weed.' }),
  ],
  features: [
    // In from F6's grass, the strand running east to the reef.
    { kind: 'event', x: 8, y: 30, id: 'f5_strand', once: true, text: 'The strand runs on east under the rocks\' north face, to where a reef of grey stone goes out into the sea.' },
    // A cairn of shore stones above the weed.
    { kind: 'cairn', x: 2, y: 27, id: 'f5_cairn', text: 'A cairn of shore stones above the weed, a gull\'s skull set on its top stone.', gold: 80, items: ['potion_sp_great'] },
    // The secret: fish scales dried on the stack's foot and the sand trodden before it, and behind its
    // face the store where the smugglers kept the bait, two squares in from the strand.
    { kind: 'event', x: 9, y: 28, id: 'f5_scales', once: true, text: 'Fish scales dried to silver on the rock\'s foot, and the sand before it trodden flat.' },
    { kind: 'event', x: 9, y: 26, id: 'f5_store', once: true, text: 'A cold hollow in the rock, sour with old fish: casks stove in, and a box wedged under them.' },
    { kind: 'chest', x: 9, y: 26, id: 'f5_box', gold: 120, items: ['elixir'] },
  ],
  secrets: [{ x: 9, y: 27, hint: 'f5_scales' }],
};
