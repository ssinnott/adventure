// The runner's own check: tools/test.ts run in a child process against ./fixture/, ./stuck/ and ./leaves/,
// folders the real run never reads, so the owed lines and failures here stay out of its output.
//   node tools/tests/runner/check.ts
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ok, failureCount, summary } from '../lib.ts';

const runner = fileURLToPath(new URL('../../test.ts', import.meta.url));
const fixture = fileURLToPath(new URL('./fixture', import.meta.url));
/** The runner on `dir`; `TEST_LIST=1` among the args sets it for the run, else it is unset there, whatever it is here. */
const runIn = (dir: string, ...args: string[]) => {
  const env = { ...process.env, TEST_LIST: args.includes('TEST_LIST=1') ? '1' : '' };
  const r = spawnSync(process.execPath, [runner, '--dir', dir, ...args.filter((a) => a !== 'TEST_LIST=1')], { encoding: 'utf8', env });
  return { status: r.status, out: r.stdout + r.stderr, stdout: r.stdout };
};
/** The runner on the fixture. */
const run = (...args: string[]) => runIn(fixture, ...args);

console.log('\nrunner');
const owing = run('owing');
ok(owing.status === 0, 'a run with only owed lines passes');
ok(owing.out.includes("  owed: a first thing not yet so (#43's)"), 'an owed check that does not hold yet is reported');
ok(owing.out.trimEnd().endsWith('ALL OK (3 owed: #40 ×2, #43 ×1)'), 'the summary gives the owed count by whose');

const all = run();
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
const listed = run('--list');
ok(!owing.out.includes('  ok:   a check that holds') && listed.out.includes('  ok:   a check that holds'), 'a check that holds prints its line under --list and not by default');
ok(!all.out.includes('  note: a line of its own') && listed.out.includes('  note: a line of its own'), "a suite's own line prints under --list and not by default");
ok(run('owing', 'TEST_LIST=1').out.includes('  ok:   a check that holds'), 'TEST_LIST=1 prints every line as --list does');
ok(all.out.includes('\nlater\n  note: what it said before it failed\n  FAIL: a check after an await\n'), "a failing line prints under its suite, after the suite's own lines before it");
// Each suite's own counts, not the run's so far.
const counts: Record<string, string> = { holds: '0 ok, 1 failed', later: '0 ok, 1 failed', owing: '1 ok, 3 owed', rejects: '0 ok, 1 failed', slow: '1 ok', unnamed: '0 ok, 1 failed' };
const names = Object.keys(counts);
const miscounted = names.filter((n) => !new RegExp(`^${n} +\\d+\\.\\d s {2}${counts[n]}$`, 'm').test(all.out));
ok(!miscounted.length, `every suite ends with a line of its seconds and its own counts${miscounted.length ? ` (not ${miscounted.join(' ')})` : ''}`);
const table = all.out.slice(all.out.indexOf("Each suite's seconds")).split('\n').slice(1).filter((l) => l.startsWith('  ')).map((l) => l.trim().split(' ')[0]);
ok(table[0] === 'slow' && [...table].sort().join(' ') === names.join(' '), `the summary's table lists every suite, the slowest first (${table.join(' ')})`);
// A run that dies inside a suite names it last, as the suite's name prints when it starts: here an
// await that never settles, which ends the run with Node's exit 13; a crash and a timeout alike.
const stuck = runIn(fileURLToPath(new URL('./stuck', import.meta.url)));
const last = stuck.stdout.trimEnd().split('\n').at(-1);
ok(stuck.status === 13 && last === 'stuck', `a run that dies inside a suite names it last (exit ${stuck.status}, last "${last}")`);

// A suite leaves the item and monster tables as it found them (#946): one that adds, takes out or
// replaces an entry fails by name, under its own name, and the suite after it, which changes none, passes.
const leaves = runIn(fileURLToPath(new URL('./leaves', import.meta.url)));
const blamed = '\nleaves\n  FAIL: leaves leaves the tables as it did not find them: added ITEMS.fx_left, removed ITEMS.torch, replaced MONSTERS.rat\n';
ok(leaves.status === 1 && leaves.out.includes(blamed) && /\n {2}next +\d+\.\d s {2}1 ok\n/.test(leaves.out) && leaves.out.trimEnd().endsWith('1 FAILURE(S)'),
  `a suite that leaves the tables changed fails by name, listing each entry added, removed or replaced, and the one after it passes (exit ${leaves.status})`);

ok(!listed.out.includes('the suite run only when named ran'), 'a bare run passes over a suite run only when named (ASKED)');
const asked = run('survival', '--list');
ok(asked.status === 0 && asked.out.includes('the suite run only when named ran'), 'a suite run only when named runs when it is named');
ok(!listed.out.includes('the full run ran'), 'a bare run passes over the full run, run only when named (ASKED)');
const full = run('fullrun', '--list');
ok(full.status === 0 && full.out.includes('the full run ran'), 'the full run runs when it is named');

console.log('\n' + summary(failureCount(), new Map()));
process.exit(failureCount() ? 1 : 0);
