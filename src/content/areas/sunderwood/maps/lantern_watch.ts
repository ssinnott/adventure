// Lantern Watch, the Lanterns' tower over the gorge: Act II's second town, band 14-16, entered from
// L2's gate at 12,16. One tower in a walled yard: the Lantern hall at its foot (spells to tier 6 and
// the Lanterns' quests), the refectory (rest), the stores (the band's step on the ladder, #399), the
// prior's room, where the papers are read, and the Lamp Gallery at the top, which trains to 17. No
// temple: the shrine at Sunderfall cures. Prior Osric keeps the lamp in the yard; Hester Dunmore, the
// Watch's Reader, sits in his room; Wouter Brink of the Cartographers sights the gorge from the west
// wall. By day, once the papers are read and the wall touched, Vask waits at the gate (#204).
// docs/areas/sunderwood.md §4.8 is its brief.
import type { MapDef, Words } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';
import { LAMP_LIT, WALL_WALKED } from '../quests.ts';
import { NEST_WATCH } from '../../whitespine/maps/highspine_i11.ts';

/**
 * The Reader's words, read to what the company carries: the papers, the log or both, each opened
 * plainly or, to a company that found the letter under L2's ash, knowing it has been on the knoll.
 * Each holds only once she has met the company (`MET`), so her introduction always comes first; the
 * papers only and the log only stand before both, so whichever is carried alone finds its own.
 * Each sets what it read beside the midpoint's flag, `seal_read` or `log_read`, for the chapter.
 */
const MET = 'watch_reader_met', PRIOR_MET = 'watch_prior_met';
const LAMP_NIGHT = 'The yard by night. Under the lamp the moths go up in one grey column, close enough to touch, and none comes down.';
const SEAL = '"The Helmstow customs seal on every cargo, the same as on the crates in the caves. Under it on every page a countersign. The Regent\'s."';
const READINGS = [
  { has: 'ships_papers', not: 'ships_log', sets: ['papers_read', 'seal_read'], plain: 'She sees the papers before she sees you, and gets up, and shuts the door herself. "Sit." She lays them open under the window.',
    knoll: '"You have been on the knoll, then." She gets up and shuts the door herself, and lays the papers open under the window.',
    read: [`${SEAL} She puts them back in your hands.`] },
  { has: 'ships_log', not: 'ships_papers', sets: ['papers_read', 'log_read'], plain: 'She sees the log before she sees you, and gets up, and shuts the door herself. "Sit." She opens it under the window.',
    knoll: '"You have been on the knoll, then." She gets up and shuts the door herself, and opens the log under the window.',
    read: ['"The log is a clerk\'s cipher. I know it." At the foot of each entry, in another ink, one name: Vask. She puts it back in your hands.'] },
  { has: 'ships_papers', sets: ['papers_read', 'seal_read', 'log_read'], plain: 'She sees what you carry before she sees you, and gets up, and shuts the door herself. "Sit." Papers and log go open under the window.',
    knoll: '"You have been on the knoll, then." She gets up and shuts the door herself, and lays papers and log open under the window.',
    read: [SEAL, '"The log is a clerk\'s cipher. I know it." At the foot of each entry, the other ink, one name: Vask. She puts both back in your hands.'] },
];
const reading = (knoll: boolean): Words[] => READINGS.map((r) => ({
  after: { flag: MET, item: r.has, ...(knoll ? { seen: 'lanternwood_l2:l2_letter' } : {}) },
  ...(r.not ? { until: { item: r.not } } : {}),
  sets: r.sets, lines: [knoll ? r.knoll : r.plain, ...r.read],
}));

/** Averil met, on L2 or in the hall: her first meeting is always her own lines. */
export const AVERIL_MET = 'averil_met';

/**
 * Averil's words (#205): the family's question while it is open and the wall's line said once,
 * hers on L2 by the dark lamp and in the hall alike; then her after-lines, the newest quest's first,
 * in the hall only, so that on L2 she comes back to her first lines and the knoll's hint. The first
 * of a person's words that holds is said, and after-lines hold for ever, so no quest's end stands
 * before another's question.
 */
