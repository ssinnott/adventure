// Ashfall, the far side of the Sound (band 24-26): Cindercoast, Fire Mountain and the Ember Waste, the
// second area of Act IV, begun by sea (#443, call 6). docs/areas/ashfall.md is its brief.
import type { Area } from '../../area.ts';
import { CINDERCOAST_H10 } from './maps/cindercoast_h10.ts';
import { CINDERCOAST_G10 } from './maps/cindercoast_g10.ts';
import { CINDERPORT } from './maps/cinderport.ts';
import { FIREMOUNT_G11 } from './maps/firemount_g11.ts';
import { MERIDIAN_CAMP } from './maps/meridian_camp.ts';
import { MERIDIAN_CAMP2 } from './maps/meridian_camp2.ts';
import { EMBERWASTE_F10 } from './maps/emberwaste_f10.ts';
import { EMBERWASTE_E10 } from './maps/emberwaste_e10.ts';
import { EMBERWASTE_F11 } from './maps/emberwaste_f11.ts';
import { OLD_CINDER } from './maps/old_cinder.ts';
import { OLD_CINDER2 } from './maps/old_cinder2.ts';
import { EMBER_STONE } from './maps/ember_stone.ts';
import { GUILDS } from './guilds.ts';
import { MONSTERS, SPRITES } from './monsters.ts';
import { ITEMS } from './items.ts';
import { INTERIORS } from './interiors.ts';
import { ZONES, PLACES, SITES } from './atlas.ts';

export const AREA = {
  id: 'ashfall' as const,
  // In road order: the Stair's foot (#510), Cinderport's box (#511), the town (#512), Fire Mountain's
  // flank (#513), the vents beneath it and the iron corridors under them (#22), the Waste's road west of
  // the box (#517), Old Cinder's and the Ember Stone's box south of it (#514), Old Cinder's two
  // levels under its crater (#515) and the Ember Stone under its field of cinders (#516).
  maps: [CINDERCOAST_H10, CINDERCOAST_G10, CINDERPORT, FIREMOUNT_G11, MERIDIAN_CAMP, MERIDIAN_CAMP2, EMBERWASTE_F10, EMBERWASTE_E10, EMBERWASTE_F11, OLD_CINDER, OLD_CINDER2, EMBER_STONE],
  monsters: MONSTERS,
  sprites: SPRITES,
  // Cinderport's armourer's step (#542) and the chandler's stone cure (#546), sold in the town (#512); the
  // boxes' finds; the Ember Stone's first part and the stokers' parts, on Meridian Camp's vents, and its
  // third part, the Company's mail and the flue walker's parts, on the iron corridors (#22).
  items: ITEMS,
  quests: [],
  // The Cartographers' Surveyor's rung, the fourth Meridian journal found under the Ember Stone (#635).
  guilds: GUILDS,
  // The Window, the act's second chapter, is #518's.
  chapter: undefined,
  // The coast under the mountain: warm and wet, the vines green the year round, smoke for fog and the
  // mountain for thunder.
  climate: { summer: 24, winter: 10, daily: 6, damp: [0.04, 0.11], wettest: 200, fog: 0.3, lag: 16,
    fogText: 'Smoke comes down off the mountain and lies along the shore.', thunderText: 'Thunder over the mountain, or the mountain itself.' },
  // Cinderport's rooms (#521), each opened by its business in the town (#512).
  interiors: INTERIORS,
  // Vines underfoot (#543) and the drakes, a family of their own (#520), with G10 (#511); the heavy
  // machines (#520), the volcano and its vents underfoot (#543) and the volcano on the map, with G11
  // (#513), and the hot springs, Scaldwell, with H10 (#510). Lava was the Kilns' first, and the sweep with
  // fire has no token to claim (#545).
  novel: { families: ['drakes', 'machines'], terrain: ['vines', 'volcano', 'vent'], mechanics: [], landmarks: ['volcano', 'springs'] },
  atlas: { zones: ZONES, places: PLACES, sites: SITES },
} satisfies Area;
