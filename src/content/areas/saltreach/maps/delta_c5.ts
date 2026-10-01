// The Delta, box C5: the Delta road. Country, band 10-11: the Salt Road on its causeway down the
// fen's east side from the Edge's foot (D5) to Saltmouth's box (C6), the spur to Rietum leaving it
// at the fork for the river and C4, the fen's pools either side, a small brine Rift on an islet and
// the river's west fen over two tidal fords. The leeches are new here, and the first Rift from a
// template. Cut from the atlas by tools/scaffold.ts; docs/areas/saltreach.md §4.2 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import type { When } from '../../../../game/quests.ts';
import { WEST, SOUTH } from '../../../../game/types.ts';
import { rift } from '../../../rifts/index.ts';

/** The Rift on the islet gone quiet: its warden fallen. #191 adds the Tide Stone home, either to do. */
export const RIFT_CLOSED: When = { slain: 'c5_rift:c5_rift_warden' };

/** The brine Rift off the causeway (#165): brinelings in its rooms, and a tide elder at the tear's heart. */
export const C5_RIFT = rift({
  id: 'c5_rift', template: 'ring', material: 'brine', seed: 6, band: [10, 11], region: 'saltreach',
  out: { to: 'delta_c5', tx: 20, ty: 13, tf: SOUTH },
  table: { groups: [['brineling', 'brineling', 'brineling'], ['brineling', 'brineling', 'brineling', 'brineling']], warden: ['tide_elder', 'brineling', 'brineling'] },
  hoard: { gold: 150, items: ['potion_heal', 'potion_heal'] },
  until: RIFT_CLOSED,
});