export const AVERIL: readonly Words[] = [
  { after: { flag: ['q_family', AVERIL_MET] }, until: [{ flag: 'q_family_lamp' }, { flag: 'q_family_come' }], lines: [
    '"The cutter\'s girl. I walked over in the spring and told him, and he showed me the graves, and I\'d no answer for the graves."',
    '"The glass grows in what stays by the Sunder. Not in what passes through: in what stays. A tree, a wolf\'s coat, a child\'s wrist. Slow, and it doesn\'t stop."',
    '"There\'s a warding lamp in the Watch\'s stores. It keeps the glass off a room\'s width while it burns. It\'s the great lamp\'s spare, and the prior counts them at night. He\'d say no. I\'m not asking him."',
  ], choice: { ask: '"I can give you the spare, and the tower has none. Or bring them here, all of them, and the graves wait till we can ward the ground. Which?"', answers: [
    { label: 'Give us the lamp.', sets: 'q_family_lamp', gives: 'warding_lamp', pay: { xp: 660 }, says: [
      'She goes to the tower and comes back with it under her cloak: a lantern of grey glass, hooded, with a wick that burns blue and gives no heat.',
      '"Keep it lit. It has oil for a season; after that they come to us for more, and I suppose that\'s one way of getting them here. He\'ll count them tonight, and know."',
    ] },
    { label: 'We\'ll bring them to you.', sets: 'q_family_come', pay: { xp: 660 }, says: [
      '"Good. I\'d sooner have them here than a lamp there."',
      '"Tell him the Watch will ward the ground when it can, and move the graves with the words said, and that I\'ll say them myself. Tell him that last. He\'ll not believe the Watch. He might believe a person."',
    ] },
  ] } },
  { after: { flag: ['q_wall_told', AVERIL_MET] }, until: { flag: 'q_wall_averil' }, sets: 'q_wall_averil', lines: [
    '"The surveyor\'s wall." Averil has written it in the hall\'s book. "West, no end. East, no end. Warm. Six words, and the hall argued them till the small hours: the old ones say a wall is a wall, and the young say the Sunder is a wound, and a wound has a body under it."',
    '"I don\'t know what I think. I know it\'s in the book now, and the book outlasts us."',
  ] },
  { after: { flag: 'q_family_gone' }, lines: [
    '"They\'re in the refectory. He eats like a man who\'s being watched, and the girl eats like a girl."',
    '"I walked over and said the words over the two graves, and tied the grey on the stones, so the dead are ours to move when we can ward the ground. He watched from the bridge the whole while. He didn\'t come across. I\'d not have, either."',
  ] },
  { after: { flag: 'q_family_lamp' }, lines: [
    '"The prior counted the lamps. He said nothing. That\'s worse, with him. He\'ll say it later, all at once, when it\'s useful."',
    '"The cutter came to the bridge and shouted across that the girl\'s wrist had stopped. Shouted it. The first thing anyone\'s shouted at this tower that wasn\'t a curse."',
  ] },
];

/** Averil's first words of the lamp, at the foot of its stair, from the night the papers are read. */
const LAMP_WORDS = [
  'A young sister at the foot of the stair, a wick in her hand and the look of someone who has said the same thing to everyone all week.',
  '"It went out the night the papers were read. The Regent\'s seal under this roof, read aloud, and by morning the lamp that\'s burned since the Watch was built wouldn\'t take a flame. The prior tells me it\'s the oil."',
  '"He says the casks were sold. He says it looking at the wall. Go and count the casks, and go up and look at the lamp, and tell me what a stranger sees. Nobody in this tower can see anything any more."',
];

/** Where Vask is: the papers read and the wall touched, by day, until he has his answer. */
const VASK_HERE = { after: { flag: 'papers_read', seen: 'the_sunder2:su2_wall' }, until: { flag: 'q_salt_done' }, when: { hours: 'day' } } as const;

