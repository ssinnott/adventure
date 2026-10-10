// Ashfall, box H12: Fire Mountain's south-east foot, behind the road. Country, band 25-26: the south-east
// flow's end, where it stops under a wall of its own crust at 8,8; the spring at 17,1 where the stream
// rises that runs north across H11; the ash running south to the rim, the world's end, and east into the
// grass and the hills under the Sheer; a cairn where the ash gives out, the shell of a hatching, a drake's
// wallow and a goat's horns; and the drakelings on the warm ash by the flow's end, the box's one fight.
// The secret: the crust at the flow's very end split along one line, and behind it the tube the flow ran
// out of.
// In from H11 walked, over the ash: H11's south edge meets this map's north edge square for square, the
// flow at H11's 0 and 1 going on at this side's 1 and 2 and the stream at 17. The west edge meets G12's
// east square for square, the ash and the rim; the east edge meets I12's west (#508) square for square,
// the ash, the grass at rows 12 to 14 and the hills at 15 to 19, walked into the High Spine, and the rim
// below; the south edge is the rim, past which the world ends.
// Cut from the atlas by tools/scaffold.ts, the world's end cut by hand; docs/areas/ashfall.md §4.10 is its
// brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const FIREMOUNT_H12: MapDef = {
  id: 'firemount_h12',
  name: 'Fire Mountain',
  kind: 'outdoor',
  density: 'country',
  band: [25, 26],
  region: 'ashfall',
  start: { x: 22, y: 0, facing: SOUTH },
  rows: [
    'a!!aaaaaaaaaaaaaa~aaaaaaaaaaaaaa',
    'aa!!aaaaaaaaaaaaa~aaaaaaaaaaaaaa',
    'aa!!aaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'aaa!!aaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'aaaa!!aaaaaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaa!!aaaaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaa!!aaaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaa!!aaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaa!!aaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaarSraaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaar:raaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaar:raaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaarrraaaaaaaaaaaaaaaaaaaa,,,',
    'MMaaaaaaaaaaaaaaaaaaaaaaaaaaa,,,',
    'MMMMaaaaaaaaaaaaaaaaaaaaaaaaa,,,',
    'MMMMMMaaaaaaaaaaaaaaaaaaaaaaaa^^',
    'MMMMMMMMMMMaMaaaaaaaaaaaaaaaa^^^',
    'MMMMMMMMMMMMMMMMaaaaaaaaaaaa^^^^',
    'MMMMMMMMMMMMMMMMMMMMMMMMa^^^^^^^',
    'MMMMMMMMMMMMMMMMMMMMMMMMMM^^^^^^',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMM%MMMMMMMMMMMMMMMMMMMMMMMMMMM',
    '%%%%%%MMMMMMMMMMMMMMMMMMMMMMMMMM',
    '%%%%%%%%%MMMMMMMMMMMMMMMMMMMMMMM',
    '%%%%%%%%%%%%%MMMMMMMMMMMMMMMMMMM',
    '%%%%%%%%%%%%%%MMMMMMMMMMMMMMMMMM',
    '%%%%%%%%%%%%%%%%%%%MM%%MMMMMMMMM',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%MMMMMM',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%MMMM',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%M',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
  ],
  features: [
    // The flow's end: a drake's track along its edge, the wall of crust it stopped under, the shell of a
    // hatching on the ash beside it and a goat's horns.
    { kind: 'event', x: 1, y: 4, id: 'h12_track', once: true, text: 'Along the flow\'s edge a drake\'s track, the claws and the drag of a tail, going south.' },
    { kind: 'event', x: 9, y: 7, id: 'h12_end', once: true, text: 'The flow stops here under a wall of its own crust, higher than a man, black and warm yet.' },
    { kind: 'event', x: 13, y: 4, id: 'h12_shell', once: true, text: 'Shell in the ash, thick as a pot and curved, glossy inside. Something hatched here and went.' },
    { kind: 'event', x: 4, y: 12, id: 'h12_horns', once: true, text: 'A goat\'s horns on the ash, and nothing else of the goat.' },
    // The spring where the stream rises, and the old coins on its bed.
    { kind: 'shrine', x: 17, y: 2, id: 'h12_spring', text: 'The stream rises here between two stones, warm, and old coins lie green on its bed.', stat: 'luck', done: 'The spring where the stream rises, the coins green on its bed.' },
    // East: a drake's wallow, the cairn where the ash gives out to grass and the hills; south, the rim.
    { kind: 'event', x: 24, y: 2, id: 'h12_wallow', once: true, text: 'Ash to the knee in a hollow, soft as flour, and a drake\'s wallow pressed into it, still warm.' },
    { kind: 'cairn', x: 26, y: 10, id: 'h12_cairn', text: 'A cairn where the ash gives out to grass, built tall, with a ram\'s horns set on its top.', gold: 100, items: ['potion_sp_great'] },
    { kind: 'event', x: 27, y: 17, id: 'h12_hills', once: true, text: 'East the hills go up green under the Sheer, and the snow begins on the Spine above them.' },
    { kind: 'event', x: 16, y: 15, id: 'h12_rim', once: true, text: 'South the slope goes up into the rim, black and bare. Over it there is only cloud.' },
    // The secret: the crust at the flow's very end split along one line, the air cool out of it; behind
    // it the tube the flow ran out of, and what a drake carried in.
    { kind: 'event', x: 7, y: 8, id: 'h12_seam', once: true, text: 'At the flow\'s very end the crust is split along one line, straight as a rule. Cool air comes out.' },
    { kind: 'event', x: 7, y: 10, id: 'h12_tube', once: true, text: 'A tube the flow ran out of, glazed black inside, and a drake\'s leavings on its floor.' },
    { kind: 'chest', x: 7, y: 11, id: 'h12_chest', gold: 50, items: ['elixir'] },
  ],
  secrets: [{ x: 7, y: 9, hint: 'h12_seam' }],
  encounters: [
    // The box's one fight: the drakelings on the warm ash by the flow's end, the band's top.
    { id: 'h12_drakelings', x: 14, y: 9, monsters: ['drakeling', 'drakeling', 'drakeling', 'drakeling', 'drakeling', 'drakeling'], aware: 3, respawn: 2880 },
  ],
};
