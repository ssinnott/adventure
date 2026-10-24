// The code map (#1023, part of #848): docs/CODEMAP.md, made from the files' headers. A row to each
// file of src/ (not src/lib/, game-engine, vendored), tools/ and types/, sorted by path: its path
// and its header's first paragraph, the comment it opens on up to its first blank comment line, the
// marks off and the lines joined by a space. A folder where a box adds files is one row, which
// counts nothing (COLLAPSED). The map holds nothing that changes without a file changing, so it is
// made again byte for byte. The library of tools/codemap.ts, the command line, and a file of
// tools/kit/, which takes src only (the layers check, tools/tests/layers.ts): so its suite,
// tools/tests/codemap.ts, takes it and not the tool.
//
// The header is the row: a pull request that adds a file, or changes what one owns, says so in the
// file's header and runs `node tools/codemap.ts`, and the suite names the rows of a stale map. A
// conflict in docs/CODEMAP.md is mended by running the tool, never by hand. A file is a .ts file;
// the data beside them (the shipped files, tools/kit/line.json) is named by the code that writes
// it.
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** Where the map is written, from the root. */
export const MAP_FILE = 'docs/CODEMAP.md';
/** The folders mapped, src/lib/ left out. */
export const FOLDERS = ['src', 'tools', 'types'] as const;

/** A file and its text, its path from the root. */
export interface Source { path: string; text: string }
/** A row of the map: a file's path, or a collapsed folder's, and what it says. */
export interface Row { path: string; text: string }
/**
 * A folder collapsed to one row: the row's path, the folder its files are under and what they hold.
 * A row ending `<area>/` takes each area's folder under it; one ending `<family>.ts` takes the files
 * directly under it but those `except` names.
 */
export interface Folder { row: string; under: string; except?: readonly string[]; what: string }

/**
 * The folders collapsed to one row. Each is a folder where a box adds files: an area's own and its
 * businesses' rooms, and the monsters' drawings, a family to a file, since a monster goes the way of
 * a zone map (EXPANSION §8.2). So a box adds no row: a row to each of their files would have every
 * box write rows, which the map is made to end, and their headers are the areas' and the drawings'
 * notes, which a row would not shorten. The row names the areas whose folders it holds and counts
 * no file, so a box changes nothing of the map: two boxes merged side by side would each write the
 * same count and leave the merged map stale (#1023's review). `<area>` is each folder of
 * src/content/areas/; what one holds is its index.ts's header and the area's doc. Every other file
 * is a row: the kits (src/ui/interiors/kit/ and src/ui/monsters/kit/ among them), which the systems
 * lane writes, and src/ui/monsters/index.ts, which merges the families.
 */
export const COLLAPSED: readonly Folder[] = [
  { row: 'src/content/areas/<area>/', under: 'src/content/areas/', what: 'an area: its maps (`maps/`), monsters, items, flags, chapter of the one quest (`chapter.ts`), side quests (`quests.ts`), guild quests, checks, part of the world map (`atlas.ts`), its shipped ids (`shipped.json`) and its walkthrough; `index.ts` gathers it as an `Area`, and `public.ts` is the one file another area takes (the flags, exits and items the others name). Each has its doc in `docs/areas/`.' },
  { row: 'src/ui/interiors/<area>/', under: 'src/ui/interiors/', what: "an area's businesses' rooms: a scene to a file, keyed by the interior its map's feature names (`index.ts`), each drawn on the rooms' kit (`src/ui/interiors/kit/`)." },
  { row: 'src/ui/monsters/<family>.ts', under: 'src/ui/monsters/', except: ['index.ts'], what: "the monsters' drawings, a family to a file, each registering the kinds it draws in its `SPRITES` (its drawer, its span and any part drawn apart), which `src/ui/monsters/index.ts` merges, drawn on the monsters' kit (`src/ui/monsters/kit/`) and the paint kit (`src/ui/paint/`); and the old paths that re-export the kits." },
];

/** Whether a path from the root is a file the map holds: a .ts file of src/ (not src/lib/), tools/ or types/. */
export const mapped = (file: string): boolean =>
  file.endsWith('.ts') && FOLDERS.some((d) => file.startsWith(d + '/')) && !file.startsWith('src/lib/');

/**
 * A file's header's first paragraph: the comment lines the file opens on, up to the first blank
 * comment line (`//` alone) or the first line that is no comment, the marks off and the lines joined
 * by a space, each run of spaces one; '' where the file opens on no comment, or on a blank one.
 */
export function header(text: string): string {
  const out: string[] = [];
  for (const line of text.split('\n')) {
    const m = /^\/\/(.*)$/.exec(line.trimEnd());
    if (!m || !m[1].trim()) break;
    out.push(m[1].trim());
  }
  return out.join(' ').replace(/\s+/g, ' ');
}

/** The mapped files whose header has no first paragraph, by path. */
export const headless = (sources: readonly Source[]): string[] =>
  sources.filter((s) => mapped(s.path) && !header(s.text)).map((s) => s.path).sort(byPath);

