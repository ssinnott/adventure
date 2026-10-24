// Rimewater, the lochs under the glacier (band 20-22): Loch Fada, Loch Fuar and, beyond the glacier's
// edge, Glacier Foot, the reach; the last of Act III. docs/areas/rimewater.md is its brief.
import type { Area } from '../../area.ts';
import { LONGMERE_M9 } from './maps/longmere_m9.ts';
import { RIME_LODGE } from './maps/rime_lodge.ts';
import { LONGMERE_L9 } from './maps/longmere_l9.ts';
import { LONGMERE_L10 } from './maps/longmere_l10.ts';
import { LONGMERE_L11 } from './maps/longmere_l11.ts';
import { COLDMERE_K9 } from './maps/coldmere_k9.ts';
import { COLDMERE_K10 } from './maps/coldmere_k10.ts';
import { COLDMERE_J9 } from './maps/coldmere_j9.ts';
import { COLDMERE_K11 } from './maps/coldmere_k11.ts';
import { SLEEPERS_BAY } from './maps/sleepers_bay.ts';
import { SLEEPERS_BAY2 } from './maps/sleepers_bay2.ts';
import { LONGMERE_M10 } from './maps/longmere_m10.ts';
import { LONGMERE_M11 } from './maps/longmere_m11.ts';
import { LONGMERE_N9 } from './maps/longmere_n9.ts';
import { COLDMERE_K12 } from './maps/coldmere_k12.ts';
import { LONGMERE_L12 } from './maps/longmere_l12.ts';
import { CREAG_FIONN } from './maps/creag_fionn.ts';
import { SPITTAL } from './maps/spittal.ts';
import { SPITTAL2 } from './maps/spittal2.ts';
import { MONSTERS, SPRITES } from './monsters.ts';
import { ITEMS } from './items.ts';
import { CHAPTER } from './chapter.ts';
import { INTERIORS } from './interiors.ts';
import { ZONES, PLACES, SITES, LINKS } from './atlas.ts';
import { GUILDS } from './guilds.ts';
import { QUESTS } from './quests.ts';

export const MAPS = [LONGMERE_M9, RIME_LODGE, LONGMERE_L9, COLDMERE_K9, COLDMERE_K10, SLEEPERS_BAY, SLEEPERS_BAY2, COLDMERE_J9, COLDMERE_K11, LONGMERE_L10, LONGMERE_L11, LONGMERE_M10, LONGMERE_M11, LONGMERE_N9, COLDMERE_K12, LONGMERE_L12, CREAG_FIONN, SPITTAL, SPITTAL2] as const;

export const AREA = {
  id: 'rimewater' as const,
  // The bounds (#832): K12 and L12, the country off the road, then Creag Fionn, the enclave (#845) in
  // L12's rim, at 22-23, and the Spittal, the Wakerobe's lair (#847) under the pass behind K12's door, at
  // the cap's 30-32.
  maps: MAPS,
  monsters: MONSTERS,
  sprites: SPRITES,
  items: ITEMS,
  // #56's five, 40 to 44 (#494).
  quests: QUESTS,
  chapter: CHAPTER,
  // The Wardens' fourth rank's ask at the ice-hole, a sword on the fourth night (#439).
  guilds: GUILDS,
  // The lochs': cold, the snow lying from the autumn to the spring, the wind off the glacier, and
  // fog off the open water.
  climate: { summer: 10, winter: -10, daily: 6, damp: [0.03, 0.08], wettest: 320, fog: 0.5, lag: 12,
    fogText: 'Fog comes up off the open water and lies on the ice.', thunderText: 'Thunder rolls down off the glacier.' },
  // Rime Lodge's rooms (#496), opened by the town's businesses (#487).
  interiors: INTERIORS,
  // The cats and a group on ice with M9 (#486); the keepers with the bay (#490).
  novel: { families: ['cats', 'keepers'], terrain: [], mechanics: ['encounter:under'], landmarks: [] },
  atlas: { zones: ZONES, places: PLACES, sites: SITES, links: LINKS },
} satisfies Area;
