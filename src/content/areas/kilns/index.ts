// The Kilns, over the east road (band 16-18): the Iron Fells, the Kilns' heart and Kilnmouth, the
// first of Act III. docs/areas/kilns.md is its brief.
import type { Area } from '../../area.ts';
import { IRONFELLS_M3 } from './maps/ironfells_m3.ts';
import { IRONFELLS_N3 } from './maps/ironfells_n3.ts';
import { ANVILHALL } from './maps/anvilhall.ts';
import { KILNSHEART_N4 } from './maps/kilnsheart_n4.ts';
import { DEEP_MINES } from './maps/deep_mines.ts';
import { DEEP_MINES2 } from './maps/deep_mines2.ts';
import { DEEP_MINES3 } from './maps/deep_mines3.ts';
import { IRONFELLS_N2 } from './maps/ironfells_n2.ts';
import { KILNSHEART_N5 } from './maps/kilnsheart_n5.ts';
import { KILNSHEART_N6 } from './maps/kilnsheart_n6.ts';
import { KILNMOUTH_M6 } from './maps/kilnmouth_m6.ts';
import { KILNSHEART_O5 } from './maps/kilnsheart_o5.ts';
import { ANVIL_STONE } from './maps/anvil_stone.ts';
import { MONSTERS, SPRITES } from './monsters.ts';
import { ITEMS } from './items.ts';
import { INTERIORS } from './interiors.ts';
import { ZONES, PLACES, SITES } from './atlas.ts';

export const AREA = {
  id: 'kilns' as const,
  maps: [IRONFELLS_M3, IRONFELLS_N3, ANVILHALL, KILNSHEART_N4, DEEP_MINES, DEEP_MINES2, DEEP_MINES3, IRONFELLS_N2, KILNSHEART_N5, KILNSHEART_N6, KILNMOUTH_M6, KILNSHEART_O5, ANVIL_STONE],
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
  novel: { families: ['salamanders', 'knockers'], terrain: ['pine'], mechanics: ['sign:read'], landmarks: ['fortress', 'forge', 'mine'] },
  atlas: { zones: ZONES, places: PLACES, sites: SITES },
} satisfies Area;
