// What every suite shares: the check that prints a line and counts a failure, the line for a check
// that is owed, and where the party stands on the maps as written. The count lives here, as a module's own binding can only be
// changed by the module.
import type { World } from '../../src/game/world.ts';

let failures = 0;
export const ok = (cond: boolean, msg: string): void => { console.log((cond ? '  ok:   ' : '  FAIL: ') + msg); if (!cond) failures++; };
/** A suite that threw counts as a failure. */
export const fail = (msg: string): void => { console.log('  FAIL: ' + msg); failures++; };
export const failureCount = (): number => failures;

const owing = new Map<string, number>();
/**
 * A check that is reported, not failed, while someone owes it: `whose` names who, as '#40'. Once it
 * holds, it fails, so the entry is dropped and the check becomes an `ok`.
 */
export const owed = (cond: boolean, msg: string, whose: string): void => {
  if (cond) { console.log(`  FAIL: ${msg}: this holds now, so drop the owed entry (${whose})`); failures++; return; }
  console.log(`  owed: ${msg} (${whose}'s)`);
  owing.set(whose, (owing.get(whose) ?? 0) + 1);
};
export const owedCount = (): ReadonlyMap<string, number> => owing;

/** The last line of a run: 'ALL OK' or the failures, and what is owed by whom. */
export const summary = (failures: number, owing: ReadonlyMap<string, number>): string => {
  const whose = [...owing].sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }));
  const total = whose.reduce((n, [, k]) => n + k, 0);
  const owed = total ? ` (${total} owed: ${whose.map(([w, k]) => `${w} ×${k}`).join(', ')})` : '';
  return (failures ? `${failures} FAILURE(S)` : 'ALL OK') + owed;
};

/** Where the party stands on the maps as written: outdoors, its zone map and the cell on it. */
export const local = (w: World): { map: string; x: number; y: number } => {
  const z = w.zone;
  return z ? { map: z.id, x: w.state.x - z.x, y: w.state.y - z.y } : { map: w.state.mapId, x: w.state.x, y: w.state.y };
};
