// The Glasswold's part of the world map: the Wold, on the road, and the Glass, the reach (DESIGN
// §9), with the plate of the Buried Tower and the Riders' sites. docs/areas/glasswold.md is its brief
// (#523). Listed with the area by its first box, the steppe (#525). The seeds put the steppe in
// the Wold and the fused desert in the Glass; the lava flow in the plan's ridges seals the Glass from
// the Ember Waste, so the Riders' gap at the dunes is its one way in (#443, call 5). The Buried Tower's
// band is the cap's, 30-32, and the row changes with the reach's own atlas work.
import type { AtlasZone, AtlasPlace, AtlasSite, AtlasLink } from '../../../game/atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  {
    // The mesas first, the zone's way in over E10's west edge (#527), then the steppe (#525), Akordu's
    // box, the camp (#526), the Scarp's edge west of it (#528), the Wold's heart west again (#529) and
    // the Glass's edge south of it (#530); then the country behind the road, the hills north of E10 and
    // the shore north of them (#534); and the bounds (#833), the Scarp's east end over the gulf north of
    // Akordu's box and the north of the other island off the shore.
    id: 'wold', name: 'The Wold', area: 'glasswold', band: [26, 28],
    maps: [{ map: 'wold_d10', at: [104, 286] }, { map: 'wold_d9', at: [104, 254] }, { map: 'wold_d8', at: [104, 222] }, { map: 'wold_c8', at: [72, 222] }, { map: 'wold_b8', at: [40, 222] },
      { map: 'wold_b9', at: [40, 254] }, { map: 'wold_e9', at: [136, 254] }, { map: 'wold_e8', at: [136, 222] },
      { map: 'wold_d7', at: [104, 190] }, { map: 'wold_e7', at: [136, 190] }],
    seeds: [[100, 232], [132, 262], [50, 230], [134, 296], [120, 296]], // 140,296 moved west of E10, laid for the Waste (#517)
    // The crossing line (#166, #524), said where a Wold map is first walked into over E10's west edge
    // (D10, #527, walked) or climbed into up the Scarp stair, walked from the Saltings' C7 onto C8's lip
    // at the stair's head (C8, #528), or walked into over E10's north edge onto the hills behind the road
    // (E9, #534), or walked from the Saltings' C7 and D6 onto the strip under the Scarp in D7 (#833), so
    // true every way in.
    crossing: { harder: 'The grass is long, and what hunts in it is harder than the road behind.', warning: 'Nothing that hunts the grass would spare you. The way back is still open.' },
    // Onto the mesas over E10's west edge, past the pride at its kill by the way in and the south pride in
    // the grass, along the great mesa's foot to the mesa fight in the scree under its north face, out to the
    // scorpions at the dunes' edge and the basilisk alone under the small mesa (#527); then onto the steppe
    // over its south edge, past the pride at its kill, west along the road past the scorpions at the dunes'
    // edge to the glass walker at the far south-west, and north up the Riders' track past the north pride (#525).
    road: ['wold_d10:d10_pride', 'wold_d10:d10_pride_south', 'wold_d10:d10_mesa', 'wold_d10:d10_scorpions', 'wold_d10:d10_basilisk', 'wold_d9:d9_pride', 'wold_d9:d9_scorpions', 'wold_d9:d9_walker', 'wold_d9:d9_pride_north'],
  },
  { id: 'theglass', name: 'The Glass', area: 'glasswold', seeds: [[80, 282], [90, 300], [78, 312]], label: [96, 304], reach: true },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'buried_tower', name: 'Buried Tower', kind: 'dungeon', planned: true, band: [26, 28], at: [84, 286] }, // the reach: its band is the cap's (#443, call 5)
  { id: 'karaordu', kind: 'dungeon', band: [28, 29], at: [112, 225] }, // the enclave, the khans' barrow under the hills over Akordu's box, its door at D7's 8,30 (#833, #845)
  { id: 'kushdag', kind: 'dungeon', band: [30, 32], at: [123, 219] }, // the lair, the Foal-taker's eyrie in the Scarp's east face, its door at D7's 19,24 (#833, #845, #846)
];

export const SITES: readonly AtlasSite[] = [
  // XI. The Glasswold (docs/areas/glasswold.md §10 has the Riders' names).
  { name: 'Buried Tower', icon: 'obelisk', at: [84, 280], label: 'below', planned: true },
  { name: 'Akordu', icon: 'camp', at: [120, 250], label: 'below' }, // the Wold Riders' camp, built with D8 (#526)
  { name: 'Kushtash', icon: 'camp', at: [46, 242], label: 'right' }, // the Eyrie, on the far-west mesa under the rim, built with B8 (#529): the Ranger's third prestige (moved from 132,289; #443, call 5)
];

export const LINKS: readonly AtlasLink[] = [
  { from: 'theglass', to: 'buried_tower', kind: 'enter', a: [84, 280] },
];
