// Rimewater, box M11: the pines under the rim. Country, band 20-21: the lynx's pinewood on south
// from the loch's foot, the marsh at its west edge against L11, the ridge running down from M10 to
// the glacier on the east, its Glacier Foot sliver drawn closed (call 7), and the range of the rim
// along the south, the world's end past it but for what the atlas cuts. The trappers' lean-to in the
// pines and their line of snares to the range's foot, where their cache lies in a cleft of the rock;
// lynx in the pines by the loch's foot, and bears under the rim.
// Cut from the atlas by tools/scaffold.ts; docs/areas/rimewater.md §4.8 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const LONGMERE_M11: MapDef = {
  id: 'longmere_m11',
  name: 'Loch Fada',
  kind: 'outdoor',
  density: 'country',
  band: [20, 21],
  region: 'rimewater',
  start: { x: 10, y: 0, facing: SOUTH },
  rows: [
    'ppppppppppppppppppppMMMMMMpppppp',
    'pppppppppppppppppppppMMMMMpppppp',
    'pppppppppppppppppppppMMMMMMppppp',
    'ppppppppppppppppppppppMMMMMMpppp',
    'pppppppppppppppppppppppMMMMMMppp',
    'ppppppppppppppppppppppppMMMMMMpM',
    'ppppppppppppppppppppppppMMMMMMMM',
    'pppppppppppppppppppppppppMMMMMMM',
    'pppppppppppppppppppppppppMMMMMMM',
    'ppppppppppppppppppppppppppMMMMMM',
    'ppppppppppppppppppppppppppMMMMMM',
    'wpppppppppppppppppppppppppMMMMMM',
    'wppppppppppppppppppppppppppMMMMM',
    'wppppppppppppppppppppppppppMMMMM',
    'wwppppppppppppppppppppppppppMMMM',
    'wwpppppppppppppppppppppppppppMMM',
    'wwppppppppppppppppppppppppppppMM',
    'wwpppppppppppppppppppppppppppppM',
    'wppppppppppppppppppppppppppppppp',
    'pppppppppppppppppppppppppppppMpM',
    'pppppppppppppppppppppppppppppMMM',
    'ppppppppppppppppppppppppppppMMMM',
    'ppppppppppMMrSrMMMppppppppp^^MMM',
    'pppppppMMMMMr.rMMMMMMppppp^^MMMM',
    'ppppMMMMMMMMr.rMMMMMMMMMM^^^MMMM',
    'pMMMMMMMMMMMMrMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMM%%%M%%%MMMMMMMMMMM%%%',
  ],
  features: [
    // Out of the pines at the loch's foot into the pinewood, the ridge on the east.
    { kind: 'event', x: 6, y: 4, id: 'm11_pinewood', once: true, text: 'The pinewood runs on south from the loch\'s foot to the rim, dark, and the snow under it is printed round.' },
    { kind: 'event', x: 28, y: 2, id: 'm11_under_ridge', once: true, text: 'Under the ridge\'s far side the pines end at the ice. The glacier\'s light comes up blue through the trunks.' },
    { kind: 'cairn', x: 22, y: 8, id: 'm11_cairn', text: 'A cairn at the ridge\'s foot, a lynx\'s skull on its top stone with the snow in its eyes.', gold: 100, items: ['potion_heal'] },
    { kind: 'event', x: 4, y: 15, id: 'm11_marsh', once: true, text: 'The pines stand back from a marsh, its sedge frozen in the ice and its black water under.' },
    { kind: 'npc', x: 13, y: 11, name: 'A trapper', lines: [
      'A trapper among the pines, a lynx\'s pelt over his shoulder and the snow to his knees.',
      '"The lynx walk where you walk. Look up as often as you look down."',
      '"Not under the rim. The bears den up there, and the snares come back empty."',
    ] },
    { kind: 'event', x: 24, y: 13, id: 'm11_ridge', once: true, text: 'The ridge goes down to the ice on the east, its crags hung with snow that has not moved all winter.' },
    // The trappers' lean-to, and their snares in a line to the range's foot and the cache in its rock.
    { kind: 'camp', x: 7, y: 19, name: 'The trappers\' lean-to', text: 'A lean-to of pine boughs against a fallen trunk, the fire ring cold, the stretching frames bare.' },
    { kind: 'event', x: 13, y: 20, id: 'm11_snares', once: true, text: 'Snares on the pines, one to a trunk, all sprung and all empty, in a line that runs to the rock.' },
    { kind: 'event', x: 13, y: 23, id: 'm11_cache', once: true, text: 'A cleft in the rock, dry: pelts in bundles stiff with frost, and a strongbox under them.' },
    { kind: 'chest', x: 13, y: 24, id: 'm11_cache_chest', gold: 200, items: ['potion_sp_great'] },
    { kind: 'event', x: 4, y: 22, id: 'm11_rim', once: true, text: 'The range of the rim stands up white over the last pines, and nothing walks on it.' },
    { kind: 'event', x: 24, y: 21, id: 'm11_hollow', once: true, text: 'A hollow under the rim\'s crags, the snow in it pressed down in a bed as long as two men.' },
  ],
  secrets: [{ x: 13, y: 22, hint: 'm11_snares' }],
  encounters: [
    // Three snow lynxes in the pines by the loch's foot, the nearer; and a pair of ice bears under the
    // rim, the box's hardest.
    { id: 'm11_lynx', x: 14, y: 5, monsters: ['snow_lynx', 'snow_lynx', 'snow_lynx'], aware: 4, respawn: 1440 },
    { id: 'm11_bears', x: 21, y: 19, monsters: ['ice_bear', 'ice_bear'], aware: 3, respawn: 2880 },
  ],
};
