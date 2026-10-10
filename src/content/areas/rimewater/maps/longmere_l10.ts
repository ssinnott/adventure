// Rimewater, box L10: the cold loch's head. Country, band 20-21: the drove road down off the ridge from
// L9 and west across the box's corner for K10's bridge; the cold loch's east shore under the pines, its
// margin iced, the dead pines standing in the water and the old road going down into it; the ridge
// between the lochs running south down the middle; and east of it the pines and the meadow under the
// hills, a trapper's fire and the bears' ground; and the old trappers' store in the ridge's west foot.
// In from L9 by the road at 6,0 and 7,0, walked; out by the west edge at 0,3 onto K10's road at 31,3,
// walked (#497: the pass across the corner was taken, not walked, while the box was parked). The south
// edge meets L11; the east edge M10.
// Cut from the atlas by tools/scaffold.ts; docs/areas/rimewater.md §4.8 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const LONGMERE_L10: MapDef = {
  id: 'longmere_l10',
  name: 'Loch Fada',
  kind: 'outdoor',
  density: 'country',
  band: [20, 21],
  region: 'rimewater',
  start: { x: 6, y: 0, facing: SOUTH },
  rows: [
    'pppppp==ppppMMMMMMpppppppppp,,,,',
    'pppp===pppppMMMMMMpppppppppp,,,,',
    'pp===pppppppMMMMMMppppppppp,,,,,',
    '===ppppppppppMMMMMMpppppppp,,,,,',
    'pppppppppppppMMMMMMpppppppp,,,,,',
    'pppppppppprrrMMMMMMppppppp,,,,,,',
    'ppppppppppS:rMMMMMMppppppp,,,,,,',
    '~ppppppppprrrMMMMMMppppppp,,,,,,',
    '~~~ppppppppppMMMMMMpppppp,,,,,,,',
    '~~~~pppppppppMMMMMppppppp,,,,,,,',
    'WWWiipppppppMMMMMMppppppp,,,,,,,',
    'WWWWiippppppMMMMMpppppppp,,,,,,,',
    'WWWWiipppppMMMMMMpppppppp,,,^^,,',
    'WWWWWiippppMMMMMppppppppp,,,^^^^',
    'WWWWWiippppMMMMMppppppppp,,,^^^^',
    'WWWWWiipppMMMMMpppppppppp,,,^^^^',
    'WWWWWWiippMMMMMppppppppppp,,,,^^',
    'WWWWWWiippMMMMpppppppppppp,,,,,,',
    'WWWWWWiippMMMMpppppppppppp,,,,,,',
    'WWWWWWiippMMMMppppppppppppp,,,,,',
    'WWWWWWiippMMMMppppppppppppp,,,,,',
    'WWWWWWiippMMMMMppppppppppppp,,,,',
    'WWWWWWWiipMMMMMpppppppppppppp,,,',
    'WWWWWWWiipMMMMMMppppppppppppp,,,',
    'WWWWWWWiippMMMMMpppppppppppppp,,',
    'WWWWWWWiipppMMMMMppppppppppppp,,',
    'WWWWWWWiipppMMMMMpppppppppppppp,',
    'WWWWWWWiippppMMMMMpppppppppppppp',
    'WWWWWWWiipppppMMMMMppppppppppppp',
    'WWWWWWWiippppppMMMMppppppppppppp',
    'WWWWWWiiipppppppMMMMpppppppppppp',
    'WWWWWiippppppppppMMMMppppppppppp',
  ],
  features: [
    // The road down off the ridge to the cold loch's head, and west for K10's bridge.
    { kind: 'event', x: 3, y: 2, id: 'l10_road', once: true, text: 'The road comes down through the pines to the cold loch\'s head and bends west for the bridge.' },
    // The secret: the blazes on the pines in a line to the ridge's foot, ending at bare rock; the search
    // there, and the old trappers' store behind it.
    { kind: 'event', x: 8, y: 6, id: 'l10_blazes', once: true, text: 'Blazes on the pines in a line to the ridge\'s foot, the cuts old and black with resin, and the line ends at bare rock.' },
    { kind: 'event', x: 11, y: 6, id: 'l10_store', once: true, text: 'Behind the rock a store cut into the ridge: traps hung rusting from pegs, and a box sealed with pitch.' },
    { kind: 'chest', x: 11, y: 6, id: 'l10_box', gold: 200, items: ['elixir'] },
    { kind: 'event', x: 3, y: 6, id: 'l10_head', once: true, text: 'The cold loch\'s head: the river comes in black under the bridge, and past it the ice, white to the far shore.' },
    // The loch's east shore under the pines: its margin iced, the dead pines out in the water, the old
    // road going down into it, the fishers' shelter and a cairn at the water's edge.
    { kind: 'event', x: 7, y: 12, id: 'l10_trees', once: true, text: 'Dead pines stand out in the loch to their knees, grey and barkless, the ice set round them.' },
    { kind: 'event', x: 9, y: 24, id: 'l10_drowned', once: true, text: 'An old road comes down out of the pines and on into the loch, its kerbstones going out under the ice.' },
    { kind: 'camp', x: 10, y: 28, name: 'The fishers\' shelter', text: 'A shelter of boughs on the shore, holes cut in the ice below it and frozen over, and creels left to rot.' },
    { kind: 'cairn', x: 12, y: 30, id: 'l10_cairn', text: 'A cairn at the water\'s edge, the stones heaped high, and a drover\'s crook laid along the top.', gold: 100, items: ['potion_sp_great'] },
    // East of the ridge: the scree off its flank, the holed stone in the meadow, the hills and the
    // trapper at his fire with the cats' country south of him; and the bears' ground in the far pines.
    { kind: 'event', x: 20, y: 3, id: 'l10_scree', once: true, text: 'Scree down the ridge\'s flank into the pines, the stones fresh on the snow from a fall in the night.' },
    { kind: 'shrine', x: 28, y: 7, id: 'l10_stone', text: 'A standing stone in the meadow with a hole worn through it, and through the hole, the glacier.', stat: 'endurance', done: 'The holed stone, and the glacier through it.' },
    { kind: 'event', x: 28, y: 14, id: 'l10_hills', once: true, text: 'From the hills the pines run east under the glacier, and the ice hangs over them out of the cloud, blue at its foot.' },
    { kind: 'npc', x: 24, y: 22, name: 'A trapper', lines: [
      'A trapper at a fire in the lee of the pines, pelts on frames round him, and a grey cat\'s among them.',
      '"More cats every winter. Take one and two come."',
      '"South, under the ridge\'s end, the pines are theirs. I set no wire there."',
    ] },
    { kind: 'event', x: 22, y: 27, id: 'l10_kill', once: true, text: 'A hind dragged in under the pines and half buried in the snow, and round it the snow trodden by something heavy.' },
    { kind: 'event', x: 19, y: 18, id: 'l10_split', once: true, text: 'A pine split by the frost from crown to root, the two halves standing apart, and snow between them.' },
  ],
  secrets: [{ x: 10, y: 6, hint: 'l10_blazes' }],
  encounters: [
    // Ice pike under the cold loch's shore ice, nearest the way in; and in the far pines east of the
    // ridge, where the hind was dragged, the box's hardest, two ice bears.
    { id: 'l10_pike', x: 5, y: 14, monsters: ['ice_pike', 'ice_pike'], aware: 3, respawn: 1440, under: 'ice' },
    { id: 'l10_bears', x: 25, y: 29, monsters: ['ice_bear', 'ice_bear'], aware: 3, respawn: 2880 },
  ],
};
