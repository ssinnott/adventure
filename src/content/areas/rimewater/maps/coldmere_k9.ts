// Rimewater, box K9: Loch Fuar, the cold loch. Core, band 20-22: the loch's open water along the north
// rows with its shore frozen, and its arm frozen to the bottom down the box's middle, walked; under the
// arm's ice the drowned village of Fuar, its bell tower's cap standing out of it; the old shore's bank
// on its west side, where the loch rose, and the woman of the lodge's house-place above it; the meadows
// under snow with the pines behind them; a knoll east over the ice; and at the arm's foot, down a crack
// in the ice, a wall of grey with a door in it, the way to the Sleepers' Bay (#490, DOOR).
// In from L9 (#488) over its west edge, walked, anywhere along the pines; the way in is 31,21. The
// north and west edges end the world against parked K8 and J9, and the south edge meets K10 (#491)
// square for square, where the loch's water runs in at 29,31.
// Cut from the atlas by tools/scaffold.ts; docs/areas/rimewater.md §4.5 is its brief.
import type { Exit, MapDef } from '../../../../game/map.ts';
import { SOUTH, WEST } from '../../../../game/types.ts';
import { WENNA_UP } from './rime_lodge.ts';

/**
 * The way down to the Sleepers' Bay (#490): the door in the wall of grey at the crack's foot, 24,30,
 * which opens for one hand in the world (docs/areas/rimewater.md §5, call 4), shut to a company that
 * has not met the girl out of the hole (`WENNA_UP`), with its reason on it. It lands on the bay's stair
 * at 8,1, facing south, a guess #490 may move. An exit leads only to a built map, so the bay lists it in
 * this map's exits, opens the square, drops `k9_door`, signs the lock in to src/content/locks.ts and
 * adds the way back up onto 24,29, the crack's foot.
 */
export const DOOR: Exit = { x: 24, y: 30, to: 'sleepers_bay', tx: 8, ty: 1, tf: SOUTH, needFlag: WENNA_UP,
  blockedText: 'A wall of grey under the ice, with a door in it: no handle, no seam, and no frost on it anywhere.',
  label: 'The door opens under her palm, and she waits at it while you go down.' };

