// The Kilns, box N5: Gluthutte, the smelter in the charcoal woods. Core, band 17: the drove road on
// south from N4 through the woods, over the stream at a ford and out for N6; the smelter at the woods'
// north edge with its yard, its slag heap and the verse over its mouth; the charcoal burners' camp and
// their clamps in the woods; the stream the smelter draws on, down from the north-east corner to the
// west edge; the mountain along the east; and the cutters' track off the road east for the Stone.
// Cut from the atlas by tools/scaffold.ts; docs/areas/kilns.md §4.8 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const KILNSHEART_N5: MapDef = {
  id: 'kilnsheart_n5',
  name: 'The Kilns',
  kind: 'outdoor',
  density: 'core',
  band: [17, 17],
  region: 'kilns',
  start: { x: 20, y: 0, facing: SOUTH },
  rows: [
    ':::""""""::,,,,,,,,,=,^^^^^^^^~~',
    ':::"rrrr":::BB:::tt,=^^^^^^^^~~^',
    ':::"r::r":::BB:::ttt=t^^^^^^~~^,',
    ':::"r::r":::::=======tt^^^~~~^^^',
    ':::"#S##":t:::ttttt==ttt^~~~^^^^',
    ':::::::::tttttttttt=ttttt~~^^^^^',
    ':::::::fftttttttttt=tttt~~^^^^^M',
    'ffffffffftttttttttt=ttt~~^^^^^MM',
    'ffffffffttttttttttt=tt~~~^^^MMMM',
    'ffffffttttttttttttt=t~~~^^^MMMMM',
    'fffffftttttttttttt==~~~^^^MMMMMM',
    'fffftttttttttttttt=~~~^^^MMMMMMM',
    'ffftttttttttttt~~~=~tt^^MMMMMMMM',
    'ffttttttttttt~~~~t=tt^^MMMMMMMMM',
    'tttttttttttt~~~ttt=t^^^MMMMMMMMM',
    'ttttttttttt~~~ttt==^^^MMMMMMMMMM',
    'ttttttttttt~~tttt=^^^MMMMMMMMMMM',
    'tttttttttt~~ttttt=^^MMMMMMMMMMM^',
    'tttttttttt~~ttttt=^^MMMMMMMMMM^^',
    'ttttttttt~~ttttt^=^MMMMMMMMM^^^^',
    'tttttttt~~~ttttt=^^MMMMMMMM^^^^,',
    'ttttttt~~~tttttt=^^MMMMMM^^^^^,,',
    'ttttt~~~~ttttttt=^^^MMMM^^^^^,,,',
    'tt~~~~~~tttttttt=^^^^^^^^^^t,,,,',
    't~~~~tttttttttt=::::::::::::::::',
    '~~ttttttttttttt=ttt^^^^^^ttt,,,,',
    '~ttttttttttttt==ttttttttttt,,,,,',
    'tttttttttttttt=tttttttttttt,,,,,',
    ',ttttttttttttt=ttttttttttt,,,,,,',
    ',,ttttttttttt==tttttttttt,,,,,,,',
    ',,tttttttttt==tttttttttt,,,,,,,,',
    '^,,ttttttttt=ttttttttt,,,,,,,,,,',
  ],
  features: [
    // The smelter: the spur off the road to its yard, the verse over its mouth, the master smith at
    // the anvil in its door with the crown (#56's 35) and the Compact's factor beside it.
    { kind: 'event', x: 14, y: 3, id: 'n5_smelter', once: true, text: 'Chimneys, and the heat from the door felt across the yard. Over the door, the verse again. Inside, somebody is making a crown.' },
    { kind: 'shrine', x: 11, y: 2, id: 'n5_shrine', text: 'The smelter\'s mouth, a furnace roaring behind it. A smith\'s tongs hang by the door on a nail driven into the verse.', stat: 'accuracy', done: 'The smelter\'s mouth, roaring.' },
    { kind: 'sign', x: 11, y: 2, id: 'n5_verse', text: 'Over the smelter\'s mouth, cut red as in the thane\'s hall: THE FIRE IS KEPT BELOW AND NOT ABOVE.', read: 'DANGER. KEEP FIRE BELOW THIS LINE.' },
    { kind: 'npc', x: 11, y: 1, name: 'Hartmut, the master smith', lines: [
      'A dwarf at the anvil in the smelter\'s door, a crown on its horn: gold beaten over iron, the old pattern.',
      '"A crown to order. The kings\' crowns were made at the hall. This one is made here, and paid for in stone."',
      '"Who for? Somebody on the coast with the price. We are smiths. We do not ask a purse its name."',
    ] },
    { kind: 'npc', x: 11, y: 3, name: 'Kerensa, the Compact\'s factor', lines: [
      'A woman in a salt-stained coat by the smelter door, a Compact knife at her belt and a strongbox at her feet.',
      '"The Salt Compact buys what the smiths make, and pays them in what they want."',
      '"Not coin. Coin is for people who mean to spend it."',
    ] },
    // The slag heap: its laid face, and behind it the shard store; the lookout from its top.
    { kind: 'event', x: 5, y: 5, id: 'n5_laid', once: true, text: 'The heap is tipped loose on every side but this one, which is laid in blocks, close-fitted and warm to the hand.' },
    { kind: 'event', x: 5, y: 3, id: 'n5_store', once: true, text: 'A store in the heap, warm as an oven. Boxes of grey stones the size of a fist, and a tally of weights for the Compact.' },
    { kind: 'chest', x: 6, y: 2, id: 'n5_store_chest', gold: 700, items: ['forge_shield+1'] },
    { kind: 'event', x: 3, y: 1, id: 'n5_lookout', once: true, when: { hours: 'day' }, text: 'From the heap\'s top the heart runs south under its smoke, and far to the south-east the ground goes grey with ash.' },
    { kind: 'event', x: 3, y: 1, id: 'n5_lookout_night', once: true, when: { hours: 'night' }, text: 'From the heap\'s top, far to the south-east, a line of red along the ground, breathing.' },
    // The fields west of the smelter, and the stream down from the north-east with the smelter's weir.
    { kind: 'event', x: 3, y: 10, id: 'n5_fields', once: true, text: 'Fields at the woods\' edge, the furrows black with charcoal dust and the hedges grey with it.' },
    { kind: 'event', x: 25, y: 2, id: 'n5_stream', once: true, text: 'The stream comes down off the fell out of the east, clear, over stones stained red with iron.' },
    { kind: 'event', x: 22, y: 7, id: 'n5_weir', once: true, text: 'A weir of slag blocks across the stream, and a leat taken off it under the road toward the smelter.' },
    { kind: 'event', x: 29, y: 6, id: 'n5_ore', once: true, text: 'Ore lies loose on the hillside under the mountain, rust-red, and the best of it has been picked over.' },
    { kind: 'event', x: 18, y: 12, id: 'n5_ford', once: true, text: 'The road fords the stream over flags laid in its bed, cart-wheel grooves worn deep in them.' },
    // The charcoal woods: the burners' camp and their clamps, a cairn, and the woods cut for fuel.
    { kind: 'camp', x: 8, y: 13, name: 'The charcoal burners\' camp', text: 'The charcoal burners\' camp: a hut of poles and turf in a clearing, and a clamp smoking at every edge of it.' },
    { kind: 'event', x: 14, y: 9, id: 'n5_clamp_burnt', once: true, text: 'A clamp by the road burnt out, its charcoal raked into baskets and the baskets gone.' },
    { kind: 'event', x: 5, y: 19, id: 'n5_clamp', once: true, text: 'A charcoal clamp, turf over stacked wood, smoking at its vents. A burner sleeps beside it with a rake across his knees.' },
    { kind: 'cairn', x: 4, y: 28, id: 'n5_cairn', text: 'A cairn in a coppice, built of old fire-bricks, glassy on the faces that met the fire.', gold: 250, items: ['potion_sp_great'] },
    { kind: 'event', x: 28, y: 28, id: 'n5_coppice', once: true, text: 'Hazel cut to the stool and grown again, the poles all one height: woods kept for the fires.' },
    { kind: 'event', x: 20, y: 29, id: 'n5_cart', once: true, text: 'A charcoal cart with a broken axle in the verge, its load spilt and trodden into the road.' },
    { kind: 'event', x: 10, y: 30, id: 'n5_woodward', once: true, text: 'A woodward\'s hut by the road, shut, a hatchet left standing in the block by its door.' },
    { kind: 'event', x: 29, y: 19, id: 'n5_old_slag', once: true, text: 'Slag tipped down the hillside long ago and gone to moss: an older smelter\'s, older than the one in the woods.' },
    // The cutters' track east for the Stone, and on it the first sign of what is out there.
    { kind: 'event', x: 17, y: 24, id: 'n5_track', once: true, text: 'A track leaves the road here for the east, its ruts grey with stone dust. A cutter\'s wedge lies in the verge.' },
    { kind: 'event', x: 23, y: 24, id: 'n5_footprints', once: true, text: 'Footprints along the track, each one burnt into the dirt and still warm, coming out of the east.' },
  ],
  secrets: [{ x: 5, y: 4, hint: 'n5_laid' }],
  encounters: [
    // Fire beetles at the forges, behind the smelter and at the yard's foot; salamanders on the slag
    // heap; and on the cutters' track east, a slag elder strayed from the Stone, until its tear is
    // closed, the box's group at 18.
    { id: 'n5_beetles_back', x: 15, y: 1, monsters: ['fire_beetle', 'fire_beetle', 'fire_beetle', 'fire_beetle'], aware: 3, respawn: 1440 },
    { id: 'n5_beetles_yard', x: 11, y: 6, monsters: ['fire_beetle', 'fire_beetle', 'fire_beetle'], aware: 3, respawn: 1440 },
    { id: 'n5_salamanders', x: 3, y: 3, monsters: ['salamander', 'salamander', 'salamander', 'fire_beetle'], aware: 3, respawn: 1440 },
    { id: 'n5_elder', x: 27, y: 24, monsters: ['slag_elder'], aware: 3, respawn: 2880, roams: false, until: { flag: 'q_anvil_closed' } },
  ],
};
