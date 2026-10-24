// Bearn Liath, Cairnmoor's lair (#845, #846): the cleft in the rim's face behind P7's 5,24, where the
// tops kept the drover's grandfather's grandfather. The cleft runs east into the rim and up, its snow
// trodden flat by something big, bones thrown down along it; at the gap where it comes out under the
// tops stands the Rim Troll, the lair's guardian at 32 (MONSTERS §13), the one way on. Past it, in the
// hollow under the tops, the old man sits against the rock with his kist, and Torhide in it; great
// tracks cross the hollow to its north wall, where the troll keeps what it took from the rest who came
// up. One level, band 30-32; docs/areas/cairnmoor.md §12.6 is its brief.
import type { MapDef } from '../../../../game/mapdef.ts';
import { anchored } from '../../../../game/map.ts';
import { EAST } from '../../../../game/types.ts';

export const BEARN_LIATH: MapDef<'bearn_liath'> = {
  id: 'bearn_liath',
  name: 'Bearn Liath',
  kind: 'dungeon',
  band: [30, 32],
  enclave: true,
  region: 'cairnmoor',
  start: { x: 1, y: 8, facing: EAST },
  // The rim's grey rock, the troll's grey, the floor trodden snow and the sky a pale line overhead.
  palette: { wall: '#6e7680', wallDark: '#474d55', floor: '#a9afb5', ceiling: '#8e98a2', door: '#6e7680', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#67717d' },
  bare: true,
  rows: [
    '################',
    '################',
    '############..##',
    '############..##',
    '#############S##',
    '######.........#',
    '######.#####...#',
    '######.#####...#',
    '#......#####...#',
    '################',
    '################',
    '################',
    '################',
    '################',
    '################',
    '################',
  ],
  exits: [
    anchored({ x: 1, y: 8, to: 'highmoor_p7', at: 'from_bearn_liath', label: 'Out of the cleft onto the hills under the rim, the moor wide and white below.' }),
  ],
  features: [
    // The cleft from its mouth, the drift in the bend and the bones along it.
    { kind: 'event', x: 2, y: 8, id: 'bl_mouth', once: true, text: 'The cleft runs east into the rim, its walls so close that the sky is a white line overhead.' },
    { kind: 'event', x: 6, y: 7, id: 'bl_drift', once: true, text: 'Snow lies deep in the bend, and something big has trodden a way up through it.' },
    { kind: 'event', x: 7, y: 5, id: 'bl_bones', once: true, text: 'Bones of sheep and deer lie along the cleft, cracked for the marrow and thrown down.' },
    // The gap under the tops, where the guardian stands.
    { kind: 'event', x: 9, y: 5, id: 'bl_gap', once: true, text: 'Ahead the cleft comes out under the tops, and a grey stone fills the gap. Frost smokes off it.' },
    // The hollow past it, the old man and his kist.
    { kind: 'event', x: 12, y: 6, id: 'bl_hollow', once: true, text: 'A hollow under the tops, walled with rock and open to the sky. The wind does not come down into it.' },
    { kind: 'event', x: 14, y: 7, id: 'bl_old', once: true, text: 'An old man sits against the rock, his plaid frozen to him and snow in his beard, a kist at his feet.' },
    { kind: 'chest', x: 14, y: 8, id: 'bl_kist', gold: 0, items: ['torhide'] },
    // The secret: the tracks to the north wall, and the troll's store behind it.
    { kind: 'event', x: 13, y: 5, id: 'bl_tracks', once: true, text: 'Great tracks cross the hollow to its north wall, and end at the rock.' },
    { kind: 'event', x: 13, y: 3, id: 'bl_store', once: true, text: 'Packs and purses heaped in a cleft of the rock, and the bones of the folk who carried them up.' },
    { kind: 'chest', x: 12, y: 2, id: 'bl_store_chest', gold: 500, items: ['elixir', 'potion_sp_great'] },
  ],
  secrets: [{ x: 13, y: 4, hint: 'bl_tracks' }],
  encounters: [
    // The guardian: the Rim Troll in the gap, the one way to the hollow, a boss at 32 that never comes back.
    { id: 'bl_troll', x: 11, y: 5, monsters: ['rim_troll'], roams: false, boss: true, slainText: 'The Rim Troll comes down in the gap like a rockfall, and this time it does not mend.' },
  ],
};
