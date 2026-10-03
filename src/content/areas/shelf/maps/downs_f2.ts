// Callow Downs, box F2: the road west. Country, band 2-3: the Salt Road up off Brandy Hole's beach and
// south-west into F3, stubble fields, Brockholt's beeches in the north with a woodcutter's camp, and
// Coldharbour, the retired captain's steading, at the wood's south-west corner, and in its east field
// his old standard-bearer, who teaches the Knight's second prestige (#19). Cut from the atlas by
// tools/scaffold.ts; docs/areas/shelf.md §4.2 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST, WEST } from '../../../../game/types.ts';

export const DOWNS_F2: MapDef = {
  id: 'downs_f2',
  name: 'Callow Downs',
  kind: 'outdoor',
  density: 'country',
  band: [2, 3],
  start: { x: 31, y: 29, facing: WEST },
  rows: [
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    '^^^^^^TTTTTTTTTTTTTTTTTTTTTT^^^^',
    '^^^^,,TTTTT,,TTTTTTTTTTTTTTT^^^^',
    ',,,,^^TTTTTTSTTTTTTTTTTTTTTTT^^^',
    ',,,fff^TTTT,,,,,,TTTTTTTTTTTT^^^',
    'fffffffTTT,,,,,,,TTTTTTTTTTTT,^^',
    'ffffffff,,,,,,,,,TTT,,,,,TTTT,,^',
    'ffffffff,,,,,,,,,:::,:,,,TTTT,,,',
    'ffffffff,,,TTTTTTTTT,,:,,::::,,,',
    'fffffBBB::BBTTTTTTTT,,,,,TTTT,,,',
    'fffffBBB::BBTTTTTTTTTTTTTTTTT,,,',
    'fffff:::::::TTTTTTTTTTTTTTTT,,,,',
    '=====:::::::ffTTTTTTTTTTTT,,,,,,',
    'fffff:::::::ffffTTTTTTT,,,,,,,,,',
    'ffffffffff:::::::::::::::,,,,,,,',
    'ffffffffffffffffffffffff:,,,,,,,',
    'fffffffffffffffffTTfffff:,,,,,,,',
    'fffffffffffffffffTTfffff:,,,,,,,',
    'ffffffffffffffffffffffff:,,,,,,,',
    'fTTTTTTffTTTTTTfffffffff:,,,,,,,',
    'ffffffffffffffffffffffff:,,,,,,,',
    'fffffffffffffffTffffffff:,,,,,,,',
    'fffffffffffffffTffffffff:,,,,,,,',
    'fffffffffffffffTfffffff,:,,,,,,,',
    'fffffffffffffffTfffffff,:,,,,,,,',
    'fffTTTfffffffffffffffff,:,,,,,,,',
    'fffTTTffffffffffffffff,,:,,,,,,,',
    'ffffffffffffffffffffff,,:,,,,,,,',
    'fffffffffffffffffffff,,,:,,,,,,,',
    'fffffffffffffffffffff,,,========',
    'fffffffffffffffff========,,,,,,,',
    'fffffffffffffff===ff,,,,,,,,,,,,',
  ],
  exits: [
    { x: 31, y: 29, to: 'shelf', tx: 1, ty: 29, tf: EAST, label: 'The road drops to the sand. The Foreland.' },
  ],
  features: [
    { kind: 'sign', x: 30, y: 28, text: 'A milestone: GULLWICK 2. CROWNESS 4.' },
    { kind: 'shrine', x: 25, y: 28, id: 'f2_shrine', text: 'A wayside shrine where the farm track leaves the road. Its candle is out.', stat: 'luck', done: 'The shrine is quiet.' },
    { kind: 'event', x: 6, y: 11, id: 'f2_lamp', once: true, when: { hours: 'day' }, text: 'Coldharbour: a farm kept like a barracks, whitewashed to the eaves, and not a weed in the yard.' },
    // Riders in the Dark (#68): Dunstan in his yard. The riders are seen at E2's ford by night; he
    // writes to Hale, who takes the letter at the Scarth, or keeps it under his roof.
    // The Knight's second prestige (#19; DESIGN §5): the captain's old standard-bearer, in the east
    // field off the farm's track, off the road and the fights.
    { kind: 'npc', x: 19, y: 16, name: 'Siward, who carried the banner', lines: [
      'Two oaks at the far edge of the east field, off the track, and a banner furled and lashed to the nearer, its pole worn dark where hands have been. A grey man forks hay beneath it, and works with one eye on the farmhouse window.',
      '"Siward. I carried the captain\'s banner twenty years, and that\'s it, where I can see it. Now I carry hay and look after him. He keeps the lamp; I keep the rest."',
      '"A line fights by what it can see. While it can see its banner it strikes true, and when the pole goes down the line goes with it, whoever\'s left standing. So the pole does not go down. One of you has the makings. Unlash it, and hold it till I say."',
    ], teaches: { cls: 'knight', prestige: 2, seek: 'Siward, who carried Captain Dunstan\'s banner, in Coldharbour\'s east field under the two oaks, can make a Knight Banneret of a Knight-Errant.' } },
    { kind: 'npc', x: 10, y: 11, name: 'Captain Dunstan, retired', lines: [
      'Coldharbour. A lamp burns in the farmhouse window, as it does at every hour, and the man mending the gate has a Warden\'s shoulders and a farmer\'s hands. He does not stop working to talk.',
      '"Captain, once. Dunstan, now. You\'ll want to know about the lamp. Everyone does, and the gate won\'t mend itself, so I\'ll tell you while I work."',
      '"The week the Queen died, riders came off the Salt Road and through my stubble at the second hour. Eight horses, shod; farm horses aren\'t shod for chalk. West over the ford towards the Berth, and back before dawn, and not a lantern among them."',
      '"I\'ve shown a light in that window every night since I hung up the grey. An honest rider steers for it. These steered round it. Go and sit at the ford by night. Men who ride dark always have a reason to go back."',
    ], flag: 'q_riders', says: [
      { after: { flag: 'q_riders_letter' }, lines: [
        '"Anything from Hale? No. There wouldn\'t be. Wardens don\'t write \'thank you\'; we write \'noted\'." He looks at the lamp. "I\'ve sat where he\'s sitting. You send it up the line, and you hope the line\'s still yours."',
      ] },
      { after: { flag: 'q_riders_kept' }, lines: [
        '"You\'ll not hear it from me again, and I\'ll thank you not to say it in Helmstow with my name on it." He is mending the same gate. "I sleep less and I still have a roof. That\'s the trade. I made it with my eyes open, which is more than most men can say of theirs."',
      ] },
      { after: { flag: 'q_riders', seen: 'downs_e2:e2_riders' }, lines: [
        'Dunstan listens with his hands flat on the table, the way a man listens to a report.',
        '"Grey under the cloaks." He is quiet a while. "A Warden shows his light. It\'s the first thing they teach you and the last you forget, because the country has to know who\'s on its roads. Wardens don\'t ride dark. So either the Wardens have gone dark, or somebody\'s wearing us."',
        '"Hale holds the Scarth. He\'s the one Warden east of here I\'d put this in front of, and he\'d want it in front of him, which is his trouble and would become mine. Or it goes no further than this table, and I keep my farm."',
      ], choice: { ask: '"I\'m asking you, because I know what I\'d do; I\'ve done it before, and it\'s why I farm. Do I write to Hale, or does this stay under my roof?"', answers: [
        { label: 'Write to Hale.', sets: 'q_riders_letter', gives: 'dunstan_letter', says: [
          '"Then I write." He does, in the Wardens\' shorthand, and folds it without a seal. "Take it east yourselves; I\'ll not trust it to the post, and a seal only tells a thief which letter to take. He\'ll read it, and it\'ll be one more thing he knows. Knowing is what gets Wardens killed. He\'d say the same of me, and he\'d be right."',
        ] },
        { label: 'Keep it under your roof.', sets: 'q_riders_kept', says: [
          '"Then it stays here." He gets up and trims the lamp in the window, though it does not need it. "I\'ve a roof, a barn and forty acres, and I\'d like to die in the house. That\'s not cowardice at my age. It\'s arithmetic."',
          '"The lamp stays lit, mind. That was never for them."',
        ] },
      ] } },
    ] },
    { kind: 'well', x: 8, y: 11, text: 'Coldharbour\'s well. The rope is new.' },
    { kind: 'camp', x: 22, y: 7, name: 'Woodcutter\'s camp', text: 'A woodcutter\'s fire in a ring of split beech.' },
    { kind: 'npc', x: 21, y: 7, name: 'A woodcutter', lines: [
      'A woodcutter splits beech by the fire, and does not stop for you.',
      '"Brockholt\'s badgers dig where they please. Never under the holly, mind. Thirty years I\'ve cut here, and never once."',
    ] },
    { kind: 'event', x: 12, y: 4, id: 'f2_holly', once: true, text: 'Setts riddle the bank under the beeches, fresh earth at every mouth. The ground under the holly is bare.' },
    { kind: 'event', x: 12, y: 2, id: 'f2_sett', once: true, text: 'No badger dug this. Brandy casks, and a crate stamped with the customs seal.' },
    { kind: 'chest', x: 11, y: 2, id: 'f2_cache', gold: 45, items: ['shortsword+1', 'dagger+1', 'potion_heal'] },
    { kind: 'event', x: 4, y: 21, id: 'f2_scarecrow', once: true, text: 'A scarecrow in a Warden\'s old coat, its buttons polished.' },
    { kind: 'event', x: 29, y: 4, id: 'f2_rise', once: true, text: 'From the rise the Foreland lies below you, and the smoke of Helmstow.' },
    { kind: 'cairn', x: 2, y: 2, id: 'f2_cairn', text: 'A cairn on the rise, a stone from every shepherd who ever passed.', gold: 20, items: ['potion_heal'] },
  ],
  secrets: [{ x: 12, y: 3, hint: 'f2_holly' }],
  encounters: [
    { id: 'f2_crows', x: 8, y: 25, monsters: ['carrion_crow', 'carrion_crow', 'carrion_crow', 'carrion_crow', 'carrion_crow', 'carrion_crow'], aware: 5, respawn: 1440 },
    { id: 'f2_wolves', x: 15, y: 6, monsters: ['chalk_wolf', 'chalk_wolf', 'chalk_wolf'], aware: 5, respawn: 1440 },
    { id: 'f2_boar', x: 9, y: 7, monsters: ['tusker'], aware: 3, respawn: 2880 },
    { id: 'f2_rats', x: 11, y: 11, monsters: ['barn_rat', 'barn_rat', 'barn_rat', 'barn_rat', 'barn_rat'], aware: 4, respawn: 720 },
    { id: 'f2_bandits', x: 17, y: 30, monsters: ['footpad', 'footpad', 'poacher'], aware: 5, respawn: 2880 },
  ],
};
