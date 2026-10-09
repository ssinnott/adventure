// The Whitespine, the range the bells ring over (band 22-24): Monks' Vale, the High Spine and Sheer
// Point, the first of Act IV. docs/areas/whitespine.md is its brief.
import type { Area } from '../../area.ts';
import { MONKSVALE_J11 } from './maps/monksvale_j11.ts';
import { MONSTERS, SPRITES } from './monsters.ts';
import { ZONES, PLACES, SITES } from './atlas.ts';

export const AREA = {
  id: 'whitespine' as const,
  maps: [MONKSVALE_J11],
  monsters: MONSTERS,
  sprites: SPRITES,
  items: [],
  quests: [],
  // The Bells, the act's first chapter, is #505's.
  chapter: undefined,
  // The range's: cold, the snow lying from the autumn to the late spring, the wind along the crest,
  // and cloud down in the vale.
  climate: { summer: 8, winter: -12, daily: 7, damp: [0.03, 0.08], wettest: 330, fog: 0.4, lag: 12,
    fogText: 'Cloud comes down off the crest and lies in the vale.', thunderText: 'Thunder rolls along the range.' },
  // No town, and no business (#443, call 7).
  interiors: [] as const,
  // Peaks underfoot, with the road through them (#543), with J11 (#499).
  novel: { families: [], terrain: ['peak'], mechanics: [], landmarks: [] },
  atlas: { zones: ZONES, places: PLACES, sites: SITES },
} satisfies Area;
