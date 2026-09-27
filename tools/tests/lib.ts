// What every suite shares: the check that prints a line and counts a failure, and where the party
// stands on the maps as written. The count lives here, as a module's own binding can only be
// changed by the module.
import type { World } from '../../src/game/world.ts';

let failures = 0;
export const ok = (cond: boolean, msg: string): void => { console.log((cond ? '  ok:   ' : '  FAIL: ') + msg); if (!cond) failures++; };
/** A suite that threw counts as a failure. */
export const fail = (msg: string): void => { console.log('  FAIL: ' + msg); failures++; };
export const failureCount = (): number => failures;

/** Where the party stands on the maps as written: outdoors, its zone map and the cell on it. */
export const local = (w: World): { map: string; x: number; y: number } => {
  const z = w.zone;
  return z ? { map: z.id, x: w.state.x - z.x, y: w.state.y - z.y } : { map: w.state.mapId, x: w.state.x, y: w.state.y };
};
