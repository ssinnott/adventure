// The Kilns, box N2: Erzkamm, the ore crest. Country, band 16-17: the open fell up out of N3 and the
// hills climbing to the crag under the rim, with a cave in its face where the first ore was found;
// Hartmut keeps its mouth and teaches the Barbarian's second prestige (#19), and inside it the wall
// the dwarves call the first blessing, a scholar of Helmstow copying it. Below the crag the first
// ore-finders' spoil and their two adits, one in a knob of rock to the west and one under the rim to
// the east; over the hills the Fells' top, and the crag over Anvilhall closing the south-east.
// The rim's mountain closes the north, the west above the hills and the east; the fell meets N3.
// Cut from the atlas by hand, the void under the rim drawn as mountain; docs/areas/kilns.md §4.5 is
// its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH } from '../../../../game/types.ts';

export const IRONFELLS_N2: MapDef = {
  id: 'ironfells_n2',
  name: 'The Iron Fells',
  kind: 'outdoor',
  density: 'country',
  band: [16, 17],
  region: 'kilns',
  start: { x: 6, y: 31, facing: NORTH },
  rows: [
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMr#####rMMMMMMMMMMMMMMMMMMM',
    'MMMMMMr"""""rMMMMMMMMMMMMMMMMMMM',
    'MMMMMMrrr"rrrMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMSMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMM"""MMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMM"MMMMMMMMMMMMMMMMMMMMMMM',
    'MMM^^^^^^^^^^MMMMMMMMMMMMMMMMMMM',
    'MM^^^^^^^^^^^^^^MMMMMMMMMMMMMMMM',
    'M^^^^^^^^^^^^^^^^^^^MMMMMMMMMMMM',
    'Mrrr^^^^^^^^^^^^^^^^^^MMMMMMMMMM',
    '^r:r^^^^,,,^^^^^^^^^^^^^MMMMMMMM',
    '^^^^^^^^^,,,^^^^^^^^^^^^^^^MMrMM',
    '^^^,^^^^""^,^^^^^^^^^^^^^^^^^:MM',
    '^^,,,^^""""^,^^^^^^^^^^^^^^^^rMM',
    '^^,,,^^""""^^^^^^^^^^^^^^^^^^^MM',
    '^,,,,,,^""^^,,,^^^^^^^^^^^^^^^MM',
    '^,,,,,,,,^^,,,^^^^^^^^^^^^^^^^^M',
    '^,,,,,,,,,,,,^^^^^^^^^^^^^^^^^^M',
    ',,,,,,,,,,,,^^^^^^^^^^^MMMMMMMMM',
    ',,,,,,,,,,,,^^^^^^^^MMMMMMMMMMMM',
    ',,,,,,,,,,,,,^^^^MMMMMMMMMMMMMMM',
    ',,,,,,,,,,,,,^MMMMMMMMMMMMMMMMMM',
  ],
  features: [
    // Up the fell out of N3: the first ore-finders' spoil, tipped down the hill below the crag.
    { kind: 'event', x: 9, y: 22, id: 'n2_spoil', once: true, text: 'Old spoil below the crag, grassed over, the ore in it rusted red. Something has dug it over, and not with a pick.' },
    // The two adits the first ore-finders cut, one in a knob of rock to the west and one under the rim.
    { kind: 'event', x: 2, y: 21, id: 'n2_adit_west', once: true, text: 'An adit cut by hand into a knob of rock, the pick marks small and close. A tunnel goes on from its back that no pick made.' },
    { kind: 'event', x: 28, y: 22, id: 'n2_adit_east', once: true, text: 'An adit under the rim, its mouth half shut with fallen rock. Through the gap the air is warm, and smells of something living.' },
    // The crag: Hartmut at the cave's mouth, who teaches the Barbarian's second prestige (#19; DESIGN
    // §5): his lesson is said once to a Berserker of 19, after his first words.
    { kind: 'npc', x: 8, y: 15, name: 'Hartmut of Erzkamm', lines: [
      'A dwarf sits in the cave\'s mouth in his shirt, in a wind that has you buttoned to the chin. His arms are scar over scar.',
      '"Hartmut. I keep the mouth. Nobody asked me to, and nobody has asked me to stop."',
      '"The worms come up the old adits for the warm. They find me cold, and go back down."',
    ], flag: 'n2_hartmut_met', says: [
      { after: { flag: 'n2_hartmut_met', member: { cls: 'barbarian', level: 19, prestige: 1 } }, until: { flag: 'n2_hartmut_lesson' }, sets: 'n2_hartmut_lesson', lines: [
        'He looks your barbarian over as a smith looks over a blade, then holds out an arm for you to see.',
        '"Hartmut. Berserker, once, and every time they carried me home after. Rage spends you like coin."',
        '"Let it in sooner, and let the hide go hard round it. Then it is the others they carry. Stand in the wind with me."',
      ] },
    ], teaches: { cls: 'barbarian', prestige: 2, seek: 'Hartmut, who keeps the mouth of the cave at Erzkamm on the crag north of Anvilhall, can make an Ironhide of a Berserker.' } },
    // Inside the mouth: the wall, the first blessing, and the scholar copying it (#56's 34, his words
    // only); the floor worn to the blank face beside it.
    { kind: 'sign', x: 8, y: 14, id: 'n2_wall', text: 'Cut into the rock, older than the hall\'s. The dwarves say it is the first blessing.', read: 'KEEP CLEAR OF THE DOORS.' },
    { kind: 'npc', x: 7, y: 14, name: 'A scholar at the wall', lines: [
      'A man of Helmstow on a stool at the wall, copying it into a book. At his feet, children\'s primers wrapped in Helmstow paper.',
      '"The dwarves will not teach it to a man. So I learn it as their children do, from the primer."',
      '"Who for? Myself." He does not look up from the book.',
    ] },
    { kind: 'event', x: 9, y: 14, id: 'n2_floor', once: true, text: 'The floor is worn in a line from the mouth to a blank face at the back. The chalk on the wall stops a hand short of it.' },
    // The secret: behind the blank face, the doors the wall means, and before them the hoard.
    { kind: 'event', x: 9, y: 12, id: 'n2_doors', once: true, text: 'A passage cut square, and past it iron doors in a row in the crag\'s back, lettered over in the old script. No handle on any.' },
    { kind: 'event', x: 9, y: 11, id: 'n2_hoard', once: true, text: 'Before the doors, picks laid down in a row and a heap of ore beside them, rust on all of it. Nobody dug on.' },
    { kind: 'chest', x: 10, y: 11, id: 'n2_hoard_chest', gold: 400, items: ['mattock+1'] },
    // Under the crag's shoulder, the camp; the cairn on the crest; and the lookout south from the
    // Fells' top over the crag to Anvilhall's smoke.
    { kind: 'camp', x: 12, y: 17, name: 'The lee of the crag', text: 'A ring of stones in the lee of the crag, a wall of turf on the wind\'s side. The wind goes over you.' },
    { kind: 'cairn', x: 20, y: 19, id: 'n2_cairn', text: 'A cairn on the crest under the rim, so old the lichen has made it one stone. Only the top stone moves.', gold: 240, items: ['potion_sp_great'] },
    { kind: 'event', x: 19, y: 28, id: 'n2_lookout', once: true, when: { hours: 'day' }, text: 'South from the Fells\' top, smoke comes up out of the hill over Anvilhall in a dozen places, and none of them a chimney.' },
    { kind: 'event', x: 19, y: 28, id: 'n2_lookout_night', once: true, when: { hours: 'night' }, text: 'South over the crag the hill above Anvilhall glows at its seams, as a fire does that is banked for the night.' },
  ],
  secrets: [{ x: 9, y: 13, hint: 'n2_floor' }],
  encounters: [
    // Fire beetles on the first ore-finders' spoil, nearest the way up; and rock worms in their two
    // adits, one in the knob of rock and a pair under the rim at the far end, the box's groups at 17.
    { id: 'n2_beetles', x: 9, y: 25, monsters: ['fire_beetle', 'fire_beetle', 'fire_beetle'], aware: 4, respawn: 1440 },
    { id: 'n2_worm_west', x: 2, y: 20, monsters: ['rock_worm'], aware: 2, respawn: 2880, roams: false },
    { id: 'n2_worms_east', x: 29, y: 22, monsters: ['rock_worm', 'rock_worm'], aware: 2, respawn: 2880, roams: false },
  ],
};
