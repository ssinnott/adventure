// A one-off for #977, deleted once it has run: moves the pilot and the input to src/app/, the folder
// src/game/pilot/ to src/app/pilot/ and src/input.ts to src/app/input.ts, each by `git mv`, and writes
// anew every relative import path that names a file that moves or stands in one, from where the files
// stand after; nothing else in any file changes. The paths are read by the compiler's parser (an import
// or export from, an `import type`, an `import()` and its type form), so a comment or a string is left
// as it is. A path that already names where its file stands is left; so it can run again (main merged
// in) and say what is left to move. Usage: node tools/toapp.ts [--dry]
import ts from 'typescript';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DRY = process.argv.includes('--dry');

/** What moves: a folder (its path ending in a slash) or a file, and where to. */
const MOVES: readonly (readonly [string, string])[] = [['src/game/pilot/', 'src/app/pilot/'], ['src/input.ts', 'src/app/input.ts']];

/** Where a file of the tree stands once the moves are made. */
function after(f: string): string {
  for (const [from, to] of MOVES) if (from.endsWith('/') ? f.startsWith(from) : f === from) return to + f.slice(from.length);
  return f;
}

/** The literal of each import path in a file: import and export from, `import type`, `import()` and `import('…').T`. */
function specs(file: string, text: string): ts.StringLiteral[] {
  const out: ts.StringLiteral[] = [];
  const visit = (n: ts.Node): void => {
    if ((ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) && n.moduleSpecifier && ts.isStringLiteral(n.moduleSpecifier)) out.push(n.moduleSpecifier);
    else if (ts.isImportTypeNode(n) && ts.isLiteralTypeNode(n.argument) && ts.isStringLiteral(n.argument.literal)) out.push(n.argument.literal);
    else if (ts.isCallExpression(n) && n.expression.kind === ts.SyntaxKind.ImportKeyword && n.arguments[0] && ts.isStringLiteral(n.arguments[0])) out.push(n.arguments[0]);
    ts.forEachChild(n, visit);
  };
  visit(ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true));
  return out;
}

const git = (...args: string[]): string => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' });
const files = git('ls-files', '-z', '--', 'src', 'tools', 'types').split('\0').filter((f) => f.endsWith('.ts') && !f.startsWith('src/lib/'));
const written = new Map<string, string>();
let paths = 0;
for (const f of files) {
  const text = readFileSync(ROOT + f, 'utf8');
  const edits: { start: number; end: number; spec: string }[] = [];
  for (const lit of specs(f, text)) {
    if (!lit.text.startsWith('.')) continue;
    const target = path.posix.normalize(path.posix.join(path.posix.dirname(f), lit.text));
    let spec = path.posix.relative(path.posix.dirname(after(f)), after(target));
    if (!spec.startsWith('.')) spec = './' + spec;
    if (spec !== lit.text) edits.push({ start: lit.getStart() + 1, end: lit.getEnd() - 1, spec });
  }
  if (!edits.length) continue;
  let out = text;
  for (const e of edits.reverse()) out = out.slice(0, e.start) + e.spec + out.slice(e.end);
  written.set(f, out);
  paths += edits.length;
  console.log(`${after(f)}${after(f) === f ? '' : ` (was ${f})`}: ${edits.length} path${edits.length === 1 ? '' : 's'}`);
}

const moving = MOVES.filter(([from]) => existsSync(ROOT + from));
for (const [from, to] of moving) console.log(`git mv ${from} ${to}`);
console.log(`${moving.length} moves, ${paths} paths in ${written.size} files${DRY ? ' (dry: nothing written)' : ''}`);
if (!DRY) {
  for (const [from, to] of moving) {
    mkdirSync(path.dirname(ROOT + to.replace(/\/$/, '')), { recursive: true });
    git('mv', from.replace(/\/$/, ''), to.replace(/\/$/, ''));
  }
  for (const [f, text] of written) writeFileSync(ROOT + after(f), text);
}
