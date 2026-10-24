// The Randzeche, level two: the Dark Seam. The winze's ladder comes down into a gallery cut along a seam
// of ore darker than iron, the knockers' heaps of it at a stub's end and the miners' picks where they
// dropped them; a drift runs south between walls of the ore to the face, and in the drift stands the
// Steiger, the knockers' overseer, the lair's guardian at 32 (MONSTERS §13). Past it, at the face, the
// smith who went down for more sits against the rock with his kist, and the Erzhemd in it (#846). Band
// 30-32; docs/areas/kilns.md §12.8 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { anchored } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const RANDZECHE2: MapDef = {
  id: 'randzeche2',
  name: 'The Dark Seam',
  kind: 'dungeon',
  band: [30, 32],
  enclave: true,
  region: 'kilns',
  start: { x: 10, y: 2, facing: SOUTH },
  palette: { wall: '#2e3036', wallDark: '#1a1b1f', floor: '#26272b', ceiling: '#0c0c0e', door: '#4a3c2c', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#4a4f5a' },
  rows: [
    '################',
    '################',
    '#####.####.#####',
    '#####.####.#####',
    '###........#####',
    '###.############',
    '###.############',
    '###.############',
    '###.....########',
    '#######.########',
    '#######.########',
    '######.....#####',
    '######.....#####',
    '######.....#####',
    '################',
    '################',
  ],
  exits: [
    anchored({ x: 10, y: 2, to: 'randzeche', at: 'from_randzeche2', label: 'You climb the ladder up the winze to the old level, out of the dark ore.' }),
  ],
  features: [
    // The winze's foot, the knockers' heaps and the seam along the gallery.
    { kind: 'event', x: 10, y: 3, id: 'rz2_foot', once: true, text: 'The ladder ends in black rock, and the knocking is all round you now, in every wall at once.' },
    { kind: 'event', x: 5, y: 2, id: 'rz2_heaps', once: true, text: 'Heaps of the dark ore at the stub\'s end, sorted by size, though no cart has come for them in years.' },
    { kind: 'event', x: 8, y: 4, id: 'rz2_seam', once: true, text: 'The seam runs along the gallery wall, ore darker than iron, cut out a hand deep and the cutting stopped.' },
    { kind: 'event', x: 3, y: 6, id: 'rz2_picks', once: true, text: 'Picks lie along the gallery floor where they were dropped, their hafts rotted away and the heads still bright.' },
    { kind: 'event', x: 5, y: 8, id: 'rz2_drift', once: true, text: 'The drift narrows going south, its walls all dark ore. Every knock in the seam seems to come from there.' },
    // The face past the drift, the smith against it and his kist.
    { kind: 'event', x: 7, y: 12, id: 'rz2_face', once: true, text: 'The face, where the dark ore runs thickest. A pick is driven into it to the head and left there.' },
    { kind: 'event', x: 9, y: 12, id: 'rz2_bones', once: true, text: 'Against the face a dwarf sits as if resting, bones in a smith\'s apron, a kist at his side.' },
    { kind: 'chest', x: 10, y: 13, id: 'rz2_kist', gold: 0, items: ['erzhemd'] },
  ],
  encounters: [
    // The guardian: the Steiger in the drift, the one way to the face, a boss at 32 that never comes back.
    { id: 'rz2_steiger', x: 7, y: 10, monsters: ['steiger'], aware: 2, roams: false, boss: true, slainText: 'The Steiger knocks once more, and nothing in the seam answers it. The rock is still.' },
  ],
};
