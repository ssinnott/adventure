// A one-off for #973, deleted once it has run: hands the tables in. Each function of src/game that reads
// the items, itself or through a call, takes them first (`item(items, id)`), or all the tables where it
// reads two or more by #976's end or hands them on (`defaultParty(tables, rng)`); `new World(`,
// `new Game(` and `startCombat(` take the tables first. It writes the parameter into each function and
// the table into each call: the caller's own (`items`, `tables`), its world's, game's or fight's
// (`w.tables`, `this.tables`, `s.tables`), else, in the tools, the suites and the walkthroughs, content's
// (`TABLES`) or the harness's (`HARNESS`), imported. A call whose first argument is a table already is
// left; so it can run again (main merged in) and say what is left to move. What it cannot place it
// lists, for a hand. Usage: node tools/passin.ts [--dry]
import ts from 'typescript';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DRY = process.argv.includes('--dry');
type Slice = 'items' | 'tables';

/** The functions that take a table first, by module, and which: the items, or all the tables. */
const TAKE: Record<string, Record<string, Slice>> = {
  'src/game/items.ts': { item: 'items', chargesLeft: 'items', priceIn: 'items', sellPrice: 'items', buy: 'items' },
  'src/game/skills.ts': { skilled: 'items' },
  'src/game/party.ts': {
    createCharacter: 'tables', defaultParty: 'tables', randomParty: 'tables', equip: 'items', armorClass: 'items', weaponOf: 'items',
    attackBonus: 'items', immuneTo: 'items', borne: 'items', resists: 'items', statOf: 'items', addCondition: 'items', passClock: 'items',
    lift: 'items', damage: 'items', spellHeal: 'items',
  },
  'src/game/people.ts': { readText: 'items', answerNote: 'items', answer: 'items' },
  'src/game/inscriptions.ts': { readerOf: 'items', signSays: 'items' },
  'src/game/combat.ts': { blowsOf: 'items', canAttackFromRow: 'items', castOnParty: 'items', castOnAlly: 'items', struck: 'items' },
  'src/game/wilds.ts': { give: 'items' },
  'src/game/dens.ts': { hoardLine: 'items' },
  'src/game/guilds.ts': { payOut: 'items', report: 'tables', take: 'tables' },
  'src/game/bot.ts': { draughts: 'items' },
  // The pilot's and the screens' helpers that hold no game: the items, from the caller's `g.tables`.
  'src/game/pilot/keep.ts': { better: 'items', shops: 'items', spots: 'items', shop: 'items' },
  'src/ui/screens.ts': { statText: 'items', weaponLine: 'items', slotLine: 'items', artifactLines: 'items', sheetRows: 'items' },
  'src/ui/combat.ts': { castable: 'items', castRows: 'items' },
  'src/ui/frame.ts': { drawPartyCards: 'items' },
};
/** The carriers, written by hand: only their calls are the script's. */
const CARRY: Record<string, string[]> = { 'src/game/combat.ts': ['startCombat'], 'src/game/world.ts': ['World'], 'src/game/game.ts': ['Game'] };
/** The files that hand src/game the harness's tables (tools/kit/company.ts), which hold the copies `forge` makes. */
const HARNESS_FILES = ['tools/kit/company.ts', 'tools/kit/fight.ts', 'tools/kit/harness.ts', 'tools/harness.ts', 'tools/gate.ts', 'tools/tests/gate.ts', 'tools/tests/harness.ts'];
const CONTENT = 'src/content/index.ts', KIT_COMPANY = 'tools/kit/company.ts';

const cfg = ts.getParsedCommandLineOfConfigFile(path.join(ROOT, 'tsconfig.json'), {}, { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} })!;
const program = ts.createProgram(cfg.fileNames, cfg.options);
const checker = program.getTypeChecker();
const rel = (f: string): string => path.relative(ROOT, f).split(path.sep).join('/');
const aliased = (s: ts.Symbol | undefined): ts.Symbol | undefined => (s && s.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(s) : s);

