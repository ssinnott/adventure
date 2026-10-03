// Saltmouth, the free port: Act II's first town, band 10-12, entered from C6's land gate at 26,19.
// The inn, the Telhus (the drowned god's town shrine, which cures), the Seawall Armoury with the
// band's step on the ladder (#399), the Quay Chandlery, the Sail Loft (training to 13), the
// locksmith's, the Keel (the harbour tavern, the Salt Compact's hall, #182) and the Map Room,
// the Cartographers' Guild's hall (#181). Four first prestiges are taught here, each by a person at their
// trade: the astrologer, the locksmith, the stevedore and the ferryman. Jory Tallis stands at his
// house front on the quay, Kitto sells the boat to Wrackholm at the quay's end, and once Hale is gone a
// Warden off the coast road sits by the gate with the news.
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
    // The founder's last letter, carried from the hermit on Wrackholm's east rocks (#192): the hall's
    // own name back, the Compact's line's first proof (DESIGN §10.2).
    ], quest: { item: 'founders_letter', reward: 300, setFlag: 'q_hermit_hall', done: [
      'Ruan reads it standing at the bar, and the bar goes quiet round her the way a room does when the one who keeps it has stopped moving.',
      '"The Old Man\'s hand. I\'d know it in the dark." She reads it again. "Ten years of quarter-papers, and I\'ve read every one aloud in that back room and done what it said, and he\'s been under a cairn on Wrackholm the whole while."',
      'She folds it small and puts it inside her bodice, not in the box under the bar. "This doesn\'t leave me. Not for Tallis, not for the Wardens, not for you. Here\'s what a hall pays for its own name back. Say nothing in the front room. Say nothing anywhere."',
    ] }, says: [{ after: { flag: 'q_compact_run_done' }, lines: [
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
    // The other three first prestiges, taught in the street by people who keep no shop.
    { kind: 'npc', x: 10, y: 7, name: 'Hiske the astrologer', lines: [
      'A woman in the street with charts rolled under her arm and ink on her thumb, stood where the pilots pass, looking up though it is day.',
      '"Hiske. I draw the sky for the pilots, where the stars stand and where they will stand. Lately I draw it twice to be sure."',
      '"One of you has gone as far as rote takes anyone. There is a next part. It is not cheap and it is not comfortable."',
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
    // The founder's last letter, sold him instead of carried to the Keel (#192): he pays more.
    ], quest: { item: 'founders_letter', reward: 500, setFlag: 'q_hermit_tallis', done: [
      'Tallis reads it twice, and smiles once, at the end, briefly.',
      '"\'Bury me where I can see the ships.\' He always did like a view." He steps in through his door, and comes back without it. "The Compact takes its orders from a dead man\'s hand, or from whoever holds the pen now, and its hall doesn\'t know. That is worth a great deal to a man who has to live beside that hall."',
      '"Here. And a thing to remember: I didn\'t ask you to bring me this. You chose to. Choices of that kind are remembered too."',
    ] } },
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
    // What the Smugglers Feed (#192): Loveday on the harbour steps wants her son back from Wrackholm;
    // home, he sits beside her. Every Name in the Column (#192): Wat's elder boy, sent to Saltmouth by
    // the boat, on the quay.
    { kind: 'npc', x: 8, y: 13, name: 'Loveday, a fishwife of Saltmouth', flag: 'q_feed', lines: [
      'A woman on the harbour steps is gutting fish for the boats that come in, and asks each crew the same thing as they land, and gets the same nothing.',
      '"You\'re going over. To the isle. They said a company had the boat." She does not stop gutting. "My Tam went over in the spring for the money they pay a lad to carry, and the money came back twice, and then it stopped, and he didn\'t."',
      '"The crews say he\'s alive, and say it like they\'ve a mouthful of stones. Find him. Bring him if he\'ll come. If he won\'t, come and tell me why, to my face. I\'ve had enough of finding things out from the backs of men\'s heads."',
    ], says: [
      { after: { flag: 'q_feed_home' }, lines: [
        'Loveday has stopped gutting. She sits on the harbour steps with her hands in her lap, and a boy beside her with a bruise on his jaw the shape of a mother\'s hand.',
        '"He\'s home." That is all, for a while. "He says things about the cove, on these steps, to the boats, and the boats listen and say nothing back, which is how you know they\'re listening."',
        '"I\'ve nothing to pay you with. I\'ve a son. You\'ll take that as payment, and I\'ll not hear otherwise."',
      ] },
      { after: { flag: 'q_feed_tam' }, until: { slain: 'smugglers_cove2:kh2_great_devilfish' }, sets: 'q_feed_told', lines: [
        '"Alive, and feeding a thing in a hole, and all right." Loveday says it flat, and guts the next fish. "That\'s what you came to tell me to my face. Well, you\'ve told me. Thank you for the face."',
        '"I\'ll be on these steps when he\'s done being all right. Tell him that, if you\'re over again. Tell him the steps are here."',
      ] },
      { after: { flag: 'q_feed' }, lines: [
        'Loveday does not stop gutting. "Nothing on your face yet. Go over, then, and come back with something on it."',
      ] },
    ] },
    { kind: 'npc', x: 9, y: 13, name: 'Tam, who fed it', lines: [
      'Tam is on the steps beside his mother, and says, to the boats, loud enough: "It\'s dead, and I fed it, and the men who set me to it took their orders from a man who isn\'t there." A boat\'s crew looks at its feet.',
      '"I\'ve said it every tide for a week. Somebody will ask me to say it somewhere else, eventually. I\'ve the whole of it to say when they do."',
    ], after: { flag: 'q_feed_home' } },
    { kind: 'npc', x: 12, y: 10, name: 'Wat\'s elder boy, of Gullwick', lines: [
      'Wat\'s boy is on Saltmouth\'s quay in a borrowed coat, watching the boats come in the way a man does who knows how they are built.',
      '"There\'s a Gullwick hull in this harbour, painted over. I know her lines." He does not say which. "I\'ll work my way home along the coast, boat to boat. It\'s what my father would do. He\'d be slower about it."',
    ], after: { flag: 'q_column_saltmouth' } },
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
