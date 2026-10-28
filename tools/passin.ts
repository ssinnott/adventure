// A one-off for #975, deleted once it has run: hands the quests and the guilds in, as #974's handed the
// monsters and the spells. The functions of src/game that read the guild quests or the log's quests take
// the tables first (`rankOf(tables, guild, party)`, `questLog(tables, world, party)`), and those that read
// the guilds alone take them (`guildName(guilds, guild)`); their declarations are written by hand. It
// writes the table into each call: the caller's own (`tables`, `tables.guilds`), its world's, game's or
// fight's (`g.tables`, `this.tables.guilds`), else, in the tools, the suites and the walkthroughs,
// content's (`TABLES`) or the harness's (`HARNESS`), imported. A call whose first argument is the table
// already is left; so it can run again (main merged in) and say what is left to move. A call that hands
// its own quests (an argument past the old ones), and what it cannot place, it lists for a hand.
// Usage: node tools/passin.ts [--dry]
import ts from 'typescript';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DRY = process.argv.includes('--dry');
type Slice = 'tables' | 'guilds';

/** The functions that take a table first, by module, which, and how many arguments a call had before it. */
const TAKE: Record<string, Record<string, { slice: Slice; had: number }>> = {
  'src/game/guilds.ts': {
    offered: { slice: 'tables', had: 2 }, inHand: { slice: 'tables', had: 2 },
    guildName: { slice: 'guilds', had: 1 }, guildShortName: { slice: 'guilds', had: 1 }, rankName: { slice: 'guilds', had: 2 },
  },
  'src/game/ranks.ts': { rankOf: { slice: 'tables', had: 2 } },
  'src/game/skills.ts': { mayLearn: { slice: 'tables', had: 2 }, learn: { slice: 'tables', had: 3 } },
  // The log keeps its trainers until #976: a call with three or four arguments handed its own quests.
  'src/game/quests.ts': { questLog: { slice: 'tables', had: 2 } },
};
/** `take` and `report` took the tables already (#973): a call with a fifth argument handed its own quests. */
const TRIMMED: Record<string, Record<string, number>> = { 'src/game/guilds.ts': { take: 4, report: 4 } };
/** The files that hand src/game the harness's tables (tools/kit/company.ts). */
const HARNESS_FILES = ['tools/kit/company.ts', 'tools/kit/fight.ts', 'tools/kit/harness.ts', 'tools/harness.ts', 'tools/tests/gate.ts', 'tools/tests/gatebot.ts', 'tools/tests/harness.ts'];
const CONTENT = 'src/content/index.ts', KIT_COMPANY = 'tools/kit/company.ts';
const TABLE: Record<Slice, RegExp> = { tables: /^Tables$/, guilds: /Record<GuildId, GuildDef>/ };

const cfg = ts.getParsedCommandLineOfConfigFile(path.join(ROOT, 'tsconfig.json'), {}, { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} })!;
const program = ts.createProgram(cfg.fileNames, cfg.options);
const checker = program.getTypeChecker();
const rel = (f: string): string => path.relative(ROOT, f).split(path.sep).join('/');
const aliased = (s: ts.Symbol | undefined): ts.Symbol | undefined => (s && s.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(s) : s);
/** Whether a node's type is the slice's table. */
const isTable = (n: ts.Node, slice: Slice): boolean => TABLE[slice].test(checker.typeToString(checker.getTypeAtLocation(n), undefined, ts.TypeFormatFlags.NoTruncation));

/** Each function's symbol: what it takes, or how many arguments it takes now. */
const takes = new Map<ts.Symbol, { slice: Slice; had: number; key: string }>();
const trims = new Map<ts.Symbol, { most: number; key: string }>();
const symbols = (file: string, names: Record<string, unknown>, each: (sym: ts.Symbol, name: string) => void): void => {
  const sf = program.getSourceFile(path.join(ROOT, file));
  if (!sf) throw new Error(`no ${file}`);
  for (const st of sf.statements) {
    const ids: ts.Identifier[] = [];
    if (ts.isFunctionDeclaration(st) && st.name) ids.push(st.name);
    if (ts.isVariableStatement(st)) for (const d of st.declarationList.declarations) if (ts.isIdentifier(d.name)) ids.push(d.name);
    for (const id of ids) {
      const sym = names[id.text] !== undefined ? checker.getSymbolAtLocation(id) : undefined;
      if (sym) each(sym, id.text);
    }
  }
};
for (const [file, names] of Object.entries(TAKE)) symbols(file, names, (sym, name) => takes.set(sym, { ...names[name], key: `${file}#${name}` }));
for (const [file, names] of Object.entries(TRIMMED)) symbols(file, names, (sym, name) => trims.set(sym, { most: names[name], key: `${file}#${name}` }));
if (takes.size !== 9 || trims.size !== 2) throw new Error(`found ${takes.size} of the 9 and ${trims.size} of the 2`);

