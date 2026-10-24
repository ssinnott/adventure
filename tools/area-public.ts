// #992's one-off (part of #848), committed first and deleted last, as #968's was: gives each area a public.ts,
// names every item of its items.ts and points every import that crosses from one area into another at that
// area's public.ts, then strikes the rows of the layers' KNOWN that no longer cross. From the root:
// `node tools/area-public.ts`. Run again on a tree it has done, it prints `Nothing left to move`.
import ts from 'typescript';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { posix } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const SELF = 'tools/area-public.ts';
/** The areas in road order, each by the name a sentence gives it. */
const AREAS: Record<string, string> = {
  shelf: 'the Foreland', thornmark: 'Thornmark', saltreach: 'Saltreach', wrackholm: 'Wrackholm', sunderwood: 'Sunderwood',
  kilns: 'the Kilns', cairnmoor: 'Cairnmoor', rimewater: 'Rimewater', whitespine: 'the Whitespine', ashfall: 'Ashfall',
  glasswold: 'the Glasswold', hearth: 'Hearth Isle',
};
const dir = (a: string): string => `src/content/areas/${a}`;
const publicOf = (a: string): string => `${dir(a)}/public.ts`;
const areaOf = (f: string): string | undefined => /^src\/content\/areas\/([^/]+)\//.exec(f)?.[1];
const isWalkthrough = (f: string): boolean => /^src\/content\/areas\/[^/]+\/walkthrough\.ts$/.test(f);

const texts = new Map<string, string>();
const changed = new Set<string>();
const read = (f: string): string => texts.get(f) ?? (existsSync(ROOT + f) ? readFileSync(ROOT + f, 'utf8') : '');
const write = (f: string, t: string): void => { if (t !== read(f)) { texts.set(f, t); changed.add(f); } };
const flush = (): void => { for (const f of changed) writeFileSync(ROOT + f, texts.get(f)!); };

const walk = (d: string): string[] => readdirSync(ROOT + d).flatMap((n) => {
  const p = `${d}/${n}`;
  return statSync(ROOT + p).isDirectory() ? walk(p) : p.endsWith('.ts') ? [p] : [];
});
const FILES = [...walk('src').filter((f) => !f.startsWith('src/lib/')), ...walk('tools').filter((f) => f !== SELF)];

