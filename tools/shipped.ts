// What a save can refer to, as shipped: src/content/shipped.json lists every id and placement a
// save may hold (EXPANSION §5.5). A content edit reaches every old save, so what is in the list
// stays: a map keeps its size, a zone its place, a door its square, and no chest, event, group,
// flag, item, spell, class, race or condition goes, unless SAVE_VERSION goes up with an upgrade
// (src/game/upgrades.ts). New content only adds. tools/tests/shipped.ts holds the content to it.
//   node tools/shipped.ts    record what the content adds; refuses while something has gone or
//                            moved without a bump and its upgrade
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { GameMap } from '../src/game/map.ts';
import type { MapDef } from '../src/game/map.ts';
import type { Atlas } from '../src/game/atlas.ts';
import { layOutdoors } from '../src/game/outdoors.ts';
import { CLASSES, RACES, CONDITION_ORDER, guildFlag } from '../src/game/party.ts';
import { SAVE_VERSION } from '../src/game/save.ts';
import { UPGRADES } from '../src/game/upgrades.ts';
import type { Upgrade } from '../src/game/upgrades.ts';
import { ATLAS, MAP_DEFS, AREAS } from '../src/content/index.ts';
import { ITEMS } from '../src/content/items.ts';
import { SPELLS } from '../src/content/spells.ts';

export const SHIPPED_FILE = fileURLToPath(new URL('../src/content/shipped.json', import.meta.url));

/** Flags the code sets rather than the content: the temple's count of gifts. */
const CODE_FLAGS = ['donations'];

/** The content a save refers to: the maps as written and the atlas that lays them out, and the tables. */
export interface Content {
  atlas: Atlas;
  defs: readonly MapDef[];
  items: readonly string[];
  spells: readonly string[];
  classes: readonly string[];
  races: readonly string[];
  conditions: readonly string[];
}

/** A played map's size (explored bits are indexed by it), and the ids and door squares its state is kept by. */
export interface ShippedMap { size: string; used: string[]; groups: string[]; doors: string[] }

export interface Ids {
  /** By played map id: the outdoors is one map, keeping one record for all its zones. */
  maps: Record<string, ShippedMap>;
  /** Where each zone of the outdoors is laid, and its size: its squares' state is kept by the outdoors'. */
  zones: Record<string, { at: string; size: string }>;
  flags: string[];
  items: string[];
  spells: string[];
  classes: string[];
  races: string[];
  conditions: string[];
}

export interface Shipped extends Ids { version: number }

export const CONTENT: Content = {
  atlas: ATLAS, defs: MAP_DEFS,
  // From the lists as written: the merged tables are open to a tool's additions (tools/harness.ts's
  // enchanted items), which no save holds.
  items: [...ITEMS, ...AREAS.flatMap((a) => a.items)].map((i) => i.id), spells: SPELLS.map((s) => s.id),
  classes: Object.keys(CLASSES), races: Object.keys(RACES), conditions: [...CONDITION_ORDER],
};

const sorted = (xs: Iterable<string>): string[] => [...new Set(xs)].sort();
const byKey = <T>(o: Record<string, T>): Record<string, T> => Object.fromEntries(Object.entries(o).sort(([a], [b]) => (a < b ? -1 : 1)));

/** What a save made on this content could hold. */
export function collect(c: Content): Ids {
  const maps: Record<string, ShippedMap> = {}, zones: Ids['zones'] = {}, flags = new Set(CODE_FLAGS);
  for (const def of layOutdoors(c.atlas, c.defs)) {
    const m = new GameMap(def), doors: string[] = [];
    for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) {
      const d = m.at(x, y).door;
      if (d === 'locked' || d === 'secret') doors.push(`${x},${y}`);
    }
    const used: string[] = [];
    for (const f of m.features) {
      if (f.kind === 'chest' || (f.kind === 'event' && f.once)) used.push(f.id);
      if (f.kind === 'guild') flags.add(guildFlag(f.name));
      if (f.kind === 'npc') { if (f.flag) flags.add(f.flag); if (f.quest) flags.add(f.quest.setFlag); }
    }
    maps[m.id] = { size: `${m.width}x${m.height}`, used: sorted(used), groups: sorted(m.encounters.map((e) => e.id)), doors: sorted(doors) };
    for (const z of m.zones) zones[z.id] = { at: `${z.x},${z.y}`, size: `${z.w}x${z.h}` };
  }
  return {
    maps: byKey(maps), zones: byKey(zones), flags: sorted(flags),
    items: sorted(c.items), spells: sorted(c.spells), classes: sorted(c.classes), races: sorted(c.races), conditions: sorted(c.conditions),
  };
}

