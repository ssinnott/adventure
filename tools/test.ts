// Pure-Node tests for the game model: maps, movement, combat determinism, saves, the quest log. No
// browser. The runner finds its suites: every tools/tests/*.ts but lib.ts, each exporting a
// function named after its file, which may be async. Today's suites run first in the order below,
// then any other in name order, then each area's walkthrough
// (src/content/areas/<area>/walkthrough.ts) where it has one, in road order. A suite is added by
// its file alone. One that exports `parts()` runs as its parts, each a run of its own named
// `suite:part`, its function given the part (the gate's: `fixed` and one to each area, #954). A
// walkthrough that exports `scenes` (tools/kit/walk.ts, #1018) runs as its scenes in their order,
// each a run named `walkthrough:<area>:<scene>`; one that exports only `walkthrough` is one run, as a
// suite is. The plan reads each walkthrough's text, and imports the file where it exports `scenes`,
// for their names. A name no run has stops the run before it starts, naming those there are
// (exit 2); a scene of a walkthrough whose scenes it cannot name runs that walkthrough whole, to
// fail by name.
//   node tools/test.ts                  run everything but the suites run only when named (ASKED)
//   node tools/test.ts maps combat      run selected suites
//   node tools/test.ts walkthrough:shelf  run one area's walkthrough
//   node tools/test.ts gate:kilns       run one part of a suite
//   node tools/test.ts walkthrough:kilns:n4  run one scene of a walkthrough
//   FULLRUN=all node tools/test.ts fullrun  the pilot's full run on the areas FULLRUN names (shelf unset)
//   node tools/test.ts --dir <folder>   run the suites in another folder, and no walkthroughs (the
//                                       runner's own check, tools/tests/runner/check.ts)
//   node tools/test.ts --walks <folder> run the walkthroughs of the areas in another folder (each
//                                       <area>/walkthrough.ts), and no suites but --dir's
//   node tools/test.ts --list           print every line, as TEST_LIST=1 does (#895)
//   node tools/test.ts --since <ref>    the gate and the walkthroughs only for the areas the diff
//                                       since <ref> reaches (tools/changed.ts), as TEST_SINCE does
//   node tools/test.ts --areas a,b      only for those areas, as TEST_AREAS=a,b does (#955)
//   node tools/test.ts --jobs [N]       the runs in processes of their own, N at a time, as many as
//                                       the cores (two at least) where N is left out (#954): the dear
//                                       (DEAR, or TEST_DEAR=a,b) each alone and the rest packed into
//                                       one; with --jobs 1 every run alone, one after another
//   node tools/test.ts --shuffle [seed] the runs in an order shuffled by the seed, a new one where
//                                       none is given, which the run prints to play it again
// By default a suite prints its name as it starts, then its failures and its owed lines; what else it
// prints waits for --list or its first failure; every suite ends with a line of its seconds and its
// count, and the run with a table of them, the slowest first, and a line of its wall before its last
// line. Under --jobs a run's lines are held and print whole at its turn in the run's order, so that it
// prints what one process prints but the seconds. A run narrowed to areas says which and why before
// the table; with none given everything runs. Where GITHUB_STEP_SUMMARY is set, that line and the
// table go into it too.
import { readdirSync, existsSync, appendFileSync, readFileSync } from 'node:fs';
import { fork } from 'node:child_process';
import { randomInt } from 'node:crypto';
import { availableParallelism } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ok, fail, failureCount, heldCount, owedCount, summary, ranLine, narrow, narrowed, asked, LIST, type Ran } from './tests/lib.ts';
import type { Scene } from './kit/walk.ts';
import { AREAS, ITEMS, MONSTERS } from '../src/content/index.ts';
import { makeRng } from '../src/lib/engine/rng.ts';

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
/**
 * The runs over three seconds in the tests job's table of 23 October and the gate's areas timed on
 * e3d6a66a (#954), the dearest first, the harness as a process of one worker: under --jobs each is a
 * process of its own, started in this order once the rest, packed into one process, has started.
 */
