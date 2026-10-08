// Cairnmoor, the moor with the ring (band 18-20): High Moor and the Cairnfield, the second of Act
// III. docs/areas/cairnmoor.md is its brief.
import type { Area } from '../../area.ts';
import { HIGHMOOR_N7 } from './maps/highmoor_n7.ts';
import { CAIRNFIELD_N8 } from './maps/cairnfield_n8.ts';
import { HIGHMOOR_O7 } from './maps/highmoor_o7.ts';
import { HIGHMOOR_O8 } from './maps/highmoor_o8.ts';
import { CAIRNS } from './maps/cairns.ts';
import { CAIRNS2 } from './maps/cairns2.ts';
import { MONSTERS, SPRITES } from './monsters.ts';
import { ITEMS } from './items.ts';
import { QUESTS } from './quests.ts';
import { CHAPTER } from './chapter.ts';
import { ZONES, PLACES, SITES } from './atlas.ts';

export const AREA = {
  id: 'cairnmoor' as const,
  maps: [HIGHMOOR_N7, CAIRNFIELD_N8, HIGHMOOR_O7, HIGHMOOR_O8, CAIRNS, CAIRNS2],
  monsters: MONSTERS,
  sprites: SPRITES,
  items: ITEMS,
  quests: QUESTS,
  chapter: CHAPTER,
  // The moor's: cold, wet and windy, sleet and snow from the autumn on, lying long in the winter,
  // and fog off the bog.
  climate: { summer: 13, winter: -6, daily: 5, damp: [0.02, 0.09], wettest: 90, fog: 0.7, lag: 12,
    fogText: 'Fog comes up off the bog and lies on the heather.', thunderText: 'Thunder rolls over the moor.' },
  // No town, and no business (#434, call 9).
  interiors: [] as const,
  novel: { families: ['lights'], terrain: ['snow', 'ice'], mechanics: ['inflict:cursed'], landmarks: ['ring'] },
  atlas: { zones: ZONES, places: PLACES, sites: SITES },
} satisfies Area;
