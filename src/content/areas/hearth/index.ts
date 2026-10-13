// Hearth Isle, the temple over the core (band 28-32), step XII and the road's last, Act V: the isle, the
// temple, its crypt, the Underdeep's Ways and Stair and the Heart. docs/areas/hearth_isle.md is its brief.
import type { Area } from '../../area.ts';
import { HEARTHISLE_H6 } from './maps/hearthisle_h6.ts';
import { MONSTERS, SPRITES } from './monsters.ts';
import { ITEMS } from './items.ts';
import { ZONES, PLACES, SITES } from './atlas.ts';
import { INTERIORS } from './interiors.ts';
import { QUESTS } from './quests.ts';

export const AREA = {
  id: 'hearth' as const,
  // In road order: the isle, where the last crossing grounds (#753).
  maps: [HEARTHISLE_H6],
  // Drawn ahead of the area (#761), and placed from the isle on: the hearth moth, the ashen champion and
  // preacher and the deep rat first (#753).
  monsters: MONSTERS,
  sprites: SPRITES,
  // The isle's finds and the pilgrims' tokens (#753); the band's rung at 28 is #746's.
  items: ITEMS,
  // #56's 57, The Pilgrims in the Bowl, as far as the isle goes (#753).
  quests: QUESTS,
  // The Heart, the act's chapter and the road's last, is #760's.
  chapter: undefined,
  // The isle in the Sound: mild and damp, little between summer and winter or day and night, the haze
  // off the water standing in the column's light (§9, proposed).
  climate: { summer: 22, winter: 14, daily: 4, damp: [0.05, 0.09], wettest: 60, fog: 0.1, lag: 14,
    fogText: 'A haze comes in off the Sound, and the light stands in it like a lamp in a sack.', thunderText: 'Thunder, far off over the mainland. The light does not waver.' },
  // The pilgrims' camp's three tents in the Bowl (#762), drawn ahead and opened by the isle (#753).
  interiors: INTERIORS,
  // The Hearth, the site planned on the atlas since the start, built with the isle (#753; §7). The
  // crawlers and the Core's clock are claimed by the maps that first place them (#757, #759).
  novel: { families: [], terrain: [], mechanics: [], landmarks: ['hearth'] },
  atlas: { zones: ZONES, places: PLACES, sites: SITES },
} satisfies Area;
