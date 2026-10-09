// Meridian Camp, level two: the iron corridors. Down the vents' stair (STAIR) onto four corridors of iron,
// hot enough to blister and dead straight, doubling back on each other down the level: on the first a glove
// stuck to the wall and the Company's chalk arrows; on the second the flue walker on its round with a stoker
// and a cinder drake; off the west end the Company's second camp, cold, where they left their kit; off the
// third a grave with a note; off the fourth the drake's nest, two drakelings and the Brood Drake on its
// eggs and its hoard, a side gallery the walk to the end never enters; and at the corridors' end the Ember
// Stone's third part, a heap of the walker's parts and the stair down to the camp (STAIR2). Once the Stone is
// lit a sentry comes up that stair. Band 26, the area's top, its nest and
// its elite at 27; docs/areas/meridian_camp.md §4.2 is its brief.
import type { Exit, MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

/**
 * The way down to the camp (meridian_camp3, #22's third level): the stair at the corridors' end, 4,30,
 * onto the camp's first square at 4,1, facing south; its way back up lands on 4,29, facing north, the
 * stair's head.
 */
export const STAIR2: Exit = { x: 4, y: 30, to: 'meridian_camp3', tx: 4, ty: 1, tf: SOUTH,
  label: 'Down the steps out of the heat, into a cold that takes the breath.' };

export const MERIDIAN_CAMP2: MapDef = {
  id: 'meridian_camp2',
  name: 'The Iron Corridors',
  kind: 'dungeon',
  band: [26, 26],
  region: 'ashfall',
  start: { x: 4, y: 1, facing: SOUTH },
  // Iron gone rust-dark with heat, smooth and seamless, and nothing hung on it.
  palette: { wall: '#5a3a2e', wallDark: '#36221a', floor: '#3e2c26', ceiling: '#140c0a', door: '#663c24', wallStyle: 'smooth', ceilingStyle: 'vault', banner: '#8a3418' },
  bare: true,
  rows: [
    '################################',
    '####.###########################',
    '###...##########################',
    '###..........................###',
    '############################.###',
    '############################.###',
    '############################.###',
    '############################.###',
    '############################.###',
    '############################.###',
    '############################.###',
    '###..........................###',
    '###.############################',
    '###.############################',
    '###.#....#######################',
    '###.D....############...########',
    '###.#....############...########',
    '###.#################...########',
    '###.##################.#########',
    '###..........................###',
    '############################.###',
    '##########.........#########.###',
    '##########.........#########.###',
    '##########.........#########.###',
    '##############.#############.###',
    '##############.#############.###',
    '##############.#############.###',
    '##...........................###',
    '##.....#########################',
    '##.....#########################',
    '####.###########################',
    '################################',
  ],
  exits: [
    // The stair's foot, up onto the vents' floor at the stair's head (STAIR), facing away from it.
    { x: 4, y: 1, to: 'meridian_camp', tx: 4, ty: 29, tf: NORTH, label: 'Up the steps, out of the worst of the heat, onto the vents\' floor.' },
    // The stair at the corridors' end, down to the camp (STAIR2).
    STAIR2,
  ],
  features: [
    // The first corridor: hot enough to blister and straighter than anything made by hand; the Company's
    // chalk arrow at its far end.
    { kind: 'event', x: 4, y: 2, id: 'mc2_in', once: true, text: 'The steps come down into a corridor of iron running east, dead straight, further than the light goes.' },
    { kind: 'event', x: 11, y: 3, id: 'mc2_glove', once: true, text: 'A glove stuck to the wall by its palm, the leather cooked stiff. Nobody came back for it.' },
    { kind: 'event', x: 19, y: 3, id: 'mc2_true', once: true, text: 'Sight along the wall: it runs true to a point in the dark, with no seam in it, no join and no rivet.' },
    { kind: 'event', x: 27, y: 3, id: 'mc2_arrow', once: true, text: 'A chalk arrow at the corner, pointing on down. The chalk has baked yellow on the iron.' },
    // The second: the flue walker's round, end to end and back.
    { kind: 'event', x: 8, y: 11, id: 'mc2_walk', once: true, text: 'Far off down the corridor, iron walks on iron, steady as a clock, going away. Then coming back.' },
    { kind: 'event', x: 22, y: 11, id: 'mc2_tracks', once: true, text: 'Tracks in the soot two by two, end to end of the corridor, and never once off its middle.' },
    // Off the west end, the Company's second camp, cold, the level's one rest, and their kit left in it.
    { kind: 'event', x: 3, y: 13, id: 'mc2_arrow2', once: true, text: 'Another arrow, smeared, as if the hand that drew it would not stay on the iron.' },
    { kind: 'camp', x: 7, y: 15, name: 'A cold camp', text: 'Bedrolls charred where they lay on the iron, and a ring of stones with no ash in it. Nobody lit a fire here.' },
    { kind: 'chest', x: 8, y: 14, id: 'mc2_kit', gold: 0, items: ['meridian_mail'] },
    // The third: a drake's cast skin, the grave in its side gallery, and a grate on the corridor under it.
    { kind: 'event', x: 12, y: 19, id: 'mc2_skin', once: true, text: 'A drake\'s cast skin along the wall, crisp as paper and longer than a cart.' },
    { kind: 'event', x: 22, y: 16, id: 'mc2_grave', once: true, text: 'A heap of slag the length of a man, a chain pin at its head. Tied to the pin, a note: FANE SAYS ONE MORE DAY.' },
    { kind: 'event', x: 25, y: 19, id: 'mc2_grate', once: true, text: 'A grate in the floor. Under it, another corridor as straight as this one, running the other way.' },
    // The fourth: the heat at its worst, and the nest's gallery off it (#448), its hoard behind the drake.
    { kind: 'event', x: 25, y: 27, id: 'mc2_heat', once: true, text: 'Here the air shakes with heat, and the iron ticks under your boots like a stove.' },
    { kind: 'event', x: 14, y: 26, id: 'mc2_crust', once: true, text: 'Bits of crust like broken pots at the mouth of a gallery, still warm. From inside, a hiss.' },
    { kind: 'chest', x: 18, y: 21, id: 'mc2_hoard', gold: 1500, items: [] },
    // The corridors' end: the Ember Stone's third part (#516), the walker's parts, which no shop buys, and
    // the stair down to the camp (STAIR2): its line at its head, the once.
    { kind: 'event', x: 6, y: 27, id: 'mc2_end', once: true, text: 'The corridor ends in a wall of iron, flat and blind, as if whoever made it stopped here.' },
    { kind: 'chest', x: 2, y: 27, id: 'mc2_part', gold: 0, items: ['ember_part3'] },
    { kind: 'chest', x: 2, y: 29, id: 'mc2_heap', gold: 0, items: ['walker_damper', 'walker_iron'] },
    { kind: 'event', x: 4, y: 29, id: 'mc2_stair', once: true, text: 'Steps going down, and up them a draught, cold, the first in days. There is smoke on it.' },
  ],
  encounters: [
    // The flue walker on its round with a stoker and a cinder drake in its heat; in the nest two drakelings,
    // and behind them the Brood Drake on its eggs, the level's top at 27, still, the Barbarian's quarry
    // (#448); and, once the Ember Stone is lit, a sentry come up the stair from below.
    { id: 'mc2_walker', x: 16, y: 11, monsters: ['flue_walker', 'stoker', 'cinder_drake'], aware: 3, respawn: 1440 },
    { id: 'mc2_drakelings', x: 14, y: 23, monsters: ['drakeling', 'drakeling'], aware: 2, respawn: 2880, roams: false },
    { id: 'mc2_brood', x: 14, y: 21, monsters: ['brood_drake'], aware: 2, roams: false, slainText: 'The Brood Drake dies over its eggs, its wings still spread round them. The clinker under it goes grey.' },
    { id: 'mc2_sentry', x: 5, y: 28, monsters: ['sentry'], aware: 4, respawn: 2880, after: { flag: 'q_ember_lit' } },
  ],
};
