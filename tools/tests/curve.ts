// The curve (EXPANSION §5.2), area by area, against its row in src/content/progression.ts: its band
// is the atlas's, three quarters of a clear's xp reaches the next area's floor, a clear's gold
// trains the party through the band, every monster's level sits in its maps' bands, on each map
// the groups' levels rise with walking steps from the way in, the nearest group is near the floor
// and the hardest near the top, and no chest or drop is dearer than the area's window. Entered at
// its floor and three quarters cleared, paid by level, an area leaves a company no more than a
// level over the next floor, unless it is named as passing that. What a row says is owed is
// reported, not failed, until it holds. A map an area lists `outside` is held to its own band and
// its country's window, and what it pays is a figure, counted in no clear.
import { AREAS, ATLAS, MAP_DEFS, MONSTERS, ITEMS } from '../../src/content/index.ts';
import type { RegionId } from '../../src/content/index.ts';
import type { Area } from '../../src/content/area.ts';
import { CURVE, PLANNED, MEMBERS, xpBudget, goldBudget } from '../../src/content/progression.ts';
import type { AreaCurve } from '../../src/content/progression.ts';
import { GameMap } from '../../src/game/map.ts';
import type { MapDef, Feature } from '../../src/game/map.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
import { areaBand } from '../../src/game/atlas.ts';
import { giftOf, spentId } from '../../src/game/wilds.ts';
import { handIns, choices } from '../../src/game/people.ts';
import { xpForLevel, killPay, MAX_LEVEL } from '../../src/game/party.ts';
import { ok, owed } from './lib.ts';

/**
 * Walking steps from a map's way in (its start, or `from`) to every cell, given keys and secrets, swimming and
 * climbing: never through a wall, tree, rock, deep water or the void. Infinity where the party
 * cannot walk.
 */
export function stepsFrom(def: MapDef, from: { x: number; y: number } = def.start): (x: number, y: number) => number {
  const m = new GameMap(def);
  const steps = new Map<number, number>([[from.y * m.width + from.x, 0]]);
  const queue = [[from.x, from.y]];
  for (let i = 0; i < queue.length; i++) {
    const [x, y] = queue[i]; const n = steps.get(y * m.width + x)!;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const [nx, ny] = [x + dx, y + dy]; const k = ny * m.width + nx;
      if (!m.inBounds(nx, ny) || steps.has(k)) continue;
      const pass = m.passable(nx, ny, { swim: true, climb: true, keys: 1 });
      if (pass !== 'ok' && pass !== 'unlock') continue;
      steps.set(k, n + 1); queue.push([nx, ny]);
    }
  }
  return (x, y) => steps.get(y * m.width + x) ?? Infinity;
}

/** Spearman's rank correlation, ties given their mean rank; 0 where either side does not vary. */
function rankCorrelation(a: readonly number[], b: readonly number[]): number {
  const ranks = (v: readonly number[]): number[] => {
    const order = v.map((x, i) => [x, i]).sort((p, q) => p[0] - q[0]); const r = new Array<number>(v.length);
    for (let i = 0; i < order.length;) {
      let j = i; while (j + 1 < order.length && order[j + 1][0] === order[i][0]) j++;
      for (let k = i; k <= j; k++) r[order[k][1]] = (i + j) / 2;
      i = j + 1;
    }
    return r;
  };
  const ra = ranks(a), rb = ranks(b), mean = (v: number[]): number => v.reduce((t, x) => t + x, 0) / v.length;
  const ma = mean(ra), mb = mean(rb);
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < ra.length; i++) { num += (ra[i] - ma) * (rb[i] - mb); da += (ra[i] - ma) ** 2; db += (rb[i] - mb) ** 2; }
  return da && db ? num / Math.sqrt(da * db) : 0;
}

const fmt = (n: number): string => Math.round(n).toLocaleString('en-GB');

/** A figure the curve asks for: passed, or reported while its row says it is owed, above a floor. */
function budget(id: string, what: string, gives: number, needs: number, owing: AreaCurve['owed'], floor: number | undefined): void {
  const msg = `${id}: a clear gives ${fmt(gives)} ${what} of the ${fmt(needs)} the curve asks`;
  if (owing && floor !== undefined) {
    ok(gives >= floor, `${id}: a clear still gives the ${fmt(floor)} ${what} it gave when the shortfall was owed (${fmt(gives)})`);
    owed(gives >= needs, `${msg}; ${owing.why}`, owing.whose);
  } else ok(gives >= needs, msg);
}

