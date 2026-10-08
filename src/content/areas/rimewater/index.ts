// Rimewater, the lochs under the glacier (band 20-22): Loch Fada, Loch Fuar and, beyond the glacier's
// edge, Glacier Foot, the reach; the last of Act III. docs/areas/rimewater.md is its brief.
import type { Area } from '../../area.ts';
import { LONGMERE_M9 } from './maps/longmere_m9.ts';
import { RIME_LODGE } from './maps/rime_lodge.ts';
import { LONGMERE_L9 } from './maps/longmere_l9.ts';
import { COLDMERE_K9 } from './maps/coldmere_k9.ts';
import { MONSTERS, SPRITES } from './monsters.ts';
import { ITEMS } from './items.ts';
import { INTERIORS } from './interiors.ts';
import { ZONES, PLACES, SITES } from './atlas.ts';

export const AREA = {
  id: 'rimewater' as const,
  maps: [LONGMERE_M9, RIME_LODGE, LONGMERE_L9, COLDMERE_K9],
  monsters: MONSTERS,
  sprites: SPRITES,
  items: ITEMS,
  quests: [],
  // The Sleepers, the act's last chapter, is #492's.
  chapter: undefined,
  // The lochs': cold, the snow lying from the autumn to the spring, the wind off the glacier, and
  // fog off the open water.
  climate: { summer: 10, winter: -10, daily: 6, damp: [0.03, 0.08], wettest: 320, fog: 0.5, lag: 12,
    fogText: 'Fog comes up off the open water and lies on the ice.', thunderText: 'Thunder rolls down off the glacier.' },
  // Rime Lodge's rooms (#496), opened by the town's businesses (#487).
  interiors: INTERIORS,
  novel: { families: ['cats'], terrain: [], mechanics: ['encounter:under'], landmarks: [] },
  atlas: { zones: ZONES, places: PLACES, sites: SITES },
} satisfies Area;
