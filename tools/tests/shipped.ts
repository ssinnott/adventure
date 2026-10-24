// What a save can refer to: the content holds to the shipped files (EXPANSION §5.5), each area's
// own and the central one, joined into one record. Nothing in it goes or moves unless SAVE_VERSION
// goes up with an upgrade, and what is new is recorded, each id in the file of the area that owns it.
// Then the check itself, broken on purpose: a chest, a spell and a guild hall renamed, a door, a
// zone and a map's edge moved, each caught at this version and let through by a bump with its
// upgrade. Each edit finds its target in what the list records and the content still has, so
// neither a rename made properly (a bump, its upgrade, the list regenerated) nor something new
// that comes first dulls the cases. And an area's file gone, and an id in the wrong file, which the
// joined record cannot see.
import { GameMap } from '../../src/game/map.ts';
import type { MapDef, Feature } from '../../src/game/map.ts';
import { layOutdoors, OUTDOORS } from '../../src/game/outdoors.ts';
import type { ZoneMap } from '../../src/game/atlas.ts';
import { guildFlag } from '../../src/game/party.ts';
import { SAVE_VERSION } from '../../src/game/save.ts';
import { UPGRADES } from '../../src/game/upgrades.ts';
import type { Upgrade } from '../../src/game/upgrades.ts';
import { CONTENT, LISTS, collect, collectShares, compare, join, readShares, readShipped, shippedFile } from '../kit/shipped.ts';
import type { Content, Share, Shares, Shipped } from '../kit/shipped.ts';
import { ok } from './lib.ts';

const list = (xs: readonly string[]): string => xs.length ? ':\n        ' + xs.join('\n        ') : '';
/** A check that lists what it found only when it fails, so a green run reads green. */
const okList = (cond: boolean, msg: string, xs: readonly string[]): void => ok(cond, msg + (cond ? '' : list(xs)));

/** A shipped file as lines, one to each thing it records but the version, which compare holds. */
const lines = (s: Share): string[] => [
  ...Object.entries(s.maps ?? {}).flatMap(([id, m]) => [
    ...(m.size === undefined ? [] : [`map ${id} at ${m.size}`]), ...(m.used ?? []).map((x) => `${id} chest or event ${x}`),
    ...(m.groups ?? []).map((x) => `${id} group ${x}`), ...(m.doors ?? []).map((x) => `${id} door at ${x}`),
  ]),
  ...Object.entries(s.zones ?? {}).map(([id, z]) => `zone ${id} at ${z.at}, ${z.size}`),
  ...(Object.entries(LISTS) as [keyof typeof LISTS, string][]).flatMap(([k, one]) => (s[k] ?? []).map((x) => `${one} ${x}`)),
];

/**
 * Where the shipped files disagree with who owns what (`collectShares`): a file missing whose
 * content there is, a line in a file not its owner's, and a line missing from its owner's file while
 * another holds it, which the union would hide. A line no file is owed or none holds is compare's.
 */
function misplaced(files: Shares, owed: Shares): string[] {
  const linesOf = (s: Shares): Map<string, Set<string>> => new Map(Object.entries(s).map(([f, x]) => [f, new Set(lines(x))]));
  const held = linesOf(files), due = linesOf(owed), out: string[] = [];
  const where = (m: Map<string, Set<string>>, line: string): string => [...m].filter(([, x]) => x.has(line)).map(([f]) => f).join(' and ');
  for (const f of due.keys()) if (!held.has(f)) out.push(`${f} is missing, and there is content it records: node tools/shipped.ts makes it`);
  for (const [f, xs] of held) for (const x of xs) if (!due.get(f)?.has(x) && where(due, x)) out.push(`${f} holds ${x}, which belongs in ${where(due, x)}`);
  for (const [f, xs] of due) for (const x of xs) if (held.has(f) && !held.get(f)?.has(x) && where(held, x)) out.push(`${f} lacks ${x}, which ${where(held, x)} holds`);
  return out;
}

