// The import lines rewritten for a move into tools/kit/ (#984): every import and `export ... from` in
// src/ and tools/ that takes one of `names` from `from` takes it from `to` instead, the rest of the line
// left as it was. With `*` every name moves, and the file with them. A one-off for the moves of #984,
// deleted when they are done, as #968's sweep was.
//   node tools/rehome.ts tools/harness.ts tools/kit/company.ts companyAt,GEAR,KIT
//   node tools/rehome.ts tools/checks.ts tools/kit/checks.ts '*'
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

const files = (): string[] => ['src', 'tools'].flatMap((dir) => readdirSync(ROOT + dir, { recursive: true, withFileTypes: true })
  .filter((d) => d.isFile() && d.name.endsWith('.ts'))
  .map((d) => relative(ROOT, d.parentPath + '/' + d.name).replaceAll('\\', '/'))
  .filter((f) => !f.includes('node_modules/')));

/** The specifier that reaches `target` from `file`, both relative to the root. */
const specifier = (file: string, target: string): string => {
  const r = relative(dirname(file), target).replaceAll('\\', '/');
  return r.startsWith('.') ? r : './' + r;
};
const resolves = (file: string, spec: string): string => relative(ROOT, resolve(ROOT, dirname(file), spec)).replaceAll('\\', '/');

/** A name in braces, as written (`type A`, `a as b`), and the name it takes from the module. */
const nameOf = (part: string): string => part.replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();

const STATEMENT = /^(import|export)(\s+type)?\s*\{([^}]*)\}\s*from\s*(['"])([^'"]+)\4;?/gm;

export function rehome(from: string, to: string, names: readonly string[] | '*'): string[] {
  const touched: string[] = [];
  for (const file of files()) {
    if (file === to || file === from) continue;
    const text = readFileSync(ROOT + file, 'utf8');
    let out = text;
    if (names === '*') {
      out = text.replace(/((?:import|export)[^'";]*?from\s*|import\s*\(\s*|import\s+)(['"])([^'"]+)\2/g, (all, head: string, q: string, spec: string) =>
        spec.startsWith('.') && resolves(file, spec) === from ? `${head}${q}${specifier(file, to)}${q}` : all);
    } else {
      out = text.replace(STATEMENT, (all, kw: string, type: string | undefined, body: string, q: string, spec: string) => {
        if (!spec.startsWith('.') || resolves(file, spec) !== from) return all;
        const parts = body.split(',').map((p) => p.trim()).filter(Boolean);
        const going = parts.filter((p) => names.includes(nameOf(p))), staying = parts.filter((p) => !names.includes(nameOf(p)));
        if (!going.length) return all;
        const line = (list: string[], path: string): string => `${kw}${type ?? ''} { ${list.join(', ')} } from ${q}${path}${q};`;
        return staying.length ? `${line(staying, spec)}\n${line(going, specifier(file, to))}` : line(going, specifier(file, to));
      });
    }
    if (out !== text) { writeFileSync(ROOT + file, out); touched.push(file); }
  }
  return touched;
}

const [from, to, list] = process.argv.slice(2);
if (!from || !to || !list) throw new Error('usage: node tools/rehome.ts <from> <to> <names|*>');
const touched = rehome(from, to, list === '*' ? '*' : list.split(','));
console.log(`${touched.length} files: ${touched.join(' ')}`);
