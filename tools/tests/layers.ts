// The layers (#900, part of #848): the runtime import graph of src/ and tools/, read from the files as
// they stand, and the rules it keeps (EXPANSION §8.1). src/lib under src/game under src/content under
// src/ui under src/app, the files directly under src/ the app's until src/app/ is made; the tools take
// anything and tools/kit/ only src; the walkthroughs and the suites take src and tools/kit/, not each
// other or the tools; no area takes another area's files but its public.ts; and no cycle among src's
// runtime imports. What crosses today is a row of KNOWN, under the issue that clears it: a crossing no
// row holds fails, and so does a row that no longer crosses, so the table only shrinks, and by name.
//
// A runtime import is one Node loads as the file loads or runs: an `import` or an `export ... from`
// with a literal path, `import './x.ts'` for its side effects and `import('./x.ts')`. `import type`,
// `export type ... from`, `typeof import('./x.ts')` and `import('./x.ts').T` in a type are erased
// before the file runs and are left out: the type cycle through content is kept on purpose, as it
// keeps MonsterSprite, Interior and RegionId narrow (NARROW in src/content/index.ts). `import { type
// A }` is not left out: Node strips the name and still loads the file. The files are read by
// the lexer of tools/kit/graph.ts, not the compiler, which takes three seconds to parse them.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { imports, graph, treeFiles, type Graph } from '../kit/graph.ts';
import { ok, fail } from './lib.ts';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

/** The issues of #848's plan that clear today's crossings, each with what it does. */
const KEYS = {
  L4: 'the quests and the guild quests passed in',
  L5: 'the climates, stones, endings, maps and the atlas passed in',
  L6: 'the pilot moved to src/app',
  L7: 'Game, its screen stack and input moved to src/app, the screens given a Host',
  split: 'the big modules split: party.ts into its tables, conditions and levels, so skills.ts loads no items',
  H8: "the walkthroughs as scenes: a chain takes an area's steps.ts, not its walkthrough",
} as const;
type Key = keyof typeof KEYS;

/** Today's crossings, each `importer > imported` under the issue that clears it; a cycle is `cycle: ` and its files. */
const KNOWN: Readonly<Partial<Record<Key, readonly string[]>>> = {
  L4: [
    'src/game/guilds.ts > src/content/guilds.ts',
    'src/game/guilds.ts > src/content/index.ts',
    'src/game/ranks.ts > src/content/guilds.ts',
    'src/game/ranks.ts > src/content/index.ts',
  ],
  L5: [
    'src/game/quests.ts > src/content/index.ts',
    'src/game/stones.ts > src/content/endings.ts',
    'src/game/stones.ts > src/content/index.ts',
    'src/game/stones.ts > src/content/stones.ts',
    'src/game/world.ts > src/content/index.ts',
  ],
  L6: [
    'src/game/pilot/aims.ts > src/content/index.ts',
    'src/game/pilot/keep.ts > src/ui/draw.ts',
    'src/game/pilot/keep.ts > src/ui/screens.ts',
    'src/game/pilot/known.ts > src/content/index.ts',
    'src/game/pilot/known.ts > src/ui/draw.ts',
    'src/game/pilot/known.ts > src/ui/screens.ts',
    'src/game/pilot/pilot.ts > src/ui/combat.ts',
    'src/game/pilot/pilot.ts > src/ui/create.ts',
    'src/game/pilot/pilot.ts > src/ui/screens.ts',
    'src/game/pilot/pilot.ts > src/ui/title.ts',
    'src/game/pilot/route.ts > src/ui/draw.ts',
    'src/game/pilot/route.ts > src/ui/frame.ts',
    'src/game/pilot/talk.ts > src/ui/draw.ts',
    'src/game/pilot/talk.ts > src/ui/riddle.ts',
    'src/game/pilot/talk.ts > src/ui/screens.ts',
  ],
  L7: [
    'src/game/game.ts > src/content/maps.ts',
    'src/game/game.ts > src/input.ts',
    'src/game/game.ts > src/ui/combat.ts',
    'src/game/game.ts > src/ui/ending.ts',
    'src/game/game.ts > src/ui/frame.ts',
    'src/game/game.ts > src/ui/quests.ts',
    'src/game/game.ts > src/ui/riddle.ts',
    'src/game/game.ts > src/ui/screens.ts',
    'src/game/game.ts > src/ui/title.ts',
    'src/game/game.ts > src/ui/viewport.ts',
    'src/game/game.ts > src/ui/worldmap.ts',
    'src/ui/combat.ts > src/input.ts',
    'src/ui/create.ts > src/input.ts',
    'src/ui/ending.ts > src/input.ts',
    'src/ui/quests.ts > src/input.ts',
    'src/ui/riddle.ts > src/input.ts',
    'src/ui/screens.ts > src/input.ts',
    'src/ui/title.ts > src/input.ts',
    'src/ui/worldmap.ts > src/input.ts',
  ],
  split: [
    'cycle: src/game/items.ts src/game/party.ts src/game/skills.ts',
  ],
  H8: [
    'src/content/areas/saltreach/walkthrough.ts > src/content/areas/shelf/walkthrough.ts',
    'src/content/areas/saltreach/walkthrough.ts > src/content/areas/thornmark/walkthrough.ts',
    'src/content/areas/sunderwood/walkthrough.ts > src/content/areas/saltreach/walkthrough.ts',
    'src/content/areas/sunderwood/walkthrough.ts > src/content/areas/shelf/walkthrough.ts',
    'src/content/areas/sunderwood/walkthrough.ts > src/content/areas/thornmark/walkthrough.ts',
    'src/content/areas/sunderwood/walkthrough.ts > src/content/areas/wrackholm/walkthrough.ts',
    'src/content/areas/thornmark/walkthrough.ts > src/content/areas/shelf/walkthrough.ts',
    'src/content/areas/wrackholm/walkthrough.ts > src/content/areas/saltreach/walkthrough.ts',
  ],
};

