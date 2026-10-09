// The Saltings, box C7: the salt pans. Country, band 12: the salters' pans south of Saltmouth, walled
// and walked in lanes, the salt crabs' country; the last marsh west of them; and the Scarp, the
// escarpment to the Glasswold, as the box's south edge, with the stair's foot at 8,22, a track down
// from the plan's link at 8,16 (80,206 on the atlas). The Scarp is mountain, as Kestrel Edge is on
// D4, and the Glasswold's ground below its line in the box, rows 23 to 31 and the corners above them,
// is closed with it, band 26-28, but for the stair: its flights climb column 8 from the notch, past
// the fallen one by a rope ladder, to the Wold's lip on C8 (#528). Cut from the atlas by
// tools/scaffold.ts; docs/areas/saltreach.md §4.10 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const SALTINGS_C7: MapDef = {
  id: 'saltings_c7',
  name: 'The Saltings',
  kind: 'outdoor',
  density: 'country',
  band: [11, 12],
  region: 'saltreach',
  start: { x: 17, y: 0, facing: SOUTH },
  // The pans' walls are mud, crusted with salt where the brine has dried on them.
  palette: { wall: '#8c806a', wallDark: '#5e5646' },
  rows: [
    'wwwwwwwwwwwwww----------~~~~~---',
    'wwwwwwwwwwwwww----------------__',
    'wwwwwwwwwwwww-------------------',
    'wwwwwwwwwwwww-#####-#####-#####-',
    'wwwwww~~wwwww-#---#-#---#-#---#-',
    'wwwww~~~wwwww-#---#-#---#-#---S-',
    'wwwwww~wwwwww-##-##-##-##-#####-',
    'wwwwwwwwwwww--------------------',
    'wwwwwwwwwwwww-##-##-##-##-##-##-',
    'wwwwwwwwwwwww-#---#-#---#-#---#-',
    'wwwwwwwwwwwww-#---#-#---#-#---#-',
    'wwwwwwwwwwwww-#####-#####-#####-',
    'www,,wwwwwwww-------------------',
    ',,,,,,,wwwwwwwwwwwwww-----------',
    ',,,,,,,,,,,,,www,,,,,,BB,,BB,,,^',
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    ',,,,,,,,:,,,,,,,,,,,,,,,,,,,,,,,',
    ',,,,,,,,:,,,,,,,,,,,,,,,,,,,,,,,',
    ',,,,,,,,:,,,,,,,,,,,,,,,,,,,,,,,',
    ',,,,,,,,:,,,,,,,,,,,,,,,,,,,,,,M',
    ',,,,,,,,:,,,,,,,,,,,,,,,MMMMMMMM',
    ',,,,,,,,:,,,,,,MMMMMMMMMMMMMMMMM',
    ',,,,,,MM:MMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMM"MMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMM"MMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMM"MMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMM"MMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMM"MMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMM"MMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMM"MMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMM"MMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMM"MMMMMMMMMMMMMMMMMMMMMMM',
  ],
  features: [
    // In from Saltmouth's pans, and the lanes between the walls.
    { kind: 'event', x: 17, y: 1, id: 'c7_in', once: true, text: 'The pans open out southward, white to their last wall, and past them a grey cliff shuts the whole south. The Scarp.' },
    { kind: 'event', x: 19, y: 2, id: 'c7_pans', once: true, text: 'Lanes between the pans, their mud walls crusted white, a gap in each for the sluice. Crab tracks over all of it.' },
    // The secret: the one pan with no sluice, its hoard reached by the crabs' hole under its east wall.
    { kind: 'event', x: 31, y: 5, id: 'c7_trodden', text: 'At this wall\'s foot the crust is trodden to grey mud. Every other wall in the pans stands in salt unbroken.' },
    { kind: 'chest', x: 28, y: 4, id: 'c7_hoard', gold: 200, items: ['crabshell_buckler', 'horn_bow+1'] },
    // The Star That Moved (#56's 24, #183): the pilots' stone where the lanes cross, the watch from it
    // by night, once, and the pilots' slate at its foot, there at any hour.
    { kind: 'event', x: 25, y: 7, id: 'c7_stone', once: true, text: 'Where the lanes cross, a stone waist high, a notch cut in its top facing the Scarp. Something is wedged at its foot.' },
    { kind: 'event', x: 25, y: 7, id: 'c7_star', once: true, text: 'Low over the Scarp one star burns too steady. Through the notch it has moved since you sat down.', when: { hours: 'night' } },
    { kind: 'chest', x: 24, y: 7, id: 'c7_slate', gold: 0, items: ['pilots_slate'] },
    { kind: 'npc', x: 24, y: 14, name: 'a salter', lines: [
      'A salter at the huts\' door, bare-armed and burnt, a rake on her shoulder, squinting at the glare off the pans.',
      '"We rake by night in summer, and you learn the sky. Since midsummer there\'s a star in it that is wrong."',
      '"Low over the Scarp, and not where it was last week. The pilots say so too, and not aloud." She spits white.',
    ] },
    // The night crew's skiff, at the creek's end: C6's smugglers', not fought here.
    { kind: 'event', x: 30, y: 1, id: 'c7_boat', once: true, text: 'A skiff hauled up at the creek\'s end, oars under her and no name on her. Nobody by, by day. The bilge of her smells of brandy.' },
    // The last marsh, and the grass under the Scarp.
    { kind: 'shrine', x: 3, y: 13, id: 'c7_shrine', text: 'A shrine of the drowned god on the marsh\'s last dry ground. Its bowl is not dry like the others: it is full of salt.', stat: 'endurance', done: 'The bowl is still full of salt.' },
    { kind: 'cairn', x: 14, y: 18, id: 'c7_cairn', text: 'A salters\' cairn under the Scarp, of stones fallen off the face, each set with its sharp side to the cliff.', gold: 80, items: ['potion_heal'] },
    // The Scarp stair's foot: its lowest flight fallen, and a rope ladder past the fall up to the flights
    // above, which climb to the Wold's lip on C8 (#528).
    { kind: 'event', x: 8, y: 22, id: 'c7_stair', text: 'The stair\'s foot: its lowest flight fallen with the face. A rope ladder hangs past the fall, pegged to the flight above.' },
  ],
  secrets: [{ x: 30, y: 5, hint: 'c7_trodden' }],
  encounters: [
    // Salt crabs in the middle south pan; two bull toads in the last marsh, the box's hardest.
    { id: 'c7_crabs', x: 22, y: 10, monsters: ['salt_crab', 'salt_crab', 'salt_crab', 'salt_crab'], aware: 3, respawn: 1440 },
    { id: 'c7_toads', x: 6, y: 9, monsters: ['bull_toad', 'bull_toad'], aware: 3, respawn: 1440 },
  ],
};
