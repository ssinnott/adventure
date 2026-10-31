// The scaffold's library (#984): a draft map cut from the atlas at a square, laid back and written
// out, which tools/scaffold.ts prints or writes and its suite holds. Moved here from that command
// line, as #899 moved the lanes', so a suite may take it. And the texture (#1107), a second pass that
// breaks a draft's long runs of one ground, or proposes as much for a built map.
import { worldGrid, mapAt, boxAt, box, TERRAINS, TI, MAP_TERRAIN, fbm, lattice } from '../../src/game/atlas.ts';
import type { Atlas, AtlasZone, WorldGrid, WorldTerrain, Pt } from '../../src/game/atlas.ts';
import { GameMap, LEGEND, passableCell } from '../../src/game/map.ts';
import type { MapDef } from '../../src/game/mapdef.ts';
import { NORTH, EAST, SOUTH, WEST } from '../../src/game/types.ts';
import type { Facing } from '../../src/game/types.ts';

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
  /** The squares the texture changed, where it was laid (`textured`). */
  textured?: readonly Change[];
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
    // Its area's sky, the Foreland's too: every map as written names its region (#945).
    ...(regions.includes(zone.area) ? { region: zone.area } : {}),
  };
  const said = notes(atlas, laid, def, x, y);
  if (!regions.includes(zone.area)) said.unshift(`area ${zone.area} has no region yet, so the draft names none until it has: the maps suite refuses it, and a World asked its sky throws`);
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
export function start(rows: readonly string[], laid: readonly Laid[], x: number, y: number): MapDef['start'] {
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

/** The draft as a map module, its notes in the header. `mapImport` is the path to src/game/mapdef.ts from where it lands. */
export function emit(d: Draft, zoneId: string, x: number, y: number, mapImport: string, typesImport: string): string {
  const { def } = d;
  const name = def.id.toUpperCase().replace(/[^A-Z0-9]+/g, '_');
  const tally = (o: Record<string, number | undefined>): string => Object.entries(o).sort((a, b) => b[1]! - a[1]!).map(([k, n]) => `${k} ${n}`).join(', ');
  const facing = ['NORTH', 'EAST', 'SOUTH', 'WEST'][def.start.facing];
  const lines = [
    `// A draft of ${def.name}, cut from the atlas at ${x},${y} by tools/scaffold.ts ${zoneId} ${x} ${y}${d.textured ? ' --texture' : ''}. The`,
    d.textured ? `// ground is the atlas's but on the ${d.textured.length} squares of its texture; everything else is to be authored (EXPANSION §8.2).`
      : '// ground is the atlas\'s square for square; everything else is to be authored (EXPANSION §8.2).',
    `// Terrain: ${tally(d.counts)}.`,
    `// Zones in the cut: ${tally(d.zones)}.`,
    ...d.notes.map((n) => `// - ${n[0].toUpperCase()}${n.slice(1)}.`),
    `import type { MapDef } from '${mapImport}';`,
    `import { ${facing} } from '${typesImport}';`,
    '',
    `export const ${name}: MapDef<'${def.id}'> = {`,
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

// ---------------------------------------------------------------- the texture (#1107)

/**
 * The texture's table: each ground the atlas lays in long runs, the grounds its patches are, each walked
 * as it is, and whether it is stony, where the odd rock stands. Steppe, ash and hills are: the built maps
 * stand a rock beside each on some 2.5% of its squares, beside grass less often and beside pine seldom.
 * Hills take heather and dirt, not grass: a hill is hill grass on its mound, so grass there reads as a
 * mound gone, not a second ground. The patch lies flat, as on any ground, and the mounds about it stand.
 */
export const TEXTURE: Partial<Record<WorldTerrain, { patches: readonly WorldTerrain[]; stony?: true }>> = {
  grass: { patches: ['dirt', 'heather'] }, steppe: { patches: ['dirt', 'sand'], stony: true },
  ash: { patches: ['dirt'], stony: true }, pine: { patches: ['woods'] }, hills: { patches: ['heather', 'dirt'], stony: true },
};
/** The most of a run of one ground the texture changes: a draft is a start, not a finished map. */
export const TEXTURE_SHARE = 0.25;
/**
 * The noise's scale in squares and the level a patch lies over; the fewest and most squares to a patch;
 * the scale its ground is picked at; a stony square's chance of a rock; the seed's offset from the atlas's.
 */
const PATCH = { scale: 3, over: 0.62, least: 3, most: 12, pick: 13, rock: 0.012, seed: 1107 };

/** A square the texture changes, in the map's own squares, as map characters. */
export interface Change { x: number; y: number; from: string; to: string }

/** Whether a map character is walked on by everyone, as the game's legend has it. */
const walkable = (ch: string | undefined): boolean => ch !== undefined && !!LEGEND[ch] && passableCell(LEGEND[ch]) === 'ok';
/** Water, as the coast is the land beside it: the sea, the shallows (a river is) and the tide's flats. */
const wet = (ch: string | undefined): boolean => ch !== undefined && ['sea', 'shallow', 'tidal'].includes(MAP_TERRAIN[ch]);

/**
 * The texture over a map's rows laid at world square `at`. In each run of a ground of the table, the
 * squares of it joined side by side, patches of a second ground where the world's noise is highest, on a
 * quarter of the run at most, each walked as the ground it replaces; then on a stony ground the odd rock,
 * only where all eight squares about it are walked, so that it closes no way. It leaves alone the edge
 * squares (the seams, #898), water and the coast beside it, the atlas's roads, trails and rivers
 * (`WorldGrid.road`, `.river`) and the squares `keep` names. The noise is the world square's, so the
 * drafts of two boxes agree where they meet; no region is asked, as the land past the zones has none.
 */
export function texture(atlas: Atlas, grid: WorldGrid, rows: readonly string[], at: Pt, keep: (x: number, y: number) => boolean = () => false): { rows: string[]; changes: Change[] } {
  const H = rows.length, W = Math.max(...rows.map((r) => r.length)), seed = atlas.seed + PATCH.seed;
  const cells = rows.map((r) => [...r]), ch = (x: number, y: number): string | undefined => cells[y]?.[x];
  const free = (x: number, y: number): boolean => {
    const wx = at[0] + x, wy = at[1] + y, k = wy * grid.width + wx;
    if (x <= 0 || y <= 0 || x >= W - 1 || y >= H - 1 || keep(x, y)) return false;
    if (wx >= 0 && wy >= 0 && wx < grid.width && wy < grid.height && (grid.river[k] || grid.road[k])) return false;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (wet(ch(x + dx, y + dy))) return false;
    return true;
  };
  const changes: Change[] = [], seen = new Uint8Array(W * H);
  const set = (x: number, y: number, to: string): void => { changes.push({ x, y, from: cells[y][x], to }); cells[y][x] = to; };
  for (let s0 = 0; s0 < W * H; s0++) {
    const c0 = ch(s0 % W, Math.floor(s0 / W)), row = c0 === undefined ? undefined : TEXTURE[MAP_TERRAIN[c0]];
    if (seen[s0] || !row) continue;
    const run = [s0];
    seen[s0] = 1;
    for (let q = 0; q < run.length; q++) {
      const x = run[q] % W, y = (run[q] - x) / W;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (nx >= 0 && nx < W && !seen[ny * W + nx] && ch(nx, ny) === c0) { seen[ny * W + nx] = 1; run.push(ny * W + nx); }
      }
    }
    let room = Math.floor(run.length * TEXTURE_SHARE);
    // The patches: where the noise is over its level, joined side by side, each grown from its peak by
    // the highest square beside it to PATCH.most at most, so that none fills a view's window (7 by 5) and
    // makes a plain view of its own; none under PATCH.least, a speck. The highest first while the run
    // has room, each one ground, picked at its peak.
    const level = new Map(run.map((s) => [s, fbm((at[0] + s % W) / PATCH.scale, (at[1] + Math.floor(s / W)) / PATCH.scale, seed, 2)]));
    const by = (a: number, b: number): number => level.get(b)! - level.get(a)! || a - b;
    const near = (s: number): number[] => [s - W, s + W, ...(s % W > 0 ? [s - 1] : []), ...(s % W < W - 1 ? [s + 1] : [])];
    const high = new Set(run.filter((s) => level.get(s)! > PATCH.over && free(s % W, Math.floor(s / W))));
    const found: number[][] = [];
    for (const s of [...high].sort(by)) {
      if (!high.has(s)) continue;
      const rise = new Set([s]), q = [s];
      high.delete(s);
      for (let k = 0; k < q.length; k++) for (const n of near(q[k])) if (high.delete(n)) { rise.add(n); q.push(n); }
      if (rise.size < PATCH.least) continue;
      const patch = [s];
      rise.delete(s);
      while (patch.length < PATCH.most) {
        const next = patch.flatMap(near).filter((n) => rise.has(n)).sort(by)[0];
        if (next === undefined) break;
        rise.delete(next); patch.push(next);
      }
      found.push(patch);
    }
    for (const patch of found) {
      if (room < PATCH.least) break;
      const [px, py] = [at[0] + patch[0] % W, at[1] + Math.floor(patch[0] / W)];
      const to = CHAR_OF[row.patches[fbm(px / PATCH.pick, py / PATCH.pick, seed + 1) < 0.5 ? 0 : row.patches.length - 1]];
      if (!to || walkable(to) !== walkable(c0)) continue;
      for (const s of patch.slice(0, room)) set(s % W, Math.floor(s / W), to);
      room -= Math.min(room, patch.length);
    }
    if (!row.stony) continue;
    for (const s of run) {
      const x = s % W, y = (s - x) / W;
      if (room <= 0 || ch(x, y) !== c0 || !free(x, y) || lattice(at[0] + x, at[1] + y, seed + 2) >= PATCH.rock) continue;
      let open = true;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) open &&= walkable(ch(x + dx, y + dy));
      if (open) { set(x, y, CHAR_OF.rock!); room--; }
    }
  }
  return { rows: cells.map((r) => r.join('')), changes };
}

/** A draft with the texture laid over it (`--texture`): its rows, counts, note and the squares changed, its start left alone. */
export function textured(atlas: Atlas, grid: WorldGrid, d: Draft, x: number, y: number): Draft {
  const { start } = d.def;
  const { rows, changes } = texture(atlas, grid, d.def.rows, [x, y], (i, j) => i === start.x && j === start.y);
  const counts: Partial<Record<WorldTerrain, number>> = {}, kinds: Record<string, number> = {};
  for (const r of rows) for (const c of r) counts[MAP_TERRAIN[c]] = (counts[MAP_TERRAIN[c]] ?? 0) + 1;
  for (const c of changes) { const k = `${MAP_TERRAIN[c.from]} to ${MAP_TERRAIN[c.to]}`; kinds[k] = (kinds[k] ?? 0) + 1; }
  const said = Object.entries(kinds).map(([k, n]) => `${k} ${n}`).join(', ');
  return { ...d, def: { ...d.def, rows }, counts, notes: [...d.notes, `textured on ${changes.length} squares${said ? `: ${said}` : ''}`], textured: changes };
}

/**
 * The texture over a built outdoor map laid at `at` (`--over`), for the author to take or leave: what
 * it would change, leaving alone every square the map names as well.
 */
export function over(atlas: Atlas, grid: WorldGrid, def: MapDef, at: Pt): { rows: string[]; changes: Change[] } {
  const W = Math.max(...def.rows.map((r) => r.length)), held = new Set<number>();
  for (const p of [def.start, ...Object.values(def.anchors ?? {}), ...(def.exits ?? []), ...(def.features ?? []), ...(def.secrets ?? []),
    ...(def.encounters ?? []), ...(def.gates ?? []), ...(def.houses ?? []), ...(def.banners ?? []), ...(def.landmarks ?? [])]) held.add(p.y * W + p.x);
  return texture(atlas, grid, def.rows, at, (x, y) => held.has(y * W + x));
}
