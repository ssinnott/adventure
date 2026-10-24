// The way into Cairnmoor from another area, and the only one (#992; EXPANSION §8.2): the flags and
// exits the others take, declared here and imported back by the files they stood in, and every item by name.
import type { Exit } from '../../../game/map.ts';
import { anchored } from '../../../game/map.ts';

// From maps/cairnfield_n8.ts.
/**
 * The way down to Rime Lodge (#438): N8 and Rimewater's M9 meet only at a corner, and M8 between them
 * is parked, so the drove road is not walked across but taken: the notch at 0,28 (the atlas's 424,250)
 * leads onto M9's road at 22,8 (414,262), facing west for the lodge. M9 (#486) lists it in this map's
 * exits; its way back (M9's UP) lands on 1,28, facing east, the road's last square. The label leaves
 * the loch's name to the crossing line said after it (World's `crossing`, #166).
 */
export const NOTCH: Exit = anchored({ x: 0, y: 28, to: 'longmere_m9', at: 'start', label: 'Down through the notch to the frozen loch.' });

// Every item by name, with the rest of items.ts.
export * from './items.ts';

// Every flag it sets, each with what holding it means (#995).
export { FLAGS } from './flags.ts';
