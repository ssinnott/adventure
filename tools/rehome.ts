// One-off (#985), committed first and deleted last: the helpers the twelve walkthroughs write out
// each for itself go to tools/kit/walk.ts and tools/kit/grid.ts, and every import of tools/walk.ts
// names the kit. Each helper is found by its name and its first line: a copy is deleted and its
// calls, within the scope it was declared in, take what the kit's takes; a variant that does another
// thing is renamed where it stands. Run again over a tree it has rewritten, it finds nothing.
//   node tools/rehome.ts [--dry]          rewrite (or say what it would rewrite)
//   node tools/rehome.ts --prune <file>   drop the imports a `tsc --noUnusedLocals` run, saved to <file>, finds unused
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DRY = process.argv.includes('--dry');
const AREAS = ['ashfall', 'cairnmoor', 'glasswold', 'hearth', 'kilns', 'rimewater', 'saltreach', 'shelf', 'sunderwood', 'thornmark', 'whitespine', 'wrackholm'];
const walkthrough = (a: string): string => `src/content/areas/${a}/walkthrough.ts`;
const read = (f: string): string => readFileSync(ROOT + f, 'utf8');
const write = (f: string, s: string): void => { if (!DRY) writeFileSync(ROOT + f, s); };

// ---- The lexer: which characters are code (not a string, a comment or a template's text) --------

function mask(src: string): Uint8Array {
  const m = new Uint8Array(src.length), n = src.length, holes: number[] = [];
  let i = 0, depth = 0, tpl = false, last = '', word = '';
  while (i < n) {
    const c = src[i];
    if (tpl) {
      if (c === '\\') { i += 2; continue; }
      if (c === '`') { tpl = false; i++; last = 'x'; continue; }
      if (c === '$' && src[i + 1] === '{') { holes.push(depth); depth++; tpl = false; i += 2; last = '{'; continue; }
      i++; continue;
    }
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') { const e = src.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; continue; }
    if (c === "'" || c === '"') { i++; while (i < n && src[i] !== c) { if (src[i] === '\\') i++; i++; } i++; last = 'x'; word = ''; continue; }
    if (c === '`') { tpl = true; i++; continue; }
    if (c === '/' && ('(,=:[!&|?{};+-*%<>~^'.includes(last) || last === '' || ['return', 'typeof', 'case', 'of', 'in'].includes(word))) {
      i++; let cls = false;
      while (i < n && (src[i] !== '/' || cls)) { if (src[i] === '\\') i++; else if (src[i] === '[') cls = true; else if (src[i] === ']') cls = false; i++; }
      i++; while (/[a-z]/.test(src[i] ?? '')) i++;
      last = 'x'; word = ''; continue;
    }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (holes.length && holes[holes.length - 1] === depth) { holes.pop(); tpl = true; i++; continue; } }
    m[i] = 1;
    if (/[\w$]/.test(c)) { word = /[\w$]/.test(src[i - 1] ?? '') ? word + c : c; last = 'w'; }
    else if (!/\s/.test(c)) { last = c; word = ''; }
    i++;
  }
  return m;
}

/** Past the end of the statement begun at `i`: a declaration's closing brace at the end of a line, or a `;` at depth 0. */
function end(src: string, m: Uint8Array, i: number, fn: boolean): number {
  let depth = 0;
  for (; i < src.length; i++) {
    if (!m[i]) continue;
    const c = src[i];
    if ('([{'.includes(c)) depth++;
    else if (')]}'.includes(c)) {
      depth--;
      if (fn && depth === 0 && c === '}' && /^[ \t]*(\n|$)/.test(src.slice(i + 1, i + 3))) return i + 1;
    } else if (c === ';' && depth === 0 && !fn) return i + 1;
  }
  return src.length;
}

const lineOf = (src: string, i: number): number => src.slice(0, i).split('\n').length;
const lineStart = (src: string, i: number): number => src.lastIndexOf('\n', i - 1) + 1;

interface Decl { name: string; s: number; e: number; col: number; first: string; stmtS: number; stmtE: number; multi: boolean; idx: number; prevE: number; nextS: number }

const SPECIAL = new Set(['ALL', 'HIRE']);

function isArrow(init: string): boolean {
  const t = init.trim().replace(/^async\s+/, '');
  if (/^(function\b|[\w$]+\s*=>)/.test(t)) return true;
  let i = 0;
  if (t[0] === '<') { let d = 0; for (; i < t.length; i++) { if (t[i] === '<') d++; else if (t[i] === '>') { d--; if (!d) { i++; break; } } } }
  if (t[i] !== '(') return false;
  let d = 0;
  for (; i < t.length; i++) { if (t[i] === '(') d++; else if (t[i] === ')') { d--; if (!d) break; } }
  return /^\s*(=>|:)/.test(t.slice(i + 1));
}

/** The function declarations and const arrows at column 0 or 2, each with its statement. */
function decls(src: string, m: Uint8Array): Decl[] {
  const out: Decl[] = [];
  const re = /^( {0,2})(?=\S)(?:(?:export\s+)?(?:async\s+)?function\s*\*?\s*([\w$]+)|(?:export\s+)?const\s+)/gm;
  let r: RegExpExecArray | null;
  while ((r = re.exec(src))) {
    const col = r[1].length, s = r.index + col;
    if (col === 1 || !m[s]) continue;
    if (r[2]) {
      const e = end(src, m, s, true);
      out.push({ name: r[2], s, e, col, first: src.slice(s, src.indexOf('\n', s)), stmtS: s, stmtE: e, multi: false, idx: 0, prevE: s, nextS: e });
      continue;
    }
    const e = end(src, m, s, false), body = s + r[0].length - col;
    const cuts: number[] = [body];
    let depth = 0;
    for (let i = body; i < e - 1; i++) {
      if (!m[i]) continue;
      const c = src[i];
      if ('([{'.includes(c)) depth++;
      else if (')]}'.includes(c)) depth--;
      else if (c === ',' && depth === 0 && /^\s*[\w$]+\s*(?::[^=;]*)?=[^=>]/.test(src.slice(i + 1, i + 200))) cuts.push(i + 1);
    }
    cuts.push(e);
    const n = cuts.length - 1;
    for (let k = 0; k < n; k++) {
      let ds = cuts[k], de = k === n - 1 ? e - 1 : cuts[k + 1] - 1;
      while (/\s/.test(src[ds])) ds++;
      while (/\s/.test(src[de - 1])) de--;
      const text = src.slice(ds, de), nm = /^([\w$]+)\s*(?::[^=]*)?=\s*/.exec(text);
      if (!nm) continue;
      if (!SPECIAL.has(nm[1]) && !isArrow(text.slice(nm[0].length))) continue;
      const nl = src.indexOf('\n', ds);
      out.push({ name: nm[1], s: ds, e: de, col, first: (k === 0 ? src.slice(s, nl) : src.slice(ds, nl < 0 ? de : Math.min(nl, de))), stmtS: s, stmtE: e, multi: n > 1, idx: k, prevE: k > 0 ? cuts[k] - 1 : ds, nextS: k < n - 1 ? cuts[k + 1] + src.slice(cuts[k + 1]).match(/^\s*/)![0].length : de });
    }
  }
  return out;
}

