// Sunderwood, box J2: the Eaves. Core, band 14-15: pines under the rim, thinning east to dead wood
// where the ground stops at the Sunder's west lip; the east road down through the pines and on
// south-east for the bridge, the pine-cutters' steading among the first glass trees, and a bear's
// cave under the rim at the north path's end.
// Cut from the atlas by tools/scaffold.ts; docs/areas/sunderwood.md §4.3 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST } from '../../../../game/types.ts';

export const EAVES_J2: MapDef = {
  id: 'eaves_j2',
  name: 'The Eaves',
  kind: 'outdoor',
  density: 'core',
  band: [14, 15],
  region: 'sunderwood',
  start: { x: 0, y: 11, facing: EAST },
  rows: [
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMM...M^^^^^^^dBdd^v',
    'MTMMMTMMMTMMMTMMSMMTTTddTddddddv',
    'TTTTTTTTTTTTTTTT:TTTTTdddTdddddv',
    'TTTTTTTTTTTTTTTT::::TTTdcdddddvv',
    'TTTTTTTTTTTTTTTTTTT:TTccccdddTvv',
    'TTttttttTTTTTTTTTTT:ddddddcdddvv',
    'TTttttttTTTTTTTTTTT:BBddddcddcdv',
    'TTttttttTTTTTTTTT::dBBdddddddddv',
    'TTttttttTTTTTTTTT:Tdddddddcdcdvv',
    'TTTttTTTTTTTT:::::TdddddddTddvvv',
    '====TTTTTTTTT:TTTTTdddddddTddvvv',
    'TTT====TTTTTT:TTTTTTTTTTTTTddvvv',
    'TTTTTT====TTT:TTTTTTTTTTTTTTdvvv',
    'TTTTTTTTt====:TTTTTTTTTTTTTTdvvv',
    'TTTTTTTTtTTT===TTTtttTTTTTTTddvv',
    'TTTTTTTTtTTTTT====tttTTTTTTTddvv',
    'TTTTTTTTtTTTTTTTT====TTTTTTTddvv',
    'TTTTTTTTtTTTTTTTTtTT===TTTTTddvv',
    'TTTTTTtttttTTTTTTtTTTT===TTTdcdv',
    'TTTTTTtttttTTTTTTtTTTTTT===Tdcdv',
    'TTTTTTtttttTTTTTTtTTTTTTTT===ddv',
    'TTTTTTtttttTTTTTTtTTTTTTTTTT==dv',
    'TTTTTTTTTTTTTTTTTtTTTTTTTTTTT===',
    'TTTTTTTTTTTTTTttttTTTTTTTTTTTTT=',
    'TTTTTTTTTTTTTTtTTTTTTTTTTTTTTTTT',
    'TTTTTTTTTTTTtttttTTTTTTTTTTTTTTT',
    'TTTTTTTTTTTTtttttTTTTTTTTTTTTTTT',
    'TTTTTTTTTTTTtttttTTTTTTTTTTTTTTT',
    'TTTTTTTTTTTTTTttTTTTTTTTTTTTTTTT',
    'TTTTTTTTTTTTTTttTTTTTTTTTTTTTTTT',
    'MMMMMMMMMMMMMMttMMMMMMMMMMMMMMMM',
  ],
  features: [
    // The road through the pines.
    { kind: 'shrine', x: 19, y: 15, id: 'j2_shrine', text: 'A wayside shrine at the road\'s bend, a cutter\'s whetstone laid on it worn to a sliver. Resin has run down its east face and set clear.', stat: 'might', done: 'The whetstone lies on the shrine, worn to a sliver.' },
    { kind: 'camp', x: 8, y: 20, name: 'The old felling', text: 'An old felling in the pines south of the road, a ring of blackened stones among the stumps. The wind goes over the top and does not come down.' },
    { kind: 'cairn', x: 14, y: 27, id: 'j2_cairn', text: 'A cairn in the pines south of the road, out of sight of it. The lowest stones have moss and the top one none: somebody still comes.', gold: 180, items: ['potion_sp_great'] },
    // The steading among the glass trees, and the cutter's word on the dog. The Family at the Glass
    // Trees (#205) is given here: Garret and Nell, until they go over the bridge to the Watch.
    { kind: 'event', x: 19, y: 8, id: 'j2_steading', once: true, until: { flag: 'q_family_gone' }, text: 'The pine-cutters\' cabin, fieldstone and turf, in a stand of pines gone half to glass. Washing hangs between two of them, a child\'s shirt on the end of the line.' },
    { kind: 'event', x: 19, y: 8, id: 'j2_cabin_shut', once: true, after: { flag: 'q_family_gone' }, text: 'The cabin, shut. Under the glass trees, a Lantern\'s grey ribbon tied round each of the two stones.' },
    { kind: 'npc', x: 22, y: 8, name: 'Garret, a pine-cutter', flag: 'q_family', until: { flag: 'q_family_gone' }, lines: [
      'A man splits pine on a block by the cabin door, the trees over him half glass. He sets the next round before he looks at you.',
      '"Garret. The Watch across the gorge says it\'s the ground, and to leave. Nell\'s wrist has gone clear as ice. My wife\'s under those trees, and the boy that came after her. I\'ll not leave them to the glass."',
      '"Dog won\'t go up the north path now. Sits at the foot and whines. Never minded the bear up there; used to go and bark at it for sport."',
    ], quest: { item: 'warding_lamp', reward: 0, setFlag: 'q_family_lit', done: [
      'Garret turns the lamp in his hands and holds it by Nell\'s wrist, and the clear skin under the blue goes dull, like breath off a pane.',
      '"That\'s it stopped. Not gone. Stopped." He hangs it from the beam over her bed. "A season\'s oil? Then in a season I\'m across that bridge with my hat in my hand, and she knows it. Clever, for a Lantern."',
      '"I\'ve nothing to pay you with but the splitting, and you\'ll not want that. Come by when you\'re passing."',
    ], after: [
      'The lamp hangs blue in the cabin door, and Garret splits pine under it. He sets the next round before he looks at you.',
      '"Nell\'s wrist does nothing, and she\'ll show you it doing it. The graves are where they were. So am I."',
      '"Dog still won\'t go up the north path. Sits at the foot and whines. Never minded the bear up there."',
    ] }, says: [
      { after: { flag: 'q_family_come' }, sets: 'q_family_gone', lines: [
        'Garret listens with the axe in his hand, and when you come to the graves he sets it down.',
        '"She\'ll say the words herself. I\'d have gone for that in the spring, if she\'d said it then. Maybe she did, and I didn\'t hear. You don\'t, at first."',
        '"Nell. Your mother\'s box and your good shoes. We\'re going over the bridge." To you: "Go on ahead and say we\'re coming, so there\'s a bed made and I don\'t have to ask for one."',
      ] },
    ] },
    { kind: 'npc', x: 23, y: 8, name: 'Nell, the cutter\'s daughter', flag: 'q_family', until: { flag: 'q_family_gone' }, lines: [
      'A girl at the cabin door with her sleeve pulled over her hand. She pushes it back for you: the wrist under it gone clear, the small bones in it like a fish in shallow water.',
      '"It doesn\'t hurt. It\'s cold, and it doesn\'t hurt. At night I hold it up to the lamp and the light goes through."',
      '"Mam\'s stone has gone clear too. You can read the letters from both sides."',
    ] },
    { kind: 'event', x: 24, y: 6, id: 'j2_graves', once: true, text: 'Two graves under the glass trees, a woman\'s and a small one. The markers have gone to glass. The names read from either side.' },
    // The secret: the dog at the north path's foot, and the cave under the rim.
    { kind: 'event', x: 19, y: 7, id: 'j2_dog', once: true, text: 'The cutters\' dog at the foot of the north path, hackles up, whining. It comes when called and goes straight back, and will not set a foot on the path.' },
    { kind: 'event', x: 16, y: 1, id: 'j2_sack', once: true, text: 'A gleaner\'s sack behind the bear\'s bed, grey hand-prints on the cloth. The shards in it give their own light. A tally, marks in fives and a word to each line: SHIP. SHIP. BELOW.' },
    { kind: 'chest', x: 16, y: 1, id: 'j2_sack_chest', gold: 250, items: ['great_axe+1'] },
    // Under the rim by the lip, the hermit; and the lip itself, the step.
    { kind: 'npc', x: 28, y: 2, name: 'A hermit', lines: [
      'A hermit under the rim in a lean-to of dead boughs. The pine beside it has knife-cuts down the trunk, the lowest at his chest.',
      '"A cut a year, where the glass has got to. The first one\'s up past the crows. This year\'s I did without stretching."',
      '"Rain goes in and never comes out. Not a sound of it hitting. Thirty years I\'ve sat here and listened for it."',
    ] },
    { kind: 'event', x: 28, y: 12, id: 'j2_rim', once: true, text: 'The wood ends in a line, and the ground with it. Across the gap the trees stand clear as glass, and the rain goes down further than you can see.' },
  ],
  secrets: [{ x: 16, y: 2, hint: 'j2_dog' }],
  encounters: [
    // The gentlest by the way in, a bear at the cave, the moths at the steading's lamp by night, and
    // on the lip by the road at the far end the hounds, the Sunder's.
    { id: 'j2_bears', x: 4, y: 7, monsters: ['pine_bear', 'pine_bear'], aware: 4, respawn: 2880 },
    { id: 'j2_cave_bears', x: 17, y: 4, monsters: ['pine_bear', 'pine_bear'], aware: 3, respawn: 2880, roams: false },
    { id: 'j2_moths', x: 22, y: 10, monsters: ['lantern_moth', 'lantern_moth', 'lantern_moth'], aware: 5, respawn: 1440, when: { hours: 'night' } },
    { id: 'j2_hounds', x: 29, y: 17, monsters: ['sunder_hound', 'sunder_hound', 'sunder_hound', 'sunder_hound', 'sunder_hound'], aware: 5, respawn: 2880 },
  ],
};
