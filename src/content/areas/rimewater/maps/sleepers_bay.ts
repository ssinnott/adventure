// The Sleepers' Bay, level one: the stair under the ice. The door at the crack's foot on K9 lets onto
// a landing still in the ice, the door's inside scratched at a girl's shoulder, and the stair's head
// goes straight down from it to where the ice gives out on walls too smooth to be stone, lit with no
// lamp. There it parts: west the stair, where a voice in the wall asks its one word; east the way the
// water runs, a channel of meltwater beside it. The tallymen and their knockers that did not come up
// through the hole keep both, and at the stair's foot, where the two ways meet, the first keeper
// waits alone. Band 20-22; docs/areas/rimewater.md §4.6 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

export const SLEEPERS_BAY: MapDef = {
  id: 'sleepers_bay',
  name: 'Under Loch Fuar',
  kind: 'dungeon',
  band: [20, 22],
  region: 'rimewater',
  start: { x: 8, y: 1, facing: SOUTH },
  // The ice at the top, and below it the Sunder's smooth wall (docs/areas/sunderwood.md §4.6), grey
  // and lit from itself; the door is the wall's own grey.
  palette: { wall: '#8e959c', wallDark: '#5f666d', floor: '#474d55', ceiling: '#15191e', door: '#8e959c', wallStyle: 'smooth', ceilingStyle: 'vault', banner: '#3a4654' },
  bare: true,
  rows: [
    '########D#######',
    '######iiiii#####',
    '######iiiii#####',
    '########i#######',
    '########.#######',
    '##...........~##',
    '##.#########.~##',
    '##.#########.~##',
    '##.....#####.~##',
    '######.#####.~##',
    '######.#####.~##',
    '######.......~##',
    '######.######~##',
    '####.....#######',
    '####.....#######',
    '################',
  ],
  exits: [
    // The door, back up into the crack in the ice on K9 (DOOR there).
    { x: 8, y: 0, to: 'coldmere_k9', tx: 24, ty: 29, tf: NORTH, label: 'You climb back up through the door into the crack in the ice.' },
    // The stair's last flight, down to the bay.
    { x: 6, y: 14, to: 'sleepers_bay2', tx: 7, ty: 13, tf: NORTH, label: 'You go down the last of the stair, into the cold.' },
  ],
  features: [
    // The landing in the ice, and the door's inside (DESIGN §9).
    { kind: 'event', x: 8, y: 2, id: 'sb1_door', once: true, text: 'On the inside of the door, scratched with a nail at a girl\'s shoulder: THE BLOOD OPENS THE DOOR.' },
    // The stair: the ice giving out, the light with no lamp, and the voice's wall.
    { kind: 'event', x: 8, y: 4, id: 'sb1_ice', once: true, text: 'The ice gives out on the stair. Past it the walls are smooth and grey, one face with no join, and they hum.' },
    { kind: 'event', x: 4, y: 5, id: 'sb1_light', once: true, text: 'There is light down here and no lamp. The walls give it, grey and even, all the way down.' },
    { kind: 'event', x: 4, y: 8, id: 'sb1_voice', once: true, text: 'A soft voice in the wall, close by: "Captain?" Nobody answers it, and it does not ask again.' },
    // The way the water runs, and the knockers' tallies on its wall.
    { kind: 'event', x: 12, y: 6, id: 'sb1_water', once: true, text: 'A second way down, meltwater running beside it in a channel cut smooth, smoking with cold.' },
    { kind: 'event', x: 12, y: 9, id: 'sb1_tallies', once: true, text: 'Tallies scratched along the wall at a knocker\'s height, row under row, going down.' },
    // The stair's foot, where the two ways meet.
    { kind: 'event', x: 6, y: 13, id: 'sb1_foot', once: true, text: 'At the stair\'s foot the hum is louder, and the cold comes up from below like a held breath.' },
  ],
  encounters: [
    // The tallymen and their knockers that did not come up through the hole, on the stair and on the
    // water's way: three tallymen to a crew, which at the ice-hole's one were too few for the band (#490).
    { id: 'sb1_knockers1', x: 2, y: 7, monsters: ['tallyman', 'tallyman', 'tallyman', 'knocker', 'knocker', 'knocker', 'knocker', 'knocker'], aware: 2, respawn: 2880, roams: false },
    { id: 'sb1_knockers2', x: 12, y: 8, monsters: ['tallyman', 'tallyman', 'tallyman', 'knocker', 'knocker', 'knocker', 'knocker', 'knocker'], aware: 2, respawn: 2880, roams: false },
    // The first keeper, alone at the stair's foot, and gentle.
    { id: 'sb1_keeper', x: 6, y: 12, monsters: ['bay_keeper'], aware: 2, respawn: 2880, roams: false },
  ],
};
