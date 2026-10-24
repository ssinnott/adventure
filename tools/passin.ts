// A one-off for #974, deleted once it has run: hands the monsters and the spells in, as #973's handed the
// items. Each function that reads the monster or the spell table, itself or through a call, and holds no
// table takes the one it reads first (`monster(monsters, id)`, `spell(spells, id)`). It writes the
// parameter into each such function and the slice into each call: the caller's own (`monsters`,
// `spells`, `tables.spells`), its world's, game's or fight's (`w.tables.spells`, `this.tables.monsters`,
// `s.tables.monsters`), else, in the tools, the suites and the walkthroughs, content's (`TABLES.spells`) or
// the harness's (`HARNESS.spells`), imported. A call whose first argument is the table already is left;
// so it can run again (main merged in) and say what is left to move. What it cannot place it lists, for
// a hand. Usage: node tools/passin.ts [--dry]
import ts from 'typescript';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DRY = process.argv.includes('--dry');
type Slice = 'monsters' | 'spells';

/** The functions that take a slice first, by module, and which. */
const TAKE: Record<string, Record<string, Slice>> = {
  'src/game/monsters.ts': { monster: 'monsters', monsterSpells: 'spells' },
  'src/game/spells.ts': { spell: 'spells', spellsFor: 'spells' },
  'src/game/party.ts': { levelUp: 'spells' },
  'src/game/bot.ts': { wakeWith: 'spells' },
  'src/game/combat.ts': { calledBy: 'monsters' },
  'src/game/services.ts': { hallOffers: 'spells', learnSpell: 'spells', train: 'spells' },
  'src/game/pilot/keep.ts': { mendable: 'spells' },
  // The screens' helpers that hold no game and read the spells alone: from the caller's `g.tables`.
  'src/ui/screens.ts': { power: 'spells', spellsLine: 'spells' },
};
/** The files that hand src/game the harness's tables (tools/kit/company.ts). */
const HARNESS_FILES = ['tools/kit/company.ts', 'tools/kit/fight.ts', 'tools/kit/harness.ts', 'tools/harness.ts', 'tools/tests/gate.ts', 'tools/tests/harness.ts'];
const CONTENT = 'src/content/index.ts', KIT_COMPANY = 'tools/kit/company.ts';
const TABLE: Record<Slice, { content: string; def: RegExp }> = {
  monsters: { content: 'MONSTERS', def: /Record<string, MonsterDef>|\[\w+: string\]: MonsterDef;/ },
  spells: { content: 'SPELLS', def: /Record<string, SpellDef>|\[\w+: string\]: SpellDef;/ },
};

const cfg = ts.getParsedCommandLineOfConfigFile(path.join(ROOT, 'tsconfig.json'), {}, { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} })!;
const program = ts.createProgram(cfg.fileNames, cfg.options);
const checker = program.getTypeChecker();
const rel = (f: string): string => path.relative(ROOT, f).split(path.sep).join('/');
const aliased = (s: ts.Symbol | undefined): ts.Symbol | undefined => (s && s.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(s) : s);
/** Whether a node's type is the slice's table. */
const isTable = (n: ts.Node, slice: Slice): boolean => TABLE[slice].def.test(checker.typeToString(checker.getTypeAtLocation(n), undefined, ts.TypeFormatFlags.NoTruncation));

/** Each taking function's declaration, by its symbol. */
const takes = new Map<ts.Symbol, { slice: Slice; key: string }>();
const decls = new Map<ts.Node, Slice>();
for (const [file, names] of Object.entries(TAKE)) {
  const sf = program.getSourceFile(path.join(ROOT, file));
  if (!sf) throw new Error(`no ${file}`);
  for (const st of sf.statements) {
    const found: [ts.Identifier, ts.Node][] = [];
    if (ts.isFunctionDeclaration(st) && st.name) found.push([st.name, st]);
    if (ts.isVariableStatement(st)) for (const d of st.declarationList.declarations) if (ts.isIdentifier(d.name) && d.initializer) found.push([d.name, d.initializer]);
    for (const [id, node] of found) {
      const slice = names[id.text];
      if (!slice) continue;
      const sym = checker.getSymbolAtLocation(id);
      if (sym) takes.set(sym, { slice, key: `${file}#${id.text}` });
      decls.set(node, slice);
    }
  }
}

