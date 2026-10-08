// Cairnmoor, box N8: the Cairnfield. Core, band 18-20: the drove road on south from N7 over the
// tarn's stream, past a pool frozen hard and the coach stopped on the road, down the west side under the crags to its head above
// the Rimefells and the notch; east of it the field of cairns, a score of them, Carn Dubh the biggest
// with its door in its side, one standing open and the Watcher's grave apart; and east of the field
// the marsh at the bog's edge.
// The door at 6,18 is the way into Carn Dubh (#480), shut until it is built (DOOR); the notch at 0,28
// is the way down to Rime Lodge, taken onto M9 (#486, NOTCH).
// Cut from the atlas by tools/scaffold.ts; docs/areas/cairnmoor.md §4.5 is its brief.
import type { Exit, MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH, WEST } from '../../../../game/types.ts';

/**
 * The way into Carn Dubh (#480): the door of slabs in the biggest cairn's west side, 6,18, onto the
 * dungeon's first square at 7,15, facing north, which this asks #480 to give it (docs/areas/cairnmoor.md
 * §4.6 gives none). An exit leads only to a built map, so the Cairns list it in this map's exits, open
 * the door's square and drop `n8_door`; their way back lands on 5,18, facing west, on the road before
 * the door.
 */
export const DOOR: Exit = { x: 6, y: 18, to: 'cairns', tx: 7, ty: 15, tf: NORTH };

/**
 * The way down to Rime Lodge (#438): N8 and Rimewater's M9 meet only at a corner, and M8 between them
 * is parked, so the drove road is not walked across but taken: the notch at 0,28 (the atlas's 424,250)
 * leads onto M9's road at 22,8 (414,262), facing west for the lodge. M9 (#486) lists it in this map's
 * exits; its way back (M9's UP) lands on 1,28, facing east, the road's last square. The label leaves
 * the loch's name to the crossing line said after it (World's `crossing`, #166).
 */
export const NOTCH: Exit = { x: 0, y: 28, to: 'longmere_m9', tx: 22, ty: 8, tf: WEST, label: 'Down through the notch to the frozen loch.' };

