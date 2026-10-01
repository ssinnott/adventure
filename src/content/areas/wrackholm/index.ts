// Wrackholm, the smugglers' isle (band 12-14): the moor and the landing, Kelp Hole, the east rocks
// and the Tide Ship. docs/areas/wrackholm.md is its brief.
import type { Area } from '../../area.ts';
import { WRACKHOLM_E6 } from './maps/wrackholm_e6.ts';
import { SMUGGLERS_COVE } from './maps/smugglers_cove.ts';
import { SMUGGLERS_COVE2 } from './maps/smugglers_cove2.ts';
import { ITEMS } from './items.ts';
import { MONSTERS, SPRITES } from './monsters.ts';
import { ZONES, PLACES, SITES } from './atlas.ts';

export const AREA = {
  id: 'wrackholm' as const,
  maps: [WRACKHOLM_E6, SMUGGLERS_COVE, SMUGGLERS_COVE2],
  monsters: MONSTERS,
  sprites: SPRITES,
  items: ITEMS,
  quests: [],
  chapter: undefined, // The Stone Carried Home, #191's
  // Out in the gulf: mild winters, cool summers, wind and spray, and fog off the water.
  climate: { summer: 16, winter: 4, daily: 3, damp: [0.02, 0.09], wettest: 300, fog: 0.9, lag: 3,
    fogText: 'Fog comes in over the heather.', thunderText: 'Thunder breaks over the gulf.' },
  interiors: [] as const,
  novel: { families: ['devilfish'], terrain: ['heather'], mechanics: [], landmarks: [] },
  atlas: { zones: ZONES, places: PLACES, sites: SITES },
} satisfies Area;
