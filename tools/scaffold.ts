// A zone map's first draft, cut from the atlas, so the land walked matches the land painted
// (EXPANSION §8.2):
//   node tools/scaffold.ts <zone> <x> <y> [--id <map id>] [--out <file> [--force]]
// <zone> is an atlas zone (its name, area and band go to the draft); <x> <y> is the world square of
// the draft's top-left. Every one of its 32 by 32 squares is the atlas's, the road included, with no
// ring: the ways in and out, the landmarks and the groups are the author's. It prints the draft as a
// map module, or writes it with --out, and never overwrites a file without --force. The draft takes
// its area's region where the area has one, and none otherwise, and says so. It refuses an
// unknown zone, an id a built map has or no map id could be, and a cut that falls outside the world,
// lies over a laid zone map, or holds a terrain no map character is, saying how many squares of
// each. It registers nothing: that is the area's work.
import { writeFileSync, existsSync } from 'node:fs';
import { relative, dirname, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { FACING_NAMES } from '../src/game/types.ts';
import { SIZE, type Draft, baseline, cut, start, emit } from './kit/scaffold.ts';

/** The import path of a module under src/game/ from a file that lands at `out`, or in an area's maps folder. */
const importFrom = (out: string | undefined, file: string): string => {
  if (!out) return `../../../../game/${file}`;
  const rel = relative(dirname(resolve(out)), fileURLToPath(new URL(`../src/game/${file}`, import.meta.url))).split('\\').join('/');
  return rel.startsWith('.') ? rel : './' + rel;
};

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const refuse = (why: string): never => { console.error(`scaffold: ${why}`); process.exit(1); };
  const opt = (name: string): string | undefined => {
    const i = args.indexOf('--' + name);
    if (i < 0) return undefined;
    const v = args.splice(i, 2)[1];
    if (v === undefined || v.startsWith('--')) refuse(`--${name} wants a value`);
    return v;
  };
  const flag = (name: string): boolean => { const i = args.indexOf('--' + name); if (i >= 0) args.splice(i, 1); return i >= 0; };
  const out = opt('out'), id = opt('id'), force = flag('force');
  const [zoneId, sx, sy] = args;
  if (!zoneId || sx === undefined || sy === undefined || args.length > 3) refuse('usage: node tools/scaffold.ts <zone> <x> <y> [--id <map id>] [--out <file> [--force]]');
  if (out && existsSync(out) && !force) refuse(`${out} exists; --force to overwrite it`);
  const { ATLAS, MAP_DEFS, AREAS } = await import('../src/content/index.ts');
  const x = Number(sx), y = Number(sy);
  const d = cut(ATLAS, MAP_DEFS, baseline(ATLAS, MAP_DEFS), AREAS.map((a) => a.id), zoneId, x, y, id);
  if ('refused' in d) return refuse(d.refused);
  const text = emit(d, zoneId, x, y, importFrom(out, 'mapdef.ts'), importFrom(out, 'types.ts'));
  if (out) { writeFileSync(out, text); console.log(`scaffold: wrote ${def(d)} to ${out}`); }
  else process.stdout.write(text);
  console.error(`scaffold: ${def(d)}, start ${d.def.start.x},${d.def.start.y} facing ${FACING_NAMES[d.def.start.facing]}`);
}
const def = (d: Draft): string => `${d.def.id} (${SIZE} by ${SIZE}, cut at the atlas square)`;

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((e: unknown) => { console.error(e); process.exit(1); });
