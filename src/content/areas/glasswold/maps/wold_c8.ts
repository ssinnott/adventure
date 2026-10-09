// The Glasswold, box C8: the Scarp's edge. Country, band 26-27: the steppe's north edge, its lip the
// box's north edge, sheer over the Saltings, the pans glittering far below. The Scarp stair comes up
// through the Saltings' C7 from the notch at its foot and tops the lip at 8,0, its last flight, where a
// Compact runner gets her wind; at its head the Riders' watch, a cairn, a yurt and their fire, and two
// Riders who ask a climber's business and send it on to Akordu (D8), south and east over the grass.
// Vultures hang on the updraught at the lip's east end, a pride lies up in the grass and a basilisk
// in the hills at the box's east, the hardest at 27. A horse's prints run along the lip to a cleft
// under it, east of the stair's head, where the Compact's runners leave what the Riders will not
// take. Its way in is the stair's head; over the east edge the grass runs on into D8.
// Cut from the atlas by tools/scaffold.ts; docs/areas/glasswold.md §4.6 is its brief (#528).
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

/**
 * Orders on the Scarp Stair (#56's 54, #532): sent up the stair by Hendra, the Compact's factor at
 * Cinderport (`ORDERS_ASKED`), the company takes the runner's orders for the Riders (`ORDERS_CARRIED`)
 * and at Akordu gives them to the eldest sealed (`ORDERS_SEALED`), tells her what they say
 * (`ORDERS_TOLD`) or burns them (`ORDERS_BURNED`), when the runner climbs again.
 */
export const ORDERS_ASKED = 'q_orders', ORDERS_CARRIED = 'q_orders_carried';
export const ORDERS_SEALED = 'q_orders_sealed', ORDERS_TOLD = 'q_orders_told', ORDERS_BURNED = 'q_orders_burned';

