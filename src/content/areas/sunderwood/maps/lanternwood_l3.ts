// Sunderwood, box L3: the Moth Wood. Country, band 15-16: Lanternwood's old forest south of the
// Watch, the river from L2's corner running south-west through it. The Lanterns' bank path comes down
// beside the river; off it the old path west to the moth shrine, where Sister Leofrun, who stayed when
// the Watch called its people up out of the depths, keeps the light and teaches the Cleric's second
// prestige (#19). Its west edge stands closed against K3; it opens north to L2 and south to L4.
// Cut from the atlas by tools/scaffold.ts; docs/areas/sunderwood.md §4.10 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const LANTERNWOOD_L3: MapDef = {
  id: 'lanternwood_l3',
  name: 'The Moth Wood',
  kind: 'outdoor',
  density: 'country',
  band: [15, 16],
  region: 'sunderwood',
  start: { x: 29, y: 0, facing: SOUTH },
  rows: [
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTtt~T',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTtt~T',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTttT~T',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTttT~T',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTttT~T',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTttT~T',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTttT~~T',
    'TTTTTTTTTTTTTTTTtttTTTTTTTttT~~T',
    'TTTTTTTTTTTTTTTTtttTTTTTTttT~~TT',
    'TTTtttttttTTTTTTTtTTTTTTTttT~~TT',
    'TTTtttttttTTTTTTTtTTTTTTttT~~TTT',
    'TTTtttttttTTTTTTTtTTTTTTttT~TTTT',
    'TTTtttttttTTTTTTTtTTTTTttT~~TTTT',
    'TTTtttttttTTTTTTTtTTTTTttT~TTTTT',
    'TTTttttttttTTTTTTtTTTTTttT~TTTTT',
    'TTTtttttttttTTTTTSTTTTttT~~TTTTT',
    'TTTTTTTTTTTtttttttttttttT~~TTTTT',
    'TTTTTTTTTTTTTTTTTTTTTTttT~TTTTTT',
    'TTTTTTTTTTTTTTTTTTTTTTttT~TTTTTT',
    'TTTTTTTTTTTTTTTTTTTTTTttT~TTTTTT',
    'TTTTTTTTTTTTTTTTTTTTTTttT~TTTTTT',
    'TTTTTTTTTTTTTTTTTTTTTTttT~TTTTTT',
    'TTTTTTTTTTTTTTTTTTTTTttT~~TTTTTT',
    'TTTTTTTTTTTTTTTTTTTTTttT~~TTTTTT',
    'TTTTTTTTTTTTTTTTTTTTTttT~TTTTTTT',
    'TTTTTTTTTTTTTTTTTTTTttT~~TTTTTTT',
    'TTTTTTTTTTTTTTTTTTTttT~~TTTTTTTT',
    'TTTTTTTTTTTTTTTTTTTttt~~ttTTTTTT',
    'TTTTTTTTTTTTTTTTTTttt~~ttTTTTTTT',
    'TTTTTTTTTTTTTTTTTttt__ttTTTTTTTT',
    'TTTTTTTTTTTTTTTTTttt~~ttTTTTTTTT',
    'TTTTTTTTTTTTTTTTttt~~ttTTTTTTTTT',
  ],
  features: [
    // The bank path down from the Watch, and the lamp fallen beside it.
    { kind: 'event', x: 29, y: 1, id: 'l3_way', once: true, text: 'The Lanterns\' bank path comes down from the Watch beside the river, its steps cut once and not since. Moth dust lies in them like flour.' },
    { kind: 'event', x: 24, y: 14, id: 'l3_lamp', once: true, text: 'A Lantern\'s wayside lamp fallen by the path, its post rotted through and the glass whole. No oil in it, and no moth dust. Nothing has come to it in years.' },
    { kind: 'cairn', x: 23, y: 17, id: 'l3_cairn', text: 'A cairn at the fork where the old path leaves the river, a flame cut on its face as on the Watch\'s. Moth dust in every cut of it, as deep as the chisel went.', gold: 180, items: ['potion_sp_great'] },
    // The moth shrine's clearing, west along the old path. Leofrun teaches the Cleric's second
    // prestige (#19; DESIGN §5): her lesson is said once to a Curate of 19, after her first words.
    { kind: 'shrine', x: 5, y: 11, id: 'l3_shrine', name: 'The moth shrine', text: 'A Lantern shrine in the clearing, its lamp a shard of the Sunder\'s glass, lit and cold. Moths sit on it thick as leaves, and not one of them burns.', resist: { element: 'fire', until: 'rest' }, done: 'The cold lamp on the shrine, the moths still on it.' },
    { kind: 'npc', x: 5, y: 12, name: 'Sister Leofrun, keeper of the moth shrine', lines: [
      'An old sister by the shrine in a habit gone green with the wood, moths on her shoulders like a mantle and two in her hair. She does not brush them off. She brushes the dust off the shard with her sleeve.',
      '"They called us up when the glass came, every lamp in the depths to the tower. I stayed. A lamp that goes up the hill takes the moths with it, and the road has enough to carry."',
      '"They do not burn at this one. I do not know why, and I have stopped asking it. They come, and they sit, and in the morning they go. Kneel if you like. The fire has not found anyone who has."',
    ], flag: 'l3_keeper_met', says: [
      { after: { flag: 'l3_keeper_met', member: { cls: 'cleric', level: 19, prestige: 1 } }, until: { flag: 'l3_keeper_lesson' }, sets: 'l3_keeper_lesson', lines: [
        'A moth lifts off her shoulder and settles on your cleric\'s hand. She watches it a while before she speaks.',
        '"Leofrun. Sister of the Watch, of the depths that were, keeper of the last lamp down here. I was a Curate once and nobody\'s Prelate, and I thought a light was for the ones on the road to see by."',
        '"It is not. It is kept for whatever comes to it: the hurt, the lost, the thing with no eyes. One lamp is enough to be seen by. This one is for the rest. Kneel at the shard, and I will show you how it is held."',
      ] },
    ], teaches: { cls: 'cleric', prestige: 2, seek: 'Sister Leofrun, keeper of the moth shrine in the clearing of the Moth Wood below Lantern Watch, can make a Prelate of a Curate.' } },
    { kind: 'event', x: 9, y: 13, id: 'l3_shrine_night', once: true, when: { hours: 'night' }, text: 'A white light stands in the clearing that does not flicker, and the moths go over your heads to it in a line. Not one comes to your lamp.' },
    { kind: 'camp', x: 4, y: 15, name: 'The shrine\'s clearing', text: 'The clearing\'s edge under the oaks, out of the shard\'s light. Moths pass over all night going in, and the sister\'s voice now and then, talking to them.' },
    // The secret: the hooks in a line north off the old path, and the lamp-house in the thicket.
    { kind: 'event', x: 17, y: 16, id: 'l3_hooks', once: true, text: 'Iron lamp-hooks grown into the oaks, one to a tree, the bark closed round them. They go north in a line into thicket where no path goes.' },
    { kind: 'event', x: 17, y: 8, id: 'l3_lamphouse', once: true, text: 'A lamp-house in the thicket, stone, its door hanging. Hooks along every wall and a lamp on none of them. In the corner a chest, the dust on it unbroken.' },
    { kind: 'chest', x: 17, y: 7, id: 'l3_lamphouse_chest', gold: 300, items: ['longsword+2'] },
  ],
  secrets: [{ x: 17, y: 15, hint: 'l3_hooks' }],
  encounters: [
    // Sunder hounds with a moth on the bank path, the gentlest; and down by the crossing two glass
    // bears, the box's group at 16.
    { id: 'l3_bank', x: 25, y: 9, monsters: ['sunder_hound', 'sunder_hound', 'lantern_moth'], aware: 4, respawn: 2880 },
    { id: 'l3_moths', x: 20, y: 27, monsters: ['deathshead', 'deathshead'], aware: 5, respawn: 1440, when: { hours: 'night' } },
  ],
};