const byPath = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

/** The areas: the folders of src/content/areas/ the files are in. */
const areasOf = (files: readonly string[]): Set<string> =>
  new Set(files.map((f) => /^src\/content\/areas\/([^/]+)\//.exec(f)?.[1]).filter((a): a is string => !!a));

/** The collapsed folder a file is in, with the area whose folder it is ('' for a family's file), if any. */
function folderOf(file: string, areas: ReadonlySet<string>): { folder: Folder; area: string } | undefined {
  for (const folder of COLLAPSED) {
    if (!file.startsWith(folder.under)) continue;
    const rest = file.slice(folder.under.length).split('/');
    if (folder.row.endsWith('<area>/') ? rest.length > 1 && areas.has(rest[0]) : rest.length === 1 && !folder.except?.includes(rest[0])) {
      return { folder, area: folder.row.endsWith('<area>/') ? rest[0] : '' };
    }
  }
  return undefined;
}

/** The map's rows, sorted by path: a row to each file, and one to each collapsed folder, naming its areas. */
export function rows(sources: readonly Source[]): Row[] {
  const files = sources.filter((s) => mapped(s.path));
  const areas = areasOf(files.map((s) => s.path));
  const out: Row[] = [];
  const folded = new Map<Folder, Set<string>>();
  for (const s of files) {
    const at = folderOf(s.path, areas);
    if (!at) { out.push({ path: s.path, text: header(s.text) }); continue; }
    const held = folded.get(at.folder) ?? new Set<string>();
    if (at.area) held.add(at.area);
    folded.set(at.folder, held);
  }
  for (const [folder, held] of folded) {
    const names = [...held].sort(byPath);
    out.push({ path: folder.row, text: names.length ? `A folder to an area (${names.join(', ')}): ${folder.what}` : folder.what });
  }
  return out.sort((a, b) => byPath(a.path, b.path));
}

/** A row's text as a table's cell: a pipe escaped, and outside code spans a `<` or a `*`, which Markdown reads as a tag or emphasis. */
const cell = (s: string): string =>
  s.split(/(`[^`]*`)/).map((part, i) => (i % 2 ? part : part.replace(/[<*]/g, '\\$&'))).join('').replaceAll('|', '\\|');

const INTRO = [
  '# Code map',
  '',
  "Made by `node tools/codemap.ts` from the files' headers (#1023); never edited by hand. A row to each",
  'file of `src/` (not `src/lib/`, game-engine, vendored), `tools/` and `types/`, sorted by path, and',
  "its header's first paragraph; a folder where a box adds files is one row. A pull request that adds",
  "a file, or changes what one owns, says so in the file's header and runs the tool: the `codemap`",
  'suite names the rows of a stale map, and a conflict here is mended by running the tool. How the game',
  'is put together is [SYSTEMS.md](SYSTEMS.md).',
  '',
  '| File | What its header says first |',
  '|---|---|',
];

/** The map's text: the lines above, then a row to each line of the table. */
export const render = (rs: readonly Row[]): string => [...INTRO, ...rs.map((r) => `| \`${r.path}\` | ${cell(r.text)} |`), ''].join('\n');

/** A written map's table rows by their path, and its other lines. */
function parse(text: string): { rows: Map<string, string>; rest: string } {
  const out = new Map<string, string>(), rest: string[] = [];
  for (const line of text.split('\n')) {
    const m = /^\| `([^`]+)` \|/.exec(line);
    if (m) out.set(m[1], line); else rest.push(line);
  }
  return { rows: out, rest: rest.join('\n') };
}

/** What differs between a written map and the one the headers make, a line to each row, by path; none where they are the same. */
export function stale(written: string, made: string): string[] {
  if (written === made) return [];
  const w = parse(written), m = parse(made), out: string[] = [];
  if (w.rest !== m.rest) out.push('the lines that are no row');
  for (const [p, line] of m.rows) {
    if (!w.rows.has(p)) out.push(`${p}: no row`);
    else if (w.rows.get(p) !== line) out.push(`${p}: the row is not what its header says`);
  }
  for (const p of w.rows.keys()) if (!m.rows.has(p)) out.push(`${p}: a row for no file`);
  return out.length ? out : ['the rows are out of their order'];
}

/** The tree's mapped files as they stand on the disk, sorted by path. */
export function treeSources(root = ROOT): Source[] {
  return FOLDERS.flatMap((d) => readdirSync(path.join(root, d), { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile())
    .map((e) => path.relative(root, path.join(e.parentPath, e.name)).replaceAll('\\', '/')))
    .filter(mapped)
    .sort(byPath)
    .map((p) => ({ path: p, text: readFileSync(path.join(root, p), 'utf8') }));
}

/** The committed map, read from the tree. */
export const written = (root = ROOT): string => readFileSync(path.join(root, MAP_FILE), 'utf8');
