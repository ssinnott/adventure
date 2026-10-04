// The Tiefzeche, level two: the old workings. The stair comes down into galleries nobody has worked in
// years, the timbers grey and split and a fall of roof at the end of the first; an old stall off the
// gallery, warm, and the beetles in it; the cargo's footprints down the gallery to the old haulage way,
// whose rails are bright on top, and on them at the far end the Hand's cages, the straw in them fresh.
// Off the way, a second walled niche with the prayer for the dead over it, and the shaft and its rungs
// behind it; past the cages the rock worms' round bores, winding north to their nest and south to the
// steep stair down. Band 16-17; docs/areas/kilns.md §4.7 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST, NORTH, SOUTH, WEST } from '../../../../game/types.ts';

export const DEEP_MINES2: MapDef = {
  id: 'deep_mines2',
  name: 'The Old Workings',
  kind: 'dungeon',
  band: [16, 17],
  region: 'kilns',
  start: { x: 1, y: 2, facing: SOUTH },
  palette: { wall: '#5e564c', wallDark: '#3c362e', floor: '#3e3832', ceiling: '#141110', door: '#4a3c2c', wallStyle: 'stone', ceilingStyle: 'beams', banner: '#5a2a24' },
  rows: [
    '################',
    '#....r######...#',
    '#.##########...#',
    '#.#...######.###',
    '#.....######..##',
    '#.#...#######.##',
    '#.#...######..##',
    '#.##########.###',
    '#.#######....###',
    '#............###',
    '#####S###....###',
    '####...#####..##',
    '#############..#',
    '##############.#',
    '##############.#',
    '################',
  ],
  exits: [
    { x: 1, y: 1, to: 'deep_mines', tx: 2, ty: 1, tf: EAST, label: 'You climb the stair to the workings.' },
    { x: 14, y: 14, to: 'deep_mines3', tx: 13, ty: 14, tf: NORTH, label: 'You go down the steep stair to the bottom.' },
    // The shaft behind the niche: its rungs up to the workings and on down to the bottom.
    { x: 4, y: 11, to: 'deep_mines', tx: 14, ty: 10, tf: WEST, label: 'You climb the iron rungs up to the workings.' },
    { x: 6, y: 11, to: 'deep_mines3', tx: 14, ty: 10, tf: SOUTH, label: 'You climb down the rungs. The hum grows, and the shaft ends in a clean square hole.' },
  ],
  features: [
    { kind: 'event', x: 1, y: 3, id: 'dm2_in', once: true, text: 'The old workings. The timbers are grey and split, and the air is still and warm. Nobody has worked here in years.' },
    { kind: 'event', x: 4, y: 1, id: 'dm2_fall', once: true, text: 'The gallery ends in a fall of roof, the props snapped under it like kindling.' },
    { kind: 'event', x: 3, y: 4, id: 'dm2_stall', once: true, text: 'An old stall off the gallery, its props charred and the rock warm. Beetle shells crunch underfoot.' },
    { kind: 'event', x: 1, y: 6, id: 'dm2_prints', once: true, text: 'Footprints in the dust, many, all going one way: down the gallery from the stair, toward the rails.' },
    { kind: 'event', x: 2, y: 9, id: 'dm2_rails', once: true, text: 'Rails along the old haulage way, rusty in the gaps and bright on top. Something runs on them still.' },
    // The second service ladder (#434's 2): the dust blown back from the niche, the prayer that reads
    // LADDER, and the shaft behind it.
    { kind: 'event', x: 6, y: 9, id: 'dm2_draught', once: true, text: 'The dust lies thick along the way, but under the niche it is blown back in a fan.' },
    { kind: 'sign', x: 5, y: 9, id: 'dm2_niche', text: 'Over a walled niche, the words the dwarves cut for their dead.', read: 'LADDER.' },
    { kind: 'event', x: 5, y: 11, id: 'dm2_well', once: true, text: 'The iron rungs go up into the dark, and on down. Warm air comes up the shaft, humming.' },
    // The Hand's cages on the rails, and what the cargo left in them; by night the overseers walk the
    // cargo on down, seen and not fought (docs/areas/kilns.md §9).
    { kind: 'event', x: 10, y: 9, id: 'dm2_cages', once: true, text: 'Cages on wheels stand on the rails, their bars worn bright where hands held them. The straw in them is fresh.' },
    { kind: 'chest', x: 11, y: 10, id: 'dm2_cage_chest', gold: 900, items: ['ironwood_bow+2', 'wardens_dirk+2'] },
    { kind: 'event', x: 12, y: 9, id: 'dm2_lamps', once: true, when: { hours: 'night' }, text: 'Far down the bore, lamps hooded and going away, and the sound of chain.' },
    // The worms' bores, and the stair down.
    { kind: 'event', x: 12, y: 6, id: 'dm2_bore', once: true, text: 'A bore through the rock, round as a barrel, its walls polished. It winds, and goes on winding.' },
    { kind: 'event', x: 14, y: 13, id: 'dm2_stair', once: true, text: 'The bore comes out at the head of a stair the dwarves cut, steep, going down. Warm air comes up it, humming.' },
  ],
  secrets: [{ x: 5, y: 10, hint: 'dm2_draught' }],
  encounters: [
    // Fire beetles in the old stall; at the end of the worms' bore, their pair, the level's group at 17.
    { id: 'dm2_beetles', x: 4, y: 6, monsters: ['fire_beetle', 'fire_beetle'], aware: 3, respawn: 1440, roams: false },
    { id: 'dm2_worms', x: 13, y: 1, monsters: ['rock_worm', 'rock_worm'], aware: 2, respawn: 2880, roams: false },
  ],
};
