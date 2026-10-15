// Hearth Isle, the temple over the core (band 28-32), step XII and the road's last, Act V: the isle, the
// temple, its crypt, the Underdeep's Ways and Stair and the Heart. docs/areas/hearth_isle.md is its brief.
import type { Area } from '../../area.ts';
import { HEARTHISLE_H6 } from './maps/hearthisle_h6.ts';
import { HEARTHISLE_I6 } from './maps/hearthisle_i6.ts';
import { HEARTHFANE } from './maps/hearthfane.ts';
import { HEARTHFANE2 } from './maps/hearthfane2.ts';
import { UNDERDEEP } from './maps/underdeep.ts';
import { UNDERDEEP2 } from './maps/underdeep2.ts';
import { CORE } from './maps/core.ts';
import { MONSTERS, SPRITES } from './monsters.ts';
import { ITEMS } from './items.ts';
import { ZONES, PLACES, SITES } from './atlas.ts';
import { INTERIORS } from './interiors.ts';
import { QUESTS } from './quests.ts';

export const AREA = {
  id: 'hearth' as const,
  // In road order: the isle, where the last crossing grounds (#753); its east rim, Anchorhold and the
  // Hand's Steps (#754); the temple at the column's foot (#755); its crypt, down the stair behind the
  // altar (#756); the Ways, through the crypt's grey door (#757); the Stair, through the Ways' last door
  // (#758); the Heart, through the Stair's last door (#759).
  maps: [HEARTHISLE_H6, HEARTHISLE_I6, HEARTHFANE, HEARTHFANE2, UNDERDEEP, UNDERDEEP2, CORE],
  // Drawn ahead of the area (#761), and placed from the isle on: the hearth moth, the ashen champion and
  // preacher and the deep rat first (#753).
  monsters: MONSTERS,
  sprites: SPRITES,
  // The isle's finds and the pilgrims' tokens (#753), the east rim's staff and mail (#754), the temple's
  // (#755), the crypt's (#756), the Ways' (#757), the Stair's (#758) and the Heart's ring (#759); the band's
  // rung at 28 is the nine grey pieces among them (#746).
  items: ITEMS,
  // #56's 57, The Pilgrims in the Bowl, as far as the isle goes (#753); 56, The Sacristan's Lamps (#755); 59,
  // Every Frame She Marked, as far as the Ways go, 60, Crew Only, From the Inside, and 61, The Knocker That
  // Stopped (#757); the Cleric's third, The Eleven Kept (#763); 64, The Signet, from the ring at the Heart (#759).
  quests: QUESTS,
  // The Heart, the act's chapter and the road's last, is #760's.
  chapter: undefined,
  // The isle in the Sound: mild and damp, little between summer and winter or day and night, the haze
  // off the water standing in the column's light (§9, proposed).
  climate: { summer: 22, winter: 14, daily: 4, damp: [0.05, 0.09], wettest: 60, fog: 0.1, lag: 14,
    fogText: 'A haze comes in off the Sound, and the light stands in it like a lamp in a sack.', thunderText: 'Thunder, far off over the mainland. The light does not waver.' },
  // The pilgrims' camp's three tents in the Bowl (#762), drawn ahead and opened by the isle (#753).
  interiors: INTERIORS,
  // The Hearth, the site planned on the atlas since the start, built with the isle (#753; §7); the crawlers,
  // first placed in the Ways (#757); the Core's clock, on Vask's group at the Heart (#759).
  novel: { families: ['crawlers'], terrain: [], mechanics: ['encounter:clock'], landmarks: ['hearth'] },
  atlas: { zones: ZONES, places: PLACES, sites: SITES },
} satisfies Area;
