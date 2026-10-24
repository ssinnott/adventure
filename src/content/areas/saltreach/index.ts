// Saltreach, down Kestrel Edge (band 10-12): the Long Water from the Edge's foot through the fen to
// the sea, the Tide Stone's country with its Stone gone, and Saltmouth. docs/areas/saltreach.md is
// its brief.
import type { Area } from '../../area.ts';
import { DELTA_D5 } from './maps/delta_d5.ts';
import { DELTA_C5, C5_RIFT } from './maps/delta_c5.ts';
import { DELTA_C4 } from './maps/delta_c4.ts';
import { UPPERWATER_C3 } from './maps/upperwater_c3.ts';
import { UPPERWATER_B3 } from './maps/upperwater_b3.ts';
import { DELTA_B4 } from './maps/delta_b4.ts';
import { DELTA_B5, B5_RIFT_N, B5_RIFT_S } from './maps/delta_b5.ts';
import { DELTA_B6 } from './maps/delta_b6.ts';
import { DROWNED_TEMPLES } from './maps/drowned_temples.ts';
import { DROWNED_TEMPLES2 } from './maps/drowned_temples2.ts';
import { SALTINGS_C6 } from './maps/saltings_c6.ts';
import { SALTMOUTH } from './maps/saltmouth.ts';
import { SALTINGS_C7 } from './maps/saltings_c7.ts';
import { UPPERWATER_C2 } from './maps/upperwater_c2.ts';
import { UPPERWATER_B2 } from './maps/upperwater_b2.ts';
import { UPPERWATER_A3 } from './maps/upperwater_a3.ts';
import { DELTA_A4 } from './maps/delta_a4.ts';
import { DELTA_A5 } from './maps/delta_a5.ts';
import { DELTA_A6 } from './maps/delta_a6.ts';
import { SALTINGS_B7 } from './maps/saltings_b7.ts';
import { SALTINGS_D6 } from './maps/saltings_d6.ts';
import { MONSTERS, SPRITES } from './monsters.ts';
import { ITEMS } from './items.ts';
import { QUESTS } from './quests.ts';
import { INTERIORS } from './interiors.ts';
import { GUILDS } from './guilds.ts';
import { ZONES, PLACES, SITES, LINKS } from './atlas.ts';
import { CHAPTER } from './chapter.ts';

export const MAPS = [DELTA_D5, DELTA_C5, C5_RIFT.map, DELTA_C4, UPPERWATER_C3, DELTA_B5, B5_RIFT_N.map, B5_RIFT_S.map, DELTA_B6, DROWNED_TEMPLES, DROWNED_TEMPLES2, SALTINGS_C6, SALTMOUTH, SALTINGS_C7, UPPERWATER_B3, DELTA_B4, UPPERWATER_C2, UPPERWATER_B2, UPPERWATER_A3, DELTA_A4, DELTA_A5, DELTA_A6, SALTINGS_B7, SALTINGS_D6] as const;

export const AREA = {
  id: 'saltreach' as const,
  // The road's order: the shore under the Edge, the fen, the spur up the river to Rietum, west over
  // the fen to the plinth and south to the temples and down them, then Saltmouth's box, the town and the pans below; and behind the road the
  // willows, west of Rietum and down to the fen's north end; and the bounds (#830), the upper valley over
  // Rietum and its head under the rim, then the rim's foot behind the willows and the hills over the heronry,
  // then the fen's west shore and the fen under the rim, then the Scarp's foot west of the pans and the
  // plate's old place off Saltmouth.
  maps: MAPS,
  monsters: MONSTERS,
  sprites: SPRITES,
  items: ITEMS,
  quests: QUESTS,
  // The Cartographers' first task and first rank at the Map Room (#181), and the Salt Compact's at
  // the Keel (#182).
  guilds: GUILDS,
  // The Tide Stone, the act's first chapter (#180).
  chapter: CHAPTER,
  // The delta's: mild and wet, with sea fog off the gulf.
  climate: { summer: 19, winter: 4, daily: 4, damp: [0.02, 0.09], wettest: 300, fog: 0.9, lag: 4,
    fogText: 'Fog comes in off the gulf.', thunderText: 'Thunder rolls over the fen.' },
  interiors: INTERIORS,
  novel: { families: ['longbodies', 'toads'], terrain: ['salt'], mechanics: [], landmarks: [] },
  atlas: { zones: ZONES, places: PLACES, sites: SITES, links: LINKS },
} satisfies Area;
