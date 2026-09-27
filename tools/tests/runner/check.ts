// The runner's own check: tools/test.ts run in a child process against ./fixture/, a folder the real
// run never reads, so the owed lines and failures here stay out of its output.
//   node tools/tests/runner/check.ts
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ok, failureCount, summary } from '../lib.ts';

const runner = fileURLToPath(new URL('../../test.ts', import.meta.url));
const fixture = fileURLToPath(new URL('./fixture', import.meta.url));
const run = (...args: string[]) => {
  const r = spawnSync(process.execPath, [runner, '--dir', fixture, ...args], { encoding: 'utf8' });
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

console.log('\n' + summary(failureCount(), new Map()));
process.exit(failureCount() ? 1 : 0);
