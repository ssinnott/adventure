// Wrackholm's part of the world map: its one zone, with E6 laid at its box (#187), the plates of Kelp
// Hole and the Tide Ship, and its sites. The Area carries it (index.ts). The Dead-Drop below the ship
// stays the plan's (#22). docs/areas/wrackholm.md is its brief.
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  { id: 'wrackholm', name: 'Wrackholm', area: 'wrackholm', band: [12, 14], maps: [{ map: 'wrackholm_e6', at: [136, 158] }], seeds: [[168, 176]] },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'smugglers_cove', name: 'Kelp Hole', kind: 'dungeon', planned: true, band: [12, 14], at: [150, 158] },
  { id: 'tide_ship', name: 'The Tide Ship', kind: 'dungeon', planned: true, band: [13, 14], at: [208, 192] },
];

export const SITES: readonly AtlasSite[] = [
  // IV. Wrackholm.
  { name: 'Kelp Hole', icon: 'cave', at: [154, 170], label: 'left', planned: true },
  { name: 'Tide Ship', icon: 'wreck', at: [182, 188], label: 'right', planned: true }, // its anchorage off F6's shore; the plate lies out in the sea
];
