// Sunderwood, box J3: the Bears' Wood. Country, band 15-16: the deep forest south of the Eaves,
// between the rim's pines and the Hoarhills' end, the bears' country. A cutters' track down from
// J2, a hermit's clearing, a bears' den whose old bears have gone to glass, and the dead wood at its
// south-east where the Sunder's west lip begins (K3). Its west and south edges are the Deepthorn's
// closed forest (I3, J4), and open no way.
// Cut from the atlas by tools/scaffold.ts; docs/areas/sunderwood.md §4.9 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';
import { denBurnt } from '../../../../game/dens.ts';

/** The den burnt: its brood stops coming. */
const DEN_BURNT = denBurnt('eaves_j3', 'j3_den');

export const EAVES_J3: MapDef = {
  id: 'eaves_j3',
  name: 'The Bears\' Wood',
  kind: 'outdoor',
  density: 'country',
  band: [15, 16],
  region: 'sunderwood',
  start: { x: 14, y: 0, facing: SOUTH },
  rows: [
    'MMMMMMMMMMMMMMttMMMMMMMMMMMMMMMM',
    'MTTTTTTTTTTTTTttTTTTTTTTTTTTTTTM',
    'MTTTTTTTTTTTTTttTTTTTTTTTTTTTTTM',
    'MTTTTTTTTTTTTTttTTTTTTTTTtttTTTM',
    'MTTTTTTTTTTTTTttttttttttttttTTTM',
    'MTTTTTTTTTTTTTttTTTTTTTTTtttTTTM',
    'MTTTTTttttttttttTTTTTTTTTTTTTTTM',
    'MTTTTttttttTTTTtTTTTTTTTTTTTTTTM',
    'MTTTTttttttTTTTtTTTTTTTTTTTTTTTM',
    'MTTTTttttttTTTTtTTTTTTTTTTTTTTTM',
    'MTTTTttttttTTTTtTTTTTTTTTTTTTTTM',
    'MTTTTttttttTTTTtTTTTTTTTTTTTTTTM',
    'MTTTTTTtTTTTTTTtTTTTTTTTTTTTTTTM',
    'MTTTTTTtTTTTTTTtTTTTTTTTTTTTTTTM',
    'MTTTTTTtTTTTTTTtTTTTTTTTTTTTTTTM',
    'MTTTTTTtTTTTTTTtTTTTTTTTTTTTTTTM',
    'MTTTTTTtTTTTTTTtTTTTTTTTTTTTTTTM',
    'MTTTTTTtTTTTTTTtTTTTTTTTTTTTTTTM',
    'MTTTTTTtTTTTTTTtTTTTTTTTTTTTTTTM',
    'MTTTTTTtTTTTTTTtTTTTTTTTTTTTTTTM',
    'MTTTTTtttttttttttttttSttTTTTTTTM',
    'MTTTTTtttTTTTTTtTTTTTTTTTTTTTTTM',
    'MTTTTTTTTTTTTTTtTTTTTTTTTTTTTTTM',
    'MTTTTTTTTTTTTTTtTTTTTTTTTTTTTTTM',
    'MTTTTTTTTTTTTTTtTTTTTTTTTTTTTTTM',
    'MTTTTTTTTTTTTTTtTTTTTTTTTTTTTTTM',
    'MTTTTTTTTTTTTTTtttttttttttttdddM',
    'MTTTTTTTTTTTTTTTTTTTTTTTTTTTdddd',
    'MMTTTTTTTTTTTTTTTTTTTTTTTTTTdddd',
    'MMMTTTTTTTTTTTTTTTTTTTTTTTTTdddd',
    'MMMMTTTTTTTTTTTTTTTTTTTTTTTTdddd',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
  ],
  features: [
    { kind: 'event', x: 14, y: 1, id: 'j3_track', once: true, text: 'The cutters\' track comes down out of the pines into older wood. The stumps stop, and the first whole tree is marked by a bear higher than your head.' },
    // The hermit's clearing, and half the hint.
    { kind: 'npc', x: 6, y: 8, name: 'A hermit', lines: [
      'A hermit in a clearing, a bearskin over his shoulders and a bear\'s smell on him. He does not stop whittling.',
      '"The glass was a day\'s walk off when I came. Now I hear it from here on a still night, a tick when the cold gets into it. Come winter I\'ll hear it from bed."',
      '"Bears go up to that den. So does something on two legs, and it comes down lighter."',
    ] },
    { kind: 'shrine', x: 7, y: 21, id: 'j3_shrine', text: 'A wayside shrine in the wood, a hare\'s foot nailed to its face, the nail rusted to nothing and the foot still hanging. The bears have let it be.', stat: 'luck', done: 'The hare\'s foot on the shrine, still hanging.' },
    { kind: 'cairn', x: 26, y: 4, id: 'j3_cairn', text: 'A cairn in a clearing the bears use, the grass flat round it and the stones clawed to the height of a standing bear. The top stone has not been touched.', gold: 170, items: ['potion_sp_great'] },
    // The den (#88), its old bears gone to glass beside it; by night the moths at its mouth.
    { kind: 'event', x: 18, y: 20, id: 'j3_mouth', once: true, text: 'Moth dust on the ground at the den\'s mouth, thick as under a lamp. Bears keep no lamp.' },
    { kind: 'event', x: 17, y: 20, id: 'j3_mouth_night', once: true, when: { hours: 'night' }, text: 'Moths at the den\'s mouth after dark, thick as at any lamp. Bears keep no lamp.' },
    { kind: 'den', x: 20, y: 20, id: 'j3_den', name: 'A bears\' den', text: 'An old pine fallen against the rock, a den dug under it. The old bears lie at its mouth, grey, the light coming through them.',
      breeds: ['pine_bear'], keepers: 'j3_keepers', brood: ['j3_brood1', 'j3_brood2'],
      ask: 'The old bears are dead. Fire the den under the pine, and let the glass go with it?', burn: 'Fire it.', leave: 'Leave it.', burnt: 'The pine goes up like a torch. In the heat the glass at the den\'s mouth rings, and cracks, and falls in.', ruin: 'The pine lies in ash across its own den, the glass that was the old bears cracked through. Nothing growls under the Eaves.', gold: 140, items: ['potion_heal'] },
    // Where the wood gives out in dead wood, at the Sunder's west lip.
    { kind: 'event', x: 22, y: 26, id: 'j3_deadwood', once: true, text: 'The pines give out, and the trunks beyond are dead and grey, grain gone to glass at the tips. East through them the ground stops.' },
    // The secret: behind the den's back, the gleaners' cache.
    { kind: 'event', x: 22, y: 20, id: 'j3_cache', once: true, text: 'Behind the den, under a slab the bears have not moved, a gleaners\' cache: a sack of shards that glow, a coat of chain, a purse. Moth dust is thick on the sack.' },
    { kind: 'chest', x: 23, y: 20, id: 'j3_cache_chest', gold: 200, items: ['chain+2'] },
  ],
  secrets: [{ x: 21, y: 20, hint: 'j3_mouth' }],
  encounters: [
    // The den's brood abroad, a pair on the track and one on the hermit's path, and beside the den
    // its keepers, the old bears gone to glass, the box's group at 16.
    { id: 'j3_brood1', x: 15, y: 8, monsters: ['pine_bear', 'pine_bear'], aware: 4, respawn: 1440, until: DEN_BURNT },
    { id: 'j3_brood2', x: 7, y: 15, monsters: ['pine_bear'], aware: 4, respawn: 1440, until: DEN_BURNT },
    { id: 'j3_keepers', x: 19, y: 20, monsters: ['glass_bear', 'glass_bear', 'glass_bear'], aware: 3, roams: false },
  ],
};
