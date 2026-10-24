// One script for #968: moves the suites' rows and the atlas's own links onto their areas, each as the
// area's field (#897's), and names the respawn figures (`RESPAWN`, src/game/keys.ts). A row goes to its
// owner: a zone by its area, a group, a monster and an exit by the area whose maps or monsters hold it,
// a seam by the area of its first box, a rung by the last area on the road whose items it holds (the
// ladder suite's rule), a link by the area both its ends are in (one between two areas stays). Each
// table is left empty, not deleted (#969). Run again on the head once main is merged in, it finds nothing
// left to move. It is committed first and deleted last, so the history keeps it and the tree does not.
//   node tools/move-rows.ts [--dry]
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AREAS, ATLAS } from '../src/content/index.ts';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DRY = process.argv.includes('--dry');
const files = new Map<string, string>();
const read = (p: string): string => files.get(p) ?? (existsSync(ROOT + p) ? readFileSync(ROOT + p, 'utf8') : '');
const put = (p: string, s: string): void => void files.set(p, s);

// ---- Reading a literal in a file -----------------------------------------------------------------

/** The index just past the string or comment that starts at i, or i where none does. */
function skip(s: string, i: number): number {
  const c = s[i];
  if (c === '\'' || c === '"' || c === '`') {
    for (let j = i + 1; j < s.length; j++) {
      if (s[j] === '\\') { j++; continue; }
      if (s[j] === c) return j + 1;
    }
    throw new Error(`an unclosed string at ${s.slice(i, i + 40)}`);
  }
  if (c === '/' && s[i + 1] === '/') { const j = s.indexOf('\n', i); return j < 0 ? s.length : j; }
  if (c === '/' && s[i + 1] === '*') return s.indexOf('*/', i) + 2;
  return i;
}

/** The index of the bracket that closes the one at i. */
function close(s: string, i: number): number {
  let depth = 0;
  for (let j = i; j < s.length;) {
    const k = skip(s, j);
    if (k !== j) { j = k; continue; }
    if ('{[('.includes(s[j])) depth++;
    else if ('}])'.includes(s[j]) && --depth === 0) return j;
    j++;
  }
  throw new Error(`an unclosed bracket at ${s.slice(i, i + 40)}`);
}

interface Entry { notes: string[]; key?: string; keyAt: number; valueAt: number; value: string; start: number; end: number }

/** The entries of the literal whose brackets stand at open and end, each with the comment lines above it. */
function entries(s: string, open: number, end: number): Entry[] {
  const out: Entry[] = [];
  let notes: string[] = [], start = -1;
  for (let i = open + 1; i < end;) {
    if (/[\s,]/.test(s[i])) { i++; continue; }
    if (s.startsWith('//', i)) { if (start < 0) start = i; const j = skip(s, i); notes.push(s.slice(i, j).trim()); i = j; continue; }
    if (start < 0) start = i;
    const keyAt = i, m = /^(?:'([^']*)'|"([^"]*)"|([\w$]+))\s*:(?!:)\s*/.exec(s.slice(i, i + 200));
    const key = m ? (m[1] ?? m[2] ?? m[3]) : undefined;
    if (m) i += m[0].length;
    const valueAt = i;
    let j = i;
    while (j < end) {
      const k = skip(s, j);
      if (k !== j) { j = k; continue; }
      if ('{[('.includes(s[j])) { j = close(s, j) + 1; continue; }
      if (s[j] === ',') break;
      j++;
    }
    out.push({ notes, key, keyAt, valueAt, value: s.slice(valueAt, j).trimEnd(), start, end: j });
    notes = []; start = -1; i = j + 1;
  }
  return out;
}

/** A literal's value. */
const val = (v: string): unknown => Function(`return (${v});`)();

