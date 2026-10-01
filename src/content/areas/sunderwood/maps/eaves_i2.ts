// Sunderwood, box I2: the Eaves' way in. Country, band 14-15: the east road out of Thornmark over the
// Hoarhills' shoulder and down into the first woods, Lyngwyn's east shore under the crest along the
// box's south, and a woodcutter's camp off the road. The rim closes the north, the crest the south
// against the Deepthorn's I3; the road runs on out of the east edge for J2 and the bridge.
// Cut from the atlas by tools/scaffold.ts; docs/areas/sunderwood.md §4.2 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST, WEST } from '../../../../game/types.ts';

export const EAVES_I2: MapDef = {
  id: 'eaves_i2',
  name: 'The Eaves',
  kind: 'outdoor',
  density: 'country',
  band: [14, 15],
  region: 'sunderwood',
  start: { x: 0, y: 10, facing: EAST },
  rows: [
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMM^^tttt^^^^^^tttttttTTttttM',
    'MMMMMM^^^tttt^^^^ttttttttTTTtttM',
    'MMMMMM^^^ttttttttt,,ttttttTttttM',
    'MMMMMMM^^ttttTTttt,,,ttttttttttM',
    'MMMMMMM^^tttTTTtttt,ttttttt,,ttM',
    'MMMMMMM^^ttttTtttttttttttTT,,,tM',
    'MMMMMMM^^tttttttttttttttTTT,,ttM',
    'MMMMMMM^^ttttttttttttttttttttttM',
    'MMMMMMM===================tttttM',
    '========^tttttttttttttttt=====tM',
    'MMMMMMM^^tttttttTSTttttttttt====',
    'MMMMMMM^^^ttttttTtTttttttttttttM',
    'MMMMMMMM^^ttttttTTTtt,,,,ttttttM',
    'M~~~~MMM^^ttttttttttt,,,,,tttttM',
    'M~~~~~~M^^tttttttttt,,,,,ttttttM',
    'MWWWW~~~^^^tttttttttt,,,tttttttM',
    'MWWWWWW~~^^ttttttttttttttttttttM',
    'MWWWWWWW~~~_tttttttTTttttttttTTM',
    'MWWWWWWWW~~_ttttttTTTtttttttTTTM',
    'MWWWWWWWWW~~_tttttttTttttttttTTM',
    'MWWWWWWWWWW~~_tttttttttttttttTTM',
    'MWWWWWWWWW~~_tttttttttttttttTTTM',
    'MWWWWWWWWWW~~_tttttt,,tttttTTTTM',
    'MWWWWWWWWWW~~_ttttt,,,,ttttTTTTM',
    'MWWWWWWWWWW~~_tttttt,,ttttTTTTTM',
    'MWWWWWWWWW~~^ttttttttttttttTTTTM',
    'M~WWWWWWW~~~^tttttttttttttttTTTM',
    'M~~WWW~~~~~^^ttttttttttttttTTTTM',
    'M~~~~~~~~MMM^^tttttttttttttTTTTM',
    'MMMW~~MMMMMM^^ttttttttttttTTTTTM',
    'MMMWMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
  ],
  exits: [
    { x: 0, y: 10, to: 'thornmark', tx: 30, ty: 10, tf: WEST },
  ],
  features: [
    // The road over the shoulder and into the wood.
    { kind: 'shrine', x: 9, y: 8, id: 'i2_shrine', text: 'A wayside shrine where the road enters the wood, the hills\' last dry stone. Needles lie on it an inch deep.', stat: 'speed', done: 'The needles on the shrine lie as they fell.' },
    { kind: 'cairn', x: 7, y: 5, id: 'i2_cairn', text: 'A cairn on the ridge\'s shoulder, the last of Thornmark behind it and the pines ahead. Every stone on it came up from the lake.', gold: 160, items: ['potion_sp_great'] },
    // The secret: the milestone by the road, and under it the Watch's last patrol's pack.
    { kind: 'event', x: 17, y: 10, id: 'i2_milestone', once: true, text: 'A milestone face down in the bracken, the end of its line clear of the turf: STOW 40. The turf under its edge is cut square, not torn.' },
    { kind: 'event', x: 17, y: 12, id: 'i2_pack', once: true, text: 'A Warden\'s pack in the hollow where the stone stood, a halberd laid along it. Its orders, stamped with the Watch\'s lamp: the Hoarhills and back by the east road, four days.' },
    { kind: 'chest', x: 17, y: 12, id: 'i2_pack_chest', gold: 300, items: ['wardens_halberd'] },
    // The woodcutter's camp, and the woodcutter's word on the stone.
    { kind: 'camp', x: 21, y: 14, name: 'The woodcutter\'s camp', text: 'A woodcutter\'s clearing off the road, a fire in a ring of stumps. The mist stops at the smoke.' },
    { kind: 'npc', x: 23, y: 14, name: 'A woodcutter', lines: [
      'A woodcutter limbs a pine by the fire, and does not look up from the saw.',
      '"Wood ends in a gorge, east. I don\'t cut near it. The pines on the lip ring under the axe and notch the blade, and they won\'t burn."',
      '"That stone by the road? Stood when I came up in spring. No frost lays a stone that size flat."',
    ] },
    { kind: 'event', x: 12, y: 28, id: 'i2_lookout', once: true, text: 'From the crest, all Lyngwyn under you, grey and still the whole way west to Thornmark. Nothing on it moves, not even the mist.' },
  ],
  secrets: [{ x: 17, y: 11, hint: 'i2_milestone' }],
  encounters: [
    // The gentlest first: pine bears in the north woods by the way in, the moths beside the camp by
    // night, and on the road at the far end a pine bear with a glass bear, the first glass.
    { id: 'i2_bears1', x: 11, y: 6, monsters: ['pine_bear', 'pine_bear'], aware: 4, respawn: 2880 },
    { id: 'i2_moths', x: 22, y: 16, monsters: ['lantern_moth', 'lantern_moth', 'lantern_moth', 'lantern_moth', 'lantern_moth', 'lantern_moth', 'lantern_moth', 'lantern_moth'], aware: 5, respawn: 1440, when: { hours: 'night' } },
    { id: 'i2_bears2', x: 29, y: 10, monsters: ['pine_bear', 'glass_bear'], aware: 5, respawn: 2880, roams: false },
  ],
};
