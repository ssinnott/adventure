// The docs check (#1025): the live docs and the rules each is held to. A backticked path names a
// tracked file or folder, from the root, then src/, then the area's folder; a backticked name, a word
// with a capital or an underscore, is a word of src/, tools/, types/ or .github/; no backticked path
// cites a line; and the facts the docs repeat are the code's: DESIGN §4's bands are CURVE's, and the
// lanes' words in docs/ISSUES.md §2 and EXPANSION §8.1 are .github/labels.json's. A rule is a
// function of one doc and the tree (RULES), so a rule more is one function more. The library of
// tools/tests/docs.ts, and a file of tools/kit/, which takes src only (tools/tests/layers.ts).
//
// What a doc names that is not ours, or is no path, is a row of NOT_OURS with its reason; a row that
// starts to resolve, or that no live doc names, is refused, so the table only shrinks. The live docs
// are README.md, CLAUDE.md, docs/*.md and each area's state, docs/areas/<area>.md, but LEFT_OUT's:
// the archive and an area's decisions and plan are dated records, true when written, and not held.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PLAN } from '../../src/content/atlas.ts';
import type { RegionId } from '../../src/content/index.ts';
import { CURVE } from '../../src/content/progression.ts';
import { laneOf } from './lanes.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** A doc: its path from the root and its text. */
export interface Doc { path: string; text: string }
/** What a rule refuses: the doc, the line (from 1) and what is wrong. */
export interface Fault { doc: string; line: number; what: string }
/** What the docs are read against: the tracked files and folders, the code's words and each label's description. */
export interface Tree {
  files: ReadonlySet<string>;
  folders: ReadonlySet<string>;
  words: ReadonlySet<string>;
  labels: ReadonlyMap<string, string>;
}
/** A rule: the faults of one doc, read against the tree. */
export type Rule = (doc: Doc, tree: Tree) => Fault[];

/** The docs held: the front pages, docs/*.md and each area's state; nothing in a folder below them. */
const LIVE = /^(README\.md|CLAUDE\.md|docs\/[^/]+\.md|docs\/areas\/[^/]+\.md)$/;
/** The docs LIVE matches that are not held, each with why. */
export const LEFT_OUT: Readonly<Record<string, string>> = {
  'docs/decisions.md': 'a dated record of what was decided, true when written, as the archive and each area\'s decisions and plan are',
  'docs/CODEMAP.md': 'made from the files\' headers by tools/codemap.ts and held to them by the codemap suite: a row is a header\'s words, a path in it written from its file',
  'docs/ROSTER.md': 'made from the monsters\' defs by tools/roster.ts and held to them by the roster suite',
};
/** The check's own files, whose words are not the code's: the table's rows and the copies' made-up names are written in them. */
const OWN = ['tools/kit/docs.ts', 'tools/tests/docs.ts'];

/**
 * What the docs name in backticks that is not ours or is no path, each with why. A row that resolves,
 * as a path or as a name, or that no live doc names, is refused (`unneeded`): the table only shrinks.
 */
export const NOT_OURS: readonly { word: string; why: string }[] = [
  { word: 'dist/', why: 'the build\'s output, made by npm run build and published to Pages, never tracked (README)' },
  { word: 'game-engine/docs/VENDORING.md', why: 'the engine\'s repository\'s: the copy vendored in src/lib/ carries no docs/ (DESIGN §13)' },
  { word: 'REVIEW.md', why: 'the file a reviewing bot would read (EXPANSION §5.7), not made' },
  { word: 'a/b', why: 'a seam\'s key, its two boxes (EXPANSION §8.2): no path' },
  { word: 'RaceDef.perceptive', why: 'the field #876 took out, named as gone in DESIGN §5 by the ninth call for #856' },
];

/** A code span of a doc: its word, the line it starts on and the text after it on that line. */
export interface Span { word: string; line: number; after: string }

/**
 * The code spans of a text as CommonMark reads them, a run of backticks to the next run of as many
 * inside a paragraph, outside the fenced blocks. A span's word is its text, trimmed, a line's end a space.
 */
