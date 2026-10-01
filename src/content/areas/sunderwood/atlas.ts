// Sunderwood's part of the world map: its two zones, the plates of its town and dungeon, and its
// sites. Nothing of it is built yet, so it is listed in no AREAS; the plan (src/content/atlas.ts)
// spreads these rows in where its own were until the area's first map (#195) lists it.
// docs/areas/sunderwood.md is its brief.
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  { id: 'eaves', name: 'The Eaves', area: 'sunderwood', band: [14, 15], seeds: [[292, 40], [300, 86]] },
  { id: 'lanternwood', name: 'Lanternwood', area: 'sunderwood', band: [15, 16], seeds: [[372, 50], [370, 96]], label: [378, 84] },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'lantern_watch', name: 'Lantern Watch', kind: 'town', planned: true, band: [14, 16], at: [372, 36] },
  { id: 'the_sunder', name: 'The Sunder', kind: 'dungeon', planned: true, band: [15, 16], at: [320, 62] },
];

export const SITES: readonly AtlasSite[] = [
  // V. Sunderwood.
  { name: 'Lantern Watch', icon: 'tower', at: [372, 46], label: 'below', planned: true },
  { name: 'The Sunder', icon: 'rift', at: [338, 70], label: 'right', planned: true },
  { name: 'Sunderfall', icon: 'falls', at: [340, 60], label: 'none', planned: true }, // its shrine, the Paladin's second prestige (#19)
];
