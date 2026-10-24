// The way into Ashfall from another area, and the only one (#992; EXPANSION §8.2): the flags and
// exits the others take, declared here and imported back by the files they stood in, and every item by name.
import type { Exit } from '../../../game/mapdef.ts';
import { anchored } from '../../../game/map.ts';

// From maps/ember_stone.ts.
/** The flag the Stone lights on (docs/areas/ashfall.md §9, #548's 1): the Hearth counts it, and the sentries wait on it. */
export const LIT = 'q_ember_lit';

// From maps/emberwaste_e10.ts.
/**
 * The road west taken once the Stone is lit: `e10_west` sets it on the Hills' last shoulder, the once,
 * and the Wold's D8 at its horse-lines (`d8_east`) for a company that rides west instead. Ashfall's
 * chapter, The Window, is done on it, and the Wold's (#531) starts on it.
 */
export const ROAD_WEST = 'q_road_west';

// From maps/firemount_g11.ts.
/**
 * The way down to Meridian Camp (#22): the middle of the vents' three mouths, 26,16, open ash between
 * the two still breathing, onto the vents' flue hall at 16,1, facing south; the way back up lands on
 * 27,16, facing east, the vents' front.
 */
export const VENTS: Exit = anchored({ x: 26, y: 16, to: 'meridian_camp', at: 'start',
  label: 'Down into the middle mouth on rungs hot through the glove, and a drop at the end onto iron.' });

// From maps/meridian_camp.ts.
/**
 * The way down to the iron corridors (meridian_camp2, #22's second level): the stair at the far end,
 * 4,30, onto the corridors' first square at 4,1, facing south; their way back up lands on 4,29, facing
 * north, the stair's head.
 */
export const STAIR: Exit = anchored({ x: 4, y: 30, to: 'meridian_camp2', at: 'start',
  label: 'Down the steps into the red dark, the heat climbing to meet you a step at a time.' });

// From maps/meridian_camp2.ts.
/**
 * The way down to the camp (meridian_camp3, #22's third level): the stair at the corridors' end, 4,30,
 * onto the camp's first square at 4,1, facing south; its way back up lands on 4,29, facing north, the
 * stair's head.
 */
export const STAIR2: Exit = anchored({ x: 4, y: 30, to: 'meridian_camp3', at: 'start',
  label: 'Down the steps out of the heat, into a cold that takes the breath.' });

// From maps/meridian_camp3.ts.
/**
 * Fane's rope (#22; meridian_camp.md §8, 3): from its foot up the cold flue off the hall, 19,2, onto Fire
 * Mountain's shoulder at G11's 13,10, beside the lookout, facing south. A way out and never in, as Kelp
 * Hole's flooded passage is: nothing on G11 leads back down it.
 */
export const ROPE: Exit = anchored({ x: 19, y: 2, to: 'firemount_g11', at: 'from_meridian_camp3',
  label: 'Up the rope, a long cold climb in the dark, and out through a crack into wind on the mountain\'s shoulder.' });

// Every item by name, with the rest of items.ts.
export * from './items.ts';

// Every flag it sets, each with what holding it means (#995).
export { FLAGS } from './flags.ts';