export function spans(text: string): Span[] {
  const out: Span[] = [], lines = text.split('\n');
  let fenced = false, start = 0;
  const para: string[] = [];
  const read = (): void => {
    const body = para.join('\n');
    for (const m of body.matchAll(/(?<!`)(`+)(?!`)([\s\S]*?[^`])\1(?!`)/g)) {
      const before = body.slice(0, m.index), end = m.index + m[0].length;
      const line = start + before.split('\n').length - 1, close = body.indexOf('\n', end);
      out.push({ word: m[2].replace(/\n/g, ' ').trim(), line: line + 1, after: body.slice(end, close < 0 ? undefined : close) });
    }
    para.length = 0;
  };
  lines.forEach((l, i) => {
    if (/^\s*(```|~~~)/.test(l)) { read(); fenced = !fenced; return; }
    if (fenced || !l.trim()) { read(); return; }
    if (!para.length) start = i;
    para.push(l);
  });
  read();
  return out;
}

/** The extensions that make a word a path without a slash. */
const EXT = /\.(ts|js|mjs|json|md|yml|yaml|html|css|png|txt|sh)$/;
/** A line cite at a word's end: `:162`, `:12-14`. */
const CITE = /:\d+(?:[-–:]\d+)*$/;
/** Whether a word is a path: one word with a slash or a known extension, a line cite after it or not. */
export const isPath = (w: string): boolean => !/\s/.test(w) && (w.includes('/') || EXT.test(w.replace(CITE, '')));
/** Whether a word is a name: one word, no path, with a capital or an underscore. */
export const isName = (w: string): boolean => !/\s/.test(w) && !isPath(w) && /[A-Z_]/.test(w);
/** The words of a name the code must have: each run of letters, digits and underscores in it (`GATE.backDay` two). */
export const nameParts = (w: string): string[] => w.split(/[^\w$]+/).filter(Boolean);
/** The top folders a phrase's path is held from, as a command's file (`node tools/test.ts docs`). */
const TOP = /^(src|tools|docs|types|\.github)\//;
/**
 * The paths a span names: its word, if a path; in a phrase (a command, a fragment of code, a line of
 * the game's), each word from a top folder, and not its flags, its outputs or a link.
 */
export const pathsOf = (s: Span): string[] =>
  /\s/.test(s.word) ? s.word.split(/\s+/).filter((w) => TOP.test(w)) : isPath(s.word) ? [s.word] : [];

const NOT_OURS_WORDS = (table: readonly { word: string }[]): ReadonlySet<string> => new Set(table.map((r) => r.word));

/** A path's pattern: a `<placeholder>` is a name, a `*` any run inside one, the rest itself. */
const pattern = (p: string): RegExp =>
  new RegExp('^' + p.split(/(<[^>]*>|\*)/).map((s) => (s === '*' ? '[^/]*' : s.startsWith('<') ? '[^/]+' : s.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))).join('') + '$');

/** The area a doc's paths may be written from: an area's state doc's, by its name or the area a place lies in. */
export const areaOf = (doc: string): string | undefined => {
  if (!/^docs\/areas\/[^/]+\.md$/.test(doc)) return undefined;
  const p = laneOf(doc);
  return p.lane === 'area' ? p.area : undefined;
};