/** A value written as the content writes one: single quotes, `{ a: 1 }`, `['x', 'y']`. */
const lit = (v: unknown): string =>
  typeof v === 'string' ? `'${v.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}'`
  : Array.isArray(v) ? `[${v.map(lit).join(', ')}]`
  : v && typeof v === 'object' ? `{ ${Object.entries(v).map(([k, x]) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : lit(k)}: ${lit(x)}`).join(', ')} }`
  : String(v);

/** The table a file declares (`decl` ends at its opening bracket): the file, the brackets and its entries. */
function table(path: string, decl: RegExp): { s: string; open: number; end: number; rows: Entry[] } {
  const s = read(path), m = decl.exec(s);
  if (!m) throw new Error(`${path}: no ${decl}`);
  const open = m.index + m[0].length - 1, end = close(s, open);
  return { s, open, end, rows: entries(s, open, end) };
}

/** The table emptied, its brackets kept. */
function empty(path: string, t: { s: string; open: number; end: number; rows: Entry[] }): void {
  if (t.rows.length) put(path, t.s.slice(0, t.open + 1) + t.s.slice(t.end));
}

/** The index of the `{` of the one object literal in a file whose id is `id`. */
function objectAt(s: string, id: string, path: string): number {
  const hits = [...s.matchAll(new RegExp(`\\{(?:\\s|//[^\\n]*\\n)*id: '${id}'[,\\s}]`, 'g'))];
  if (hits.length !== 1) throw new Error(`${path}: ${hits.length} objects with the id '${id}'`);
  return hits[0].index;
}

/**
 * The object literal at `at` with `prop` added: after the key `after` where it has one, else before
 * `before`, else last, on a line of its own in an object of several lines. Its notes go above it there,
 * and above the object otherwise.
 */
function addProp(s: string, at: number, prop: string, after?: string, before?: string, notes: readonly string[] = []): string {
  const end = close(s, at), es = entries(s, at, end);
  const a = es.find((e) => after && e.key === after), b = es.find((e) => before && e.key === before);
  let out: string;
  if (a) { const p = a.valueAt + a.value.length; out = s.slice(0, p) + `, ${prop}` + s.slice(p); }
  else if (b) out = s.slice(0, b.keyAt) + `${prop}, ` + s.slice(b.keyAt);
  else {
    let p = end;
    while (/\s/.test(s[p - 1])) p--;
    if (s[p - 1] === ',' && s.slice(at, end).includes('\n')) {
      const ls = s.lastIndexOf('\n', p - 1) + 1, indent = /^[ \t]*/.exec(s.slice(ls))![0];
      return s.slice(0, p) + [...notes, `${prop},`].map((l) => `\n${indent}${l}`).join('') + s.slice(p);
    }
    out = s[p - 1] === '{' ? s.slice(0, at + 1) + ` ${prop} ` + s.slice(end) : s.slice(0, p) + (s[p - 1] === ',' ? ` ${prop},` : `, ${prop}`) + s.slice(p);
  }
  return notes.length ? noteAbove(out, at, notes) : out;
}

/** Comment lines put above the line `at` stands on, at its indent. */
function noteAbove(s: string, at: number, notes: readonly string[]): string {
  const ls = s.lastIndexOf('\n', at) + 1, indent = /^[ \t]*/.exec(s.slice(ls))![0];
  return s.slice(0, ls) + notes.map((n) => `${indent}${n}\n`).join('') + s.slice(ls);
}

// ---- Who owns what ----------------------------------------------------------------------------------

const areaIds: readonly string[] = AREAS.map((a) => a.id);
const mapArea = new Map(AREAS.flatMap((a) => a.maps.map((d) => [d.id, a.id as string] as const)));
const monsterArea = new Map(AREAS.flatMap((a) => a.monsters.map((m) => [m.id, a.id as string] as const)));
const zoneArea = new Map(ATLAS.zones.map((z) => [z.id, z.area] as const));
const placeArea = new Map(AREAS.flatMap((a) => a.atlas.places.map((p) => [p.id, a.id as string] as const)));
/** The area a link's end is in: a zone's, a place's, a built map's, or the area it names. */
const endArea = (end: string): string | undefined => zoneArea.get(end) ?? placeArea.get(end) ?? mapArea.get(end) ?? (areaIds.includes(end) ? end : undefined);
/** The road index of the area whose items hold an item, -1 for one no area owns. */
const itemAt = (id: string): number => AREAS.findIndex((a) => a.items.some((x) => x.id === id));
const nameOf = (area: string): string => ATLAS.areas.find((a) => a.id === area)?.name ?? area;
const possessive = (name: string): string => (name.endsWith('s') ? `${name}'` : `${name}'s`);

/** Each map's file, by the map's id. */
const mapFile = new Map<string, string>();
for (const a of areaIds) {
  const dir = `src/content/areas/${a}/maps/`;
  if (!existsSync(ROOT + dir)) continue;
  for (const f of readdirSync(ROOT + dir).filter((x) => x.endsWith('.ts'))) {
    for (const m of read(dir + f).matchAll(/(?:MapDef\s*=|\brift\()\s*\{\s*id:\s*'([^']+)'/g)) mapFile.set(m[1], dir + f);
  }
}
const fileOfMap = (id: string): string => mapFile.get(id) ?? (() => { throw new Error(`no file holds the map '${id}'`); })();
const atlasOf = (area: string): string => `src/content/areas/${area}/atlas.ts`;

/** The rows moved, by area and table, for the pull request. */
const moved = new Map<string, Map<string, number>>();
const count = (area: string, what: string, n = 1): void => {
  const m = moved.get(area) ?? new Map<string, number>();
  m.set(what, (m.get(what) ?? 0) + n);
  moved.set(area, m);
};
/** A field on a zone of an area's atlas, its notes above the zone. */
function onZone(zone: string, prop: string, what: string, notes: readonly string[] = []): void {
  const area = zoneArea.get(zone);
  if (!area) throw new Error(`no zone '${zone}'`);
  const path = atlasOf(area);
  const s = read(path);
  put(path, addProp(s, objectAt(s, zone, path), prop, undefined, undefined, notes));
  count(area, what);
}

// ---- The checks.ts of an area -------------------------------------------------------------------------

/** An area's checks.ts, begun as the others are where it has none. */
function checksOf(area: string): string {
  const path = `src/content/areas/${area}/checks.ts`;
  if (!read(path)) {
    put(path, `// ${possessive(nameOf(area))} own rows of the suites (\`AreaChecks\`, src/content/area.ts): out of the game's build, found by
// tools/checks.ts as the runner finds a walkthrough (#897); moved onto it from the suites' tables (#968).
import type { AreaChecks } from '../../area.ts';

export const CHECKS = {} satisfies AreaChecks;
`);
  }
  return path;
}

/** A field of an area's CHECKS with its rows (each one line), its comment above it; or the rows added to the field it has. */
function addField(area: string, key: string, note: string, rows: readonly string[], open: '{' | '['): void {
  const path = checksOf(area);
  let s = read(path);
  const at = s.indexOf('export const CHECKS = {') + 'export const CHECKS = '.length;
  if (at < 'export const CHECKS = '.length) throw new Error(`${path}: no CHECKS`);
  const end = close(s, at), have = entries(s, at, end).find((e) => e.key === key);
  const lines = rows.map((r) => `\n    ${r},`).join('');
  if (have) {
    let p = close(s, have.valueAt);
    while (/\s/.test(s[p - 1])) p--;
    s = s.slice(0, p) + (s[p - 1] === ',' || s[p - 1] === open ? '' : ',') + lines + s.slice(p);
  } else {
    const field = `  // ${note}\n  ${key}: ${open}${lines}\n  ${open === '{' ? '}' : ']'},`;
    let p = end;
    while (/\s/.test(s[p - 1])) p--;
    s = s[p - 1] === '{' ? `${s.slice(0, at + 1)}\n${field}\n${s.slice(end)}` : `${s.slice(0, p)}${s[p - 1] === ',' ? '' : ','}\n${field}${s.slice(p)}`;
  }
  put(path, s);
}

// ---- The tables ---------------------------------------------------------------------------------------

const GATE = 'tools/tests/gate.ts', HARNESS_SUITE = 'tools/tests/harness.ts', HARNESS = 'tools/harness.ts';

// ROADS: each zone's road, as `road` on the zone, its notes above it.
const roads = table(GATE, /export const ROADS: [^=]*= \{/);
for (const r of roads.rows) onZone(r.key!, `road: ${lit(val(r.value))}`, 'ROADS', r.notes);
empty(GATE, roads);

// BOSSES: each group as `boss` on itself, after `roams` where it has it. A row of one group takes its
// notes above the group; a row of several leaves them, its groups each saying in their maps who they are.
const bosses = table(GATE, /export const BOSSES: [^=]*= \{/);
for (const r of bosses.rows) {
  const groups = val(r.value) as string[];
  for (const g of groups) {
    const [map, id] = g.split(':'), path = fileOfMap(map);
    const s = read(path), spec = [...s.matchAll(/\brift\(\{/g)].map((m) => m.index + 5)
      .find((o) => entries(s, o, close(s, o)).some((e) => e.key === 'id' && val(e.value) === map));
    if (spec !== undefined && id === `${map}_warden`) {
      // A Rift's warden is made by rift() (src/game/rifts.ts): its table says the warden is a boss.
      const t = entries(s, spec, close(s, spec)).find((e) => e.key === 'table');
      if (!t?.value.startsWith('{')) throw new Error(`${path}: the Rift ${map} has no table written in it`);
      put(path, addProp(s, t.valueAt, 'boss: true', undefined, undefined, groups.length === 1 ? r.notes : []));
    } else put(path, addProp(s, objectAt(s, id, path), 'boss: true', 'roams', undefined, groups.length === 1 ? r.notes : []));
    count(mapArea.get(map)!, 'BOSSES');
  }
  if (groups.length > 1 && r.notes.length) console.log(`BOSSES: the notes on ${r.key}'s row of ${groups.length} groups are left: ${r.notes.join(' ').slice(0, 90)}...`);
}
empty(GATE, bosses);

// OFF_LINE and WHOLE: each monster's word, as `offLine` on its def, before its `tint`.
for (const [name, decl] of [['OFF_LINE', /export const OFF_LINE: [^=]*= \{/], ['WHOLE', /export const WHOLE: [^=]*= \{/]] as const) {
  const t = table(HARNESS_SUITE, decl);
  for (const r of t.rows) {
    const area = monsterArea.get(r.key!);
    if (!area) throw new Error(`${name}: no monster '${r.key}'`);
    const path = `src/content/areas/${area}/monsters.ts`, s = read(path);
    put(path, addProp(s, objectAt(s, r.key!, path), `offLine: ${lit(val(r.value))}`, undefined, 'tint'));
    count(area, name);
  }
  empty(HARNESS_SUITE, t);
}

// GEAR and KIT: each rung on the last area on the road whose items it holds, the gear's items first.
/** An item's id where a table names it by its export (`quickening.id`). */
const idOf = (v: string): string => {
  for (const a of ['', ...areaIds.map((x) => `areas/${x}/`)]) {
    const m = new RegExp(`export const ${v}: ItemDef = \\{ id: '([^']+)'`).exec(read(`src/content/${a}items.ts`));
    if (m) return m[1];
  }
  throw new Error(`no item is exported as ${v}`);
};
const PHRASE: Record<number, string> = {
  8: 'Thornmark\'s armoury from 8, where plate is dear', 9: 'its chests\' gear with a plus by 9', 10: 'the Deepthorn\'s +2s by 10',
  11: 'Saltmouth\'s armourer\'s step from 11', 13: 'the same with a plus from Saltreach\'s and Wrackholm\'s boxes by 13',
  14: 'Lantern Watch\'s stores from 14', 16: 'theirs with a plus from the Sunder by 16', 17: 'Anvilhall\'s forge from 17',
  19: 'the same with a plus from the Kilns\' and Cairnmoor\'s boxes by 19', 21: 'Rime Lodge\'s furrier from 21',
  22: 'theirs with a plus from Rimewater by 22', 25: 'Cinderport\'s armourer from 25, with the Quickening Draught its chandler sells for the bag (KIT)',
  28: 'the Hand\'s steel from 28, found on Hearth Isle and never sold',
};
const rungs = new Map<string, Map<number, string[]>>();
for (const [name, decl] of [['GEAR', /const GEAR_ROWS: Rungs = \[/], ['KIT', /const KIT_ROWS: Rungs = \[/]] as const) {
  const t = table(HARNESS, decl);
  for (const r of t.rows) {
    const [at, ids] = val(r.value.replace(/\b([A-Za-z_$][\w$]*)\.id\b/g, (_, v: string) => lit(idOf(v)))) as [number, string[]];
    const last = Math.max(...ids.map(itemAt));
    if (last < 0) throw new Error(`${name}: the rung at ${at} holds no area's item`);
    const area = areaIds[last], mine = rungs.get(area) ?? new Map<number, string[]>();
    mine.set(at, [...(mine.get(at) ?? []), ...ids]);
    rungs.set(area, mine);
    count(area, name);
  }
  empty(HARNESS, t);
}
for (const [area, mine] of rungs) {
  const levels = [...mine.keys()].sort((a, b) => a - b);
  addField(area, 'gear', `Its rungs of the ladder (tools/harness.ts): ${levels.map((l) => PHRASE[l] ?? `by ${l}`).join('; ')}.`,
    levels.map((l) => `${l}: ${lit(mine.get(l))}`), '{');
}

// SEAMS_AS_BUILT: each row, as written, on the area of its first box.
const seams = table('tools/tests/outdoors.ts', /const SEAMS_AS_BUILT: [^=]*= \[/), seamRows = new Map<string, string[]>();
for (const r of seams.rows) {
  const first = (val(r.value) as { seam: string }).seam.split(/[|/]/)[0], area = mapArea.get(first);
  if (!area) throw new Error(`SEAMS_AS_BUILT: no area holds the box '${first}'`);
  seamRows.set(area, [...(seamRows.get(area) ?? []), r.value]);
  count(area, 'SEAMS_AS_BUILT');
}
for (const [area, rows] of seamRows) addField(area, 'seamsAsBuilt', 'Its seams as built (tools/tests/outdoors.ts): each whose first box is its own.', rows, '[');
empty('tools/tests/outdoors.ts', seams);

// REACH_ZONES and MAX_GROUP: `reach` and `maxGroup` on the zone.
const reach = table('tools/tests/pillars.ts', /export const REACH_ZONES: [^=]*= \[/);
for (const r of reach.rows) onZone(val(r.value) as string, 'reach: true', 'REACH_ZONES');
empty('tools/tests/pillars.ts', reach);
const most = table('tools/tests/maps.ts', /const MAX_GROUP: [^=]*= \{/);
for (const r of most.rows) onZone(r.key!, `maxGroup: ${val(r.value) as number}`, 'MAX_GROUP');
empty('tools/tests/maps.ts', most);

// ONE_CROSSING: `crosses` on the exit, with the two regions it joins.
const crossing = table('tools/tests/weather.ts', /const ONE_CROSSING: [^=]*= \[/);
for (const r of crossing.rows) {
  const c = val(r.value) as { from: string; x: number; y: number; to: string; regions: string }, path = fileOfMap(c.from), s = read(path);
  const hits = [...s.matchAll(new RegExp(`\\{\\s*x: ${c.x}, y: ${c.y}, to: '${c.to}'`, 'g'))];
  if (hits.length !== 1) throw new Error(`${path}: ${hits.length} exits at ${c.x},${c.y} to ${c.to}`);
  put(path, addProp(s, hits[0].index, `crosses: ${lit(c.regions)}`));
  count(mapArea.get(c.from)!, 'ONE_CROSSING');
}
empty('tools/tests/weather.ts', crossing);

// The atlas's links: one whose two ends are in one area goes to that area's LINKS, in order.
{
  const path = 'src/content/atlas.ts', t = table(path, /\n {2}links: \[/), links = new Map<string, string[]>();
  let s = t.s;
  for (const r of [...t.rows].reverse()) {
    const l = val(r.value) as { from: string; to: string }, a = endArea(l.from), b = endArea(l.to);
    if (!a || a !== b) continue;
    links.set(a, [r.value, ...(links.get(a) ?? [])]);
    const ls = s.lastIndexOf('\n', r.start), le = s.indexOf('\n', r.end);
    s = s.slice(0, ls) + s.slice(le);
    count(a, 'links');
  }
  if (links.size) put(path, s);
  for (const area of areaIds.filter((x) => links.has(x))) {
    const ap = atlasOf(area);
    let as = read(ap);
    const rows = links.get(area)!.map((v) => `\n  ${v},`).join('');
    if (/export const LINKS: readonly AtlasLink\[\] = \[/.test(as)) {
      const lt = table(ap, /export const LINKS: readonly AtlasLink\[\] = \[/);
      let p = lt.end;
      while (/\s/.test(as[p - 1])) p--;
      as = as.slice(0, p) + (as[p - 1] === ',' || as[p - 1] === '[' ? '' : ',') + rows + as.slice(p);
    } else {
      as = as.replace(/import type \{ ([^}]*) \} from '(\.\.\/)+game\/atlas\.ts';/, (m, names: string) => m.replace(names, `${names}, AtlasLink`));
      if (!as.includes('AtlasLink')) throw new Error(`${ap}: no type import from game/atlas.ts`);
      as = `${as.trimEnd()}\n\nexport const LINKS: readonly AtlasLink[] = [${rows}\n];\n`;
      const ip = `src/content/areas/${area}/index.ts`;
      let is = read(ip);
      const was = is;
      is = is.replace(/import \{ ZONES, PLACES, SITES \} from '\.\/atlas\.ts';/, 'import { ZONES, PLACES, SITES, LINKS } from \'./atlas.ts\';')
        .replace(/atlas: \{ zones: ZONES, places: PLACES, sites: SITES \}/, 'atlas: { zones: ZONES, places: PLACES, sites: SITES, links: LINKS }');
      if (is === was || !is.includes('links: LINKS')) throw new Error(`${ip}: its atlas is not written as the others'`);
      put(ip, is);
    }
    put(ap, as);
  }
}

// ---- The respawn figures --------------------------------------------------------------------------

const NAMES: Record<string, string> = { 720: 'half', 1440: 'day', 2880: 'twoDays' };
const FIGURE = /\brespawn(: | === )(720|1440|2880)\b/g;
/** Every .ts file under a folder of src, but the vendored engine. */
const walk = (dir: string): string[] => readdirSync(ROOT + dir, { withFileTypes: true }).flatMap((d) =>
  d.isDirectory() ? (`${dir}${d.name}` === 'src/lib' ? [] : walk(`${dir}${d.name}/`)) : d.name.endsWith('.ts') ? [`${dir}${d.name}`] : []);
for (const path of walk('src/')) {
  let s = read(path);
  const n = [...s.matchAll(FIGURE)].length;
  if (!n) continue;
  s = s.replace(FIGURE, (_, op: string, fig: string) => `respawn${op}RESPAWN.${NAMES[fig]}`);
  const rel = relative(dirname(ROOT + path), `${ROOT}src/game/keys.ts`), spec = rel.startsWith('.') ? rel : `./${rel}`;
  const m = new RegExp(`^import \\{([^}]*)\\} from '${spec.replace(/[.]/g, '\\.')}';$`, 'm').exec(s);
  if (m) {
    if (!m[1].split(',').map((x) => x.trim()).includes('RESPAWN')) s = s.replace(m[0], `import {${m[1].trimEnd()}, RESPAWN } from '${spec}';`);
  } else {
    const last = [...s.matchAll(/^import\b[^;]*;$/gm)].at(-1);
    if (!last) throw new Error(`${path}: no import to follow`);
    const p = last.index + last[0].length;
    s = `${s.slice(0, p)}\nimport { RESPAWN } from '${spec}';${s.slice(p)}`;
  }
  put(path, s);
  count(/^src\/content\/areas\/([^/]+)\//.exec(path)?.[1] ?? path, /walkthrough\.ts$/.test(path) ? 'respawn checks' : 'respawn', n);
}

// ---- The count ------------------------------------------------------------------------------------

const kinds = [...new Set([...moved.values()].flatMap((m) => [...m.keys()]))];
if (!kinds.length) console.log('Nothing left to move: every table is empty, every link between two places of one area is on it, and no respawn is written as a figure.');
else {
  console.log(`| Area | ${kinds.join(' | ')} |\n|---|${kinds.map(() => '---:').join('|')}|`);
  for (const area of [...areaIds, ...[...moved.keys()].filter((k) => !areaIds.includes(k))].filter((x) => moved.has(x))) {
    console.log(`| ${area} | ${kinds.map((k) => moved.get(area)!.get(k) ?? '').join(' | ')} |`);
  }
  console.log(`| **all** | ${kinds.map((k) => [...moved.values()].reduce((n, m) => n + (m.get(k) ?? 0), 0)).join(' | ')} |`);
  console.log(`${files.size} files ${DRY ? 'would be ' : ''}written.`);
}
if (!DRY) for (const [p, s] of files) writeFileSync(ROOT + p, s);
