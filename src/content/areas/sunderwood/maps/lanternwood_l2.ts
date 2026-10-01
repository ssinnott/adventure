// Sunderwood, box L2: Lantern Watch's box. Core, band 15-16: Lanternwood's old forest east of the
// gorge, the east road on from the rope bridge (K2) past the Lanterns' watchtower and out south-east
// for M2. The tower's gate at 12,16 is the way into Lantern Watch (#201); two
// wayside lamps on the road, one lit and one dark; the knoll in the north-west with the Watch's old
// signal fire on its crown; the moths to the lamps by night; and the river from the rim at the box's
// corner, where the road leaves.
// Cut from the atlas by hand, its rim's pine drawn as forest (tools/scaffold.ts has no character for
// pine); docs/areas/sunderwood.md §4.7 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST, NORTH } from '../../../../game/types.ts';

export const LANTERNWOOD_L2: MapDef = {
  id: 'lanternwood_l2',
  name: 'Lanternwood',
  kind: 'outdoor',
  density: 'core',
  band: [15, 16],
  region: 'sunderwood',
  start: { x: 0, y: 22, facing: EAST },
  rows: [
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTM',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTM',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTM',
    'TTT^T:T^TTTTTTTTTTTTTTTTTTTTTTTM',
    'TT^^^S^^TTTTTTTTTTTTTTTTTTTTTTTM',
    'TT^^^^^^TTTTTTTTTTTTTTTTTtttTTTM',
    'TT^^^^^^TTTTTTTTTTTTTTTTTtttTTTM',
    'TT^^^^^^TtttttttttTTTTTTTtttTTTM',
    'TT^^^^^^TtttttttttttttttttttTTTM',
    'TT^^^^^^TtBBBBBtttTTTTTTTTTTTTTM',
    'TTTTtttTTtBBBBBtttTTTTTTTTTTTTTM',
    'TTTTtttTTtBBBBBtttTTTTTTTTTTTTTM',
    'TTTTTtTTTtBBBBBtttTTTTTTTTTTTTTM',
    'TTTTTtTTTtBBBBBtttTTTTTTTTTTTTTM',
    'TTTTTtTTTtBBBBBtttTTTTTTTTTTTTTM',
    'TTTTTtTTTtBB=BBtttTTTTTTTTTTTTTM',
    'TTTTTtTTTttt=tttttTTTTTTTTTTTTTM',
    'TTTTTtTTTttt=tttttTTTTTTTTTTTTTM',
    'TTTTTtTTTttt=tttttTTTTTTTTTTTTTM',
    'TTTTTtTTTttt=tttttTTTTTTTTTTTTTM',
    'Tttttttttttt=tttttTTTTTTTTTTTTTM',
    '================ttttTTTTTTTTTTTM',
    'Ttttttttttttttt====ttttTTTTTTTTM',
    'TTTTTTTTTTTTTTtttt====tttTTTTTTM',
    'TTTTTTTTTTTTTTTTTtttt===tttTTT~M',
    'TTTTTTTTTTTTTTTTTTTTttt===tttT~M',
    'TTTTTTTTTTTTTTTTTTTtttttt===tt~M',
    'TTTTTTTTTTTTTTTTTTTtttttttt===~M',
    'TTTTTTTTTTTTTTTTTTTtttttTTttt=~M',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTt===',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
  ],
  exits: [
    { x: 12, y: 16, to: 'lantern_watch', tx: 7, ty: 14, tf: NORTH, label: 'You go in under the gate, through the moth dust on the step, into the Watch\'s yard.' },
  ],
  features: [
    // The road in off the bridge, and the lit lamp by it.
    { kind: 'event', x: 4, y: 22, id: 'l2_lamp_day', once: true, when: { hours: 'day' }, text: 'A Lantern\'s wayside lamp by the road, lit though it is day, the glass gone grey with moth dust. Down the road its twin stands dark.' },
    { kind: 'event', x: 4, y: 22, id: 'l2_lamp_night', once: true, when: { hours: 'night' }, text: 'A Lantern\'s wayside lamp, lit, and moths at it thick as snow. Down the road its twin stands dark, and nothing comes to it.' },
    // The knoll, the Watch's old signal fire on its crown, and the lookout west over the gorge.
    { kind: 'event', x: 5, y: 10, id: 'l2_knoll', once: true, text: 'The knoll\'s crown, bare, and on it the signal fire\'s ring of stones, the rain standing in it.' },
    { kind: 'event', x: 2, y: 7, id: 'l2_lookout', once: true, text: 'The gorge from the east: the bridge a thread across it, glass trees on both lips. South, where the fall was, a wet line down the rock and no sound from it.' },
    // The secret: the ash raked flat, and under it the letter.
    { kind: 'event', x: 5, y: 6, id: 'l2_ash', once: true, text: 'The signal fire\'s ash, cold, and raked flat with more care than ash is owed.' },
    { kind: 'event', x: 5, y: 4, id: 'l2_letter', once: true, text: 'Under the ash a pit, a staff and a letter in oilcloth. A Reader at Helmstow: papers are coming that are not what they are stamped. Read them with the door shut, the prior out.' },
    { kind: 'chest', x: 5, y: 4, id: 'l2_letter_chest', gold: 250, items: ['lanterns_staff'] },
    // The tower: its gate, the way into Lantern Watch (#201), and the shrine in its yard.
    { kind: 'event', x: 12, y: 17, id: 'l2_gate', when: { hours: 'day' }, text: 'The road ends at the tower\'s gate, and the gate stands open. Over it the tower goes up into the rain, one lamp at the top lit in broad day.' },
    { kind: 'event', x: 12, y: 17, id: 'l2_gate_night', when: { hours: 'night' }, text: 'The road ends at the tower\'s gate, and the gate stands open. Over it the tower goes up into the night, one lamp at the top lit and the moths going round it.' },
    { kind: 'shrine', x: 10, y: 9, id: 'l2_shrine', text: 'A Lanterns\' shrine in the tower\'s yard, a book cut in its face, the pages open and the words gone to rain. A moth sits on it in the wet and does not move.', stat: 'intellect', done: 'The book on the shrine, its page worn blank.' },
    // North-east of the yard, the cairn.
    { kind: 'cairn', x: 26, y: 6, id: 'l2_cairn', text: 'A cairn where the path gives out among the oaks, the stones mossed on their north faces only. One has a flame cut in it, half grown over.', gold: 180, items: ['potion_sp_great'] },
    // Down the road, the dark lamp and the young sister by it.
    { kind: 'event', x: 17, y: 23, id: 'l2_lamp_dark', once: true, text: 'The dark lamp. Its glass is clean, the wick trimmed, and there is no oil in it. Not a grain of moth dust on it.' },
    { kind: 'npc', x: 17, y: 22, name: 'A young sister of the Watch', lines: [
      'A young woman in the Watch\'s habit by the dark lamp, wet to the skin, an oil can at her feet with the stopper still in.',
      '"The prior says one lamp on this road is enough, and it will be his. The moths agree with him. The moths agree with any light."',
      '"If the prior asks, I burnt it on the knoll. The fire there draws badly in rain."',
    ] },
    // The camp south of the road.
    { kind: 'camp', x: 21, y: 28, name: 'The brothers\' clearing', text: 'A clearing south of the road, the stumps cut low and square, the Watch\'s work. The oaks meet over it, and the rain comes through late and in drops.' },
  ],
  secrets: [{ x: 5, y: 5, hint: 'l2_ash' }],
  encounters: [
    // Moths to the lit lamp by night, a deathshead among them; sunder hounds on the knoll's path; two
    // deathsheads at the tower's lamp by night, the box's group at 16; and two glass bears on the road
    // on by the river, where it leaves for M2.
    { id: 'l2_lamp_moths', x: 4, y: 23, monsters: ['lantern_moth', 'lantern_moth', 'lantern_moth', 'lantern_moth', 'deathshead'], aware: 5, respawn: 1440, when: { hours: 'night' } },
    { id: 'l2_hounds', x: 5, y: 15, monsters: ['sunder_hound', 'sunder_hound', 'sunder_hound'], aware: 4, respawn: 2880 },
    { id: 'l2_tower_moths', x: 16, y: 11, monsters: ['deathshead', 'deathshead'], aware: 5, respawn: 1440, when: { hours: 'night' } },
    { id: 'l2_bears', x: 29, y: 29, monsters: ['glass_bear', 'glass_bear'], aware: 5, respawn: 2880, roams: false },
  ],
};
