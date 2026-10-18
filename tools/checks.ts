// Each area's checks.ts (src/content/areas/<area>/checks.ts), found by its file in road order as the
// runner finds a walkthrough: the rows the suites hold of an area that are its own and no part of the
// game (`AreaChecks`, src/content/area.ts), which nothing in the game imports. A suite reads them beside
// its own table, as it reads the zones', groups', monsters' and exits' own fields beside theirs, and
// refuses a row in both (`beside`), so that a row moves one way, onto its area (#897).
import { existsSync, readdirSync } from 'node:fs';
import { AREAS } from '../src/content/index.ts';
import type { AreaChecks, Owes } from '../src/content/area.ts';

const folder = new URL('../src/content/areas/', import.meta.url);
const ids: readonly string[] = AREAS.map((a) => a.id);
const has = (id: string): boolean => existsSync(new URL(`${id}/checks.ts`, folder));
const stray = readdirSync(folder, { withFileTypes: true }).filter((d) => d.isDirectory() && !ids.includes(d.name) && has(d.name));
if (stray.length) throw new Error(`src/content/areas/${stray.map((d) => d.name).join(', ')}/ has a checks.ts but is no area in AREAS`);

/** The fields of `AreaChecks` and of its `owes`, every one and no other: a checks.ts naming another is refused by it. */
const FIELDS: Record<keyof AreaChecks, true> = { owes: true, gear: true, overRoad: true, seamsAsBuilt: true, openOnNothing: true };
const OWES: Record<keyof Owes, true> = { curve: true, unplaced: true, unset: true, cutOff: true, edges: true, locks: true };
/** The keys of a checks.ts's rows that are no field (`satisfies AreaChecks` is the file's word alone; this is the runner's). */
export const unknownFields = (rows: object): string[] => [
  ...Object.keys(rows).filter((k) => !Object.hasOwn(FIELDS, k)),
  ...Object.keys((rows as AreaChecks).owes ?? {}).filter((k) => !Object.hasOwn(OWES, k)).map((k) => `owes.${k}`),
];

/** Each area's own rows by its id, in road order; an area with no checks.ts holds none. */
export const CHECKS: ReadonlyMap<string, AreaChecks> = new Map(await Promise.all(ids.filter(has).map(async (id) => {
  const rows = ((await import(new URL(`${id}/checks.ts`, folder).href)) as { CHECKS?: AreaChecks }).CHECKS;
  if (!rows) throw new Error(`src/content/areas/${id}/checks.ts exports no CHECKS`);
  const unknown = unknownFields(rows);
  if (unknown.length) throw new Error(`src/content/areas/${id}/checks.ts: ${unknown.map((k) => `'${k}'`).join(', ')} is no field of AreaChecks (src/content/area.ts)`);
  return [id, rows] as const;
})));

/** One kind of row, from every area that holds it, in road order. */
export const areaRows = <V>(pick: (c: AreaChecks) => Readonly<Record<string, V>> | undefined): [string, V][] =>
  [...CHECKS.values()].flatMap((c) => Object.entries(pick(c) ?? {}));

/** One kind of row that is a list, from every area that holds it, each with its area's id, in road order. */
export const areaLists = <V>(pick: (c: AreaChecks) => readonly V[] | undefined): [string, V][] =>
  [...CHECKS].flatMap(([id, c]) => (pick(c) ?? []).map((v): [string, V] => [id, v]));

/**
 * A suite's table read beside the rows on its areas: every row, the table's first and then the areas'
 * in the order given, and each key given twice (in the table and on an area, or on two), which the
 * suite refuses.
 */
export function beside<V>(table: Readonly<Record<string, V>>, rows: Iterable<readonly [string, V]>): { all: Record<string, V>; twice: string[] } {
  const all: Record<string, V> = { ...table }, twice: string[] = [];
  for (const [key, value] of rows) {
    if (Object.hasOwn(all, key)) twice.push(key);
    else all[key] = value;
  }
  return { all, twice };
}

/**
 * A table of lists keyed by who owes each (`EDGES_OWED`, `LOCKS_OWED`) read beside the areas' rows of the
 * same kind: who owes each thing listed, the table's first, so that several areas may owe one issue; and
 * each thing listed twice, in the table, on an area or on both, which the suite refuses.
 */
export function besideLists(table: Readonly<Record<string, readonly string[]>>, rows: Iterable<readonly [string, readonly string[]]>): { all: Record<string, string>; twice: string[] } {
  const each = (r: Iterable<readonly [string, readonly string[]]>): [string, string][] => [...r].flatMap(([whose, keys]) => keys.map((k): [string, string] => [k, whose]));
  return beside({}, [...each(Object.entries(table)), ...each(rows)]);
}

/** The line a suite refuses a row in both with: nothing given twice, or each key that is. */
export const once = (what: string, twice: readonly string[]): [boolean, string] =>
  [!twice.length, `${what}${twice.length ? ` (twice: ${twice.join(', ')})` : ''}`];
