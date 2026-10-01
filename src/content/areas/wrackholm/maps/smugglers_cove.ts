// Kelp Hole, level one: the crews' cave behind the mouth in E6's cliff. A hall where the crews keep
// their fires; the landing on the west, where the sea comes in under the rock and the boats unload
// the crates under the Helmstow customs seal; the ledge down to the sea cave at its north end; the
// chamber of the chained rows behind it, where the Hand's overseers keep them, and the crews'
// strongbox in the store beyond. Band 12-13; docs/areas/wrackholm.md §4.3 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

const CREW = ['wrack_smuggler', 'wrack_smuggler', 'wrack_bowman', 'wrack_bowman'];

export const SMUGGLERS_COVE: MapDef = {
  id: 'smugglers_cove',
  name: 'Kelp Hole',
  kind: 'dungeon',
  band: [12, 13],
  region: 'wrackholm',
  start: { x: 12, y: 14, facing: NORTH },
  palette: { wall: '#5e5a52', wallDark: '#3c3934', floor: '#3a3832', ceiling: '#26241f', door: '#4e3a26', wallStyle: 'stone', ceilingStyle: 'beams', banner: '#5a2a24' },
  rows: [
    '################',
    '#~~~~####...o..#',
    '#~~~..#........#',
    '#~~~..#....o...#',
    '#~~~..###D######',
    '#~~~...#.....###',
    '#~~~...#.....###',
    '#~~....D.....###',
    '#~~~...#.....###',
    '#~~~..##########',
    '#~~~..#......###',
    '##~...#......###',
    '##....D......###',
    '###...#..#...###',
    '############.###',
    '################',
  ],
  exits: [
    { x: 12, y: 14, to: 'wrackholm_e6', tx: 18, ty: 13, tf: SOUTH, label: 'You come out onto the cliff path above the landing stage.' },
    { x: 4, y: 2, to: 'smugglers_cove2', tx: 1, ty: 1, tf: SOUTH, label: 'You go down the ledge into the sea cave.' },
  ],
  features: [
    { kind: 'event', x: 12, y: 13, id: 'kh1_in', once: true, text: 'Smoke hangs under the roof. The floor runs wet to a glow of fires, and beyond them the sea slaps at stone.' },
    { kind: 'event', x: 8, y: 11, id: 'kh1_fires', once: true, text: 'Three fires on a floor of ash and fish bone. Oilskins hang to dry on a spar, and a pot of tar sits warm beside them.' },
    { kind: 'event', x: 4, y: 11, id: 'kh1_landing', once: true, text: 'The sea comes in under the rock to a step of cut stone. Two boats tie up there, weed on their ropes, straw in their bilges.' },
    { kind: 'event', x: 5, y: 7, id: 'kh1_crates', once: true, text: 'Crates stacked to the roof, straw between. Every lid is stamped in black: Helmstow customs, passed. Not one is smudged.' },
    { kind: 'chest', x: 6, y: 5, id: 'kh1_crate', gold: 150, items: ['potion_heal', 'potion_heal'] },
    { kind: 'event', x: 4, y: 3, id: 'kh1_ledge', once: true, text: 'The ledge drops into the dark. Cold comes up it, and a slow wash, and now and then a wet slap on rock.' },
    { kind: 'event', x: 11, y: 7, id: 'kh1_rows', once: true, text: 'Irons set in the floor in rows, a ring to each. Those sitting in them look up. Grey finger marks are on every collar.' },
    // Colan, the boat's captain's brother, who keeps the rows (#56's 25): once the overseers are down. His
    // choice, his letter and his going are #192's.
    { kind: 'npc', x: 12, y: 5, name: 'Colan, keeper of the rows', lines: [
      'Among the crates a man sits on an upturned one with a chain across his knees, and his hands are grey to the wrist. He did not fight, and he does not get up.',
      '"You\'re Kitto\'s. He\'s got that look, of having sent someone." He turns his hands over and looks at them as if they were somebody else\'s. "I keep the rows. That\'s what a guard becomes down here, if he stays. He keeps the rows, and after a while he stops asking what\'s in them."',
      '"I\'m not coming out. There\'s a door below, and a work, and I\'ve a place in it I\'d not have had on a boat in all my life. Kitto won\'t understand that, and I\'d not have him try."',
    ], after: { slain: 'smugglers_cove:kh1_overseers' } },
    { kind: 'event', x: 9, y: 2, id: 'kh1_store', once: true, text: 'Sacks, coils of rope, kegs of tar. On a crate at the back sits a strongbox, iron-bound, scratched round the lock.' },
    { kind: 'chest', x: 14, y: 1, id: 'kh1_strongbox', gold: 600, items: ['plate+1'] },
  ],
  encounters: [
    { id: 'kh1_crew_fires', x: 10, y: 11, monsters: CREW, back: 2, aware: 3, respawn: 2880 },
    { id: 'kh1_crew_landing', x: 4, y: 9, monsters: CREW, back: 2, aware: 3, respawn: 2880 },
    { id: 'kh1_overseers', x: 9, y: 7, monsters: ['ashen_overseer', 'ashen_overseer', 'ashen_overseer', 'ashen_overseer'], aware: 2, roams: false },
  ],
};