/** The table a node's place holds: its function's own, or its world's, game's or fight's; null at the top. */
function placed(n: ts.Node, slice: Slice): string | null | 'refused' {
  const tail = slice === 'guilds' ? '.guilds' : '';
  for (let p: ts.Node | undefined = n.parent; p; p = p.parent) {
    if (ts.isPropertyDeclaration(p) && held(p)) return `this.tables${tail}`;
    if (!ts.isFunctionLike(p)) continue;
    for (const prm of p.parameters) {
      if (!ts.isIdentifier(prm.name)) continue;
      const t = prm.type?.getText() ?? '';
      if (prm.name.text === 'tables' && t === 'Tables') return `tables${tail}`;
      if (prm.name.text === 'guilds' && t === "Tables['guilds']") return slice === 'guilds' ? 'guilds' : 'refused';
      if (/^(World|Game|CombatState)$/.test(t) || (/^Pick<(World|Game|CombatState),/.test(t) && t.includes("'tables'"))) return `${prm.name.text}.tables${tail}`;
    }
    if ((ts.isMethodDeclaration(p) || ts.isConstructorDeclaration(p) || ts.isGetAccessorDeclaration(p)) && held(p)) return `this.tables${tail}`;
  }
  return null;
}
/** Whether a node runs in the smoke's page (`page.evaluate(…)`), where only the page's game is to hand. */
const inPage = (n: ts.Node): boolean => { for (let p = n.parent; p; p = p.parent) if (ts.isCallExpression(p) && /\.evaluate$/.test(p.expression.getText())) return true; return false; };
/** Whether a member is the world's or the game's, which holds `this.tables`. */
function held(p: ts.Node): boolean {
  const cls = p.parent;
  return ts.isClassDeclaration(cls) && /^(World|Game)$/.test(cls.name?.text ?? '') && rel(cls.getSourceFile().fileName).startsWith('src/game/');
}

type Edit = { at: number; text: string };
const edits = new Map<string, Edit[]>(), need = new Map<string, Set<string>>(), refused: string[] = [];
const counts: Record<string, number> = {}, byFunction: Record<string, number> = {}, byFile = new Map<string, number>();
const edit = (file: string, e: Edit): void => { (edits.get(file) ?? edits.set(file, []).get(file)!).push(e); };
const needs = (file: string, what: string): void => { (need.get(file) ?? need.set(file, new Set()).get(file)!).add(what); };
const where = (n: ts.Node): string => { const sf = n.getSourceFile(), { line } = sf.getLineAndCharacterOfPosition(n.getStart()); return `${rel(sf.fileName)}:${line + 1}`; };
const bucket = (f: string): string => f.startsWith('src/game/pilot/') ? 'the pilot' : f.startsWith('src/game/') ? 'src/game' : f.startsWith('src/ui/') ? 'src/ui' : /walkthrough\.ts$/.test(f) ? 'the walkthroughs' : f.startsWith('tools/tests/') ? 'the suites' : f.startsWith('tools/') ? 'the tools' : 'src';

