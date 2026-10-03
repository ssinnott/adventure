// Wrackholm, box F6: the east rocks, the moor's rocky end. Core, band 13-14: heather from the moor
// at the west edge rising to a mass of rock, with the smugglers' watch in a hollow at the head of its
// one cleft (a den, kept by the Hand); open grass east to the point, the hermit's cell and the cairn
// on it; the cliff over the anchorage, cut into the south hills, and its path down to the shingle at
// the plan's 182,188, where the boats lie that row out to the Tide Ship by night (#190). Cut from the
// atlas by tools/scaffold.ts; docs/areas/wrackholm.md §4.4 is its brief.
import type { MapDef, Choice } from '../../../../game/map.ts';
import { EAST } from '../../../../game/types.ts';

const BURNT = { seen: 'wrackholm_f6:f6_watch' };

/** Merryn's question: the founder's letter carried, or not yet, put again until it is carried (#192). */
const MERRYN_ASKS: Choice = { ask: '"Will you carry it? To the hall, where it\'s owed, or to whoever will pay for it; I stopped caring which about the third year."', answers: [
  { label: 'We\'ll carry it.', sets: 'q_hermit_carried', gives: 'founders_letter', says: [
    'She takes it from inside her coat, where it has worn the shape of itself into the cloth, and gives it over without a look.',
    '"Ten years. It\'s lighter than I remember." She picks up the knife. "Go on, before I ask for it back. If the hall asks who sent it, say a woman who counts ships. They\'ll know. There was only ever one of me."',
  ] },
  { label: 'Not yet.', says: [
    '"No. Well." She cuts a stroke. "It\'s kept ten years in a coat. It\'ll keep in one a while longer. There\'s a ship in tonight, low in the water. That\'s four thousand and one."',
  ] },
] };

