// The runtime import graph of src/ and tools/ (#900; moved here from tools/tests/layers.ts by #955, as
// it was): each file's imports, read by a small lexer, not the compiler, which takes three seconds to
// parse them. A runtime import is one Node loads as the file loads or runs: an `import` or an
// `export ... from` with a literal path, `import './x.ts'` for its side effects and
// `import('./x.ts')`. `import type`, `export type ... from`, `typeof import('./x.ts')` and
// `import('./x.ts').T` in a type are erased before the file runs and are left out; `import { type A }`
// is not, as Node strips the name and still loads the file. The layers check (tools/tests/layers.ts)
// holds the graph to the layers, and tools/changed.ts reads from it what a diff reaches. The lexer
// keeps the names as well (#972): what a file exports, what it takes by name, in its types too, or
// whole, and what a tool reads off a module it loads in the page, which the exports check
// (tools/tests/unused.ts) holds to an importer or an entry point.
import { readdirSync } from 'node:fs';
import { posix, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

// ---- Reading the imports ----------------------------------------------------------------------

/** An import a file makes as it runs: the path as written, and whether it is an `import()`. */
export interface Spec { path: string; dynamic: boolean }

/**
 * What a file takes of a module, the path as written: the names it imports or exports from it, in
 * its types too (`default` for a default import), or the module whole (`import * as`, `export *`, an
 * `import()` as it runs). `typeof import('./x.ts')` takes nothing by itself; `import('./x.ts').T` takes T.
 */
export interface Named { path: string; names: readonly string[]; whole: boolean }

/**
 * A name a tool reads off a module it loads in the page by a literal path (tools/kit/browser.ts's
 * `load`): `washes` of `V.washes`, after `const V = await load<…>('/src/ui/viewport.ts')`. The path is
 * from the root, its slash off.
 */
export interface Read { path: string; name: string }

const WORD = new Uint8Array(128);
for (let c = 0; c < 128; c++) WORD[c] = /[\w$]/.test(String.fromCharCode(c)) ? 1 : 0;
/** After these words a slash opens a regular expression; after any other word it divides. */
const BEFORE_REGEX = new Set(['return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void', 'throw', 'case', 'do', 'else', 'yield', 'await']);
/** Words that open a statement and no expression: an `export const`'s declarators end at one. */
const STATEMENT = new Set(['export', 'const', 'let', 'var', 'interface', 'type', 'enum', 'declare']);
/** The words before a declaration's name in `export …`, which it may take one after another. */
const DECLARES = new Set(['declare', 'async', 'abstract', 'function', 'class', 'interface', 'enum', 'namespace', 'module']);

/**
 * The imports a file makes as it runs, and how many it makes in types alone, with their paths
 * (`typed`, which the layers check reads for the UI, #1022). Comments, strings, template literals
 * and regular expressions are skipped whole, so an import written inside one is not taken; the
 * import forms are read from the tokens between. With them, the names (#972): what it takes of each
 * module (`named`), what it exports (`exported`: its declarations, each declarator of an `export
 * const`, its `export { … }` lists and its `export … from`, `default` for a default export) and what
 * it reads off a module it loads in the page (`read`).
 */
export function imports(text: string): { runtime: Spec[]; types: number; typed: string[]; named: Named[]; exported: string[]; read: Read[] } {
  const n = text.length;
  let i = 0;
  /** Each open brace, true where a template's `${` opened it. */
  const opened: boolean[] = [];
  // The token: 'w' a word, 's' a string, 't' a template, 'r' a regular expression, 'p' a mark.
  let kind = '', value = '', prevKind = '', prevValue = '', held = false;
  const template = (): void => {
    while (i < n) {
      const c = text.charCodeAt(i);
      if (c === 92) i += 2;
      else if (c === 96) { i++; return; }
      else if (c === 36 && text.charCodeAt(i + 1) === 123) { i += 2; opened.push(true); return; }
      else i++;
    }
  };
  const lex = (): boolean => {
    while (i < n) {
      const c = text.charCodeAt(i);
      if (c <= 32 || c === 160 || c === 0xfeff) { i++; continue; }
      if (c === 47) {
        const d = text.charCodeAt(i + 1);
        if (d === 47) { const e = text.indexOf('\n', i); i = e < 0 ? n : e; continue; }
        if (d === 42) { const e = text.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; continue; }
        if (kind === '' || (kind === 'p' && value !== ')' && value !== ']') || (kind === 'w' && BEFORE_REGEX.has(value))) {
          let inClass = false;
          for (i++; i < n; i++) {
            const e = text.charCodeAt(i);
            if (e === 92) i++;
            else if (e === 10) break;
            else if (e === 91) inClass = true;
            else if (e === 93) inClass = false;
            else if (e === 47 && !inClass) { i++; break; }
          }
          while (i < n && text.charCodeAt(i) < 128 && WORD[text.charCodeAt(i)]) i++;
          kind = 'r'; value = '';
          return true;
        }
      }
      if (c === 39 || c === 34) {
        const s = ++i;
        while (i < n) { const e = text.charCodeAt(i); if (e === 92) i += 2; else if (e === c || e === 10) break; else i++; }
        kind = 's'; value = text.slice(s, i); i++;
        return true;
      }
      if (c === 96) { i++; template(); kind = 't'; value = ''; return true; }
      if (c < 128 && WORD[c]) {
        const s = i;
        while (++i < n && text.charCodeAt(i) < 128 && WORD[text.charCodeAt(i)]);
        kind = 'w'; value = text.slice(s, i);
        return true;
      }
      i++;
      if (c === 123) opened.push(false);
      else if (c === 125 && opened.pop()) { template(); kind = 't'; value = ''; return true; }
      kind = 'p'; value = String.fromCharCode(c);
      return true;
    }
    return false;
  };
  const runtime: Spec[] = [];
  const typed: string[] = [];
  const named: Named[] = [], exported: string[] = [], read: Read[] = [];
  // The two tokens before the one before, for a load: `V = await load`.
  let p2Kind = '', p2Value = '', p3Kind = '', p3Value = '';
  /** Each name a load in the page bound, to its module's path; the name whose load waits for its path; the module a `.` reads off. */
  const bound = new Map<string, string>();
  let loading: string | undefined, member: string | undefined;
  /**
   * The declarators of an `export const` after its first, read as the tokens go by: the brackets and
   * the angle brackets open, whether a comma between declarators came last, and the word after one,
   * a declarator's name if `=`, `:`, `,` or `;` follows.
   */
  let decl: { depth: number; angle: number; comma: boolean; name: string } | undefined;
  /** Each token once, whichever reading takes it: the loads, what is read off them and the declarators. */
  const observe = (): void => {
    if (member !== undefined) { if (kind === 'w') read.push({ path: member, name: value }); member = undefined; }
    else if (kind === 'p' && value === '.' && prevKind === 'w' && bound.has(prevValue)) member = bound.get(prevValue);
    if (kind === 'w' && value === 'load' && prevKind === 'p' && prevValue === '=' && p2Kind === 'w') loading = p2Value;
    else if (kind === 'w' && value === 'load' && prevKind === 'w' && prevValue === 'await' && p2Kind === 'p' && p2Value === '=' && p3Kind === 'w') loading = p3Value;
    else if (loading !== undefined && prevKind === 'p' && prevValue === '(' && (kind === 't' || (kind === 's' && value.startsWith('/')))) {
      if (kind === 's') bound.set(loading, value.slice(1));
      loading = undefined;
    } else if (kind === 'p' && value === ';') loading = undefined;
    if (!decl) return;
    if (kind === 'p') {
      if (value === '(' || value === '[' || value === '{') decl.depth++;
      else if (value === ')' || value === ']' || value === '}') decl.depth--;
      // `<` and `>` open and close a type's arguments, but the `>` of `=>`.
      else if (decl.depth === 0 && value === '<') decl.angle++;
      else if (decl.depth === 0 && value === '>' && text.charCodeAt(i - 2) !== 61) decl.angle = Math.max(0, decl.angle - 1);
    }
    const top = decl.depth === 0 && decl.angle === 0;
    if (decl.name && kind === 'p' && ['=', ':', ',', ';'].includes(value)) exported.push(decl.name);
    if (decl.depth < 0 || (top && kind === 'p' && value === ';') || (top && kind === 'w' && !decl.comma && STATEMENT.has(value))) { decl = undefined; return; }
    decl.name = top && decl.comma && kind === 'w' ? value : '';
    decl.comma = top && kind === 'p' && value === ',';
  };
  const next = (): boolean => {
    if (held) { held = false; return true; }
    p3Kind = p2Kind; p3Value = p2Value; p2Kind = prevKind; p2Value = prevValue;
    prevKind = kind; prevValue = value;
    if (!lex()) return false;
    observe();
    return true;
  };
  // The token as it stands, read through a call: next() changes it, which the compiler cannot see.
  const k = (): string => kind, v = (): string => value;
  const is = (want: string, text: string): boolean => kind === want && value === text;
  /** Reads on to `from '...'` within the statement: the path, or undefined. With `names`, the names an import takes on the way: its default, its `{ … }` and its `* as`, which takes the module whole. */
  const from = (names?: string[]): string | undefined => {
    while (next()) {
      if (is('p', ';')) return undefined;
      if (is('w', 'import') || is('w', 'export')) { held = true; return undefined; }
      if (is('w', 'from')) {
        if (next() && k() === 's') return v();
        held = true;
      } else if (names && is('p', '{')) names.push(...specifiers().map(([name]) => name));
      else if (names && is('p', '*')) names.push('*');
      else if (names && k() === 'w' && v() !== 'as' && !(prevKind === 'w' && prevValue === 'as')) names.push('default');
    }
    return undefined;
  };
  /** A `{ … }` of names, its brace read, through its `}`: each the name it takes and the name it binds (`a as b`), a `type` before it dropped. */
  const specifiers = (): [string, string][] => {
    const out: [string, string][] = [];
    let words: string[] = [];
    const end = (): void => {
      const w = (words.length === 2 || words.length === 4) && words[0] === 'type' ? words.slice(1) : words;
      if (w.length === 1) out.push([w[0], w[0]]);
      else if (w.length === 3 && w[1] === 'as') out.push([w[0], w[2]]);
      words = [];
    };
    while (next() && !is('p', '}')) {
      if (is('p', ',')) end();
      else if (k() === 'w' || k() === 's') words.push(v());
    }
    end();
    return out;
  };
  /** What a statement takes from the module at `path`, `*` among `names` for the module whole. */
  const take = (path: string, names: readonly string[]): void => {
    named.push({ path, names: names.filter((x) => x !== '*'), whole: names.includes('*') });
  };
  while (next()) {
    if ((!is('w', 'import') && !is('w', 'export')) || (prevKind === 'p' && prevValue === '.')) continue;
    const word = v(), before = prevKind === 'w' ? prevValue : '';
    if (!next()) break;
    if (word === 'import') {
      if (is('p', '(')) {
        if (!next()) break;
        // import(p): a path worked out as it runs, which no static read can follow.
        if (k() !== 's') { held = true; continue; }
        const path = v();
        if (!next()) break;
        if (!is('p', ')') && !is('p', ',')) { held = true; continue; }
        let inType = before === 'typeof', name = '';
        if (is('p', ')') && next()) {
          if (is('p', '.') && next() && k() === 'w') {
            name = v();
            inType ||= !['then', 'catch', 'finally'].includes(name);
          }
          held = true;
        }
        if (inType) { typed.push(path); if (name) take(path, [name]); } else { runtime.push({ path, dynamic: true }); take(path, ['*']); }
        continue;
      }
      if (k() === 's') { runtime.push({ path: v(), dynamic: false }); continue; }
      // import.meta, or a key named import.
      if (k() === 'p' && !is('p', '{') && !is('p', '*')) { held = true; continue; }
      let type = false;
      const names: string[] = [];
      if (is('w', 'type')) {
        if (!next()) break;
        // `import type from` and `import type, {` take a default import named type.
        type = !is('w', 'from') && !is('p', ',');
        if (!type) names.push('default');
      }
      // The clause is read from its first token: a default, `{` or `*`.
      held = true;
      const path = from(names);
      if (path !== undefined) { if (type) typed.push(path); else runtime.push({ path, dynamic: false }); take(path, names); }
      continue;
    }
    let type = false;
    if (is('w', 'type')) {
      if (!next()) break;
      type = true;
    }
    if (is('p', '*')) {
      // export * from, and export * as ns from, which exports ns.
      if (next() && is('w', 'as') && next() && k() === 'w') exported.push(v()); else held = true;
      const path = from();
      if (path !== undefined) { if (type) typed.push(path); else runtime.push({ path, dynamic: false }); take(path, ['*']); }
    } else if (is('p', '{')) {
      const pairs = specifiers();
      exported.push(...pairs.map(([, as]) => as));
      if (next() && is('w', 'from')) {
        if (next() && k() === 's') {
          if (type) typed.push(v()); else runtime.push({ path: v(), dynamic: false });
          take(v(), pairs.map(([name]) => name));
        } else held = true;
      } else held = true;
    } else if (type) {
      // export type T = …
      if (k() === 'w') exported.push(v());
      held = true;
    } else if (is('w', 'default')) {
      exported.push('default');
      held = true;
    } else {
      if (is('w', 'declare') && !next()) break;
      if (is('w', 'const') || is('w', 'let') || is('w', 'var')) {
        // export const a = …, b = …; export const enum E. A pattern (`export const { a } = …`) is not read.
        if (!next()) break;
        const isEnum = is('w', 'enum');
        if (isEnum && !next()) break;
        if (k() === 'w') { exported.push(v()); if (!isEnum) decl = { depth: 0, angle: 0, comma: false, name: '' }; } else held = true;
      } else if (k() === 'w' && DECLARES.has(v())) {
        // export function f, export async function f, export function* g, export abstract class C, export interface I …
        while (k() === 'w' && DECLARES.has(v()) && next()) if (is('p', '*')) next();
        if (k() === 'w') exported.push(v()); else held = true;
      } else held = true;
    }
  }
  return { runtime, types: typed.length, typed, named, exported: [...new Set(exported)], read };
}

// ---- The graph --------------------------------------------------------------------------------

/** The runtime import graph: each file's imports in src/ and tools/, resolved to files. */
export interface Graph {
  files: readonly string[];
  edges: ReadonlyMap<string, ReadonlySet<string>>;
  imports: number;
  dynamic: number;
  types: number;
  /** Relative paths that name no file. */
  unresolved: readonly string[];
}

/** Every file under src/ and tools/, as its path from the root. */
export function treeFiles(): string[] {
  return ['src', 'tools'].flatMap((dir) => readdirSync(ROOT + dir, { recursive: true, withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => relative(ROOT, d.parentPath + '/' + d.name).replaceAll('\\', '/'))
    .filter((f) => !f.includes('node_modules/')));
}

/**
 * The graph of the files given, each read by `read`. The importers are the .ts files outside
 * src/lib/, which is vendored and never edited here; every file is a node an import can reach. A
 * path a package or Node's own module names, or one outside src/ and tools/, is not followed.
 */
export function graph(files: readonly string[], read: (f: string) => string): Graph {
  const set = new Set(files);
  const edges = new Map<string, Set<string>>();
  const unresolved: string[] = [];
  let count = 0, dynamic = 0, types = 0;
  for (const f of files) {
    if (!f.endsWith('.ts') || f.endsWith('.d.ts') || f.startsWith('src/lib/')) continue;
    const found = imports(read(f));
    types += found.types;
    const to = new Set<string>();
    for (const s of found.runtime) {
      if (!s.path.startsWith('./') && !s.path.startsWith('../')) continue;
      const p = posix.normalize(posix.join(posix.dirname(f), s.path));
      if (!p.startsWith('src/') && !p.startsWith('tools/')) continue;
      const file = set.has(p) ? p : set.has(p + '/index.ts') ? p + '/index.ts' : undefined;
      if (!file) { unresolved.push(`${f} imports ${s.path}`); continue; }
      count++;
      if (s.dynamic) dynamic++;
      to.add(file);
    }
    edges.set(f, to);
  }
  return { files, edges, imports: count, dynamic, types, unresolved };
}
