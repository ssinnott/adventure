// The Kilns, box O6: Feuerstollen's box, the ash country under the vent ridge. Country, band 17-18:
// grass and bare hills in from N6 and O5 to the ash, and across the ash the ridge of black rock that
// runs north to south blowing hot at its vents; the hermit in a dead vent at its north end, the
// dwarves' adit cut into its foot under their words for the mountain's breath, and the cold vent at
// its south end; the moor's first heather in the south-west, the crag's foot across the north and the
// Stone's strays under it. The adit at 22,20 is the way down into Feuerstollen's tubes (ADIT).
// Cut from the atlas by tools/scaffold.ts; docs/areas/kilns.md §4.11 is its brief.
import type { Exit, MapDef } from '../../../../game/map.ts';
import { EAST, NORTH } from '../../../../game/types.ts';

/**
 * The way down into Feuerstollen (#466): the adit cut into the ridge's foot at 22,20, under the
 * dwarves' words, onto the tubes' first level at 7,14, facing north; the adit's way back up lands on
 * 21,20, facing west, out under the words.
 */
export const ADIT: Exit = { x: 22, y: 20, to: 'lava_tubes', tx: 7, ty: 14, tf: NORTH,
  label: 'You go in under the words and down the adit, the daylight going grey behind you and the air hot ahead.' };

