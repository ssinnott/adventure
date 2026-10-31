// Sunderwood's look (#1097), beside its climate: the colours its land is seen in, today's where a field is absent.
import type { AreaLook } from '../../area.ts';

export const LOOK: AreaLook = {
  // Its grass, hills and woods a deep moss green, under the leaves.
  tints: { grass: { toward: '#006020', by: 0.25 }, hills: { toward: '#006020', by: 0.25 }, woods: { toward: '#006020', by: 0.25 }, pine: { toward: '#006020', by: 0.25 } },
  // Under the leaves: a green shade over the wood.
  air: { strength: 0.2, top: '#006020', foot: '#80ff00', haze: '#60c000' },
};