// ---- The rules --------------------------------------------------------------------------------

/** The layers of src, lowest first. */
const LAYERS = ['src/lib', 'src/game', 'src/content', 'src/ui', 'src/app'];

/** Where a file stands: its layer in src, a walkthrough, a suite, the suites' frame (tools/tests/lib.ts), the kit or a tool. */
export function place(f: string): string {
  if (/^src\/content\/areas\/[^/]+\/walkthrough\.ts$/.test(f)) return 'walkthrough';
  for (const layer of LAYERS.slice(0, 4)) if (f.startsWith(layer + '/')) return layer;
  if (f.startsWith('src/')) return 'src/app';
  if (f === 'tools/tests/lib.ts') return 'frame';
  if (/^tools\/tests\/[^/]+\.ts$/.test(f)) return 'suite';
  return f.startsWith('tools/kit/') ? 'kit' : 'tool';
}

export type Rule = 'layers' | 'areas' | 'tests' | 'kit';
/** Each rule as the check says it, of an import from `a` to `b`. */
const SAYS: Record<Rule, (a: string, b: string) => string> = {
  layers: (a, b) => LAYERS.includes(place(b)) ? `${place(a)} is under ${place(b)}` : 'src takes no tool and no walkthrough',
  areas: () => "an area takes another area's files only through its public.ts",
  tests: () => 'a walkthrough or a suite takes src and tools/kit/, not another walkthrough or suite and not a tool',
  kit: () => 'tools/kit/ takes src only',
};

const areaOf = (f: string): string | undefined => /^src\/content\/areas\/([^/]+)\//.exec(f)?.[1];

/** The rule an import from `a` to `b` breaks, if any: a walkthrough's or a suite's first, then the layers, then the areas. */
export function broken(a: string, b: string): Rule | undefined {
  const pa = place(a), pb = place(b);
  const inSrc = (p: string): boolean => LAYERS.includes(p);
  if (pa === 'walkthrough' || pa === 'suite') {
    if (!inSrc(pb) && pb !== 'kit' && !(pa === 'suite' && pb === 'frame')) return 'tests';
  } else if (pa === 'kit') {
    return inSrc(pb) || pb === 'kit' ? undefined : 'kit';
  } else if (inSrc(pa)) {
    if (!inSrc(pb) || LAYERS.indexOf(pb) > LAYERS.indexOf(pa)) return 'layers';
  } else return undefined;
  const from = areaOf(a), to = areaOf(b);
  return from && to && from !== to && b !== `src/content/areas/${to}/public.ts` ? 'areas' : undefined;
}

/** Each crossing as `importer > imported`, with the rule it breaks. */
export function crossings(g: Graph): Map<string, Rule> {
  const out = new Map<string, Rule>();
  for (const [a, to] of g.edges) for (const b of to) {
    const rule = broken(a, b);
    if (rule) out.set(`${a} > ${b}`, rule);
  }
  return out;
}

