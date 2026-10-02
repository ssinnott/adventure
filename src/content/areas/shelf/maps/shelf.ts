// The Foreland: the starting coast. Helmstow at the north, the Lodestone on a track outside its
// south gate, the Ellerby farm to the south-east, woods to the west, marsh and the sea at the
// south, the caves at Brandy Hole in the south-west cliffs and the pass east to Thornmark, open,
// where a Warden checkpoint warns every company that goes through. Difficulty band 1-5.
import type { MapDef, Answer } from '../../../../game/map.ts';
import { EAST, NORTH, SOUTH, WEST } from '../../../../game/types.ts';

// Ailith's first meeting and her Thornhold answer, the same before Act II and after (#157).
const AILITH = [
  'A young woman in torn Lantern grey has her back to an oak and a survey stake held like a spear; her leg is bound in her own hem. "You\'re not Wardens. Wardens don\'t come off the road." The stake comes down an inch. "Adjunct Ailith, of the survey. What\'s left of it."',
  '"It wasn\'t rats. I got out of the cellar when the floor opened and walked into a Warden patrol, and they weren\'t looking for survivors. They wanted our orders. The orders are at our camp over the Deepthorn\'s edge, and the other two went east to reach them first. I made for Helmstow, got as far as this wood, and I didn\'t stop to pack."',
  '"The Regent sent us, under his seal: survey the ground under Ashcombe, report to him alone. That was before the Queen died, and before the floor opened. Ask how a man knows where to send a survey before there\'s anything to find. I\'ve asked. I don\'t like the answer, so I\'m hiding from it under a tree."',
];
const THORNHOLD: Answer = { label: 'Thornhold, over the Scarth.', sets: 'q_survey_thornhold', says: [
  '"Thornhold. Elves and trees and nobody in grey." She takes the stake for a crutch. "Elder Sylvane knows a Lantern\'s word when she hears one. I\'ll tell her about you. She\'ll pretend not to have listened, and then she\'ll have listened. That\'s how the Chapterhouse works."',
] };