/**
 * Areas listed by their first maps whose band the atlas cannot give yet, and whose issue owes it: a
 * zone's band is its built maps' once it has any, so an area with only its first map may read
 * narrower than its row. Reported, not failed, until it holds; then the entry is dropped.
 */
const BAND_OWED: Record<string, string> = {};

/**
 * Whether a map's floor is over its area's band: a later area's country reached from this one, as
 * the Dead-Drop's stair under the Tide Ship is, 26 to 28 in Act II's isle. The pace check places it
 * with that later area (tools/tests/pillars.ts); here it stands outside its area's band and clear,
 * and pays nothing unless its area lists it `outside`.
 */
export const beyond = (d: Pick<MapDef, 'band'>, band: readonly [number, number]): boolean => !!d.band && d.band[0] > band[1];

/**
 * What is wrong with an area's `outside`, the maps that pay outside any area's budget: an id that is
 * none of its maps, or a map that does not stand past its band. Only a map past it may: the deepest
 * levels, which the road never needs.
 */
export function outsideFaults(area: { id: string; maps: readonly Pick<MapDef, 'id' | 'band'>[]; outside?: readonly string[] }, band: readonly [number, number]): string[] {
  return (area.outside ?? []).flatMap((id) => {
    const d = area.maps.find((m) => m.id === id);
    if (!d) return [`${area.id}: ${id}, listed outside its budget, is none of its maps`];
    return beyond(d, band) ? [] : [`${area.id}: ${id}, listed outside its budget, does not stand past its band ${band.join('-')} (${d.band?.join('-') ?? 'none'})`];
  });
}

/**
 * What a clear of some maps gives: a member's share of the xp, the gold in cash, the monsters it
 * places in their groups' order, its features and a member's share of its quests' xp.
 */
interface Clear { xp: number; gold: number; placed: MonsterDef[]; features: Feature[]; quest: number }

/** A clear of these maps: every group once, a member's share of the xp summed; the gold in cash. */
function clearOf(maps: readonly MapDef[], guild: NonNullable<Area['guilds']> = []): Clear {
  const groups = maps.flatMap((d) => d.encounters ?? []);
  const placed = groups.flatMap((e) => e.monsters.map((m) => MONSTERS[m]));
  const features = maps.flatMap((d) => d.features ?? []);
  // A question's pay, whichever way it is answered: of its answers, the least, for each of xp and gold.
  // A question two people share (one person in two places) is counted once.
  const asked = [...new Set(features.flatMap((f) => f.kind === 'npc' ? choices(f) : []))];
  const sure = (k: 'xp' | 'gold'): number => asked.reduce((t, c) => t + Math.min(...c.answers.map((a) => a.pay?.[k] ?? 0)), 0);
  const quest = guild.reduce((t, q) => t + (q.pay.xp ?? 0), 0) + sure('xp');
  const xp = Math.floor((placed.reduce((t, m) => t + m.xp, 0) + quest) / MEMBERS);
  // A hand-in's reward, once an item: of two people who take it, the larger.
  const rewards = new Map<string, number>();
  for (const f of features) if (f.kind === 'npc') for (const q of handIns(f)) rewards.set(q.item, Math.max(rewards.get(q.item) ?? 0, q.reward));
  const gold = placed.reduce((t, m) => t + (m.gold[0] + m.gold[1]) / 2, 0)
    + features.reduce((t, f) => t + (giftOf(f)?.gold ?? 0), 0) + [...rewards.values()].reduce((t, r) => t + r, 0)
    + guild.reduce((t, q) => t + (q.pay.gold ?? 0), 0) + sure('gold');
  return { xp, gold, placed, features, quest: quest / MEMBERS };
}

/**
 * The level a company of six leaves an area at, as a decimal (19.2 is level 19 and two tenths of
 * the way to 20), entered at its floor and three quarters cleared, paid as the game pays: a kill
 * pays a member a sixth of its xp by its level against the company's (`killPay`), one at a time,
 * the company training as soon as it can; the quests pay theirs fixed, spread evenly through the
 * kills. Chests pay no xp.
 */
