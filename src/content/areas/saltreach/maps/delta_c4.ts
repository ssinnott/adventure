// The Delta, box C4: the spur to Rietum. Country, band 10-11: the Long Water's east bank between the
// Delta road (C5) and Rietum (C3), the track north up the river from the fork to the village's first
// fields, the backwater and its reed bank, a barge tied at the bank with its crew aboard, another on
// a shoal by the ford, the grass east under Kestrel Edge and a bull toad in the fields' drain. The
// barge's crew is the first that breaks when its master falls. Cut from the atlas by
// tools/scaffold.ts; docs/areas/saltreach.md §4.3 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH } from '../../../../game/types.ts';

/** Passage Paid (#56's 22) answered either way: the shoal barge's master is gone off his shoal. */
const PASSAGE_DONE = [{ flag: 'q_passage_freed' }, { flag: 'q_passage_owed' }];

export const DELTA_C4: MapDef = {
  id: 'delta_c4',
  name: 'The Delta',
  kind: 'outdoor',
  density: 'country',
  band: [10, 11],
  region: 'saltreach',
  start: { x: 7, y: 31, facing: NORTH },
  rows: [
    ',,,=ffffffffffff,,,,,,,,,,,,,,,,',
    ',,=,ffffffffffffff,,,,,,,,,,,,,,',
    ',,=,ffffffffffffffff,,,,,,,,,,,,',
    ',,=,,,,,~~~~~~~~~,,,,,,,,,,,,,,,',
    ',,=,ffffffwwwwwfff,,,,,,,,,,,,,,',
    ',,=,fffffffwwffff,,,,,,,,,,,,,,,',
    ',,=,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    ',,=,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    '_,=,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    '~_=,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    '~~=,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    'W~=_,w,,,,,,,,,,,,,,,,,,,,,,,,,,',
    'WW=~_ww,,,,,,,,,,,,,,,,,,,,,,,,,',
    'WW=~_BBBw,,,,,,,^^,,,,,,,,,,^,,^',
    'WW=~_S:Bw,,,,,,^^^^^,,,,,,,^^^^^',
    'WW=~_BBBw,,,,,,^^^^^^^,,,,,^^^^^',
    'WW==_ww,,,,,,,,^^^^^^^^^,,,^^^^^',
    'W__=_,,,,,,,,,,,^^^^^^^^,,,^^^^^',
    'W~~=,,,,,,,,,,,,,,,,^^^^,,,,,,,,',
    '~~_=,,,,,,,,,,,,,,,,,^^^,,,,,,,,',
    '~~_==,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    '~_,,=,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    '_,,,=,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    'w,ww=w,,,,,,,,,,,,,,,,,,,,,,,,,,',
    'wwwww=ww,,,,,,,,,,,,,,,,,,,,,,,,',
    'wwwww=wwwwww,w,,,,,,,,,,,,,,,,,,',
    'wwwww=wwwwwwww,,,,,,,,,,,,,,,,,,',
    'wwwwww=wwwwwwww,,,,,,,,,,,,,,,,,',
    'wwwwww=wwwwwwwwww,w,,,,,,,,,,,,,',
    'wwwwww==wwwwwwwwwww,,,,,,,,,,,,,',
    'wwwwwww=wwwwwwwwwwww,,,,,,,,,,,,',
    'wwwwwww=wwwwwwwwwwwwww,,,,,,,,,,',
  ],
  features: [
    // The track north from the fork, to Rietum's first fields; the grass east under the Edge.
    { kind: 'event', x: 5, y: 1, id: 'c4_fields', once: true, text: 'Rietum\'s first fields, drains cut through them straight as rules, and up the track the village mound, roofs and smoke.' },
    { kind: 'event', x: 28, y: 5, id: 'c4_edge', once: true, text: 'Kestrel Edge over the grass, a wall of rock, and the Salt Road cut down its face in bends, each one a shelf a cart\'s width.' },
    { kind: 'camp', x: 15, y: 7, name: 'The carters\' camp', text: 'A carters\' camp on the open grass: a ring of blackened stones, a heap of cut reed and the Edge to the east.' },
    { kind: 'shrine', x: 19, y: 15, id: 'c4_shrine', text: 'A shrine on the hill to the drowned god, a bell in its arch for the wind off the river. The bell does not ring.', stat: 'accuracy', done: 'The bell hangs still.' },
    { kind: 'cairn', x: 29, y: 15, id: 'c4_cairn', text: 'A cairn on the rise under Kestrel Edge, where the road\'s carters first see the river. Not one stone in it is round.', gold: 70, items: ['potion_heal'] },
    { kind: 'event', x: 20, y: 27, id: 'c4_fen', once: true, text: 'The grass gives out into the fen. A fence runs on into the water, post after post, until only the tops show, then nothing.' },
    // The bank: the barge tied at it, and the herons along the backwater.
    { kind: 'event', x: 3, y: 10, id: 'c4_barge', once: true, text: 'A barge tied to a stake on the bank, lamps lit in its stern. Its crew sit on the hatch and watch you, and do not call out.' },
    { kind: 'event', x: 4, y: 12, id: 'c4_herons', once: true, text: 'Herons stand in the backwater all along the bank, one every few yards, still as posts. Not one turns its head.' },
    // The secret: the one gap in the herons, and the hut there, the crews' hide.
    { kind: 'event', x: 4, y: 14, id: 'c4_gap', text: 'The one gap in the herons. A hut of reed thatch on the sand, no door to it, and the sand trodden hard to its wall.' },
    { kind: 'event', x: 5, y: 14, id: 'c4_hide', once: true, text: 'The bargemen\'s hide: cloth, a cask, a sword in oilcloth, and in the straw a shard of green glass with a light in it.' },
    { kind: 'chest', x: 6, y: 14, id: 'c4_hide_chest', gold: 140, items: ['brine_shard', 'longsword+1'] },
    // Passage Paid (#56's 22): the barge on the shoal, its hold full of people. Freed, they go ashore
    // and a crew comes up the bank after them; pushed off, the master owes the boat's fare (#177).
    { kind: 'npc', x: 1, y: 17, name: 'the master of the barge on the shoal', lines: [
      'A barge sits canted on a sand shoal in the river, its master standing on the hatch with a pole across his knees. The hold is full of people, sitting close. Those forward have bundles at their feet. Those aft have nothing, and sit very still.',
      '"Grounded, with the tide an hour off turning and my crew gone up to Rietum for drink. Every soul in that hold paid passage to Saltmouth, paid it in coin, and I\'ll not have them stood in the river to lighten her. Four backs on the quarter and she\'d float."',
      'He counts them with his eyes as he talks. His thumb moves on the pole, where a row of notches is cut in the ash, and under it a second row, shorter.',
    ], flag: 'q_passage', until: PASSAGE_DONE, choice: { ask: '"Well? She\'ll not float on talk. Put your backs to her, or stand there and watch her sit."', answers: [
      { label: 'Cut them loose.', sets: 'q_passage_freed', says: [
        'You wade out with a knife. The ropes along the stern thwart come off, and the people aft go over the side and up the bank without a word, the ones forward after them. The master does not move from the hatch.',
        '"Every crew on this water will hear of this by dark. Every one." He spits over the side. "You\'ve no idea what you\'ve cut."',
      ] },
      { label: 'Push her off.', sets: 'q_passage_owed', says: [
        'You put your backs to the quarter and the sand lets her go, and the people in the hold sway as one. He poles her out into the stream and calls back over the water.',
        '"A debt\'s a debt. The boat at Saltmouth\'s quay, the one with no name on her: tell them Hessel\'s word carries you to Wrackholm. No fare. That\'s what you\'re owed, and all of it."',
      ] },
    ] } },
    // The ford, and the eel-trapper at his traps, who heard the Stone's barge go by and knows a stroke.
    { kind: 'event', x: 1, y: 21, id: 'c4_ford', once: true, text: 'The ford, the Long Water shallow over gravel, and willows on the far bank, their feet in the river, going on west.' },
    { kind: 'npc', x: 2, y: 21, name: 'an eel-trapper at the ford', lines: [
      'An old man of the Tidefolk lifts a wicker trap out of the shallows and tips it, and three eels go into his bucket. He looks at your boots before your faces.',
      '"The barge at midsummer? Saw nothing. Heard it, which is better. Forty years on this water, and I know a poleman by his stroke the way you\'d know a man\'s walk. Whoever poled that barge was no river man. Short and choppy, like a boy on a millpond punt. The Hand\'s, not the river\'s."',
      '"The crews tie up on this bank now and sit the night, and nobody asks them why. Nobody asks the Hand anything." He drops the trap back in. "The herons have stood that backwater since my father\'s time, one to a pitch. They\'ve more right here than the barges."',
    ] },
  ],
  secrets: [{ x: 5, y: 14, hint: 'c4_gap' }],
  encounters: [
    // The barge at the bank: its master, five bargemen and two herons over the reeds, the master the
    // one to fell first. Always tied there: dusk is in its words, and the curve's top fight is no quest's.
    { id: 'c4_barge', x: 1, y: 9, monsters: ['barge_master', 'bargeman', 'bargeman', 'bargeman', 'bargeman', 'bargeman', 'grey_heron', 'grey_heron'], back: 2, leader: 'barge_master', aware: 2, roams: false, respawn: 2880 },
    // A bull toad alone in a flooded drain in Rietum's fields, the far end from the fork: the hardest.
    { id: 'c4_toad', x: 12, y: 4, monsters: ['bull_toad'], aware: 4, respawn: 1440 },
    // Passage Paid's passengers freed: a crew comes up the bank for the cargo.
    { id: 'c4_crew', x: 4, y: 18, monsters: ['bargeman', 'bargeman', 'bargeman'], aware: 3, respawn: 2880, after: { flag: 'q_passage_freed' } },
  ],
};
