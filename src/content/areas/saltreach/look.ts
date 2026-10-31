// Saltreach's look (#1097), beside its climate: the colours its land is seen in, today's where a field is absent.
import type { AreaLook } from '../../area.ts';

export const LOOK: AreaLook = {
  // Its grass, hills, woods and the delta's swamp a lush blue-green.
  tints: { grass: { toward: '#00d8a8', by: 0.25 }, hills: { toward: '#00d8a8', by: 0.25 }, woods: { toward: '#00d8a8', by: 0.25 }, pine: { toward: '#00d8a8', by: 0.25 }, swamp: { toward: '#00d8a8', by: 0.25 } },
  // The delta's damp: a sea-green haze over the water and the reeds.
  air: { strength: 0.2, top: '#205050', foot: '#00c080', haze: '#20b080' },
  // The delta's willows and poplars, a broadleaf among them.
  trees: { forest: { willow: 3, poplar: 2, broadleaf: 1 } },
};
