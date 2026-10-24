// The shape of an area's doc (EXPANSION §8.2, #1011): docs/areas/<name>.md, its current state in 250
// lines at most, and beside it the folder docs/areas/<name>/ with its decisions (decisions.md) and its
// plan (plan.md). A doc not moved to the shape yet is owed to D3 by name, with its lines as they stand;
// a doc in neither state fails, and so does a folder with no doc beside it.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { ok, owed } from './lib.ts';

/** The most lines a doc's current state may have. */
const CAP = 250;
/** The files beside it, in its folder. */
const BESIDE = ['decisions.md', 'plan.md'];
/** The docs not moved to the shape yet, owed to D3 (#848's Work group 8), which moves each and empties this. */
const UNMOVED = ['ashfall', 'rimewater', 'saltreach', 'wrackholm'];

/** A file's lines, as `wc -l` counts them. */
const linesIn = (text: string): number => text.split('\n').length - (text.endsWith('\n') ? 1 : 0);

export function areadocs(): void {
  const root = new URL('../../docs/areas/', import.meta.url);
  const all = readdirSync(root, { withFileTypes: true });
  const docs = all.filter((d) => d.isFile() && d.name.endsWith('.md')).map((d) => d.name.slice(0, -3)).sort();
  const folders = all.filter((d) => d.isDirectory()).map((d) => d.name).sort();
  ok(docs.length >= 14, `docs/areas/ holds ${docs.length} area docs`);

  for (const name of docs) {
    const doc = `docs/areas/${name}.md`, lines = linesIn(readFileSync(new URL(`${name}.md`, root), 'utf8'));
    const moved = folders.includes(name);
    if (UNMOVED.includes(name)) {
      owed(moved, `${doc} is its state, with decisions.md and plan.md beside it (today one file of ${lines.toLocaleString('en-GB')} lines)`, 'D3');
      continue;
    }
    const lacks = BESIDE.filter((f) => !existsSync(new URL(`${name}/${f}`, root)));
    ok(moved && !lacks.length && lines <= CAP,
      `${doc} is its state, ${lines} lines of ${CAP} at most, with ${BESIDE.join(' and ')} beside it in docs/areas/${name}/` +
      (!moved ? ': it has no folder and is not owed' : lacks.length ? `: ${lacks.join(' and ')} not there` : lines > CAP ? `: ${lines - CAP} over` : ''));
  }

  const orphans = folders.filter((f) => !docs.includes(f)), gone = UNMOVED.filter((n) => !docs.includes(n));
  ok(!orphans.length && !gone.length, `each folder of docs/areas/ stands beside its doc, and each doc owed to D3 is there` +
    (orphans.length ? `: no doc beside ${orphans.map((f) => `docs/areas/${f}/`).join(', ')}` : '') + (gone.length ? `: no doc named ${gone.join(', ')}` : ''));
}
