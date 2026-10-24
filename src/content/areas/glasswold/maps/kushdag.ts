// Kushdag, the Glasswold's artifact lair (#845, #847): the eyrie of the bird that takes the Riders' foals,
// in the Scarp's east face over the gulf, entered from D7's 19,24 along a shelf cut in the rock. The shelf
// runs east and turns down the face to a choke a body wide, where the Foal-taker stands, the one guardian;
// past it the nest, heaped to a man's height, with a Rider's bones at its edge and the chest that was his,
// and Akkush in it; and behind the nest, found from the buckle wedged in the rock, the cleft where the
// bird keeps what shines. Band 30-32, the cap's, out of the Glasswold's figures; docs/areas/glasswold.md
// §12.5 is its brief (#833).
import type { MapDef } from '../../../../game/map.ts';
import { anchored } from '../../../../game/map.ts';
import { EAST } from '../../../../game/types.ts';

export const KUSHDAG: MapDef = {
  id: 'kushdag',
  name: 'Kushdag',
  kind: 'dungeon',
  band: [30, 32],
  enclave: true,
  region: 'glasswold',
  start: { x: 1, y: 3, facing: EAST },
  palette: { wall: '#9a8f7c', wallDark: '#6a6050', floor: '#5c5448', ceiling: '#6f8296', door: '#4a3e30', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#8a7a54' },
  rows: [
    '################',
    '################',
    '################',
    '#.........######',
    '#########.######',
    '#########.######',
    '#########.######',
    '###.........####',
    '##...........###',
    '##...........###',
    '##...........###',
    '###.........####',
    '#######S########',
    '######...#######',
    '################',
    '################',
  ],
  exits: [
    anchored({ x: 1, y: 3, to: 'wold_d7', at: 'from_kushdag', label: 'Back along the shelf and out of the Scarp\'s face, onto the lip and the grass.' }),
  ],
  features: [
    // The shelf from the door, east along the face and down it: the wind, the foals' bones and a feather.
    { kind: 'event', x: 3, y: 3, id: 'kd_shelf', once: true, text: 'The way is a shelf cut in the Scarp\'s face, a body wide. The wind comes up it from the gulf.' },
    { kind: 'event', x: 6, y: 3, id: 'kd_foals', once: true, text: 'Foals\' bones lie along the shelf, split for the marrow. Some are white with age and some are not.' },
    { kind: 'event', x: 9, y: 4, id: 'kd_feather', once: true, text: 'A feather as long as your arm lies across the way, cream barred with brown. It has not lain long.' },
    // The nest, past the choke: the droppings and the clawed tracks, the nest itself, the Rider at its
    // edge and his chest, with Akkush in it.
    { kind: 'event', x: 10, y: 9, id: 'kd_tracks', once: true, text: 'The floor is white with droppings, trodden with three-toed prints each longer than a boot.' },
    { kind: 'event', x: 4, y: 9, id: 'kd_nest', once: true, text: 'The nest: sticks thick as a wrist, horse-hair, bridle-leather, a saddle-tree. Bright things are worked into it.' },
    { kind: 'event', x: 3, y: 8, id: 'kd_rider', once: true, text: 'A Rider lies at the nest\'s edge, picked clean, his long felt case beside him. It has been shut a long time.' },
    { kind: 'chest', x: 3, y: 9, id: 'kd_chest', gold: 0, items: ['akkush'] },
    // The secret: the buckle wedged in the rock behind the nest; the cleft behind it, where the bird keeps
    // what shines.
    { kind: 'event', x: 7, y: 11, id: 'kd_buckle', text: 'A Rider\'s belt buckle is wedged in a crack in the rock, scored by a beak. The crack goes in further than the buckle.' },
    { kind: 'event', x: 7, y: 13, id: 'kd_cache', once: true, text: 'A cleft behind the nest, and in it what shines: buckles, bits, bridle-plates and a drift of coins, picked bright.' },
    { kind: 'chest', x: 8, y: 13, id: 'kd_cache_chest', gold: 800, items: ['elixir', 'potion_sp_great'] },
  ],
  secrets: [{ x: 7, y: 12, hint: 'kd_buckle' }],
  encounters: [
    // The guardian: the Foal-taker on the shelf where it comes down the face, a body wide, the one way to the
    // nest; a boss at 32 that never comes back.
    { id: 'kd_foal_taker', x: 9, y: 6, monsters: ['foal_taker'], roams: false, boss: true, slainText: 'The Foal-taker comes down on the shelf like a tent falling. The wind goes through its feathers, and nothing cries.' },
  ],
};
