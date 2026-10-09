// The Glasswold, the steppe round the Glass (band 26-28): the Wold, on the road, and the Glass, the reach
// (DESIGN §9), the third area of Act IV, the far side of the Cinder Hills. docs/areas/glasswold.md is its brief.
import type { Area } from '../../area.ts';
import { WOLD_D9 } from './maps/wold_d9.ts';
import { MONSTERS, SPRITES } from './monsters.ts';
import { ITEMS } from './items.ts';
import { ZONES, PLACES, SITES } from './atlas.ts';

export const AREA = {
  id: 'glasswold' as const,
  // In road order: the steppe (#525), the area's first.
  maps: [WOLD_D9],
  monsters: MONSTERS,
  sprites: SPRITES,
  // The boxes' finds: the Wold sells nothing (#542).
  items: ITEMS,
  quests: [],
  // The Warning, the act's third chapter, is #531's.
  chapter: undefined,
  // The steppe: hot summers and hard winters, the days warm and the nights cold, little rain and that
  // in spring, dust for fog and thunder over the grass.
  climate: { summer: 26, winter: -4, daily: 11, damp: [0.01, 0.06], wettest: 120, fog: 0.1, lag: 18,
    fogText: 'Dust comes up off the grass and hangs in the air.', thunderText: 'Thunder rolls over the grass from far off.' },
  interiors: [],
  // The glass walkers, a new family, placed first here (#533), and the dunes underfoot (#543). Steppe
  // was laid first by Ashfall's E10 (#517), and the lions are the cats', on the road before.
  novel: { families: ['glasswalkers'], terrain: ['dunes'], mechanics: [], landmarks: [] },
  atlas: { zones: ZONES, places: PLACES, sites: SITES },
} satisfies Area;
