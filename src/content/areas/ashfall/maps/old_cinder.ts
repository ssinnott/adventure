// Old Cinder, level one: the buried town. Down off the crater's lip on F11 (CRATER) onto the crater's
// floor where the ash has blown clear: a street of doorways between the houses, its people cast in ash
// where they stood, still holding their cups; the well at the crossing, a lane west to the potters'
// kilns, one of them broken open and dry inside, and east to a man in his doorway; at the far end the
// square, the Old Drake asleep on it beside a stall, and under it the hall's door and the stair down to
// the cellars. Husks stand in the street between the well and the square. Band 25-26, the boss the top;
// docs/areas/ashfall.md §4.7 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH, WEST } from '../../../../game/types.ts';

export const OLD_CINDER: MapDef = {
  id: 'old_cinder',
  name: 'Old Cinder',
  kind: 'dungeon',
  band: [25, 26],
  region: 'ashfall',
  start: { x: 8, y: 1, facing: SOUTH },
  // The potters' fired brick gone grey under the ash, the street's floor ash, and the crater's crust
  // overhead.
  palette: { wall: '#8e877c', wallDark: '#5f5951', floor: '#6b665e', ceiling: '#26221f', door: '#4a3a2c', wallStyle: 'brick', ceilingStyle: 'vault', banner: '#5a4a3c' },
  bare: true,
  rows: [
    '################',
    '########.#######',
    '#..#...#.#....##',
    '#o.#...D.D....##',
    '#..#####.#######',
    '#.............##',
    '#..#####.#######',
    '#o.#...D.D....##',
    '#..#...#.#....##',
    '########.#######',
    '####.........###',
    '####.........###',
    '####.........###',
    '########D#######',
    '########.#######',
    '################',
  ],
  exits: [
    // Back up onto the crater's lip on F11, facing away from the pit.
    { x: 8, y: 1, to: 'emberwaste_f11', tx: 18, ty: 4, tf: WEST, label: 'You climb back up over the lip, and the wind off the Waste finds you.' },
    // The hall's stair, down to the cellars.
    { x: 8, y: 14, to: 'old_cinder2', tx: 8, ty: 1, tf: SOUTH, label: 'You go down the hall\'s stair, under the square, into its cellars.' },
  ],
  features: [
    // The street the ash has left, and its people in the doorways.
    { kind: 'event', x: 8, y: 2, id: 'oc1_street', once: true, text: 'A street under the crater\'s rim, roofs and doorways out of the ash. In the doorways the people stand as they stood.' },
    // The houses either side of it, each with its people in it as they were.
    { kind: 'event', x: 5, y: 3, id: 'oc1_table', once: true, text: 'A family at their table, cast in ash where they sat. Every one of them holds a cup.' },
    { kind: 'event', x: 11, y: 3, id: 'oc1_sill', once: true, text: 'The ash came in at the window and filled the room to the sill. Along the sill, a row of cups.' },
    { kind: 'event', x: 5, y: 7, id: 'oc1_shop', once: true, text: 'A potter\'s shop, its shelves full of cups glazed and fired. The potter stands at his wheel with one in his hands.' },
    { kind: 'event', x: 11, y: 7, id: 'oc1_board', once: true, text: 'Two men of ash face each other over a board, their cups at their elbows, the game half played.' },
    // The lane across the street: the well at the crossing, the potters' kilns at its west end, one broken
    // open and dry inside (the level's one rest), and a man in his doorway at its east end.
    { kind: 'well', x: 8, y: 5, text: 'The well at the crossing, a cup set on its lip. It is full of ash to the brim.' },
    { kind: 'event', x: 2, y: 5, id: 'oc1_kilns', once: true, text: 'The potters\' kilns in a row, their mouths bricked up for a firing. Nobody let it out.' },
    { kind: 'camp', x: 2, y: 7, name: 'A broken kiln', text: 'A kiln with its side fallen out, dry inside and out of the ash. The brick is still warm.' },
    { kind: 'event', x: 13, y: 5, id: 'oc1_door', once: true, text: 'At the lane\'s end a man stands in his doorway, holding his cup out to the street.' },
    // The square at the far end, the Old Drake asleep on it, and the stall it lies beside.
    { kind: 'event', x: 8, y: 10, id: 'oc1_square', once: true, text: 'The square. Across it the ash rises and falls, slowly, like a sleeper\'s back.' },
    { kind: 'chest', x: 12, y: 11, id: 'oc1_stall', gold: 500, items: ['flamberge+1'] },
    // The hall's door under the square, and the stair down behind it.
    { kind: 'event', x: 8, y: 12, id: 'oc1_hall', once: true, text: 'Under the square the hall\'s door stands open. A stair goes down behind it.' },
  ],
  encounters: [
    // Husks in the street between the well and the square, the nearest.
    { id: 'oc1_husks', x: 8, y: 8, monsters: ['ash_husk', 'ash_husk', 'ash_husk', 'ash_husk'], aware: 2, respawn: 2880, roams: false },
    // The Old Drake asleep on the square: it wakes only when the company comes beside it, and its death
    // closes nothing. It never comes back.
    { id: 'oc1_drake', x: 11, y: 11, monsters: ['old_drake'], aware: 1, roams: false, slainText: 'The Old Drake lays its head down in the ash and is still. Nothing else in the town has moved.' },
  ],
};
