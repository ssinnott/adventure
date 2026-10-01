// The Rift generator (DESIGN §4, §13; EXPANSION §7). A small Rift is a 12 by 12 dungeon made from
// one of a few templates, dressed in its Stone's material (MONSTERS §2.1) and filled from its
// area's table, as a pure function of the template, the material, the table and a seed: the same
// seed gives the same Rift in every save. The seed turns or mirrors the template (eight ways), puts
// the table's groups in its slots and the material's looks on its squares. It never sets an id or
// the pay: a group is named by its place in the table, not by its slot, so a Rift's ids keep in a
// save, and its pay is its area's. Its groups stop coming back once `until` holds (the Stone
// restored), and the tear goes quiet then; the way in stays open, so no way is shut. It is entered
// from its tear on a zone map, a `rift` feature, which `riftWay` makes.
import { makeRng } from '../lib/engine/rng.ts';
import type { MapDef, MapPalette, Feature, EncounterDef, Exit } from './map.ts';
import type { Facing } from './types.ts';
import { FACING_DX, FACING_DY } from './types.ts';
import type { When } from './quests.ts';
import type { RegionId } from './weather.ts';

/** The side of every Rift. */
export const RIFT_SIZE = 12;

/**
 * A template: 12 rows of 12, walled round. Its walls, floor, doors and pillars are a map's (`#`,
 * `.`, `D`, `o`); its marks are floor with something on it: `<` the way in and out, `*` the tear,
 * `W` the warden's square beside it, `$` the hoard, `1` to `9` the slots for groups and `?` the
 * squares for a look.
 */
export interface RiftTemplate { id: string; rows: readonly string[] }

/** A Stone's material: the map's name and colours, and its words. */
export interface RiftMaterial {
  id: string;
  name: string;
  palette: Partial<MapPalette>;
  /** Said stepping in through the tear, and back out of it. */
  enter: string;
  leave: string;
  /** Said at the tear, while it is open and once it has gone quiet. */
  tear: string;
  quiet: string;
  /** What is seen about the rooms, one to a `?`: at least as many as a template has. */
  looks: readonly string[];
}

/** An area's table for a Rift: the groups put in its slots, the warden at its heart, and how soon the groups come back. */
export interface RiftTable {
  groups: readonly (readonly string[])[];
  warden?: readonly string[];
  /** Minutes; 1440 if not given. */
  respawn?: number;
}

export interface RiftSpec {
  /** The map's id, and the stem of every id in it. */
  id: string;
  template: RiftTemplate;
  material: RiftMaterial;
  seed: number;
  band: [number, number];
  region?: RegionId;
  /** The way out: the square beside the tear on the map it was entered from. */
  out: { to: string; tx: number; ty: number; tf?: Facing };
  table: RiftTable;
  /** The chest at the heart, the Stone's shard among its items. */
  hoard: { gold: number; items: readonly string[] };
  /** The Stone restored, or the warden fallen: the groups stop coming back and the tear goes quiet. */
  until?: When;
  /** The map's name; the material's if not given. */
  name?: string;
}

/** Where a template square lands under symmetry `k`: turned a quarter `k & 3` times, mirrored first if `k` is 4 or more. */
export function turn(k: number, x: number, y: number): { x: number; y: number } {
  const n = RIFT_SIZE - 1;
  if (k >= 4) x = n - x;
  for (let i = 0; i < (k & 3); i++) [x, y] = [n - y, x];
  return { x, y };
}

/** What is wrong with a template: its size, its walls, its marks, or a square the way in does not reach. */
export function templateFaults(t: RiftTemplate): string[] {
  const out: string[] = [], n = RIFT_SIZE, rows = t.rows;
  if (rows.length !== n || rows.some((r) => r.length !== n)) return [`not ${n} by ${n}`];
  const at = (x: number, y: number): string => rows[y][x];
  for (let i = 0; i < n; i++) if (at(i, 0) !== '#' || at(i, n - 1) !== '#' || at(0, i) !== '#' || at(n - 1, i) !== '#') { out.push('not walled round'); break; }
  const all = rows.join('');
  for (const ch of all) if (!'#.Do<*W$?'.includes(ch) && !/[1-9]/.test(ch)) out.push(`an unknown mark '${ch}'`);
  for (const ch of '<*W$') if (all.split(ch).length !== 2) out.push(`not one '${ch}'`);
  const slots = all.match(/[1-9]/g) ?? [];
  if (new Set(slots).size !== slots.length) out.push('a slot given twice');
  if (out.length) return out;
  const find = (ch: string): number => all.indexOf(ch);
  const tear = find('*'), warden = find('W');
  if (Math.abs((tear % n) - (warden % n)) + Math.abs(Math.floor(tear / n) - Math.floor(warden / n)) !== 1) out.push('the warden not beside the tear');
  const open = (i: number): boolean => all[i] !== '#' && all[i] !== 'o';
  const seen = new Set([find('<')]), todo = [find('<')];
  while (todo.length) {
    const i = todo.pop()!;
    for (const j of [i - 1, i + 1, i - n, i + n]) if (open(j) && !seen.has(j)) { seen.add(j); todo.push(j); }
  }
  const lost = [...all].flatMap((_, i) => (open(i) && !seen.has(i) ? [`${i % n},${Math.floor(i / n)}`] : []));
  if (lost.length) out.push(`squares the way in does not reach: ${lost.join(' ')}`);
  return out;
}

