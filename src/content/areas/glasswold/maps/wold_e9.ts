// The Glasswold, box E9: the hills behind the road. Country, band 26-27: the hills between the steppe and
// the inland sea, walked into over the south edge from the road over the Cinder Hills (E10) or over the
// west edge off the steppe (D9). Brown hills in long backs, the most of the box, the Waste's ash drifted
// up their south side, and the steppe down the west; north and east of them the sea grass, the Riders'
// summer pasture, their herds and their summer camp on it, running down to the sand and the sea.
// Vultures sit the crest over a horse they picked; a pride follows the herds at the pasture's south end,
// vultures with it; on the hills' north end, over the sea, two basilisks, and a ewe that went up there
// and stands for ever. The herders' store is dug into a hill where their path stops at a slab. E8, the
// shore, is north; F9, Ashfall's coast, east, is not built, so the world ends past the east edge.
// Cut from the atlas by tools/scaffold.ts, the south edge laid square for square to E10's north;
// docs/areas/glasswold.md §4.9 is its brief (#534).
import type { MapDef } from '../../../../game/map.ts';
import { NORTH } from '../../../../game/types.ts';

export const WOLD_E9: MapDef = {
  id: 'wold_e9',
  name: 'The Wold',
  kind: 'outdoor',
  density: 'country',
  band: [26, 27],
  region: 'glasswold',
  start: { x: 4, y: 31, facing: NORTH },
  rows: [
    'ssssssssssssssss,,,,__~~~WWWWWWW',
    'ssssssssssssssssss,,,,__~~WWWWWW',
    'ssssssssssssssssss,,,,,,_~~WWWWW',
    'ssssssssssssssssss,,,,,,_~~WWWWW',
    'sssssssssssssssssss,,,,,,_~~WWWW',
    'ssssssssssssssss^^s,,,,,,_~~~~W~',
    'ssssssssssssssss^^s,,,,,,,_~~~~~',
    'ssssssssssssssss^^s,,,,,,,,___~_',
    'sssssssss^sssss^^^s,,,,,,,,,,,_,',
    'ssssssss^^^sss^^^^^,,,,,,,,,,,,,',
    'ssssss^^^s^^^^^^^^^^,,,,,,,,,,,,',
    'ssssss^^^^^^^^^^^^^^,,,,,,,,,,,,',
    'sssss^^^^^^^^^^^^^^^,,,,,,,,,,,,',
    'ssss^^^^^^^^^^^^^^^^,,,,,,,,,,,,',
    'ssss^^^^^^^^^^^^^^^,,,,,,,,,,,,,',
    'sss^^^^^^^^^^^^^^^^,,,,,,,,,,,^^',
    'ss^^^^^^^rrrr^^^^^^,,,,,,,,,,,^^',
    's^^^^^^^^r::S^^^^^^,,,,,,,,,,,^^',
    's^^^^^^^^rrrr^^^^^^,,,,,,,,,,,^^',
    'sss^^^^^^^^^^^^^^^s,,,,,,,,,,,^^',
    'ssss^^^^^^^^^^^^^ss,,,,,,,,,,,^^',
    'ssss^^^^^^^^^^^^^ss,,,,,,,,,,,^^',
    'ssss^^^^^^^^^^^^sss,^^^^,,,,,,^^',
    'ssss^^^^^^^^^^^^ss,^^^^^^,,,,^^^',
    'sss^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
    's^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^a',
    's^^^^sss^^^^^^^^^^^^^^^^^^^aaaaa',
    'ss^^^sss^^^^^^^^^^^^^^^a^^aaaaaa',
    'ss^^^sss^^^^^^^^^^^^^^^aaaaaaaaa',
    's^^^ssss^^^^^^^^^^^^^aaaaaaaaaaa',
    'ssssssss^^^^^sss,,^aaaaaaaaaaaaa',
    'sssssss^^^^^^sss,,,aaaaaaaaaaaaa',
  ],
  features: [
    // Up from the road onto the hills' south side: the hills and the pale sky over them, the Waste's ash
    // drifted up to the grass, the folds out of the wind and a horse the vultures picked.
    { kind: 'event', x: 5, y: 28, id: 'e9_hills', once: true, text: 'North the hills go up in long brown backs, and over them the sky is pale, as it is over water.' },
    { kind: 'event', x: 27, y: 28, id: 'e9_ash', once: true, text: 'The Waste\'s ash lies in drifts up the hills\' south side and stops, as if the grass held it off.' },
    { kind: 'event', x: 9, y: 27, id: 'e9_folds', once: true, text: 'The hills fold one into another. In the folds the grass is still green, and the wind does not come.' },
    { kind: 'event', x: 13, y: 23, id: 'e9_bones', once: true, text: 'A horse\'s bones on the hillside, picked white. The vultures that picked them sit along the crest.' },
    { kind: 'shrine', x: 21, y: 22, id: 'e9_shrine', text: 'A horse\'s skull on a pole on the rise, facing the sea, its eyes stuffed with grass.', stat: 'personality', done: 'The skull on its pole, the grass in its eyes stirring.' },
    // The steppe down the west, Akordu's smoke far off over it; the herders' path into the hills and the
    // slab it stops at; a Riders' cairn on a hilltop.
    { kind: 'event', x: 1, y: 16, id: 'e9_steppe', once: true, text: 'West the steppe runs flat and empty to the sky. A thread of smoke stands up from Akordu, far off.' },
    { kind: 'event', x: 13, y: 17, id: 'e9_path', once: true, text: 'A path worn by hooves and sledge-runners comes up the hillside and stops dead at a slab of grey stone.' },
    { kind: 'event', x: 11, y: 17, id: 'e9_store', once: true, text: 'Behind the slab the hill is hollow and dry: yurt poles, felts rolled in fat and an iron-bound box.' },
    { kind: 'chest', x: 10, y: 17, id: 'e9_strongbox', gold: 1200, items: ['potion_sp_great'] },
    { kind: 'cairn', x: 10, y: 12, id: 'e9_cairn', text: 'A Riders\' cairn on the hilltop, a lance-head on it rusted red, pointing at the sea.', gold: 400, items: ['elixir'] },
    // The hills' north end over the sea: the view from the brow, and a ewe that went up there.
    { kind: 'event', x: 16, y: 9, id: 'e9_brow', once: true, text: 'From the hills\' north brow the land falls away to the sea: the steppe, the summer grass and the water grey beyond.' },
    { kind: 'event', x: 13, y: 8, id: 'e9_ewe', once: true, text: 'A ewe stands at the hill\'s foot, grey through and through, stone. Her head is turned back over her shoulder.' },
    // The sea grass, the Riders' summer pasture: the steppe cropped short, the herds down to the sand, the
    // sea, the summer camp and its two who talk; east the coast toward the Waste, where no herd goes.
    { kind: 'event', x: 5, y: 4, id: 'e9_cropped', once: true, text: 'The steppe runs on north to the shore, its grass cropped short by the herds and their dung everywhere.' },
    { kind: 'event', x: 22, y: 5, id: 'e9_herd', once: true, text: 'The Riders\' herds graze the sea grass down to the sand, mares and foals, two boys on ponies riding round them.' },
    { kind: 'event', x: 28, y: 7, id: 'e9_sea', once: true, text: 'The grass gives out to sand, and the sand to the sea, flat and grey to the sky\'s edge. The wind off it is cold.' },
    { kind: 'camp', x: 24, y: 13, text: 'The Riders\' summer camp: three yurts of white felt on the sea grass, a dung fire smoking before them.' },
    { kind: 'npc', x: 23, y: 12, name: 'A herder at the yurts', lines: [
      'A Rider in a felt hat sits mending a bridle by the fire, one eye on the herd.',
      '"Every summer we bring the herds down to the sea grass, and every summer the lions come after them."',
      '"Keep off the hills\' north end. The ewes go up there and stand still for ever."',
    ] },
    { kind: 'npc', x: 25, y: 14, name: 'A boy with a foal', lines: [
      'A boy leads a foal along the yurts on a rope, talking to it.',
      '"Mares swim, if you make them. Lions will not."',
    ] },
    { kind: 'event', x: 30, y: 12, id: 'e9_coast', once: true, text: 'East the coast runs on under the hills toward the Waste\'s smoke. No Rider takes a herd that way.' },
  ],
  secrets: [{ x: 12, y: 17, hint: 'e9_path' }],
  encounters: [
    // From the way in: the vultures along the crest over the horse they picked, the pride at the pasture's
    // south end, after the herd, with its own vultures; and on the hills' north end, over the sea, the two
    // basilisks, the hardest.
    { id: 'e9_vultures', x: 14, y: 21, monsters: ['vulture', 'vulture', 'vulture'], aware: 3, respawn: 2880 },
    { id: 'e9_pride', x: 22, y: 20, monsters: ['wold_lion', 'wold_lion', 'wold_lion', 'wold_lion', 'vulture', 'vulture', 'vulture'], aware: 4, respawn: 2880 },
    { id: 'e9_basilisks', x: 16, y: 6, monsters: ['basilisk', 'basilisk'], aware: 3, respawn: 2880 },
  ],
};
