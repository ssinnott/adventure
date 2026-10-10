// What every suite shares: the check that prints a line and counts a failure, the line for a check
// that is owed, where the party stands on the maps as written, and the monster family modules. The
// count lives here, as a module's own binding can only be changed by the module.
import { readdirSync } from 'node:fs';
import type { World } from '../../src/game/world.ts';
import type { GameMap } from '../../src/game/map.ts';
import { Game } from '../../src/game/game.ts';
import type { Action } from '../../src/input.ts';

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

/**
 * Whether the reachability walks stop at a square, given keys, secrets, water and climbing: a wall,
 * the void, the chasm, a tree or a rock. None is open ground to walk to, either.
 */
export const stopsWalk = (m: GameMap, x: number, y: number): boolean => {
  const p = m.passable(x, y, { swim: true, climb: true, keys: 1 }), c = m.at(x, y);
  return p === 'wall' || p === 'void' || p === 'chasm' || c.solid === 'tree' || c.solid === 'rock';
};

/** A monster family: its module in src/ui/monsters/ (by name, as 'boar'), the kinds it lists and the drawer it exports. */
export interface Family { name: string; kinds: readonly string[]; draw: unknown }

/** Every module in src/ui/monsters/ that lists its kinds, by name; a shared brush lists none. */
export async function familyModules(): Promise<Family[]> {
  const dir = new URL('../../src/ui/monsters/', import.meta.url), out: Family[] = [];
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.ts')).sort()) {
    const m = (await import(new URL(f, dir).href)) as { KINDS?: readonly string[]; draw?: unknown };
    if (m.KINDS) out.push({ name: f.slice(0, -3), kinds: m.KINDS, draw: m.draw });
  }
  return out;
}

/** A Game under Node, on a new game at `seed` with the premade company, with the pilot off. */
export function headlessGame(seed = 4): Game {
  const g = new Game(null);
  g.input = { textMode: false, drainText: (c) => c };
  g.newGame(seed);
  return g;
}

/** Presses `actions` into the game, one per tick, then `settle` ticks of nothing. */
export function drive(g: Game, actions: readonly (Action | null)[], settle = 0): void {
  for (const a of actions) g.update(a);
  for (let i = 0; i < settle; i++) g.update(null);
}
