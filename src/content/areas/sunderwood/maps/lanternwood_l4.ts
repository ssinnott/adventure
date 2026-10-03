// Sunderwood, box L4: the Bay Wood. Country, band 15-16: the river on south-west from the Moth Wood
// to Sunder Bay, a meadow and shingle at its mouth, hills and the range to the east. A den under the
// hill's foot where a sow gone to glass bears cubs born glass (#88); a stone Lantern at the river's
// mouth with a riddle; and above the landing, cut into the mountain, the Hand's carriers' store. It
// opens north to L3 and west to K4 by wading the shore; its east and south stand closed.
// Cut from the atlas by tools/scaffold.ts, the hills past the range drawn as the range;
// docs/areas/sunderwood.md §4.10 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';
import { denBurnt } from '../../../../game/dens.ts';

/** The den burnt: its brood stops coming. */
const DEN_BURNT = denBurnt('lanternwood_l4', 'l4_den');

export const LANTERNWOOD_L4: MapDef = {
  id: 'lanternwood_l4',
  name: 'The Bay Wood',
  kind: 'outdoor',
  density: 'country',
  band: [15, 16],
  region: 'sunderwood',
  start: { x: 21, y: 0, facing: SOUTH },
  rows: [
    'TTTTTTTTTTTTTTTTTTT~~ttTTTTTTTTM',
    'TTTTTTTTTTTTTTTTTT~~tttTTTTTTTTM',
    'TTTTTTTTTTTTTTTTTT~~ttTTTTTTTTTM',
    'TTTTTTTTTTTTTTTTTT~~ttTTTTTTTTTM',
    'TTTTTTTTTTTTTTTTT~~tttTTTTTTTTTM',
    'TTTTTTTTTTTTTTTTT~~ttTTTTTTTTTTM',
    'TTTTTTTTTTTTTTTT~~tttTTTTTTTTTTM',
    'TTTTTTTTTTTTTTTT~~ttTTTTTTTTTTMM',
    'TTTTTTTTTTTTTTTT~tttTTTTTTTTTTMM',
    'TTTTTTTTTTTTTTT~~ttTTTTTTTTTTTMM',
    'TTTTTTTTTTTTTTT~~ttTTTTTTTTTTMMM',
    'TTTTTTTTTTTTTT~~tttttttTTTTTTMMM',
    'TTTTTTTTTTTTTT~~ttTTTTtTTTTTTMMM',
    'TTTTTTTTTTTTT~~tttTTTTtTTTTTTMMM',
    'TTTTTTTTTTTTT~~ttTTTTTtTTTTTMMMM',
    'TTTTTTTTTTTTT~~ttTTTTTtTTTTTMMMM',
    'TTTTTTTTTTTT~~tttTTTTTtTTTTTMMMM',
    'TTTTTTTTTTT~~tttTTTTTTtTTTTMMMMM',
    'TTTTTTTTTT~~~ttTTTTTTTtTTTTMMMMM',
    'TTTTTTTTT~~~tttTTTTTTTtTTTMMMMMM',
    'TTTTTTTT~~~tttTTTTTTTTttt^MMMMMM',
    'TTTTTTT~~ttttTTTTTTTTTtt^^MMMMMM',
    'TTTTTT~~~ttTTTTTTTTTTTtt^MMMMMMM',
    'TTTTTT~~tttTTTTTTTTTTTT^MMMMMMMM',
    'TTTTT~~tttTTTTTTTTTTTT^MMMMMMMMM',
    'TTTT~~~ttTTTTTTTTTTT^^^rrMMMMMMM',
    'TTTT~~tttTTTTTTTT,T^^^S::rMMMMMM',
    'TTT~~tttTTTTTTT,,,^^^^r::rMMMMMM',
    'TTT~~ttTTTTTTT,,,^^^^MMrrMMMMMMM',
    '_,,,,,,,,,,,,,,,^^^^MMMMMMMMMMMM',
    '~___,,,,,,,,,,,^^^^MMMMMMMMMMMMM',
    '~~~~MMMMMMMMMMMMMMMMMMMMMMMMMMMM',
  ],
  features: [
    { kind: 'event', x: 21, y: 1, id: 'l4_way', once: true, text: 'The bank path goes on down from the Moth Wood, the river wider and slower beside it and the trees opening. Salt on the air before the sea is in sight.' },
    { kind: 'cairn', x: 16, y: 14, id: 'l4_cairn', text: 'A cairn on the bank, the stones round and sea-worn, carried up from the mouth. Bear sign round it, and a paw print on the top stone that has not come off.', gold: 170, items: ['potion_sp_great'] },
    // The den (#88) under the hill's foot, up its track off the bank; its sow beside it.
    { kind: 'den', x: 24, y: 21, id: 'l4_den', name: 'A bears\' den', text: 'A hollow under the hill\'s foot, the roots hanging. The sow lies in its mouth, grey, and her cubs are grey from birth.',
      breeds: ['glass_bear'], keepers: 'l4_sow', brood: ['l4_brood'],
      ask: 'The bears at its mouth are dead. Fire the den under the hill, before another litter is born glass?', burn: 'Fire it.', leave: 'Leave it.', burnt: 'The roots take and the hollow draws like a chimney. Under the hill something rings as it cracks, and stops.', ruin: 'The hollow black and fallen in, the roots burnt back to the hill. Nothing is born in it again.', gold: 140, items: ['potion_heal'] },
    // The hills over the bay, and the river's mouth.
    { kind: 'event', x: 19, y: 26, id: 'l4_lookout', once: true, when: { hours: 'day' }, text: 'The bay from the hills: the river\'s mouth below, the shingle, and across the water the Deepthorn\'s last crag standing up out of the far wood.' },
    { kind: 'event', x: 19, y: 26, id: 'l4_lookout_night', once: true, when: { hours: 'night' }, text: 'The bay dark, and across the water the crag darker. On the shore below, a light moving east along the shingle, slow, as a man walks with a load.' },
    { kind: 'statue', x: 9, y: 29, id: 'l4_statue', name: 'A stone Lantern', text: 'A Lantern cut in stone at the river\'s mouth, her hand held up for a lamp, and the hand empty. Moth dust on the fingers, as thick as on any lit lamp.', riddle: 'WHAT COMES TO ANY LIGHT?', answer: 'moths', gift: { gold: 300 }, done: 'The stone Lantern\'s hand, empty, the dust on it.' },
    { kind: 'event', x: 3, y: 30, id: 'l4_post', once: true, text: 'A mooring post on the shingle, rope-worn to a waist, the rope gone. The wear is fresh under the salt, and on the land side only.' },
    { kind: 'camp', x: 12, y: 30, name: 'The meadow', text: 'A meadow where the river slows to the bay, the grass cropped short by something, and the sea on the shingle all night. The moths go over towards the wood.' },
    // The secret: the prints up from the landing, and the store in the mountain above it.
    { kind: 'event', x: 17, y: 28, id: 'l4_prints', once: true, text: 'Boot prints from the hills\' foot to the river\'s mouth, many, deep going down to the water and shallow coming back.' },
    { kind: 'event', x: 23, y: 27, id: 'l4_store', once: true, text: 'A store cut into the mountain above the landing, its door a slab on iron pins. Sacks along the wall, empty, and a strongbox with a grey hand-print on its lid.' },
    { kind: 'chest', x: 24, y: 27, id: 'l4_store_chest', gold: 1100, items: ['wardens_dirk+2'] },
  ],
  secrets: [{ x: 22, y: 26, hint: 'l4_prints' }],
  encounters: [
    // Two deathsheads and a moth on the bank by night, the gentlest by their mean; the den's brood on the bank below its track,
    // back a day after they fall until it is burnt; and the sow beside the den, the box's group at
    // 16, alone so that three bears never stand together.
    { id: 'l4_night', x: 18, y: 7, monsters: ['deathshead', 'sunder_hound', 'sunder_hound'], aware: 4, respawn: 1440, when: { hours: 'night' } },
    { id: 'l4_brood', x: 13, y: 19, monsters: ['glass_bear', 'glass_bear'], aware: 4, respawn: 1440, until: DEN_BURNT },
    { id: 'l4_sow', x: 23, y: 21, monsters: ['glass_bear', 'glass_bear'], aware: 3, roams: false },
  ],
};
