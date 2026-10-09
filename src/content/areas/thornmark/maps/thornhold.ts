// Thornhold, the elf-hold of Thornmark. The second town: an inn, the Lantern Chapterhouse (the
// temple), the Lantern Hall (spells to tier 4 and the Lanterns' quests), an armoury with the
// Thornmark tier of gear, the Elder's training yard (to level 11, a level past its band), the Split
// Oak tavern and Elder Sylvane, who wants proof of who cut the Stone. Three first prestiges are
// taught here: the Ranger's, the Cleric's and the Druid's (#19).
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

/** Sylvane's words once the chisel is paid for: after her hand-in, and once, before the brigands' terms. */
const GROVE_QUIET = ['"The Grove is quiet again. The cut will need a Lantern to mend, and we have sent for one. The treaty is in Henlys, south through the deep past the Grove; ask for the lorekeeper, and say I sent you. Rest here first. Thornhold owes you."'];
/** Sylvane's words once the treaty is seen: once before the brigands' terms, and after them. */
const TREATY_SEEN = ['"You have seen it, then. Two seals on one skin: the Crown\'s, and ours, and ours is the mark on the chisel that cut our Stone." She looks at her hands. "Two hundred years we have called that mark ours. I no longer know whose it is. Keep that from Vask as well."'];

