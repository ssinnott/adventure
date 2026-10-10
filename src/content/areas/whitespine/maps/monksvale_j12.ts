// The Whitespine, box J12: the vale's end under the peaks, behind the road. Country, band 22-23: the
// vale's hills and grass running out south of J11 against the peaks, the snow unbroken to their feet;
// a bell heard under the snow, over Highcell's lower house; the stone seat facing the peaks, the cairn
// at the vale's end and the drop on the east into cloud; the eagles over the crags and the bones under
// them; in the pines at the far end the snow trolls' bowl scraped to the earth, and the pilgrim frozen
// against a pine; and the bell-rope hanging out of the rock, and the cell behind it.
// In from J11 (#499) walked, over the hills: J11's south edge meets this map's north edge square for
// square, nothing said crossing between them, the same land at the same floor (#166). The west edge is
// the peaks against I12, the east edge ends the world against K12 (cut, the Monastery's plate moved to
// J11, #443 call 9) and the south edge is the range and the rim.
// Cut from the atlas by tools/scaffold.ts, the world's end cut by hand; docs/areas/whitespine.md §4.8
// is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const MONKSVALE_J12: MapDef = {
  id: 'monksvale_j12',
  name: 'Monks\' Vale',
  kind: 'outdoor',
  density: 'country',
  band: [22, 23],
  region: 'whitespine',
  start: { x: 25, y: 0, facing: SOUTH },
  rows: [
    'MMMAAAAAMMMMMMMMMMM^^^^^^^^^^^^^',
    'MAAAAAAMMMMMMMMMMMM^^^^^^^^^^^^^',
    'AAAAAAAMMMMMMMMMMMM^^^^^^^^^^^,,',
    'MAAAAAAMMMMMMMMMMMM^^^^^^^^^,,,,',
    'MAAAAAAMMMMMMMMMMMMM^^^^^^^^,,,,',
    'MAAAAAAMMMMMMMMMMMMM^^^^^^^^,,,,',
    'MMAAAAAMMMMMMMAMMMMM^^^^^^^^,,,,',
    'MMAAAAAAAMMMAAAMMMMM^^^^^^^^,,,,',
    'MAAAAAAAAAAAAAAMMMMM^^^^^^^,,,,,',
    'MAAAAAAAAAAAAAAMMMMM^^^^^^^,,,,,',
    'MAAAAAAAAAAAAAAMrrM^^^^^^^^,,,,,',
    'MAAAAAAAAAAAAAAr::S^^^^^^^^,,,^^',
    'MAAAAAAAAAAAAAAMrrM^^^^^^^^,^^^p',
    'MAAAAAAAAAAAAAMMMMM^^^^^^^^^^^^p',
    'MAAAAAAAAMMAAAMMMMM^^^^^^^^^^^pp',
    'MAAAAAAAMMMMMAMMMMMpp^^pppp^pppp',
    'MAAAAAAAMMMMMAMMMMMppppppppppppM',
    'MAAAAAAAMMMMMAAMMMMpppppppppppMM',
    'MAAAAAAAMMMMMMMMMMMppppppppMMMMM',
    'MAAAAAAMMMMMMMMMMMMppppppMMMMMMM',
    'AAAAAAAMMMMMMMMMMMpppppMMMMMMMMM',
    'AAAAAAAMMMMMMMMMMMpppMMMMMMMMMMM',
    'AAAAAAAMMMMMMMMMMMMMMMMMMMMMMMMM',
    'AAAAAAAMMMMMMMMMMMMMMMMMMMMMMMMM',
    'AAAAAAAMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MAAAAAAAMMMMMMMMMMMMMMMMMMMMMMMM',
    'MAAAAAAAMMMMMMMMMMMMMMMMMMMMMMMM',
    'MAAAAAAAMMMMMMMMMMMMMMMMMMMMMMMM',
    'MAAAAAAAAMMMMMMMMMMMM%MMMM%%%%%%',
    'MAAAAAAAAMMM%%%%%%%%%%%%%%%%%%%%',
    '%%%%%AAAA%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
  ],
  features: [
    // The vale running out under the peaks: the snow unbroken to their feet, the bell under it, the
    // stone seat facing them, the cairn at the vale's end and the drop on the east into cloud.
    { kind: 'event', x: 25, y: 3, id: 'j12_end', once: true, text: 'The vale runs out here under the peaks. The snow goes up to their feet unbroken, and no farther.' },
    { kind: 'event', x: 27, y: 5, id: 'j12_under', once: true, text: 'Underfoot, through the snow, faint, a bell is ringing somewhere below.' },
    { kind: 'shrine', x: 22, y: 7, id: 'j12_seat', text: 'A stone seat in the hills facing the peaks, worn smooth, and a bowl cut in its arm that holds clear water.', stat: 'intellect', done: 'The stone seat facing the peaks.' },
    { kind: 'cairn', x: 29, y: 7, id: 'j12_cairn', text: 'A cairn at the vale\'s end, and on the top stone a sandal frozen to it, its strap still tied.', gold: 300, items: ['potion_sp_great'] },
    { kind: 'event', x: 30, y: 4, id: 'j12_drop', once: true, text: 'East the grass runs out to the edge of a drop, and below it there is only cloud.' },
    // The eagles over the crags, and the bones under them.
    { kind: 'event', x: 21, y: 13, id: 'j12_eyrie', once: true, text: 'Over the peaks eagles turn on the wind, and bones lie scattered in the snow under the crags.' },
    // The pines at the far end: the trolls' bowl, and the pilgrim who sat down.
    { kind: 'event', x: 23, y: 17, id: 'j12_bowl', once: true, text: 'Under the pines the snow is scraped back to the earth in a bowl as wide as a hut, and bones lie in it.' },
    { kind: 'event', x: 28, y: 15, id: 'j12_pilgrim', once: true, text: 'A pilgrim sits against a pine, frozen where he sat down, his face to the peaks and his hands in his lap.' },
    // The secret: a bell-rope hanging out of a crack in the rock, the snow under it worn into a hollow by
    // knees; the search there, and the cell behind it with its alms box.
    { kind: 'event', x: 19, y: 11, id: 'j12_rope', once: true, text: 'A bell-rope hangs down the rock out of a crack, frayed, and the snow under it is worn into a hollow by knees.' },
    { kind: 'event', x: 17, y: 11, id: 'j12_cell', once: true, text: 'A cell cut in the rock, a shelf for a bed and a bell hung from the roof with no tongue in it.' },
    { kind: 'chest', x: 16, y: 11, id: 'j12_alms', gold: 1400, items: ['elixir'] },
  ],
  secrets: [{ x: 18, y: 11, hint: 'j12_rope' }],
  encounters: [
    // The box's one fight: the snow trolls in the pines at the vale's far end, two together, the hardest
    // and the only group.
    { id: 'j12_trolls', x: 21, y: 19, monsters: ['snow_troll', 'snow_troll'], aware: 3, respawn: 2880, roams: false },
  ],
};
