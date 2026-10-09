// The Whitespine, the range the bells ring over (band 22-24): Monks' Vale, the High Spine and Sheer
// Point, the first of Act IV. docs/areas/whitespine.md is its brief.
import type { Area } from '../../area.ts';
import { MONKSVALE_J11 } from './maps/monksvale_j11.ts';
import { MONASTERY } from './maps/monastery.ts';
import { MONASTERY2 } from './maps/monastery2.ts';
import { HIGHSPINE_I11 } from './maps/highspine_i11.ts';
import { HIGHSPINE_I10 } from './maps/highspine_i10.ts';
import { SHEERPOINT_I9 } from './maps/sheerpoint_i9.ts';
import { SHEERPOINT_I8 } from './maps/sheerpoint_i8.ts';
import { MONSTERS, SPRITES } from './monsters.ts';
import { ITEMS } from './items.ts';
import { CHAPTER } from './chapter.ts';
import { ZONES, PLACES, SITES } from './atlas.ts';

export const AREA = {
  id: 'whitespine' as const,
  maps: [MONKSVALE_J11, MONASTERY, MONASTERY2, HIGHSPINE_I11, HIGHSPINE_I10, SHEERPOINT_I9, SHEERPOINT_I8],
  monsters: MONSTERS,
  sprites: SPRITES,
  items: ITEMS,
  quests: [],
  chapter: CHAPTER,
  // The range's: cold, the snow lying from the autumn to the late spring, the wind along the crest,
  // and cloud down in the vale.
  climate: { summer: 8, winter: -12, daily: 7, damp: [0.03, 0.08], wettest: 330, fog: 0.4, lag: 12,
    fogText: 'Cloud comes down off the crest and lies in the vale.', thunderText: 'Thunder rolls along the range.' },
  // No town, and no business (#443, call 7).
  interiors: [] as const,
  // Peaks underfoot, with the road through them (#543), with J11 (#499); a monastery kept by what did
  // not build it, with Highcell (#500); the Sheer's cliff, seen from its top and climbed down by a
  // Mountaineer, with I11 (#501); the giants, a new family, with I10 (#502), whose sweep and toll have
  // no token of their own to claim (the toll is Thornmark's). Sheer Point's sea reached from the range,
  // its causeway over the water and the person taken from its shore (#504) have none either: the
  // causeway's stone is the Kilns' pier's, and a cave on the atlas is on the road before.
  novel: { families: ['giants'], terrain: ['peak', 'cliff'], mechanics: [], landmarks: ['monastery'] },
  atlas: { zones: ZONES, places: PLACES, sites: SITES },
} satisfies Area;