export const DELTA_C5: MapDef = {
  id: 'delta_c5',
  name: 'The Delta',
  kind: 'outdoor',
  density: 'country',
  band: [10, 11],
  region: 'saltreach',
  start: { x: 31, y: 3, facing: WEST },
  rows: [
    'wwwwwww=wwwwwwwwwwwwww,,,,,,,,,,',
    '~wwwwww==wwwwwwwwwwwwww,,,,,,,,^',
    '~wwwwwww=wwwwwwwwwwwwwww^,^^^^^=',
    '~wwwwwwww=wwwwwwwwwwwwww^^^^^^^=',
    '~wwwwwwww=wwwwwwwwwwwwww^^^^^^^=',
    '~wwwwwwww==wwwwwwwwwwwwww^^^^^=^',
    '~~wwwwwwww=wwwwwwwwwwwwwww^^^^=^',
    'w~wwwwwwww==wwwwwwwwwwwwwww^^==^',
    'w~~wwwwwwww=wwwwwwwwww~~~ww,,=^^',
    'w~~wwwwwwww=wwwwwwwwww~~~www,=,,',
    'w~~wwwwwwwww=wwwwwwwwww~wwww==,,',
    'w~~~wwwwwwww=wwwwww~~~wwwwww=w,,',
    'w~~~wwwwwwwww=wwww~~w~~wwwww=w,,',
    'ww~~~wwwwwwww==wwww~w~wwwwww=w,,',
    'wwwwwwwwwwwwww=wwwwwwwwwwww=ww,,',
    'www~~~wwwwwwww==wwwwwwwwwww=ww~,',
    'wwww~~~wwwwwwww==wwwwwwwwww=w~~,',
    'wwww~~~~wwwwwwww=wwwwwwwwww=w~~_',
    'wwwww~~~~wwwwwww==wwwwwwww=wwww_',
    'wwwwww~~~~wwwwwww==wwwwwww=wwww_',
    'wwwwwww~~~~wwwwwww=wwwwwww=wwww_',
    'wwwwwwww~~~~wwwwwww=wwww~~=w~ww~',
    'wwwwwwww~~~~wwwwwww==ww~~~=S:~;~',
    'wwwwwwww~w~~~wwwwwww==ww~~=w~~~W',
    'wwwwwwww~ww~~~wwwwwww=www==w;~WW',
    'wwwwwwww~ww~~~~wwwwwww=ww=ww;~WW',
    'wwwwwwwwwwww~~~~wwwwww==w=w;~WWW',
    'wwwwwwww~~www~~~~wwwwww===w;~WWW',
    'wwwwwwww~~wwww~~~~wwwwww==w;~WWW',
    'wwwwwwww~~wwwww~~~~wwwwww=w;~WWW',
    'wwwwwwww~~wwwwww~~~~wwwwww=;~WWW',
    'wwwwwwwww~wwwwwwww~~~~wwww=;~WWW',
  ],
  features: [
    // The causeway, from the Edge's foot.
    { kind: 'event', x: 27, y: 1, id: 'c5_foot', once: true, text: 'The Edge\'s foot. The road climbs onto a causeway of stone and runs south, the fen opening either side of it, reed and water to the sky.' },
    { kind: 'shrine', x: 28, y: 12, id: 'c5_shrine', text: 'A shrine on the causeway to the drowned god, a stone bowl at its foot where the tide should reach. The bowl is dry.', stat: 'personality', done: 'The bowl is dry still.' },
    { kind: 'camp', x: 30, y: 10, name: 'The causeway\'s head', text: 'A camp on dry ground at the causeway\'s head: a ring of stones, a stack of cut reed and the cliff at your back.' },
    // The secret: the arch, and the barge drowned under it.
    { kind: 'event', x: 26, y: 22, id: 'c5_arch', text: 'A stone arch carries the road over a channel. A mast\'s stump leans out of the water against its side, and brine glass crusts the stones at the waterline.' },
    { kind: 'event', x: 26, y: 21, id: 'c5_glow', text: 'Night on the causeway. The stones beside the arch glow faintly green, from below.', when: { hours: 'night' } },
    { kind: 'event', x: 27, y: 22, id: 'c5_barge', once: true, text: 'A dry hollow under the arch, and a barge drowned in it, keel up on the mud. Its straw has spilled, and in the straw something catches the light.' },
    { kind: 'chest', x: 28, y: 22, id: 'c5_barge_hold', gold: 90, items: ['brine_shard', 'potion_heal'] },
    // The fork, and the spur north to Rietum.
    { kind: 'sign', x: 24, y: 27, text: 'North by the river: Rietum. South: Saltmouth.' },
    { kind: 'cairn', x: 24, y: 26, id: 'c5_cairn', text: 'A cairn at the fork, raised by bargemen for one of their own the river kept. Every stone in it is round, from the river\'s bed.', gold: 60, items: ['potion_heal'] },
    { kind: 'event', x: 16, y: 17, id: 'c5_glass', once: true, text: 'Brine glass among the reeds, glittering, and the reeds inside it still green. Where the sun is on it, the brine moves.' },
    { kind: 'event', x: 9, y: 4, id: 'c5_spur', once: true, text: 'The spur runs north on the river\'s east bank, a track of trodden reed, the Long Water brown and slow beside it and the Edge over both.' },
    // The Rift on its islet.
    C5_RIFT.way(20, 12),
    // Over the fords, the river's west fen.
    { kind: 'event', x: 3, y: 14, id: 'c5_ford', once: true, text: 'A ford, the river wide and shallow over gravel, and the fen beyond it going on west with no road in it.' },
    { kind: 'event', x: 11, y: 27, id: 'c5_wedge', once: true, text: 'A wedge of fen between two arms of the river. Reeds, standing water and the smell of the sea, which is near now.' },
  ],
  secrets: [{ x: 27, y: 22, hint: 'c5_arch' }],
  encounters: [
    // The fen's pools either side of the causeway, leeches with an eel in the water; a bull toad alone at the far end.
    { id: 'c5_pools_n', x: 25, y: 9, monsters: ['leech', 'leech', 'leech', 'fen_eel'], aware: 3, roams: false, respawn: 1440 },
    { id: 'c5_pools_s', x: 29, y: 15, monsters: ['leech', 'leech', 'leech', 'fen_eel'], aware: 3, roams: false, respawn: 1440 },
    { id: 'c5_toad', x: 26, y: 29, monsters: ['bull_toad'], aware: 4, respawn: 1440 },
  ],
};