const parse = (f: string, t = read(f)): ts.SourceFile => ts.createSourceFile(f, t, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
const target = (from: string, spec: string): string => posix.normalize(posix.join(posix.dirname(from), spec));
const specTo = (from: string, to: string): string => { const r = posix.relative(posix.dirname(from), to); return r.startsWith('.') ? r : './' + r; };
const lineStart = (t: string, p: number): number => t.lastIndexOf('\n', p - 1) + 1;
const lineEnd = (t: string, p: number): number => { const i = t.indexOf('\n', p); return i < 0 ? t.length : i + 1; };
const exported = (s: ts.Statement): boolean => !!ts.getModifiers(s as ts.HasModifiers)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
const camel = (id: string): string => id.replace(/\+(\d+)/g, 'Plus$1').replace(/[_-]+([a-z0-9])/g, (_, c: string) => c.toUpperCase());

type Edit = [number, number, string];
const apply = (t: string, edits: Edit[]): string => {
  let out = t, floor = Infinity;
  for (const [s, e, r] of [...edits].sort((a, b) => b[0] - a[0] || b[1] - a[1])) {
    if (e > floor) throw new Error(`overlapping edits at ${s}`);
    out = out.slice(0, s) + r + out.slice(e);
    floor = s;
  }
  return out;
};

/** A runtime import of names by a relative path: the file it takes and each name as `name`, `local` and its text. */
interface Imp { node: ts.ImportDeclaration; spec: string; to: string; specs: { name: string; local: string; text: string }[] }
const named = (f: string, sf: ts.SourceFile): Imp[] => sf.statements.flatMap((s): Imp[] => {
  if (!ts.isImportDeclaration(s) || !ts.isStringLiteral(s.moduleSpecifier) || !s.importClause || s.importClause.isTypeOnly || s.importClause.name) return [];
  const nb = s.importClause.namedBindings, spec = s.moduleSpecifier.text;
  if (!nb || !ts.isNamedImports(nb) || !spec.startsWith('.')) return [];
  return [{ node: s, spec, to: target(f, spec), specs: nb.elements.map((e) => ({ name: (e.propertyName ?? e.name).text, local: e.name.text, text: e.getText() })) }];
});
const importText = (spec: string, names: readonly string[], type = false): string => `import ${type ? 'type ' : ''}{ ${names.join(', ')} } from '${spec}';`;

/** The identifiers a node reads: not a property's name, a declaration's own name or an import's binding. */
const refs = (node: ts.Node): ts.Identifier[] => {
  const out: ts.Identifier[] = [];
  const visit = (n: ts.Node): void => {
    if (ts.isIdentifier(n)) {
      const p = n.parent;
      const named = ((ts.isPropertyAccessExpression(p) || ts.isQualifiedName(p)) && (ts.isPropertyAccessExpression(p) ? p.name : p.right) === n)
        || ((ts.isPropertyAssignment(p) || ts.isPropertySignature(p) || ts.isVariableDeclaration(p) || ts.isFunctionDeclaration(p) || ts.isParameter(p) || ts.isBindingElement(p)) && p.name === n)
        || ts.isImportSpecifier(p) || ts.isImportClause(p) || ts.isNamespaceImport(p);
      if (!named) out.push(n);
    }
    ts.forEachChild(n, visit);
  };
  visit(node);
  return out;
};
/** The comments right above a statement, with no blank line between them or under the last. */
const attached = (t: string, s: ts.Node): ts.CommentRange[] => {
  const all = ts.getLeadingCommentRanges(t, s.pos) ?? [];
  const out: ts.CommentRange[] = [];
  let next = s.getStart();
  for (let i = all.length - 1; i >= 0; i--) {
    if ((t.slice(all[i].end, next).match(/\n/g) ?? []).length > 1) break;
    out.unshift(all[i]);
    next = all[i].pos;
  }
  return out;
};
const rename = (f: string, t: string, from: string, to: string): string =>
  apply(t, refs(parse(f, t)).filter((r) => r.text === from).map((r): Edit => [r.getStart(), r.getEnd(), to]));

const count = { named: new Map<string, number>(), exported: 0, lookups: 0, anchors: new Map<string, string[]>(), renamed: [] as string[], rewired: new Set<string>(), imports: 0, chapters: 0, rows: 0 };

// ---- What the modules hold, read before anything is written ----------------------------------------------
const ids = new Map<string, string[]>(), chapterIds = new Map<string, string>();
for (const a of Object.keys(AREAS)) {
  ids.set(a, ((await import(pathToFileURL(ROOT + `${dir(a)}/items.ts`).href)) as { ITEMS: readonly { id: string }[] }).ITEMS.map((i) => i.id));
  const c = ((await import(pathToFileURL(ROOT + `${dir(a)}/chapter.ts`).href)) as { CHAPTER?: { id: string } }).CHAPTER;
  if (c) chapterIds.set(a, c.id);
}

// ---- 1. Every item of an items.ts a const of its own, by the name of its id --------------------------------
const itemNames = new Map<string, Map<string, string>>();
for (const a of Object.keys(AREAS)) {
  const f = `${dir(a)}/items.ts`, t = read(f), sf = parse(f, t);
  const top = new Map<string, ts.VariableStatement>(), taken = new Set<string>();
  for (const s of sf.statements) {
    if (ts.isVariableStatement(s)) for (const d of s.declarationList.declarations) if (ts.isIdentifier(d.name)) { top.set(d.name.text, s); taken.add(d.name.text); }
    if (ts.isFunctionDeclaration(s) && s.name) taken.add(s.name.text);
    if (ts.isImportDeclaration(s) && s.importClause) {
      if (s.importClause.name) taken.add(s.importClause.name.text);
      const nb = s.importClause.namedBindings;
      if (nb && ts.isNamedImports(nb)) for (const e of nb.elements) taken.add(e.name.text);
    }
  }
  const decl = (n: string): ts.VariableDeclaration | undefined => top.get(n)?.declarationList.declarations.find((d) => ts.isIdentifier(d.name) && d.name.text === n);
  const elems: { el: ts.Expression; arr: ts.ArrayLiteralExpression }[] = [];
  const expand = (arr: ts.ArrayLiteralExpression): void => {
    for (const el of arr.elements) {
      if (!ts.isSpreadElement(el)) { elems.push({ el, arr }); continue; }
      const init = ts.isIdentifier(el.expression) ? decl(el.expression.text)?.initializer : undefined;
      if (!init || !ts.isArrayLiteralExpression(init)) throw new Error(`${f}: ITEMS spreads ${el.getText()}, no array of the file`);
      expand(init);
    }
    const tail = t.slice(arr.elements.at(-1)?.end ?? arr.getStart(), arr.getEnd());
    if (/\/\/|\/\*/.test(tail)) throw new Error(`${f}: a comment after an array's last item`);
  };
  const init = decl('ITEMS')?.initializer;
  if (!init || !ts.isArrayLiteralExpression(init)) throw new Error(`${f}: no ITEMS array`);
  expand(init);
  const want = ids.get(a)!;
  if (elems.length !== want.length) throw new Error(`${f}: ${elems.length} elements in its arrays, ${want.length} items in ITEMS`);
  const names = new Map<string, string>(), edits: Edit[] = [], toExport = new Set<ts.VariableStatement>();
  const hoist = new Map<ts.ArrayLiteralExpression, string[]>();
  elems.forEach(({ el, arr }, i) => {
    const id = want[i];
    if (ts.isIdentifier(el)) {
      const s = top.get(el.text);
      if (!s) throw new Error(`${f}: ITEMS names ${el.text}, no const of the file`);
      if (!exported(s)) toExport.add(s);
      names.set(id, el.text);
      return;
    }
    const name = camel(id);
    if (taken.has(name) || !/^[A-Za-z_$][\w$]*$/.test(name)) throw new Error(`${f}: '${id}' would be ${name}, a name taken`);
    taken.add(name);
    names.set(id, name);
    const pre = t.slice(lineStart(t, el.getStart()), el.getStart()), indent = /^\s*$/.test(pre) ? pre : '';
    const dedent = (s: string): string => s.split('\n').map((l, j) => j && indent && l.startsWith(indent) ? l.slice(indent.length) : l).join('\n');
    const cs = ts.getLeadingCommentRanges(t, el.pos) ?? [];
    const comments = cs.map((c) => dedent(t.slice(c.pos, c.end)) + '\n').join('');
    const typed = ts.isObjectLiteralExpression(el) ? ': ItemDef' : '';
    (hoist.get(arr) ?? hoist.set(arr, []).get(arr)!).push(`${comments}export const ${name}${typed} = ${dedent(el.getText())};\n`);
    if (cs.length) {
      const from = lineStart(t, cs[0].pos);
      if (t.slice(from, cs[0].pos).trim()) throw new Error(`${f}: a comment of '${id}' shares a line`);
      edits.push([from, el.getEnd(), indent + name]);
    } else edits.push([el.getStart(), el.getEnd(), name]);
  });
  for (const s of toExport) edits.push([s.getStart(), s.getStart(), 'export ']);
  for (const [arr, lines] of hoist) {
    let s: ts.Node = arr;
    while (!ts.isVariableStatement(s)) s = s.parent;
    const cs = attached(t, s);
    edits.push([lineStart(t, cs.length ? cs[0].pos : s.getStart()), lineStart(t, cs.length ? cs[0].pos : s.getStart()), lines.join('') + '\n']);
  }
  write(f, apply(t, edits));
  itemNames.set(a, names);
  count.named.set(a, [...hoist.values()].reduce((n, l) => n + l.length, 0));
  count.exported += toExport.size;
}

// ---- 2. The lookups of another area's table by an id become imports of the item's name --------------------
for (const a of Object.keys(AREAS)) {
  const f = `${dir(a)}/items.ts`;
  let t = read(f);
  for (const imp of named(f, parse(f, t))) {
    const from = areaOf(imp.to);
    if (!from || from === a || !imp.to.endsWith('/items.ts')) continue;
    for (const s of imp.specs) {
      if (s.name !== 'ITEMS') continue;
      const want: string[] = [];
      t = t.replace(new RegExp(`\\b${s.local}\\.find\\(\\(i\\) => i\\.id === '([^']+)'\\)!`, 'g'), (_, id: string) => {
        const n = itemNames.get(from)!.get(id);
        if (!n) throw new Error(`${f}: no item '${id}' in ${from}`);
        if (!want.includes(n)) want.push(n);
        count.lookups++;
        return n;
      });
      if (!want.length) throw new Error(`${f}: takes ${from}'s ITEMS as ${s.local} for no lookup`);
      t = t.replace(new RegExp(`\\bITEMS as ${s.local}\\b`), want.join(', '));
    }
  }
  // `const plate = plate;` goes, and the blank line it would leave doubled.
  const out: string[] = [];
  let cut = false;
  for (const l of t.split('\n')) {
    if (/^const (\w+) = \1;$/.test(l)) { cut = true; continue; }
    if (!(cut && l === '' && out.at(-1) === '')) out.push(l);
    cut = false;
  }
  write(f, out.join('\n'));
}

// ---- 3. The flags and exits another area takes, declared in public.ts and imported back where they stood ---
const declares = (f: string, n: string): boolean => parse(f).statements.some((s) => ts.isVariableStatement(s) && exported(s)
  && s.declarationList.declarations.some((d) => ts.isIdentifier(d.name) && d.name.text === n));
const inPublic = new Map<string, Set<string>>();
for (const a of Object.keys(AREAS)) inPublic.set(a, new Set(read(publicOf(a)) ? refsDeclared(publicOf(a)) : []));
function refsDeclared(f: string): string[] {
  return parse(f).statements.flatMap((s) => ts.isVariableStatement(s) ? s.declarationList.declarations.flatMap((d) => ts.isIdentifier(d.name) ? [d.name.text] : []) : []);
}
const wanted = new Map<string, Set<string>>();
for (const f of FILES) {
  const from = areaOf(f);
  if (!from) continue;
  for (const imp of named(f, parse(f))) {
    const to = areaOf(imp.to);
    if (!to || to === from || isWalkthrough(imp.to) || imp.to.endsWith('/items.ts') || imp.to === publicOf(to)) continue;
    for (const s of imp.specs) {
      if ((s.name === 'CHAPTER' && imp.to === `${dir(to)}/chapter.ts`) || inPublic.get(to)!.has(s.name)) continue;
      (wanted.get(imp.to) ?? wanted.set(imp.to, new Set()).get(imp.to)!).add(s.name);
    }
  }
}
const moved = new Map<string, Map<string, string>>();
const groups = new Map<string, { file: string; text: string }[]>();
const pubImports = new Map<string, Map<string, Set<string>>>();
for (const [f, names] of [...wanted].sort(([x], [y]) => x < y ? -1 : 1)) {
  const a = areaOf(f)!, siblings = FILES.filter((g) => g !== f && areaOf(g) === a && !g.endsWith('/public.ts'));
  let t = read(f);
  const sf = parse(f, t), as = new Map<string, string>();
  for (const n of names) {
    const clash = siblings.some((g) => declares(g, n));
    as.set(n, clash ? `${posix.basename(f, '.ts').replace(/_[a-z]\d+$/, '').toUpperCase()}_${n}` : n);
    if (clash) count.renamed.push(`${n} of ${posix.basename(f)} as ${as.get(n)}`);
  }
  const edits: Edit[] = [], cuts: [number, number][] = [], out: string[] = [], needed = new Set<string>(), here = new Map<string, string>();
  for (const s of sf.statements) {
    if (!ts.isVariableStatement(s)) continue;
    const ds = s.declarationList.declarations, mv = ds.filter((d) => ts.isIdentifier(d.name) && names.has(d.name.text));
    if (!mv.length) continue;
    if (!exported(s)) throw new Error(`${f}: ${mv[0].name.getText()} is not exported`);
    const text = (d: ts.VariableDeclaration): string => { const n = d.name.getText(); return as.get(n)! + d.getText().slice(n.length); };
    for (const d of mv) { for (const r of refs(d)) needed.add(r.text); here.set(d.name.getText(), as.get(d.name.getText())!); }
    if (mv.length === ds.length) {
      const cs = attached(t, s), from = lineStart(t, cs.length ? cs[0].pos : s.getStart());
      out.push(cs.map((c) => t.slice(c.pos, c.end) + '\n').join('') + `export const ${mv.map(text).join(', ')};`);
      cuts.push([from, lineEnd(t, s.getEnd())]);
    } else {
      out.push(`export const ${mv.map(text).join(', ')};`);
      edits.push([s.getStart(), s.getEnd(), `export const ${ds.filter((d) => !mv.includes(d)).map((d) => d.getText()).join(', ')};`]);
    }
  }
  if (here.size !== names.size) throw new Error(`${f}: declares ${[...here.keys()].join(', ')} of ${[...names].join(', ')}`);
  // Statements cut one after another are one cut; a cut between two blank lines takes one of them with it.
  for (const [from, to] of cuts.sort((x, y) => x[0] - y[0]).reduce((m: [number, number][], c) => {
    if (m.length && m[m.length - 1][1] === c[0]) m[m.length - 1][1] = c[1]; else m.push([c[0], c[1]]);
    return m;
  }, [])) edits.push([from, t.slice(from - 2, from) === '\n\n' && t[to] === '\n' ? to + 1 : to, '']);
  // What the declarations read, from the file's imports; nothing of the area's own.
  const ownTop = new Set(refsDeclared(f));
  for (const n of needed) {
    if (here.has(n)) continue;
    let found = false;
    for (const s of sf.statements) {
      if (!ts.isImportDeclaration(s) || !s.importClause?.namedBindings || !ts.isNamedImports(s.importClause.namedBindings)) continue;
      for (const e of s.importClause.namedBindings.elements) if (e.name.text === n) {
        const to = target(f, (s.moduleSpecifier as ts.StringLiteral).text);
        if (areaOf(to) === a) throw new Error(`${f}: an anchor reads ${n}, the area's own`);
        const key = `${s.importClause.isTypeOnly || e.isTypeOnly ? 'type ' : ''}${to}`, m = pubImports.get(a) ?? pubImports.set(a, new Map()).get(a)!;
        (m.get(key) ?? m.set(key, new Set()).get(key)!).add(e.getText().replace(/^type /, ''));
        found = true;
      }
    }
    if (!found && ownTop.has(n)) throw new Error(`${f}: an anchor reads ${n}, the file's own`);
  }
  t = apply(t, edits);
  for (const [n, nn] of as) if (n !== nn) t = rename(f, t, n, nn);
  // Imported back where it is read; an import the declarations alone read goes.
  let sf2 = parse(f, t);
  const used = new Set(refs(sf2).map((r) => r.text));
  const back = [...here.values()].filter((n) => used.has(n));
  const drop: Edit[] = [];
  for (const s of sf2.statements) {
    if (!ts.isImportDeclaration(s) || !s.importClause?.namedBindings || !ts.isNamedImports(s.importClause.namedBindings)) continue;
    const els = s.importClause.namedBindings.elements, keep = els.filter((e) => !needed.has(e.name.text) || used.has(e.name.text));
    if (keep.length === els.length) continue;
    drop.push(keep.length ? [s.getStart(), s.getEnd(), importText((s.moduleSpecifier as ts.StringLiteral).text, keep.map((e) => e.getText()), s.importClause.isTypeOnly)]
      : [lineStart(t, s.getStart()), lineEnd(t, s.getEnd()), '']);
  }
  t = apply(t, drop);
  if (back.length) {
    sf2 = parse(f, t);
    const last = sf2.statements.filter(ts.isImportDeclaration).at(-1)!;
    t = apply(t, [[lineEnd(t, last.getEnd()), lineEnd(t, last.getEnd()), importText(specTo(f, publicOf(a)), back) + '\n']]);
  }
  write(f, t);
  moved.set(f, here);
  (groups.get(a) ?? groups.set(a, []).get(a)!).push({ file: posix.relative(dir(a), f), text: out.join('\n') });
  for (const n of here.values()) inPublic.get(a)!.add(n);
  (count.anchors.get(a) ?? count.anchors.set(a, []).get(a)!).push(...here.values());
}

// ---- 4. Every import of an anchor, and every import from another area, through that area's public.ts ------
for (const f of FILES) {
  if (f.endsWith('/public.ts')) continue;
  const t = read(f), sf = parse(f, t), from = areaOf(f), imps = named(f, sf);
  const pubs = new Map<string, { imp?: Imp; anchor: Imp; names: string[] }>();
  for (const imp of imps) { const to = areaOf(imp.to); if (to && imp.to === publicOf(to)) pubs.set(imp.to, { imp, anchor: imp, names: imp.specs.map((s) => s.text) }); }
  const plan = new Map<Imp, string[]>(), renames = new Map<string, string>();
  for (const imp of imps) {
    const to = areaOf(imp.to);
    if (!to || imp.to === publicOf(to) || isWalkthrough(imp.to)) continue;
    const mv = moved.get(imp.to), keep: string[] = [], take: string[] = [];
    for (const s of imp.specs) {
      const nn = mv?.get(s.name);
      if (nn !== undefined) {
        if (s.local === s.name && nn !== s.name) renames.set(s.name, nn);
        take.push(s.local === s.name || s.local === nn ? nn : `${nn} as ${s.local}`);
      } else if (from && from !== to && !(s.name === 'CHAPTER' && imp.to === `${dir(to)}/chapter.ts`)) take.push(s.text);
      else keep.push(s.text);
    }
    if (!take.length) continue;
    plan.set(imp, keep);
    const p = pubs.get(publicOf(to)) ?? pubs.set(publicOf(to), { anchor: imp, names: [] }).get(publicOf(to))!;
    for (const n of take) if (!p.names.includes(n)) p.names.push(n);
    count.imports++;
  }
  if (!plan.size) continue;
  const text = new Map<Imp, string>();
  for (const [imp, keep] of plan) text.set(imp, keep.length ? importText(imp.spec, keep) : '');
  for (const [pub, p] of pubs) {
    const line = importText(specTo(f, pub), p.names);
    if (p.imp) text.set(p.imp, line);
    else { const cur = text.get(p.anchor)!; text.set(p.anchor, cur ? `${cur}\n${line}` : line); }
  }
  let u = apply(t, [...text].map(([imp, s]): Edit => s ? [imp.node.getStart(), imp.node.getEnd(), s] : [lineStart(t, imp.node.getStart()), lineEnd(t, imp.node.getEnd()), '']));
  for (const [n, nn] of renames) u = rename(f, u, n, nn);
  write(f, u);
  count.rewired.add(f);
}

// ---- 5. A walkthrough takes another area's chapter from the quest by its id, not from its file -------------
for (const f of FILES.filter(isWalkthrough)) {
  const t = read(f), sf = parse(f, t), from = areaOf(f)!, imps = named(f, sf);
  const chapters: [string, string][] = [], edits: Edit[] = [];
  let first: Imp | undefined;
  for (const imp of imps) {
    const to = areaOf(imp.to);
    if (!to || to === from || imp.to !== `${dir(to)}/chapter.ts`) continue;
    if (imp.specs.some((s) => s.name !== 'CHAPTER')) throw new Error(`${f}: takes more than CHAPTER from ${imp.to}`);
    chapters.push([imp.specs[0].local, chapterIds.get(to)!]);
    edits.push([lineStart(t, imp.node.getStart()), lineEnd(t, imp.node.getEnd()), '']);
    first ??= imp;
  }
  if (!first) continue;
  const index = imps.filter((i) => i.to === 'src/content/index.ts');
  if (!index.some((i) => i.specs.some((s) => s.local === 'THE_QUEST'))) {
    if (index.length) edits.push([index[0].node.getStart(), index[0].node.getEnd(), importText(index[0].spec, [...index[0].specs.map((s) => s.text), 'THE_QUEST'])]);
    else edits[0] = [first.node.getStart(), first.node.getEnd(), importText(specTo(f, 'src/content/index.ts'), ['THE_QUEST'])];
  }
  const last = sf.statements.filter(ts.isImportDeclaration).at(-1)!, at = lineEnd(t, last.getEnd());
  const why = chapters.length > 1 ? "Other areas' chapters, taken from the quest by their ids and not from their files" : "Another area's chapter, taken from the quest by its id and not from its file";
  edits.push([at, at, `\n// ${why} (#992).\n${chapters.map(([l, id]) => `const ${l} = THE_QUEST.chapters.find((c) => c.id === '${id}')!;\n`).join('')}`]);
  write(f, apply(t, edits));
  count.chapters += chapters.length;
}

// ---- 6. Each area's public.ts --------------------------------------------------------------------------------
for (const a of Object.keys(AREAS)) {
  const p = publicOf(a), cur = read(p), gs = (groups.get(a) ?? []).sort((x, y) => x.file < y.file ? -1 : 1);
  const order = (k: string): string => (k.startsWith('type ') ? '0' : '1') + k.replace(/^type /, '');
  const lines = [...(pubImports.get(a) ?? new Map<string, Set<string>>())].sort(([x], [y]) => order(x) < order(y) ? -1 : 1)
    .map(([key, names]) => importText(specTo(p, key.replace(/^type /, '')), [...names], key.startsWith('type ')));
  const body = gs.map((g) => `// From ${g.file}.\n${g.text}\n`).join('\n');
  const ITEMS_LINE = `// Every item by name, with the rest of items.ts.\nexport * from './items.ts';\n`;
  if (!cur) {
    write(p, `// The way into ${AREAS[a]} from another area, and the only one (#992; EXPANSION §8.2): the flags and\n`
      + `// exits the others take, declared here and imported back by the files they stood in, and every item by name.\n`
      + (lines.length ? lines.join('\n') + '\n' : '') + '\n' + (body ? body + '\n' : '') + ITEMS_LINE);
  } else if (gs.length) {
    if (!cur.includes(ITEMS_LINE)) throw new Error(`${p}: its last lines are not the items'`);
    let t = cur.replace(ITEMS_LINE, body + '\n' + ITEMS_LINE);
    for (const line of lines) if (!t.includes(line)) {
      const last = parse(p, t).statements.filter(ts.isImportDeclaration).at(-1);
      const at = last ? lineEnd(t, last.getEnd()) : t.indexOf('\n\n') + 1;
      t = t.slice(0, at) + line + '\n' + t.slice(at);
    }
    write(p, t);
  }
}
flush();

// ---- 7. The layers' KNOWN: each row of A6 that no longer crosses goes, and the key with the last ------------
const L = 'tools/tests/layers.ts';
const { graph, treeFiles } = await import(pathToFileURL(ROOT + 'tools/kit/graph.ts').href) as typeof import('./kit/graph.ts');
const { crossings } = await import(pathToFileURL(ROOT + L).href) as typeof import('./tests/layers.ts');
const cross = crossings(graph(treeFiles(), (f) => readFileSync(ROOT + f, 'utf8')));
let lt = read(L);
const block = /^ {2}A6: \[\n((?: {4}'.*',\n)*) {2}\],\n/m.exec(lt);
if (block) {
  const rows = block[1].split('\n').filter(Boolean), keep = rows.filter((r) => cross.has(r.trim().slice(1, -2)));
  count.rows = rows.length - keep.length;
  lt = lt.replace(block[0], keep.length ? `  A6: [\n${keep.map((r) => r + '\n').join('')}  ],\n` : '');
}
if (!/^ {2}A6: \[/m.test(lt)) {
  lt = lt.replace(`  A6: "each area's public.ts, the one way into it",\n`, '')
    .replaceAll("A6: ['src/content/areas/x/maps/m.ts > src/content/areas/y/maps/n.ts']", "K8: ['src/content/areas/x/maps/m.ts > src/content/areas/y/maps/n.ts']");
}
write(L, lt);
flush();

if (!changed.size) console.log('Nothing left to move');
else {
  const n = [...count.named.values()].reduce((s, k) => s + k, 0);
  console.log(`${changed.size} files written`);
  console.log(`items named: ${n} hoisted (${[...count.named].filter(([, k]) => k).map(([a, k]) => `${a} ${k}`).join(', ')}), ${count.exported} consts exported; lookups by id: ${count.lookups}`);
  console.log(`anchors declared in public.ts: ${[...count.anchors.values()].reduce((s, l) => s + l.length, 0)} (${[...count.anchors].map(([a, l]) => `${a} ${l.length}`).join(', ')})${count.renamed.length ? `; renamed: ${count.renamed.join(', ')}` : ''}`);
  console.log(`imports through a public.ts: ${count.imports} in ${count.rewired.size} files; chapters from the quest: ${count.chapters}; KNOWN rows struck: ${count.rows}`);
  for (const [a, l] of count.anchors) console.log(`  ${a}: ${l.join(' ')}`);
}
