// A walkthrough that exports only `walkthrough`, for the runner's own check (#1018): one scene named for
// its area, run whole as `walkthrough:whole` and printed as every walkthrough was before scenes. Run
// after the first fixture's scenes, its walk reads the maps as built.
import type { Walkthrough } from '../../../../../src/content/area.ts';
import { newWalk } from '../../../../kit/walk.ts';
import { secret } from '../fx/walkthrough.ts';

export const walkthrough: Walkthrough = (ok) => {
  console.log('  note: the whole walkthrough ran');
  const s = secret();
  ok(newWalk(ok).world.maps[s.map].at(s.x, s.y).door === 'secret', 'a walkthrough of one function runs whole, and its walk reads the maps as built');
};
