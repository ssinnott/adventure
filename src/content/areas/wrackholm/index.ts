// Wrackholm, the smugglers' isle (band 12-14): the moor and the landing, Kelp Hole, the east rocks
// and the Tide Ship. docs/areas/wrackholm.md is its brief.
import type { Area } from '../../area.ts';
import { WRACKHOLM_E6 } from './maps/wrackholm_e6.ts';
import { WRACKHOLM_F6 } from './maps/wrackholm_f6.ts';
import { SMUGGLERS_COVE } from './maps/smugglers_cove.ts';
import { SMUGGLERS_COVE2 } from './maps/smugglers_cove2.ts';
import { TIDE_SHIP } from './maps/tide_ship.ts';
import { TIDE_SHIP2 } from './maps/tide_ship2.ts';
import { TIDE_SHIP3, TIDE_RIFT } from './maps/tide_ship3.ts';
import { DEAD_DROP_STAIR } from './maps/dead_drop_stair.ts';
import { DEAD_DROP } from './maps/dead_drop.ts';
import { DEAD_DROP2 } from './maps/dead_drop2.ts';
import { ITEMS } from './items.ts';
import { CHAPTER } from './chapter.ts';
import { QUESTS } from './quests.ts';
import { GUILDS } from './guilds.ts';
import { MONSTERS, SPRITES } from './monsters.ts';
import { ZONES, PLACES, SITES } from './atlas.ts';

export const AREA = {
  id: 'wrackholm' as const,
  maps: [WRACKHOLM_E6, SMUGGLERS_COVE, SMUGGLERS_COVE2, WRACKHOLM_F6, TIDE_SHIP, TIDE_SHIP2, TIDE_SHIP3, TIDE_RIFT.map, DEAD_DROP_STAIR, DEAD_DROP, DEAD_DROP2],
  // The Dead-Drop pays outside any area's budget (EXPANSION §5.2): its levels, past the band, as they are built.
  outside: ['dead_drop', 'dead_drop2'],
  monsters: MONSTERS,
  sprites: SPRITES,
  items: ITEMS,
  quests: QUESTS,
  // The Compact's Fence's rung, the stair's foot under the Tide Ship seen (#635).
  guilds: GUILDS,
  chapter: CHAPTER,
  // Out in the gulf: mild winters, cool summers, wind and spray, and fog off the water.
  climate: { summer: 16, winter: 4, daily: 3, damp: [0.02, 0.09], wettest: 300, fog: 0.9, lag: 3,
    fogText: 'Fog comes in over the heather.', thunderText: 'Thunder breaks over the gulf.' },
  interiors: [] as const,
  novel: { families: ['devilfish'], terrain: ['heather'], mechanics: [], landmarks: ['wreck'] },
  atlas: { zones: ZONES, places: PLACES, sites: SITES },
} satisfies Area;
