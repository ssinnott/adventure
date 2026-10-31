// Ashfall's look (#1097), beside its climate: the colours its land is seen in, today's where a field is absent.
import type { AreaLook } from '../../area.ts';

export const LOOK: AreaLook = {
  // Ash in the air: the sky browned and far things fading into it; a red sun.
  air: { strength: 0.2, top: '#603000', foot: '#b06010', haze: '#906020', sun: '#ff5030' },
  // Broadleaf and thorn; Scots pine among the dark conifers.
  trees: { forest: { broadleaf: 2, thorn: 1 }, pine: { conifer: 2, scots: 1 } },
};