/** The slice a node's place holds: its function's own, its tables, its world's, game's or fight's; null at the top. */
function placed(n: ts.Node, slice: Slice): string | null | 'refused' {
  for (let p: ts.Node | undefined = n.parent; p; p = p.parent) {
    if (ts.isPropertyDeclaration(p) && held(p)) return `this.tables.${slice}`;
    if (!ts.isFunctionLike(p)) continue;
    const own = decls.get(p);
    if (own) return own === slice ? slice : 'refused';
    for (const prm of p.parameters) {
      if (!ts.isIdentifier(prm.name)) continue;
      const t = prm.type?.getText() ?? '';
      if (prm.name.text === 'tables' && t === 'Tables') return `tables.${slice}`;
      if ((prm.name.text === 'monsters' || prm.name.text === 'spells') && isTable(prm, prm.name.text)) return prm.name.text === slice ? slice : 'refused';
      if (/^(World|Game|CombatState)$/.test(t) || (/^Pick<(World|Game|CombatState),/.test(t) && t.includes("'tables'"))) return `${prm.name.text}.tables.${slice}`;
    }
    if ((ts.isMethodDeclaration(p) || ts.isConstructorDeclaration(p) || ts.isGetAccessorDeclaration(p)) && held(p)) return `this.tables.${slice}`;
  }
  return null;
}
/** Whether a member is the world's or the game's, which holds `this.tables`. */
function held(p: ts.Node): boolean {
  const cls = p.parent;
  return ts.isClassDeclaration(cls) && /^(World|Game)$/.test(cls.name?.text ?? '') && rel(cls.getSourceFile().fileName).startsWith('src/game/');
}

type Edit = { at: number; text: string; del?: number };
const edits = new Map<string, Edit[]>(), need = new Map<string, Set<string>>(), refused: string[] = [], counts: Record<string, number> = {};
const edit = (file: string, e: Edit): void => { (edits.get(file) ?? edits.set(file, []).get(file)!).push(e); };
const needs = (file: string, what: string): void => { (need.get(file) ?? need.set(file, new Set()).get(file)!).add(what); };
const where = (n: ts.Node): string => { const sf = n.getSourceFile(), { line } = sf.getLineAndCharacterOfPosition(n.getStart()); return `${rel(sf.fileName)}:${line + 1}`; };
const bucket = (f: string): string => f.startsWith('src/game/pilot/') ? 'the pilot' : f.startsWith('src/game/') ? 'src/game' : f.startsWith('src/ui/') ? 'src/ui' : /walkthrough\.ts$/.test(f) ? 'the walkthroughs' : f.startsWith('tools/tests/') ? 'the suites' : f.startsWith('tools/') ? 'the tools' : 'src';

