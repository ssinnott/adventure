// Rimewater's look (#1097), beside its climate: the colours its land is seen in, today's where a field is absent.
import type { AreaLook } from '../../area.ts';

export const LOOK: AreaLook = {
  // Its grass, hills and woods a cold grey-green.
  tints: { grass: { toward: '#7898b8', by: 0.25 }, hills: { toward: '#7898b8', by: 0.25 }, woods: { toward: '#7898b8', by: 0.25 }, pine: { toward: '#7898b8', by: 0.25 } },
  // A hard, cold blue over the ice, icy at the foot.
  air: { strength: 0.2, top: '#0060ff', foot: '#00e0ff' },
};
