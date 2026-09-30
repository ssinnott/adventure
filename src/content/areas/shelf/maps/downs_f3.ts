// Callow Downs, box F3: Gullwick. Core, band 2-3: the village at the Wend's mouth, its cottages,
// net loft and boats on the shingle, the rise above it where the company camped the night the light
// went out, and across the mouth the far beach, the wreckers', with their cave at its end. The Salt
// Road comes down from F2 and leaves west for Crowness. Cut from the atlas by tools/scaffold.ts;
// docs/areas/shelf.md §4.3 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const DOWNS_F3: MapDef = {
  id: 'downs_f3',
  name: 'Callow Downs',
  kind: 'outdoor',
  density: 'core',
  band: [2, 3],
  start: { x: 16, y: 0, facing: SOUTH },
  rows: [
    'fffffffffffffff===,,,,,,,,,,,,,,',
    'fffffffffffff===,,,^,,,,,,,,,,__',
    'fffffffffff===f,,,^^,,,_,_____~~',
    '~ffffffff===ff^,,,,,,,_~_~~~~~~~',
    '~~fffff===ff^f^^,,,___~~~~~~~~WW',
    'f~ffff==ffff^^^^^^_~~~~W~WWWWWWW',
    'f~fff==fff^^^^^^^^~~~~WWWWWWWWWW',
    'f~ff==ffff^^^^^^~~~WWWWWWWWWWWWW',
    'f~f==fff^^^^^^^f~~WWWWWWWWWWWWWW',
    ',~==,BfBf^^^^^^,~WWWWWWWWWWWWWWW',
    '===,,,f^^B^^^^^,~WWWWWWWWWWWWWWW',
    '=~~,,B,^^^^^^^,,WWWWWWWWWWWWWWWW',
    ',,~~,,,,B,B^^^,,WWWWWWWWWWWWWWWW',
    '__,~~,B,,,_^^~~WWWWWWWWWWWWWWWWW',
    '____~~______~~WWWWWWWWWWWWWWWWWW',
    '_____~_______WWWWWWWWWWWWWWWWWWW',
    'rS~~~~~~~~WWWWWWWWWWWWWWWWWWWWWW',
    'r_WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '~WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  ],
  features: [
    { kind: 'event', x: 15, y: 1, id: 'f3_sea', once: true, text: 'The road tops a rise, and there is the sea: Gullwick below, at the river\'s mouth.' },
    { kind: 'event', x: 4, y: 10, id: 'f3_gullwick', once: true, text: 'Gullwick. Cottages turned from the wind, and nets drying on every wall.' },
    { kind: 'well', x: 6, y: 10, text: 'The village well. A rope of plaited net-cord.' },
    { kind: 'camp', x: 7, y: 13, name: 'The net loft', text: 'The net loft, warm and smelling of tar.' },
    { kind: 'event', x: 8, y: 14, id: 'f3_boats', once: true, text: 'Boats drawn up on the shingle. On every bow a loop inside a loop, fresh paint on old.' },
    { kind: 'npc', x: 9, y: 13, name: 'An old man mending nets', lines: [
      'An old man mends a net across his knees, and sings to it under his breath.',
      '"Ten for the Hearth and one for the Queen, and the lamp on the rocks for the boats unseen. Where the lamp goes out, the cave goes in, and nobody asks where the cargo\'s been."',
    ] },
    { kind: 'event', x: 11, y: 7, id: 'f3_rise', once: true, text: 'The ashes of a camp, cold, on the rise. Below it the whole bay, and Gullwick\'s boats.' },
    { kind: 'event', x: 0, y: 15, id: 'f3_soot', once: true, text: 'Where the beach ends, a lamp\'s worth of soot on the rock, and the sand trodden flat before it.' },
    // The Wenna step (the Foreland's chapter): Hild at the tideline by the boats.
    { kind: 'npc', x: 10, y: 15, name: 'Hild, Wenna\'s mother', lines: [
      'A woman stands at the tideline with her skirts wet to the knee, watching the water as if it owed her something. The rope at her belt is tied in a knot, a loop inside a loop: the mark painted on every bow along the shingle.',
      '"You\'re a company. Chartered, by the boots. Companies find things."',
      '"My man and my girl went out the night the light failed, and the boat never came in. Not a plank of her, not an oar. A boat that sinks gives something back. This one gave nothing, so she didn\'t sink. Somebody has her, and somebody has my girl."',
      '"Her name is Wenna. I can\'t pay what a company costs, so I\'ll give you that instead. Say it wherever you go, and watch whose face changes."',
    ], flag: 'q_wenna', says: [
      { after: { flag: ['q_greywater', 'q_greywater_done'] }, until: { flag: 'q_wenna' }, sets: 'q_wenna', lines: [
        'A woman stands at the tideline with her skirts wet to the knee. The rope at her belt is tied in a knot, a loop inside a loop: the mark painted on every bow along the shingle.',
        '"You\'re a company. Companies find things. My man and my girl went out the night the light failed and the boat never came in, and her name is Wenna." She stops. "You\'ve heard it. Don\'t tell me you haven\'t; I watched it land."',
        '"A ledger. Say the word again, so I have it." She takes it in, and does not weep. "Nobody writes down a drowned girl. You write down what you mean to keep. So she\'s kept, somewhere, and a kept thing can be fetched."',
        '"Go and fetch her. I\'ll be here. I\'m always here."',
      ] },
      { after: { flag: 'q_wenna' }, lines: [
        'Hild has tied another knot in the rope at her belt, below the first.',
        '"Not yet. I know. You\'d have shouted it from the road."',
        '"One knot a day. When she\'s home she can sit on that step and watch me untie them, every one, and I\'ll tell her what each day was. Go on. You\'ve a long way to walk and I\'ve knots to tie."',
      ] },
    ] },
    // The Boat With No Name-Board: Wat on the shingle, the hoard on the far beach, Hamo beside the road west.
    { kind: 'npc', x: 11, y: 14, name: 'Wat, a boat-builder', lines: [
      'An old man sits on an upturned hull, planing a plank down to nothing. His hands know the work, so his eyes are free for the sea.',
      '"I built the Patience. Twenty-two feet, oak on elm, and I cut her name-board myself and gave it three coats, because paint is cheaper than a board. My two boys took her out the night the light went out."',
      '"The sea\'s had her, I said. Then the laver-picker\'s girl came off the far beach at low water, white as a sail, saying she\'d seen a board in the rocks with PATIENCE on it."',
      '"A board is what a family gets when the sea keeps the rest. We nail them up in the net loft; there\'s nine. I want hers up there, not in a wrecker\'s fire. Go by night. That beach is empty by day, and that\'s how you know what it is."',
    ], flag: 'q_board', quest: {
      item: 'name_boards', reward: 60, setFlag: 'q_board_home',
      done: [
        'Wat turns the board over, and over again. "Three coats. That\'s mine." He runs a thumb along the back of it and stops. "That\'s a chisel. The sea doesn\'t own a chisel."',
        '"So she wasn\'t wrecked. Somebody took her name off, the way you\'d take the brand off a stolen horse, and the Crown\'s stamp is on the bill of sale."',
        '"And if the sea never had her, it never had my boys." He sets the board down, face up, and does not say the rest.',
        '"Four more are ours, from years back. Hild\'s isn\'t here; I looked for it first. The rest I\'ll see home, up and down the Wyke. Here: the loft jar. It\'s not a company\'s price, but the loft wants to pay you, and so do I."',
      ],
      after: [
        '"Up in the loft with the nine, and every family that had one waiting took it home for a night first and hung it after." He has a new plank on the hull. "I\'ve stopped watching the sea. I watch the far beach now."',
      ],
    }, says: [
      { after: { flag: 'q_board_sold' }, lines: [
        '"You sold them." He does not stop planing. "By the plank, I expect. He\'s fair, by the plank." A long stroke, and another. "Go on. There\'s nothing here you can buy."',
      ] },
    ] },
    { kind: 'npc', x: 0, y: 9, name: 'Hamo, the Compact\'s buyer', lines: [
      'A neat man in a good coat sits on a milestone with a ledger on his knee, as if the road were his shop. His vowels are Saltmouth\'s.',
      '"Travellers. Wonderful. I buy, if you sell: timber, cordage, brass, anything the sea has finished with. The Compact pays in coin and asks nothing, which is more than the Crown does on either count."',
      '"Boards, particularly. A painted board is seasoned oak, and oak is oak whatever\'s written on it. I pay by the plank. Sentiment I don\'t buy; I\'ve no shelf for it."',
    ], quest: {
      item: 'name_boards', reward: 140, setFlag: 'q_board_sold',
      done: [
        'Hamo counts the coin twice and the boards once.',
        '"Fourteen boards. Seasoned oak, every one, and the paint planes off. You\'ve done well, and so have I." He makes a note in the ledger, a short one. "If you find more, I\'m here most days. The sea is a generous partner. It never runs short of stock."',
      ],
      after: [
        '"Still here. Still buying. You\'d be surprised how much comes ashore on this coast." He looks at you. "Or perhaps by now you wouldn\'t."',
      ],
    }, says: [
      { after: { flag: 'q_board_home' }, lines: [
        '"I heard the boards went up in a loft in Gullwick. Nailed to a wall. Seasoned oak, and nailed to a wall." He shakes his head, without malice. "No hard feelings. There\'ll be more."',
      ] },
    ] },
    { kind: 'event', x: 0, y: 12, id: 'f3_night', when: { hours: 'night' }, text: 'By night the rocks stand up black and the tide is out. Below the wrack line, fresh footprints, many, all going one way.' },
    { kind: 'event', x: 1, y: 13, id: 'f3_hoard', once: true, text: 'Under sailcloth in a cleft: name-boards stacked like slates, oars, a shuttered lamp. Halfway down, PATIENCE, in three coats.' },
    { kind: 'chest', x: 1, y: 14, id: 'f3_hoard_chest', gold: 0, items: ['name_boards', 'customs_chit'] },
    { kind: 'chest', x: 1, y: 17, id: 'f3_cave', gold: 60, items: ['mace+1', 'staff+1', 'elixir'] },
    // Who Lived at Ashcombe (#77): Hob on the shingle by the net loft, once Hale has sent him here.
    { kind: 'npc', x: 7, y: 14, name: 'Hob, once tenant of Ashcombe', lines: [
      'Hob is on the shingle at Gullwick, gutting fish badly, with a child either side of him telling him how.',
      '"Hale sent me. You know; you carried the word. Ann\'s people have put me to the fish. I\'m no good at it, and they know, and they\'ve not said so, which is worse."',
      '"There\'s no singing here. There\'s the sea, and that\'s loud enough to sleep by. Tell Hale I stayed. He\'ll not believe it. Tell him anyway."',
    ], after: { flag: 'q_paper_hale' } },
  ],
  secrets: [{ x: 1, y: 16, hint: 'f3_soot' }],
  encounters: [
    { id: 'f3_crabs', x: 27, y: 2, monsters: ['shore_crab', 'shore_crab', 'shore_crab'], aware: 4, respawn: 1440 },
    { id: 'f3_crows', x: 4, y: 3, monsters: ['carrion_crow', 'carrion_crow', 'carrion_crow', 'carrion_crow', 'carrion_crow', 'carrion_crow'], aware: 5, respawn: 1440 },
    { id: 'f3_wreckers', x: 2, y: 15, when: { hours: 'night' }, monsters: ['wrecker', 'wrecker', 'lampman'], aware: 5, respawn: 2880 },
  ],
};
