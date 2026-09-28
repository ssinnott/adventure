// What a pull request changed, for the checks that look only at that: the files since the base, and
// the maps among them to sweep, and the monsters and interiors among them for the contact sheet
// (tools/sheet.ts). A change to how every map, monster or room is laid out or painted counts them all.
//   node tools/changed.ts <base>              the files changed since <base>, one a line
//   node tools/changed.ts <base> maps         'all', or the ids of the maps changed, comma-separated
//   node tools/changed.ts <base> monsters     the same for the monsters
//   node tools/changed.ts <base> interiors    and for the interiors
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
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
 * re-laid into the outdoors and its walls re-rolled, so the atlases count too.
 */
const EVERY_MAP = [
  /^src\/ui\/(viewport|brush|palette|sprites)\.ts$/, /^src\/lib\/art\//, /^src\/game\/(map|outdoors|world|types|atlas)\.ts$/,
  /^src\/content\/(index|maps|atlas|area)\.ts$/, /^src\/content\/areas\/[^/]+\/atlas\.ts$/, /^tools\/(smoke|changed)\.ts$/,
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

/** What paints every monster: the dispatcher, ui/brush.ts, the shared brushes (any module in ui/monsters/ with no KINDS of its own) and the art library. */
const EVERY_MONSTER = [/^src\/ui\/(sprites|brush)\.ts$/, /^src\/lib\/art\//];
const FAMILY_FILE = /^src\/ui\/monsters\/[^/]+\.ts$/;
const AREA_MONSTERS = /^src\/content\/areas\/([^/]+)\/monsters\.ts$/;
/** The sprite kinds a family module draws, as its KINDS lists them; null for a shared module. */
const kindsOf = (text: string): string[] | null => {
  const m = /export const KINDS[^=]*=\s*\[([^\]]*)\]/.exec(text);
  return m ? [...m[1].matchAll(/'([^']+)'/g)].map((k) => k[1]) : null;
};

/**
 * The monsters among the files: every def drawn by a family module that changed, and every def
 * whose line in its area's monsters.ts is new or differs from the base's. `all` where a file
 * changed that every monster is drawn by.
 */
export async function changedMonsters(files: readonly string[], base?: string): Promise<{ all: boolean; monsters: string[] }> {
  const { AREAS, MONSTERS } = await import('../src/content/index.ts');
  let all = files.some((f) => EVERY_MONSTER.some((re) => re.test(f)));
  const out = new Set<string>();
  for (const f of files.filter((f) => FAMILY_FILE.test(f))) {
    const kinds = kindsOf(now(f) || (base ? atBase(base, f) : ''));
    if (!kinds) { all = true; continue; }
    for (const d of Object.values(MONSTERS)) if (kinds.includes(d.sprite)) out.add(d.id);
  }
  for (const f of files) {
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

/** What paints every room: the dispatcher, the kit and the shared props and rooms beside it, the brushes they borrow (ui/brush.ts, ui/monsters/gloss.ts) and the art library. */
const EVERY_INTERIOR = [/^src\/ui\/(interior|brush)\.ts$/, /^src\/ui\/interiors\/[^/]+\.ts$/, /^src\/ui\/monsters\/gloss\.ts$/, /^src\/lib\/art\//];
const SCENE_FILE = /^src\/ui\/interiors\/[^/]+\/([^/]+)\.ts$/;
const AREA_INDEX = /^src\/content\/areas\/([^/]+)\/index\.ts$/;

/**
 * The interiors among the files: each whose scene file (named for it) changed, and each an area's
 * index lists that its base did not. `all` where a file changed that every room is painted by.
 */
export async function changedInteriors(files: readonly string[], base?: string): Promise<{ all: boolean; interiors: string[] }> {
  const { AREAS, INTERIORS } = await import('../src/content/index.ts');
  const all = files.some((f) => EVERY_INTERIOR.some((re) => re.test(f)));
  const out = new Set<string>();
  for (const f of files) {
    const id = SCENE_FILE.exec(f)?.[1];
    if (id && (INTERIORS as readonly string[]).includes(id)) out.add(id);
    const area = AREAS.find((a) => a.id === AREA_INDEX.exec(f)?.[1]);
    if (area) { const was = base ? atBase(base, f) : ''; for (const i of area.interiors) if (!was.includes(`'${i}'`)) out.add(i); }
  }
  return { all, interiors: [...out] };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [base, what] = process.argv.slice(2);
  if (!base || (what && !['maps', 'monsters', 'interiors'].includes(what))) { console.error('usage: node tools/changed.ts <base> [maps|monsters|interiors]'); process.exit(2); }
  const files = changedFiles(base);
  if (what === 'maps') { const c = await changedMaps(files); console.log(c.all ? 'all' : c.maps.join(',')); }
  else if (what === 'monsters') { const c = await changedMonsters(files, base); console.log(c.all ? 'all' : c.monsters.join(',')); }
  else if (what === 'interiors') { const c = await changedInteriors(files, base); console.log(c.all ? 'all' : c.interiors.join(',')); }
  else console.log(files.join('\n'));
}
