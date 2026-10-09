// Ashfall, box E10: the Ember Waste's road over the Cinder Hills to the Wold. Country, band 25-26: the
// road in off F10 over the Waste's ash, past the cinder cones and the lava flow's head at the south
// edge, up into the Hills and through their notch, where a Rider's waymark stands, and down their west
// foot onto the grass of the steppe and out over the west edge. On the crest the cairns, all facing the
// steppe, their stones standing on the rises, the sky-stone, the hermit who has looked down on the Stone's field all his life and two
// drakes over the road at the far end; and in the hills south of the notch the one cairn that looks
// back, a grave. West of the Hills the steppe, and on the road's last shoulder, once the Stone is lit,
// the end of Ashfall's chapter (#518).
// Laid whole for the Waste (#517) as the atlas cuts it, the Wold's steppe and grass with it; the Wold's
// half is #524's: beetles over from the Waste on the ash, vultures at the hills' foot circling the
// grave's hills, a camp in the hills' lee, the glare seen from the crest, a Rider on the road, the
// outriders watching and the pride in the first grass. The Wold's line is its zone row's, said where a
// Wold map is first entered (D10, #527). Joined only to F10, on its east edge; the west
// edge ends the world against D10 and the north and south edges against E9 and E11.
// Cut from the atlas by tools/scaffold.ts; docs/areas/ashfall.md §4.9 and docs/areas/glasswold.md §4.2 are its briefs.
import type { MapDef } from '../../../../game/map.ts';
import { WEST } from '../../../../game/types.ts';
import { LIT } from './ember_stone.ts';

/**
 * The road west taken once the Stone is lit: `e10_west` sets it on the Hills' last shoulder, the once,
 * and the Wold's D8 at its horse-lines (`d8_east`) for a company that rides west instead. Ashfall's
 * chapter, The Window, is done on it, and the Wold's (#531) starts on it.
 */
export const ROAD_WEST = 'q_road_west';

