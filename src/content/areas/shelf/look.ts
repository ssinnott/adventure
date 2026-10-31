// The Foreland's look (#1097), beside its climate: the colours its land is seen in, today's where a field is absent.
import type { AreaLook } from '../../area.ts';

export const LOOK: AreaLook = {
  // No air: the sky as it always was.
  // The downs: chalk under the turf, white where it is broken.
  hills: 'downs',
  // The downs' broadleaves, a thorn and a birch among them; no conifer.
  trees: { forest: { broadleaf: 3, thorn: 1, birch: 1 } },
};
