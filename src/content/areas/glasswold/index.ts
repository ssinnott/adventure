// The Glasswold, the steppe round the Glass (band 26-28): the Wold, on the road, and the Glass, the reach
// (DESIGN §9), the third area of Act IV, the far side of the Cinder Hills. docs/areas/glasswold.md is its brief.
import type { Area } from '../../area.ts';
import { WOLD_D9 } from './maps/wold_d9.ts';
import { WOLD_D8 } from './maps/wold_d8.ts';
import { MONSTERS, SPRITES } from './monsters.ts';
import { ITEMS } from './items.ts';
import { ZONES, PLACES, SITES } from './atlas.ts';
import { INTERIORS } from './interiors.ts';

export const AREA = {
  id: 'glasswold' as const,
  // In road order: the steppe (#525), the area's first, and Akordu, the Riders' camp (#526).
  maps: [WOLD_D9, WOLD_D8],
  monsters: MONSTERS,
  sprites: SPRITES,
  // The boxes' finds, and the Riders' leather their trader sells at Akordu (#526); no step on the ladder (#542).
  items: ITEMS,
  quests: [],
  // The Warning, the act's third chapter, is #531's.
  chapter: undefined,
  // The steppe: hot summers and hard winters, the days warm and the nights cold, little rain and that
  // in spring, dust for fog and thunder over the grass.
  climate: { summer: 26, winter: -4, daily: 11, damp: [0.01, 0.06], wettest: 120, fog: 0.1, lag: 18,
    fogText: 'Dust comes up off the grass and hangs in the air.', thunderText: 'Thunder rolls over the grass from far off.' },
  // The Riders' trader's tent at Akordu (#526).
  interiors: INTERIORS,
  // The glass walkers, a new family, placed first here (#533), and the dunes underfoot (#543). Steppe
  // was laid first by Ashfall's E10 (#517), and the lions are the cats', on the road before. Akordu (#526):
  // the basilisk's stone (#546); its camp is a landmark on the road before it.
  novel: { families: ['glasswalkers'], terrain: ['dunes'], mechanics: ['inflict:stoned'], landmarks: [] },
  atlas: { zones: ZONES, places: PLACES, sites: SITES },
} satisfies Area;
