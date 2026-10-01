// Saltreach, down Kestrel Edge (band 10-12): the Long Water from the Edge's foot through the fen to
// the sea, the Tide Stone's country with its Stone gone, and Saltmouth. docs/areas/saltreach.md is
// its brief.
import type { Area } from '../../area.ts';
import { DELTA_D5 } from './maps/delta_d5.ts';
import { DELTA_C5, C5_RIFT } from './maps/delta_c5.ts';
import { DELTA_B5, B5_RIFT_N, B5_RIFT_S } from './maps/delta_b5.ts';
import { SALTINGS_C6 } from './maps/saltings_c6.ts';
import { MONSTERS, SPRITES } from './monsters.ts';
import { ITEMS } from './items.ts';
import { INTERIORS } from './interiors.ts';
import { ZONES, PLACES, SITES } from './atlas.ts';

export const AREA = {
  id: 'saltreach' as const,
  // The road's order: the shore under the Edge, the fen, west over it to the plinth, then Saltmouth's box.
  maps: [DELTA_D5, DELTA_C5, C5_RIFT.map, DELTA_B5, B5_RIFT_N.map, B5_RIFT_S.map, SALTINGS_C6],
  monsters: MONSTERS,
  sprites: SPRITES,
  items: ITEMS,
  quests: [],
  // The Tide Stone, the act's first chapter, is #180's.
  chapter: undefined,
  // The delta's: mild and wet, with sea fog off the gulf.
  climate: { summer: 19, winter: 4, daily: 4, damp: [0.02, 0.09], wettest: 300, fog: 0.9, lag: 4,
    fogText: 'Fog comes in off the gulf.', thunderText: 'Thunder rolls over the fen.' },
  interiors: INTERIORS,
  novel: { families: ['longbodies', 'toads'], terrain: ['salt'], mechanics: [], landmarks: [] },
  atlas: { zones: ZONES, places: PLACES, sites: SITES },
} satisfies Area;
