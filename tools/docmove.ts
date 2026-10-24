// That a doc was moved and not rewritten (#1011, EXPANSION §8.2): the command line of
// tools/kit/docmove.ts, which finds every line of the old file, read at a git ref, among the new files
// in the tree, as many times as it stood, and each of its paragraphs whole in one of them.
//   node tools/docmove.ts <base> <old path> <new path>...
// It prints the counts, each line missing and each paragraph not whole with its old line number, and
// the lines the new files add (their headings, an index, what is written new), and exits 1 where a
// line is missing or a paragraph broken. An area's doc moved to its shape:
//   node tools/docmove.ts <merge base> docs/areas/shelf.md docs/areas/shelf.md
//     docs/areas/shelf/decisions.md docs/areas/shelf/plan.md
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { atRef, kept, move, report } from './kit/docmove.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const USAGE = 'usage: node tools/docmove.ts <base> <old path> <new path>...';

function main(args: readonly string[]): void {
  const flag = args.find((a) => a.startsWith('--'));
  if (flag || args.length < 3) {
    console.error(`${flag ? `unknown flag ${flag}` : 'a base, the old path and one new path at least'}\n${USAGE}`);
    process.exit(2);
  }
  const [base, old, ...news] = args;
  try {
    const m = move({ path: old, text: atRef(base, old) }, news.map((p) => ({ path: p, text: readFileSync(path.resolve(ROOT, p), 'utf8') })));
    console.log(report(m, base));
    if (!kept(m)) process.exit(1);
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
