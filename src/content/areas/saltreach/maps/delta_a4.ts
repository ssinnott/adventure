// The Delta, box A4: the hills over the heronry. Country, band 10-11: the hills under the rim west of
// B4, open to it along every row, and down from A3's corner at the top; a woman of stone on the hills'
// crest; a dry valley back into them, its bed of white stones, a shrine at its mouth and at its head a
// cave walled up with its stones, where a still is kept; and the fen's north-west corner below, three
// herons off B4's heronry fishing it and a bull toad and a leech in its pools, with the reed-cutters'
// camp on the dry ground at its edge. The Upper Water's hills in its middle rows are laid with the box
// whole, at the Delta's band. Its south edge is shut with the rim's mountain against A5, not built yet,
// but at the corner, where B4's marsh runs on (docs/areas/saltreach.md §12.5). Cut from the atlas by
// hand, its void written in; §12 is its brief.
import type { MapDef } from '../../../../game/mapdef.ts';
import { WEST } from '../../../../game/types.ts';
import { denBurnt, RESPAWN } from '../../../../game/keys.ts';

/** B4's heronry burnt: the herons off it stop coming back. */
const HERONRY_BURNT = denBurnt('delta_b4', 'b4_heronry');

export const DELTA_A4: MapDef<'delta_a4'> = {
  id: 'delta_a4',
  name: 'The Delta',
  kind: 'outdoor',
  density: 'country',
  band: [10, 11],
  region: 'saltreach',
  start: { x: 31, y: 16, facing: WEST },
  rows: [
    '%%%%%%%%%%%%%MMMMMMMMMMM^^^,,,,^',
    '%%%%%%%%%%%%MMMMMMMMMM^^^^^,,,,^',
    '%%%%%%%%%%%MMMMMMMMMM^^^^^^^^,,,',
    '%%%%%%%%%%%MMMMMMMMM^^^^^^^^^^,,',
    '%%%%%%%%%%MMMMMMMMMM^^^^^^^^^^^,',
    '%%%%%%%%%%MMMMMMMMM^^^^^^^^^^^^^',
    '%%%%%%%%%MMMMMMMMMM^^^^^^^^^^^^^',
    '%%%%%%%MMMMMMMMMMM^^^^^^^^^^^^^^',
    '%%%%%%MMMMMMMMMMMM^^^^^^^^^^^^^^',
    '%%%%%%MMMMMMMMMMMM^^^^^^^^^^^^^^',
    '%%%%%%MMMMMMMMMMMM^^^^^^^^^^^^^^',
    '%%%%%%MMMMMMMMMMM^^^^^^^,,^^^^^^',
    '%%%%%MMMMMMMMMMMM^^^^^^,,,,,,,^^',
    '%%%%%MMMMMMMMMMM^^^^^^^,,,,,,,,^',
    '%%%%%MMMMMMMMM^^^^^^^^^,,,,,,,,,',
    '%%%%%MMMMMMMM^^^^^^^^^^,,,,,,,,,',
    '%%%%%MMMMMBBB^^^^^^^^^,^,,,,,,,,',
    '%%%%%MMMMMB:B^^^^^^^^^,,^^^^^^,,',
    '%%%%%%MMMMB:S""""""""",,^^^^^^^,',
    '%%%%%MMMMMB:B^^^^^^^^^,,,^^^^,,,',
    '%%%%%MMMMMBBB^^^^^^^^^^,,,,,,,,,',
    '%%%%%%MMMMMMM^^^^^^^^^^,,,,,,,,,',
    '%%%%%%MMMMMMM^^^^^^^^^^,,,,,,,ww',
    '%%%%%%MMMMMMM^^^^^^^^^,,,,,,,www',
    '%%%%%%MMMMMMM^^^^^^^^^,,,,,wwwww',
    '%%%%%%MMMMMMM^^^^^^^^^,,,,wwwwww',
    '%%%%%%MMMMMMM^^^^^^^^,,,,,wwwwww',
    '%%%%%%MMMMMMM^^^^^^^,,,,,,wwwwww',
    '%%%%%MMMMMMMM^^^^^,,,,,,,ww~~www',
    '%%%%%MMMMMMM^^^^^,,,,,,,,www~www',
    '%%%%%MMMMMMMM^^^,,,MM,,,,,wwMMww',
    '%%%%%MMMMMMMMMMMMMMMMMMMMMMMMMMw',
  ],
  features: [
    // The hills' crest, and a cairn on the hillside over the grass west of B4.
    { kind: 'statue', x: 24, y: 6, id: 'a4_statue', text: 'A woman of stone on the crest, her pitcher tipped empty over the dry valley. Words are cut below.', riddle: 'A BED AND A MOUTH, AND IT NEVER SLEEPS.', answer: 'river', gift: { gold: 60, stat: 'intellect' }, done: 'The pitcher is empty still.' },
    { kind: 'cairn', x: 29, y: 10, id: 'a4_cairn', text: 'A cairn on the hillside, heaped by the reed-cutters to find their way down off the hills in a mist.', gold: 50, items: ['potion_heal'] },
    // The dry valley: the shrine at its mouth, and its bed of white stones back to the rim's foot.
    { kind: 'shrine', x: 23, y: 19, id: 'a4_shrine', text: 'A shrine of the valley\'s white stones at its mouth, to the drowned god. A heron\'s feather is pushed into every chink.', stat: 'speed', done: 'The feathers stir in the wind.' },
    // The fen's corner: the reed-cutters' camp on the dry ground at its edge, clear of both groups.
    { kind: 'camp', x: 21, y: 26, name: 'The reed-cutters\' camp', text: 'A fire-ring on dry ground at the fen\'s edge, cut reed stacked round it against the wind. The ash is cold.' },
    // The secret: the still in the cave at the valley's head, walled up with its stones, found by the reek.
    { kind: 'event', x: 13, y: 18, id: 'a4_reek', text: 'The bed ends against the rock, its stones heaped there. The air smells of peat smoke and malt, and there is no fire.' },
    { kind: 'event', x: 12, y: 18, id: 'a4_still', once: true, text: 'A cave behind the stones, and a still in it: a copper worm, kegs and a crock of coin under a sack.' },
    { kind: 'chest', x: 11, y: 18, id: 'a4_still_chest', gold: 200, items: ['elixir'] },
  ],
  secrets: [{ x: 12, y: 18, hint: 'a4_reek' }],
  encounters: [
    // Three herons off B4's heronry fishing the fen's corner, the nearest, back until it burns.
    { id: 'a4_herons', x: 27, y: 24, monsters: ['grey_heron', 'grey_heron', 'grey_heron'], aware: 5, respawn: RESPAWN.day, until: HERONRY_BURNT },
    // A bull toad and a leech in the corner's pools, the farthest and the hardest, kept to them.
    { id: 'a4_toad', x: 27, y: 29, monsters: ['bull_toad', 'leech'], aware: 4, roams: false, respawn: RESPAWN.day },
  ],
};
