// The Whitespine's look (#1097), beside its climate: the colours its land is seen in, today's where a field is absent.
import type { AreaLook } from '../../area.ts';

export const LOOK: AreaLook = {
  // A hard, cold blue, the deepest at the top: cobalt over the heights.
  air: { strength: 0.2, top: '#000060', foot: '#2040c0' },
  // Scree down the hills under the peaks.
  hills: 'scree',
  // Larch and dark conifers on the heights, a Scots pine among them.
  trees: { pine: { larch: 2, conifer: 2, scots: 1 } },
};