for (const sf of program.getSourceFiles()) {
  const file = rel(sf.fileName);
  if (file.startsWith('..') || file.startsWith('node_modules/') || file.startsWith('src/lib/') || file === 'tools/passin.ts' || sf.isDeclarationFile) continue;
  const inGame = file.startsWith('src/game/'), top = HARNESS_FILES.includes(file) ? 'HARNESS' : 'TABLES';
  const visit = (n: ts.Node): void => {
    if (ts.isCallExpression(n)) {
      const callee = ts.isPropertyAccessExpression(n.expression) ? n.expression.name : n.expression;
      const sym = ts.isIdentifier(callee) ? aliased(checker.getSymbolAtLocation(callee)) : undefined;
      const t = sym && takes.get(sym), trim = sym && trims.get(sym);
      if (trim && n.arguments.length > trim.most) refused.push(`${where(n)}: ${trim.key} handed its own quests`);
      if (t && !(n.arguments[0] && isTable(n.arguments[0], t.slice))) {
        let at = placed(n, t.slice);
        if (n.arguments.length > t.had) refused.push(`${where(n)}: ${t.key} handed its own quests`);
        else if (inPage(n)) refused.push(`${where(n)}: ${t.key} called in the page, where content's tables are not to hand`);
        else if (at === 'refused') refused.push(`${where(n)}: ${t.key} wants the ${t.slice} where the guilds alone are held`);
        else {
          if (!at && (inGame || file.startsWith('src/ui/'))) refused.push(`${where(n)}: ${t.key} called where no table is held`);
          else if (!at) { at = t.slice === 'guilds' ? `${top}.guilds` : top; if (file !== KIT_COMPANY) needs(file, top); }
          if (at) {
            edit(file, { at: n.arguments.length ? n.arguments[0].getStart() : n.arguments.pos, text: `${at}${n.arguments.length ? ', ' : ''}` });
            counts[bucket(file)] = (counts[bucket(file)] ?? 0) + 1;
            byFunction[t.key.split('#')[1]] = (byFunction[t.key.split('#')[1]] ?? 0) + 1;
            byFile.set(file, (byFile.get(file) ?? 0) + 1);
          }
        }
      }
    } else if (ts.isIdentifier(n) && !ts.isImportSpecifier(n.parent) && !ts.isExportSpecifier(n.parent) && !(ts.isCallExpression(n.parent) && n.parent.expression === n)
      && !(ts.isFunctionDeclaration(n.parent) || ts.isVariableDeclaration(n.parent))
      && !ts.isPropertyAccessExpression(n.parent) && !ts.isTypeQueryNode(n.parent) && !ts.isTypeReferenceNode(n.parent)) {
      // A function handed to another as a value: listed for a hand.
      const t = takes.get(aliased(checker.getSymbolAtLocation(n))!);
      if (t) refused.push(`${where(n)}: ${t.key} passed as a value`);
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
}

/** The imports each file now needs: content's tables, or the harness's. */
for (const [file, names] of need) {
  const sf = program.getSourceFile(path.join(ROOT, file))!;
  const imports = sf.statements.filter(ts.isImportDeclaration);
  const after = imports.length ? imports[imports.length - 1].end : 0;
  for (const value of names) {
    let spec = path.relative(path.dirname(file), value === 'TABLES' ? CONTENT : KIT_COMPANY).split(path.sep).join('/');
    if (!spec.startsWith('.')) spec = './' + spec;
    const from = imports.find((d) => (d.moduleSpecifier as ts.StringLiteral).text === spec && d.importClause && !d.importClause.isTypeOnly && d.importClause.namedBindings && ts.isNamedImports(d.importClause.namedBindings));
    if (from && (from.importClause!.namedBindings as ts.NamedImports).elements.some((e) => e.name.text === value)) continue;
    if (from) { const els = (from.importClause!.namedBindings as ts.NamedImports).elements; edit(file, { at: els[els.length - 1].end, text: `, ${value}` }); }
    else edit(file, { at: after, text: `\nimport { ${value} } from '${spec}';` });
  }
}

for (const [file, list] of edits) {
  let text = readFileSync(path.join(ROOT, file), 'utf8');
  for (const e of list.sort((a, b) => b.at - a.at)) text = text.slice(0, e.at) + e.text + text.slice(e.at);
  if (!DRY) writeFileSync(path.join(ROOT, file), text);
}
const calls = Object.values(counts).reduce((a, b) => a + b, 0);
if (!edits.size && !refused.length) console.log('Nothing left to move.');
else {
  console.log(`${DRY ? 'Would hand' : 'Handed'} the tables to ${calls} calls in ${byFile.size} files${calls ? ': ' + Object.entries(counts).map(([b, c]) => `${b} ${c}`).join(', ') : ''}.`);
  if (calls) console.log(`  by function: ${Object.entries(byFunction).sort((a, b) => b[1] - a[1]).map(([f, c]) => `${f} ${c}`).join(', ')}`);
  if (process.argv.includes('--files')) for (const [f, c] of [...byFile].sort()) console.log(`  ${f} ${c}`);
  for (const r of refused) console.log(`  by hand: ${r}`);
}
