// The changed files' library (#984): the maps, monsters, rooms and areas a diff reaches, which the
// runner, the sheet and the sweep read and tools/changed.ts prints. Moved here from that command
// line, as #899 moved the lanes', so a suite may take it.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { graph, treeFiles, type Graph } from './graph.ts';
import { changedPaths } from './lanes.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const git = (...args: string[]): string[] => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean);

/**
 * The files changed since the base, from where the branch left it, uncommitted and new files
 * included, so a run on a working copy sees what the pull request will.
 */
export function changedFiles(base: string): string[] {
  const from = git('merge-base', base, 'HEAD')[0];
  return [...new Set([...git('diff', '--name-only', from), ...git('ls-files', '--others', '--exclude-standard')])].sort();
}

/**
 * What lays out or paints every map: a change to one sweeps them all. A zone moved on the atlas is
 * re-laid into the outdoors and its walls re-rolled, so the atlases count too. The scenery
 * (ui/scenery.ts) paints a map and the monsters do not: the scene the sweep paints draws none, so
 * neither the dispatcher (ui/sprites.ts) nor a family counts (#915). The one file of the folder it
 * does paint with is monsters/common.ts (`B` and `stroke`), so that counts, and the monsters' kit's
 * common.ts it re-exports; so do the paint kit's brush and the ink its outline takes (#983); so does
 * game/ink.ts, how a cell is drawn (`drawnCell`), which the painter and the sweep's plan both read;
 * and tools/kit/browser.ts, the Chromium and the page the smoke's sweep paints in (#986). The
 * narrowing counts every map too: tools/changed.ts, and this file, its library since #984. So do
 * the smoke's runner and every file of its parts in tools/smoke/, the sweep's cracks.ts and the
 * frame's boot.ts among them (#1006).
 */
const EVERY_MAP = [
  /^src\/ui\/(viewport|brush|palette|scenery)\.ts$/, /^src\/ui\/paint\/(brush|ink)\.ts$/, /^src\/ui\/monsters\/(kit\/)?common\.ts$/, /^src\/lib\/art\//, /^src\/game\/(map|outdoors|world|types|atlas|ink)\.ts$/,
  /^src\/content\/(index|maps|atlas|area)\.ts$/, /^src\/content\/areas\/[^/]+\/atlas\.ts$/, /^tools\/(smoke|smoke\/[^/]+|changed|sweep|kit\/(sweep|browser|changed))\.ts$/,
];
const MAP_FILE = /^src\/content\/areas\/[^/]+\/maps\/[^/]+\.ts$/;

/**
 * The maps among the files, by the ids their files export rather than their names; `all` where a
 * file changed that every map is painted by. A map file deleted has nothing left to sweep.
 */
export async function changedMaps(files: readonly string[]): Promise<{ all: boolean; maps: string[] }> {
  const all = files.some((f) => EVERY_MAP.some((re) => re.test(f)));
  const maps: string[] = [];
  for (const f of files.filter((f) => MAP_FILE.test(f) && existsSync(path.join(ROOT, f)))) {
    const mod = (await import(pathToFileURL(path.join(ROOT, f)).href)) as Record<string, unknown>;
    for (const v of Object.values(mod)) {
      if (v && typeof v === 'object' && typeof (v as { id?: unknown }).id === 'string' && Array.isArray((v as { rows?: unknown }).rows)) maps.push((v as { id: string }).id);
    }
  }
  return { all, maps: [...new Set(maps)] };
}

/** A file as it was at the merge base, or '' where it did not exist. */
function atBase(base: string, file: string): string {
  const from = git('merge-base', base, 'HEAD')[0];
  try { return execFileSync('git', ['show', `${from}:${file}`], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); }
  catch { return ''; }
}
const now = (file: string): string => (existsSync(path.join(ROOT, file)) ? readFileSync(path.join(ROOT, file), 'utf8') : '');

/**
 * What paints every monster: the dispatcher, ui/brush.ts and the art library, the paint kit and the
 * monsters' kit (src/ui/paint/, src/ui/monsters/kit/, #983); and a shared brush, a module of
 * ui/monsters/ that registers no kinds.
 */