for (const sf of program.getSourceFiles()) {
  const file = rel(sf.fileName);
  if (file.startsWith('..') || file.startsWith('node_modules/') || file.startsWith('src/lib/') || file === 'tools/passin.ts' || sf.isDeclarationFile) continue;
  const inGame = file.startsWith('src/game/'), top = HARNESS_FILES.includes(file) ? 'HARNESS' : 'TABLES';
  const visit = (n: ts.Node): void => {
    // A declaration that takes a slice: its parameter.
    const slice = decls.get(n);
    if (slice && ts.isFunctionLike(n)) {
      const first = n.parameters[0];
      if (!(first && ts.isIdentifier(first.name) && first.name.text === slice)) {
        edit(file, { at: first ? first.getStart() : n.parameters.pos, text: `${slice}: Tables['${slice}']${first ? ', ' : ''}` });
        needs(file, 'type Tables');
      }
    }
    // content's monsters or spells read in src/game: its place's slice.
    if (inGame && !file.startsWith('src/game/pilot/') && ts.isIdentifier(n) && (n.text === 'MONSTERS' || n.text === 'SPELLS') && !ts.isImportSpecifier(n.parent)) {
      const s = aliased(checker.getSymbolAtLocation(n));
      if (s && rel(s.declarations![0].getSourceFile().fileName) === CONTENT) {
        const at = placed(n, n.text === 'MONSTERS' ? 'monsters' : 'spells');
        if (!at || at === 'refused') refused.push(`${where(n)}: ${n.text} read where no table is held`);
        else edit(file, { at: n.getStart(), del: n.getWidth(), text: at });
      }
    }
    // A call: its slice.
    if (ts.isCallExpression(n)) {
      const callee = ts.isPropertyAccessExpression(n.expression) ? n.expression.name : n.expression;
      const t = ts.isIdentifier(callee) ? takes.get(aliased(checker.getSymbolAtLocation(callee))!) : undefined;
      if (t && !(n.arguments[0] && isTable(n.arguments[0], t.slice))) {
        let at = placed(n, t.slice);
        if (at === 'refused') refused.push(`${where(n)}: ${t.key} wants the ${t.slice} where another slice is held`);
        else {
          if (!at && (inGame || file.startsWith('src/ui/'))) { refused.push(`${where(n)}: ${t.key} called where no table is held`); at = null; }
          else if (!at) { at = `${top}.${t.slice}`; if (file !== KIT_COMPANY) needs(file, top); }
          if (at) {
            edit(file, { at: n.arguments.length ? n.arguments[0].getStart() : n.arguments.pos, text: `${at}${n.arguments.length ? ', ' : ''}` });
            const b = bucket(file);
            counts[b] = (counts[b] ?? 0) + 1;
          }
        }
      }
    } else if (ts.isIdentifier(n) && !ts.isImportSpecifier(n.parent) && !(ts.isCallExpression(n.parent) && n.parent.expression === n)
      && !ts.isPropertyAccessExpression(n.parent) && !(ts.isFunctionDeclaration(n.parent) || ts.isVariableDeclaration(n.parent)) && !ts.isExportSpecifier(n.parent) && !ts.isTypeQueryNode(n.parent) && !ts.isTypeReferenceNode(n.parent)) {
      const t = takes.get(aliased(checker.getSymbolAtLocation(n))!);
      // A function handed to another as a value (`c.spells.map(spell)`): the call it makes, with its slice.
      let at = t && ts.isCallExpression(n.parent) && n.parent.arguments.includes(n as ts.Expression) ? placed(n, t.slice) : 'refused';
      if (t && !at && !(inGame || file.startsWith('src/ui/'))) { at = `${top}.${t.slice}`; if (file !== KIT_COMPANY) needs(file, top); }
      if (t && (!at || at === 'refused')) refused.push(`${where(n)}: ${t.key} passed as a value`);
      else if (t && at) {
        edit(file, { at: n.getStart(), del: n.getWidth(), text: `(id) => ${n.text}(${at}, id)` });
        counts[bucket(file)] = (counts[bucket(file)] ?? 0) + 1;
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
}

/** The imports each file now needs: the type in src/game and src/ui, the tables elsewhere. */
for (const [file, names] of need) {
  const sf = program.getSourceFile(path.join(ROOT, file))!;
  const imports = sf.statements.filter(ts.isImportDeclaration);
  const after = imports.length ? imports[imports.length - 1].end : 0;
  if (names.has('type Tables')) {
    let spec = path.relative(path.dirname(file), 'src/game/tables.ts').split(path.sep).join('/');
    if (!spec.startsWith('.')) spec = './' + spec;
    const have = imports.find((d) => (d.moduleSpecifier as ts.StringLiteral).text === spec);
    if (!have) edit(file, { at: after, text: `\nimport type { Tables } from '${spec}';` });
    else if (!/\bTables\b/.test(have.getText())) {
      const els = (have.importClause!.namedBindings as ts.NamedImports).elements;
      edit(file, { at: els[els.length - 1].end, text: have.importClause!.isTypeOnly ? ', Tables' : ', type Tables' });
    }
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
  // content's monsters and spells, no longer read in src/game, leave its import.
  if (file.startsWith('src/game/')) for (const name of ['MONSTERS', 'SPELLS']) {
    if (new RegExp(`\\b${name}\\b`).test(text.replace(/^import .*$/gm, '').replace(/\/\/.*$|\/\*[\s\S]*?\*\//gm, ''))) continue;
    text = text.replace(new RegExp(`^import \\{ ${name} \\} from '\\.\\./content/index\\.ts';\\n`, 'm'), '')
      .replace(new RegExp(`^(import \\{[^}]*?)(?:, ${name}\\b|\\b${name}, )([^}]*\\} from '\\.\\./content/index\\.ts';)$`, 'm'), '$1$2');
  }
  n += list.length;
  if (!DRY) writeFileSync(path.join(ROOT, file), text);
}
const calls = Object.values(counts).reduce((a, b) => a + b, 0);
if (!n && !refused.length) console.log('Nothing left to move.');
else {
  console.log(`${DRY ? 'Would hand' : 'Handed'} the monsters and the spells to ${calls} calls in ${edits.size} files${calls ? ': ' + Object.entries(counts).map(([b, c]) => `${b} ${c}`).join(', ') : ''}.`);
  for (const r of refused) console.log(`  by hand: ${r}`);
}
