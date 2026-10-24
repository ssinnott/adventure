// The Spittal, Rimewater's artifact lair (#845, #847), level one: the brothers' house for whoever came
// off the pass, cut in the mountain under it and entered by its door in K12's rim face at 2,15, on Monks'
// Vale's land. Inside the door the slate of names, the warming room with its hearth laid and never lit and
// the boots nobody came back for; along the passage the kirk with its bell taken down, and the cells with a
// robe on every peg but one; at the passage's end the stair down to the Infirmary (`spittal2`), where the
// Infirmarer keeps the Wakerobe. It holds no group and no find. Band 30-32, the cap's, out of Rimewater's
// figures; docs/areas/rimewater.md §12.5 is its brief (#832).
import type { MapDef } from '../../../../game/mapdef.ts';
import { anchored } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

export const SPITTAL: MapDef<'spittal'> = {
  id: 'spittal',
  name: 'The Spittal',
  kind: 'dungeon',
  band: [30, 32],
  enclave: true,
  region: 'rimewater',
  start: { x: 7, y: 1, facing: SOUTH },
  anchors: { from_spittal2: { x: 7, y: 11, facing: NORTH } },
  palette: { wall: '#8e9297', wallDark: '#5a5e63', floor: '#45484c', ceiling: '#141619', door: '#5b4a3a', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#9aa9b2' },
  rows: [
    '################',
    '#######.########',
    '#######.########',
    '####.......#####',
    '####.......#####',
    '####.......#####',
    '#######.########',
    '##....#.#.#.#.##',
    '##............##',
    '##....#.#.#.#.##',
    '#######.########',
    '#######.########',
    '#######.########',
    '################',
    '################',
    '################',
  ],
  exits: [
    anchored({ x: 7, y: 1, to: 'coldmere_k12', at: 'from_spittal', label: 'Out of the door in the rock, into the pines and the snow light under the pass.' }),
    anchored({ x: 7, y: 12, to: 'spittal2', at: 'start', label: 'You go down the stair cut in the rock, round and down, into air warmer than it should be.' }),
  ],
  features: [
    // Inside the door: the slate of names, the warming room's hearth and the boots along its wall.
    { kind: 'event', x: 7, y: 2, id: 'sp_slate', once: true, text: 'A slate hangs inside the door, names chalked down it in a neat hand, and after every name one word: Resting.' },
    { kind: 'event', x: 5, y: 4, id: 'sp_hearth', once: true, text: 'A hearth for whoever came in off the pass, swept and laid ready. Nobody has lit it in a long time.' },
    { kind: 'event', x: 9, y: 5, id: 'sp_boots', once: true, text: 'Boots stand in pairs along the wall, dozens of them, dried stiff. Nobody came back up for them.' },
    // Along the passage: the brothers' kirk west, their cells east, and the stair down at its end.
    { kind: 'event', x: 3, y: 8, id: 'sp_kirk', once: true, text: 'A kirk cut in the rock. Its bell is down on the altar, the tongue tied fast with linen.' },
    { kind: 'event', x: 11, y: 8, id: 'sp_cells', once: true, text: 'Cells off the passage, a cot in each and a grey robe on every peg, hung high. One peg is bare.' },
    { kind: 'event', x: 7, y: 10, id: 'sp_stair', once: true, text: 'A stair goes down into the rock. The air coming up it is warm, and smells of clean linen.' },
  ],
};
