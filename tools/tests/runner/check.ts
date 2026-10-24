// The runner's own check: tools/test.ts run in a child process against ./fixture/, ./stuck/,
// ./leaves/ and ./narrow/, folders the real run never reads, so the owed lines and failures here
// stay out of its output; in one process and under --jobs (#954).
//   node tools/tests/runner/check.ts
import { execFileSync, spawn } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import { availableParallelism, tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ok, failureCount, summary } from '../lib.ts';
import { AREAS } from '../../../src/content/index.ts';

const runner = fileURLToPath(new URL('../../test.ts', import.meta.url));
const fixture = fileURLToPath(new URL('./fixture', import.meta.url));
const folder = (name: string): string => fileURLToPath(new URL(`./${name}`, import.meta.url));
interface Run { status: number | null; out: string; stdout: string }
let free = availableParallelism();
const waiting: (() => void)[] = [];
/**
 * The runner on `dir`, started once a core is free (#954: every run below starts at once, and each is
 * read where it is checked); `TEST_LIST=1` among the args sets it for the run, else it is unset there,
 * whatever it is here, and so are TEST_SINCE, TEST_AREAS, TEST_DEAR and GITHUB_STEP_SUMMARY but as `set` gives them.
 */
const runWith = (set: Record<string, string>, dir: string, ...args: string[]): Promise<Run> => new Promise((resolve) => {
  const env = { ...process.env, TEST_LIST: args.includes('TEST_LIST=1') ? '1' : '', TEST_SINCE: '', TEST_AREAS: '', TEST_DEAR: '', GITHUB_STEP_SUMMARY: '', ...set };
  const go = (): void => {
    free--;
    const child = spawn(process.execPath, [runner, '--dir', dir, ...args.filter((a) => a !== 'TEST_LIST=1')], { env });
    let stdout = '', stderr = '';
    child.stdout.setEncoding('utf8').on('data', (s: string) => { stdout += s; });
    child.stderr.setEncoding('utf8').on('data', (s: string) => { stderr += s; });
    child.on('close', (status) => { free++; waiting.shift()?.(); resolve({ status, out: stdout + stderr, stdout }); });
  };
  if (free > 0) go(); else waiting.push(go);
});
const runIn = (dir: string, ...args: string[]): Promise<Run> => runWith({}, dir, ...args);
/** The runner on the fixture. */
const run = (...args: string[]): Promise<Run> => runIn(fixture, ...args);

console.log('\nrunner');
const narrow = folder('narrow'), step = join(tmpdir(), `runner-check-${process.pid}.md`);
let clean = true;
try { clean = !execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim(); } catch { clean = false; }
// Every run, started together.
const started = {
  owing: run('owing'), all: run(), listed: run('--list'), owingListed: run('owing', 'TEST_LIST=1'), stuck: runIn(folder('stuck')), leaves: runIn(folder('leaves')),
  asked: run('survival', '--list'), full: run('fullrun', '--list'), whole: runIn(narrow, '--list'), two: runIn(narrow, '--areas', 'shelf,thornmark', '--list'),
  hearth: runWith({ TEST_AREAS: 'hearth' }, narrow, '--list'), stray: runIn(narrow, '--areas', 'nowhere'), lost: runIn(narrow, '--since', 'no-such-ref-955', '--list'),
  none: clean ? runWith({ TEST_SINCE: 'HEAD' }, narrow, '--list') : undefined, step: runWith({ GITHUB_STEP_SUMMARY: step }, narrow, '--areas', 'shelf'),
  part: runIn(narrow, 'gate:thornmark', '--list'), paired: runWith({ TEST_DEAR: 'slow,later' }, fixture, '--jobs', '2'),
  alone: runWith({ TEST_DEAR: 'holds,later,owing,rejects,slow,unnamed' }, fixture, '--jobs', '3', '--list'), twoJobs: runIn(narrow, '--areas', 'shelf,thornmark', '--list', '--jobs', '2'),
  died: runIn(folder('stuck'), '--jobs', '1'), diedPacked: runIn(folder('stuck'), '--jobs', '2'), leftAlone: runWith({ TEST_DEAR: 'leaves,next' }, folder('leaves'), '--jobs', '2'),
  dealt: run('--shuffle', '2'), again: run('--shuffle', '2'), drawn: run('--shuffle'),
};
const owing = await started.owing;
ok(owing.status === 0, 'a run with only owed lines passes');
ok(owing.out.includes("  owed: a first thing not yet so (#43's)"), 'an owed check that does not hold yet is reported');
ok(owing.out.trimEnd().endsWith('ALL OK (3 owed: #40 ×2, #43 ×1)'), 'the summary gives the owed count by whose');

