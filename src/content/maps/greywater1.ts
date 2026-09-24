// Greywater, level one: the smugglers' caves in the sea cliffs at the Shelf's south-west corner.
// Wet rock and tide pools. The smugglers hold the western caves; their captain keeps the iron key
// in the south, and the locked door east of it is the only way to the stairs down. Band 2-4.
import type { MapDef } from '../../game/map.ts';
import { EAST, SOUTH } from '../../game/types.ts';

export const GREYWATER1: MapDef = {
  id: 'greywater1',
  name: 'Greywater Caves',
  kind: 'dungeon',
  band: [2, 4],
  start: { x: 1, y: 1, facing: SOUTH },
  palette: { wall: '#6a7a80', wallDark: '#465258', floor: '#3a4448', ceiling: '#2a3236', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#2a5a7a' },
  rows: [
    '################',
    '#...#.....#....#',
    '#.#.#.###.#.##.#',
    '#.#...#...#..#.#',
    '#.#####.####.#.#',
    '#.....#....#.#.#',
    '#####.####.#.#.#',
    '#.....#..#.....#',
    '#.###.#..####L##',
    '#.#.....o.###..#',
    '#.#.#.#...#..#.#',
    '#...#.#.o.S..#.#',
    '###.#.########.#',
    '#...#.D...##...#',
    '#.###.#...####.#',
    '################',
  ],
  exits: [
    { x: 1, y: 1, to: 'shelf', tx: 3, ty: 28, tf: EAST, label: 'You climb out of the caves onto the beach.' },
    { x: 14, y: 14, to: 'greywater2', tx: 1, ty: 1, tf: SOUTH, label: 'Steps cut into the rock lead down. Someone has chiselled a hand into every one.' },
  ],
  features: [
    { kind: 'event', x: 1, y: 2, id: 'gw1_in', once: true, text: 'The caves smell of salt and lamp oil. Crates stamped with the Harrow customs seal lie broken open along the walls.' },
    { kind: 'chest', x: 3, y: 3, id: 'gw1_c1', gold: 40, items: ['potion_heal', 'rations', 'rations'] },
    { kind: 'sign', x: 7, y: 3, text: 'Chalked on the rock: SHIP DUE DARK OF THE MOON. CARGO GOES BELOW, NOT TO HARROW.' },
    { kind: 'chest', x: 14, y: 1, id: 'gw1_c2', gold: 60, items: ['buckler', 'antidote', 'potion_heal'] },
    { kind: 'event', x: 8, y: 8, id: 'gw1_pool', once: true, text: 'A tide pool fills the middle cavern. Things float in it face down, in Harrow clothes. One of them turns its head.' },
    { kind: 'event', x: 11, y: 11, id: 'gw1_stash', once: true, text: 'The smugglers\' stash: the good stock, oiled and wrapped in sailcloth.' },
    { kind: 'chest', x: 12, y: 11, id: 'gw1_stash_c', gold: 120, items: ['longsword', 'shield', 'potion_heal'] },
    { kind: 'event', x: 7, y: 13, id: 'gw1_den', once: true, text: 'The captain\'s den: a hammock, a strongbox, and a letter on grey Ashen paper. "The Deacon wants the cargo below by the dark of the moon. Keep the iron key on you."' },
    { kind: 'chest', x: 9, y: 14, id: 'gw1_key', gold: 90, items: ['key_iron', 'scale'] },
    { kind: 'event', x: 13, y: 9, id: 'gw1_door', once: true, text: 'Past the iron door the rock is carved, not worn by water. Hands are chiselled into it, palm out, everywhere.' },
    { kind: 'chest', x: 13, y: 13, id: 'gw1_c3', gold: 50, items: ['potion_heal', 'potion_sp'] },
  ],
  encounters: [
    { id: 'gw1_crabs', x: 5, y: 1, monsters: ['shore_crab', 'shore_crab', 'shore_crab', 'shore_crab'], aware: 4, respawn: 1440 },
    { id: 'gw1_rats', x: 8, y: 3, monsters: ['rat', 'rat', 'rat', 'rat', 'rat', 'rat'], aware: 4, respawn: 720 },
    { id: 'gw1_smug1', x: 12, y: 5, monsters: ['smuggler', 'smuggler', 'smuggler', 'smuggler_bowman'], aware: 5, respawn: 2880 },
    { id: 'gw1_crabs2', x: 3, y: 7, monsters: ['shore_crab', 'shore_crab', 'shore_crab', 'shore_crab', 'shore_crab'], aware: 4, respawn: 1440 },
    { id: 'gw1_drowned', x: 8, y: 10, monsters: ['drowned', 'drowned', 'drowned'], aware: 4, respawn: 2880 },
    { id: 'gw1_smug2', x: 3, y: 13, monsters: ['smuggler', 'smuggler', 'smuggler_bowman', 'smuggler_bowman'], aware: 5, respawn: 2880 },
    { id: 'gw1_smug3', x: 12, y: 7, monsters: ['smuggler', 'smuggler', 'smuggler', 'smuggler', 'smuggler_bowman', 'smuggler_bowman'], aware: 5, respawn: 2880 },
    { id: 'gw1_captain', x: 8, y: 13, monsters: ['smuggler_captain', 'smuggler', 'smuggler'], aware: 2, roams: false },
    { id: 'gw1_stairs', x: 14, y: 12, monsters: ['ghoul', 'ghoul', 'drowned', 'drowned'], aware: 3, roams: false },
  ],
};