export const LANTERN_WATCH: MapDef = {
  id: 'lantern_watch',
  name: 'Lantern Watch',
  kind: 'town',
  band: [14, 16],
  region: 'sunderwood',
  start: { x: 7, y: 14, facing: NORTH },
  palette: { wall: '#7e7a70', wallDark: '#4e4a44', floor: '#6a665c', banner: '#c9a34a' },
  rows: [
    '################',
    '#T,,,,,,,,,,,,T#',
    '#,,,"""""""",,,#',
    '#,,,"BBBDBB",,,#',
    '#,,,"BBBBBB",,,#',
    '#,,,"DBBBBD",,,#',
    '#,,,"BBBBBB",,,#',
    '#,,,"BBBBBD",,,#',
    '#,,,"BBDBBB",,,#',
    '#,,,"""""""",,,#',
    '#,,,,,,==,,,,,,#',
    '#,,,,,,==,,,,,,#',
    '#,T,,,,==,,,,T,#',
    '#,,,,,,==,,,,,,#',
    '#T,,,,,==,,,,,T#',
    '#######==#######',
  ],
  exits: [
    { x: 7, y: 15, to: 'lanternwood_l2', tx: 12, ty: 17, tf: SOUTH, label: 'You go out under the gate onto the road, the lamp at your back.' },
    { x: 8, y: 15, to: 'lanternwood_l2', tx: 12, ty: 17, tf: SOUTH, label: 'You go out under the gate onto the road, the lamp at your back.' },
  ],
  features: [
    // The tower's five doors: the gallery at the top, the prior's room, the stores, the refectory
    // and the Lanterns' hall at its foot.
    { kind: 'trainer', x: 8, y: 3, name: 'The Lamp Gallery', maxLevel: 17, interior: 'watch_gallery' },
    { kind: 'npc', x: 5, y: 5, name: "The Prior's Room", interior: 'priors_room', lines: [
      'The prior\'s room, high in the tower. A desk under the window on the gorge, and the rain on the glass.',
      'On the wall a survey of the ledges, pinned at the corners. A cold hearth, two chairs. The prior is not in it.',
    ], says: [
      { after: { flag: 'q_lamp_exposed' }, lines: [
        'The prior\'s room, high in the tower. A desk under the window on the gorge, the rain on the glass, and the prior at the desk with his back to the door.',
        'On the wall the survey of the ledges, pinned at the corners. The hearth is lit now, and of the two chairs one is turned to the fire and one to the door.',
      ] },
    ] },
    // The Watch's Reader, in the prior's room at every hour (#201). She reads the Tide Ship's papers
    // and its log to whoever carries them, whenever they come, once she has met them, and gives
    // them back: the midpoint (DESIGN §9), its flag `papers_read` for #204's chapter to read. The
    // letter under L2's ash changes only how she begins.
    { kind: 'npc', x: 5, y: 5, name: 'Hester Dunmore, Reader of the Watch', flag: MET, lines: [
      'A woman at the desk with a cut wick in a dish beside her, a book shut under her hand. She does not stand.',
      '"Hester Dunmore, Reader of the Watch. Helmstow sends oil and orders, and once a season somebody to count the jars."',
      '"Sometimes papers come instead, and those come to me." She looks past you at the door. "Shut it, if you would."',
    ], quest: { item: 'lantern_instruments', reward: 0, setFlag: 'q_nest_instruments', done: [
      'She opens the case, reads the list inside the lid, and shuts it again.',
      '"The Peak Stone, not ticked. They go back to the hall."',
    ] }, says: [
      // The Eagles' Nest (the Whitespine's #56's 46, #506): the Lantern's badge from the nest above the
      // Peak Stone, carried here, goes into her book, or stays with the company; either way she says
      // no more of it after. The instruments from under the Stone's slab she takes at the first meeting.
      { after: { item: 'lantern_badge' }, lines: ['She looks a long while at the badge in your hand before she reaches for it.', '"That pin was torn off a coat. Where did you find him?"'], choice: { ask: '"Will you leave it with me? His name goes in the book."', answers: [
        { label: 'Give her the badge.', takes: 'lantern_badge', sets: NEST_WATCH, pay: { xp: 1200 }, says: [
          'She opens the book, writes a line, and lays the badge in the fold of the page.',
          '"The Peak Stone was his to survey. The reading never came down."',
        ] },
        { label: 'Keep it.', says: ['"Then keep it close."'] },
      ] } },
      // The Length of the Wall told (#205): said once.
      { after: { flag: [MET, 'q_wall_told'] }, until: { flag: 'q_wall_reader' }, sets: 'q_wall_reader', lines: [
        '"The surveyor\'s six words are in the hall\'s book. They are in mine too, and mine says who carried them." She keeps her hand on it, shut.',
        '"Below the last ledge Brink ruled a line. The hall is arguing what to call what\'s under it. I\'d sooner it had a measure than a name. Measures can be checked."',
      ] },
      { after: { flag: 'papers_read' }, lines: [
        'She has the wick in its dish lit now, the door still shut. "They came to me. They are yours. Keep them close, and keep them dry."',
        '"Nothing I read leaves this room by me." She looks at the door. "What goes down the stair is yours to carry."',
      ] },
      ...reading(true),
      ...reading(false),
    ] },
    // The Watch's Lamp (#205): the prior in his room once the company has told on him.
    { kind: 'npc', x: 5, y: 5, name: 'Prior Osric', after: { flag: 'q_lamp_exposed' }, lines: [
      'The prior at the desk with the shutter open on the gorge, and the lamp\'s light passing over him and away, and over him.',
      '"She lit it herself. Good hands." He does not turn. "The hall\'s split down the middle, and it\'ll not mend in my time, and I did that with one cut. Vask doesn\'t need to touch us. He has only to come up the road and let us see each other."',
    ] },
    { kind: 'shop', x: 10, y: 5, name: 'The Watch Stores', stock: ['flail', 'wardens_dirk', 'ironwood_bow', 'great_axe', 'watch_staff', 'lamellar', 'watch_habit', 'watch_shield', 'lantern_oil', 'elixir', 'potion_sp_great', 'rations'], interior: 'watch_stores' },
    // The stores' keeper, once the lamp is asked about, counts the casks (#205).
    { kind: 'npc', x: 10, y: 5, name: 'Brother Cuthwin, keeper of the stores', flag: 'q_lamp_casks', after: { flag: 'q_lamp' }, lines: [
      '"Cuthwin. I keep the stores." He counts the casks with you, because you ask, and because nobody else has.',
      '"Eleven. That\'s the count since spring, and that\'s the count now. Nothing\'s gone out of here but what\'s on the book." He sets the tally down. "I told him that. He said count again."',
    ] },
    { kind: 'inn', x: 10, y: 7, name: 'The Refectory', price: 30, interior: 'watch_refectory' },
    // The cutter and his daughter, come over the bridge (#205).
    { kind: 'npc', x: 10, y: 7, name: 'Garret, a pine-cutter', after: { flag: 'q_family_gone' }, lines: [
      'Garret at the end of the long table with a bowl he has not touched, in a room with no trees in it.',
      '"Nell\'s wrist has stopped. The sister says it\'ll not go back, but it\'s stopped. I go up on the wall twice a day and look across to where the stand is. She says that\'s allowed. She\'s a good girl, that one, for a Lantern."',
    ] },
    { kind: 'npc', x: 10, y: 7, name: 'Nell, the cutter\'s daughter', after: { flag: 'q_family_gone' }, lines: [
      'Nell in the refectory with her sleeve rolled up, letting a brother look at her wrist, and letting him.',
      '"It\'s still clear. It just doesn\'t get more clear. I like it here. There\'s a lamp at the top, and nobody whispers when I go past. Dad goes and looks at the trees. I don\'t. Mam\'s not in the trees."',
    ] },
    { kind: 'guild', x: 7, y: 8, name: "The Watch's Lantern Hall", classes: ['cleric', 'sorcerer', 'paladin', 'ranger', 'bard', 'druid'], fee: 400, maxTier: 6, interior: 'watch_hall', hall: 'lanterns' },
    // Averil, come in off the road the night the papers are read, at the foot of the lamp's stair:
    // The Watch's Lamp is hers to give (#205), after the family's question if it is open.
    { kind: 'npc', x: 7, y: 8, name: 'Averil, a sister of the Watch', flag: AVERIL_MET, after: { flag: 'papers_read' }, lines: LAMP_WORDS, says: [
      AVERIL[0],
      { after: { flag: 'papers_read' }, until: { flag: 'q_lamp' }, sets: ['q_lamp', AVERIL_MET], lines: LAMP_WORDS },
      AVERIL[1],
      { after: { flag: 'q_lamp_exposed' }, lines: [
        'The great lamp turns overhead, and Averil has the prior\'s knife beside her on the sill.',
        '"He cut it. To send us away. Me. I\'ve told the hall. Half say he was right, and I said the papers were read in this tower and the light went out, and that is not what a Watch is for. Then nobody said anything for a long while."',
        '"He\'s in his room. I take him his supper. We\'ve not spoken. The lamp\'s lit, and that\'s the Watch. The rest will take years."',
      ] },
      { after: { flag: 'q_lamp_kept' }, lines: [
        '"The oil came." Averil says it as if trying it out. "Two casks off the cart from Helmstow, the prior says, and he spliced the wick himself in the night, and it took the flame first time."',
        '"I\'m glad. I don\'t know why I don\'t feel glad. It\'s lit. That\'s what I wanted."',
      ] },
      ...AVERIL.slice(2),
    ] },
    // The prior, in the yard under the lamp at every hour.
    { kind: 'npc', x: 8, y: 9, name: 'Prior Osric', flag: PRIOR_MET, until: { flag: 'q_lamp_exposed' }, lines: [
      'A tall man in the yard under the lamp, grey as the stone, his face turned up to it. He has heard you and not looked down.',
      '"Osric. Prior of the Watch. I keep the one lamp. The oil comes from Helmstow when Helmstow sends it, and the lamp burns while it lasts."',
      '"The Watch keeps no secrets from Helmstow, and asks none of its guests." He looks down at last. "You are welcome to the yard."',
    ], says: [
      // The Watch's Lamp (#205). Met first after the papers are read, his lamp is out.
      { after: { flag: 'papers_read' }, until: { flag: PRIOR_MET }, sets: PRIOR_MET, lines: [
        'A tall man in the yard under the dark lamp, grey as the stone, his face turned up to it. He has heard you and not looked down.',
        '"Osric. Prior of the Watch. I keep the one lamp, and it is out. The oil comes from Helmstow when Helmstow sends it, and the lamp burns while it lasts. It has not lasted."',
        '"The Watch keeps no secrets from Helmstow, and asks none of its guests." He looks down at last. "You are welcome to the yard."',
      ] },
      // The cut wick seen: what he did, and his question.
      { after: { seen: 'lantern_watch:lw_wick' }, until: LAMP_LIT, lines: [
        'He sees it in your faces before you speak, and sits down on the hall\'s step, which he has not done in front of you before.',
        '"Yes. My knife. The night the papers were read. I\'ve buried Lanterns the Wardens took. I knew who\'d come up that road in the morning, and which of mine would stand in the door and say what they\'d read, and what that costs."',
        '"A Watch with a dark lamp is a Watch the young leave. That was the whole of my thinking. They didn\'t leave. He\'ll come anyway. She thinks the papers put it out, and she\'s half right, and I\'d sooner she went on being half right."',
      ], choice: { ask: '"Tell her, or don\'t. If you don\'t, the Watch owes you, and I\'ve the map of the Sunder\'s ledges to pay with. If you do, I\'ll not deny it. Well?"', answers: [
        { label: 'We\'ll tell her.', sets: ['q_lamp_exposed', 'lanterns_split'], pay: { xp: 840 }, says: [
          '"Then go and tell her." He does not get up. "I\'ll be in my room. She\'s known where to find me since she was nine and I taught her to trim a wick."',
          '"She\'ll light it tonight. Watch from the bridge, if you want to see something. A lamp that\'s been out, coming back, is worth the walk."',
        ] },
        { label: 'We\'ll let it be.', sets: 'q_lamp_kept', gives: 'watch_map', pay: { xp: 840 }, says: [
          'He takes a folded vellum from inside his habit and gives it you, warm from him. "The ledges, as the Watch has walked them. Don\'t show it about."',
          '"I\'ll splice the wick tonight, myself, and light it, and tell her the oil came. She\'ll believe the oil came. She wants to. I\'m not a good man. I\'m an old one who wanted his young ones alive."',
        ] },
      ] } },
      { after: { flag: 'q_lamp_kept' }, lines: [
        '"It burns." The prior looks at his hands. "The sister\'s civil to me, and I to her, and the lamp burns, and somewhere a company has the Watch\'s map in its pack and the Watch\'s shame with it. That\'s the price. I paid it before you came, and I\'ll not sleep for saying so."',
      ] },
      { after: { flag: 'q_lamp' }, until: LAMP_LIT, lines: [
        '"The lamp. Yes. The sister will have told you it\'s the Regent\'s doing. The young want the world to be a story with a villain in it. It makes the dark easier."',
        '"The oil was sold. Two casks, to a pine-cutter across the gorge, by a brother since gone to Thornhold. I\'ll not name him. It\'s done. A Watch with no lamp is still a Watch. We watched before there were lamps."',
      ] },
      { after: { flag: [PRIOR_MET, 'papers_read'] }, lines: ['"You have been up in my room." He looks at the lamp, not at you. "The chair was warm."'] },
      { after: [{ flag: PRIOR_MET, item: 'ships_papers' }, { flag: PRIOR_MET, item: 'ships_log' }], lines: ['"Papers from the coast, I hear. Leave them with me. They go to Helmstow by the next oil cart." He holds out his hand, and lets it fall.'] },
    ] },
    // The Cartographers' surveyor on the west wall, sighting across the gorge.
    { kind: 'npc', x: 2, y: 4, name: 'Wouter Brink, surveyor of the Guild', flag: 'wall_met', lines: [
      'A man on the west wall with a chain over one shoulder and a sighting rod to his eye, held across the gorge and the rain.',
      '"Brink. Wouter. The Guild\'s. The bridge is four hundred and twelve feet, near enough. The gorge has no near enough. My line ran out before the bottom did."',
      '"The ledges are mine, on the prior\'s wall. Below the last I ruled a line. I had nothing else to put there." He goes back to the rod.',
    ], says: [
      // The Length of the Wall (#205): both ends walked, his offer.
      { after: WALL_WALKED, until: [{ flag: 'q_wall_sold' }, { flag: 'q_wall_told' }], lines: [
        '"Doesn\'t end. No. I\'d hoped you\'d come back and say a hundred and forty paces and a corner." He writes nothing yet.',
        '"Here\'s the Guild\'s offer. I write down what you found, as the Guild\'s, and the Guild pays you for it, and you don\'t tell the Lanterns in this tower, who\'d put it in a sermon. Or you tell them, and the Guild pays you nothing, because it\'ll read it in a Lantern\'s letter for free."',
      ], choice: { ask: '"Which? The Guild\'s coin and a quiet map, or the Lanterns\' book and nothing."', answers: [
        { label: 'Sell the measure.', sets: 'q_wall_sold', pay: { gold: 500, xp: 840 }, says: [
          '"Good." He writes it, small: WALL, SUNDER FLOOR, LENGTH UNKNOWN, CONTINUES BOTH WAYS UNDER ROCK, WARM. "That\'s the Guild\'s now. It\'ll be on a map that six people see, and one of them will understand it, and she\'s a long way from here."',
          '"Your fee. Good money for a walk. You\'ve the look of people who want to know what it is. So do I. The Guild\'s method is measure first, know later. Later can be a long time."',
        ] },
        { label: 'We\'ll tell the Watch too.', sets: 'q_wall_told', pay: { xp: 840 }, says: [
          '"Then I pay you nothing, and I\'ll write it down anyway, and so will they." He writes, and does not hurry. "I\'m not angry. I\'d have told them, at your age. Then I joined a guild that measures things, because I\'d sooner know how long a thing is than argue what it means."',
          '"Go and tell the sister. She\'ll want the numbers. They\'re the one thing that\'ll be true in whatever they make of it."',
        ] },
      ] } },
      { after: { flag: 'q_wall_sold' }, lines: [
        '"It\'s in the post to the Guild, with my compliments and a very small drawing." Brink has his knee up on the wall. "I\'ll be here till the oil cart. Nobody in this tower has asked me what I found, which tells you what they think a Cartographer does. Measure, not know. They\'re right. It\'s restful."',
      ] },
      { after: { flag: 'q_wall_told' }, lines: [
        '"They\'ve put it in their book, I hear, and the hall was up all night over it." Brink does not look up from the rod. "Six words. Six of mine, that the Guild would have kept on a map for fifty years and thought about. Well. It\'s their tower. I\'d still have told them, at your age. I said so."',
      ] },
      // The wall touched: he never reached the bottom, so he asks those who have.
      { after: { flag: 'wall_met', seen: 'the_sunder2:su2_wall' }, until: { flag: 'q_wall' }, sets: 'q_wall', lines: [
        '"You\'ve been down. You\'ve touched it." He lowers the rod. "I came for a rubbing of it, for the Guild\'s map, and my line ran out first. You\'ll have found there\'s nothing to rub. Not a mark, not a chisel, not a joint. Paper won\'t take it."',
        '"So I want its length. Walk it west till it ends and east till it ends, and pace it, and tell me. I\'d go myself, but my knee is forty-eight and the gorge is not."',
        '"The Guild pays for a measure. It pays better for a quiet one. We\'ll come to that." He goes back to the rod.',
      ] },
    ] },
    // Vask at the gate (#204): once the papers are read and the wall touched, by day, the nearest the
    // clock gives to the next morning. His question is the act's turn, and the company's one answer
    // is no (#452), as STORY has it: it ends the act and gives nothing. He is gone once answered.
    { kind: 'npc', x: 6, y: 14, name: 'Lord Aumery Vask, Regent-Warden', flag: 'q_vask_rain', ...VASK_HERE, lines: [
      'Lord Vask stands on the grass by the gate, bareheaded, the rain running off him unregarded. Behind him two Wardens hold three horses, and look at nothing.',
      '"You\'ve read the papers. Good. Then you know half of what I know."',
      '"The rest is this. The world is a cage, and the Hearth is its lock. Beyond the sky there is somewhere else, somewhere real, and I mean to open the door."',
    ], choice: { ask: '"Help me. You\'ve touched that wall. You know I\'m right."', answers: [
      { label: 'No.', sets: ['q_vask_no', 'q_salt_done'], says: [
        'He does not seem surprised. "Then stay out of my way. I don\'t need you. I have the girl."',
        'He takes the reins from the Warden without looking for them, mounts, and is gone through the gate; the two go after.',
      ] },
    ] } },
    // The gate's line on either square of the road in, said once whichever is walked.
    ...([[7, 'lw_vask', 'lw_vask_e'], [8, 'lw_vask_e', 'lw_vask']] as const).map(([x, id, other]) => ({
      kind: 'event' as const, x, y: 13, id, once: true, ...VASK_HERE, until: [VASK_HERE.until, { seen: `lantern_watch:${other}` }],
      text: 'Rain. Three horses at the gate, two Wardens holding them, and a man standing in the wet as if it were not raining.',
    })),
    { kind: 'event', x: 7, y: 14, id: 'lw_gate', once: true, text: 'Lantern Watch: one tower in a walled yard over the gorge, and a lamp at the top lit in daylight. Moth dust lies on the step like flour.' },
    { kind: 'sign', x: 8, y: 14, text: 'Lantern Watch. The hall, the refectory, the stores. Lamp oil, bread and a bed.' },
    // The great lamp, dark from the night the papers are read until the prior is answered, and lit
    // again after (#205): the yard by night, and the wick in the Lamp Gallery at the top.
    { kind: 'event', x: 9, y: 9, id: 'lw_lamp_night', when: { hours: 'night' }, until: { flag: 'papers_read' }, text: LAMP_NIGHT },
    { kind: 'event', x: 9, y: 9, id: 'lw_lamp_night_dark', when: { hours: 'night' }, after: { flag: 'papers_read' }, until: LAMP_LIT, text: 'The yard by night, the lamp dark over it. The moths have gone, and their dust lies where it fell.' },
    { kind: 'event', x: 9, y: 9, id: 'lw_lamp_night_lit', when: { hours: 'night' }, after: LAMP_LIT, text: LAMP_NIGHT },
    { kind: 'event', x: 8, y: 3, id: 'lw_wick', once: true, after: { flag: 'papers_read' }, until: LAMP_LIT, text: 'The lamp, dark. Behind the lens a wick thick as a wrist, cut clean across. Not burnt down. Cut.' },
    { kind: 'event', x: 8, y: 3, id: 'lw_lamp_lit', once: true, after: LAMP_LIT, text: 'The lamp, lit. The lens turns, and the wood goes white and black, white and black, to the gorge.' },
    { kind: 'well', x: 3, y: 10, text: 'A well in the yard, its rope grey with moth dust. The water comes up cold and tastes of stone.' },
    { kind: 'event', x: 1, y: 6, id: 'lw_lookout', once: true, text: 'The west wall, and the gorge under it. The bridge a thread across the gap, the glass trees on the far lip, and rain going down past all of it.' },
    { kind: 'event', x: 13, y: 4, id: 'lw_oil', once: true, until: { flag: 'papers_read' }, text: 'Oil jars stacked against the tower\'s east side, three deep, every stopper out. The lamp above burns on all the same.' },
    { kind: 'event', x: 12, y: 11, id: 'lw_graves', once: true, text: 'The brothers\' graves along the yard\'s wall, a lamp cut on each stone. The newest cut is still white; the rest have gone grey.' },
    { kind: 'event', x: 3, y: 13, id: 'lw_bell', once: true, text: 'The signal bell on its post by the gate. The rope is tied up round the crossbar, a man\'s reach above the tallest of you.' },
  ],
};
