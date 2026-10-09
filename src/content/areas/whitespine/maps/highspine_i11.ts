// The Whitespine, box I11: the Peak Stone's. Core, band 22-23: over the crest from Monks' Vale into
// the High Spine, the Peak Stone whole on its shoulder at the north edge, the bare ring round it and
// the brothers who keep it, the monks' shrine at its foot and the cairn where the ridge trail leaves
// north; the eagles' nest in the peaks above it; the snow line down the crest's flank, the pines
// below it and the camp under it; and the Sheer along the west, the lookout over Ashfall, and at its
// foot Ashfall's own grey pines, reached by a climb.
// In from J11 (#499) walked, over the crest on the summit's path: J11's 0,10 is this map's 31,10's
// neighbour, the line between them the crossing line (#166). The ridge trail leaves beside the Stone
// (28,0), at 27,0, for I10 (#502); until it is built the world ends past the north edge, as past the
// west (H11, Ashfall's) and the south (I12, parked).
// Cut from the atlas by tools/scaffold.ts; docs/areas/whitespine.md §4.4 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import type { QuestCond } from '../../../../game/quests.ts';
import { WEST } from '../../../../game/types.ts';

/** The eagles' nest opened, the Lantern's badge in it found: The Eagles' Nest begins on it (#56's 46, #506). */
export const NEST_FOUND: QuestCond = { seen: 'highspine_i11:i11_nest_bones' };
/** The badge given to the Reader at Lantern Watch, or to the brother in Highcell's first cell: either ends it. */
export const NEST_WATCH = 'q_nest_watch', NEST_CELL = 'q_nest_cell';

