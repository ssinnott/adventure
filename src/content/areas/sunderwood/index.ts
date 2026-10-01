// Sunderwood, down the east road (band 14-16): the Eaves, the Sunder and Lanternwood, the last of
// Act II. docs/areas/sunderwood.md is its brief.
import type { Area } from '../../area.ts';
import { EAVES_I2 } from './maps/eaves_i2.ts';
import { EAVES_J2 } from './maps/eaves_j2.ts';
import { EAVES_K2 } from './maps/eaves_k2.ts';
import { EAVES_K3, K3_RIFT } from './maps/eaves_k3.ts';
import { MONSTERS, SPRITES } from './monsters.ts';
import { ITEMS } from './items.ts';
import { INTERIORS } from './interiors.ts';
import { ZONES, PLACES, SITES } from './atlas.ts';

export const AREA = {
  id: 'sunderwood' as const,
  maps: [EAVES_I2, EAVES_J2, EAVES_K2, EAVES_K3, K3_RIFT.map],
  monsters: MONSTERS,
  sprites: SPRITES,
  items: ITEMS,
  quests: [],
  // The Wall, the act's last chapter, is #204's.
  chapter: undefined,
  climate: { summer: 16, winter: -2, daily: 5, damp: [0.01, 0.08], wettest: 85, fog: 0.6, lag: 8,
    fogText: 'Mist comes down through the pines.', thunderText: 'Thunder rolls down the gorge.' },
  interiors: INTERIORS,
  novel: { families: ['bears', 'moths'], terrain: ['deadwood', 'crystal', 'chasm'], mechanics: ['inflict:asleep'], landmarks: ['falls'] },
  atlas: { zones: ZONES, places: PLACES, sites: SITES },
} satisfies Area;
