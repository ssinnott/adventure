// The Glasswold, box E7: the north of the other island. Country, band 26-27, laid whole in the Wold: the
// island whose south end E8's bar of shallows reaches runs on north here, a swimmer's, its grass cropped
// by nothing; a bar of sand runs out from it to an islet white with gulls, and in the islet's rock a
// castaway's hollow, its door found from the wind moaning in a crack. No group. Wrackholm's last rocks
// stand off its isle's south end across deep water, shut against E6, which no road joins to the Wold;
// the strand's end at the south-west corner is E8's and D7's sand. Cut from the atlas by
// tools/scaffold.ts; docs/areas/glasswold.md §12 is its brief (#833).
import type { MapDef } from '../../../../game/mapdef.ts';
import { NORTH } from '../../../../game/types.ts';

export const WOLD_E7: MapDef<'wold_e7'> = {
  id: 'wold_e7',
  name: 'The Wold',
  kind: 'outdoor',
  density: 'country',
  band: [26, 27],
  region: 'glasswold',
  start: { x: 16, y: 31, facing: NORTH },
  rows: [
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWW~~~~rrrrrrrrr~~WWWW',
    'WWWWWWWWWWWWWW~~~~rrrrrrr~~WWWWW',
    'WWWWWWWWWWWWWWWWW~~~rr~~~~WWWWWW',
    'WWWWWWWWWWWWWWWWWW~~~~~~~WWWWWWW',
    'WWWWWWWWWWWWWWWWWWWW~~WWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWW~~~~WWWWWWWWWWWWWWWWWWWWWW',
    'WWWW~~~~~~~WWWWWWWWWWWWWWWWWWWWW',
    'WWW~~~,,,,~~WWWWWWWWWWWWWWWWWWWW',
    'WW~~,,,,,,~~WWWWWWWWWWWWWWWWWWWW',
    'WW~~,,rrr,,~~WWWWWWWWWWWWWWWWWWW',
    'WW~~,,S:r,,~~WWWWWWWWWWWWWWWWWWW',
    'WW~~,,r:r,_~~WWWWWWWWWWWWWWWWWWW',
    'WWW~~,rrr,_~~WWWWWWWWWWWWWWWWWWW',
    'WW~~,,,,,~_~WWWWWWWWWWWWWWWWWWWW',
    'WWW~~~~~~~__WWWWWWWWWWWWWWWWWWWW',
    'WWWW~~~~~WW__WWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWW__WWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWW__~~~~WWWWWWWWWWWWW',
    'WWWWWWWWWWWWW~__~~~~WWWWWWWWWWWW',
    'WWWWWWWWWWWW~~~,,,,~~WWWWWWWWWWW',
    'WWWWWWWWWWW~~__,,,,~~WWWWWWWWWWW',
    '~~WWWWWWWWW~~_,,,,,,~~WWWWWWWWWW',
    '__~WWWWWWWW~~_,,,,,,~~WWWWWWWWWW',
  ],
  features: [
    // The island's north, in from its south end over the seam with E8's: its grass, and the bar of sand out to
    // the islet.
    { kind: 'event', x: 16, y: 29, id: 'e7_island', once: true, text: 'The island\'s grass stands thick and green, cropped by nothing. Gulls lift off it and settle.' },
    { kind: 'event', x: 15, y: 28, id: 'e7_bar', once: true, text: 'A bar of sand and weed runs out north-west to an islet, the sea lapping at it on both sides.' },
    // The islet: its gulls, and the secret, the wind moaning in a crack of the rock over a castaway's
    // hollow, with what he left.
    { kind: 'event', x: 9, y: 20, id: 'e7_gulls', once: true, text: 'The islet is white with gulls. They rise all at once, screaming, and come down again.' },
    { kind: 'event', x: 5, y: 19, id: 'e7_moan', once: true, text: 'The wind moans in a crack of the rock here, low and long, like a breath across a jar\'s mouth.' },
    { kind: 'event', x: 7, y: 19, id: 'e7_hole', once: true, text: 'A dry hollow under the rock: a bed of grass, a knife and days cut in the wall in fives, many of them.' },
    { kind: 'chest', x: 7, y: 20, id: 'e7_chest', gold: 700, items: ['elixir'] },
    // The strand's end at the corner, E8's and D7's sand, walked onto from them and not from the island.
    { kind: 'event', x: 1, y: 31, id: 'e7_spit', once: true, text: 'The strand runs out here in a spit of grey sand. The island lies over the water to the east.' },
  ],
  secrets: [{ x: 6, y: 19, hint: 'e7_moan' }],
};
