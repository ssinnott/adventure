// Callow Downs, box D3: the west downs. Country, band 4-5: open grass and the chalk's last slopes
// down to the lip of Kestrel Edge, the Upper Water below, and the Salt Road across the south-east
// corner towards the way down, with a bandit camp by it, a den (#88). The cliff is mountain, since no
// map character is cliff, and the Upper Water's squares below it are void until Saltreach is built.
// Cut from the atlas by tools/scaffold.ts; docs/areas/shelf.md §4.8 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { WEST } from '../../../../game/types.ts';

/** The camp's brood work the road until it burns (game/dens.ts's denBurnt). */
const BURNT = { seen: 'downs_d3:d3_camp' };
const BROOD = ['billman', 'billman', 'billman', 'slinger'];

export const DOWNS_D3: MapDef = {
  id: 'downs_d3',
  name: 'Callow Downs',
  kind: 'outdoor',
  density: 'country',
  band: [4, 5],
  start: { x: 31, y: 30, facing: WEST },
  rows: [
    ',,,,,,,^^^^^^^^^^^^^^^^^^^^^^^,,',
    ',,,,,,,,^^^^^^^^^^^^^^^^^^^^,,,,',
    ',,,,,,,,,^^^^^^^^^^^^^^^^^^,,,,,',
    ',,,,,,,,,^^^^^^^^^^^^^^^^,,,,,,,',
    ',,,,,,,,,,^^^^^^^^^^^^^,,,,,,,,,',
    ',,,,,,,,,,,^^^^^^^^^^^,,,,,,,,,,',
    ',,,,,,,,,,,,^^^^^^^^^,,,,,,,,,,,',
    ',,,,,,,,,,,,,^^^^^^^,,,,,,,,,,,,',
    ',,,,,,,,,,,,,^^^^,,,,,,,,,,,,,,,',
    ',,,,,,,,,,,,,,,^,,,,,,,,,,,,,,,,',
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    'M,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    'M,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    '%M,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    '%M,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    '%MM,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    '%%M,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    '%%MM,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    '%%:S,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    '%%MM,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    '%%%MM,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    '%%%MM,,,,,,,,,,,,,,,,,,,,,,,,,,,',
    '%%%%MM,,,,,,,,,,,,,,,,,,,,,,,,,,',
    '%%%%MM,,,,,,,,,,,,,,,,,,,,,,,,,,',
    '%%%%%MM,,,,,,,,,,,,,,,,,,,,,,,,,',
    '%%%%%MM,,,,,,,,,,,,,,BB,,,,,,,,,',
    '%%%%%%MM,,,,,,,,,,,,,,,,,^,,,,,,',
    '%%%%%%MM,,,,,,,,,,,,,,,,,,,,,,,,',
    '%%%%%%MM,,,,,,,,,,,,,,,,,,,,,,,,',
    '%%%%%%rMM,,,,,,,,,,,,,,,,,,,,,,,',
    '%%%%%rrMM,,,,,,,,,,,,,,,,,,,,,==',
    '%%%%%rrrMM,,,,,,,,,,,,,,,,,,,==,',
  ],
  features: [
    { kind: 'event', x: 1, y: 12, id: 'd3_lip', once: true, text: 'The lip of Kestrel Edge. Far below, the Upper Water, and the smoke of Rietum beyond it.' },
    { kind: 'npc', x: 5, y: 21, name: 'A falconer', lines: [
      'A falconer stands on the lip with a kestrel on his fist, watching the air below.',
      '"The birds bring back bright things from the ledge by the cleft. Buttons, a buckle. Someone went over there once." He hoods the bird. "The only way down is the Salt Road, south of here, and the Edge takes its toll of that too."',
    ] },
    { kind: 'event', x: 4, y: 18, id: 'd3_cleft', once: true, text: 'A cleft in the lip, and kestrel feathers caught in the thyme at its edge.' },
    { kind: 'event', x: 3, y: 18, id: 'd3_ledge', once: true, text: 'A ledge under the lip, and a kestrels\' nest. In it, among the bones, a climber\'s pack.' },
    { kind: 'chest', x: 2, y: 18, id: 'd3_pack', gold: 60, items: ['elixir', 'potion_sp'] },
    { kind: 'cairn', x: 18, y: 2, id: 'd3_cairn', text: 'A cairn on the chalk\'s last height, the whole Edge in view.', gold: 30, items: ['potion_heal'] },
    { kind: 'camp', x: 14, y: 17, name: 'A shepherd\'s hollow', text: 'A hollow out of the wind, the turf burnt black in a ring.' },
    { kind: 'shrine', x: 27, y: 29, id: 'd3_shrine', text: 'A shrine where the Salt Road turns for the Edge, hung with the boots of those who went down.', stat: 'endurance', done: 'The shrine is quiet.' },
    { kind: 'sign', x: 28, y: 30, text: 'SALTMOUTH, DOWN THE EDGE.' },
    { kind: 'den', x: 21, y: 26, id: 'd3_camp', name: 'The bandit camp', text: 'A hut of stolen planks by the road, a fire kept low, and a lookout who has already seen you.',
      breeds: ['billman', 'slinger'], keepers: 'd3_keepers', brood: ['d3_bandits', 'd3_bandits2'],
      ask: 'The camp\'s own are dead, and the hut is full of other people\'s things. Burn it?', burn: 'Burn it.', leave: 'Leave it.',
      burnt: 'The hut burns with everything it stole. By morning the Salt Road is only a road again.',
      ruin: 'Charred planks by the road, and the crows picking over them.', gold: 60, items: ['longbow+1'] },
    { kind: 'event', x: 10, y: 7, id: 'd3_barrow', once: true, text: 'A long mound on the down, ploughed round and never ploughed over.' },
    { kind: 'event', x: 24, y: 14, id: 'd3_pond', once: true, text: 'A dew pond gone to a crust of chalk, and no sheep for a mile.' },
    { kind: 'event', x: 9, y: 27, id: 'd3_gorse', once: true, text: 'Gorse to the cliff\'s lip, loud with bees, and a path trodden through it by something low.' },
  ],
  secrets: [{ x: 3, y: 18, hint: 'd3_cleft' }],
  encounters: [
    { id: 'd3_crows', x: 29, y: 28, monsters: ['carrion_crow', 'carrion_crow', 'carrion_crow', 'carrion_crow', 'carrion_crow', 'carrion_crow', 'carrion_crow', 'carrion_crow'], aware: 5, respawn: 1440 },
    { id: 'd3_bandits', x: 25, y: 29, monsters: BROOD, aware: 5, respawn: 2880, until: BURNT },
    { id: 'd3_bandits2', x: 17, y: 28, monsters: BROOD, aware: 5, respawn: 2880, until: BURNT },
    { id: 'd3_keepers', x: 21, y: 27, monsters: ['cutthroat', 'cutthroat'], aware: 3, roams: false },
    { id: 'd3_wolves', x: 11, y: 12, monsters: ['chalk_wolf', 'chalk_wolf', 'chalk_wolf', 'chalk_wolf'], aware: 5, respawn: 1440 },
    { id: 'd3_wolves2', x: 24, y: 7, monsters: ['chalk_wolf', 'chalk_wolf', 'chalk_wolf', 'chalk_wolf'], aware: 5, respawn: 1440 },
    { id: 'd3_boar', x: 5, y: 5, monsters: ['tusker'], aware: 3, respawn: 2880 },
  ],
};
