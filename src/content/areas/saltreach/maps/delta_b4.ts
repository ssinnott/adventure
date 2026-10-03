// The Delta, box B4: the willows' end and the fen's north end. Country, band 10-11: the Long Water
// in from the north under the heronry, the willows' last stand, and opening out into the broad water
// that runs on east into C4's backwater; the hill in the north-west with the drowned god's statue on
// its crown and the dyke-wrights' flood-store in its side; the strand on the water's shore; C4's ford
// carried across the water's foot; and the fen's north end across the south, a bull toad in it. The
// heronry is a den (#88) that breeds the river's herons. Cut from the atlas by tools/scaffold.ts;
// docs/areas/saltreach.md §4.11 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { WEST } from '../../../../game/types.ts';
import { denBurnt } from '../../../../game/dens.ts';

/** The heronry burnt: its brood stops coming back. */
const HERONRY_BURNT = denBurnt('delta_b4', 'b4_heronry');

export const DELTA_B4: MapDef = {
  id: 'delta_b4',
  name: 'The Delta',
  kind: 'outdoor',
  density: 'country',
  band: [10, 11],
  region: 'saltreach',
  start: { x: 31, y: 3, facing: WEST },
  rows: [
    ',,,,TTTTTTTT,,~~,,,,^^,,,,,,,,,,',
    ',,,,TTTT,TTT,,,~~,,,,,,,,,,,,,,,',
    ',,,,TTTT,,,,,,,___,,,,,,,,,,,,,,',
    ',,,,TTTTTTTT,,,,~~~,,,,,,,,,,,,,',
    ',,,,,,,,,,,,,,,,,~~,,,,,,,,,,,,,',
    '^^^,,,,,,,,,,,,,,,~~,,,,,,,,,,,,',
    '^^^^,,,,^,,,,,,,,,,~~,,,~~~,,,,,',
    '^^^^^^^^^,,,,,,,,,,~~~~~~~~~~,,,',
    '^^^^^^^^^,,,,,,_____~~~~WWW~~~~~',
    '^^^^^^^,,,,,,,,___~~~WWWWWWWW~~~',
    '^BBB^^,,,,,,,,,__~~~WWWWWWWWWWWW',
    '^B:B^,,,,,,,,,,_~~WWWWWWWWWWWWWW',
    '^^S^,,,,,,,,,,,__~~WWWWWWWWWWWWW',
    '^,,,,,,,,,,,,,,__~~WWWWWWWWWWWWW',
    ',,,,,,,,,,,,,,,,,,~~WWWWWWWWWWWW',
    ',,,,,,,,,,,,,,,,,,~~WWWWWWWWWWWW',
    ',,,,,,,,,,,,,,,,,,~~WWWWWWWWWWWW',
    ',^,,,,,,,,,,,,,,,,~~WWWWWWWWWWWW',
    ',^,,,,,,,,,,,,,,,,,~~WWWWWWWWWWW',
    ',,,,,www,,w,,,,,,,,,~~WWWWWWWWWW',
    ',,wwwwwwwwwww,,,,,,,~~~WWWWWWWW~',
    ',wwwwwwwwwwwwwwww,,T,~~~~~~~~~~~',
    'wwwwwwwwwwwwwwwwwwww,,__________',
    'wwwwwwwwwwwwwwwwwwwTT,,www~~~www',
    'wwwwwwwwwwwwwwwwwwwwwwwwwww~~www',
    'wwwwwwwwwwwwwwwwwwwwwwwwwww~~www',
    'wwwwwwwwwwwwwwwwwwwwwwwwwww~~~ww',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwww~~ww',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwww~~ww',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwww~~~w',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwww~~w',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwww~~w',
  ],
  features: [
    // In from C4's grass; the ford under the heronry, and the heronry itself (#88).
    { kind: 'event', x: 29, y: 3, id: 'b4_in', once: true, text: 'Grass west to the river, cropped and empty, and south of it the water opening out, broad and slow and the colour of the sky.' },
    { kind: 'event', x: 18, y: 2, id: 'b4_ford_n', once: true, text: 'The ford under the heronry, gravel showing through the river, and above it the willows, every crown of them a nest.' },
    { kind: 'den', x: 8, y: 1, id: 'b4_heronry', name: 'The heronry', text: 'The willows\' last stand, every crown a mess of sticks, a heron on each nest, and all of them turned to look.',
      breeds: ['grey_heron'], keepers: 'b4_keepers', brood: ['b4_brood'],
      ask: 'The heronry\'s birds are dead, and the nests are only sticks. Burn it?', burn: 'Burn it.', leave: 'Leave it.',
      burnt: 'The sticks go up in the crowns like beacons. The herons on the broad water lift as one and go downriver.',
      ruin: 'Black willows at the water\'s head, and not a heron in them.', gold: 100, items: ['spear+1', 'potion_heal'] },
    // The strand, and the hill over it: the god on its crown, the flood-store in its side.
    { kind: 'event', x: 16, y: 10, id: 'b4_strand', once: true, text: 'A strand of sand on the water\'s north shore, bare and raked by the wind, and the god on his hill over it, looking out.' },
    // The god's name is on the Holy Symbol's rim in the temples' sacristy, and nowhere else (#175).
    { kind: 'statue', x: 3, y: 8, id: 'b4_statue', text: 'The drowned god on the hill\'s crown, a wave held between his open hands, facing the water. His name is chiselled off the plinth. Words are cut below.', riddle: 'THEY CUT MY NAME. SAY IT.', answer: 'tijsjonger', gift: { gold: 50, stat: 'might' }, done: 'The plinth stays bare.' },
    // The secret: the dyke-wrights' flood-store, its face laid looser where the martins nest.
    { kind: 'event', x: 2, y: 13, id: 'b4_bank', text: 'The hill\'s stone facing, laid tight. In one place the stones sit looser than the rest, with mortar gone from between them, and martins nest in the gaps.' },
    { kind: 'event', x: 2, y: 12, id: 'b4_store', once: true, text: 'The dyke-wrights\' old flood-store, dug into the hill and dry still: coils of rope, a lamp and a war hammer of the kind that drives piles.' },
    { kind: 'chest', x: 2, y: 11, id: 'b4_store_chest', gold: 150, items: ['warhammer+1'] },
    // C4's ford from the far side, and the fen's north end.
    { kind: 'event', x: 21, y: 22, id: 'b4_ford_s', once: true, text: 'The eel-trapper\'s ford from the far side, sand across the water\'s foot and his traps in the shallows, and on this bank the willows.' },
    { kind: 'event', x: 12, y: 22, id: 'b4_fen', once: true, text: 'The fen\'s north end. The grass gives out into reed and black water, and the reed goes on south with no end to it.' },
    { kind: 'event', x: 9, y: 24, id: 'b4_mud', once: true, text: 'A wallow in the fen\'s edge, the mud churned and heaped, and the reed round it flattened in a ring.' },
    { kind: 'cairn', x: 16, y: 27, id: 'b4_cairn', text: 'A cairn on a hump in the fen, the one dry thing in it. The stones are heaped loose, and the top ones are not wet.', gold: 60, items: ['potion_heal'] },
  ],
  secrets: [{ x: 2, y: 12, hint: 'b4_bank' }],
  encounters: [
    // The heronry's brood on the grass by the water, back a day after they fall until it burns.
    { id: 'b4_brood', x: 23, y: 5, monsters: ['grey_heron', 'grey_heron', 'grey_heron'], aware: 5, respawn: 1440, until: HERONRY_BURNT },
    // Its keepers on the nests, the same birds in greater number.
    { id: 'b4_keepers', x: 8, y: 2, monsters: ['grey_heron', 'grey_heron', 'grey_heron', 'grey_heron', 'grey_heron'], aware: 3, roams: false },
    // A bull toad alone at the fen's north end, the farthest and the hardest.
    { id: 'b4_toad', x: 7, y: 26, monsters: ['bull_toad'], aware: 4, respawn: 1440 },
  ],
};
