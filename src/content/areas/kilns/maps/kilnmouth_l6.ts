// Kilnmouth, box L6: Kilnhaven's box. Core, band 16-18: the branch in from M6 on to the town's gate
// in the wall along the shore, the coach yard outside it, and the road down over the river's mouth to
// the ore quay, with its heaps, its pier and the bonded store; south of the bay the grass, the hill with
// its beacon and the heath running down to the sea.
// The gate at 28,4 is the way into Kilnhaven (#469, GATE).
// Cut from the atlas by tools/scaffold.ts; docs/areas/kilns.md §4.13 is its brief.
import type { Exit, MapDef } from '../../../../game/map.ts';
import { WEST } from '../../../../game/types.ts';

/**
 * The way into Kilnhaven (#469): a door in the town's wall at 28,4, onto the town's first square
 * inside its own gate in the east wall, 14,7, facing west, saying the town's gate line
 * (docs/areas/kilns.md §4.14) as the company goes in; the town's way back out lands on 29,4, facing
 * east, the road's end before the gate.
 */
export const GATE: Exit = { x: 28, y: 4, to: 'kilnhaven', tx: 14, ty: 7, tf: WEST,
  label: 'Kilnhaven: ore on the quay, iron in the air, and the sea. Three ways out, and all of them cost.' };