export function leaves(floor: number, kills: readonly Pick<MonsterDef, 'xp' | 'level'>[], quest: number): number {
  let xp = xpForLevel(floor), level = floor;
  for (const m of kills) {
    xp += 0.75 * ((m.xp / MEMBERS) * killPay(m.level, level) + quest / kills.length);
    while (level < MAX_LEVEL && xp >= xpForLevel(level + 1)) level++;
  }
  return level < MAX_LEVEL ? level + (xp - xpForLevel(level)) / (xpForLevel(level + 1) - xpForLevel(level)) : level;
}

/** How far over the next floor an area may leave that company: a level (EXPANSION §5.2, #634). */
const LEAD = 1;

/**
 * The areas that leave it further over, each held at the level it leaves as built, rounded up, as
 * a row's `owed` holds a floor, so that none grows unnoticed; once inside the line, it is dropped.
 */
const OVER_ROAD: Partial<Record<RegionId, { level: number; why: string }>> = {
  kilns: { level: 19.3, why: 'the bosses pay the line\'s (MONSTERS §4.3 and §4.4), and the country behind the road its own (#474)' },
  ashfall: { level: 27.2, why: 'the Stone, the rungs, the quests and the sentries' },
};

const leadSaid = (id: string, left: number, next: number): string =>
  `${id}: entered at its floor and three quarters cleared, paid by level, a company leaves at ${left.toFixed(1)}, ${left < next ? '' : '+'}${(left - next).toFixed(1)} over the next floor ${next}`;

/**
 * What is wrong with the level an area leaves that company at, against the next floor and the
 * figure it is named at: nothing when it holds.
 */
export function leadFault(id: string, left: number, next: number, named?: { level: number }): string | undefined {
  if (!named) return left - next > LEAD ? `${leadSaid(id, left, next)}: more than a level, and it is not named in OVER_ROAD` : undefined;
  if (left > named.level) return `${leadSaid(id, left, next)}: past its named ${named.level}, so it grew`;
  return left - next > LEAD ? undefined : `${leadSaid(id, left, next)}: inside the line, so drop it from OVER_ROAD`;
}

/**
 * The price window: no weapon, armour or shield in a clear's chests or its monsters' drops dearer
 * than `price`. Keys, quest items and consumables are exempt.
 */
function priceWindow(who: string, { placed, features }: Clear, price: number): void {
  const found = [
    ...features.flatMap((f) => (giftOf(f)?.items ?? []).map((it) => ({ it, from: `${f.kind} ${spentId(f)}` }))),
    ...[...new Set(placed)].flatMap((m) => (m.drops ?? []).map((x) => ({ it: x.item, from: `${m.id}'s drop` }))),
  ].filter(({ it }) => ITEMS[it].slot !== 'none' && ITEMS[it].price > 0);
  const dearer = found.filter((x) => ITEMS[x.it].price > price);
  for (const x of dearer) ok(false, `${who}: ${x.it} (${ITEMS[x.it].price} gold, ${x.from}) is dearer than its window's ${price}`);
  const dearest = found.reduce((p, x) => (ITEMS[x.it].price > ITEMS[p.it].price ? x : p), found[0]);
  if (!dearer.length && dearest) ok(true, `${who}: its dearest find, ${dearest.it} at ${ITEMS[dearest.it].price} gold, sits in its window (${price})`);
}

