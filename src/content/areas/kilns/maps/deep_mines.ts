// The Tiefzeche, level one: the workings. The cage comes down N4's shaft to its foot, and the dwarves'
// timbered galleries go off from it: the haulage way north through two air doors to where the
// galleries meet, a third door west to the stair down and the crust left on a ledge beside it, and the
// face east, where the hewers are, with a hole no dwarf cut past it. Off the way, a warm gallery
// west, and east the miners' candles before a walled niche, the prayer for the dead cut over it; behind
// it, a square shaft with iron rungs, the service ladder down. Band 16-17; docs/areas/kilns.md §4.7 is
// its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH, WEST } from '../../../../game/types.ts';

export const DEEP_MINES: MapDef = {
  id: 'deep_mines',
  name: 'The Tiefzeche',
  kind: 'dungeon',
  band: [16, 17],
  region: 'kilns',
  start: { x: 7, y: 14, facing: NORTH },
  palette: { wall: '#6e6050', wallDark: '#4a3e32', floor: '#4a4036', ceiling: '#1a1410', door: '#5c4430', wallStyle: 'stone', ceilingStyle: 'beams', banner: '#7a2e24' },
  rows: [
    '################',
    '#..D......##...#',
    '#..#...........#',
    '#######.####...#',
    '#######.#####..#',
    '#######D#####..#',
    '#...###.#####..#',
    '#...###.########',
    '#.......########',
    '#...###.########',
    '#...###......S.#',
    '#...###D######.#',
    '#######.########',
    '######...#######',
    '######...#######',
    '################',
  ],
  exits: [
    // The cage at the shaft's foot, back up to the spur's end before the shaft on N4 (MOUTH).
    { x: 7, y: 14, to: 'kilnsheart_n4', tx: 15, ty: 2, tf: WEST, label: 'The cage goes up the shaft, the wheel creaking over it, and out into the air.' },
    { x: 1, y: 1, to: 'deep_mines2', tx: 1, ty: 2, tf: SOUTH, label: 'You go down the worn stair into the old workings.' },
    // The service ladder, behind the niche, down to the old workings' shaft.
    { x: 14, y: 11, to: 'deep_mines2', tx: 5, ty: 11, tf: NORTH, label: 'You climb down the iron rungs a long way, into the dark.' },
  ],
  features: [
    { kind: 'event', x: 7, y: 13, id: 'dm1_in', once: true, text: 'The shaft\'s foot. Timbered galleries go off into the dark, and somewhere ahead picks are going.' },
    // The hymn's doors (#56's 36, #471): a verse at each, a count of doors, sung going down.
    { kind: 'event', x: 7, y: 11, id: 'dm1_door1', once: true, text: 'An air door, an old miner on a stool to work it. He sings as you pass: "One door shut, and all hands counted."' },
    { kind: 'event', x: 7, y: 5, id: 'dm1_door2', once: true, text: 'Another air door, another old miner beside it. He sings without looking up: "Two doors shut, and all hands counted."' },
    { kind: 'event', x: 3, y: 1, id: 'dm1_door3', once: true, text: 'The third door, and its keeper, older than the others. He sings it slowly: "Three doors shut, and all hands counted."' },
    // Where the galleries meet; the stair down, and the crust on its ledge.
    { kind: 'event', x: 6, y: 1, id: 'dm1_hall', once: true, text: 'Where the galleries meet, picks racked on the wall and a bench worn smooth with sitting.' },
    { kind: 'event', x: 2, y: 2, id: 'dm1_crust', once: true, text: 'A ledge by the stair, and a crust on it in a clean cloth, set out for the knockers. Crumbs go on down the steps.' },
    // The face, and the hewers at it; past it, the worm's hole.
    { kind: 'event', x: 13, y: 1, id: 'dm1_face', once: true, text: 'The face: a seam of ore in the rock, black and glittering, and lamps hung on pegs along it.' },
    { kind: 'npc', x: 14, y: 2, name: 'A hewer at the face', lines: [
      'A dwarf with a pick, black to the elbows, leans on the haft to look at you.',
      '"Down the stair is the old workings. The worms have them now. Below that is the bottom, and we do not go to the bottom."',
      '"Some nights you hear them under the floor, knocking. We leave the crust, and they leave us be."',
    ] },
    { kind: 'event', x: 13, y: 4, id: 'dm1_hole', once: true, text: 'A hole in the gallery wall, round as a barrel and polished inside. Rubble lies fresh at its lip.' },
    // The warm gallery.
    { kind: 'event', x: 3, y: 7, id: 'dm1_warm', once: true, text: 'The rock here is warm to the hand, and the props are scorched black.' },
    // The service ladder (#434's 2): the candles lean into the wall, the niche's prayer reads LADDER to
    // a reader, and searched there the wall gives on the shaft and the coins pushed through for the dead.
    { kind: 'event', x: 11, y: 10, id: 'dm1_candles', once: true, text: 'Miners\' candles burn on the floor before a walled niche, and every flame leans toward the wall.' },
    { kind: 'sign', x: 12, y: 10, id: 'dm1_niche', text: 'Cut over the walled niche, the dwarves\' prayer for their dead.', read: 'LADDER.' },
    { kind: 'event', x: 14, y: 10, id: 'dm1_well', once: true, text: 'Behind the wall a square shaft goes down, iron rungs in its side. On the floor, coins pushed through for the dead.' },
    { kind: 'chest', x: 14, y: 10, id: 'dm1_well_chest', gold: 400, items: [] },
  ],
  secrets: [{ x: 13, y: 10, hint: 'dm1_candles' }],
  encounters: [
    // Fire beetles in the warm gallery; at the face's far end, a rock worm in its hole, the level's group at 17.
    { id: 'dm1_beetles', x: 2, y: 10, monsters: ['fire_beetle', 'fire_beetle', 'fire_beetle', 'fire_beetle'], aware: 3, respawn: 1440, roams: false },
    { id: 'dm1_worm', x: 14, y: 6, monsters: ['rock_worm'], aware: 2, respawn: 2880, roams: false },
  ],
};
