// The Glasswold, box B8: the Wold's heart, and Kushtash. Core, band 27-28: the far west under the rim,
// walked into over the east edge from the Scarp's edge (C8). The Riders' hunting camp by the way in, the
// hunters at their fire waiting on the Grey Lion; Kushtash under the rim, the tallest mesa on the Wold,
// its top out of sight, where Aysu, the scout who guided the Meridian Company, keeps her fire and teaches
// the Ranger's third for Oriel Fane's map (#448); the lesser mesa
// east of it, a basilisk behind a pride at its foot; and between the two the Grey Lion's ground, the
// kill-ground, the vultures over it. A cairn, a well and the Riders' running horse; a hermit in a hollow
// under the rim, who went into the Glass once; and something come up out of the dunes to the south.
// The way up Kushtash is the scree on its rim side, stepped by hand, and a ledge from the steps' head.
// The Scarp's lip along the north edge and the rim down the west; B9 (#530) to the south is not built.
// Cut from the atlas by tools/scaffold.ts; docs/areas/glasswold.md §4.7 is its brief (#529).
import type { MapDef } from '../../../../game/map.ts';
import { WEST } from '../../../../game/types.ts';

/**
 * The Ranger's third (#448): Aysu has asked a ranger of 27 with the second for Oriel Fane's map, from the
 * last of the Meridian Company's camps under Fire Mountain (`SCOUT_ASKED`), and been given it (`MAP_GIVEN`).
 * She takes it from the pack; the Lost Expedition stays done on `meridian_map`, which Fane's giving set.
 */
export const SCOUT_ASKED = 'q_scout_asked', MAP_GIVEN = 'q_scout_map';

/**
 * The Lion's Share (#56's 53, #532): the young Rider at Akordu asks for the last blow (`LION_ASKED`), and
 * the company hunts the Grey Lion with him (`LION_HUNT`), when he is at the hunters' fire here and not
 * at Akordu, or lets the old lion die (`LION_LEFT`), when the eldest tells the rest (`LION_TOLD`, D8's).
 * The lion down (`LION_DOWN`), the boy's is the last blow (`LION_BLOW`); down unasked, it was nobody's
 * of theirs (`LION_TAKEN`).
 */
export const LION_ASKED = 'q_lion', LION_HUNT = 'q_lion_hunt', LION_LEFT = 'q_lion_left', LION_BLOW = 'q_lion_blow';
export const LION_TOLD = 'q_lion_told', LION_TAKEN = 'q_lion_taken', LION_DOWN = 'wold_b8:b8_grey_lion';

