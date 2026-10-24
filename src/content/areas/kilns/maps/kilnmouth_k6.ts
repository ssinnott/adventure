// Kilnmouth, box K6: the heath west of the port. Country, band 16-18, the first of the bounds (#831): the
// heather and the gorse running on west from Kilnhaven's last wall, a turf windbreak and a sheepfold, a
// cairn on the one rise, the rock worms' rings in the dead heather, the kelp-burner's pit on the shingle
// with an ore barge's ribs beyond it, and a headland with the dwarves' first quay on it: a slipway, its
// rails and a winch-house with a strongroom that has been kept, and at 20,16 the grate in the slipway,
// the way down into the Seestollen, the enclave (#845). The heath's tail runs on south into K7's 56
// squares and a rock bank across its neck closes it, as the sea closes the north and a mountain the
// four squares of sand on the west. The Kilns' bounds bring back K6, L7, P4, P5 and P6.
// Cut from the atlas by tools/scaffold.ts; docs/areas/kilns.md §12 is its brief.
import type { MapDef } from '../../../../game/mapdef.ts';
import { anchored } from '../../../../game/map.ts';
import { SOUTH, WEST } from '../../../../game/types.ts';
import { RESPAWN } from '../../../../game/keys.ts';

export const KILNMOUTH_K6: MapDef<'kilnmouth_k6'> = {
  id: 'kilnmouth_k6',
  name: 'Kilnmouth',
  kind: 'outdoor',
  density: 'country',
  band: [16, 18],
  region: 'kilns',
  start: { x: 31, y: 19, facing: WEST },
  anchors: { from_seestollen: { x: 20, y: 17, facing: SOUTH } },
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
    'WWWWWWWWWWW~~~~W~~WWWWWWWWWWWWWW',
    'WWWWWWWWWW~~~~~~~~~WWWWWWWWWWWWW',
    'WWWWWWWWW~~_______~~WWWWWWWWWWWW',
    'WWWWWWWW~~_,,,,rrr_~~WWWWWWWWWWW',
    'WWWWWWWW~~_,,,,r.S:_~~WWWWWWWWWW',
    'WWWWWW~~~_,,,,,r.r:_~~~~WWWWW~~W',
    'WWWWW~~~_,,,,,,rrr,,"~~~~~~~~~~~',
    'WWWW~~__,,,,,,,,,,,,,___~~~~~__~',
    'WWW~~_,,,,,,hhhh,,,,,,,,,,,,,,,,',
    'WW~~_,,,,,hhhhhhhhh,,,,,,,,,,,,,',
    'W~~~_,,,hhhhhhhhhhhhhhh,,,,,,,,,',
    '~~__,,,hhhhhhhhhhhhhhhhhhhhhhhhh',
    '~~_,hhhhhhhhhhhhhhhhhhhhhhhhhhhh',
    '~_,,hhhhhhhhhhhhhhhhhhhhhhhhhhhh',
    'M,,hhhhhhhhhhhhhhhhhhhhhhhhhhhhh',
    'M,,hhhhhhhhhhhhhhhhhhhhhhhhhhhhh',
    'M,,hhhhhhhhhhhhhhhhhhhhhhhhhhhhh',
    'M,,,hhhhhhhhhhhhhhhhhhhhhhhhhhhh',
    'M__,,,hhhhhhhhhhhhhhhhhhhhhhhhhh',
    '~~~__,,hhhMhhhhhhhhhhhhhhhhMhhhh',
    '~~~~~__,hMMMhhhhhhhMMhhhhhMMMhhh',
    'WWW~~~~MMMMMMMMMMMMMMMMMMMMMMMMM',
  ],
  // The Seestollen, the enclave (#845): the grate in the slipway's dressed stone at 20,16, walked onto
  // from the slipway at 19,16 or the grass at 20,17.
  exits: [
    anchored({ x: 20, y: 16, to: 'seestollen', at: 'start', label: 'You lift the grate in the slipway and go down the rails into the rock. The sea booms somewhere under you.' }),
  ],
  features: [
    // In from Kilnhaven's wall by the east edge, and the flat of the bay's south shore.
    { kind: 'event', x: 29, y: 19, id: 'k6_heath', once: true, text: 'The town\'s last wall falls behind. Heather to the knee, gorse in yellow knots, and a wind with nothing in front of it.' },
    { kind: 'event', x: 29, y: 17, id: 'k6_flat', once: true, text: 'At low water the flat is black mud to the horizon, pocked with lugworm and printed all over with herons.' },
    // The heath: the windbreak, the fold, the cairn on the one rise and the rock worms' ground.
    { kind: 'camp', x: 26, y: 26, name: 'The windbreak', text: 'A turf bank cut back into a windbreak, with a fire-ring of beach stones. Someone sleeps here often.' },
    { kind: 'event', x: 28, y: 23, id: 'k6_fold', once: true, text: 'A sheepfold of piled stone, empty. The shepherds know better than to graze the middle of the heath.' },
    { kind: 'event', x: 21, y: 25, id: 'k6_rings', once: true, text: 'Rings of dead heather across the heath, each a stride wide, the earth in them crumbled fine. Something goes under here.' },
    { kind: 'cairn', x: 13, y: 27, id: 'k6_cairn', text: 'A cairn of beach stones on the heath\'s one rise, a gull\'s wing pegged in its top. The wind keeps it turning.', gold: 120, items: ['potion_sp_great'] },
    // The shore: the skeps in their lee, the kelp-burner at her pit and the ore barge on the shingle.
    { kind: 'shrine', x: 5, y: 21, id: 'k6_boles', text: 'A wall of niches in the lee of a bank, a straw skep in each, humming. A pot of heather honey stands on the lip, with a spoon.', stat: 'speed', done: 'The skeps, humming in their niches.' },
    { kind: 'npc', x: 4, y: 26, name: 'A kelp-burner', lines: [
      'A woman in a sacking apron, black to the elbow, rakes a smouldering pit of weed. The smoke goes to the smelters.',
      '"Kelp ash for the flux. The dwarves pay by the sack, in iron, and late."',
      '"When the wind drops the heath sings. I burn on the shore and I don\'t go up there after noon."',
    ] },
    { kind: 'event', x: 2, y: 26, id: 'k6_pit', once: true, text: 'The pit: a ring of stones and the weed burnt to a black cake. More lies drying on the shingle in long brown ropes.' },
    { kind: 'event', x: 3, y: 29, id: 'k6_wreck', once: true, text: 'The ribs of an ore barge on the shingle, red with rust, her stem rope still made fast to a rock. Nothing aboard but gulls.' },
    // The headland: the point, the dwarves' first quay with its slipway, and the winch-house wall.
    { kind: 'event', x: 12, y: 14, id: 'k6_point', once: true, text: 'The point. Grey water on three sides, the port\'s smoke on the fourth, and a rock off the tip white with gulls.' },
    { kind: 'event', x: 19, y: 16, id: 'k6_slip', once: true, text: 'A slipway of dressed stone runs down into the shallows, iron rails let into it. There is red ore dust in every crack.' },
    // The secret: the rails end at the winch-house wall, rubbed bright, and the strongroom behind it.
    { kind: 'event', x: 18, y: 14, id: 'k6_rails', once: true, text: 'The old rails end at the winch-house wall. Their heads are rubbed bright, though no cart has run here in years.' },
    { kind: 'event', x: 16, y: 14, id: 'k6_cell', once: true, text: 'A strongroom behind the wall: tally-sticks on shelves, a cold lamp, and a chest with the dust wiped from its lid.' },
    { kind: 'chest', x: 16, y: 15, id: 'k6_cell_chest', gold: 200, items: ['elixir'] },
  ],
  secrets: [{ x: 17, y: 14, hint: 'k6_rails' }],
  encounters: [
    // Two rock worms under the heath, in the rings of dead heather: the box's group, at 17.
    { id: 'k6_worms', x: 17, y: 27, monsters: ['rock_worm', 'rock_worm'], aware: 3, respawn: RESPAWN.twoDays, roams: false },
  ],
};
