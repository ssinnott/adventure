// The Delta, box A6: the fen under the rim. Country, band 11-12: the fen's west edge beside the Drowned
// Temples' approach, open to B6 along every row but the last and down from A5 at the top; the temples'
// bell heard over the fen, a priest of stone knee-deep in the reeds with a riddle, a cairn and a camp
// at the rim's foot; two drowned men walked out of the temples into the fen and two bull toads at its
// south end; and in the rim's foot an anchorite's cell walled up, found from the slit she watched the
// temples through. Its south edge is the rim's mountain, shut against A7, which stays cut, its corner
// with it, as B6's 0,31 beside it is. Cut from the atlas by hand, its void written in;
// docs/areas/saltreach.md §12 is its brief.
import type { MapDef } from '../../../../game/mapdef.ts';
import { WEST } from '../../../../game/types.ts';
import { COUNT_STOPPED, STONE_HOME } from './drowned_temples.ts';
import { RESPAWN } from '../../../../game/keys.ts';

export const DELTA_A6: MapDef<'delta_a6'> = {
  id: 'delta_a6',
  name: 'The Delta',
  kind: 'outdoor',
  density: 'country',
  band: [11, 12],
  region: 'saltreach',
  start: { x: 31, y: 16, facing: WEST },
  rows: [
    '%%%%%MMMMMMMMM^^^^^^,wwwwwwwwwww',
    '%%%%%MMMMMMMMM^^^^^,,wwwwwwwwwww',
    '%%%%%MMMMMMMMM^^^^^,,,wwwwwwwwww',
    '%%%%%MMMMMMMMMM^^^^,,,wwwwwwwwww',
    '%%%%%MMMMMMMMM^^^^^,,,wwwwwwwwww',
    '%%%%%MMMMMMMMM^^^^^,,,wwwwwwwwww',
    '%%%%MMMMMMMMMM^^^^,,,,wwwwwwwwww',
    '%%%%%MMMMMMMMM^^^^,,,,,wwwwwwwww',
    '%%%%%MMMMMMMMM^BBBB,,,,wwwwwwwww',
    '%%%%%MMMMMMMMM^B::B,,,wwwwwwwwww',
    '%%%%MMMMMMMMMM^B::S,,,wwwwwwwwww',
    '%%%%%MMMMMMMMMMBBBB,,,,wwwwwwwww',
    '%%%%%%MMMMMMMMM^^^,,,,,wwwwwwwww',
    '%%%%%%MMMMMMMMM^^^^,,,,,wwwwwwww',
    '%%%%%%MMMMMMMMM^^^^,,,,,wwwwwwww',
    '%%%%%%%MMMMMMMM^^^^^,,,,wwwwwwww',
    '%%%%%%%%MMMMMMMM^^^^^,,,wwwwwwww',
    '%%%%%%%%MMMMMMM^^^^^^,,,wwwwwwww',
    '%%%%%%%%MMMMMMM^^^^^^,,,wwwwwwww',
    '%%%%%%%%MMMMMMMM^^^^^,,,,wwwwwww',
    '%%%%%%%%MMMMMMMMM^^^^^,,,wwwwwww',
    '%%%%%%%%%MMMMMMMMM^^^^^,,,wwwwww',
    '%%%%%%%%%MMMMMMMMMM^^^^,,,wwwwww',
    '%%%%%%%%%MMMMMMMMMM^^^^,,,wwwwww',
    '%%%%%%%%%MMMMMMMMMMM^^^,,,,wwwww',
    '%%%%%%%%%MMMMMMMMMMM^^^^,,,wwwww',
    '%%%%%%%%%MMMMMMMMMMM^^^^,,,wwwww',
    '%%%%%%%%%%MMMMMMMMMMM^^^^,,,wwww',
    '%%%%%%%%%%MMMMMMMMMMM^^^^^,,,www',
    '%%%%%%%%%%%MMMMMMMMMM^^^^^^,,,ww',
    '%%%%%%%%%%%MMMMMMMMMMM^^^^^^,,ww',
    '%%%%%%%%%%%MMMMMMMMMMMMMMMMMMMMM',
  ],
  features: [
    // The bell over the fen, and the priest of stone in the reeds.
    { kind: 'event', x: 28, y: 4, id: 'a6_bell', once: true, until: [COUNT_STOPPED, STONE_HOME], text: 'A bell over the fen, from the temples, struck slow and even and the last stroke late. The reeds lean towards it.' },
    { kind: 'statue', x: 28, y: 12, id: 'a6_statue', text: 'A priest of stone knee-deep in the reeds, his hands out to the temples. Words are cut at his feet.', riddle: 'TWICE A DAY IT TAKES THE SHORE AND GIVES IT BACK, AND IT IS NEVER LATE.', answer: 'tide', gift: { gold: 70, stat: 'luck' }, done: 'The reeds stand straight about him.' },
    // The cairn at the hills' foot and the pilgrims' camp under the rim.
    { kind: 'cairn', x: 21, y: 4, id: 'a6_cairn', text: 'A cairn of roof slates carried from the temples, weed grown over every one. Nobody has counted them.', gold: 65, items: ['potion_heal'] },
    { kind: 'camp', x: 20, y: 24, name: 'The pilgrims\' hearth', text: 'A pilgrims\' hearth at the rim\'s foot, three flat stones and a ring of black. Candle-ends lie in the ash.' },
    // The secret: the anchorite's cell in the rim's foot, walled in, found by the slit she watched through.
    { kind: 'event', x: 19, y: 10, id: 'a6_slit', text: 'A slit is cut in the rock at head height, a hand wide, and it looks east. Over the fen the temples\' roofs are in it.' },
    { kind: 'event', x: 18, y: 10, id: 'a6_cell', once: true, text: 'A cell cut into the rim\'s foot, walled in as she was: a stool, a wooden bowl, and round it what the faithful left her.' },
    { kind: 'chest', x: 16, y: 9, id: 'a6_cell_chest', gold: 250, items: ['elixir'] },
  ],
  secrets: [{ x: 18, y: 10, hint: 'a6_slit' }],
  encounters: [
    // Two drowned men walked out of the temples into the fen, the nearest.
    { id: 'a6_drowned', x: 27, y: 18, monsters: ['temple_drowned', 'temple_drowned'], aware: 4, roams: false, respawn: RESPAWN.day },
    // Two bull toads at the fen's south end, the farthest and the hardest.
    { id: 'a6_toads', x: 26, y: 27, monsters: ['bull_toad', 'bull_toad'], aware: 4, respawn: RESPAWN.day },
  ],
};