/** The cycles among src's runtime imports: each strongly connected component of more than one file, or a file that imports itself, its files sorted. */
export function cycles(g: Graph): string[][] {
  const inSrc = (f: string): boolean => f.startsWith('src/');
  const index = new Map<string, number>(), low = new Map<string, number>();
  const stack: string[] = [], onStack = new Set<string>(), out: string[][] = [];
  let n = 0;
  const visit = (v: string): void => {
    index.set(v, n); low.set(v, n); n++;
    stack.push(v); onStack.add(v);
    for (const w of g.edges.get(v) ?? []) {
      if (!inSrc(w)) continue;
      if (!index.has(w)) { visit(w); low.set(v, Math.min(low.get(v)!, low.get(w)!)); }
      else if (onStack.has(w)) low.set(v, Math.min(low.get(v)!, index.get(w)!));
    }
    if (low.get(v) !== index.get(v)) return;
    const scc: string[] = [];
    let w: string;
    do { w = stack.pop()!; onStack.delete(w); scc.push(w); } while (w !== v);
    if (scc.length > 1 || g.edges.get(v)?.has(v)) out.push(scc.sort());
  }
  for (const f of [...g.edges.keys()].filter(inSrc).sort()) if (!index.has(f)) visit(f);
  return out.sort((a, b) => a[0] < b[0] ? -1 : 1);
}

/** The check of a graph against a table: each line that fails, the file pair or the cycle and the rule. */
export function judge(g: Graph, known: Readonly<Partial<Record<Key, readonly string[]>>>): { failures: string[]; byRule: Map<string, number>; byKey: Map<string, number> } {
  const failures: string[] = [];
  const rows = new Map<string, Key>();
  for (const [key, list] of Object.entries(known) as [Key, readonly string[]][]) {
    if (!(key in KEYS)) failures.push(`KNOWN: ${key} is no issue of #848's plan`);
    for (const row of list) {
      if (rows.has(row)) failures.push(`KNOWN: ${row} is a row twice`);
      rows.set(row, key);
    }
  }
  const byRule = new Map<string, number>(), byKey = new Map<string, number>();
  const seen = new Set<string>();
  const count = (rule: string, key: Key): void => {
    byRule.set(rule, (byRule.get(rule) ?? 0) + 1);
    byKey.set(key, (byKey.get(key) ?? 0) + 1);
  };
  for (const [pair, rule] of crossings(g)) {
    const [a, b] = pair.split(' > ');
    const key = rows.get(pair);
    if (key) { seen.add(pair); count(rule, key); } else failures.push(`${rule}: ${a} imports ${b}, and ${SAYS[rule](a, b)}; no KNOWN row holds it`);
  }
  for (const scc of cycles(g)) {
    const row = 'cycle: ' + scc.join(' ');
    const key = rows.get(row);
    if (key) { seen.add(row); count('cycle', key); } else failures.push(`cycle: ${scc.join(', ')} import each other as they load; no KNOWN row holds it`);
  }
  for (const [row, key] of rows) {
    if (!seen.has(row)) failures.push(`KNOWN: ${row} (${key}) no longer ${row.startsWith('cycle: ') ? 'is a cycle' : 'crosses'}: the row goes`);
  }
  return { failures, byRule, byKey };
}

const counted = (m: ReadonlyMap<string, number>): string => [...m].sort().map(([k, v]) => `${k} ${v}`).join(', ') || 'none';