export const HIGHSPINE_I11: MapDef = {
  id: 'highspine_i11',
  name: 'The High Spine',
  kind: 'outdoor',
  density: 'core',
  band: [22, 23],
  region: 'whitespine',
  start: { x: 30, y: 10, facing: WEST },
  rows: [
    'ppp||ppppppppppppppppppppMM="MMM',
    'ppp||ppppppppppppppppp***Mr"""rM',
    'ppp||ppppppppppppppppp***Mr"""rM',
    'ppp||pppppppppppppppp*****""""rA',
    'ppp||ppppppppppppppppp***rSrrrrA',
    'pppp||pppppppppppppppp***r:rMAAA',
    'pppp||ppppppppppppppp***Mr:rMAAA',
    ',ppp||ppppppppppppppp***MMrMMAAA',
    'appp||pppppppppppppppp**MMMMM**A',
    'appp||pppppppppppppppp**MMMMM*AA',
    'apppp||ppppppppppppppp**********',
    'apppp||ppppppppppppppp**MMMMMMMM',
    'a,ppp||pppppppppppppp***MMMMMMMM',
    'aappp||ppppppppppppppp***MMMMMMM',
    'aappp||ppppppppppppppp**MMMMMMMM',
    'aappp||pppppppppppppp***MMMMMMMM',
    'aapppp||ppppppppppppp**MMMMMMMMM',
    'aapppp||ppppppppppppp**MMMMMAAAM',
    'a,pppp||pppppppppppp***MMMMMMAAA',
    'a,pppp||ppppppppppppp***MMMMMAAA',
    'a,pppp||ppppppppppppp***MMMMMAAA',
    ',,pppp||ppppppppppppp***MMMMMAAA',
    'a,ppppp||pppppppppppp**MMMMMMAAA',
    'a,ppppp||pppppppppppp**MMMMMMAAA',
    'a^ppppp||ppppppppppppp**MMMMMAAA',
    'aa^pppp||pppppppppppppp*MMMMMAAA',
    'aa^pppp||pppppppppppppp*MMMMMAAA',
    'a^^pppp||pppppppppppppppMMMMMMMM',
    'a^^pppp||pppppppppppppppMMMMMMMM',
    'aa^pppp||pppppppppppppppMMMMMMMM',
    'aa^^^pp||ppppppppppppppppMMMMMMM',
    'aaa^^pp||pppppppppppppppppMMMMMM',
  ],
  features: [
    // The Peak Stone at the atlas's site, whole: its words, not a drawing, as the Lodestone's are. It
    // counts toward the Hearth once a company has stood at it (src/content/stones.ts).
    { kind: 'event', x: 28, y: 0, id: 'i11_stone', once: true, text: 'The Peak Stone. Whole, and steady. The snow stops a yard short of it all the way round.' },
    // The brothers who keep it, the monks' shrine at its foot, and the cairn under 27,0, where the
    // ridge trail leaves north beside the Stone (the atlas's trail crosses the edge at 291,317).
    { kind: 'event', x: 28, y: 1, id: 'i11_keeper', once: true, text: 'A brother stands at the Stone with its hood up. Snow settles on its shoulders and does not melt.' },
    { kind: 'shrine', x: 29, y: 1, id: 'i11_shrine', text: 'A shrine of the monks\' at the Stone\'s foot: a bowl cut in the rock, and in it eleven pebbles.', stat: 'endurance', done: 'The monks\' shrine, its eleven pebbles in the bowl.' },
    { kind: 'cairn', x: 27, y: 1, id: 'i11_cairn', text: 'A cairn where the trail leaves the Stone for the ridge, north. Every stone in it is the same size.', gold: 0, items: ['potion_sp_great'] },
    // The ring's stones, seen from the gap it is entered by, every one frosted at its edge but the slab
    // at 26,4, the corner stone beside the gap; under it, the hollow.
    { kind: 'event', x: 26, y: 3, id: 'i11_frost', once: true, text: 'Every stone of the ring is frosted along its edge but one.' },
    { kind: 'event', x: 26, y: 5, id: 'i11_marker', once: true, text: 'Under the slab, a hollow. In it a Lanterns\' survey marker of brass, its lamp still lit.' },
    { kind: 'chest', x: 26, y: 6, id: 'i11_survey', gold: 300, items: ['lantern_instruments'] },
    // On the crest path, the eagles coming down out of the light, and up the spur off it their nest in
    // the peaks above the Stone (#56's 46: the badge's hand-in is #506's).
    { kind: 'event', x: 27, y: 10, id: 'i11_shadow', once: true, text: 'A shadow goes over the snow, and for a breath the light goes out of the day.' },
    { kind: 'event', x: 29, y: 8, id: 'i11_nest', once: true, text: 'The eagles\' nest, a cartload of sticks. Among the bones, smooth grey pieces and a glint of brass.' },
    { kind: 'chest', x: 30, y: 8, id: 'i11_nest_bones', gold: 0, items: ['lantern_badge', 'grey_part'] },
    // The snow line down the crest's flank, and the camp under it.
    { kind: 'event', x: 23, y: 2, id: 'i11_snowline', once: true, text: 'The pines stop along a line as if cut. Above it the snow lies smooth to the rock.' },
    { kind: 'camp', x: 20, y: 12, name: 'The last pines', text: 'Under the last pines below the snow, a ring of stones and a stack of cut wood, dry.' },
    // The pines: the Lantern's blaze on her way up, the eagles' leavings, and the range running on south.
    { kind: 'event', x: 11, y: 3, id: 'i11_hare', once: true, text: 'A hare\'s tracks cross the snow under the pines. They stop dead, a wing\'s mark either side.' },
    { kind: 'event', x: 13, y: 11, id: 'i11_blaze', once: true, text: 'A blaze cut in a pine at head height: a lamp, the Lanterns\' mark. The bark has half grown over it.' },
    { kind: 'event', x: 14, y: 19, id: 'i11_windfall', once: true, text: 'A dozen pines down together across the slope, roots in the air and snow packed in among them.' },
    { kind: 'event', x: 17, y: 27, id: 'i11_bones', once: true, text: 'Under a pine, a lamb\'s skull and a scatter of wool. Talons have scored the bark above.' },
    { kind: 'event', x: 21, y: 30, id: 'i11_range', once: true, text: 'South, the pines run on along the range under the snow, as far as you can see.' },
    // The Sheer: the lookout over Ashfall, and its edge.
    { kind: 'event', x: 6, y: 9, id: 'i11_lookout', once: true, text: 'The pines end at the Sheer and the rock drops away. Far below lies Ashfall, and Fire Mountain smoking.' },
    { kind: 'event', x: 9, y: 25, id: 'i11_edge', once: true, text: 'The pines lean out over the Sheer. A stone kicked off the edge falls a long time before it lands.' },
    // Under the Sheer, Ashfall's own ground, reached by a climb.
    { kind: 'event', x: 1, y: 5, id: 'i11_ash', once: true, text: 'Under the Sheer the pines are grey with ash, and the snow under them is grey too.' },
    { kind: 'event', x: 2, y: 15, id: 'i11_scree', once: true, text: 'Scree at the foot of the Sheer, its stones still sharp. Up the face, something is always falling.' },
    { kind: 'event', x: 2, y: 26, id: 'i11_fallen', once: true, text: 'A goat at the foot of the Sheer, fallen from the top. The ash has covered it like a sheet.' },
  ],
  secrets: [{ x: 26, y: 4, hint: 'i11_frost' }],
  encounters: [
    // Spine eagles at the nest, the nearest to the way in; brothers walking the snow line between the
    // crest path from the monastery and the Stone; eagles over the snow line south of the path; and in
    // the snow at the crest's foot to the south, the far end, the snow trolls, the box's group at 23.
    { id: 'i11_eagles_nest', x: 29, y: 9, monsters: ['spine_eagle', 'spine_eagle', 'spine_eagle', 'spine_eagle'], aware: 5, respawn: 1440, roams: false },
    { id: 'i11_brothers', x: 23, y: 5, monsters: ['brother', 'brother', 'brother', 'brother'], aware: 3, respawn: 1440 },
    { id: 'i11_eagles_snow', x: 22, y: 14, monsters: ['spine_eagle', 'spine_eagle', 'spine_eagle', 'spine_eagle'], aware: 5, respawn: 1440 },
    { id: 'i11_trolls', x: 22, y: 21, monsters: ['snow_troll', 'snow_troll'], aware: 2, respawn: 2880, roams: false },
  ],
};