const EVERY_MONSTER = [/^src\/ui\/(sprites|brush)\.ts$/, /^src\/ui\/(paint|monsters\/kit)\//, /^src\/lib\/art\//];
const FAMILY_FILE = /^src\/ui\/monsters\/([^/]+)\.ts$/;
/** The barrel that merges the families' kinds and says which family registers each. */
const BARREL = 'src/ui/monsters/index.ts';
const AREA_MONSTERS = /^src\/content\/areas\/([^/]+)\/monsters\.ts$/;
/** The families a text of the barrel merges, by their modules' names, as its import lines name them; tools/tests/changed.ts holds it to the barrel. */
export const familiesIn = (text: string): string[] => [...text.matchAll(/^import \{ SPRITES as \w+ \} from '\.\/([^']+)\.ts';$/gm)].map((m) => m[1]);

/**
 * The monsters among the files: every def of a kind registered by a family module that changed, as
 * the barrel says, or by a family the barrel merges that its base did not (a change to the barrel
 * counts only those); and every def whose line in its area's monsters.ts is new or differs from the
 * base's. `all` where a file changed that every monster is drawn by.
 */
export async function changedMonsters(files: readonly string[], base?: string): Promise<{ all: boolean; monsters: string[] }> {
  const { AREAS, MONSTERS } = await import('../../src/content/index.ts');
  let all = files.some((f) => EVERY_MONSTER.some((re) => re.test(f)));
  const out = new Set<string>();
  const { FAMILY_OF } = await import('../../src/ui/monsters/index.ts');
  const drawnBy = (families: readonly string[]): void => { for (const d of Object.values(MONSTERS)) if (families.includes(FAMILY_OF[d.sprite])) out.add(d.id); };
  const families = new Set<string>(Object.values(FAMILY_OF));
  for (const f of files.filter((f) => FAMILY_FILE.test(f) && f !== BARREL)) {
    const name = FAMILY_FILE.exec(f)![1];
    if (families.has(name)) drawnBy([name]);
    else all = true;
  }
  if (files.includes(BARREL)) { const was = familiesIn(base ? atBase(base, BARREL) : ''); drawnBy(familiesIn(now(BARREL)).filter((n) => !was.includes(n))); }
  for (const f of files) {
    // An area's table (content/index.ts).
    const area = AREAS.find((a) => a.id === AREA_MONSTERS.exec(f)?.[1]);
    if (!area) continue;
    const was = new Set((base ? atBase(base, f) : '').split('\n').map((l) => l.trim()));
    const lines = now(f).split('\n').map((l) => l.trim());
    for (const d of area.monsters) {
      const line = lines.find((l) => l.includes(`id: '${d.id}'`));
      if (!line || !was.has(line)) out.add(d.id);
    }
  }
  return { all, monsters: [...out] };
}

/**
 * What paints every room: the dispatcher, the kit and the shared props and rooms beside it, the rooms'
 * kit and the paint kit (src/ui/interiors/kit/, src/ui/paint/, #983), the brushes they borrow by their
 * old paths (ui/brush.ts, ui/monsters/gloss.ts), the art library and the pixel font (some rooms letter
 * their signs).
 */
const EVERY_INTERIOR = [/^src\/ui\/(interior|brush)\.ts$/, /^src\/ui\/interiors\/[^/]+\.ts$/, /^src\/ui\/(paint|interiors\/kit)\//, /^src\/ui\/monsters\/gloss\.ts$/, /^src\/lib\/art\//, /^src\/lib\/engine\/text\.ts$/];
/** A file under an area's folder of rooms (src/ui/interiors/<area>/): its scenes, the helpers they share and the folder's registry. */
const AREA_ROOMS = /^src\/ui\/interiors\/([^/]+)\//;
const AREA_INDEX = /^src\/content\/areas\/([^/]+)\/(index|interiors)\.ts$/;

/** The rooms an area's folder registers in its index.ts, as `SCENES` keys them; none where the folder or its registry is gone. */
async function roomsIn(folder: string): Promise<string[]> {
  const index = path.join(ROOT, 'src/ui/interiors', folder, 'index.ts');
  if (!existsSync(index)) return [];
  const mod = (await import(pathToFileURL(index).href)) as { SCENES?: Record<string, unknown> };
  return Object.keys(mod.SCENES ?? {});
}

/**
 * The interiors among the files: every room of an area when any file under its folder of rooms
 * changed (src/ui/interiors/<area>/), since the folder's scenes share helpers (kilns/hold.ts,
 * rimewater/lodge.ts) and borrow from one another (shelf/throne_room.ts takes its tower device from
 * warden_drillyard.ts), which no file's name says; the rooms are those the folder's own registry,
 * its index.ts, keys. And each an area's index (or its list of rooms drawn ahead of it) lists that
 * its base did not. `all` where a file changed that every room is painted by.
 */
export async function changedInteriors(files: readonly string[], base?: string): Promise<{ all: boolean; interiors: string[] }> {
  const { AREAS, INTERIORS } = await import('../../src/content/index.ts');
  const all = files.some((f) => EVERY_INTERIOR.some((re) => re.test(f)));
  const out = new Set<string>();
  for (const f of files) {
    const folder = AREA_ROOMS.exec(f)?.[1];
    if (folder) for (const id of await roomsIn(folder)) if ((INTERIORS as readonly string[]).includes(id)) out.add(id);
    const area = AREAS.find((a) => a.id === AREA_INDEX.exec(f)?.[1]);
    if (area) { const was = base ? atBase(base, f) : ''; for (const i of area.interiors) if (!was.includes(`'${i}'`)) out.add(i); }
  }
  return { all, interiors: [...out] };
}

/** A file of an area's folder, src/content/areas/<area>/, and the area. */
const AREA_FILE = /^src\/content\/areas\/([^/]+)\//;
/** An area's item or monster table. */
const AREA_TABLE = /^src\/content\/areas\/[^/]+\/(items|monsters)\.ts$/;
/**
 * An area's own rows (checks.ts), which tools/checks.ts loads by its file, an import the graph cannot
 * see; among them its rungs of the ladder (`gear`), which tools/kit/company.ts dresses every company from.
 */
const AREA_CHECKS = /^src\/content\/areas\/[^/]+\/checks\.ts$/;
/** What no run reads: the docs, the front pages, the type shims and .github/ but the workflow. */
const READ_BY_NONE = [/^docs\//, /^(README|CLAUDE)\.md$/, /^types\//, /^\.github\//];
/** What decides what runs: the workflow, the runner, this file and the kit it reads, the graph's and the lanes' (the diff's files). */
const DECIDES = ['.github/workflows/checks.yml', 'tools/test.ts', 'tools/changed.ts', 'tools/kit/changed.ts', 'tools/kit/graph.ts', 'tools/kit/lanes.ts'];
/**
 * The drawings, the monsters' and the rooms': the gate and the walkthroughs load them (src/game/game.ts
 * takes the screens) and draw none. A V8 coverage run (NODE_V8_COVERAGE) of both on 4b8986c9 (#955):
 * of the 913 functions of their 109 modules, 4 ran, each called by its own module's top level as it
 * loads (the barrel's `merge`, a table of points in cats.ts, the lantern's in hearth/bowl_lantern.ts).
 * The gate's fixed blocks load them all whatever runs, so a module that fails to load still fails.
 */
const DRAWINGS = /^src\/ui\/(monsters|interiors)\//;
/** The files the gate and the walkthroughs are, whose runtime imports are what they load. */
const READERS = (files: readonly string[]): string[] => ['tools/tests/gate.ts', ...files.filter((f) => /^src\/content\/areas\/[^/]+\/walkthrough\.ts$/.test(f))];

/**
 * Why a walkthrough runs that no import reaches (#955): the walkthroughs read other areas' maps and
 * tables through the registry, by scan (a find never told, sold, chested or dropped anywhere else:
 * `MAP_DEFS.flatMap(`, the Kilns' `MAP_DEFS.filter(`, Rimewater's `MAP_DEFS.some(` and
 * `Object.values(MONSTERS)`) and by id (Thornmark's Captain Hale on tide_ship3, Saltreach's boat to
 * wrackholm_e6). They cost seconds where the gate costs minutes, so every one runs.
 */
const READS = "the walkthroughs read other areas' maps and tables";

/**
 * What a diff reaches: every area, by the file named and why; or the areas, each with the file or the
 * relation that reached it, and `walks`, the areas whose walkthroughs alone it reaches, each with why.
 */
export interface Reach { all?: { file: string; why: string }; areas: Map<string, string>; walks: Map<string, string> }
/** A file's changed lines, `-` and `+`, as `git diff -U0` gives them; null where the file is gone. */
export type Lines = (file: string) => { removed: readonly string[]; added: readonly string[] } | null;

/** A line no def can feel the change or removal of: an import, a comment or a blank. */
const inert = (line: string): boolean => { const t = line.trim(); return !t || t.startsWith('import ') || t.startsWith('//') || t.startsWith('/*') || t.startsWith('*'); };

/**
 * The rungs of the ladder in a text of an area's checks.ts: its `gear` block, from the key to the brace
 * that closes it, its comments and blanks left out; '' where it has none (#968).
 */
export function rungsIn(text: string): string {
  const at = text.search(/^\s*gear\s*:/m);
  if (at < 0) return '';
  let depth = 0, end = text.length;
  for (let i = text.indexOf('{', at); i >= 0 && i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}' && !--depth) { end = i + 1; break; }
  }
  return text.slice(at, end).split('\n').filter((l) => !inert(l)).join('\n');
}

/**
 * The areas a diff reaches (#955): `files` its files, a rename at both ends; `removed(f)` the `-` lines
 * of `git diff -U0` of an area's items.ts or monsters.ts, null where the file is gone; `g` the runtime
 * import graph of the tree; `read(f)` a file as it stands and `was(f)` as it was at the merge base, ''
 * where it was not or is not known, so that every rung then reads as changed. A file
 * 1. under src/content/areas/<area>/ reaches that area;
 * 2. that is an area's items.ts or monsters.ts with a line changed or removed that is no import or
 *    comment, or deleted, reaches every area: items dress every company of the ladder and monsters
 *    fight in other areas' groups. A def only added reaches its own area's gate alone, and every
 *    walkthrough (READS) (the `-` lines are all it reads: a line inserted into a def that spans lines
 *    reads as a def added, and no item of the ladder spans lines); an area's checks.ts whose rungs of
 *    the ladder (`gear`, `rungsIn`) differ from the base's, or that is deleted, reaches every area, as
 *    every company dresses from them, and a change elsewhere in it (a seam, an edge, a figure owed)
 *    its own area alone (#968);
 * 3. that is any other of an area's files reaches also the areas whose files import it, and those
 *    whose files import theirs in turn, as far as the areas' own files go; and, where a line of it
 *    changed that is no import or comment, every walkthrough (READS), which an import does not show;
 * 4. elsewhere: what decides what runs reaches every area; the docs, the front pages, types/ and the
 *    rest of .github/ none, and so does a drawing; a module of the graph the gate or a walkthrough
 *    loads every area and one neither loads none; any other file, which the graph does not read, every
 *    area.
 */
export function reachedAreas(files: readonly string[], lines: Lines, g: Graph, read: (file: string) => string, was: (file: string) => string = () => ''): Reach {
  const areas = new Map<string, string>(), walks = new Map<string, string>(), known = new Set(g.files), by = new Map<string, string[]>();
  const walkers = READERS(g.files).slice(1).map((f) => f.split('/')[3]);
  const walkAll = (): void => { for (const a of walkers) if (!walks.has(a)) walks.set(a, READS); };
  const removed = (f: string): readonly string[] | null => lines(f)?.removed ?? null;
  for (const [f, to] of g.edges) for (const t of to) by.set(t, [...(by.get(t) ?? []), f]);
  const loaded = new Set<string>(), stack = READERS(g.files);
  while (stack.length) { const f = stack.pop()!; if (!loaded.has(f)) { loaded.add(f); stack.push(...(g.edges.get(f) ?? [])); } }
  for (const f of [...new Set(files)].sort()) {
    const area = AREA_FILE.exec(f)?.[1];
    if (area) {
      if (!areas.has(area)) areas.set(area, f);
      if (AREA_TABLE.test(f)) {
        const gone = removed(f), what = f.endsWith('/items.ts') ? 'items dress every company of the ladder' : "monsters fight in other areas' groups";
        if (gone === null) return { all: { file: f, why: `deleted, and ${what}` }, areas, walks };
        if (gone.some((l) => !inert(l))) return { all: { file: f, why: `a line changed or removed, and ${what}` }, areas, walks };
        if ((lines(f)?.added ?? []).some((l) => !inert(l))) walkAll();
        continue;
      }
      const changed = lines(f), felt = !changed || [...changed.removed, ...changed.added].some((l) => !inert(l));
      if (felt && AREA_CHECKS.test(f) && (!changed || rungsIn(was(f)) !== rungsIn(read(f))))
        return { all: { file: f, why: `${changed ? 'a rung changed' : 'deleted'}, and its rungs of the ladder dress every company` }, areas, walks };
      if (felt) walkAll();
      for (const walk = [f], seen = new Set(walk); walk.length;) {
        const at = walk.pop()!;
        for (const file of by.get(at) ?? []) {
          const to = AREA_FILE.exec(file)?.[1];
          if (!to || seen.has(file)) continue;
          seen.add(file); walk.push(file);
          if (!areas.has(to)) areas.set(to, `imports ${at.slice('src/content/areas/'.length)}`);
        }
      }
    } else if (DECIDES.includes(f)) return { all: { file: f, why: 'it decides what runs' }, areas, walks };
    else if (READ_BY_NONE.some((re) => re.test(f)) || DRAWINGS.test(f)) continue;
    else if (loaded.has(f)) return { all: { file: f, why: 'the gate or a walkthrough loads it' }, areas, walks };
    else if (!known.has(f) || !f.endsWith('.ts')) return { all: { file: f, why: 'the graph does not read it' }, areas, walks };
  }
  for (const a of areas.keys()) walks.delete(a);
  return { areas, walks };
}

/** The areas the diff since <base> reaches, read from git and the tree as it stands, uncommitted and new files included. */
export function changedAreas(base: string): Reach {
  const from = git('merge-base', base, 'HEAD')[0], fresh = new Set(git('ls-files', '--others', '--exclude-standard'));
  const read = (f: string): string => readFileSync(path.join(ROOT, f), 'utf8');
  const lines: Lines = (f) => {
    if (!existsSync(path.join(ROOT, f))) return null;
    if (fresh.has(f)) return { removed: [], added: read(f).split('\n') };
    const diff = git('diff', '-U0', '--no-renames', from, '--', f).filter((l) => !/^(--- (a\/|\/dev\/null)|\+\+\+ (b\/|\/dev\/null))/.test(l));
    return { removed: diff.filter((l) => l.startsWith('-')).map((l) => l.slice(1)), added: diff.filter((l) => l.startsWith('+')).map((l) => l.slice(1)) };
  };
  return reachedAreas(changedPaths(base), lines, graph(treeFiles(), read), read, (f) => atBase(base, f));
}

/**
 * A reach in words: `shelf (src/content/areas/shelf/maps/downs_e4.ts), thornmark (imports
 * shelf/walkthrough.ts)` and the walkthroughs reached alone, `every area, by package.json (...)` or `no area`.
 */
export const describeReach = (r: Reach): string => {
  if (r.all) return `every area, by ${r.all.file} (${r.all.why})`;
  const areas = r.areas.size ? [...r.areas].map(([a, why]) => `${a} (${why})`).join(', ') : 'no area';
  return r.walks.size ? `${areas}; and the walkthroughs of ${[...r.walks.keys()].join(', ')} (${READS})` : areas;
};
