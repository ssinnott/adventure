// The Delta, box D5: the shore under the Edge. Country, band 10-11: the Salt Road's three squares
// down D4's foot to C5, where the milestone stands; the gulf's shore under the cliff; and a shingle
// bar out to an islet and on to a spit, with tidal flats either side. The rest is Sylmeer. Laid
// with C5 (#170) so the road out of D4 has somewhere to go; docs/areas/saltreach.md §4.2 is its
// brief. Cut from the atlas by tools/scaffold.ts.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const DELTA_D5: MapDef = {
  id: 'delta_d5',
  name: 'The Delta',
  kind: 'outdoor',
  density: 'country',
  band: [10, 11],
  region: 'saltreach',
  start: { x: 0, y: 0, facing: SOUTH },
  rows: [
    '==,,,,,^~~WWWWWWWWWWWWWWWWWWWWWW',
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
    ',_~~;;WWWWWWWWWWWWWWWWWWWWWWWWWW',
    ',_____;WWWWWWWWWWWWWWWWWWWWWWWWW',
    '_~~WW____;;WWWWW~~~WWWWWWWWWWWWW',
    '_~~WWWWW____;;~~~~~~WWWWWWWWWWWW',
    '~~WWWWWWWWW________~~WWWWWWWWWWW',
    '~~WWWWWWWWWW~~__,,_~~WWWWWWWWWWW',
    '~~WWWWWWWWWW~~_,,,_~~WWWWWWWWWWW',
    '~~WWWWWWWWWW~~_,,,,_~~WWWWWWWWWW',
    '~WWWWWWWWWWW~~^^^,,_~~WWWWWWWWWW',
    'WWWWWWWWWWWW~~^^^^__~~WWWWWWWWWW',
    'WWWWWWWWWWWW~~^^^^~~~WWWWWWWWWWW',
    'WWWWWWWWWWWWW~_;~~~~WWWWWWWWWWWW',
    'WWWWWWWWWWWWWW_;~~WWWWWWWWWWWWWW',
    'WWWWWWWWWWWWW__WWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWW__WWWWWWWWWWWWWWWWWW',
    'WWWWWWWW~~~__WWWWWWWWWWWWWWWWWWW',
    'WWWWWWW~~~__~~WWWWWWWWWWWWWWWWWW',
    'WWWWWW~~,,___~~WWWWWWWWWWWWWWWWW',
    'WWWWWW~~,,,,,_~~WWWWWWWWWWWWWWWW',
  ],
  features: [
    { kind: 'sign', x: 1, y: 1, text: 'SALTMOUTH 4, RIETUM 9.' },
    // The Cartographers' first task (#181): the chain begins at the stone once the Guild has sent the company.
    { kind: 'event', x: 0, y: 1, id: 'd5_milestone', once: true, after: { flag: 'q_carto_chain' }, text: 'The chain runs out from the foot of the stone, a hundred links, and the count begins. SALTMOUTH 4, it says; the Guild\'s chart says the same. So far it holds.' },
    { kind: 'event', x: 5, y: 9, id: 'd5_shore', once: true, text: 'The sand under the Edge, and east of it the gulf, grey as far as the eye goes. Sylmeer.' },
    { kind: 'event', x: 4, y: 14, id: 'd5_bar', once: true, text: 'A bar of shingle runs out from the shore across the flats to an islet, the tide sucking at the mud either side of it.' },
    { kind: 'npc', x: 16, y: 19, name: 'a hermit on the islet', lines: [
      'An old woman of the Tidefolk sits on the islet\'s rock mending a net with no boat to go with it, and does not look up.',
      '"You came down the Edge. Then you\'ve seen the fen glitter. It never did before midsummer." She ties a knot. "A barge went by here one night, out past the islet towards the sea, no lamp lit, and a light in its sacking all the same. Green. I know what the Stone looks like in the dark. Everyone here does."',
      '"It came down the river, so it passed Rietum first, and the quay there never sleeps. Go up the spur and ask what they saw. They\'ll not tell a stranger much." She holds the net up to the light. "The one who counts has not sung since. Nor have I."',
    ] },
    { kind: 'event', x: 9, y: 30, id: 'd5_spit', once: true, text: 'A spit of sand at the bar\'s end, and a wreck\'s ribs standing out of it, grey as the shingle, picked clean of all that would burn.' },
  ],
};
