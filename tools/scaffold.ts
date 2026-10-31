// A zone map's first draft, cut from the atlas, so the land walked matches the land painted
// (EXPANSION §8.2):
//   node tools/scaffold.ts <zone> <x> <y> [--id <map id>] [--texture] [--out <file> [--force]]
//   node tools/scaffold.ts --over <map id>
// <zone> is an atlas zone (its name, area and band go to the draft); <x> <y> is the world square of
// the draft's top-left. Every one of its 32 by 32 squares is the atlas's, the road included, with no
// ring: the ways in and out, the landmarks and the groups are the author's. It prints the draft as a
// map module, or writes it with --out, and never overwrites a file without --force. The draft takes
// its area's region where the area has one, and none otherwise, and says so. It refuses an
// unknown zone, an id a built map has or no map id could be, and a cut that falls outside the world,
// lies over a laid zone map, or holds a terrain no map character is, saying how many squares of
// each. It registers nothing: that is the area's work.
// --texture lays a second pass over the cut (#1107, `texture` in tools/kit/scaffold.ts): in each run
// of grass, steppe, ash, pine or hills, patches of a second ground by the world's noise, each walked as
// the ground it replaces, and on steppe, ash and hills the odd rock, which closes no way; never on an
// edge, the coast, water, a road or a river, nor on more than a quarter of a run. --over runs the same pass over
// a built outdoor map and prints each square it would change, x,y: from -> to, grouped by the change,
// and the map's plain views before and after (#1108), for the author to take or leave. It writes nothing.
import { writeFileSync, existsSync } from 'node:fs';
import { relative, dirname, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { FACING_NAMES } from '../src/game/types.ts';
import { MAP_TERRAIN, mapAt } from '../src/game/atlas.ts';
import { SIZE, type Draft, type Change, baseline, cut, emit, textured, over } from './kit/scaffold.ts';
import { plainShare } from './kit/rules/plain.ts';

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
  const out = opt('out'), id = opt('id'), mapId = opt('over'), force = flag('force'), tex = flag('texture');
  if (mapId !== undefined) {
    if (args.length || out || id || force || tex) refuse('usage: node tools/scaffold.ts --over <map id>');
    const { ATLAS, MAP_DEFS } = await import('../src/content/index.ts');
    const map = MAP_DEFS.find((m) => m.id === mapId && m.kind === 'outdoor'), at = map && mapAt(ATLAS, map.id);
    if (!map || !at) return refuse(`no outdoor map '${mapId}' is laid in the atlas`);
    const r = over(ATLAS, baseline(ATLAS, MAP_DEFS), map, at), groups = new Map<string, Change[]>();
    for (const c of r.changes) groups.set(`${c.from} -> ${c.to}`, [...groups.get(`${c.from} -> ${c.to}`) ?? [], c]);
    for (const [k, cs] of groups) console.log([`${MAP_TERRAIN[cs[0].from]} to ${MAP_TERRAIN[cs[0].to]}: ${cs.length}`, ...cs.map((c) => `  ${c.x},${c.y}: ${k}`)].join('\n'));
    const pct = (p: { views: number; share: number }): string => `${(100 * p.share).toFixed(1)}% of ${p.views}`;
    console.log(`scaffold: the texture would change ${r.changes.length} squares of ${map.id}, laid at ${at.join(',')}, and writes none; its plain views ${pct(plainShare(map))}, textured ${pct(plainShare({ ...map, rows: r.rows }))}`);
    return;
  }
  const [zoneId, sx, sy] = args;
  if (!zoneId || sx === undefined || sy === undefined || args.length > 3) refuse('usage: node tools/scaffold.ts <zone> <x> <y> [--id <map id>] [--texture] [--out <file> [--force]]');
  if (out && existsSync(out) && !force) refuse(`${out} exists; --force to overwrite it`);
  const { ATLAS, MAP_DEFS, AREAS } = await import('../src/content/index.ts');
  const x = Number(sx), y = Number(sy), grid = baseline(ATLAS, MAP_DEFS);
  const bare = cut(ATLAS, MAP_DEFS, grid, AREAS.map((a) => a.id), zoneId, x, y, id);
  if ('refused' in bare) return refuse(bare.refused);
  const d = tex ? textured(ATLAS, grid, bare, x, y) : bare;
  const text = emit(d, zoneId, x, y, importFrom(out, 'mapdef.ts'), importFrom(out, 'types.ts'));
  if (out) { writeFileSync(out, text); console.log(`scaffold: wrote ${def(d)} to ${out}`); }
  else process.stdout.write(text);
  console.error(`scaffold: ${def(d)}, start ${d.def.start.x},${d.def.start.y} facing ${FACING_NAMES[d.def.start.facing]}`);
}
const def = (d: Draft): string => `${d.def.id} (${SIZE} by ${SIZE}, cut at the atlas square${d.textured ? `, textured on ${d.textured.length}` : ''})`;

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((e: unknown) => { console.error(e); process.exit(1); });