/** The statements at column 0, each [start, end). */
function statements(src: string, m: Uint8Array): [number, number][] {
  const out: [number, number][] = [];
  const re = /^(?![\s})\]*/]|\/\/)(.)/gm;
  let r: RegExpExecArray | null;
  while ((r = re.exec(src))) {
    if (!m[r.index]) continue;
    const fn = /^(export\s+)?(async\s+)?(function|class|interface|enum)\b/.test(src.slice(r.index, r.index + 40));
    const e = end(src, m, r.index, fn);
    out.push([r.index, e]);
    re.lastIndex = Math.max(e, r.index + 1);
  }
  return out;
}

// ---- What moves --------------------------------------------------------------------------------

type Args = string[];
interface Target {
  /** The walkthroughs it is in, or all. */
  in?: string[];
  name: string;
  /** The start of the declaration's first line, at its column. */
  first: string;
  /** Its whole text, at its column, where its first line is another's too. */
  whole?: string;
  act: 'delete' | { rename: string } | { replace: string };
  /** The arguments a call in its scope passes the kit's, from those it passed. */
  args?: (a: Args) => Args;
  /** What a call in its scope calls, and what a bare mention names, in its place. */
  callee?: string;
  bare?: string;
}

/** An argument in parentheses if it is more than a name, a number or a path. */
const p = (t: string): string => /^[\w$.]+$/.test(t) ? t : `(${t})`;
/** 'map:id' from a map and an id: one literal when both are, else a template. */
function at(map: string, id: string): string {
  const lit = (t: string): string | undefined => /^'[^'\\]*'$/.test(t) ? t.slice(1, -1) : undefined;
  const a = lit(map), b = lit(id);
  return a !== undefined && b !== undefined ? `'${a}:${b}'` : `\`${a ?? '${' + map + '}'}:${b ?? '${' + id + '}'}\``;
}
const ins = (k: number, t: string) => (a: Args): Args => [...a.slice(0, k), t, ...a.slice(k)];

const WHOLE_ISLE = `/** The isle's two boxes laid side by side as the world lays them, I6 32 squares on from H6, so that a walk may cross the seam between them. */
const WHOLE_ISLE: MapDef = { ...H6, id: 'hearthisle', features: [], exits: [], secrets: [], encounters: [], rows: H6.rows.map((r, y) => r + RIM.rows[y]) };`;

