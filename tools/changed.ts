// What a pull request changed, for the checks that look only at that: the files since the base, and
// the maps among them to sweep. A change to how every map is laid out or painted sweeps them all.
//   node tools/changed.ts <base>          the files changed since <base>, one a line
//   node tools/changed.ts <base> maps     'all', or the ids of the maps changed, comma-separated
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
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
  /^src\/ui\/(viewport|brush|palette|sprites)\.ts$/, /^src\/lib\/art\//, /^src\/game\/(map|outdoors|world|types)\.ts$/,
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

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [base, what] = process.argv.slice(2);
  if (!base) { console.error('usage: node tools/changed.ts <base> [maps]'); process.exit(2); }
  const files = changedFiles(base);
  if (what === 'maps') { const c = await changedMaps(files); console.log(c.all ? 'all' : c.maps.join(',')); }
  else console.log(files.join('\n'));
}
