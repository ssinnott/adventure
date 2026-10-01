// The Sunder, level two: the floor. Dead wood and glass in the dark at the ledges' foot, the river
// come down the east face into a pool and gone into the rock, a pair of glass bears in the wood; the
// gorge narrowing to a stride, and the Warden of the Sunder in it, whose fall closes nothing; past it
// bare rock and no sound, and the wall, flat and warm, running both ways along the floor further than
// the light. The surveyor's chalk on its face runs out at a rock fall, and behind the fall the face is
// not flat.
// Band 14-16; docs/areas/sunderwood.md §4.6 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

export const THE_SUNDER2: MapDef = {
  id: 'the_sunder2',
  name: 'The Sunder\'s Floor',
  kind: 'dungeon',
  band: [14, 16],
  region: 'sunderwood',
  start: { x: 8, y: 2, facing: SOUTH },
  // The wall is the only wall face here, and it is smooth; the gorge's sides are rock.
  palette: { wall: '#6a6668', wallDark: '#4a4648', floor: '#34323a', ceiling: '#0a090e', door: '#6a6668', wallStyle: 'smooth', ceilingStyle: 'vault', banner: '#2c2e38' },
  bare: true,
  // The seam: the wall's face at the hollow's back, drawn as a hairline and walked through by nobody.
  legend: { Z: { solid: 'wall', door: 'door' } },
  rows: [
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMrrrrrrrrMMMMMMMMMMMMMMMMMM',
    'MMMMMrrddddddrrrrrMMMMMMMMMMMMMM',
    'MMMMMrddddcddddddrrrrrrrMMMMMMMM',
    'MMMMMrddddddddcddddd~~~rrMMMMMMM',
    'MMMMMrdddddcddddddcd~~~~rMMMMMMM',
    'MMMMMrrddcdddddddddd~~~drMMMMMMM',
    'MMMMMMrdddddddddcdddd~ddrMMMMMMM',
    'MMMMMMrrddddcdddddddddddrMMMMMMM',
    'MMMMMMMrrddddddddddcdcdrrMMMMMMM',
    'MMMMMMMMrrddddddddddddrrMMMMMMMM',
    'MMMMMMMMMrrddddddcdddrrMMMMMMMMM',
    'MMMMMMMMMMrrddddddddrrMMMMMMMMMM',
    'MMMMMMMMMMMrrdddddrrrMMMMMMMMMMM',
    'MMMMMMMMMMMMrrdddrrMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMr...rMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMrr.rrrMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMr....rMMMMMMMMMMMMM',
    'MMMMMMMMMMMMrr...rrMMMMMMMMMMMMM',
    'MMMMMMMMMMMrr.....rrMMMMMMMMMMMM',
    'MMMMMMMMMMrr.......rrMMMMMMMMMMM',
    'MMMMMMMMMrr.........rrMMMMMMMMMM',
    'MMMMMMMMrr...........rrMMMMMMMMM',
    'MMMMMMMrr.............rrMMMMMMMM',
    'Mrrrrrrr...............rrrrrrrMM',
    'M.S..........................rMM',
    '#Z##############################',
    '################################',
    '################################',
    '################################',
    '################################',
    '################################',
  ],
  exits: [
    { x: 7, y: 2, to: 'the_sunder', tx: 5, ty: 29, tf: NORTH, label: 'Up the stair to the ledges.' },
  ],
  features: [
    { kind: 'event', x: 8, y: 3, id: 'su2_in', once: true, text: 'The bottom. Dead wood and glass trunks in the dark, each lit through from inside, white. Overhead the faces lean together so high that no sky shows, and no rain comes down.' },
    { kind: 'event', x: 19, y: 6, id: 'su2_river', once: true, text: 'The river that went over the lip comes down the east face in threads, into a pool. The pool goes into a crack in the floor, and nothing comes out.' },
    { kind: 'event', x: 15, y: 14, id: 'su2_narrows', once: true, text: 'The gorge pinches to a stride between rock. Something stands in the gap, taller than the gap is wide, and the glass in it lights the rock either side.' },
    { kind: 'event', x: 17, y: 17, id: 'su2_fallen', once: true, text: 'A niche in the rock. Others who came down lie in it, laid straight, side by side. Their gear is at their feet, dry.' },
    { kind: 'chest', x: 17, y: 17, id: 'su2_fallen_chest', gold: 300, items: ['flail+1', 'ironwood_bow+1'] },
    { kind: 'event', x: 15, y: 20, id: 'su2_silence', once: true, text: 'Bare rock. No glass, no dead wood. Your boots are the only sound, and the rock gives it back.' },
    // The wall: the step.
    { kind: 'event', x: 15, y: 25, id: 'su2_wall', once: true, text: 'A wall, under everything. Flat, no join, further both ways than the light. Warm under the hand.' },
    { kind: 'event', x: 26, y: 25, id: 'su2_east', once: true, text: 'The strip along the wall runs east into the dark. Rock has come down against the wall in a heap, and the wall goes on under it, flat, the same.' },
    // The secret: the surveyor's chalk runs out at the fall; searched there, a gap in the rock opens on a
    // hollow beside the wall, and on the wall's face at its back, the seam.
    { kind: 'event', x: 4, y: 25, id: 'su2_fall', once: true, text: 'West the strip ends under a fall of rock, heaped against the wall higher than the light. Under the heap the wall goes on, flat, the same under the hand.' },
    { kind: 'event', x: 3, y: 25, id: 'su2_chalk', once: true, text: 'Chalk on the wall, a mark every ten paces, the surveyor\'s. Past the last one there are none.' },
    { kind: 'event', x: 1, y: 25, id: 'su2_seam', once: true, text: 'A pocket of air behind the fall. Here the face is not flat: a hairline, up past reach, across, back down. Beside it, shoulder high, rows of scratched marks nobody can read.' },
    { kind: 'chest', x: 1, y: 25, id: 'su2_seam_chest', gold: 200, items: ['potion_sp_great'] },
  ],
  secrets: [{ x: 2, y: 25, hint: 'su2_chalk' }],
  encounters: [
    // In the dead wood by the ledges' foot, a glass bear and spiders come down off the threads; further
    // on, toward the narrows, two glass bears. Both come back, whatever becomes of the Warden.
    { id: 'su2_wood', x: 10, y: 5, monsters: ['glass_spider', 'glass_spider', 'glass_bear'], aware: 4, respawn: 2880, roams: false },
    { id: 'su2_bears', x: 16, y: 11, monsters: ['glass_bear', 'glass_bear'], aware: 4, respawn: 2880, roams: false },
    // The Warden of the Sunder, in the gorge's narrowest place: it never comes back, and its fall closes nothing.
    { id: 'su2_warden', x: 15, y: 16, monsters: ['sunder_warden'], aware: 2, roams: false, slainText: 'It breaks into black glass at your feet, and the white light in the glass goes on burning. Nothing closes.' },
  ],
};
