// Wrackholm's part of the world map: its one zone, with E6 (#187) and F6 (#189) laid at their
// boxes, the plates of Kelp Hole's two levels (#188) and the Tide Ship, the Dead-Drop's below it (#22),
// and its sites. The Area carries it (index.ts).
// docs/areas/wrackholm.md is its brief.
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  { id: 'wrackholm', name: 'Wrackholm', area: 'wrackholm', band: [12, 14], maps: [{ map: 'wrackholm_e6', at: [136, 158] }, { map: 'wrackholm_f6', at: [168, 158] }], seeds: [[168, 176]] },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'smugglers_cove', kind: 'dungeon', at: [150, 158] },
  { id: 'smugglers_cove2', kind: 'dungeon', at: [150, 164] }, // below the first, as Brandy Hole's second is
  { id: 'tide_ship', kind: 'dungeon', at: [208, 192] }, // the ship at anchor off F6's shore, its three decks one below another (#190)
  { id: 'tide_ship2', kind: 'dungeon', at: [208, 198] },
  { id: 'tide_ship3', kind: 'dungeon', at: [214, 192] },
  { id: 'tide_ship_rift', kind: 'dungeon', band: [12, 14], at: [214, 198] }, // the Tide Stone's Rift, in the forward hold
  { id: 'dead_drop_stair', kind: 'dungeon', band: [26, 28], at: [214, 204] }, // the stair's foot, by the Dead-Drop's plate (#22)
  { id: 'dead_drop', kind: 'dungeon', band: [26, 28], at: [208, 204] }, // the Dead-Drop: the drop, through the stair's foot's far end (#22); three levels in all, the band their union (#443, call 4)
  { id: 'dead_drop2', kind: 'dungeon', at: [208, 210] }, // the vaults, down the drop's rails, six below it as the Tide Ship's decks are (#22)
];

export const SITES: readonly AtlasSite[] = [
  // IV. Wrackholm.
  { name: 'Kelp Hole', icon: 'cave', map: 'wrackholm_e6', at: [18.5, 12.5], label: 'left' },
  { name: 'Tide Ship', icon: 'wreck', map: 'wrackholm_f6', at: [14.5, 30.5], label: 'right' }, // its anchorage off F6's shingle; the plates lie out in the sea
];
