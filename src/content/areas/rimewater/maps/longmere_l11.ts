// Rimewater, box L11: the pines under the ridge's end. Country, band 20-21: the cold loch's south end
// in the north-west corner, its margin iced and the stumps of pines felled when the water was lower
// standing in it; the lynxes' pinewoods west of the ridge, the tar-burner at his kiln and the long
// mound with the earth-house under it; the bog between the pines and the ridge; east of the ridge a
// strip of pines and bog under the glacier; and the mountain along the south edge, where the world ends.
// In from L10 over the north edge, walked, either side of the ridge. The west edge meets K11, the east
// edge M11 and the south edge L12, which is mountain.
// Cut from the atlas by tools/scaffold.ts; docs/areas/rimewater.md §4.8 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const LONGMERE_L11: MapDef = {
  id: 'longmere_l11',
  name: 'Loch Fada',
  kind: 'outdoor',
  density: 'country',
  band: [20, 21],
  region: 'rimewater',
  start: { x: 10, y: 0, facing: SOUTH },
  rows: [
    'WWWWWWiippppppppppMMMppppppppppp',
    'WWWWWWiippppppppppMMMMpppppppppp',
    'WWWWWWiippppppppppMMMMMppppppppp',
    'WWWWWiipppppppppppMMMMMppppppppp',
    'WWWWiipppppppppppppMMMMMpppppppp',
    'WWWiippppppppppppppMMMMMwwwwpppp',
    'WiiipppppppppppppppMMMMMMwwwwwpp',
    '~iipppppppppppppppwMMMMMMwwwwwwp',
    '~ppppppppppppppppwwwMMMMMwwwwwwp',
    'pppppppppppppppppwwwMMMMMMwwwwww',
    'ppppppppppppppppwwwwMMMMMMMwwwww',
    'ppppppppppppppppwwwwwMMMMMMwwwww',
    'pppppppppppppppwwwwwwMMMMMMMwwww',
    'ppppppppppppppwwwwwwwwMMMMMMwwww',
    'ppppppppppppppwwwwwwwwMMMMMMwwww',
    'ppppppppppppppwwwwwwwwMMMMMMMwww',
    'ppppppppppppppwwwwwwwwwMMMMMMwww',
    'ppppppppppppppwwwwwwwwwMMMMMMwww',
    'ppppppppppppppwwwwwwwwwMMMMMMwww',
    'ppprrrppppppppwwwwwwwwwwMMMMMwww',
    'pppr:SpppppppwwwwwwwwwwwMMMMMwwp',
    'ppprrrpppppppwwwwwwwwwwwwMMMMMwp',
    'ppppppppppppppwwwwwwwwwwwMMMMMpp',
    'ppppppppppppppwwwwwwwwwwwwMMMMpp',
    'pppppppppppppppwwwwwwwwwwwMMMMpp',
    'pppppppppppppppwwwwwwwwwwwwMMMMp',
    'pppppppppppppppwwwwwwwwwwwwMMMMM',
    'ppppppppppppppppwwwwwwwwwwpMMMMM',
    'ppppppppppppppppppwwwwwwwpppMMMM',
    'pppppppppppppppppppppppwppppMMMM',
    'ppppppppppppppppppppppppppMMMMMM',
    'pppppppppppppppppMMMMMMMMMMMMMMM',
  ],
  features: [
    // The cold loch's south end, its margin iced, and the stumps standing in it.
    { kind: 'event', x: 8, y: 4, id: 'l11_shore', once: true, text: 'The cold loch\'s south end, the ice grey, and in it the stumps of pines felled when the water was lower.' },
    // The lynxes' pinewoods west of the ridge: a lie-up in the snow, the stone cat, a cairn.
    { kind: 'event', x: 10, y: 16, id: 'l11_lie', once: true, text: 'A hollow scraped in the snow under a low pine, grey hairs in it, and the snow at its rim still soft.' },
    { kind: 'shrine', x: 13, y: 5, id: 'l11_cat', text: 'A cat cut in a boulder under the pines, its ears tufted, and fresh fur caught on the stone where something rubs.', stat: 'speed', done: 'The stone cat, fur on it still.' },
    { kind: 'cairn', x: 2, y: 13, id: 'l11_cairn', text: 'A cairn where the pines open, a ring of antlers round its foot and a cat cut on its top stone.', gold: 100, items: ['potion_heal'] },
    // The tar-burner at his kiln, who saw the loch lower, and the kiln's clearing.
    { kind: 'npc', x: 13, y: 24, name: 'A tar-burner', lines: [
      'A tar-burner at a turf kiln in the pines, black to the elbows, the smoke going straight up.',
      '"Tar from the stumps. The drovers took it south for the boats."',
      '"My father felled the stumps you see in the ice. The loch was a field lower then."',
    ] },
    { kind: 'camp', x: 12, y: 26, name: 'The tar kiln', text: 'A clearing round the kiln, pine stumps split and stacked, and the snow black with soot to the trees.' },
    // The bog between the pines and the ridge, and the strip of bog and pines under the glacier east of
    // the ridge.
    { kind: 'event', x: 18, y: 14, id: 'l11_bog', once: true, text: 'A bog under the snow, the crust thin, and through it black water that does not freeze.' },
    { kind: 'event', x: 27, y: 2, id: 'l11_east', once: true, text: 'East of the ridge the bog runs south under the glacier\'s foot, white, and nothing has crossed it.' },
    { kind: 'event', x: 28, y: 14, id: 'l11_reeds', once: true, text: 'Reeds stand up through the snow of the bog, and the wind off the glacier rattles them.' },
    // The mountain along the south edge.
    { kind: 'event', x: 8, y: 30, id: 'l11_south', once: true, text: 'The pines end under a wall of mountain, and the snow off it lies in drifts to the trunks.' },
    // The secret: the long mound under the pines with a stone at its end like a lintel; the search
    // there, and the earth-house under it.
    { kind: 'event', x: 7, y: 20, id: 'l11_mound', once: true, text: 'A long mound under the pines, too straight to be the ground\'s, and at its end a stone showing like a lintel.' },
    { kind: 'event', x: 4, y: 20, id: 'l11_house', once: true, text: 'Under the mound a passage of laid stone, dry, and at its end a kist of oak sealed with fat.' },
    { kind: 'chest', x: 4, y: 20, id: 'l11_kist', gold: 200, items: ['potion_sp_great'] },
  ],
  secrets: [{ x: 5, y: 20, hint: 'l11_mound' }],
  encounters: [
    // Snow lynxes in the pines below the loch, nearest the way in; and in the far pines under the
    // mountain the box's hardest, two ice bears.
    { id: 'l11_lynx', x: 12, y: 9, monsters: ['snow_lynx', 'snow_lynx', 'snow_lynx'], aware: 4, respawn: 1440 },
    { id: 'l11_bears', x: 6, y: 28, monsters: ['ice_bear', 'ice_bear'], aware: 3, respawn: 2880 },
  ],
};