/** Each taking function's and carrier's declaration, by its symbol. */
const takes = new Map<ts.Symbol, { slice: Slice; carrier: boolean; key: string }>();
const decls = new Map<ts.Node, Slice>();
for (const [file, names, carrier] of [...Object.entries(TAKE).map(([f, n]) => [f, n, false] as const), ...Object.entries(CARRY).map(([f, n]) => [f, Object.fromEntries(n.map((x) => [x, 'tables' as Slice])), true] as const)]) {
  const sf = program.getSourceFile(path.join(ROOT, file));
  if (!sf) throw new Error(`no ${file}`);
  for (const st of sf.statements) {
    const found: [ts.Identifier, ts.Node][] = [];
    if ((ts.isFunctionDeclaration(st) || ts.isClassDeclaration(st)) && st.name) found.push([st.name, st]);
    if (ts.isVariableStatement(st)) for (const d of st.declarationList.declarations) if (ts.isIdentifier(d.name) && d.initializer) found.push([d.name, d.initializer]);
    for (const [id, node] of found) {
      const slice = (names as Record<string, Slice>)[id.text];
      if (!slice) continue;
      const sym = checker.getSymbolAtLocation(id);
      if (sym) takes.set(sym, { slice, carrier, key: `${file}#${id.text}` });
      if (!carrier) decls.set(node, slice);
    }
  }
}

/** The table a node's place holds: its function's own, its world's, game's or fight's; null at the top. */
function placed(n: ts.Node, slice: Slice): string | null | 'refused' {
  const tail = slice === 'items' ? '.items' : '';
  for (let p: ts.Node | undefined = n.parent; p; p = p.parent) {
    if (!ts.isFunctionLike(p)) continue;
    const own = decls.get(p);
    if (own) return own === 'tables' ? `tables${tail}` : slice === 'items' ? 'items' : 'refused';
    for (const prm of p.parameters) {
      if (!ts.isIdentifier(prm.name)) continue;
      const t = prm.type?.getText() ?? '';
      if (prm.name.text === 'tables' && t === 'Tables') return `tables${tail}`;
      if (prm.name.text === 'items' && /^(Items|Readonly<Record<string, ItemDef>>)$/.test(t)) return slice === 'items' ? 'items' : 'refused';
      if (/^(World|Game|CombatState)$/.test(t)) return `${prm.name.text}.tables${tail}`;
    }
    const cls = p.parent;
    if ((ts.isMethodDeclaration(p) || ts.isConstructorDeclaration(p) || ts.isGetAccessorDeclaration(p) || ts.isPropertyDeclaration(p)) && ts.isClassDeclaration(cls) && /^(World|Game)$/.test(cls.name?.text ?? '') && rel(cls.getSourceFile().fileName).startsWith('src/game/')) return `this.tables${tail}`;
  }
  return null;
}

/** Whether a call's first argument is a table already. */
function handed(arg: ts.Expression | undefined): boolean {
  if (!arg) return false;
  if (/^(TABLES|HARNESS|tables|items)(\.items)?$|\.tables(\.items)?$/.test(arg.getText())) return true;
  const t = checker.typeToString(checker.getTypeAtLocation(arg));
  return /^(Tables|Items|Readonly<Record<string, ItemDef>>|Record<string, ItemDef>)$/.test(t);
}

type Edit = { at: number; text: string; del?: number };
const edits = new Map<string, Edit[]>(), need = new Map<string, Set<string>>(), refused: string[] = [], counts: Record<string, number> = {};
const edit = (file: string, e: Edit): void => { (edits.get(file) ?? edits.set(file, []).get(file)!).push(e); };
const where = (n: ts.Node): string => { const sf = n.getSourceFile(), { line } = sf.getLineAndCharacterOfPosition(n.getStart()); return `${rel(sf.fileName)}:${line + 1}`; };
const bucket = (f: string): string => f.startsWith('src/game/pilot/') ? 'the pilot' : f.startsWith('src/game/') ? 'src/game' : f.startsWith('src/ui/') ? 'src/ui' : /walkthrough\.ts$/.test(f) ? 'the walkthroughs' : f.startsWith('tools/tests/') ? 'the suites' : f.startsWith('tools/') ? 'the tools' : 'src';

