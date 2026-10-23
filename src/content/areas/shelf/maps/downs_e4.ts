// Callow Downs, box E4: the Downs' last shore. Country, band 4-5, the bounds' (#837): the down's
// last grass running on from Crowness's south-west and the top of Kestrel Edge, a low cliff across
// it and under the cliff a strand of grey sand, the sea on every side but the land's. A cairn of
// flints on the last rise; a post of driftwood hung with holed stones above the tide's line, a shrine;
// at the north-east shore a stack of rock with crab shells heaped at its foot, and behind its face a
// crabber's store. The cliff's face at 3,6 is left bare for the lair's door, the Hag's sea cave
// (docs/areas/shelf.md §12.3). In from E3 (#67) over its north edge and from D4 (#72) over its west,
// square for square. No group. Laid whole in the Downs, cut from the atlas with the rocks drawn in;
// docs/areas/shelf.md §12.2 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const DOWNS_E4: MapDef = {
  id: 'downs_e4',
  name: 'Callow Downs',
  kind: 'outdoor',
  density: 'country',
  band: [4, 5],
  start: { x: 6, y: 0, facing: SOUTH },
  rows: [
    ',,,,,,,,,__~~WWWWWWWWWWWWWWWWWWW',
    ',,,,,,,,,_rrrWWWWWWWWWWWWWWWWWWW',
    ',,,,,,,,,_S"rWWWWWWWWWWWWWWWWWWW',
    ',,,,,,,,~~rrrWWWWWWWWWWWWWWWWWWW',
    ',,,,,,,,~~WWWWWWWWWWWWWWWWWWWWWW',
    ',rrrr,,,~~WWWWWWWWWWWWWWWWWWWWWW',
    ',rrrr,~~~WWWWWWWWWWWWWWWWWWWWWWW',
    '______~~WWWWWWWWWWWWWWWWWWWWWWWW',
    '___~~~~WWWWWWWWWWWWWWWWWWWWWWWWW',
    '__~~~~WWWWWWWWWWWWWWWWWWWWWWWWWW',
    '_~~WWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '~~WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '~WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
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
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  ],
  features: [
    // In from E3's grass, the down running out at the low cliff and the strand under it.
    { kind: 'event', x: 6, y: 4, id: 'e4_strand', once: true, text: 'The down ends in a low cliff, and under it a strand of grey sand runs out to the sea.' },
    // A cairn of flints on the down's last rise.
    { kind: 'cairn', x: 2, y: 2, id: 'e4_cairn', text: 'A cairn of flints on the down\'s last rise, the sea grey below it on two sides.', gold: 30, items: ['potion_sp'] },
    // A post of driftwood above the tide's line, hung with holed stones: a shrine.
    { kind: 'shrine', x: 0, y: 9, id: 'e4_post', text: 'A post of driftwood above the tide\'s line, hung with stones the sea has holed, each on its cord.', stat: 'personality', done: 'The holed stones knock on their post in the wind.' },
    // The secret: crab shells heaped at the stack's foot, and behind its face the store where a
    // crabber kept his pots, a square in from the strand.
    { kind: 'event', x: 9, y: 2, id: 'e4_shells', once: true, text: 'Crab shells picked clean and heaped at the rock\'s foot, more than any gull leaves.' },
    { kind: 'event', x: 11, y: 2, id: 'e4_store', once: true, text: 'A dry hollow in the rock: withy pots stacked to its roof, a coil of line and a crock under them.' },
    { kind: 'chest', x: 11, y: 2, id: 'e4_crock', gold: 80, items: ['elixir'] },
  ],
  secrets: [{ x: 10, y: 2, hint: 'e4_shells' }],
};
