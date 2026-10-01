// Thornmark, over the pass (band 5-10): the forest, Thornhold, the Grove Roots and the Cut Stone.
// docs/areas/thornmark.md is its brief.
import type { Area } from '../../area.ts';
import { THORNMARK } from './maps/thornmark.ts';
import { THORNHOLD } from './maps/thornhold.ts';
import { GROVE1 } from './maps/grove1.ts';
import { GROVE2 } from './maps/grove2.ts';
import { DEEPTHORN_H3 } from './maps/deepthorn_h3.ts';
import { DEEPTHORN_I4 } from './maps/deepthorn_i4.ts';
import { DEEPTHORN_I5 } from './maps/deepthorn_i5.ts';
import { MONSTERS, SPRITES } from './monsters.ts';
import { ITEMS } from './items.ts';
import { QUESTS } from './quests.ts';
import { GUILDS } from './guilds.ts';
import { CHAPTER } from './chapter.ts';
import { ZONES, PLACES, SITES } from './atlas.ts';

export const AREA = {
  id: 'thornmark' as const,
  // The zone before its town, unlike the Foreland: the order the outdoors is laid in is kept.
  maps: [THORNMARK, THORNHOLD, GROVE1, GROVE2, DEEPTHORN_H3, DEEPTHORN_I4, DEEPTHORN_I5],
  monsters: MONSTERS,
  sprites: SPRITES,
  items: ITEMS,
  quests: QUESTS,
  chapter: CHAPTER,
  guilds: GUILDS,
  // Over the pass: colder, with hard winters that keep their snow, and mist under the trees.
  climate: { summer: 17, winter: -4, daily: 5, damp: [0, 0.06], wettest: 80, fog: 0.5, lag: 5,
    fogText: 'Mist rises between the trees.', thunderText: 'Thunder rolls over the forest.' },
  interiors: ['green_man', 'lantern_chapterhouse', 'thornhold_armoury', 'lantern_hall', 'elders_yard', 'split_oak'] as const,
  novel: { families: ['ogre', 'wraith'], terrain: [], mechanics: ['encounter:slainText'], landmarks: ['hold', 'tower', 'barrow', 'grove'] },
  atlas: { zones: ZONES, places: PLACES, sites: SITES },
} satisfies Area;
