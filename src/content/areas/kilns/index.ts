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
import { KILNMOUTH_L6 } from './maps/kilnmouth_l6.ts';
import { KILNHAVEN } from './maps/kilnhaven.ts';
import { KILNSHEART_O6 } from './maps/kilnsheart_o6.ts';
import { LAVA_TUBES } from './maps/lava_tubes.ts';
import { LAVA_TUBES2 } from './maps/lava_tubes2.ts';
import { MONSTERS, SPRITES } from './monsters.ts';
import { ITEMS } from './items.ts';
import { INTERIORS } from './interiors.ts';
import { ZONES, PLACES, SITES } from './atlas.ts';
import { GUILDS } from './guilds.ts';
import { QUESTS } from './quests.ts';

export const AREA = {
  id: 'kilns' as const,
  maps: [IRONFELLS_M3, IRONFELLS_N3, ANVILHALL, KILNSHEART_N4, DEEP_MINES, DEEP_MINES2, DEEP_MINES3, IRONFELLS_N2, KILNSHEART_N5, KILNSHEART_N6, KILNMOUTH_M6, KILNSHEART_O5, ANVIL_STONE, KILNMOUTH_L6, KILNHAVEN, KILNSHEART_O6, LAVA_TUBES, LAVA_TUBES2],
  monsters: MONSTERS,
  sprites: SPRITES,
  items: ITEMS,
  // #56's four, 33 to 36 (#471).
  quests: QUESTS,
  // The Anvil Stone, the act's first chapter, is #470's.
  chapter: undefined,
  // The fourth ranks' asks in the Tiefzeche, the Lanterns' and the Wardens' (#439).
  guilds: GUILDS,
  // The dwarf country's: dry, hot in the summer, snow on the Fells' tops in the winter, and the
  // forges' smoke in the haze.
  climate: { summer: 21, winter: -3, daily: 7, damp: [0, 0.05], wettest: 80, fog: 0.3, lag: 10,
    fogText: 'A haze comes down off the Fells, and it smells of smoke.', thunderText: 'Thunder rolls along the Fells.' },
  interiors: INTERIORS,
  novel: { families: ['salamanders', 'knockers'], terrain: ['pine', 'ash', 'lava'], mechanics: ['sign:read', 'sign:marks'], landmarks: ['fortress', 'forge', 'mine'] },
  atlas: { zones: ZONES, places: PLACES, sites: SITES },
} satisfies Area;
