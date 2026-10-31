// Cairnmoor's look (#1097), beside its climate: the colours its land is seen in, today's where a field is absent.
import type { AreaLook } from '../../area.ts';

export const LOOK: AreaLook = {
  // A low grey-green over the moor.
  air: { strength: 0.2, top: '#304010', foot: '#709000', haze: '#607020' },
  // Tors: granite piled on the moor's hills.
  hills: 'tors',
  // Rowan and thorn on the moor; Scots pine in its pinewoods.
  trees: { forest: { rowan: 2, thorn: 2 }, pine: { scots: 1 } },
};
