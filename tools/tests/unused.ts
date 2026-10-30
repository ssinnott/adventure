// The exports (#972, part of #848): every export of src/ outside src/lib/ is imported or is an entry
// point, which ENTRY names with its reason (EXPANSION §8.1), as `noUnusedLocals` and
// `noUnusedParameters` (tsconfig.json) hold a file's locals and parameters and cannot see an export.
// An export is imported by name (an `import { … }`, in types too, or an `export { … } from`, which
// counts for the file it names), by a module taken whole (`import * as`, `export *`, an `import()` as
// it runs) or as a name a tool reads off a module it loads in the page by a literal path (`V.washes`
// after tools/kit/browser.ts's `load('/src/ui/viewport.ts')`), which no import names. An export
// nothing takes fails by its file and name, and so does a row of ENTRY that names no export. The
// files are read by the lexer of tools/kit/graph.ts, not the compiler.
import { readdirSync, readFileSync } from 'node:fs';
import { posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { imports, treeFiles } from '../kit/graph.ts';
import { ok, fail } from './lib.ts';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

/** Exports something finds by name and not by an import: the files, and the names where not all of them, with why. */
export interface Entry { what: string; file: RegExp; names?: readonly string[]; why: string }

/** The entry points, each with its reason. */
export const ENTRY: readonly Entry[] = [
  { what: "a family's draw", file: /^src\/ui\/monsters\/[^/]+\.ts$/, names: ['draw'], why: 'familyModules (tools/tests/lib.ts) finds each family by its file and reads it as m.draw' },
  { what: "a walkthrough's scenes or walkthrough", file: /^src\/content\/areas\/[^/]+\/walkthrough\.ts$/, names: ['scenes', 'walkthrough'], why: 'the runner (tools/test.ts) finds a walkthrough by its file and reads them by name' },
  { what: "an area's CHECKS", file: /^src\/content\/areas\/[^/]+\/checks\.ts$/, names: ['CHECKS'], why: 'tools/kit/checks.ts finds them by the file and reads them by name' },
  { what: "an area's public.ts", file: /^src\/content\/areas\/[^/]+\/public\.ts$/, why: 'the one way into an area (#992): what it exports is for the other areas' },
  { what: 'the paint kit', file: /^src\/ui\/paint\//, why: 'a kit (#983): a helper waits in it, adopted by nothing yet, until a family or a scene takes it (the rule of three)' },
  { what: "the monsters' kit", file: /^src\/ui\/monsters\/kit\//, why: 'a kit, as the paint kit is, for the families' },
  { what: "the rooms' kit", file: /^src\/ui\/interiors\/kit\//, why: 'a kit, as the paint kit is, for the scenes' },
];

/** What the check finds of the files given, each read by `read`: the exports, how many pass each way, each row's entry points and what fails. */
export function judge(files: readonly string[], read: (f: string) => string, entry: readonly Entry[] = ENTRY): {
  exports: number; files: number; byName: number; whole: number; paged: number; entries: number[]; refused: string[];
} {
  const set = new Set(files);
  const resolve = (f: string, p: string): string | undefined => {
    if (!p.startsWith('./') && !p.startsWith('../')) return undefined;
    const q = posix.normalize(posix.join(posix.dirname(f), p));
    return set.has(q) ? q : set.has(q + '/index.ts') ? q + '/index.ts' : undefined;
  };
  const add = (m: Map<string, Set<string>>, f: string, name: string): void => { let s = m.get(f); if (!s) m.set(f, s = new Set()); s.add(name); };
  const taken = new Map<string, Set<string>>(), paged = new Map<string, Set<string>>(), whole = new Set<string>();
  const own = new Map<string, string[]>();
  for (const f of files) {
    if (!f.endsWith('.ts') || f.startsWith('src/lib/')) continue;
    const found = imports(read(f));
    if (f.startsWith('src/') && !f.endsWith('.d.ts') && found.exported.length) own.set(f, found.exported);
    for (const t of found.named) {
      const to = resolve(f, t.path);
      if (!to) continue;
      if (t.whole) whole.add(to);
      for (const name of t.names) add(taken, to, name);
    }
    for (const r of found.read) add(paged, r.path, r.name);
  }
  let exports = 0, byName = 0, wholly = 0, byPage = 0;
  const entries = entry.map(() => 0), held = entry.map(() => 0), refused: string[] = [];
  for (const [f, names] of own) for (const name of names) {
    exports++;
    const rows = entry.flatMap((e, i) => (e.file.test(f) && (!e.names || e.names.includes(name)) ? [i] : []));
    for (const i of rows) held[i]++;
    if (taken.get(f)?.has(name)) byName++;
    else if (whole.has(f)) wholly++;
    else if (paged.get(f)?.has(name)) byPage++;
    else if (rows.length) entries[rows[0]]++;
    else refused.push(`${f}: ${name} is exported, and nothing imports it and no entry point lists it`);
  }
  for (const [i, e] of entry.entries()) if (!held[i]) refused.push(`ENTRY: ${e.what} names no export: the row goes`);
  return { exports, files: own.size, byName, whole: wholly, paged: byPage, entries, refused };
}

export function unused(): void {
  // The lexer on the forms the files are written in: what each exports.
  const exporting: [string, string[]][] = [
    ['export const A = 1, B: Map<string, C> = new Map<string, D>(), E = <T, U = T>(x: T): T => x;\nexport let f, g;', ['A', 'B', 'E', 'f', 'g']],
    ['export const s = `${a}, ${b}`, r = /,x/g, o = { p: 1, q: 2 }, t = f(1, 2), u = (x: number) => x > 1, w = 2\nexport type V = 1', ['s', 'r', 'o', 't', 'u', 'w', 'V']],
    ['export function f() {}\nexport async function g() {}\nexport function* h() {}\nexport abstract class C {}\nexport interface I {}\nexport enum E {}\nexport const enum F {}\nexport declare const G: number;', ['f', 'g', 'h', 'C', 'I', 'E', 'F', 'G']],
    ["export default 1;\nconst a = 1, b = 2;\nexport { a, b as c };\nexport { d, type e as f } from './x.ts';\nexport * as ns from './y.ts';\nexport * from './z.ts';", ['default', 'a', 'c', 'd', 'f', 'ns']],
  ];
  for (const [text, want] of exporting) {
    const got = imports(text).exported;
    ok(got.join() === want.join(), `the lexer reads ${JSON.stringify(text.split('\n')[0])}${text.includes('\n') ? ' and on' : ''} as exporting ${want.join(', ')}${got.join() === want.join() ? '' : `, not ${got.join(', ') || 'nothing'}`}`);
  }
  // What each takes, by path: its names, or the module whole.
  const taking: [string, string][] = [
    ["import X, { a, type B, c as d } from './a.ts';\nimport type { T } from './t.ts';\nimport type D from './d.ts';", './a.ts default a B c; ./t.ts T; ./d.ts default'],
    ["import * as ns from './n.ts';\nimport Y, * as m from './m.ts';\nexport { a as b } from './e.ts';\nexport * from './s.ts';", './n.ts whole; ./m.ts default whole; ./e.ts a; ./s.ts whole'],
    ["type T = import('./t.ts').T;\nlet u: typeof import('./u.ts');\nconst m = await import('./m.ts');\nimport './side.ts';", './t.ts T; ./m.ts whole'],
  ];
  for (const [text, want] of taking) {
    const got = imports(text).named.map((t) => [t.path, ...t.names, ...(t.whole ? ['whole'] : [])].join(' ')).join('; ');
    ok(got === want, `the lexer reads ${JSON.stringify(text.split('\n')[0])} and on as taking ${want}${got === want ? '' : `, not ${got || 'nothing'}`}`);
  }
  const page = "const V = await load<typeof import('../../src/ui/v.ts')>('/src/ui/v.ts'), F = await load<{ draw(): void }>(`/src/ui/${f}.ts`);\nV.washes(F.draw);\nconst x = V.paintScene;";
  const reads = imports(page).read.map((r) => `${r.path} ${r.name}`).join('; ');
  ok(reads === 'src/ui/v.ts washes; src/ui/v.ts paintScene', `the lexer reads what a tool reads off a module it loads in the page by a literal path, and nothing off one loaded by a path made as it runs: ${reads || 'nothing'}`);

  // The rule on files in memory: an export nothing takes fails by file and name; one a page's tool reads passes.
  const texts: Record<string, string> = {
    'src/game/a.ts': 'export const used = 1, lonely = 2;\nexport function own(): number { return lonely; }',
    'src/ui/b.ts': "import { used } from '../game/a.ts';\nexport const washes = used;",
    'src/ui/whole.ts': 'export const any = 1;',
    'src/ui/monsters/rat.ts': 'export const SPRITES = {};\nexport function draw(): void {}',
    'src/ui/monsters/index.ts': "import { SPRITES } from './rat.ts';\nimport * as all from '../whole.ts';",
    'tools/smoke/look.ts': "const V = await load<typeof import('../../src/ui/b.ts')>('/src/ui/b.ts');\nV.washes();",
  };
  const family = ENTRY.slice(0, 1);
  const judged = (t: Record<string, string>, entry: readonly Entry[] = family) => judge(Object.keys(t), (f) => t[f] ?? '', entry);
  const held = judged(texts);
  ok(held.refused.join('; ') === 'src/game/a.ts: lonely is exported, and nothing imports it and no entry point lists it; src/game/a.ts: own is exported, and nothing imports it and no entry point lists it',
    `files in memory: an export nothing imports fails by its file and name, one used in its own file alone among them, and one a tool reads off a page's load, one of a module taken whole and a family's draw pass: ${held.refused.join('; ') || 'none refused'}`);
  const unread = judged({ ...texts, 'tools/smoke/look.ts': "const V = await load<typeof import('../../src/ui/b.ts')>('/src/ui/b.ts');\nV.paintScene();" });
  ok(unread.refused.includes('src/ui/b.ts: washes is exported, and nothing imports it and no entry point lists it'), `and the export the page's tool read fails when the tool reads it no longer: ${unread.refused.length} refused`);
  const stale = judged(texts, [...family, { what: 'a row of nothing', file: /^src\/none\//, why: 'none' }]);
  ok(stale.refused.at(-1) === 'ENTRY: a row of nothing names no export: the row goes', `a row of ENTRY that names no export fails: ${stale.refused.at(-1)}`);

  // The tree, and the types/ files' imports with it.
  const t0 = performance.now();
  const files = [...treeFiles(), ...readdirSync(ROOT + 'types').map((f) => 'types/' + f)];
  const v = judge(files, (f) => readFileSync(ROOT + f, 'utf8'));
  const ms = performance.now() - t0;
  for (const r of v.refused) fail(r);
  const entries = v.entries.reduce((s, k) => s + k, 0);
  ok(v.refused.length === 0, `the exports of src/ outside src/lib/: ${v.exports} in ${v.files} files, read in ${ms.toFixed(0)} ms; ${v.byName} imported by name, ${v.whole} more of a module taken whole and ${v.paged} read off a page's load; `
    + `${entries} entry points by ENTRY's ${ENTRY.length} rows (${ENTRY.map((e, i) => `${e.what} ${v.entries[i]}`).join(', ')}); ${v.refused.length} refused`);
}
