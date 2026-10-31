// The Kilns' look (#1097), beside its climate: the colours its land is seen in, today's where a field is absent.
import type { AreaLook } from '../../area.ts';

export const LOOK: AreaLook = {
  // Its grass, hills and woods a sooty olive.
  tints: { grass: { toward: '#302410', by: 0.25 }, hills: { toward: '#302410', by: 0.25 }, woods: { toward: '#302410', by: 0.25 }, pine: { toward: '#302410', by: 0.25 } },
  // Smoke from the kilns lies along the foot of the sky.
  air: { strength: 0.2, foot: '#201000', haze: '#201810' },
};
