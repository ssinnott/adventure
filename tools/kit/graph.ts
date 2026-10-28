// The runtime import graph of src/ and tools/ (#900; moved here from tools/tests/layers.ts by #955, as
// it was): each file's imports, read by a small lexer, not the compiler, which takes three seconds to
// parse them. A runtime import is one Node loads as the file loads or runs: an `import` or an
// `export ... from` with a literal path, `import './x.ts'` for its side effects and
// `import('./x.ts')`. `import type`, `export type ... from`, `typeof import('./x.ts')` and
// `import('./x.ts').T` in a type are erased before the file runs and are left out; `import { type A }`
// is not, as Node strips the name and still loads the file. The layers check (tools/tests/layers.ts)
// holds the graph to the layers, and tools/changed.ts reads from it what a diff reaches.
import { readdirSync } from 'node:fs';
import { posix, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

// ---- Reading the imports ----------------------------------------------------------------------

/** An import a file makes as it runs: the path as written, and whether it is an `import()`. */
export interface Spec { path: string; dynamic: boolean }

const WORD = new Uint8Array(128);
for (let c = 0; c < 128; c++) WORD[c] = /[\w$]/.test(String.fromCharCode(c)) ? 1 : 0;
/** After these words a slash opens a regular expression; after any other word it divides. */
const BEFORE_REGEX = new Set(['return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void', 'throw', 'case', 'do', 'else', 'yield', 'await']);

/**
 * The imports a file makes as it runs, and how many it makes in types alone, with their paths
 * (`typed`, which the layers check reads for the UI, #1022). Comments, strings, template literals
 * and regular expressions are skipped whole, so an import written inside one is not taken; the
 * import forms are read from the tokens between.
 */
export function imports(text: string): { runtime: Spec[]; types: number; typed: string[] } {
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
  const next = (): boolean => {
    if (held) { held = false; return true; }
    prevKind = kind; prevValue = value;
    return lex();
  };
  // The token as it stands, read through a call: next() changes it, which the compiler cannot see.
  const k = (): string => kind, v = (): string => value;
  const is = (want: string, text: string): boolean => kind === want && value === text;
  /** Reads on to `from '...'` within the statement: the path, or undefined. */
  const from = (): string | undefined => {
    while (next()) {
      if (is('p', ';')) return undefined;
      if (is('w', 'import') || is('w', 'export')) { held = true; return undefined; }
      if (is('w', 'from')) {
        if (next() && k() === 's') return v();
        held = true;
      }
    }
    return undefined;
  };
  const runtime: Spec[] = [];
  const typed: string[] = [];
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
        let inType = before === 'typeof';
        if (is('p', ')') && next()) {
          if (is('p', '.')) inType ||= next() && k() === 'w' && !['then', 'catch', 'finally'].includes(v());
          held = true;
        }
        if (inType) typed.push(path); else runtime.push({ path, dynamic: true });
        continue;
      }
      if (k() === 's') { runtime.push({ path: v(), dynamic: false }); continue; }
      // import.meta, or a key named import.
      if (k() === 'p' && !is('p', '{') && !is('p', '*')) { held = true; continue; }
      let type = false;
      if (is('w', 'type')) {
        if (!next()) break;
        // `import type from` and `import type, {` take a default import named type.
        type = !is('w', 'from') && !is('p', ',');
        held = true;
      }
      const path = from();
      if (path !== undefined) { if (type) typed.push(path); else runtime.push({ path, dynamic: false }); }
      continue;
    }
    let type = false;
    if (is('w', 'type')) {
      if (!next()) break;
      type = true;
    }
    if (is('p', '*')) {
      const path = from();
      if (path !== undefined) { if (type) typed.push(path); else runtime.push({ path, dynamic: false }); }
    } else if (is('p', '{')) {
      while (next() && !is('p', '}'));
      if (next() && is('w', 'from')) {
        if (next() && k() === 's') { if (type) typed.push(v()); else runtime.push({ path: v(), dynamic: false }); } else held = true;
      } else held = true;
    } else held = true;
  }
  return { runtime, types: typed.length, typed };
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
