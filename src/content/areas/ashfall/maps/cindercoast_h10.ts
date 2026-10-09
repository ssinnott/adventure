// Ashfall, box H10: the Stair's foot. Core, band 24: the Giants' Stair down the Sheer from I10's 0,20,
// its last flights along the cliff's foot to the landing at 26,20 (258,306), the atlas's link; the Sheer
// along the east edge, the pines under it where things fallen from the Stair come to rest; the black
// sand west and north of the foot, up to the dune over the Sound; the track from the foot across the
// sand past Scaldwell (240,300), its pools in the ash, the bathhouse and its keeper, the Riders' shrine
// and the rock where the water comes up, a stoker shovelling at it; and on through the vines of the
// shore to the west edge, where G10's vines meet it, for Cinderport. The stream comes up from the south
// and goes on into G10 at rows 22 and 23. The way in is the Stair, from I10 (#502); the north and south
// edges end the world against H9's shore and H11.
// Cut from the atlas by tools/scaffold.ts; docs/areas/ashfall.md §4.2 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { WEST } from '../../../../game/types.ts';

export const CINDERCOAST_H10: MapDef = {
  id: 'cindercoast_h10',
  name: 'Cindercoast',
  kind: 'outdoor',
  density: 'core',
  band: [24, 24],
  region: 'ashfall',
  start: { x: 31, y: 20, facing: WEST },
  rows: [
    '&&&&&&&,,,,,,,,,,,,,,,,,,,,,,p||',
    '&&&&&&&&&&,,,,,,,,,aa,,,,,,,,p||',
    '&&&&&&&&&&&&,,,,,,aaaaa,,,,,,p||',
    '&&&&&&&&&&&&&&,aaaaaaaaaaa,^^p||',
    '&&&&&&&&&&&&&&&&aaaaaaaaa,,^^p||',
    '&&&&&&&&&&&&&&&&&aaaaaaaaa,^pp||',
    '&&&&&&&&&&&&&&&&&aaaaaaaaa,^pp||',
    '&&&&&&&&&&&&&&&&&&aaaaaaa,,ppp||',
    '&&&&&&&&&&&&&&&&&&aaaaaaa,,ppp||',
    '&&&&&&&&&&&&&&&&&&aaaaaaa,,ppp||',
    '&&&&&&&&&&&&&&&&aaaaaaaaa,,ppp||',
    '===========&&&aaaaaaaaaaa,,ppp||',
    '&&&&BBB&&&=&aaaaaaaaaaaaaa,,,p||',
    '&&&&BBB&&&======aaaaaaaaaa,,,p||',
    'a&&&&&&aaaaaaaa==aaaaaaaaaa,,,||',
    'aaaaaaa~~~aaaaaa==aaaaaaaaaa,,||',
    'aaaaaaaa~~~aaaaaa==aaaaaaaaaaa||',
    'aaaaaaaaaaaaaaaaaa==aaaaaaaaaa||',
    'aaaaaarrSrraaaaaaaa==aaaaaaaaa||',
    'aaaaaarr:rraaaaaaaaa==aaaaaar|||',
    'aaaaaarr:rraaaaaaaaaa===========',
    'aaaaaarrrrraaaaaaaaaaaaaaaaapppp',
    '~aaaaaaaaaaaaaaaaaaaaaaaaaaapppp',
    '~~aaaaaaaaaaaaaaaaaaaaaaaaaapppp',
    'a~aaaaaaaaaaaaaaaaaaaaaaaaaapppp',
    'a~~aaaaaaaaaaaaaaaaaaaaaaaaapppa',
    'aa~aaaaaaaaaaaaaaaaaaaaaaaaapppa',
    'aa~~aaaaaaaaaaaaaaaaaaaaaaaapppp',
    'aaa~aaaaaaaaaaaaaaaaaaaaaaaapppp',
    'aaa""aaaaaaaaaaaaaaaaaaaaaaapppp',
    'aaa~~aaaaaaaaaaaaaaaaaaaaaaapppp',
    'aaaa~~aaaaaaaaaaaaaaaaaaaaaapppp',
  ],
  features: [
    // The Stair's foot, the step (§5), and the cairn beside it; the camp on the sand under the Sheer.
    { kind: 'event', x: 26, y: 20, id: 'h10_foot', once: true, text: 'The last flight ends in black sand. Behind, the Sheer goes up out of sight; ahead, a mountain smokes over everything.' },
    { kind: 'cairn', x: 27, y: 21, id: 'h10_cairn', text: 'A cairn at the Stair\'s foot, every stone in it black. Whoever comes down adds one.', gold: 250, items: ['potion_sp_great'] },
    { kind: 'camp', x: 27, y: 17, name: 'Under the Sheer', text: 'A ring of stones on the sand, out of the wind under the Sheer. The ash in it is still warm.' },
    // Under the Sheer: its face, the pines at its foot and what has come down the Stair the short way.
    { kind: 'event', x: 28, y: 9, id: 'h10_face', once: true, text: 'Water runs down the Sheer in threads and smokes where it lands. The pines under it are grey to the tips.' },
    { kind: 'event', x: 26, y: 3, id: 'h10_goat', once: true, text: 'A goat stands on the Sheer\'s face on nothing at all, and watches you go by.' },
    { kind: 'event', x: 29, y: 27, id: 'h10_fallen', once: true, text: 'In the pines under the Sheer, things fallen from the Stair: a cart\'s wheel, a boot, a harp.' },
    // The black sand north to the dune over the Sound, and the shore's driftwood.
    { kind: 'event', x: 22, y: 11, id: 'h10_dune', once: true, text: 'The black sand drifts into dunes against the Sheer, ribbed by the wind and warm on top.' },
    { kind: 'event', x: 20, y: 1, id: 'h10_lookout', once: true, text: 'From the dune\'s crest the Sound runs grey to the sky, and north-east lies the spur of Sheer Point.' },
    { kind: 'event', x: 12, y: 1, id: 'h10_driftwood', once: true, text: 'Driftwood along the top of the beach, bleached white, and black where it has been burned.' },
    // The vines of the shore, west toward Cinderport.
    { kind: 'event', x: 3, y: 1, id: 'h10_shore', once: true, text: 'The vines come down to the water\'s edge. The Sound laps at them, and they do not move.' },
    { kind: 'event', x: 4, y: 7, id: 'h10_deer', once: true, text: 'A deer hangs in the vines well off the ground, wound round to the neck.' },
    { kind: 'event', x: 11, y: 12, id: 'h10_milestone', once: true, text: 'A milestone where the track leaves the sand: CINDERPORT 5. The letters are full of ash.' },
    // Scaldwell: the pools in the ash, the bathhouse and its keeper, the Riders' shrine; past them the
    // rock where the water comes up, the stoker at it and the path trodden to it.
    { kind: 'event', x: 15, y: 20, id: 'h10_steam', once: true, text: 'Steam stands over the ash to the west, and the air smells of eggs.' },
    { kind: 'event', x: 3, y: 13, id: 'h10_planks', once: true, text: 'Planks stacked against the bathhouse\'s back wall, grey with ash, and a tub with its bottom out.' },
    { kind: 'event', x: 8, y: 14, id: 'h10_pools', once: true, text: 'Pools in the black ash, ringed with stones and steaming. The water is as hot as a bath, and no hotter.' },
    { kind: 'npc', x: 7, y: 13, name: 'The bathhouse keeper', lines: [
      'A Rider keeps the bathhouse, her sleeves rolled to the shoulder and her arms red from the water.',
      '"The springs went cold the day the Anvil Stone was cut, and came warm again when it was mended."',
      '"Things come up in the water. A grey part, a bead of glass, a bone."',
      '"The thing at the rock was shovelling before my mother kept this house. Some days it is not there."',
    ] },
    { kind: 'shrine', x: 11, y: 15, id: 'h10_shrine', text: 'A shrine of the Riders\' by the pools: a mare\'s tail hung from a stake, plaited with red thread.', stat: 'endurance', done: 'The Riders\' shrine, the tail\'s plait come loose.' },
    { kind: 'event', x: 14, y: 15, id: 'h10_shovel', once: true, text: 'Past the pools, by the rock, a thing like a boiler on legs is shovelling. There is nothing on its shovel.' },
    { kind: 'event', x: 8, y: 17, id: 'h10_trodden', once: true, text: 'A path is trodden flat in the ash up to the rock, and ends at it.' },
    { kind: 'event', x: 8, y: 19, id: 'h10_vent', once: true, text: 'The water comes up out of the dark here, too hot to touch. Along its lip, coin of every age, and a bone.' },
    { kind: 'chest', x: 8, y: 20, id: 'h10_vent_hoard', gold: 750, items: ['plate+2'] },
    // The ash south to H11: the stream, warm out of the south, and what lies on the sand.
    { kind: 'event', x: 2, y: 24, id: 'h10_stream', once: true, text: 'The stream runs warm out of the south toward the town. Its stones are furred white.' },
    { kind: 'event', x: 1, y: 29, id: 'h10_heron', once: true, text: 'A heron stands in the warm stream on one leg, grey with ash. It does not move as you pass.' },
    { kind: 'event', x: 15, y: 25, id: 'h10_crust', once: true, text: 'The ash has a crust here that breaks underfoot. Under it, it is warm.' },
    { kind: 'event', x: 8, y: 28, id: 'h10_glass', once: true, text: 'Black glass in the ash in a ring a pace across, as smooth as ice.' },
    { kind: 'event', x: 22, y: 29, id: 'h10_bones', once: true, text: 'The bones of a horse, picked clean and grey with ash. It still has its shoes on.' },
  ],
  secrets: [{ x: 8, y: 18, hint: 'h10_trodden' }],
  encounters: [
    // Cinder beetles on the sand: three just past the Stair's foot, the area's gentlest, and four on the
    // black sand north toward the dune; strangler vines in the first trees of the shore, which never
    // roam; and at Scaldwell's rock the stoker, the first heavy machine, at its shovelling, the box's
    // group at 25.
    { id: 'h10_beetles_foot', x: 21, y: 23, monsters: ['cinder_beetle', 'cinder_beetle', 'cinder_beetle'], aware: 3, respawn: 1440 },
    { id: 'h10_beetles_dune', x: 21, y: 6, monsters: ['cinder_beetle', 'cinder_beetle', 'cinder_beetle', 'cinder_beetle'], aware: 3, respawn: 1440 },
    { id: 'h10_vines', x: 14, y: 10, monsters: ['strangler_vine', 'strangler_vine', 'strangler_vine', 'strangler_vine'], aware: 2, respawn: 1440, roams: false },
    { id: 'h10_stoker', x: 6, y: 17, monsters: ['stoker'], aware: 3, respawn: 2880, roams: false },
  ],
};
