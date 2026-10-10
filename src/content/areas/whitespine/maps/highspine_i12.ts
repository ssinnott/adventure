// The Whitespine, box I12: the High Spine's south, behind the road. Country, band 22-23: the Spine's
// southern pines along the Sheer's edge, running on south of the Peak Stone to the rim, where the
// pines stop under a wall of rock and the cloud comes up out of the south; the charcoal-burner at his
// clamp and his hut, the warm spring, the cairn and the pine hung out over the Sheer; the eagles' nest
// high on the Spine; the snow trolls lying up where the pines stop, the bark stripped off round them;
// and the tracks that go up to the rock face and stop, and the cleft behind it. Under the Sheer on the
// west, Ashfall's ground runs on south from I11's, the ash in drifts and a burst pack at the cliff's foot.
// In from I11 (#501) walked, under the pines: I11's south edge meets this map's north edge square for
// square, nothing said crossing between them, the same land at the same floor (#166); the strip under
// the Sheer meets I11's the same way. The west edge ends the world against H12 (Ashfall's country,
// parked), the east edge is the Spine against J12, and the south edge is the range and the rim.
// Cut from the atlas by tools/scaffold.ts, the world's end cut by hand; docs/areas/whitespine.md §4.8
// is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const HIGHSPINE_I12: MapDef = {
  id: 'highspine_i12',
  name: 'The High Spine',
  kind: 'outdoor',
  density: 'country',
  band: [22, 23],
  region: 'whitespine',
  start: { x: 18, y: 0, facing: SOUTH },
  rows: [
    'aaa^^pp||ppppppppppppppppppMMMMM',
    'aaa^^pp||pppppppppppppppppppMMMM',
    'aa^^^pp||pppppppppppppppppppMMMM',
    'aa,,^pp||ppppppppppppppppppppMMM',
    'a,,,,pp||ppppppppppppppppppppMMM',
    'aa,,,^p||ppppppppppppppppppppMMM',
    'aa,,,^^||pppppppppppppppppppppMM',
    'aa,,^^^||pppppppppppppppppppppMM',
    'a,,^^^||ppppppppppppppppppppppMM',
    'aa^^^^||ppppppppppppppppppppppMM',
    'aa^^^^||pppppppppppppppppppppMMM',
    'a,,^^^||pppppppppppppppppppppMMM',
    ',,,,^^||pppppppppppppppppppppMMM',
    ',,,,,^||pppppppppppppppppppppMMM',
    ',,,,,,||ppppppppppppppppppppMMMM',
    '^^,,,,||ppppppppppppppppppppMMMM',
    '^^^^^^||pppppppppppppppppppMMMMM',
    '^^^^^||ppppppppppppppppppppMMMMM',
    '^^^^^||pppppppppppppppppppMMMMMM',
    '^^^^^||pppppppppppppppppppMMMMMM',
    'MM^^^||MMMMppppMMSMMMMMMpMMMMMMM',
    'MMMMM||MMMMMMMMMr:rMMMMMMMMMMMMM',
    'MMMMM||MMMMMMMMMr:rMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMrMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMM%%%%%MMMMMMMMMM',
    'MMMMMMMMMMMMMM%%%%%%%%%MMMMMM%%%',
    '%%MMMM%%%%%%%%%%%%%%%%%%%%%%%%%%',
  ],
  features: [
    // The pines south of the Stone along the Sheer's edge: no trail, the cairn, the pine hung out over
    // the Sheer, the eagles' nest on the Spine above, the warm spring, and the rim where the pines stop.
    { kind: 'event', x: 17, y: 2, id: 'i12_south', once: true, text: 'South of the Stone the pines run on along the Sheer\'s edge, and nobody has cut a trail through them.' },
    { kind: 'cairn', x: 10, y: 5, id: 'i12_cairn', text: 'A cairn at the Sheer\'s edge, its top stone hollowed by the rain, and a mitten frozen to it.', gold: 300, items: ['potion_sp_great'] },
    { kind: 'event', x: 8, y: 9, id: 'i12_edge', once: true, text: 'A pine at the Sheer\'s edge leans out over nothing, its roots in the air. Far below lies the ash.' },
    { kind: 'event', x: 26, y: 7, id: 'i12_eyrie', once: true, text: 'High on the Spine, a nest of whole boughs on a ledge, and the rock under it white down to the pines.' },
    { kind: 'shrine', x: 14, y: 12, id: 'i12_spring', text: 'A spring under the pines that runs warm, the snow melted back round it and moss green at its lip.', stat: 'endurance', done: 'The warm spring under the pines.' },
    { kind: 'event', x: 24, y: 20, id: 'i12_rim', once: true, text: 'The pines stop under a wall of rock. Over it the cloud comes up out of the south, and nothing shows through.' },
    // The charcoal-burner at his clamp, who knows where the trolls lie up, and his hut.
    { kind: 'npc', x: 21, y: 10, name: 'A charcoal-burner', lines: [
      'A charcoal-burner sits by his clamp, the smoke leaking out through the turf.',
      '"Trolls lie up where the pines stop. They mend while you look at them. Fire stops it."',
    ] },
    { kind: 'camp', x: 23, y: 11, name: 'The burner\'s hut', text: 'A turf hut by the clamp, a bed of boughs inside and the smoke keeping the cold off it.' },
    // Where the trolls lie up: the bark stripped off the pines round them.
    { kind: 'event', x: 14, y: 16, id: 'i12_stripped', once: true, text: 'Pines stripped of their bark to twice a man\'s height, and the strips chewed and spat out in the snow.' },
    // Under the Sheer, Ashfall's ground: the ash in drifts, and a pack burst at the cliff's foot.
    { kind: 'event', x: 2, y: 4, id: 'i12_under', once: true, text: 'Under the Sheer the ash lies in drifts like snow, grey and unmarked, and the cliff goes up out of sight.' },
    { kind: 'event', x: 2, y: 15, id: 'i12_pack', once: true, text: 'A pack burst open at the Sheer\'s foot, a frozen rope still knotted round it, and the rope cut.' },
    // The secret: old tracks going up to the rock face where the pines stop, and none coming away; the
    // search there, and the cleft behind it with the packs and a strongbox nobody came back for.
    { kind: 'event', x: 17, y: 19, id: 'i12_tracks', once: true, text: 'Old tracks in the snow go up to the rock face, and stop at it. None come away.' },
    { kind: 'event', x: 17, y: 21, id: 'i12_cleft', once: true, text: 'A cleft behind the rock: packs frozen stiff under a hide, their straps cut, and a strongbox nobody came back for.' },
    { kind: 'chest', x: 17, y: 22, id: 'i12_packs', gold: 1400, items: ['elixir'] },
  ],
  secrets: [{ x: 17, y: 20, hint: 'i12_tracks' }],
  encounters: [
    // The box's one fight: the snow trolls lying up where the pines stop under the rim, two together,
    // the hardest and the only group.
    { id: 'i12_trolls', x: 12, y: 18, monsters: ['snow_troll', 'snow_troll'], aware: 3, respawn: 2880, roams: false },
  ],
};
