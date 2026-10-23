// Pure-Node tests for the game model: maps, movement, combat determinism, saves, the quest log. No
// browser. The runner finds its suites: every tools/tests/*.ts but lib.ts, each exporting a
// function named after its file, which may be async. Today's suites run first in the order below,
// then any other in name order, then each area's walkthrough
// (src/content/areas/<area>/walkthrough.ts) where it has one, in road order. A suite is added by
// its file alone.
//   node tools/test.ts                  run everything but the suites run only when named (ASKED)
//   node tools/test.ts maps combat      run selected suites
//   node tools/test.ts walkthrough:shelf  run one area's walkthrough
//   FULLRUN=all node tools/test.ts fullrun  the pilot's full run on the areas FULLRUN names (shelf unset)
//   node tools/test.ts --dir <folder>   run the suites in another folder, and no walkthroughs (the
//                                       runner's own check, tools/tests/runner/check.ts)
//   node tools/test.ts --list           print every line, as TEST_LIST=1 does (#895)
//   node tools/test.ts --since <ref>    the gate and the walkthroughs only for the areas the diff
//                                       since <ref> reaches (tools/changed.ts), as TEST_SINCE does
//   node tools/test.ts --areas a,b      only for those areas, as TEST_AREAS=a,b does (#955)
// By default a suite prints its name as it starts, then its failures and its owed lines; what else it
// prints waits for --list or its first failure; every suite ends with a line of its seconds and its
// count, and the run with a table of them, the slowest first, before its last line. A run narrowed to
// areas says which and why before the table; with none given everything runs. Where
// GITHUB_STEP_SUMMARY is set, that line and the table go into it too.
import { readdirSync, existsSync, appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { ok, fail, failureCount, heldCount, owedCount, summary, ranLine, narrow, asked, LIST, type Ran } from './tests/lib.ts';
import type { Walkthrough } from '../src/content/area.ts';
import { AREAS, ITEMS, MONSTERS } from '../src/content/index.ts';

/** Every entry of the item and the monster tables, by name, each value as it is: what a suite must leave as it found (#946). */
const tables = (): Map<string, unknown> => new Map<string, unknown>([...Object.entries(ITEMS).map(([id, d]) => [`ITEMS.${id}`, d] as const), ...Object.entries(MONSTERS).map(([id, d]) => [`MONSTERS.${id}`, d] as const)]);
/** What a suite changed in the tables, from `was` to `now`: each entry added, removed or replaced, by name. */
const leftBehind = (was: ReadonlyMap<string, unknown>, now: ReadonlyMap<string, unknown>): string[] => [
  ...[...now.keys()].filter((k) => !was.has(k)).map((k) => `added ${k}`),
  ...[...was.keys()].filter((k) => !now.has(k)).map((k) => `removed ${k}`),
  ...[...now].filter(([k, d]) => was.has(k) && was.get(k) !== d).map(([k]) => `replaced ${k}`),
];

/** The suites as they ran before the runner found them, kept in that order. */
const FIRST = ['maps', 'movement', 'monsters', 'combat', 'harness', 'party', 'traits', 'calendar', 'terrain', 'weather', 'atlas', 'outdoors', 'save', 'quests', 'game', 'pilot'];
/** The suites that run only when named, each taking minutes: the pilot's survival sweep and its full run (#723). */
const ASKED = ['survival', 'fullrun'];

type Suite = () => void | Promise<void>;
/**
 * Each suite by name, loaded only if it runs. One that will not load, or exports no suite, fails as
 * its own suite.
 */
const suites = new Map<string, () => Promise<Suite>>();

const args = process.argv.slice(2).filter((a) => a !== '--list');
const at = args.indexOf('--dir');
const dir = at >= 0 ? pathToFileURL(args.splice(at, 2)[1] + '/') : new URL('./tests/', import.meta.url);
/** A flag's value, taken out of the args. */
const value = (flag: string): string | undefined => { const i = args.indexOf(flag); return i >= 0 ? args.splice(i, 2)[1] : undefined; };
const since = value('--since') ?? (process.env.TEST_SINCE || undefined), named = value('--areas') ?? (process.env.TEST_AREAS || undefined);
const wanted = args;

const found = readdirSync(dir).filter((f) => f.endsWith('.ts') && f !== 'lib.ts').map((f) => f.slice(0, -3));
const order = [...FIRST.filter((n) => found.includes(n)), ...found.filter((n) => !FIRST.includes(n)).sort()];
if (at < 0) for (const name of FIRST.filter((n) => !found.includes(n))) {
  suites.set(name, () => Promise.reject(new Error(`tools/tests/${name}.ts is gone, but the runner still lists it first`)));
}
for (const name of order) {
  suites.set(name, async () => {
    const fn = ((await import(new URL(`${name}.ts`, dir).href)) as Record<string, unknown>)[name];
    if (typeof fn !== 'function') throw new Error(`${name}.ts exports no function named ${name}`);
    return fn as Suite;
  });
}

// Each area's walkthrough, found by its file, in the order of AREAS: an area adds one without
// touching this runner.
if (at < 0) {
  const areas = new URL('../src/content/areas/', import.meta.url);
  const ids: string[] = await import('../src/content/index.ts').then((m) => m.AREAS.map((a) => a.id), (e: unknown) => {
    suites.set('walkthroughs', () => Promise.reject(e));
    return [];
  });
  const folders = readdirSync(areas, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  for (const area of [...ids, ...folders.filter((f) => !ids.includes(f)).sort()]) {
    const file = new URL(`${area}/walkthrough.ts`, areas);
    if (!existsSync(file)) continue;
    suites.set(`walkthrough:${area}`, async () => {
      if (!ids.includes(area)) throw new Error(`src/content/areas/${area}/ has a walkthrough but is no area in AREAS`);
      const fn = ((await import(file.href)) as { walkthrough?: unknown }).walkthrough;
      if (typeof fn !== 'function') throw new Error(`${area}/walkthrough.ts exports no function named walkthrough`);
      // An `ok` of its own, under which its runs keep the goals they walk (tools/walk.ts), so it passes alone as in the full run (#946).
      return () => (fn as Walkthrough)((cond: boolean, msg: string) => ok(cond, msg));
    });
  }
}

// A promise a suite let go of still counts if it rejects before the run ends.
process.on('unhandledRejection', (e) => fail('rejected ' + (e instanceof Error ? e.stack : String(e))));

const listed = [...suites].filter(([name]) => (wanted.length ? wanted.includes(name) : !ASKED.includes(name)));
// The areas the gate and the walkthroughs run for (#955): those named, else those the diff since the
// ref reaches; every area where neither is given, the diff reaches them all or cannot be read. Every
// other suite runs whole. `reached` says which and why.
let reached = '';
if ((named || since) && listed.some(([name]) => name === 'gate' || name.startsWith('walkthrough:'))) {
  const ids: string[] = AREAS.map((a) => a.id);
  let only: string[] | undefined;
  if (named) {
    only = named.split(',').map((a) => a.trim()).filter(Boolean);
    const unknown = only.filter((a) => !ids.includes(a));
    if (unknown.length) { console.error(`No area is named ${unknown.join(', ')}: the areas are ${ids.join(', ')}.`); process.exit(2); }
    reached = `Asked for ${only.join(', ') || 'no area'}`;
  } else {
    try {
      const { changedAreas, describeReach } = await import('./changed.ts');
      const r = changedAreas(since!);
      if (!r.all) only = [...r.areas.keys()].filter((a) => ids.includes(a));
      reached = `Reached since ${since}: ${describeReach(r)}`;
    } catch (e) {
      reached = `Reached since ${since}: every area, as the diff could not be read (${String(e instanceof Error ? e.message : e).split('\n')[0]})`;
    }
  }
  narrow(only);
  reached += `: the gate and the walkthroughs ran for ${only ? only.length : ids.length} of ${ids.length} areas`;
}
const runs = listed.filter(([name]) => !name.startsWith('walkthrough:') || asked(name.slice('walkthrough:'.length)));
const width = Math.max(0, ...runs.map(([name]) => name.length));
const log = console.log;
const owedSoFar = (): number => [...owedCount().values()].reduce((n, k) => n + k, 0);
const ran: Ran[] = [];
/** The lines the suite in flight printed itself and holds back, without --list: they print should it fail, or the run die in it. */
const aside: unknown[][] = [];
process.on('exit', () => { for (const a of aside.splice(0)) log(...a); });
// The run starts with a blank line, as when every heading printed with one before it.
if (!LIST) log('');
for (const [name, load] of runs) {
  // The name prints as the suite starts, so a run that dies inside it (a crash, an await that never
  // settles, the tests job's timeout) names it last. Without --list a suite's own lines are held back
  // but a failure or an owed line; at its first failure they print, in order, and the rest as it comes.
  log((LIST ? '\n' : '') + name);
  let failing = false;
  if (!LIST) console.log = (...a: unknown[]) => {
    const kind = typeof a[0] === 'string' ? /^ {2}(FAIL|owed): /.exec(a[0])?.[1] : undefined;
    if (kind === 'FAIL' && !failing) { failing = true; for (const b of aside.splice(0)) log(...b); }
    if (failing || kind) log(...a); else aside.push(a);
  };
  const t0 = performance.now(), held = heldCount(), failed = failureCount(), owed = owedSoFar(), before = tables();
  try { await (await load())(); } catch (e) { fail('threw ' + (e instanceof Error ? e.stack : String(e))); }
  // A suite leaves the item and monster tables as it found them (#946): what it added, took out or replaced fails it by name.
  const left = leftBehind(before, tables());
  if (left.length) fail(`${name} leaves the tables as it did not find them: ${left.join(', ')}`);
  console.log = log;
  aside.length = 0;
  const r = { name, secs: (performance.now() - t0) / 1000, held: heldCount() - held, failed: failureCount() - failed, owed: owedSoFar() - owed };
  ran.push(r);
  log(ranLine(r, width));
}
const failures = failureCount();
// Once a suite has started worker threads (harness's, #854), a piped stdout can be left writing
// behind the suites: the exit waits for what is written to drain, the code set should it never come.
process.exitCode = failures ? 1 : 0;
const said = summary(failures, owedCount(), ran);
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### node tools/test.ts ${process.argv.slice(2).join(' ')}\n\n${reached ? `${reached}.\n\n` : ''}\`\`\`\n${said}\n\`\`\`\n\n`);
}
process.stdout.write('\n' + (reached ? `${reached}.\n\n` : '') + said + '\n', () => process.exit(failures ? 1 : 0));
