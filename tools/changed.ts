// What a pull request changed, for the checks that look only at that: the files since the base, and
// the maps among them to sweep, and the monsters and interiors among them for the contact sheet
// (tools/sheet.ts). A change to how every map, monster or room is laid out or painted counts them all,
// and a change to any file in an area's folder of rooms counts every room of that area.
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
 * re-laid into the outdoors and its walls re-rolled, so the atlases count too. The scenery
 * (ui/scenery.ts) paints a map and the monsters do not: the scene the sweep paints draws none, so
 * neither the dispatcher (ui/sprites.ts) nor a family counts (#915). The one file of the folder it
 * does paint with is monsters/common.ts (`B` and `stroke`), so that counts.
 */
const EVERY_MAP = [
  /^src\/ui\/(viewport|brush|palette|scenery)\.ts$/, /^src\/ui\/monsters\/common\.ts$/, /^src\/lib\/art\//, /^src\/game\/(map|outdoors|world|types|atlas)\.ts$/,
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

/** What paints every monster: the dispatcher, ui/brush.ts and the art library; and a shared brush, a module of ui/monsters/ that registers no kinds. */
const EVERY_MONSTER = [/^src\/ui\/(sprites|brush)\.ts$/, /^src\/lib\/art\//];
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
  const { AREAS, AHEAD, MONSTERS } = await import('../src/content/index.ts');
  let all = files.some((f) => EVERY_MONSTER.some((re) => re.test(f)));
  const out = new Set<string>();
  const { FAMILY_OF } = await import('../src/ui/monsters/index.ts');
  const drawnBy = (families: readonly string[]): void => { for (const d of Object.values(MONSTERS)) if (families.includes(FAMILY_OF[d.sprite])) out.add(d.id); };
  const families = new Set<string>(Object.values(FAMILY_OF));
  for (const f of files.filter((f) => FAMILY_FILE.test(f) && f !== BARREL)) {
    const name = FAMILY_FILE.exec(f)![1];
    if (families.has(name)) drawnBy([name]);
    else all = true;
  }
  if (files.includes(BARREL)) { const was = familiesIn(base ? atBase(base, BARREL) : ''); drawnBy(familiesIn(now(BARREL)).filter((n) => !was.includes(n))); }
  for (const f of files) {
    // An area's table, or one drawn ahead of its area's first map (content/index.ts).
    const area = [...AREAS, ...AHEAD].find((a) => a.id === AREA_MONSTERS.exec(f)?.[1]);
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

/** What paints every room: the dispatcher, the kit and the shared props and rooms beside it, the brushes they borrow (ui/brush.ts, ui/monsters/gloss.ts), the art library and the pixel font (some rooms letter their signs). */
const EVERY_INTERIOR = [/^src\/ui\/(interior|brush)\.ts$/, /^src\/ui\/interiors\/[^/]+\.ts$/, /^src\/ui\/monsters\/gloss\.ts$/, /^src\/lib\/art\//, /^src\/lib\/engine\/text\.ts$/];
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
  const { AREAS, ROOMS_AHEAD, INTERIORS } = await import('../src/content/index.ts');
  const all = files.some((f) => EVERY_INTERIOR.some((re) => re.test(f)));
  const out = new Set<string>();
  for (const f of files) {
    const folder = AREA_ROOMS.exec(f)?.[1];
    if (folder) for (const id of await roomsIn(folder)) if ((INTERIORS as readonly string[]).includes(id)) out.add(id);
    const area = [...AREAS, ...ROOMS_AHEAD].find((a) => a.id === AREA_INDEX.exec(f)?.[1]);
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
