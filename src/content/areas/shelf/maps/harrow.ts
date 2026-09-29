// Helmstow, capital of the Foreland. The party's home town for the slice: inn, temple, shop, guild,
// trainer and tavern, with the gate south onto the Foreland road and the gatehouse north into the
// keep's ward (keep.ts), where the Regent-Warden holds court.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

export const HARROW: MapDef = {
  id: 'harrow',
  name: 'Helmstow',
  kind: 'town',
  band: [1, 4],
  start: { x: 7, y: 14, facing: NORTH },
  rows: [
    '#######==#######',
    '#,,,,,,==,,,,,,#',
    '#,BBBB,==,BBBB,#',
    '#,BBBB,==,BBBB,#',
    '#,BBDB,==,BDBB,#',
    '#,,,,,,==,,,,,,#',
    '#==============#',
    '#,,,,,,==,,,,,,#',
    '#,BBBB,==,BBBB,#',
    '#,BBBB,==,BBBB,#',
    '#,BBDB,==,BDBB,#',
    '#,,,,,,==,,,,,,#',
    '#,BBB,,==,,BBB,#',
    '#,BDB,,==,,BDB,#',
    '#,,,,,,==,,,,,,#',
    '#######==#######',
  ],
  exits: [
    { x: 7, y: 15, to: 'shelf', tx: 16, ty: 4, tf: SOUTH, label: 'You leave Helmstow by the south gate.' },
    { x: 8, y: 15, to: 'shelf', tx: 16, ty: 4, tf: SOUTH, label: 'You leave Helmstow by the south gate.' },
    { x: 7, y: 0, to: 'keep', tx: 7, ty: 8, tf: NORTH, label: 'You pass under the gatehouse into the keep\'s ward.' },
    { x: 8, y: 0, to: 'keep', tx: 8, ty: 8, tf: NORTH, label: 'You pass under the gatehouse into the keep\'s ward.' },
  ],
  features: [
    { kind: 'inn', x: 4, y: 4, name: 'The Hearthlight Inn', price: 12, interior: 'hearthlight_inn' },
    { kind: 'temple', x: 11, y: 4, name: 'Chapel of the Lanterns', interior: 'lantern_chapel' },
    { kind: 'shop', x: 4, y: 10, name: "Mottram's Stores", stock: ['club', 'dagger', 'staff', 'shortsword', 'mace', 'longsword', 'axe', 'spear', 'sling', 'shortbow', 'longbow', 'robe', 'leather', 'scale', 'chain', 'buckler', 'shield', 'potion_heal', 'antidote', 'rations', 'torch'], interior: 'harrow_provisioner' },
    { kind: 'guild', x: 11, y: 10, name: 'Lantern Guildhall', classes: ['cleric', 'sorcerer', 'paladin', 'ranger', 'bard', 'druid'], fee: 50, interior: 'lantern_guildhall', hall: 'lanterns' },
    { kind: 'trainer', x: 3, y: 13, name: 'Warden Drillyard', maxLevel: 6, interior: 'warden_drillyard', hall: 'wardens' },
    { kind: 'npc', x: 12, y: 13, name: 'The Gilded Eel', interior: 'gilded_eel', lines: [
      'The tavern is loud and smells of eel.',
      'A fisherman, to nobody: "The Hearth stuttered the night the Queen died. I saw it from the boats. Out, and back, and out, like a man blowing on a wick that won\'t take."',
      'A Warden, into his cup: "Something came up out of the Ashcombe farm. Rats first, then worse. Nobody has gone to look, and nobody\'s been told to."',
      'A Lantern adjunct, drunk: "The survey team went south a week ago. A week. They should have been back by now. They should have been back."',
      'A dockhand: "Cheap brandy comes out of the caves at Brandy Hole, west end of the beach. Folk who buy it lately don\'t all come back. Captain Hale at the pass wants them cleared."',
    ] },
    { kind: 'well', x: 7, y: 6, text: 'The town well. The water tastes faintly of iron.' },
    { kind: 'sign', x: 8, y: 14, text: 'Helmstow. North gate: the keep. South gate: the Foreland road, the Ashcombe farms.' },
    { kind: 'event', x: 7, y: 14, id: 'harrow_intro', once: true, text: 'Helmstow. The Hearth flickered last night and the Queen is dead. The Regent-Warden is hiring.' },
    // The Bell That Rang Twice and The Rest of the Survey (#77, from #56): Osmund in the Chapel, the
    // two who saw the bell rung, and Ebba, at the Eel from a new game or, her name kept, in the Chapel.
    // A words entry keyed to another quest's flag names its person's own hire as well, so it never
    // stands before their first meeting, but for two of Ebba's at the Eel, whose first meeting there
    // is the survey's own start: her confession, which comes before it by design, and her word of
    // Ailith once she is sent. The open question comes first, then what is said once, then after.
    { kind: 'npc', x: 11, y: 4, name: 'Osmund, sexton of the Chapel', lines: [
      'A thin man in a leather apron is greasing the bell wheel, and looks at you the way he might look at a bell that had rung out of turn.',
      '"Sexton. Thirty years, and I\'ve rung every hour of them: the dawn, the noon, the dusk, the deaths. A death bell is rung when the Chapel has seen the body. That is the rule, and it is a good one."',
      '"The Queen\'s bell rang at midnight. I was in my bed. She was not found until dawn, when I rang it myself, properly, and it had already been rung. Nobody knew at midnight that she was dead. Nobody but whoever had hold of my rope."',
      '"Find out who. Ask in the town; the Eel hears everything and remembers half of it. I want a name for the book."',
    ], flag: 'q_bell', says: [
      { after: { flag: ['q_bell', 'q_bell_ebba'] }, until: [{ flag: 'q_bell_named' }, { flag: 'q_bell_kept' }], lines: [
        '"Well? My bell rang at midnight, and I want the hand that rang it, for the book."',
      ], choice: { ask: '"Whose was it?"', answers: [
        { label: 'The adjunct, Ebba.', sets: 'q_bell_named', says: [
          '"A Lantern. Under my own roof." He writes it, slowly, and closes the book. "The Wardens asked me the same the morning after, and I\'d nothing to give them. Now I have. They\'ll want her at the keep, and they\'ll not say for how long."',
          '"I\'d have liked it to be the wind."',
        ] },
        { label: 'We couldn\'t find out.', sets: 'q_bell_kept', says: [
          '"Rang itself, then." He writes it down: RANG ITSELF. "Thirty years I\'ve kept this book and never lied in it. Well. It isn\'t a lie if it\'s what I was told." He shuts it harder than he needs to.',
          '"She\'s a Lantern, isn\'t she. Don\'t answer. Go on; the noon bell\'s mine, and I\'ll be ringing it."',
        ] },
      ] } },
      { after: { flag: ['q_bell', 'q_survey_chapel'] }, until: { flag: 'q_osmund_ailith' }, sets: 'q_osmund_ailith', lines: [
        '"The survey adjunct? She came in on a crutch, and two Wardens came for her within the hour." He goes on greasing the wheel. "I\'m told she\'s resting. Nobody has told me where."',
      ] },
      { after: { flag: ['q_bell', 'q_well_lanterns'] }, until: { flag: 'q_osmund_well' }, sets: 'q_osmund_well', lines: [
        '"Written. Stone dust in the well, works under the keep, a Warden mason, the date and the hour, in the book with the bells." He blots it. "I don\'t know what a book does against a Regent. I know it outlasts one."',
      ] },
      { after: { flag: 'q_bell_named' }, lines: [
        '"They took her to the keep the same afternoon. Two Wardens, civil about it. Nobody has said since whether she\'s still there, and I\'ve stopped asking, which I\'m not proud of." He looks up at the wheel. "The bell\'s mine again. It\'s less comfort than I thought."',
      ] },
      { after: { flag: 'q_bell_kept' }, lines: [
        '"Rang itself. It\'s in the book, and the book is closed." He nods towards the lamps, where Ebba is working. "The Chapel\'s lamps are trimmed properly for the first time in years. Make of that what you like. I\'ve made of it what I can."',
      ] },
    ] },
    { kind: 'npc', x: 12, y: 13, name: 'the fisherman, at the Gilded Eel', lines: [
      '"Midnight, near enough. I was hauling by it and had to stop with the net half in." He drinks. "The bell? Aye, I heard the bell. I thought it was for the light."',
    ], flag: 'q_bell_boats', after: { flag: 'q_bell' }, until: [{ flag: 'q_bell_named' }, { flag: 'q_bell_kept' }] },
    { kind: 'npc', x: 14, y: 3, name: 'a Warden on the wall', lines: [
      '"I had the wall by the Chapel that night. The wheel creaked before it rang; that\'s someone on the rope who doesn\'t know it. Six strokes, and a seventh that didn\'t sound. Then the tower door, and someone in grey going down towards the Eel." He shrugs. "Grey\'s grey in the dark. Ours or the Lanterns\', I couldn\'t swear."',
    ], flag: 'q_bell_wall', after: { flag: 'q_bell' }, until: [{ flag: 'q_bell_named' }, { flag: 'q_bell_kept' }] },
    { kind: 'npc', x: 12, y: 13, name: 'Ebba, a Lantern adjunct', lines: [
      '"The survey team. Four went south a week before the Queen died. I told half the Eel and none of them listened. One\'s dead under Ashcombe, they say, with her wand beside her. That leaves three, and one of them is Ailith, who shared my cell at the Guildhall for six years and can\'t light a fire to save her life."',
      '"If she\'s alive she\'s hiding, and if she\'s hiding it\'s in a wood; she was raised in one. Look south-west along the coast, off the road. Find her, or find where she\'s buried, so I can stop looking at the door."',
    ], flag: 'q_survey', until: [{ flag: 'q_bell_named' }, { flag: 'q_bell_kept' }], says: [
      { after: { flag: ['q_bell', 'q_bell_boats', 'q_bell_wall'] }, sets: 'q_bell_ebba', lines: [
        'The Lantern adjunct at the corner table has a cup she is not drinking from, and the look of someone who has been waiting for a particular question.',
        '"You\'ve been to the wall and the boats, so you know. Yes. I rang it. Seven for a Queen, and I couldn\'t lift the seventh; my arms had gone. I\'d never touched a bell rope in my life."',
        '"Every adjunct learns it her first week and forgets it by the second: the Hearth burns for the Crown. It\'s a line in a catechism. Nobody has thought about it in two hundred years. Then I stood in the tower door and watched the Hearth go out, eleven times, and I thought about it all the way up the stair."',
        '"I was right. That\'s what I can\'t drink away. Tell the sexton what you like. I\'d sooner be in his book than the Wardens\'."',
      ] },
      { after: { flag: 'q_survey_thornhold' }, lines: [
        '"Thornhold. Good. Elves don\'t hand people over; they just look at you until you leave." She almost laughs. "Six years in one cell and she can\'t light a fire, and she\'s the one who ends up safe. I\'ll take it."',
      ] },
      { after: { flag: 'q_survey_chapel' }, lines: [
        '"She came home, and then the Wardens came." Ebba looks at the door she used to watch. "I sat on the Chapel step that night, a long time. The Hearth was steady. I didn\'t count anything."',
      ] },
    ] },
    { kind: 'npc', x: 11, y: 4, name: 'Ebba, a Lantern adjunct', lines: [
      'Ebba is in the Chapel, sober, trimming lamps. Her hands have stopped shaking; the rest of her has not caught up.',
      '"The sexton wrote \'rang itself\'. He told me so, not looking at me, and gave me the lamps to do. That\'s forgiveness, in a sexton."',
      '"Something for you, since you kept my name. Lord Vask came here the morning after, before the Queen was cold. He didn\'t ask who rang the bell. He asked what hour, to the minute, and whether anyone had counted the light. Everyone in Helmstow was surprised that morning but one man, and he\'s the one holding the city."',
    ], flag: 'q_ebba_chapel', after: { flag: 'q_bell_kept' }, says: [
      { after: { flag: ['q_ebba_chapel', 'q_survey_thornhold'] }, lines: [
        '"Thornhold. Good. Elves don\'t hand people over; they just look at you until you leave." She almost laughs. "Six years in one cell and she can\'t light a fire, and she\'s the one who ends up safe. I\'ll take it."',
      ] },
      { after: { flag: ['q_ebba_chapel', 'q_survey_chapel'] }, lines: [
        '"She came home, and then the Wardens came." Ebba looks at the door she used to watch. "I sat on the Chapel step that night, a long time. The Hearth was steady. I didn\'t count anything."',
      ] },
      { after: { flag: 'q_ebba_chapel' }, sets: 'q_survey', lines: [
        '"The survey team. Four went south a week before the Queen died. I told half the Eel and none of them listened. One\'s dead under Ashcombe, they say, with her wand beside her. That leaves three, and one of them is Ailith, who shared my cell at the Guildhall for six years and can\'t light a fire to save her life."',
        '"If she\'s alive she\'s hiding, and if she\'s hiding it\'s in a wood; she was raised in one. Look south-west along the coast, off the road. Find her, or find where she\'s buried, so I can stop looking at the door."',
      ] },
    ] },
    // The Clerk's Seal (#77, from #56): Maud at the Eel's cleanest table, until her last words, said
    // once the seal has gone to her or to Hale.
    { kind: 'npc', x: 12, y: 13, name: 'Maud, a clerk\'s wife', lines: [
      'A woman in a good plain dress sits at the Eel\'s cleanest table, with a cup she has not touched and a purse she keeps her hand on.',
      '"You\'re the company that goes into places. My husband is Edwin, a clerk at the customs house. Nine days ago he went down the beach to Brandy Hole with the price of a bottle in his pocket, and he hasn\'t come home. The price of one bottle. I count what leaves this house, and I count it twice."',
      '"The Wardens say the caves are closed and to wait. I\'ve waited nine days. Find him, or find out. If it\'s the second, I want whatever he had on him. There\'s his seal, which is the customs house\'s property, and I\'d sooner they asked me for it than asked the tide."',
    ], flag: 'q_seal', until: { flag: 'q_maud_gone' },
      quest: { item: 'clerks_seal', reward: 150, setFlag: 'q_seal_maud', done: [
        'Maud turns the seal to the light and looks at its face, worn bright, for a long time.',
        '"Nine months. That\'s how long a face wears like that." She puts it in the purse, and her hand over the purse. "There was money this winter a clerk doesn\'t earn. I counted it twice and didn\'t ask, because we ate. So I knew the sum and not the sale. Now I know the sale."',
        '"The customs house will pay to have this back, and pay more not to ask where it\'s been, and I\'ll take both and say nothing. Edwin\'s name stays a clerk\'s name. That\'s what I\'m buying. Here\'s yours."',
      ] },
      says: [
        { after: { flag: 'q_seal_maud' }, sets: 'q_maud_gone', lines: [
          '"Sold. The customs house paid, and asked nothing, and I asked nothing, and Edwin is a clerk who drowned buying brandy, which is true as far as it goes." She stands. "I\'ll not be in here again. It\'s a filthy place. I only came because it was his."',
        ] },
        { after: { flag: ['q_seal', 'q_seal_hale'] }, sets: 'q_maud_gone', lines: [
          '"You gave it to the Warden." She has finished the cup, for once. "So Edwin\'s name goes to the Regent in Hale\'s hand, beside the smugglers\' book, and the customs house will strike him off with a note in the margin." She stands. "A note in the margin. He\'d have hated that. He kept beautiful margins."',
        ] },
      ] },
    // The Well Tastes of Iron (#77, from #56): Mottram in his shop, and by night a cart and Alwin, a
    // Warden mason, at the gatehouse in the north wall, until the Wardens are told; then the gatehouse
    // swept. Osmund's record, once the Lanterns are told, is among his words above.
    { kind: 'npc', x: 4, y: 10, name: 'Mottram, of Mottram\'s Stores', lines: [
      'Mottram sets a bucket on the counter between you and the goods, as if it were the day\'s most important stock. The water in it has a grey skin of grit.',
      '"Taste that. Iron. The town well has tasted of iron since the week the Queen died. My customers taste it in the bread, and a provisioner who sells bad rations doesn\'t stay a provisioner."',
      '"That grit is stone dust. I\'ve handled every stone that comes through this town, whetstones, millstones, the lime they whiten the Chapel with, and it\'s none of them. And the cistern behind Ashcombe, four miles off, is sweet as rain. Same rain falls on both, so it\'s not the sky. Find me what it is, and I\'ll pay for it, which from a shopkeeper is saying something."',
    ], flag: 'q_well', says: [
      { after: { flag: ['q_well', 'q_well_alwin'] }, until: [{ flag: 'q_well_wardens' }, { flag: 'q_well_lanterns' }], lines: [
        'Mottram listens with the bucket between you, and does not taste it again.',
        '"Under the keep. The Regent\'s works." He wipes a counter that is already clean. "I asked why my well tastes of iron. I didn\'t ask to know that. A shopkeeper who knows things about the keep is a shopkeeper with a short lease."',
      ], choice: { ask: '"You\'ll tell someone; your sort always does. Tell me who, so I know which way to look when they come asking. The Wardens, or the Lanterns?"', answers: [
        { label: 'The Wardens.', sets: 'q_well_wardens', says: [
          '"The Wardens. Good. Yes." He lets out a breath. "Their mason, their works and their well, come to that. They\'ll see to it. They always see to things." He puts the bucket under the counter. "Just not always the thing you asked about."',
        ] },
        { label: 'The Lanterns.', sets: 'q_well_lanterns', says: [
          '"The Chapel." He considers it the way he considers a price. "They\'ll write it down. It\'s what they do, write things down: hours and bells, and now my well. Nothing will change." He puts the bucket under the counter. "Someone should have it written, though. I\'ll say that. Someone should."',
        ] },
      ] } },
      { after: { flag: 'q_well_wardens' }, lines: [
        '"Still iron." He does not offer you the bucket. "The mason\'s gone; nobody has seen him since, nor the cart. The dust isn\'t gone. Whatever they\'re cutting down there, they\'re still cutting it."',
      ] },
      { after: { flag: 'q_well_lanterns' }, lines: [
        '"Still iron. It\'s in a book now, the sexton tells me, in his best hand." A dry sound that might be a laugh. "I send a boy to the Ashcombe cistern with a barrel twice a week. Four miles for sweet water. There\'s a sum in that somewhere, and I\'d rather not do it."',
      ] },
    ] },
    { kind: 'event', x: 7, y: 1, id: 'well_cart', once: true, when: { hours: 'night' }, until: { flag: 'q_well_wardens' },
      text: 'A cart with no lamp leaves the gatehouse, its wheels muffled in sacking, trailing a grey dust that the dew turns to rust.' },
    { kind: 'event', x: 7, y: 1, id: 'well_swept', once: true, when: { hours: 'night' }, after: { flag: 'q_well_wardens' },
      text: 'The gatehouse by night. No cart. The grey line is swept from the cobbles, right up to the gate and not one step through it.' },
    { kind: 'npc', x: 9, y: 1, name: 'Alwin, a Warden mason', lines: [
      'A big man in Warden grey and a mason\'s leather apron stands by the cart. His hands and his hair are grey with the same dust.',
      '"Move along. Regent\'s works." He follows your eyes to the dust on the cobbles. "Aye, that\'s mine. It gets in the water; the old cut runs under the well. I told them. They said cart it out at night, and it\'s not your concern where it goes."',
      '"What\'s down there? An old way, older than the keep, and the Regent wants it opened. I cut where they chalk the line. Ask him what\'s at the bottom of it, if you\'re on speaking terms. I\'m not."',
    ], flag: 'q_well_alwin', when: { hours: 'night' }, until: { flag: 'q_well_wardens' } },
  ],
};
