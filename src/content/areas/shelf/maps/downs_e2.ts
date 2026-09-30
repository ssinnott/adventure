// Callow Downs, box E2: the Wend's fields. Country, band 3-4: the Wend down off the rim through the
// stubble towards Gullwick, the track from Coldharbour west over its ford towards the Berth, the
// drowned mill in the willows and the rookery by it, and the chalk hills rising at the west edge.
// Cut from the atlas by tools/scaffold.ts; docs/areas/shelf.md §4.5 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { WEST } from '../../../../game/types.ts';

/** The rookery's brood fly with the wolves until it burns (game/dens.ts's denBurnt). */
const BURNT = { seen: 'downs_e2:e2_rookery' };
const BROOD = ['carrion_crow', 'carrion_crow', 'carrion_crow', 'carrion_crow', 'carrion_crow', 'carrion_crow', 'chalk_wolf', 'chalk_wolf'];

export const DOWNS_E2: MapDef = {
  id: 'downs_e2',
  name: 'Callow Downs',
  kind: 'outdoor',
  density: 'country',
  band: [3, 4],
  start: { x: 31, y: 12, facing: WEST },
  rows: [
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    '^^^^^^^^^^^^,,^~,,,,,,,,,,,,,,,^',
    '^^^^^^^^^^^^^,,,~,,,,,,,,,,,,,,^',
    '^^^^^^^^^^^^^,,,~,,,,,,,,,,,,,,,',
    '^^^^^^^^^^^^^^,,~,,,,,,,,,,,,,,,',
    '^^^^^^^^^^^^^^,ff~,,,ff,,,ffffff',
    '^^^^^^^^^^^fff,ff~ffffffffffffff',
    '^^^^^^^^^^^ffffff~ffffffffffffff',
    '^^^^^^^^fffffffff~~fffffffffffff',
    '^^^^^^ffffffffffff~fffffffffffff',
    '^^^^^fffffffffffff~fffffffffffff',
    '^^^^fffffffffffffff~ffffffffffff',
    '================================',
    '^^^fffffffffffffffff~fffffffffff',
    '^^^fffffffffffffffff~~ffffffffff',
    '^^^ffffffffffffffffff~ffffffffff',
    '^^fffffffffffffffffff~ffffffffff',
    '^^fffffffffffffffttfff~fffffffff',
    '^^ffffffffffffffffftff~fffffffff',
    '^^fffffffffffffffftttf~~ffffffff',
    '^^^fffffffffffffftttftf~ffffffff',
    '^^^fffffffffffffTtttftf~~fffffff',
    '^^^fffffffffffffTttttBB~~fffffff',
    '^^^ffffffffffffffttttBB~~~ffffff',
    '^^^^fffffffffffffTttttrr~~ffffff',
    '^^^,,fffffffffffffTttrfrf~~fffff',
    '^^^,,,fffffffffffffTtrSrff~fffff',
    '^^^,,,,,ffffffffffffffffff~~ffff',
    '^^,,,,,,,fffffffffffffffff~~ffff',
    '^,,,,,,,,ffffffffffffffffff~ffff',
    ',,,,,,,,,ffffffffffffffffff~~fff',
    ',,,,,,,,,,ffffffffffffffffff~~ff',
  ],
  features: [
    { kind: 'event', x: 19, y: 12, id: 'e2_ford', once: true, when: { hours: 'day' }, text: 'The ford. Shod hoofprints in the mud of both banks, going west and coming back, and not once only.' },
    { kind: 'sign', x: 18, y: 11, text: 'A sign reads: "THE BERTH. Scratched beneath, with a knife point: NOT AFTER DARK."' },
    { kind: 'fountain', x: 18, y: 3, id: 'e2_spring', text: 'A spring above the Wend, cold enough to ache the teeth.', stat: 'endurance', done: 'The spring runs on, and does no more for you.' },
    { kind: 'statue', x: 10, y: 17, id: 'e2_stone', text: 'A boundary stone between two fields, worn to a stump. Words are cut in it.', riddle: 'HOW MANY FOR THE HEARTH?', answer: 'ten', gift: { gold: 30, stat: 'luck' }, done: 'The stone keeps its count.' },
    { kind: 'cairn', x: 3, y: 26, id: 'e2_cairn', text: 'A cairn where the stubble gives out to the hill.', gold: 25, items: ['potion_heal'] },
    { kind: 'camp', x: 5, y: 29, name: 'Shepherd\'s camp', text: 'A shepherd\'s fire in the lee of the hill, and a hurdle fold.' },
    { kind: 'npc', x: 6, y: 29, name: 'A shepherd', lines: [
      'A shepherd leans on his crook and watches the hill, not you.',
      '"Something bays up there of a night. Not a dog of mine." He spits. "The miller never trusted a bank, nor the river. Much good it did him."',
    ] },
    { kind: 'den', x: 19, y: 20, id: 'e2_rookery', name: 'The rookery', text: 'The willows by the mill are black with nests, and every crow in them has already seen you.',
      breeds: ['carrion_crow', 'chalk_wolf'], keepers: 'e2_keepers', brood: ['e2_crows', 'e2_crows2'],
      ask: 'The rookery\'s keepers are dead, and the nests are dry. Burn it?', burn: 'Burn it.', leave: 'Leave it.',
      burnt: 'The nests go up like tinder. The crows wheel over the smoke, screaming, and come down nowhere near it.',
      ruin: 'Black stumps in the willows, and not a crow in them.', gold: 30, items: ['silver_locket'] },
    { kind: 'event', x: 22, y: 21, id: 'e2_mill', once: true, text: 'The mill stands to its sills in the Wend. The wheel has not turned in years.' },
    { kind: 'event', x: 22, y: 27, id: 'e2_wheel', once: true, text: 'Below the mill the wheel-pit is walled with river stone, and one course of it is laid dry.' },
    { kind: 'chest', x: 22, y: 25, id: 'e2_hoard', gold: 40, items: ['robe+1', 'leather+1'] },
  ],
  secrets: [{ x: 22, y: 26, hint: 'e2_wheel' }],
  encounters: [
    { id: 'e2_crows', x: 27, y: 8, monsters: BROOD, aware: 5, respawn: 1440, until: BURNT },
    { id: 'e2_crows2', x: 25, y: 17, monsters: BROOD, aware: 5, respawn: 1440, until: BURNT },
    { id: 'e2_keepers', x: 19, y: 21, monsters: ['old_rook', 'old_rook'], aware: 3, roams: false },
    { id: 'e2_boar', x: 18, y: 24, monsters: ['tusker'], aware: 3, respawn: 2880 },
    { id: 'e2_wolves', x: 6, y: 9, monsters: ['chalk_wolf', 'chalk_wolf', 'chalk_wolf'], aware: 5, respawn: 1440 },
  ],
};
