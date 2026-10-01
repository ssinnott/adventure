// A draft of The Delta, cut from the atlas at 104,126 by tools/scaffold.ts delta 104 126. The
// ground is the atlas's square for square; everything else is to be authored (EXPANSION §8.2).
// Terrain: sea 770, shallow 115, grass 72, hills 34, sand 30, road 3.
// Zones in the cut: none 770, downs 254.
// - Area saltreach has no region yet, so the draft shares the Foreland's sky until it has.
// - Box D5.
// - The north edge faces downs_d4 on 32 squares: its row 31 is its seam, and both sides are the author's.
// - The road crosses the north edge at 0,0.
// - The road crosses the west edge at 0,0 0,1 0,2.
// - Site Sylmeer (water) at 20,24.
import type { MapDef } from '../../../../game/map.ts';
import { EAST } from '../../../../game/types.ts';

export const DELTA_D5: MapDef = {
  id: 'delta_d5',
  name: 'The Delta',
  kind: 'outdoor',
  density: 'country',
  band: [10, 11],
  region: 'saltreach',
  start: { x: 0, y: 0, facing: EAST },
  rows: [
    '=,,,,,,^~~WWWWWWWWWWWWWWWWWWWWWW',
    '=^,,,,,^~~WWWWWWWWWWWWWWWWWWWWWW',
    '=^,,,,,^~~WWWWWWWWWWWWWWWWWWWWWW',
    '^^,,,,,^~~WWWWWWWWWWWWWWWWWWWWWW',
    '^^^,,,_~~WWWWWWWWWWWWWWWWWWWWWWW',
    '^^^^,,,^~~WWWWWWWWWWWWWWWWWWWWWW',
    '^^^^,,_~~WWWWWWWWWWWWWWWWWWWWWWW',
    '^^,,,,_~~WWWWWWWWWWWWWWWWWWWWWWW',
    '^,,,,,_~~WWWWWWWWWWWWWWWWWWWWWWW',
    ',,,,,__~~WWWWWWWWWWWWWWWWWWWWWWW',
    ',,,,_~~~WWWWWWWWWWWWWWWWWWWWWWWW',
    ',,,_~~~WWWWWWWWWWWWWWWWWWWWWWWWW',
    ',,_~~WWWWWWWWWWWWWWWWWWWWWWWWWWW',
    ',_~~WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    ',_~~WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '_~~WWWWWWWWWWWWW~~~WWWWWWWWWWWWW',
    '_~~WWWWWWWWWWW~~~~~~WWWWWWWWWWWW',
    '~~WWWWWWWWWWW~~~___~~WWWWWWWWWWW',
    '~~WWWWWWWWWW~~__,,_~~WWWWWWWWWWW',
    '~~WWWWWWWWWW~~_,,,_~~WWWWWWWWWWW',
    '~~WWWWWWWWWW~~_,,,,_~~WWWWWWWWWW',
    '~WWWWWWWWWWW~~^^^,,_~~WWWWWWWWWW',
    'WWWWWWWWWWWW~~^^^^__~~WWWWWWWWWW',
    'WWWWWWWWWWWW~~^^^^~~~WWWWWWWWWWW',
    'WWWWWWWWWWWWW~~~~~~~WWWWWWWWWWWW',
    'WWWWWWWWWWWWWW~~~~WWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWW~~~~~WWWWWWWWWWWWWWWWWWW',
    'WWWWWWW~~~~~~~WWWWWWWWWWWWWWWWWW',
    'WWWWWW~~,,___~~WWWWWWWWWWWWWWWWW',
    'WWWWWW~~,,,,,_~~WWWWWWWWWWWWWWWW',
  ],
};