const TARGETS: Target[] = [
  // tools/kit/walk.ts
  { name: 'said', first: 'const said = (r: ReturnType<typeof w.world.move>): string =>', act: 'delete' },
  { in: ['kilns'], name: 'said', first: "const said = (v: Walk): string[] => { v.world.travel('deep_mines3'", act: { rename: 'below' } },
  { in: ['rimewater'], name: 'said', first: 'const said = (def: typeof M9, name: string): string =>', act: { rename: 'spoken' } },
  { in: ['wrackholm'], name: 'said', first: 'const said = (w: Walk, map: string, id: string): string[] => {', act: { rename: 'eventSays' } },
  { name: 'hear', first: 'const hear = (w: Walk, map: string, p: Person): string =>', act: 'delete' },
  { name: 'hear', first: 'function hear(w: Walk, map: string, p: Person): string {', act: 'delete' },
  { in: ['saltreach'], name: 'hear', first: 'const hear = (p: Person): ReturnType<typeof meet> =>', act: { rename: 'greeting' } },
  { in: ['saltreach'], name: 'hear', first: "const hear = (p: Person): string => { w.world.travel('saltmouth'", act: { rename: 'greet' } },
  { name: 'page', first: 'const page = (w: Walk, id: string) => questLog(w.world.state, w.party).find((v) => v.def.id === id)?.pages[0];', act: 'delete' },
  { name: 'page', first: 'const page = (w: Walk, id: string): PageView | undefined =>', act: 'delete' },
  { in: ['saltreach'], name: 'page', first: "const page = (): QuestView | undefined => questLog(w.world.state, w.party).find((v) => v.def.id === 'nightlight');", act: { rename: 'nightlight' } },
  { in: ['saltreach'], name: 'page', first: "const page = (): QuestView | undefined => questLog(w.world.state, w.party).find((v) => v.def.id === 'star');", act: { rename: 'star' } },
  { in: ['saltreach'], name: 'page', first: 'const page = (): string =>', act: { rename: 'passage' } },
  { in: ['whitespine'], name: 'page', first: 'const page = (w: Walk, id: string) => questLog(w.world.state, w.party).find((v) => v.def.id === id);', act: { rename: 'questOf' } },
  { name: 'there', first: 'const there = (w: Walk, map: string, f: Feature): boolean =>', act: 'delete' },
  { name: 'there', first: 'const there = (w: Walk, map: string, p: Person): boolean =>', act: 'delete' },
  { name: 'there', first: 'const there = (w: Walk, p: Person, map: string): boolean =>', act: 'delete', args: (a) => [a[0], a[2], a[1]] },
  { in: ['kilns'], name: 'there', first: "const there = (w: Walk): boolean => { w.world.travel('ironfells_n2', HARTMUT.x", act: 'delete', args: (a) => [...a, "'ironfells_n2'", 'HARTMUT'] },
  { in: ['sunderwood'], name: 'there', first: "const there = (w: Walk): boolean => { w.world.travel('lanternwood_l3', KEEPER.x", act: 'delete', args: (a) => [...a, "'lanternwood_l3'", 'KEEPER'] },
  { in: ['sunderwood'], name: 'there', first: "const there = (w: Walk): boolean => { w.world.travel('eaves_j3', HERMIT.x", act: 'delete', args: (a) => [...a, "'eaves_j3'", 'HERMIT'] },
  { in: ['ashfall'], name: 'there', first: 'const there = (g: typeof sentinel): boolean =>', act: { rename: 'afoot' } },
  { in: ['ashfall'], name: 'there', first: 'const there = (v: Walk, map: string, g: typeof f10): boolean =>', act: { rename: 'afoot' } },
  { in: ['cairnmoor'], name: 'there', first: 'const there = (z: MapZone, x: number, y: number): boolean =>', act: { rename: 'standsIn' } },
  { name: 'here', first: 'const here = (): string =>', act: 'delete', args: () => ['w'] },
  { in: ['ashfall'], name: 'here', first: "const here = <K extends Feature['kind']>(kind: K)", act: { rename: 'inPort' } },
  { in: ['kilns'], name: 'here', first: "const here = <K extends Feature['kind']>(kind: K)", act: { rename: 'inHaven' } },
  { name: 'written', first: 'const written = (w: Walk): string[] =>', act: 'delete', args: (a) => a.length === 1 ? [a[0], 'CHAPTER'] : a },
  { in: ['glasswold'], name: 'written', first: 'const written = (w: Walk, c = CHAPTER): string[] =>', act: 'delete', args: (a) => a.length === 1 ? [a[0], 'CHAPTER'] : a },
  { in: ['ashfall'], name: 'written', first: 'const written = (id: string): string[] => log(id)', act: { rename: 'entered' } },
  { name: 'reads', first: 'const reads = (w: Walk, id: string, want: readonly string[], not: readonly string[], how: string): void =>', act: 'delete' },
  { name: 'reads', first: 'function reads(w: Walk, id: string, title: string, want: readonly string[], not: readonly string[], how: string): void {', act: 'delete', args: (a) => [a[0], a[1], ...a.slice(3)] },
  { in: ['ashfall', 'glasswold'], name: 'answerTo', first: 'const answerTo = (w: Walk, map: string, p: Person, sets: string): string =>', act: 'delete' },
  // These four named the person in full in the check.
  { in: ['kilns', 'rimewater', 'whitespine'], name: 'answerTo', first: 'const answerTo = (w: Walk, map: string, p: Person, sets: string): string =>', act: 'delete', args: (a) => [...a, 'true'] },
  { in: ['cairnmoor'], name: 'answerTo', first: 'function answerTo(w: Walk, map: string, p: Person, sets: string): string {', act: 'delete', args: (a) => [...a, 'true'] },
  { name: 'answerTo', first: 'function answerTo(w: Walk, map: string, p: Person, sets: string | null): string {', act: 'delete' },
  { name: 'answerTo', first: 'function answerTo(w: Walk, map: string, p: Person, label: string): string {', act: 'delete', args: (a) => [a[0], a[1], a[2], `{ label: ${a[3]} }`] },
  { in: ['ashfall'], name: 'open', first: 'const open = (v: Walk, map: string, id: string): void =>', act: 'delete', args: (a) => [a[0], at(a[1], a[2]), "'skip'", 'false'] },
  { in: ['cairnmoor'], name: 'open', first: 'function open(w: Walk, map: string, id: string): void {', act: 'delete', args: (a) => [a[0], at(a[1], a[2]), "'any'"] },
  { in: ['wrackholm'], name: 'open', first: 'function open(w: Walk, map: string, id: string): readonly string[] {', act: 'delete', args: (a) => [a[0], at(a[1], a[2]), "'any'", 'false'] },
  { name: 'open', first: 'function open(w: Walk, at: string): void {', act: 'delete' },
  { in: ['glasswold'], name: 'open', first: 'const open = (w: Walk, map: string, c: typeof hollow): void =>', act: { rename: 'loot' } },
  { in: ['kilns'], name: 'open', first: 'const open = (x: number, y: number): [number, number][] =>', act: { rename: 'exits' } },
  { in: ['shelf'], name: 'open', first: 'const open = (said: readonly string[]): number =>', act: { rename: 'opened' } },
  { name: 'search', first: 'const search = (map: string, x: number, y: number, facing: Facing, room: string): boolean =>', act: 'delete', args: ins(0, 'w') },
  { in: ['cairnmoor'], name: 'search', first: 'const search = (map: string, x: number, y: number, facing: typeof EAST, room: string): boolean =>', act: 'delete', args: ins(0, 'w') },
  { in: ['kilns'], name: 'search', first: 'const search = (map: string, x: number, y: number, room: string): boolean =>', act: 'delete', args: (a) => ['w', a[0], a[1], a[2], 'EAST', a[3]] },
  { in: ['ashfall'], name: 'search', first: 'const search = (): boolean =>', act: { rename: 'feel' } },
  { name: 'goalOf', first: 'const goalOf = (start: string): string =>', act: 'delete', args: ins(0, 'CHAPTER') },
  { name: 'began', first: 'const began = (w: Walk, title: string): boolean =>', act: 'delete' },
  { name: 'atLevel', first: 'const atLevel = (level: number, s: Step): Step =>', act: 'delete' },
  { name: 'thiefDown', first: 'const thiefDown = (p: Party): void =>', act: 'delete' },
  { name: 'same', first: 'const same = (a: unknown, b: unknown): boolean =>', act: 'delete' },
  { name: 'holding', first: 'const holding = (id: string): string =>', act: 'delete' },
  { name: 'clock', first: 'const clock = (w: Walk, hour: number): void =>', act: 'delete' },
  { name: 'hour', first: 'const hour = (w: Walk, h: number): void =>', act: 'delete' },
  { name: 'keys', first: "keys = (): number => w.party.bag.filter((i) => i === 'key_iron').length", act: 'delete', args: () => ['w'] },
  { name: 'at', first: 'const at = (): string => `${w.world.state.mapId} ${w.world.state.x},${w.world.state.y}`;', act: 'delete', callee: 'here', args: () => ['w'] },
  { in: ['kilns'], name: 'at', first: 'const at = (walk: Walk): string => `${walk.world.state.mapId} ${walk.world.state.x},${walk.world.state.y}`;', act: 'delete', callee: 'here' },
  { name: 'at', first: 'const at = (w: Walk, hour: number): void => { const m = w.world.state.minutes; w.world.state.minutes = m - (m % 1440) + 1440 + hour * 60; };', act: 'delete', callee: 'clock' },
  { name: 'at', first: 'const at = (w: Walk, hour: number): void => { w.world.state.minutes = Math.floor(w.world.state.minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY + hour * 60; };', act: 'delete', callee: 'hour' },
  { name: 'at', first: 'const at = (level: number): Walk => {', whole: 'const at = (level: number): Walk => {\n  const w = newWalk(ok);\n  w.level = level;\n  for (const m of w.party.members) { m.level = level; m.xp = xpForLevel(level); }\n  return w;\n};', act: 'delete', callee: 'walkAt', args: ins(0, 'ok') },
  { name: 'goal', first: "const goal = (w: Walk, id: string): string => page(w, id)?.goal ?? '(no goal)';", act: 'delete' },
  { in: ['saltreach'], name: 'goal', first: "const goal = (): string => questLog(w.world.state, w.party).find((v) => v.def.id === 'compact_crate')", act: { rename: 'crateGoal' } },
  { name: 'xpOf', first: 'const xpOf = (w: Walk): number => w.party.members.reduce((t, m) => t + m.xp, 0);', act: 'delete', args: (a) => [`${p(a[0])}.party`] },
  { name: 'xpOf', first: 'const xpOf = (p: Party): number => p.members.reduce((t, m) => t + m.xp, 0);', act: 'delete' },
  { in: ['shelf'], name: 'HIRE', first: 'export const HIRE: Step =', act: 'delete' },
  { in: ['shelf'], name: 'hired', first: 'export function hired(w: Walk): void {', act: 'delete' },
  { in: ['shelf'], name: 'ledgerGiven', first: 'export function ledgerGiven(w: Walk): void {', act: 'delete' },
  // The rest that two walkthroughs or more wrote alike (#985's second pass).
  { name: 'alive', first: 'const alive = (w: Walk, map: string, id: string): boolean => {', act: 'delete' },
  { name: 'alive', first: 'function alive(w: Walk, map: string, id: string): boolean {', act: 'delete' },
  { name: 'shows', first: 'const shows = (w: Walk, map: string, id: string): boolean => {', act: 'delete' },
  { name: 'shows', first: 'function shows(w: Walk, map: string, id: string): boolean {', act: 'delete' },
  { in: ['shelf'], name: 'shows', first: 'const shows = (w: Walk, id: string): boolean =>', act: { rename: 'inHarrow' } },
  { name: 'who', first: 'function who(map: string, x: number, y: number, name: string): Person {', act: 'delete' },
  { name: 'who', first: 'function who(map: string, x: number, y: number, name: string, flag?: string): Person {', act: 'delete' },
  { name: 'mapOf', first: 'const mapOf = (id: string): MapDef => MAP_DEFS.find((d) => d.id === id)!;', act: 'delete' },
  { name: 'mapOf', first: 'const mapOf = (id: string) => MAP_DEFS.find((d) => d.id === id)!;', act: 'delete' },
  { in: ['shelf', 'thornmark'], name: 'def', first: 'const def = (id: string) => MAP_DEFS.find((d) => d.id === id)!;', act: 'delete', callee: 'mapOf' },
  { name: 'npc', first: 'const npc = (map: string, name: string): Person => mapOf(map).features!.find(', act: 'delete' },
  { name: 'npc', first: 'const npc = (map: string, name: string): Person => MAP_DEFS.find(', act: 'delete' },
  { name: 'npc', first: 'const npc = (map: string, name: string, n = 0): Person =>', act: 'delete' },
  { in: ['whitespine'], name: 'npc', first: 'const npc = (def: MapDef, name: string): Person =>', act: { rename: 'npcOn' } },
  { name: 'ev', first: 'const ev = (map: string, id: string): Feature => mapOf(map).features!.find(', act: 'delete' },
  { name: 'chest', first: 'const chest = (d: MapDef, id: string): Feature | undefined =>', act: 'delete' },
  { name: 'chest', first: "const chest = (def: MapDef, id: string) => def.features!.find((f) => f.kind === 'chest' && f.id === id);", act: 'delete' },
  { name: 'chest', first: "const chest = (d: MapDef, id: string) => d.features!.find((f): f is Extract<Feature, { kind: 'chest' }>", act: 'delete' },
  { name: 'chest', first: 'const chest = (d: MapDef, id: string): string =>', act: 'delete', callee: 'stock' },
  { in: ['saltreach'], name: 'chest', first: 'const chest = (def: MapDef, id: string): string[] =>', act: { rename: 'contents' } },
  { in: ['shelf', 'thornmark'], name: 'taught', first: 'const taught = (id: string) => (def(id).features ?? [])', act: 'delete' },
  { in: ['ashfall', 'hearth'], name: 'log', first: 'const log = (id: string) => questLog(w.world.state, w.party).find((v) => v.def.id === id);', act: 'delete', args: ins(0, 'w') },
  { in: ['whitespine'], name: 'questOf', first: 'const questOf = (w: Walk, id: string) => questLog(w.world.state, w.party).find((v) => v.def.id === id);', act: 'delete', callee: 'log' },
  { in: ['saltreach'], name: 'nightlight', first: "const nightlight = (): QuestView | undefined => questLog(w.world.state, w.party).find((v) => v.def.id === 'nightlight');", act: 'delete', callee: 'log', args: () => ['w', "'nightlight'"] },
  { in: ['saltreach'], name: 'star', first: "const star = (): QuestView | undefined => questLog(w.world.state, w.party).find((v) => v.def.id === 'star');", act: 'delete', callee: 'log', args: () => ['w', "'star'"] },
  { in: ['saltreach'], name: 'bell', first: "const bell = (): QuestView | undefined => questLog(w.world.state, w.party).find((v) => v.def.id === 'tide_bell');", act: 'delete', callee: 'log', args: () => ['w', "'tide_bell'"] },
  { in: ['shelf'], name: 'bell', first: "const bell = (w: Walk) => questLog(w.world.state, w.party).find((v) => v.def.id === 'bell')?.pages[0];", act: 'delete', callee: 'page', args: (a) => [a[0], "'bell'"] },
  { in: ['ashfall', 'sunderwood'], name: 'live', first: 'const live = (v: Walk, at: string): boolean => { const g = group(at);', act: 'delete' },
  { name: 'key', first: "const key = (p: Party): void => { p.bag.push('key_iron'); };", act: 'delete' },
  { in: ['hearth'], name: 'press', first: 'const press = (c: Chest, dress: (p: Party) => void): string => {', act: 'delete', args: (a) => ['RIM.id', 'WEST', ...a] },
  { in: ['whitespine'], name: 'press', first: 'const press = (c: Chest, dress: (p: Party) => void): string => {', act: 'delete', args: (a) => ["'monksvale_j12'", 'SOUTH', ...a] },
  { in: ['wrackholm'], name: 'press', first: 'const press = (c: Chest, dress: (p: Party) => void): string => {', act: 'delete', args: (a) => ['WRACKHOLM_F6.id', 'WEST', ...a] },
  { name: 'key', first: 'const key = (x: number, y: number): number => y * out.width + x;', act: 'delete', callee: 'cell', args: ins(0, 'out') },
  { in: ['ashfall'], name: 'key', first: 'key = (x: number, y: number): number => y * gm.width + x', act: 'delete', callee: 'cell', args: ins(0, 'gm') },
  { name: 'road', first: "const road = (x: number, y: number): boolean => out.at(x, y).ch === '=';", act: 'delete', args: ins(0, 'out') },
  { in: ['kilns', 'rimewater', 'saltreach'], name: 'business', first: "const business = <K extends Feature['kind']>(kind: K): Extract<Feature, { kind: K }>[] => TOWN.features!.filter(", act: 'delete', callee: 'ofKind', args: ins(0, 'TOWN') },
  { in: ['sunderwood'], name: 'business', first: "const business = <K extends Feature['kind']>(kind: K): Extract<Feature, { kind: K }>[] => WATCH.features!.filter(", act: 'delete', callee: 'ofKind', args: ins(0, 'WATCH') },
  { in: ['ashfall'], name: 'inPort', first: "const inPort = <K extends Feature['kind']>(kind: K): Extract<Feature, { kind: K }>[] => PORT.features!.filter(", act: 'delete', callee: 'ofKind', args: ins(0, 'PORT') },
  { in: ['kilns'], name: 'inHaven', first: "const inHaven = <K extends Feature['kind']>(kind: K): Extract<Feature, { kind: K }>[] => HAVEN.features!.filter(", act: 'delete', callee: 'ofKind', args: ins(0, 'HAVEN') },
  { in: ['hearth'], name: 'chestOf', first: "const chestOf = (id: string): Chest => RIM.features!.find(", act: 'delete', callee: 'chest', args: ins(0, 'RIM') },
  { in: ['wrackholm'], name: 'chestOf', first: "const chestOf = (id: string): Chest => WRACKHOLM_F6.features!.find(", act: 'delete', callee: 'chest', args: ins(0, 'WRACKHOLM_F6') },
  { in: ['ashfall'], name: 'inBox', first: 'const inBox = (z: typeof f10, x: number, y: number): boolean => x >= z.x && x < z.x + z.w && y >= z.y && y < z.y + z.h;', act: 'delete' },
  { in: ['glasswold'], name: 'inBox', first: 'const inBox = (x: number, y: number): boolean => x >= d9.x && x < d9.x + d9.w && y >= d9.y && y < d9.y + d9.h;', act: 'delete', args: ins(0, 'd9') },
  { name: 'inside', first: 'const inside = (x: number, y: number, z: typeof ', act: 'delete', callee: 'inBox', args: (a) => [a[2], a[0], a[1]] },
  { name: 'on', first: 'const on = (z: ', act: 'delete' },
  // tools/kit/grid.ts
  { name: 'ALL', first: 'const ALL: Can = { swim: true, climb: true, float: true };', act: 'delete' },
  { name: 'reach', first: 'const reach = (z: MapZone, from: readonly [number, number], can: Can, door?: readonly [number, number]): Set<number> =>', act: 'delete', args: ins(0, 'out') },
  { in: ['glasswold', 'saltreach'], name: 'reach', first: 'const reach = (z: typeof ', act: 'delete', args: ins(0, 'out') },
  { in: ['kilns'], name: 'reach', first: 'const reach = (from: readonly [number, number], can: Can, door?: readonly [number, number], z: MapZone = k6): Set<number> =>', act: 'delete', args: (a) => ['out', a[3] ?? 'k6', a[0], a[1], ...(a[2] !== undefined && a[2] !== 'undefined' ? [a[2]] : [])] },
  { in: ['ashfall'], name: 'reach', first: 'const reach = (fx: number, fy: number, along: (x: number, y: number) => boolean, z = g10): Set<number> =>', act: 'delete', callee: 'spread', args: (a) => { const z = a[3] ?? 'g10'; return ['out', `${z}.x + ${p(a[0])}`, `${z}.y + ${p(a[1])}`, a[2]]; } },
  { in: ['ashfall'], name: 'reach', first: 'const reach = (fx: number, fy: number, along: (x: number, y: number) => boolean): Set<number> =>', act: 'delete', callee: 'spread', args: (a) => ['out', `h10.x + ${p(a[0])}`, `h10.y + ${p(a[1])}`, a[2]] },
  { in: ['whitespine'], name: 'reach', first: 'const reach = (fx: number, fy: number, along: (x: number, y: number) => boolean): Set<number> =>', act: 'delete', callee: 'spread', args: ins(0, 'out') },
  { name: 'reach', first: 'const reach = (fx: number, fy: number, along: (x: number, y: number) => boolean): Map<number, number> =>', act: 'delete', callee: 'paces', args: ins(0, 'out') },
  { in: ['kilns'], name: 'steps', first: 'const steps = (fx: number, fy: number, ok2: (x: number, y: number) => boolean): Map<number, number> =>', act: 'delete', callee: 'paces', args: ins(0, 'out') },
  { in: ['saltreach'], name: 'reach', first: 'const reach = (q: Party): number =>', act: { rename: 'sight' } },
  { in: ['saltreach'], name: 'reach', first: "const reach = (to: { x: number; y: number }, can: { swim?: boolean; tide: 'high' | 'low' }, secrets: boolean): boolean =>", act: { rename: 'wades' } },
  { in: ['ashfall'], name: 'reached', first: 'const reached = (d: MapDef, x: number, y: number): boolean =>', act: 'delete', args: (a) => [a[0], `[${a[0]}.start.x, ${a[0]}.start.y]`, `[${a[1]}, ${a[2]}]`] },
  { in: ['ashfall'], name: 'reached', first: 'const reached = (x: number, y: number): boolean =>', act: 'delete', args: (a) => ['ES', '[ES.start.x, ES.start.y]', `[${a[0]}, ${a[1]}]`] },
  { name: 'reached', first: 'const reached = (d: MapDef, from: readonly [number, number], to: readonly [number, number]): boolean =>', act: 'delete' },
  { in: ['kilns'], name: 'reached', first: 'const reached = (to: readonly [number, number]): boolean =>', act: 'delete', args: (a) => ['rift', '[RIFT.start.x, RIFT.start.y]', a[0]] },
  { in: ['rimewater'], name: 'reached', first: 'const reached = (d: MapDef, to: readonly [number, number]): boolean =>', act: 'delete', args: (a) => [a[0], `[${a[0]}.start.x, ${a[0]}.start.y]`, a[1]] },
  { name: 'shut', first: 'const shut = (z: ', act: 'delete', args: ins(0, 'out') },
  { in: ['whitespine'], name: 'shut', first: 'const shut = (from: [number, number], prize: [number, number]): { size: number; reached: boolean } =>', act: 'delete', args: (a) => ['out', 'j11', a[0], '[door.x, door.y]', a[1]] },
  { in: ['sunderwood'], name: 'shut', first: 'shut = (x: number, y: number, from: [number, number], past: [number, number]): boolean =>', act: { rename: 'walledOff' } },
  { name: 'zone', first: 'zone = (id: string): MapZone => out.zones.find((z) => z.id === id)!', act: 'delete', args: ins(0, 'out') },
  { name: 'zone', first: 'const zone = (id: string) => out.zones.find((z) => z.id === id)!;', act: 'delete', args: ins(0, 'out') },
  { name: 'at', first: 'const at = (z: MapZone, x: number, y: number): number => (z.y + y) * out.width + z.x + x;', act: 'delete', callee: 'square', args: ins(0, 'out') },
  { in: ['glasswold', 'saltreach'], name: 'at', first: 'const at = (z: typeof ', whole: undefined, act: 'delete', callee: 'square', args: ins(0, 'out') },
  { in: ['kilns'], name: 'at', first: 'const at = (x: number, y: number, z: MapZone = k6): number => (z.y + y) * out.width + z.x + x;', act: 'delete', callee: 'square', args: (a) => ['out', a[2] ?? 'k6', a[0], a[1]] },
  { in: ['ashfall'], name: 'at', first: 'const at = (x: number, y: number): number => (g10.y + y) * out.width + g10.x + x;', act: 'delete', callee: 'square', args: (a) => ['out', 'g10', a[0], a[1]] },
  { in: ['ashfall'], name: 'at', first: 'const at = (x: number, y: number): number => (h10.y + y) * out.width + h10.x + x;', act: 'delete', callee: 'square', args: (a) => ['out', 'h10', a[0], a[1]] },
  { in: ['whitespine'], name: 'at', first: 'const at = (f: { x: number; y: number }): number => (i11.y + f.y) * out.width + i11.x + f.x;', act: 'delete', callee: 'square', args: (a) => ['out', 'i11', `${p(a[0])}.x`, `${p(a[0])}.y`] },
  { in: ['glasswold'], name: 'at10', first: 'const at10 = (x: number, y: number): number => key(d10.x + x, d10.y + y);', act: 'delete', callee: 'square', args: (a) => ['out', 'd10', a[0], a[1]] },
  { in: ['glasswold'], name: 'at10', first: 'at10 = (x: number, y: number): number => (d10.y + y) * out.width + d10.x + x', act: 'delete', callee: 'square', args: (a) => ['out', 'd10', a[0], a[1]] },
  { in: ['glasswold'], name: 'at9', first: 'at9 = (x: number, y: number): number => (e9.y + y) * out.width + e9.x + x', act: 'delete', callee: 'square', args: (a) => ['out', 'e9', a[0], a[1]] },
  { in: ['whitespine'], name: 'at10', first: 'const at10 = (f: { x: number; y: number }): number => (i10.y + f.y) * out.width + i10.x + f.x;', act: 'delete', callee: 'square', args: (a) => ['out', 'i10', `${p(a[0])}.x`, `${p(a[0])}.y`] },
  { in: ['whitespine'], name: 'at9', first: 'const at9 = (f: { x: number; y: number }): number => (i9.y + f.y) * out.width + i9.x + f.x;', act: 'delete', callee: 'square', args: (a) => ['out', 'i9', `${p(a[0])}.x`, `${p(a[0])}.y`] },
  { name: 'spread', first: 'const spread = (x0: number, y0: number, along: (x: number, y: number) => boolean): Set<number> =>', act: 'delete', args: ins(0, 'out') },
  { name: 'corner', first: 'const corner = (along: (x: number, y: number) => boolean) =>', act: 'delete', args: ins(0, 'out') },
  { name: 'drove', first: 'const drove = (x: number, y: number): boolean =>', act: 'delete', callee: 'drove(out, grid)', bare: 'drove(out, grid)' },
  { name: 'row', first: 'const row = (z: MapZone, y: number, can: Can = {}): string =>', act: 'delete', args: ins(0, 'out') },
  { name: 'col', first: 'const col = (z: MapZone, x: number, can: Can = {}): string =>', act: 'delete', args: ins(0, 'out') },
  { name: 'open', first: 'const open = (n: number, f: (i: number) => boolean): string =>', act: 'delete', callee: 'each' },
  { in: ['wrackholm'], name: 'apartFrom', first: 'function apartFrom(def: MapDef, a: readonly [number, number],', act: 'delete' },
  { in: ['hearth'], name: 'apartFrom', first: 'function apartFrom(a: readonly [number, number], b: readonly [number, number],', act: { replace: WHOLE_ISLE }, args: ins(0, 'WHOLE_ISLE') },
];
// Glasswold's reach on D10 takes no `can`: it is always the company that can do all.
TARGETS.unshift({ in: ['glasswold'], name: 'reach', first: 'const reach = (z: typeof d10, from: readonly [number, number], shut: readonly [number, number]): Set<number> =>', act: 'delete', args: (a) => ['out', a[0], a[1], 'ALL', a[2]] });