const DEAR = process.env.TEST_DEAR ? process.env.TEST_DEAR.split(',') : ['labels', 'row', 'harness', 'gate:kilns', 'gate:ashfall', 'gate:rimewater', 'gate:whitespine', 'gate:saltreach',
  'quests:goals', 'gate:cairnmoor', 'gate:glasswold', 'gate:sunderwood', 'gate:wrackholm', 'gate:hearth', 'walkthrough:shelf', 'gate:shelf', 'scaffold', 'pilot', 'gate:thornmark'];

type Suite = (part?: string) => void | Promise<void>;
/**
 * Each suite by name, loaded only if it runs. One that will not load, or exports no suite, fails as
 * its own suite.
 */
const suites = new Map<string, () => Promise<Suite>>();

const args = process.argv.slice(2).filter((a) => a !== '--list');
/** A flag's value, taken out of the args. */
const value = (flag: string): string | undefined => { const i = args.indexOf(flag); return i >= 0 ? args.splice(i, 2)[1] : undefined; };
// The suites' folder and the walkthroughs': --dir gives the one and --walks the other, and either given
// alone drops the other's own (the runner's own check).
const dirArg = value('--dir'), walksArg = value('--walks');
const dir = dirArg !== undefined ? pathToFileURL(dirArg + '/') : walksArg === undefined ? new URL('./tests/', import.meta.url) : undefined;
const walksDir = walksArg !== undefined ? pathToFileURL(walksArg + '/') : dirArg === undefined ? new URL('../src/content/areas/', import.meta.url) : undefined;
/** A flag a number may follow, taken out of the args: undefined where it is not given, `bare()` where no number follows it. */
const counted = (flag: string, bare: () => number): number | undefined => {
  const i = args.indexOf(flag);
  if (i < 0) return undefined;
  const given = /^\d+$/.test(args[i + 1] ?? ''), n = given ? Number(args[i + 1]) : bare();
  args.splice(i, given ? 2 : 1);
  return n;
};
// A child of a run under --jobs is given its runs, and the areas the run is narrowed to ('' for none), by its parent.
const job = value('--job'), narrowing = value('--narrow');
const jobs = counted('--jobs', () => Math.max(2, availableParallelism())), seed = counted('--shuffle', () => randomInt(1, 0x7fffffff));
if (jobs !== undefined && jobs < 1) { console.error('--jobs takes how many processes run at a time, one at least.'); process.exit(2); }
const since = value('--since') ?? (process.env.TEST_SINCE || undefined), named = value('--areas') ?? (process.env.TEST_AREAS || undefined);
// A flag the runner does not know, or a count that is no whole number (`--jobs=4`, `--jobs -1`), would
// be taken for a suite's name and run nothing: it stops the run instead.
const stray = args.filter((a) => a.startsWith('-'));
if (stray.length) { console.error(`No flag is named ${stray.join(', ')}: the flags are --list, --dir, --walks, --since, --areas, --jobs [N] and --shuffle [seed].`); process.exit(2); }
const wanted = args;

const found = dir ? readdirSync(dir).filter((f) => f.endsWith('.ts') && f !== 'lib.ts').map((f) => f.slice(0, -3)) : [];
const order = [...FIRST.filter((n) => found.includes(n)), ...found.filter((n) => !FIRST.includes(n)).sort()];
if (dir && dirArg === undefined) for (const name of FIRST.filter((n) => !found.includes(n))) {
  suites.set(name, () => Promise.reject(new Error(`tools/tests/${name}.ts is gone, but the runner still lists it first`)));
}
for (const name of order) {
  suites.set(name, async () => {
    const fn = ((await import(new URL(`${name}.ts`, dir).href)) as Record<string, unknown>)[name];
    if (typeof fn !== 'function') throw new Error(`${name}.ts exports no function named ${name}`);
    return fn as Suite;
  });
}