export function layers(): void {
  // The lexer on the forms the files are written in.
  const forms: [string, string[]][] = [
    ["import { a, type B } from './a.ts';\nimport type { C } from './c.ts';", ['./a.ts']],
    ["import { type B } from './b.ts';", ['./b.ts']],
    ["import type, { a } from './t.ts';\nimport type X from './x.ts';", ['./t.ts']],
    ["export * from './s.ts';\nexport { a } from './e.ts';\nexport type { T } from './t.ts';\nexport type * from './u.ts';\nexport { b };", ['./s.ts', './e.ts']],
    ["import './side.ts';\nconst m = await import('./late.ts');\nimport('./then.ts').then((x) => x);", ['./side.ts', './late.ts', './then.ts']],
    ["type T = import('./t.ts').T;\nlet u: typeof import('./u.ts');\nconst p = await import(path);", []],
    ["// import { a } from './c1.ts';\n/* import './c2.ts'; */\nconst s = \"import './s.ts'\";\nconst t = `import { a } from './t.ts' ${ `${'x'}` } import('./u.ts')`;", []],
    ["const r = /['\"`]/g, q = a / 2 / b;\nimport { x } from './after.ts';\nconst o = { import: 1, export: 2 }, m = import.meta.url;", ['./after.ts']],
  ];
  for (const [text, want] of forms) {
    const got = imports(text).runtime.map((s) => s.path);
    ok(got.join() === want.join(), `the lexer reads ${JSON.stringify(text.split('\n')[0])}${text.includes('\n') ? ' and on' : ''}: ${want.join(', ') || 'nothing'} at run time${got.join() === want.join() ? '' : `, not ${got.join(', ') || 'nothing'}`}`);
  }

  // The rules on a graph in memory: a new crossing fails, and so does a row that no longer crosses.
  const fixture = graph(['src/game/a.ts', 'src/content/b.ts', 'src/content/areas/x/maps/m.ts', 'src/content/areas/y/public.ts', 'src/content/areas/y/maps/n.ts'], (f) => ({
    'src/game/a.ts': "import { B } from '../content/b.ts';",
    'src/content/b.ts': "import { A } from '../game/a.ts';",
    'src/content/areas/x/maps/m.ts': "import { N } from '../../y/maps/n.ts';\nimport { P } from '../../y/public.ts';",
  } as Record<string, string>)[f] ?? '');
  const held = judge(fixture, { L7: ['src/game/a.ts > src/content/b.ts', 'cycle: src/content/b.ts src/game/a.ts'], H8: ['src/content/areas/x/maps/m.ts > src/content/areas/y/maps/n.ts'] });
  ok(held.failures.length === 0, `a graph in memory whose crossings and cycle KNOWN holds passes${held.failures.length ? ': ' + held.failures.join('; ') : ''}`);
  const fresh = judge(fixture, { L7: ['src/game/a.ts > src/content/b.ts', 'cycle: src/content/b.ts src/game/a.ts'] });
  ok(fresh.failures.join() === "areas: src/content/areas/x/maps/m.ts imports src/content/areas/y/maps/n.ts, and an area takes another area's files only through its public.ts; no KNOWN row holds it",
    `a crossing no row holds fails, by its pair and its rule: ${fresh.failures.join('; ')}`);
  const stale = judge(fixture, { L7: ['src/game/a.ts > src/content/b.ts', 'cycle: src/content/b.ts src/game/a.ts', 'src/game/a.ts > src/ui/gone.ts'], H8: ['src/content/areas/x/maps/m.ts > src/content/areas/y/maps/n.ts'] });
  ok(stale.failures.join() === 'KNOWN: src/game/a.ts > src/ui/gone.ts (L7) no longer crosses: the row goes', `a row that no longer crosses fails: ${stale.failures.join('; ')}`);
  const loop = judge(fixture, { L7: ['src/game/a.ts > src/content/b.ts'], H8: ['src/content/areas/x/maps/m.ts > src/content/areas/y/maps/n.ts'] });
  ok(loop.failures.join() === 'cycle: src/content/b.ts, src/game/a.ts import each other as they load; no KNOWN row holds it', `a cycle no row holds fails, by its files: ${loop.failures.join('; ')}`);

  // The tree.
  const t0 = performance.now();
  const files = treeFiles();
  const g = graph(files, (f) => readFileSync(ROOT + f, 'utf8'));
  const ms = performance.now() - t0;
  ok(g.unresolved.length === 0, `every relative import names a file${g.unresolved.length ? ': not ' + g.unresolved.join(', ') : ''}`);
  const { failures, byRule, byKey } = judge(g, KNOWN);
  for (const f of failures) fail(f);
  const rows = Object.values(KNOWN).reduce((s, l) => s + l.length, 0);
  const crossing = [...byRule.values()].reduce((s, k) => s + k, 0);
  ok(failures.length === 0, `the runtime graph of src/ and tools/: ${g.edges.size} files that import, ${g.imports} runtime imports (${g.dynamic} of them import()), ${g.types} in types alone left out, read in ${ms.toFixed(0)} ms; ` +
    `KNOWN's ${rows} rows, ${crossing} of them crossing today, by rule ${counted(byRule)}; by issue ${counted(byKey)}`);
}
