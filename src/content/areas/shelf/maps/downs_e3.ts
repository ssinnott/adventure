// Callow Downs, box E3: Crowness. Core, band 3-4: the Salt Road west along the coast from Gullwick to
// the corner of D3, the gibbet above the rocks, and Crowness Light on the point, with the keeper's
// cottage under it and the rocks below, where the wreckers show their own light. The stubble in the
// north-east corner, across the Wend from Gullwick, is left for Ashcombe (#87). Cut from the atlas by
// tools/scaffold.ts; docs/areas/shelf.md §4.4 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { WEST } from '../../../../game/types.ts';

export const DOWNS_E3: MapDef = {
  id: 'downs_e3',
  name: 'Callow Downs',
  kind: 'outdoor',
  density: 'core',
  band: [3, 4],
  start: { x: 31, y: 10, facing: WEST },
  rows: [
    ',,,,,,,,,,,fffffffffffffffff~fff',
    ',,,,,,,,,,,fffffffffffffffff~~ff',
    ',,,TT,,,,,,,,fffffffffffffffff=f',
    ',,TTTT,,,,,,,,ffffffffffffffff~~',
    ',,,TT,,,,,,,,,^,fffffffffffffff~',
    ',,,,,,,,,,,,^^,,,ffffffffffffffr',
    ',,,,,,,,,,,^^^,,,,,ffffffffffffr',
    ',,,,,,,,,,,^^^,,,,,,,,,,fffffffr',
    ',,,,,,,,,,,,,,,,,,,,,,,,,ffffffr',
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,,fffr',
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,=',
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,===',
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,,==,r',
    ',,,,,,,,,,,,,,,,,,,,,,,,,,==,,rr',
    ',,,,,,,,,,,,,,,,,,,,,,,,===,,,rr',
    ',,,,,,,,,,,,,,,,,,,,,,,==,,,,,,r',
    ',,,,,,,,,,,,,,,,,,,,,,==,,,,,,,,',
    ',,,,,,,,,,,,,,,,,,,,==,,,,,,,,,_',
    ',,,,,,,,,,,,,,,,,,==,,,,,,,,,,_~',
    ',,,,,,,,,,,,,,,,,==,,,,,,,,,__~~',
    ',,,,,,,,,,,,,,,===,,,,,_^^,_~~~W',
    ',,,,,,,,,,,,,,==,,,,,,_~~~r~~~WW',
    ',,,,,,,,,,,,==,,,,,,__~~~~~~WWWW',
    ',,,,,,,,,,,==:,,,,,_~~~WWW~WWWWW',
    ',,,,,,,,,==,,::,,,,_~~WWWWWWWWWW',
    ',,,,,,,===,,,,::,^^_~WWWWWWWWWWW',
    ',,^^^,==,,,,,,,:::^^_~WWWWWWWWWW',
    ',^^^===,,,,,,_,^B:,,^_~WWWWWWWWW',
    ',^^==^,,,,,,_~~r,:::B,r~WWWWWWWW',
    ',==^^^^,,,,,_~~~rr_Sr_r~WWWWWWWW',
    '==^^^^^^,,,__~~WW~r_r_r~WWWWWWWW',
    ',,,,^^^^,__~~~WWWWWWWWWWWWWWWWWW',
  ],
  features: [
    { kind: 'event', x: 30, y: 2, id: 'e3_ford', once: true, text: 'The Wend\'s last bend, and a ford of flat stones. Gullwick\'s smoke across the water.' },
    { kind: 'event', x: 20, y: 9, id: 'e3_point', once: true, text: 'Out on the point, a lighthouse. No light in it.' },
    { kind: 'event', x: 25, y: 15, id: 'e3_gibbet', once: true, text: 'A gibbet above the rocks. The man in it wore oilskins, and a board at his feet says WRECKER.' },
    { kind: 'sign', x: 14, y: 22, text: 'A finger-post where a path leaves the road: CROWNESS LIGHT.' },
    { kind: 'shrine', x: 12, y: 24, id: 'e3_shrine', text: 'A shrine at the fork, hung with a fisherman\'s lantern. Its glass is cracked.', stat: 'luck', done: 'The shrine is quiet.' },
    { kind: 'cairn', x: 19, y: 26, id: 'e3_cairn', text: 'A cairn on the point, a stone for every boat Crowness lost.', gold: 30, items: ['potion_heal'] },
    { kind: 'camp', x: 12, y: 27, name: 'The lee of the point', text: 'Out of the wind in the lee of the point, on old ashes.' },
    { kind: 'well', x: 18, y: 27, text: 'The keeper\'s well. A bucket, and a rope worn to a thread.' },
    // The Keeper's Count and Oil for the Lamp (#67): Aldred at the foot of the tower stair, his log on
    // the cottage table, and the lamp room above, dark until a company's oil or Vask's order lights it.
    { kind: 'npc', x: 18, y: 28, name: 'Aldred, keeper of Crowness Light', lines: [
      'The lamp room at the top of the tower is dark, and the old man at the foot of the stair is trimming a wick that has nothing to burn.',
      '"Keeper. Forty-one years. You\'ll want to know about the night the light went out. Everyone does, once, and then they want to know when supper is."',
      '"Eleven. I was at Gullwick that night, at a burying, my lamp trimmed to last till dawn without me. It lasted; the Hearth didn\'t. I stood in the surf and counted the gaps as you count thunder, and wrote it up when I got home. It\'s on the table. Read it; nobody else has."',
      '"You\'ll have noticed she\'s dark. The Lanterns\' cart brought a cask a month for forty-one years and stopped the week the Queen died. No letter; the cart just didn\'t come. A light with no oil is a tall house, and I\'m too old to live in a tall house for nothing."',
    ], flag: ['q_keeper', 'q_oil'], quest: {
      item: 'lantern_oil', reward: 0, setFlag: 'q_oil_lit',
      done: [
        'Aldred takes the flask and weighs it in his hand as if it might get away from him. "That\'s a night. One night. You\'ve no notion what one night does."',
        '"A dark light is a thing the Lanterns can bear; they\'ve borne it a month. A light that\'s burning again, that they stopped, is a thing they\'ll have to explain, and they\'d sooner send the cart than explain. Watch. The cart comes back."',
        'He climbs the stair slowly. Above you the glass takes the flame, and his voice comes down after it: "There. Now Gullwick can find its own front door."',
      ],
      // Lit with the company's oil, bought or found.
      after: [
        'The lamp turns overhead, and Aldred has the look of a man who has slept.',
        '"The cart came. First of the month, as if it had never stopped, and the carter looked at my light as if it had done something to him personally."',
        '"Two boats came in past the point last night on this light, and none by any other. Sit, if you like. It\'s a good room when it\'s lit."',
      ],
    }, says: [
      // Lit by Vask's order: q_oil_order is set only by his words, which lapse once the company lights it.
      { after: { flag: 'q_oil_order' }, lines: [
        'The lamp turns overhead. Aldred does not look up at it.',
        '"The cart came, with a Warden riding beside it to see that it did, and he told me the Crown remembers me. I\'ve been remembered by the Crown. It\'s a cold sort of warm."',
        '"I\'d rather have gone dark. A light that burns because a lord allows it goes out the day he stops allowing it, and the boats won\'t know the difference until the night it does. Still. They\'re finding Gullwick. That\'s what a light is for, whoever\'s it is."',
      ] },
      { after: { flag: 'q_keeper' }, until: { flag: 'q_oil_lit' }, lines: [
        '"Still dark. It\'s the one thing about a lighthouse a stranger can tell at a glance."',
        '"Something for your notebook, since you read. Some nights there\'s a second light on the rocks below the point, lower than mine ever stood. A light that low is on the water, or in it. It\'s in the log, six times now. You\'ve read more of that log than the Lanterns have in forty years."',
      ] },
    ] },
    { kind: 'event', x: 19, y: 28, id: 'e3_lamp_dark', once: true, until: { flag: 'q_oil_lit' },
      text: 'The lamp room: a lens the height of a man, clean as a tear, its wick dry. All the Wyke lies below, and none of it can see you.' },
    { kind: 'event', x: 19, y: 28, id: 'e3_lamp_lit', once: true, after: { flag: 'q_oil_lit' },
      text: 'The lamp room, lit. The lens throws the flame to sea in a slow turning bar; the rocks below show white each time it passes.' },
    { kind: 'chest', x: 16, y: 28, id: 'e3_log', gold: 0, items: ['keepers_log'] },
    { kind: 'event', x: 21, y: 29, id: 'e3_wreck', once: true, text: 'A wreck on the rocks below the light, her back broken. Someone has had the cargo, but not all of it.' },
    { kind: 'chest', x: 21, y: 30, id: 'e3_salvage', gold: 50, items: ['buckler+1', 'potion_heal'] },
    { kind: 'event', x: 18, y: 29, id: 'e3_ledge', once: true, text: 'A ledge low on the rocks, black with lamp soot. No keeper set a lamp this low.' },
    { kind: 'event', x: 19, y: 29, id: 'e3_niche', once: true, text: 'A niche in the rock: a shuttered lamp, and a chart of the reef with the rocks marked as a harbour.' },
    { kind: 'chest', x: 19, y: 30, id: 'e3_niche_chest', gold: 40, items: ['potion_sp'] },
    { kind: 'event', x: 5, y: 9, id: 'e3_pond', once: true, text: 'A dew pond on the down, its rim trodden by sheep and by something heavier.' },
    { kind: 'event', x: 5, y: 17, id: 'e3_fold', once: true, text: 'A shepherd\'s fold of piled flints, the gate off its hinge and no sheep.' },
  ],
  secrets: [{ x: 19, y: 29, hint: 'e3_ledge' }],
  encounters: [
    { id: 'e3_crows', x: 27, y: 16, monsters: ['carrion_crow', 'carrion_crow', 'carrion_crow', 'carrion_crow', 'carrion_crow', 'carrion_crow', 'carrion_crow', 'carrion_crow'], aware: 5, respawn: 1440 },
    { id: 'e3_fog', x: 18, y: 18, when: { sky: 'fog' }, monsters: ['lampman', 'wrecker', 'wrecker', 'wrecker', 'wrecker'], aware: 3, respawn: 2880 },
    { id: 'e3_rocks', x: 25, y: 20, when: { hours: 'night' }, monsters: ['wrecker', 'wrecker', 'lampman'], aware: 5, respawn: 2880 },
    { id: 'e3_bay', x: 12, y: 29, when: { hours: 'night' }, monsters: ['wrecker', 'wrecker', 'lampman'], aware: 5, respawn: 2880 },
    { id: 'e3_crabs', x: 21, y: 28, monsters: ['barnacle_crab', 'barnacle_crab', 'barnacle_crab', 'barnacle_crab'], aware: 3, respawn: 1440 },
    { id: 'e3_bandits', x: 5, y: 27, monsters: ['billman', 'billman', 'slinger'], aware: 5, respawn: 2880 },
    { id: 'e3_wolves', x: 12, y: 5, monsters: ['chalk_wolf', 'chalk_wolf', 'chalk_wolf'], aware: 5, respawn: 1440 },
    { id: 'e3_tusker', x: 2, y: 5, monsters: ['tusker'], aware: 3, respawn: 2880 },
  ],
};
