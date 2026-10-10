// Ashfall, box H9: the Sound's shore under the Sheer's north end. Country, band 24-25, behind the road:
// the black sand along the Sound and the fishers' hamlet above it, two huts, their fire and a woman at
// her door; the grass west to the town, the gull stone on it and drakes on the shore; under the Sheer
// the cairn of its fallen stones; where the Sheer gives out, the pines going up onto the ridge to Sheer
// Point; and at the Sheer's foot, where a path ends at rocks black with smoke, a cleft with a hearth.
// In from H10 (#510) over its south edge, walked: the vines at 0 to 6, the grass, the pines and the Sheer
// square for square with H10's 0,0 to 31,0, nothing named. The east edge is the Sheer from row 5 to row
// 31 and the deep water above it, so Sheer Point's I9 (#503) meets wall or sea along all of it: nothing
// is walked or said there, and the Giants' Stair stays the only way over by land. G9 is west of it; H8
// is the sea.
// Cut from the atlas by tools/scaffold.ts; docs/areas/ashfall.md §4.10 is its brief (#522).
import type { MapDef } from '../../../../game/map.ts';
import { NORTH } from '../../../../game/types.ts';

export const CINDERCOAST_H9: MapDef = {
  id: 'cindercoast_h9',
  name: 'Cindercoast',
  kind: 'outdoor',
  density: 'country',
  band: [24, 25],
  region: 'ashfall',
  start: { x: 14, y: 31, facing: NORTH },
  rows: [
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW|',
    'WWWWWWWWWWWWWWWWWWWWWWWWWW~~~~~|',
    'WWWWWWWWWWWWWWWWWWWWWWWWW~~~~~~|',
    'WWWWWWWWWWWWWWWWWWWWWWWW~~_____|',
    'WWWWWWWWWWWWWWWWWWWWWWW~~_,,,,,|',
    'WWWWWWWWWWWWWWWWWWW~~~~~_,,,,,,|',
    'WWWWWWWWWWWWWWWWWW~~~~~_,,,,,,p|',
    'WWWWWWWWWWWWWWWW~~~____,,,,,,,p|',
    'WWWWWWWWWWWWWWW~~~_,,,,,,,,,,,p|',
    'WWWWWWWWWWWWWW~~__,,,,,,,,,,,pp|',
    'WWWWWWWWWWWWWW~~_,,,,,,,,,,,,pp|',
    'WWWWWWWWWWWWW~~_,,,,,,,,,,,,,pp|',
    'WWWWWWWWWWWWW~~_,,,,,,BB,,,,,,p|',
    'WWWWWWWWWWWWW~~_,,,,,,,,,,,,,pp|',
    'WWWWWWWWWWWW~~_,BB,,,,,,,,,,,pp|',
    'WWWWWWWWWWW~~~_,,,,,,,,,,,,,,pp|',
    'WWWWW~~~~~~~__,,,,,,,,,,,,,,,pp|',
    '~~~~~~~~~~~_,,,,,,,,,,,,,,,,ppp|',
    '~~~~~______,,,,,,,,,,,,,,,,,ppp|',
    '_____,,,,,,,,,,,,,,,,,,,,,,,ppp|',
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,,ppp|',
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,rrpp|',
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,S:rp|',
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,rrpp|',
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,,ppp|',
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,pp|',
    ',,,&&&&,,,,,,,,,,,,,,,,,,,,,,pp|',
  ],
  features: [
    // In from H10's grass, and west along the shore to the town.
    { kind: 'event', x: 14, y: 29, id: 'h9_in', once: true, text: 'North over the grass to the Sound, and on the right hand the Sheer, standing over all of it.' },
    { kind: 'event', x: 3, y: 26, id: 'h9_west', once: true, text: 'The grass runs west along the shore to the town, and smoke over its wall.' },
    { kind: 'shrine', x: 7, y: 27, id: 'h9_shrine', text: 'A stone on the grass with a gull cut in it, wings spread, worn by the weather.', stat: 'intellect', done: 'The gull stone, its wings still spread.' },
    // The black sand and the hamlet above it: the tracks on the sand, a woman at her door, the fire.
    { kind: 'event', x: 12, y: 21, id: 'h9_sand', once: true, text: 'Black sand, and the tracks of something heavy dragged up it out of the water and back.' },
    { kind: 'npc', x: 18, y: 19, name: 'A fishwife', lines: [
      'A woman gutting fish at a hut\'s door, gulls waiting along the roof.',
      '"Beetles come up the sand at night for the guts. We throw them far out."',
      '"Mind the Sheer. Things come off the top of it, and some of them fly."',
    ] },
    { kind: 'camp', x: 23, y: 20, name: 'The hamlet\'s fire', text: 'A ring of stones above the sand, a pot on it, and fish heads round it for the gulls.' },
    // Where the Sheer gives out, and the ridge going out to sea; the cairn under the cliff.
    { kind: 'event', x: 29, y: 18, id: 'h9_sheer', once: true, text: 'The Sheer stops here. North of it the pines climb onto a ridge, and the ridge runs out to sea.' },
    { kind: 'event', x: 27, y: 9, id: 'h9_point', once: true, text: 'East, the ridge goes out into the Sound to Sheer Point, and a line of stones runs out beside it.' },
    { kind: 'cairn', x: 24, y: 24, id: 'h9_cairn', text: 'A cairn of stones fallen off the Sheer, and a boat\'s oar stood up in it.', gold: 100, items: ['potion_sp_great'] },
    // The secret: a path through the grass to the Sheer's foot and the rocks there black with smoke; a
    // cleft behind them with a hearth in it, and a sea-chest.
    { kind: 'event', x: 25, y: 27, id: 'h9_soot', once: true, text: 'A path through the grass to the Sheer\'s foot, and the rocks there black with old smoke.' },
    { kind: 'event', x: 28, y: 27, id: 'h9_cleft', once: true, text: 'A cleft in the rock with a hearth in it, and a sea-chest under a sail gone grey.' },
    { kind: 'chest', x: 28, y: 27, id: 'h9_chest', gold: 50, items: ['potion_sp_great', 'potion_heal'] },
  ],
  secrets: [{ x: 27, y: 27, hint: 'h9_soot' }],
  encounters: [
    // The box's one fight: two drakes on the shore's sand, down off the mountain for what it holds.
    { id: 'h9_drakes', x: 6, y: 23, monsters: ['cinder_drake', 'cinder_drake'], aware: 5, respawn: 2880 },
  ],
};
