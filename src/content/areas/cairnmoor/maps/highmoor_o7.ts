// Cairnmoor, box O7: Fionnlios's box. Core, band 18-19: down off the Kilns' grass into the moor, its
// heather under snow; the peat-cutter's track in from N7 onto a rise of rock, and on its top the ring,
// thirteen stones, one fallen, the ground inside bare of snow; the Watcher's Hut beside it, where the
// Watcher counts the lights and teaches the Sorcerer's second; below, the tarn and the piper's fire on
// its shore, where the piper teaches the Bard's second; the marsh at the tarn's head, and the hills
// rising south-east to the first tor.
// Cut from the atlas by tools/scaffold.ts; docs/areas/cairnmoor.md §4.3 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST } from '../../../../game/types.ts';
import { RING_SPOKE } from '../chapter.ts';

export const HIGHMOOR_O7: MapDef = {
  id: 'highmoor_o7',
  name: 'High Moor',
  kind: 'outdoor',
  density: 'core',
  band: [18, 19],
  region: 'cairnmoor',
  start: { x: 0, y: 22, facing: EAST },
  rows: [
    '^^^^^^^^^^,,,,,,,,,,,,,,^^^^^^^^',
    '^^^^^^^^^^,,,,,,,,,,,,,,^^^^^^^^',
    '^^^^^^^^^,,,,,,,,,,,,,,,^^^^^^^^',
    '^^^^^^^^^,,,,,hh,,,,,,,,^^^^^^^^',
    '^^^^^^^^,,,,hhhhh,,,,,,^^^^^^^^^',
    '^^^^^^^^,,,hhhhhhhhh,,,h^^^^^^^^',
    '^^^^^^^,,hhhhhhhhhhhhhhhhh^^^^^^',
    '^^^^^^,hhhhhhhhhhhhBhhhhhhh^**^^',
    '^^^^^hhhhhh**hhhhhhhhhhhhhh^**^^',
    '^^^^hhhhhh****hhhhhhhhhhhhh^^^^^',
    '^^^hhhhhhhh**hhhhhhhh***hhh^^^^^',
    ',hhhhhhhhhhhhhhhhhhh****hhh^^^^^',
    ',,hhhhhhhhhhhhhhhhhhh**hhhh^^^*^',
    'hhhhhhhhhhhhhhhhhhhhhhhhhhh^^^^^',
    'hhhh**hhhhhhhhhhhhhhhhhhhhh^^^^^',
    'hhh****hhhhhhhhhhhhhhhhhhhh^^^^^',
    'hhhh**hhhhhhhhhhhhhhhhh**hh^^^^^',
    'hhhhhhhhhhhhhhhhhhhhhhhhhhh^^^^^',
    'hhhhhhhh::Bhhhhhhhhhhhhhhhh^**^^',
    'hhhh**:::hh,hhhhhhhhh^^^^^^^^^^^',
    'hhh***:***hrhhhhhhhh^^^^^^^^^^^^',
    'hh***r,r***hrhhhhhhh^^^^rr^^^^^^',
    ':::*r,,,r***hhhhhhhhh^^^rrr^^^^^',
    'h*:r,,,,,rrrhhhhhhhhh^^^^r^^^^^^',
    'h*::,,,,,S:rhhhhhhhhhh^^^^^^^*^^',
    'h**r,,,,,rrrhhhhhhhhhh^^^^^^^^^^',
    'h***r,,,r***rhhhhhwwwwww^^^^^^^^',
    'hh***r,r***h~~~~~hwwwwww^^^^^^^^',
    'hrh*******~~~~~~~~wwwwwwhhh^^^^^',
    'hhhr****~~~~~~~~~~w~~~~whhh^^^^^',
    'h~~~~~~~~~~~~~~~~hhhhh~~~~~~~~^M',
    '~hhhhhhhhhhhhhhhh**hh^^^^^^^^^MM',
  ],
  features: [
    // Down off the Kilns' grass: their ash on the snow, a hare on the hills, the rim east, a cutter's
    // bothy, the waymarks south and the drifts.
    { kind: 'event', x: 14, y: 2, id: 'o7_ash', once: true, text: 'Grey ash lies on the snow here, blown south off the Kilns. It thins as you go on.' },
    { kind: 'event', x: 4, y: 5, id: 'o7_hare', once: true, text: 'A hare in its winter white sits up on the hill, and is gone into the snow.' },
    { kind: 'event', x: 26, y: 4, id: 'o7_rim', once: true, text: 'East, the moor ends at the rim: mountain with snow to its knees, and nothing past it.' },
    { kind: 'event', x: 19, y: 8, id: 'o7_bothy', once: true, text: 'A cutter\'s bothy, its roof fallen in, turf stacked against its wall for a winter. None of it burnt.' },
    { kind: 'event', x: 8, y: 10, id: 'o7_bones', once: true, text: 'A ewe\'s bones picked clean in the heather, the snow round them trodden flat by something wide.' },
    { kind: 'event', x: 29, y: 10, id: 'o7_snowfield', once: true, text: 'Snow lies unbroken under the rim. Not a print in it, not even a bird\'s.' },
    { kind: 'event', x: 3, y: 13, id: 'o7_rushes', once: true, text: 'A cross of rushes tied to a stake in the heather, as the hill folk hang one over a door.' },
    { kind: 'event', x: 14, y: 13, id: 'o7_waymarks', once: true, text: 'Small stones set upright in the heather, one every score of paces, leading south.' },
    { kind: 'event', x: 23, y: 14, id: 'o7_drift', once: true, text: 'Snow drifted against a peat bank higher than your head, its lip curled over like a wave.' },
    // The Watcher's Hut: the hut a camp, the tally on its lintel, and the Watcher on his bench, who
    // counts the lights and teaches the Sorcerer's second prestige (#19; DESIGN §5): his lesson is said
    // once to an Arcanist of 19, after his first words. He gives The Watcher's Tally (#56's 37, #482):
    // he takes the first page from Carn Dubh, and asks where its nights go, his lintel or the Lanterns.
    { kind: 'camp', x: 9, y: 18, name: 'The Watcher\'s Hut', text: 'A stone hut with a turf roof, its door on the lee side. A fire inside, and room by it.' },
    { kind: 'event', x: 9, y: 18, id: 'o7_tally', once: true, text: 'A tally cut along the lintel in fives, end to end. Near the end, a gap a hand wide, then a few fresh cuts.' },
    { kind: 'event', x: 9, y: 18, id: 'o7_lintel', once: true, after: { flag: 'q_tally_lintel' }, text: 'At the lintel\'s far end, before the oldest cuts, eleven strokes whiter than the rest.' },
    { kind: 'npc', x: 11, y: 19, name: 'The Watcher', lines: [
      'An old man on a bench against the hut\'s wall, a notched stick across his knees, his eyes on the bog.',
      '"I count the lights. Watchers have, four hundred years. Somebody must."',
      '"The last one stopped counting. They buried him out among the cairns, the first page of his tally with him. I would have it."',
    ], flag: 'o7_watcher_met', says: [
      { after: { flag: 'o7_watcher_met', member: { cls: 'sorcerer', level: 19, prestige: 1 } }, until: { flag: 'o7_watcher_lesson' }, sets: 'o7_watcher_lesson', lines: [
        'He looks your sorcerer over, then points his stick at a light out over the bog.',
        '"That one drinks what you spell with. Learn how it drinks, and you need not let it."',
        '"Then turn it round. Sit with me tonight, and count."',
      ] },
      { after: { flag: 'q_tally_page' }, until: [{ flag: 'q_tally_lintel' }, { flag: 'q_tally_lanterns' }], lines: [
        'The Watcher has the page on his knee and his knife out.',
        '"Eleven nights. They go in my lintel, before the first of mine. Or the Lanterns at the Lodge read them. Not both."',
      ], choice: { ask: '"The lintel, or the Lanterns?"', answers: [
        { label: 'Cut them in the lintel.', sets: 'q_tally_lintel', pay: { xp: 1200 }, says: [
          'He cuts eleven strokes at the lintel\'s far end, slowly, and puts the page in the fire after.',
          '"Now it is all in one place."',
        ] },
        { label: 'Send it to the Lanterns.', sets: 'q_tally_lanterns', pay: { xp: 1200 }, says: [
          'He sews the page into a square of oilskin, and ties it.',
          '"The drovers take it down. The Lanterns pay for news of the ring."',
        ] },
      ] } },
      { after: [{ flag: 'q_tally_lintel' }, { flag: 'q_tally_lanterns' }], sets: 'o7_watcher_met', lines: [
        'The Watcher is on his bench, the stick across his knees, counting.',
        '"Somebody must."',
      ] },
    ], quest: { item: 'watchers_page', reward: 200, setFlag: 'q_tally_page', done: [
      'He reads the page at arm\'s length, his lips moving, and counts the rings in its margin twice.',
      '"Eleven. Before the hut was built." He sets a purse on the bench. "The Lodge sends it every spring. I have no use for it."',
    ], early: [
      'An old man on a bench by the hut takes the page out of your hand before you have said a word.',
      '"His hand. I have looked for this since I was a boy." He sets a purse on the bench. "The Lodge sends it. Take it."',
    ] }, teaches: { cls: 'sorcerer', prestige: 2, seek: 'The Watcher, at his hut by the stone ring on High Moor, can make a Thaumaturge of an Arcanist.' } },
    { kind: 'event', x: 16, y: 18, id: 'o7_count', once: true, text: 'A flat stone by the hut, scratched in rows: a mark a light, a row a night, the stone near full.' },
    { kind: 'event', x: 22, y: 18, id: 'o7_tor', once: true, text: 'South-east the hills rise to a tor, grey slabs heaped on the skyline.' },
    { kind: 'event', x: 29, y: 21, id: 'o7_cornice', once: true, text: 'The wind off the rim has scoured the hills to the stone, and piled the snow in their lee.' },
    // The rise: the cairn on its shoulder, the ring on its top.
    { kind: 'cairn', x: 3, y: 17, id: 'o7_cairn', text: 'A cairn on the rise\'s shoulder, chest high, a black feather caught in every chink.', gold: 260, items: ['potion_sp_great'] },
    { kind: 'event', x: 1, y: 22, id: 'o7_ring', once: true, when: { hours: 'day' }, text: 'The track climbs onto a rise of rock. On its top a ring of stones, thirteen, one of them fallen.' },
    { kind: 'event', x: 1, y: 22, id: 'o7_ring_night', once: true, when: { hours: 'night' }, text: 'Ahead on the rise a ring of stones stands black against the snow. Lights go round it, low.' },
    // Fionnlios: the camp inside the ring, the voice by night, once, and the ground by the fallen stone.
    // The voice sets the chapter's flag (#481).
    { kind: 'camp', x: 6, y: 24, name: 'Fionnlios', text: 'Inside the ring, out of the wind. Short turf, and the stones round you taller than a man.' },
    { kind: 'event', x: 6, y: 24, id: 'o7_voice', once: true, when: { hours: 'night' }, sets: RING_SPOKE, text: 'A voice in the dark inside the ring, flat, from no mouth: "Crew. Report." It waits, and says it again.' },
    { kind: 'event', x: 8, y: 24, id: 'o7_bare', once: true, text: 'No snow on the ring\'s ground, though it lies all round. By the fallen stone not even the frost lies.' },
    // Under the fallen stone, the hollow where the first Watchers kept their tallies.
    { kind: 'event', x: 10, y: 24, id: 'o7_hollow', once: true, text: 'Under the stone, a hollow lined with slate: tally sticks in a bundle, older than the hut\'s, and a staff in oiled skin.' },
    { kind: 'chest', x: 10, y: 24, id: 'o7_cache', gold: 1350, items: ['banded_staff+1'] },
    // The tarn below the ring: the piper at his fire on its shore, who teaches the Bard's second
    // prestige (#19), his lesson said once to a Troubadour of 19; the shrine by the water.
    { kind: 'camp', x: 10, y: 27, name: 'The piper\'s fire', text: 'A peat fire on the tarn\'s shore in a ring of stones, a sheepskin to sit on. The piper shifts up.' },
    { kind: 'npc', x: 9, y: 27, name: 'The piper', lines: [
      'A thin man by the fire, his pipes across his knees, the drones wrapped in wool against the cold.',
      '"Of a night I play, and the lights keep off. Or they like the tune. Either way."',
      '"Never play inside the ring. It listens."',
    ], flag: 'o7_piper_met', says: [
      { after: { flag: 'o7_piper_met', member: { cls: 'bard', level: 19, prestige: 1 } }, until: { flag: 'o7_piper_lesson' }, sets: 'o7_piper_lesson', lines: [
        'He hands your bard the pipes, and listens to three notes with his eyes shut.',
        '"A song goes into a man and does its work there. Make it a war-song, and he fights for it."',
        '"Again. Louder. They should hear you in Anvilhall."',
      ] },
    ], teaches: { cls: 'bard', prestige: 2, seek: 'The piper, at his fire by the tarn below the stone ring on High Moor, can make a Skald of a Troubadour.' } },
    { kind: 'shrine', x: 14, y: 26, id: 'o7_shrine', text: 'A slab by the tarn with a spiral cut in it, worn nearly smooth. Coins lie in the water below.', stat: 'personality', done: 'The spiral stone by the tarn.' },
    { kind: 'event', x: 8, y: 31, id: 'o7_far_shore', once: true, text: 'From the tarn\'s far shore the ring stands dark on its rise, the hut beside it and the fire below.' },
    { kind: 'event', x: 1, y: 29, id: 'o7_outflow', once: true, text: 'The tarn\'s stream goes out west under the snow, black where it shows.' },
    // The bog south of the tarn, by day and by night; the marsh at the tarn's head; the burn off the
    // rim out of its shoulder; and the first tor, a face in it by day.
    { kind: 'event', x: 17, y: 23, id: 'o7_bog', once: true, when: { hours: 'day' }, text: 'South beyond the tarn the bog runs flat and brown to the edge of sight, pools shining in it.' },
    { kind: 'event', x: 17, y: 23, id: 'o7_lights', once: true, when: { hours: 'night' }, text: 'South over the tarn, lights drift low above the bog, and are never where you look.' },
    { kind: 'event', x: 19, y: 26, id: 'o7_marsh', once: true, text: 'Reeds and black water at the tarn\'s head. The peat is torn open here, as if something climbed out.' },
    { kind: 'event', x: 27, y: 31, id: 'o7_burn', once: true, text: 'A burn comes out from under the rim\'s foot, talking to itself under a skin of ice, and runs west.' },
    { kind: 'event', x: 25, y: 24, id: 'o7_face', once: true, when: { hours: 'day' }, text: 'A tor of grey slabs piled on the hill. In the top slab, a face: brow, nose and a long shut mouth.' },
  ],
  secrets: [{ x: 9, y: 24, hint: 'o7_bare' }],
  encounters: [
    // Ravens on the cairn; by night, round the ring, four bog lights with a moor hound running at
    // their front, the box's hardest group; bog bodies in the marsh at the tarn's head; and by night
    // on the first tor, alone, a tor troll. The ring itself holds no monster.
    { id: 'o7_ravens', x: 2, y: 17, monsters: ['raven', 'raven', 'raven', 'raven', 'raven', 'raven', 'raven', 'raven'], aware: 4, respawn: 1440, roams: false },
    { id: 'o7_lights', x: 1, y: 23, monsters: ['moor_hound', 'bog_light', 'bog_light', 'bog_light', 'bog_light'], leader: 'moor_hound', aware: 5, respawn: 2880, when: { hours: 'night' } },
    { id: 'o7_bodies', x: 21, y: 28, monsters: ['bog_body', 'bog_body', 'bog_body', 'bog_body'], aware: 2, respawn: 1440 },
    { id: 'o7_troll', x: 25, y: 24, monsters: ['tor_troll'], aware: 3, respawn: 2880, roams: false, when: { hours: 'night' } },
  ],
};
