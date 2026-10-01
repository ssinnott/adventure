// Sunderwood, box K3: the Sunder's mouth. Core, band 15-16: the gorge on south from Sunderfall, dead
// wood along both lips and the glass grown thick to the east; the ledges cut into the east face, a
// square wide, the way down, with the door on the first landing; the gleaners quarrying the Rift on
// them with their hounds; the river's old bed on the east lip, from before the Sunder took the river;
// and a black-glass Rift in the crystal at the box's south end, open whatever the company does.
// Cut from the atlas by tools/scaffold.ts; docs/areas/sunderwood.md §4.5 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH, WEST } from '../../../../game/types.ts';
import { rift } from '../../../rifts/index.ts';

/**
 * The black-glass Rift in the crystal (#165): sunderlings nearer the way in and glass spiders by the
 * tear. It has no until and no warden: the Sunder's Stone is long gone, so its groups come back and
 * its tear never goes quiet, whatever the company does.
 */
export const K3_RIFT = rift({
  id: 'k3_rift', template: 'spiral', material: 'glass', seed: 2, band: [14, 15], region: 'sunderwood',
  out: { to: 'eaves_k3', tx: 15, ty: 26, tf: WEST },
  table: { groups: [['sunderling', 'sunderling', 'sunderling', 'sunderling'], ['glass_spider', 'glass_spider', 'glass_spider', 'glass_spider']] },
  hoard: { gold: 150, items: ['potion_heal'] },
});