export const COLDMERE_K9: MapDef = {
  id: 'coldmere_k9',
  name: 'Loch Fuar',
  kind: 'outdoor',
  density: 'core',
  band: [20, 22],
  region: 'rimewater',
  start: { x: 31, y: 21, facing: WEST },
  rows: [
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWiii',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWiii',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWiiiip',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWiiippp',
    'WWWWWWWWWWWWWWWWWiiWWWWWiiippppp',
    'WWWWWWWWWWWWWWWWiiiiiiiiiiippppp',
    'WWWWWWWWWiiiiiiiippiiiiipppppppp',
    'WWWWWWWWiiiiiiiippii__pppppppppp',
    'WWWWWWiiippppppp,iii,,,,,,pppppp',
    'WWiiiiiipppp,pp,,ii,,,,,,,pppppp',
    'iiiiiipppp,,,,,,,iii,,,,,,p^^ppp',
    'iipppppppp,,,,,,,,iii,,,,p^^^ppp',
    'ppppppppp,,,,,,,,,,,ii,,,pp^^ppp',
    'pppppppp,,,,,,,,,,,,iii,,,pppppp',
    'ppppppp,,,,,,,,,,,iiiiii,,pppppp',
    'ppppp,,,,,,,,,,,iiiiiiiii,,,pppp',
    'pppp,,,,,,,,^^,iiiiiiiiiii,,pppp',
    'pppp,,^,,,,rrriiiiiiiiiiii,,pppp',
    'ppp,,,^^**,r:S""""""Biiiiii,,,pp',
    'ppp,,,,,**,rrriiiiiiiiiiiii,,,pp',
    'pp,,,,,,,,,,^^,iiiiiiiiiiii,,,pp',
    'ppp,,,,,,,,,,,,,iiiiiiiiiii,,,pp',
    'ppp,,,,,,,,,,,,,,,iiiiiiiii,,,pp',
    'ppp,,,,,,,,,,,,,,,,,,,iiiii,,,pp',
    'pppp^^,,,,,,,,,,,,,,,,,,iiii,ppp',
    'ppppp^^,,,,,,^,,,,,,,,,,iiii,ppp',
    'ppppp^^^^^^^^^,,,,,,,iiiiiiiippp',
    'ppppppp^^^^^^^,,,,,,,iii:iiiippp',
    'pppppppp^^^^^^,,,,,,,iii:iiiippp',
    'ppppppppp^^^^^^,,,,,,iii:iiiiipp',
    'pppppppppp,^^^^,,,,,,i#####iiipp',
    'ppppppppppppp^,,,,,,,iiiiiiii~pp',
  ],
  features: [
    // In from L9 over the pines: the way in above the loch, the lynx's kill, and the knoll east over
    // the ice, the lookout.
    { kind: 'event', x: 30, y: 21, id: 'k9_in', once: true, text: 'The pines end above the cold loch. Ice from shore to shore, and nothing on it moves.' },
    { kind: 'event', x: 28, y: 7, id: 'k9_kill', once: true, text: 'A hare\'s scut and a spatter of blood on the snow under a pine, and no tracks going away.' },
    { kind: 'event', x: 27, y: 11, id: 'k9_lookout', once: true, text: 'From the knoll the loch lies white to its far shore, and dark under the ice are the shapes of roofs.' },
    // The north shore: the strand, the open water at the ice's end and a camp in the pines' lee.
    { kind: 'event', x: 20, y: 7, id: 'k9_strand', once: true, text: 'A strand of grey sand under the snow, and a boat on it turned over, its planks sprung by the frost.' },
    { kind: 'event', x: 7, y: 8, id: 'k9_open', once: true, text: 'The shore ice ends at open water, black, and smoking in the cold.' },
    { kind: 'camp', x: 12, y: 9, name: 'A fowlers\' camp', text: 'A fire-ring in the pines\' lee, a sledge with its runners broken, and nets frozen stiff on a frame.' },
    // The arm's ice over the drowned village of Fuar: its bell tower's cap out of the ice (#56's 42,
    // whose bell is #494's), the street under the ice, and the strip of clear ice over the stones laid
    // from the village to the bank.
    { kind: 'event', x: 20, y: 17, id: 'k9_tower', once: true, text: 'The cap of a bell tower stands out of the ice, its slates furred with frost. Below it the ice is black.' },
    { kind: 'event', x: 22, y: 21, id: 'k9_street', once: true, text: 'Through the ice a street: a roof\'s ridge, a chimney\'s top, a cart. Nothing in it has moved.' },
    { kind: 'event', x: 16, y: 18, id: 'k9_strip', once: true, text: 'Black ice, and one strip of it clear to the bottom. Stones under it, laid too square, going to the bank.' },
    // The old shore's bank, where the loch rose: its cairn, and behind the face where the stones stop,
    // the smith's hole, dry, with his iron. Above the bank the house-place of the lodge woman's people.
    { kind: 'cairn', x: 13, y: 16, id: 'k9_cairn', text: 'A cairn on the old bank, where the loch\'s shore was, a fish-spear standing in its top.', gold: 300, items: ['potion_sp_great'] },
    { kind: 'event', x: 12, y: 18, id: 'k9_hole', once: true, text: 'A hole under the bank, dry as a chest: a smith\'s tongs, a cold crucible, and iron in greased hide.' },
    { kind: 'chest', x: 12, y: 18, id: 'k9_iron', gold: 800, items: ['bear_spear+1', 'lann_fuar'] },
    { kind: 'event', x: 9, y: 18, id: 'k9_hearth', once: true, text: 'A hearth-stone on the old shore, swept clean, and the line of a house\'s walls round it under the drift.' },
    // The far shore, the bears': the pike they took off the ice; and the hills south-west over the loch.
    { kind: 'event', x: 3, y: 23, id: 'k9_bones', once: true, text: 'Pike bones on the far shore, a fish as long as a man split open, and prints round it as wide as a shield.' },
    { kind: 'event', x: 12, y: 30, id: 'k9_hills', once: true, text: 'From the hills the cold loch\'s whole length, and south of it the pass, white between two peaks.' },
    { kind: 'shrine', x: 17, y: 25, id: 'k9_shrine', text: 'A shrine on the shore: a stone with a fish cut in it, and crusts of bread frozen to its top.', stat: 'endurance', done: 'The shrine on the shore, a crust of yours frozen with theirs.' },
    // The arm's foot: the water running in from the south, the crack in the ice, and at its foot the
    // wall of grey with the door in it, the step (§5); after the fourth night the girl out of the hole
    // waits there.
    { kind: 'event', x: 28, y: 30, id: 'k9_foot', once: true, text: 'At the loch\'s foot the ice gives out, and black water runs in under it from the south, smoking.' },
    { kind: 'event', x: 24, y: 27, id: 'k9_crack', once: true, text: 'A crack in the ice, a stride wide, going down into the dark. Its edges are worn smooth.' },
    { kind: 'event', x: 24, y: 29, id: 'k9_door', text: 'A wall of grey under the ice, with a door in it: no handle, no seam, and no frost on it anywhere.' },
    { kind: 'npc', x: 24, y: 28, name: 'The girl out of the hole', after: { flag: WENNA_UP }, lines: [
      'The girl out of the hole, waiting at the door. She lays her palm on it.',
      'A soft voice in the wall: "Captain?" She flinches.',
    ] },
  ],
  secrets: [{ x: 13, y: 18, hint: 'k9_strip' }],
  encounters: [
    // Snow lynxes in the shore's pines, by the way in and by the arm's foot, on the north shore and the
    // far one; ice pike under the arm's ice, and over the tower by night (#56's 42 walks over them);
    // and on the far shore and its hills the ice bears in pairs, the box's hardest.
    { id: 'k9_lynx_pines', x: 29, y: 16, monsters: ['snow_lynx', 'snow_lynx', 'snow_lynx', 'snow_lynx', 'snow_lynx'], aware: 4, respawn: 1440 },
    { id: 'k9_lynx_foot', x: 30, y: 27, monsters: ['snow_lynx', 'snow_lynx', 'snow_lynx', 'snow_lynx', 'snow_lynx'], aware: 4, respawn: 1440 },
    { id: 'k9_pike_tower', x: 21, y: 18, monsters: ['ice_pike', 'ice_pike', 'ice_pike', 'ice_pike'], aware: 3, respawn: 1440, under: 'ice', when: { hours: 'night' } },
    { id: 'k9_pike_arm', x: 19, y: 10, monsters: ['ice_pike', 'ice_pike', 'ice_pike', 'ice_pike'], aware: 3, respawn: 1440, under: 'ice' },
    { id: 'k9_lynx_north', x: 9, y: 11, monsters: ['snow_lynx', 'snow_lynx', 'snow_lynx', 'snow_lynx'], aware: 4, respawn: 1440 },
    { id: 'k9_lynx_far', x: 2, y: 15, monsters: ['snow_lynx', 'snow_lynx', 'snow_lynx', 'snow_lynx'], aware: 4, respawn: 1440 },
    { id: 'k9_bears_shore', x: 4, y: 21, monsters: ['ice_bear', 'ice_bear'], aware: 3, respawn: 2880 },
    { id: 'k9_bears_hills', x: 6, y: 28, monsters: ['ice_bear', 'ice_bear'], aware: 3, respawn: 2880 },
  ],
};
