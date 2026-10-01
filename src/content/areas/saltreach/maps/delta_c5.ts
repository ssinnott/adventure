// A draft of The Delta, cut from the atlas at 72,126 by tools/scaffold.ts delta 72 126. The
// ground is the atlas's square for square; everything else is to be authored (EXPANSION §8.2).
// Terrain: marsh 722, shallow 115, road 74, grass 38, hills 37, sea 23, tidal 11, sand 4.
// Zones in the cut: delta 716, downs 285, none 23.
// - Area saltreach has no region yet, so the draft shares the Foreland's sky until it has.
// - Box C5.
// - The road crosses the north edge at 7,0 8,0.
// - The road crosses the east edge at 31,2 31,3 31,4.
// - The road crosses the south edge at 26,31.
import type { MapDef } from '../../../../game/map.ts';
import { WEST } from '../../../../game/types.ts';

export const DELTA_C5: MapDef = {
  id: 'delta_c5',
  name: 'The Delta',
  kind: 'outdoor',
  density: 'country',
  band: [10, 11],
  region: 'saltreach',
  start: { x: 31, y: 2, facing: WEST },
  rows: [
    'wwwwwww==wwwwwwwwwwwww,,,,,,,,,,',
    'wwwwwwww=wwwwwwwwwwwwww,,,,,,,,^',
    'wwwwwwww=wwwwwwwwwwwwwww^,^^^^^=',
    'wwwwwwwww=wwwwwwwwwwwwww^^^^^^^=',
    '~wwwwwwww=wwwwwwwwwwwwww^^^^^^^=',
    '~wwwwwwww==wwwwwwwwwwwwww^^^^^=^',
    '~~wwwwwwww=wwwwwwwwwwwwwww^^^^=^',
    '~~wwwwwwww==wwwwwwwwwwwwwww^^==^',
    '~~~wwwwwwww=wwwwwwwwwwwwwww,,=^^',
    '~~~wwwwwwww=wwwwwwwwwwwwwwww,=,,',
    'w~~wwwwwwwww=wwwwwwwwwwwwwww==,,',
    'w~~~wwwwwwww=wwwwwwwwwwwwwww=w,,',
    'w~~~wwwwwwwww=wwwwwwwwwwwwww=w,,',
    'ww~~~wwwwwwww==wwwwwwwwwwwww=w,,',
    'ww~~~wwwwwwwww=wwwwwwwwwwww=ww,,',
    'www~~~wwwwwwww==wwwwwwwwwww=ww,,',
    'wwww~~~wwwwwwww==wwwwwwwwww=ww,,',
    'wwww~~~~wwwwwwww=wwwwwwwwww=www_',
    'wwwww~~~~wwwwwww==wwwwwwww=wwww_',
    'wwwwww~~~~wwwwwww==wwwwwww=wwww_',
    'wwwwwww~~~~wwwwwww=wwwwwww=wwww_',
    'wwwwwwww~~~~wwwwwww=wwwwww=wwww~',
    'wwwwwwww~~~~wwwwwww==wwwww=ww;;~',
    'wwwwwwww~w~~~wwwwwww==wwww=w;~~W',
    'wwwwwwww~ww~~~wwwwwww=www==w;~WW',
    'wwwwwwww~ww~~~~wwwwwww=ww=ww;~WW',
    'wwwwwwww~www~~~~wwwwww==w=w;~WWW',
    'wwwwwwww~~www~~~~wwwwww===w;~WWW',
    'wwwwwwww~~wwww~~~~wwwwww==w;~WWW',
    'wwwwwwww~~wwwww~~~~wwwwww=w;~WWW',
    'wwwwwwww~~wwwwww~~~~wwwwww=;~WWW',
    'wwwwwwwww~wwwwwww~~~~wwwww=;~WWW',
  ],
};