export function curve(): void {
  const fx: [number, number] = [12, 14];
  ok(beyond({ band: [26, 28] }, fx) && !beyond({ band: [12, 14] }, fx) && !beyond({ band: [10, 11] }, fx) && !beyond({}, fx),
    'a map whose floor is over its area\'s band stands past it; one in it, under it or with none does not');
  const isle = { id: 'fixture', maps: [{ id: 'fx_shore', band: fx }, { id: 'fx_drop', band: [26, 28] as [number, number] }] };
  ok(!outsideFaults({ ...isle, outside: ['fx_drop'] }, fx).length && outsideFaults({ ...isle, outside: ['fx_shore', 'fx_vault'] }, fx).length === 2,
    'an area may list a map of its own outside its budget where it stands past its band, and not one in its band or none of its maps');
  const climb = (MEMBERS * (xpForLevel(6) - xpForLevel(5))) / 0.75, near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-9;
  ok(near(leaves(5, [{ xp: climb, level: 5 }], 0), 6) && near(leaves(5, [{ xp: 0, level: 9 }], climb / MEMBERS), 6) && near(leaves(5, [{ xp: climb, level: 2 }], 0), 5.1),
    'three quarters of the climb from 5, paid by a kill at the company\'s level or by quests, reaches 6; paid by a kill three under, a tenth of the way');
  ok(!leadFault('fx', 19, 18) && !!leadFault('fx', 19.1, 18), 'an area may leave a company a level over the next floor, and no more unless it is named');
  const named = { level: 19.2 };
  ok(!leadFault('fx', 19.2, 18, named) && !!leadFault('fx', 19.3, 18, named) && !!leadFault('fx', 19, 18, named),
    'a named area may leave it further over, up to its figure, and not past it, nor stay named once inside the line');
  // The built areas and the planned ones, which have rows before they have maps, in the atlas's
  // order: an area may be listed before an earlier one is, and its row still follows that one's. A
  // planned area's clear gives nothing yet, and its row says who owes it.
  const built: readonly string[] = AREAS.map((a) => a.id);
  for (const id of PLANNED) ok(!built.includes(id), `${id}: a planned row, and not yet an area (once its first map lists it in AREAS, it leaves PLANNED)`);
  const order = (id: string): number => ATLAS.areas.find((a) => a.id === id)?.order ?? Infinity;
  const road: readonly { id: RegionId | (typeof PLANNED)[number]; area?: Area }[] = [...AREAS.map((a) => ({ id: a.id, area: a as Area })), ...PLANNED.map((id) => ({ id }))]
    .sort((a, b) => order(a.id) - order(b.id));
  road.forEach(({ id, area }, i) => {
    const row = CURVE[id];
    const [lo, hi] = row.band;
    const maps = (area?.maps ?? []).filter((d) => !beyond(d, row.band));
    // A map past the band pays nothing here, unless the area lists it outside its budget: then it is
    // held to its own band and its country's window, and what it pays is counted in no clear.
    const apart = (area?.maps ?? []).filter((d) => beyond(d, row.band) && !!area?.outside?.includes(d.id));
    for (const d of (area?.maps ?? []).filter((q) => beyond(q, row.band) && !apart.includes(q))) ok(!d.encounters?.length && !d.features?.some((f) => f.kind === 'chest'), `${id}: ${d.id}, at ${d.band!.join('-')}, stands past its band, a later area's country, and pays nothing here`);
    if (area) for (const f of outsideFaults(area, row.band)) ok(false, f);
    // The band: the atlas's, holding every map's, and the next floor the next area's.
    const atlas = areaBand(ATLAS, MAP_DEFS, id);
    const bandMsg = `${id}: its band ${lo}-${hi} is the atlas's (${atlas?.join('-') ?? 'none'})`, bandHolds = !!atlas && atlas[0] === lo && atlas[1] === hi;
    if (BAND_OWED[id]) owed(bandHolds, bandMsg, BAND_OWED[id]);
    else ok(bandHolds, bandMsg);
    for (const d of maps) ok(!!d.band && d.band[0] >= lo && d.band[1] <= hi, `${id}: ${d.id}'s band ${d.band?.join('-') ?? 'none'} sits in ${lo}-${hi}`);
    const later = road[i + 1];
    const at = order(id);
    const next = later ? CURVE[later.id].band[0] : ATLAS.areas.find((a) => a.order === at + 1)?.band?.[0];
    ok(row.next === next, `${id}: the next floor, ${row.next}, is the next area's (${next ?? 'none'})`);
    if (later) ok(order(later.id) === at + 1, `${id}: ${later.id}, its next row, is the atlas's next area`);

    // What a clear gives: every group once, a member's share of the xp summed; the gold in cash.
    // The area's guild quests pay too, counted with the area whose file holds them.
    const clear = clearOf(maps, area?.guilds ?? []);
    budget(id, 'xp a member', clear.xp, xpBudget(row), row.owed, row.owed?.xp);
    budget(id, 'gold', Math.floor(clear.gold), goldBudget(row), row.owed, row.owed?.gold);
    // The lead over the road (#634): the level that clear leaves a company at, paid by level,
    // against the next floor and, for an area named in OVER_ROAD, its figure.
    if (area) {
      const left = leaves(lo, clear.placed, clear.quest), held = OVER_ROAD[id], fault = leadFault(id, left, row.next, held);
      ok(!fault, fault ?? `${leadSaid(id, left, row.next)}${held ? `, a named exception held at ${held.level}: ${held.why}` : ''}`);
    }
    // What the maps outside give is a figure, never a failure: no clear counts it, and no one owes
    // it, for they are the deepest levels, which the road never needs.
    if (apart.length) {
      const out = clearOf(apart);
      ok(true, `${id}: outside its budget, ${apart.map((d) => d.id).join(', ')} give ${fmt(out.xp)} xp a member and ${fmt(out.gold)} gold, counted in no clear`);
    }

    // Every monster's level: at least 1, and within two of the band of every map that places it, a
    // map outside the budget its own.
    for (const d of [...maps, ...apart]) {
      if (!d.encounters?.length) continue;
      const [a, b] = d.band ?? [1, 0];
      // A caller's retinue, the kind it calls, stands in its group at its own level, as the calls it
      // makes do (the tallyman's knockers at the ice-hole, docs/areas/rimewater.md §9, #487): the
      // group's own monsters are the rest, and they set its level.
      const own = (e: { monsters: readonly string[] }): string[] => e.monsters.filter((m) => !e.monsters.some((c) => (MONSTERS[c].calls?.monsters ?? []).some((q) => q === m)));
      const kinds = [...new Set(d.encounters.flatMap(own))];
      const astray = kinds.filter((mid) => { const l = MONSTERS[mid].level; return !(Number.isInteger(l) && l >= 1 && l >= a - 2 && l <= b + 2); });
      ok(!astray.length, `${d.id}: its ${kinds.length} monsters' levels sit in ${a}-${b}, give or take two${astray.length ? `; not ${astray.map((m) => `${m} (${MONSTERS[m].level})`).join(', ')}` : ''}`);
      // Rising: a group's level (its monsters' mean) goes with its walking steps from the way in,
      // the nearest group is near the floor, and the hardest near the top. The hardest need not be
      // the farthest: Thornmark's farthest, the lake, is a middling group.
      const steps = stepsFrom(d);
      const at = d.encounters.map((e) => ({ id: e.id, steps: steps(e.x, e.y), level: own(e).reduce((t, m) => t + MONSTERS[m].level, 0) / own(e).length }));
      const lost = at.filter((g) => !Number.isFinite(g.steps));
      ok(!lost.length, `${d.id}: its ${at.length} groups can be walked to from the way in${lost.length ? `; not ${lost.map((g) => g.id).join(', ')}` : ''}`);
      const walked = at.filter((g) => Number.isFinite(g.steps));
      if (!walked.length) continue;
      // A rise needs two groups at different distances; the nearest and hardest cover the rest.
      if (new Set(walked.map((g) => g.steps)).size > 1) {
        const rho = rankCorrelation(walked.map((g) => g.steps), walked.map((g) => g.level));
        ok(rho > 0, `${d.id}: its groups' levels rise from the way in (rank correlation ${rho.toFixed(2)})`);
      }
      const nearest = walked.reduce((p, g) => (g.steps < p.steps ? g : p));
      ok(nearest.level <= a + 2, `${d.id}: the nearest group, ${nearest.id} at ${nearest.steps} steps, is near the floor ${a} (level ${nearest.level.toFixed(1)})`);
      const hardest = walked.reduce((p, g) => (g.level > p.level ? g : p));
      // Near the top is within two of it, but above the floor however narrow the band.
      const top = Math.max(a + 1, b - 2);
      ok(hardest.level >= top, `${d.id}: the hardest group, ${hardest.id} at ${hardest.steps} steps, is near the top ${b} (level ${hardest.level.toFixed(1)}, at least ${top})`);
    }

    // The price window, the row's. A map outside the budget is held to its country's: the window of
    // the last area on the road whose floor is at or under its own, as the pace check places it.
    priceWindow(id, clear, row.price);
    for (const d of apart) priceWindow(d.id, clearOf([d]), CURVE[road.filter((r) => CURVE[r.id].band[0] <= d.band![0]).pop()!.id].price);
    // The window never narrows along the road.
    const before = road[i - 1];
    if (before) ok(row.price >= CURVE[before.id].price, `${id}: its window, ${row.price}, is no narrower than ${before.id}'s (${CURVE[before.id].price})`);
  });
}
