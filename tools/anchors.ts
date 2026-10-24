// #993's one-off (part of #848), committed first and deleted last, as #992's was: lands every exit of the
// areas' maps on a named anchor of the map it leads to, and lays every zone map by its box. It reads the
// exits and the places from the files as they stand (the TypeScript parser) and the joined content, and:
// names each square and facing an exit lands on (`start` where it is the map's start, else `from_<the map
// left>`, numbered where one map is entered from another at two squares); writes those anchors on the maps
// they name, after their `start`; puts `at` in place of each exit's `tx`, `ty` and `tf`, through `anchored`;
// sets each file's imports of the facings and of `anchored` as it then needs them; and puts `laid(PLAN, ..)`
// in place of each zone map's `{ map, at }`, where the box gives the same place. From the root:
// `node tools/anchors.ts`. Run again on a tree it has done, it prints `Nothing left to move`.
import ts from 'typescript';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MAP_DEFS } from '../src/content/index.ts';
import { PLAN } from '../src/content/atlas.ts';
import { box, boxAt } from '../src/game/atlas.ts';
import type { Exit, MapDef } from '../src/game/map.ts';

/** An exit and a map as #993 makes them, so that this reads a tree before it as well: an exit may land by `at`, a map may have anchors. */
type Ex = Exit & { at?: string };
type Def = MapDef & { anchors?: Readonly<Record<string, { x: number; y: number; facing: number }>>; exits?: Ex[] };
const DEFS = MAP_DEFS as readonly Def[];
const ROOT = fileURLToPath(new URL('../', import.meta.url));
const FACING = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
const walk = (d: string): string[] => readdirSync(ROOT + d).flatMap((n) => {
  const p = `${d}/${n}`;
  return statSync(ROOT + p).isDirectory() ? walk(p) : p.endsWith('.ts') ? [p] : [];
});
const FILES = walk('src/content/areas').filter((f) => !/\/(walkthrough|checks)\.ts$/.test(f));
const read = (f: string): string => readFileSync(ROOT + f, 'utf8');
const parse = (f: string, t: string): ts.SourceFile => ts.createSourceFile(f, t, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
const fail = (why: string): never => { console.error(why); process.exit(1); };
type Edit = [number, number, string];
const apply = (t: string, edits: Edit[]): string => {
  let out = t, floor = Infinity;
  for (const [s, e, r] of [...edits].sort((a, b) => b[0] - a[0] || b[1] - a[1])) {
    if (e > floor) fail(`overlapping edits at ${s}`);
    out = out.slice(0, s) + r + out.slice(e);
    floor = s;
  }
  return out;
};
const rel = (from: string, to: string): string => { const r = posix.relative(posix.dirname(from), to); return r.startsWith('.') ? r : './' + r; };
const props = (o: ts.ObjectLiteralExpression): Map<string, ts.PropertyAssignment> => new Map(o.properties.flatMap((p) =>
  ts.isPropertyAssignment(p) && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) ? [[p.name.text, p] as const] : []));
const num = (p: ts.PropertyAssignment | undefined): number | undefined => {
  const e = p?.initializer;
  if (!e) return undefined;
  if (ts.isNumericLiteral(e)) return Number(e.text);
  if (ts.isPrefixUnaryExpression(e) && e.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(e.operand)) return -Number(e.operand.text);
  return NaN;
};
const visit = (n: ts.Node, f: (n: ts.Node) => void): void => { f(n); ts.forEachChild(n, (c) => visit(c, f)); };

// ---------------------------------------------------------------- the exits as written
interface Written { file: string; node: ts.ObjectLiteralExpression; x: number; y: number; to: string; tx: number; ty: number; tf?: number; span: [number, number] }
const written: Written[] = [];
const sources = new Map<string, ts.SourceFile>();
for (const file of FILES) {
  const sf = parse(file, read(file));
  sources.set(file, sf);
  visit(sf, (n) => {
    if (!ts.isObjectLiteralExpression(n)) return;
    const p = props(n);
    if (!p.has('to') || !p.has('tx') || p.has('kind')) return;
    const to = p.get('to')!.initializer, tf = p.get('tf')?.initializer;
    const x = num(p.get('x')), y = num(p.get('y')), tx = num(p.get('tx')), ty = num(p.get('ty'));
    const where = `${file}:${sf.getLineAndCharacterOfPosition(n.getStart()).line + 1}`;
    if (!ts.isStringLiteral(to) || [x, y, tx, ty].some((v) => v === undefined || Number.isNaN(v))) fail(`${where}: an exit not written in numbers and a map id`);
    if (tf && !(ts.isIdentifier(tf) && FACING.includes(tf.text))) fail(`${where}: a facing not written as a facing's name`);
    // tx, ty and tf stand together, in that order, and go as one.
    const order = n.properties.filter((q) => ts.isPropertyAssignment(q) && ts.isIdentifier(q.name) && ['tx', 'ty', 'tf'].includes(q.name.text));
    const i = n.properties.indexOf(order[0]);
    if (order.some((q, k) => n.properties[i + k] !== q)) fail(`${where}: tx, ty and tf apart`);
    written.push({ file, node: n, x: x!, y: y!, to: (to as ts.StringLiteral).text, tx: tx!, ty: ty!, tf: tf ? FACING.indexOf((tf as ts.Identifier).text) : undefined, span: [order[0].getStart(), order[order.length - 1].getEnd()] });
  });
}

