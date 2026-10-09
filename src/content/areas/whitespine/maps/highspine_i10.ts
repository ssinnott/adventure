// The Whitespine, box I10: Stairwatch and the Stair's head. Core, band 22-24: the ridge trail north
// from the Peak Stone along the pines' east edge; the road off it west to the Giants' Stair, past the
// giant and the snow troll in the snow on it and the caravan drawn up short of the head; the head,
// cut too regular for a road, the toll-stone, the old shrine, the king's seat and the hoard under it,
// and the Stair-king with two giants, who asks the toll before he fights; the Stair itself, cut down
// through the Sheer to the west edge, and the step below the king's, where the Whitespine's chapter
// ends (#505); Stairwatch's ledge on the rock south of the head, up a chimney behind the pines, with
// the old champion on it; the eagles and the drovers' fire in the pines.
// In from I11 (#501) walked, up the ridge trail: I11's 27,0 is this map's 27,31's neighbour, and
// nothing is said crossing between them, the same land at the same floor (#166). The trail leaves
// north at 18,0 into I9 (#503), Sheer Point's, and the Stair west at 0,20 for Ashfall's H10 (#510);
// until H10 is built the world ends past the west edge, as past the east (J10, parked).
// Cut from the atlas by tools/scaffold.ts; docs/areas/whitespine.md §4.5 is its brief.
import type { MapDef, Choice } from '../../../../game/map.ts';
import type { When } from '../../../../game/quests.ts';
import { NORTH } from '../../../../game/types.ts';

/**
 * The Stair-king's toll (#544): put before the fight, the way a business puts its menu. Paid in gold,
 * or in something from below in place of gold, and the giants stand aside for that company; refused,
 * and the fight is his and theirs. The Toll (#56's 47, #506) answers it for the caravan.
 */
export const TOLL: Choice = {
  ask: 'The king holds out his hand from the seat. "Toll. We have taken it since we were set here, and nobody has come to say stop."',
  answers: [
    { label: 'Pay the toll.', price: 1500, sets: 'toll_paid', says: ['He counts it twice into his palm. The giants step off the Stair, and stand aside.'] },
    { label: 'Give him the grey part.', takes: 'grey_part', sets: 'toll_part', says: ['He turns it over in his fingers. "From below. We were on this mountain before anyone came down the sky." He stands aside.'] },
    { label: 'Give him the faceless coin.', takes: 'faceless_coin', sets: 'toll_coin', says: ['"No face. The first coin was like this." He sets it with the oldest, and the giants stand aside.'] },
    { label: 'Refuse.', fight: true, says: ['He sighs, and stands, and goes on standing. The giants stand with him.'] },
  ],
};

/** The toll answered, in gold, a part or the coin, or the king fallen: the Stair is the company's (#505). */
export const STAIR_PASSED: When = [{ flag: 'toll_paid' }, { flag: 'toll_part' }, { flag: 'toll_coin' }, { slain: 'highspine_i10:i10_king' }];

/**
 * The Stair stood on below the king's step, looking down into the ash: `i10_top` sets it, the
 * once. The Whitespine's chapter, The Bells, is done on it, and Ashfall's (#518) reads it.
 */
export const STAIR_TOP = 'q_stair_top';

