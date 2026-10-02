// The Delta, box B6: the Drowned Temples' approach. Core, band 11-12: the temples' roofs standing out
// of the fen south of Stienwierde (B5), joined by causeways; the dry door at 16,11, the way into the
// temples (#175), with tidal flats at its foot and the priestess beside it, counting, who asks for the
// temple's bell (#56's 23); the drowned standing in the water; and the far roof alone in the flats,
// with a door in its wall under the tideline and a wet stair behind it down into the choir's back.
// Tidal ground that shows and hides a door is new here. Cut from the atlas by tools/scaffold.ts;
// docs/areas/saltreach.md §4.6 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';
import type { When } from '../../../../game/quests.ts';
import { BELL_HUNG, COUNT_STOPPED } from './drowned_temples.ts';

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
  exits: [
    // The dry door, into the upper temple; and the far roof's porch, down the wet stair into the choir's back.
    { x: 16, y: 11, to: 'drowned_temples', tx: 8, ty: 14, tf: NORTH, label: 'You go down the dry stair into the temple.' },
    { x: 8, y: 24, to: 'drowned_temples2', tx: 14, ty: 1, tf: SOUTH, label: 'You go down the wet stair and through the door at its foot.' },
  ],
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
    'wwwwwwww,,,:wBBBDBBBww~~~wwwwwww',
    'wwwwwwwwwww:::::::wwwww~~wwwwwww',
    'wwwwwwwwwww:;;;;;;;wwwww~~wwwwww',
    'wwwwwwwwwww:wwwwwwwwwwwww::wwwww',
    'wwwwwwwwwww:wwwwwwwwwwwww~~~wwww',
    'wwwwwwwwwww:wwwwwwwwwwwwww~~~www',
    'wwwwwwwwwww:wwwwwwwwwwwwwww~~~ww',
    'wwwwwwwwwww:wwwwwwwwwwwwwwww~~~w',
    'wwwwwwwwwww:wwwwwwwwwwwwwwwww~~~',
    'wwwwwwwwwww:wwwwwwwwwwwwwwwwww~~',
    'wwwwwwww::::wwwwwwwwwwwwwwwwwww~',
    'wwwww;;;:;;;wwwwwwwwwwwwwwwwwwww',
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
    // Before the temple's dry door (16,11), the way in; the priestess beside it and her count, and the
    // Tide Bell she asks for (#56's 23), which she rings once it is back.
    { kind: 'event', x: 16, y: 12, id: 'b6_door', text: 'The temples\' dry door stands open, a stair going down out of the light, its steps dry. At its foot the flats run out grey to the water, worm-cast and shining.' },
    { kind: 'npc', x: 15, y: 12, name: 'a priestess at the dry door', lines: [
      'A woman of the Tidefolk stands at the dry door with her back to it, grey robe wet to the knee, and counts on her fingers with her eyes on the roofs. She does not stop for you.',
      '"Eleven." Her hand comes down. "The one who counts sang the tides once, in and out, and we sang after it. Now it counts, and I count with it. What it means? Nothing. Not yet." Her hand goes up again.',
      '"The port is south, if you want men who talk. I have the doors to count, and a bell to want back. It hung inside this door, and the master of the choir beats the count on it below. The frame stands. I have the rope." And she begins again at one.',
    ], flag: 'q_tide_bell', quest: { item: 'tide_bell', reward: 300, setFlag: 'q_tide_bell_done', done: ['She takes the bell in both arms and does not look at it, only at the stair. "Then it is done beating." She goes in at the door with it, and you hear the rope go through the hook.'], early: ['Her count stops. She looks at the bell in your hands, then at you, and takes it in both arms. "Nobody asked you for that. The one who counts will have to make what it can of it."'], after: ['"It hangs, and it rings the number." Her hand goes up again. "Eleven."'] } },
    { kind: 'event', x: 17, y: 12, id: 'b6_count', text: 'The priestess counts the doors, her hand to each roof in turn, one to ten. Then it lifts towards the far roof in the flats, where no door shows, and stays. "Eleven."' },
    { kind: 'event', x: 14, y: 12, id: 'b6_rung', once: true, after: BELL_HUNG, text: 'The priestess carries the bell in at the door and rings it there, ten even strokes, and the eleventh a beat late. She comes out again with her hand still up.' },
    { kind: 'camp', x: 9, y: 10, name: 'The last dry ground', text: 'A camp on the causeway\'s last dry ground before the door: a hearth of temple slates, cut reed for bedding and the water on three sides.' },
    { kind: 'cairn', x: 5, y: 8, id: 'b6_cairn', text: 'A cairn by the small roof, for one the water kept. The stones are temple slates, laid flat as a roof is laid, and weed grows between them as it does on the roofs.', gold: 70, items: ['potion_heal'] },
    // The causeway south, its drowned, and the far roof in the flats.
    { kind: 'event', x: 11, y: 17, id: 'b6_drowned', once: true, text: 'The drowned stand waist-deep either side of the causeway, facing the temples, robes gone to weed. Not one turns as you pass. Their lips move, and no sound comes.' },
    { kind: 'event', x: 9, y: 21, id: 'b6_far', once: true, text: 'The far roof, alone in the flats to the south-west. Weed on its slates, and its wall going down into brown water, and the tideline drawn along it in salt.' },
    // In the far roof's wall, on the door's own square: the porch behind it and the wet stair down into
    // the choir's back (its foot, 8,24, is the way), counting below until the Choirmaster falls.
    { kind: 'event', x: 8, y: 23, id: 'b6_stair', once: true, until: COUNT_STOPPED, text: 'A porch sunk below the tideline, dark. A stair goes down from it, the steps wet, to a door standing open at its foot, and up through the door, faint and steady, someone counting.' },
    { kind: 'event', x: 8, y: 23, id: 'b6_stair_quiet', once: true, after: COUNT_STOPPED, text: 'The porch below the tideline, the wet stair down to the open door. The counting has stopped. Water runs off the steps, and that is all that comes up.' },
    // Over the channel to the east roof; the fen.
    { kind: 'event', x: 25, y: 14, id: 'b6_crossing', once: true, text: 'The channel, crossed on a causeway of sunk stones a hand under the water. Each stone is a flagstone from a floor, and the water pulls at your knees.' },
    { kind: 'event', x: 27, y: 8, id: 'b6_roof', once: true, text: 'The east roof over the channel, its doors silted to the lintel, the mud in them dry and cracked. Whatever was sung in there was sung before the silt.' },
    { kind: 'event', x: 29, y: 1, id: 'b6_fen1', once: true, text: 'The fen\'s north-east corner, reed to the channel. A line of dead weed lies along the bank a yard above the water, where the tide came to while the Stone stood.' },
    { kind: 'event', x: 31, y: 18, id: 'b6_fen2', once: true, text: 'The channel turns east out of the fen here, brown and quick, towards the port. An eel-weir of Tidefolk reed stands across it, and the eels go through.' },
    { kind: 'event', x: 2, y: 30, id: 'b6_fen3', once: true, text: 'The fen\'s south-west corner. Past the last pool the rim\'s hills lift grey and bare, and at their foot a line of white: salt, left where no tide comes now.' },
    { kind: 'event', x: 3, y: 2, id: 'b6_fen4', once: true, text: 'Reed beds at the fen\'s north-west corner, higher than a man. Through a gap in them the mound of Stienwierde stands to the north, with nothing on its top.' },
    { kind: 'event', x: 2, y: 16, id: 'b6_fen5', once: true, text: 'The fen\'s west edge. The rim\'s hills stand grey over the last reeds, and a marker post leans at their foot, carved on the fen\'s side and bare on the hill\'s.' },
    { kind: 'event', x: 19, y: 21, id: 'b6_fen6', once: true, text: 'Open fen, water and sky, the causeway a line to the west. Out in the shallows a drowned man stands to his chest, facing the roofs. He has stood there a while.' },
    { kind: 'event', x: 25, y: 29, id: 'b6_fen7', once: true, text: 'The fen\'s south. The reed thins and the pools go brackish, and past them the Saltings lie flat to the sky. Samphire grows at the edge, and no one has cut it.' },
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
