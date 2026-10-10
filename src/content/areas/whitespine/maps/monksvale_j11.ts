// The Whitespine, box J11: Monks' Vale. Core, band 22-23: the pass's road down from the north edge
// through the hills and the vale's grass to Highcell's gate in its wall on the shelf against the
// mountain; the cairn at the pass's foot, where the bells are first heard; the monks' shrine by the
// road and the pilgrims' hostel they keep; the crest along the west under its snow and the path up to
// Spine Summit and the hermit; the herder's fold at the vale's edge; the camp in the lee of the shelf;
// and behind the wall, the brothers' trodden line to the rock.
// In from Rimewater's K10 (#491) over the pass, by the road across J10's corner, walked (#508): J10's
// road at 20,31 meets this map's first square at 20,0 (until J10 was laid, K10's SADDLE was taken onto
// 20,1 and 20,0 led back, CLIMB). The gate at 26,24 is the way into Highcell (#500, GATE). The summit's
// path goes on west over the crest at row 10 into I11 (#501), walked. The east edge meets K11 (#497)
// at the hills and the grass, the south edge J12 (#508) at the hills, and the north edge J10 at the
// hills and the pines either side of the road. Wenna waits by the gate on her way to the Point (I8, #504).
// Cut from the atlas by tools/scaffold.ts; docs/areas/whitespine.md §4.2 is its brief.
import type { Exit, MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';
import { WENNA_LODGE } from '../../rimewater/maps/rime_lodge.ts';
import { NEST_FOUND } from './highspine_i11.ts';

/**
 * The way into Highcell (#500): the gate in the monastery's north wall at 26,24, past the brother in
 * it, onto the upper house's first square inside, 7,1, facing south; the way back out lands on 26,23,
 * facing north, on the road's end before the gate.
 */
export const GATE: Exit = { x: 26, y: 24, to: 'monastery', tx: 7, ty: 1, tf: SOUTH,
  label: 'The gate stands open, and a brother stands in it. It bows, and the bow is a shape someone described to it.' };

/**
 * The Monk's third (#448), The Vigil: Oswin asks a company with a Windwalker of 27 to sit the night
 * with him on the summit (`VIGIL_ASKED`); by night brothers come up the path, and once they are down
 * his words at dawn set `VIGIL_KEPT`, which his teaching reads.
 */
export const VIGIL_ASKED = 'q_vigil', VIGIL_KEPT = 'q_vigil_kept';

export const MONKSVALE_J11: MapDef = {
  id: 'monksvale_j11',
  name: 'Monks\' Vale',
  kind: 'outdoor',
  density: 'core',
  band: [22, 23],
  region: 'whitespine',
  start: { x: 20, y: 1, facing: SOUTH },
  exits: [GATE],
  rows: [
    'MMMMAAAAMMMMM^^^^^,,=ppMAAAAAAMM',
    'MMMAAAAAMMMMM^^^^^^==^^MMAAAAAAM',
    'MMAAAAAAMMMMMM^^^^^=^^^MMMAAAAAA',
    'AAAAAAAAMMMMMM^^^^^=^^^^MMMAAAAM',
    'AAAAAAAAMMMMMM^^^^^=,^^^^MMMMMMM',
    'AAAAAAAAAMMMMM**^^^=,^^^^^MMMMMM',
    'AAAAAAAAAMMMMM*^^^^=,,^^^^^MMMMM',
    'AAAAAAAAAMMMMM^^^^^=,,,^^^^^MMMM',
    'AAAAAAAAAMMMMM^^^^,==,,,^^^^^MMM',
    'AAAAAAAAMMMMM^^^^^,,=,,,,^^^^MMM',
    '********MMMMM^^^^^,,=,,,,,^^^^MM',
    'MMMMMMM****MM^^^^^,,=,,,,,^^^^MM',
    'MMMMMMMMMM***^^^^^,,==,,BB,^^^^M',
    'MMMMMMMMMMMMM^^^^^,,,=,,BB,^^^^M',
    'MMMMMMMMMMMMM^^^^^,,,=,,,,,,^^^^',
    'MMMMMMMMMMMMM^^^^^,,,==,,,,,,^^^',
    'MMMMMMMAMMMMM**^^^^,,,=,,,,,,,^^',
    'MMMMMMMAMMMMMM*^^^^,,,=,,,,,,,,^',
    'MMMMMMMAAMMMMM^^^^^^,,==,,,,rrr,',
    'MMMMMMAAAMMMMMM^^^^^,,,=,,,,,,r,',
    'AAAMMAAAAAMMMMMM^^^^^,,=,,,,rrr,',
    'AAAAAAAAAAAMMMMM^^^^^,,==,,,,,,,',
    'AAAAAAAAMMMMMMMMM^^^^^,,=,,,,,,,',
    'AAAAAAAAMMMMMMMMM^^^^^,,===,,,,,',
    'AAAAAAAAMMMMMMMMMrrrBBBBBBDBBB,,',
    'AAAAAAAAMMMMMMMMMrrrBBBBBBBBBB,,',
    'AAAAAAAAMMMMMMMMMrrrBBBBBBBBBB,,',
    'AAAAAAAAMMMMMMMMMrrrBBBBBBBBBB,,',
    'MMAAAAAAAMMMMMrrrrrrBBBBBBBBBB,,',
    'MMMAAAAAAAAAMr::S*************,,',
    'MMMMMAAAAAAAMMrrrM^^^^^^^^^^^,,,',
    'MMMMAAAAAAAAMMMMMM^^^^^^^^^^^^^^',
  ],
  features: [
    // Down off the pass: the bells first heard, the cairn at its foot.
    { kind: 'event', x: 19, y: 2, id: 'j11_bells', once: true, text: 'Across the snow, bells. Eleven, with gaps between, and then eleven again.' },
    { kind: 'cairn', x: 17, y: 4, id: 'j11_cairn', text: 'A cairn at the foot of the pass. Each who comes down it alive adds a stone.', gold: 300, items: ['potion_sp_great'] },
    // The monks' shrine by the road, and the hostel they keep for the pilgrims.
    { kind: 'shrine', x: 21, y: 10, id: 'j11_shrine', text: 'A shrine of the monks\' by the road: a bell on a post, and no rope to ring it.', stat: 'personality', done: 'The monks\' shrine, its bell hanging still.' },
    { kind: 'event', x: 23, y: 13, id: 'j11_hostel', once: true, text: 'The pilgrims\' hostel, swept bare. Each bed is made with the blanket under it, and by each a bowl of snow.' },
    // The crest along the west under its snow, and the path up it to Spine Summit and the hermit.
    { kind: 'event', x: 13, y: 12, id: 'j11_path', once: true, text: 'A path goes up west into the snow on the crest, cut in steps where the rock is steep.' },
    { kind: 'event', x: 15, y: 17, id: 'j11_crest', once: true, text: 'Snow lies along the foot of the crest in long drifts, combed into ridges by the wind.' },
    { kind: 'camp', x: 4, y: 10, name: 'Spine Summit', text: 'Spine Summit: a hollow in the snow out of the wind, and the whole range below.' },
    // Oswin teaches the Monk's third (#448) for The Vigil: asked by a company with a Windwalker of 27,
    // he sits the night with it while the brothers come up the path, and at dawn his words set it done.
    { kind: 'npc', x: 3, y: 10, name: 'Oswin, the summit\'s hermit', lines: [
      'A hermit sits in the snow at the top, wrapped in a blanket gone grey, his eyes shut.',
      '"Eleven, a gap, eleven. Every hour, day and night, and never a stroke late."',
      '"I came up here for the quiet. The bells are all that breaks it."',
    ], says: [
      { after: { flag: VIGIL_KEPT }, lines: ['Oswin sits wrapped in his blanket, his eyes shut.', '"Eleven, a gap, eleven. And between them now, nothing at all."'] },
      { after: { slain: 'monksvale_j11:j11_vigil' }, sets: VIGIL_KEPT, lines: ['Dawn on the summit. Oswin opens his eyes and looks a while at what lies on the path.', '"You sat it out. Few do."'] },
      { after: { flag: VIGIL_ASKED }, lines: ['"Sit, and be still. They come up the path at night."'] },
      { after: { member: { cls: 'monk', level: 27, prestige: 2 } }, lines: ['The hermit opens one eye, and looks at your monk.', '"Every night something comes up the path to see if I still sit here. Sit with me till dawn."'], choice: { ask: '"Will you keep the vigil?"', answers: [
        { label: 'Keep it.', sets: VIGIL_ASKED, says: ['"Then sit. Do not go down to them. Let them come up."'] },
        { label: 'Not tonight.', says: ['"I will be here."'] },
      ] } },
    ], teaches: { cls: 'monk', prestige: 3, asks: 'vigil', done: { flag: VIGIL_KEPT }, seek: 'Oswin, the hermit at the top of the path above Monks\' Vale, can make an Ascendant of a Windwalker.' } },
    // The herder's fold at the vale's edge, and the herder, who loses his lambs to the eagles: he gives
    // The Eagles' Nest (#56's 46, #506), and once the nest above the Peak Stone is opened, he remembers
    // who went up the summit's path in the summer.
    { kind: 'npc', x: 27, y: 19, name: 'A herder', flag: 'q_nest', lines: [
      'A herder at the gap of his fold, a crook across his knees, counting his ewes with his lips.',
      '"Two lambs this week. The eagles take them off the hill in broad day."',
      '"The brothers walk by every morning. Not one of them has ever looked at a sheep."',
    ], says: [
      { after: NEST_FOUND, lines: ['The herder at the gap of his fold, counting.', '"A Lantern came up the vale in the summer with a glass and a chain, for the Stone. I told him the eagles were bad up there."'] },
    ] },
    { kind: 'event', x: 29, y: 19, id: 'j11_fold', once: true, text: 'Ewes packed close in the fold, their breath smoking. A tuft of lamb\'s wool is caught on the wall.' },
    // The monastery on its shelf: the towers over the wall and the camp in the shelf's lee; the gate,
    // the way into Highcell, is GATE.
    { kind: 'event', x: 29, y: 22, id: 'j11_towers', once: true, text: 'Over the monastery\'s wall stand two bell towers. Between the hours nothing moves in them.' },
    { kind: 'camp', x: 21, y: 23, name: 'The shelf\'s lee', text: 'A hollow in the lee of the shelf, out of the wind: old ash in a ring of stones.' },
    // Wenna at the gate, a person who moves (#76; §9's 2): here once the company has come into the range
    // after she spoke at the lodge (Rimewater's `WENNA_LODGE`), until it reaches the Point, where she
    // waits at the camp on the shore (I8, #504).
    { kind: 'npc', x: 27, y: 23, name: 'The girl out of the hole', after: { flag: WENNA_LODGE, visited: 'monksvale_j11' }, until: { visited: 'sheerpoint_i8' }, lines: [
      'The girl out of the hole, by the monastery\'s gate in her lodge blanket, her feet bound in rags.',
      '"The ones I left below came this way, walking. I\'m going on to the sea. Find me at the Point."',
    ] },
    // Behind the wall, the brothers' trodden line to the rock, and the store cut into it.
    { kind: 'event', x: 29, y: 29, id: 'j11_trodden', once: true, text: 'Behind the wall the snow is trodden in one straight line west to the rock. No print turns off it.' },
    { kind: 'event', x: 29, y: 29, id: 'j11_walker', once: true, when: { hours: 'night' }, text: 'A brother walks the trodden line toward the rock, setting its feet in the old prints.' },
    { kind: 'event', x: 15, y: 29, id: 'j11_robes', once: true, text: 'Cut into the rock, a store: Highcell\'s robes folded by the dozen, and the gear of the monks who wore them first.' },
    { kind: 'chest', x: 14, y: 29, id: 'j11_store', gold: 400, items: ['guides_staff+1'] },
  ],
  secrets: [{ x: 16, y: 29, hint: 'j11_trodden' }],
  encounters: [
    // Brothers walking the road to the gate, the gentlest at the pass's foot; spine eagles over the
    // hills either side of it; and on the summit's path, the far end from the pass, the snow trolls,
    // the box's group at 23.
    { id: 'j11_brothers_foot', x: 19, y: 6, monsters: ['brother', 'brother', 'brother'], aware: 3, respawn: 1440 },
    { id: 'j11_eagles_west', x: 15, y: 9, monsters: ['spine_eagle', 'spine_eagle', 'spine_eagle', 'spine_eagle'], aware: 5, respawn: 1440 },
    { id: 'j11_eagles_east', x: 25, y: 8, monsters: ['spine_eagle', 'spine_eagle', 'spine_eagle', 'spine_eagle'], aware: 5, respawn: 1440 },
    { id: 'j11_brothers_road', x: 23, y: 19, monsters: ['brother', 'brother', 'brother', 'brother'], aware: 3, respawn: 1440 },
    { id: 'j11_trolls', x: 6, y: 10, monsters: ['snow_troll', 'snow_troll'], aware: 2, respawn: 2880, roams: false },
    // The Vigil (#448): once Oswin is answered, by night five brothers come up the path to the summit's
    // camp, and never again once they are down. The Monk's third's fight, set at 26 with the vale's own
    // brothers (§9, #448's 2).
    { id: 'j11_vigil', x: 5, y: 10, monsters: ['brother', 'brother', 'brother', 'brother', 'brother'], aware: 2, roams: false, after: { flag: VIGIL_ASKED }, when: { hours: 'night' },
      slainText: 'The last brother falls on the path. Its hood has come away, and the face under it is grey plate.' },
  ],
};
