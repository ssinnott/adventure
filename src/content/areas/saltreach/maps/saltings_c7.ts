// The Saltings, box C7: the salt pans. Country, band 12: the salters' pans south of Saltmouth, walled
// and walked in lanes, the salt crabs' country; the last marsh west of them; and the Scarp, the
// escarpment to the Glasswold, as the box's south edge, with the stair's foot at 8,16 (80,206 on the
// atlas) seen and not climbed. The Scarp is mountain, as Kestrel Edge is on D4, and the Glasswold's
// ground below its line in the box is closed with it: that land is Act IV's. Cut from the atlas by
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
    'wwwwwwwwwwwwww----------~~~~~___',
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
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,M',
    ',,,,,,,,,,,,,,,,,,,,,,,,MMMMMMMM',
    ',,,,,,,,,,,,,,,MMMMMMMMMMMMMMMMM',
    ',,,,,,MM:MMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
  ],
  features: [
    { kind: 'event', x: 17, y: 1, id: 'c7_in', once: true, text: 'TODO in' },
    { kind: 'event', x: 19, y: 2, id: 'c7_pans', once: true, text: 'TODO pans' },
    { kind: 'event', x: 31, y: 5, id: 'c7_trodden', text: 'TODO hint' },
    { kind: 'chest', x: 28, y: 4, id: 'c7_hoard', gold: 200, items: ['crabshell_buckler'] },
    { kind: 'event', x: 22, y: 7, id: 'c7_star', text: 'TODO star', when: { hours: 'night' } },
    { kind: 'npc', x: 24, y: 14, name: 'a salter', lines: ['TODO salter 1', 'TODO salter 2'] },
    { kind: 'event', x: 30, y: 1, id: 'c7_boat', once: true, text: 'TODO boat' },
    { kind: 'shrine', x: 3, y: 13, id: 'c7_shrine', text: 'TODO shrine', stat: 'endurance', done: 'TODO done' },
    { kind: 'cairn', x: 14, y: 18, id: 'c7_cairn', text: 'TODO cairn', gold: 80, items: ['potion_heal'] },
    { kind: 'event', x: 8, y: 22, id: 'c7_stair', text: 'TODO stair' },
  ],
  secrets: [{ x: 30, y: 5, hint: 'c7_trodden' }],
  encounters: [
    { id: 'c7_crabs_n', x: 22, y: 7, monsters: ['salt_crab', 'salt_crab', 'salt_crab', 'salt_crab'], aware: 3, respawn: 1440 },
    { id: 'c7_crabs_s', x: 19, y: 12, monsters: ['salt_crab', 'salt_crab', 'salt_crab', 'salt_crab'], aware: 3, respawn: 1440 },
    { id: 'c7_toads', x: 6, y: 9, monsters: ['bull_toad', 'bull_toad'], aware: 3, respawn: 1440 },
    { id: 'c7_smugglers', x: 29, y: 1, monsters: ['wrack_smuggler', 'wrack_smuggler', 'wrack_bowman', 'wrack_bowman'], back: 2, aware: 3, respawn: 1440, when: { hours: 'night' } },
  ],
};
