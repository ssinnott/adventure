// What every suite shares: the check that prints a line and counts a failure, the line for a check
// that is owed, where the party stands on the maps as written, the monster family modules, and a
// Game to build and drive under Node. The count lives here, as a module's own binding can only be
// changed by the module.
import { readdirSync } from 'node:fs';
import { Game } from '../../src/game/game.ts';
import type { World } from '../../src/game/world.ts';
import type { GameMap } from '../../src/game/map.ts';
import type { Party } from '../../src/game/party.ts';
import type { Action } from '../../src/input.ts';
import { drainTyped } from '../../src/input.ts';
import { SAVE_KEY } from '../../src/game/save.ts';

/** Whether every check prints its line (`--list`, or TEST_LIST=1); by default only one that fails does (#895). */
export const LIST = process.argv.includes('--list') || process.env.TEST_LIST === '1';

let failures = 0, held = 0;
export const ok = (cond: boolean, msg: string): void => {
  if (cond) held++; else failures++;
  if (LIST || !cond) console.log((cond ? '  ok:   ' : '  FAIL: ') + msg);
};
/** A suite that threw counts as a failure. */
export const fail = (msg: string): void => { console.log('  FAIL: ' + msg); failures++; };
export const failureCount = (): number => failures;
/** How many checks have held so far: a suite's count is what it adds. */
export const heldCount = (): number => held;

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

/** A suite as it ran: its seconds and its counts of checks held, failed and owed (#895). */
export interface Ran { name: string; secs: number; held: number; failed: number; owed: number }

/** A suite's line, `maps   4.1 s  7,410 ok`, its name padded to `width`. */
export const ranLine = (r: Ran, width = 0): string =>
  `${r.name.padEnd(width)}  ${r.secs.toFixed(1).padStart(5)} s  ${r.held.toLocaleString('en-GB')} ok` +
  (r.failed ? `, ${r.failed} failed` : '') + (r.owed ? `, ${r.owed} owed` : '');

/**
 * The end of a run: the suites' lines, the slowest first, then the last line, 'ALL OK' or the
 * failures, and what is owed by whom.
 */
export const summary = (failures: number, owing: ReadonlyMap<string, number>, ran: readonly Ran[] = []): string => {
  const whose = [...owing].sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }));
  const total = whose.reduce((n, [, k]) => n + k, 0);
  const owed = total ? ` (${total} owed: ${whose.map(([w, k]) => `${w} ×${k}`).join(', ')})` : '';
  const width = Math.max(0, ...ran.map((r) => r.name.length)), secs = ran.reduce((n, r) => n + r.secs, 0);
  const table = ran.length ? `Each suite's seconds, the slowest first (${secs.toFixed(1)} s in all):\n` +
    [...ran].sort((a, b) => b.secs - a.secs).map((r) => `  ${ranLine(r, width)}\n`).join('') + '\n' : '';
  return table + (failures ? `${failures} FAILURE(S)` : 'ALL OK') + owed;
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

/**
 * A Game under Node, on a new game at `seed` with the premade company, or with `party` (#723: the
 * company P on the title draws, `randomParty(seed)`), with the pilot off.
 */
export function headlessGame(seed = 4, party?: Party): Game {
  const g = typing(new Game(null));
  g.newGame(seed, party);
  return g;
}

/**
 * A Game under Node loaded from a save's text (`serialize`), as F9 loads one (`Game.loadGame`), with
 * the pilot off: the full run's save point before a chapter, played again (#723).
 */
export function headlessLoad(save: string): Game {
  const g = typing(new Game({ getItem: (key) => (key === SAVE_KEY ? save : null), setItem: () => {}, removeItem: () => {} }));
  if (!g.loadGame()) throw new Error('the save would not load');
  return g;
}

/** The keyboard's text mode without a keyboard: what is typed (the pilot's riddle words, #721) is drained as Input drains it. */
function typing(g: Game): Game {
  const typed: string[] = [];
  g.input = { textMode: false, typed, drainText: (c, max) => drainTyped(typed, c, max) };
  return g;
}

/**
 * Presses `actions` into the game one per tick (a null is a tick of nothing), then `settle` ticks of
 * nothing. A tick of nothing is the pilot's, if the game has one, as in src/main.ts: its key, if any.
 */
export function drive(g: Game, actions: readonly (Action | null)[], settle = 0): void {
  for (const a of [...actions, ...Array<null>(settle).fill(null)]) g.update(a ?? g.pilot?.next(g) ?? null);
}