export const EAVES_K3: MapDef = {
  id: 'eaves_k3',
  name: 'The Sunder\'s Mouth',
  kind: 'outdoor',
  density: 'core',
  band: [15, 16],
  region: 'sunderwood',
  start: { x: 13, y: 0, facing: SOUTH },
  rows: [
    'MdddvvvvvrrrddTTTTTTTTTTTTTTTTTM',
    'Mdddvvvvvvvv"ddddddTTTTTTTTTTTTM',
    'Mdddvvvvvvvv"rdddddTTTTTTTTTTTTM',
    'Mdddvvvvvvvv"rdddddTTTTTTTTTTTTM',
    'Mdddvvvvvvvv"rdddddTTTTTTTTTTTTM',
    'Mdddvvvvv""""rdddddTTTTTTTTTTTTM',
    'Mdddvvvvv"rrrrdddddTTTTTTTTTTTTM',
    'Mdddvvvvv"rrrrdddddTTTTTTTTTTTTM',
    'Mdddvvvvv""rrrdddddTTTTTTTTTTTTM',
    'Mdddvvvvv"rrrrdddddTTTTTTTTTTTTM',
    'Mdddvvvvv"rrrrdddddTTTTTTTTTTTTM',
    'Mdddvvvvv"""rrdddddTTTTTTTTTTTTM',
    'Mdddvvvvvv""rrdddddTTTTTTTTTTTTM',
    'MddddddvvvvvvddddddTTTTTTTTTTTTM',
    'MddddddddvvvvddddrrrrTTTTTTTTTTM',
    'Mddddddddvvvv:::S:::rTTTTTTTTTTM',
    'MddddddddvvvvddddrrrrTTTTTTTTTTM',
    'MTddddddddvvvddddddddTTTTTTTTTTM',
    'MTddddddddvvvdddddddddTTTTTTTTTM',
    'MdddddddddvvddddcdddddTTTTTTTTTM',
    'MdddddddddvvdddcccddddTTTTTTTTTM',
    'MddddddddvvvdddcccdddddTTTTTTTTM',
    'MddddcdddvvvdddcccdddddTTTTTTTTM',
    'MdddccdddvvdddcccccddddTTTTTTTTM',
    'MdddcdddvvvdddcccccddddTTTTTTTTM',
    'MdddcdddvvvdddcdddccddTTdTTTTTTM',
    'MdddcdddvvddddddddccdddddTTTTTTM',
    'MdddddddvvdddccdddccdddddTTTTTTM',
    'MddddddvvvdddccccccccddddTTTTTTM',
    'MddddddvvvdddccccccccdddddTTTTTM',
    'MddddddvvvdddccccccccdddddTTTTTM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
  ],
  exits: [
    { x: 10, y: 8, to: 'the_sunder', tx: 28, ty: 2, tf: SOUTH, label: 'In out of the rain, into the rock.' },
  ],
  features: [
    // The ledges' head on the east lip: the step. The door at 10,8 in the face is the Sunder's way in (#199).
    { kind: 'event', x: 12, y: 1, id: 'k3_ledges', once: true, text: 'Ledges cut into the gorge\'s face, a square wide, switchbacking down into rain. On the first landing, a way cut into the rock, chip marks all round it, and inside a stair going down.' },
    // The east lip: the camp back from it, and the glass to the south.
    { kind: 'camp', x: 18, y: 3, name: 'The last pines', text: 'A ring of stones where the pines give out and the dead wood begins, the last sound trunks at your back. The rain that falls here lands.' },
    { kind: 'event', x: 16, y: 17, id: 'k3_glass', once: true, text: 'South the dead trunks go to glass, and in the glass a white light, low and steady, not the sun\'s. Each trunk is lit through, and casts its shadow at you.' },
    // The lower landing, where the ledges stop: the gleaners' camp.
    { kind: 'event', x: 11, y: 12, id: 'k3_camp', once: true, text: 'The ledges stop in rain. Under a hide pegged to the rock a sack lights the wet through its cloth, and beside it a knife, laid out for whoever comes next.' },
    { kind: 'chest', x: 11, y: 12, id: 'k3_camp_chest', gold: 120, items: ['wardens_dirk+1'] },
    // The Rift in the crystal's clearing.
    K3_RIFT.way(16, 26),
    // The west lip: the lookout across to the ledges, a rope at the edge, the Lanterns' shrine and the cairn.
    { kind: 'event', x: 2, y: 6, id: 'k3_lookout', once: true, text: 'Across the gorge the far face is cut in ledges, down and back and down into rain. On a landing, a dark opening cut in the rock, the chipping round it white from here.' },
    { kind: 'event', x: 8, y: 15, id: 'k3_rope', once: true, text: 'A rope tied round a dead trunk at the lip, the knot hard with rain. Its end hangs a span over the edge, cut clean.' },
    { kind: 'shrine', x: 7, y: 23, id: 'k3_shrine', text: 'A Lantern shrine at the lip\'s end, its face to the gorge, a lamp set in it to see far by. The lamp is cold and the oil gone thick. The lens is still clear.', stat: 'accuracy', done: 'The lamp on the Lanterns\' shrine, cold, and the lens still clear.' },
    { kind: 'cairn', x: 3, y: 28, id: 'k3_cairn', text: 'A cairn in the dead wood back from the lip, built by somebody who built walls, every joint crossed. A lamp is cut in the top stone, and needles lie in the cut.', gold: 170, items: ['potion_sp_great'] },
    // The secret: the river's old bed, cut off at the gorge, and the stack across its mouth.
    { kind: 'event', x: 13, y: 15, id: 'k3_stones', once: true, text: 'Round stones underfoot, the river\'s kind, in a gully on dry ground. East it runs off under the pines; west it ends in air at the gorge\'s lip.' },
    { kind: 'event', x: 15, y: 15, id: 'k3_stack', once: true, text: 'Dead wood stacked across the old river bed, cut ends outward. Nobody stacks firewood on a riverbed.' },
    { kind: 'event', x: 17, y: 15, id: 'k3_bed', once: true, text: 'Behind the stack the old bed runs on, its floor chipped down to black glass. A shard the size of a fist is still in the rock, half cut free.' },
    { kind: 'chest', x: 18, y: 15, id: 'k3_bed_chest', gold: 200, items: ['sunder_shard'] },
  ],
  secrets: [{ x: 16, y: 15, hint: 'k3_stack' }],
  encounters: [
    // On the first landing at the door, the gleaners and their hounds, chipping at it, on a ledge a
    // square wide, between the company and their camp below; and in the dead wood east of the crystal
    // at the far south end, the glass bears.
    { id: 'k3_door', x: 9, y: 8, monsters: ['ashen_gleaner', 'ashen_gleaner', 'sunder_hound', 'sunder_hound'], aware: 3, respawn: 2880, roams: false },
    { id: 'k3_bears', x: 23, y: 29, monsters: ['glass_bear', 'glass_bear'], aware: 5, respawn: 2880, roams: false },
  ],
};
