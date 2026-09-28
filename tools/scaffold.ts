// A zone map's first draft, cut from the atlas, so the land walked matches the land painted
// (EXPANSION §8.2):
//   node tools/scaffold.ts <zone> <x> <y> [--id <map id>] [--out <file> [--force]]
// <zone> is an atlas zone (its name, area and band go to the draft); <x> <y> is the world square of
// the draft's top-left. Every one of its 32 by 32 squares is the atlas's, the road included, with no
// ring: the ways in and out, the landmarks and the groups are the author's. It prints the draft as a
// map module, or writes it with --out, and never overwrites a file without --force. The draft takes
// its area's region where the area has one; the Foreland's sky otherwise, and says so. It refuses an
// unknown zone, an id a built map has or no map id could be, and a cut that falls outside the world,
// lies over a laid zone map, or holds a terrain no map character is, saying how many squares of
// each. It registers nothing: that is the area's work.
import { writeFileSync, existsSync } from 'node:fs';
import { relative, dirname, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { worldGrid, mapAt, boxAt, box, TERRAINS, TI, MAP_TERRAIN } from '../src/game/atlas.ts';
import type { Atlas, AtlasZone, WorldGrid, WorldTerrain, Pt } from '../src/game/atlas.ts';
import { GameMap } from '../src/game/map.ts';
import type { MapDef } from '../src/game/map.ts';
import { NORTH, EAST, SOUTH, WEST, FACING_NAMES } from '../src/game/types.ts';
import type { Facing } from '../src/game/types.ts';

/** A draft is one lettered box of the atlas's grid. */
export const SIZE = 32;

/** Where a terrain has more than one character, the one a draft writes. */
const PREFER: Partial<Record<WorldTerrain, string>> = { dirt: ':', rock: 'r', building: 'B' };
/** The map character for each terrain that has one, read from MAP_TERRAIN so the two never drift. */
export const CHAR_OF: Partial<Record<WorldTerrain, string>> = {};
for (const [ch, t] of Object.entries(MAP_TERRAIN)) CHAR_OF[t] ??= ch;
Object.assign(CHAR_OF, PREFER);
for (const [t, ch] of Object.entries(CHAR_OF)) if (MAP_TERRAIN[ch!] !== t) throw new Error(`scaffold: '${ch}' is not ${t} in MAP_TERRAIN`);

/** An atlas square as a draft reads it: the road where one is marked, else the terrain (a river is shallows). */
export const squareOf = (g: WorldGrid, i: number): number => (g.road[i] ? TI.road : g.terrain[i]);

/** The atlas with a map laid at a place in its zone's list, as the area will lay it: the one place a draft is put back. */
export function layBack(atlas: Atlas, defs: readonly MapDef[], def: MapDef, zone: AtlasZone, at: Pt): { atlas: Atlas; defs: MapDef[] } {
  const zones = atlas.zones.map((z) => (z.id === zone.id ? { ...z, maps: [...(z.maps ?? []), { map: def.id, at }] } : z));
  return { atlas: { ...atlas, zones }, defs: [...defs, def] };
}

/** The squares of the cut where the draft, laid back, is not the atlas: 0 is a faithful draft. */
export function mismatches(before: WorldGrid, after: WorldGrid, x: number, y: number): number {
  let n = 0;
  for (let j = 0; j < SIZE; j++) for (let i = 0; i < SIZE; i++) {
    const k = (y + j) * before.width + x + i;
    if (squareOf(before, k) !== after.terrain[k]) n++;
  }
  return n;
}

export interface Draft {
  def: MapDef;
  /** Squares of each terrain in the cut. */
  counts: Partial<Record<WorldTerrain, number>>;
  /** Squares of each atlas zone in the cut: a cut is never masked by zone. */
  zones: Record<string, number>;
  /** What the author should know, one line each: the grid, the seams, the road's ends, the plates. */
  notes: string[];
}

/** The world laid out once: a draft cut from it, then laid back, is compared with it. */
export const baseline = (atlas: Atlas, defs: readonly MapDef[]): WorldGrid => worldGrid(atlas, defs);

/** What a map id may be: the save keeps state under it. */
const MAP_ID = /^[a-z][a-z0-9_]*$/;

/**
 * The draft of `zoneId`'s map at world square x,y, or the reason there is none. Pure: `grid` is the
 * atlas as laid out with `defs`, and `regions` the areas built far enough to have a sky of their own.
 */
export function cut(atlas: Atlas, defs: readonly MapDef[], grid: WorldGrid, regions: readonly string[], zoneId: string, x: number, y: number, id = zoneId): Draft | { refused: string } {
  const zone = atlas.zones.find((z) => z.id === zoneId);
  if (!zone) return { refused: `no zone '${zoneId}' in the atlas` };
  if (!MAP_ID.test(id)) return { refused: `'${id}' is no map id: lower case letters, digits and _, a letter first` };
  if (defs.some((d) => d.id === id)) return { refused: `a map '${id}' is built already; --id names the draft another` };
  if (!Number.isInteger(x) || !Number.isInteger(y)) return { refused: `${x},${y} is not a square` };
  const W = grid.width, H = grid.height;
  if (x < 0 || y < 0 || x + SIZE > W || y + SIZE > H) return { refused: `${x},${y} to ${x + SIZE - 1},${y + SIZE - 1} falls outside the world (${W} by ${H})` };
  // A zone map already laid there: its whole footprint, ring and all, as the outdoors lays it.
  const laid = laidMaps(atlas, defs);
  for (const l of laid) if (x < l.x + l.w && l.x < x + SIZE && y < l.y + l.h && l.y < y + SIZE) return { refused: `lies over ${l.id}, laid at ${l.x},${l.y}` };

  const counts: Partial<Record<WorldTerrain, number>> = {}, zones: Record<string, number> = {};
  const rows: string[] = [];
  for (let j = 0; j < SIZE; j++) {
    let row = '';
    for (let i = 0; i < SIZE; i++) {
      const k = (y + j) * W + x + i, t = TERRAINS[squareOf(grid, k)];
      counts[t] = (counts[t] ?? 0) + 1;
      const z = grid.zone[k] >= 0 ? atlas.zones[grid.zone[k]].id : 'none';
      zones[z] = (zones[z] ?? 0) + 1;
      row += CHAR_OF[t] ?? '?';
    }
    rows.push(row);
  }
  const lossy = Object.entries(counts).filter(([t]) => !CHAR_OF[t as WorldTerrain]);
  if (lossy.length) return { refused: `holds terrain no map character is: ${lossy.map(([t, n]) => `${t} ${n}`).join(', ')}` };

  const area = atlas.areas.find((a) => a.id === zone.area);
  const band = zone.band ?? area?.band;
  const def: MapDef = {
    // Country until the author says it is core: the floor tools/tests/density.ts holds it to.
    id, name: zone.name, kind: 'outdoor', density: 'country', rows,
    start: start(rows, laid, x, y),
    ...(band ? { band: [band[0], band[1]] as [number, number] } : {}),
    // The Foreland's sky is the default; another area's zone shares its own.
    ...(zone.area !== 'shelf' && regions.includes(zone.area) ? { region: zone.area as MapDef['region'] } : {}),
  };
  const said = notes(atlas, laid, def, x, y);
  if (!regions.includes(zone.area)) said.unshift(`area ${zone.area} has no region yet, so the draft shares the Foreland's sky until it has`);
  return { def, counts, zones, notes: said };
}

interface Laid { id: string; x: number; y: number; w: number; h: number }
function laidMaps(atlas: Atlas, defs: readonly MapDef[]): Laid[] {
  const out: Laid[] = [];
  for (const z of atlas.zones) for (const { map, at } of z.maps ?? []) {
    const def = defs.find((d) => d.id === map && d.kind === 'outdoor');
    if (def) out.push({ id: def.id, x: at[0], y: at[1], w: Math.max(...def.rows.map((r) => r.length)), h: def.rows.length });
  }
  return out;
}

/** Squares from a world square to the nearest laid map. */
const toLaid = (laid: readonly Laid[], wx: number, wy: number): number =>
  Math.min(Infinity, ...laid.map((l) => Math.max(0, l.x - wx, wx - (l.x + l.w - 1)) + Math.max(0, l.y - wy, wy - (l.y + l.h - 1))));

/**
 * Where the party first stands: the road where it meets the edge nearest a laid map, facing in; with
 * no road at the edge, the middlemost open square of the largest open ground.
 */
function start(rows: readonly string[], laid: readonly Laid[], x: number, y: number): MapDef['start'] {
  const road = CHAR_OF.road;
  let best: MapDef['start'] | undefined, bestD = Infinity;
  for (let j = 0; j < SIZE; j++) for (let i = 0; i < SIZE; i++) {
    const facing: Facing | undefined = i === 0 ? EAST : i === SIZE - 1 ? WEST : j === 0 ? SOUTH : j === SIZE - 1 ? NORTH : undefined;
    if (facing === undefined || rows[j][i] !== road) continue;
    const d = toLaid(laid, x + i, y + j);
    if (d < bestD) { bestD = d; best = { x: i, y: j, facing }; }
  }
  if (best) return best;
  const m = new GameMap({ id: 'scaffold', name: '', kind: 'outdoor', rows, start: { x: 0, y: 0, facing: NORTH } });
  const seen = new Int32Array(SIZE * SIZE).fill(-1);
  let bestRegion: number[] = [];
  for (let s = 0; s < SIZE * SIZE; s++) {
    if (seen[s] >= 0 || m.passable(s % SIZE, Math.floor(s / SIZE)) !== 'ok') continue;
    const region = [s];
    seen[s] = s;
    for (let q = 0; q < region.length; q++) {
      const c = region[q], cx = c % SIZE, cy = (c - cx) / SIZE;
      for (const [nx, ny] of [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]]) {
        const n = ny * SIZE + nx;
        if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE || seen[n] >= 0 || m.passable(nx, ny) !== 'ok') continue;
        seen[n] = s; region.push(n);
      }
    }
    if (region.length > bestRegion.length) bestRegion = region;
  }
  const mid = (SIZE - 1) / 2;
  const c = bestRegion.reduce((a, b) => (Math.hypot(b % SIZE - mid, Math.floor(b / SIZE) - mid) < Math.hypot(a % SIZE - mid, Math.floor(a / SIZE) - mid) ? b : a), bestRegion[0] ?? 0);
  return { x: c % SIZE, y: Math.floor(c / SIZE), facing: NORTH };
}