for (const sf of program.getSourceFiles()) {
  const file = rel(sf.fileName);
  if (file.startsWith('..') || file.startsWith('node_modules/') || file.startsWith('src/lib/') || file === 'tools/passin.ts' || sf.isDeclarationFile) continue;
  const inGame = file.startsWith('src/game/'), top = file === KIT_COMPANY ? 'HARNESS' : HARNESS_FILES.includes(file) ? 'HARNESS' : 'TABLES';
  const visit = (n: ts.Node): void => {
    // A declaration that takes a table: its parameter.
    const slice = decls.get(n);
    if (slice && ts.isFunctionLike(n)) {
      const first = n.parameters[0];
      if (!(first && ts.isIdentifier(first.name) && (first.name.text === 'items' || first.name.text === 'tables'))) {
        edit(file, { at: first ? first.getStart() : n.parameters.pos, text: `${slice}: ${slice === 'items' ? 'Items' : 'Tables'}${first ? ', ' : ''}` });
        (need.get(file) ?? need.set(file, new Set()).get(file)!).add(slice === 'items' ? 'type Items' : 'type Tables');
      }
    }
    // content's items read in src/game: its place's table.
    if (inGame && !file.startsWith('src/game/pilot/') && ts.isIdentifier(n) && n.text === 'ITEMS' && !ts.isImportSpecifier(n.parent)) {
      const s = aliased(checker.getSymbolAtLocation(n));
      if (s && rel(s.declarations![0].getSourceFile().fileName) === CONTENT) {
        const at = placed(n, 'items');
        if (!at || at === 'refused') refused.push(`${where(n)}: ITEMS read where no table is held`);
        else edit(file, { at: n.getStart(), del: n.getWidth(), text: at });
      }
    }
    // A call: its table.
    if ((ts.isCallExpression(n) || ts.isNewExpression(n))) {
      const callee = ts.isPropertyAccessExpression(n.expression) ? n.expression.name : n.expression;
      const t = ts.isIdentifier(callee) ? takes.get(aliased(checker.getSymbolAtLocation(callee))!) : undefined;
      const args = n.arguments ?? ts.factory.createNodeArray();
      if (t && !handed(args[0])) {
        let at = placed(n, t.slice);
        if (at === 'refused') refused.push(`${where(n)}: ${t.key} wants the tables where only the items are held`);
        else {
          if (!at && (inGame || file.startsWith('src/ui/'))) { refused.push(`${where(n)}: ${t.key} called where no table is held`); at = null; }
          else if (!at) { at = top + (t.slice === 'items' ? '.items' : ''); if (file !== KIT_COMPANY) (need.get(file) ?? need.set(file, new Set()).get(file)!).add(top); }
          if (at) {
            edit(file, { at: args.length ? args[0].getStart() : n.arguments ? n.arguments.pos : n.end, text: `${n.arguments ? '' : '('}${at}${args.length ? ', ' : ''}${n.arguments ? '' : ')'}` });
            const b = bucket(file);
            counts[b] = (counts[b] ?? 0) + 1;
          }
        }
      }
    } else if (ts.isIdentifier(n) && !ts.isImportSpecifier(n.parent) && !(ts.isCallExpression(n.parent) && n.parent.expression === n) && !(ts.isNewExpression(n.parent) && n.parent.expression === n)
      && !ts.isPropertyAccessExpression(n.parent) && !(ts.isFunctionDeclaration(n.parent) || ts.isClassDeclaration(n.parent) || ts.isVariableDeclaration(n.parent)) && !ts.isExportSpecifier(n.parent) && !ts.isTypeQueryNode(n.parent) && !ts.isTypeReferenceNode(n.parent) && !ts.isExpressionWithTypeArguments(n.parent)
      && !(ts.isBinaryExpression(n.parent) && n.parent.operatorToken.kind === ts.SyntaxKind.InstanceOfKeyword)) {
      const t = takes.get(aliased(checker.getSymbolAtLocation(n))!);
      if (t) refused.push(`${where(n)}: ${t.key} passed as a value`);
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
}

/** The imports each file now needs: the types in src/game, the tables elsewhere. */
for (const [file, names] of need) {
  const sf = program.getSourceFile(path.join(ROOT, file))!;
  const imports = sf.statements.filter(ts.isImportDeclaration);
  const after = imports.length ? imports[imports.length - 1].end : 0;
  const types = [...names].filter((x) => x.startsWith('type ')).map((x) => x.slice(5));
  if (types.length) {
    let spec = path.relative(path.dirname(file), 'src/game/tables.ts').split(path.sep).join('/');
    if (!spec.startsWith('.')) spec = './' + spec;
    const have = imports.find((d) => (d.moduleSpecifier as ts.StringLiteral).text === spec);
    const missing = types.filter((x) => !have?.getText().includes(x));
    if (missing.length) edit(file, { at: after, text: `\nimport type { ${missing.sort().join(', ')} } from '${spec}';` });
  }
  for (const value of [...names].filter((x) => !x.startsWith('type '))) {
    const target = value === 'TABLES' ? CONTENT : KIT_COMPANY;
    let spec = path.relative(path.dirname(file), target).split(path.sep).join('/');
    if (!spec.startsWith('.')) spec = './' + spec;
    const from = imports.find((d) => (d.moduleSpecifier as ts.StringLiteral).text === spec && d.importClause && !d.importClause.isTypeOnly && d.importClause.namedBindings && ts.isNamedImports(d.importClause.namedBindings));
    if (from && (from.importClause!.namedBindings as ts.NamedImports).elements.some((e) => e.name.text === value)) continue;
    if (from) { const els = (from.importClause!.namedBindings as ts.NamedImports).elements; edit(file, { at: els[els.length - 1].end, text: `, ${value}` }); }
    else edit(file, { at: after, text: `\nimport { ${value} } from '${spec}';` });
  }
}

let n = 0;
for (const [file, list] of edits) {
  let text = readFileSync(path.join(ROOT, file), 'utf8');
  for (const e of list.sort((a, b) => b.at - a.at || (a.del ? 1 : -1))) text = text.slice(0, e.at) + e.text + text.slice(e.at + (e.del ?? 0));
  // content's items, no longer read in src/game, leave its import.
  if (file.startsWith('src/game/') && !/\bITEMS\b/.test(text.replace(/^import .*$/gm, '').replace(/\/\/.*$|\/\*[\s\S]*?\*\//gm, ''))) {
    text = text.replace(/^import \{ ITEMS \} from '\.\.\/content\/index\.ts';\n/m, '').replace(/^(import \{[^}]*?)(?:, ITEMS\b|\bITEMS, )([^}]*\} from '\.\.\/content\/index\.ts';)$/m, '$1$2');
  }
  n += list.length;
  if (!DRY) writeFileSync(path.join(ROOT, file), text);
}
const calls = Object.values(counts).reduce((a, b) => a + b, 0);
if (!n && !refused.length) console.log('Nothing left to move.');
else {
  console.log(`${DRY ? 'Would hand' : 'Handed'} the tables to ${calls} calls in ${edits.size} files${calls ? ': ' + Object.entries(counts).map(([b, c]) => `${b} ${c}`).join(', ') : ''}.`);
  for (const r of refused) console.log(`  by hand: ${r}`);
}
