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
// By default a suite prints its failures and its owed lines under its name, and what else it prints
// waits for --list; every suite ends with a line of its seconds and its count, and the run with a
// table of them, the slowest first, before its last line.
import { readdirSync, existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { ok, fail, failureCount, heldCount, owedCount, summary, ranLine, LIST, type Ran } from './tests/lib.ts';
import type { Walkthrough } from '../src/content/area.ts';

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
      return () => (fn as Walkthrough)(ok);
    });
  }
}

// A promise a suite let go of still counts if it rejects before the run ends.
process.on('unhandledRejection', (e) => fail('rejected ' + (e instanceof Error ? e.stack : String(e))));

const runs = [...suites].filter(([name]) => (wanted.length ? wanted.includes(name) : !ASKED.includes(name)));
const width = Math.max(0, ...runs.map(([name]) => name.length));
const log = console.log;
const owedSoFar = (): number => [...owedCount().values()].reduce((n, k) => n + k, 0);
const ran: Ran[] = [];
for (const [name, load] of runs) {
  let heading = `\n${name}`;
  // Without --list a suite's own lines are held back but a failure or an owed line, and its name
  // waits for the first of those.
  if (LIST) log(heading);
  else console.log = (...a: unknown[]) => {
    if (typeof a[0] !== 'string' || !/^ {2}(FAIL|owed): /.test(a[0])) return;
    if (heading) log(heading);
    heading = '';
    log(...a);
  };
  const t0 = performance.now(), held = heldCount(), failed = failureCount(), owed = owedSoFar();
  try { await (await load())(); } catch (e) { fail('threw ' + (e instanceof Error ? e.stack : String(e))); }
  console.log = log;
  const r = { name, secs: (performance.now() - t0) / 1000, held: heldCount() - held, failed: failureCount() - failed, owed: owedSoFar() - owed };
  ran.push(r);
  log(ranLine(r, width));
}
const failures = failureCount();
// Once a suite has started worker threads (harness's, #854), a piped stdout can be left writing
// behind the suites: the exit waits for what is written to drain, the code set should it never come.
process.exitCode = failures ? 1 : 0;
process.stdout.write('\n' + summary(failures, owedCount(), ran) + '\n', () => process.exit(failures ? 1 : 0));
