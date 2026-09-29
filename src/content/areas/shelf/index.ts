// The Foreland, the first step of the road (band 1-5): Helmstow and its keep, the Foreland's coast
// and woods, the Ashcombe cellar and Brandy Hole's two levels. Its id is still 'shelf', as saves
// hold it. docs/areas/shelf.md is its brief.
import type { Area } from '../../area.ts';
import { HARROW } from './maps/harrow.ts';
import { KEEP } from './maps/keep.ts';
import { SHELF } from './maps/shelf.ts';
import { MILL } from './maps/mill.ts';
import { GREYWATER1 } from './maps/greywater1.ts';
import { GREYWATER2 } from './maps/greywater2.ts';
import { DOWNS_F2 } from './maps/downs_f2.ts';
import { MONSTERS, SPRITES } from './monsters.ts';
import { ITEMS } from './items.ts';
import { QUESTS } from './quests.ts';
import { GUILDS } from './guilds.ts';
import { CHAPTER } from './chapter.ts';
import { ZONES, PLACES, SITES } from './atlas.ts';

export const AREA = {
  id: 'shelf' as const,
  // Helmstow first: a new game starts on it.
  maps: [HARROW, KEEP, SHELF, MILL, GREYWATER1, GREYWATER2, DOWNS_F2],
  monsters: MONSTERS,
  sprites: SPRITES,
  items: ITEMS,
  quests: QUESTS,
  chapter: CHAPTER,
  guilds: GUILDS,
  // The coast: mild, wet in the autumn, fog off the sea. Snow only in a cold snap.
  climate: { summer: 18, winter: 2, daily: 4, damp: [0.01, 0.07], wettest: 85, fog: 0.8, lag: 0,
    fogText: 'Fog rolls in off the sea.', thunderText: 'Thunder rolls in off the sea.' },
  interiors: ['hearthlight_inn', 'lantern_chapel', 'harrow_provisioner', 'lantern_guildhall', 'warden_drillyard', 'gilded_eel', 'farm_kitchen', 'throne_room'] as const,
  // The first on the road: everything in it is new, so it claims nothing.
  novel: { families: [], terrain: [], mechanics: [], landmarks: [] },
  atlas: { zones: ZONES, places: PLACES, sites: SITES },
} satisfies Area;
