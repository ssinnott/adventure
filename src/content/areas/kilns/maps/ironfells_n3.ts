// The Kilns, box N3: Anvilhall's box. Core, band 16-17: the trail out of M3 across the box's
// south-west corner and on south for N4, and the spur off it north-east to Anvilhall's gate in the
// crag, past the dwarves' outer workings and their spoil and up the stair beside their terraces, with
// the tithe-house at the terraces' foot. A burying ground of iron markers on the grass, a cairn on the
// bare fell under the crag, and a collapsed working in the rock at the south-east corner.
// The gate at 28,8 is the way into Anvilhall (#459, GATE).
// Cut from the atlas by tools/scaffold.ts; docs/areas/kilns.md §4.3 is its brief.
import type { Exit, MapDef } from '../../../../game/map.ts';
import { EAST, NORTH } from '../../../../game/types.ts';

/**
 * The gate into Anvilhall (#459): a door on the gate's square in the crag's dressed front, into the
 * town's start inside its own gate, saying the town's gate line (docs/areas/kilns.md §4.4) as the
 * company goes in; the town's way back lands on 28,9, facing south.
 */
export const GATE: Exit = { x: 28, y: 8, to: 'anvilhall', tx: 7, ty: 14, tf: NORTH,
  label: 'A door in the hill, iron-bound, and the hammering behind it. Over the lintel, words cut deep and painted red.' };