export const KILNMOUTH_L6: MapDef = {
  id: 'kilnmouth_l6',
  name: 'Kilnmouth',
  kind: 'outdoor',
  density: 'core',
  band: [16, 18],
  region: 'kilns',
  start: { x: 31, y: 4, facing: WEST },
  rows: [
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWB::_',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWB::f',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWB::f',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWW~B::f',
    'WWWWWWWWWWWWWWWWWWWWWWWWWW~~D===',
    'WWWWWWWWWWWWWWWWWWWWWWWWW~~~~~=~',
    'WWWWWWWWWWWWWWWWWWWWWW"WW~~~~~=~',
    'WWWWWWWWWWWWWWWWWWWWWW"WW~~_,,=f',
    'WWWWWWWWWWWWWWWWWWWWW~"W~~_====f',
    'WWWWWWWWWWWWWWWWWW"rr"""rr"=,,ff',
    'WWWWWWWWWWWWWWWWW~"""""""""",,,f',
    'WWWWWWWWWWWWWWWW~~,BBSBB,,,,,,,f',
    'WWWWWWWWWWWWWWW~~,,BB..B,,,,,,,f',
    'WWWWWWWWWWWW~WW~~,,BBBBB,,,,,,,f',
    'WWWWWWWWWWW~~~~~~,,,,,,,,,,,,,,f',
    'WWWWWWWW~W~~~~~~,,,,,,,,,,,,,,,,',
    '~~~~WWW~~~~~~,,,,,,,,,,,,,,,,,,,',
    '~~~~~~~~,~~~~,,,,,,,,,,,,,,,,,,,',
    ',,,,~~~~,,,,,,,^^^^^,,,,,,,,,,,,',
    ',,,,,,,,,,,,,,^^^^^^^,,,,,,,,,,,',
    ',,,,,,,,,,,,,^^^^^^^^^^^,,,,,,,,',
    'h,,,,,,,,,,,,^^^^^^^^^^^,,,,,,,,',
    'hhhh,,,,,,,,,^^^,^^^^^^^,,,,,,,,',
    'hhhhhhh,,,,,,,,,,^^^^^,,,,,,,,,,',
    'hhhhhhhhhhhhh,,,,^^^^,,,,,,,,,,,',
    'hhhhhhhhhhhhhhhhhhhh,,,,,,,,,,,,',
    'hhhhhhhhhhhhhhhhhhhhhh,,,,,,,,,,',
    'hhhhhhhhhhhhhhhhhhhhhhh,,,,,,,,,',
    'hhhhhhhhhhhhhhhhhhhhhhhh,,,,,,,,',
    'hhhhhhhhhhhhhhhhhhhhhhhhh,,,,,,,',
    'hhhhhhhhhhhhhhhhhhhhhhhhh,,,,,,,',
    'hhhhhhhhhhhhhhhhhhhhhhhhh,,,,,,,',
  ],
  exits: [GATE],
  features: [
    // The milestone before the gate, and the coach yard outside the wall with a camp under it. The
    // gate's own words are its label, said going in (GATE).
    { kind: 'event', x: 30, y: 4, id: 'l6_milestone', once: true, text: 'A milestone before the gate, ANVILHALL 17 on its face, and on its top the ore dust of every cart that passed.' },
    { kind: 'event', x: 30, y: 1, id: 'l6_yard', once: true, text: 'The coach yard outside the wall: a trough, a mounting block and the ruts of the coach for Rime Lodge.' },
    { kind: 'camp', x: 29, y: 2, name: 'Under the wall', text: 'A fire-ring under the town\'s wall, out of the wind, where the carters wait for the gate.' },
    // The ore quay: the brief's line where the road comes onto it, the store and its clerk, the
    // pier out to where the Compact ship rides.
    { kind: 'event', x: 27, y: 9, id: 'l6_quay', once: true, text: 'Ore in heaps and a quay black with it. One row of crates is tarred over and sealed, and nobody goes near it.' },
    { kind: 'event', x: 21, y: 10, id: 'l6_store', once: true, text: 'The bonded store\'s wall, the sealed row stacked against it. Under the canvas, a smell of straw.' },
    { kind: 'npc', x: 23, y: 10, name: 'The store\'s clerk', lines: [
      'A clerk at a desk on the quay, ink on his fingers and a ledger held down against the wind.',
      '"The sealed row is the Compact\'s, for the ship. It goes aboard under the seal, and nobody opens it."',
      '"Not me. Not the harbourmaster. Not you."',
    ] },
    { kind: 'event', x: 22, y: 6, id: 'l6_ship', once: true, text: 'From the pier\'s end, the Compact ship at anchor off the port, her ports shut and a lantern at her stern.' },
    // Inside the store, behind the stopped door.
    { kind: 'event', x: 21, y: 12, id: 'l6_bonded', once: true, text: 'Crates stencilled CINDERPORT and SHEER POINT under the customs\' lead. In the straw of one, grey stones.' },
    { kind: 'chest', x: 22, y: 12, id: 'l6_store_chest', gold: 490, items: ['kiln_robe+1'] },
    // South of the bay: a cart left off the road, the beacon on the hill, the shore and the heath.
    { kind: 'event', x: 27, y: 14, id: 'l6_cart', once: true, text: 'An ore cart in the grass off the quay road, a wheel off and its ore tipped out. Nobody has come back for it.' },
    { kind: 'event', x: 18, y: 20, id: 'l6_beacon', once: true, text: 'A beacon on the hill, its iron basket black. Across the sea to the west, a smudge of smoke on the far shore.' },
    { kind: 'shrine', x: 8, y: 17, id: 'l6_shrine', text: 'A stone at the tide line, shells heaped at its foot and a fisher\'s knot tied round it.', stat: 'intellect', done: 'The stone at the tide line.' },
    { kind: 'event', x: 4, y: 21, id: 'l6_nets', once: true, text: 'Nets drying on poles above the tide line, and a boat turned over for tarring.' },
    { kind: 'cairn', x: 5, y: 28, id: 'l6_cairn', text: 'A cairn in the heather, a gull\'s skull on the topmost stone.', gold: 150, items: ['potion_sp_great'] },
    { kind: 'event', x: 21, y: 28, id: 'l6_gorse', once: true, text: 'Gorse in flower along the heath\'s edge, and the smell of it warm in the sun.' },
    { kind: 'event', x: 28, y: 21, id: 'l6_fold', once: true, text: 'A fold of turf on the grass, its hurdle down and its sheep gone. Ore carts have cut the turf to mud.' },
    { kind: 'event', x: 28, y: 29, id: 'l6_lark', once: true, text: 'A lark goes up off the grass, singing, until it is out of sight.' },
  ],
  secrets: [{ x: 21, y: 11, hint: 'l6_store' }],
  encounters: [
    // Fire beetles in the ore heaps at either end of the quay; by night the Hand's crew on the pier,
    // loading for the ship; and under the heath a rock worm pair, the box's top.
    { id: 'l6_beetles_east', x: 26, y: 10, monsters: ['fire_beetle', 'fire_beetle', 'fire_beetle'], aware: 4, respawn: 1440 },
    { id: 'l6_beetles_west', x: 18, y: 10, monsters: ['fire_beetle', 'fire_beetle', 'fire_beetle'], aware: 4, respawn: 1440 },
    { id: 'l6_crew', x: 22, y: 8, monsters: ['ashen_gleaner', 'ashen_gleaner', 'ashen_gleaner'], aware: 3, respawn: 1440, when: { hours: 'night' } },
    { id: 'l6_worms', x: 12, y: 27, monsters: ['rock_worm', 'rock_worm'], aware: 2, respawn: 2880, roams: false },
  ],
};