export const WOLD_C8: MapDef = {
  id: 'wold_c8',
  name: 'The Wold',
  kind: 'outdoor',
  density: 'country',
  band: [26, 27],
  region: 'glasswold',
  start: { x: 8, y: 1, facing: SOUTH },
  // The watch's yurt is white felt, as Akordu's tents are.
  palette: { wall: '#e4dac8', wallDark: '#a89c86', door: '#5a3a24', wallStyle: 'smooth' },
  rows: [
    '||||||||"||||||||||||rrrr|||ssss',
    'sssssss::::ssssssssssr""rsssssss',
    'ssssssB::::ssssssssssrSrssssssss',
    'ssssssss:::sssssssssssssssssssss',
    'ssssssssssssssssssssssssssssssss',
    'ssssssssssssssssssssssssssssssss',
    'ssssssssssssssssssssssssssssssss',
    'ssssssssssssssssssssssssssssssss',
    'ssssssssssssssssssssssssssssssss',
    'ssssssssssssssssssssssssssssssss',
    'ssssssssssssssssssssssssssssssss',
    'ssssssssssssssssssssssssssssssss',
    'ssssssssssssssssssssssssssssssss',
    'ssssssssssssssssssssssssssssssss',
    'ssssssssssssssssssssssssssssssss',
    'ssssssssssssssssssssssssssssssss',
    'ssssssssssssssssssssssssssssssss',
    'ssssssssssssssssssssssssssssssss',
    'ssssssssssssssssssssssssssssss^^',
    'ssssssssssssssssssssssssssssss^^',
    'ssssssssssssssssssssssssssssssss',
    'ssssssssssssssssssssssssssssss^s',
    'sssssssssssssssssssssssssssss^^s',
    'sssssssssssssssssssssssssssss^^s',
    'ssssssssssssssssssssssssssss^^^s',
    'sssssssssssssssssssssssss^^^^^^^',
    'sssssssssssssssssssssssss^^^^^^^',
    'sssssssssssssssssssssss^^^^^^^^^',
    'sssssssssssssssssssssss^ss^^^^^^',
    'sssssssssssssssssssssssssss^^^^^',
    'sssssssssssssssssssssssssss^^^^^',
    'sssssssssssssssssssssssssss^^sss',
  ],
  features: [
    // The stair's last flight through the lip, and its head: the runner getting her wind, who gives up
    // her orders to a company Hendra sent (#56's 54, #532), the line the Riders give whoever climbs,
    // their watch-cairn, yurt and fire, and the two Riders, words only.
    { kind: 'npc', x: 8, y: 0, name: 'A Compact runner', lines: [
      'A runner sits on the top flight getting her wind, a satchel across her knees sealed in black wax.',
      '"Six hundred steps, and the bottom ones gone. The Dead-Drop pays by the climb, not by the step."',
      '"Orders for the Riders. They will not like them."',
    ], says: [
      { after: { flag: ORDERS_BURNED }, lines: ['The runner is on the top flight again, a new satchel across her knees.', '"Burned in the eldest\'s fire, they tell me. Now the Dead-Drop pays me to climb, and to look at faces."'] },
      { after: { flag: ORDERS_CARRIED }, lines: ['The runner rubs her knees on the top flight.', '"Six hundred steps down. Down is worse."'] },
      { after: { flag: ORDERS_ASKED }, lines: ['The runner looks at you a long moment, the satchel on her knees.', '"Hendra sent you? Then you carry them. My knees are done."'], choice: { ask: '"To the eldest at Akordu, in her hand."', answers: [
        { label: 'Take the orders.', gives: 'riders_orders', sets: ORDERS_CARRIED, says: ['She lifts the strap over her head and hands it up.', '"Do not open them. Everybody does."'] },
      ] } },
    ] },
    { kind: 'event', x: 8, y: 1, id: 'c8_line', once: true, text: 'A Rider gets up at the cairn. "This is the Wold. What hunts here kills Riders. Go back down, or go carefully."' },
    { kind: 'cairn', x: 9, y: 2, id: 'c8_cairn', text: 'The Riders\' watch-cairn at the stair\'s head, a horse\'s skull on top of it, looking down the Scarp.', gold: 200, items: ['elixir'] },
    { kind: 'npc', x: 10, y: 1, name: 'The Riders at the watch', lines: [
      'Two Riders by the yurt at the cairn, bows across their knees, their horses hobbled on the grass behind.',
      '"Nobody climbs the stair but the Compact\'s runners. What is your business on the grass?"',
      '"Take it to Akordu, south and east, where the smoke goes up. The eldest will hear it there."',
    ] },
    { kind: 'camp', x: 9, y: 3, text: 'The watch\'s fire, banked with dung, a kettle on its stones and a hide to keep the wind off.' },
    // The lip: the view down over the Saltings, the edge, and the updraught at its east end.
    { kind: 'event', x: 4, y: 1, id: 'c8_view', once: true, text: 'From the lip the Scarp drops sheer to the Saltings. Far below, the pans lie white in their walls, glittering.' },
    { kind: 'event', x: 15, y: 1, id: 'c8_lip', once: true, text: 'The grass runs to the edge and stops. A stone kicked over falls a long time before you hear it.' },
    { kind: 'event', x: 26, y: 2, id: 'c8_updraught', once: true, text: 'The wind comes up the face of the Scarp, and vultures hang on it without a wingbeat.' },
    // The secret: a horse's prints along the lip where no Rider rides, to the cleft under it, east of the
    // stair's head, where the Compact's runners leave what the Riders will not take (#56's 54).
    { kind: 'event', x: 22, y: 3, id: 'c8_prints', text: 'Hoofprints along the lip, one horse and shod, close to the edge. They come as far as this rock, and go back.' },
    { kind: 'event', x: 22, y: 1, id: 'c8_cleft', once: true, text: 'A dry cleft under the lip. Three bundles on a ledge in oilcloth, each tied with cord and sealed in black wax.' },
    { kind: 'chest', x: 23, y: 1, id: 'c8_drops', gold: 900, items: ['cipher_letter'] },
    // The grass running south and east to Akordu.
    { kind: 'event', x: 16, y: 9, id: 'c8_smoke', once: true, text: 'South and east the grass runs on and on, and far off over it the smoke of many fires goes straight up.' },
    { kind: 'event', x: 27, y: 10, id: 'c8_post', once: true, text: 'A post in the grass with a red rag on it, and far off south-east another. The Riders\' way home.' },
    { kind: 'event', x: 4, y: 12, id: 'c8_satchel', once: true, text: 'A runner\'s satchel in the grass, torn open and empty, its strap bitten through.' },
    { kind: 'event', x: 15, y: 17, id: 'c8_lie', once: true, text: 'The grass is flattened in a wide ring here, and tawny hairs cling to the stalks. Something big lay up.' },
    { kind: 'event', x: 21, y: 21, id: 'c8_skull', once: true, text: 'A lion\'s skull in the grass, an arrowhead still in the eye. Riders\' work, and old.' },
    { kind: 'event', x: 4, y: 25, id: 'c8_grazed', once: true, text: 'The grass is cropped short and the dung is fresh: the Riders\' herd grazed here, and not long ago.' },
    { kind: 'event', x: 15, y: 28, id: 'c8_glare', once: true, text: 'South over the grass a white line of dunes, and past them a glare too bright to look at.' },
    // The basilisk's hills at the box's east, and a lion that met its eyes.
    { kind: 'event', x: 25, y: 24, id: 'c8_glassed', once: true, text: 'A lion in mid-stride on the hillside, glass from nose to tail. The grass round its feet is grey.' },
  ],
  secrets: [{ x: 22, y: 2, hint: 'c8_prints' }],
  encounters: [
    // From the stair's head: the vultures on the lip's updraught, the pride at its lie in the grass with
    // vultures waiting over it, and the basilisk alone in the hills at the box's east, the hardest at 27.
    { id: 'c8_vultures', x: 27, y: 3, monsters: ['vulture', 'vulture', 'vulture', 'vulture', 'vulture', 'vulture'], aware: 3, respawn: 2880 },
    { id: 'c8_pride', x: 12, y: 19, monsters: ['wold_lion', 'wold_lion', 'wold_lion', 'wold_lion', 'vulture', 'vulture', 'vulture'], aware: 4, respawn: 2880 },
    { id: 'c8_basilisk', x: 28, y: 27, monsters: ['basilisk', 'basilisk'], aware: 5, respawn: 2880 },
  ],
};