export const WRACKHOLM_F6: MapDef = {
  id: 'wrackholm_f6',
  name: 'Wrackholm',
  kind: 'outdoor',
  density: 'core',
  band: [13, 14],
  region: 'wrackholm',
  start: { x: 0, y: 12, facing: EAST },
  rows: [
    ',,,,,,,,,,^,,,,,,__~~~~WWWWWWWWW',
    ',,,,,,,,,,,,,,,,,,,___~~WWWWWWWW',
    ',,,,,,,,,,,,,,,,,,,,,,_~~~WWWWWW',
    ',,,,,,,,,,,,,,,,,,,,,,,_~~~WWWWW',
    ',,,,,,,,,,,,,,,,,,,,,,,,__~~WWWW',
    ',,hhhhhh,,,,,,,,,,,,,,,,,,_~~WWW',
    'hhhhhhhhhh,,rrrr,,,,,,,,,,,_~~WW',
    'hhhhhhhhhhh,rrrrrr,,,,,,,,,_~~WW',
    'hhhhhhhhhhhhrrrrrrr,,,,,,,,,_~~W',
    'hhhhhhhhhhhhrrrrrrrrr,,,,,,,_~~W',
    'hhhhhhhhhhhhrrrrrrrrr,,,,,,,,_~~',
    'hhhhhhhhhhhhrrrrrrrrrr,,,,,,,_~~',
    'hhhhhhhhhhhhhrrrrrrrrr,,,,B,,_~~',
    'hhhhhhhhhhhhhrrrrrrrrr,,,,,,rr~~',
    'hhhhhhhhhhhhhrrrr"rrrr,,,,,,S"r~',
    'hhhhhhhhhhhhhrrr"""rrr,,,,,,rr~~',
    'hhhhhhhhhhhhhhrrr"rrrrr,,,,,,^~~',
    'hhhhhhhhhhhhhhhrr"rrrrr,,,,,,,~~',
    'hhhhhhhhhhhhhhhrr"rrrr,,,,,,,,~~',
    'hhhhhhhhhhhhhh,,,,,,,,,,,,,,,~~W',
    'hhhhhhhhhhhhh,,,,,,,,,,,,,,,,~~W',
    'hhhhhhhhhhhh,,,,,,,,,,,,,,,,_~~W',
    'hhhhhhhhhhh,,,,,,,,,,,,,,,,_~~WW',
    'hhhhhhhhhhhh^^^,,,,,,,,,,,,_~~WW',
    'hhhhhhhhhhh^^^^^^,,,,,,,,,_~~WWW',
    'hhhhhhhhh,,rr^^rr,,,,,,,,_~~WWWW',
    'hhhhhhhhh,,rrr^rr,,,,,,,_~~WWWWW',
    'hhhhhh,,,,,rr^^rr,,,,,,,_~~WWWWW',
    'hhhhh,,,,,,,rr^rr,,,,,__~~WWWWWW',
    ',h,hh,,,,,,,r_^_r,,,,_~~~WWWWWWW',
    '_,,,,,,,,,,,r___r,,,_~~~WWWWWWWW',
    '~_,,,,,,,,,rr___r,,_~~WWWWWWWWWW',
  ],
  features: [
    // The way in from the moor, and the rock.
    { kind: 'event', x: 1, y: 12, id: 'f6_moor', once: true, text: 'Heather climbs east to a grey hump of rock, and the path with it, worn to peat and bearing south round the rock\'s foot.' },
    // The point: the hermit at her cell, her tally on its wall, and the cairn with the grave under it.
    // Merryn, who buried the Compact's founder and has counted the ships since (The Hermit of the
    // East Rocks, #192): she gives his last letter to a company that will carry it, to the Keel or
    // to Tallis, and asks again until one does.
    { kind: 'npc', x: 26, y: 13, name: 'Merryn, the hermit of the east rocks', flag: 'q_hermit', lines: [
      'A woman sits in the mouth of a cell cut in the rock, a knife in her hand, and cuts a stroke in a tally that runs row under row the length of the wall.',
      '"Four thousand and some. Ships. Every hull in under those cliffs since the eleventh of Frost ten years gone, and a date for each. Ask me why that date. Nobody has. The day the Old Man died, that the hall in Saltmouth still takes its orders from. A paper comes down the coast every quarter in his hand, and they read it out in the back room and do what it says. He\'s been ten years in the ground, and I put him there."',
      '"He wrote one letter at the end and gave it to me to carry, and I\'ve carried it as far as this rock. Somebody young can take it the rest of the way."',
    ],
      choice: MERRYN_ASKS,
      says: [
        { after: { flag: 'q_hermit_hall' }, lines: [
          '"The hall has it." She does not ask how you know she knows. "A boat came round the point the next night with no lamp, and somebody stood out there on the point a long while, and left a bottle. Compact rum. He\'d have laughed."',
          '"I\'ve stopped counting. There\'s nothing to count for. Four thousand and eleven, and the last one was theirs."',
        ] },
        { after: { flag: 'q_hermit_tallis' }, lines: [
          '"You sold it to the dockmaster." She cuts a stroke in the wall. "I\'d have done the same at your age, and told myself the hall would have burnt it. Maybe they would. He\'ll not burn it. He\'ll keep it in a drawer until it\'s worth more."',
          '"Four thousand and twelve. I count on. It\'s what I do."',
        ] },
        { after: { flag: 'q_hermit_carried' }, lines: [
          'She does not look up from the wall. "Go on. It\'s in your coat now, not mine. The hall, or whoever pays."',
        ] },
        { after: { flag: 'q_hermit' }, lines: [
          'Another stroke on the wall since you came. The letter is where it was.',
        ], choice: MERRYN_ASKS },
      ] },
    { kind: 'event', x: 25, y: 12, id: 'f6_tally', once: true, text: 'Strokes in fives cut in the cell wall, row under row, the last ones sharp. At the head: the 11th of Frost, 1006.' },
    { kind: 'event', x: 27, y: 14, id: 'f6_cairn', once: true, text: 'A cairn on the point beside the cell, shore stones laid close and true, long and low, and kept. The gulls do not sit on it.' },
    { kind: 'chest', x: 29, y: 14, id: 'f6_grave', gold: 150, items: ['founders_seal'] },
    { kind: 'event', x: 29, y: 14, id: 'f6_grave_seen', once: true, text: 'Under the stones a man laid out straight, his cloak gone to threads. On his breast a seal, the Compact\'s scales cut in it.' },
    // The cliff over the anchorage, and the boats below it: there by night, drawn up by day.
    { kind: 'event', x: 14, y: 24, id: 'f6_clifftop', once: true, when: { hours: 'day' }, text: 'The cliff falls sheer to the anchorage. A ship rides there, black and deep-laden, low in the water, and showing no colours.' },
    { kind: 'event', x: 13, y: 30, id: 'f6_boats', once: true, when: { hours: 'night' }, text: 'The boats are manned now, lanterns hooded to a slit, going out one behind another to the ship. No one speaks.' },
    // The way aboard the Tide Ship (#190): by night an oarsman of the boats rows out whoever pays.
    { kind: 'npc', x: 14, y: 30, name: 'Dando, an oarsman', when: { hours: 'night' }, lines: [
      'An old man sits on a thwart with his oars across his knees, salt in his beard and a Compact knot on the back of one hand, faded near to nothing. He looks at your boots, not your faces.',
      '"Dando. I row out whoever pays and I ask nothing, which is why I\'m still rowing. She rides low tonight. She always rides low, whatever they carry off her. Pay, sit, don\'t talk."',
    ],
      passage: [{ to: 'tide_ship', x: 5, y: 9, facing: EAST, name: 'The Tide Ship', by: 'boat', fare: 20, departs: 0, days: 0, arrives: 1, label: 'You sit in the boat\'s bottom while Dando rows, and come under the ship\'s side in the dark.', warning: '"Not you. Not yet. I\'ve rowed your sort out before, and rowed the boat back lighter. Come when you\'ve the look of staying."' }] },
    { kind: 'event', x: 14, y: 29, id: 'f6_shingle', once: true, when: { hours: 'day' }, text: 'Shingle at the path\'s foot, and boats drawn up on it, six, oars shipped and thwarts dry. Nobody with them. Nobody near.' },
    // The smugglers' watch in the rock, the Hand its keepers and the crew on the path its brood.
    { kind: 'den', x: 17, y: 14, id: 'f6_watch', name: 'The watch', text: 'A fire kept low under a tarred roof. Grey robes at the hollow\'s lip, watching the anchorage, and now you.',
      breeds: ['wrack_smuggler', 'wrack_bowman'], keepers: 'f6_keepers', brood: ['f6_crew'],
      ask: 'The watch is dead. Under the roof, a sack of shards giving their own light, straw for packing, and the fire still in. Burn it?', burn: 'Burn it.', leave: 'Leave it.', burnt: 'The roof goes up and the hollow with it. Below, a lantern shows on the shingle, then none. The path grows no new boot-marks.', ruin: 'A black hollow in the rock, the roof-poles fallen in. The gulls have it now, and the wind.', gold: 80, items: [] },
    // The east shore, the pools under the cliff, the camp, the shrine and the moor.
    { kind: 'event', x: 25, y: 21, id: 'f6_stores', once: true, text: 'Stores landed on the grass under tarred sailcloth, casks and long crates, and rats at them, big as cats and bold with it.' },
    { kind: 'event', x: 20, y: 28, id: 'f6_pools', once: true, text: 'Pools under the cliff, left by the tide and never warm. Weed in them, and under the weed something that keeps still as you pass.' },
    { kind: 'camp', x: 7, y: 28, name: 'The lee hollow', text: 'A hollow with the wind going over it, heather for a bed and a ring of black stones where others thought the same.' },
    { kind: 'shrine', x: 23, y: 4, id: 'f6_shrine', text: 'A ship\'s timber set upright on the shore, worn by hands and hung with cork floats. Sailors\' work, for the gulf and what it keeps.', stat: 'personality', done: 'The post, and the floats knocking on it in the wind. It owes you nothing.' },
    { kind: 'event', x: 6, y: 4, id: 'f6_north', once: true, text: 'North the heather thins to grass and the grass to the sea. Nothing past it but water and weather.' },
    { kind: 'event', x: 6, y: 18, id: 'f6_heather', once: true, text: 'Heather to the knee, and the rock standing out of it ahead, grey and seamed, gulls on its shoulders. The path keeps south.' },
    { kind: 'event', x: 22, y: 10, id: 'f6_rockfoot', once: true, text: 'The rock ends in a scree of its own pieces. East, grass runs down to a black point with one low roof on it, and smoke.' },
    { kind: 'event', x: 17, y: 20, id: 'f6_cleft', once: true, text: 'A cleft opens in the rock\'s south face, a man wide. Peat smoke in it, and boot-marks in the wet, this morning\'s, going up.' },
  ],
  secrets: [{ x: 28, y: 14, hint: 'f6_tally' }],
  // The crew on the heather path nearest the way in; the gulls on the rocks' north face; the Hand at
  // the watch, the box's hardest; the rats at the stores on the east shore; the devilfish in the
  // pools under the cliff by night, at the far end. Each at the line's standard size.
  encounters: [
    { id: 'f6_gulls', x: 14, y: 4, monsters: new Array(8).fill('wrack_gull'), aware: 4, respawn: 1440 },
    { id: 'f6_crew', x: 9, y: 20, monsters: ['wrack_smuggler', 'wrack_smuggler', 'wrack_bowman', 'wrack_bowman'], back: 2, aware: 3, respawn: 2880, until: BURNT },
    { id: 'f6_keepers', x: 17, y: 15, monsters: ['ashen_overseer', 'ashen_overseer', 'ashen_gleaner', 'ashen_gleaner'], aware: 2, roams: false },
    { id: 'f6_rats', x: 24, y: 22, monsters: new Array(8).fill('bilge_rat'), aware: 2, respawn: 1440 },
    { id: 'f6_devilfish', x: 20, y: 29, when: { hours: 'night' }, monsters: ['devilfish', 'devilfish', 'devilfish', 'devilfish'], aware: 2, roams: false, respawn: 2880 },
  ],
};
