// Rimewater, box N9: the glacier's edge. Country, band 20-21: the ice bears' ground under the glacier,
// east of Rime Lodge's box round the fells' shoulder. In from M9's pines at rows 9 and 10, the only
// way; the Rimefells closed along the north against N8, the pines and the bent woods down the middle,
// the moraine's hills, and the glacier's foot along the east and the south, ice under a mountain
// wall closed against O9 and N10 (call 7), with Glacier Foot's sliver in the corner drawn closed in
// it. The bears keep the ice wall's foot; the hunters' hide is in the fell's face behind a skull.
// Cut from the atlas by tools/scaffold.ts; docs/areas/rimewater.md §4.8 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST } from '../../../../game/types.ts';

export const LONGMERE_N9: MapDef = {
  id: 'longmere_n9',
  name: 'Loch Fada',
  kind: 'outdoor',
  density: 'country',
  band: [20, 21],
  region: 'rimewater',
  start: { x: 0, y: 10, facing: EAST },
  rows: [
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMrMMMMMMM',
    'pppMMMMMMMMMMMMMMMMMMMMr.rMMMMMM',
    'ppppppppppppMMMMMMMMMMMr.rMMMMMM',
    'ppppppppppppppppppppppMrSrMMMMMM',
    'ppppppppppppppppppppppppppMMMMMM',
    'ppppppppppppppppppppppppppppppMM',
    'ppppppppppptttttttpppppppppiiiMM',
    'pppppptttttttttttttppppppppiiiMM',
    'pptttttttttttttttttppppppppiiiMM',
    'pttttttttttttttttttttppppppiiiMM',
    'pttttttttttttttttttttttppppiiiMM',
    'ptttttttttttttttttttttttpp^iiiMM',
    'ptttttttttttttttttttttttt^^iiiMM',
    'pttttttttttttttttttttttt^^^iiiMM',
    'pptttttttttttttttttttttt^^^iiiMM',
    'pptttttttttttttttttttttt^^^iiiMM',
    'pptttttttttttttttttttttt^^^iiiMM',
    'pptttttttttttttttttttttt^^^iiiMM',
    'pttttttttttttttttttttttt^^^iiiMM',
    'pptttttttttttttttttttttt^^^iiiMM',
    'pptttttttttttttttttttttt^^^iiiMM',
    'ppttttttttttiiiiiiiiiiiiiiiiiiMM',
    'ppptttttttttiiiiiiiiiiiiiiiiiiMM',
    'ppptttttttttiiiiiiiiiiiiiiiiiiMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
  ],
  features: [
    // Round the fells' shoulder out of M9's pines, the glacier over everything.
    { kind: 'event', x: 3, y: 10, id: 'n9_shoulder', once: true, text: 'Round the fells\' shoulder the pines run on east, and over them the glacier, close now, blue in its cracks.' },
    { kind: 'cairn', x: 15, y: 11, id: 'n9_cairn', text: 'A cairn on the last of the pines\' open ground, the top stone set on edge, its face to the ice.', gold: 100, items: ['potion_heal'] },
    { kind: 'event', x: 10, y: 20, id: 'n9_woods', once: true, text: 'Birches among the pines, bent to the ground under the snow and frozen so, in hoops.' },
    { kind: 'camp', x: 5, y: 25, name: 'The cutters\' bothy', text: 'A bothy of piled stone where men once cut ice for the lodge\'s cellars, the roof sound and the hearth swept.' },
    // The moraine's hills and the ice wall over them, where the bears keep their ground.
    { kind: 'event', x: 24, y: 14, id: 'n9_moraine', once: true, text: 'Stones the size of huts, left where the glacier dropped them. Pines grow out of the tops of some.' },
    { kind: 'event', x: 28, y: 15, id: 'n9_wall', once: true, text: 'The glacier\'s foot: grey ice packed hard with grit, and the wall of it going up out of sight into cloud.' },
    { kind: 'event', x: 20, y: 28, id: 'n9_trodden', once: true, text: 'Under the ice wall the snow is trodden flat, and the bones in it are deer\'s, cracked for the marrow.' },
    { kind: 'event', x: 26, y: 22, id: 'n9_cave', once: true, text: 'A cave in the ice wall\'s foot, blue inside, the snow at its mouth trodden flat and stinking of bear.' },
    // The fell's face over the pines, a bear's skull before it, and the hunters' hide behind it.
    { kind: 'event', x: 24, y: 10, id: 'n9_skull', once: true, text: 'A bear\'s skull on a stake before the fell\'s face, turned to the glacier. Round the stake the snow is trodden.' },
    { kind: 'event', x: 24, y: 8, id: 'n9_hide', once: true, text: 'A hunters\' hide in the fell\'s face, lined with stone: bear hides stiff on their pegs, and a chest under them.' },
    { kind: 'chest', x: 24, y: 7, id: 'n9_hide_chest', gold: 200, items: ['elixir'] },
  ],
  secrets: [{ x: 24, y: 9, hint: 'n9_skull' }],
  encounters: [
    // Three snow lynxes in the pines round the shoulder, the nearer; and a pair of ice bears at the cave
    // in the ice wall's foot, the box's hardest.
    { id: 'n9_lynx', x: 8, y: 12, monsters: ['snow_lynx', 'snow_lynx', 'snow_lynx'], aware: 4, respawn: 1440 },
    { id: 'n9_bears', x: 25, y: 22, monsters: ['ice_bear', 'ice_bear'], aware: 3, respawn: 2880 },
  ],
};