export const SHELF: MapDef = {
  id: 'shelf',
  name: 'The Foreland',
  kind: 'outdoor',
  density: 'core',
  band: [1, 5],
  start: { x: 16, y: 4, facing: NORTH },
  rows: [
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'M,,,,,,,,,,,,,BBBBB,,,,,,,,,,,,M',
    'M,,T,,,,,,,,,,BBBBB,,,,,T,,,,,,M',
    'M,,,,,T,,,,,,,BB=B=,,,,,,,,T,,,M',
    'M,,,,,,,,,,,,,,,=====,,,,,,,,,,M',
    'M,,,,TT,,,,,,,,,=,,,,,,TT,,,,,,M',
    'M,,,TTT,,,,,,,,,=,,,,,TTTT,,,,,M',
    'M,,,,T,,,,,,,,,,=,,,,,,TT,,,,,,M',
    'M,,,,,,,,,,,,,,,=,,,,,,,,,,,,,,M',
    'M,,,,,,,,,,,,===================',
    'M,,,,,,,,,,,,=,,,,,,,,,,,,r,,,,M',
    'M,,,,,,,,,,,,=,,,,,,,,,,,rr,,,,M',
    'M,,,TT,,,,,,,=,,,,,,,,,,,,r,,,,M',
    'M,,TTTT,,,,,,=,,,,,,,,,,,,,,,,,M',
    'M,,TTTT,,,,,,=,,,,,,,,,,,,,,,,,M',
    'M,,,TT,,,,,,,=,,,,,,,,,,,,,,,,,M',
    'M,,,,,,,,,,,,======,,,,,,,,,,,,M',
    'M,,,,,,,,,,,,,,,,,=,,,,,,,,,,,,M',
    'M,,,,,,,,,,,,,,,,,=,,,,,,,,,,,,M',
    'M,,,,,,,,,,,,,,,,,=,,,,,,BBBB,,M',
    'M,,,,,,,,,,,,,,,,,======DBBB,,,M',
    'M,,,,,,,,,,,,,,,,,,,,,,,,BBBB,,M',
    'M,,,,,,ww,,,,,,,,,,,,,,,,::::,,M',
    'M,,,,,wwww,,,,,,,,,,,,,,,,,,,,,M',
    'M,,,,,www,,,,,,,,,,,,,,,,,,,,,,M',
    'M,,,,,,w,,,,,,,,,,,,,,,,,,,,,,,M',
    'M,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,M',
    'MMMM,,,,,,,,,,,,,,,,,,,,,,,,,,,M',
    'M______________________________M',
    '=________~~~~~~~~~~~~~~~~~~~~~~M',
    'M________WWWWWWWWWWWWWWWWWWWWWWM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
  ],
  exits: [
    // After Act II the gate turns back a company with an orcblood member, and the harbour postern lets
    // it in: no story lock (#151, call 1; #157).
    { x: 16, y: 3, to: 'harrow', tx: 7, ty: 14, tf: NORTH, label: 'You enter Helmstow.', shut: { flag: 'q_salt_done', member: { race: 'orcblood' } }, blockedText: 'A sergeant steps into the gate: "No orcblood past the gate. Regent\'s orders."' },
    { x: 18, y: 3, to: 'harrow', tx: 13, ty: 14, tf: NORTH, label: 'You come into Helmstow by the harbour postern, behind the fish carts.' },
    { x: 31, y: 9, to: 'thornmark', tx: 1, ty: 9, tf: EAST, label: 'The pass opens onto old forest. Thornmark.' },
    { x: 2, y: 28, to: 'greywater1', tx: 1, ty: 1, tf: SOUTH, label: 'A cave mouth in the cliff foot, half hidden by kelp. Brandy Hole.' },
    { x: 0, y: 29, to: 'downs_f2', tx: 30, ty: 29, tf: WEST, label: 'The Salt Road climbs off the beach. Callow Downs.' },
  ],
  features: [
    { kind: 'sign', x: 16, y: 4, text: 'North: Helmstow. South and east along the road: Ellerby farm.' },
    { kind: 'sign', x: 13, y: 9, text: 'South: the coast and Ellerby. West along the beach: Brandy Hole. East: the pass to Thornmark, Warden road.' },
    { kind: 'sign', x: 30, y: 9, text: 'Warden checkpoint. The road east is open. Past it lies Thornmark, and the Wardens will not come in after you.' },
    { kind: 'sign', x: 18, y: 16, text: 'East: Ellerby.' },
    // Ellerby (#87), the farm where Ashcombe stood on this map before it moved past Gullwick: lived
    // in, with a store in its kitchen that sells rations under Mottram's price.
    { kind: 'event', x: 23, y: 20, id: 'ellerby_gate', once: true, text: 'Ellerby. Hens in the yard, smoke from the chimney and a board by the door: RATIONS.' },
    { kind: 'shop', x: 24, y: 20, name: 'Ellerby Farm', stock: ['rations'], prices: { rations: 3 }, interior: 'farm_kitchen' },
    { kind: 'event', x: 28, y: 9, id: 'scarth_watch', once: true, text: 'The Scarth. A pole across the road, a brazier and two Wardens with nothing to do but watch the pole.' },
    { kind: 'event', x: 15, y: 28, id: 'coast', once: true, text: 'The sea. Out on the water, far off, the column of the Hearth stands against the sky. It flickers.' },
    // The Lodestone, the Foreland's own Stone, whole: its words, not a drawing, as the Grove Stone
    // is. The track from the gate road ends at it, and Gytha keeps it. Her later words wait on her
    // lesson, so it always comes first, and the chisel's take the cut's place.
    { kind: 'event', x: 20, y: 4, id: 'lodestone', once: true, text: 'The Lodestone. Grey, the height of two men, not a mark on it. It hums: one low note, held, that you feel in your teeth.' },
    { kind: 'npc', x: 21, y: 4, name: 'Gytha, Lantern of the Lodestone', flag: 'q_lodestone', lines: [
      'A woman in Lantern grey sits at the foot of the stone with a hand flat on it, the way you might rest a hand on a dog. Her eyes come round to you. The hand stays.',
      '"Gytha. I keep the Lodestone, which is to say I sit by it. You\'re a company, and new; I can smell the wax on the charter. So you get the lesson. Every company does, once, and none has needed it yet. Hand here. Go on."',
      '"That\'s a Stone, whole. It hums. Rain hasn\'t marked it and lichen won\'t take on it. Every spring some boy comes out with a knife for a chip of it to carry for luck, and goes home with a broken knife. A Stone doesn\'t wear, doesn\'t tire and doesn\'t go quiet of itself."',
      '"The Chapel says the Hearth keeps Caldera, a Stone keeps its country and a Lantern carries light from the one to the other. What we do is listen, and write down what we hear. Fourteen thousand mornings I\'ve written one word, and never yet a different one."',
    ], says: [
      { after: { flag: ['q_lodestone', 'q_grove_done'] }, lines: [
        'Gytha is on her stool, and there is a second stool beside her with nobody on it.',
        '"Word came over the Scarth: the tear under the Grove is shut and the man with the chisel is dead. Good. Then it\'s only a Stone that\'s hurt, and stone is patient. Thornhold has sent for a Lantern to mend it, and the Guildhall came to me, since I\'ve had a Stone under my hand longer than anyone, and asked how."',
        '"I told them the truth: I\'ve never mended one, and I\'ve never met a Lantern who had. There\'s a book. The last hand in it is older than the Chapel roof." She looks at the empty stool. "I asked them to send a keeper; a keeper knows a Stone by the hand. They said keepers keep."',
      ] },
      { after: { flag: ['q_lodestone', 'q_grove'] }, lines: [
        'Gytha hears you out with her hand on the stone, and at the word cut the hand goes flat and hard, as if the stone might have heard it too.',
        '"Cut. With tools." She is quiet a while. "Forty years I\'ve told Guildhall boys a Stone can\'t fail, and I was right, and I\'d give a good deal to have been wrong. A failing is nobody\'s fault. A cut has a hand on the other end of it."',
        '"You\'d stood by a whole one. So you knew what was missing before anyone told you what was wrong; that\'s what the lesson is for, and I never thought to see it used. Don\'t say cut in the town. Helmstow walks past this stone every day of its life without a look. I used to mind that. I\'ve stopped."',
      ] },
      { after: { flag: 'q_lodestone' }, lines: [
        'Gytha\'s hand is on the stone. "Still whole. It\'ll be whole when you\'re back, and the time after. Same news every day, and I\'ve not once been sorry to give it."',
        '"Got a needle? Lay it flat on your palm and hold it close." The needle turns, slow, and settles pointing out over the sea, at the Hearth. "Every one of them does that. Don\'t ask me why. Go and earn your charter; this one wants no help."',
      ] },
    ] },
    { kind: 'npc', x: 29, y: 8, name: 'Captain Hale, Warden of the Scarth', lines: [
      'A grizzled Warden with a bandaged arm sits on a crate by the checkpoint, and gets up when he sees you, which costs him something.',
      '"Smugglers. They\'ve holed up in Brandy Hole, the caves at the west end of the beach. I lost three men going in after them, and the one who came back talks about worse than smugglers. I believe him. I\'ve an arm that believes him."',
      '"Clear them out and bring me their ledger. I want the names of everyone in Helmstow who has been buying from them. Not the brandy; the names."',
      '"The pass is open. I\'ll not shut a road because I can\'t hold a cave. But it\'s mine to warn you about, and I\'m warning you: Thornmark\'s wolves are twice the size of ours."',
    ], flag: 'q_greywater', quest: [{
      item: 'greywater_ledger', reward: 400, setFlag: 'q_greywater_done',
      early: [
        'A grizzled Warden with a bandaged arm gets up off a crate by the checkpoint. "That\'s the Brandy Hole ledger. I lost three men going in after it."',
        'He leafs through it, and his face goes grey. "Names, dates, and a column headed CARGO BELOW. People. The Ash, here, under our feet."',
        'He shuts the book. "Nobody sent you, and you went. You\'ve earned this. I\'ll see the Regent-Warden gets a copy."',
        '"The pass is open, and it\'s mine to warn you: Thornmark\'s wolves are twice the size of ours."',
      ],
      done: [
        'Hale leafs through the ledger, and his face goes grey by the page.',
        '"These aren\'t smugglers\' accounts. Names. Dates. A column headed CARGO BELOW." His finger stops halfway down it. "Wenna, of Gullwick. In a neat clerk\'s hand, like a cask of brandy."',
        'He shuts the book. "People. The Ash, here, under our feet, and I\'ve been sitting on a crate on top of it."',
        '"You\'ve earned this, and more than I\'ve got. The Regent-Warden gets a copy. It\'s the sort of thing a Regent wants."',
      ],
      after: ['"The pass is yours; it always was. Mind yourselves in Thornmark. The wolves are twice the size of ours and the trees are older than Helmstow, and the elves will thank you for neither observation."'],
    }, {
      item: 'clerks_seal', reward: 150, setFlag: 'q_seal_hale',
      done: [
        'Hale weighs the seal in his good hand.',
        '"So that\'s how the crates got their stamp. Not forged. Real, and rented." He wraps it in a cloth. "It goes to the Regent beside the smugglers\' ledger: the accounts, and the stamp that made them lawful. He\'ll want to know whose hand held it. So do I."',
        'He pays you from the post\'s strongbox, not his own purse, and writes it down. "Wardens\' money. It\'s a Wardens\' matter now, and I want that in ink."',
      ],
    }, {
      item: 'tenant_paper', reward: 50, setFlag: 'q_paper_hale',
      done: [
        'Hale reads it and swears once, quietly.',
        '"Hob. I know him. His father had Ashcombe before him and never let so much as a hayloft." He folds the paper into the cover of his ledger. "He goes to Gullwick, to his wife\'s people, tonight, and he doesn\'t come back to Helmstow until I say so. A man who\'ll sell his stairs for twenty gold wants somewhere with nothing to sell."',
        '"Tell him I said so. Tell him gently; he\'ll come quicker."',
      ],
    }, {
      // Riders in the Dark (#68): Dunstan's letter, from Coldharbour.
      item: 'dunstan_letter', reward: 0, setFlag: 'q_riders_hale',
      done: [
        'Hale reads it standing, twice, and folds it along its own lines.',
        '"Dunstan. He taught me the light in the window." He looks east, up the pass, and then west. "Wardens, riding dark to the Queen\'s barrow. The Regent should know what his own men are doing. He\'ll have it from me, under my seal."',
        'He puts the letter inside his coat, not into the fire. "He says burn it. I don\'t burn things. He\'d tell you that\'s my fault, and it is."',
      ],
    }] },
    { kind: 'sign', x: 3, y: 28, text: 'Brandy Hole. Chalked beneath, in Warden hand: CLOSED. DO NOT ENTER. ASK CAPT. HALE.' },
    { kind: 'well', x: 26, y: 22, text: 'A cistern behind the farm. The water is clean.', heal: true },
    // The Rest of the Survey (#77): Ailith behind the west wood, hiding from the Wardens, until the
    // company tells her where to go.
    { kind: 'event', x: 2, y: 13, id: 'survey_ring', once: true, until: [{ flag: 'q_survey_chapel' }, { flag: 'q_survey_thornhold' }, { flag: 'q_survey_watch' }], text: 'A scrap of Lantern grey on a thorn. Beyond it, a fire-ring so small and hidden that its maker feared smoke more than cold.' },
    { kind: 'npc', x: 2, y: 14, name: 'Ailith, adjunct of the survey', lines: AILITH, flag: 'q_ailith', until: [{ flag: 'q_survey_chapel' }, { flag: 'q_survey_thornhold' }, { flag: 'q_salt_done' }], choice: { ask: '"I can\'t stay under this tree. Where do I go? The Chapel in Helmstow is mine by right, and the Wardens know it. Thornhold is a long walk on this leg, and nobody\'s looking for me there."', answers: [
      { label: 'The Chapel, in Helmstow.', sets: 'q_survey_chapel', says: [
        '"Home, then. Lamps and quiet and my own cell." She tests the leg, and it holds. "If you come asking after me at the Chapel and they say I\'m resting, I\'m resting. Don\'t ask a second time. That\'s not a warning. It\'s advice, from someone who was given it."',
      ] },
      THORNHOLD,
    ] } },
    // After Act II the Chapel is boarded and its people gone to Lantern Watch (#157): she has heard,
    // and the Watch takes the Chapel's place in her question.
    { kind: 'npc', x: 2, y: 14, name: 'Ailith, adjunct of the survey', lines: AILITH, flag: 'q_ailith', after: { flag: 'q_salt_done' }, until: [{ flag: 'q_survey_chapel' }, { flag: 'q_survey_thornhold' }, { flag: 'q_survey_watch' }], choice: { ask: '"I can\'t stay here. Where do I go? Not the Chapel; they say it\'s boarded and the Lanterns gone west to the Watch, over the Sunder. Thornhold is nearer, and nobody\'s looking there."', answers: [
      { label: 'Lantern Watch, over the Sunder.', sets: 'q_survey_watch', says: [
        '"The Watch. One lamp, a prior who asks nothing and the sexton with his book, they say." She takes the stake for a crutch. "A long walk to be written down. Good. I\'d like to be written down properly, for once."',
      ] },
      THORNHOLD,
    ] } },
  ],
  encounters: [
    { id: 'road_rats', x: 16, y: 7, monsters: ['rat', 'rat', 'rat'], aware: 4, respawn: 1440 },
    { id: 'wood_wolves', x: 5, y: 8, monsters: ['wolf', 'wolf'], aware: 5, respawn: 1440 },
    { id: 'wood_boar', x: 7, y: 13, monsters: ['boar'], aware: 3, respawn: 2880 },
    { id: 'road_bandits', x: 13, y: 12, monsters: ['bandit', 'bandit', 'bandit_archer'], aware: 5, respawn: 2880 },
    { id: 'hill_wolves', x: 24, y: 11, monsters: ['wolf', 'wolf', 'wolf'], aware: 5, respawn: 1440 },
    { id: 'marsh_spiders', x: 7, y: 23, monsters: ['spider', 'spider', 'spider', 'spider'], aware: 4, respawn: 1440 },
    { id: 'beach_crabs', x: 9, y: 28, monsters: ['shore_crab', 'shore_crab', 'shore_crab', 'shore_crab'], aware: 4, respawn: 1440 },
    { id: 'cliff_smugglers', x: 5, y: 26, monsters: ['smuggler', 'smuggler', 'smuggler', 'smuggler_bowman'], aware: 5, respawn: 2880 },
    { id: 'coast_bandits', x: 20, y: 27, monsters: ['bandit', 'bandit', 'bandit', 'bandit_archer', 'bandit_archer'], aware: 5, respawn: 2880 },
  ],
};
