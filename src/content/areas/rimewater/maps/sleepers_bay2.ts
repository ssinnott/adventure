// The Sleepers' Bay, level two: the bay. The stair comes down into a long hall, cold and lit from its
// walls, full of long glass beds in rows, frosted over, with every people of Caldera asleep in them
// (STORY): an orcblood with Idris's brow, a Tidefolk woman, a gnome, dwarves, humans, an elf with
// Wren's hands. Keepers go between the rows, four to a row; in the last row the Matron stoops over a
// bed. The keepers' feet have worn a path up the middle, which runs on past the last row to the back
// wall and stops: behind it, the locker, where the keepers put what the sleepers came with. At the
// back, a door with Kiln-script over it that opens for nobody, as the Mines' CREW ONLY does not.
// Band 21-22; docs/areas/rimewater.md §4.6 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH } from '../../../../game/types.ts';

export const SLEEPERS_BAY2: MapDef = {
  id: 'sleepers_bay2',
  name: 'The Sleepers\' Bay',
  kind: 'dungeon',
  band: [21, 22],
  region: 'rimewater',
  start: { x: 7, y: 13, facing: NORTH },
  // The stair's smooth grey, paler, and the floor under the beds a shade lighter where it is worn.
  palette: { wall: '#9ba0a6', wallDark: '#6b7076', floor: '#4f545b', ceiling: '#181b20', door: '#9ba0a6', wallStyle: 'smooth', ceilingStyle: 'vault', banner: '#3e4a56' },
  bare: true,
  // The door at the back: a wall with a door in it, as a seam, that nobody walks through.
  legend: { Z: { solid: 'wall', door: 'door' } },
  rows: [
    '################',
    '######...#######',
    '###Z###S########',
    '##...........###',
    '##ooooo.ooooo###',
    '##...........###',
    '##ooooo.ooooo###',
    '##...........###',
    '##ooooo.ooooo###',
    '##...........###',
    '##ooooo.ooooo###',
    '##...........###',
    '#######.########',
    '#######.########',
    '#######.########',
    '################',
  ],
  exits: [
    { x: 7, y: 14, to: 'sleepers_bay', tx: 6, ty: 13, tf: NORTH, label: 'You climb the stair, up out of the cold.' },
  ],
  features: [
    // The stair's foot, and the beds: the first wiped, and a face in it (the chapter's step, §5).
    { kind: 'event', x: 7, y: 12, id: 'sb2_stair', once: true, text: 'The stair comes out into a long hall, as cold as the ice above and lit grey from its walls.' },
    { kind: 'event', x: 7, y: 11, id: 'sb2_beds', once: true, text: 'Rows of long glass beds, frosted over. Wipe one, and there is a face in it you have seen before.' },
    // The rows: every people of Caldera, asleep.
    { kind: 'event', x: 10, y: 9, id: 'sb2_row1', once: true, text: 'An orcblood under the frost, with Idris\'s brow. Past him a Tidefolk woman, and then a gnome.' },
    { kind: 'event', x: 3, y: 7, id: 'sb2_row2', once: true, text: 'Dwarves, a row of them, beards combed out on their chests. Then humans, more than you can count.' },
    { kind: 'event', x: 11, y: 5, id: 'sb2_row3', once: true, text: 'An elf with Wren\'s hands, folded. Every one of them breathes, once in a long while.' },
    // The hint: the keepers' path, past the last row to the wall.
    { kind: 'event', x: 7, y: 3, id: 'sb2_path', once: true, text: 'The floor is worn between the beds in a path. It runs on past the last row to the wall, and stops.' },
    // The door at the back, in Kiln-script (#538): read, and still shut.
    { kind: 'sign', x: 3, y: 3, id: 'sb2_back', text: 'Over a door at the back, fine as a hair at its edges, marks in the old script.', read: 'COLD STORE. WAKE IN ORDER.' },
    // The secret: the locker behind the last row, four hundred years of pockets.
    { kind: 'event', x: 7, y: 1, id: 'sb2_locker', once: true, text: 'Grey drawers from floor to roof, a row\'s mark on each, and in them what the sleepers came with.' },
    { kind: 'chest', x: 8, y: 1, id: 'sb2_locker_chest', gold: 1500, items: ['hunters_bow+1', 'plate+4'] },
  ],
  secrets: [{ x: 7, y: 2, hint: 'sb2_path' }],
  encounters: [
    // The bay's keepers, four to a row (three were too few for the band, #490), whose touch puts to
    // sleep and who mend each other.
    { id: 'sb2_keepers1', x: 4, y: 9, monsters: ['bay_keeper', 'bay_keeper', 'bay_keeper', 'bay_keeper'], aware: 2, respawn: 2880, roams: false },
    { id: 'sb2_keepers2', x: 10, y: 7, monsters: ['bay_keeper', 'bay_keeper', 'bay_keeper', 'bay_keeper'], aware: 2, respawn: 2880, roams: false },
    { id: 'sb2_keepers3', x: 4, y: 5, monsters: ['bay_keeper', 'bay_keeper', 'bay_keeper', 'bay_keeper'], aware: 2, respawn: 2880, roams: false },
    // The Matron in the last row: she never comes back, and the sleepers sleep on when she falls.
    { id: 'sb2_matron', x: 10, y: 3, monsters: ['matron'], aware: 2, roams: false, slainText: 'The Matron folds down over the last bed, her eight fingers spread on its frost. The sleepers sleep on.' },
  ],
};
