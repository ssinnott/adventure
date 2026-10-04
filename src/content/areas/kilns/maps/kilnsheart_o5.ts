// The Kilns, box O5: the Anvil Stone's box. Core, band 17-18: the cutters' track on from N5 into bare
// hills and up past the tear to the Stone on its anvil of rock, cut square on three sides; the
// cutters' sheds and the foreman's east of it, and their camp back down the track; the mountain across
// the north-west, with the stream at its corner, and the crag across the south-east, its top a lookout.
// The tear at 12,16 is the way into the Anvil Stone's Rift (#465), shut until it is built (TEAR).
// Cut from the atlas by tools/scaffold.ts; docs/areas/kilns.md §4.9 is its brief.
import type { Feature, MapDef } from '../../../../game/map.ts';
import { EAST, NORTH } from '../../../../game/types.ts';
import { SLAG } from '../../../rifts/materials.ts';

/**
 * The tear into the Anvil Stone's Rift (#465): on its square below the cut, 12,16, onto the Rift's
 * start at 7,14, facing north, which this asks #465 to give it (docs/areas/kilns.md §4.10 gives none),
 * saying the slag's words going in. A tear leads only into a built map, so the Rift puts it among
 * this map's features, opens the square and drops `o5_tear`; its way back lands on 12,15, facing
 * north, away from the tear.
 */
export const TEAR: Extract<Feature, { kind: 'rift' }> = { kind: 'rift', x: 12, y: 16, id: 'anvil_stone_way', to: 'anvil_stone', tx: 7, ty: 14, tf: NORTH, label: SLAG.enter };

