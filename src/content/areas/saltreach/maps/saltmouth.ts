// Saltmouth, the free port: Act II's first town, band 10-12, entered from C6's land gate at 26,19.
// The inn, the Telhus (the drowned god's town shrine, which cures), the Seawall Armoury with the
// band's step on the ladder (#399), the Quay Chandlery, the Sail Loft (training to 13), the
// locksmith's, the Keel (the harbour tavern, the Salt Compact's hall, #182) and the Map Room,
// the Cartographers' Guild's hall (#181). Four first prestiges are taught here, each by a person at their
// trade: the astrologer, the locksmith, the stevedore and the ferryman. Jory Tallis stands at his
// house front on the quay, Kitto sells the boat to Wrackholm at the quay's end, and once Hale is gone a
// Warden off the coast road sits by the gate with the news. The Star That Moved (#56's 24): Hiske
// asks, and the pilots' slate goes to her press or to Tallis (#183).
// docs/areas/saltreach.md §4.9 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

export const SALTMOUTH: MapDef = {
  id: 'saltmouth',
  name: 'Saltmouth',
  kind: 'town',
  band: [10, 12],
  region: 'saltreach',
  start: { x: 7, y: 1, facing: SOUTH },
  palette: { wall: '#a8a294', wallDark: '#6a665c', floor: '#7e7a70', banner: '#2a5a6a' },
  rows: [
    '#######==#######',
    '#,T....==......#',
    '#.BBBB.==.BBBBB#',
    '#.BBBB.==.BBBB.#',
    '#.BBDB.==.BBDBS#',
    '#......==......#',
    '#==============#',
    '#......==......#',
    '#.BBBB.==.BBBBB#',
    '#.BDBD.==.DBDBD#',
    '#......==""""""#',
    '#.BBB.BB""WWWWW#',
    '#.BDB.BB""WWWWW#',
    '#.......""WWWWW#',
    '#.BBBB..""WWWWW#',
    '#########WWWWWW#',
  ],
  exits: [
    { x: 7, y: 0, to: 'saltings_c6', tx: 26, ty: 18, tf: NORTH, label: 'You leave Saltmouth by the land gate.' },
    { x: 8, y: 0, to: 'saltings_c6', tx: 26, ty: 18, tf: NORTH, label: 'You leave Saltmouth by the land gate.' },
    { x: 14, y: 3, to: 'saltings_c6', tx: 28, ty: 18, tf: NORTH, label: 'Down through the Keel\'s cellar, a barred door and a dark passage, and out onto the sand under the sea wall.' },
  ],
  features: [
    { kind: 'inn', x: 4, y: 4, name: 'The Tide Table', price: 25, interior: 'saltmouth_inn' },
    // The harbour tavern: the Salt Compact's hall to those who know (#182), and Ruan, who keeps it.
    { kind: 'npc', x: 12, y: 4, name: 'The Keel', interior: 'harbour_tavern', hall: 'compact', lines: [
      'A low vault against the sea wall, casks for tables and sawdust underfoot. Nobody looks up when you come in, which takes practice.',
      'A bargeman, loud: "Dues? The warehouse can whistle. There\'s a better paymaster on the river now, and he pays in grey."',
      'A pilot, quieter: "Tallis has three hulls in the roads and a fourth fitting out. For what, with the river empty?"',
      'The door at the back opens for a man you did not see come in, and shuts on the next who tries it.',
    ] },
    { kind: 'npc', x: 12, y: 4, name: 'Ruan, who keeps the Keel', lines: [
      'Behind the bar a woman dries a glass that was dry when she picked it up. The mirror behind her shows the door; she has not turned round once.',
      '"Beer is two, brandy is four. The back room is not for strangers and the sawdust is not for spitting in."',
      '"You want work? Drink first. The Keel likes to know a face before it knows a name."',
    ], says: [{ after: { flag: 'q_compact_run_done' }, lines: [
      '"Runner." A glass is set down before you ask. "The river crews have found somebody who pays in grey. We pay in coin and we are still here. Sit."',
      'She goes back to the door in the mirror. "Work comes when it comes."',
    ] }] },
    { kind: 'shop', x: 3, y: 9, name: 'Seawall Armoury', stock: ['morning_star', 'stiletto', 'horn_bow', 'long_axe', 'ironshod_staff', 'sharkskin', 'tidefolk_robe'], interior: 'saltmouth_armourer' },
    // The Thief's first prestige (DESIGN §5): the locksmith keeps his shop, and sells no picks.
    { kind: 'npc', x: 5, y: 9, name: 'Pender the locksmith', interior: 'saltmouth_locksmith', lines: [
      'A narrow walnut room and a wall of keys. A man with a glass in his eye bends under a water-globe lamp and does not stop for the bell.',
      '"Pender. Locks and keys, and the mending of either. I don\'t sell picks. I have not yet met anyone I would sell them to." He looks up at last.',
      '"But a thief who has learned all a lock can teach wants the lesson after that. I keep it, for a price."',
    ], teaches: { cls: 'thief', prestige: 1 } },
    { kind: 'shop', x: 10, y: 9, name: 'Quay Chandlery', stock: ['rations', 'torch', 'lantern_oil', 'potion_heal', 'antidote', 'elixir', 'potion_sp', 'potion_sp_great'], interior: 'saltmouth_chandlery' },
    { kind: 'temple', x: 12, y: 9, name: 'The Telhus', interior: 'saltmouth_shrine' },
    { kind: 'trainer', x: 14, y: 9, name: 'The Sail Loft', maxLevel: 13, interior: 'training_loft' },
    // The Cartographers' map room, the Guild's hall (#181): it sells what a surveyor takes out, and
    // gives out the Guild's quests. Ysolde reads the first Meridian journal to a company that carries
    // it, and gives it back.
    { kind: 'shop', x: 3, y: 12, name: 'The Map Room', stock: ['rations', 'antidote', 'lantern_oil', 'potion_heal'], interior: 'cartographers_room', hall: 'cartographers' },
    { kind: 'npc', x: 3, y: 12, name: 'Ysolde Carrow, Geographer of the Guild', lines: [
      'Pale plaster and north light. One wall is Caldera, ruled box by box, and a third of the boxes are empty. A globe, a plotting table, a book under glass.',
      '"The Cartographers\' Guild. We go where the chart is blank and come back, mostly." She does not look up from her rule. "Look, if you like. Touch nothing under glass."',
      '"The Meridian route book. They left it with us the morning they went out, thirty years since; the journals went down with them." A pause. "The empty boxes are not empty. We have not been yet."',
    ], says: [
      { after: { flag: 'meridian_read' }, lines: [
        '"Volume one, in Fane\'s hand, thirty years late." She has gone back to her rule, but the rule does not move. "The rest went down with them. Somewhere."',
      ] },
      { after: { item: 'meridian_journal' }, sets: 'meridian_read', lines: [
        'She sees the book before she sees you, and her rule stops. "Fane\'s hand. Volume one." She opens it on the plotting table and reads standing, and for a while says nothing.',
        '"Day two." She reads it out. "\'Lay dry under the arch where the causeway crosses the channel, in off the stones beside it. The tide did not reach us. A place to know again.\'"',
        'She shuts it and holds it a moment longer than she needs to, then puts it in your hands. "Keep it. It came up out of the dark in yours, not ours. Bring the next and I will read that too."',
      ] },
    ] },
    // The other three first prestiges, taught in the street by people who keep no shop. The
    // astrologer asks for the star that moved (#56's 24), and takes the pilots' slate for her press.
    { kind: 'npc', x: 10, y: 7, name: 'Hiske the astrologer', lines: [
      'A woman in the street with charts rolled under her arm and ink to the elbow, stood where the pilots pass, looking at the noon sky as if it had lied to her.',
      '"Hiske. I draw the pilots\' charts, my mother before me, and a Saltmouth pilot will take one out past the bar on a black night and trust it over his eyes. Since the Queen died, they don\'t. Three in a month have said the same thing, looking at their boots: a star has moved. Stars don\'t. I said so. They stopped coming."',
      '"Go out to the pilots\' stone on the pans south of the town, on a clear night, and watch the sky over the Scarp. Then tell me what you saw. I\'ll believe six pairs of eyes where I wouldn\'t believe one."',
      '"One of you has gone as far as rote takes anyone. There is a next part. It is not cheap and it is not comfortable."',
    ], flag: 'q_star', quest: { item: 'pilots_slate', reward: 200, setFlag: 'q_star_press', done: [
      'Hiske reads the slate there in the street, tilted to the light, and her mouth thins with each line.',
      '"Twelve hands. Twelve pilots who\'d sooner chalk it on a stone in the dark than say it to my face." She rubs the last line out with her thumb, and stops, and does not rub the rest. "It goes to the press tomorrow. A chart with a star that moves on it, and a note in the margin saying how much, and when. Let the port bolt. Ships don\'t sink from knowing."',
      '"Here. Twenty years I\'ve been paid for the sky standing still. Have some of it, now it doesn\'t."',
    ], early: [
      'Hiske sees the slate before she sees you, and puts out her hand for it. She reads it there in the street, tilted to the light, and her mouth thins with each line.',
      '"The pilots\' stone. A month I\'ve asked them about the sky, and they\'ve been answering it to a rock." She rubs the last line out with her thumb, and stops, and does not rub the rest. "Twelve hands. It goes to the press tomorrow: a chart with a star that moves on it, and a note saying how much, and when. Let the port bolt."',
      '"I\'d have paid six strangers to fetch me this. I\'ll pay six who fetched it unasked."',
    ] }, says: [
      { after: { flag: 'q_star_tallis' }, lines: [
        '"You took it to the dockmaster." She is drawing, a chart flat against the wall, and does not stop. "I know, because my pilots have new charts they didn\'t get from me, with a very sensible note on them about fresh bearings. Sensible. I could have wept."',
        '"Something walks about over the Scarp at night, and the man with the hulls has decided we\'re better off not knowing. He may be right. I shan\'t forgive him either way."',
      ] },
      { after: { flag: 'q_star_press' }, lines: [
        'The chart is pinned up where the pilots pass: their star over the Scarp, a dotted line behind it and a hand\'s width marked in red.',
        '"They came and bought it and didn\'t look me in the eye. Every pilot in the port. Then the Compact\'s clerk came and bought ten, and asked had I drawn any others." She wipes her hands. "I don\'t sleep well. I didn\'t when it stood still either. I was just wrong about why."',
      ] },
      { after: { flag: 'q_star' }, lines: [
        '"The pilots\' stone, on the pans south of the town, where the lanes cross. A clear night, and the sky over the Scarp. Then come and tell me." She looks up, though it is day.',
      ] },
    ], teaches: { cls: 'sorcerer', prestige: 1 } },
    { kind: 'npc', x: 11, y: 10, name: 'Baukje the stevedore', lines: [
      'A woman the size of a door stands among the bales with a hook in her belt and a bale on her shoulder she has forgotten about.',
      '"Baukje. I lift what comes off the boats and put it where it goes, and when the crews get loud I put them where they go." She sets the bale down.',
      '"One of you carries themselves like a fight waiting to happen. I know the look. I can teach it where to go."',
    ], teaches: { cls: 'barbarian', prestige: 1 } },
    { kind: 'npc', x: 9, y: 14, name: 'Tjerk the ferryman', lines: [
      'An old man sits in a flat boat at the steps with the oars across his knees. The boat does not move, though the water does.',
      '"Tjerk. Across and back, a penny, or your company for the crossing, and I\'ll take the company." He looks at one of you longer than the rest.',
      '"Row against the tide, you lose. Row with it, you lose later. There is a third way. Sit. I\'ll show you where to put your hands."',
    ], teaches: { cls: 'monk', prestige: 1 } },
    // Jory Tallis, at his house front on the quay (DESIGN §10.1): the throne touched, not opened.
    { kind: 'npc', x: 8, y: 11, name: 'Jory Tallis, dockmaster of Saltmouth', lines: [
      'A big man in a good coat before the one stone house on the quay, his door open behind him. He looks at ships the way other men look at money.',
      '"Tallis. Dockmaster, and the hulls in the roads are mine, which in a free port is the same as mayor." He names three ships without turning to look at them.',
      '"Mine is an old name, older than the port. Helmstow\'s chair stands empty, and its Council counts on its fingers. A port counts hulls." He wishes you a good tide.',
    // The Star That Moved (#56's 24): his throne words first, always, then the star's; he buys the
    // pilots' slate at the first meeting, for more than the astrologer pays.
    ], flag: 'sm_tallis_word', quest: [{ item: 'pilots_slate', reward: 400, setFlag: 'q_star_tallis', done: [
      'Tallis reads the slate once, in the light of his door, and tucks it face down under his arm.',
      '"A hand\'s width since midsummer. Well." He counts your coin out of his coat, and adds to it. "My pilots will have new charts by the month\'s end, with a note that a bearing is to be taken fresh each night, as good seamanship always said. Nothing printed about why. The astrologer will be paid for the drawing, and will not see this."',
      '"You\'ll want to know what I make of it. I make of it that the sky has a matter before it, and so has Helmstow, and a man who keeps his head in the one may be remembered in the other."',
    ] }], says: [
      { after: { flag: ['sm_tallis_word', 'q_star_tallis'] }, lines: [
        '"The charts are out, the port is calm, and nobody has said the word star to me in a week." Tallis does not turn from the roads. "That is what I paid for. You\'ll find I remember what I paid for, and who brought it, when remembering is useful. It will be."',
      ] },
      { after: { flag: ['sm_tallis_word', 'q_star_press'] }, lines: [
        '"She printed it." Tallis says it lightly, a man remarking on rain. "Two crews refused to sail the night it went up, and I paid them to sail anyway, and they did. So it cost me, and I dislike a cost I didn\'t choose."',
        '"No matter. A port forgets. I don\'t, but a port does."',
      ] },
      { after: { flag: ['sm_tallis_word', 'q_star'] }, until: [{ flag: 'q_star_press' }, { flag: 'q_star_tallis' }], lines: [
        'Tallis stands at his door on the quay with his hands behind him and the hall with its lineage behind that. He does not ask you in.',
        '"The astrologer has been asking my pilots about the sky. My pilots. I have a hundred and forty hulls that steer by her charts, and she\'d like to print, in ink, that the sky can\'t be trusted." He looks at the roads. "A port is a nervous animal. It bolts at a word."',
        '"If there\'s a thing to know, I\'ll know it, and pay a company\'s price to be the one who does, and decide when Saltmouth hears it. That\'s not secrecy. That\'s a dockmaster\'s job."',
      ] },
    ] },
    // The boat to Wrackholm's landing (#164): a fare, never a favour, at the quay's end.
    { kind: 'npc', x: 14, y: 10, name: 'Kitto, who has a boat', lines: [
      'A man at the quay\'s end with a boat under him, coiling a line. He has seen you coming and not stopped coiling.',
      '"Kitto. Wrackholm, the landing, a hundred and fifty the boat. We go out at eight tonight and you step off at six, with the light."',
      '"A fare is a fare. Favours I don\'t do, debts I pay. Midsummer a barge came down with no lamp lit and never tied up. Straight out past the harbour lamps to a ship riding off Wrackholm. My boat goes out there. I don\'t ask why." He pulls the line tight.',
    // The ship the Stone went to (#180): his word, whichever words he greets a company with.
    ], flag: 'sm_ship_word', says: [{ after: { flag: 'q_passage_owed' }, sets: 'sm_ship_word', lines: [
      '"Hessel\'s word, is it." He looks at the water as though it owed him. "That squares him with me. Out to Wrackholm for nothing, back is a fare, and I still don\'t ask why. Get in."',
      '"There was a barge at midsummer, no lamp on her, that never tied up. Straight out past the harbour lamps to a ship off Wrackholm. My boat goes there too, and I still don\'t ask why."',
    ] }, { after: { flag: 'q_compact_run_done' }, sets: 'sm_ship_word', lines: [
      '"Keel\'s people, are you." He looks at the sky as though it had arranged this. "Seventy-five to Wrackholm, then. A fare is a fare and a half fare is a half fare, and I still don\'t ask why. Get in."',
      '"A barge came down at midsummer with no lamp lit and never touched the quay. Out past the lamps to a ship riding off Wrackholm, and that is where I go. I don\'t ask why."',
    ] }],
    // Half to a member of the Compact, never withheld from anyone (EXPANSION §2.2; #182); nothing on
    // Hessel's word, for the barge pushed off his shoal (Passage Paid, C4, #171).
    passage: [{ to: 'wrackholm_e6', x: 16, y: 15, facing: NORTH, name: 'Wrackholm', by: 'boat', fare: 150, half: { flag: 'q_compact_run_done' }, free: { flag: 'q_passage_owed' }, departs: 20, days: 1, arrives: 6,
      label: 'The boat grounds at the stage with the first light and you step ashore, rested. The cliff is already between you and the sea.' }] },
    // The Warden come down the coast road with the news of Hale (#180): there once #156 has taken
    // Hale from the Scarth, and gone once Hale is freed from the Tide Ship's hold, so the news is
    // never told before it is true or after it is stale.
    { kind: 'npc', x: 9, y: 1, name: 'a Warden off the coast road', lines: [
      'A man in Warden grey sits on an upturned crate by the gate with his boots beside him and the coast road still on his cloak. He looks up as if you were one more mile.',
      '"Down the coast road from the Scarth, and I have told it at every post on the way, so I will tell it here. Captain Hale sent his copy of the ledger up to the Regent. It reached him. Hale has not been seen since."',
      '"The Scarth is held now by men in grey I never saw before, and they did not know my name either. I am not going back up." He puts his boots on, slowly.',
    ], flag: 'sm_hale_word', after: { flag: 'q_hale_taken' }, until: { flag: 'q_hale_freed' } },
    { kind: 'event', x: 8, y: 11, id: 'sm_lineage', text: 'Through Tallis\'s door a hall, and on its wall a lineage framed, name over name up to a crown. The ink is one shade from top to bottom.' },
    { kind: 'event', x: 7, y: 1, id: 'saltmouth_intro', once: true, text: 'Saltmouth. Grey stone, tarred wood, gulls on everything, and under the gate\'s noise the slap of water that never stops.' },
    { kind: 'sign', x: 6, y: 1, text: 'Saltmouth. Land gate: the Salt Road, the barge quay, Rietum.' },
    { kind: 'well', x: 4, y: 7, text: 'An iron pump in the square with a trough under it. The water comes up brown and tastes of the harbour.' },
    { kind: 'event', x: 13, y: 10, id: 'sm_quay', once: true, text: 'The quay. Hulls two deep, bales under tarpaulin, a crane and the horse that works it. Everyone is busy and nobody is in a hurry.' },
    { kind: 'event', x: 14, y: 7, id: 'sm_wall', once: true, text: 'The sea wall. Beyond it the harbour mouth, a lamp on a post either side, and Sylmeer going out grey to no edge at all.' },
    { kind: 'event', x: 8, y: 14, id: 'sm_steps', once: true, text: 'Stone steps down to the water, green from the third one. A flat boat rides at them, and across the harbour the far quay.' },
    { kind: 'event', x: 1, y: 8, id: 'sm_nets', once: true, text: 'Nets hung to dry along the wall, and women with needles going along the holes. The fish on the slabs behind are few and small.' },
    { kind: 'event', x: 3, y: 13, id: 'sm_customs', once: true, text: 'The customs house, shut, the Crown\'s arms over the door and the brass gone green. A chalk mark on the step that somebody renews.' },
    // The Compact's first task (#182): the customs house door, passed with the cask, and only then.
    { kind: 'event', x: 4, y: 13, id: 'sm_customs_run', once: true, after: { item: 'brandy_cask' }, until: { flag: 'q_compact_run_done' },
      text: 'The customs house door stays shut and the chalk on its step is fresh this morning. Nobody comes out to ask what is in the cask; nobody, you begin to think, ever has.' },
    // The secret: the Keel's cellar, through its end wall, and out under C6's sea wall by the rope.
    // Its door is barred on the cellar side, so the way runs one way only, and the smugglers' stair
    // and its cache are still had only through C6's own secret (#182).
    { kind: 'event', x: 14, y: 5, id: 'sm_sawdust', text: 'Sawdust from the Keel\'s floor lies trodden out along the foot of its end wall, further than any floor reaches.' },
  ],
  secrets: [{ x: 14, y: 4, hint: 'sm_sawdust' }],
};