const all = await started.all;
// The order the suites ran in, read from the lines of their seconds, which every suite prints.
const order = all.out.split('\n').filter((l) => /^\w+ +\d+\.\d s {2}/.test(l)).map((l) => l.split(' ')[0]);
ok(order.join(' ') === 'holds later owing rejects slow unnamed', `a suite dropped in the folder runs, in name order (${order.join(' ')})`);
ok(all.status === 1, 'a run with failures fails');
ok(all.out.includes('  FAIL: a thing that is so: this holds now, so drop the owed entry (#41)'), 'an owed check that holds fails');
ok(all.out.includes('  FAIL: a check after an await'), 'an async suite that fails after an await is waited for');
ok(all.out.includes('Error: rejected after an await'), 'an async suite that rejects fails');
ok(all.out.includes('unnamed.ts exports no function named unnamed'), 'a file that exports no suite fails');
ok(all.out.trimEnd().endsWith('4 FAILURE(S) (3 owed: #40 ×2, #43 ×1)'), 'the summary gives the failures and the owed count together');

// Quiet unless asked (#895): a check prints only when it fails, a suite's own lines wait for --list
// or TEST_LIST=1, and each suite's seconds print at its end and in a table, the slowest first.
const listed = await started.listed;
ok(!owing.out.includes('  ok:   a check that holds') && listed.out.includes('  ok:   a check that holds'), 'a check that holds prints its line under --list and not by default');
ok(!all.out.includes('  note: a line of its own') && listed.out.includes('  note: a line of its own'), "a suite's own line prints under --list and not by default");
ok((await started.owingListed).out.includes('  ok:   a check that holds'), 'TEST_LIST=1 prints every line as --list does');
ok(all.out.includes('\nlater\n  note: what it said before it failed\n  FAIL: a check after an await\n'), "a failing line prints under its suite, after the suite's own lines before it");
// Each suite's own counts, not the run's so far.
const counts: Record<string, string> = { holds: '0 ok, 1 failed', later: '0 ok, 1 failed', owing: '1 ok, 3 owed', rejects: '0 ok, 1 failed', slow: '1 ok', unnamed: '0 ok, 1 failed' };
const names = Object.keys(counts);
const miscounted = names.filter((n) => !new RegExp(`^${n} +\\d+\\.\\d s {2}${counts[n]}$`, 'm').test(all.out));
ok(!miscounted.length, `every suite ends with a line of its seconds and its own counts${miscounted.length ? ` (not ${miscounted.join(' ')})` : ''}`);
// The table is held to its own printed seconds, never to which suite a loaded machine timed slowest: `slow`
// leads by its 300 ms sleep alone, which a stall of the same length in another suite outruns. Its seconds
// hold its sleep however loaded the machine, as an awaited suite is timed whole.
const rows = all.out.slice(all.out.indexOf("Each suite's seconds")).split('\n').slice(1).filter((l) => l.startsWith('  ')).map((l) => l.trim().split(/ +/));
const table = rows.map((r) => r[0]), secs = rows.map((r) => Number(r[1]));
ok(secs.every((s, i) => i === 0 || s <= secs[i - 1]) && [...table].sort().join(' ') === names.join(' ') && secs[table.indexOf('slow')] >= 0.25,
  `the summary's table lists every suite, the slowest first, and times an awaited suite whole (${rows.map((r) => `${r[0]} ${r[1]}`).join(', ')})`);
// A run that dies inside a suite names it last, as the suite's name prints when it starts: here an
// await that never settles, which ends the run with Node's exit 13; a crash and a timeout alike.
const stuck = await started.stuck;
const last = stuck.stdout.trimEnd().split('\n').at(-1);
ok(stuck.status === 13 && last === 'stuck', `a run that dies inside a suite names it last (exit ${stuck.status}, last "${last}")`);

// A suite leaves the item and monster tables as it found them (#946): one that adds, takes out or
// replaces an entry fails by name, under its own name, and the suite after it, which changes none, passes.
const leaves = await started.leaves;
const blamed = '\nleaves\n  FAIL: leaves leaves the tables as it did not find them: added ITEMS.fx_left, removed ITEMS.torch, replaced MONSTERS.rat\n';
ok(leaves.status === 1 && leaves.out.includes(blamed) && /\n {2}next +\d+\.\d s {2}1 ok\n/.test(leaves.out) && leaves.out.trimEnd().endsWith('1 FAILURE(S)'),
  `a suite that leaves the tables changed fails by name, listing each entry added, removed or replaced, and the one after it passes (exit ${leaves.status})`);