/** The author's notes: the box grid, each edge's neighbour and where the road crosses it, the plates and sites inside. */
function notes(atlas: Atlas, laid: readonly Laid[], def: MapDef, x: number, y: number): string[] {
  const out: string[] = [];
  // Every outdoor map is one box of the atlas's grid; a draft off it is allowed, and said.
  const name = boxAt(atlas, x, y), b = name ? box(atlas, name) : undefined;
  if (!b) out.push(`off the grid: ${x},${y} lies in no box`);
  else if (b.x !== x || b.y !== y || b.w !== SIZE || b.h !== SIZE) out.push(`off the grid: ${x},${y} starts in ${b.name}, which is ${b.x},${b.y} (${b.w}x${b.h})`);
  else out.push(`box ${b.name}`);
  const edges: { name: string; sq: (n: number) => [number, number]; out: (n: number) => [number, number] }[] = [
    { name: 'north', sq: (n) => [n, 0], out: (n) => [x + n, y - 1] },
    { name: 'east', sq: (n) => [SIZE - 1, n], out: (n) => [x + SIZE, y + n] },
    { name: 'south', sq: (n) => [n, SIZE - 1], out: (n) => [x + n, y + SIZE] },
    { name: 'west', sq: (n) => [0, n], out: (n) => [x - 1, y + n] },
  ];
  const road = CHAR_OF.road;
  for (const e of edges) {
    const faces = new Map<string, number>(), crossings: number[] = [];
    for (let n = 0; n < SIZE; n++) {
      const [ox, oy] = e.out(n), l = laid.find((q) => ox >= q.x && ox < q.x + q.w && oy >= q.y && oy < q.y + q.h);
      if (l) faces.set(l.id, (faces.get(l.id) ?? 0) + 1);
      const [i, j] = e.sq(n);
      if (def.rows[j][i] === road) crossings.push(n);
    }
    for (const [id, n] of faces) {
      const l = laid.find((q) => q.id === id)!;
      const ring = e.name === 'east' || e.name === 'west' ? `column ${e.name === 'east' ? 0 : l.w - 1}` : `row ${e.name === 'south' ? 0 : l.h - 1}`;
      out.push(`the ${e.name} edge faces ${id} on ${n} squares: its ${ring} is its seam, and both sides are the author's`);
    }
    if (crossings.length) out.push(`the road crosses the ${e.name} edge at ${crossings.map((n) => e.sq(n).join(',')).join(' ')}`);
  }
  // Plates and sites are painted, not played: a door or a way out is the author's.
  const inCut = (p: Pt): boolean => p[0] >= x && p[0] < x + SIZE && p[1] >= y && p[1] < y + SIZE;
  const local = (p: Pt): string => `${Math.floor(p[0] - x)},${Math.floor(p[1] - y)}`;
  for (const s of atlas.sites) {
    const at = s.map ? mapAt(atlas, s.map) : undefined;
    if (s.map && !at) continue;
    const p: Pt = at ? [s.at[0] + at[0], s.at[1] + at[1]] : s.at;
    if (inCut(p)) out.push(`site ${s.name} (${s.icon}${s.planned ? ', planned' : ''}) at ${local(p)}`);
  }
  for (const p of atlas.places) if (inCut(p.at)) out.push(`place ${p.id} (${p.kind}${p.planned ? ', planned' : ''}) plated at ${local(p.at)}`);
  for (const k of atlas.links) for (const p of [k.a, k.b]) if (p && inCut(p)) out.push(`way ${k.from} -> ${k.to} (${k.kind}) meets it at ${local(p)}`);
  return out;
}