/** Whether a path names a tracked file or folder, from the root, then src/, then the area's folder; one ending in a slash a folder. */
export function resolves(word: string, tree: Tree, area?: string): boolean {
  const p = word.replace(CITE, '').replace(/^\.\//, ''), folder = p.endsWith('/'), bare = p.replace(/\/+$/, '');
  if (!bare) return false;
  for (const base of ['', 'src/', ...(area ? [`src/content/areas/${area}/`] : [])]) {
    const full = base + bare;
    if (/[<*]/.test(full)) {
      const re = pattern(full);
      if ([...tree.folders].some((f) => re.test(f)) || (!folder && [...tree.files].some((f) => re.test(f)))) return true;
    } else if (tree.folders.has(full) || (!folder && tree.files.has(full))) return true;
  }
  return false;
}

/** Whether every word of a name is a word of the code. */
export const named = (word: string, tree: Tree): boolean => nameParts(word).every((p) => tree.words.has(p));

const fault = (doc: Doc, line: number, what: string): Fault => ({ doc: doc.path, line, what });

/** 1. A backticked path names a tracked file or folder, but a row of NOT_OURS. */
export const paths: Rule = (doc, tree) => {
  const area = areaOf(doc.path), mine = NOT_OURS_WORDS(NOT_OURS);
  return spans(doc.text).flatMap((s) => pathsOf(s).filter((p) => !mine.has(p.replace(CITE, '')) && !resolves(p, tree, area))
    .map((p) => fault(doc, s.line, `\`${p}\` names no tracked file or folder, from the root, src/${area ? ` or src/content/areas/${area}/` : ''}`)));
};

/** 2. A backticked name is a word of src/, tools/, types/ or .github/, a content id among them, but a row of NOT_OURS. */
export const names: Rule = (doc, tree) => {
  const mine = NOT_OURS_WORDS(NOT_OURS);
  return spans(doc.text).filter((s) => isName(s.word) && !mine.has(s.word) && !named(s.word, tree))
    .map((s) => fault(doc, s.line, `\`${s.word}\` is no word of src/, tools/, types/ or .github/ (${nameParts(s.word).filter((p) => !tree.words.has(p)).join(', ')})`));
};

/** The docs that may cite a line: docs/ISSUES.md asks an issue for one (its §5); the docs name none. */
export const CITES_ASKED: readonly string[] = ['docs/ISSUES.md'];
/** 3. No backticked path cites a line, in its span or straight after it, and no span is a bare line (`:124`). */
export const lines: Rule = (doc) => CITES_ASKED.includes(doc.path) ? [] : spans(doc.text)
  .filter((s) => /^:\d/.test(s.word) || pathsOf(s).some((p) => CITE.test(p)) || (isPath(s.word) && /^:\d/.test(s.after)))
  .map((s) => fault(doc, s.line, `\`${s.word}\`${isPath(s.word) && /^:\d/.test(s.after) ? s.after.match(/^:[\d\-–:]+/)![0] : ''} cites a line: say what is there`));

/** A table's rows under a heading: each row's cells, trimmed, and its line, for the first table whose header is `head`. */
export function tableUnder(doc: Doc, heading: string, head: readonly string[]): { line: number; cells: string[] }[] | undefined {
  const all = doc.text.split('\n'), at = all.findIndex((l) => l.startsWith(heading));
  if (at < 0) return undefined;
  const level = heading.match(/^#+/)![0].length;
  const cells = (l: string): string[] => l.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map((c) => c.trim());
  for (let i = at + 1; i < all.length; i++) {
    const h = all[i].match(/^(#+) /);
    if (h && h[1].length <= level) return undefined;
    if (!all[i].startsWith('|') || cells(all[i]).join('|') !== head.join('|')) continue;
    const rows: { line: number; cells: string[] }[] = [];
    for (let j = i + 2; j < all.length && all[j].startsWith('|'); j++) rows.push({ line: j + 1, cells: cells(all[j]) });
    return rows;
  }
  return undefined;
}

/** A band as the docs write it: `10–12`. */
export const bandText = (band: readonly [number, number]): string => `${band[0]}–${band[1]}`;
/** The road as DESIGN §4's table writes it: each area's name, the atlas's, and its band, CURVE's, in the atlas's order. */
export const road = (): { name: string; band: string }[] => [...PLAN.areas].sort((a, b) => a.order - b.order)
  .map((a) => ({ name: a.name, band: a.id in CURVE ? bandText(CURVE[a.id as RegionId].band) : 'none in CURVE' }));

/** 4a. DESIGN §4's table says CURVE's bands, by the areas' order. */
export const bands: Rule = (doc) => {
  if (doc.path !== 'docs/DESIGN.md') return [];
  const rows = tableUnder(doc, '## 4.', ['Area', 'Character', 'Band', 'Wardstone']);
  if (!rows) return [fault(doc, 1, 'DESIGN §4 has no table of the areas and their bands (| Area | Character | Band | Wardstone |)')];
  const want = road(), out: Fault[] = [];
  for (let i = 0; i < Math.max(rows.length, want.length); i++) {
    const r = rows[i], w = want[i];
    const name = r?.cells[0].replace(/\*/g, ''), band = r?.cells[2];
    if (r && w && name === w.name && band === w.band) continue;
    out.push(fault(doc, r?.line ?? rows[rows.length - 1]?.line ?? 1, `DESIGN §4's row ${i + 1} is ${r ? `${name} ${band}` : 'missing'}; the atlas and CURVE (src/content/progression.ts) have ${w ? `${w.name} ${w.band}` : 'no more'}`));
  }
  return out;
};

/** A cell's words as a label's: the backticks off, the first letter's case aside. */
const words = (s: string): string => { const t = s.replace(/`/g, '').trim(); return t.charAt(0).toLowerCase() + t.slice(1); };
/**
 * The tables that carry the lanes' words: the doc, the heading and the header of the table, the label
 * a row is of and the lanes it lacks, with why. EXPANSION's "At once" column is its own.
 */
export const LANE_TABLES: readonly { doc: string; heading: string; head: readonly string[]; label: (cell: string) => string; lacks: readonly string[] }[] = [
  { doc: 'docs/ISSUES.md', heading: '## 2.', head: ['Label', 'Touches'], label: (c) => c.replace(/`/g, ''), lacks: [] },
  // No design row: the lines under it say docs/ISSUES.md §2 adds the design lane to its rows.
  { doc: 'docs/EXPANSION.md', heading: '### 8.1', head: ['Lane', 'Touches', 'At once'], label: (c) => `lane: ${c.toLowerCase()}`, lacks: ['lane: design'] },
];

/** 4b. Each lane's row in docs/ISSUES.md §2 and EXPANSION §8.1 has the words .github/labels.json gives its label. */
export const lanes: Rule = (doc, tree) => {
  const t = LANE_TABLES.find((x) => x.doc === doc.path);
  if (!t) return [];
  const rows = tableUnder(doc, t.heading, t.head), where = `${doc.path.replace('docs/', '').replace('.md', '')} ${t.heading.replace(/#+ /, '§').replace(/\.$/, '')}`;
  if (!rows) return [fault(doc, 1, `${where} has no table | ${t.head.join(' | ')} |`)];
  const out: Fault[] = [], seen = new Set<string>();
  for (const r of rows) {
    const label = t.label(r.cells[0]), want = tree.labels.get(label);
    seen.add(label);
    if (want === undefined) out.push(fault(doc, r.line, `${where}'s row ${r.cells[0]} is no lane of .github/labels.json`));
    else if (words(r.cells[1]) !== words(want)) out.push(fault(doc, r.line, `${where}'s ${label} reads "${words(r.cells[1])}"; .github/labels.json has "${words(want)}"`));
  }
  for (const label of [...tree.labels.keys()].filter((l) => l.startsWith('lane: ') && !seen.has(l) && !t.lacks.includes(l))) {
    out.push(fault(doc, rows[rows.length - 1]?.line ?? 1, `${where} has no row for ${label}`));
  }
  return out;
};

/** The rules, by name, each a function of a doc and the tree. */
export const RULES: Readonly<Record<string, Rule>> = { paths, names, lines, bands, lanes };

/** Every fault of the docs, by every rule given. */
export const check = (docs: readonly Doc[], tree: Tree, rules: Readonly<Record<string, Rule>> = RULES): Fault[] =>
  docs.flatMap((d) => Object.values(rules).flatMap((r) => r(d, tree)));

/** The rows of a table of what is not ours that are not needed: each that resolves, or that no doc names. */
export function unneeded(table: readonly { word: string; why: string }[], docs: readonly Doc[], tree: Tree): string[] {
  const used = new Set(docs.flatMap((d) => spans(d.text).flatMap((s) => [s.word, ...s.word.split(/\s+/)].map((w) => w.replace(CITE, '')))));
  return table.flatMap((r) => {
    if (isPath(r.word) ? resolves(r.word, tree) : named(r.word, tree)) return [`${r.word}: it resolves now, so its row goes`];
    if (!used.has(r.word)) return [`${r.word}: no live doc names it, so its row goes`];
    return [];
  });
}

/** The live docs of a list of files: LIVE's, but LEFT_OUT's. */
export const liveDocs = (files: Iterable<string>): string[] => [...files].filter((f) => LIVE.test(f) && !(f in LEFT_OUT)).sort();

/** The text files whose words are the code's: under src/, tools/, types/ and .github/, but the check's own. */
const CODE = /^(src|tools|types|\.github)\//;

/** The tree as git tracks it: its files and folders, the code's words and the labels' descriptions. */
export function readTree(root = ROOT): Tree {
  const files = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
  const folders = new Set<string>(), words = new Set<string>();
  for (const f of files) for (let i = f.indexOf('/'); i > 0; i = f.indexOf('/', i + 1)) folders.add(f.slice(0, i));
  for (const f of files) {
    if (!CODE.test(f) || OWN.includes(f) || /\.(png|jpg|ico|woff2?)$/.test(f)) continue;
    for (const m of readFileSync(path.join(root, f), 'utf8').matchAll(/[\w$]+/g)) words.add(m[0]);
  }
  const labels = JSON.parse(readFileSync(path.join(root, '.github/labels.json'), 'utf8')) as { name: string; description: string }[];
  return { files: new Set(files), folders, words, labels: new Map(labels.map((l) => [l.name, l.description])) };
}

/** The live docs as they stand on the disk. */
export const readDocs = (tree: Tree, root = ROOT): Doc[] =>
  liveDocs(tree.files).map((p) => ({ path: p, text: readFileSync(path.join(root, p), 'utf8') }));