export const IRONFELLS_N3: MapDef = {
  id: 'ironfells_n3',
  name: 'The Iron Fells',
  kind: 'outdoor',
  density: 'core',
  band: [16, 17],
  region: 'kilns',
  start: { x: 0, y: 27, facing: EAST },
  rows: [
    ',,,,,,,,,,,,,^MMMMMMMMMMMMMMMMMM',
    ',,,,,,,,,,,,,,,MMMMMMMMMMMMMMMMM',
    ',,,,,,,,,,,,,,,MMMMMMMMMMMMMMMMM',
    ',,,,,,,,,,,,",,,MMMMMMMMMMMMMMMM',
    ',,,,,,,,,,,,,,,,MMMMMMMMMMMMMMMM',
    ',,,,,,,,,,,,,,,,^MMMMMMMMMMMMMMM',
    ',,,,,,,,,,,,,,,^^^MMM:MMMMMMMMMM',
    ',,,,,,,,,,,,,,,^^^^MM:MMMMMMMMMM',
    ',,,,,,,,,,,,,,,^,^^^M:MMMMM#D#MM',
    ',,,,,,,,,,,,,,,,,^^"":"======:::',
    ',,,,,,,,,,,,,,,,,,""":"=fffffff:',
    ',,,,,,,,,,,,,,,,,,""""^=#######:',
    ',,,,:,:,,,,,""",,,^""^^=fff::fff',
    ',,,,,,,,,,,,""",,,^^^^^=ffffffff',
    ',,,,:,:,,,,,,,,,,,^^^^^=#######:',
    ',,,,,,,,,^^^,,,,,,,,,^^=ffffffff',
    ',,,,,^^^^^^^,,,,,,,,,^^=ffffffff',
    ',,,,,^^^^^r^^,,,,,^^^^^=########',
    ',,,,,^^^^r:r^,,,,^^^,^^=ffff#""#',
    ',,,,^^^^^r:r,,,,,,,,,^^=ffff#""#',
    ',,,^^^^^^^^^,,,,,,,,,^^=#####S##',
    ',,,^^^^^^""",,^^^,,=====::::::::',
    ',,,,^^^,"""""^^^====,,^^^BBB::::',
    ',,,,,,,,,""",====,,,,,^^^BBB^^^^',
    ',,,,,,,,,,====^^^^,,,,^^^^^^^^^^',
    ',,,,,,,====,,^^^^^^^^,,^^^^^^^^^',
    ',,,,====,,,,,,,^^^^^^^,^^^^^^^^^',
    '=====,,,,,,,,,,,^^^^^,,,^^^^^^^^',
    '==,,,,,,,,,,,,,,,^^^,,,,^rr:rr^^',
    ',==,,,,,,,,,,,,,^^^^^^,,rrr:rrr^',
    ',,===,,,,,,,,,,,^,,^^^,,rrr:rrrr',
    ',,,,==,,,,,,,,,,,,,,,,,,rrrrrrrr',
  ],
  exits: [GATE],
  features: [
    // Where the spur leaves the trail, the hammering heard; along it, the camp in the knoll's lee.
    { kind: 'event', x: 2, y: 27, id: 'n3_hammering', once: true, text: 'The spur leaves the trail for the north-east, and the hammering comes down it. It comes out of the hill.' },
    { kind: 'camp', x: 16, y: 27, name: 'The carters\' camp', text: 'A camp in the lee of the knoll below the road: a fire ring, a stone trough and the grass grazed short by ponies.' },
    // The bare fell under the crag: the cairn, the hall's air coming up through the turf, the dwarves'
    // burying ground and their first bloomery.
    { kind: 'cairn', x: 4, y: 5, id: 'n3_cairn', text: 'A cairn on the bare fell under the crag, a pick-head rusted fast to its top stone.', gold: 250, items: ['potion_sp_great'] },
    { kind: 'event', x: 12, y: 3, id: 'n3_air', once: true, text: 'An iron grating set in the turf, and warm air coming up through it. It smells of coal smoke and hot iron.' },
    { kind: 'event', x: 5, y: 13, id: 'n3_burying_ground', once: true, text: 'Iron markers in rows in the grass, a burying ground. Each is lettered in the old script, rust in the cuts.' },
    { kind: 'event', x: 13, y: 13, id: 'n3_bloomery', once: true, text: 'A bloomery on the fell, a squat clay furnace long cold, its slag in heaps about it. Grass grows in the mouth.' },
    // The outer workings: an adit in the west hills and a working in the crag, their spoil warm.
    { kind: 'event', x: 10, y: 20, id: 'n3_adit', once: true, text: 'An old adit in the hillside, its spoil fanned out below it to the road. The spoil is warm to the hand.' },
    { kind: 'event', x: 21, y: 8, id: 'n3_working', once: true, text: 'An old working in the crag, timbered and open, rails running out of it onto the spoil. The air that comes out is warm.' },
    // The lookout from the top terrace. The gate's own words are its label, said going in (GATE).
    { kind: 'event', x: 31, y: 10, id: 'n3_lookout', once: true, when: { hours: 'day' }, text: 'South-east from the top terrace, the heart: the smelter\'s smoke going up, and past it the ash, grey to the skyline.' },
    { kind: 'event', x: 31, y: 10, id: 'n3_lookout_night', once: true, when: { hours: 'night' }, text: 'South-east the heart lies dark but for the smelter\'s fires, and far past them a line of red along the ground.' },
    // The terrace well, and the mother at it (#56's 33).
    { kind: 'well', x: 28, y: 12, text: 'The terrace well, a windlass over a shaft lined with dressed stone. The water tastes of iron.' },
    { kind: 'npc', x: 27, y: 12, name: 'A dwarf woman at the well', lines: [
      'A dwarf woman at the terrace well, a crust in a cloth on the coping by her bucket.',
      '"My son carries the crust down for the knockers. He went down with it at the new moon, and he will not come up."',
      '"He sends up that he is well. He sends it up with the empty cloth."',
    ] },
    // The terraces' foot: the tithe-house, the ruts to the wall and the hearth-niche over it; under
    // the lowest terrace, the tithe-cellar.
    { kind: 'event', x: 24, y: 22, id: 'n3_tithe_house', once: true, text: 'The tithe-house at the terraces\' foot, squat and barred, sacks of barley stacked against its wall. Nobody guards the barley.' },
    { kind: 'event', x: 28, y: 21, id: 'n3_ruts', once: true, text: 'Cart ruts run along the wall\'s foot and end against it, where no door is. The grass here is worn in a turning circle.' },
    { kind: 'shrine', x: 29, y: 21, id: 'n3_shrine', text: 'A hearth-niche let into the terrace wall, its coals banked and warm. Bread is left on its lip.', stat: 'endurance', done: 'The hearth-niche, its coals banked.' },
    { kind: 'sign', x: 29, y: 21, id: 'n3_niche', text: 'Cut over the terrace wall, the dwarves\' words for plenty.', read: 'STORE.' },
    { kind: 'event', x: 29, y: 19, id: 'n3_cellar', once: true, text: 'Crates in straw stencilled for the Compact, a grey stone in each. On the wall a tally in chalk: months down, buyers across.' },
    { kind: 'chest', x: 30, y: 18, id: 'n3_cellar_chest', gold: 700, items: ['anvil_shard', 'plate+3'] },
    // The collapsed working in the rock at the south-east corner.
    { kind: 'event', x: 27, y: 27, id: 'n3_fall', once: true, text: 'An old working cut into the rock, its props down and the roof in at the back. Something has bored out through the fall.' },
  ],
  secrets: [{ x: 29, y: 20, hint: 'n3_ruts' }],
  encounters: [
    // Slaglings on the trail's far end by night, strays from the Stone until its tear is closed; fire
    // beetles and salamanders on the two heaps of spoil, beetles most on the low one by the road and
    // salamanders on the high one under the crag's warm working; and a rock worm in the collapsed
    // working, the box's group at 17.
    { id: 'n3_slaglings', x: 4, y: 30, monsters: ['slagling', 'slagling', 'slagling'], aware: 4, respawn: 1440, when: { hours: 'night' }, until: { flag: 'q_anvil_closed' } },
    { id: 'n3_spoil_low', x: 10, y: 22, monsters: ['fire_beetle', 'fire_beetle', 'fire_beetle', 'salamander'], aware: 4, respawn: 1440 },
    { id: 'n3_spoil_high', x: 20, y: 11, monsters: ['salamander', 'salamander', 'salamander', 'fire_beetle'], aware: 3, respawn: 1440, roams: false },
    { id: 'n3_worm', x: 27, y: 29, monsters: ['rock_worm'], aware: 2, respawn: 2880, roams: false },
  ],
};
