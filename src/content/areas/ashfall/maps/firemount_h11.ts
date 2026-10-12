// Ashfall, box H11: Fire Mountain's east flank, behind the road. Country, band 25-26: the ash slope south
// of the Stair's foot between the mountain and the Sheer, the stream running north across it to H10,
// crossed on stones at 12,16; the back of Grimsforge on the west, the scavenger's rocks shutting his hole
// off from this side, and the south-east flow coming in under its crust at the south-west corner and
// going on into H12; the pines under the Sheer in the north-east, where the drake-watcher keeps his fire;
// a cairn on the slope, a drake's shed skin and an old drake's skull; and the drakelings at their shell
// in the warm ash, the box's one fight. The secret: an old axe-head driven into a rock on the slope, and
// behind the rock a hollow with an old war-chest in it.
// In from H10 (#510) walked, over the ash: H10's south edge meets this map's north edge square for
// square, the stream at 4 and 5 and the pines at 28 to 31. The west edge meets G11's east (#513): the
// forge's wall at rows 12 and 13 against ash, the scavenger's rocks at rows 15 to 18 against rock, so his
// hole is shut to this side, and the flow, G11's at rows 27 to 30, going on at this side's 29 to 31. The
// east edge meets I11's west (#501) square for square, the pines at rows 0 to 6, the grass at 7 and 21
// and the ash, walked into the High Spine; the south edge meets H12's north square for square.
// Cut from the atlas by tools/scaffold.ts; docs/areas/ashfall.md §4.10 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const FIREMOUNT_H11: MapDef = {
  id: 'firemount_h11',
  name: 'Fire Mountain',
  kind: 'outdoor',
  density: 'country',
  band: [25, 26],
  region: 'ashfall',
  start: { x: 20, y: 0, facing: SOUTH },
  rows: [
    'aaaa~~aaaaaaaaaaaaaaaaaaaaaapppp',
    'aaaaa~aaaaaaaaaaaaaaaaaaaaaapppp',
    'aaaaa~~aaaaaaaaaaaaaaaaaaaaaappp',
    'aaaaaa~~aaaaaaaaaaaaaaaaaaaaappp',
    'aaaaaaa~aaaaaaaaaaaaaaaaaaaaaapp',
    'aaaaaaa~~aaaaaaaaaaaaaaaaaaaaapp',
    'aaaaaaaa~aaaaaaaaaaaaaaaaaaaaapp',
    'aaaaaaaa~~aaaaaaaaaaaaaaaaaaaa,,',
    'aaaaaaaaa~aaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaa~~aaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaa~aaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaa~aaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaa~~aaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaaa~aaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaaa~aaaaaaaaaaaaaaaaaaaa',
    'raaaaaaaaaaa~aaaaaaaaaaaaaaaaaaa',
    'rraaaaaaaaaa"aaaaaaaaaaaaaaaaaaa',
    'rraaaaaaaaaa~~aaaaaaaaaaaaaaaaaa',
    'raaaaaaaaaaaa~aaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaa~aaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaa~aaaaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaa~aaaaaaaaaaaaaaa,,',
    'aaaaaaaaaaaaaa~aaaaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaa~aaaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaa~aaaaaaaarrrraaaa',
    'aaaaaaaaaaaaaaa~aaaaaaaar::raaaa',
    'aaaaaaaaaaaaaaa~~aaaaaaarrSraaaa',
    'aaaaaaaaaaaaaaaa~aaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaaa~aaaaaaaaaaaaaaa',
    '!aaaaaaaaaaaaaaa~aaaaaaaaaaaaaaa',
    '!aaaaaaaaaaaaaaa~aaaaaaaaaaaaaaa',
    '!!aaaaaaaaaaaaaaa~aaaaaaaaaaaaaa',
  ],
  features: [
    // The stream going north over its stones, and the stones across it.
    { kind: 'event', x: 11, y: 9, id: 'h11_stream', once: true, text: 'The stream runs north over black stones, steaming where it is shallow. It is warm to the wrist.' },
    { kind: 'event', x: 12, y: 16, id: 'h11_stones', once: true, text: 'Flat stones set across the stream a stride apart, worn smooth by feet.' },
    // West of the stream: the mountain over the forge, the forge's back wall, the cairn and the flow.
    { kind: 'event', x: 2, y: 4, id: 'h11_cone', once: true, text: 'West the mountain stands over the forge\'s roof, its smoke leaning away toward the sea.' },
    { kind: 'event', x: 0, y: 12, id: 'h11_forge', once: true, text: 'The back of Grimsforge, black stone, warm through. On the far side of it the anvil rings.' },
    { kind: 'cairn', x: 6, y: 21, id: 'h11_cairn', text: 'A cairn on the slope, grey with ash, and set in its top a drake\'s tooth as long as a hand.', gold: 110, items: ['potion_sp_great'] },
    { kind: 'event', x: 2, y: 30, id: 'h11_flow', once: true, text: 'The flow comes in out of the west under its crust, slower here, and smokes where it cracks.' },
    // Under the Sheer: the pines, the drake-watcher at their edge and his fire, and the Sheer itself.
    { kind: 'event', x: 27, y: 2, id: 'h11_pines', once: true, text: 'Pines under the Sheer, the only green between the mountain and the snow, ash in their needles.' },
    { kind: 'npc', x: 29, y: 7, name: 'A drake-watcher', lines: [
      'An old man in a hide at the pines\' edge, his eyes on the slope below.',
      '"They lay in the warm ash, south, and they come back to it. Leave the hollows be."',
    ] },
    { kind: 'camp', x: 30, y: 8, name: 'The watcher\'s fire', text: 'A fire at the pines\' edge, banked under turf, and a hide stretched over it against the ash.' },
    { kind: 'event', x: 24, y: 12, id: 'h11_sheer', once: true, text: 'East the Sheer goes up out of the ash like a wall, with snow along its top.' },
    // The drakes' slope: a shed skin, the shell where they lay, and an old drake's skull.
    { kind: 'event', x: 27, y: 18, id: 'h11_shed', once: true, text: 'A drake\'s shed skin lies in the ash, whole, like an empty coat of mail.' },
    { kind: 'event', x: 17, y: 24, id: 'h11_nest', once: true, text: 'A ring of broken shell in the warm ash, thick as pots, and the ash inside it trodden flat.' },
    { kind: 'event', x: 21, y: 30, id: 'h11_skull', once: true, text: 'A drake\'s skull in the ash, big as a cart, the teeth long gone out of it.' },
    // The secret: an old axe-head driven into a rock on the slope, and behind the rock a hollow with
    // the old warlord's war-chest in it, split, and a little left.
    { kind: 'event', x: 26, y: 27, id: 'h11_axe', once: true, text: 'An old axe-head driven into the rock up to the eye and rusted fast. The rock round it is cracked.' },
    { kind: 'event', x: 26, y: 25, id: 'h11_hollow', once: true, text: 'A hollow behind the rock, dry, and in it an old war-chest with its lid split. Something is left.' },
    { kind: 'chest', x: 25, y: 25, id: 'h11_chest', gold: 50, items: ['elixir'] },
  ],
  secrets: [{ x: 26, y: 26, hint: 'h11_axe' }],
  encounters: [
    // The box's one fight: the drakelings at their shell in the warm ash, the band's top.
    { id: 'h11_drakelings', x: 19, y: 22, monsters: ['drakeling', 'drakeling', 'drakeling', 'drakeling', 'drakeling', 'drakeling'], aware: 3, respawn: 2880 },
  ],
};