// ---------------------------------------------------------------- the exits as joined, and their names
const byId = new Map(DEFS.map((d) => [d.id, d]));
const key = (e: { x: number; y: number; to: string; tx: number; ty: number; tf?: number }): string => `${e.x},${e.y} ${e.to} ${e.tx},${e.ty} ${e.tf}`;
const joined = new Map<string, { from: Def; e: Ex }[]>();
for (const d of DEFS) for (const e of d.exits ?? []) if (e.at === undefined) joined.set(key(e), [...(joined.get(key(e)) ?? []), { from: d, e }]);
const seen = new Set<string>();
for (const w of written) {
  const j = joined.get(key(w));
  if (!j || j.length !== 1) fail(`${w.file}: exit ${key(w)} is joined ${j?.length ?? 0} times`);
  seen.add(key(w));
}
for (const k of joined.keys()) if (!seen.has(k)) fail(`exit ${k} of ${joined.get(k)![0].from.id} is written where this cannot see it`);

/** Each map's anchors, old and new, by square and facing; and the name of each exit's. */
const anchors = new Map<string, Map<string, { name: string; x: number; y: number; facing: number; fresh: boolean }>>();
const nameOf = new Map<Written, string>();
const counts = { start: 0, named: 0 };
for (const d of DEFS) for (const e of d.exits ?? []) {
  const w = e.at === undefined ? written.find((q) => key(q) === key(e)) : undefined;
  if (!w) continue;
  const to = byId.get(e.to) ?? fail(`exit ${key(e)} of ${d.id} leads to no map`);
  if (to.start.x === e.tx && to.start.y === e.ty && to.start.facing === e.tf) { nameOf.set(w, 'start'); counts.start++; continue; }
  const facing = e.tf ?? fail(`exit ${key(e)} of ${d.id} keeps its facing, and an anchor has one`);
  const mine = anchors.get(to.id) ?? new Map(Object.entries(to.anchors ?? {}).map(([name, a]) => [`${a.x},${a.y} ${a.facing}`, { name, ...a, fresh: false }]));
  anchors.set(to.id, mine);
  const sq = `${e.tx},${e.ty} ${e.tf}`;
  if (!mine.has(sq)) {
    const base = `from_${d.id}`, taken = new Set([...mine.values()].map((a) => a.name));
    let name = base;
    for (let n = 2; taken.has(name); n++) name = `${base}${n}`;
    mine.set(sq, { name, x: e.tx, y: e.ty, facing, fresh: true });
  }
  nameOf.set(w, mine.get(sq)!.name);
  counts.named++;
}

// ---------------------------------------------------------------- the edits
const edits = new Map<string, Edit[]>();
const add = (f: string, e: Edit): void => { edits.set(f, [...(edits.get(f) ?? []), e]); };
for (const w of written) {
  add(w.file, [w.span[0], w.span[1], `at: '${nameOf.get(w)}'`]);
  add(w.file, [w.node.getStart(), w.node.getStart(), 'anchored(']);
  add(w.file, [w.node.getEnd(), w.node.getEnd(), ')']);
}
const fresh: string[] = [];
for (const [id, mine] of anchors) {
  const news = [...mine.values()].filter((a) => a.fresh);
  if (!news.length) continue;
  if (news.length !== mine.size) fail(`${id} has anchors already, and gains ${news.map((a) => a.name).join(', ')}: by hand`);
  let found: { file: string; start: ts.PropertyAssignment } | undefined;
  for (const [file, sf] of sources) visit(sf, (n) => {
    if (!ts.isObjectLiteralExpression(n)) return;
    const p = props(n), idp = p.get('id')?.initializer;
    if (idp && ts.isStringLiteral(idp) && idp.text === id && p.has('rows') && p.has('start')) found = { file, start: p.get('start')! };
  });
  if (!found) fail(`no map written with the id ${id}`);
  const { file, start } = found!, t = read(file);
  const lineAt = t.lastIndexOf('\n', start.getStart()) + 1, indent = /^\s*/.exec(t.slice(lineAt))![0];
  const comma = t.indexOf(',', start.getEnd());
  if (t.slice(start.getEnd(), comma).trim() || t[comma + 1] !== '\n') fail(`${file}: ${id}'s start does not end its line`);
  const one = (a: { name: string; x: number; y: number; facing: number }): string => `${a.name}: { x: ${a.x}, y: ${a.y}, facing: ${FACING[a.facing]} }`;
  const line = `${indent}anchors: { ${news.map(one).join(', ')} },`;
  add(file, [comma + 1, comma + 1, `\n${line.length <= 140 ? line : `${indent}anchors: {\n${news.map((a) => `${indent}  ${one(a)},`).join('\n')}\n${indent}},`}`]);
  fresh.push(`${id}: ${news.map((a) => `${a.name} ${a.x},${a.y} ${FACING[a.facing][0]}`).join(', ')}`);
}

