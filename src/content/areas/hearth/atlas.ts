// Hearth Isle's part of the world map: the isle, its deep places under it and the Hearth's site.
// docs/areas/hearth_isle.md is its brief (#739). Listed with the area by its first box, the isle (H6,
// #753), which took these rows out of the plan (src/content/atlas.ts) so the Hearth counts as new here
// (§7; §9.1, 43). The Hearth and Anchorhold (I6, #754) are built and drop `planned`; the Underdeep
// (#757, #758) and the Core (#759) keep it until their maps. The bands are the plan's (§8): the isle 28-29,
// the Ways 30, the Stair 30-31, the Heart 32, so the area's row is the curve's, 28-32.
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  {
    // The isle's body, H6 (#753), then the east rim, I6 (#754).
    id: 'hearthisle', name: 'Hearth Isle', area: 'hearth', band: [28, 29],
    maps: [{ map: 'hearthisle_h6', at: [232, 158] }, { map: 'hearthisle_i6', at: [264, 158] }],
    seeds: [[256, 172]],
    // The crossing line (#166, #524): said where the isle is first walked into, off the last crossing's boat.
    crossing: { harder: 'The isle, and the light\'s heat on your face. What keeps the temple is harder than anything on the far side.', warning: 'The isle. Nothing on it would spare you, and the boat is the only way back.' },
  },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'underdeep', name: 'The Underdeep', kind: 'deep', planned: true, order: 13, band: [30, 31], at: [216, 168] },
  { id: 'core', name: 'The Core', kind: 'deep', planned: true, order: 14, band: [32, 32], at: [216, 176] },
];

export const SITES: readonly AtlasSite[] = [
  // XII. Hearth Isle (docs/areas/hearth_isle.md §10 has the names).
  { name: 'The Hearth', icon: 'hearth', at: [256, 174], label: 'none' }, // the column's foot on H6, 24,16 (#753)
  { name: 'Anchorhold', icon: 'tower', at: [268, 176], label: 'right' }, // the cell on I6, 4,18 (#754): the Cleric's third prestige
];