export const KILNSHEART_O6: MapDef = {
  id: 'kilnsheart_o6',
  name: 'The Kilns',
  kind: 'outdoor',
  density: 'country',
  band: [17, 18],
  region: 'kilns',
  start: { x: 0, y: 18, facing: EAST },
  rows: [
    ',,,,,^^^^^^^^rrrrrrrrrrrrrrrrrrr',
    ',,,,,^^^^^^^^^rrrrrrrrrrrrrrrrrr',
    ',,,,,^^^^^^^^^^rrrrrrrrrrrrr^^^^',
    ',,,,,,^^^^^^^^^^rrrrrrrrrr^^^^^^',
    ',,,,,,^^^^^^^^^^^^^^^^^^^^aaaaaa',
    ',,,,,,^^^^^^^^^^^^^^^^^^^^aaaaaa',
    ',,,,,,,^^^^^^^^^^^^^^aaaaaaaaaaa',
    ',,,,,,,^^^^^^^^^^^^aaaaaaaaaaaaa',
    ',,,,,,,,^^^^^^^^^aaaaaaaaaaaaaaa',
    ',,,,,,,,^^^^^^^^aaaaaaaaaaaaaaaa',
    ',,,,^^,,,^^^^^^aaaaaaaaaaaaaaaaa',
    ',^,,^^,,,^^^^^^aaaaaarraaaaaaaaa',
    ',^^^^^^^,^^^^^^aaaaaa"rraaaaaaaa',
    ',^^^^^^^,^^^^^^aaaaaaa!rraaaaaaa',
    ',^^^^^^,,,^^^^^aaaaaaaaarraaaaaa',
    ',^^^^^^,,,^^^^^aaaaaaaaaarraaaaa',
    ',,^^^^,,,^^^^^^aaaaaaaaaa!rraaaa',
    ',,^^,,,,,,^^^^^aaaaaaaaaaaaaaaaa',
    ',,,,,,,,,,^^^^^^aaaaaaaaa!rraaaa',
    ',,,,,,,,,,^^^^^^aaaaaarrrrraaaaa',
    ',,,,,,,,,,,^^^^^aaaaaa"rrraaaaaa',
    ',,,,,,,,,,^^^^^^^aaaaarrrraaaaaa',
    'hh,,,,,,,,,^^^^^^^aaaaa!rraaaaaa',
    'hhh,,,,,,,,,,^^^^^aaaaaaaaaaaaaa',
    'hhhh,,,,,,,,,,,^,^,,aaaarrrrraaa',
    'hhhhh,,,,,,,,,,,,,,aaaaa"S""raaa',
    'hhhhh^^,,,,,,,,,,,,,aaaarrrrraaa',
    'hhhh^^^^,,,,,,,,,,,,aaaaaaaaaaaa',
    'hhhh^^^^^,,,,,,,,,,,,aaaaaaaaaaa',
    'hhh,^^^^^^,,,,,,,,,,,,,,,^^^^^^^',
    '^^^^^^^^^^,,,,,,,,,,,,,,^^^^^^^M',
    '^^^^^^^^^^,,,,,,,,,,,,,,^^^^^^^M',
  ],
  exits: [ADIT],
  features: [
    // In over the grass from N6: the ash begins, and the ridge across it.
    { kind: 'event', x: 15, y: 14, id: 'o6_ash', once: true, text: 'The grass gives out into ash, grey and deep, and every step sinks to the ankle. Across it a ridge of black rock smokes.' },
    // The hill at the ash's edge: the ridge seen by day, and its vents by night.
    { kind: 'event', x: 12, y: 18, id: 'o6_lookout', once: true, when: { hours: 'day' }, text: 'From the hill the ridge runs north to south across the ash, smoking at its vents, and the air over it shakes.' },
    { kind: 'event', x: 12, y: 18, id: 'o6_lookout_night', once: true, when: { hours: 'night' }, text: 'By night the vents glow down the length of the ridge, a line of red that brightens and dims all together.' },
    // The camp at the ash's edge.
    { kind: 'camp', x: 15, y: 20, name: 'The camp at the ash\'s edge', text: 'A camp where the grass meets the ash: hearthstones in a ring and a windbreak of turf, grey with grit.' },
    // The hermit in a dead vent at the ridge's north end, who counts the vents by their breath.
    { kind: 'npc', x: 21, y: 12, name: 'Einhart, a hermit', lines: [
      'An old dwarf in a dead vent at the ridge\'s north end, a blanket hung across its back. He is counting under his breath.',
      '"I count them by their breath. They breathe together and rest together, the same count every day."',
      '"Twenty years I have counted. A mountain should not keep time."',
    ] },
    // The vents along the ridge, each with ash on its lip.
    { kind: 'event', x: 22, y: 13, id: 'o6_vent1', once: true, text: 'A vent in the ridge\'s face, the rock round it glazed black. Hot breath comes out of it, and ash lies thick on its lip.' },
    { kind: 'event', x: 25, y: 16, id: 'o6_vent2', once: true, text: 'A wider vent. The fire shows red down in the rock, and ash lies on its lip under the shaking air.' },
    { kind: 'event', x: 25, y: 18, id: 'o6_vent3', once: true, text: 'A vent under the saddle, breathing slow and hot. Ash has drifted on its lip like snow on a sill.' },
    { kind: 'event', x: 23, y: 22, id: 'o6_vent4', once: true, text: 'A vent below the adit, its breath sour with sulphur. Ash lies on its lip, and now on your boots.' },
    // The adit cut into the ridge's foot, and the dwarves' words for the mountain's breath over it:
    // the way down into the tubes (ADIT). Read, the words mark the tubes on the world map, and the
    // machine's other mouths: the ice-hole by Rime Lodge, the bay under Coldmere and Fire Mountain's vents.
    { kind: 'event', x: 20, y: 20, id: 'o6_adit', once: true, text: 'An adit cut square into the ridge\'s foot, its timbers charred black. Heat comes up out of it, and a smell of hot stone.' },
    { kind: 'sign', x: 21, y: 20, id: 'o6_mouth', text: 'The dwarves\' words for the mountain\'s breath, cut over the adit.', read: 'VENT. STAND CLEAR.', marks: ['lava_tubes', 'rime_lodge', 'sleepers_bay', 'meridian_camp'] },
    // The secret: one vent among the hot ones blows cold, and in it the first dwarves' shelter.
    { kind: 'event', x: 24, y: 25, id: 'o6_cold', once: true, text: 'A vent at the ridge\'s south end, its lip bare of ash. The air at its mouth goes in, not out, and it is cool.' },
    { kind: 'event', x: 26, y: 25, id: 'o6_shelter', once: true, text: 'Bunks cut in the rock, a hearth of three stones with names scratched over it in the old script, and a bow left on pegs.' },
    { kind: 'chest', x: 27, y: 25, id: 'o6_shelter_chest', gold: 450, items: ['steel_bow+1'] },
    // The Stone's strays: burnt footprints down off the crag to where the slag elder stands.
    { kind: 'event', x: 24, y: 6, id: 'o6_burnt', once: true, text: 'Footprints burnt into the ash come down off the crag from the north, each one glazed black, all one way.' },
    // The cairn on the west hills, and a warm spring in the grass under the crag.
    { kind: 'cairn', x: 5, y: 13, id: 'o6_cairn', text: 'A cairn on the hill, its stones grey with ash and warm on the side that faces the ridge.', gold: 250, items: ['potion_sp_great'] },
    { kind: 'well', x: 3, y: 5, text: 'A spring comes up warm under a slab in the grass, and tastes of iron.' },
    // The moor's first heather in the south-west.
    { kind: 'event', x: 3, y: 25, id: 'o6_heather', once: true, text: 'The heather comes up out of the south here, and the wind off the moor carries no ash.' },
  ],
  secrets: [{ x: 25, y: 25, hint: 'o6_cold' }],
  encounters: [
    // Salamanders on the ash, north and south; fire beetles at the ridge's foot; and under the crag a
    // slag elder strayed from the Stone, until its tear is closed, the box's group at 18.
    { id: 'o6_salamanders_n', x: 18, y: 9, monsters: ['salamander', 'salamander', 'salamander', 'salamander'], aware: 3, respawn: 1440 },
    { id: 'o6_beetles', x: 22, y: 16, monsters: ['fire_beetle', 'fire_beetle', 'fire_beetle', 'fire_beetle'], aware: 3, respawn: 1440 },
    { id: 'o6_salamanders_s', x: 21, y: 26, monsters: ['salamander', 'salamander', 'salamander', 'salamander'], aware: 3, respawn: 1440 },
    { id: 'o6_elder', x: 28, y: 5, monsters: ['slag_elder'], aware: 3, respawn: 2880, roams: false, until: { flag: 'q_anvil_closed' } },
  ],
};
