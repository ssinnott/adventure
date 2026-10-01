// Wrackholm's part of the world map: its one zone, with E6 (#187) and F6 (#189) laid at their
// boxes, the plates of Kelp Hole's two levels (#188) and the Tide Ship, and its sites. The Area
// carries it (index.ts). The Dead-Drop below the ship stays the plan's (#22).
// docs/areas/wrackholm.md is its brief.
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  { id: 'wrackholm', name: 'Wrackholm', area: 'wrackholm', band: [12, 14], maps: [{ map: 'wrackholm_e6', at: [136, 158] }, { map: 'wrackholm_f6', at: [168, 158] }], seeds: [[168, 176]] },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'smugglers_cove', kind: 'dungeon', at: [150, 158] },
  { id: 'smugglers_cove2', kind: 'dungeon', at: [150, 164] }, // below the first, as Brandy Hole's second is
  { id: 'tide_ship', name: 'The Tide Ship', kind: 'dungeon', planned: true, band: [13, 14], at: [208, 192] },
];

export const SITES: readonly AtlasSite[] = [
  // IV. Wrackholm.
  { name: 'Kelp Hole', icon: 'cave', map: 'wrackholm_e6', at: [18.5, 12.5], label: 'left' },
  { name: 'Tide Ship', icon: 'wreck', at: [182, 188], label: 'right', planned: true }, // its anchorage off F6's shore; the plate lies out in the sea
];
