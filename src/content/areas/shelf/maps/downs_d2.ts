// Callow Downs, box D2: the chalk hills. Core, band 4-5: the chalk from the rim down to the west
// downs, the track up from the Wend's ford to the Berth on the crest, the Queen's barrow standing
// open, and round it the smaller barrows of the ridge; wolves on the chalk by day, bred in the old
// chalk pit, and the Black Dog by night. Cut from the atlas by tools/scaffold.ts; docs/areas/shelf.md
// §4.6 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { WEST } from '../../../../game/types.ts';

/** The wolves on the chalk run until the den in the chalk pit is pulled down (game/dens.ts's denBurnt). */
const PULLED = { seen: 'downs_d2:d2_den' };
const WOLVES = ['barrow_wolf', 'chalk_wolf', 'chalk_wolf'];

export const DOWNS_D2: MapDef = {
  id: 'downs_d2',
  name: 'Callow Downs',
  kind: 'outdoor',
  density: 'core',
  band: [4, 5],
  start: { x: 31, y: 12, facing: WEST },
  rows: [
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMM^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
    'M^^^^^^^^^^^^^^^r^^^r^^^^^^r^^^^',
    '^^^^^^^^^^^^^rr^^^^r:r^^rr^^^^^^',
    '^^^rrrrrr^r^^^^^^^^rSr^^^^^^^^^^',
    '^^^r::::r^^^^^^^^^^^^^^^^^^^^r^^',
    '^^^r::::r^^^^^^^^r^^^^^^^^^^^^^^',
    '^^^r::::r^^^^^^^^^^^^^^^^^^^^^^^',
    ',^^rr:rrr^^^^^^^^^^^^^^^^^^^^^^^',
    ',^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
    ',^^^^^^rrrrrrr^^^^^^^^^^^^^^^^^^',
    ',^^^^^^rrrrrrr^^^^^^^^^^^^^^^^^^',
    ',^^^^^^rrrrr::==================',
    ',^^^^^^rrrrrrr^^^^^^^^^^^^^^^^^^',
    ',^^^^^^rrrrrrr^^^^^^^^^^^^^^^^^^',
    ',,^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
    ',^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
    '^^^BB^^^^^^^^^^^^^^^~~^^^^^^^^^^',
    '^^^^^^^^^^^^^^^_^^^^~~^^^^^^^^^^',
    '^^^^^^^^^^^^^^^_^^^^^^^^^^^^^^^^',
    '^^^^^^^^^^^^^^^_^^^^^^^^^^^^^^^^',
    '^^^^^^^^^^_^^^^_^^^^_^^^^^^^^^^^',
    '^^^^^^^^^^^_________^^^^^^^^^^^^',
    '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
    '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
    ',,^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
    ',,,^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
    ',,^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
    ',,,^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
    ',,,^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
    ',,,,,^^^^^^^^^^^^^^^^^^^^^^^^^^^',
    ',,,,,^^^^^^^^^^^^^^^^^^^^^^^^^^,',
  ],
  exits: [
    { x: 12, y: 12, to: 'berth', tx: 14, ty: 7, tf: WEST, label: 'You duck under the lintel into the Berth.' },
  ],
  features: [
    { kind: 'sign', x: 22, y: 11, text: 'The Berth, barrow of the Queens. By order of the Crown, let them lie.' },
    { kind: 'event', x: 15, y: 13, id: 'd2_stones', once: true, text: 'Grooves in the turf where the stones were dragged clear, and a lever of new oak left where it broke.' },
    { kind: 'event', x: 13, y: 12, id: 'd2_mouth', once: true, text: 'The Berth. Its stones lie pulled aside in the grass, the chisel marks on them still white, the chalk cut up by shod hooves.' },
    { kind: 'event', x: 15, y: 23, id: 'd2_cradle', once: true, text: 'A figure cut through the turf to the chalk: a long curve, and a line standing up from it. The shepherds call it the Cradle.' },
    { kind: 'shrine', x: 8, y: 2, id: 'd2_shrine', text: 'A shrine on the crest, older than the barrows, its stone worn to a thumb.', stat: 'might', done: 'The shrine is only a stone now.' },
    { kind: 'fountain', x: 22, y: 18, id: 'd2_pond', text: 'A dew pond, lined with clay and full to the brim, though it has not rained.', stat: 'accuracy', done: 'The dew pond gives only water.' },
    { kind: 'cairn', x: 27, y: 3, id: 'd2_cairn', text: 'A cairn on the highest barrow, every stone carried up from the valley.', gold: 40, items: ['potion_heal', 'potion_heal'] },
    { kind: 'camp', x: 17, y: 27, name: 'Camp in the lee', text: 'A hollow in the lee of the ridge, out of the wind, and the ashes of other fires.' },
    { kind: 'npc', x: 4, y: 18, name: 'A shepherd', lines: [
      'A shepherd sits in the door of his hut with a crook across his knees, and does not get up.',
      '"The Dog? Every night since they opened her. Round and round the barrow, and never a print by morning."',
      '"Nine barrows on the ridge, and she\'s the biggest. One of the little ones rings when my sheep run over it."',
    ] },
    { kind: 'den', x: 5, y: 6, id: 'd2_den', name: 'The chalk pit', text: 'A den dug into the side of the old chalk pit. The spoil is trodden grey, and the bones at its mouth are not all sheep.',
      breeds: ['chalk_wolf', 'barrow_wolf'], keepers: 'd2_pack', brood: ['d2_wolves1', 'd2_wolves2', 'd2_wolves3'],
      ask: 'The pack is dead. Fire the den with gorse and pull the bank down over it?', burn: 'Pull it down.', leave: 'Leave it.',
      burnt: 'The gorse catches, and the bank comes down over the den\'s mouth. Nothing on the chalk answers.',
      ruin: 'A fallen bank of chalk, grey with old smoke.', gold: 45, items: ['spear+1'] },
    { kind: 'event', x: 20, y: 5, id: 'd2_ring', once: true, text: 'A barrow no bigger than the others. The turf on it is bitten to the chalk, and it rings under a heel.' },
    { kind: 'chest', x: 20, y: 3, id: 'd2_cist', gold: 60, items: ['halberd+1', 'ring_of_office'] },
  ],
  secrets: [{ x: 20, y: 4, hint: 'd2_ring' }],
  encounters: [
    { id: 'd2_crows', x: 27, y: 15, monsters: ['carrion_crow', 'carrion_crow', 'carrion_crow', 'carrion_crow', 'carrion_crow', 'carrion_crow'], aware: 5, respawn: 1440 },
    { id: 'd2_wolves1', x: 24, y: 6, monsters: WOLVES, aware: 5, respawn: 1440, until: PULLED },
    { id: 'd2_wolves2', x: 25, y: 23, monsters: WOLVES, aware: 5, respawn: 1440, until: PULLED },
    { id: 'd2_wolves3', x: 8, y: 26, monsters: WOLVES, aware: 5, respawn: 1440, until: PULLED },
    { id: 'd2_pack', x: 6, y: 6, monsters: ['barrow_wolf', 'barrow_wolf'], aware: 3, roams: false },
    { id: 'd2_dog', x: 17, y: 10, when: { hours: 'night' }, monsters: ['black_dog'], aware: 5, respawn: 1440 },
    { id: 'd2_dogs', x: 11, y: 16, when: { hours: 'night' }, monsters: ['black_dog', 'black_dog'], aware: 5, respawn: 2880 },
  ],
};
