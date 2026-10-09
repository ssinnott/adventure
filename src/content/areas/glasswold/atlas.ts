// The Glasswold's part of the world map: the Wold, on the road, and the Glass, the reach (DESIGN
// §9), with the plate of the Buried Tower and the Riders' sites. docs/areas/glasswold.md is its brief
// (#523). Listed with the area by its first box, the steppe (#525). The seeds put the steppe in
// the Wold and the fused desert in the Glass; the lava flow in the plan's ridges seals the Glass from
// the Ember Waste, so the Riders' gap at the dunes is its one way in (#443, call 5). The Buried Tower's
// band is the cap's, 30-32, and the row changes with the reach's own atlas work.
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  {
    // The mesas first, the zone's way in over E10's west edge (#527), then the steppe (#525), Akordu's box
    // (#526), the Scarp's edge (#528) and the Wold's heart (#529).
    id: 'wold', name: 'The Wold', area: 'glasswold', band: [26, 28],
    maps: [{ map: 'wold_d10', at: [104, 286] }, { map: 'wold_d9', at: [104, 254] }, { map: 'wold_d8', at: [104, 222] }, { map: 'wold_c8', at: [72, 222] }, { map: 'wold_b8', at: [40, 222] }],
    seeds: [[100, 232], [132, 262], [50, 230], [134, 296], [120, 296]], // 140,296 moved west of E10, laid for the Waste (#517)
    // The crossing line (#166, #524), said where a Wold map is first walked into over E10's west edge
    // (D10, #527) or climbed into up the Scarp stair, walked from the Saltings' C7 onto C8's lip at the
    // stair's head (#528), so true both ways in.
    crossing: { harder: 'The grass is long, and what hunts in it is harder than the road behind.', warning: 'Nothing that hunts the grass would spare you. The way back is still open.' },
  },
  { id: 'theglass', name: 'The Glass', area: 'glasswold', seeds: [[80, 282], [90, 300], [78, 312]], label: [96, 304] },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'buried_tower', name: 'Buried Tower', kind: 'dungeon', planned: true, band: [26, 28], at: [84, 286] }, // the reach: its band is the cap's (#443, call 5)
];

export const SITES: readonly AtlasSite[] = [
  // XI. The Glasswold (docs/areas/glasswold.md §10 has the Riders' names).
  { name: 'Buried Tower', icon: 'obelisk', at: [84, 280], label: 'below', planned: true },
  { name: 'Akordu', icon: 'camp', at: [120, 250], label: 'below' }, // the Wold Riders' camp, built with D8 (#526)
  { name: 'Kushtash', icon: 'camp', at: [46, 242], label: 'right' }, // the Eyrie, on the far-west mesa under the rim, built with B8 (#529): the Ranger's third prestige (moved from 132,289; #443, call 5)
];
