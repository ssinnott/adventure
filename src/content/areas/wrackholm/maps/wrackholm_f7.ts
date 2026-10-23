// Wrackholm, box F7: the strand under the anchorage. Country, band 13-14, the bounds' first (#835): the
// isle's south-east end below F6's cliff, the shingle's sand and the cliff path's rock running on south
// into a knoll and a strand the boats never use, and the open sea round it. A fire-ring of driftwood
// ash, a camp; at the strand's south end a stack of rock with a cut chain rusted into the sand by it,
// and behind its face the hollow where someone hid in irons. In from F6 (#189) over its north edge,
// square for square. No group. Laid whole in Wrackholm, cut from the atlas with the rocks drawn in;
// docs/areas/wrackholm.md §12.4 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const WRACKHOLM_F7: MapDef = {
  id: 'wrackholm_f7',
  name: 'Wrackholm',
  kind: 'outdoor',
  density: 'country',
  band: [13, 14],
  region: 'wrackholm',
  start: { x: 14, y: 0, facing: SOUTH },
  rows: [
    '~__,,,,,,,,rr^^^r___~WWWWWWWWWWW',
    'W~~_,,,,,,^^^^^^^_~~WWWWWWWWWWWW',
    'WW~~__,,,,,^^^^^~~~WWWWWWWWWWWWW',
    'WWW~~~__,,,,,_~_~~WWWWWWWWWWWWWW',
    'WWWW~~~~_rSr_~~~~WWWWWWWWWWWWWWW',
    'WWWWWW~~~r"r~~W~WWWWWWWWWWWWWWWW',
    'WWWWWWWW~rrr~WWWWWWWWWWWWWWWWWWW',
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
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  ],
  features: [
    // In from the shingle at the cliff path's foot, the strand running on south.
    { kind: 'event', x: 14, y: 1, id: 'f7_strand', once: true, text: 'South of the shingle the shore runs on under the cliff, a strand no boat puts in to.' },
    // A fire-ring above the weed, a camp.
    { kind: 'camp', x: 5, y: 1, name: 'A fire under the cliff', text: 'Stones in a ring above the weed, driftwood ash in them, and a scrape in the sand where someone slept.' },
    // The secret: a cut chain rusted into the sand by the stack, and behind its face the hollow where
    // someone hid in irons, with what he left.
    { kind: 'event', x: 10, y: 3, id: 'f7_links', once: true, text: 'Links of chain rusted into the sand by the rock, cut through. Nothing else of whoever wore them.' },
    { kind: 'event', x: 10, y: 5, id: 'f7_hole', once: true, text: 'A hollow in the rock: a bed of weed, a file worn thin and a purse. Someone hid here in irons.' },
    { kind: 'chest', x: 10, y: 5, id: 'f7_purse', gold: 100, items: ['potion_sp_great'] },
  ],
  secrets: [{ x: 10, y: 4, hint: 'f7_links' }],
};