export interface Comparison {
  /** What has gone or moved without a bump and its upgrade, or an upgrade missing: a fix to the content or a bump. */
  problems: string[];
  /** What the list has yet to record: new content, or a bump and what went with it. `node tools/shipped.ts` records it. */
  unrecorded: string[];
}

/** Each list, by the word for one of it. */
const LISTS = { flags: 'flag', items: 'item', spells: 'spell', classes: 'class', races: 'race', conditions: 'condition' } as const;

/**
 * The content now against the list as shipped. Something gone or moved is a problem at the same
 * version; with SAVE_VERSION above the list's, and an upgrade registered for every version up to it,
 * it is the upgrade's to deal with. Every version from 2 needs its upgrade either way.
 */
export function compare(shipped: Shipped, now: Ids, version = SAVE_VERSION, upgrades: Readonly<Record<number, Upgrade>> = UPGRADES): Comparison {
  const problems: string[] = [], unrecorded: string[] = [], gone: string[] = [];
  for (let v = 2; v <= version; v++) if (!upgrades[v]) problems.push(`SAVE_VERSION is ${version}, but no upgrade brings a save to version ${v} (src/game/upgrades.ts)`);
  if (shipped.version > version) problems.push(`shipped.json is at version ${shipped.version}, past SAVE_VERSION ${version}`);
  const ids = (what: string, was: readonly string[], is: readonly string[]): void => {
    const has = new Set(is), had = new Set(was);
    for (const id of was) if (!has.has(id)) gone.push(`${what} ${id} is gone`);
    for (const id of is) if (!had.has(id)) unrecorded.push(`${what} ${id} is new`);
  };
  for (const [id, was] of Object.entries(shipped.maps)) {
    const is = now.maps[id];
    if (!is) { gone.push(`map ${id} is gone`); continue; }
    if (is.size !== was.size) gone.push(`map ${id} is ${is.size}, was ${was.size}`);
    ids(`${id} chest or event`, was.used, is.used);
    ids(`${id} group`, was.groups, is.groups);
    ids(`${id} door at`, was.doors, is.doors);
  }
  for (const id of Object.keys(now.maps)) if (!shipped.maps[id]) unrecorded.push(`map ${id} is new`);
  for (const [id, was] of Object.entries(shipped.zones)) {
    const is = now.zones[id];
    if (!is) gone.push(`zone ${id} is gone`);
    else if (is.at !== was.at || is.size !== was.size) gone.push(`zone ${id} is ${is.size} at ${is.at}, was ${was.size} at ${was.at}`);
  }
  for (const id of Object.keys(now.zones)) if (!shipped.zones[id]) unrecorded.push(`zone ${id} is new`);
  for (const [k, one] of Object.entries(LISTS) as [keyof typeof LISTS, string][]) ids(one, shipped[k], now[k]);
  const bumped = version > shipped.version && problems.length === 0;
  if (bumped) unrecorded.push(`SAVE_VERSION is ${version}, shipped.json ${shipped.version}`, ...gone.map((g) => `${g}: the upgrade to ${version} must deal with it`));
  else problems.push(...gone.map((g) => `${g}: a save may hold it, so bring it back, or bump SAVE_VERSION with an upgrade`));
  return { problems, unrecorded };
}

export const readShipped = (): Shipped => JSON.parse(readFileSync(SHIPPED_FILE, 'utf8')) as Shipped;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const now = collect(CONTENT);
  let shipped: Shipped | undefined;
  try { shipped = readShipped(); } catch { /* none yet: everything is new */ }
  const { problems, unrecorded } = shipped ? compare(shipped, now) : { problems: [], unrecorded: ['everything'] };
  if (problems.length) {
    console.log(`Not written: ${problems.length} problem(s)\n` + problems.map((p) => '  ' + p).join('\n'));
    process.exit(1);
  }
  const out: Shipped = { version: SAVE_VERSION, ...now };
  writeFileSync(SHIPPED_FILE, JSON.stringify(out, null, 2) + '\n');
  console.log(unrecorded.length ? `Recorded:\n${unrecorded.map((u) => '  ' + u).join('\n')}` : 'Nothing new.');
}