/** The content with one map changed. */
const withMap = (id: string, change: (d: MapDef) => MapDef): Content => ({ ...CONTENT, defs: CONTENT.defs.map((d) => (d.id === id ? change(d) : d)) });
const withFeature = (id: string, change: (f: Feature) => Feature): Content => withMap(id, (d) => ({ ...d, features: d.features?.map(change) }));
const indoors = CONTENT.defs.filter((d) => d.kind !== 'outdoor');

/**
 * A case: what it breaks, the words its problem must hold, and the content broken. Each takes its
 * target from what the list records and the content still has, so something new that comes first,
 * not yet recorded, is never the target.
 */
interface Case { what: string; names: string; needle: string; content: Content }

/** The first recorded chest, renamed. The outdoors keeps its zones' chests under its own id. */
function chest(was: Shipped): Case {
  for (const d of CONTENT.defs) {
    const kept = was.maps[d.id] ?? was.maps[OUTDOORS];
    const f = d.features?.find((q) => q.kind === 'chest' && kept?.used.includes(q.id)) as { id: string } | undefined;
    if (!f) continue;
    return { what: 'a chest renamed', names: f.id, needle: `chest or event ${f.id} is gone`, content: withFeature(d.id, (q) => (q.kind === 'chest' && q.id === f.id ? { ...q, id: f.id + '_renamed' } : q)) };
  }
  throw new Error('no chest the list records');
}
/** The first recorded guild hall, renamed: its members' flag goes with the name. */
function guild(was: Shipped): Case {
  for (const d of CONTENT.defs) {
    const f = d.features?.find((q) => q.kind === 'guild' && was.flags.includes(guildFlag(q.name))) as { name: string } | undefined;
    if (!f) continue;
    const flag = guildFlag(f.name);
    return { what: 'a guild hall renamed', names: flag, needle: `flag ${flag} is gone`, content: withFeature(d.id, (q) => (q.kind === 'guild' && q.name === f.name ? { ...q, name: f.name + ' Renamed' } : q)) };
  }
  throw new Error('no guild hall the list records');
}
/** The first recorded locked or secret door of a town or dungeon, swapped with a floor square beside it. */
function door(was: Shipped): Case {
  for (const d of indoors) {
    const m = new GameMap(d), kept = was.maps[d.id]?.doors ?? [];
    for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) {
      if (!kept.includes(`${x},${y}`) || (m.at(x, y).door !== 'locked' && m.at(x, y).door !== 'secret')) continue;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        const c = m.at(nx, ny);
        if (!m.inBounds(nx, ny) || c.door !== 'none' || c.solid !== 'none') continue;
        const rows = d.rows.map((r) => [...r]);
        [rows[y][x], rows[ny][nx]] = [rows[ny][nx], rows[y][x]];
        return { what: 'a door moved', names: `${d.id} ${x},${y}`, needle: `${d.id} door at ${x},${y} is gone`, content: withMap(d.id, (q) => ({ ...q, rows: rows.map((r) => r.join('')) })) };
      }
    }
  }
  throw new Error('no recorded locked or secret door of a town or dungeon has floor beside it');
}
/** The first recorded zone map the atlas lays, a square along, wherever it still fits: the list keys it by the map's id. */
function zone(was: Shipped): Case {
  const m = CONTENT.atlas.zones.flatMap((q) => q.maps ?? []).find((q) => was.zones[q.map]);
  if (!m) throw new Error('no zone the list records');
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const moved = (q: ZoneMap): ZoneMap => (q === m ? { map: m.map, at: [m.at[0] + dx, m.at[1] + dy] } : q);
    const atlas = { ...CONTENT.atlas, zones: CONTENT.atlas.zones.map((q) => (q.maps ? { ...q, maps: q.maps.map(moved) } : q)) };
    try { layOutdoors(atlas, CONTENT.defs); } catch { continue; }
    return { what: 'a zone moved', names: `zone ${m.map}`, needle: `zone ${m.map} is`, content: { ...CONTENT, atlas } };
  }
  throw new Error(`zone ${m.map} cannot move a square without overlapping another`);
}
/** The first recorded spell, renamed. */
function spell(was: Shipped): Case {
  const id = was.spells.find((q) => CONTENT.spells.includes(q));
  if (!id) throw new Error('no spell the list records');
  return { what: 'a spell renamed', names: id, needle: `spell ${id} is gone`, content: { ...CONTENT, spells: CONTENT.spells.map((q) => (q === id ? id + '_renamed' : q)) } };
}
/** The first recorded monster, renamed: a company's `met` names it. */
function monster(was: Shipped): Case {
  const id = (was.monsters ?? []).find((q) => CONTENT.monsters.includes(q));
  if (!id) throw new Error('no monster the list records');
  return { what: 'a monster renamed', names: id, needle: `monster ${id} is gone`, content: { ...CONTENT, monsters: CONTENT.monsters.map((q) => (q === id ? id + '_renamed' : q)) } };
}
/** The first recorded town or dungeon, a row taller. */
function taller(was: Shipped): Case {
  const d = indoors.find((q) => was.maps[q.id]);
  if (!d) throw new Error('no town or dungeon the list records');
  return { what: 'a map made taller', names: `map ${d.id}`, needle: `map ${d.id} is`, content: withMap(d.id, (q) => ({ ...q, rows: [...q.rows, q.rows[q.rows.length - 1]] })) };
}