/** A walkthrough module's scenes: its `scenes`, or its `walkthrough` as one scene named for its area. */
const scenesIn = (area: string, m: { scenes?: unknown; walkthrough?: unknown }): readonly Scene[] => {
  if (Array.isArray(m.scenes)) return m.scenes as Scene[];
  if (typeof m.walkthrough === 'function') return [{ name: area, play: m.walkthrough as Scene['play'] }];
  throw new Error(`${area}/walkthrough.ts exports no scenes and no function named walkthrough`);
};
/** Each area's walkthrough file, by its area. */
const walkFiles = new Map<string, URL>();
// Each area's walkthrough, found by its file, in the order of AREAS (a folder's under --walks in name
// order): an area adds one without touching this runner.
if (walksDir) {
  const ids: string[] = await import('../src/content/index.ts').then((m) => m.AREAS.map((a) => a.id), (e: unknown) => {
    suites.set('walkthroughs', () => Promise.reject(e));
    return [];
  });
  const folders = readdirSync(walksDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  for (const area of walksArg === undefined ? [...ids, ...folders.filter((f) => !ids.includes(f)).sort()] : folders.sort()) {
    const file = new URL(`${area}/walkthrough.ts`, walksDir);
    if (!existsSync(file)) continue;
    walkFiles.set(area, file);
    suites.set(`walkthrough:${area}`, async () => {
      if (walksArg === undefined && !ids.includes(area)) throw new Error(`src/content/areas/${area}/ has a walkthrough but is no area in AREAS`);
      const scenes = scenesIn(area, (await import(file.href)) as { scenes?: unknown; walkthrough?: unknown });
      const { playScenes } = await import('./kit/walk.ts');
      // An `ok` of its own, under which its runs keep the goals they walk (tools/kit/walk.ts), so it passes alone as in the full run (#946).
      const own = (cond: boolean, msg: string): void => ok(cond, msg);
      return (part?: string) => playScenes(own, scenes, part);
    });
  }
}

// A promise a suite let go of still counts if it rejects before the run ends.
process.on('unhandledRejection', (e) => fail('rejected ' + (e instanceof Error ? e.stack : String(e))));

/** A run's name as its suite and its part: `gate:kilns` is the gate's part `kilns`; a walkthrough, `walkthrough:shelf`, is a suite. */
const split = (run: string): [string, string | undefined] => {
  const k = run.lastIndexOf(':');
  return suites.has(run) || k < 0 ? [run, undefined] : [run.slice(0, k), run.slice(k + 1)];
};
/** A run ready to call: its suite loaded, and given its part where it is one. */
const load = async (run: string): Promise<() => void | Promise<void>> => {
  const [name, part] = split(run), get = suites.get(name);
  if (!get) throw new Error(`no suite is named ${name}`);
  const fn = await get();
  return part === undefined ? () => fn() : () => fn(part);
};

const log = console.log;
/** `k` of a thing, as '1 run', '4 cores', '3 processes'. */
const many = (k: number, one: string): string => `${k} ${one}${k === 1 ? '' : one.endsWith('s') ? 'es' : 's'}`;
const owedSoFar = (): number => [...owedCount().values()].reduce((n, k) => n + k, 0);
/** The lines the suite in flight printed itself and holds back, without --list: they print should it fail, or the run die in it. */
const aside: unknown[][] = [];
/** What a child's run in flight writes, held to go to the parent with its record; unset in one process, where a run prints as it goes. */
let caught: [1 | 2, string][] | undefined;
const writes = { out: process.stdout.write, err: process.stderr.write };
const into = (fd: 1 | 2) => ((chunk: string | Uint8Array, a?: unknown, b?: unknown): boolean => {
  caught?.push([fd, typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString()]);
  const done = [a, b].find((f) => typeof f === 'function') as (() => void) | undefined;
  if (done) process.nextTick(done);
  return true;
}) as typeof process.stdout.write;
/** Hold what the run writes, through the console or not, in `caught`; or write it out as it comes again. */
const hold = (on: boolean): void => {
  caught = on ? [] : undefined;
  process.stdout.write = on ? into(1) : writes.out;
  process.stderr.write = on ? into(2) : writes.err;
};
process.on('exit', () => {
  for (const a of aside.splice(0)) log(...a);
  // A child that dies inside a run writes out what the run wrote, for its parent to print under it.
  const held = caught;
  if (held) { hold(false); for (const [fd, s] of held) (fd === 2 ? process.stderr : process.stdout).write(s); }
});

/** One run: its suite called, timed and counted, and its owed lines by whose. */
async function runOne(run: string): Promise<{ ran: Ran; owing: [string, number][] }> {
  // Without --list a suite's own lines are held back but a failure or an owed line; at its first
  // failure they print, in order, and the rest as it comes.
  let failing = false;
  if (!LIST) console.log = (...a: unknown[]) => {
    const kind = typeof a[0] === 'string' ? /^ {2}(FAIL|owed): /.exec(a[0])?.[1] : undefined;
    if (kind === 'FAIL' && !failing) { failing = true; for (const b of aside.splice(0)) log(...b); }
    if (failing || kind) log(...a); else aside.push(a);
  };
  const t0 = performance.now(), held = heldCount(), failed = failureCount(), owed = owedSoFar(), before = tables(), was = new Map(owedCount());
  try { await (await load(run))(); } catch (e) { fail('threw ' + (e instanceof Error ? e.stack : String(e))); }
  // A suite leaves the item and monster tables as it found them (#946): what it added, took out or replaced fails it by name.
  const left = leftBehind(before, tables());
  if (left.length) fail(`${run} leaves the tables as it did not find them: ${left.join(', ')}`);
  console.log = log;
  aside.length = 0;
  const owing = [...owedCount()].map(([w, k]): [string, number] => [w, k - (was.get(w) ?? 0)]).filter(([, k]) => k > 0);
  return { ran: { name: run, secs: (performance.now() - t0) / 1000, held: heldCount() - held, failed: failureCount() - failed, owed: owedSoFar() - owed }, owing };
}

/** What a child tells its parent: that it has started, then each run as it ends, with what it wrote. */
type Message = { started: true } | { ran: Ran; owing: [string, number][]; out: [1 | 2, string][] };
/** A run as its parent prints it: its record, what it wrote and, where its process died, how. */
type Outcome = Extract<Message, { ran: Ran }> & { died?: string };

if (job !== undefined) {
  // A child: its runs one after another, each sent to the parent as it ends with what it wrote.
  if (narrowing !== undefined) narrow(narrowing.split(',').filter(Boolean));
  // The channel keeps no child alive: one whose run never settles ends as the run would alone (exit 13).
  process.channel?.unref();
  const send = (m: Message): Promise<void> => new Promise((res) => { process.send!(m, () => res()); });
  await send({ started: true });
  let failed = 0;
  for (const run of job.split(',')) {
    hold(true);
    const r = await runOne(run);
    const out = caught ?? [];
    hold(false);
    failed += r.ran.failed;
    await send({ ...r, out });
  }
  process.stdout.write('', () => process.exit(failed ? 1 : 0));
} else {
  /** A suite's parts where its file exports them (read from its text first, so no other suite loads here), as the run narrows them. */
  const partsOf = async (name: string): Promise<string[] | undefined> => {
    try {
      if (!/^export (?:async )?(?:function|const) parts\b/m.test(readFileSync(new URL(`${name}.ts`, dir), 'utf8'))) return undefined;
      const parts = ((await import(new URL(`${name}.ts`, dir).href)) as { parts?: unknown }).parts;
      return typeof parts === 'function' ? (parts as () => string[])() : undefined;
    } catch { return undefined; }
  };
  /**
   * The walkthroughs whose text exports `scenes` but whose scenes the plan cannot name: the file
   * will not load, or a name is one no run can have. A scene of one asked for runs it whole, to
   * fail by name.
   */
  const unnamed = new Set<string>();
  /**
   * A walkthrough's scenes by name where its file exports `scenes` (read from its text first, then the
   * file imported), each a name the runner can run alone (`misnamed`); else undefined, and it runs whole.
   */
  const scenesOf = async (area: string): Promise<string[] | undefined> => {
    const file = walkFiles.get(area)!;
    try {
      if (!/^export const scenes\b/m.test(readFileSync(file, 'utf8'))) return undefined;
      const scenes = scenesIn(area, (await import(file.href)) as { scenes?: unknown }), { misnamed } = await import('./kit/walk.ts');
      if (!misnamed(scenes).length) return scenes.map((s) => s.name);
    } catch { /* it fails by name in its run */ }
    unnamed.add(`walkthrough:${area}`);
    return undefined;
  };
  /** A run's parts: a walkthrough's scenes, or a suite's parts. */
  const partsOfRun = (name: string): Promise<string[] | undefined> => (name.startsWith('walkthrough:') ? scenesOf(name.slice('walkthrough:'.length)) : partsOf(name));
  // A name no run has stops the run before it starts, naming those there are: a suite, a part or a scene
  // misspelt would run nothing and end ALL OK. Read before the run narrows the parts to areas.
  const refused: string[] = [];
  for (const w of wanted) {
    const [name, part] = split(w), kind = name.startsWith('walkthrough:') ? 'scenes' : 'parts';
    if (!suites.has(name)) { refused.push(`No run is named ${w}: the suites are ${[...suites.keys()].join(', ')}.`); continue; }
    const parts = part === undefined ? undefined : await partsOfRun(name);
    if (part !== undefined && !parts) { if (!unnamed.has(name)) refused.push(`No run is named ${w}: ${name} has no ${kind}.`); }
    else if (part !== undefined && !parts!.includes(part)) refused.push(`No run is named ${w}: the ${kind} of ${name} are ${parts!.join(', ')}.`);
  }
  if (refused.length) { console.error(refused.join('\n')); process.exit(2); }

  const listed = [...suites.keys()].filter((name) => (wanted.length ? wanted.some((w) => split(w)[0] === name) : !ASKED.includes(name)));
  // The areas the gate and the walkthroughs run for (#955): those named, else those the diff since the
  // ref reaches; every area where neither is given, the diff reaches them all or cannot be read. Every
  // other suite runs whole. `reached` says which and why.
  let reached = '', walks: string[] = [];
  if ((named || since) && listed.some((name) => name === 'gate' || name.startsWith('walkthrough:'))) {
    const ids: string[] = AREAS.map((a) => a.id);
    let only: string[] | undefined;
    if (named) {
      only = named.split(',').map((a) => a.trim()).filter(Boolean);
      const unknown = only.filter((a) => !ids.includes(a));
      if (unknown.length) { console.error(`No area is named ${unknown.join(', ')}: the areas are ${ids.join(', ')}.`); process.exit(2); }
      reached = `Asked for ${only.join(', ') || 'no area'}`;
    } else {
      try {
        const { changedAreas, describeReach } = await import('./kit/changed.ts');
        const r = changedAreas(since!);
        if (!r.all) { only = [...r.areas.keys()].filter((a) => ids.includes(a)); walks = [...r.walks.keys()].filter((a) => ids.includes(a)); }
        reached = `Reached since ${since}: ${describeReach(r)}`;
      } catch (e) {
        reached = `Reached since ${since}: every area, as the diff could not be read (${String(e instanceof Error ? e.message : e).split('\n')[0]})`;
      }
    }
    narrow(only);
    const n = only ? only.length : ids.length;
    reached += walks.length ? `: the gate ran for ${n} of ${ids.length} areas and the walkthroughs for ${n + walks.length}` : `: the gate and the walkthroughs ran for ${n} of ${ids.length} areas`;
  }
  /** The runs in the runner's order: each suite whole or as its parts, those named alone where only they are; a walkthrough's scenes are its parts. */
  const runs: string[] = [];
  for (const name of listed) {
    const area = name.startsWith('walkthrough:') ? name.slice('walkthrough:'.length) : undefined;
    if (area !== undefined && !asked(area) && !walks.includes(area)) continue;
    const whole = !wanted.length || wanted.includes(name), parts = await partsOfRun(name);
    if (!parts) { if (whole || unnamed.has(name)) runs.push(name); continue; }
    runs.push(...parts.map((p) => `${name}:${p}`).filter((r) => whole || wanted.includes(r)));
  }
  if (seed !== undefined) {
    const rng = makeRng(seed);
    for (let i = runs.length - 1; i > 0; i--) { const j = rng.int(0, i); [runs[i], runs[j]] = [runs[j], runs[i]]; }
  }

  const width = Math.max(0, ...runs.map((r) => r.length)), cores = availableParallelism();
  const ran: Ran[] = [];
  let failures: number, owing: ReadonlyMap<string, number>, how: string;
  // The run starts with a blank line, as when every heading printed with one before it.
  if (!LIST) log('');
  if (seed !== undefined) log(`Shuffled by seed ${seed}: --shuffle ${seed} plays this order again.`);
  if (jobs === undefined) {
    for (const run of runs) {
      // The name prints as the suite starts, so a run that dies inside it (a crash, an await that never
      // settles, the tests job's timeout) names it last.
      log((LIST ? '\n' : '') + run);
      const r = await runOne(run);
      ran.push(r.ran);
      log(ranLine(r.ran, width));
    }
    failures = failureCount();
    owing = owedCount();
    how = `${many(runs.length, 'run')} in one process on ${many(cores, 'core')}`;
  } else {
    // The jobs: every run alone under --jobs 1; else the dear each alone, started in DEAR's order once
    // the rest, packed into one process in the run's order, has started.
    const queue = jobs === 1 ? runs.map((r) => [r]) : [runs.filter((r) => !DEAR.includes(r)), ...DEAR.filter((r) => runs.includes(r)).map((r) => [r])].filter((j) => j.length);
    const slots = Math.min(jobs, queue.length), areas = narrowed();
    // The harness's workers take the cores over the jobs (TEST_CORES, tools/harness.ts); a child reads no diff and no areas but its parent's.
    const env = { ...process.env, TEST_CORES: String(Math.max(1, Math.floor(cores / Math.max(1, slots)))), TEST_SINCE: '', TEST_AREAS: '' };
    const argv = [...(dir && dirArg !== undefined ? ['--dir', fileURLToPath(dir)] : []), ...(walksDir && walksArg !== undefined ? ['--walks', fileURLToPath(walksDir)] : []),
      ...(LIST ? ['--list'] : []), ...(areas ? ['--narrow', areas.join(',')] : [])];
    const settle = new Map<string, (o: Outcome) => void>();
    const outcomes = new Map(runs.map((r) => [r, new Promise<Outcome>((res) => settle.set(r, res))]));
    const starts: number[] = [];
    /** One job's process: each run's outcome as it ends; where it ends early, the run in flight died and any after it never ran. */
    const start = (names: string[]): Promise<void> => new Promise((resolve) => {
      const t0 = performance.now(), stray: [1 | 2, string][] = [], got = new Map<string, Outcome>(), tail = names.at(-1)!;
      let last = t0, over = false, closed: [number | null, string | null] | undefined;
      const child = fork(fileURLToPath(import.meta.url), [...argv, '--job', names.join(',')], { stdio: ['ignore', 'pipe', 'pipe', 'ipc'], env });
      child.stdout!.setEncoding('utf8').on('data', (s: string) => stray.push([1, s]));
      child.stderr!.setEncoding('utf8').on('data', (s: string) => stray.push([2, s]));
      child.on('message', (m: Message) => {
        last = performance.now();
        if ('started' in m) { starts.push((last - t0) / 1000); return; }
        got.set(m.ran.name, m);
        // The job's last run waits for its process to end, so that what it wrote outside its runs prints with it.
        if (m.ran.name !== tail) settle.get(m.ran.name)!(m);
      });
      const end = (died: string | undefined): void => {
        if (over) return;
        over = true;
        const lost = names.filter((n) => !got.has(n));
        if (lost.length) {
          settle.get(lost[0])!({ ran: { name: lost[0], secs: (performance.now() - last) / 1000, held: 0, failed: 1, owed: 0 }, owing: [], out: stray, died: `died, ${died}` });
          for (const n of lost.slice(1)) settle.get(n)!({ ran: { name: n, secs: 0, held: 0, failed: 1, owed: 0 }, owing: [], out: [], died: `never ran, as its process died in ${lost[0]}` });
        } else {
          const t = got.get(tail)!;
          settle.get(tail)!(died ? { ...t, ran: { ...t.ran, failed: t.ran.failed + 1 }, out: [...t.out, ...stray], died: `died after its end, ${died}` } : { ...t, out: [...t.out, ...stray] });
        }
        resolve();
      };
      // It ends once it has exited and its channel has closed, every message read: a record, a code of 1
      // where a run failed and 0 where none did for each run, else it died, and how.
      const ended = (): void => {
        if (!closed || child.connected) return;
        const [code, signal] = closed, want = [...got.values()].some((o) => o.ran.failed) ? 1 : 0;
        end(names.every((n) => got.has(n)) && !signal && code === want ? undefined : signal ? `killed by ${signal}` : `exit ${code}`);
      };
      child.on('close', (code, signal) => { closed = [code, signal]; ended(); });
      child.on('disconnect', ended);
      child.on('error', (e) => end(`as it would not start: ${e.message}`));
    });
    let next = 0;
    const pool = Promise.all(Array.from({ length: slots }, async () => { while (next < queue.length) await start(queue[next++]); }));
    const together = new Map<string, number>();
    for (const run of runs) {
      // The name prints at the run's turn, so a run that dies, or a tests job that times out, waiting on it names it last.
      log((LIST ? '\n' : '') + run);
      const o = await outcomes.get(run)!;
      for (const [fd, s] of o.out) (fd === 2 ? process.stderr : process.stdout).write(s);
      if (o.died) log(`  FAIL: ${run} ${o.died}`);
      ran.push(o.ran);
      for (const [w, k] of o.owing) together.set(w, (together.get(w) ?? 0) + k);
      log(ranLine(o.ran, width));
    }
    await pool;
    failures = failureCount() + ran.reduce((n, r) => n + r.failed, 0);
    owing = together;
    const startup = starts.reduce((n, s) => n + s, 0);
    how = `${many(runs.length, 'run')} in ${many(queue.length, 'process')}, ${slots} at a time on ${many(cores, 'core')}, ${startup.toFixed(1)} s of starts (the longest ${Math.max(0, ...starts).toFixed(1)} s)`;
  }
  const secs = ran.reduce((n, r) => n + r.secs, 0);
  const wall = `${how}: the suites' ${secs.toFixed(1)} s in ${(performance.now() / 1000).toFixed(1)} s${seed !== undefined ? `, shuffled by seed ${seed}` : ''}.`;
  // Once a suite has started worker threads (harness's, #854), a piped stdout can be left writing
  // behind the suites: the exit waits for what is written to drain, the code set should it never come.
  process.exitCode = failures ? 1 : 0;
  const said = summary(failures, owing, ran, wall);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### node tools/test.ts ${process.argv.slice(2).join(' ')}\n\n${reached ? `${reached}.\n\n` : ''}\`\`\`\n${said}\n\`\`\`\n\n`);
  }
  process.stdout.write('\n' + (reached ? `${reached}.\n\n` : '') + said + '\n', () => process.exit(failures ? 1 : 0));
}
