// Ashfall, box E11: the Waste's west under the lava flow. Country, band 25-26, behind the road: the flow
// whose head is on E10's south edge running on south-west across the box to the mountains, where it goes
// in under them and the world ends; west of it the steppe's last grass and the Cinder Hills' south end,
// a black stone the flow threw out stood up on end and a horse dead on the hillside; east of it the
// Waste's ash going on to the mountains, its cinder cones, a knapper at the flow's edge, his camp under
// the mountain's foot and a cairn with a cup turned down on it. In the hollows by the flow the young
// drakes lie up on the warm, the box's one fight; and beside them, where a crack in the rocks breathes
// cold air, a tube under the flow with a man's bones in it by his pack.
// In from E10 over its south edge, walked: E10's 0,31 to 31,31 meets 0,0 to 31,0 here square for square,
// the steppe, the grass, the hills, the ash and the flow at 23 and 24 both sides (the flow at 22 here
// against E10's ash, the rock at 31 against its ash). The east edge meets F11's west at the ash, rows 19
// and 20 and 26 to 28, walked, the rock against the rock above and the ash against the rock between; D11
// and E12 are not built, so the world ends past the west and south edges.
// Cut from the atlas by tools/scaffold.ts's own cut, the world's end written as void; docs/areas/ashfall.md
// §4.10 is its brief (#522).
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const EMBERWASTE_E11: MapDef = {
  id: 'emberwaste_e11',
  name: 'The Ember Waste',
  kind: 'outdoor',
  density: 'country',
  band: [25, 26],
  region: 'ashfall',
  start: { x: 27, y: 0, facing: SOUTH },
  rows: [
    'sssssssss,,^^^^^^^^^aa!!!aaaaaar',
    'sssssss,,,,^^^^^^^^^a!!!aaaaaaar',
    'sssssss,,,,,^^^^^^^^a!!!aaaaaarr',
    'sssss,,,,,,,^^^^^^^^!!!aaaaaarrr',
    'sss,,,,,,,,^^^^^^^^!!!aaaaaaarrr',
    'sss,,,,,,,,^^^^^^^^!!aaaaaaaarrr',
    'sss,,,,,,,^^^^^^^^!!aaaaaaaaaarr',
    '^s,,,,,,,,^^^^^^^!!!aaaaaaaaaarr',
    '^^^^,,,,,,^^^^^^^!!aaaaaaaaaarrr',
    '^^^^^,,,,,,^^^^^!!^^aaaaaaaaarrr',
    '^^^^^^^,,,,^^^^!!!^^aaaaaaaaarrr',
    'M^^^^^^^^,,^^^^!!^^^aaaaaaaaarrr',
    'MMM^^^^^^^^^^^!!^rSr^aaaaaaaaaar',
    'MMMMM^^^^^^^^!!!^r:r^aaaaaaaaaar',
    'MMMMMM^^^^^^^!!^^rrr^^aaaaaaaaar',
    'MMMMMMMM^^^^!!^^^^^^^^aaaaaaaaar',
    'MMMMMMMMMM^!!^^^^^^,^^aaaaaaaaaa',
    'MMMMMMMMMMM!!^^^^^^^,aaaaaaaaaaa',
    'MMMMMMMMMM!!^^^^^^^^^,aaaaaaaaaa',
    'MMMMMMMMM!!M^^^^^^^^^aaaaaaaaaaa',
    'MMMMMMMMM!!M^^^^^^^^^aaaaaaaaaaa',
    'MMMMMMMM!!MM^^^^^^^^aaaaaaaaaaaa',
    '%%MMMMM!!MMM^^^^MM^^aaaaaaaaaaaa',
    '%%%MMMM!!MM^^^^^MMMM^^aaaaaaaaaa',
    '%%%%MM!!MMM^^^^^MMMMMMaaaaaaaaaa',
    '%%%%M!!!MMM^^^^^MMMMMMMMMMaaaaaa',
    '%%%%%!!MMMM^^^^^MMMMMMMMMMMaaaaa',
    '%%%%%%MMMMM^^^^MMMMMMMMMMMMMMaaa',
    '%%%%%%%%MM^^^^^MMMMMMMMMMMMMMMaa',
    '%%%%%%%%%M^^^^^MMMMMMMMMMMMMMMMM',
    '%%%%%%%%%%^^^^MMMMMMMMMMMMMMMMMM',
    '%%%%%%%%%%%%^^MMMMMMMMMMMMMMMMMM',
  ],
  features: [
    // In off E10 onto the ash, the cones going on south; the knapper at the flow's edge, who has seen the
    // young drakes come down to it, and his camp under the mountain's foot.
    { kind: 'event', x: 27, y: 2, id: 'e11_in', once: true, text: 'South of the road the ash goes on to the mountains, cinder cones standing up out of it in rows.' },
    { kind: 'npc', x: 21, y: 5, name: 'A knapper', lines: [
      'A man on his heels at the flow\'s edge, knocking black glass off the crust into a sack with a horn.',
      '"Best edge there is, flow glass. The Riders give a horse for a sackful."',
      '"The young drakes come down to the warm of an evening. I am gone before."',
    ] },
    { kind: 'event', x: 25, y: 9, id: 'e11_cones', once: true, text: 'The cones stand taller here, one higher than a man, a thread of smoke going up out of its mouth.' },
    { kind: 'cairn', x: 28, y: 15, id: 'e11_cairn', text: 'A cairn of clinker on the ash, and on top of it a cup, turned down.', gold: 50, items: ['potion_sp_great'] },
    { kind: 'event', x: 24, y: 20, id: 'e11_kill', once: true, text: 'A horse in the ash, picked clean and scorched, its ribs standing up like a fence.' },
    { kind: 'camp', x: 27, y: 24, name: 'The knapper\'s camp', text: 'Under the mountain\'s foot a ring of cinder blocks out of the wind, a blanket and a pot in it.' },
    // West of the flow: the steppe's last grass, the black stone stood up in it, the flow seen from the
    // Hills' south end and the horse that went too near.
    { kind: 'event', x: 3, y: 3, id: 'e11_steppe', once: true, text: 'The steppe comes down this far between the hills and the flow, and its last grass is singed brown.' },
    { kind: 'shrine', x: 7, y: 7, id: 'e11_shrine', text: 'A black stone the flow threw out, stood up on end in the grass and rubbed smooth at the height of a hand.', stat: 'might', done: 'The black stone, smooth where the hands go.' },
    { kind: 'event', x: 13, y: 4, id: 'e11_road', once: true, text: 'Below the hills the flow goes by, a black road with fire in its cracks, slow as a cart.' },
    { kind: 'event', x: 8, y: 12, id: 'e11_horse', once: true, text: 'A horse dead on the hillside, legs out stiff, its hooves burnt through to the frog.' },
    // The hollows on the flow's east bank, where the young drakes lie up; and the flow going in under the
    // mountains at the world's end.
    { kind: 'event', x: 15, y: 17, id: 'e11_skins', once: true, text: 'Cast skins in the hollows by the flow, small and thin as paper, and still warm.' },
    { kind: 'event', x: 12, y: 27, id: 'e11_end', once: true, text: 'The flow goes in under the mountains to the south-west and does not come out. The air past them shakes.' },
    // The secret: a crack in the rocks by the flow that breathes cold air, and the search there; the tube
    // under the flow behind it, a man's bones in it by his pack.
    { kind: 'event', x: 18, y: 11, id: 'e11_draught', once: true, text: 'Out of a crack in the rocks beside the flow comes a draught of cold air.' },
    { kind: 'event', x: 18, y: 13, id: 'e11_tube', once: true, text: 'A tube of cold stone running in under the flow, and in it a man\'s bones beside his pack.' },
    { kind: 'chest', x: 18, y: 13, id: 'e11_pack', gold: 100, items: ['potion_sp_great'] },
  ],
  secrets: [{ x: 18, y: 12, hint: 'e11_draught' }],
  encounters: [
    // A clutch of young drakes lying up in the hollows on the flow's warm bank, the box's one fight and its
    // hardest, at the band's top: four were too light a fight for the pace (24.7 fights to a rest).
    { id: 'e11_drakelings', x: 12, y: 18, monsters: ['drakeling', 'drakeling', 'drakeling', 'drakeling', 'drakeling', 'drakeling'], aware: 3, respawn: 2880 },
  ],
};