/** Shuffled in place, Fisher-Yates, by the draws `int` makes. */
function shuffle<T>(xs: T[], int: (a: number, b: number) => number): T[] {
  for (let i = xs.length - 1; i > 0; i--) { const j = int(0, i); [xs[i], xs[j]] = [xs[j], xs[i]]; }
  return xs;
}

/** A Rift, generated. Throws on a template with faults, a table with more groups than slots, or too few looks. */
export function generateRift(spec: RiftSpec): MapDef {
  const { id, template, material, table, until } = spec;
  const faults = templateFaults(template);
  if (faults.length) throw new Error(`rift template ${template.id}: ${faults.join('; ')}`);
  const rng = makeRng(spec.seed);
  const k = rng.int(0, 7);
  const n = RIFT_SIZE;
  const grid: string[][] = Array.from({ length: n }, () => new Array<string>(n).fill('#'));
  const marks = new Map<string, { x: number; y: number }[]>();
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const ch = template.rows[y][x], p = turn(k, x, y);
    const mark = !'#.Do'.includes(ch);
    grid[p.y][p.x] = mark ? '.' : ch;
    if (mark) marks.set(ch, [...(marks.get(ch) ?? []), p]);
  }
  const one = (ch: string): { x: number; y: number } => marks.get(ch)![0];
  // The looks in the template's reading order, so their ids hold whatever the symmetry.
  const looks = marks.get('?') ?? [];
  const slots = [...marks.keys()].filter((ch) => /[1-9]/.test(ch)).sort();
  if (table.groups.length > slots.length) throw new Error(`rift ${id}: ${table.groups.length} groups for ${slots.length} slots in ${template.id}`);
  if (material.looks.length < looks.length) throw new Error(`rift ${id}: ${looks.length} looks wanted of ${material.id}, which has ${material.looks.length}`);

  const way = one('<');
  const face = ([0, 1, 2, 3] as Facing[]).find((f) => grid[way.y + FACING_DY[f]]?.[way.x + FACING_DX[f]] !== '#' && grid[way.y + FACING_DY[f]]?.[way.x + FACING_DX[f]] !== 'o')!;
  const exits: Exit[] = [{ x: way.x, y: way.y, to: spec.out.to, tx: spec.out.tx, ty: spec.out.ty, tf: spec.out.tf, label: material.leave }];

  const tear = one('*'), hoard = one('$');
  const words = shuffle([...material.looks], rng.int);
  const features: Feature[] = [
    { kind: 'event', x: tear.x, y: tear.y, id: `${id}_tear`, once: true, text: material.tear, ...(until ? { until } : {}) },
    ...(until ? [{ kind: 'event' as const, x: tear.x, y: tear.y, id: `${id}_quiet`, once: true, text: material.quiet, after: until }] : []),
    { kind: 'chest', x: hoard.x, y: hoard.y, id: `${id}_hoard`, gold: spec.hoard.gold, items: [...spec.hoard.items] },
    ...looks.map((p, i): Feature => ({ kind: 'event', x: p.x, y: p.y, id: `${id}_look${i + 1}`, once: true, text: words[i] })),
  ];

  const order = shuffle(slots.slice(), rng.int);
  const respawn = table.respawn ?? 1440;
  const encounters: EncounterDef[] = table.groups.map((monsters, i) => {
    const p = one(order[i]);
    return { id: `${id}_g${i + 1}`, x: p.x, y: p.y, monsters: [...monsters], aware: 5, respawn, ...(until ? { until } : {}) };
  });
  if (table.warden) { const p = one('W'); encounters.push({ id: `${id}_warden`, x: p.x, y: p.y, monsters: [...table.warden], aware: 1, roams: false }); }

  return {
    id, name: spec.name ?? material.name, kind: 'dungeon', band: spec.band,
    ...(spec.region ? { region: spec.region } : {}),
    start: { x: way.x, y: way.y, facing: face },
    palette: material.palette,
    rows: grid.map((r) => r.join('')),
    exits, features, encounters,
  };
}

/** The tear on a zone map that leads into a Rift: stepped on at x,y, it takes the party in, saying `label`. */
export function riftWay(rift: MapDef, x: number, y: number, label?: string): Extract<Feature, { kind: 'rift' }> {
  return { kind: 'rift', x, y, id: `${rift.id}_way`, to: rift.id, tx: rift.start.x, ty: rift.start.y, tf: rift.start.facing, ...(label ? { label } : {}) };
}
