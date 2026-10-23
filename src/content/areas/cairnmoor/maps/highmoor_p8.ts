// Cairnmoor, box P8: the ledge under the rim. Country, band 18-19, the bounds' second (#834): the hills
// of O8's east edge narrowing south under the rim to a ledge over the bog, a cairn where it is widest, a
// rowan growing out of the bare face, and at the ledge's end the hounds that lie up there. The secret is
// the herds' winter store behind the face where the rowan grows. O8's corner squares are met as built:
// the mountain at 0,0 and 0,1, and the ledge run on down the west column to 0,19 beside O8's hills.
// The P column is 24 wide: cut by hand from the atlas, the void written '%'; docs/areas/cairnmoor.md
// §12.3 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST } from '../../../../game/types.ts';

export const HIGHMOOR_P8: MapDef = {
  id: 'highmoor_p8',
  name: 'High Moor',
  kind: 'outdoor',
  density: 'country',
  band: [18, 19],
  region: 'cairnmoor',
  start: { x: 0, y: 10, facing: EAST },
  rows: [
    'M^^^MMMMMMMM%%%%%%%%%%%%',
    'M^^MMMMMMMMM%%%%%%%%%%%%',
    '^^^MMMMMMMMM%%%%%%%%%%%%',
    '^^^MMMMMMMM%%%%%%%%%%%%%',
    '^^^MMMMMMMMM%%%%%%%%%%%%',
    '^^^^rrrMMMMM%%%%%%%%%%%%',
    '^^^^r.rMMMMM%%%%%%%%%%%%',
    '^^^^S.rMMMMM%%%%%%%%%%%%',
    '^^^^r.rMMMMM%%%%%%%%%%%%',
    '^^^^rrrMMMM%%%%%%%%%%%%%',
    '^^^^MMMMMMM%%%%%%%%%%%%%',
    '^^^MMMMMMM%%%%%%%%%%%%%%',
    '^^MMMMMMMM%%%%%%%%%%%%%%',
    '^MMMMMMMMM%%%%%%%%%%%%%%',
    '^MMMMMMMMM%%%%%%%%%%%%%%',
    '^MMMMMMMMM%%%%%%%%%%%%%%',
    '^MMMMMMMM%%%%%%%%%%%%%%%',
    '^MMMMMMMMM%%%%%%%%%%%%%%',
    '^MMMMMMMMM%%%%%%%%%%%%%%',
    '^MMMMMMMMM%%%%%%%%%%%%%%',
    'MMMMMMMMM%%%%%%%%%%%%%%%',
    'MMMMMMMM%%%%%%%%%%%%%%%%',
    'MMMMMMMM%%%%%%%%%%%%%%%%',
    'MMMMMMMM%%%%%%%%%%%%%%%%',
    'MMMMMMMM%%%%%%%%%%%%%%%%',
    'MMMMMMMM%%%%%%%%%%%%%%%%',
    'MMMMMMMM%%%%%%%%%%%%%%%%',
    'MMMMMMMM%%%%%%%%%%%%%%%%',
    'MMMMMMM%%%%%%%%%%%%%%%%%',
    'MMMMMMM%%%%%%%%%%%%%%%%%',
    'MMMMMMM%%%%%%%%%%%%%%%%%',
    'MMMMMM%%%%%%%%%%%%%%%%%%',
  ],
  features: [
    // In over the hills from O8, above the bog.
    { kind: 'event', x: 1, y: 10, id: 'p8_ledge', once: true, text: 'Under the rim the hills narrow to a ledge. Below it the bog lies grey out to the tors.' },
    { kind: 'cairn', x: 2, y: 3, id: 'p8_cairn', text: 'A cairn where the ledge is widest, its stones furred white with rime.', gold: 100, items: ['potion_sp_great'] },
    // The secret: the rowan growing out of the bare face, and the herds' store behind it.
    { kind: 'event', x: 3, y: 7, id: 'p8_rowan', once: true, text: 'A rowan grows out of the bare rock of the face, where no seed would take. Someone planted it.' },
    { kind: 'event', x: 5, y: 7, id: 'p8_store', once: true, text: 'Behind the face a chamber lined with slabs runs along the rock, dry and swept: the herds\' winter store.' },
    { kind: 'chest', x: 5, y: 8, id: 'p8_store_chest', gold: 200, items: ['elixir'] },
    // The ledge's end, where the hounds lie up.
    { kind: 'event', x: 0, y: 19, id: 'p8_bones', once: true, text: 'The ledge ends against the rim. Bones lie in the snow, cracked for the marrow.' },
  ],
  secrets: [{ x: 4, y: 7, hint: 'p8_rowan' }],
  encounters: [
    // Three moor hounds lying up on the ledge, the box's one group and its hardest, at 19.
    { id: 'p8_hounds', x: 0, y: 15, monsters: ['moor_hound', 'moor_hound', 'moor_hound'], aware: 3, respawn: 1440 },
  ],
};
