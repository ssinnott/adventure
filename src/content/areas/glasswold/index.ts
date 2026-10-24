// The Glasswold, the steppe round the Glass (band 26-28): the Wold, on the road, and the Glass, the reach
// (DESIGN §9), the third area of Act IV, the far side of the Cinder Hills. docs/areas/glasswold.md is its brief.
import type { Area } from '../../area.ts';
import { WOLD_D9 } from './maps/wold_d9.ts';
import { WOLD_D10 } from './maps/wold_d10.ts';
import { WOLD_D8 } from './maps/wold_d8.ts';
import { WOLD_C8 } from './maps/wold_c8.ts';
import { WOLD_B8 } from './maps/wold_b8.ts';
import { WOLD_B9 } from './maps/wold_b9.ts';
import { WOLD_E9 } from './maps/wold_e9.ts';
import { WOLD_E8 } from './maps/wold_e8.ts';
import { WOLD_D7 } from './maps/wold_d7.ts';
import { WOLD_E7 } from './maps/wold_e7.ts';
import { KARAORDU } from './maps/karaordu.ts';
import { KUSHDAG } from './maps/kushdag.ts';
import { MONSTERS, SPRITES } from './monsters.ts';
import { ITEMS } from './items.ts';
import { ZONES, PLACES, SITES, LINKS } from './atlas.ts';
import { INTERIORS } from './interiors.ts';
import { QUESTS } from './quests.ts';
import { CHAPTER } from './chapter.ts';

export const MAPS = [WOLD_D10, WOLD_D9, WOLD_D8, WOLD_C8, WOLD_B8, WOLD_B9, WOLD_E9, WOLD_E8, WOLD_D7, WOLD_E7, KARAORDU, KUSHDAG];

export const AREA = {
  id: 'glasswold' as const,
  // In road order: the mesas (#527), the way in from E10, then the steppe (#525), the area's first built,
  // Akordu, the Riders' camp (#526), the Scarp's edge west of it, where the stair from the Saltings
  // comes up (#528), the Wold's heart west again under the rim, the Grey Lion's and Kushtash (#529), and
  // the Glass's edge south of it, the dunes and the Riders' gap (#530); then the country behind the road,
  // the hills between the steppe and the sea and the shore north of them (#534); and the bounds (#833),
  // the Scarp's east end over the gulf and the other island's north, then Karaordu, the enclave (#845)
  // under the hills over Akordu's box, at 28-29, and Kushdag, the artifact's lair (#847) in the Scarp's
  // east face, at 30-32.
  maps: MAPS,
  monsters: MONSTERS,
  sprites: SPRITES,
  // The boxes' finds, the Riders' leather their trader sells at Akordu (#526) and the Compact's letter in
  // the cleft under the Scarp's lip (#528), and the side quests' three things carried (#532); no step on
  // the ladder (#542).
  items: ITEMS,
  // #56's four side quests (#532): The Horse That Came Back and Orders on the Scarp Stair, given from
  // Cinderport's halls, The Lion's Share and The Garden of Glass, from Akordu; and the third prestiges'
  // quests, the Ranger's Oriel Fane's Map, from Aysu on Kushtash (#448), and the Sorcerer's What the
  // Walkers Carried, from Eadmer at the Glass's edge (#807).
  quests: QUESTS,
  chapter: CHAPTER,
  // The steppe: hot summers and hard winters, the days warm and the nights cold, little rain and that
  // in spring, dust for fog and thunder over the grass.
  climate: { summer: 26, winter: -4, daily: 11, damp: [0.01, 0.06], wettest: 120, fog: 0.1, lag: 18,
    fogText: 'Dust comes up off the grass and hangs in the air.', thunderText: 'Thunder rolls over the grass from far off.' },
  // The Riders' trader's tent at Akordu (#526).
  interiors: INTERIORS,
  // The glass walkers, a new family, placed first here (#533), and the dunes underfoot (#543). Steppe
  // was laid first by Ashfall's E10 (#517), and the lions are the cats', on the road before. Stone,
  // first inflicted by the mesas' basilisks (#546, #527); Akordu's camp (#526) is a landmark on the road
  // before it.
  novel: { families: ['glasswalkers'], terrain: ['dunes'], mechanics: ['inflict:stoned'], landmarks: [] },
  atlas: { zones: ZONES, places: PLACES, sites: SITES, links: LINKS },
} satisfies Area;
