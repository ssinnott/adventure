// The Saltings, box C6: Saltmouth's box. Core, band 11-12: the Salt Road's last reach down the
// fen's east side from the Delta road (C5) to the town's land gate at 26,19, the way into
// Saltmouth (#177); the barge quay on the Long Water's last reach, with the Compact's warehouse
// across the road; the shore path along the sea wall on tidal ground, under water at high tide;
// and the pans beginning at the south edge. Cut from the atlas by tools/scaffold.ts;
// docs/areas/saltreach.md §4.8 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const SALTINGS_C6: MapDef = {
  id: 'saltings_c6',
  name: 'The Saltings',
  kind: 'outdoor',
  density: 'core',
  band: [11, 12],
  region: 'saltreach',
  start: { x: 26, y: 0, facing: SOUTH },
  rows: [
    'wwwwwwwww~wwwwwwww~~~~wwww=;~WWW',
    'wwwwwwwww~~wwwwwwww~~~wwww=;~WWW',
    'wwwwwwwww~~wwwwwwwww~~~www=;~WWW',
    'wwwwwwwwww~wwwwwwwww~~~~w:=_;~WW',
    'wwwwwwwwww~~wwwwwwwww~~~w:=_;~WW',
    'wwwwwwwwwww~wwwwwwwwww~~~::=;~WW',
    'wwwwwwwwwww~~wwwwwwwww~~~::=_;~~',
    'wwwwwwwwwwww~~wwwwwwwww~~::=__;;',
    'wwwwwwwwwwwww~~wwwwwwwww~::=_BB_',
    'wwwwwwwwwwwwww~~wwwwwwww~~~==BBB',
    'wwwwwwwwwwwwwww~~wwwwwwww~~~=BBB',
    'wwwwwwwwwwwwwwww~~wwwwwwww~~=;;_',
    'wwwwwwwwwwwwwwwww~~wwwwwww~~=;;_',
    'wwwwwwwwwwwwwwwwww~~wwwwwww^=___',
    'wwwwwwwwwwwwwwwwwww~~wwwwww^_=__',
    'wwwwwwwwwwwwwwwwwwww~~wwwww^^=__',
    'wwwwwwwwwwwwwwwwwwwww~~www:::=__',
    'wwwwwwwwwwwwwwwwwwwwww~~w:====__',
    'wwwwwwwwwwwwwwwwwwwwwww~~:=:____',
    '~wwwwwwwwwwwwwwwwwwwwwww~#=#S#__',
    '~wwwwwwwwwwwwwwwwwwwww:::###.#;;',
    '~~wwwwwwwwwwwwwwwwwwww:::###.#_~',
    'w~~wwwwwwwwwwwwwwwwwwwwww###.#_~',
    'w~~~wwwwwwwwwwwwwwwwwwwww#####_~',
    'wwwwwwwwwwwwwwwwwwwwwwwww#####;~',
    'www~~~wwwwwwwwwwwwwwwwwww----ww;',
    'wwww~~~~wwwwwwwwwwwwwwwww------;',
    'wwwwww~~~~wwwwwwwwwwwww--------;',
    'wwwwwww~~~~~wwwwwwwww----------;',
    'wwwwwwwww~~~~~~~~w--------------',
    'wwwwwwwwwwww~~~~~~~~-~~~~-------',
    'wwwwwwwwwwwwww----------~~~~~---',
  ],
  exits: [
    { x: 26, y: 19, to: 'saltmouth', tx: 7, ty: 1, tf: SOUTH, label: 'You pass under the land gate into Saltmouth.' },
  ],
  features: [
    // The road in from the Delta, and the milestone beside it.
    { kind: 'event', x: 26, y: 1, id: 'c6_in', once: true, text: 'The fen gives way to salt. The road runs on, dry now, and far ahead a wall, a gate and smoke above them.' },
    { kind: 'sign', x: 25, y: 2, text: 'SALTMOUTH 2, RIETUM 7.' },
    // The quay, a crate of the crews' cargo on it, and the Compact's warehouse across the road.
    { kind: 'event', x: 26, y: 6, id: 'c6_quay', once: true, text: 'The barge quay: boards on piles, barges two deep, the Long Water gone brown into the grey. Under them something long turns.' },
    { kind: 'chest', x: 25, y: 8, id: 'c6_crate', gold: 80, items: ['scale+1'] },
    { kind: 'npc', x: 28, y: 8, name: 'the warehouse clerk', lines: [
      'A clerk in the warehouse door, a ledger shut under his arm, a Compact knife at his belt and his eyes on the road, not on you.',
      '"Dues. That is what this door is for. Every hull on that quay owed the warehouse its tithe till midsummer, and since midsummer not one has paid."',
      '"Somebody pays them better than we do, and they know it. Ask on the quay who, if you\'ve a mind. They\'ll tell you less than I have." He shuts the door to a hand\'s width.',
    ] },
    // The coach yard, and the land gate behind it, the way into Saltmouth (#177).
    { kind: 'event', x: 27, y: 16, id: 'c6_yard', once: true, text: 'The coach yard outside the gate: trodden dirt cut with ruts, and a coach with its shafts down in the dust. No horses.' },
    { kind: 'event', x: 26, y: 18, id: 'c6_gate', text: 'Saltmouth\'s gate, open, carts going in under it and carts coming out. In the lee of the wall a carter sleeps on his load.' },
    { kind: 'camp', x: 23, y: 20, name: 'Under the wall', text: 'Dry ground in the lee of the town wall, a fire ring of broken brick and the town\'s noise coming over the top all night.' },
    // The secret: the smugglers' stair in the sea wall's dry end, and its flight down to a sea door
    // barred from within. Its top, the harbour tavern's cellar, is #177's and #182's to open.
    { kind: 'event', x: 28, y: 18, id: 'c6_rope', text: 'A rope tied off at the top of the sea wall and hanging down the stones, nothing on it. The stones under it are bare of weed.' },
    { kind: 'event', x: 28, y: 20, id: 'c6_stair', once: true, text: 'A stair in the wall. Up, brandy-smelling dark and a door barred from the far side. Down, a door onto the shore, weed on it.' },
    { kind: 'chest', x: 28, y: 22, id: 'c6_stair_cache', gold: 150, items: ['potion_heal', 'potion_heal'] },
    // The fen west of the road, and the pans' edge.
    { kind: 'shrine', x: 12, y: 8, id: 'c6_shrine', text: 'At the water\'s edge a shrine of the drowned god, the bowl of it sunk in the mud and the mud wet about it. The bowl is dry.', stat: 'personality', done: 'Still nothing in the bowl.' },
    { kind: 'event', x: 4, y: 4, id: 'c6_wierde', once: true, text: 'A mound in the fen, above any flood, grass on it and nothing else. A hearthstone, and the ring where the walls were.' },
    { kind: 'cairn', x: 13, y: 24, id: 'c6_cairn', text: 'A salters\' cairn in the fen, the stones white with crust to the height the flood reaches, and bare grey above that.', gold: 60, items: ['potion_heal'] },
    { kind: 'event', x: 18, y: 28, id: 'c6_pans', once: true, text: 'The salt begins. Low walls of mud quarter the ground into pans, each crusted white, and crabs\' tracks all over the crust.' },
    { kind: 'event', x: 15, y: 3, id: 'c6_post', once: true, text: 'A mooring post alone in the reeds, ringed where ropes have rubbed it, and no water a barge could float on near it.' },
    { kind: 'event', x: 19, y: 8, id: 'c6_hull', once: true, text: 'A barge\'s hull on the bank, planks sprung, reeds through her, and brine glass along her waterline where nothing else grows.' },
    { kind: 'event', x: 6, y: 15, id: 'c6_glass', once: true, text: 'Brine glass across a pool, and a heron stood in it to the knee, grey and still. It has been still a long time.' },
    { kind: 'event', x: 3, y: 23, id: 'c6_ford', once: true, text: 'A ford over the river\'s west arm: a Tidefolk causeway sunk knee-deep, its stones laid close enough to walk in the dark.' },
    { kind: 'event', x: 4, y: 28, id: 'c6_hut', once: true, text: 'An eel-catcher\'s hut fallen in, far from any road. A reed trap on the floor, and in it the bones of what it caught.' },
  ],
  secrets: [{ x: 28, y: 19, hint: 'c6_rope' }],
  encounters: [
    // The quay: bargemen by day, their master behind them; the Hand's smugglers by night, under the sea wall.
    { id: 'c6_bargemen', x: 26, y: 5, monsters: ['bargeman', 'bargeman', 'bargeman', 'bargeman', 'barge_master'], leader: 'barge_master', back: 1, aware: 3, respawn: 1440, when: { hours: 'day' } },
    { id: 'c6_smugglers', x: 31, y: 15, monsters: ['wrack_smuggler', 'wrack_smuggler', 'wrack_bowman', 'wrack_bowman'], back: 2, aware: 3, respawn: 1440, when: { hours: 'night' } },
    // The first salt crabs, at the pans' edge.
    { id: 'c6_crabs', x: 24, y: 27, monsters: ['salt_crab', 'salt_crab', 'salt_crab', 'salt_crab'], aware: 3, respawn: 1440 },
  ],
};
