// The Whitespine's look (#1097), beside its climate: the colours its land is seen in, today's where a field is absent.
import type { AreaLook } from '../../area.ts';

export const LOOK: AreaLook = {
  // Its grass, hills and woods a cold grey-green.
  tints: { grass: { toward: '#7898b8', by: 0.25 }, hills: { toward: '#7898b8', by: 0.25 }, woods: { toward: '#7898b8', by: 0.25 }, pine: { toward: '#7898b8', by: 0.25 } },
  // A hard, cold blue, the deepest at the top: cobalt over the heights.
  air: { strength: 0.2, top: '#000060', foot: '#2040c0' },
  // Larch and dark conifers on the heights, a Scots pine among them.
  trees: { pine: { larch: 2, conifer: 2, scots: 1 } },
};
