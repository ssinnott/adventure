// Hearth Isle's look (#1097), beside its climate: the colours its land is seen in, today's where a field is absent.
import type { AreaLook } from '../../area.ts';

export const LOOK: AreaLook = {
  // A warm gold, deepest at the foot; a golden sun.
  air: { strength: 0.2, top: '#e09000', foot: '#ffc000', haze: '#f0b000', sun: '#ffc840' },
  // Broadleaves and rowan.
  trees: { forest: { broadleaf: 2, rowan: 1 } },
};
