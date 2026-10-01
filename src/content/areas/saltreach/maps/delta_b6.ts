// The Delta, box B6: the Drowned Temples' approach. Core, band 11-12: the temples' roofs standing out
// of the fen south of Stienwierde (B5), joined by causeways; the dry door at 16,12, the way into the
// temples (#175), with tidal flats at its foot and the priestess beside it, counting; the drowned
// standing in the water; and the far roof alone in the flats, with a door in its wall under the
// tideline. Tidal ground that shows and hides a door is new here. Cut from the atlas by
// tools/scaffold.ts; docs/areas/saltreach.md §4.6 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';
import type { When } from '../../../../game/quests.ts';

/** Both of Stienwierde's Rifts gone quiet (B5): their spill stops coming down the channel. */
export const RIFTS_CLOSED: When = { slain: ['b5_rift_n:b5_rift_n_warden', 'b5_rift_s:b5_rift_s_warden'] };

export const DELTA_B6: MapDef = {
  id: 'delta_b6',
  name: 'The Delta',
  kind: 'outdoor',
  density: 'core',
  band: [11, 12],
  region: 'saltreach',
  start: { x: 16, y: 0, facing: SOUTH },
  rows: [
    'wwwwwwwwwwwwwwww:w~~wwwwwwwwwwww',
    'wwwwwwwwwwwwwwww:w~~wwwwwwwwwwww',
    'wwwwwwwwwwwwwwww:ww~~wwwwwwwwwww',
    'wwwwwwwwwwwwwwww:ww~~wwwwwwwwwww',
    'wwwwwwwwwww::::::ww~~wwwwwwwwwww',
    'wwwwBBBBwww:wwwwwwww~~wwwBBBBwww',
    'wwwwBBBBwww:wBBBBBBB~~wwwBBBBwww',
    'wwwwBBBBwww:wBBBBBBB~~wwwBBBBwww',
    'wwwwwwwwwww:wBBBBBBBw~~wwwwwwwww',
    'wwwwwwww,,,:wBBBBBBBw~~wwwwwwwww',
    'wwwwwwww,,,:wBBBBBBBww~~wwwwwwww',
    'wwwwwwww,,,:wBBBBBBBww~~~wwwwwww',
    'wwwwwwwwwww:::::::wwwww~~wwwwwww',
    'wwwwwwwwwww:;;;;;;;wwwww~~wwwwww',
    'wwwwwwwwwww:wwwwwwwwwwwww::wwwww',
    'wwwwwwwwwww:wwwwwwwwwwwww~~~wwww',
    'wwwwwwwwwww:wwwwwwwwwwwwww~~~www',
    'wwwwwwwwwww:wwwwwwwwwwwwwww~~~ww',
    'wwwwwwwwwww:wwwwwwwwwwwwwwww~~~w',
    'wwwwwwwwwww:wwwwwwwwwwwwwwwww~~w',
    'wwwwwwwwwww:wwwwwwwwwwwwwwwwww~~',
    'wwwwwwww::::wwwwwwwwwwwwwwwwwww~',
    'wwwww;;;:;;;wwwwwwwwwwwwwwwwwww~',
    'wwww;BBBSBB;wwwwwwwwwwwwwwwwwwww',
    'wwww;BBB.BB;wwwwwwwwwwwwwwwwwwww',
    'wwww;BBBBBB;wwwwwwwwwwwwwwwwwwww',
    'wwww;BBBBBB;wwwwwwwwwwwwwwwwwwww',
    'wwww;BBBBBB;wwwwwwwwwwwwwwwwwwww',
    'wwwww;;;;;;wwwwwwwwwwwwwwwwwwwww',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
  ],
  features: [
    // The causeway in from Stienwierde.
    { kind: 'event', x: 16, y: 1, id: 'b6_in', once: true, text: 'Roofs rise out of the fen ahead, slate and weed, no wall under them that shows. Causeways of packed earth go roof to roof. The temples are drowned.' },
    // The temple's dry door, the way in (#175 makes it the exit), the priestess beside it and her count.
    { kind: 'event', x: 16, y: 12, id: 'b6_door', text: 'The temples\' dry door stands open, a stair going down out of the light, its steps dry. At its foot the flats run out grey to the water, worm-cast and shining.' },
    { kind: 'npc', x: 15, y: 12, name: 'a priestess at the dry door', lines: [
      'A woman of the Tidefolk stands at the dry door with her back to it, grey robe wet to the knee, and counts on her fingers with her eyes on the roofs. She does not stop for you.',
      '"Eleven." Her hand comes down. "The one who counts sang the tides once, in and out, and we sang after it. Now it counts, and I count with it, and that is the number." Her hand goes up again. "Eleven."',
      '"What it means? Nothing. Not yet." She looks past you, south, where the fen ends. "The port is that way, if you want men who talk. I have the doors to count." And she begins again at one.',
    ] },
    { kind: 'event', x: 17, y: 12, id: 'b6_count', text: 'The priestess counts the doors, her hand to each roof in turn, one to ten. Then it lifts toward the far roof in the flats, where no door shows, and stays. "Eleven."' },
    { kind: 'camp', x: 9, y: 10, name: 'The last dry ground', text: 'A camp on the causeway\'s last dry ground before the door: a hearth of temple slates, cut reed for bedding and the water on three sides.' },
    { kind: 'cairn', x: 5, y: 8, id: 'b6_cairn', text: 'A cairn by the small roof, for one the water kept. The stones are temple slates, laid flat as a roof is laid, and weed grows between them as it does on the roofs.', gold: 70, items: ['potion_heal'] },
    // The causeway south, its drowned, and the far roof in the flats.
    { kind: 'event', x: 11, y: 17, id: 'b6_drowned', once: true, text: 'The drowned stand waist-deep either side of the causeway, facing the temples, robes gone to weed. Not one turns as you pass. Their lips move, and no sound comes.' },
    { kind: 'event', x: 9, y: 21, id: 'b6_far', once: true, text: 'The far roof, alone in the flats to the south-west. Weed on its slates, and its wall going down into brown water, and the tideline drawn along it in salt.' },
    // Behind the far roof's wall: the stair down to the temples' second level (#175 makes it the exit).
    { kind: 'event', x: 8, y: 24, id: 'b6_stair', once: true, text: 'A porch sunk below the tideline, dark. A stair goes down from it, the steps wet, to a door at its foot. From below the door, faint and steady, someone is counting.' },
    // Over the channel to the east roof; the fen.
    { kind: 'event', x: 25, y: 14, id: 'b6_crossing', once: true, text: 'The channel, crossed on a causeway of sunk stones a hand under the water. Each stone is a flagstone from a floor, and the water pulls at your knees.' },
    { kind: 'event', x: 27, y: 8, id: 'b6_roof', once: true, text: 'The east roof over the channel, its doors silted to the lintel, the mud in them dry and cracked. Whatever was sung in there was sung before the silt.' },
    { kind: 'event', x: 29, y: 1, id: 'b6_fen1', once: true, text: 'The fen\'s north-east corner, reed to the channel. A line of dead weed lies along the bank a yard above the water, where the tide came to while the Stone stood.' },
    { kind: 'event', x: 28, y: 24, id: 'b6_fen2', once: true, text: 'The channel widens here and goes south to the sea, brown into grey. A Tidefolk eel-weir stands across it, and the eels go through it, since no one lifts it.' },
    { kind: 'event', x: 2, y: 30, id: 'b6_fen3', once: true, text: 'The fen\'s south-west corner. Past the last pool the rim\'s hills lift grey and bare, and at their foot a line of white: salt, left where no tide comes now.' },
    { kind: 'event', x: 3, y: 2, id: 'b6_fen4', once: true, text: 'Reed beds at the fen\'s north-west corner, higher than a man. Through a gap in them the mound of Stienwierde stands to the north, with nothing on its top.' },
    { kind: 'event', x: 2, y: 16, id: 'b6_fen5', once: true, text: 'The fen\'s west edge. The rim\'s hills stand grey over the last reeds, and a marker post leans at their foot, carved on the fen\'s side and bare on the hill\'s.' },
    { kind: 'event', x: 19, y: 21, id: 'b6_fen6', once: true, text: 'Open fen, water and sky, the causeway a line to the west. Out in the shallows a drowned man stands to his chest, facing the roofs. He has stood there a while.' },
    { kind: 'event', x: 20, y: 29, id: 'b6_fen7', once: true, text: 'The fen\'s south. The reed thins and the pools go brackish, and past them the Saltings lie flat to the sky. Samphire grows at the edge, and no one has cut it.' },
  ],
  secrets: [{ x: 8, y: 23, hint: 'b6_count' }],
  encounters: [
    // The last fen toads, on the causeway in; brinelings in the channel by night, B5's Rifts' spill,
    // until both are quiet; two bull toads on the flats beyond the far roof.
    { id: 'b6_toads', x: 16, y: 3, monsters: ['fen_toad', 'fen_toad', 'fen_toad', 'fen_toad', 'fen_toad'], aware: 3, roams: false, respawn: 1440 },
    { id: 'b6_brine', x: 27, y: 13, when: { hours: 'night' }, until: RIFTS_CLOSED, monsters: ['brineling', 'brineling', 'brineling', 'brineling', 'brineling'], aware: 4, respawn: 1440 },
    { id: 'b6_bulls', x: 13, y: 27, monsters: ['bull_toad', 'bull_toad'], aware: 4, respawn: 1440 },
  ],
};
