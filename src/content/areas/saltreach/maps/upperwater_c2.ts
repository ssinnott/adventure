// The Upper Water, box C2: the upper valley over Rietum. Country, band 10-11: hill pasture between the
// rim and Kestrel Edge, up from Rietum's top field by the sheep-paths, the Hand's watch at its fire on
// the crest, a tarn in a fold of the hills and two toads come up to it, the shepherds' cairn under the
// rim and a cleft in the Edge's foot walled up with dry stone. The Edge's face is drawn as mountain, as
// C3 draws it, since the cliff is the Whitespine's to claim. East of it the Edge's top, the Downs' turf,
// is laid with the box whole: open to Callow Downs' D2 and walked to only from it, with the boundary
// stone, the lip and a shepherd of the Downs on it and no group. Cut from the atlas by
// tools/scaffold.ts, its void written in; docs/areas/saltreach.md §12 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH } from '../../../../game/types.ts';

export const UPPERWATER_C2: MapDef = {
  id: 'upperwater_c2',
  name: 'The Upper Water',
  kind: 'outdoor',
  density: 'country',
  band: [10, 11],
  region: 'saltreach',
  start: { x: 8, y: 30, facing: NORTH },
  rows: [
    '%%%%%M%%%%MMMMMMMMMMMMMMMMMMMMMM',
    '%%%%%MMMMMMMMMMMMMMMMMMMMMMMMMMM',
    '%%MMMMMMMMMMMMMMMMMMMMMMMMMMMMM^',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMM^^^^',
    'MMMMMMMMMMMMMMMMMMMMMMMMM^^^^^^^',
    'MMMMMMMMMMMMMMMMMMMMMMM^^^^^^^^^',
    'MMMMMMMMMMMMMMMMMMMMMM^^^^^^^^^^',
    'MMMMMMMMMMMMMMMMMMMMM^^^^^^^^^^^',
    'MMMMMMMMMMMMMMMMM^MM^^^^^^^^^^^^',
    'MMMMMMMMMMMM^^^^^^MMM^^^^^^^,,,,',
    'MMMMMMM^^M^^^^^^BBBMM^^^^^^,,,,,',
    'MMMMM^^^^^^^^^^^B:BMM^^^^^,,,,,,',
    '^^^^^^^^^^^^^^^^BSB^MM^^,,,,,,,,',
    '^^^^^^^^^^^^^^^^^^^^MM^^,,,,,,,,',
    '^^^^^^^,,,,,,,,^^^^^^MM^,,,,,,,,',
    '^^^^^^,,~~~~,,,^^^^^^MM^,,,,,,,,',
    '^^^^,,,~~WW~~,,^^^^^^MMM,,,,,,,,',
    '^^^^,,,,~~~~,,^^^^^^^^MM^^,^^^,^',
    '^^^^^,,,,^^^^^^^^^^^^^MM^^^^^^^^',
    '^^^^^^,,,^^^^^^^^^^^^^^MM^^^^^^^',
    ',^^^^^^^^^^^^^^^^^^^^^^MM^^^^^^^',
    ',,^^^^^^^^,,,,^^^^^^^^^MMM^^^^^^',
    ',,,,^^^^^^^,,,,,,,,,^^^^MM^^^^^^',
    ',,,,,,^^^^^,,,,,,,,,,,,,MM,^^,,^',
    ',,,,,,^^^^,,,,,,,,,,,,,,,MM,,,,,',
    ',,,,,,,^^^,,,,,,,,,,,,,,,MM^,,,,',
    ',,,,,,,,:,,,,,,,,,,,,,,,,MM,,,,,',
    ',,,,,,,,:,,,,,,,,,,,,,,,,,MM,,,,',
    ',,,,,,,,:,,,,,,,,,,,,,,,,,MM,,,,',
    ',,,,,,,,:,,,,,,,,,,,,,,,,,MM,,,,',
    ',,,,,,,,:,,,,,,,,,,,,,,,,,MMM,,,',
    ',,fffffffffffff,,,,,^,,,,,,MM,,,',
  ],
  features: [
    // Up from Rietum's top field; the watch's fire on the crest, and Jelle with Rietum's sheep under the Edge.
    { kind: 'event', x: 8, y: 31, id: 'c2_stile', once: true, text: 'Rietum\'s top field ends at a stile. Above it the sheep-paths climb into the hills under the Edge, empty.' },
    { kind: 'camp', x: 7, y: 22, name: 'The watch\'s fire', text: 'A fire-ring on the crest, turf seats round it and the river in sight down to Rietum. The fire is banked.' },
    { kind: 'npc', x: 20, y: 27, name: 'Jelle, a shepherd of Rietum', lines: [
      'A boy of the Tidefolk with a crook taller than he is, and a dog that keeps between you and his sheep. "Jelle. The top pasture is Rietum\'s. Mind the sheep."',
      '"Men off the barges have kept a fire on the crest since midsummer. They buy a sheep a week, pay in Saltmouth silver and watch the river."',
      '"The toads come up to the tarn to spawn. One went in last spring the size of a cow and never came out. My father says leave it be."',
    ] },
    // The tarn in its fold of the hills, and the cairn on the last hill under the rim.
    { kind: 'event', x: 6, y: 15, id: 'c2_tarn', once: true, text: 'A tarn in a fold of the hills, black and still. On its far side the reeds lie flat in a broad track down to the water.' },
    { kind: 'cairn', x: 9, y: 11, id: 'c2_cairn', text: 'A cairn on the last hill under the rim, built up a stone a summer by the shepherds. A horn cup sits upside down on its top.', gold: 50, items: ['potion_heal'] },
    // The secret: the cleft in the Edge's foot, walled up, its way in rubbed on the walling.
    { kind: 'event', x: 17, y: 13, id: 'c2_walling', text: 'Dry-stone walling fills a cleft in the Edge\'s foot. Down its middle the lichen is rubbed off in a line.' },
    { kind: 'event', x: 17, y: 12, id: 'c2_cleft', once: true, text: 'A dry cleft behind the walling: rope, a sack and a lamp of green glass, its shutter turned down the valley.' },
    { kind: 'chest', x: 17, y: 11, id: 'c2_cleft_chest', gold: 150, items: ['long_axe+1', 'potion_heal'] },
    // East of the cliff, the Edge's top: the Downs' turf, walked to from Callow Downs alone.
    { kind: 'event', x: 27, y: 8, id: 'c2_stone', once: true, text: 'A boundary stone on the Edge\'s top, a sheaf cut on its east face and a wave on its west. The turf runs on past it to the lip.' },
    { kind: 'event', x: 25, y: 18, id: 'c2_lip', once: true, text: 'Kestrel Edge\'s lip, and the drop. Below, the valley\'s hills, a black tarn, smoke on a crest and Rietum\'s roofs.' },
    { kind: 'npc', x: 29, y: 27, name: 'Ralf, a shepherd of the Downs', lines: [
      'A man of the Downs sits on the lip with his dog. "Ralf. No way down from here but the Salt Road, and that\'s a day south."',
      '"Smoke on that crest down there since midsummer. Not Tidefolk smoke, either. They burn peat, and that\'s wood."',
    ] },
  ],
  secrets: [{ x: 17, y: 12, hint: 'c2_walling' }],
  encounters: [
    // The Hand's watch beside its fire on the crest: a master and three bargemen, who break when he falls.
    // It stands next to the fire, so no company rests there while it stands (wilds.ts, `restRefused`).
    { id: 'c2_watch', x: 7, y: 23, monsters: ['barge_master', 'bargeman', 'bargeman', 'bargeman'], leader: 'barge_master', aware: 3, roams: false, respawn: 2880 },
    // A bull toad and a fen toad come up out of the fen to spawn in the tarn, the farthest and the hardest.
    { id: 'c2_toad', x: 12, y: 15, monsters: ['bull_toad', 'fen_toad'], aware: 4, respawn: 1440 },
  ],
};
