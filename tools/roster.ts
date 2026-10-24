// The roster (#1024): the command line of tools/kit/roster.ts, which makes docs/ROSTER.md from the
// monsters' defs, a row to each by area in road order, and the families.
//   node tools/roster.ts           writes docs/ROSTER.md and says how many rows changed
//   node tools/roster.ts --check   writes nothing, and exits 1 naming each row that differs
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROSTER_FILE, render, rows, stale, treeDefs, written } from './kit/roster.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const USAGE = 'usage: node tools/roster.ts [--check]';

function main(args: readonly string[]): void {
  const odd = args.find((a) => a !== '--check');
  if (odd !== undefined) { console.error(`${odd.startsWith('--') ? `unknown flag ${odd}` : `no argument is taken, not '${odd}'`}\n${USAGE}`); process.exit(2); }
  const defs = treeDefs(), made = render(defs);
  const count = defs.areas.reduce((n, a) => n + a.monsters.length, 0), what = `${count} defs and ${rows(defs).length - count} families`;
  let was = '';
  try { was = written(); } catch { /* none written yet: every row is new */ }
  const off = stale(was, made);
  if (args.includes('--check')) {
    if (!off.length) { console.log(`${ROSTER_FILE} is what the defs make: ${what}.`); return; }
    console.error(`${ROSTER_FILE} is not what the defs make; run node tools/roster.ts:\n${off.map((l) => '  ' + l).join('\n')}`);
    process.exit(1);
  }
  if (off.length) writeFileSync(path.join(ROOT, ROSTER_FILE), made);
  console.log(`${ROSTER_FILE}: ${what}, ${off.length ? `${off.length} changed:\n${off.map((l) => '  ' + l).join('\n')}` : 'none changed'}.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
