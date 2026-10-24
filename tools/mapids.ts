// #994's one-off (part of #848), committed first and deleted last, as #992's and #993's were: keeps
// every map's id literal where the map is declared, so that `MapId` (content/index.ts) is the union of
// the ids the areas list. It reads the declarations from the files as they stand (the TypeScript
// parser) and puts `MapDef<'<id>'>` in place of each `: MapDef` whose literal names its `id`; a Rift
// the areas place is made by `rift(..)`, which keeps its id from the spec, and is declared `Rift<'<id>'>`
// (with the type's import), since a Rift's type inferred from its call would wait on `MapId` itself.
// Then it holds every map of the joined content to one or the other. From the root:
// `node tools/mapids.ts`. Run again on a tree it has done, it prints `Nothing left to move`.
import ts from 'typescript';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MAP_DEFS } from '../src/content/index.ts';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const walk = (d: string): string[] => readdirSync(ROOT + d).flatMap((n) => {
  const p = `${d}/${n}`;
  return statSync(ROOT + p).isDirectory() ? walk(p) : p.endsWith('.ts') ? [p] : [];
});
const FILES = walk('src/content/areas').filter((f) => !/\/(walkthrough|checks)\.ts$/.test(f));
const fail = (why: string): never => { console.error(why); process.exit(1); };

/** The id a map's literal names, if it names one by a string. */
function idOf(o: ts.ObjectLiteralExpression): string | undefined {
  for (const p of o.properties) {
    if (ts.isPropertyAssignment(p) && ts.isIdentifier(p.name) && p.name.text === 'id' && ts.isStringLiteral(p.initializer)) return p.initializer.text;
  }
  return undefined;
}

const typed = new Set<string>(), made = new Set<string>();
let files = 0, moved = 0;
for (const file of FILES) {
  const text = readFileSync(ROOT + file, 'utf8');
  const src = ts.createSourceFile(file, text, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
  const edits: [number, number, string][] = [];
  const visit = (n: ts.Node): void => {
    if (ts.isVariableDeclaration(n) && n.type && ts.isTypeReferenceNode(n.type) && ts.isIdentifier(n.type.typeName) && n.type.typeName.text === 'MapDef'
      && n.initializer && ts.isObjectLiteralExpression(n.initializer)) {
      const id = idOf(n.initializer);
      if (id === undefined) fail(`${file}: ${n.name.getText(src)} is a MapDef whose literal names no id by a string`);
      const args = n.type.typeArguments;
      if (!args) edits.push([n.type.getStart(src), n.type.getEnd(), `MapDef<'${id}'>`]);
      else if (args.length !== 1 || !ts.isLiteralTypeNode(args[0]) || !ts.isStringLiteral(args[0].literal) || args[0].literal.text !== id) fail(`${file}: ${n.name.getText(src)} is declared ${n.type.getText(src)} and names the id '${id}'`);
      typed.add(id!);
    }
    if (ts.isVariableDeclaration(n) && n.initializer && ts.isCallExpression(n.initializer) && ts.isIdentifier(n.initializer.expression)
      && n.initializer.expression.text === 'rift' && n.initializer.arguments[0] && ts.isObjectLiteralExpression(n.initializer.arguments[0])) {
      const id = idOf(n.initializer.arguments[0]);
      if (id === undefined) fail(`${file}: ${n.name.getText(src)} is a Rift whose spec names no id by a string`);
      if (!n.type) edits.push([n.name.getEnd(), n.name.getEnd(), `: Rift<'${id}'>`]);
      else if (n.type.getText(src) !== `Rift<'${id}'>`) fail(`${file}: ${n.name.getText(src)} is declared ${n.type.getText(src)} and names the id '${id}'`);
      made.add(id!);
    }
    ts.forEachChild(n, visit);
  };
  visit(src);
  if (!edits.length) continue;
  // A Rift's type comes from where `rift` does, as a type.
  const riftImport = src.statements.find((s): s is ts.ImportDeclaration => ts.isImportDeclaration(s) && !s.importClause?.isTypeOnly
    && ts.isStringLiteral(s.moduleSpecifier) && s.moduleSpecifier.text.endsWith('/rifts/index.ts'));
  if (edits.some((e) => e[2].startsWith(': Rift<')) && riftImport && !/import type \{[^}]*\bRift\b/.test(text)) {
    edits.push([riftImport.getEnd(), riftImport.getEnd(), `\nimport type { Rift } from '${(riftImport.moduleSpecifier as ts.StringLiteral).text}';`]);
  }
  let out = text;
  for (const [s, e, r] of edits.sort((a, b) => b[0] - a[0])) out = out.slice(0, s) + r + out.slice(e);
  writeFileSync(ROOT + file, out);
  files++; moved += edits.filter((e) => !e[2].startsWith('\nimport')).length;
}

// Every map the areas list is one of the two, or MapId would widen to string (NARROW fails then too).
const loose = MAP_DEFS.filter((d) => !typed.has(d.id) && !made.has(d.id)).map((d) => d.id);
if (loose.length) fail(`maps declared neither MapDef<'id'> nor by rift(..): ${loose.join(', ')}`);
console.log(`${MAP_DEFS.length} maps: ${typed.size} declared MapDef<'id'>, ${made.size} made by rift(..)`);
console.log(files ? `${moved} declarations typed in ${files} files` : 'Nothing left to move');
