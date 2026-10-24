// The Upper Water, box A3: the rim's foot behind the willows. Country, band 10-11: a corner of hill and
// grass under the rim, in from B3's grass below the willows' last trees, which stand in a line down its
// east edge, and down onto A4's hills. A bull toad and a heron off the willows keep the corner, and a
// well-house is walled into the rim's foot over a spring, a willow hung with rags at its door. The
// north-east corner is the rim, as B3 closes it, the Long Water's first shallows behind it. Cut from the
// atlas by hand, its void written in; docs/areas/saltreach.md §12 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { WEST } from '../../../../game/types.ts';
import { RESPAWN } from '../../../../game/keys.ts';

export const UPPERWATER_A3: MapDef<'upperwater_a3'> = {
  id: 'upperwater_a3',
  name: 'The Upper Water',
  kind: 'outdoor',
  density: 'country',
  band: [10, 11],
  region: 'saltreach',
  start: { x: 31, y: 28, facing: WEST },
  rows: [
    '%%%%%%%%%%%%%%%%%%%%%%%MMMMMMMMM',
    '%%%%%%%%%%%%%%%%%%%%%%%MMMMMMMMM',
    '%%%%%%%%%%%%%%%%%%%%%%MMMMMMMMMM',
    '%%%%%%%%%%%%%%%%%%%%%%%MMMMMMMMM',
    '%%%%%%%%%%%%%%%%%%%%%%MMMMMMMMMT',
    '%%%%%%%%%%%%%%%%%%%%%%MMMMMMMMMT',
    '%%%%%%%%%%%%%%%%%%%%%MMMMMMMMMTT',
    '%%%%%%%%%%%%%%%%%%%%%MMMMMMMMTTT',
    '%%%%%%%%%%%%%%%%%%%%%%MMMMMMMTTT',
    '%%%%%%%%%%%%%%%%%%%%%%MMMMMMMMTT',
    '%%%%%%%%%%%%%%%%%%%%%%%MMMMMMMMT',
    '%%%%%%%%%%%%%%%%%%%%%%%MMMMMMMMT',
    '%%%%%%%%%%%%%%%%%%%%%%MMMMMMMMMT',
    '%%%%%%%%%%%%%%%%%%%%%MMMMMMMMMTT',
    '%%%%%%%%%%%%%%%%%%%MMMMMMMMMMMTT',
    '%%%%%%%%%%%%%%%%%%%MMMMMMMMMMMTT',
    '%%%%%%%%%%%%%%%%%%MMMMMMMMMMMMTT',
    '%%%%%%%%%%%%%%%%%MMMMMMMMMMMMMTT',
    '%%%%%%%%%%%%%%%%%MMMMMMMMMMMMMTT',
    '%%%%%%%%%%%%%%%%%MMMMMMMMMMMMTTT',
    '%%%%%%%%%%%%%%%%%MMMMMMMMMMMMMTT',
    '%%%%%%%%%%%%%%%%%MMMMMMMMMMMMTTT',
    '%%%%%%%%%%%%%%%%%MMMMMMMMMMMTTTT',
    '%%%%%%%%%%%%%%%%MMMMMMMMMMMM^TTT',
    '%%%%%%%%%%%%%%%%MMMMMMMMMMM^^^^T',
    '%%%%%%%%%%%%%%%MMMMMMMMMMMM^^^^T',
    '%%%%%%%%%%%%%%%MMMMMMMBBBBT^^^^^',
    '%%%%%%%%%%%%%%%MMMMMMMB::S^^^^^,',
    '%%%%%%%%%%%%%%%MMMMMMMBBBB^^^^^,',
    '%%%%%%%%%%%%%%MMMMMMMMMMM^^^^^,,',
    '%%%%%%%%%%%%%%MMMMMMMMMMM^^^^,,,',
    '%%%%%%%%%%%%%%MMMMMMMMMM^^^^^,,,',
  ],
  features: [
    // In under the willows' last trees from B3's grass; up the line of them, the river out of the rim.
    { kind: 'event', x: 28, y: 23, id: 'a3_shallows', once: true, text: 'Far up the line of the willows the Long Water spills out of the rim over its stones. No way runs up to it.' },
    { kind: 'cairn', x: 25, y: 30, id: 'a3_cairn', text: 'A cairn in the corner under the rim, of round stones out of the river. Moss has grown over its top.', gold: 30, items: ['potion_heal'] },
    // The secret: the well-house walled into the rim's foot, the willow at its door hung with rags.
    { kind: 'event', x: 26, y: 27, id: 'a3_willow', text: 'A willow grows out of the rim\'s foot beside a walling of stone. Rags are tied up its trunk, one above another, faded white.' },
    { kind: 'event', x: 25, y: 27, id: 'a3_wellhouse', once: true, text: 'A well-house in the rock, a spring rising under it into a stone basin. Its sill is heaped with sea shells.' },
    { kind: 'chest', x: 24, y: 27, id: 'a3_wellhouse_chest', gold: 120, items: ['potion_heal'] },
  ],
  secrets: [{ x: 25, y: 27, hint: 'a3_willow' }],
  encounters: [
    // A bull toad and a heron off the willows, the corner's one fight, kept to it.
    { id: 'a3_toad', x: 28, y: 24, monsters: ['bull_toad', 'grey_heron'], aware: 4, roams: false, respawn: RESPAWN.day },
  ],
};
