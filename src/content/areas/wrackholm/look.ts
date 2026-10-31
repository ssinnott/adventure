// Wrackholm's look (#1097), beside its climate: the colours its land is seen in, today's where a field is absent.
import type { AreaLook } from '../../area.ts';

export const LOOK: AreaLook = {
  // Its grass, hills and woods wind-burnt, a yellow-green.
  tints: { grass: { toward: '#c88c28', by: 0.25 }, hills: { toward: '#c88c28', by: 0.25 }, woods: { toward: '#c88c28', by: 0.25 }, pine: { toward: '#c88c28', by: 0.25 } },
  // Out in the gulf: a sky of slate and steel over the sea.
  air: { strength: 0.2, top: '#102030', foot: '#304860', haze: '#405870' },
};
