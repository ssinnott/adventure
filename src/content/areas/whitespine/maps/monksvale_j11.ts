// The Whitespine, box J11: Monks' Vale. Core, band 22-23: the pass's road down from the north edge
// through the hills and the vale's grass to Highcell's gate in its wall on the shelf against the
// mountain; the cairn at the pass's foot, where the bells are first heard; the monks' shrine by the
// road and the pilgrims' hostel they keep; the crest along the west under its snow and the path up to
// Spine Summit and the hermit; the herder's fold at the vale's edge; the camp in the lee of the shelf;
// and behind the wall, the brothers' trodden line to the rock.
// In from Rimewater's K10 (#491) over the pass, taken, not walked, parked J10 lying between: K10's
// SADDLE lands on the road at 20,1, and the road's first square, 20,0, leads back (CLIMB). The gate
// at 26,24 is the way into Highcell (#500), barred until it is built (GATE). The summit's path goes on
// west over the crest at row 10 into I11 (#501), walked. The east and south edges end the world against
// K11 and J12, and the north edge against J10.
// Cut from the atlas by tools/scaffold.ts; docs/areas/whitespine.md §4.2 is its brief.
import type { Exit, MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

/**
 * The way back over the pass (#491): from the road's first square at the north edge, 20,0, across
 * parked J10's corner onto K10's 1,19, facing north, the road's last square there beside its own way
 * over. The label leaves the loch's name to the crossing line said after it (#166, #616).
 */
export const CLIMB: Exit = { x: 20, y: 0, to: 'coldmere_k10', tx: 1, ty: 19, tf: NORTH, label: 'Back up over the pass to the cold loch.' };

/**
 * The way into Highcell (#500): the gate in the monastery's north wall at 26,24, onto the dungeon's
 * first square inside its own gate, 7,1, facing south, which this asks #500 to give it. An exit leads
 * only to a built map, so Highcell lists it in this map's exits, opens the gate's square and drops
 * `j11_gate`; its way back out lands on 26,23, facing north, on the road's end before the gate.
 */
export const GATE: Exit = { x: 26, y: 24, to: 'monastery', tx: 7, ty: 1, tf: SOUTH };

export const MONKSVALE_J11: MapDef = {
  id: 'monksvale_j11',
  name: 'Monks\' Vale',
  kind: 'outdoor',
  density: 'core',
  band: [22, 23],
  region: 'whitespine',
  start: { x: 20, y: 1, facing: SOUTH },
  exits: [CLIMB],
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
    'AAAAAAAAMMMMMMMMMrrrBBBBBBBBBB,,',
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
    { kind: 'npc', x: 3, y: 10, name: 'A hermit', lines: [
      'A hermit sits in the snow at the top, wrapped in a blanket gone grey, his eyes shut.',
      '"Eleven, a gap, eleven. Every hour, day and night, and never a stroke late."',
      '"I came up here for the quiet. The bells are all that breaks it."',
    ] },
    // The herder's fold at the vale's edge, and the herder, who loses his lambs to the eagles.
    { kind: 'npc', x: 27, y: 19, name: 'A herder', lines: [
      'A herder at the gap of his fold, a crook across his knees, counting his ewes with his lips.',
      '"Two lambs this week. The eagles take them off the hill in broad day."',
      '"The brothers walk by every morning. Not one of them has ever looked at a sheep."',
    ] },
    { kind: 'event', x: 29, y: 19, id: 'j11_fold', once: true, text: 'Ewes packed close in the fold, their breath smoking. A tuft of lamb\'s wool is caught on the wall.' },
    // The monastery on its shelf: the towers over the wall, the camp in the shelf's lee, and the gate,
    // barred until Highcell is built (GATE).
    { kind: 'event', x: 29, y: 22, id: 'j11_towers', once: true, text: 'Over the monastery\'s wall stand two bell towers. Between the hours nothing moves in them.' },
    { kind: 'camp', x: 21, y: 23, name: 'The shelf\'s lee', text: 'A hollow in the lee of the shelf, out of the wind: old ash in a ring of stones.' },
    { kind: 'event', x: 26, y: 23, id: 'j11_gate', text: 'The gate stands open, and a brother stands in it. It bows, and the bow is a shape someone described to it.' },
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
  ],
};
