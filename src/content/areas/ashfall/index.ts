// Ashfall, the far side of the Sound (band 24-26): Cindercoast, Fire Mountain and the Ember Waste, the
// second area of Act IV, begun by sea (#443, call 6). docs/areas/ashfall.md is its brief.
import type { Area } from '../../area.ts';
import { CINDERCOAST_G10 } from './maps/cindercoast_g10.ts';
import { EMBERWASTE_F10 } from './maps/emberwaste_f10.ts';
import { EMBERWASTE_E10 } from './maps/emberwaste_e10.ts';
import { MONSTERS, SPRITES } from './monsters.ts';
import { ITEMS } from './items.ts';
import { INTERIORS } from './interiors.ts';
import { ZONES, PLACES, SITES } from './atlas.ts';

export const AREA = {
  id: 'ashfall' as const,
  maps: [CINDERCOAST_G10, EMBERWASTE_F10, EMBERWASTE_E10],
  monsters: MONSTERS,
  sprites: SPRITES,
  // Cinderport's armourer's step (#542), sold when the town is built (#512).
  items: ITEMS,
  quests: [],
  // The Window, the act's second chapter, is #518's.
  chapter: undefined,
  // The coast under the mountain: warm and wet, the vines green the year round, smoke for fog and the
  // mountain for thunder.
  climate: { summer: 24, winter: 10, daily: 6, damp: [0.04, 0.11], wettest: 200, fog: 0.3, lag: 16,
    fogText: 'Smoke comes down off the mountain and lies along the shore.', thunderText: 'Thunder over the mountain, or the mountain itself.' },
  // Cinderport's rooms are #521's, drawn ahead of the town (#512).
  interiors: INTERIORS,
  // Vines underfoot (#543) and the drakes, a family of their own (#520), with G10 (#511).
  novel: { families: ['drakes'], terrain: ['vines'], mechanics: [], landmarks: [] },
  atlas: { zones: ZONES, places: PLACES, sites: SITES },
} satisfies Area;
