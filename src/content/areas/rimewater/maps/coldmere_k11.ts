// Rimewater, box K11: south of the pass. Country, band 20-22, behind the road: the pines below the high
// pass going down to the lake's foot in the north-east corner, where the ice-cutters left a sledge of
// sawn ice by their ice-house in the bank; the rim's crags in a wall from the north-west to the south,
// a pair of ice bears lying up in a cleft under them, their tracks going to it; and over the crags to
// the south-west the grass of Monks' Vale coming round, and the monks' bells heard over the snow.
// In from K10 (#491) over its south edge, walked: K10's 0,31 to 31,31 meets 0,0 to 31,0 here square for
// square, the pines, the ice at 27 and 28 and the lake. The west edge meets J11's east (#499) at the
// hills and the vale's grass, rows 14 to 31, walked; L11 and K12 are not built, so the world ends past
// the east and south edges.
// Cut from the atlas by tools/scaffold.ts, the rim's peaks drawn as its mountain, the peaks being the
// Whitespine's own (its novelty); docs/areas/rimewater.md §4.8 is its brief (#497).
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const COLDMERE_K11: MapDef = {
  id: 'coldmere_k11',
  name: 'Loch Fuar',
  kind: 'outdoor',
  density: 'country',
  band: [20, 22],
  region: 'rimewater',
  start: { x: 20, y: 0, facing: SOUTH },
  rows: [
    'pppppppppppppppppppppppppppiiWWW',
    'MMpppppppppppppppppppppppppiiWWW',
    'MMMppppppppppppppppppppppppiiWWW',
    'MMMMpppppppppppppppppppppppiiWWW',
    'MMMMpppppppppppppppppppppppiiWWW',
    'MMMMMpppppppppppppppppppppppiiWW',
    'MMMMMpppppppppppppppppppppppiiWW',
    'MMMMMMpppppppppppppppppppppppiii',
    'MMMMMMMpppppppppppppppppppppppii',
    'MMMMMMMppppppppppppppppppppppppp',
    'MMMMMMMMpppppppppppppppppppppppp',
    'MMMMMMMMMpppppppppppppBSBppppppp',
    'MMMMMMMMMMppppppppppppB:Bppppppp',
    'MMMMMMMMMMppppppppppppBBBppppppp',
    '^MMMMMMMMMMppppppppppppppppppppp',
    '^MMMMMMMMMMMpppppppppppppppppppp',
    '^^MMMMMMMMMMpppppppppppppppppppp',
    '^^^MMMMMMMMMMppppppppppppppppppp',
    ',^^^MMMMMMMMMMpppppppppppppppppp',
    ',^^^pMMMMMMMMMpppppppppppppppppp',
    ',,^^pMMMMMMMMMMppppppppppppppppp',
    ',,^^^pMMMMMMMMMppppppppppppppppp',
    ',,,^^^pMMMMMMMMMpppppppppppppppp',
    ',,,^^^ppMMMMMMMMMppppppppppppppp',
    ',,,,^^pppMMMMMMMMMpppppppppppppp',
    ',,,,^^ppppMMMMMMMMMppppppppppppp',
    ',,,,,^pppppMMMMMMMMMpppppppppppp',
    ',,,,,,ppppppMMMMMMMMpppppppppppp',
    ',,,,,,ppppppMMMMMMMMMppppppppppp',
    ',,,,,,pppppppMMMMMMMMMpppppppppp',
    ',,,,,,ppppppppMMMMMMMMpppppppppp',
    '^^,,,,ppppppppMMMMMMMMMppppppppp',
  ],
  features: [
    // In from K10 under the pines, and the lake's foot in the north-east corner.
    { kind: 'event', x: 20, y: 1, id: 'k11_in', once: true, text: 'South of the pass the pines go on down, the lake\'s foot to the east and the rim\'s crags to the west.' },
    { kind: 'event', x: 26, y: 4, id: 'k11_lake', once: true, text: 'The lake\'s foot under the pines, rimmed with ice, the water out from it black and still.' },
    { kind: 'cairn', x: 9, y: 3, id: 'k11_cairn', text: 'A cairn of flat stones under the crags, a pilgrim\'s staff stood in it, its ribbons frozen stiff.', gold: 300, items: ['potion_sp_great'] },
    // The bears' ground: their tracks, the crags and the cleft under them where they lie up, and what
    // they leave about it.
    { kind: 'event', x: 14, y: 7, id: 'k11_tracks', once: true, text: 'Tracks of two bears side by side between the pines, broad as platters, going west to the crags.' },
    { kind: 'event', x: 12, y: 12, id: 'k11_crags', once: true, text: 'The rim\'s crags go up out of the pines in grey steps, snow lying on every step and the peaks above.' },
    { kind: 'event', x: 18, y: 17, id: 'k11_bones', once: true, text: 'A hare\'s skull in the snow, a ptarmigan\'s wings and a fox\'s brush, all picked clean.' },
    { kind: 'event', x: 15, y: 20, id: 'k11_cleft', once: true, text: 'A cleft in the crags\' foot, its mouth trodden to ice, and a smell of old meat out of the dark.' },
    { kind: 'camp', x: 22, y: 25, name: 'The windthrow', text: 'A hollow under a wind-thrown pine, dry, the needles in it deep. Something has slept here, not lately.' },
    { kind: 'event', x: 29, y: 15, id: 'k11_east', once: true, text: 'East the pines go on over a low ridge, and the glacier stands over them, blue in its cracks.' },
    { kind: 'event', x: 24, y: 30, id: 'k11_south', once: true, text: 'The pines go on south into the snow-light, and past them the land falls away out of sight.' },
    // Over the crags to the south-west, the vale's grass from Monks' Vale and its bells.
    { kind: 'event', x: 2, y: 21, id: 'k11_bells', once: true, text: 'Bells from the west over the snow, far off, many, rung slow.' },
    { kind: 'event', x: 4, y: 28, id: 'k11_vale', once: true, text: 'The vale\'s grass comes round under the crags here, cropped short, though no flock is in sight.' },
    // The secret: the ice-cutters' sledge on the shore, loaded and left, and the search at the bank behind
    // it; their ice-house dug into the bank, with their strongbox.
    { kind: 'event', x: 25, y: 9, id: 'k11_sledge', once: true, text: 'A sledge on the shore, loaded with blocks of lake ice sawn square, its runners frozen into the snow.' },
    { kind: 'event', x: 23, y: 12, id: 'k11_icehouse', once: true, text: 'An ice-house dug into the bank, cold as the lake: blocks of ice in straw to the roof, and a strongbox.' },
    { kind: 'chest', x: 23, y: 12, id: 'k11_strongbox', gold: 700, items: ['potion_sp_great'] },
  ],
  secrets: [{ x: 23, y: 11, hint: 'k11_sledge' }],
  encounters: [
    // A pair of ice bears lying up in the cleft under the crags, the box's one fight and its hardest.
    { id: 'k11_bears', x: 16, y: 20, monsters: ['ice_bear', 'ice_bear'], aware: 3, respawn: 2880 },
  ],
};
