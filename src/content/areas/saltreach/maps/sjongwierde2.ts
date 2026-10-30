// Sjongwierde, level two: the undercroft. The stair comes down into the mound's heart, its roof on squat
// piers and its dead laid out on shelves in the clay; steps go down from it to a floor of black stone, and
// on them the Old Chanter sings, the first of the chanters, the lair's guardian at 32 (MONSTERS §13), the
// one way on. Past it the singing floor, worn to a dish by a staff's foot, and the Telstok on the stone by
// its place (#846). In the floor's east wall your steps come back late and hollow, and behind it is the
// hollow where jars set mouth out carried the song, with the mound's gifts in them. Band 30-32;
// docs/areas/saltreach/plan.md §12.13 is its brief (#830).
import type { MapDef } from '../../../../game/mapdef.ts';
import { anchored } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const SJONGWIERDE2: MapDef<'sjongwierde2'> = {
  id: 'sjongwierde2',
  name: 'The Undercroft',
  kind: 'dungeon',
  band: [30, 32],
  enclave: true,
  region: 'saltreach',
  start: { x: 7, y: 1, facing: SOUTH },
  // The mound's clay, its black stone floor and the chanter's green.
  palette: { wall: '#4a4436', wallDark: '#2a261c', floor: '#2c2a26', ceiling: '#100f0b', door: '#3a3226', wallStyle: 'smooth', ceilingStyle: 'vault', banner: '#3e5448' },
  rows: [
    '################',
    '#######.########',
    '#######.########',
    '####.......#####',
    '####.o...o.#####',
    '####.......#####',
    '####.o...o.#####',
    '#######.########',
    '#######.########',
    '#######.########',
    '#####.....######',
    '#####.....#...##',
    '#####.....S...##',
    '#####.....#...##',
    '################',
    '################',
  ],
  exits: [
    anchored({ x: 7, y: 1, to: 'sjongwierde', at: 'from_sjongwierde2', label: 'You climb the stair out of the mound\'s heart, up to the chancel.' }),
  ],
  features: [
    // The stair's foot, the undercroft and its dead.
    { kind: 'event', x: 7, y: 2, id: 'sw2_foot', once: true, text: 'An undercroft in the mound\'s heart, its roof on squat piers. The singing is near, and it never stops for breath.' },
    { kind: 'event', x: 4, y: 5, id: 'sw2_dead', once: true, text: 'Along the walls the mound\'s dead lie on shelves cut in the clay, each laid out straight. Not one of them stirs.' },
    // The steps down to the singing floor, where the guardian stands.
    { kind: 'event', x: 7, y: 7, id: 'sw2_steps', once: true, text: 'Steps go down to a floor of black stone. On them one of the dead stands in a rotted cope, singing.' },
    // Past it the singing floor, and the Telstok on the stone by its place.
    { kind: 'chest', x: 7, y: 10, id: 'sw2_stone', gold: 0, items: ['telstok'] },
    { kind: 'event', x: 7, y: 11, id: 'sw2_floor', once: true, text: 'The singing floor, black stone worn to a dish in its middle, where a staff\'s foot struck it year on year.' },
    // The secret: the wall that answers late and hollow, and the hollow behind it where the jars carried
    // the song, the mound's gifts in them.
    { kind: 'event', x: 9, y: 12, id: 'sw2_echo', text: 'Here your steps come back off the wall a beat late, and hollow, as off the inside of a jar.' },
    { kind: 'event', x: 11, y: 12, id: 'sw2_jars', once: true, text: 'A hollow behind the wall, its sides set with jars laid mouth out to carry the song. In them, the mound\'s gifts.' },
    { kind: 'chest', x: 12, y: 12, id: 'sw2_gifts', gold: 500, items: ['elixir', 'potion_sp_great'] },
  ],
  secrets: [{ x: 10, y: 12, hint: 'sw2_echo' }],
  encounters: [
    // The guardian: the Old Chanter on the steps to its floor, the one way on, a boss at 32 that never
    // comes back.
    { id: 'sw2_chanter', x: 7, y: 9, monsters: ['old_chanter'], aware: 2, roams: false, boss: true, slainText: 'The song stops on a low note. The Old Chanter lies down on the step, and its staff rings once on the stone.' },
  ],
};
