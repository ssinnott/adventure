// Ashfall, box F11: Old Cinder's and the Ember Stone's box. Core, band 25-26: the Waste's step, and two
// ways down. In from F10 over the north edge at F10's corner, where the Waste's road runs along the
// rocks; the Waste's rock in the north-west, a hermit in a cleft of it who counts the stokers, and a
// camp in another; Old Cinder's crater in the north-east, the town the mountain buried, its roof-ridges
// standing out of the pit, the way down at its west lip and an old Lightbearer sitting by it (#448), a
// cairn on its rim; the west lava flow from the mountain's foot at the east edge into the rock, crossed
// by a causeway of slag with a milestone at its end; and south-west the Ember Stone half-built on its
// field of cinders, its iron scaffold round it, a shrine at the field's edge and the builders' hollow in
// the rock west of it. A second flow comes in off the mountain at the east edge and runs out south.
// The crater's way is open (CRATER, #515); the Stone's is barred until the Ember Stone is built (STONE).
// Joined to F10 on the north edge and G11 on the east; the west and south edges end the world against
// E11 and F12.
// Cut from the atlas by tools/scaffold.ts; docs/areas/ashfall.md §4.6 is its brief.
import type { Exit, MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

/**
 * The way down into Old Cinder (#515): the crater's west lip, 19,4, where a roof-ridge stood until the
 * town was built, onto the buried town's first level at 8,1, facing south. Its way back up lands on
 * the lip's front, 18,4, facing west, away from the pit.
 */
export const CRATER: Exit = { x: 19, y: 4, to: 'old_cinder', tx: 8, ty: 1, tf: SOUTH, label: 'You climb down off the lip between the roofs, into a street the ash has left.' };

/**
 * The way into the Ember Stone (#516): the Stone itself, 8,24, inside its iron scaffold, onto the
 * housing's level at 8,1, facing south, which this asks #516 to give it. The Ember Stone lists it in
 * this map's exits, opens the square and drops or rewrites `f11_stone`; its way back up lands on 8,23,
 * facing north, the Stone's front between the scaffold's uprights.
 */
export const STONE: Exit = { x: 8, y: 24, to: 'ember_stone', tx: 8, ty: 1, tf: SOUTH };

export const EMBERWASTE_F11: MapDef = {
  id: 'emberwaste_f11',
  name: 'The Ember Waste',
  kind: 'outdoor',
  density: 'core',
  band: [25, 26],
  region: 'ashfall',
  start: { x: 16, y: 0, facing: SOUTH },
  rows: [
    'rrrrr=======rrraaaaaaaaaaaaaaaaa',
    'rrrrrrrrrrrrrrrraaaaavvvaaaaaaaa',
    'rrrrrrrrrrrrrrrraaaavvvvvaaaaaaa',
    'rrrrrrrrrrrrrrrraaavvBBvvvaaaaaa',
    'rrrrrrrrrrrrrrrrraaavvvvBvaaaaaM',
    'rrrrrrrrrrrrrrrrraavBBvvvvaaaaaM',
    'rrrrrrrrrrrrrrrrraaavvvBvaaaaaaM',
    'rrrrrrrrrrrrrrrraaaaavvvaaaaaaaM',
    'rrrrrrrrrrrrrrrrraaaaaaaaaaaaaaM',
    'rrrrrrrrrrrrrrraaaaaaaaaaaaaaaaM',
    'rrrrrrrrrrrrrrrrraaaaaaaaaaaaa!!',
    'rrrrrrrrrrrrrrrraaaaaaaaaaa!!!!!',
    'rrrrrr!!!!!rrrrr!!"!!!!!!!!!!!aa',
    'rrrrrrrrrr!!!!!!!!"!!!!!!!!aaaaa',
    'rrrrrrrrrrrrrrrraaaaaaaaaaaaaaaa',
    'rrrrrrrrrrrrrraraaaaaaaaaaaaaaaa',
    'rrrrrrrrrrrrrraaaaaaaaaaaaaaaaaa',
    'rrrrrrrrrrrrraaaaaaaaaaaaaaaaaaa',
    'rrrrrrrrrraaaaaaaaaaaaaaaaaaaaaa',
    'aarrrrrrrrraaaaaaaaaaaaaaaaaaaaa',
    'aaaaaarrraaaaaaaaaaaaaaaaaaaaaaa',
    'rrraaaa:::aaaaaaaaaaaaaaaaaaaaa!',
    'rrrraa:::::aaaaaaaaaaaaaaaaaaaa!',
    'raaSa::o:o::aaaaaaaaaaaaaaaaaa!!',
    'rrrr::::o::::aaaaaaaaaaaaaaaaa!a',
    'rrraa::o:o::aaaaaaaaaaaaaaaaa!!a',
    'aaaaaa:::::aaaaaaaaaaaaaaaaaa!!a',
    'aaaaaaa:::aaaaaaaaaaaaaaaaaa!!aa',
    'aaaaaaaa:aaaaaaaaaaaaaaaaaaa!!aa',
    'Maaaaaaaaaaaaaaaaaaaaaaaaaa!!aaa',
    'MMMaaaaaaaaaaaaaaaaaaaaaaaa!!aaa',
    'MMMMaaaaaaaaaaaaaaaaaaaaaaa!!aaa',
  ],
  // Down off the crater's lip into Old Cinder (#515).
  exits: [CRATER],
  features: [
    // The Waste's road along the north edge, F10's, kept to the rocks.
    { kind: 'event', x: 8, y: 0, id: 'f11_road', once: true, text: 'The road keeps to the rocks here, out of the ash. South-east over them, smoke goes up out of a crater.' },
    // Old Cinder's crater: the way down at its west lip (CRATER, #515); the old Lightbearer by it (the
    // Paladin's third is #448's); the cairn on the rim, the roof-ridges seen from the east, and the rim
    // at the atlas's mark.
    { kind: 'npc', x: 18, y: 5, name: 'An old Lightbearer', lines: [
      'An old man in a Lightbearer\'s white gone grey, sitting on the lip with his staff across his knees.',
      '"There is a lamp at the bottom of that town. It went out, and nobody went down to light it."',
      '"I am too old for the climb. I sit where I can see the way."',
    ] },
    { kind: 'cairn', x: 24, y: 1, id: 'f11_cairn', text: 'A cairn on the crater\'s rim, its stones black and light as loaves.', gold: 300, items: ['potion_sp_great'] },
    { kind: 'event', x: 22, y: 0, id: 'f11_rim', once: true, text: 'The crater\'s rim. The mountain buried a town here, and only its roofs stand out of the ash.' },
    { kind: 'event', x: 27, y: 7, id: 'f11_roofs', once: true, text: 'Roof-ridges stand out of the crater in rows, a street\'s worth. One still has its chimney.' },
    { kind: 'event', x: 29, y: 2, id: 'f11_foot', once: true, text: 'Fire Mountain\'s foot comes down to the ash here, warm under the hand. Smoke stands over it.' },
    // The Waste's rock: the hermit in a cleft of it, who counts the stokers, and a camp in another.
    { kind: 'npc', x: 15, y: 9, name: 'A hermit', lines: [
      'A hermit in a cleft of the rock. On the wall beside him, scratches in rows, rubbed out and cut again.',
      '"I count the stokers. They walk out of the mountain at dusk, and back before it is light."',
      '"Forty years I have counted them. Never one more, and never one less."',
    ] },
    { kind: 'camp', x: 10, y: 18, name: 'A cleft in the rock', text: 'A fire-ring in a cleft of the rock, out of the wind. Dung is stacked by it, dry.' },
    // The flow: the causeway of slag over it, the Stone seen from it, and the milestone at its end; the
    // flow's west end in the rock.
    { kind: 'event', x: 18, y: 11, id: 'f11_causeway', once: true, text: 'A causeway of slag over the flow, its blocks laid close. Far off south-west a Stone stands alone.' },
    { kind: 'event', x: 18, y: 14, id: 'f11_milestone', once: true, text: 'A milestone at the causeway\'s end: THE WOLD 4, CINDERPORT 4. Ash lies in the letters.' },
    { kind: 'event', x: 6, y: 12, id: 'f11_seal', once: true, text: 'The flow runs into the rock and ends against it. Where it touched, the rock has gone to glass.' },
    // The Ember Stone on its field of cinders: the step's line at the Stone's front each time, the way in
    // barred until the Ember Stone is built (STONE); the first Cinderport folk's shrine at the field's
    // edge, the carts' ruts from the causeway, and the ground ringing under the cinders.
    { kind: 'event', x: 8, y: 23, id: 'f11_stone', text: 'On a field of cinders, a Stone half-built. The scaffold round it is iron and has not rusted.' },
    { kind: 'shrine', x: 13, y: 24, id: 'f11_shrine', text: 'A shrine at the field\'s edge, the first Cinderport folk\'s: cinders heaped round a slab.', stat: 'personality', done: 'The first folk\'s shrine at the field\'s edge, its slab warm.' },
    { kind: 'event', x: 20, y: 18, id: 'f11_ruts', once: true, text: 'Ruts in the ash, set hard, run from the causeway to the south-west. Carts came this way, long ago.' },
    { kind: 'event', x: 6, y: 29, id: 'f11_floor', once: true, text: 'South of the Stone the cinders thin, and the ground under them rings hollow at a step.' },
    { kind: 'event', x: 20, y: 26, id: 'f11_tyre', once: true, text: 'A cart\'s iron tyre half-buried in the ash, its wood long gone. It has not rusted either.' },
    // The second flow, in off the mountain at the east edge and out south, and the mountain over it.
    { kind: 'event', x: 28, y: 20, id: 'f11_flow', once: true, text: 'A second flow comes down off the mountain here and runs south under its crust, smoking.' },
    { kind: 'event', x: 27, y: 14, id: 'f11_dusk', once: true, text: 'East, the mountain smokes over everything. At dusk something moves on the ash under it.' },
    { kind: 'event', x: 30, y: 29, id: 'f11_crust', once: true, text: 'By the flow lies a drake\'s cast crust, grey and whole, the shape of the beast that left it.' },
    { kind: 'event', x: 15, y: 29, id: 'f11_hooves', once: true, text: 'Hoofprints in the ash, a Rider\'s, going wide round the field of cinders and never across it.' },
    // The secret: the rock's face west of the field scored in straight lines; behind it the hollow where the
    // Stone's builders left their tools, and a coat of mail with them.
    { kind: 'event', x: 4, y: 23, id: 'f11_scored', once: true, text: 'The rock\'s face is scored here in straight lines, close and even, from the ground to over your head.' },
    { kind: 'event', x: 2, y: 23, id: 'f11_tools', once: true, text: 'A hollow in the rock, and tools laid out in it in rows: hammers, wedges, a chisel. Iron, and not rusted.' },
    { kind: 'chest', x: 1, y: 23, id: 'f11_hollow', gold: 700, items: ['chain+2'] },
  ],
  secrets: [{ x: 3, y: 23, hint: 'f11_scored' }],
  encounters: [
    // Cinder beetles on the ash below the crater, the box's gentlest, nearest the way in, and more on the
    // field's ash; ash husks out of the crater by night; a cinder drake on the flow, the hardest before the
    // Stone; and, once the Ember Stone is lit, sentries on the way back from it, the box's top, at 26.
    { id: 'f11_beetles', x: 20, y: 9, monsters: ['cinder_beetle', 'cinder_beetle', 'cinder_beetle', 'cinder_beetle'], aware: 3, respawn: 1440 },
    { id: 'f11_husks', x: 27, y: 4, monsters: ['ash_husk', 'ash_husk', 'ash_husk', 'ash_husk'], aware: 3, respawn: 1440, when: { hours: 'night' } },
    { id: 'f11_drake', x: 25, y: 12, monsters: ['cinder_drake'], aware: 5, respawn: 2880 },
    { id: 'f11_sentries', x: 14, y: 20, monsters: ['sentry', 'sentry'], aware: 4, respawn: 2880, after: { flag: 'q_ember_lit' } },
  ],
};
