// Rimewater, box M10: Loch Fada's foot. Country, band 20-21: the long loch on south from M9, open
// water under the lodge's shore and frozen to its foot, the far shore's grass and hills on the west
// against L10, the east shore under the ridge, and the lynx's pines past the ridge, with the burn
// down off the glacier frozen white through them. The fishers' camp is on the east shore and their
// ice-house in the bank by the burn's mouth; pike under the ice, and bears in the pines past the burn.
// Cut from the atlas by tools/scaffold.ts; docs/areas/rimewater.md §4.8 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const LONGMERE_M10: MapDef = {
  id: 'longmere_m10',
  name: 'Loch Fada',
  kind: 'outdoor',
  density: 'country',
  band: [20, 21],
  region: 'rimewater',
  start: { x: 16, y: 0, facing: SOUTH },
  rows: [
    ',_~~WWWWWWWWW~~,,,,^^MMppppppppp',
    ',_~~WWWWWWWWW~~,,,,^^MMppppppppp',
    ',_~~WWWWWWWWW~~,,,,^^^Mppppppppp',
    ',,_~~WWWWWWWW~~,,,,^^^MMpppppppp',
    ',,_iiiiiiiiiiii,,,,^^^MMpppppppp',
    ',,_iiiiiiiiiiii_,,,,^^MMpppppppp',
    ',,_iiiiiiiiiiii_,,,,^pMMMppppppp',
    ',,_iiiiiiiiiiii_,,,,^ppMMppppppp',
    ',,_iiiiiiiiiii_,,,,,,ppMMppppppp',
    ',,_iiiiiiiiiii_,,,,,pppMMppppppp',
    ',,_iiiiiiiiiiii_,,,,,ppMMppppppp',
    ',,_iiiiiiiiiiii_,,,,pppMMppppppp',
    ',^^_iiiiiiiiiii_,,,,pppMMppppppp',
    '^^^^iiiiiiiiiii_,,,ppppMMppppppp',
    '^^^^iiiiiiiiii_,,,,pppMMMppppppp',
    '^^^^^iiiiiiiii_,,,,pppMMMppppppp',
    '^^^^^iiiiiiiii_,,,pppMMMMppppppp',
    ',^,,_iiiiiiii_,,,iiiiiiiiiiiiipp',
    ',,,,,_iiiiiii_,,,iiiiiiipiiiiiii',
    ',,,,,,iiiiiii^^^^ppMMMMppppppppi',
    ',,,,,,iiiiii^^^^^rrrrMMppppppppp',
    ',,,,,,iiiii_^^^ppS..rMMppppppppp',
    ',,,,,,,iiii_,,ppprrrrMMppppppppp',
    ',,,,,,,,iii_,,pppMMMMMMppppppppp',
    ',,,,,,,,_ii_,ppppMMMMMMppppppppp',
    ',,,,,,,,,__,pppppMMMMMMppppppppp',
    ',,,,,,,,,ppppppppMMMMMMppppppppp',
    ',,,,,,,,,ppppppppMMMMMMppppppppp',
    'pppppppppppppppppMMMMMMppppppppp',
    'ppppppppppppppppppMMMMMMpppppppp',
    'pppppppppppppppppppMMMMMpppppppp',
    'ppppppppppppppppppppMMMMMppppppp',
  ],
  features: [
    // Down the east shore from the lodge's, the loch open under it and frozen from there to its foot.
    { kind: 'event', x: 17, y: 3, id: 'm10_shore', once: true, text: 'The loch runs on south from the lodge, open water under the shore and then ice to its foot, grey and long.' },
    { kind: 'camp', x: 17, y: 9, name: 'The fishers\' camp', text: 'The fishers\' camp on the east shore: a turf hut, a drying frame with nothing on it, and a fire kept low.' },
    { kind: 'npc', x: 18, y: 10, name: 'An ice fisher', lines: [
      'An ice fisher by the fire, mending a net with fingers that will not close.',
      '"Pike under all of it. They come up where the ice is thin and take what stands there."',
      '"Bears come down the burn off the glacier when the hunting is poor up on the ice."',
    ] },
    { kind: 'event', x: 10, y: 14, id: 'm10_holes', once: true, text: 'Holes cut in the ice in a row, skinned over. By the last of them a pike\'s head, frozen, as long as an arm.' },
    // The burn down off the glacier, frozen through the ridge, and the lynx's pines either side of it.
    { kind: 'event', x: 24, y: 17, id: 'm10_burn', once: true, text: 'The burn comes down off the glacier frozen white, and under the ice of it the water still runs, loud.' },
    { kind: 'event', x: 27, y: 11, id: 'm10_pines', once: true, text: 'Pines close under the ridge. On trunk after trunk the bark is scored through at a man\'s height, claw by claw.' },
    { kind: 'cairn', x: 27, y: 4, id: 'm10_cairn', text: 'A cairn under the ridge where the pines begin, a fisher\'s float of glass wedged in its top stones.', gold: 100, items: ['potion_sp_great'] },
    { kind: 'event', x: 28, y: 29, id: 'm10_prints', once: true, text: 'Prints in the snow as wide as a shield, and high on the pines the bark torn where something stood to reach.' },
    // The bank by the burn's mouth, and behind its turf the fishers' ice-house.
    { kind: 'event', x: 16, y: 21, id: 'm10_runners', once: true, text: 'Sledge runs in the snow, up from the holes in the ice. They stop at the bank.' },
    { kind: 'event', x: 18, y: 21, id: 'm10_icehouse', once: true, text: 'An ice-house cut into the bank, the turf its door: the catch stacked in straw, frozen hard, and a box under it.' },
    { kind: 'chest', x: 19, y: 21, id: 'm10_icehouse_chest', gold: 200, items: ['elixir'] },
    // The far shore and the loch's foot.
    { kind: 'event', x: 4, y: 22, id: 'm10_far_shore', once: true, text: 'The loch\'s far shore, white to the water. Across the ice the fishers\' smoke stands up straight.' },
    { kind: 'event', x: 10, y: 25, id: 'm10_boat', once: true, text: 'The loch\'s foot: reeds frozen into the ice, and a boat among them keel up, its planks sprung.' },
    { kind: 'event', x: 10, y: 29, id: 'm10_south', once: true, text: 'The pines close in south of the loch, the snow under them unmarked but for a hare\'s.' },
  ],
  secrets: [{ x: 17, y: 21, hint: 'm10_runners' }],
  encounters: [
    // Ice pike under the ice off the fishers' holes, the nearer group; and a pair of ice bears in the
    // pines past the burn, the box's hardest, come down off the glacier.
    { id: 'm10_pike', x: 8, y: 9, monsters: ['ice_pike', 'ice_pike'], aware: 3, respawn: 1440, under: 'ice' },
    { id: 'm10_bears', x: 27, y: 25, monsters: ['ice_bear', 'ice_bear'], aware: 3, respawn: 2880 },
  ],
};
