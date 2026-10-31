// Cairnmoor's look (#1097), beside its climate: the colours its land is seen in, today's where a field is absent.
import type { AreaLook } from '../../area.ts';

export const LOOK: AreaLook = {
  // Its grass, hills and woods wind-burnt, a yellow-green.
  tints: { grass: { toward: '#c88c28', by: 0.25 }, hills: { toward: '#c88c28', by: 0.25 }, woods: { toward: '#c88c28', by: 0.25 }, pine: { toward: '#c88c28', by: 0.25 } },
  // A low grey-green over the moor.
  air: { strength: 0.2, top: '#304010', foot: '#709000', haze: '#607020' },
};
