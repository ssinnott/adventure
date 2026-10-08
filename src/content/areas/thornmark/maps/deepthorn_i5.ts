// The Deepthorn, box I5: the wood to the head, the last of the deep. Country, band 8-10: a strip of
// forest down Penspern's west side to the Wyke, walked by three paths: in from Henlys to the north,
// down the shingle, and through the trees to the tip, where the beach runs on east under the head.
// The owls' roost is a dead oak on the shore; past it, under a root at the water's edge, the hold's
// youths keep their boat. At the tip, once the Grove Stone is mended, an elf of the old wood comes out
// of the trees, who teaches the Druid's second prestige (#19). The Hearth Isle's rocks in the
// south-west corner are kept and never walked.
// Cut from the atlas by tools/scaffold.ts; docs/areas/thornmark.md §4.6 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';
import { denBurnt } from '../../../../game/dens.ts';
import { TEAR_CLOSED } from './grove2.ts';

/** The owls' roost burnt: its brood stops coming. */
const ROOST_BURNT = denBurnt('deepthorn_i5', 'i5_roost');

export const DEEPTHORN_I5: MapDef = {
  id: 'deepthorn_i5',
  name: 'The Deepthorn',
  kind: 'outdoor',
  density: 'country',
  band: [8, 10],
  region: 'thornmark',
  start: { x: 24, y: 0, facing: SOUTH },
  rows: [
    'WWWWWWWWWWWWWWWW~~TTTTTT:TTTTTTT',
    'WWWWWWWWWWWWWWWW~~TTTTTT:TTTTTTT',
    'WWWWWWWWWWWWWWWW~~TTTTTT:TTTTTTT',
    'WWWWWWWWWWWWWWWW~~TTTTTT:TTTTTTT',
    'WWWWWWWWWWWWWWWW~~TTTTTT:TTTTTTT',
    'WWWWWWWWWWWWWWWWW~~TTTTT:TTTTTTT',
    'WWWWWWWWWWWWWWWWWW~~TT,,,,,,TTTT',
    'WWWWWWWWWWWWWWWWWW~~,,,,,,,,TTTT',
    'WWWWWWWWWWWWWWWWWW~~__,,,,,,:TTT',
    'WWWWWWWWWWWWWWWWWWW~~_ST:TTT:TTT',
    'WWWWWWWWWWWWWWWWWWWW~~:T:TTT:TTT',
    'WWWWWWWWWWWWWWWWWWWW~~:T:TTT:TTT',
    'WWWWWWWWWWWWWWWWWWWWW~~T:TTT:TTT',
    'WWWWWWWWWWWWWWWWWWWWW~~T:TTT:TTT',
    'WWWWWWWWWWWWWWWWWWWWWW~~__TT:TTT',
    'WWWWWWWWWWWWWWWWWWWWWWW~~__T:TTT',
    'WWWWWWWWWWWWWWWWWWWWWWWW~~__:TTT',
    'WWWWWWWWWWWWWWWWWWWWWWWWW~~_:TTT',
    'WWWWWWWWWWWWWWWWWWWWWWWWWW~~____',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWW~~TT_',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWW~~~_',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWW~~~',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW~',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '~WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'r~~WWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'r~~~WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'rrr~~WWWWWWWWWWWWWWWWWWWWWWWWWWW',
  ],
  features: [
    // The owls' roost, a dead oak on the shore (#88): the first den whose brood walks only by night.
    { kind: 'den', x: 20, y: 7, id: 'i5_roost', name: 'The owls\' roost', text: 'A dead oak hollow to its crown, and in every hollow of it a pale face turned to you, unblinking. By day they do not move.',
      breeds: ['great_owl'], keepers: 'i5_keepers', brood: ['i5_brood1', 'i5_brood2'],
      ask: 'The old owls are dead, and the oak is dry to the heart. Burn the roost?', burn: 'Burn it.', leave: 'Leave it.',
      burnt: 'The dead oak goes up like a torch and burns till dark. In its hollow, the bright things owls carry.',
      ruin: 'A black stump on the shore, and the nights quieter for it.', gold: 0, items: ['silver_torc'] },
    // The shore path, where the trunks open on the water.
    { kind: 'event', x: 25, y: 15, id: 'i5_hearth', once: true, when: { hours: 'night' }, text: 'The Hearth, through the trunks, nearer than it has ever been. The water under it is lit for a mile.' },
    { kind: 'camp', x: 27, y: 17, name: 'A camp under the last oaks', text: 'A camp on the shingle under the last oaks, with the sea for a wall on one side.' },
    // The secret: the youths' boat, in a hollow under the roots (#218's fire on the head).
    { kind: 'event', x: 21, y: 9, id: 'i5_groove', once: true, text: 'A root at the water\'s edge with a groove worn into it, deep and smooth, the way a rope wears wood. There is no rope.' },
    { kind: 'event', x: 22, y: 10, id: 'i5_hollow', once: true, text: 'Under the roots, a hollow with a boat in it, fresh-tarred, and a cask of lamp oil in the bow.' },
    { kind: 'chest', x: 22, y: 11, id: 'i5_boat', gold: 0, items: ['lantern_oil'] },
    // The Druid's second prestige (#19, #439; DESIGN §5): an elf of the old wood, who comes out of the
    // trees at the tip once the Grove Stone is mended, when the rootwalkers beside her sleep.
    { kind: 'npc', x: 30, y: 18, name: 'Hendar, of the old wood', after: { flag: 'q_mender_done' }, lines: [
      'Where the trees give out on the shingle, an elf stands with one hand flat on the last oak, as a groom feels a horse\'s neck. Moss grows in the folds of her cloak.',
      '"Hendar. The Stone is whole, and the wood has stopped listening for the axe. So I came out to look at the sea."',
      '"A swarm is many small minds that think as one. A wood is one mind that thinks very slowly. Sit, and learn to wait for it."',
    ], teaches: { cls: 'druid', prestige: 2, seek: 'Hendar, of the old wood, on the shingle at the tip of the wood to the head, can make a Thornspeaker of a Swarmcaller once the Grove Stone is mended.' } },
  ],
  secrets: [{ x: 22, y: 9, hint: 'i5_groove' }],
  // The roost's old owls about it, its brood abroad by night; brambles on the way down to the shore,
  // and at the tip, where the paths meet and the beach runs on to the head, the rootwalkers. The old
  // wood sleeps once the tear is closed (MONSTERS §5.4); the brood stops with the roost.
  encounters: [
    { id: 'i5_keepers', x: 21, y: 7, monsters: ['great_owl', 'great_owl', 'great_owl', 'great_owl'], aware: 2, roams: false },
    { id: 'i5_brood1', x: 28, y: 11, when: { hours: 'night' }, monsters: ['great_owl', 'great_owl', 'great_owl'], aware: 5, respawn: 1440, until: ROOST_BURNT },
    { id: 'i5_brood2', x: 26, y: 15, when: { hours: 'night' }, monsters: ['great_owl', 'great_owl', 'great_owl'], aware: 5, respawn: 1440, until: ROOST_BURNT },
    { id: 'i5_brambles', x: 24, y: 11, monsters: ['bramble', 'bramble', 'bramble'], aware: 1, roams: false, until: TEAR_CLOSED, respawn: 2880 },
    { id: 'i5_rootwalkers', x: 29, y: 18, monsters: ['rootwalker', 'rootwalker', 'rootwalker'], aware: 3, until: TEAR_CLOSED, respawn: 2880 },
  ],
};