export function shipped(): void {
  const files = readShares(), was = readShipped(files), owed = collectShares(CONTENT), now = join(owed);
  const { problems, unrecorded } = compare(was, now);
  okList(problems.length === 0, 'nothing a save can refer to has gone or moved', problems);
  okList(unrecorded.length === 0, `the shipped files record all of it, at version ${was.version}${unrecorded.length ? ' (run node tools/shipped.ts)' : ''}`, unrecorded);
  const off = misplaced(files, owed);
  okList(off.length === 0, `each id sits in the shipped file of the area that owns it and in no other (${Object.keys(files).length} files)`, off);
  { // The owners again from the areas' own lists, read off the files and not through collectShares: a wrong lookup there would regenerate consistently and pass the check above.
    const held = (a: string, k: 'maps' | 'zones', id: string): boolean => Boolean(files[shippedFile(a)]?.[k]?.[id]);
    const stray: string[] = [];
    for (const a of CONTENT.areas) {
      for (const id of a.maps) {
        if (!held(a.id, 'maps', id) && !held(a.id, 'zones', id)) stray.push(`${a.id}'s file lacks its map ${id}`);
        for (const b of CONTENT.areas) if (b.id !== a.id && (held(b.id, 'maps', id) || held(b.id, 'zones', id))) stray.push(`${b.id}'s file holds ${a.id}'s map ${id}`);
      }
      for (const [k, ids] of [['items', a.items], ['monsters', a.monsters]] as const) for (const id of ids) {
        if (!files[shippedFile(a.id)]?.[k]?.includes(id)) stray.push(`${a.id}'s file lacks its ${k.slice(0, -1)} ${id}`);
        for (const b of CONTENT.areas) if (b.id !== a.id && files[shippedFile(b.id)]?.[k]?.includes(id)) stray.push(`${b.id}'s file holds ${a.id}'s ${k.slice(0, -1)} ${id}`);
      }
    }
    okList(stray.length === 0, 'each area\'s maps, boxes, items and monsters, by the areas\' own lists, sit in its own shipped file and in no other', stray);
  }
  ok(Object.keys(UPGRADES).map(Number).every((v) => v >= 2 && v <= SAVE_VERSION), 'every upgrade brings a save to a version this build knows');

  // Broken on purpose: each edit is caught, names what it broke, and passes once SAVE_VERSION goes
  // up with an upgrade for the new version. A bump without one is still caught.
  const next = SAVE_VERSION + 1, bumped: Record<number, Upgrade> = { ...UPGRADES, [next]: (d) => d };
  for (const { what, names, needle, content } of [chest, spell, monster, guild, door, zone, taller].map((c) => c(was))) {
    const ids = collect(content), same = compare(was, ids).problems;
    okList(same.some((p) => p.includes(needle)), `${what} is caught (${names})`, same);
    const up = compare(was, ids, next, bumped);
    okList(up.problems.length === 0 && up.unrecorded.some((u) => u.includes(needle)), `${what} passes with SAVE_VERSION ${next} and an upgrade to it, and the generator names what went`, [...up.problems, ...up.unrecorded]);
    const none = compare(was, ids, next, UPGRADES).problems;
    okList(none.some((p) => p.includes(`version ${next}`)) && none.some((p) => p.includes(needle)), `${what} with SAVE_VERSION ${next} and no upgrade to it is caught, naming both`, none);
  }
  { // New content only adds: it passes, and is owed to the list until recorded.
    const more = collect({ ...CONTENT, spells: [...CONTENT.spells, 'new_spell'] });
    const c = compare(was, more);
    ok(c.problems.length === 0 && c.unrecorded.some((u) => u.includes('new_spell')), 'a new spell is no problem, but is to be recorded');
  }

  // Broken on purpose, the files: each break is caught, naming the file.
  const [a, b] = CONTENT.areas.map((x) => shippedFile(x.id));
  { // An area with content and no file.
    const gone = misplaced(Object.fromEntries(Object.entries(owed).filter(([f]) => f !== a)), owed);
    okList(gone.some((m) => m.startsWith(`${a} is missing`)), `an area with content and no shipped file is caught, naming it (${a})`, gone);
  }
  { // A flag moved from one area's file into another's: the joined record is the same, so only the files show it.
    const flag = owed[a].flags?.find((x) => !owed[b].flags?.includes(x));
    if (!flag) throw new Error(`no flag ${a} holds and ${b} does not`);
    const moved: Shares = { ...owed, [a]: { ...owed[a], flags: owed[a].flags?.filter((x) => x !== flag) }, [b]: { ...owed[b], flags: [...(owed[b].flags ?? []), flag] } };
    const off = misplaced(moved, owed), same = JSON.stringify(join(moved)) === JSON.stringify(now);
    okList(same && off.some((m) => m.startsWith(`${b} holds flag ${flag}`)) && off.some((m) => m.startsWith(`${a} lacks flag ${flag}`)), `an id in the wrong area's file is caught on both sides, which the joined record hides (flag ${flag})`, off);
  }
  { // What stands in no area's box is the central file's: a chest moved off its zone map, onto the void west of it.
    const zones = layOutdoors(CONTENT.atlas, CONTENT.defs).find((d) => d.id === OUTDOORS)?.zones ?? [];
    const boxed = (x: number, y: number): boolean => zones.some((z) => x >= z.x && x < z.x + z.w && y >= z.y && y < z.y + z.h);
    const [z, f] = zones.flatMap((q) => (CONTENT.defs.find((d) => d.id === q.id)?.features ?? [])
      .filter((g) => g.kind === 'chest' && q.x > 0 && !boxed(q.x - 1, q.y + g.y)).map((g) => [q, g] as const))[0] ?? [];
    if (!z || f?.kind !== 'chest') throw new Error('no chest of a zone map with nothing built west of its row');
    const parts = collectShares(withFeature(z.id, (q) => (q === f ? { ...q, x: -1 } : q)));
    const holds = (s: Share | undefined): boolean => !!s?.maps?.[OUTDOORS]?.used?.includes(f.id);
    ok(holds(parts[shippedFile()]) && !Object.entries(parts).some(([p, s]) => p !== shippedFile() && holds(s)), `an id of the outdoors in no area's box is the central file's alone (${z.id}'s chest ${f.id})`);
  }
}