ok(!listed.out.includes('the suite run only when named ran'), 'a bare run passes over a suite run only when named (ASKED)');
const asked = await started.asked;
ok(asked.status === 0 && asked.out.includes('the suite run only when named ran'), 'a suite run only when named runs when it is named');
ok(!listed.out.includes('the full run ran'), 'a bare run passes over the full run, run only when named (ASKED)');
const full = await started.full;
ok(full.status === 0 && full.out.includes('the full run ran'), 'the full run runs when it is named');

// The gate and the walkthroughs narrowed to areas (#955): --areas or TEST_AREAS names them, --since or
// TEST_SINCE reads them from a diff, and the run says which and why before its table. With none given
// every area runs and nothing is said, as in `npm test` with no --since.
const ranFor = (out: string): string | undefined => /^ {2}note: the gate ran for (.+)$/m.exec(out)?.[1];
const whole = await started.whole;
ok(whole.status === 0 && ranFor(whole.out) === 'every area' && !whole.out.includes('the gate and the walkthroughs ran for'), `a run given no --since and no --areas runs the gate for every area and says nothing of areas (${ranFor(whole.out)})`);
const two = await started.two;
const twoLine = /\nAsked for shelf, thornmark: the gate and the walkthroughs ran for 2 of \d+ areas\.\n/.exec(two.out);
ok(two.status === 0 && ranFor(two.out) === 'shelf,thornmark' && !!twoLine && two.out.indexOf(twoLine[0]) < two.out.indexOf("Each suite's seconds"), `--areas narrows the gate to the areas named, and the run says so before its table (${ranFor(two.out)})`);
ok(ranFor((await started.hearth).out) === 'hearth', 'TEST_AREAS narrows it as --areas does');
const stray = await started.stray;
ok(stray.status === 2 && stray.out.includes('No area is named nowhere'), `an area no area is named fails the run before it starts (exit ${stray.status})`);
const lost = await started.lost;
ok(lost.status === 0 && ranFor(lost.out) === 'every area' && lost.out.includes('Reached since no-such-ref-955: every area, as the diff could not be read'), 'a diff that cannot be read runs every area, and says so');
if (started.none) {
  const none = await started.none;
  ok(ranFor(none.out) === 'no area' && /\nReached since HEAD: no area: the gate and the walkthroughs ran for 0 of \d+ areas\.\n/.test(none.out), `TEST_SINCE on a clean tree reads no change since HEAD, and the gate runs for no area (${ranFor(none.out)})`);
} else console.log('  skip: TEST_SINCE=HEAD, as the tree differs from HEAD');
await started.step;
let said = '';
try { said = readFileSync(step, 'utf8'); rmSync(step); } catch { /* not written */ }
ok(/Asked for shelf: the gate and the walkthroughs ran for 1 of \d+ areas\./.test(said) && said.includes("Each suite's seconds") && said.includes('ALL OK'), 'where GITHUB_STEP_SUMMARY is set, the line of what ran and the table go into it');

// A suite with parts runs as its parts (#954), each a run of its own: the gate's `fixed`, then one to
// each area the run asks for; a part named runs alone.
/** The runs in the order they ran, read from their lines of seconds. */
const runsOf = (out: string): string[] => out.split('\n').filter((l) => /^[\w:]+ +\d+\.\d s {2}/.test(l)).map((l) => l.split(' ')[0]);
const wholeRuns = runsOf(whole.out), twoRuns = runsOf(two.out), part = await started.part;
ok(wholeRuns.length === AREAS.length + 1 && wholeRuns[0] === 'gate:fixed' && wholeRuns.slice(1).join() === AREAS.map((a) => `gate:${a.id}`).join() && twoRuns.join(' ') === 'gate:fixed gate:shelf gate:thornmark',
  `a suite with parts runs as its parts, the gate's fixed and one to each area asked for (${twoRuns.join(' ')})`);
ok(part.status === 0 && runsOf(part.out).join(' ') === 'gate:thornmark' && part.out.includes("the gate's part for thornmark ran"), `a part named runs alone (${runsOf(part.out).join(' ')})`);

// The runs in processes of their own (#954): under --jobs a run prints what it prints in one process,
// each run's lines held and printed whole at its turn, the dear each alone (TEST_DEAR here) and the
// rest packed into one; under --jobs 1 each alone.
/**
 * What a run in one process and under --jobs print alike: every line in order but a stack's frames and
 * the seconds, then the table's rows sorted, as their seconds may order them otherwise, and the last
 * line; the line of the wall left out.
 */
