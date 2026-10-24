// The Kilns, box P4: the strip's north end. Country, band 16-18, the bounds' last box (#831): two pockets
// of hills under the rim and no group in either. The north pocket runs down O4's east edge between the
// crag's tail and the rim's rock, a strip of hills with the dwarves' spring-head in the rock behind a
// line of rushes, a stone basin with the coins of those who drank. The south pocket is P5's north end
// run on: a cairn at the hills' head and a dip in the rim with the haze over it. The stream from the
// north-west corner, in the shallows, runs on into O4. The P column is 24 wide: cut by hand from the
// atlas, the void written '%'; docs/areas/kilns.md §12.6 is its brief.
import type { MapDef } from '../../../../game/mapdef.ts';
import { EAST } from '../../../../game/types.ts';

export const KILNSHEART_P4: MapDef<'kilnsheart_p4'> = {
  id: 'kilnsheart_p4',
  name: 'The Kilns',
  kind: 'outdoor',
  density: 'country',
  band: [16, 18],
  region: 'kilns',
  start: { x: 0, y: 11, facing: EAST },
  rows: [
    'MMMMM%%%%%%%%%%%%%%%%%%%',
    'MMMM%%%%%%%%%%%%%%%%%%%%',
    'MMMM%%%%%%%%%%%%%%%%%%%%',
    'MMM~~%%%%%%%%%%%%%%%%%%%',
    'MM~~M%%%%%%%%%%%%%%%%%%%',
    'M~MMMMM%%%%%%%%%%%%%%%%%',
    '~MMMMMM%%%%%%%%%%%%%%%%%',
    '^MMMMMMM%%%%%%%%%%%%%%%%',
    '^MMMMMMMM%%%%%%%%%%%%%%%',
    '^MMMMMMMM%%%%%%%%%%%%%%%',
    '^^MMMMMMM%%%%%%%%%%%%%%%',
    '^^MrrrMMM%%%%%%%%%%%%%%%',
    '^^^S.rMMM%%%%%%%%%%%%%%%',
    '^^MrrrMMMM%%%%%%%%%%%%%%',
    '^^MMMMMMMM%%%%%%%%%%%%%%',
    '^^MMMMMMMM%%%%%%%%%%%%%%',
    '^MMMMMMMMMM%%%%%%%%%%%%%',
    '^MMMMMMMMMMM%%%%%%%%%%%%',
    '^MMMMMMMMMMMM%%%%%%%%%%%',
    '^^MMMMMMMMMMM%%%%%%%%%%%',
    '^^MMMMMMMMMMM%%%%%%%%%%%',
    '^MMMMMMMMMMMM%%%%%%%%%%%',
    'MMMMMMMMMMMM%%%%%%%%%%%%',
    'MMMMMMMMMMMMMM%%%%%%%%%%',
    'MMMMMMMMMMMMMM%%%%%%%%%%',
    'MMMMMMMMMMMMMMM%%%%%%%%%',
    'MMMMMMMMMMMMMMM%%%%%%%%%',
    'MMM^^MMMMMMMMMM%%%%%%%%%',
    'M^^^^^MMMMMMMM%%%%%%%%%%',
    'M^^^^^MMMMMMM%%%%%%%%%%%',
    'M^^^^^MMMMMMM%%%%%%%%%%%',
    '^^^^^^MMMMMMM%%%%%%%%%%%',
  ],
  features: [
    // In from O4's hills: the strip between the crag's tail and the rim.
    { kind: 'event', x: 1, y: 10, id: 'p4_mouth', once: true, text: 'East of the quarries the hills pinch to a strip between the crag and the rim\'s rock. A cold draught comes down it.' },
    // The secret: rushes along the rock's foot, and the spring-head behind the face.
    { kind: 'event', x: 2, y: 12, id: 'p4_rushes', once: true, text: 'A line of rushes along the rock\'s foot, green in a dry season. Water seeps out under the face, cold and slow.' },
    { kind: 'event', x: 4, y: 12, id: 'p4_spring', once: true, text: 'A spring-head in the rock: a stone basin, the water in it clear and cold. Coins lie on the bottom, green with age.' },
    { kind: 'chest', x: 4, y: 12, id: 'p4_basin_chest', gold: 150, items: ['elixir'] },
    // The south pocket, P5's hills run on north: a cairn at their head and a dip in the rim.
    { kind: 'cairn', x: 4, y: 28, id: 'p4_cairn', text: 'A cairn at the head of the hills, rim-stone laid in courses like a wall. A hobnailed boot sits on top, toe to the east.', gold: 100, items: ['potion_sp_great'] },
    { kind: 'event', x: 5, y: 30, id: 'p4_view', once: true, text: 'The rim dips here. Over it the haze stands grey and still, and nothing shows through it.' },
  ],
  secrets: [{ x: 3, y: 12, hint: 'p4_rushes' }],
};
