// Kilnmouth, box L7: the shore under the port. Country, band 16-18, the bounds' fourth (#831): the heath's
// end, where the heather gives way to grass along the first row, and the strand of sand and shingle
// running down the coast to the Cairnfield's; a sea-coaler at his driftwood fire, an ore spill in the
// grass where the fire beetles feed, a lone rock worm in the dunes behind the strand, a lookout's cairn on
// the knoll at the west end, and the old boundary mound at the seam with the Cairnfield, a chamber in it.
// The sea closes the south. K7's tail, cut, lies past the west edge, shut in mountain as K6's bank is,
// and L6's corner square with it. Cut from the atlas by tools/scaffold.ts;
// docs/areas/kilns.md §12.5 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const KILNMOUTH_L7: MapDef = {
  id: 'kilnmouth_l7',
  name: 'Kilnmouth',
  kind: 'outdoor',
  density: 'country',
  band: [16, 18],
  region: 'kilns',
  start: { x: 28, y: 0, facing: SOUTH },
  rows: [
    'Mhhhhhhhhhhhhh,,,,,,,hh,,,,,,,,,',
    'M^,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    '~,,,,,,,,,__,,,,,,,,,,,,,,,,,,,,',
    '~~~~,,,___~~_,,,,,,,,,,,,,rrrrr,',
    'W~~~~~~~~~~~__,,__,,,,,,,,S..rr,',
    'WWWW~~~~~~W~~~__~~___,,,,,r..rr,',
    'WWWWWWWWWWWW~~~~~~~~~__,,,rrrrr,',
    'WWWWWWWWWWWWWW~~WW~~~~~__,,,,,,,',
    'WWWWWWWWWWWWWWWWWWWWW~~~~__,__,,',
    'WWWWWWWWWWWWWWWWWWWWWWW~~~~_~~_,',
    'WWWWWWWWWWWWWWWWWWWWWWWWW~~~~~__',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWW~W~~~',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW~~',
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
    // In from Kilnhaven's heath over the north edge, where the heather gives out.
    { kind: 'event', x: 27, y: 1, id: 'l7_heath', once: true, text: 'The heather gives out along a line of turf. South of it the grass runs down to the strand and the sea.' },
    // The ore spill on the grass, where the beetles feed.
    { kind: 'event', x: 22, y: 2, id: 'l7_spill', once: true, text: 'A cartload of ore tipped across the grass, the turf under it scorched black. Small hot things have been feeding here.' },
    // The strand: the driftwood fire, the sea-coaler at it and the lighter aground.
    { kind: 'camp', x: 15, y: 5, name: 'The driftwood fire', text: 'A driftwood fire in a ring of beach stones, banked with sand, and a spar to sit on.' },
    { kind: 'npc', x: 16, y: 4, name: 'A sea-coaler', lines: [
      'A man works the tide line with a rake and a sack, picking black lumps from the wrack and weighing each in his hand.',
      '"Sea-coal, off colliers that never made harbour. It burns slow, and the dwarves will not buy it."',
      '"Keep out of the dunes west of the fire. The sand turns over there when there is no wind to turn it."',
    ] },
    { kind: 'event', x: 19, y: 5, id: 'l7_wreck', once: true, text: 'A lighter aground on the strand, bows stove, hold full of sand. A cormorant dries its wings on her tiller.' },
    // The dunes in the west, behind the strand, and the lookout's cairn on the knoll beyond them.
    { kind: 'event', x: 8, y: 2, id: 'l7_dunes', once: true, text: 'Low dunes behind the strand, the sand combed into ridges. Across one the ridges run the wrong way, as if turned from below.' },
    { kind: 'cairn', x: 1, y: 1, id: 'l7_lookout', text: 'A lookout\'s cairn on the knoll, built stone by stone from the strand. The coast runs away east, white where it breaks.', gold: 100, items: ['potion_sp_great'] },
    // The boundary mound at the seam, the kerbstone out of its ring and the chamber behind it.
    { kind: 'event', x: 28, y: 2, id: 'l7_mound', once: true, text: 'The old boundary mound, a long heap of grey stones on the line between the Kilns and the Cairnfield, kerbed all round.' },
    { kind: 'event', x: 25, y: 4, id: 'l7_kerb', once: true, text: 'A kerbstone on the mound\'s west side leans out of its ring, the grass worn from its foot.' },
    { kind: 'event', x: 27, y: 4, id: 'l7_cist', once: true, text: 'A chamber of laid slabs under the mound, dry as dust. Coin of both lands was put down here when the line was drawn.' },
    { kind: 'chest', x: 28, y: 5, id: 'l7_cist_chest', gold: 200, items: ['elixir'] },
  ],
  secrets: [{ x: 26, y: 4, hint: 'l7_kerb' }],
  encounters: [
    // Four fire beetles at the ore spill, the nearest and the gentlest, at 16; and in the dunes behind the
    // strand a lone rock worm, the hardest, at 17, where the country's worms go in pairs.
    { id: 'l7_beetles', x: 22, y: 3, monsters: ['fire_beetle', 'fire_beetle', 'fire_beetle', 'fire_beetle'], aware: 3, respawn: 1440 },
    { id: 'l7_worm', x: 10, y: 2, monsters: ['rock_worm'], aware: 3, respawn: 2880, roams: false },
  ],
};
