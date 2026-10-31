// Hearth Isle's look (#1097), beside its climate: the colours its land is seen in, today's where a field is absent.
import type { AreaLook } from '../../area.ts';

export const LOOK: AreaLook = {
  // Its grass, hills and woods a sunlit gold-green.
  tints: { grass: { toward: '#b0f020', by: 0.25 }, hills: { toward: '#b0f020', by: 0.25 }, woods: { toward: '#b0f020', by: 0.25 }, pine: { toward: '#b0f020', by: 0.25 } },
  // A warm gold, deepest at the foot; a golden sun.
  air: { strength: 0.2, top: '#e09000', foot: '#ffc000', haze: '#f0b000', sun: '#ffc840' },
};
