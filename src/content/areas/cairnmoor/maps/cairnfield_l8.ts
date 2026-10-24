// Cairnmoor, box L8: the Cairnfield's shore. Country, band 18-19, the second pull request of the bounds
// (#834): the strand west of M8's grass, a wedge of sand, grass and hills between the sea and M8's edge,
// widening south to the frozen foot of Loch Fada. The salmon-netters' hut on the strand, a wrack-gatherer
// raking the tideline, a well of sweet water in the grass above it, a cairn on the hills and, at the
// strand's end, the drowned cairn's mound, the gap in its face at 22,27 the way down into Carn Fada, the
// enclave (#845, docs/areas/cairnmoor.md §12.5). Four bog bodies come up with the tide at the strand's
// north end; a tor troll and a cairn wight keep the loch's foot in the south-west. The secret is the
// netters' noost cut into the bank, found from the tar.
// The sea closes the north and the west, but for the lip of ice at 0,31 that L9's ice runs up into,
// which a bar of ice on row 30 joins to the rest; the south edge meets L9's ice, sand and pines square
// for square (docs/areas/cairnmoor.md §9, #834's 11 to 14).
// Cut from the atlas by tools/scaffold.ts; docs/areas/cairnmoor.md §12.4 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { anchored } from '../../../../game/map.ts';
import { EAST, WEST } from '../../../../game/types.ts';
import { RESPAWN } from '../../../../game/keys.ts';

export const CAIRNFIELD_L8: MapDef = {
  id: 'cairnfield_l8',
  name: 'The Cairnfield',
  kind: 'outdoor',
  density: 'country',
  band: [18, 19],
  region: 'cairnmoor',
  start: { x: 31, y: 23, facing: WEST },
  anchors: { from_carn_fada: { x: 23, y: 27, facing: EAST } },
  rows: [
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
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW~',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW~',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW~~',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWW~~_',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWW~~_,',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWW~~~_,',
    'WWWWWWWWWWWWWWWWWWWWWWWWWW~~~_,,',
    'WWWWWWWWWWWWWWWWWWWWWWWWW~~__,,,',
    'WWWWWWWWWWWWWWWWWWWWWWWWW~~_,,,,',
    'WWWWWWWWWWWWWWWWWWWWWWWW~~~_,,,,',
    'WWWWWWWWWWWWWWWWWWWWWWW~~__,,,,,',
    'WWWWWWWWWWWWWWWWWWWWWW~~_,,,,,,,',
    'WWWWWWWWWWWWWWWWWWWWW~~_,,,,,,,,',
    'WWWWWWWWWWWWWWWWWWWWW~~^,,,,,,,,',
    'WWWWWWWWWWWWWWWWWWWW~~M^,,,rSr^^',
    'WWWWWWWWWWWWWWWWWWW~~M"^,^r...r^',
    'WWWWWWWWWWWWWWWWWW~~~~M^^^r...r^',
    'WWWWWWWWWWWWWWWWW~~^____^^^rrr^^',
    'WWWWWWiiiiiiiiW~~~_^^~~~~~p,,,,,',
    'iiiiiiiWWWWWWii_p_,,^p~~~~~~p,,,',
  ],
  // Carn Fada, the enclave (#845): the gap in the mound's face at 22,27, where the facing stones have
  // fallen, walked into from the hills at 23,27.
  exits: [
    anchored({ x: 22, y: 27, to: 'carn_fada', at: 'start', label: 'You squeeze in where the mound\'s facing stones have fallen, and the noise of the sea goes small.' }),
  ],
  features: [
    // The strand: the netters' hut, the woman raking the wrack and the tideline.
    { kind: 'camp', x: 27, y: 21, name: 'The netters\' hut', text: 'A hut of driftwood and turf above the tide, nets hung to dry by its door. Salmon-netters work this shore.' },
    { kind: 'npc', x: 25, y: 22, name: 'A wrack-gatherer', lines: [
      'A woman in oilskins on the tideline, a creel on her back, raking wrack into heaps.',
      '"The hills over the strand hold a cairn the sea has half drowned, the oldest dead\'s. They keep what they were laid with."',
      '"I do not rake the north end. The tide is not all that comes up there."',
    ] },
    { kind: 'event', x: 28, y: 19, id: 'l8_tide', once: true, text: 'Wrack lies in a dark line along the sand, where the tide turned. Gulls walk the line.' },
    // The grass above the tideline: the well.
    { kind: 'shrine', x: 30, y: 22, id: 'l8_well', text: 'A well in the grass above the tideline, its lip a ring of beach stones. The water is sweet and cold.', stat: 'might', done: 'The well above the tideline, sweet and cold.' },
    // The strand's end and the hills over it: the drowned cairn's mound, the gap in its face at 22,27 the
    // way into Carn Fada (walked into from the hills at 23,27); the bank with the noost cut into it, the
    // tar that gives it away, and the cairn on the hills.
    { kind: 'event', x: 25, y: 25, id: 'l8_mound', once: true, text: 'In the hills over the strand a mound stands apart, its face of grey stone. The tide comes in at its foot.' },
    { kind: 'event', x: 28, y: 25, id: 'l8_tar', once: true, text: 'A smell of hot tar comes out of the bank here, though no boat is drawn up on the strand in sight.' },
    { kind: 'event', x: 28, y: 27, id: 'l8_noost', once: true, text: 'A boat lies upturned on the floor, its hull tarred black, and under it the netters\' winter store.' },
    { kind: 'chest', x: 29, y: 28, id: 'l8_noost_chest', gold: 220, items: ['elixir'] },
    { kind: 'cairn', x: 25, y: 29, id: 'l8_cairn', text: 'A cairn on the hill\'s crown, every stone of it carried up from the shore and grey with salt.', gold: 120, items: ['potion_sp_great'] },
    // The south-west, the loch's foot: where the sand gives out and the ice begins, a bar of it frozen
    // across the head of the open water to the lip that L9's ice runs up into.
    { kind: 'event', x: 9, y: 30, id: 'l8_ice', once: true, text: 'The ice runs out grey across the water, ridged and heaved. Black water stands in the hollows.' },
  ],
  secrets: [{ x: 28, y: 26, hint: 'l8_tar' }],
  encounters: [
    // Four bog bodies come up with the tide at the strand's north end, where the wrack-gatherer will
    // not rake, the gentler, at 18, the nearer from the way in; a tor troll and a cairn wight keep the
    // loch's foot in the south-west, the farther and the hardest, at 19 (the curve's rise,
    // docs/areas/cairnmoor.md §9, #834's 16).
    { id: 'l8_bodies', x: 30, y: 16, monsters: ['bog_body', 'bog_body', 'bog_body', 'bog_body'], aware: 2, respawn: RESPAWN.day, roams: false },
    { id: 'l8_strand', x: 17, y: 31, monsters: ['tor_troll', 'cairn_wight'], aware: 3, respawn: RESPAWN.day, roams: false },
  ],
};
