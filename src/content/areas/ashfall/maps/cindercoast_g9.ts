// Ashfall, box G9: Cinderport's harbour side. Country, band 24-25, behind the road: the harbour north of
// the town's wall, held between two moles of the sea wall from the wall out to the Sound, its mouth on the
// cove; west of it the road up the wall's west side to the fishers' slip on the cove at its end, and an old
// fisherman there; east of it the sea wall's outer face, the grass and the black sand along the Sound, a
// cairn and drakes on the beach; and in the east mole, where a step is worn at its foot, a smugglers'
// cell in the wall's thickness.
// In from G10 (#511) over its south edge, walked: the road at 3, the town's wall at 4 to 13 against the
// moles and the harbour, the stream at 14 to 16 and the grass and the vines, square for square with G10's
// 0,0 to 31,0. The harbour parts the box: the road's side is walked from G10's road and F9's grass, the
// east from G10's grass, where the box starts, and H9's. F9 and H9 are west and east; G8 is the sea.
// Cut from the atlas by tools/scaffold.ts; docs/areas/ashfall.md §4.10 is its brief (#522).
import type { MapDef } from '../../../../game/map.ts';
import { NORTH } from '../../../../game/types.ts';

export const CINDERCOAST_G9: MapDef = {
  id: 'cindercoast_g9',
  name: 'Cindercoast',
  kind: 'outdoor',
  density: 'country',
  band: [24, 25],
  region: 'ashfall',
  start: { x: 19, y: 31, facing: NORTH },
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
    '~~~WWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '~~~~~~~W~WWWWWWWWWWWWWWWWWWWWWWW',
    '___~~~~~~~~~~WWWWWWWWWWWWWWWWWWW',
    ',,,___~~~~~~~~~~WWWWWWWWWWWWWWWW',
    ',,,,=BWWWWWWWB~~~~~~~~~~~~~~~WW~',
    ',,,,=BWWWWWWWB__~~~~~~~~~~~~~~~~',
    ',,,,=BWWWWWWWB,,_____________~~_',
    ',,,,=BWWWWWWWB,,,,,,,,,,,,,,,__,',
    ',,,,=BWWWWWWWB,,,,,,,,,,,,,,,,,,',
    ',,,,=BWWWWWBBB,,,,,,,,,,,,,,,,,,',
    ',,,,=BWWWWWB:S,,,,,,,,,,,,,,,,,,',
    ',&,,=BWWWWWBBB~,,,,,,,,,,,,,,,,,',
    '&,&==BWWWWWWWB~~,,,,,,,,,,,,,,,,',
    '&&&=,BWWWWWWWB~~~,,,,,,,,,,,,,,&',
  ],
  features: [
    // In from G10's grass by the knoll: the shore north of the town, and the sea wall's outer face,
    // the masts over it and its end with the harbour's mouth past it.
    { kind: 'event', x: 19, y: 29, id: 'g9_in', once: true, text: 'North of the town the grass runs down to the Sound, and the sea wall goes out into it.' },
    { kind: 'event', x: 14, y: 25, id: 'g9_wall', once: true, text: 'The sea wall\'s outer face, black stone, the Sound slapping at its foot. Over it, masts.' },
    { kind: 'event', x: 14, y: 23, id: 'g9_head', once: true, text: 'The sea wall\'s end, a lantern on an iron post, and past it the harbour\'s mouth.' },
    // The black sand east along the Sound, the cairn on the grass above it and a drake's leavings.
    { kind: 'event', x: 22, y: 24, id: 'g9_gulls', once: true, text: 'Gulls on the black sand, picking over what the town throws off its wall.' },
    { kind: 'event', x: 28, y: 24, id: 'g9_skull', once: true, text: 'A seal\'s skull on the sand, the bone black, as if it had been in a fire.' },
    { kind: 'cairn', x: 27, y: 28, id: 'g9_cairn', text: 'A cairn of black beach stones, an anchor\'s fluke set in the top.', gold: 100, items: ['potion_sp_great'] },
    // The road's side: up the wall's west side to the slip on the cove, and an old fisherman on it.
    { kind: 'npc', x: 3, y: 23, name: 'An old fisherman', lines: [
      'An old fisherman on the slip at the road\'s end, gutting his catch into the cove for the gulls.',
      '"Inside the wall the Compact counts every fish. Out here nobody counts."',
      '"Drakes on the beach of a morning, east of the wall. Go round them."',
    ] },
    // The secret: a step worn at the east mole's foot where nothing needs one; the cell in the wall's
    // thickness behind it, and a smuggler's box.
    { kind: 'event', x: 15, y: 28, id: 'g9_step', once: true, text: 'A step worn hollow at the sea wall\'s foot, though nothing on this side needs a step.' },
    { kind: 'event', x: 12, y: 28, id: 'g9_cell', once: true, text: 'A cell in the wall\'s thickness, dry. A box with no harbour mark on it, and a lamp with no oil.' },
    { kind: 'chest', x: 12, y: 28, id: 'g9_box', gold: 50, items: ['potion_sp_great', 'potion_heal'] },
  ],
  secrets: [{ x: 13, y: 28, hint: 'g9_step' }],
  encounters: [
    // The box's one fight: two drakes on the beach east of the wall, down off the mountain for the seals.
    { id: 'g9_drakes', x: 27, y: 25, monsters: ['cinder_drake', 'cinder_drake'], aware: 5, respawn: 2880 },
  ],
};
