// What a save can refer to, as shipped: the shipped files list every id and placement a save may
// hold (EXPANSION §5.5), each area's own in src/content/areas/<area>/shipped.json and the version
// and what no area owns in src/content/shipped.json, joined into one record. A content edit reaches
// every old save, so what is in the list stays: a map keeps its size, a zone its place, a door its
// square, and no chest, event, inscription, group, flag, item, spell, monster, class, race, condition
// or skill goes, unless SAVE_VERSION goes up with an upgrade (src/game/upgrades.ts). New content
// only adds. tools/tests/shipped.ts holds the content to it.
//   node tools/shipped.ts    record what the content adds, each in the file of the area that owns
//                            it (a new area's first run makes its file), writing only a file that
//                            changed; refuses while something has gone or moved without a bump and
//                            its upgrade
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { GameMap } from '../src/game/map.ts';
import type { MapDef } from '../src/game/map.ts';
import type { Atlas } from '../src/game/atlas.ts';
import { layOutdoors, OUTDOORS } from '../src/game/outdoors.ts';
import { CLASSES, RACES, CONDITION_ORDER, guildFlag } from '../src/game/party.ts';
import { SAVE_VERSION } from '../src/game/save.ts';
import { spentId } from '../src/game/wilds.ts';
import { readId } from '../src/game/inscriptions.ts';
import { SKILLS } from '../src/game/skills.ts';
import { TIERS } from '../src/game/mastery.ts';
import { personFlags, groupFlags } from '../src/game/people.ts';
import { GLOVE_FLAG } from '../src/game/combat.ts';
import { UPGRADES } from '../src/game/upgrades.ts';
import type { Upgrade } from '../src/game/upgrades.ts';
import { ATLAS, MAP_DEFS, AREAS, GUILD_QUESTS } from '../src/content/index.ts';
import type { Area } from '../src/content/area.ts';
import { GUILDS, takenFlag, doneFlag, rankFlag } from '../src/content/guilds.ts';
import type { GuildId } from '../src/content/guilds.ts';
import { ITEMS } from '../src/content/items.ts';
import { SPELLS } from '../src/content/spells.ts';

/** A shipped file, from the root: an area's, or with no area the central one, which holds the version and what no area owns. */
export const shippedFile = (area?: string): string => (area ? `src/content/areas/${area}/shipped.json` : 'src/content/shipped.json');
const onDisk = (file: string): string => fileURLToPath(new URL(`../${file}`, import.meta.url));

/** Flags the code sets rather than the content: the temple's count of gifts, and the Hearth's light seen to pass through a machine. */
const CODE_FLAGS = ['donations', GLOVE_FLAG];

/** An area's own maps, items, monsters and guild quests, by id, as its lists hold them: its shipped file records them. */
export interface AreaIds { id: string; maps: readonly string[]; items: readonly string[]; monsters: readonly string[]; guildQuests: readonly string[] }

/** The content a save refers to: the maps as written and the atlas that lays them out, and the tables. */
export interface Content {
  atlas: Atlas;
  defs: readonly MapDef[];
  items: readonly string[];
  spells: readonly string[];
  /** The monster defs, which a company's `met` record names. */
  monsters: readonly string[];
  classes: readonly string[];
  races: readonly string[];
  conditions: readonly string[];
  /** The guild quests, whose taken and done flags a save holds (game/guilds.ts). */
  guildQuests: readonly string[];
  /** The secondary skills, which a member's `skills` names (game/skills.ts). */
  skills: readonly string[];
  /** The tiers, which a member's `tiers` names on each line (game/mastery.ts). */
  tiers: readonly string[];
  /** Who owns what: each area its own lists. What none owns is the central file's. */
  areas: readonly AreaIds[];
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
  monsters: string[];
  classes: string[];
  races: string[];
  conditions: string[];
  skills: string[];
  tiers: string[];
}

export interface Shipped extends Ids { version: number }

/**
 * One shipped file's part of the record, in the record's shape. An area's holds its played maps,
 * its zones, the ids, groups and door squares of the outdoors that stand in its boxes (under the
 * outdoors' id, with no size), the flags its maps and guild quests set, its items and its monsters;
 * the central file the version, the outdoors' size and the rest. What a file has nothing in it
 * leaves out.
 */
export type Share = Partial<Omit<Shipped, 'maps'>> & { maps?: Record<string, Partial<ShippedMap>> };
/** The shipped files' parts, by file (`shippedFile`). */
export type Shares = Record<string, Share>;
type List = keyof typeof LISTS;

