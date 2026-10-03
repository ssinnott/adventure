// The Upper Water, box C3: Rietum. Core, band 10-11: the village of the Tidefolk on its mound at the
// spur's end, its houses and net lofts either side of the diep, the cut that brings the barges in
// from the sluice on the west edge to the quay; the fields round it with their drains; the old
// smuggler's hut on a silted drain in the north fields; Kestrel Edge down the east side, closed as
// mountain with the Downs' strip above it, and Sjonghol, a cleft in its foot. The Night-Light (#56's
// 21, #183): the priest asks for Nynke's light, and Tobin across the diep would buy it. Cut from the atlas by
// hand, the scaffold drawing no cliff; docs/areas/saltreach.md §4.4 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH } from '../../../../game/types.ts';
import type { QuestCond } from '../../../../game/quests.ts';

/** The Night-Light (#56's 21): Nynke's light handed over, to the priest or to Tobin. */
export const LIGHT_TAKEN: QuestCond = { flag: 'q_nightlight_taken' };
/** The Tide Stone set back on its plinth (#191): the light in her jar goes out. */
const STONE_HOME: QuestCond = { flag: 'q_tide_home' };
/** What brings the glass people to her window ends: the light gone from it, or gone out. */
const LIGHT_GONE = [LIGHT_TAKEN, STONE_HOME];

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
    'ffffffffffffffffffffffffff,,,M:M',
    'ffBffBffBffffffffffffffffff,,::M',
    'f::::::::::ffffffffffffffff,,,MM',
    'BWWWWWWWWWWffffffffffffffff,,,MM',
    'f::::::::S.Bfffffffffffffff,,,MM',
    'fBB:BB:B:BBffffffffffffffff,,,MM',
    'f:::::::::ffffffffffff~~~~f,,,MM',
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
    // The Night-Light (#56's 21): the priest asks for the child's light, and keeps the pole-mark line
    // that hints B5's landing. He takes it at the first meeting, or hears where it went.
    { kind: 'npc', x: 2, y: 11, name: 'the priest at the sluice', lines: [
      'A man of the Tidefolk sits on the shrine\'s step in a grey robe, dry to the hem, with his hand in the empty bowl. His lips move without sound. He is counting.',
      '"It sang the tides here. In, and the bowl filled; out, and it emptied, and we sang the count with it. Since midsummer it only counts. I catch myself counting. So does the village."',
      '"You want to know which way it went. Nobody here will say, so hear a river thing. A poleman scores the landing where he pushes off, the shoe of the pole in the planks, and the score drags the way the barge went. Find where it pushed off and read the marks."',
      '"And a thing nearer. The child Nynke has a light in a jar at her window. It is a piece of the god\'s, and it belongs under the god\'s roof, not on a sill. Things come up the quay at night to look at it, and they are not fish. Get it from her. She will not give it to me."',
    ], flag: 'q_nightlight', quest: { item: 'night_light', reward: 100, setFlag: 'q_nightlight_temple', done: [
      'He takes the shard in both hands and lays it in the shrine\'s dry bowl, and for a moment his lips stop moving.',
      '"There. Under the god\'s roof, such as it is." The green lies in the stone, and the bowl is dry round it. "It will not stop the counting. Nothing this size will. But the god has a piece of itself back, and her mother her sleep, and the things on the quay will find nothing to look at."',
      '"Take this. It is the offering, and the god was given it anyway."',
    ] }, says: [
      { after: { flag: 'q_nightlight_temple' }, lines: [
        '"It is still there. In the bowl." He nods at it. "I counted to eleven this morning before I caught myself. Then I looked at it and sang a line instead, and it came easier than it has since midsummer."',
      ] },
      { after: { flag: 'q_nightlight_sold' }, lines: [
        '"You sold it to the barge." He does not raise his voice. "It will go where the rest went, then, and the god is a piece smaller for it, and I am counting. Nine. Ten. You see? I can\'t stop."',
        '"Her mother sleeps, they tell me. Something does."',
      ] },
      { after: { flag: 'q_nightlight_kept' }, lines: [
        '"Still in her jar, and the glass things still up the bank by night, and her mother still not sleeping." He shakes his head. "You did what the child asked. That is a kindness to a child and a hardness to a village. They are often the same thing."',
      ] },
    ] },
    { kind: 'event', x: 1, y: 13, id: 'c3_sluice', once: true, text: 'The sluice-house at the diep\'s head, a gate of black oak in it, shut. Beyond it the diep runs on west under willows, out of sight, to the Long Water.' },
    { kind: 'event', x: 5, y: 11, id: 'c3_lofts', once: true, text: 'The net lofts on the north bank, nets hung from their beams to the water. A face at one window, then none.' },
    // Passage Paid (#56's 22), the people cut loose from the barge on C4's shoal: the boy home.
    { kind: 'npc', x: 6, y: 11, name: 'a boy of Rietum', after: { flag: 'q_passage_freed' }, lines: [
      'A boy of fourteen sits by the net lofts with a net across his knees, mending it, badly, and does not stop when you come up. The rope has left its marks on his wrists.',
      '"Mam says I\'m to thank you. Thanks." A knot, pulled tight. "They came off the barge at the willows and put a hand over my mouth. That\'s all. I don\'t know why me. I keep thinking there\'s a why, and there isn\'t."',
    ] },
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
    // The Night-Light (#56's 21): once the priest has asked, she puts the choice; after, her light
    // gone, kept, or gone out with the Stone home.
    ], says: [
      { after: LIGHT_TAKEN, lines: [
        'Nynke kneels on the bench at the window. The jar is gone from the sill, and the window is dark.',
        '"Mam sleeps now. She says thank you, but she says it to the river, not to me." She picks at the sill. "The glass people stopped coming. I thought I\'d be glad."',
      ] },
      { after: STONE_HOME, lines: [
        'The jar is on the sill, and the shard in it is green glass, by night as by day.',
        '"It went out. The night the temples started singing it went out like a candle, and the glass people didn\'t come, and they haven\'t since." She turns the jar on the sill. "It\'s just glass now. I\'m keeping it anyway. It was mine when it was something."',
      ] },
      { after: { flag: 'q_nightlight_kept' }, lines: [
        '"Still got it." She puts a hand on the jar. "Mam\'s given up. The glass people come and look, and I look back, and one of them had its hand on the window last night, flat, like a child at a sweet shop."',
        '"It\'s brighter when the river\'s up. It\'s been brighter lately. I don\'t know what that means."',
      ] },
      { after: { flag: 'q_nightlight' }, lines: [
        'A girl of the Tidefolk kneels on a bench at a low window, her jar on the sill, and does not look round. By day the shard in it is only glass.',
        '"You\'re from the priest. Everyone\'s from the priest. He wants my light for the god, and Tobin wants it for money, and Mam wants it gone so the glass people stop coming up the bank."',
        '"I found it. The morning after the green boat it was on the quay stones where the water had been, and nobody else wanted it. It\'s brighter when the river\'s up. It knows what the river\'s doing. When it\'s lit, one stone of the quay\'s face shines green underneath."',
        '"The glass people don\'t do anything. They just look. They\'re sad, I think. I\'m not frightened of them, and I\'m not giving it to a god who can\'t even sing."',
      ], choice: { ask: '"Well? Are you taking it, or asking, like the rest?"', answers: [
        { label: 'We\'ll take it.', sets: 'q_nightlight_taken', gives: 'night_light', says: [
          'She doesn\'t cry, which is worse. She tips the jar and the shard falls into her hand, green glass the size of a thumb, cool, and only glass by day.',
          '"Mam says a thing grown-ups want is a thing you lose. She was right." She puts it in your hand and wipes hers on her skirt. "Don\'t give it to Tobin. He\'ll only sell it down the river to whoever\'s got the rest."',
        ] },
        { label: 'Keep it, Nynke.', sets: 'q_nightlight_kept', says: [
          'She looks round for the first time.',
          '"Really?" A pause, while she looks at your faces for a trick and finds none. "Then tell the priest it\'s mine, and the glass people can look all they like. Looking\'s free."',
          '"If the god wants it back so badly, the god can come up the river and ask. That\'s what Mam says. She says it louder when she\'s cross."',
        ] },
      ] } },
    ] },
    // Tobin, a bargeman from upriver, across the diep on its north bank: he buys the light at the
    // first meeting and goes down with the tide, and the berth has an event after him.
    { kind: 'npc', x: 9, y: 11, name: 'Tobin, a bargeman from upriver', until: { flag: 'q_nightlight_sold' }, lines: [
      'A bargeman coils a line on a barge tied to the north bank, across the diep from the quay, with the ease of a man who has nothing to hide because nobody has asked. He is not Tidefolk. "Tobin. Upriver."',
      '"The kiddie\'s night-light? Everyone on this mound knows of it. I\'ve offered her gold for it and I\'d go higher. Not for me. There\'s a buyer downriver who takes that kind of glass by the sack, pays by the piece and doesn\'t ask where."',
      '"Bring it to me and I\'ll pay you well, and you\'ll have done the village a kindness. Those green things at the quay don\'t want the child. They want what she\'s got."',
    ], quest: { item: 'night_light', reward: 250, setFlag: 'q_nightlight_sold', done: [
      'Tobin weighs the shard in his palm, and his face does something careful.',
      '"That\'s it. That\'s the very stuff." He wraps it in oilcloth and stows it under his coat, not in the hold. "Well paid, as I said, and a bit over, because you didn\'t haggle. It goes down with the tide tonight. Where it ends up is nobody\'s business, least of all mine."',
      '"The kiddie\'ll get over it. Kiddies do."',
    ] }, says: [
      { after: { flag: 'q_nightlight_temple' }, lines: [
        'Tobin sits on his hatch with the line uncoiled beside him and does not get up.',
        '"The priest has it, I hear. In a dry bowl, doing nobody any good." He spits over the side. "There was gold in that, and you gave it to a man who counts."',
      ] },
      { after: { flag: 'q_nightlight_kept' }, lines: [
        'Tobin is on his barge still, the line coiled, the barge not gone.',
        '"Still in her jar, then. I can wait. The tide comes up twice a day and I\'ve nowhere better to be." He looks across at the window. "She\'ll tire of it. Kiddies do."',
      ] },
    ] },
    { kind: 'event', x: 9, y: 11, id: 'c3_berth', once: true, after: { flag: 'q_nightlight_sold' }, text: 'The berth on the north bank is empty, and a heron has it. Nobody says where the barge went. Nobody asked.' },
    // The secret: the clean stone in the quay's face, and the smuggler's old cache behind it.
    { kind: 'event', x: 7, y: 13, id: 'c3_glow', when: { hours: 'night' }, until: LIGHT_GONE, text: 'The child\'s jar throws green along the diep, and under one stone of the quay\'s face the water glows back brighter than the rest, as if the light had a way in.' },
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
    // Under the Edge: the flooded drain at the east fields' end, the grass and Sjonghol.
    { kind: 'event', x: 21, y: 16, id: 'c3_flood', once: true, text: 'A drain at the fields\' east end, flooded out over the stubble and the mud round it churned, as if something the size of a cart had wallowed there and gone back in.' },
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
    // Brinelings at the child's window by night, come to her shard's light, until it is gone from
    // her window or gone out with the Stone home (The Night-Light, #56's 21).
    { id: 'c3_brine', x: 2, y: 15, when: { hours: 'night' }, until: LIGHT_GONE, monsters: ['brineling', 'brineling', 'brineling', 'brineling'], aware: 3, roams: false, respawn: 1440 },
    // A bull toad alone in the flooded drain at the east fields' end, the hardest, well away from Sjonghol's mouth.
    { id: 'c3_toad', x: 24, y: 16, monsters: ['bull_toad'], aware: 4, respawn: 1440 },
  ],
};