/** The draft as a map module, its notes in the header. `mapImport` is the path to src/game/map.ts from where it lands. */
export function emit(d: Draft, zoneId: string, x: number, y: number, mapImport: string, typesImport: string): string {
  const { def } = d;
  const name = def.id.toUpperCase().replace(/[^A-Z0-9]+/g, '_');
  const tally = (o: Record<string, number | undefined>): string => Object.entries(o).sort((a, b) => b[1]! - a[1]!).map(([k, n]) => `${k} ${n}`).join(', ');
  const facing = ['NORTH', 'EAST', 'SOUTH', 'WEST'][def.start.facing];
  const lines = [
    `// A draft of ${def.name}, cut from the atlas at ${x},${y} by tools/scaffold.ts ${zoneId} ${x} ${y}. The`,
    '// ground is the atlas\'s square for square; everything else is to be authored (EXPANSION §8.2).',
    `// Terrain: ${tally(d.counts)}.`,
    `// Zones in the cut: ${tally(d.zones)}.`,
    ...d.notes.map((n) => `// - ${n[0].toUpperCase()}${n.slice(1)}.`),
    `import type { MapDef } from '${mapImport}';`,
    `import { ${facing} } from '${typesImport}';`,
    '',
    `export const ${name}: MapDef = {`,
    `  id: '${def.id}',`,
    `  name: '${def.name.replace(/'/g, "\\'")}',`,
    `  kind: 'outdoor',`,
    ...(def.density ? [`  density: '${def.density}',`] : []),
    ...(def.band ? [`  band: [${def.band[0]}, ${def.band[1]}],`] : []),
    ...(def.region ? [`  region: '${def.region}',`] : []),
    `  start: { x: ${def.start.x}, y: ${def.start.y}, facing: ${facing} },`,
    '  rows: [',
    ...def.rows.map((r) => `    '${r}',`),
    '  ],',
    '};',
    '',
  ];
  return lines.join('\n');
}

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
  const text = emit(d, zoneId, x, y, importFrom(out, 'map.ts'), importFrom(out, 'types.ts'));
  if (out) { writeFileSync(out, text); console.log(`scaffold: wrote ${def(d)} to ${out}`); }
  else process.stdout.write(text);
  console.error(`scaffold: ${def(d)}, start ${d.def.start.x},${d.def.start.y} facing ${FACING_NAMES[d.def.start.facing]}`);
}
const def = (d: Draft): string => `${d.def.id} (${SIZE} by ${SIZE}, cut at the atlas square)`;

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((e: unknown) => { console.error(e); process.exit(1); });
