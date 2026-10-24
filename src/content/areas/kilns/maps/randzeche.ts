// The Randzeche, the Kilns' artifact lair (#845, #847), level one: the old working in the crag under the
// rim, entered by its adit in P5's rim foot at 11,23. The adit runs east past the miners' door and a lamp
// room to the seam's level, cut north and south: north to the stopes, worked out and given up, and on
// the drift's west wall the stope they walled up with the last of the dark ore in it; south past a cut
// that found the dark rock to the winze, its ladder down to the Dark Seam (`randzeche2`), where the
// Steiger keeps the Erzhemd. Band 30-32, the cap's, out of the Kilns' figures; docs/areas/kilns.md §12.8
// is its brief.
import type { MapDef } from '../../../../game/mapdef.ts';
import { anchored } from '../../../../game/map.ts';
import { EAST, NORTH } from '../../../../game/types.ts';

export const RANDZECHE: MapDef<'randzeche'> = {
  id: 'randzeche',
  name: 'The Randzeche',
  kind: 'dungeon',
  band: [30, 32],
  enclave: true,
  region: 'kilns',
  start: { x: 1, y: 7, facing: EAST },
  anchors: { from_randzeche2: { x: 10, y: 12, facing: NORTH } },
  palette: { wall: '#4a4a48', wallDark: '#2c2c2a', floor: '#363634', ceiling: '#121211', door: '#4a3c2c', wallStyle: 'stone', ceilingStyle: 'beams', banner: '#4a4f5a' },
  rows: [
    '################',
    '################',
    '######.....#####',
    '##########.#####',
    '######...S.#####',
    '######...#.#####',
    '##########.#####',
    '#..........#####',
    '####.#####.#####',
    '###...####.#####',
    '###...####....##',
    '##########.#####',
    '##########.#####',
    '##########.#####',
    '################',
    '################',
  ],
  exits: [
    anchored({ x: 1, y: 7, to: 'kilnsheart_p5', at: 'from_randzeche', label: 'Out of the adit into the light under the rim, the cold air at your back.' }),
    anchored({ x: 10, y: 13, to: 'randzeche2', at: 'start', label: 'You climb down the ladder in the winze, rung after rung, into the dark.' }),
  ],
  features: [
    // The adit, the miners' door across it and the lamp room off it.
    { kind: 'event', x: 2, y: 7, id: 'rz_adit', once: true, text: 'The adit runs straight into the rim, propped with timbers older than any in the Fells. Cold air comes out of it.' },
    { kind: 'event', x: 5, y: 7, id: 'rz_door', once: true, text: 'A door of oak stands open across the adit, iron-bound. Chalked on it, the hymn\'s count of doors and a name, Brandt.' },
    { kind: 'event', x: 4, y: 9, id: 'rz_lamps', once: true, text: 'A lamp room off the adit, its hooks empty but one. That lamp is newer than the rest, and its oil long dry.' },
    // The seam's level, north to the stopes and south to the winze.
    { kind: 'event', x: 10, y: 7, id: 'rz_level', once: true, text: 'The adit meets the seam\'s level, cut north and south along it. Somewhere in the rock, something knocks.' },
    { kind: 'event', x: 8, y: 2, id: 'rz_stopes', once: true, text: 'Old stopes, worked to the walls and given up, their spoil left where it fell. The rock here is plain grey.' },
    { kind: 'event', x: 13, y: 10, id: 'rz_cut', once: true, text: 'A cut east off the level, ended where the grey rock went dark. The marks on its face are not a pick\'s.' },
    { kind: 'event', x: 10, y: 12, id: 'rz_winze', once: true, text: 'A winze sunk from the level, a ladder down it into the dark. The knocking comes up it, slow and patient.' },
    // The secret: the knocking behind the drift's west wall, and the stope walled up behind it.
    { kind: 'event', x: 10, y: 4, id: 'rz_knock', once: true, text: 'Something knocks behind the drift\'s west wall, three and three. When you knock back, it stops.' },
    { kind: 'event', x: 8, y: 4, id: 'rz_stope', once: true, text: 'A stope walled up when the working was given up: the last of the dark ore heaped in it, and the miners\' pay-chest.' },
    { kind: 'chest', x: 6, y: 5, id: 'rz_paychest', gold: 500, items: ['elixir', 'potion_sp_great'] },
  ],
  secrets: [{ x: 9, y: 4, hint: 'rz_knock' }],
};
