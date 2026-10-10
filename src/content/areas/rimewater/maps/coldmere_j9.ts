// Rimewater, box J9: Loch Fuar's far shore. Country, band 20-22, behind the road: the cold loch's west
// shore, its open water in the north-east corner and the ice along its strand; the old woman of Fuar in
// her turf hut on the strand, mending nets by the holes in the ice; the pines climbing west to the
// mountain's wall, a knoll with a cairn in them, the bell stone by the meadow and two ice bears; and
// under the mountain, where a trapper's blazes stop, his store behind the rock.
// In from K9 (#489) over its west edge, walked: K9's 0,0 to 0,31 meets 31,0 to 31,31 here square for
// square, the open water at rows 0 to 9, the ice at 10 and 11 and the pines below. I9's east edge (#503)
// is the Sheer Point's mountain, and J8 and J10 are not built, so the world ends past the other edges.
// Cut from the atlas by tools/scaffold.ts; docs/areas/rimewater.md §4.8 is its brief (#497).
import type { MapDef } from '../../../../game/map.ts';
import { WEST } from '../../../../game/types.ts';

export const COLDMERE_J9: MapDef = {
  id: 'coldmere_j9',
  name: 'Loch Fuar',
  kind: 'outdoor',
  density: 'country',
  band: [20, 22],
  region: 'rimewater',
  start: { x: 31, y: 20, facing: WEST },
  rows: [
    'ppppppppppiiiWWWWWWWWWWWWWWWWWWW',
    'pppppppppppiiiWWWWWWWWWWWWWWWWWW',
    'pppppppppppppiiiWWWWWWWWWWWWWWWW',
    'ppppppppppppppiiiiiWWWWWWWWWWWWW',
    'ppppppppppppppp_iiiiiiWWWWWWWWWW',
    'ppppppppppppppBB___iiiiiiiWWWWWW',
    'pppppppppppppppp,,,___iiiiiWWWWW',
    'ppppppppppppppppp,,,,,____iiWWWW',
    'Mppppppppppppppppp,,,,,,,,_iiWWW',
    'MMpppppppppppppppp,,,,,,,,_iiWWW',
    'MMppppppppppppppppp,,,,,,,,_iiii',
    'MMMppppppppppppppppp,,,,,,,,__ii',
    'MMMppppppppppppppppp,,,,,,,,pppp',
    'MMMpppppppppppppppppp,,,,,,,pppp',
    'MMMMppppppp^^^pppppppp,,,,,,pppp',
    'MMMMppppppp^^^pppppppp,,,,,ppppp',
    'MMMMpppppppp^pppppppppp,,,,ppppp',
    'MMMMpppppppppppppppppppp,,pppppp',
    'MMMMpppppppppppppppppppp,,pppppp',
    'MMMMpppppppppppppppppppppppppppp',
    'MMMrrppppppppppppppppppppppppppp',
    'MMr:Sppppppppppppppppppppppppppp',
    'MMMrrppppppppppppppppppppppppppp',
    'MMMMpppppppppppppppppppppppppppp',
    'MMMMpppppppppppppppppppppppppppp',
    'MMMMpppppppppppppppppppppppppppp',
    'MMMMMppppppppppppppppppppppppppp',
    'MMMMMppppppppppppppppppppppppppp',
    'MMMMpppppppppppppppppppppppppppp',
    'MMMMpppppppppppppppppppppppppppp',
    'MMMMpppppppppppppppppppppppppppp',
    'MMMMpppppppppppppppppppppppppppp',
  ],
  features: [
    // In from K9 under the pines, and the strand: the far shore's look back over the loch, the holes in
    // the ice, the old woman of Fuar at her hut's door with her bear, and her drying-ground on the meadow.
    { kind: 'event', x: 30, y: 21, id: 'j9_in', once: true, text: 'The pines go on west from the cold loch\'s shore, the ground lifting under them to a mountain\'s wall.' },
    { kind: 'event', x: 26, y: 8, id: 'j9_strand', once: true, text: 'The far shore\'s strand. The loch lies white from it to the pines on the other side, small and black.' },
    { kind: 'event', x: 23, y: 6, id: 'j9_holes', once: true, text: 'Holes cut in the ice in a row, skinned over again, a line frozen into each and nothing on the lines.' },
    { kind: 'npc', x: 16, y: 6, name: 'An old woman', lines: [
      'An old woman at a turf hut\'s door on the strand, a net across her knees, mending it with blue fingers.',
      '"I was a girl in Fuar, over there under the ice. I came round the shore when it rose, and I stayed."',
      '"White bears have the pines under the mountain, two of them. They had my dog."',
    ] },
    { kind: 'camp', x: 20, y: 9, name: 'The drying-ground', text: 'Net-poles on the meadow above the strand, a fish-rack, and a fire-pit with a windbreak of pine boughs.' },
    // The pines between the strand and the mountain: the knoll with its cairn, the bell stone by the
    // meadow, the mountain's wall and the old wood under it.
    { kind: 'cairn', x: 12, y: 15, id: 'j9_cairn', text: 'A cairn on a knoll among the pines, a fish-spear laid along its top and frozen there.', gold: 300, items: ['potion_sp_great'] },
    { kind: 'shrine', x: 24, y: 15, id: 'j9_shrine', text: 'A stone by the meadow cut with a bell, worn nearly smooth, and fresh pine laid on it.', stat: 'luck', done: 'The bell stone, a sprig of yours with the rest.' },
    { kind: 'event', x: 5, y: 11, id: 'j9_mountain', once: true, text: 'The mountain goes straight up out of the pines, ice in its cracks, and no way up it but by hand.' },
    { kind: 'event', x: 5, y: 3, id: 'j9_windthrow', once: true, text: 'Old pines thrown down by the wind one across another, and the snow under them unmarked.' },
    // The bears' pines under the mountain, the box's hardest, and the slope south.
    { kind: 'event', x: 11, y: 26, id: 'j9_bear_sign', once: true, text: 'A pine stripped of its bark higher than a man can reach, and the snow under it trodden flat.' },
    { kind: 'event', x: 24, y: 24, id: 'j9_deer', once: true, text: 'A deer\'s leg in the snow, picked clean, and no other trace of it.' },
    { kind: 'event', x: 18, y: 29, id: 'j9_south', once: true, text: 'The pines go on south down the slope, and through them, white and far, the peaks over the pass.' },
    { kind: 'event', x: 29, y: 30, id: 'j9_ravens', once: true, text: 'Ravens in the pine tops, quiet, every one of them turned to watch the strand.' },
    // The secret: a trapper's blazes going west through the pines to the mountain's foot, and the search
    // where they stop; his store behind the rock, with his strongbox.
    { kind: 'event', x: 9, y: 21, id: 'j9_blazes', once: true, text: 'An axe blaze on a pine at a man\'s height, and on the next, and the next, west to the mountain\'s foot.' },
    { kind: 'event', x: 3, y: 21, id: 'j9_store', once: true, text: 'Behind the rock a trapper\'s store: stretchers for pelts, snares on pegs, a strongbox under a lynx skin.' },
    { kind: 'chest', x: 3, y: 21, id: 'j9_strongbox', gold: 700, items: ['potion_sp_great'] },
  ],
  secrets: [{ x: 4, y: 21, hint: 'j9_blazes' }],
  encounters: [
    // Ice pike under the strand's ice by the old woman's holes, near the way in; and under the mountain
    // a pair of ice bears, the box's hardest.
    { id: 'j9_pike', x: 21, y: 4, monsters: ['ice_pike', 'ice_pike', 'ice_pike', 'ice_pike'], aware: 3, respawn: 1440, under: 'ice' },
    { id: 'j9_bears', x: 7, y: 28, monsters: ['ice_bear', 'ice_bear'], aware: 3, respawn: 2880 },
  ],
};
