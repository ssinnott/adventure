// The Upper Water, box C3: Rietum. Core, band 10-11: the village of the Tidefolk on its mound at the
// spur's end, its houses and net lofts either side of the diep, the cut that brings the barges in
// from the sluice on the west edge to the quay; the fields round it with their drains; the old
// smuggler's hut on a silted drain in the north fields; Kestrel Edge down the east side, closed as
// mountain with the Downs' strip above it, and Sjonghol, a cleft in its foot. Cut from the atlas by
// hand, the scaffold drawing no cliff; docs/areas/saltreach.md §4.4 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH } from '../../../../game/types.ts';

export const UPPERWATER_C3: MapDef = {
  id: 'upperwater_c3',
  name: 'The Upper Water',
  kind: 'outdoor',
  density: 'core',
  band: [10, 11],
  region: 'saltreach',
  start: { x: 3, y: 31, facing: NORTH },
  rows: [
    'ffffffffffffffffff,^^^,,,,MMMMMM',
    'fffffffffffffffffff^^^^,,,MMMMMM',
    'ffffffffffffffffffff^^^,,,,MMMMM',
    'ffffffffffffBBffffff^^^,,,,MMMMM',
    'fffffffffffffffffffff^^,,,,MMMMM',
    'ffff~~~~~~~~ffffffffff^^,,,,MMMM',
    'fffffffffffffffffffffff^,,,,MMMM',
    'ffffffffffffffffffffffff,,,,MMMM',
    'fffffffffffffffffffffffff,,,,M:M',
    'ffffffffffffffffffffff~~~~,,,M:M',
    'ffBffBffBffffffffffffffffff,,::M',
    'f::::::::::ffffffffffffffff,,,MM',
    'BWWWWWWWWWWffffffffffffffff,,,MM',
    'f::::::::S.Bfffffffffffffff,,,MM',
    'fBB:BB:B:BBffffffffffffffff,,,MM',
    'f:::::::::fffffffffffffffff,,,MM',
    'fB:BB:BB:Bfffffffffffffffff,,,MM',
    'f::::::::ffffffffffffffffff,,,MM',
    'fBB:BfB==ffffffffffffffffff,,,,M',
    'fffffff=ffffffffffffffffff,,,,,M',
    'fffffff=ffffffffffffffffff,,,,,M',
    'ffffff=ffffffffffffffffff,,,,,,M',
    'ffffff=ffffffffffffffffff,,,,,,M',
    'fffff==fffffffffffffffff,,,,,,,M',
    'fffff=ffffffffffffffffff,,,,,,,M',
    'fffff=fffffffffffffffff,,,,,,,,M',
    'ffff=fffffffffffffffff,,,,,,,,,M',
    'ffff=ffffffffffffffff,,,,,,,,,,M',
    'ffff=ffffffffffffffff,,,,,,,,,,M',
    'fff=fffffffffffffff,,,,,,,,,,,,M',
    ',ff=ffffffffffffff,,,,,,,,,,,,,M',
    ',ff=ffffffffffffff,,,,,,,,,,,,,M',
  ],
  features: [
    // The spur's last reach, from C4 up to the mound, and the fields either side.
    { kind: 'event', x: 3, y: 30, id: 'c3_in', once: true, text: 'The track\'s last reach, the drains either side of it full to the lip, and ahead on its mound Rietum, the one dry thing in the fields.' },
    { kind: 'event', x: 1, y: 25, id: 'c3_drains', once: true, text: 'The west fields: drains cut across them a long stone\'s throw apart, each a ruled line of sky, and the willows beyond them going on west.' },
    { kind: 'event', x: 12, y: 25, id: 'c3_stubble', once: true, text: 'Herons in the stubble, four of them close together, which herons are not. They stand like men waiting for someone, and watch the track.' },
    { kind: 'cairn', x: 20, y: 28, id: 'c3_cairn', text: 'A cairn at the fields\' edge under the Edge, of stones the plough turned up. Each year adds a few, and a coin or two among them, for whoever it is for.', gold: 80, items: ['potion_heal'] },
    { kind: 'event', x: 27, y: 22, id: 'c3_foot', once: true, text: 'The foot of Kestrel Edge, its face going up grey out of the grass with no ledge to it, and the kestrels on it, hung in the wind a wing off the rock.' },
    { kind: 'event', x: 19, y: 17, id: 'c3_fields', once: true, text: 'The east fields, the stubble cut and the drains run through to the grass. Rietum\'s roofs over the stubble to the west, and no sound from them.' },
    { kind: 'sign', x: 9, y: 19, text: 'RIETUM. NO CARTS ON THE MOUND.' },
    { kind: 'event', x: 8, y: 17, id: 'c3_mound', once: true, text: 'Up onto the mound. Rietum\'s houses stand close on either hand, doors shut, thatch to the eaves, and between them the diep, cut deep and green.' },
    // Rietum: the well, the loft to sleep in, the shrine and its priest by the sluice.
    { kind: 'well', x: 5, y: 15, text: 'The well on the mound\'s top, its coping worn to a saddle. The water is sweet, which no water below the sluice is.' },
    { kind: 'camp', x: 4, y: 17, name: 'The reed-cutters\' loft', text: 'A loft over the reed store at the village\'s south end, its ladder left down. Cut reed to lie on, and the fields through the gable. Nobody comes up.' },
    { kind: 'shrine', x: 1, y: 11, id: 'c3_shrine', text: 'A shrine by the sluice to the drowned god, its stone bowl cut to fill at the tide\'s top. The tide has not come up to it since midsummer. The bowl is dry.', stat: 'speed', done: 'The bowl stays dry.' },
    { kind: 'npc', x: 2, y: 11, name: 'the priest at the sluice', lines: [
      'A man of the Tidefolk sits on the shrine\'s step in a grey robe, dry to the hem, with his hand in the empty bowl. He takes it out when you stop.',
      '"It sang the tides here. In, and the bowl filled; out, and it emptied, and we sang the count with it, in and out. Since midsummer it only counts, and a count is not a song, and I cannot keep time to it." He looks at the bowl.',
      '"You want to know which way. So does everyone, and nobody here will say. So hear a river thing instead. A poleman scores the landing where he pushes off, every one, the shoe of the pole in the planks, and the score drags the way the barge went. Find where it pushed off and read the marks. It is not telling if the planks do it."',
    ] },
    { kind: 'event', x: 1, y: 13, id: 'c3_sluice', once: true, text: 'The sluice-house at the diep\'s head, a gate of black oak in it, shut. Beyond it the diep runs on west under willows, out of sight, to the Long Water.' },
    { kind: 'event', x: 5, y: 11, id: 'c3_lofts', once: true, text: 'The net lofts on the north bank, nets hung from their beams to the water. A face at one window, then none.' },
    // The quay: the barges, the quay-hand who saw the Stone go by (the step), the child at her window.
    { kind: 'event', x: 5, y: 13, id: 'c3_barges', once: true, text: 'Barges tied along the quay, decks a step below the stones. Their crews sit on the hatches with a cask between them and watch you along the bank. Nobody waves.' },
    { kind: 'npc', x: 6, y: 13, name: 'Wytske, a hand on the quay', lines: [
      'A woman of the Tidefolk sits on the quay\'s edge splicing a line. She has watched you since the sign, and the splice has not slowed.',
      '"You\'ve had the trapper and the old woman on her rock. Midsummer it was my turn under the lamp at the diep\'s mouth. It came down the river a pole\'s length off me, no lamp lit, and the hold green through the sacking, like a lantern in a sack."',
      '"It never stopped, never so much as looked at the lamp, and every barge on this water looks at the lamp. The word on these stones since is that nobody saw anything." She bites the line off. "So that\'s what I saw."',
      '"It came from Stienwierde, west over the fen, where the Stone stood. Go and look at the empty place." She goes back to the splice.',
    ], flag: 'c3_saw_stone' },
    { kind: 'npc', x: 1, y: 15, name: 'Nynke, at her window', lines: [
      'A girl of the Tidefolk kneels on a bench at a low window with a jar on the sill. There is a shard of green glass in it, and by day it is only glass.',
      '"I found it on the quay stones the morning after the green boat. Nobody else wanted it, so it\'s mine. It lights up at night, so I don\'t have the dark. The glass people come up the bank to look at it. They put their faces on the window and they don\'t say anything. I\'m not frightened. Mam is."',
      '"When it\'s lit I can see down the water all the way to the quay. One of the stones goes green underneath, like the water\'s shining back at my jar. Only that one. I waved at it once and nothing happened."',
    ] },
    // The secret: the clean stone in the quay's face, and the smuggler's old cache behind it.
    { kind: 'event', x: 7, y: 13, id: 'c3_glow', when: { hours: 'night' }, text: 'The child\'s jar throws green along the diep, and under one stone of the quay\'s face the water glows back brighter than the rest, as if the light had a way in.' },
    { kind: 'event', x: 8, y: 13, id: 'c3_stone', text: 'One stone in the quay\'s face is bare and pale where every other is weeded green to the waterline. Hands have been on it, or feet, and not long since.' },
    { kind: 'event', x: 9, y: 13, id: 'c3_cache', once: true, text: 'The old cache under the quay, dry as a loft: mail on a peg, blades in oilcloth, a grey robe, and a short sword scored along its back as a poleman scores a landing.' },
    { kind: 'chest', x: 10, y: 13, id: 'c3_cache_chest', gold: 160, items: ['chain+1', 'smugglers_sword', 'stiletto+1', 'tidefolk_robe+1'] },
    // The north fields: the old drain, the smuggler's hut, the hills.
    { kind: 'event', x: 2, y: 6, id: 'c3_west', once: true, text: 'The fields north of the village, the drains here older and slower, half choked with reed. The hills stand at their far end, low and bare.' },
    { kind: 'event', x: 10, y: 4, id: 'c3_staithe', once: true, text: 'An old staithe on a silted drain, planks green and posts leaning, and a hut beside it, door to the water. No barge has reached it in years. The path is trodden.' },
    { kind: 'npc', x: 12, y: 4, name: 'Auke the old bargeman', lines: [
      'An old man of the Tidefolk sits on the staithe\'s one sound plank with a barge-pole across his knees, rubbing oil into the ash. There is no barge. He has heard you since the fields.',
      '"Auke. Bargeman, once, and Compact, once, and the two of them went bad about the same time. I\'m out of it. That\'s what I tell the crews when they come by, and they go away again, so it must be true."',
      '"Poling at night you learn a thing: there\'s always a moment nobody is looking at you, and if you\'re not there for it, you were never there at all. One of you has the makings. Sit on that end of the plank and I\'ll show you where the moment is."',
    ], says: [{ after: { item: 'smugglers_sword' }, lines: [
      '"That\'s my count on its back." He looks at it a while, and not at you. "Keep it. I told you I was out, and a man who\'s out has no call to a sword like that lying about." He goes back to the pole.',
    ] }],
    teaches: { cls: 'thief', prestige: 2, seek: 'Auke the old bargeman, at the silted staithe in Rietum\'s north fields, can make a Nightjar of a Tumbler.' } },
    { kind: 'event', x: 15, y: 12, id: 'c3_middle', once: true, text: 'The middle fields, the village\'s best, dry to the Edge. Their drains run east to one cut under the cliff, and the cut has backed up and spread.' },
    { kind: 'event', x: 21, y: 3, id: 'c3_hills', once: true, text: 'On the hills: the fields below in their ruled squares, Rietum a knot of thatch on its mound, and west past the willows the fen, glittering, and no sun on it.' },
    // Under the Edge: the flooded drain, the grass and Sjonghol.
    { kind: 'event', x: 21, y: 9, id: 'c3_flood', once: true, text: 'A drain under the Edge, flooded out over the grass and the mud round it churned, as if something the size of a cart had wallowed there and gone back in.' },
    { kind: 'event', x: 25, y: 5, id: 'c3_edge', once: true, text: 'The grass under the cliff, cropped short and no beast on it, with the rock going up grey over your heads and a kestrel\'s cry coming down.' },
    { kind: 'event', x: 28, y: 10, id: 'c3_sjonghol', once: true, text: 'Sjonghol, a cleft in the cliff\'s foot a man wide, and out of it a note, low and steady, that the wind makes. It is the one sound under the Edge.' },
    { kind: 'npc', x: 29, y: 10, name: 'Douwe, who sits in Sjonghol', lines: [
      'A man of the Tidefolk sits cross-legged in the cleft\'s mouth with the wind going over him, his hair flat with it, his eyes shut. He speaks before you have stopped walking.',
      '"Douwe. I sit here. The wind comes in at the mouth and goes out at the back and sings on the way, and it has not missed a day since before Rietum was a mound. Everything else here has stopped singing. Not this."',
      '"You can\'t beat the wind to the back of the cleft. You can be there before it, if you leave before it does." He opens one eye on one of you. "Sit where I can see you. I\'ll show you when to leave."',
    ],
    teaches: { cls: 'monk', prestige: 2, seek: 'Douwe, who sits in the mouth of Sjonghol under Kestrel Edge, east of Rietum, can make a Windwalker of a Stillwater.' } },
    { kind: 'event', x: 30, y: 8, id: 'c3_song', text: 'The back of the cleft, where it narrows to a hand\'s width and the wind goes through. The note is here, in the rock and in your teeth, and it does not stop.' },
  ],
  secrets: [{ x: 9, y: 13, hint: 'c3_stone' }],
  encounters: [
    // Herons in the stubble beside the track, nearest the way in.
    { id: 'c3_herons', x: 8, y: 27, monsters: ['grey_heron', 'grey_heron', 'grey_heron', 'grey_heron'], aware: 3, respawn: 1440 },
    // A barge's crew on the quay by day, its master the one to fell.
    { id: 'c3_quay', x: 3, y: 13, when: { hours: 'day' }, monsters: ['barge_master', 'bargeman', 'bargeman', 'bargeman'], leader: 'barge_master', aware: 2, roams: false, respawn: 2880 },
    // Brinelings at the child's window by night, come to her shard's light.
    { id: 'c3_brine', x: 2, y: 15, when: { hours: 'night' }, monsters: ['brineling', 'brineling', 'brineling', 'brineling'], aware: 3, roams: false, respawn: 1440 },
    // A bull toad alone in the flooded drain under the Edge: the hardest.
    { id: 'c3_toad', x: 24, y: 10, monsters: ['bull_toad'], aware: 4, respawn: 1440 },
  ],
};