export const THORNHOLD: MapDef = {
  id: 'thornhold',
  name: 'Thornhold',
  kind: 'town',
  band: [5, 10],
  region: 'thornmark',
  start: { x: 7, y: 14, facing: NORTH },
  palette: { wall: '#c8b890', wallDark: '#8a7a58', floor: '#7a8a50', banner: '#2a6a3a' },
  rows: [
    '################',
    '#,T,,,,,,,,,,T,#',
    '#,BBBB,==,BBBB,#',
    '#,BBBB,==,BBBB,#',
    '#,BBDB,==,BDBB,#',
    '#,,,,,,==,,,,T,#',
    '#==============#',
    '#,T,,,,==,,,,,,#',
    '#,BBBB,==,BBBB,#',
    '#,BBBB,==,BBBB,#',
    '#,BBDB,==,BDBB,#',
    '#,,,,,,==,,,,,,#',
    '#,BBB,,==,,BBB,#',
    '#,BDB,,==,,BDB,#',
    '#,T,,,,==,,,,T,#',
    '#######==#######',
  ],
  exits: [
    { x: 7, y: 15, to: 'thornmark', tx: 23, ty: 5, tf: SOUTH, label: 'You leave Thornhold by the oak gate.' },
    { x: 8, y: 15, to: 'thornmark', tx: 23, ty: 5, tf: SOUTH, label: 'You leave Thornhold by the oak gate.' },
  ],
  features: [
    { kind: 'inn', x: 4, y: 4, name: 'The Green Man', price: 20, interior: 'green_man' },
    { kind: 'temple', x: 11, y: 4, name: 'Lantern Chapterhouse', interior: 'lantern_chapterhouse' },
    { kind: 'shop', x: 4, y: 10, name: 'Thornhold Armoury', stock: ['longsword', 'warhammer', 'battleaxe', 'greatsword', 'crossbow', 'elfbow', 'rune_dagger', 'grove_staff', 'chain', 'runed_robe', 'brigandine', 'plate', 'tower_shield', 'elixir', 'potion_sp_great', 'lantern_oil', 'rations'], interior: 'thornhold_armoury' },
    { kind: 'guild', x: 11, y: 10, name: 'Thornhold Lantern Hall', classes: ['cleric', 'sorcerer', 'paladin', 'ranger', 'bard', 'druid'], fee: 200, maxTier: 4, interior: 'lantern_hall', hall: 'lanterns' },
    { kind: 'trainer', x: 3, y: 13, name: "The Elder's Yard", maxLevel: 11, interior: 'elders_yard' },
    { kind: 'npc', x: 12, y: 13, name: 'The Split Oak', interior: 'split_oak', lines: [
      'A tavern built around a living oak. The elves drink slowly and watch the door.',
      'A forester says: "The Stone went quiet a month back. Then the wolves got big. Then the wolves got strange."',
      'A Lantern in travel-grey, not drunk: "Vask sent a survey team south-west before the Stone even failed. How did he know?"',
      'A brigand, or a man dressed like one, pays for his ale with a coin that is not from Caldera.',
    ] },
    { kind: 'well', x: 7, y: 6, text: 'A spring in an oak-root basin. The water is cold and sweet.', heal: true },
    { kind: 'sign', x: 8, y: 14, text: 'Thornhold. South gate: the Warden road, the bridge, the Grove.' },
    // Hale's Sergeant (#558): Wystan at the gate once Hale is taken from the Scarth (#156), until he
    // is answered; the shore is on H3's shingle. Talked down, he keeps the Split Oak's door; let go,
    // he is gone. Either answer gives Hale's token, which Hale knows in the Tide Ship's hold.
    { kind: 'npc', x: 9, y: 14, name: 'Wystan, sergeant of the Scarth', lines: [
      'An old Warden in grey stands by the gate with a borrowed horse saddled and the reins in his fist. He walked here; the boots say so.',
      '"Hale\'s sergeant. I followed the riders from the post as far as this gate and lost them. Nobody here will say which way, and I\'ve not the legs to ask the forest."',
      '"So I ride for Helmstow and say it to the Regent\'s face. Before I do, go down to the shingle below the camp, past the Grove, on the Deepthorn\'s edge. If they went to the water, the water will say."',
    ], flag: 'q_sergeant', after: { flag: 'q_hale_taken' }, until: [{ flag: 'q_sergeant_stays' }, { flag: 'q_sergeant_rides' }], says: [
      { after: { seen: 'deepthorn_h3:h3_boat' }, lines: [
        'He hears it out with the reins in his hand, and at the knife his face shuts.',
        '"Compact boat, Warden boots. Carried off west like cargo, by men who drew his pay." He puts a foot to the stirrup.',
      ], choice: { ask: '"Well? Do I ride to Helmstow and put this to the Regent\'s face, or do I stand down?"', answers: [
        { label: 'Don\'t ride.', sets: 'q_sergeant_stays', gives: 'hale_token', says: [
          'He stands a long moment with the reins, then unbuckles the girth. "Aye. Two gone is no better than one, and somebody should keep a door here."',
          'From inside his coat, a bronze disc notched at the rim for the Scarth, Hale\'s mark cut across it. "Every post captain carries one. He\'ll know it, if you find him."',
        ] },
        { label: 'Ride, then.', sets: 'q_sergeant_rides', gives: 'hale_token', says: [
          'He nods once, the way a man does when told what he already knew, and takes a bronze disc from inside his coat, notched at the rim for the Scarth, Hale\'s mark cut across it.',
          '"Every post captain carries one. He\'ll know it, if you find him. I\'ll not need it where I\'m going." He is in the saddle before the gate is fully open.',
        ] },
      ] } },
      { after: { flag: 'q_sergeant' }, lines: [
        '"The shingle below the camp. I\'ll hold the horse till you\'re back, and no longer."',
      ] },
    ] },
    { kind: 'npc', x: 12, y: 13, name: 'Wystan, at the Split Oak\'s door', lines: [
      'The old sergeant has a stool by the door and the look of a man who was given a post and means to hold it.',
      '"A door is a pass with a roof. Somebody has to say who comes through it, and I\'ve the habit."',
    ], after: { flag: 'q_sergeant_stays' } },
    { kind: 'npc', x: 9, y: 5, name: 'Elder Sylvane of Thornhold', lines: [
      'An elf in a robe the colour of bark, older than any human you have met. She does not rise.',
      '"The Grove Stone has been cut. Not failed: cut, by hands, with tools. My people will not go under the roots; what has come through has already taken four of them."',
      '"Vask will tell you the Stones are failing. Bring me the tool that cut ours, and we will both know better."',
    ], flag: 'q_grove', quest: {
      item: 'ashen_chisel', reward: 1500, setFlag: 'q_grove_done',
      early: [
        'An elf in a robe the colour of bark, older than any human you have met. She sees what you carry and rises, and takes the chisel in both hands.',
        '"This cut our Stone. Not forged anywhere in Caldera: the edge does not blunt. The runes are Underdeep, and they are a maintenance mark, not a prayer." She sets it down as if it were hot.',
        '"Whoever arms the Ashen Hand can reach the Underdeep. Keep this from the Regent-Warden until you know which side of it he stands on. The Lanterns will pay for this, and pay well. I have seen that mark before, on the seal of a treaty my people keep in Henlys, south through the deep. Go and look at it."',
      ],
      done: [
        'Sylvane takes the chisel in both hands and is silent for a long time.',
        '"This was not forged anywhere in Caldera. The edge does not blunt. The runes are Underdeep, and they are a maintenance mark, not a prayer." She sets it down as if it were hot.',
        '"Whoever arms the Ashen Hand can reach the Underdeep. Keep this from the Regent-Warden until you know which side of it he stands on. The Lanterns will pay for what you have done here, and pay well."',
        '"I have seen that mark before, and not on a tool: on the seal of a treaty my people keep in Henlys, south through the deep. Go and look at it."',
      ],
      after: GROVE_QUIET,
    }, says: [
      // The side quests (#219). Words keyed to another quest's flag wait on her own first meeting, or
      // the chisel, as the Foreland's do (harrow.ts). What is said once comes first, then the brigands' terms, open until
      // the company answers Thora, then after. Her Grove words are said once before the terms, so
      // the chisel paid is still news at the next meeting.
      { after: [{ flag: ['q_grove', 'q_trees_sylvane'] }, { flag: ['q_grove_done', 'q_trees_sylvane'] }], until: { flag: 'q_trees_done' }, sets: 'q_trees_done', lines: [
        'Sylvane hears the burner out without rising, and without once looking at his axe, which is more than he can manage.',
        '"Paid to fell the marked oaks. By a Lantern in travel-grey, with coin that is not coin." She turns to you. "The Hand marked those trees. Now someone pays to have them felled, in the Hand\'s coin, in a Lantern\'s coat. I want you to remember that. I will."',
        '"Burner. You go over the Scarth tonight with what you came with, and you do not come back into Thornmark while I live. That is not a punishment. It is the only mercy the wood has left in it."',
      ] },
      { after: [{ flag: ['q_grove', 'q_hunters_told'] }, { flag: ['q_grove_done', 'q_hunters_told'] }], until: { flag: 'q_hunters_shut' }, sets: 'q_hunters_shut', lines: [
        'Sylvane hears it through without a word, and when you have finished she is quiet for so long that you wonder whether she heard.',
        '"The lodge was built on my sufferance, and its hunters have walked my wood for sixty years, and the one night it mattered they looked at the river." She closes her eyes. "They winter in the deep. Thornhold\'s gate is shut to them until the Stone is whole, and they may tell their grandchildren why."',
        '"You did right to tell me. I do not thank you for it. Those are different things, and you are old enough to know it."',
      ] },
      { after: [{ flag: ['q_grove', 'q_glass_truth'] }, { flag: ['q_grove_done', 'q_glass_truth'] }], until: { flag: 'q_glass_told' }, sets: 'q_glass_told', lines: [
        'Sylvane does not ask what the glass held. She waits, and you tell her, and at the word mend she closes her eyes.',
        '"My mother\'s time. I was a child; I remember the winter, and Lanterns in the Grove, and being told nothing. So there is a glass that remembers what I was told to forget." She opens her eyes. "Since the Reader would keep it from me, I will give you something she does not have. The mark on the chisel that cut our Stone is on the seal of a treaty in Henlys, south through the deep. My mother said once it was on the mend, too, and never again. Go and see it."',
      ] },
      { after: { flag: 'q_terms_carry' }, until: { flag: 'q_terms_taken' }, sets: 'q_terms_taken', lines: [
        'Sylvane hears the terms, and the villages\' names, and the children\'s, and when you have finished she rises, which she does not do.',
        '"Aldwick. I bought wool from Aldwick when your grandmother was a girl." She stands a while. "Thornhold takes them. The north wall, inside the gate, until the thaw; they cut wood and keep the peace, and the first of them who touches the road is over the pass, and the rest with him. Tell her that. Tell her I did not say yes. Tell her I said the north wall."',
      ] },
      { after: { flag: 'q_mender_done' }, until: { flag: 'q_sylvane_mended' }, sets: 'q_sylvane_mended', lines: [
        '"The Reader has mended it. She came up out of the roots grey to the elbows and asked for a bath and a bed, in that order." Sylvane almost smiles. "The Grove hums as it did when I was a child. I had forgotten the note."',
      ] },
      // The treaty seen, her lead south is news no more: its words stand in for the Grove's, once.
      { after: { flag: ['q_grove_done', 'q_treaty'] }, until: { flag: 'q_sylvane_treaty' }, sets: ['q_sylvane_treaty', 'q_grove_rest'], lines: TREATY_SEEN },
      { after: { flag: 'q_grove_done' }, until: { flag: 'q_grove_rest' }, sets: 'q_grove_rest', lines: GROVE_QUIET },
      { after: { flag: ['q_grove_done', 'q_grove_rest'] }, until: [{ flag: 'q_terms_carry' }, { flag: 'q_terms_refuse' }], sets: 'q_terms', lines: [
        '"A woman came to my gate under a green branch, from the brigands on the Warden road, and offered me terms. Her people leave the road alone, and Thornhold takes them in for the winter. Takes them in. Forty of them, she said, and children." Sylvane\'s hands are still. "I sent her back down the road with her branch. Thornhold does not treat with those who rob it."',
        '"You are not Thornhold\'s. If you went to her camp, and came back, and told me what you saw, I would listen. I would not promise to hear."',
      ] },
      { after: { flag: 'q_terms_refuse' }, lines: [
        '"You told her no, to her face, with the children there." Sylvane does not look up. "So did I. It was easier from a gate."',
      ] },
      { after: { flag: ['q_grove_done', 'q_treaty'] }, lines: TREATY_SEEN },
    ] },
    // The three first prestiges taught here (#19; DESIGN §5), each by a person at their trade.
    // The Ranger's: the fletcher, in the Armoury, whose bows it sells.
    { kind: 'npc', x: 4, y: 10, name: 'Jago, fletcher of Thornhold', lines: [
      'A bench at the back, past the racked steel, and an elf at it with a shaft across his knee, laying the third feather. He finishes it before he looks up.',
      '"Jago. Bows, and the shafts for them; the smith does the heads. Those on the wall are mine, and there is not a bad one among them." He sights down the shaft.',
      '"An arrow is a long time in the air. Long enough to nock the next, if the hand knows the way without the eye. One of you has the makings. Bring your bow to the bench."',
    ], teaches: { cls: 'ranger', prestige: 1, seek: 'Jago the fletcher, at his bench in the Thornhold Armoury, can make an Outrider of a ranger.' } },
    // The Cleric's: the bone-setter, in the Chapterhouse, whose cures are her trade.
    { kind: 'npc', x: 11, y: 4, name: 'Derwa, bone-setter of the Chapterhouse', lines: [
      'Linen and splints on the benches, and the hold\'s hurt laid along them. An elf woman goes down the row with her sleeves pinned back, and does not pause for you.',
      '"Derwa. The Lanterns pray over them, and then I set them. Both are needed. Only one of them is a trade." She ties off a splint.',
      '"A prayer goes as far as a prayer goes. Put a hand behind it and it goes further; I have measured the difference in bone. One of you has the makings. Wash your hands and hold this end."',
    ], teaches: { cls: 'cleric', prestige: 1, seek: 'Derwa the bone-setter, among the benches of the Lantern Chapterhouse in Thornhold, can make a Curate of a cleric.' } },
    // The Druid's: the beekeeper, under the north-east oak; honey and salves wait on #18, so no shop.
    { kind: 'npc', x: 14, y: 1, name: 'Lowen, who keeps the bees', lines: [
      'Skeps in a row under the oak by the wall, and an elf woman among them with her arms bare and the bees walking on them. She is not stung, and does not seem to expect to be.',
      '"Lowen. I keep the bees, and the Chapterhouse burns their wax. They have not settled since the Stone. Nor have I, but they show it."',
      '"A swarm is not commanded. It is led, and only by one who can bear to stand in the middle of it. One of you has the makings. Bare your arms and stand where I stand."',
    ], teaches: { cls: 'druid', prestige: 1, seek: 'Lowen, who keeps the bees under the oak in Thornhold\'s north-east corner, can make a Swarmcaller of a druid.' } },
    { kind: 'event', x: 7, y: 14, id: 'thornhold_intro', once: true, text: 'Thornhold. Houses grown around living trees, and a hush that is not peace.' },
    // The Rest of the Survey (#77): Ailith, once the company sent her here.
    { kind: 'npc', x: 11, y: 4, name: 'Ailith, adjunct of the survey', lines: [
      'Ailith is in the Chapterhouse with her leg in a proper splint and her arms full of somebody else\'s charts.',
      '"You got me here. The Elder heard me out and didn\'t rise, which is her way of standing up. I\'ve told her the company that found me is to be trusted. She said she\'d decide that for herself." A small smile. "She will. She\'ll decide it my way."',
    ], after: { flag: 'q_survey_thornhold' } },
    // A Coin Not From Caldera (#219): Tegen at the tavern's square. Her question is put until the
    // company takes the coin; Leofwin's camp is on the Thornmark map.
    { kind: 'npc', x: 12, y: 13, name: 'Tegen, keeper of the Split Oak', lines: [
      'The keeper of the Split Oak, an elf with a cloth over her shoulder, sets a coin on the bar between you and waits for you to pick it up. It is smooth, grey, heavier than it looks, and has no face on either side.',
      '"He paid with that. The one dressed like a brigand, three nights running, and I took it three nights running, because a coin\'s a coin. Then I tried to spend it. Nobody in Thornhold will touch it. It doesn\'t tarnish, it doesn\'t ring, and it isn\'t from anywhere."',
      '"He\'s a deserter; I know the Warden walk. He\'s camped off the road with the road\'s brigands, north of the bridge, and he goes up the Grove road by night with a pack that clinks. I don\'t want his coin, and I want to know what it is."',
    ], choice: { ask: '"Take it off my hands, and go and ask him where it comes from?"', answers: [
      { label: 'We\'ll find him.', sets: 'q_coin', gives: 'faceless_coin', says: [
        '"Good. Keep the coin. If he wants it back, he can tell you where it\'s from first."',
      ] },
      { label: 'Not our trade.', says: [
        '"No. Nobody\'s, it seems." She puts the coin back under the bar, where it will not tarnish. "It\'ll keep."',
      ] },
    ] }, says: [
      { after: { flag: 'q_coin_walk' }, lines: [
        '"He walked? Good. He was a poor brigand and a worse customer." She wipes the bar. "The Grove road, and a man in grey with a bag. I\'ll hear that again, I expect. Keep the coin. Whatever it\'s for, it isn\'t for drink."',
      ] },
      { after: { flag: 'q_coin_fight', slain: 'thornmark:tm_deserters' }, lines: [
        '"Dead in the trees, they say, and his band with him." She does not stop wiping the bar. "So we\'ll never know what it\'s for. Keep it anyway. Whatever it\'s for, it isn\'t for drink."',
      ] },
      { after: { flag: 'q_coin' }, lines: [
        '"Keep the coin. If he wants it back, he can tell you where it\'s from first."',
      ] },
    ] },
    // How Did He Know (#214): Idony, the Split Oak's Lantern in travel-grey. The orders are in the
    // survey team's fire-pit in H3; she takes them at the first meeting and asks at the next.
    { kind: 'npc', x: 12, y: 13, name: 'Idony, a Lantern in travel-grey', lines: [
      'The Lantern in travel-grey has a cup of water and a chart she is not looking at, and she has looked at you twice since you came in.',
      '"You\'ll have heard me say it. Vask sent a survey south-west before the Stone even failed. I was not being clever; I was being loud, so that somebody would tell me I was wrong. Nobody has."',
      '"Four Lanterns, under the Regent\'s seal, and I taught two of them to hold a wand. One is dead under Ashcombe. Their camp is south of the Grove, over the edge of the deep, and their orders are with it, and I want them. Not for the Chapterhouse. For Lantern Watch, in Sunderwood, where Lanterns still ask questions."',
      '"I\'d go myself. I have been as far as the sign three times, and turned back three times, and I am not ashamed of it. You have the look of people who don\'t turn back."',
    ], flag: 'q_orders', until: { flag: 'q_orders_watch' }, quest: {
      item: 'survey_orders', reward: 300, setFlag: 'q_orders_read',
      done: [
        'Idony reads what the fire left, and the clerk\'s line under it, and lays the paper face down on the table as if it could be read from across the room.',
        '"Three days before the Queen died. \'What the seam does, and when.\' He knew there was a seam. He knew it would do something." She is very quiet. "I have been loud for a month, and I was not loud enough."',
        '"This goes east. There is a watchtower on the far side of the Sunder where the Lanterns read what they are given, and they will read this, and the order will split on it, and it should. That is Lantern money. It is not enough."',
      ],
      early: [
        'The Lantern in travel-grey looks at the burnt paper in your hand before she looks at you, and holds out hers.',
        '"You\'ve been over the edge of the deep. I know that paper; I\'ve asked for it in every tavern between here and Helmstow, and none of them heard me." She reads what the fire left. "Three days before the Queen died. \'What the seam does, and when.\' He knew."',
        '"This goes east, to Lantern Watch, where Lanterns still read what they are given. That is Lantern money. It is not enough."',
      ],
    }, says: [
      { after: { flag: 'q_orders_read' }, until: [{ flag: 'q_orders_watch' }, { flag: 'q_orders_council' }], lines: [
        'Idony has the burnt paper face down under her hand.',
      ], choice: { ask: '"I carry these east tonight. Unless you want them for Helmstow: a Council will sit on the throne one day, and a paper like this would sit with it. The Watch\'s, or yours?"', answers: [
        { label: 'Take them to the Watch.', sets: 'q_orders_watch', says: [
          '"The Watch, then." She folds the paper into the chart, and the chart into her coat. "I\'ll be over the bridge before the elves are up. If anyone asks the Split Oak where its loud Lantern went, it never had one."',
        ] },
        { label: 'Give them back to us.', sets: 'q_orders_council', gives: 'survey_orders', says: [
          '"For the Council." She gives it back the way you would hand someone a lamp. "Then keep it dry and keep it quiet, and when the day comes, read them the clerk\'s line first. It\'s the only line on it a Council will understand."',
          '"I\'ll go east with what\'s in my head. It\'s less than a paper, and harder to burn."',
        ] },
      ] } },
      { after: { flag: 'q_orders_council' }, lines: [
        '"Still here. I leave at the thaw; the Watch keeps." She taps her temple. "It\'s all in here. Keep the paper dry."',
      ] },
    ] },
    // Leave the Trees Standing (#219): Piran inside the oak gate. Ulf is on the Grove road, and at the
    // pass once sent home; Sylvane's words above banish him.
    { kind: 'npc', x: 6, y: 14, name: 'Piran, woodward of Thornhold', lines: [
      'An elf in a leather jerkin with a marking-axe through his belt stands under the gate\'s sign and looks at you as if you might be carrying a saw.',
      '"Woodward. I mark what may be felled and I count what has been, and this month the count is wrong. On the Grove road, where the Hand marked the oaks, someone is taking the marked ones down. Not the Hand: a charcoal-burner, a Foreland man, with a cart and a stack and no notion what he\'s cutting."',
      '"The Elder\'s peace says I may not touch a man of the Crown\'s. Yours doesn\'t. Go and see him. Bring him to Sylvane, or send him home, but the marked oaks stand, or the sign on that gate is a lie."',
    ], flag: 'q_trees', says: [
      { after: { flag: 'q_trees_done' }, lines: [
        '"Over the pass, with his cart and his coin. I walked him to the bridge myself." He is cleaning the marking-axe. "The marked oaks stand. Three are stumps. I\'ve marked those over, so that nobody takes the Hand\'s mark for mine."',
      ] },
      { after: { flag: 'q_trees_home' }, lines: [
        '"Gone home, and not before the Elder. I\'d have had him before her." He shrugs. "The oaks stand, which is what I asked. I\'ve marked his stumps over. If his Lantern comes at the new moon he\'ll find the stack cold and me beside it, and we\'ll see what a Lantern\'s coin buys from a woodward."',
      ] },
    ] },
    // The Dark Glass (#219): Reader Tamsin in the Chapterhouse once the lake's marker has been seen
    // dark. She takes the glass at the first meeting and puts her question at the next; the glass
    // is a chest on the lake's far shore, and Sylvane's words above are the truth told.
    { kind: 'npc', x: 11, y: 4, name: 'Reader Tamsin, of the Chapterhouse', lines: [
      'A Lantern in a Reader\'s grey, with an elf\'s hands and a Guildhall accent, has a survey chart open on the Chapterhouse table, the lake\'s marker circled twice.',
      '"You\'ve been to the lake. You\'ve seen the marker dark. The hall has that from you already; I want more. The glass. It sits in the marker\'s crown on the far shore, and it lifts out with a thumbnail, and nobody has lifted it, because the far shore is a long way round and the things at the water don\'t care for Lanterns."',
      '"A marker\'s glass records. That is all a marker does: it sits by a Stone and writes down what the Stone does, in light, on glass. Dark may mean nothing. It may mean the glass is full. Bring it to me and I\'ll read it here, where nobody is listening."',
    ], flag: 'q_glass', after: { seen: 'thornmark:lake' }, quest: {
      item: 'marker_glass', reward: 300, setFlag: 'q_glass_read',
      done: [
        'Tamsin sets the glass in a reading frame and holds a candle behind it, and the black comes apart into lines, and the lines into nights.',
        '"There. The night the Stone was cut: the light goes ragged, and stops. Two months ago." She turns the glass. "And under it, older, so faint the marker had nearly written over it: another. The same ragged light. Then a mend, slow, over a winter. A cut and a mending, from before Sylvane was Elder. Nobody at the Guildhall knows of it. So the elves did, and kept it."',
        '"Say nothing to her. Not yet. A Reader who knows a thing has time to think about it. A Reader whose Elder knows she knows has none. That\'s the hall\'s money, and my thanks."',
      ],
      early: [
        'The Reader looks at the glass in your hand, and the black of it, and does not ask how you have it.',
        '"You lifted the marker\'s glass. Give it here." She sets it in a frame with a candle behind, and the black comes apart into nights. "The night the Stone was cut, and, under it, older: another cut, and a mend, slow, over a winter, from before Sylvane was Elder. Nobody at the Guildhall knows of it. The elves did."',
        '"Say nothing to her. A Reader who knows a thing has time to think. That\'s the hall\'s money, and my thanks."',
      ],
    }, says: [
      { after: { flag: 'q_glass_read' }, until: [{ flag: 'q_glass_truth' }, { flag: 'q_glass_kept' }], lines: [
        'The glass is in its frame still, and the Reader does not look up from it.',
      ], choice: { ask: '"Sylvane will ask you what the glass held. She asks everyone everything; it\'s how she has lived so long. When she does, what will you tell her?"', answers: [
        { label: 'The truth.', sets: 'q_glass_truth', says: [
          '"The truth." She closes the reading frame. "Then I\'d better think faster than I meant to. Go on. Tell her the glass remembers her mother\'s time, and watch her face. Then come and tell me what it did."',
        ] },
        { label: 'Nothing.', sets: 'q_glass_kept', gives: 'potion_sp_great', says: [
          '"Nothing. Good." She takes a stoppered vial from the Chapterhouse\'s press and puts it in your hand, blue as the glass was black. "The hall pays once for a glass and twice for a silence. That\'s the second. Don\'t drink it in front of her."',
        ] },
      ] } },
      { after: { flag: 'q_glass_truth' }, until: { flag: 'q_glass_told' }, lines: [
        '"Go on. Tell her the glass remembers her mother\'s time, and watch her face. Then come and tell me what it did."',
      ] },
      { after: { flag: 'q_glass_told' }, lines: [
        '"You told her. I know; she looked at me this morning the way she looks at a marker." The glass is in its frame still. "She said nothing. She\'ll say nothing for a year, and then she\'ll say one thing, and it\'ll be the right thing. Elves."',
      ] },
      { after: { flag: 'q_glass_kept' }, lines: [
        '"She asked. I said the glass was dark, and she looked at me, and let it go." Tamsin turns the glass to the candle. "Two cuts. Somebody has been at that Stone before, and mended it, and that is the one thing in all this that anyone has ever mended. I mean to find out who."',
      ] },
    ] },
    // The Elder's Four (#219): Keyne by the spring. The dead and Meva are in the Grove Roots; her
    // words for either answer end the quest, and the rite is said under the oaks once after.
    // The Ogre's Boy (#56's 13, #544): Kerra asks her brother home from the old tower; what she says
    // after is what the company did there. Pasco is home once it is done, either way.
    { kind: 'npc', x: 13, y: 7, name: 'Kerra, a girl of Thornhold', lines: [
      'A girl with a basket of bread sits on a step, watching the north-west road.',
      '"The ogre in the old Warden tower took my brother. Pasco went up for Warden iron, to sell. Bring him home."',
    ], flag: 'q_ogre_boy', says: [
      { after: { flag: 'q_ogre_kept', slain: 'thornmark:tm_ogre' }, sets: 'q_ogre_boy', lines: ['"You gave it your word, and went back with swords. Pasco hasn\'t spoken since."'] },
      { after: { slain: 'thornmark:tm_ogre' }, sets: 'q_ogre_boy', lines: ['"Pasco\'s home. He says it was old, and blind, and it fed him. He won\'t say your names."'] },
      { after: { flag: 'q_ogre_kept' }, sets: 'q_ogre_boy', lines: ['"Pasco\'s home. On market days he takes bread up the tower road. I don\'t ask."'] },
    ] },
    { kind: 'npc', x: 14, y: 7, name: 'Pasco, Kerra\'s brother', after: [{ slain: 'thornmark:tm_ogre' }, { flag: 'q_ogre_kept' }], lines: [
      'A boy whittles by the door, a Warden buckle on his belt.',
      '"It\'s only old. Somebody has to feed it."',
    ], says: [
      { after: { slain: 'thornmark:tm_ogre' }, lines: ['A boy whittles by the door, and does not look up.', '"It couldn\'t see you. It shared."'] },
    ] },
    { kind: 'npc', x: 6, y: 7, name: 'Keyne, whose son went under the roots', lines: [
      'A woman fills a jar at the spring that is already full, and has been filling it since you came through the gate.',
      '"Sylvane will have told you: what came through took four of ours. Told you like a number. One of the four is my son, Ruan, who went under the roots with a bow and three friends because the Elder asked for volunteers and he was nineteen." She sets the jar down. "One of them is dead by the stair, they say; nobody will go down to see. The others nobody has seen."',
      '"We don\'t leave our dead under the ground. There\'s a rite, under the oaks, and it wants them home, or it wants to know where they lie, so the hold can fetch them. Find them. All four. Tell me where."',
    ], flag: 'q_four', says: [
      { after: { flag: ['q_four', 'q_four_truth'] }, until: { flag: 'q_four_done' }, sets: 'q_four_done', lines: [
        'Keyne hears where Ruan lies, and where Mylor and Breaca lie, and nods at each, and then she hears about Meva, and does not nod.',
        '"Alive. In grey." She picks up the jar and puts it down. "I\'ll tell her mother. I\'ll tell her tonight, and she\'ll say the girl is dead, and she\'ll mean it, and the hold will hold the rite for four." A breath. "Ruan would have put his hands up too, if he\'d had the time. I\'m glad he didn\'t have the time. Isn\'t that a thing to be glad of."',
      ] },
      { after: { flag: ['q_four', 'q_four_lie'] }, until: { flag: 'q_four_done' }, sets: 'q_four_done', lines: [
        'Keyne hears where Ruan lies, and where Mylor lies, and where Breaca and Meva died together by the stair, quick, and nods at each.',
        '"Quick. Good. That\'s what we\'ll say under the oaks." She picks up the jar. "The hold will go down for them at the dark of the moon, with Lanterns, and bring them up, and then there\'ll be a rite, and then there\'ll be a hush again, but a different one." She looks at you. "Thank you for going where we couldn\'t. Don\'t come to the rite. It\'s ours."',
      ] },
      { after: { flag: 'q_four_done' }, lines: [
        '"It\'s done. They\'re under the oaks, where they\'d have been anyway, in time." She fills the jar, and this time she carries it home.',
      ] },
    ] },
    { kind: 'event', x: 3, y: 7, id: 'th_rite', once: true, after: { flag: 'q_four_done' }, text: 'Under the oaks, four cairns of green branches, still smoking. The hush has a shape now, and four names.' },
    // Terms From the Brigands (#219): Thora by the north wall once Sylvane takes her people in, and
    // the Armoury's smith. Her camp is on the Thornmark map; Sylvane's words above give the terms.
    { kind: 'npc', x: 7, y: 1, name: 'Thora, who leads the camp', lines: [
      'Thora is mending Thornhold\'s north wall with Foreland stone-craft, which the elves watch with interest and do not help with.',
      '"The north wall. That\'s what she said, I hear, and that\'s what we\'ve got, and it\'s more than the Regent gave us." She sets a stone. "The road\'s quiet. You\'ll have noticed. It stays quiet as long as I\'m alive, and I mean to be alive in spring."',
    ], after: { flag: 'q_terms_taken' } },
    { kind: 'npc', x: 4, y: 10, name: 'Kerrow, smith of the Armoury', lines: [
      'The Armoury\'s smith stands at his door, listening to the road, which is quiet.',
      '"Hear that? Nothing. First month since the Stone that a carter\'s come up from the pass without an arrow in his load." He goes back in. "Don\'t ask me to sell cheaper for it. Iron\'s iron. But I sleep."',
    ], after: { flag: 'q_terms_taken' } },
  ],
};
