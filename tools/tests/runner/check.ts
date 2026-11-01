// The runner's own check: tools/test.ts run in a child process against ./fixture/, ./stuck/,
// ./leaves/ and ./narrow/, folders the real run never reads, so the owed lines and failures here
// stay out of its output; in one process, under --jobs (#954) and in shards (#848). ./walks/ holds
// the areas of a walkthrough's scenes (#1018), run with --walks.
//   node tools/tests/runner/check.ts
import { execFileSync, spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
 * The runner on `dir` (its suites' folder, or the folder flags whole: `['--walks', walks]`), started
 * once a core is free (#954: every run below starts at once, and each is read where it is checked);
 * `TEST_LIST=1` among the args sets it for the run, else it is unset there, whatever it is here, and so
 * are TEST_SINCE, TEST_AREAS, TEST_DEAR, TEST_SHARD and GITHUB_STEP_SUMMARY but as `set` gives them.
 */
const runWith = (set: Record<string, string>, dir: string | string[], ...args: string[]): Promise<Run> => new Promise((resolve) => {
  const env = { ...process.env, TEST_LIST: args.includes('TEST_LIST=1') ? '1' : '', TEST_SINCE: '', TEST_AREAS: '', TEST_DEAR: '', TEST_SHARD: '', GITHUB_STEP_SUMMARY: '', ...set };
  const go = (): void => {
    free--;
    const child = spawn(process.execPath, [runner, ...(typeof dir === 'string' ? ['--dir', dir] : dir), ...args.filter((a) => a !== 'TEST_LIST=1')], { env });
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
/** The runner on the walkthroughs of ./walks/'s areas, and no suites (#1018). */
const walks = fileURLToPath(new URL('./walks', import.meta.url));
const walk = (...args: string[]): Promise<Run> => runWith({}, ['--walks', walks], ...args);
// A walkthrough of scenes whose file throws as it loads (#1018): written here, taken away after.
const unloadable = mkdtempSync(join(tmpdir(), 'runner-walks-'));
mkdirSync(join(unloadable, 'bad'));
writeFileSync(join(unloadable, 'bad', 'walkthrough.ts'), "export const scenes = [{ name: 'one', play: () => {} }];\nthrow new Error('the file throws as it loads');\n");

console.log('\nrunner');
const narrow = folder('narrow'), step = join(tmpdir(), `runner-check-${process.pid}.md`), shardStep = join(tmpdir(), `runner-check-${process.pid}-shard.md`);
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
  walked: walk('--list'), scene: walk('walkthrough:fx:three', '--list'), dearScene: runWith({ TEST_DEAR: 'walkthrough:fx:three' }, ['--walks', walks], '--jobs', '2', '--list'),
  quiet: walk(), quietJobs: runWith({ TEST_DEAR: 'walkthrough:fx:three' }, ['--walks', walks], '--jobs', '2'),
  both: runWith({}, ['--dir', fixture, '--walks', walks], 'owing', 'walkthrough:whole'), nope: walk('walkthrough:fx:nope'), noScenes: walk('walkthrough:whole:x'),
  nosuch: run('nosuch'), noPart: runIn(narrow, 'gate:nosuch'), noParts: run('slow:x'),
  unloaded: runWith({}, ['--walks', unloadable], 'walkthrough:bad:one'),
  // The fixture dealt two, three and seven ways by the seconds TEST_DEAR gives (#848): two ways, the second
  // under --jobs 2; three, each shard shuffled by a seed of its own; seven, the last by TEST_SHARD and the first
  // writing the run's summary. Then the gate's parts narrowed to two areas, dealt two ways, and four shards refused.
  ways: [2, 3, 7].map((n) => Array.from({ length: n }, (_, k) => {
    const i = k + 1, set = { TEST_DEAR: 'slow=5,later=3,holds=2', ...(n === 7 && i === 7 ? { TEST_SHARD: '7/7' } : {}), ...(n === 7 && i === 1 ? { GITHUB_STEP_SUMMARY: shardStep } : {}) };
    return runWith(set, fixture, ...(n === 2 && i === 2 ? ['--jobs', '2'] : []), ...(n === 3 ? ['--shuffle', String(i)] : []), ...(n === 7 && i === 7 ? [] : ['--shard', `${i}/${n}`]));
  })),
  narrowedWays: [runIn(narrow, '--areas', 'shelf,thornmark', '--shard', '1/2'), runIn(narrow, '--areas', 'shelf,thornmark', '--jobs', '2', '--shard', '2/2')],
  badShards: [run('--shard', '3/2'), run('--shard', '0/2'), runWith({ TEST_SHARD: '1/2/3' }, fixture), run('--shard')],
  // Two shards each shuffled by a seed of its own, four times over, the fixture's runs weighing alike by
  // the real DEAR, which names none of them: only a plan dealt before the shuffle holds every run once.
  seeded: [[1, 2], [3, 4], [5, 6], [7, 8]].map(([a, b]) => [run('--shard', '1/2', '--shuffle', String(a)), run('--shard', '2/2', '--shuffle', String(b))]),
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

// Shards (#848): --shard i/n, or TEST_SHARD, keeps shard i of the plan dealt n ways, the dear by their
// seconds, the dearest first, onto the shard that holds the fewest so far, and a run DEAR does not name
// by REST's: n shards hold every run once, whatever each shuffles or how many processes it runs.
const ways = await Promise.all(started.ways.map((w) => Promise.all(w)));
const dealtLine = (out: string): string | undefined => /^Shard \d+ of \d+: .+$/m.exec(out)?.[0];
const uncovered = ways.filter((w) => { const held = w.flatMap((r) => runsOf(r.out)); return held.length !== order.length || [...held].sort().join(' ') !== order.join(' '); });
ok(!uncovered.length && ways.every((w) => w.every((r, k) => r.status === (runsOf(r.out).some((n) => n !== 'owing' && n !== 'slow') ? 1 : 0) && dealtLine(r.out)?.startsWith(`Shard ${k + 1} of ${w.length}: `))),
  `two, three and seven shards hold every run once, each saying which it is and failing only where a run of its own fails (${ways.map((w) => w.map((r) => runsOf(r.out).join('+') || 'none').join(' | ')).join('; ')})`);
ok(ways[0].map((r) => runsOf(r.out).join(' ')).join(' | ') === 'owing slow unnamed | holds later rejects' && dealtLine(ways[0][0].out) === "Shard 1 of 2: 3 of the plan's 6 runs, 5.2 s by DEAR's seconds (the shards 5.2, 5.1)."
  && ways[1].map((r) => [...runsOf(r.out)].sort().join(' ')).join(' | ') === 'slow | later | holds owing rejects unnamed' && ways[2][6].out.trimEnd().endsWith('ALL OK') && !runsOf(ways[2][6].out).length,
  `the dear are dealt by their seconds, the dearest first, onto the lightest shard, and the rest by REST's after them; a shard with nothing dealt passes (${ways[0].map((r) => dealtLine(r.out)).join(' ')})`);
let shardSaid = '';
try { shardSaid = readFileSync(shardStep, 'utf8'); rmSync(shardStep); } catch { /* not written */ }
ok(shardSaid.startsWith(`### Shard 1 of 7: node tools/test.ts --dir ${fixture} --shard 1/7\n`) && shardSaid.includes("\nShard 1 of 7: 1 of the plan's 6 runs, 5.0 s by DEAR's seconds") && shardSaid.includes("Each suite's seconds"),
  "a shard writes its line and its table into the run's summary under its name");
const narrowedWays = await Promise.all(started.narrowedWays), twoAsked = /\nAsked for shelf, thornmark: the gate and the walkthroughs ran for 2 of \d+ areas\.\n/;
ok(narrowedWays.every((r) => r.status === 0 && twoAsked.test(r.out)) && narrowedWays.flatMap((r) => runsOf(r.out)).sort().join(' ') === 'gate:fixed gate:shelf gate:thornmark',
  `narrowed to two areas, two shards hold the narrowed runs once, each saying what the run was narrowed to (${narrowedWays.map((r) => runsOf(r.out).join('+')).join(' | ')})`);
const badShards = await Promise.all(started.badShards), forms = ['3/2', '0/2', '1/2/3', ''].map((s) => `--shard takes i/n, shard i of n with 1 <= i <= n, as TEST_SHARD does, not '${s}'.`);
ok(badShards.every((r, k) => r.status === 2 && r.out.trim() === forms[k]), `a shard malformed or out of its count stops the run, naming the form, exit 2 (${badShards.map((r) => r.status).join(', ')})`);
const seeded = await Promise.all(started.seeded.map((p) => Promise.all(p)));
ok(seeded.every((p) => p.flatMap((r) => runsOf(r.out)).sort().join(' ') === order.join(' ')),
  `two shards each shuffled by a seed of its own hold every run once, the plan dealt before the shuffle (${seeded.map((p) => p.map((r) => runsOf(r.out).join('+')).join(' | ')).join('; ')})`);

// A walkthrough's scenes (#1018), on ./walks/: fx's three, in their order and not their names', each a
// run of its own with its line and its row in the table, then whole's walkthrough of one function.
const walked = await started.walked, wRuns = runsOf(walked.out);
/** What one run printed: its lines from its name to its line of seconds. */
const section = (out: string, name: string): string => { const i = out.indexOf(`\n${name}\n`); return i < 0 ? '' : out.slice(i, out.indexOf('\n', out.indexOf(`\n${name} `, i) + 1)); };
const fxCounts: Record<string, string> = { 'walkthrough:fx:one': '14 ok', 'walkthrough:fx:n4': '1 ok, 1 failed', 'walkthrough:fx:three': '2 ok, 1 failed', 'walkthrough:whole': '1 ok' };
const fxTable = walked.out.slice(walked.out.indexOf("Each suite's seconds"));
ok(wRuns.join(' ') === Object.keys(fxCounts).join(' ') && Object.entries(fxCounts).every(([n, c]) => new RegExp(`^${n} +\\d+\\.\\d s {2}${c}$`, 'm').test(walked.out) && fxTable.includes(`  ${n} `)),
  `a walkthrough of scenes runs as its scenes in their order, each with its line of seconds and counts and its row; one of a function runs whole (${wRuns.join(' ')})`);
const one = section(walked.out, 'walkthrough:fx:one'), n4 = section(walked.out, 'walkthrough:fx:n4'), three = section(walked.out, 'walkthrough:fx:three');
ok(['a walk given no start is a new game', "a walk starts at its start's place (keep 3,3, facing 1)", "a walk starts at its start's level (3,", "a walk starts with its start's flags and bag, hired"].every((s) => one.includes(`  ok:   ${s}`)) && !one.includes('FAIL'),
  'a walk given no start is a new game, and one given a start stands at its place, at its level, with its flags');
ok(/\n {2}FAIL: scene n4 threw Error: no map is named nowhere: the nearest are .+\n(?: {4}at .+\n)* {4}at mapDef /.test(n4) && !walked.out.includes('goes on past a map that is not there'),
  'a scene that throws fails by name with its stack, and the rest of it never plays: here mapDef, naming the map that is not there');
const declared = '  ok:   every goal of the one quest comes up in a run\n', undeclared = '  FAIL: every goal of the one quest comes up in a run -> ashcombe: "';
ok(three.includes(declared) && three.includes(undeclared) && !three.includes('Ashcombe is past Gullwick'), 'the scene after one that threw runs, and fails its own check: everyGoalWalked fails the goals no scene says it walks, and passes on those one says');
ok(['a new walk reads that map as built, the secret shut', 'the third scene reads the maps as built, whatever the first opened', 'a walkthrough of one function runs whole, and its walk reads'].every((s) => walked.out.includes(`  ok:   ${s}`)),
  'a walk changes only its own copy of the maps: a secret it opens is shut to the next walk, in its scene, the next scene and the next walkthrough');
ok(walked.status === 1 && (walked.out.match(/^ {2}FAIL: /gm) ?? []).length === 2 && walked.out.trimEnd().endsWith('2 FAILURE(S)'), `the scenes fail only as they mean to (exit ${walked.status})`);
const scene = await started.scene;
ok(runsOf(scene.out).join(' ') === 'walkthrough:fx:three' && section(scene.out, 'walkthrough:fx:three').replace(/\d+\.\d s/, '') === three.replace(/\d+\.\d s/, ''),
  `a scene named runs alone and prints what it printed in the whole: everyGoalWalked reads what the scenes say, not who ran before (${runsOf(scene.out).join(' ')})`);
const dearScene = await started.dearScene;
ok(dearScene.status === walked.status && shape(dearScene.out) === shape(walked.out) && /^4 runs in 2 processes/m.test(dearScene.out), 'a scene may be the dear run: alone in its process, it prints what one process prints');
// Quiet, a walkthrough's scenes run one after another print as its one run (#1033): its name,
// a scene by name only where it fails or owes, with its lines and its own line, then one line of
// them summed with how many and the slowest, which is its one row in the table; --jobs prints
// the same.
const quiet = await started.quiet, quietJobs = await started.quietJobs;
const quietRows = quiet.out.slice(quiet.out.indexOf("Each suite's seconds")).split('\n').filter((l) => l.startsWith('  ')).map((l) => l.trim().split(' ')[0]).sort();
const summed = /^walkthrough:fx +\d+\.\d s {2}17 ok, 2 failed \(3 scenes; the slowest, (one|n4|three), \d+\.\d s\)$/m;
const unnoted = (out: string): string => shape(out).replace(/\(3 scenes; the slowest, [a-z0-9]+, \d+\.\d s\)/g, '(3 scenes)');
ok(quiet.status === 1 && runsOf(quiet.out).join(' ') === 'walkthrough:fx:n4 walkthrough:fx:three walkthrough:fx walkthrough:whole' && !quiet.out.includes('walkthrough:fx:one')
  && quiet.out.includes('\nwalkthrough:fx\nwalkthrough:fx:n4\n') && summed.test(quiet.out) && quietRows.join(' ') === 'walkthrough:fx walkthrough:whole',
  `quiet, a walkthrough's scenes print as its one run: its name, the two that fail by name with their lines, then one line and one row of the three (${runsOf(quiet.out).join(' ')}; rows ${quietRows.join(' ')})`);
ok(quietJobs.status === quiet.status && unnoted(quietJobs.out) === unnoted(quiet.out), `and under --jobs 2, a scene the dear run, the same (exit ${quietJobs.status})`);
ok(runsOf((await started.both).out).join(' ') === 'owing walkthrough:whole', '--dir and --walks together give the suites of the one and the walkthroughs of the other');
// A name no run has stops the run before it starts, naming those there are, where it ran nothing and passed.
const refusals: [Run, string][] = [[await started.nope, 'No run is named walkthrough:fx:nope: the scenes of walkthrough:fx are one, n4, three.'],
  [await started.noScenes, 'No run is named walkthrough:whole:x: walkthrough:whole has no scenes.'], [await started.nosuch, 'No run is named nosuch: the suites are fullrun, holds, later, owing, rejects, slow, survival, unnamed.'],
  [await started.noPart, `No run is named gate:nosuch: the parts of gate are fixed, ${AREAS.map((a) => a.id).join(', ')}.`], [await started.noParts, 'No run is named slow:x: slow has no parts.']];
const unrefused = refusals.filter(([r, said]) => r.status !== 2 || r.out.trim() !== said).map(([r, said]) => `${said.slice('No run is named '.length, said.indexOf(': '))} (exit ${r.status})`);
ok(!unrefused.length, `a scene, a suite or a part no run has stops the run, naming the runs there are, exit 2${unrefused.length ? ` -> not ${unrefused.join(', ')}` : ''}`);
const unloaded = await started.unloaded;
rmSync(unloadable, { recursive: true, force: true });
ok(unloaded.status === 1 && runsOf(unloaded.out).join(' ') === 'walkthrough:bad' && unloaded.out.includes('\n  FAIL: threw Error: the file throws as it loads'),
  `a scene of a walkthrough whose file will not load runs it whole and fails by name; it is not refused (exit ${unloaded.status}: ${runsOf(unloaded.out).join(' ')})`);
// Played whole by the kit, as where the plan cannot name its scenes: in order, a throw stopping none, and
// names the runner cannot run alone failing the walkthrough before any scene plays.
const { playScenes } = await import('../../kit/walk.ts'), { scenes: fx } = await import('./walks/fx/walkthrough.ts');
const heard: string[] = [], hear = (cond: boolean, msg: string): void => { heard.push(`${cond ? 'ok' : 'FAIL'}: ${msg.split('\n')[0]}`); };
await playScenes(hear, fx);
const where = (s: string): number => heard.findIndex((l) => l.startsWith(s));
const marks = ['ok: a walk starts at', 'ok: the second scene begins', 'FAIL: scene n4 threw Error: no map is named nowhere', 'ok: the third scene reads', 'FAIL: every goal of the one quest'].map(where);
ok(marks.every((m, i) => m >= 0 && (i === 0 || m > marks[i - 1])) && heard.length === 19, `the kit plays a walkthrough's scenes whole in their order, and one that throws stops none (${heard.length} lines)`);
heard.length = 0;
await playScenes(hear, [{ name: 'Upper', play: () => hear(true, 'played') }, { name: 'a:b', play: () => hear(true, 'played') }, { name: 'twice', play: () => hear(true, 'played') }, { name: 'twice', play: () => hear(true, 'played') }]);
ok(heard.join('|') === "FAIL: a scene's name is lower case, holds no colon and comes once: not Upper, a:b, twice", `names the runner cannot run alone fail the walkthrough before a scene plays (${heard.join('|')})`);

// What no run of ./walks/ reaches (#1018): a scene held to the goals it says it walks, one that
// fails a check stopping none, the lookups throwing by name, featureOn keeping to its kind and
// fight's memo keyed on the cap, a count read from its run of seeds (the mill's warden at 1 is won
// 17% of 100 seeds capped, 30% of the first ten of them and 40% of ten uncapped; at 2, since the
// class changes (#1117), the cap no longer moves the first ten).
heard.length = 0;
const claimed = fx[0].walks![0] as string;
await playScenes(hear, [{ name: 'liar', walks: [claimed], play: (o) => o(false, 'a check fails') }, { name: 'next', play: (o) => o(true, 'the next scene plays') }]);
ok(heard.join('|') === `FAIL: a check fails|FAIL: scene liar says it walks what none of its plays came to: "${claimed}"|ok: the next scene plays`,
  `a scene is held to the goals it says it walks, and one that fails a check stops none (${heard.length} lines)`);
const { groupOn, featureOn, exitTo, mapDef } = await import('../../kit/walk.ts');
const threw = (f: () => unknown): string => { try { f(); return 'nothing thrown'; } catch (e) { return e instanceof Error ? e.message : String(e); } };
const way = mapDef('greywater2').exits![0];
const unfound = [threw(() => groupOn('mill', 'm_wardn')), threw(() => featureOn('greywater2', 'gw2_ledger', 'npc')), threw(() => exitTo('greywater2', 'nowhere'))];
ok(groupOn('mill', 'm_warden').id === 'm_warden' && featureOn('greywater2', 'gw2_ledger', 'chest').kind === 'chest' && exitTo('greywater2', way.to) === way
  && unfound[0].startsWith('no group is named m_wardn on mill: the nearest are m_warden') && unfound[1].startsWith('no npc is named gw2_ledger on greywater2')
  && unfound[2].startsWith('no way out of greywater2 leads to nowhere: the nearest are '), `groupOn, featureOn and exitTo find what is there, of its kind, and throw naming what is not (${unfound.join(' | ')})`);
const { rate, winRate, gateOpts } = await import('../../kit/fight.ts');
const warden = groupOn('mill', 'm_warden'), asks = [[100, 15], [10, 15], [10, Infinity]] as const;
const memo = asks.map(([s, c]) => rate(warden, 1, s, c)), worked = asks.map(([s, c]) => winRate(1, warden, s, c, gateOpts(warden)));
ok(memo.join() === worked.join() && new Set(worked).size === 3, `fight's memo keys on the cap and reads a count from its run of seeds: one group at one level asked three ways is three rates, each winRate's (${memo.join(', ')})`);

// A walk's palettes are shared with every other walk's copy, frozen as its cells are (#1018).
const { newWalk } = await import('../../kit/walk.ts');
let painted = 'nothing thrown';
try { (newWalk(hear).world.maps.keep.palette as unknown as Record<string, unknown>).probe = 1; } catch (e) { painted = e instanceof Error ? e.message : String(e); }
ok(painted.startsWith('Cannot add property probe') && !('probe' in newWalk(hear).world.maps.keep.palette), `a walk's palette is frozen: a write throws and the next walk reads none (${painted})`);

// goalOf names the words given and the chapter's goals nearest them where none begins so (#1018).
const { goalOf } = await import('../../kit/walk.ts');
const foreland = AREAS.find((a) => a.id === 'shelf')!.chapter!;
let typo = 'nothing thrown';
try { goalOf(foreland, 'Ashcombe is past Gullwik'); } catch (e) { typo = e instanceof Error ? e.message : String(e); }
ok(typo.startsWith(`no goal of ${foreland.id} begins "Ashcombe is past Gullwik": the nearest begin "Ashcombe is past Gullwic", `), `goalOf throws naming the words and the chapter's goals nearest them (${typo})`);

console.log('\n' + summary(failureCount(), new Map()));
process.exit(failureCount() ? 1 : 0);
