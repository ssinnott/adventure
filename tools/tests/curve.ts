// The curve (EXPANSION §5.2), area by area, against its row in src/content/progression.ts: its band
// is the atlas's, three quarters of a clear's xp reaches the next area's floor, a clear's gold
// trains the party through the band, every monster's level sits in its maps' bands, on each map
// the groups' levels rise with walking steps from the way in, the nearest group is near the floor
// and the hardest near the top, and no chest or drop is dearer than the area's window. What a row
// says is owed is reported, not failed, until it holds.
import { AREAS, ATLAS, MAP_DEFS, MONSTERS, ITEMS } from '../../src/content/index.ts';
import type { RegionId } from '../../src/content/index.ts';
import type { Area } from '../../src/content/area.ts';
import { CURVE, PLANNED, MEMBERS, xpBudget, goldBudget } from '../../src/content/progression.ts';
import type { AreaCurve } from '../../src/content/progression.ts';
import { GameMap } from '../../src/game/map.ts';
import type { MapDef } from '../../src/game/map.ts';
import { areaBand } from '../../src/game/atlas.ts';
import { giftOf, spentId } from '../../src/game/wilds.ts';
import { handIns } from '../../src/game/people.ts';
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
const BAND_OWED: Record<string, string> = { wrackholm: '#189' };

export function curve(): void {
  // The built areas and the planned ones, which have rows before they have maps, in the atlas's
  // order: an area may be listed before an earlier one is, and its row still follows that one's. A
  // planned area's clear gives nothing yet, and its row says who owes it.
  const built: readonly string[] = AREAS.map((a) => a.id);
  for (const id of PLANNED) ok(!built.includes(id), `${id}: a planned row, and not yet an area (once its first map lists it in AREAS, it leaves PLANNED)`);
  const order = (id: string): number => ATLAS.areas.find((a) => a.id === id)?.order ?? Infinity;
  const road: readonly { id: RegionId | (typeof PLANNED)[number]; area?: Area }[] = [...AREAS.map((a) => ({ id: a.id, area: a as Area })), ...PLANNED.map((id) => ({ id }))]
    .sort((a, b) => order(a.id) - order(b.id));
  road.forEach(({ id, area }, i) => {
    const row = CURVE[id], maps = area?.maps ?? [];
    const [lo, hi] = row.band;
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
    const groups = maps.flatMap((d) => d.encounters ?? []);
    const placed = groups.flatMap((e) => e.monsters.map((m) => MONSTERS[m]));
    // The area's guild quests pay too, counted with the area whose file holds them.
    const guild = area?.guilds ?? [];
    const xp = Math.floor((placed.reduce((t, m) => t + m.xp, 0) + guild.reduce((t, q) => t + (q.pay.xp ?? 0), 0)) / MEMBERS);
    const features = maps.flatMap((d) => d.features ?? []);
    // A hand-in's reward, once an item: of two people who take it, the larger.
    const rewards = new Map<string, number>();
    for (const f of features) if (f.kind === 'npc') for (const q of handIns(f)) rewards.set(q.item, Math.max(rewards.get(q.item) ?? 0, q.reward));
    const gold = placed.reduce((t, m) => t + (m.gold[0] + m.gold[1]) / 2, 0)
      + features.reduce((t, f) => t + (giftOf(f)?.gold ?? 0), 0) + [...rewards.values()].reduce((t, r) => t + r, 0)
      + guild.reduce((t, q) => t + (q.pay.gold ?? 0), 0);
    budget(id, 'xp a member', xp, xpBudget(row), row.owed, row.owed?.xp);
    budget(id, 'gold', Math.floor(gold), goldBudget(row), row.owed, row.owed?.gold);

    // Every monster's level: at least 1, and within two of the band of every map that places it.
    for (const d of maps) {
      if (!d.encounters?.length) continue;
      const [a, b] = d.band ?? [1, 0];
      const kinds = [...new Set(d.encounters.flatMap((e) => e.monsters))];
      const astray = kinds.filter((mid) => { const l = MONSTERS[mid].level; return !(Number.isInteger(l) && l >= 1 && l >= a - 2 && l <= b + 2); });
      ok(!astray.length, `${d.id}: its ${kinds.length} monsters' levels sit in ${a}-${b}, give or take two${astray.length ? `; not ${astray.map((m) => `${m} (${MONSTERS[m].level})`).join(', ')}` : ''}`);
      // Rising: a group's level (its monsters' mean) goes with its walking steps from the way in,
      // the nearest group is near the floor, and the hardest near the top. The hardest need not be
      // the farthest: Thornmark's farthest, the lake, is a middling group.
      const steps = stepsFrom(d);
      const at = d.encounters.map((e) => ({ id: e.id, steps: steps(e.x, e.y), level: e.monsters.reduce((t, m) => t + MONSTERS[m].level, 0) / e.monsters.length }));
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

    // The price window: no weapon, armour or shield in its chests or its monsters' drops dearer
    // than the row allows. Keys, quest items and consumables are exempt.
    const found = [
      ...features.flatMap((f) => (giftOf(f)?.items ?? []).map((it) => ({ it, from: `${f.kind} ${spentId(f)}` }))),
      ...[...new Set(placed)].flatMap((m) => (m.drops ?? []).map((x) => ({ it: x.item, from: `${m.id}'s drop` }))),
    ].filter(({ it }) => ITEMS[it].slot !== 'none' && ITEMS[it].price > 0);
    const dearer = found.filter((x) => ITEMS[x.it].price > row.price);
    for (const x of dearer) ok(false, `${id}: ${x.it} (${ITEMS[x.it].price} gold, ${x.from}) is dearer than its window's ${row.price}`);
    const dearest = found.reduce((p, x) => (ITEMS[x.it].price > ITEMS[p.it].price ? x : p), found[0]);
    if (!dearer.length && dearest) ok(true, `${id}: its dearest find, ${dearest.it} at ${ITEMS[dearest.it].price} gold, sits in its window (${row.price})`);
    // The window never narrows along the road.
    const before = road[i - 1];
    if (before) ok(row.price >= CURVE[before.id].price, `${id}: its window, ${row.price}, is no narrower than ${before.id}'s (${CURVE[before.id].price})`);
  });
}
