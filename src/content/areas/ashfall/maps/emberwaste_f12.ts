// Ashfall, box F12: the Ember Waste's south-west, where the lava flow ends under the rim. Country, band
// 25-26, the bounds' (#836): the ash under the mountain's wall, the flow coming down off F11 and going
// south-west into a cut it made in the rim, and its front stopped across the cut in a dam of black rock;
// a cairn under the wall, a man of stone calling to the mountain with a riddle cut below, sulphur round
// the vents in the east. No group. The secret: flakes of black glass heaped at a rock's foot, and behind
// the rock a knapper's store. In the dam's rock at 20,14, the way in under its crust: the door of Grim's
// Howe, the lair, the warlord's grave (docs/areas/ashfall.md §12.4); in the mountain's face at 10,3 a
// flue's mouth goes down into Blackdraw, the enclave (#845, docs/areas/ashfall.md §12.3).
// In from F11 (#514) walked, over the ash: F11's south edge meets this map's north edge square for square,
// the mountain at 0 to 3 and the ash and the flow from 4. In from G12 (#522) walked: G12's west edge meets
// this map's east edge square for square, the ash at 0 to 10 and the mountain and the void below. The
// west edge is the mountain and the void against E12, where the world ends, and the south edge the void.
// Cut from the atlas by tools/scaffold.ts's own cut, the world's end written as void; docs/areas/ashfall.md
// §12.2 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { anchored } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

export const EMBERWASTE_F12: MapDef = {
  id: 'emberwaste_f12',
  name: 'The Ember Waste',
  kind: 'outdoor',
  density: 'country',
  band: [25, 26],
  region: 'ashfall',
  start: { x: 20, y: 0, facing: SOUTH },
  anchors: { from_blackdraw: { x: 10, y: 2, facing: NORTH }, from_grims_howe: { x: 20, y: 13, facing: NORTH } },
  rows: [
    'MMMMaaaaaaaaaaaaaaaaaaaaaaa!!aaa',
    'MMMMMMaaaaaaaaaaaaaaaaaaaa!!!aaa',
    'MMMMMMMMMaaaMaaaaaaaaaaaa!!!aaaa',
    'MMMMMMMMMM"MMMMaaaaaaaaaa!!!aaaa',
    'MMMMMMMMMMMMMMMMMaaaaaaa!!!aaaaa',
    'MMMMMMMMMMMMMMMMMMMaaaaa!!!aaaaa',
    '%MMMMMMMMMMMMMMMMMMaaaa!!!aaaaaa',
    '%%%%MMMMMMMMMMMMMMMMMaa!!!aaaaaa',
    '%%%%MMMMMMMMMMMMMMMMMM!!!aaaaaaa',
    '%%%%%%MMMMMMMMMMMMMMMM!!!aaaaaaa',
    '%%%%%%%%MMMMMMMMMMMMM!!!MMaaaaaa',
    '%%%%%%%%%%MMMMMMMMMMM!!!MMMaaaaM',
    '%%%%%%%%%%%%MMMMMMMM!!!MMMMMrSrM',
    '%%%%%%%%%%%%%MMMMMMM!!!MMMMMr:rM',
    '%%%%%%%%%%%%%%MM%MMr"rMMMMMMr:rM',
    '%%%%%%%%%%%%%%%%%%%MMMMMMMMMrrrM',
    '%%%%%%%%%%%%%%%%%%%%MMMMMMMMMMMM',
    '%%%%%%%%%%%%%%%%%%%%%%%%MMMMMMMM',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%MMM%M',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%M%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
  ],
  // Blackdraw, the enclave (#845): the flue's mouth in the mountain's face at 10,3, drawn as stone and
  // walked into from the ash at 10,2. Grim's Howe, the lair (#845, #846): the way in under the dam's
  // crust at 20,14, drawn as stone with the rock either side and walked into from the flow at 20,13.
  exits: [
    anchored({ x: 10, y: 3, to: 'blackdraw', at: 'start', label: 'You go in at a mouth in the mountain\'s face, out of the wind and down into the dark.' }),
    anchored({ x: 20, y: 14, to: 'grims_howe', at: 'start', label: 'You stoop in under the dam, where its crust stands off the rock, and down into the warm dark.' }),
  ],
  features: [
    // In off F11's ash: the slope down to the mountain's wall, and the flow going down beside it.
    { kind: 'event', x: 20, y: 1, id: 'f12_down', once: true, text: 'The ash falls away south to the mountain\'s foot, and the flow goes down beside it into a cut.' },
    // Under the mountain's west wall, a cairn; on the slope, a man of stone calling to the mountain.
    { kind: 'cairn', x: 7, y: 1, id: 'f12_cairn', text: 'A cairn under the mountain\'s wall, slabs of the flow\'s black crust laid up tight as a wall.', gold: 100, items: ['potion_sp_great'] },
    { kind: 'statue', x: 16, y: 2, id: 'f12_caller', name: 'A man of stone', text: 'A man of stone with his hands cupped to his mouth, calling to the mountain. Words are cut below.', riddle: 'CALL TO THE MOUNTAIN AND I CALL BACK, IN YOUR OWN VOICE. WHAT AM I?', answer: 'echo', gift: { stat: 'intellect' }, done: 'The man of stone calls to the mountain still.' },
    // East of the flow, sulphur round the vents; the flow going down into its cut and stopped at the rim.
    { kind: 'event', x: 30, y: 1, id: 'f12_sulphur', once: true, text: 'Yellow crusts of sulphur ring the vents in the ash here, and the air catches in the throat.' },
    { kind: 'event', x: 25, y: 8, id: 'f12_cut', once: true, text: 'The flow goes down into a cut it made in the rim, glazed black, and every step in it has an echo.' },
    { kind: 'event', x: 22, y: 10, id: 'f12_end', once: true, text: 'Here the flow met the rim and stopped. Its front stands across the cut, a dam of black rock folded like rope.' },
    // The secret: flakes of black glass heaped at the rock's foot under the rim, and behind the rock a
    // knapper's store.
    { kind: 'event', x: 29, y: 11, id: 'f12_flakes', once: true, text: 'Flakes of black glass lie heaped at the foot of the rock here, swept together, and nowhere else.' },
    { kind: 'event', x: 29, y: 13, id: 'f12_store', once: true, text: 'A store in the rock, dry and warm: the best of the flow glass wrapped in hide on a ledge, and a purse.' },
    { kind: 'chest', x: 29, y: 14, id: 'f12_purse', gold: 100, items: ['elixir'] },
  ],
  secrets: [{ x: 29, y: 12, hint: 'f12_flakes' }],
};
