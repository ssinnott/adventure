// The Kilns, over the east road (band 16-18): the Iron Fells, the Kilns' heart and Kilnmouth, the
// first of Act III. docs/areas/kilns.md is its brief.
import type { Area } from '../../area.ts';
import { IRONFELLS_M3 } from './maps/ironfells_m3.ts';
import { IRONFELLS_N3 } from './maps/ironfells_n3.ts';
import { KILNSHEART_N4 } from './maps/kilnsheart_n4.ts';
import { MONSTERS, SPRITES } from './monsters.ts';
import { ITEMS } from './items.ts';
import { INTERIORS } from './interiors.ts';
import { ZONES, PLACES, SITES } from './atlas.ts';

export const AREA = {
  id: 'kilns' as const,
  maps: [IRONFELLS_M3, IRONFELLS_N3, KILNSHEART_N4],
  monsters: MONSTERS,
  sprites: SPRITES,
  items: ITEMS,
  quests: [],
  // The Anvil Stone, the act's first chapter, is #470's.
  chapter: undefined,
  // The dwarf country's: dry, hot in the summer, snow on the Fells' tops in the winter, and the
  // forges' smoke in the haze.
  climate: { summer: 21, winter: -3, daily: 7, damp: [0, 0.05], wettest: 80, fog: 0.3, lag: 10,
    fogText: 'A haze comes down off the Fells, and it smells of smoke.', thunderText: 'Thunder rolls along the Fells.' },
  interiors: INTERIORS,
  novel: { families: ['salamanders'], terrain: ['pine'], mechanics: ['sign:read'], landmarks: [] },
  atlas: { zones: ZONES, places: PLACES, sites: SITES },
} satisfies Area;
