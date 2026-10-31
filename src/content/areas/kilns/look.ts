// The Kilns' look (#1097), beside its climate: the colours its land is seen in, today's where a field is absent.
import type { AreaLook } from '../../area.ts';

export const LOOK: AreaLook = {
  // Smoke from the kilns lies along the foot of the sky.
  air: { strength: 0.2, foot: '#201000', haze: '#201810' },
  // Oak and birch for the charcoal; larch among the conifers.
  trees: { forest: { oak: 2, birch: 2, broadleaf: 1 }, pine: { conifer: 2, larch: 1 } },
};