const shape = (out: string): string => {
  const at = out.indexOf("Each suite's seconds"), secs = (l: string): string => l.replace(/ +\d+\.\d s {2}/, '  s  ');
  const body = out.slice(0, at < 0 ? undefined : at).split('\n').filter((l) => !l.startsWith('    at ')).map(secs);
  const end = at < 0 ? [] : out.slice(at).split('\n').slice(1);
  return [...body, ...end.filter((l) => l.startsWith('  ')).map(secs).sort(), ...end.filter((l) => !l.startsWith('  ') && !/^\d+ runs? in /.test(l))].join('\n');
};
const paired = await started.paired;
const wall = /^\d+ runs? in .+$/m.exec(paired.out)?.[0];
ok(paired.status === all.status && shape(paired.out) === shape(all.out),
  `--jobs 2 prints the lines, the counts, the table, the exit status and the last line of the run in one process, the seconds apart (exit ${paired.status})`);
ok(/^6 runs in 3 processes, 2 at a time on \d+ cores?, \d+\.\d s of starts \(the longest \d+\.\d s\): the suites' \d+\.\d s in \d+\.\d s\.$/.test(wall ?? '') && /^6 runs in one process on \d+ cores?: the suites' \d+\.\d s in \d+\.\d s\.$/m.test(all.out),
  `the summary gives the wall: the runs, the processes, the cores, the starts, the suites' seconds and the run's (${wall})`);
const alone = await started.alone;
ok(alone.status === listed.status && shape(alone.out) === shape(listed.out), `each suite alone in a process, three at a time, prints under --list what one process prints (exit ${alone.status})`);
const twoJobs = await started.twoJobs;
ok(twoJobs.status === 0 && ranFor(twoJobs.out) === 'shelf,thornmark' && shape(twoJobs.out) === shape(two.out),
  `narrowed, --jobs gives each process the areas and prints the line of what ran, the table and the lines of the run in one process (${ranFor(twoJobs.out)})`);
// A process that dies in a run fails the run by name with its exit code, and the run goes on to its end:
// alone, and packed into one process after a suite that passes.
for (const [jobs, ran] of [['1', started.died], ['2', started.diedPacked]] as const) {
  const died = await ran;
  ok(died.status === 1 && died.out.includes('\nstuck\n') && died.out.includes('\n  FAIL: stuck died, exit 13\n') && /\nbefore +\d+\.\d s {2}1 ok\n/.test(died.out) && died.stdout.trimEnd().endsWith('1 FAILURE(S)'),
    `under --jobs ${jobs} a process that dies in a run fails it by name, with its exit code, and the run ends with its summary (exit ${died.status})`);
}
// Each suite alone in a process, the one that leaves the tables changed fails in its own process, and the next passes.
const leftAlone = await started.leftAlone;
ok(leftAlone.status === 1 && leftAlone.out.includes(blamed) && /\n {2}next +\d+\.\d s {2}1 ok\n/.test(leftAlone.out) && leftAlone.out.trimEnd().endsWith('1 FAILURE(S)'),
  `alone in its process, a suite that leaves the tables changed fails by name, and the one after it passes (exit ${leftAlone.status})`);
// Any order: --shuffle <seed> shuffles the runs by the seed, the same order each time, and prints the
// seed first and last; one given none prints the one it drew, which plays its order again.
const dealt = await started.dealt, again = await started.again, drawn = await started.drawn;
const seed = /^Shuffled by seed (\d+): --shuffle \1 plays this order again\.$/m.exec(drawn.out)?.[1], replayed = seed ? await run('--shuffle', seed) : undefined;
ok(runsOf(dealt.out).join(' ') !== order.join(' ') && [...runsOf(dealt.out)].sort().join(' ') === order.join(' ') && runsOf(again.out).join(' ') === runsOf(dealt.out).join(' ') && shape(again.out) === shape(dealt.out),
  `--shuffle 2 runs every suite in an order of its own, the same twice (${runsOf(dealt.out).join(' ')})`);
ok(dealt.out.includes('\nShuffled by seed 2: --shuffle 2 plays this order again.\n') && dealt.out.includes(', shuffled by seed 2.\n'), 'a shuffled run prints its seed first and last');
ok(!!replayed && runsOf(replayed.out).join(' ') === runsOf(drawn.out).join(' ') && shape(replayed.out) === shape(drawn.out), `--shuffle given no seed prints the one it drew, which plays the same order again (${seed})`);

console.log('\n' + summary(failureCount(), new Map()));
process.exit(failureCount() ? 1 : 0);