export const EMBERWASTE_E10: MapDef = {
  id: 'emberwaste_e10',
  name: 'The Ember Waste',
  kind: 'outdoor',
  density: 'country',
  band: [25, 26],
  region: 'ashfall',
  start: { x: 31, y: 29, facing: WEST },
  rows: [
    'sssssss^^^^^^sss,,,aaaaaaaaaaaaa',
    '^^^^^ss^^^^^^sss,,,aaaaaaaaaaaaa',
    '^^^^^^s^^^^^^sss,,,aaaaaaaaaaaaa',
    '^^^^^^s^^^^^^sss,,aaaaaaaaaaaaaa',
    '^^^r^^s^^^^^^ss,,,aaaaaaaaaaaaaa',
    '^^^^^^ss^^^^^s,,,,aaaaaaaaaaaaaa',
    '==^^^^^s^^^^^s,,,,aaaaaaaaaaaaaa',
    '^=^^^^^^^^^^^,,,,aaaaaaaaaaaaaaa',
    's==^^^^^^^^^^^,aaaaaaaaaaaaaaaaa',
    'ss==^^^^^r^^^^,aaaaaaaaaaaaaaaaa',
    'ss^===^^^^^^^^,aaaaaaaaaaaaaaaaa',
    'ss^^^==^^^^r^^,aaaaaaaaaaaaaaaaa',
    's^^^^^==s^^^^^^,aaaaaaaaaaaaaaaa',
    's^^^^^^==s^^^^^aaaaaaaaaaaaaaaaa',
    's^^^^^ss===^^^^aaaaaaaaaaaaaaaaa',
    's^^^^sssss==^^^aaaaaaaaaaaaaaaaa',
    's^^^^sssss^==^^^aaaaaaaaaaaaaaaa',
    'ss^^^sssss^^==^raaaaaaaaaaaaaaaa',
    'ss^^sssssss^^==^aaaaaaaaaaaaaaaa',
    'sssssssssss^^^==aaaaaaaaaaaaaaaa',
    'sssssssssss^^^^===aaaaaaaaaaaaaa',
    'sssssssssss^^^^^^==aaaaaaaaaaaaa',
    'sssssssssss^^^^^^a==aaaaaaaaaaaa',
    'sssssssssss^^^^^r^a==aaaaaaaaaaa',
    'ssssssssss,^^^^^^^aa===aaaaaaaaa',
    'sssssssssss^^^^^^^^aaa==aaaaaaaa',
    'sssssssssss^^^^rrrr,aaa===aaaaaa',
    'ssssssssss^^^^^r^^S,aaaaa===aaaa',
    'sssssssssss^^^^rrrr,aaaaaaa===aa',
    'ssssssssss,^r^^^^^^^aaaaaaaaa===',
    'ssssssssss,^^^^^^^^^aaaaaaaaaaa=',
    'sssssssss,,^^^^^^^^^aaa!!aaaaaaa',
  ],
  features: [
    // On the Waste's ash: the cinder cones, the wind off the hills, and at the south edge the head of
    // the lava flow that seals the Glass (#443, call 5), seen and not crossed.
    { kind: 'event', x: 25, y: 4, id: 'e10_cones', once: true, text: 'Cinder cones stand up out of the ash, knee high, each with a cold black mouth.' },
    { kind: 'event', x: 27, y: 16, id: 'e10_veils', once: true, text: 'The wind comes down off the hills and lifts the ash in long grey veils.' },
    { kind: 'event', x: 24, y: 30, id: 'e10_flow', once: true, text: 'At your feet the head of a lava flow, black and red in the cracks, running away south-west. It is hot through boots.' },
    // The notch the road takes through the Hills, and a Rider's waymark in it.
    { kind: 'event', x: 14, y: 20, id: 'e10_waymark', once: true, text: 'In the notch a Rider\'s waymark: a stone on end, a horse cut in it running west.' },
    // The crest: the cairn that gives, the cairns on every rise, the Riders' sky-stone and the hermit.
    { kind: 'cairn', x: 14, y: 16, id: 'e10_cairn', text: 'A cairn on the crest, a flat stone set in its west face, toward the steppe.', gold: 250, items: ['potion_sp_great'] },
    { kind: 'event', x: 12, y: 23, id: 'e10_cairns', once: true, text: 'A cairn on every rise of the hills, and in the west face of each a flat stone, toward the steppe.' },
    { kind: 'shrine', x: 8, y: 3, id: 'e10_shrine', text: 'A stone on the crest worn flat on top, a ring cut in it and a hole through the middle for the sky.', stat: 'accuracy', done: 'The sky-stone, rain standing in its ring.' },
    { kind: 'npc', x: 13, y: 13, name: 'A hermit', lines: [
      'A hermit in a hut of black stones on the crest, a goat on a rope by the door.',
      '"Every day of my life I have looked down on the Stone\'s field. Every day it has stood there dark."',
      '"They say it will be lit one day. I have stopped looking."',
    ] },
    // South of the notch, the cairn that looks back: a grave, its mouth among the stones.
    { kind: 'event', x: 19, y: 27, id: 'e10_back', once: true, text: 'The Hills\' cairns all look west to the steppe. This one looks back at the Stone.' },
    { kind: 'event', x: 17, y: 27, id: 'e10_rider', once: true, text: 'Under the stones a woman laid out on her saddle, a bow across her. The silver on the saddle has gone black.' },
    { kind: 'chest', x: 16, y: 27, id: 'e10_grave', gold: 700, items: ['horn_bow+2'] },
    // West of the Hills the steppe, the Wold's (#524), to the world's end for now.
    { kind: 'event', x: 1, y: 11, id: 'e10_steppe', once: true, text: 'West of the hills the steppe, flat and yellow, runs on to the sky.' },
    // The road's last square but one before the west edge, the Stone lit: the chapter is done (#518).
    { kind: 'event', x: 1, y: 6, id: 'e10_west', once: true, after: { flag: LIT }, sets: ROAD_WEST, text: 'At the Hills\' last shoulder the road goes down onto the grass. Back east, the Stone burns white on its field.' },
    { kind: 'event', x: 4, y: 21, id: 'e10_wind', once: true, text: 'The wind comes over the steppe and the grass goes down before it in waves.' },
    { kind: 'event', x: 5, y: 27, id: 'e10_hooves', once: true, text: 'Hoofprints in the grass, unshod, a great many, going north-west.' },
    // The Wold's half (#524). From the road on the ash, vultures turning over the grave's hills: its
    // second hint, seen. Under the hills' east face, out of the wind, the Riders' camp.
    { kind: 'event', x: 26, y: 26, id: 'e10_circle', once: true, text: 'Over the hills to the west vultures turn, low and slow, over one place. Nothing under them moves.' },
    { kind: 'camp', x: 17, y: 22, name: 'The Riders\' fire', text: 'Under the hills, out of the wind, a fire-pit ringed with stones and dried dung stacked by it to burn.' },
    // Over the crest the glare off the Glass; the Riders' first mark where the grass begins; a Rider
    // coming up the road and two outriders on the last rise, words only.
    { kind: 'event', x: 12, y: 18, id: 'e10_glare', once: true, text: 'From the crest, far off to the south-west, the land throws back the sun like water.' },
    { kind: 'event', x: 7, y: 14, id: 'e10_mark', once: true, text: 'Where the grass begins a cairn of the Riders\', a horse\'s skull on top of it, looking west.' },
    { kind: 'npc', x: 9, y: 13, name: 'A Rider', lines: [
      'A Rider on a dun horse coming up the road, a bow cased at her knee.',
      '"The tents are north-west, under the mesa. Akordu. Follow the hoofprints."',
      '"Mind the vultures. They come down where something is about to die."',
    ] },
    { kind: 'npc', x: 3, y: 16, name: 'Two outriders', lines: [
      'Two Riders sitting their horses on the last rise, watching the road come down. Their bows stay cased.',
      '"We watch the hills. We stop nobody."',
      '"Go on down. The grass will tell you what it thinks of you."',
    ] },
  ],
  secrets: [{ x: 18, y: 27, hint: 'e10_back' }],
  encounters: [
    // Two cinder drakes on the Hills' crest at the far end, by the road coming down to the steppe: one
    // alone is too light a fight for the gate (#517).
    { id: 'e10_drakes', x: 6, y: 9, monsters: ['cinder_drake', 'cinder_drake'], aware: 5, respawn: 2880 },
    // The Wold's half (#524), the fewest groups the gate's day passes with: cinder beetles come over from
    // the Waste, nearest the way in; the vultures at the hills' foot, the Wold's nearest, one flock; and
    // the pride in the first grass west of the Hills, the box's hardest.
    { id: 'e10_beetles', x: 27, y: 23, monsters: ['cinder_beetle', 'cinder_beetle', 'cinder_beetle', 'cinder_beetle'], aware: 3, respawn: 1440 },
    { id: 'e10_vultures', x: 21, y: 18, monsters: ['vulture', 'vulture', 'vulture', 'vulture', 'vulture', 'vulture'], aware: 5, respawn: 1440 },
    { id: 'e10_lions', x: 7, y: 23, monsters: ['wold_lion', 'wold_lion', 'wold_lion'], aware: 4, respawn: 2880 },
    // Once the Stone is lit (#449), two sentries by the road up into the Hills, the box's top at 26.
    { id: 'e10_sentries', x: 10, y: 16, monsters: ['sentry', 'sentry'], aware: 4, respawn: 2880, after: { flag: 'q_ember_lit' } },
  ],
};