export const HIGHSPINE_I10: MapDef = {
  id: 'highspine_i10',
  name: 'The High Spine',
  kind: 'outdoor',
  density: 'core',
  band: [22, 24],
  region: 'whitespine',
  start: { x: 27, y: 30, facing: NORTH },
  rows: [
    '|ppppppppppppppppp=MMMMMAAAAAAAM',
    '|ppppppppppppppppp=pMMMMAAAAAAAM',
    '|ppppppppppppppppp==MMMMAAAAAAAM',
    '|pppppppppppppppppp=MMMMMAAAAAAA',
    '|pppppppppppppppppp=MMMMMAAAAAAA',
    '|pppppppppppppppppp=MMMMMAAAAAAA',
    '|ppppppppppppppppppM=MMMMMAAAAAA',
    '|ppppppppppppppppppp=MMMMMAAAAAA',
    '|ppppppppppppppppppp=MMMMMAAAAAA',
    '|ppppppppppppppppppp=MMMMMAAAAAA',
    '|ppppppppppppppppppp==MMMMMAAAAA',
    '|pppppppppppppppppppp=MMMMMAAAAA',
    '|pppppppppppppppppppp=MMMMMMMAAA',
    '|pppppppppppppppppppp=MMMMMMMMMA',
    '||pppppppppppppppppppp=MMMMMMMMM',
    '||pppppppppppppppppppp=MMMMMMMMM',
    '||pppppppppppppppppppp=MMMMMMAAA',
    '||rrrppppppppppppppppp==MMMMMMAA',
    '|r:rrppppppp***pppppppp=MMMMMMAA',
    '|r:rr"""pp*******pppppp=MMMMMMMA',
    '==""""""=================MMMMMMA',
    'p||"""""pp******pppppppp=pMMMMMA',
    'p||ppppppppp***ppppppppp=ppMMMMA',
    'p||ppppppppppppppppppppp==pMMMMM',
    'p||rrrSrrpppppppppppppppp=pMMMMM',
    'a||rrr:rrpppppppppppppppp=pMMMMM',
    'ap||r""rrpppppppppppppppp==pMMMM',
    'pp||rrrrpppppppppppppppppp=pMMMM',
    'pp||pppppppppppppppppppppp=MMMMM',
    'pp||pppppppppppppppppppppp==MMMM',
    'pp||ppppppppppppppppppppppM=MMMM',
    'ppp||pppppppppppppppppppppM=MMMM',
  ],
  features: [
    // The ridge trail: up from the Stone, the giants' fire on the slope above it (J10, parked), and on
    // north along the crest past the edge at 18,0, where the atlas's trail crosses, for I9 (#503).
    { kind: 'event', x: 26, y: 27, id: 'i10_trail', once: true, text: 'Above the Stone the trail climbs north between the pines and the rock, and the wind drops.' },
    { kind: 'event', x: 20, y: 9, id: 'i10_fires', once: true, text: 'Up the slope east of the trail a fire burns in the open, too big for any camp. Nobody sits at it.' },
    { kind: 'event', x: 19, y: 3, id: 'i10_north', once: true, text: 'North, the ridge trail runs on along the crest toward the Point. Nobody has walked it since the snow.' },
    { kind: 'event', x: 20, y: 16, id: 'i10_bones', once: true, text: 'Bones under the snow by the trail, too big for a bear\'s. One end of each is burnt black.' },
    // Where the road leaves the trail west for the Stair, the cairn; on the road, the caravan drawn up
    // short of the head that cannot pay (#56's 47, #506's), and the Stair in snow.
    { kind: 'cairn', x: 22, y: 21, id: 'i10_cairn', text: 'A cairn where the road leaves the ridge trail for the Stair, built of stones no man could lift.', gold: 0, items: ['potion_sp_great'] },
    { kind: 'npc', x: 18, y: 19, name: 'A caravan-master', lines: [
      'A caravan-master stamps by his wagons, his hands under his arms, watching the road to the head.',
      '"He wants more than the load is worth. And he has my girl until I pay it."',
    ] },
    { kind: 'event', x: 18, y: 21, id: 'i10_caravan', once: true, text: 'Three wagons drawn up off the road, the mules blanketed against the snow. Nothing has been unloaded.' },
    { kind: 'event', x: 12, y: 21, id: 'i10_drift', once: true, text: 'A drift lies across the road, waist-deep and smooth. The wind did not lay it.' },
    // The head: cut too regular for a road, the step's line, the toll-stone with the Stair's mark under
    // its lip, the shrine older than the monks', the caravan-master's girl, and the seat, a slab the
    // size of a house, with the hoard in the hollow under it, whose one mouth is the king's square.
    { kind: 'event', x: 7, y: 20, id: 'i10_head', once: true, text: 'A stair cut in the cliff, each step the height of a man. At its head a giant sits, and holds out his hand.' },
    // The Stair's first step below the king's square: the toll answered or the king fallen, the company
    // looks down into the ash, and the chapter is done (#505).
    { kind: 'event', x: 1, y: 20, id: 'i10_top', once: true, after: STAIR_PASSED, sets: STAIR_TOP, text: 'Below the head the Stair goes down the Sheer into the ash, step under step, further than you can see.' },
    { kind: 'event', x: 4, y: 21, id: 'i10_tollstone', once: true, text: 'The toll-stone, its top worn hollow by coin. Under its lip, cut small and sharp, a ring with a bar across it.' },
    { kind: 'shrine', x: 7, y: 21, id: 'i10_shrine', text: 'A shrine at the head, older than the monks\': a niche cut square, and in it a stone hand, held out.', stat: 'might', done: 'The old shrine at the Stair\'s head, its stone hand held out.' },
    { kind: 'npc', x: 6, y: 19, name: 'A girl', lines: [
      'A girl sits on the cut stone with her knees drawn up, a giant\'s shadow over her.',
      '"They feed me. They don\'t talk, but the old one. Only ever about the toll."',
    ] },
    { kind: 'event', x: 2, y: 19, id: 'i10_hoard_seen', once: true, text: 'Coin of Helmstow on top. Under it, coin with no face. Under that, nothing.' },
    { kind: 'chest', x: 2, y: 18, id: 'i10_hoard', gold: 1200, items: ['bear_spear+1'] },
    // Stairwatch (#448): the rock south of the head, the smoke over it, the rope's wear at the pines'
    // edge, the chimney up behind it, and on the ledge at the atlas's site the old champion's fire.
    { kind: 'event', x: 9, y: 22, id: 'i10_smoke', once: true, text: 'Smoke goes up thin from the top of the rock south of the Stair, where nothing stands.' },
    { kind: 'event', x: 6, y: 23, id: 'i10_rope', once: true, text: 'One rock at the pines\' edge is worn smooth in a band, the way a rope wears it.' },
    { kind: 'event', x: 6, y: 26, id: 'i10_ledge', once: true, text: 'A ledge high over the Stair, a fire banked in a ring of stones and every step of the Stair below it.' },
    { kind: 'npc', x: 5, y: 26, name: 'An old champion', lines: [
      'An old man in a knight\'s coat gone to rags sits by the fire, his sword across his knees.',
      '"They take it, and they stand aside, and not one of them has ever gone down. Forty years I have watched."',
    ] },
    // The pines: the giants' leavings, the Sheer's edge, the drovers' fire and the ground at its foot.
    { kind: 'event', x: 10, y: 5, id: 'i10_tracks', once: true, text: 'Tracks in the snow under the pines, each as long as a man\'s arm, going up toward the crest.' },
    { kind: 'event', x: 2, y: 3, id: 'i10_sheer', once: true, text: 'The pines stop at the Sheer. A warm wind comes up it out of Ashfall, and the snow at the edge is grey.' },
    { kind: 'event', x: 15, y: 9, id: 'i10_rubbed', once: true, text: 'A pine rubbed bare at shoulder height, as cattle rub a post. The shoulder was far above yours.' },
    { kind: 'event', x: 3, y: 12, id: 'i10_hung', once: true, text: 'A pine has gone over the Sheer, roots and all, and hangs by them over nothing.' },
    { kind: 'event', x: 12, y: 14, id: 'i10_boughs', once: true, text: 'A pine stripped of its boughs to twice a man\'s height, the stubs snapped clean.' },
    { kind: 'event', x: 8, y: 16, id: 'i10_stump', once: true, text: 'A stump as wide as a table, cut through in three strokes. The axe was not a man\'s.' },
    { kind: 'camp', x: 11, y: 28, name: 'The drovers\' fire', text: 'Back in the pines, a ring of black stones and a lean-to of boughs, where caravans wait out the toll.' },
    { kind: 'event', x: 18, y: 30, id: 'i10_snowfall', once: true, text: 'A pine lets go its load of snow behind you, all at once, and the quiet comes back.' },
    { kind: 'event', x: 0, y: 22, id: 'i10_foot', once: true, text: 'At the foot of the Sheer the ash is trodden flat, out from under the Stair and away west.' },
    { kind: 'event', x: 1, y: 29, id: 'i10_grey', once: true, text: 'Grey pines under the Sheer, their needles furred with ash. Above, the cliff goes up out of sight.' },
  ],
  secrets: [{ x: 6, y: 24, hint: 'i10_rope' }],
  encounters: [
    // Spine eagles in the pines off the trail, the nearest; on the road short of the head the Stair in
    // snow, a giant and a snow troll, the giant sweeping the front row and the troll mending unless
    // burned (MONSTERS §8.1); and at the head the Stair-king with two giants, the box's boss at 24,
    // who asks the toll before he fights. They are people, and break when he falls (#443, call 1).
    { id: 'i10_eagles', x: 17, y: 25, monsters: ['spine_eagle', 'spine_eagle', 'spine_eagle'], aware: 5, respawn: 1440 },
    { id: 'i10_stair', x: 13, y: 20, monsters: ['stair_giant', 'snow_troll'], aware: 3, respawn: 2880, roams: false },
    { id: 'i10_king', x: 2, y: 20, monsters: ['stair_king', 'stair_giant', 'stair_giant'], leader: 'stair_king', aware: 3, roams: false, choice: TOLL,
      slainText: 'The king is down. Nobody holds out a hand on the Stair now.' },
  ],
};