export const WOLD_B8: MapDef = {
  id: 'wold_b8',
  name: 'The Wold',
  kind: 'outdoor',
  density: 'core',
  band: [27, 28],
  region: 'glasswold',
  start: { x: 31, y: 4, facing: WEST },
  rows: [
    'MM||||||||||||||||||||||||||||||',
    'M^^^^sssssssss^^^^^sssssssssssss',
    'Mssssssssssssss^^^ssssssssssssss',
    'Msssssssssssssss^sssssssssssssss',
    'Mssssssssssssssssssssssss:ssssss',
    'Msssssssssssssssssssssss:::sssss',
    'Mssssssssssssssssssssssss:ssssss',
    'Msssssssssssssssssssssssssssssss',
    'Msssssssssssssssssssssssssssssss',
    'Msssssssssssssssssssssssssssssss',
    'Msssssssssssssssssssssssssssssss',
    'Msssssrrrrrsssssssssssssssssssss',
    'Mssssrrrrrrsssssssssssssssssssss',
    'Mssrrrrrrrrrrsssssssssssssssssss',
    'Msr"::sssssrrsssssssssssssssssss',
    'Msr"rss:ssssrrsssssssssrrsssssss',
    'Msr"rsssssssrrsssssssrrrrrssssss',
    'MsS"rrsssssrrrsssssssrrrrrrsssss',
    'Mssrrrrrrrrrrssssssssrrrrrrrssss',
    'Msssrrrrrrrssssssssssrrrrrrrssss',
    'Mssssssssssssssssssssrrrrrrrssss',
    'Mssssssssssssssssssssrrrrrrrssss',
    'Mssssssssssssssssssssrrrrrrsssss',
    'M^sssssssssssssssssss^^^^^^sssss',
    'M^^:ssssssssssssssssssssssssssss',
    'M^^^ssssssssssssssssssssssssssss',
    'M^^^^sssss^sssssssssssssssssssss',
    'M^^^^^ss^^^^ssssssssssssssssssss',
    'M^^^^^ss^^^^^sssssssssssssssssss',
    'M^^^^^ss^^^^^^ssssssssssssssssss',
    'M^^^^^^s^^^sssssssssssssssssssss',
    'M^^^^^^^s^ssssssssssssssssssssss',
  ],
  features: [
    // The way in over the east edge from C8: Kushtash seen far off under the rim; the hunters' camp, their
    // fire, the young Rider and the eldest's word come out from Akordu (#56's 53, #532's), and their horses.
    { kind: 'event', x: 29, y: 4, id: 'b8_kushtash', once: true, text: 'West, under the rim, a mesa stands higher than any on the Wold, sheer on every side. Its top is out of sight.' },
    { kind: 'camp', x: 25, y: 5, text: 'The hunters\' fire in a ring of saddles, a hide pegged out beside it and the horses hobbled close.' },
    // The young Rider is here once the company has said it will hunt with him, and at Akordu till then (#532).
    { kind: 'npc', x: 24, y: 4, name: 'The young Rider', after: { flag: LION_HUNT }, lines: [
      'A boy in a man\'s coat sits apart from the hunters, a lance too long for him across his knees.',
      '"When the Grey Lion comes out to his kill, the hunt goes in. Bring him down, and leave the last blow to me."',
    ], says: [
      { after: { flag: LION_BLOW }, lines: ['The young Rider sits among the hunters, his hair cut short as theirs is.', '"Next year the last blow is somebody else\'s."'] },
      { after: { flag: LION_HUNT, slain: LION_DOWN }, lines: ['The boy comes in from the lion\'s ground, his lance dark to the hand.', '"He lay down when you were done with him, and I gave him the last blow."'], choice: { ask: '"Will you say so at the fire?"', answers: [
        { label: 'It was his blow.', sets: LION_BLOW, pay: { xp: 1500 }, says: ['The hunters cut his hair short at the fire, as theirs is. He is a Rider.'] },
      ] } },
    ] },
    { kind: 'npc', x: 26, y: 6, name: 'A Rider from Akordu', lines: [
      'A woman of the Riders, dust to the knees, her horse still saddled. She has ridden out from Akordu.',
      '"The eldest sends her word to the hunt: the lion is old. Let him die on his own ground."',
      '"She does not forbid it. She never forbids. She says it once, and waits to see what we are."',
    ] },
    { kind: 'event', x: 28, y: 9, id: 'b8_horses', once: true, text: 'The hunters\' horses graze hobbled in the long grass, their manes cropped short for the hunt.' },
    // The north: the Riders' cairn on the hill, their well, and the rim where the grass stops.
    { kind: 'cairn', x: 16, y: 2, id: 'b8_cairn', text: 'A Riders\' cairn on the hill, a lion\'s skull on top of it, its jaws wired shut.', gold: 600, items: ['quickening'] },
    { kind: 'well', x: 10, y: 6, text: 'A well of the Riders, ringed with stones, a skin bucket on a thong. Lion prints in the mud round it.' },
    { kind: 'event', x: 3, y: 4, id: 'b8_rim', once: true, text: 'The grass runs west to the rim and stops. The mountain goes up from it like a wall, and nothing is past it.' },
    // Kushtash: the smoke off its top by day, the fire by night, the vultures never over it; on its rim side
    // the scree, one run of it bare.
    { kind: 'event', x: 8, y: 10, id: 'b8_smoke', once: true, text: 'A thread of smoke stands up off the mesa\'s top. The vultures wheel over all the grass, and never over that.' },
    { kind: 'event', x: 14, y: 12, id: 'b8_fire', once: true, when: { hours: 'night' }, text: 'High on the great mesa a fire burns, one red point under the stars. Nothing else is lit for miles.' },
    { kind: 'event', x: 1, y: 17, id: 'b8_scree', once: true, text: 'Scree lies along the foot of the face, grey with lichen. One run of it, going up, is bare.' },
    // Through the scree: the steps, the ledge to the top, the scout at her fire and the view.
    { kind: 'event', x: 3, y: 17, id: 'b8_steps', once: true, text: 'The scree is stepped: each stone set flat on the one below, and not one of them fallen. They go up.' },
    { kind: 'event', x: 4, y: 14, id: 'b8_ledge', once: true, text: 'From the steps a ledge runs along the face to the top, a stride wide, the drop at your elbow.' },
    { kind: 'event', x: 7, y: 15, id: 'b8_lookout', once: true, text: 'A fire in a ring of stones at the edge, dung and thorn, a hide stretched against the wind. Not a bone up here.' },
    // Aysu, the scout, the Ranger's third prestige (#448): her own words first, then, to a ranger of 27 with
    // the second, her ask, once, to follow the Meridian journals down Fire Mountain's vents for Oriel Fane's
    // map; with the map in the pack, a question, and given, the teaching; after it, her own words again.
    { kind: 'npc', x: 8, y: 16, name: 'Aysu, the scout', lines: [
      'A woman of the Riders sits at the fire with a bow across her knees, watching the Glass. She does not get up.',
      '"I guided the Meridian Company over the Wold. Good walkers. They asked too many questions."',
      '"They went east, to the mountain that burns. None of them came back this way. I keep the fire lit."',
    ], flag: 'b8_scout_met', says: [
      { after: { flag: SCOUT_ASKED, item: 'fane_map' }, lines: [
        'She sees the oilcloth in your pack before you are off the ledge.',
      ], choice: { ask: 'Give her Fane\'s map?', answers: [
        { label: 'Give it', takes: 'fane_map', sets: MAP_GIVEN, says: [
          'She takes it in both hands and weighs it, and does not open it.',
          '"So he finished it. Sit down, ranger."',
        ] },
        { label: 'Not yet', says: ['She looks back to the Glass.'] },
      ] } },
      { after: { flag: 'b8_scout_met', member: { cls: 'ranger', level: 27, prestige: 2 } }, until: { flag: SCOUT_ASKED }, sets: SCOUT_ASKED, lines: [
        'She looks your ranger over: the bow first, then the hands on it.',
        '"Their mapmaker, Fane, drew every step they took. Follow their journals down the mountain, and bring me his map."',
        '"Then I will show you what a Rider sees."',
      ] },
    ], teaches: { cls: 'ranger', prestige: 3, asks: 'scout_map', done: { flag: MAP_GIVEN }, seek: 'Aysu, the scout who guided the Meridian Company, keeps a fire on Kushtash, the tallest mesa on the Wold, and can make an Unerring of a Deadeye.' } },
    { kind: 'event', x: 10, y: 15, id: 'b8_view', once: true, text: 'The Wold lies open from here, east to the haze over Akordu. South-east the Glass lies white, a dark crown standing in it.' },
    // The Grey Lion's ground between the mesas: the kill-ground, a hunter's saddlebags in it, the vultures over.
    { kind: 'event', x: 16, y: 16, id: 'b8_kill_ground', once: true, text: 'Between the mesas the grass is beaten flat and fouled. Bones lie in it from many kills: horses, lions, men.' },
    { kind: 'chest', x: 15, y: 20, id: 'b8_saddlebags', gold: 1600, items: ['elixir'] },
    { kind: 'event', x: 19, y: 12, id: 'b8_vultures', once: true, text: 'Vultures turn low over the ground between the mesas, a dozen of them, waiting. None comes down.' },
    // The lesser mesa: the glassed round its foot, and the pride's kill by the way in.
    { kind: 'event', x: 29, y: 17, id: 'b8_mesa_seen', once: true, text: 'A lesser mesa stands east of the great one, sheer and flat-topped. Things stand round its foot, very still.' },
    { kind: 'event', x: 28, y: 21, id: 'b8_glassed', once: true, text: 'A hunter of glass in the grass, crouched behind his spear, his face turned up to the mesa\'s lip.' },
    { kind: 'event', x: 29, y: 13, id: 'b8_kill', once: true, text: 'A horse pulled down in the long grass, a hunter\'s saddle still on it. The vultures hop off a little way.' },
    // The south: tracks up out of the dunes, a lie in the grass, the Riders' running horse on the rise.
    { kind: 'event', x: 19, y: 27, id: 'b8_tracks', once: true, text: 'Prints come up out of the south, a long stride apart, each a hand deep and glittering with glass.' },
    { kind: 'event', x: 26, y: 28, id: 'b8_lie', once: true, text: 'The grass is pressed flat in a hollow, tawny hairs caught in it, and a smell of cat.' },
    { kind: 'shrine', x: 10, y: 27, id: 'b8_shrine', text: 'A running horse laid out in white stones on the rise, its legs at full stretch, the grass pulled from between them.', stat: 'speed', done: 'The white horse on the rise, running.' },
    // Under the rim in the south-west: a horse's bones, and the hermit in his hollow, words only.
    { kind: 'event', x: 6, y: 29, id: 'b8_bones', once: true, text: 'Under the rim a horse\'s bones lie among the hills, picked white, the saddle rotted to its frame.' },
    { kind: 'npc', x: 3, y: 24, name: 'A hermit under the rim', lines: [
      'An old Rider sits in a hollow under the rim, wrapped in a hide. His eyes are pale at the edges, as if burnt.',
      '"I went into the Glass once. Something walked there in a man\'s shape, taller than any man."',
      '"Green as old bronze, a lamp for a face. It never looked at me. It was going somewhere."',
    ] },
  ],
  secrets: [{ x: 2, y: 17, hint: 'b8_smoke' }],
  encounters: [
    // From the way in: the pride at its kill with the vultures down on it; the mesa fight in the scree under
    // the lesser mesa's south face, a basilisk behind four lions; and the Grey Lion alone on his ground
    // between the mesas, the box's boss at 28.
    { id: 'b8_pride', x: 27, y: 13, monsters: ['wold_lion', 'wold_lion', 'wold_lion', 'wold_lion', 'vulture', 'vulture', 'vulture'], aware: 4, respawn: 2880 },
    { id: 'b8_mesa', x: 24, y: 23, monsters: ['wold_lion', 'wold_lion', 'wold_lion', 'wold_lion', 'basilisk'], aware: 3, respawn: 2880 },
    { id: 'b8_grey_lion', x: 17, y: 19, monsters: ['grey_lion'], aware: 3, roams: false, slainText: 'The Grey Lion lies down in the beaten grass as if to sleep, and the vultures begin to come down.' },
  ],
};
