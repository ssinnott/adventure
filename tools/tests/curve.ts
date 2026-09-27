// The curve (EXPANSION §5.2), area by area, against its row in src/content/progression.ts: its band
// is the atlas's, three quarters of a clear's xp reaches the next area's floor, a clear's gold
// trains the party through the band, every monster's level sits in its maps' bands and rises from
// the way in to the far end, and no chest or drop is dearer than the area's window. What a row
// says is owed is reported, not failed, until it holds.
import { AREAS, ATLAS, MAP_DEFS, MONSTERS, ITEMS } from '../../src/content/index.ts';
import type { RegionId } from '../../src/content/index.ts';
import { CURVE, MEMBERS, xpBudget, goldBudget } from '../../src/content/progression.ts';
import type { AreaCurve } from '../../src/content/progression.ts';
import { GameMap } from '../../src/game/map.ts';
import type { MapDef } from '../../src/game/map.ts';
import { areaBand } from '../../src/game/atlas.ts';
import { ok, owed } from './lib.ts';

/**
 * Walking steps from a map's way in (its start) to every cell, given keys and secrets, through no
 * tree or rock: Infinity where the party cannot walk.
 */
export function stepsFrom(def: MapDef): (x: number, y: number) => number {
  const m = new GameMap(def);
  const steps = new Map<number, number>([[def.start.y * m.width + def.start.x, 0]]);
  const queue = [[def.start.x, def.start.y]];
  for (let i = 0; i < queue.length; i++) {
    const [x, y] = queue[i]; const n = steps.get(y * m.width + x)!;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const [nx, ny] = [x + dx, y + dy]; const k = ny * m.width + nx;
      if (!m.inBounds(nx, ny) || steps.has(k) || m.passable(nx, ny, { swim: true, climb: true, keys: 1 }) === 'wall') continue;
      if (m.at(nx, ny).solid === 'tree' || m.at(nx, ny).solid === 'rock') continue;
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

export function curve(): void {
  AREAS.forEach((area, i) => {
    const id: RegionId = area.id, row = CURVE[id];
    const [lo, hi] = row.band;
    // The band: the atlas's, holding every map's, and the next floor the next area's.
    const atlas = areaBand(ATLAS, MAP_DEFS, id);
    ok(!!atlas && atlas[0] === lo && atlas[1] === hi, `${id}: its band ${lo}-${hi} is the atlas's (${atlas?.join('-') ?? 'none'})`);
    for (const d of area.maps) ok(!!d.band && d.band[0] >= lo && d.band[1] <= hi, `${id}: ${d.id}'s band ${d.band?.join('-') ?? 'none'} sits in ${lo}-${hi}`);
    const later = AREAS[i + 1];
    const order = ATLAS.areas.find((a) => a.id === id)?.order;
    const next = later ? CURVE[later.id].band[0] : ATLAS.areas.find((a) => order !== undefined && a.order === order + 1)?.band?.[0];
    ok(row.next === next, `${id}: the next floor, ${row.next}, is the next area's (${next ?? 'none'})`);

    // What a clear gives: every group once, a member's share of the xp summed; the gold in cash.
    const groups = area.maps.flatMap((d) => d.encounters ?? []);
    const placed = groups.flatMap((e) => e.monsters.map((m) => MONSTERS[m]));
    const xp = Math.floor(placed.reduce((t, m) => t + m.xp, 0) / MEMBERS);
    const features = area.maps.flatMap((d) => d.features ?? []);
    const gold = placed.reduce((t, m) => t + (m.gold[0] + m.gold[1]) / 2, 0)
      + features.reduce((t, f) => t + (f.kind === 'chest' ? f.gold : f.kind === 'npc' && f.quest ? f.quest.reward : 0), 0);
    budget(id, 'xp a member', xp, xpBudget(row), row.owed, row.owed?.xp);
    budget(id, 'gold', Math.floor(gold), goldBudget(row), row.owed, row.owed?.gold);

    // Every monster's level: at least 1, and within two of the band of every map that places it.
    for (const d of area.maps) {
      if (!d.encounters?.length) continue;
      const [a, b] = d.band ?? [1, 0];
      const kinds = [...new Set(d.encounters.flatMap((e) => e.monsters))];
      const astray = kinds.filter((mid) => { const l = MONSTERS[mid].level; return !(Number.isInteger(l) && l >= 1 && l >= a - 2 && l <= b + 2); });
      ok(!astray.length, `${d.id}: its ${kinds.length} monsters' levels sit in ${a}-${b}, give or take two${astray.length ? `; not ${astray.map((m) => `${m} (${MONSTERS[m].level})`).join(', ')}` : ''}`);
      // Rising: a group's level (its monsters' mean) goes with its walking steps from the way in,
      // and the nearest group is near the floor.
      const steps = stepsFrom(d);
      const at = d.encounters.map((e) => ({ id: e.id, steps: steps(e.x, e.y), level: e.monsters.reduce((t, m) => t + MONSTERS[m].level, 0) / e.monsters.length }));
      const lost = at.filter((g) => !Number.isFinite(g.steps));
      ok(!lost.length, `${d.id}: its ${at.length} groups can be walked to from the way in${lost.length ? `; not ${lost.map((g) => g.id).join(', ')}` : ''}`);
      const walked = at.filter((g) => Number.isFinite(g.steps));
      const rho = rankCorrelation(walked.map((g) => g.steps), walked.map((g) => g.level));
      ok(rho >= 0, `${d.id}: its groups' levels rise from the way in (rank correlation ${rho.toFixed(2)})`);
      const nearest = walked.reduce((p, g) => (g.steps < p.steps ? g : p));
      ok(nearest.level <= a + 2, `${d.id}: the nearest group, ${nearest.id} at ${nearest.steps} steps, is near the floor ${a} (level ${nearest.level.toFixed(1)})`);
    }

    // The price window: no weapon, armour or shield in its chests or its monsters' drops dearer
    // than the row allows. Keys, quest items and consumables are exempt.
    const found = [
      ...features.flatMap((f) => (f.kind === 'chest' ? f.items.map((it) => ({ it, from: `chest ${f.id}` })) : [])),
      ...[...new Set(placed)].flatMap((m) => (m.drops ?? []).map((x) => ({ it: x.item, from: `${m.id}'s drop` }))),
    ].filter(({ it }) => ITEMS[it].slot !== 'none' && ITEMS[it].price > 0);
    const dearest = found.reduce((p, x) => (ITEMS[x.it].price > ITEMS[p.it].price ? x : p), found[0]);
    for (const x of found) if (ITEMS[x.it].price > row.price) ok(false, `${id}: ${x.it} (${ITEMS[x.it].price} gold, ${x.from}) is dearer than its window's ${row.price}`);
    if (dearest) ok(ITEMS[dearest.it].price <= row.price, `${id}: its dearest find, ${dearest.it} at ${ITEMS[dearest.it].price} gold, sits in its window (${row.price})`);
  });
}
