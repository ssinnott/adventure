// Old Cinder, level two: the undercroft. The hall's stair comes down into its cellars, vaulted on two
// columns: off them to the west the founding stone in its niche, to the east a dry cellar with its door
// still hung. Husks stand in the cellars. From them the lamp-keeper's walk goes down, a channel for the
// lamp's oil cut along its floor, to the lamp at the bottom, dark, and beside it the Ember Stone's
// second part set in the floor. Halfway down a stair lies fallen against the wall and the channel runs
// on under it; behind it, the lamp-keeper's own cellar. Band 24-25, from the area's floor, as Highcell's
// upper house is; docs/areas/ashfall.md §4.7 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

export const OLD_CINDER2: MapDef = {
  id: 'old_cinder2',
  name: 'Old Cinder',
  kind: 'dungeon',
  band: [24, 25],
  region: 'ashfall',
  start: { x: 8, y: 1, facing: SOUTH },
  // The hall's footings, rough stone vaulted over, dry and darker below.
  palette: { wall: '#7a7166', wallDark: '#4f4840', floor: '#3f3a34', ceiling: '#1a1714', door: '#3e3024', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#4a3a2c' },
  bare: true,
  rows: [
    '################',
    '########.#######',
    '#..#........#..#',
    '#..D.o....o.D..#',
    '#..#........#..#',
    '########.#######',
    '########.#######',
    '########.#######',
    '########.#######',
    '###....#.#######',
    '###....S.#######',
    '###....#.#######',
    '########.#######',
    '######.....#####',
    '######..o..#####',
    '################',
  ],
  exits: [
    { x: 8, y: 1, to: 'old_cinder', tx: 8, ty: 12, tf: NORTH, label: 'You climb the stair, out at the hall\'s door onto the square.' },
  ],
  features: [
    // The stair's foot, and the hall's cellars.
    { kind: 'event', x: 8, y: 2, id: 'oc2_cellars', once: true, text: 'The stair comes down into the hall\'s cellars, vaulted and dry. The casks along the walls have gone to dust.' },
    // The founding stone in its niche off the west cellar (#56's 50; its quest is #519's).
    { kind: 'event', x: 2, y: 3, id: 'oc2_niche', once: true, text: 'In a niche in the wall, a block of grey stone. A cup is cut in its face, and names under it, worn smooth.' },
    { kind: 'chest', x: 1, y: 3, id: 'oc2_stone', gold: 0, items: ['founding_stone'] },
    // The east cellar, its door still hung: the level's one rest.
    { kind: 'camp', x: 14, y: 3, name: 'A dry cellar', text: 'A cellar with its door still on its hinges. Shut it, and the town stays out.' },
    // The lamp-keeper's walk, the channel for the lamp's oil cut along its floor.
    { kind: 'event', x: 8, y: 6, id: 'oc2_walk', once: true, text: 'A walk goes down from the cellars, narrow, a channel cut along its floor. Black oil has dried in it.' },
    // The hint: the channel runs on under a stair fallen against the wall, where no room is.
    { kind: 'event', x: 8, y: 10, id: 'oc2_fallen', once: true, text: 'A stair lies fallen against the wall here, rubble to the roof. The oil channel runs on under it.' },
    // The lamp at the bottom, dark, said each time (the Paladin's third relights it, #448), and the
    // Ember Stone's second part set in the floor beside it (§5).
    { kind: 'event', x: 8, y: 13, id: 'oc2_lamp', text: 'At the bottom of the walk, the lamp: an iron bowl on a stem, taller than a man. It is cold.' },
    { kind: 'event', x: 9, y: 13, id: 'oc2_set', once: true, text: 'Set in the floor beside the lamp, a piece of grey iron, as if someone had meant to carry it on.' },
    { kind: 'chest', x: 9, y: 14, id: 'oc2_part', gold: 0, items: ['ember_part2'] },
    // The secret: the lamp-keeper's own cellar behind the fallen stair, his symbol and his plate.
    { kind: 'event', x: 6, y: 10, id: 'oc2_keeper', once: true, text: 'Behind the fallen stair, the lamp-keeper\'s cellar: a cot, a coat on its peg, jars of oil in a row.' },
    { kind: 'chest', x: 3, y: 10, id: 'oc2_keepers', gold: 800, items: ['hearth_symbol', 'plate+2'] },
  ],
  secrets: [{ x: 7, y: 10, hint: 'oc2_fallen' }],
  encounters: [
    // Husks in the cellars, before the walk.
    { id: 'oc2_husks', x: 9, y: 4, monsters: ['ash_husk', 'ash_husk', 'ash_husk', 'ash_husk'], aware: 2, respawn: 2880, roams: false },
  ],
};