export const KILNSHEART_O5: MapDef = {
  id: 'kilnsheart_o5',
  name: 'The Kilns',
  kind: 'outdoor',
  density: 'core',
  band: [17, 18],
  region: 'kilns',
  start: { x: 0, y: 24, facing: EAST },
  rows: [
    '~~^^^^^^^^MMMMMMMMMMMMMMMMM^^^^^',
    '^^^^^^^^^MMMMMMMMMMMMMMMM^^^^^^^',
    '^^^^^^^MMMMMMMMMMMMMMMM^^^^^^^^^',
    '^^^^^^MMMMMMMMMMMMMMMM^^^^^^^^^^',
    '^^^MMMMMMMMMMMMMMMM^^^^^^^^^^^^^',
    'MMMMMMMMMMMMMMM^^^^^^^^^^^^^^^^^',
    'MMMMMMMMMMMM^^^^^^^^^^^^^^^^^^^^',
    'MMMMMMMMM^^^^^^^^^^^^^^^^^^^^^^^',
    'MMMMMMM^^rrr^^^^^^^^^^^^^^^^^^^^',
    'MMMMMM^^r""S""^^BB^###^^^^^^^^^^',
    'MMMMM^^^^rrro"^^^^^D:#^^^^^^^^^^',
    'MMMM^^^^^^^"""^^BB^###^^^^^^^^^^',
    'MMM^^^^^^^^^:^^^^^^^^^^^^^^^^^^^',
    'MM^^^^^^^^^::^^^^^^^^^^^^^^^^^^^',
    'M^^^^^^^^^^:^^^^^^^^^^^^^^^^^^^^',
    '^^^^^^^^^^^:^^^^^^^^^^^^^^^^^^^^',
    '^^^^^^^^^^^:v^^^^^^^^^^^^^^^^^^^',
    '^^^^^^^^^^^:^^^^^^^^^^^^^^^^^^^^',
    '^^^^^^^^^^^:^^^^^^^^^^^^^^^^^^^^',
    ',,^^^^^^^^::^^^^^^^^^^^^^^^^^^^^',
    ',,^^^^^^^::^^^^^^^^^^^^^^^rr^^^^',
    ',,,^^^^^::^^^^^^^^^^^^^r"rrrr^^^',
    ',,,^^^^::^^^^^^^^^^rrrrr"rrrrrrr',
    ',,,^^^::^^^^^rrrrrrrrrrr"rrrrrrr',
    ':::::::^^^^^rrrrrrrrrrrrrrrrrrrr',
    ',,,,^^^^^^^^rrrrrrrrrrrrrrrrrrrr',
    ',,,,^^^^^^^^rrrrrrrrrrrrrrrrrrrr',
    ',,,,^^^^^^^^rrrrrrrrrrrrrrrrrrrr',
    ',,,,^^^^^^^^rrrrrrrrrrrrrrrrrrrr',
    ',,,,^^^^^^^^rrrrrrrrrrrrrrrrrrrr',
    ',,,,,^^^^^^^^rrrrrrrrrrrrrrrrrrr',
    ',,,,,^^^^^^^^rrrrrrrrrrrrrrrrrrr',
  ],
  features: [
    // The cutters' track in from N5, and the slag's footprints coming down onto it.
    { kind: 'event', x: 2, y: 24, id: 'o5_track', once: true, text: 'The track climbs east into bare hills, worn to the rock by sledges coming down heavy.' },
    { kind: 'event', x: 10, y: 20, id: 'o5_burnt', once: true, text: 'Footprints burnt into the turf come down off the hill onto the track, all out of one place higher up.' },
    // The tear below the cut, beside the track, shut until the Rift is built (TEAR).
    { kind: 'event', x: 11, y: 16, id: 'o5_tear', once: true, until: { flag: 'q_anvil_closed' }, text: 'Beside the track the ground is torn open, red at the bottom. Heat comes up out of it, and a slow hammering.' },
    // The thane's iron on the approach, once the Stone is taken (#434's 1).
    { kind: 'event', x: 11, y: 14, id: 'o5_post', once: true, after: { flag: 'anvil_taken' }, text: 'The thane\'s iron, ahead of you as he said: dwarves in mail by a brazier, between the track and the Stone.' },
    // The Stone on its anvil of rock: its line on the approach, its plinth and the words cut in it,
    // the saw in its last cut, and on its north face the cut that stops half way.
    { kind: 'event', x: 12, y: 12, id: 'o5_stone', once: true, until: { flag: 'q_anvil_closed' }, text: 'The Stone, on its anvil of rock, cut square on three sides. Below the cut the ground is torn open, and runs red.' },
    { kind: 'shrine', x: 12, y: 11, id: 'o5_shrine', text: 'The plinth under the Stone, cut from the anvil-rock. A hand laid on it comes away warm.', stat: 'intellect', done: 'The plinth under the Stone, warm.' },
    { kind: 'sign', x: 12, y: 11, id: 'o5_plinth', text: 'Cut in the plinth, the dwarves\' words for what holds.', read: 'KEEP WHOLE. NO CUTTING.' },
    { kind: 'event', x: 13, y: 10, id: 'o5_saw', once: true, until: { flag: 'anvil_bought' }, text: 'A two-man saw stands in the last cut on the Stone\'s east face, its blade sunk a hand deep.' },
    { kind: 'event', x: 13, y: 10, id: 'o5_saw_off', once: true, after: { flag: 'anvil_bought' }, text: 'The saws are off the Stone. The last cut stands open in its east face, a hand deep.' },
    { kind: 'event', x: 12, y: 9, id: 'o5_cut', once: true, text: 'On the Stone\'s north face every saw-cut runs through into the rock but one, which stops half way down.' },
    // The secret: under the anvil-rock's lip, the piece one cutter would not sell.
    { kind: 'event', x: 10, y: 9, id: 'o5_hollow', once: true, text: 'A hollow under the anvil-rock\'s lip. In it, wrapped in a cutter\'s apron, a piece of the Stone the size of a head.' },
    { kind: 'chest', x: 9, y: 9, id: 'o5_hollow_chest', gold: 500, items: ['anvil_shard'] },
    // The cutters' sheds east of the Stone, the foreman at his own and what he keeps in it.
    { kind: 'event', x: 15, y: 10, id: 'o5_sheds', once: true, text: 'The cutters\' sheds, shut, a wedge in every hasp. Saws hang under the eaves, the blades filed thin.' },
    { kind: 'npc', x: 18, y: 10, name: 'Reinhart, the cutters\' foreman', lines: [
      'A dwarf in a leather apron at his shed door, a file in his hand and nobody left to file for.',
      '"The others went when the ground opened. I am the foreman. Somebody minds the saws."',
      '"A piece a season, the thane said, and the Compact weighs it. Nobody has cut since."',
    ], says: [
      { after: { flag: 'anvil_bought' }, lines: ['He is taking the saws down from the eaves.', '"Word came from the hall. The saws come off. It is yours now, and what came up beside it."'] },
      { after: { flag: 'anvil_taken' }, lines: ['He keeps to his door.', '"The thane\'s iron came up the track at first light. I cut stone. I do not stand in front of mauls."'] },
    ] },
    { kind: 'chest', x: 20, y: 10, id: 'o5_shed_chest', gold: 310, items: ['cutters_hammer'] },
    // Back down the track, the cutters' camp; under the mountain, the sledge they left.
    { kind: 'camp', x: 6, y: 28, name: 'The cutters\' camp', text: 'The cutters\' camp: hearthstones in a ring and a lean-to of sledge boards, cold since the ground opened.' },
    { kind: 'event', x: 3, y: 15, id: 'o5_sledge', once: true, text: 'A sledge on its side under the mountain, a runner split and the rope cut through. Nobody came back for it.' },
    // Where the stream comes off the fell at the north-west corner, a cairn.
    { kind: 'cairn', x: 4, y: 2, id: 'o5_cairn', text: 'A cairn where the stream comes down off the fell, its stones round from the water and cold in the hand.', gold: 250, items: ['potion_sp_great'] },
    // The hills east under the rim: the thane's mark, and a spring.
    { kind: 'event', x: 27, y: 4, id: 'o5_marker', once: true, text: 'An iron post driven into the hill, a hammer and pick on its head: the thane\'s ground.' },
    { kind: 'well', x: 27, y: 14, text: 'A spring under a slab at the hill\'s foot, and a cutter\'s cup chained to the slab.' },
    // The lookout from the crag's top, west over the Stone and the tear's light.
    { kind: 'event', x: 24, y: 23, id: 'o5_lookout', once: true, when: { hours: 'day' }, text: 'From the crag the hills fall away west to the Stone on its anvil, and smoke standing up below it.' },
    { kind: 'event', x: 24, y: 23, id: 'o5_lookout_night', once: true, when: { hours: 'night' }, text: 'From the crag, below the Stone, a red light comes up out of the ground and lies on the hills.' },
  ],
  secrets: [{ x: 11, y: 9, hint: 'o5_cut' }],
  encounters: [
    // Slaglings out of the tear, on the track below and on the slope beside it, until the tear is
    // closed; the slag elder at its lip, the box's group at 18; and the thane's iron on the approach,
    // only once the Stone is taken. Neither the elder nor the Guard comes back.
    { id: 'o5_slag_low', x: 6, y: 21, monsters: ['slagling', 'slagling', 'slagling', 'slagling', 'slagling'], aware: 4, respawn: 1440, until: { flag: 'q_anvil_closed' } },
    { id: 'o5_slag_tear', x: 9, y: 17, monsters: ['slagling', 'slagling', 'slagling', 'slagling', 'slagling'], aware: 3, respawn: 1440, until: { flag: 'q_anvil_closed' } },
    { id: 'o5_elder', x: 12, y: 17, monsters: ['slag_elder'], aware: 3, roams: false },
    { id: 'o5_guard', x: 12, y: 13, monsters: ['anvil_guard', 'anvil_guard', 'anvil_guard'], aware: 3, roams: false, after: { flag: 'anvil_taken' } },
  ],
};
