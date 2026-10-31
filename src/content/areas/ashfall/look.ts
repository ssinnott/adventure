// Ashfall's look (#1097), beside its climate: the colours its land is seen in, today's where a field is absent.
import type { AreaLook } from '../../area.ts';

export const LOOK: AreaLook = {
  // Its grass, hills and woods a dusty green.
  tints: { grass: { toward: '#c8c0a0', by: 0.25 }, hills: { toward: '#c8c0a0', by: 0.25 }, woods: { toward: '#c8c0a0', by: 0.25 }, pine: { toward: '#c8c0a0', by: 0.25 } },
  // Ash in the air: the sky browned and far things fading into it; a red sun.
  air: { strength: 0.2, top: '#603000', foot: '#b06010', haze: '#906020', sun: '#ff5030' },
};