const SHELF_GIVES = new Set(['HIRE', 'hired', 'ledgerGiven']);

// ---- The calls ----------------------------------------------------------------------------------

interface Use { at: number; call?: { open: number; close: number; args: { s: number; e: number }[] } }

/** Every mention of `name` in [a, b), out of the ranges `skip`: a call with its arguments, or a bare one. Keys and members are not mentions. */
function uses(src: string, m: Uint8Array, name: string, a: number, b: number, skip: [number, number][]): Use[] {
  const out: Use[] = [], re = new RegExp(`(?<![\\w$])(?<!(?<!\\.\\.)\\.)${name.replace('$', '\\$')}(?![\\w$])`, 'g');
  re.lastIndex = a;
  let r: RegExpExecArray | null;
  while ((r = re.exec(src)) && r.index < b) {
    const i = r.index;
    if (!m[i] || skip.some(([s, e]) => i >= s && i < e)) continue;
    const after = src.slice(i + name.length).match(/^\s*(\(|:(?!:)|=(?![=>]))?/)!;
    const before = src.slice(Math.max(0, i - 12), i);
    if (after[1] === ':' && /[{,]\s*$/.test(before)) continue;
    if (/(const|let|var|function)\s+$/.test(before)) continue;
    if (after[1] !== '(') { out.push({ at: i }); continue; }
    const open = i + name.length + after[0].length - 1, args: { s: number; e: number }[] = [];
    let depth = 0, from = open + 1, close = open;
    for (let k = open; k < src.length; k++) {
      if (!m[k]) continue;
      const c = src[k];
      if ('([{'.includes(c)) depth++;
      else if (')]}'.includes(c)) { depth--; if (depth === 0) { close = k; break; } }
      else if (c === ',' && depth === 1) { args.push({ s: from, e: k }); from = k + 1; }
    }
    if (src.slice(from, close).trim()) args.push({ s: from, e: close });
    out.push({ at: i, call: { open, close, args } });
  }
  return out;
}

// ---- The run ------------------------------------------------------------------------------------

interface Edit { s: number; e: number; t: string }

/** The block the code at `i` stands in: from its opening brace to its closing one. */
function blockAround(src: string, m: Uint8Array, i: number): [number, number] {
  let depth = 0, s = i;
  for (; s >= 0; s--) { if (!m[s]) continue; if (src[s] === '}') depth++; else if (src[s] === '{') { if (depth === 0) break; depth--; } }
  depth = 0;
  for (let e = s; e < src.length; e++) { if (!m[e]) continue; if (src[e] === '{') depth++; else if (src[e] === '}') { depth--; if (depth === 0) return [s, e + 1]; } }
  return [s, src.length];
}
const report: string[] = [];
let moved = 0;

/**
 * The edits a call takes from its arguments as they were and as they are to be: an argument kept
 * keeps its text (and the edits inside it), so only what is put in or taken out is written.
 */
function callEdits(src: string, u: Required<Use>['call'], was: string[], now: string[]): Edit[] | undefined {
  const { open, close, args } = u, lead = (k: number): number => args[k].s + src.slice(args[k].s).match(/^\s*/)![0].length;
  // Each argument to be, as one kept (its index) or one new; the kept in order.
  const seq: (number | string)[] = [];
  let next = 0;
  for (const t of now) { const k = was.indexOf(t, next); if (k >= 0 && !seq.includes(k)) { seq.push(k); next = k + 1; } else seq.push(t); }
  const kept = seq.filter((x): x is number => typeof x === 'number');
  if (kept.length && kept.every((k, i) => k === i) && kept.length === was.length) {
    const out: Edit[] = [];
    for (let j = 0; j < seq.length; j++) {
      if (typeof seq[j] !== 'string') continue;
      const run: string[] = [];
      while (j < seq.length && typeof seq[j] === 'string') run.push(seq[j++] as string);
      j--;
      const after = seq.slice(j + 1).find((x): x is number => typeof x === 'number');
      if (after !== undefined) out.push({ s: lead(after), e: lead(after), t: `${run.join(', ')}, ` });
      else out.push({ s: lead(was.length - 1) + was[was.length - 1].length, e: lead(was.length - 1) + was[was.length - 1].length, t: `, ${run.join(', ')}` });
    }
    return out;
  }
  if (!was.length) return [{ s: open + 1, e: close, t: now.join(', ') }];
  if (now.length === was.length - 1 && seq.every((x) => typeof x === 'number')) {
    const k = was.findIndex((_, i) => !kept.includes(i));
    return [k < was.length - 1 ? { s: lead(k), e: lead(k + 1), t: '' } : { s: lead(k - 1) + was[k - 1].length, e: lead(k) + was[k].length, t: '' }];
  }
  if (src.slice(open, close).includes('\n')) return undefined;
  return [{ s: open + 1, e: close, t: now.join(', ') }];
}

function rehome(area: string): void {
  const f = walkthrough(area);
  let src = read(f);
  const m = mask(src), all = decls(src, m), stmts = statements(src, m), edits: Edit[] = [];
  const scopeOf = (d: Decl): [number, number] => d.col === 0 ? [0, src.length] : stmts.find(([s, e]) => d.s > s && d.s < e) ?? [0, src.length];
  const codeName = (n: string): boolean => uses(src, m, n, 0, src.length, []).length > 0;
  // First what is declared and what goes: a deleted declaration's calls go with it.
  const text = (d: Decl): string => src.slice(d.multi ? d.s : d.stmtS, d.multi ? d.e : d.stmtE).split('\n').map((l, k) => k && l.startsWith(' '.repeat(d.col)) ? l.slice(d.col) : l).join('\n');
  const matched = all.flatMap((d) => { const t = TARGETS.find((x) => x.name === d.name && (!x.in || x.in.includes(area)) && d.first.trimStart().startsWith(x.first) && (!x.whole || text(d) === x.whole)); return t ? [{ d, t }] : []; });
  const gone: [number, number][] = [];
  for (const { d, t } of matched) {
    moved++;
    if (t.act !== 'delete' && 'rename' in t.act) {
      const k = src.indexOf(d.name, d.s);
      edits.push({ s: k, e: k + d.name.length, t: t.act.rename });
      if (codeName(t.act.rename)) report.push(`  ! ${t.act.rename} is already a name in ${area}'s code`);
    } else if (d.multi) {
      const e = d.idx > 0 ? { s: d.prevE, e: d.e, t: '' } : { s: d.s, e: d.nextS, t: '' };
      edits.push(e); gone.push([e.s, e.e]);
    } else {
      let s = lineStart(src, d.s);
      const e = d.stmtE + (src[d.stmtE] === '\n' ? 1 : 0);
      // Its doc comment goes with it.
      const lines = src.slice(0, s).split('\n');
      lines.pop();
      if (/\*\/\s*$/.test(lines[lines.length - 1] ?? '')) {
        let k = lines.length - 1;
        while (k > 0 && !/^\s*\/\*\*/.test(lines[k])) k--;
        s -= lines.slice(k).join('\n').length + 1;
      } else if (/^\s*\/\//.test(lines[lines.length - 1] ?? '')) report.push(`  ~ ${area}:${lineOf(src, d.s)} a // comment stands over ${d.name}: ${lines[lines.length - 1].trim().slice(0, 100)}`);
      edits.push({ s, e, t: typeof t.act === 'object' && 'replace' in t.act ? t.act.replace + '\n' : '' });
      gone.push([s, e]);
    }
  }
  for (const { d, t } of matched) {
    const [a, b] = scopeOf(d);
    // A declaration of the same name in a function inside this one's scope shadows it there.
    const deeper = [...src.slice(a, b).matchAll(new RegExp(`\\n {4,}(?:const|let|function)\\s+${d.name}\\b`, 'g'))].map((r) => blockAround(src, m, a + r.index! + 1));
    const skip: [number, number][] = [d.multi ? [d.s, d.e] : [d.stmtS, d.stmtE], ...gone, ...deeper, ...(d.col === 0 ? all.filter((o) => o !== d && o.name === d.name && o.col === 2).map(scopeOf) : [])];
    const found = uses(src, m, d.name, a, b, skip);
    const act = t.act === 'delete' ? 'delete' : 'rename' in t.act ? `rename ${t.act.rename}` : 'replace';
    const deep = [...src.slice(a, b).matchAll(new RegExp(`\\n( {4,})(?:const|let|function)\\s+${d.name}\\b`, 'g'))].map((r) => lineOf(src, a + r.index! + 1));
    const bare = found.filter((u) => !u.call);
    report.push(`${area}:${lineOf(src, d.s)} ${d.name} (${act}): ${found.length - bare.length} calls${bare.length ? `, ${bare.length} bare at ${bare.map((u) => lineOf(src, u.at)).join(' ')}` : ''}${deep.length ? `, a deeper ${d.name} at ${deep.join(' ')}` : ''}`);
    const newName = t.act !== 'delete' && 'rename' in t.act ? t.act.rename : t.callee;
    for (const u of found) {
      if (!u.call) {
        if (t.bare) edits.push({ s: u.at, e: u.at + d.name.length, t: t.bare });
        else if (t.args || t.callee || newName) report.push(`  ! ${area}:${lineOf(src, u.at)} a bare ${d.name} left as it is`);
        continue;
      }
      if (newName) edits.push({ s: u.at, e: u.at + d.name.length, t: newName });
      if (!t.args) continue;
      const was = u.call.args.map((x) => src.slice(x.s, x.e).trim()), now = t.args(was);
      if (now.join('\u0000') === was.join('\u0000')) continue;
      const e = callEdits(src, u.call, was, now);
      if (e) edits.push(...e); else report.push(`  ! ${area}:${lineOf(src, u.at)} a call over several lines left for a hand`);
    }
  }
  edits.sort((x, y) => y.s - x.s || y.e - x.e);
  for (let k = 1; k < edits.length; k++) if (edits[k].e > edits[k - 1].s && edits[k].s !== edits[k].e) report.push(`  ! ${area}:${lineOf(src, edits[k].s)} two edits overlap`);
  for (const e of edits) src = src.slice(0, e.s) + e.t + src.slice(e.e);
  // tools/walk.ts is the kit's; Shelf's helpers are the kit's.
  src = src.replace(/'\.\.\/\.\.\/\.\.\/\.\.\/tools\/walk\.ts'/g, "'../../../../tools/kit/walk.ts'");
  src = src.replace(/^import \{([^}]*)\} from '\.\.\/shelf\/walkthrough\.ts';$/m, (line, names: string) => {
    const keep = names.split(',').map((x) => x.trim()).filter((x) => x && !SHELF_GIVES.has(x));
    return `import { ${keep.join(', ')} } from '../shelf/walkthrough.ts';`;
  });
  // Only a walkthrough the run moved something in takes new imports: a rerun changes nothing.
  if (edits.length || src !== read(f)) src = imports(src, area);
  write(f, src);
}

/** The kit's names a walkthrough mentions, added to its imports of the kit. */
function imports(src: string, area: string): string {
  const names = (f: string): string[] => [...read(f).matchAll(/^export (?:const|function|let) ([\w$]+)/gm)].map((r) => r[1]);
  const m = mask(src), own = new Set(decls(src, m).filter((d) => d.col === 0).map((d) => d.name));
  const mentions = (n: string): boolean => uses(src, m, n, 0, src.length, []).length > 0 && !own.has(n);
  const add = (file: string, kit: string[]): void => {
    const want = kit.filter(mentions);
    const re = new RegExp(`^import \\{([^}]*)\\} from '\\.\\./\\.\\./\\.\\./\\.\\./tools/kit/${file}';$`, 'm'), have = re.exec(src);
    const listed = have ? have[1].split(',').map((x) => x.trim().replace(/^type\s+/, '')) : [];
    const more = want.filter((n) => !listed.includes(n));
    if (!more.length) return;
    if (have) {
      const parts = have[1].split(',').map((x) => x.trim()).filter(Boolean), values = parts.filter((x) => !x.startsWith('type ')), types = parts.filter((x) => x.startsWith('type '));
      src = src.replace(have[0], `import { ${[...values, ...more, ...types].join(', ')} } from '../../../../tools/kit/${file}';`);
    } else {
      const walk = /^import \{[^}]*\} from '\.\.\/\.\.\/\.\.\/\.\.\/tools\/kit\/walk\.ts';$/m.exec(src)!;
      src = src.slice(0, walk.index + walk[0].length) + `\nimport { ${more.join(', ')} } from '../../../../tools/kit/${file}';` + src.slice(walk.index + walk[0].length);
    }
    report.push(`  + ${area} imports ${more.join(', ')} from tools/kit/${file}`);
  };
  add('walk.ts', names('tools/kit/walk.ts'));
  add('grid.ts', names('tools/kit/grid.ts'));
  return src;
}

/** Drop the import specifiers tsc found unused (TS6133, TS6192) in the walkthroughs. */
function prune(file: string): void {
  const byFile = new Map<string, { line: number; name?: string }[]>();
  for (const r of readFileSync(file, 'utf8').matchAll(/^(src\/content\/areas\/[a-z]+\/walkthrough\.ts)\((\d+),\d+\): error TS(6133|6192|6196): (?:'([\w$]+)' is declared|All imports)/gm)) {
    byFile.set(r[1], [...(byFile.get(r[1]) ?? []), { line: +r[2], name: r[4] }]);
  }
  for (const [f, hits] of byFile) {
    const lines = read(f).split('\n');
    for (const h of hits) {
      const l = lines[h.line - 1];
      if (!/^import /.test(l)) { report.push(`  ~ ${f}:${h.line} ${h.name ?? ''} unused, not an import: left`); continue; }
      if (!h.name) { lines[h.line - 1] = '\u0000'; report.push(`  - ${f}:${h.line} the whole import`); continue; }
      const now = l.replace(/\{([^}]*)\}/, (_, names: string) => `{ ${names.split(',').map((x) => x.trim()).filter((x) => x && x.replace(/^type\s+/, '').split(/\s+as\s+/).pop() !== h.name).join(', ')} }`);
      lines[h.line - 1] = /\{\s*\}/.test(now) ? '\u0000' : now;
      report.push(`  - ${f}:${h.line} ${h.name}`);
    }
    write(f, lines.filter((l) => l !== '\u0000').join('\n'));
  }
}

const pi = process.argv.indexOf('--prune');
if (pi >= 0) prune(process.argv[pi + 1]);
else {
  for (const a of AREAS) rehome(a);
  for (const f of ['tools/tests/monsters.ts', 'tools/tests/pilot.ts', 'tools/tests/survival.ts', 'tools/tests/fullrun.ts', 'tools/test.ts']) {
    const was = read(f), now = was.replace(/from '\.\.\/walk\.ts'/g, "from '../kit/walk.ts'").replace(/tools\/walk\.ts/g, 'tools/kit/walk.ts');
    if (now !== was) { moved++; report.push(`${f}: names the kit`); write(f, now); }
  }
}
console.log(report.join('\n'));
console.log(pi >= 0 ? 'Pruned.' : moved ? `${moved} helpers and files moved${DRY ? ' (dry run: nothing written)' : ''}.` : 'Nothing left to move.');