export const CONTENT: Content = {
  atlas: ATLAS, defs: MAP_DEFS,
  // From the lists as written: the merged tables are open to a tool's additions (tools/harness.ts's
  // enchanted items), which no save holds.
  items: [...ITEMS, ...AREAS.flatMap((a) => a.items)].map((i) => i.id), spells: SPELLS.map((s) => s.id),
  monsters: AREAS.flatMap((a) => a.monsters).map((m) => m.id),
  classes: Object.keys(CLASSES), races: Object.keys(RACES), conditions: [...CONDITION_ORDER],
  guildQuests: GUILD_QUESTS.map((q) => q.id), skills: Object.keys(SKILLS), tiers: [...TIERS],
  areas: AREAS.map((a: Area) => ({ id: a.id, maps: a.maps.map((d) => d.id), items: a.items.map((i) => i.id), monsters: a.monsters.map((m) => m.id), guildQuests: (a.guilds ?? []).map((q) => q.id) })),
};

const sorted = (xs: Iterable<string>): string[] => [...new Set(xs)].sort();
const byKey = <T>(o: Record<string, T>): Record<string, T> => Object.fromEntries(Object.entries(o).sort(([a], [b]) => (a < b ? -1 : 1)));

/**
 * What a save made on this content could hold, cut by the file that records it. A played map, a
 * zone, an item, a monster and a guild quest's flags are the area's whose lists hold it; an id,
 * group, door square or flag of the outdoors is the area's whose box it stands in, and a flag a town
 * or dungeon sets its area's, so a flag two areas set is in both. The rest is the central file's:
 * the outdoors' size, the core items, the flags the code sets and the guilds' ranks, the spells,
 * classes, races, conditions, skills and tiers, and whatever stands in no area's lists or box.
 */
export function collectShares(c: Content): Shares {
  const shares: Shares = {};
  const own = (ids: (a: AreaIds) => readonly string[]): Map<string, string> => new Map(c.areas.flatMap((a) => ids(a).map((id) => [id, a.id] as const)));
  const mapOf = own((a) => a.maps), itemOf = own((a) => a.items), monsterOf = own((a) => a.monsters), questOf = own((a) => a.guildQuests);
  const share = (area?: string): Share => (shares[shippedFile(area)] ??= {});
  const add = (area: string | undefined, k: List, ids: Iterable<string>): void => { (share(area)[k] ??= []).push(...ids); };
  for (const def of layOutdoors(c.atlas, c.defs)) {
    const m = new GameMap(def), outdoors = m.id === OUTDOORS;
    const box = (x: number, y: number): string => m.zones.find((z) => x >= z.x && x < z.x + z.w && y >= z.y && y < z.y + z.h)?.id ?? '';
    /** Whose a square is: the outdoors' the area's whose box it stands in, a town's or dungeon's its area's. */
    const whose = (x: number, y: number): string | undefined => mapOf.get(outdoors ? box(x, y) : m.id);
    const kept = (area: string | undefined): Partial<ShippedMap> => ((share(area).maps ??= {})[m.id] ??= {});
    const put = (x: number, y: number, k: 'used' | 'groups' | 'doors', id: string): void => { (kept(whose(x, y))[k] ??= []).push(id); };
    if (outdoors) kept(undefined).size = `${m.width}x${m.height}`;
    else Object.assign(kept(whose(0, 0)), { size: `${m.width}x${m.height}`, used: [], groups: [], doors: [] });
    for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) {
      const d = m.at(x, y).door;
      if (d === 'locked' || d === 'secret') put(x, y, 'doors', `${x},${y}`);
    }
    for (const f of m.features) {
      const area = whose(f.x, f.y);
      const spent = spentId(f); if (spent) put(f.x, f.y, 'used', spent);
      const read = readId(f); if (read) put(f.x, f.y, 'used', read);
      if (f.kind === 'guild') add(area, 'flags', [guildFlag(f.name)]);
      if (f.kind === 'npc') add(area, 'flags', personFlags(f));
      if (f.kind === 'event') add(area, 'flags', [f.sets ?? []].flat());
      if (f.kind === 'inn') add(area, 'flags', f.nights ?? []);
      if (f.kind === 'camp') add(area, 'flags', (f.nights ?? []).map((n) => n.sets));
    }
    for (const e of m.encounters) { put(e.x, e.y, 'groups', e.id); add(whose(e.x, e.y), 'flags', groupFlags(e)); }
    for (const z of m.zones) (share(mapOf.get(z.id)).zones ??= {})[z.id] = { at: `${z.x},${z.y}`, size: `${z.w}x${z.h}` };
  }
  for (const q of c.guildQuests) add(questOf.get(q), 'flags', [takenFlag(q), doneFlag(q)]);
  add(undefined, 'flags', [...CODE_FLAGS, ...(Object.keys(GUILDS) as GuildId[]).map(rankFlag)]);
  for (const id of c.items) add(itemOf.get(id), 'items', [id]);
  for (const id of c.monsters) add(monsterOf.get(id), 'monsters', [id]);
  for (const k of ['spells', 'classes', 'races', 'conditions', 'skills', 'tiers'] as const) add(undefined, k, c[k]);
  return byKey(Object.fromEntries(Object.entries(shares).map(([file, s]) => [file, tidy(s)])));
}

