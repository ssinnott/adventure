// Rimewater's part of the world map: its three zones, the plates of its town and dungeons, and its
// sites. docs/areas/rimewater.md is its brief (#485). Glacier Foot is the reach (DESIGN §9), cut from
// the plan to Phase 1.6 (#434, call 7); the Ice Caves' band is the cap's, 30-32, and the row changes
// with the reach's own atlas work.
import type { AtlasZone, AtlasPlace, AtlasSite, AtlasLink } from '../../../game/atlas.ts';
import { laid } from '../../../game/atlas.ts';
import { PLAN } from '../../atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  {
    id: 'longmere', name: 'Loch Fada', area: 'rimewater', band: [20, 21], maps: [laid(PLAN, 'longmere_m9'), laid(PLAN, 'longmere_l9'), laid(PLAN, 'longmere_l10'), laid(PLAN, 'longmere_l11'), laid(PLAN, 'longmere_m10'), laid(PLAN, 'longmere_m11'), laid(PLAN, 'longmere_n9'), laid(PLAN, 'longmere_l12')], seeds: [[392, 284], [410, 272]], // Longmere, the long lake
    // The crossing line said in ice (#166, #486): how the loch's shore feels to a company under its floor.
    crossing: { harder: 'The loch lies frozen below, and the land is harder than the moor behind.', warning: 'Ice, and nothing on this shore would spare you. The road back over the fells is still open.' },
    // Down from the notch past the lynxes in the pines at the road's foot to the lodge's gate, and out
    // on the ice from the lake wall to the hole past the pike under it (#486).
    road: ['longmere_m9:m9_lynx_pines', 'longmere_m9:m9_pike_wall'],
  },
  {
    id: 'coldmere', name: 'Loch Fuar', area: 'rimewater', band: [21, 22], maps: [laid(PLAN, 'coldmere_k9'), laid(PLAN, 'coldmere_k10'), laid(PLAN, 'coldmere_j9'), laid(PLAN, 'coldmere_k11'), laid(PLAN, 'coldmere_k12')], seeds: [[344, 300], [340, 280]], // Coldmere, the frozen lake
    // The crossing line said in ice (#166, #489): how the cold loch's shore feels to a company under its floor.
    crossing: { harder: 'The cold loch lies white below, and the land is harder than the long loch\'s shore behind.', warning: 'Black ice, and nothing on this shore would spare you. The way back east under the pines is still open.' },
    // In from L9 under the pines past the lynxes there, and down the shore past the lynxes at the
    // loch's foot to the crack in the ice and the door (#489).
    road: ['coldmere_k9:k9_lynx_pines', 'coldmere_k9:k9_lynx_foot'],
  },
  { id: 'glacierfoot', name: 'Glacier Foot', area: 'rimewater', seeds: [[440, 330], [462, 300]], label: [458, 298], reach: true },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'rime_lodge', kind: 'town', at: [412, 256] }, // on M9, behind the lodge's gate at 18,8 (#486, #487)
  { id: 'sleepers_bay', kind: 'dungeon', at: [352, 284] }, // the Sleepers' Bay: the stair under Loch Fuar's ice, through K9's door at 24,30 (#489, #490)
  { id: 'sleepers_bay2', kind: 'dungeon', at: [352, 290] }, // the bay itself, at the stair's foot: the act's turn (#434, call 6)
  { id: 'ice_caves', name: 'Ice Caves', kind: 'dungeon', planned: true, band: [20, 22], at: [446, 340] }, // the reach: its band is the cap's (#434, call 7)
  { id: 'creag_fionn', kind: 'dungeon', band: [22, 23], at: [371, 359] }, // the enclave, the trolls' winter cave in the rim's face, its door at L12's 11,4 (#832, #845)
  { id: 'spittal', kind: 'dungeon', band: [30, 32], at: [330, 370] }, // the lair, the brothers' house cut in the mountain under the pass, its door at K12's 2,15 (#832, #845, #846)
  { id: 'spittal2', kind: 'dungeon', band: [30, 32], at: [330, 376] }, // the Infirmary, below it, where the Infirmarer keeps the Wakerobe
];

export const SITES: readonly AtlasSite[] = [
  // VIII. Rimewater (docs/areas/rimewater.md §10). The Sleepers' Bay is painted nowhere: the secret is found.
  { name: 'Rime Lodge', icon: 'lodge', at: [410, 262], label: 'right' },
  { name: 'Ice Caves', icon: 'cave', at: [452, 326], label: 'below', planned: true },
];

export const LINKS: readonly AtlasLink[] = [
  { from: 'longmere', to: 'rime_lodge', kind: 'enter', a: [410, 262] },
  { from: 'coldmere', to: 'sleepers_bay', kind: 'enter', a: [352, 284], note: 'under the ice' },
  { from: 'glacierfoot', to: 'ice_caves', kind: 'enter', a: [452, 326] },
];
