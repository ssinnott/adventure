// The Kilns, box P6: the ash under the vents. Country, band 16-18, the bounds' third (#831): the vents'
// last ash east of Feuerstollen's ridge, grey and warm underfoot, a wedge between O6's edge and the rim
// that narrows to a single square in the south; the hills over it with a cairn and the vent-keepers' old
// shelter, a warm vent in the rim's foot where a slag elder strayed off the ridge stands with a
// salamander, a milestone left in the ash, and the vent-keepers' store behind the rock face. O6's crag
// runs on across the seam in the north, and High Moor's 45 squares in the south are mountain, closed.
// The P column is 24 wide: cut by hand from the atlas, the void written '%'; docs/areas/kilns.md §12.4
// is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST } from '../../../../game/types.ts';
import { RESPAWN } from '../../../../game/keys.ts';

export const KILNSHEART_P6: MapDef<'kilnsheart_p6'> = {
  id: 'kilnsheart_p6',
  name: 'The Kilns',
  kind: 'outdoor',
  density: 'country',
  band: [16, 18],
  region: 'kilns',
  start: { x: 0, y: 20, facing: EAST },
  rows: [
    'r^^^^^^^^^^MMMMMMMM%%%%%',
    'r^^^^^^^^^^^MrrrrMM%%%%%',
    '^^^^^^^^^^^^^S.rrMMM%%%%',
    '^^^^^^^^^^^^^r..rMMM%%%%',
    'a^^^^^^^^^^^^rrrrMMM%%%%',
    'aaa^^^^^^^^^^MMMMMMM%%%%',
    'aaaa^^^^^^^^MMMMMMM%%%%%',
    'aaaaa^^^^^^^MMMMMMM%%%%%',
    'aaaaa^^^^^^^MMMMMMM%%%%%',
    'aaaa^^^^^^^MMMMMMM%%%%%%',
    'aaaaa^^^^^^MMMMMMM%%%%%%',
    'aaaaa^^^^^MMMMMMMM%%%%%%',
    'aaaaa^^^^^MMMMMMMM%%%%%%',
    'aaaaaa^^^MMMMMMMMM%%%%%%',
    'aaaaaa^MMMMMMMMM%%%%%%%%',
    'aaaaaaMMMMMMMMMM%%%%%%%%',
    'aaaaaMMMMMMMMMMM%%%%%%%%',
    'aaaaaMMMMMMMMMM%%%%%%%%%',
    'aaaaaMMMMMMMMMM%%%%%%%%%',
    'aaaaaMMMMMMMMMM%%%%%%%%%',
    'aaaaMMMMMMMMMMM%%%%%%%%%',
    'aaaaMMMMMMMMMM%%%%%%%%%%',
    'aaaaMMMMMMMMMM%%%%%%%%%%',
    'aaaMMMMMMMMMM%%%%%%%%%%%',
    'aaaMMMMMMMMMM%%%%%%%%%%%',
    'aaaMMMMMMMMMM%%%%%%%%%%%',
    'aaMMMMMMMMMM%%%%%%%%%%%%',
    'aMMMMMMMMMM%%%%%%%%%%%%%',
    'aMMMMMMMMMM%%%%%%%%%%%%%',
    '^MMMMMMMMM%%%%%%%%%%%%%%',
    'MMMMMMMMMM%%%%%%%%%%%%%%',
    'MMMMMMMMMM%%%%%%%%%%%%%%',
  ],
  features: [
    // In over the ash from O6, past the ridge's smoke.
    { kind: 'event', x: 1, y: 20, id: 'p6_ash', once: true, text: 'East of the ridge the ash lies grey and unbroken to the rim, and warm through the boots.' },
    // The milestone left in the ash, and the drift in a hill's lee.
    { kind: 'statue', x: 2, y: 24, id: 'p6_milestone', name: 'A milestone', text: 'A dwarves\' milestone, its road long buried and its figures filled in grey. Words are cut below.', riddle: 'I FALL LIKE SNOW AND I AM WARM. WHAT AM I?', answer: 'ash', gift: { stat: 'endurance' }, done: 'The milestone, its figures full of ash.' },
    { kind: 'event', x: 5, y: 13, id: 'p6_drift', once: true, text: 'Ash drifted deep in the lee of the hill, smooth as snow. A hand\'s depth down it is warm.' },
    // The hills: the cairn, the warm vent in the rim's foot, and the vent-keepers' shelter.
    { kind: 'cairn', x: 8, y: 7, id: 'p6_cairn', text: 'A cairn on the hills\' crest, ash packed between its stones like mortar.', gold: 110, items: ['potion_sp_great'] },
    { kind: 'event', x: 7, y: 9, id: 'p6_vent', once: true, text: 'A vent in the rim\'s foot breathes hot. The ash round its lip has fused to a black glaze.' },
    { kind: 'camp', x: 3, y: 2, name: 'The vent-keepers\' shelter', text: 'Slabs leaned on the hill for a roof, an old dwarf\'s mark cut in the lintel. The vent-keepers slept here.' },
    // The secret: the one bare ledge of the rock face, and the store round the turn behind it.
    { kind: 'event', x: 12, y: 2, id: 'p6_ledges', once: true, text: 'Ash lies on every ledge of the rock face but one. On that one it stirs, in a draught that comes out warm.' },
    { kind: 'event', x: 14, y: 2, id: 'p6_store', once: true, text: 'A passage cut into the rock, and round its turn the vent-keepers\' store: rope, tallow and iron spikes.' },
    { kind: 'chest', x: 15, y: 3, id: 'p6_store_chest', gold: 250, items: ['elixir', 'elixir'] },
  ],
  secrets: [{ x: 13, y: 2, hint: 'p6_ledges' }],
  encounters: [
    // Four salamanders on the ash, the nearest and the gentlest, at 16; and at the warm vent under the rim a
    // slag elder strayed east off Feuerstollen's ridge with a salamander at its heels, the hardest, at 17,
    // until the tear is closed.
    { id: 'p6_salamanders', x: 3, y: 16, monsters: ['salamander', 'salamander', 'salamander', 'salamander'], aware: 3, respawn: RESPAWN.day },
    { id: 'p6_elder', x: 10, y: 10, monsters: ['slag_elder', 'salamander'], aware: 3, respawn: RESPAWN.twoDays, roams: false, until: { flag: 'q_anvil_closed' } },
  ],
};
