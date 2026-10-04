// The Kilns, box N4: the Tiefzeche's box. Core, band 16-17: the trail on from N3 across the box from
// its north edge and down to the drove road's head, and the drove road out south for N5; the deepest
// mine's headworks at the foot of the first crags, its shaft under a wheel and a gantry, the fresh
// spoil tipped below it and the wagon yard walled into the rock behind; the miners' camp on the
// grass west of the trail, and the old workings' open cuts in the south-west.
// The shaft at 16,2 is the way into the Tiefzeche (#462), shut until it is built (MOUTH).
// Cut from the atlas by tools/scaffold.ts; docs/areas/kilns.md §4.6 is its brief.
import type { Exit, MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

/**
 * The way down into the Tiefzeche (#462): the cage on the shaft at 16,2, onto the workings' first
 * level at 7,14, facing north. An exit leads only to a built map, so the dungeon lists it in this
 * map's exits, opens the shaft's square and drops `n4_cage`; its way back up lands on 15,2, facing
 * west, the end of the spur before the shaft.
 */
export const MOUTH: Exit = { x: 16, y: 2, to: 'deep_mines', tx: 7, ty: 14, tf: NORTH };

export const KILNSHEART_N4: MapDef = {
  id: 'kilnsheart_n4',
  name: 'The Kilns',
  kind: 'outdoor',
  density: 'core',
  band: [16, 17],
  region: 'kilns',
  start: { x: 4, y: 0, facing: SOUTH },
  rows: [
    ',,,,==,,,,,,,,,,,,,,,,,,rrrrrrrr',
    ',,,,,=,,,,,,,,,::BB,,,rrrrrrrrrr',
    ',,,,,,==========#rrrrrrrrrrrrrrr',
    ',,,,,,==,,,,,,,::######rrrrrrrrr',
    ',,,,,,,==,^,,,,,:#::::#rrrrrrrrr',
    ',,,,,,,,==^,,,,,:S::::#rrrrrrrrr',
    ',,,,,,,,^=^,"""":#::::#rrrrrrrrr',
    ',,,,,,,^^^=,"""""######rrrrrrrrr',
    ',,,,,,,,^^==,""""rrrrrrrrrrrrrrr',
    ',,,,,,,,^^,==""""",rrrrrrrrrrrrr',
    ',,,,,,,,,,,,=,"""",rrrrrrrrrrrrr',
    ',,,,,,,,,,,,,=,,,,,,rrrrrrrrrrrr',
    ',,,,,,,,,,,,,==,,,,,rrrrrrrrrrrr',
    ',,,,,,,,,,,,,,=,,,,,,rrrrrrrrrrr',
    ',,,,,,,,,,,,,,,=,,,,,,rrrrrrrrr^',
    ',,,,,,,,,,,,,,,==,,,,,,,,,,rr^^^',
    ',,,,,,,,,,,,,,,,==,,,,,,,,,^^^^^',
    ',,,,,,,,,,,,,,,,,=,,,,,,,,,^^^^^',
    '^,,,,,,,,,,,,,,,,==,,,,,,,,^^^^^',
    '^^,,,,,,,,,,,,,,,^==,,,,,,,,,^^^',
    '^^,,,,,,,,,,,,,,,^^=,,,,,,,rrr^^',
    ',,,,,,,,,,,,,,,,,^^,=,,,,,,::r^^',
    ',,,,,,,,,,,,,,,,,^^,==,,,,,,:r,^',
    'f:::,,,,:,,,,,,,,^^,,=,,,,,,,,,^',
    '::::::::::,,,,,,^^^^^==,,,,,,,,^',
    '::::::::::,,,,,,^^^^^=,,,,,,,,,^',
    ':::rrr:::::,,,,^^^^^^=,,,,,,,,,^',
    '::r:::r:::::,,,^^^^,,=,,,,,,,,,,',
    '::r:::::::::,,,^^^,,,=,,,,,,,,,,',
    '::r:::r::::^,,,^^,,,,=,,,,,,,,,^',
    ':::rrr:::::^,,,^,,,,=,,,^,,,,,,^',
    ':::::::::::,,,,,,,,,=,,^^^^^,,~~',
  ],
  features: [
    // Over the line from the Fells: the boundary stone by the trail.
    { kind: 'event', x: 3, y: 1, id: 'n4_boundary', once: true, text: 'A boundary stone by the trail, a hammer cut on its north face and a kiln on its south.' },
    // The headworks: the spur's end before the shaft, the cage chained until the Tiefzeche is built;
    // the tally board on the winding house, the lookout from the gantry, the crust on the fence and
    // the lamp-niche over the shaft with the miners' blessing cut above it.
    { kind: 'event', x: 14, y: 2, id: 'n4_mouth', once: true, text: 'The shaft goes down under a wheel and a gantry. The miners sing going in, a verse at the door. Nobody sings coming out.' },
    { kind: 'event', x: 15, y: 2, id: 'n4_cage', text: 'The cage stands at the top of the shaft, chained. No shift goes down today.' },
    { kind: 'event', x: 16, y: 1, id: 'n4_tally', once: true, text: 'The tally board on the winding house, a stroke a load. Under DOWN the strokes run to the foot of it. Under UP, none.' },
    { kind: 'event', x: 15, y: 1, id: 'n4_lookout', once: true, when: { hours: 'day' }, text: 'From the gantry\'s top the drove road runs on south out of sight. Far to the south-east a crag stands cut square on one face.' },
    { kind: 'event', x: 15, y: 1, id: 'n4_lookout_night', once: true, when: { hours: 'night' }, text: 'From the gantry\'s top, far to the south-east, something glows red at the foot of a crag, and the glow does not move.' },
    { kind: 'event', x: 15, y: 3, id: 'n4_crust', once: true, text: 'On the fence by the shaft, a crust of bread in a cloth, fresh today. The miners step round it.' },
    { kind: 'shrine', x: 16, y: 3, id: 'n4_shrine', text: 'A lamp burns in a niche by the shaft, and the stone under it is worn hollow. Every miner going down puts a hand to it.', stat: 'luck', done: 'The lamp in the niche by the shaft, burning.' },
    { kind: 'sign', x: 16, y: 3, id: 'n4_blessing', text: 'Cut over the shaft, the miners\' blessing on all who go down.', read: 'COUNT ALL DOWN. COUNT ALL UP.' },
    // By night the Hand's cart comes down the trail for the headworks.
    { kind: 'event', x: 7, y: 2, id: 'n4_cart', once: true, when: { hours: 'night' }, text: 'A cart comes down the trail in the dark, lamps hooded, and turns in for the headworks. Its men keep their faces from the light.' },
    // The fresh spoil, and its warm end.
    { kind: 'event', x: 12, y: 6, id: 'n4_spoil', once: true, text: 'Fresh spoil tipped below the shaft, the stone still sharp. Heat comes off the far end of the heap.' },
    // The wagon yard: the fresh mortar in its wall, and behind it the cages the cargo rode down in.
    { kind: 'event', x: 16, y: 5, id: 'n4_mortar', once: true, text: 'A wagon\'s width of the yard wall is new work, the mortar still pale. The stone either side is black with smoke.' },
    { kind: 'event', x: 18, y: 5, id: 'n4_yard', once: true, text: 'Cages on wheels under tarpaulins, a name scratched on one bar. In the straw, a child\'s shoe and a shell on a string.' },
    { kind: 'chest', x: 20, y: 5, id: 'n4_yard_chest', gold: 700, items: ['sharkskin+2'] },
    // The miners' camp on the grass west of the trail, and a miner at it.
    { kind: 'camp', x: 3, y: 10, name: 'The miners\' camp', text: 'The miners\' camp: huts of turf and slag about a fire that is never let out, and boots in pairs at every door.' },
    { kind: 'npc', x: 4, y: 10, name: 'A miner', lines: [
      'A miner by the fire, scraping out his lamp.',
      '"A verse at every door going down. One door, one verse, all the way to the bottom."',
      '"Coming up nobody sings. Ask a man why and he\'ll tell you he\'s tired."',
    ] },
    // A cairn on the knoll in the west.
    { kind: 'cairn', x: 1, y: 19, id: 'n4_cairn', text: 'A cairn on the knoll, every stone in it a lump of slag, black and glassy.', gold: 250, items: ['potion_sp_great'] },
    // An ore tub left by the trail, and the spring under the crag.
    { kind: 'event', x: 12, y: 17, id: 'n4_tub', once: true, text: 'An ore tub on its side in the grass by the trail, a wheel off and the rest rusted to it.' },
    { kind: 'well', x: 23, y: 16, text: 'A spring under the crag, run into a trough of dressed stone. The water is cold, the first cold thing in the heart.' },
    // The old workings' open cuts in the south-west; the drove road's head and the drovers' fold in
    // the east; and south, close past the edge, the smelter's smoke.
    { kind: 'event', x: 8, y: 25, id: 'n4_cuts', once: true, text: 'The old workings: open cuts stepped down into the ground, grass on every ledge. In the deepest the rubble is fresh.' },
    { kind: 'event', x: 22, y: 24, id: 'n4_drove', once: true, text: 'Here the trail turns south and becomes the drove road. The verge is grazed bare, and the dung on the road is days old.' },
    { kind: 'event', x: 26, y: 28, id: 'n4_fold', once: true, text: 'A drovers\' fold of dry stone by the road, its gate off the hinges and nettles in the dung.' },
    { kind: 'event', x: 13, y: 30, id: 'n4_smoke', once: true, text: 'Smoke stands up close to the south, and the wind off it is hot. Under it a furnace is roaring.' },
  ],
  secrets: [{ x: 17, y: 5, hint: 'n4_tally' }],
  encounters: [
    // Fire beetles on the fresh spoil at its head by the trail, salamanders at its warm end under the
    // crag; a rock worm in each of the old workings' open cuts, the box's groups at 17.
    { id: 'n4_beetles', x: 12, y: 7, monsters: ['fire_beetle', 'fire_beetle', 'fire_beetle', 'fire_beetle'], aware: 4, respawn: 1440 },
    { id: 'n4_salamanders', x: 15, y: 10, monsters: ['salamander', 'salamander', 'salamander', 'fire_beetle'], aware: 3, respawn: 1440 },
    { id: 'n4_worm_west', x: 4, y: 28, monsters: ['rock_worm'], aware: 2, respawn: 2880, roams: false },
    { id: 'n4_worm_east', x: 28, y: 21, monsters: ['rock_worm'], aware: 2, respawn: 2880, roams: false },
  ],
};
