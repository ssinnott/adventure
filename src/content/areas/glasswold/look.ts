// The Glasswold's look (#1097), beside its climate: the colours its land is seen in, today's where a field is absent.
import type { AreaLook } from '../../area.ts';

export const LOOK: AreaLook = {
  // Its grass, hills and woods gone to straw.
  tints: { grass: { toward: '#ffe080', by: 0.25 }, hills: { toward: '#ffe080', by: 0.25 }, woods: { toward: '#ffe080', by: 0.25 }, pine: { toward: '#ffe080', by: 0.25 } },
  // A bleached, pale sky; a white sun.
  air: { strength: 0.2, top: '#ffffff', foot: '#ffffff', haze: '#ffffff', sun: '#ffffff' },
  // The steppe's flat-topped trees.
  trees: { forest: { flattop: 1 } },
};