export const CAIRNFIELD_N8: MapDef = {
  id: 'cairnfield_n8',
  name: 'The Cairnfield',
  kind: 'outdoor',
  density: 'core',
  band: [18, 20],
  region: 'cairnmoor',
  start: { x: 7, y: 0, facing: SOUTH },
  exits: [NOTCH],
  rows: [
    'hh*hhhh=wwwwhhhhhh**hhhhhhhhhhh~',
    'hhhhhhh=whhhhhhhhhhhhhhhhhhhh~~h',
    'hhhhhhh=hhhh**hhhhhhhhhhhhh~~~hh',
    'hhhhhhh=hhhhhhhhhh~~~~~~~~~~h**h',
    'hhhhhhh=~~~~~~~~~~~~~~~~~hhhhhhh',
    'hhhh~~~=~~~~~~~hhhhhhhhhhhhhhhhh',
    'h~~~~~~=hhhhhhhhiiihhhhhhhhhhhhh',
    '~~~~hh==hhhhhhhiiiiihhhhhhhhhhhh',
    'hhhhhh=BBBhhhrhhiiihhhrhhhhhhhhh',
    'hhhhhh=S:Bhhhhhhh**hhhhhhhhhrhhh',
    'hhhhh==BBBhhhhhhhhhhhhhhhhhhhhhh',
    'rrhhh=hhhhhhhhhhhrhhhhhhhhrhhhhh',
    'rrhhh=hhhhhhhhhhhhhhhh**hhhhhhhh',
    'rrrrh=hhhrhhhrhhhhhhhhhhrhhhhhhh',
    'rrrrh=**hhhhhhhhhhhhrhhhhhhhhhhh',
    'rrrrh=hhhhhhhhhhhhhhhhhhhhhhhhhh',
    'rrrrh=hhrrhhhhhhhhhhhhhhhhhrhhhh',
    'rrrrh=hrrrrhhhhhrhhhhhhhhhh**hhh',
    'rhhhh=rrrrrhhhhhhhhhhhhhhhhhhhhh',
    'hhhhh=hrrrrhh**hhhhhhhhhhrhhhhhh',
    'hhhhh=hhrrhhhhhhhhhhhhhhhhhhhhhh',
    'hhhh==hhhhhrrrhhhhhhhhrhhwhwwwwh',
    'h**h=hhhhhhrhrhhhhhhhhhhwwwwwwww',
    'hhhh=hhh***hhhhhhhhhhhhhwwwwwwww',
    'hhh==hhhhhhhhhhhrhhrhhhhwwwwwwww',
    'hhh=hhhhhhhhhhhhhhhhhhhrhwwwwwww',
    'rr==hhhhhhhhhh***hhhhhhhhwwwwwww',
    'rr=hhhhhhrhhhhhhhhhhhhhhhhwwwwww',
    '^==hhhhhhhhhhhhhhhhhhrrhhhhwwwwh',
    '^^hhhhhhhhhhhhhhhhhhhhhh***hhhhh',
    'MM^^^^^^^^^^^^^hhhhh**hhhhhhhhhh',
    'MM^^^^^^^^^^^^^^^hhhhhhhhhhhhhhh',
  ],
  features: [
    // In from N7 over the tarn's stream: a hare, the ford and its ruts, and the field ahead.
    { kind: 'event', x: 3, y: 2, id: 'n8_hare', once: true, text: 'A hare sits up in the snow, white already, and does not run.' },
    { kind: 'event', x: 15, y: 2, id: 'n8_stream', once: true, text: 'The tarn\'s stream runs black between banks of snow, too quick to freeze.' },
    { kind: 'event', x: 7, y: 4, id: 'n8_ford', once: true, text: 'The road fords the stream. Wheel ruts go down into it and up the far bank, frozen hard.' },
    { kind: 'event', x: 26, y: 1, id: 'n8_rushes', once: true, text: 'Rushes along the stream, each stem furred white with frost, rattling in the wind.' },
    { kind: 'event', x: 27, y: 6, id: 'n8_field', once: true, text: 'South the cairns stand across the moor, a score of them, each with a drift in its lee.' },
    // The pool among the first cairns, and what is under its ice.
    { kind: 'event', x: 14, y: 7, id: 'n8_pool', once: true, text: 'A pool among the cairns, frozen hard. Under the ice a face looks up, its mouth open.' },
    // The coach stopped on the road, its horses gone (#56's 40, #494), and under its seat the strongbox.
    { kind: 'event', x: 6, y: 8, id: 'n8_coach', once: true, text: 'A coach stands stopped on the road, snow to its axles. Its traces are cut, and there are no horses.' },
    { kind: 'event', x: 6, y: 9, id: 'n8_coach_door', once: true, text: 'Its door hangs open, and the snow inside is trodden. The luggage on its roof is still corded down.' },
    { kind: 'event', x: 8, y: 9, id: 'n8_seat', once: true, text: 'Under the seat, a strongbox chained to the frame: the fare for the lodge, and a bow in oiled cloth.' },
    { kind: 'chest', x: 8, y: 9, id: 'n8_strongbox', gold: 970, items: ['steel_bow+1'] },
    // The crags west of the road, the cairns on every side, and the bog east.
    { kind: 'event', x: 2, y: 10, id: 'n8_crags', once: true, text: 'Grey crags west of the road. The wind has blown their lee bare to the heather.' },
    { kind: 'event', x: 20, y: 10, id: 'n8_cairns', once: true, text: 'Cairns on every side now, some knee high, some taller than a man, their stones grey with lichen.' },
    { kind: 'event', x: 29, y: 13, id: 'n8_bog', once: true, text: 'East the moor sinks into a bog, brown under the snow, and runs on out of sight.' },
    // Carn Dubh, its door shut until the Cairns are built (DOOR), and the hermit in its lee.
    { kind: 'event', x: 5, y: 18, id: 'n8_door', text: 'Carn Dubh, the oldest cairn and the biggest. In its side, a door of slabs, shut fast.' },
    { kind: 'npc', x: 11, y: 16, name: 'A hermit', lines: [
      'A hermit in the lee of the big cairn, wrapped in hides, a fire of heather roots at his feet.',
      '"Carn Dubh is the oldest. The rest were piled round it, to keep it in."',
      '"A coach stopped on the road in the night. I did not go and look."',
    ] },
    { kind: 'cairn', x: 24, y: 17, id: 'n8_cairn', text: 'A cairn of the field, knee high, its stones furred with frost.', gold: 300, items: ['potion_sp_great'] },
    // The open cairn and the prints going in to it, the wind on the road, the marsh at the field's
    // edge, and apart from the rest the Watcher's grave (#56's 37).
    { kind: 'event', x: 12, y: 22, id: 'n8_open_cairn', once: true, text: 'This cairn stands open, its stones thrown outward. In it, a cist of slabs, and only snow.' },
    { kind: 'event', x: 9, y: 23, id: 'n8_tracks', once: true, text: 'Bare footprints in the snow, going east in among the cairns. None come back.' },
    { kind: 'event', x: 1, y: 22, id: 'n8_wind', once: true, text: 'The wind comes over the ridge off the lake, and the snow on the road lies ridged by it.' },
    { kind: 'event', x: 28, y: 24, id: 'n8_marsh', once: true, text: 'The field ends in marsh, the bog\'s edge, crusted with ice that will not bear a man.' },
    { kind: 'event', x: 21, y: 27, id: 'n8_grave', once: true, text: 'A cairn apart from the rest, a lantern cut in its top stone, and under it a tally that stops short.' },
    { kind: 'event', x: 12, y: 28, id: 'n8_ridge', once: true, text: 'The moor ends at a ridge. Beyond, the Rimefells stand up white, with one notch in them, west.' },
    { kind: 'event', x: 27, y: 30, id: 'n8_scree', once: true, text: 'Under the Rimefells the heather gives out to scree, the snow lying deep between the stones.' },
    // The road's head: the milestone, the hill folk's cup-stone, the lake first seen below, and the
    // camp in the notch's lee.
    { kind: 'event', x: 2, y: 27, id: 'n8_milestone', once: true, text: 'A milestone at the road\'s head: RIME LODGE 2 on its south face, ANVILHALL 19 on its north.' },
    { kind: 'shrine', x: 3, y: 27, id: 'n8_shrine', text: 'A stone of the hill folk\'s at the road\'s head, a cup cut in its top, turned to the lake.', stat: 'endurance', done: 'The cup-stone, turned to the lake.' },
    { kind: 'event', x: 1, y: 28, id: 'n8_head', once: true, text: 'The ridge falls away at the road\'s head. Far below, a long lake lies white under ice.' },
    { kind: 'camp', x: 2, y: 29, name: 'The notch', text: 'In the lee of the notch, a ring of stones round old ash, out of the wind off the lake.' },
  ],
  secrets: [{ x: 7, y: 9, hint: 'n8_coach_door' }],
  encounters: [
    // Ravens on the cairns by the road and bog bodies out of the frozen pool, the box's at 18; cairn
    // wights at the open cairn and at the Watcher's grave, cursing (#537), the hardest by day; and at
    // the road's head by night, the hounds.
    { id: 'n8_ravens', x: 12, y: 9, monsters: ['raven', 'raven', 'raven', 'raven', 'raven', 'raven', 'raven', 'raven'], aware: 4, respawn: 1440, roams: false },
    { id: 'n8_wights_open', x: 12, y: 24, monsters: ['cairn_wight', 'cairn_wight', 'cairn_wight'], aware: 3, respawn: 1440, roams: false },
    { id: 'n8_bodies', x: 17, y: 9, monsters: ['bog_body', 'bog_body', 'bog_body', 'bog_body'], aware: 2, respawn: 1440 },
    { id: 'n8_wights_grave', x: 20, y: 27, monsters: ['cairn_wight', 'cairn_wight', 'cairn_wight'], aware: 3, respawn: 1440, roams: false },
    { id: 'n8_hounds', x: 3, y: 25, monsters: ['moor_hound', 'moor_hound', 'moor_hound'], aware: 5, respawn: 2880, when: { hours: 'night' } },
  ],
};
