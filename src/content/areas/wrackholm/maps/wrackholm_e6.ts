// Wrackholm, box E6: the moor and the landing, where the smugglers' boat from Saltmouth puts in.
// Core, band 12-13: the landing stage at the head of an inlet on the isle's west side, at the plan's
// 152,172; the smugglers' huts round it; Kelp Hole's mouth in the cliff above at 154,170 (#188); the
// lookout over the water to Saltmouth; the heather moor north and east, with its cairn; the camp in
// the lee of the south hills and the pools under them. Cut from the atlas by tools/scaffold.ts;
// docs/areas/wrackholm.md §4.2 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, WEST } from '../../../../game/types.ts';

export const WRACKHOLM_E6: MapDef = {
  id: 'wrackholm_e6',
  name: 'Wrackholm',
  kind: 'outdoor',
  density: 'core',
  band: [12, 13],
  region: 'wrackholm',
  start: { x: 16, y: 14, facing: NORTH },
  rows: [
    'WWWWWWWWWWWWW~~_,,,,,,,,,,,,,,,,',
    'WWWWWWWWWWWW~~_,,,,,,,,,,,,,,,,,',
    'WWWWWWWWWWW~~_,,,,,,,,,,,,,,,,,,',
    'WWWWWWWWWWW~~_,,,,,,,,,,,,,,,,,,',
    'WWWWWWWWWW~~_^,,,,,,,,,,,,,,,,,,',
    'WWWWWWWWWW~~_^^,,,,,,,,,,,,,,,,,',
    'WWWWWWWWW~~_,^,,,,,,,,,,,,,,,,,h',
    'WWWWWWWWW~~_,,,,,,,,,,,,,,,,,,hh',
    'WWWWWWWWW~~_,,,,,,,,,,,,,,,,hhhh',
    'WWWWWWWW~~_,,,,,,,,,,,,,,,,hhhhh',
    'WWWWWWWW~~_,,,,,,,,,,,,,,,hhhhhh',
    'WWWWWWWW~~^^^^^^^rrr,h,hhhhhhhhh',
    'WWWWWWWW~~^^^^^^^r^rhhhhhhhhhhhh',
    'WWWWWWWW~~_^^^^^^^^^hhhhhhhhhhhh',
    'WWWWWWWW~~__B_,::,hhhhhhhhhhhhhh',
    'WWWWWWWWWWWWWW~~:,hhhhhhhhhhhhhh',
    'WWWWWWWWWWWWWW~~~_,hhhhhhhhhhhhh',
    'WWWWWWWW~~~~~~~__,,hhhhhhhhhhhhh',
    'WWWWWWWW~~_,,,,,,hhhhhhhhhhhhhhh',
    'WWWWWWWW~~_,BBB,BBhhhhhhhhhhhhhh',
    'WWWWWWWW~~_,B"B,,,hhhhhhhhhhhhhh',
    'WWWWWWWW~~_,BSB,,,,hhhhhhhhhhhhh',
    'WWWWWWWW~~_,,,,B,,,hhhhhhhhhhhhh',
    'WWWWWWWW~~_,,,,,,,,hhhhhhhhhhhhh',
    'WWWWWWWW~~_,,,,,,,,,hhhhhhhhhhhh',
    'WWWWWWWWW~~_,,,,,,,,hhhhhhhhhhhh',
    'WWWWWWWWW~~_,,,,,,,,,,,,,hhhhhhh',
    'WWWWWWWWW~~_,,,,,,,,,,,,,,,hhhhh',
    'WWWWWWWWW~~_^^^^^^^,^^^^^,,,,hhh',
    'WWWWWWWWWW~~^^^^^^^^^^^^^^^,,___',
    'WWWWWWWWWW~~^^^^^^^^^^^^^^^__~~_',
    'WWWWWWWWWWW~~^^^^^^^^^^^^^_~~~~~',
  ],
  exits: [
    { x: 18, y: 12, to: 'smugglers_cove', tx: 12, ty: 14, tf: NORTH, label: 'You climb the wet path into the mouth of Kelp Hole.' },
  ],
  features: [
    // The landing: the stage at the inlet's head, the boat's captain on it, and the cove's mouth above.
    { kind: 'event', x: 16, y: 15, id: 'e6_stage', once: true, text: 'Wrackholm. A dozen planks on piles, green to the waterline, and the inlet\'s walls close over them. Nobody comes.' },
    // Kitto, who sold the company its passage at Saltmouth's quay, sells the way back (#177).
    { kind: 'npc', x: 15, y: 14, name: 'Kitto, the boat\'s captain', lines: [
      'The captain makes the boat fast with his back to you, and keeps it there longer than a knot needs. When he turns he looks past your shoulder, at the cliff.',
      '"You\'ve paid, and here you are. I\'ll lie at the stage till you want Saltmouth again, same fare, and I\'ll not go up." He spits over the side. "Nobody from the boats goes up. Don\'t ask me more than that."',
    ], passage: [{ to: 'saltmouth', x: 13, y: 10, facing: WEST, name: 'Saltmouth', by: 'boat', fare: 150, departs: 20, days: 1, arrives: 6,
      label: 'Saltmouth comes up out of the morning, low and smoking, and you step onto the quay, rested, with the gulls already asking.' }] },
    { kind: 'event', x: 18, y: 13, id: 'e6_mouth', once: true, text: 'The cliff opens a few steps up: Kelp Hole, black inside, breathing weed and smoke. The path to it is worn and wet.' },
    // The huts: one under the cliff, the rest south of the inlet. The gulls sit on one roof and no
    // other, and under that hut's floor is the crews' cache.
    { kind: 'event', x: 11, y: 14, id: 'e6_hut_lip', once: true, text: 'One hut alone on the north lip, its back to the rock, its door to the water. Nets on the wall, years from the sea.' },
    { kind: 'event', x: 15, y: 18, id: 'e6_huts', once: true, text: 'Huts south of the inlet, tarred black, roofed with turf and sail under stones. Rats run under the floors, not far.' },
    { kind: 'event', x: 13, y: 22, id: 'e6_gulls_roof', once: true, text: 'Every roof here is bare but one. There the gulls sit shoulder to shoulder and will not lift for a thrown stone.' },
    { kind: 'event', x: 13, y: 20, id: 'e6_cache', once: true, text: 'Under the boards, a sailcloth pit: a Compact knife in a Helmstow coat, and the crews\' pay, grey coins with no face.' },
    { kind: 'chest', x: 13, y: 20, id: 'e6_cache_box', gold: 140, items: ['longbow+1'] },
    // The moor: the lookout on the west cliff, the cairn on the crown, the camp, the Tidefolk's bowl.
    { kind: 'event', x: 13, y: 5, id: 'e6_lookout', once: true, text: 'A nest of stones on the west cliff, the grass worn to a man\'s shape. Across the water Saltmouth, low and smoking.' },
    { kind: 'cairn', x: 24, y: 18, id: 'e6_cairn', text: 'A cairn on the moor\'s crown, shore stones carried up through the heather, and a ship\'s block gone soft among them.', gold: 60, items: ['potion_heal'] },
    { kind: 'camp', x: 18, y: 27, name: 'The lee of the hills', text: 'Heather pulled for bedding in a hollow out of the wind, and a ring of stones black from old fires.' },
    { kind: 'shrine', x: 11, y: 25, id: 'e6_shrine', text: 'On the west shore a Tidefolk bowl, set to face the delta, full to the lip with shells. The gulls have left it alone.', stat: 'luck', done: 'The bowl holds only shells.' },
    { kind: 'event', x: 22, y: 2, id: 'e6_north', once: true, text: 'Open grass to the north edge, then air. North-east the Deepthorn is a dark line, and every stone white with gulls.' },
    { kind: 'event', x: 29, y: 5, id: 'e6_northeast', once: true, text: 'Grass gives out to heather, and a path runs east through it, trodden to peat by more feet than a fishing isle has.' },
    { kind: 'event', x: 29, y: 21, id: 'e6_east', once: true, text: 'East, heather falls to broken grey rock with the sea working in it. Smoke out there, thin, and no house to make it.' },
    { kind: 'event', x: 25, y: 26, id: 'e6_south', once: true, text: 'Southward the moor drops to pools, bright at low water. The weed in them stirs, lifts an arm, and lays it down.' },
  ],
  secrets: [{ x: 13, y: 21, hint: 'e6_gulls_roof' }],
  // The isle's gentlest nearest the stage: bilge rats in the huts and gulls on the inlet's cliff; gulls
  // at the lookout, two crews on the paths north and east, and devilfish in the pools under the south
  // hills at the far end. Each at the line's standard size.
  encounters: [
    { id: 'e6_rats', x: 17, y: 18, monsters: new Array(8).fill('bilge_rat'), aware: 2, respawn: 1440 },
    { id: 'e6_gulls_inlet', x: 13, y: 12, monsters: new Array(8).fill('wrack_gull'), aware: 4, respawn: 1440 },
    { id: 'e6_path_north', x: 20, y: 6, monsters: ['wrack_smuggler', 'wrack_smuggler', 'wrack_bowman', 'wrack_bowman'], back: 2, aware: 3, respawn: 2880 },
    { id: 'e6_gulls_lookout', x: 15, y: 3, monsters: new Array(8).fill('wrack_gull'), aware: 4, respawn: 1440 },
    { id: 'e6_path_east', x: 27, y: 12, monsters: ['wrack_smuggler', 'wrack_smuggler', 'wrack_bowman', 'wrack_bowman'], back: 2, aware: 3, respawn: 2880 },
    { id: 'e6_devilfish', x: 28, y: 30, monsters: ['devilfish', 'devilfish', 'devilfish', 'devilfish'], aware: 2, roams: false, respawn: 2880 },
  ],
};
