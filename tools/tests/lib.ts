// What every suite shares: the check that prints a line and counts a failure, the line for a check
// that is owed, where the party stands on the maps as written, the monster family modules and a Game
// to build and drive under Node. A suite lends a def by a table of its own (`tablesWith`,
// tools/kit/headless.ts). The count lives here, as a module's own binding can only be changed by the module.
import { readdirSync } from 'node:fs';
import type { World } from '../../src/game/world.ts';
import type { GameMap } from '../../src/game/map.ts';
import type { MapId, Flag } from '../../src/content/index.ts';
import type { MapKey } from '../../src/game/keys.ts';

/** Whether every check prints its line (`--list`, or TEST_LIST=1); by default only one that fails does (#895). */
export const LIST = process.argv.includes('--list') || process.env.TEST_LIST === '1';

/**
 * The areas the gate and the walkthroughs run for, where the runner narrows them (#955: `--areas a,b`
 * or TEST_AREAS, `--since <ref>` or TEST_SINCE, read in tools/test.ts); unset, every area.
 */
let narrowedTo: ReadonlySet<string> | undefined;
export const narrow = (areas: readonly string[] | undefined): void => { narrowedTo = areas && new Set(areas); };
/** Whether the run asks for an area: every area unless the runner narrowed them. */
export const asked = (area: string): boolean => !narrowedTo || narrowedTo.has(area);
/** The areas the runner narrowed to, or undefined for every area. */
export const narrowed = (): readonly string[] | undefined => narrowedTo && [...narrowedTo];

let failures = 0, held = 0;
/**
 * A map only a suite's fixture has (`fx_hall`), which no area lists, or one a check reads off any map as
 * a string: the fixture's wider type, handed to the game as a map's id (#994). A real map's id needs none.
 */
export const fxMap = (id: string): MapId => id as MapId;
/** A thing on a fixture's map, `'map:id'`, or a key the game must refuse: handed on as `fxMap` hands a map. */
export const fxKey = (key: string): MapKey => key as MapKey;
/**
 * A flag only a suite's fixture has (`fx_flag`), which no area declares, or one a check reads off any map
 * as a string: the fixture's wider type, handed to the game as a flag (#995). A declared flag needs none.
 */
export const fxFlag = (flag: string): Flag => flag as Flag;

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
 * The end of a run: the suites' lines, the slowest first, the line of the run's wall (#954), then the
 * last line, 'ALL OK' or the failures, and what is owed by whom.
 */
export const summary = (failures: number, owing: ReadonlyMap<string, number>, ran: readonly Ran[] = [], wall = ''): string => {
  const whose = [...owing].sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }));
  const total = whose.reduce((n, [, k]) => n + k, 0);
  const owed = total ? ` (${total} owed: ${whose.map(([w, k]) => `${w} ×${k}`).join(', ')})` : '';
  const width = Math.max(0, ...ran.map((r) => r.name.length)), secs = ran.reduce((n, r) => n + r.secs, 0);
  const table = ran.length ? `Each suite's seconds, the slowest first (${secs.toFixed(1)} s in all):\n` +
    [...ran].sort((a, b) => b.secs - a.secs).map((r) => `  ${ranLine(r, width)}\n`).join('') + '\n' : '';
  return table + (wall ? `${wall}\n` : '') + (failures ? `${failures} FAILURE(S)` : 'ALL OK') + owed;
};

/**
 * A value two parts of a suite read (#1016), built the first time one asks for it and kept for the
 * run: a part run alone builds what it reads, and a whole run builds it once. One that throws keeps
 * nothing, so the next part to ask builds it again.
 */
export const lazy = <T>(make: () => T): (() => T) => {
  let kept: { value: T } | undefined;
  return () => (kept ??= { value: make() }).value;
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

/** A monster family: its module in src/ui/monsters/ (by name, as 'boar'), the kinds it registers, what it registers for each and the drawer it exports. */
export interface Family { name: string; kinds: readonly string[]; sprites: Readonly<Record<string, { draw: unknown }>>; draw: unknown }

/** Every module in src/ui/monsters/ that registers kinds, by name; a shared brush registers none, and the barrel (index.ts) merges them. */
export async function familyModules(): Promise<Family[]> {
  const dir = new URL('../../src/ui/monsters/', import.meta.url), out: Family[] = [];
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.ts') && f !== 'index.ts').sort()) {
    const m = (await import(new URL(f, dir).href)) as { SPRITES?: Record<string, { draw: unknown }>; draw?: unknown };
    if (m.SPRITES) out.push({ name: f.slice(0, -3), kinds: Object.keys(m.SPRITES), sprites: m.SPRITES, draw: m.draw });
  }
  return out;
}
