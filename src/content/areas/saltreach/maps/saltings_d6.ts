// The Saltings, box D6: the plate's old place. Country, band 11-12: two pieces of land in the sea off
// Saltmouth, the end of D5's spit at the top and the tidal shore under the town at the west; on the spit
// the footing of the old harbour light, a round of black stone where Saltmouth's plate stood before the
// town took it, with two bull toads come out of the Delta's reeds, and in the footing the keeper's store,
// walled up, found from the hollow boom of each wave under it; on the shore a cairn of ballast stones and
// a wreck's ribs. The spit is walked onto from D5 and the shore from C6; the sea's other edges are the
// sea's. Cut from the atlas by tools/scaffold.ts and reshaped by hand; docs/areas/saltreach.md §12 is
// its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const SALTINGS_D6: MapDef = {
  id: 'saltings_d6',
  name: 'The Saltings',
  kind: 'outdoor',
  density: 'country',
  band: [11, 12],
  region: 'saltreach',
  start: { x: 10, y: 0, facing: SOUTH },
  rows: [
    'WWWWWW~~,,,,,_~~WWWWWWWWWWWWWWWW',
    'WWWWWW~~_,,,,_~~WWWWWWWWWWWWWWWW',
    'WWWWWW~~_,,,,_~~WWWWWWWWWWWWWWWW',
    'WWWWWWW~~____~~WWWWWWWWWWWWWWWWW',
    'WWWWWWWW~~BSB~WWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWBB:BBWWWWWWWWWWWWWWWWWW',
    '~WWWWWWWWB:::BWWWWWWWWWWWWWWWWWW',
    ';WWWWWWWWBB:BBWWWWWWWWWWWWWWWWWW',
    '_;~WWWWWWWBBBWWWWWWWWWWWWWWWWWWW',
    'B;~WWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'B_;~WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '__;~WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '___;~WWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '___;~WWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '___;~WWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '___;~WWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '___;~WWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '__;~WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '_;~WWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '_~WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    ';WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '~WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '~WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '~WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '~WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    ';__~WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    ';__~WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    ';__~WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    ';__~WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '-__~WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '-_~WWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '-;~WWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  ],
  features: [
    // The footing of the old light at the spit's end, and the store walled up in it.
    { kind: 'event', x: 11, y: 3, id: 'd6_boom', text: 'The footing of the old harbour light, a round of black stone at the spit\'s end. Each wave booms hollow under it.' },
    { kind: 'event', x: 11, y: 4, id: 'd6_store', once: true, text: 'The keeper\'s store, walled up when the light went to the town: a bunk, a cask of oil, a log of wrecks, and a strongbox.' },
    { kind: 'chest', x: 11, y: 7, id: 'd6_store_chest', gold: 150, items: ['potion_heal'] },
    // The shore under the town: ballast thrown out of holds, and a wreck.
    { kind: 'cairn', x: 1, y: 13, id: 'd6_cairn', text: 'A cairn of ballast stones on the shore under the town, each from another port, thrown out of a hold and left.', gold: 60, items: ['potion_heal'] },
    { kind: 'event', x: 2, y: 27, id: 'd6_ribs', once: true, text: 'A wreck\'s ribs stand out of the sand, a lighter\'s by their size. The tide has taken every nail and the town the rest.' },
  ],
  secrets: [{ x: 11, y: 4, hint: 'd6_boom' }],
  encounters: [
    // Two bull toads come out of the Delta's reeds onto the spit, the box's one fight.
    { id: 'd6_toads', x: 12, y: 2, monsters: ['bull_toad', 'bull_toad'], aware: 3, roams: false, respawn: 1440 },
  ],
};
