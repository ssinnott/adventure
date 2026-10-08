// Rimewater's part of the world map: its three zones, the plates of its town and dungeons, and its
// sites. docs/areas/rimewater.md is its brief (#485). Glacier Foot is the reach (DESIGN §9), cut from
// the plan to Phase 1.6 (#434, call 7); the Ice Caves' band is the cap's, 30-32, and the row changes
// with the reach's own atlas work.
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  {
    id: 'longmere', name: 'Loch Fada', area: 'rimewater', band: [20, 21], maps: [{ map: 'longmere_m9', at: [392, 254] }], seeds: [[392, 284], [410, 272]], // Longmere, the long lake
    // The crossing line said in ice (#166, #486): how the loch's shore feels to a company under its floor.
    crossing: { harder: 'The loch lies frozen below, and the land is harder than the moor behind.', warning: 'Ice, and nothing on this shore would spare you. The road back over the fells is still open.' },
  },
  { id: 'coldmere', name: 'Loch Fuar', area: 'rimewater', band: [21, 22], seeds: [[344, 300], [340, 280]] }, // Coldmere, the frozen lake
  { id: 'glacierfoot', name: 'Glacier Foot', area: 'rimewater', seeds: [[440, 330], [462, 300]], label: [458, 298] },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'rime_lodge', name: 'Rime Lodge', kind: 'town', planned: true, band: [20, 22], at: [412, 256] }, // behind M9's gate (#486, #487)
  { id: 'sleepers_bay', name: 'The Sleepers\' Bay', kind: 'dungeon', planned: true, band: [21, 22], at: [352, 290] }, // under Loch Fuar's ice, K9: the act's turn (#434, call 6; #490)
  { id: 'ice_caves', name: 'Ice Caves', kind: 'dungeon', planned: true, band: [20, 22], at: [446, 340] }, // the reach: its band is the cap's (#434, call 7)
];

export const SITES: readonly AtlasSite[] = [
  // VIII. Rimewater (docs/areas/rimewater.md §10). The Sleepers' Bay is painted nowhere: the secret is found.
  { name: 'Rime Lodge', icon: 'lodge', at: [410, 262], label: 'right', planned: true },
  { name: 'Ice Caves', icon: 'cave', at: [452, 326], label: 'below', planned: true },
];
