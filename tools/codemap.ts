// The code map (#1023): the command line of tools/kit/codemap.ts, which makes docs/CODEMAP.md from
// the headers of the files of src/ (not src/lib/), tools/ and types/, a row to each, by path.
//   node tools/codemap.ts           writes docs/CODEMAP.md and says how many rows changed
//   node tools/codemap.ts --check   writes nothing, and exits 1 naming each row that differs
// Either exits 1 naming each file whose header has no first paragraph, and then writes nothing.
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MAP_FILE, headless, render, rows, stale, treeSources, written } from './kit/codemap.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const USAGE = 'usage: node tools/codemap.ts [--check]';

function main(args: readonly string[]): void {
  const odd = args.find((a) => a !== '--check');
  if (odd !== undefined) { console.error(`${odd.startsWith('--') ? `unknown flag ${odd}` : `no argument is taken, not '${odd}'`}\n${USAGE}`); process.exit(2); }
  const tree = treeSources();
  const none = headless(tree);
  if (none.length) {
    console.error(`${none.length} file${none.length === 1 ? ' has' : 's have'} no header with a first paragraph, which is its row:\n${none.map((f) => '  ' + f).join('\n')}`);
    process.exit(1);
  }
  const rs = rows(tree), made = render(rs);
  let was = '';
  try { was = written(); } catch { /* none written yet: every row is new */ }
  const off = stale(was, made);
  if (args.includes('--check')) {
    if (!off.length) { console.log(`${MAP_FILE} is what the headers make: ${rs.length} rows from ${tree.length} files.`); return; }
    console.error(`${MAP_FILE} is not what the headers make; run node tools/codemap.ts:\n${off.map((l) => '  ' + l).join('\n')}`);
    process.exit(1);
  }
  if (off.length) writeFileSync(path.join(ROOT, MAP_FILE), made);
  console.log(`${MAP_FILE}: ${rs.length} rows from ${tree.length} files, ${off.length ? `${off.length} changed:\n${off.map((l) => '  ' + l).join('\n')}` : 'none changed'}.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
