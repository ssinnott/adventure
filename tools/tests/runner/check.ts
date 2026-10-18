// The runner's own check: tools/test.ts run in a child process against ./fixture/, a folder the
// real run never reads, so the owed lines and failures here stay out of its output.
//   node tools/tests/runner/check.ts
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ok, failureCount, summary } from '../lib.ts';

const runner = fileURLToPath(new URL('../../test.ts', import.meta.url));
const fixture = fileURLToPath(new URL('./fixture', import.meta.url));
/** The runner on the fixture; `TEST_LIST=1` among the args sets it for the run, else it is unset there, whatever it is here. */
const run = (...args: string[]) => {
  const env = { ...process.env, TEST_LIST: args.includes('TEST_LIST=1') ? '1' : '' };
  const r = spawnSync(process.execPath, [runner, '--dir', fixture, ...args.filter((a) => a !== 'TEST_LIST=1')], { encoding: 'utf8', env });
  return { status: r.status, out: r.stdout + r.stderr };
};

console.log('\nrunner');
const owing = run('owing');
ok(owing.status === 0, 'a run with only owed lines passes');
ok(owing.out.includes("  owed: a first thing not yet so (#43's)"), 'an owed check that does not hold yet is reported');
ok(owing.out.trimEnd().endsWith('ALL OK (3 owed: #40 ×2, #43 ×1)'), 'the summary gives the owed count by whose');

const all = run();
const heads = all.out.split('\n').filter((l) => /^\w+$/.test(l));
ok(heads.join(' ') === 'holds later owing rejects unnamed', `a suite dropped in the folder runs, in name order (${heads.join(' ')})`);
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
ok(all.out.includes('\nlater\n  FAIL: a check after an await\n'), 'a failing line prints under its suite');
const names = ['holds', 'later', 'owing', 'rejects', 'slow', 'unnamed'];
ok(names.every((n) => new RegExp(`^${n} +\\d+\\.\\d s {2}\\d+ ok`, 'm').test(all.out)), 'every suite ends with a line of its seconds and its count');
const table = all.out.slice(all.out.indexOf("Each suite's seconds")).split('\n').slice(1).filter((l) => l.startsWith('  ')).map((l) => l.trim().split(' ')[0]);
ok(table[0] === 'slow' && [...table].sort().join(' ') === names.join(' '), `the summary's table lists every suite, the slowest first (${table.join(' ')})`);

ok(!listed.out.includes('the suite run only when named ran'), 'a bare run passes over a suite run only when named (ASKED)');
const asked = run('survival', '--list');
ok(asked.status === 0 && asked.out.includes('the suite run only when named ran'), 'a suite run only when named runs when it is named');
ok(!listed.out.includes('the full run ran'), 'a bare run passes over the full run, run only when named (ASKED)');
const full = run('fullrun', '--list');
ok(full.status === 0 && full.out.includes('the full run ran'), 'the full run runs when it is named');

console.log('\n' + summary(failureCount(), new Map()));
process.exit(failureCount() ? 1 : 0);
