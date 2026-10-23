// The Glasswold, box D7: the Scarp's east end over the gulf. Country, band 26-27, laid whole in the Wold
// with the Saltings' strip under the Scarp. On top, the lip past Akordu's poles, walked onto over the
// south edge from D8: long grass no herd crops and three lions lying up in it, a foal's bones on the
// shore sand and four vultures over them, a cairn of sea-stones, two glass walkers' tracks to the Scarp's end and the walkers standing there,
// the hardest; a fire-ring where the Riders kept watch, a camp; and on the hills' crown a beacon gone
// cold, the keepers' store walled up in the rock behind it, found from the smell of tar. Below the
// Scarp, walked onto from C7's pans and D6's shore, the pans' end and the gulf's tidal shore, a
// salt-raker at the last pan, no group and nothing that pays. The Scarp shuts the two from each other;
// the west edge on top is shut against C7's ring, its corner with it. The lair's door is left at the
// east face, 19,24, and the enclave's at the hills over D8, 8,30. Cut from the atlas by
// tools/scaffold.ts; docs/areas/glasswold.md §12 is its brief (#833).
import type { MapDef } from '../../../../game/map.ts';
import { NORTH } from '../../../../game/types.ts';

export const WOLD_D7: MapDef = {
  id: 'wold_d7',
  name: 'The Wold',
  kind: 'outdoor',
  density: 'country',
  band: [26, 27],
  region: 'glasswold',
  start: { x: 20, y: 31, facing: NORTH },
  rows: [
    '-;~WWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '-;~WWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '-;~WWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '-;~WWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '-;~WWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '--;~WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '--;~WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '---;~~WWWWWWWWWWWWWWWWWWWWWWWWWW',
    '----;;~WWWWWWWWWWWWWWWWWWWWWWWWW',
    '------;~WWWWWWWWWWWWWWWWWWWWWWWW',
    '-----^^;~WWWWWWWWWWWWWWWWWWWWWWW',
    '----^^^^;~WWWWWWWWWWWWWWWWWWWWWW',
    '---^^^^;~WWWWWWWWWWWWWWWWWWWWWWW',
    '--^^^^^^;~WWWWWWWWWWWWWWWWWWWWWW',
    '^^^^^^^^;~WWWWWWWWWWWWWWWWWWWWWW',
    '^^^^^^^^^;~WWWWWWWWWWWWWWWWWWWWW',
    ',,^^^^^^^;~WWWWWWWWWWWWWWWWWWWWW',
    ',,^^^^^^^^~~WWWWWWWWWWWWWWWWWWWW',
    ',,^^^^^^^^^~~WWWWWWWWWWWWWWWWWWW',
    '|||||||||||~~~~~~WWWWWWWWWWWWWWW',
    '|||||||||||||~~~~~~WWWWWWWWWWWWW',
    '|||^^^^^^,,||||||~~~~WWWWWWWWWWW',
    'M,,^rrrr^,,,,,|||||~~~WWWWWWWWWW',
    'M,,^r::S^,,,,,,,,||||~~WWWWWWWWW',
    'M,,,rrrr^,,,,,,,,,,|||~~WWWWWWWW',
    'M,,,,,,^^^,,,,,,,,,,|||~~~~WWWWW',
    'Mssssss^^^,,,,,,,,,,,,||~~~~~WWW',
    'Msssssss^^ssssssssss,,,,__,~~~WW',
    'Msssssssssssssssssssssss,,,~,~~W',
    'Msssssssssssssssssssssssss,,,~~~',
    'Mssssss^^^sssssssssssssssssss,~~',
    'Mssssss^^^^sssssssssssssssssssss',
  ],
  features: [
    // Under the Scarp, the Saltings' strip, walked onto from C7 and D6: the pans' end, a salt-raker at the
    // last pan, the tide's line and the Scarp's foot. No group and nothing that pays.
    { kind: 'event', x: 0, y: 4, id: 'd7_pans', once: true, text: 'The pans give out in grey mud under the Scarp. Past them the gulf lies flat and brown.' },
    { kind: 'npc', x: 4, y: 9, name: 'a salt-raker at the last pan', lines: [
      'A salt-raker works the last pan, her face wrapped against the glare. She does not stop.',
      '"Something came to the end of the Scarp in the spring and stands there yet. The gulls keep off it."',
    ] },
    { kind: 'event', x: 7, y: 14, id: 'd7_tide', once: true, text: 'The tide\'s line runs along the hills\' foot in weed and salt crust. The flat beyond it is wet.' },
    { kind: 'event', x: 5, y: 17, id: 'd7_foot', once: true, text: 'The Scarp stands sheer over the hills here, brown rock streaked white, too steep for a goat.' },
    // On top, in from Akordu's box: the long grass past the poles, the foal's bones on the shore sand and a
    // cairn above the shore.
    { kind: 'event', x: 17, y: 29, id: 'd7_grass', once: true, text: 'Past the poles the grass stands long and unbroken. No herd has cropped it, and no hoof marked it.' },
    { kind: 'event', x: 24, y: 27, id: 'd7_bones', once: true, text: 'A foal\'s bones lie on the sand, picked clean and split. Something carried it here to eat.' },
    { kind: 'cairn', x: 27, y: 29, id: 'd7_cairn', text: 'A cairn of white sea-stones above the shore. A feather longer than an arm is wedged in its top.', gold: 350, items: ['elixir'] },
    // The walker's tracks to the Scarp's end, the end itself and the lip over the pans.
    { kind: 'event', x: 14, y: 26, id: 'd7_tracks', once: true, text: 'Tracks in the turf, each as broad as a shield, run straight north to the edge. None come back.' },
    { kind: 'event', x: 10, y: 21, id: 'd7_end', once: true, text: 'The Scarp ends here in a prow over the gulf. The wind comes up the face hard enough to lean on.' },
    { kind: 'event', x: 7, y: 21, id: 'd7_lip', once: true, text: 'The Scarp drops sheer below. The pans lie white along the gulf, and a cart crawls on the salt.' },
    // The Riders' old watch on the lip, a camp clear of both groups.
    { kind: 'camp', x: 3, y: 28, text: 'A ring of stones on the lip where Riders kept watch once, the pans in sight below.' },
    // The secret: the beacon's cold hearth on the crown and the smell of tar from the rock behind it; the
    // keepers' store walled up there, with their chest.
    { kind: 'event', x: 8, y: 23, id: 'd7_tar', once: true, text: 'A beacon\'s hearth on the crown, long cold. The rock behind it smells strongly of tar.' },
    { kind: 'event', x: 6, y: 23, id: 'd7_store', once: true, text: 'The beacon-keepers\' store: tar in pots, bundles of dry thorn and a horn for calling the herds in.' },
    { kind: 'chest', x: 5, y: 23, id: 'd7_chest', gold: 1100, items: ['potion_sp_great'] },
  ],
  secrets: [{ x: 7, y: 23, hint: 'd7_tar' }],
  encounters: [
    // From the way in: four vultures over the foal's bones on the shore, the nearest; three lions lying up
    // in the long grass; at the Scarp's end
    // the two glass walkers that walked north to the edge and stopped, the farthest and the hardest.
    { id: 'd7_vultures', x: 22, y: 28, monsters: ['vulture', 'vulture', 'vulture', 'vulture'], aware: 3, respawn: 2880 },
    { id: 'd7_lions', x: 13, y: 29, monsters: ['wold_lion', 'wold_lion', 'wold_lion'], aware: 4, respawn: 2880 },
    { id: 'd7_walker', x: 12, y: 23, monsters: ['glass_walker', 'glass_walker'], aware: 3, roams: false, respawn: 2880 },
  ],
};