/** A share as written: the record's keys in its order, each list sorted with each id once, what it has nothing in left out. */
function tidy(s: Share): Share {
  const out: Share = s.version === undefined ? {} : { version: s.version };
  if (s.maps) out.maps = byKey(Object.fromEntries(Object.entries(s.maps).map(([id, m]) => [id, {
    ...(m.size === undefined ? {} : { size: m.size }), ...(m.used ? { used: sorted(m.used) } : {}),
    ...(m.groups ? { groups: sorted(m.groups) } : {}), ...(m.doors ? { doors: sorted(m.doors) } : {}),
  }])));
  if (s.zones) out.zones = byKey(s.zones);
  for (const k of Object.keys(LISTS) as List[]) { const xs = s[k]; if (xs?.length) out[k] = sorted(xs); }
  return out;
}

/** The shipped files as the one record a save is held to: each list the union of the files', sorted, a map's lists likewise and its size the one a file gives. */
export function join(shares: Shares): Ids {
  const all = Object.values(shares), maps: Record<string, ShippedMap> = {}, zones: Ids['zones'] = {};
  for (const s of all) {
    for (const [id, m] of Object.entries(s.maps ?? {})) {
      const j = (maps[id] ??= { size: '', used: [], groups: [], doors: [] });
      if (m.size !== undefined) j.size = m.size;
      j.used.push(...(m.used ?? [])); j.groups.push(...(m.groups ?? [])); j.doors.push(...(m.doors ?? []));
    }
    Object.assign(zones, s.zones);
  }
  const list = (k: List): string[] => sorted(all.flatMap((s) => s[k] ?? []));
  return {
    maps: byKey(Object.fromEntries(Object.entries(maps).map(([id, m]) => [id, { size: m.size, used: sorted(m.used), groups: sorted(m.groups), doors: sorted(m.doors) }]))),
    zones: byKey(zones), flags: list('flags'), items: list('items'), spells: list('spells'), monsters: list('monsters'), classes: list('classes'), races: list('races'),
    conditions: list('conditions'), skills: list('skills'), tiers: list('tiers'),
  };
}

/** What a save made on this content could hold, as one record: the shares joined. */
export const collect = (c: Content): Ids => join(collectShares(c));

export interface Comparison {
  /** What has gone or moved without a bump and its upgrade, or an upgrade missing: a fix to the content or a bump. */
  problems: string[];
  /** What the list has yet to record: new content, or a bump and what went with it. `node tools/shipped.ts` records it. */
  unrecorded: string[];
}

/** Each list, by the word for one of it. */
export const LISTS = { flags: 'flag', items: 'item', spells: 'spell', monsters: 'monster', classes: 'class', races: 'race', conditions: 'condition', skills: 'skill', tiers: 'tier' } as const;

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
  for (const [k, one] of Object.entries(LISTS) as [keyof typeof LISTS, string][]) ids(one, shipped[k] ?? [], now[k]);
  const bumped = version > shipped.version && problems.length === 0;
  if (bumped) unrecorded.push(`SAVE_VERSION is ${version}, shipped.json ${shipped.version}`, ...gone.map((g) => `${g}: the upgrade to ${version} must deal with it`));
  else problems.push(...gone.map((g) => `${g}: a save may hold it, so bring it back, or bump SAVE_VERSION with an upgrade`));
  return { problems, unrecorded };
}

/** The shipped files there are: the central one and each listed area's. A new area has none until its first run of the tool. */
export function readShares(areas: readonly string[] = CONTENT.areas.map((a) => a.id)): Shares {
  const shares: Shares = {};
  for (const file of [shippedFile(), ...areas.map(shippedFile)]) if (existsSync(onDisk(file))) shares[file] = JSON.parse(readFileSync(onDisk(file), 'utf8')) as Share;
  return shares;
}

/** The shipped files joined, at the central file's version: the one record a save is held to. */
export const readShipped = (shares: Shares = readShares()): Shipped => ({ version: shares[shippedFile()]?.version ?? 0, ...join(shares) });

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const read = readShares(), now = collectShares(CONTENT);
  const { problems, unrecorded } = Object.keys(read).length ? compare(readShipped(read), join(now)) : { problems: [], unrecorded: ['everything'] };
  if (problems.length) {
    console.log(`Not written: ${problems.length} problem(s)\n` + problems.map((p) => '  ' + p).join('\n'));
    process.exit(1);
  }
  const written: string[] = [];
  for (const [file, share] of Object.entries(now)) {
    const text = JSON.stringify(file === shippedFile() ? { version: SAVE_VERSION, ...share } : share, null, 2) + '\n';
    if (existsSync(onDisk(file)) && readFileSync(onDisk(file), 'utf8') === text) continue;
    writeFileSync(onDisk(file), text);
    written.push(file);
  }
  console.log(unrecorded.length ? `Recorded:\n${unrecorded.map((u) => '  ' + u).join('\n')}` : 'Nothing new.');
  if (written.length) console.log(`Written:\n${written.map((w) => '  ' + w).join('\n')}`);
}