// The zone maps' places, from their boxes.
let places = 0;
for (const file of FILES.filter((f) => /^src\/content\/areas\/[^/]+\/atlas\.ts$/.test(f))) {
  visit(sources.get(file)!, (n) => {
    if (!ts.isObjectLiteralExpression(n) || n.properties.length !== 2) return;
    const p = props(n), map = p.get('map')?.initializer, at = p.get('at')?.initializer;
    if (!map || !at || !ts.isStringLiteral(map) || !ts.isArrayLiteralExpression(at)) return;
    const [x, y] = at.elements.map((e) => (ts.isNumericLiteral(e) ? Number(e.text) : NaN));
    const own = /_([a-z]+\d+)$/.exec(map.text)?.[1].toUpperCase(), name = own ?? boxAt(PLAN, x, y);
    const b = name ? box(PLAN, name) : undefined;
    if (!b || b.x !== x || b.y !== y) fail(`${file}: ${map.text} at ${x},${y} is not the corner of ${name ?? 'a box'}`);
    add(file, [n.getStart(), n.getEnd(), `laid(PLAN, '${map.text}'${own ? '' : `, '${name}'`})`]);
    places++;
  });
}

// ---------------------------------------------------------------- the imports, then the files
const importOf = (sf: ts.SourceFile, to: string, file: string, type: boolean): ts.ImportDeclaration | undefined => sf.statements.find((s): s is ts.ImportDeclaration =>
  ts.isImportDeclaration(s) && ts.isStringLiteral(s.moduleSpecifier) && posix.normalize(posix.join(posix.dirname(file), s.moduleSpecifier.text)) === to && !!s.importClause?.isTypeOnly === type);
const names = (d: ts.ImportDeclaration): string[] => { const nb = d.importClause?.namedBindings; return nb && ts.isNamedImports(nb) ? nb.elements.map((e) => e.getText()) : []; };
const used = (sf: ts.SourceFile, name: string): boolean => {
  let hit = false;
  visit(sf, (n) => { if (ts.isIdentifier(n) && n.text === name && !(n.parent && (ts.isImportSpecifier(n.parent)))) hit = true; });
  return hit;
};
/** Sets a file's runtime import from `to` to hold `want` beside what else it holds: a line edited, added after `after`, or gone. */
const setImport = (file: string, t: string, to: string, keep: (n: string) => boolean, want: string[], after: string[]): string => {
  const sf = parse(file, t), d = importOf(sf, to, file, false);
  const had = d ? names(d) : [], all = [...new Set([...had.filter(keep), ...want])].sort();
  if (d && all.length === had.length && all.every((n) => had.includes(n))) return t;
  const line = all.length ? `import { ${all.join(', ')} } from '${rel(file, to)}';` : '';
  if (d) {
    const end = t[d.getEnd()] === '\n' ? d.getEnd() + 1 : d.getEnd();
    return t.slice(0, d.getStart()) + (line ? line + '\n' : '') + t.slice(end);
  }
  if (!line) return t;
  const anchor = after.map((a) => importOf(sf, a, file, false) ?? importOf(sf, a, file, true)).find(Boolean)
    ?? sf.statements.filter(ts.isImportDeclaration).at(-1) ?? fail(`${file}: no import to follow`);
  return t.slice(0, anchor.getEnd()) + '\n' + line + t.slice(anchor.getEnd());
};
const MAP = 'src/game/map.ts', TYPES = 'src/game/types.ts', ATLAS = 'src/game/atlas.ts', PLAN_FILE = 'src/content/atlas.ts';
let files = 0;
for (const [file, es] of edits) {
  let t = apply(read(file), es);
  let sf = parse(file, t);
  if (t.includes('anchored(')) t = setImport(file, t, MAP, () => true, ['anchored'], [MAP]);
  sf = parse(file, t);
  const facings = FACING.filter((f) => used(sf, f));
  t = setImport(file, t, TYPES, (n) => !FACING.includes(n), facings, [MAP]);
  if (t.includes('laid(PLAN')) {
    t = setImport(file, t, ATLAS, () => true, ['laid'], [ATLAS]);
    t = setImport(file, t, PLAN_FILE, () => true, ['PLAN'], [ATLAS]);
  }
  writeFileSync(ROOT + file, t);
  files++;
}
if (!files) console.log('Nothing left to move');
else {
  console.log(`${written.length} exits to an anchor (${counts.start} start, ${counts.named} named), ${fresh.reduce((n, l) => n + l.split(', ').length, 0)} anchors on ${fresh.length} maps, ${places} places by their box; ${files} files`);
  for (const l of fresh) console.log(l);
}
