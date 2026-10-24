// The Delta, box A5: the fen's west shore. Country, band 10-11: the hills at the rim's foot and the
// fen under them, open to B5 along every row and down from A4's corner at the top; an old dyke let go
// along the shore, and in it a sluice-house walled up, found from the clear water that runs out under
// its foot; a wildfowler of Stienwierde in his punt, a camp, a cairn and a shrine; four leeches and an
// eel in the fen's pools and a bull toad alone where the dyke gives out; and the drowned mound in the
// marsh, left bare for the lair's door. Its north edge is the rim's mountain, as A4's south edge is,
// but at the corner, where the fen's marsh runs on; its south edge is A6's. Cut from the atlas by
// hand, its void written in; docs/areas/saltreach.md §12 is its brief.
import type { MapDef } from '../../../../game/mapdef.ts';
import { WEST } from '../../../../game/types.ts';
import { RESPAWN } from '../../../../game/keys.ts';

export const DELTA_A5: MapDef<'delta_a5'> = {
  id: 'delta_a5',
  name: 'The Delta',
  kind: 'outdoor',
  density: 'country',
  band: [10, 11],
  region: 'saltreach',
  start: { x: 31, y: 16, facing: WEST },
  rows: [
    '%%%%%MMMMMMMMMMMMMMMMMMMMMMMMMMw',
    '%%%%%MMMMMMM^^^^,,,,,,,wwwwwwwww',
    '%%%%%MMMMMMM^^^^^,,,,,,wwwwwwwww',
    '%%%%%MMMMMMMM^^^^,,,,,,wwwwwwwww',
    '%%%%%MMMMMMMMM^^^,,,,,wwwwwwwwww',
    '%%%%MMMMMMMMMM^^^,,,,,wwwwwwwwww',
    '%%%%%MMMMMMMMM^^^,,,,,wwwwwwwwww',
    '%%%%%MMMMMMMMMM^^,,,:wwwwwwwwwww',
    '%%%%%MMMMMMMMM^^^,,,:,wwww~~wwww',
    '%%%%%MMMMMMMMM^^^,,,:wwwww~~wwww',
    '%%%%%MMMMMMMMM^^^,,,:wwwwww~wwww',
    '%%%%%MMMMMMMM^^^^^,,wwwwwwwwwwww',
    '%%%%MMMMMMMM^^^^^^,,wwwwwwwwwwww',
    '%%%%%MMMMMMM^^^^^^,,:wwwwwwwwwww',
    '%%%MMMMMMMMM^^^^BBBBBBwwwwwwwwww',
    '%%%MMMMMMMM^^^^^B::::Swwwwwwwwww',
    '%%%MMMMMMMMM^^^^BBBBBB~~~wwwwwww',
    '%%%%MMMMMMMMM^^^^^,,:www~wwwwwww',
    '%%%%%MMMMMMMMM^^^^,,wwwwwwwwwwww',
    '%%%%%MMMMMMMMMM^^^,,wwwwwwwwwwww',
    '%%%%%MMMMMMMMMM^^^,,:wwwwwwwwwww',
    '%%%%%MMMMMMMMMM^^^^,:www~~~~~www',
    '%%%%%MMMMMMMMMM^^^^,:wwww^^^~www',
    '%%%%%MMMMMMMMMM^^^^^wwwww^^^~www',
    '%%%%%MMMMMMMMMM^^^^^:wwww^^^~www',
    '%%%%%MMMMMMMMM^^^^^^:www~~~~~www',
    '%%%%%MMMMMMMMM^^^^^w:wwwwwwwwwww',
    '%%%%%MMMMMMMMM^^^^^wwwwwwwwwwwww',
    '%%%%%MMMMMMMMM^^^^^^wwwwwwwwwwww',
    '%%%%%MMMMMMMMM^^^^^^wwwwwwwwwwww',
    '%%%%%MMMMMMMMM^^^^^^wwwwwwwwwwww',
    '%%%%%MMMMMMMMM^^^^^^wwwwwwwwwwww',
  ],
  features: [
    // The wildfowler in the reeds off the shore, with word of the toads.
    { kind: 'npc', x: 27, y: 13, name: 'a wildfowler in his punt', lines: [
      'A man of Stienwierde sits in a punt hauled half out of the reeds, a fowling bow across his knees. He does not look round.',
      '"Toads, up the shore all month. A big one lies up south, where the dyke gives out. I shoot teal, not toads."',
    ] },
    // The shrine at the fen's edge and the camp on the dry ground under the rim.
    { kind: 'shrine', x: 21, y: 8, id: 'a5_shrine', text: 'A shrine of the dyke-hands at the fen\'s edge to the drowned god: a round stone on a ledge, worn by the hands that lifted it.', stat: 'might', done: 'The stone sits on its ledge. The ledge is worn through.' },
    { kind: 'camp', x: 19, y: 3, name: 'The wildfowlers\' hide', text: 'A hearth of fen turf under the rim, black with old fires, and a reed hide leaning on the rock. Feathers lie about.' },
    // The cairn where the hills end and the marsh begins.
    { kind: 'cairn', x: 18, y: 27, id: 'a5_cairn', text: 'A cairn where the hills end and the marsh begins, its stones black underneath with fen. A clay pipe is stuck in its top.', gold: 55, items: ['potion_heal'] },
    // The secret: the sluice-house in the dyke, walled up, found by the clear water at its foot.
    { kind: 'event', x: 22, y: 15, id: 'a5_water', text: 'Clear water runs out under the dyke\'s foot and loses itself in the fen\'s brown. Nothing else in the fen is clear.' },
    { kind: 'event', x: 21, y: 15, id: 'a5_sluice', once: true, text: 'The sluice-house, walled up when the dyke was let go: a stool, a string of tally-sticks and the keeper\'s pay-box on the sill.' },
    { kind: 'chest', x: 17, y: 15, id: 'a5_sluice_chest', gold: 180, items: ['potion_heal'] },
  ],
  secrets: [{ x: 21, y: 15, hint: 'a5_water' }],
  encounters: [
    // Four leeches and an eel in the fen's pools, the nearest, kept to them.
    { id: 'a5_pools', x: 25, y: 9, monsters: ['leech', 'leech', 'leech', 'leech', 'fen_eel'], aware: 4, roams: false, respawn: RESPAWN.day },
    // A bull toad alone where the dyke gives out, the farthest and the hardest.
    { id: 'a5_toad', x: 25, y: 28, monsters: ['bull_toad'], aware: 4, respawn: RESPAWN.day },
  ],
};
