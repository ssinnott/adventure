// The gate check (EXPANSION §2.2, §5.2): with one road and no flags on it, the monsters are what
// turn a company back. tools/gate.ts's bot plays the premade company, dressed by the ladder, against
// every group of a map alone from full health; each map is held to its sign's band; each area pools
// its groups each at its own map's floor; each zone walks its road and warns at its way in. An
// enclave (#845) is held to its own band, out of its area's pools and day and every zone's road; the
// fixture lair beside Saltreach shows it before any area places one. Every margin is printed, each
// figure against its aim and its limit: off its aim it is listed, past its limit it fails. A figure
// past its limit the owners below are owed is reported, not failed, until it holds.
import { AREAS } from '../../src/content/index.ts';
import type { RegionId } from '../../src/content/index.ts';
import type { Area } from '../../src/content/area.ts';
import { ATLAS, MAP_DEFS, MONSTERS } from '../../src/content/index.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
import { CURVE } from '../../src/content/progression.ts';
import type { EncounterDef, Feature, MapDef } from '../../src/game/map.ts';
import { rest, MAX_LEVEL } from '../../src/game/party.ts';
import { gateFight, gateOpts, winRate, rate, SEEDS } from '../kit/fight.ts';
import { gateCompany } from '../kit/company.ts';
import { days, fightsPerRest, mendBetween } from '../kit/harness.ts';
import { mustRest, ANSWER } from '../../src/game/bot.ts';
import { ROUND_CAP } from '../kit/fight.ts';
import { stepsFrom } from '../kit/rules/curve.ts';
import { FIXTURE, LAIR, GUARDIAN } from '../kit/rules/enclave.ts';
import { featureFlags } from '../kit/rules/quests.ts';
import { groupFlags } from '../../src/game/people.ts';
import type { QuestCond } from '../../src/game/quests.ts';
import { ok, owed, asked, fxFlag } from './lib.ts';
import { GATE, landings } from '../kit/rules/gate.ts';

/** Which side of a line a figure is: inside its aim ('aim'), off it but inside its limit ('off'), past its limit ('past'). */
export type Judged = 'aim' | 'off' | 'past';
/** A figure judged by how far it misses its aim and its limit (nothing or less where it holds). */
export const judge = (missAim: number, missLimit: number): Judged => (missLimit > 1e-9 ? 'past' : missAim > 1e-9 ? 'off' : 'aim');
/** The miss of a figure that should be at least `t`, at most `t`, within [lo, hi]. */
const atLeast = (t: number) => (v: number): number => t - v;
const atMost = (t: number) => (v: number): number => v - t;
const within = ([lo, hi]: readonly [number, number]) => (v: number): number => Math.max(lo - v, v - hi);

/**
 * Seeds for fights to a rest: a day is a long run of fights, and over a hundred its mean moves by
 * a fifth of a fight with the seeds alone.
 */
const DAYS = 300;
/** Seeds for the day two under (backDay): a share of the floor's fights wants fewer than a day judged to a tenth. */
const BACK_DAYS = 100;

/**
 * An area's boss groups, those of its maps that say they are one (`EncounterDef.boss`), as the game
 * names a group, 'map:id': each is judged at its own map's floor and two levels above it, and left out
 * of its map's day. A boss whose floor leaves fewer than two levels to the cap is judged at the cap (at
 * its floor alone where the floor is the cap); and a map that holds nothing but its boss (the Heart:
 * Vask's group, or its twin the Council thins) is judged on the boss's odds, with no floor of fights to
 * pool and no day (#759).
 */
const bossesOf = (area: Pick<Area, 'maps'>): string[] =>
  area.maps.flatMap((d) => (d.encounters ?? []).filter((g) => g.boss).map((g) => `${d.id}:${g.id}`));
/** What an area is called in the check, apart from the map it shares an id with: its name on the atlas, as a zone's is. */
const nameOf = (id: string): string => {
  const area = ATLAS.areas.find((a) => a.id === id);
  if (!area) throw new Error(`the atlas names no area '${id}'`);
  return zoneName(area.name);
};

/**
 * The figures past their limits someone owes, by check: who owes each, and the figure it stood at
 * when it was owed. It is reported, not failed, and fails once it is inside its limit; it fails too if
 * it moves further from its limit than that figure, by more than a point (a tenth of a fight to a rest),
 * or if its check no longer runs.
 *
 * The 86 two-under figures owed to #18, 76 maps' and 10 areas', went with #851: from 10 every group is
 * sized for the day (docs/MONSTERS.md §4.4), and a company two under a floor won every fight of it from
 * full health, eight under from 18, so the fight measured nothing there; its day still fell to 43% to
 * 87% of the floor's. So from Saltreach's floor two under is judged by the day (`GATE.backDay`), and
 * Act I's, where two levels are a cliff by design, by the fight as before. The one day past its limit
 * when the figure came in, cairnfield_m8's (eight ravens and a tor troll, 9.29 fights to a rest two
 * under its floor, past the floor's own 8.5), went with #865: its crag group re-sized inside the floor's
 * own aims, two ravens and two tor trolls.
 */
export const OWED: Record<string, { whose: string; at: number }> = {};

const pc = (x: number): string => `${(x * 100).toFixed(1).replace(/\.0$/, '')}%`;

const used = new Set<string>();
/** The figures off their aim and inside their limit, listed at the end of the suite. */
const offAim: string[] = [];
/**
 * A check on a figure: `aim` and `limit` say how far it misses each, nothing or less where it holds.
 * Inside its aim it passes; between, it passes and is listed as off its aim; past its limit it fails.
 * Where OWED names who owes it, the figure is past its limit: the owed line, and the check that it
 * has got no worse.
 */
function check(key: string, v: number, aim: (v: number) => number, limit: (v: number) => number, msg: string, fights = false): void {
  const o = OWED[key];
  used.add(key);
  const show = (x: number): string => (fights ? x.toFixed(2) : pc(x));
  const j = judge(aim(v), limit(v));
  if (j === 'off') offAim.push(msg);
  if (!o) { ok(j !== 'past', j === 'past' ? `${msg}: past its limit` : msg); return; }
  owed(j !== 'past', msg, o.whose);
  const slack = fights ? 0.1 : 0.01;
  const held = limit(v) <= limit(o.at) + slack + 1e-9;
  const redo = held ? '' : `; if the change is meant, re-record it in OWED: '${key}': { whose: '${o.whose}', at: ${fights ? v.toFixed(2) : v.toFixed(3).replace(/\.?0+$/, '')} }`;
  ok(held, `${key}: ${show(v)}, no more than ${fights ? 'a tenth of a fight' : 'a point'} further from its limit than the ${show(o.at)} it was owed at${redo}`);
}
/** How a line reads its aim and its limit. */
const aims = (aim: string, limit: string): string => `aim ${aim}, limit ${limit}`;

/**
 * The road behind's groups on an earlier act's maps, as the game names a group, 'map:id': each waits on
 * an answer given an act later on the road, so no company at its map's floor meets it, and the gate
 * leaves it out of its map and its area (#765). The curve counts it, in the clear and the lead. Read
 * from the areas (#897): a group whose `after` names a flag that only a later area's maps set, in each
 * of its alternatives, as a list is any one of them (`When`).
 */
export function behindOf(areas: readonly Pick<Area, 'maps'>[]): string[] {
  const defs = areas.flatMap((a) => a.maps), at = new Map(areas.flatMap((a, i) => a.maps.map((d) => [d.id, i] as const))), setBy = new Map<string, number[]>();
  for (const d of defs) for (const f of [...(d.features ?? []).flatMap(featureFlags), ...(d.encounters ?? []).flatMap(groupFlags)]) setBy.set(f, [...(setBy.get(f) ?? []), at.get(d.id)!]);
  const later = (f: string, i: number): boolean => !!setBy.get(f)?.every((j) => j > i);
  return defs.flatMap((d) => (d.encounters ?? []).filter((g) => {
    const alts = [g.after ?? []].flat() as QuestCond[];
    return alts.length > 0 && alts.every((c) => [c.flag ?? []].flat().some((f) => later(f, at.get(d.id)!)));
  }).map((g) => `${d.id}:${g.id}`));
}
const BEHIND: readonly string[] = behindOf(AREAS);
/** A map as a company at its floor finds it: the road behind's groups left out (BEHIND). */
const beforeBehind = (d: MapDef): MapDef =>
  d.encounters?.some((g) => BEHIND.includes(`${d.id}:${g.id}`)) ? { ...d, encounters: d.encounters.filter((g) => !BEHIND.includes(`${d.id}:${g.id}`)) } : d;
/** The two groups nearest a zone's way in, as a company first finds it: none that waits on an `after`. */
export const nearestWayIn = (groups: readonly EncounterDef[], steps: (x: number, y: number) => number): EncounterDef[] =>
  groups.filter((g) => !g.after).sort((a, b) => steps(a.x, a.y) - steps(b.x, b.y)).slice(0, 2);
/**
 * A den's reading at a level: its keepers' win rate against each of its brood groups', how many
 * brood it keeps abroad and at what pace. Its fault, if any: keepers won more often than a brood
 * group, when they are to be the camp's hardest fight. The gate has no clock, so the pace is shown,
 * never judged; each brood group is one of the map's fights already.
 */
export function denReading(def: MapDef, den: Extract<Feature, { kind: 'den' }>, level: number): { line: string; fault: string } {
  const group = (id: string): EncounterDef | undefined => def.encounters?.find((e) => e.id === id);
  const keepers = group(den.keepers), brood = den.brood.map(group).filter((e): e is EncounterDef => !!e);
  if (!keepers) return { line: `${def.id}'s den ${den.id}: no keepers`, fault: 'no keepers' };
  const k = rate(keepers, level), harder = brood.filter((b) => rate(b, level) < k);
  const paces = [...new Set(brood.map((b) => b.respawn ?? 0))].join('/');
  const line = `${def.id}'s den ${den.id} at ${level}: its keepers won ${pc(k)}, its ${brood.length} brood ${brood.map((b) => pc(rate(b, level))).join(', ')}, one back each ${paces} minutes`;
  return { line, fault: harder.length ? `brood harder than the keepers: ${harder.map((b) => b.id).join(', ')}` : '' };
}
const pooled = (groups: readonly EncounterDef[], level: number): number => groups.reduce((t, g) => t + rate(g, level), 0) / groups.length;
const mean = (v: readonly number[]): number => v.reduce((t, x) => t + x, 0) / v.length;
/**
 * An area's pools: every group of its maps fought at its own map's floor (through), and two levels
 * under a floor (back): a zone map's own, and for a town or dungeon the area's, as the owner ruled
 * on #209 and #40. The through is null where the area has no groups, and the back where no group has
 * a company two under (under level 1), or where `back` is not asked for: from `GATE.dayFrom` the area
 * two under is its day.
 */
export function areaPools(maps: readonly MapDef[], areaFloor: number, r: (g: EncounterDef, level: number) => number = rate, back = true): { through: number | null; back: number | null; groups: number; under: number } {
  const at: number[] = [], low: number[] = [];
  for (const d of maps) {
    if (!d.encounters?.length || !d.band) continue;
    const under = (d.kind === 'outdoor' ? d.band[0] : areaFloor) - GATE.under;
    for (const g of d.encounters) { at.push(r(g, d.band[0])); if (back && under >= 1) low.push(r(g, under)); }
  }
  return { through: at.length ? mean(at) : null, back: low.length ? mean(low) : null, groups: at.length, under: low.length };
}
/** A zone's name in the check's lines, 'the Foreland' for 'The Foreland'. */
const zoneName = (name: string): string => name.replace(/^The /, 'the ');
const median = (v: readonly number[]): number => { const s = [...v].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

/**
 * A map at its floor through, two levels under it back (or n/a, where that is under level 1). Two
 * under is asked of a map alone only where `judgeUnder` says: where its floor is its area's, or where
 * it pays outside the area's budget (`Area.outside`), out of the area's pools. A map with
 * a higher floor is held at its floor alone, and its groups count two under in the area's pool
 * (`areaPools`; the owner's decisions on #40, 28 September, and #209, 29 September). From
 * `GATE.dayFrom` the map two under is judged by its day instead (`underDay`), and its fights are not.
 */
function margins(id: string, groups: readonly EncounterDef[], [floor]: readonly [number, number], judgeUnder = true, areaByDay = false): void {
  if (!groups.length) { console.log(`  n/a:  ${id} has no groups yet`); return; }
  const at = pooled(groups, floor);
  check(`${id}: floor`, at, atLeast(GATE.through.aim), atLeast(GATE.through.limit), `${id} at its floor, ${floor}: ${pc(at)} of fights won (${aims(pc(GATE.through.aim), pc(GATE.through.limit))})`);
  if (!judgeUnder && areaByDay) { console.log(`  n/a:  ${id} ${GATE.under} under its floor: its floor is above its area's, so its groups count in the area's day, two under the area's floor`); return; }
  if (!judgeUnder) { console.log(`  n/a:  ${id} ${GATE.under} under its floor: its floor is above its area's, so its groups count two under in the area's pool (a zone map's under its own floor, a town's or dungeon's under the area's), where they have a company`); return; }
  const low = floor - GATE.under;
  if (low < 1) { console.log(`  n/a:  ${id} ${GATE.under} under its floor: level ${low} is no company`); return; }
  if (floor >= GATE.dayFrom) return;
  const under = pooled(groups, low);
  check(`${id}: under`, under, atMost(GATE.back.aim), atMost(GATE.back.limit), `${id} ${GATE.under} under its floor, at ${low}: ${pc(under)} won (at most: ${aims(pc(GATE.back.aim), pc(GATE.back.limit))})`);
}

/** A day two under a floor as a share of the floor's fights to a rest (harness's fightsPerRest). */
export const dayShare = (fights: number, floor: number): number => fights / fightsPerRest(floor);
/**
 * Two under a floor from `GATE.dayFrom`, by the day (#851): a company two levels under it fights the
 * groups, dealt, to a rest, as harness's day does, and its fights are judged as a share of the floor's.
 * There a fight from full health is won from well under the floor; the day still slopes.
 */
function underDay(key: string, groups: readonly EncounterDef[], floor: number, what: string): void {
  const low = floor - GATE.under, day = days(low, groups, BACK_DAYS, 1, true), share = dayShare(day.fights, floor);
  check(`${key}: under day`, share, atMost(GATE.backDay.aim), atMost(GATE.backDay.limit),
    `${what}, at ${low}: ${day.fights.toFixed(2)} fights to a rest, ${pc(share)} of the floor's ${fightsPerRest(floor)} (at most: ${aims(pc(GATE.backDay.aim), pc(GATE.backDay.limit))})`);
}

/** A map the gate judges: one with groups and a band. */
type Fought = MapDef & { band: [number, number] };

/**
 * An area's maps as the gate takes them: those it fights (groups and a band, the road behind's left
 * out), those its pools take, and its day's groups, every pooled group but a boss. A map outside the
 * area's budget (`Area.outside`) or an enclave (`MapDef.enclave`, #845) is its own (`own`): judged
 * alone at its own floor and two under it, and left out of the area's pools and day. An enclave is
 * no zone's map, so no zone's road walks it, and its guardian's odds are judged at its own floor.
 */
export function gateMaps(area: Pick<Area, 'maps' | 'outside'>, bosses: readonly string[]): { fought: Fought[]; own: (d: MapDef) => boolean; pooled: Fought[]; daily: EncounterDef[] } {
  const fought = area.maps.map(beforeBehind).filter((d): d is Fought => !!d.encounters?.length && !!d.band);
  const outside = new Set<string>(area.outside ?? []), own = (d: MapDef): boolean => outside.has(d.id) || !!d.enclave;
  const pooled = fought.filter((d) => !own(d));
  return { fought, own, pooled, daily: pooled.flatMap((d) => d.encounters!.filter((g) => !bosses.includes(`${d.id}:${g.id}`))) };
}

/**
 * A map against its sign: its groups at its floor, and two under it where that is asked of the map
 * alone, its floor its area's or the map its own (`gateMaps`); its bosses' odds at its floor and two
 * above; its dens; and its fights to a rest, and two under by the day from `GATE.dayFrom`.
 */
function judgeMap(d: Fought, areaFloor: number, bosses: readonly string[], own: boolean): void {
  const groups = d.encounters!;
  // A map of nothing but its boss is judged on the boss's odds below, not on a floor or a day (#759).
  const bossOnly = groups.every((g) => bosses.includes(`${d.id}:${g.id}`));
  if (bossOnly) console.log(`  n/a:  ${d.id} at its floor and its fights to a rest: its every group is a boss, judged on its odds`);
  // Two under is asked of the map alone where its floor is its area's, or where it is its own.
  const alone = d.band[0] === areaFloor || own;
  if (!bossOnly) margins(d.id, groups, d.band, alone, areaFloor >= GATE.dayFrom);
  for (const b of bosses.filter((ref) => ref.startsWith(`${d.id}:`))) {
    const boss = groups.find((e) => `${d.id}:${e.id}` === b);
    if (!boss) continue;
    const at = rate(boss, d.band[0]);
    // The sentries' lever (#752): Vask's own group with the clock let run (the bots take the called first) is
    // won a quarter to a third of the time, the plan's figure, which holds only on the sentries at 890 (`MonsterDef.offLine`).
    if (b === 'core:core_vask') {
      const run = winRate(d.band[0], boss, SEEDS, ROUND_CAP, gateOpts(boss), { answer: { ...ANSWER, clock: 'called' } });
      ok(run >= 0.2 && run <= 0.45, `${b}: the clock let run at ${d.band[0]}: ${pc(run)} won (the plan's quarter to a third, on the sentries at 890: 20% to 45%)`);
    }
    check(`${b}: floor`, at, within(GATE.boss.aim), within(GATE.boss.limit), `${d.id}'s boss ${boss.id} at ${d.band[0]}: ${pc(at)} won (${aims(`${pc(GATE.boss.aim[0])} to ${pc(GATE.boss.aim[1])}`, `${pc(GATE.boss.limit[0])} to ${pc(GATE.boss.limit[1])}`)})`);
    // The company two above the floor, or at the cap where that is as high as it goes (a boss at 31 meets 32);
    // a boss at the cap itself is judged at its floor alone (#759).
    const top = Math.min(d.band[0] + GATE.under, MAX_LEVEL);
    if (top === d.band[0]) { console.log(`  n/a:  ${d.id}'s boss ${boss.id} above its floor: no company stands past the cap, ${MAX_LEVEL}`); continue; }
    const above = rate(boss, top);
    check(`${b}: above`, above, atLeast(GATE.bossAbove.aim), atLeast(GATE.bossAbove.limit), `${d.id}'s boss ${boss.id} at ${top}: ${pc(above)} won (${aims(pc(GATE.bossAbove.aim), pc(GATE.bossAbove.limit))})`);
  }
  // Its dens: the keepers the camp's hardest fight, and its brood's number and pace.
  for (const f of d.features ?? []) if (f.kind === 'den') { const r = denReading(d, f, d.band[0]); ok(!r.fault, `${r.line}${r.fault ? ` (${r.fault})` : ''}`); }
  // Fights to a rest are harness's measure: its thrifty bot, its outfitted company, its round cap.
  // A boss is judged on its odds above, not on the day (MONSTERS.md §4.4), so the day leaves it out
  // (the owner's decision on #40, 28 September).
  if (bossOnly) return;
  const daily = groups.filter((g) => !bosses.includes(`${d.id}:${g.id}`));
  const day = days(d.band[0], daily, DAYS, 1, true), want = fightsPerRest(d.band[0]);
  const around = (e: readonly [number, number]): [number, number] => [want - e[0], want + e[1]], range = ([lo, hi]: [number, number]): string => `${lo} to ${hi}`;
  check(`${d.id}: rest`, day.fights, within(around(GATE.perRest.aim)), within(around(GATE.perRest.limit)), `${d.id} at ${d.band[0]}: ${day.fights.toFixed(2)} fights to a rest (${aims(range(around(GATE.perRest.aim)), range(around(GATE.perRest.limit)))}); ${pc(day.why.long)} of days end in a fight broken off`, true);
  // From dayFrom, two under the floor by the day, where two under is asked of the map alone.
  if (alone && d.band[0] >= GATE.dayFrom) underDay(d.id, daily, d.band[0], `${d.id} ${GATE.under} under its floor`);
}

/** The road from the way in: every fight won, mending between and resting whole where the company must. */
function road(groups: readonly EncounterDef[], level: number): number {
  let walked = 0;
  for (let k = 1; k <= SEEDS; k++) {
    const p = gateCompany(level, k);
    const won = groups.every((g, f) => {
      if (!gateFight(p, g, k * 104729 + f, ROUND_CAP, gateOpts(g))) return false;
      mendBetween(p);
      if (mustRest(p)) for (const m of p.members) rest(m);
      return true;
    });
    if (won) walked++;
  }
  return walked / SEEDS;
}

/**
 * The gate's parts (#954), each a run of its own (`node tools/test.ts gate:kilns`) and under `--jobs` a
 * process of its own: `fixed`, the blocks that hold the gate's own workings and the tables' checks (the
 * bot's, its company's and the walk's are the `gatebot` suite's, #1016), then one to each area the run
 * asks for (tools/test.ts --areas, --since), the enclave's fixture with Saltreach's, whose pools it
 * reads. Each lists its own figures off their aim and holds its own owed entries.
 */
export const parts = (): string[] => ['fixed', ...AREAS.filter((a) => asked(a.id)).map((a) => a.id)];

/** The gate, or one part of it; whole, its parts one after another. */
export function gate(part?: string): void {
  if (part === undefined) { for (const p of parts()) gate(p); return; }
  const area = AREAS.find((a) => a.id === part);
  if (part === 'fixed') fixed();
  else if (area) judgeArea(area.id);
  else throw new Error(`the gate has no part named ${part}`);
  if (offAim.length) console.log(`\n  Off their aim, inside their limits (${offAim.length}):\n${offAim.map((l) => `    ${l}`).join('\n')}`);
  offAim.length = 0;
  // An owed entry is the part's whose names its key starts with, an area's or, naming none, the fixed part's.
  const stale = Object.keys(OWED).filter((k) => !used.has(k) && ownerOf(k) === area?.id);
  ok(!stale.length, `every owed entry names a check that ran${stale.length ? ` (not: ${stale.join(', ')})` : ''}`);
}

/** The area an owed entry's key names: by its own name, a zone's or a map's, the fixture lair's Saltreach's. */
const ownerOf = (key: string): string | undefined => AREAS.find((a) =>
  [nameOf(a.id), ...a.atlas.zones.map((z) => zoneName(z.name)), ...a.maps.map((d) => d.id), ...(a.id === FIXTURE.area ? [LAIR.id] : [])].some((p) => key.startsWith(`${p}:`)))?.id;

/** The fixed part: the gate's own workings on fixtures, and the tables' checks; the bot's own are gatebot's (#1016). */
function fixed(): void {
  // A figure inside its aim passes; one between its aim and its limit passes and is listed; one past
  // its limit fails. Probed either side of whatever the aim and the limit are, so the pilot may move them.
  {
    const { aim: a, limit: l } = GATE.through;
    const at = (v: number): Judged => judge(atLeast(a)(v), atLeast(l)(v));
    const want = 6.5, [ra, rl] = [GATE.perRest.aim, GATE.perRest.limit].map(([lo, hi]) => [want - lo, want + hi] as [number, number]);
    const rest = (v: number): Judged => judge(within(ra)(v), within(rl)(v));
    ok(at((a + 1) / 2) === 'aim' && at((a + l) / 2) === 'off' && at(l / 2) === 'past' && rest(want) === 'aim' && rest((ra[0] + rl[0]) / 2) === 'off' && rest(rl[1] + 1) === 'past',
      `a figure is judged inside its aim, off it or past its limit (${pc(a)} and ${pc(l)} through; ${ra.join(' to ')} and ${rl.join(' to ')} fights to a rest)`);
    // A figure off its aim is listed at the end of the suite, one inside it is not.
    const before = offAim.length, key = 'fixture: floor', off = `the fixture at its floor: ${pc((a + l) / 2)} (off its aim)`;
    check(key, (a + l) / 2, atLeast(a), atLeast(l), off);
    check(key, (a + 1) / 2, atLeast(a), atLeast(l), 'the fixture at its floor, inside its aim');
    ok(offAim.length === before + 1 && offAim[before] === off, 'a figure off its aim is listed, and one inside it is not');
    offAim.splice(before);
    // And two under a floor from dayFrom, by the day, probed at a floor past it: a day a tenth of a fight
    // past two thirds of the floor's is listed and passes, and one a tenth past the floor's own fails.
    const { aim: da, limit: dl } = GATE.backDay, floor = GATE.dayFrom + 10, perRest = fightsPerRest(floor);
    const share = (fights: number): Judged => judge(atMost(da)(dayShare(fights, floor)), atMost(dl)(dayShare(fights, floor)));
    const pastAim = perRest * da + 0.1, pastLimit = perRest * dl + 0.1;
    const listed = `the fixture ${GATE.under} under its floor, ${floor}: ${pastAim.toFixed(2)} fights to a rest of the floor's ${perRest} (off its aim)`;
    check('fixture: under day', dayShare(pastAim, floor), atMost(da), atMost(dl), listed);
    ok(share((perRest * da) / 2) === 'aim' && share(pastAim) === 'off' && offAim.length === before + 1 && offAim[before] === listed && share(pastLimit) === 'past',
      `a day two under a floor is judged as a share of the floor's fights to a rest: ${pc(dayShare(pastAim, floor))} is off its aim of ${pc(da)}, listed and passed; ${pc(dayShare(pastLimit, floor))} is past its limit of ${pc(dl)}`);
    offAim.splice(before);
  }
  // A group that waits on an `after` is no warning at the way in.
  {
    const at = (x: number): EncounterDef => ({ id: `g${x}`, x, y: 0, monsters: ['rat'] }), line = [at(1), { ...at(2), after: { flag: fxFlag('f') } }, at(3), at(4)];
    ok(nearestWayIn(line, (x) => x).map((g) => g.id).join() === 'g1,g3', 'the groups nearest the way in skip one that comes only after a step');
    // A den's keepers are its camp's hardest fight: won no more often than any of its brood.
    const den: Extract<Feature, { kind: 'den' }> = { kind: 'den', x: 1, y: 1, id: 'd', text: '', breeds: ['rat'], keepers: 'k', brood: ['b'], ask: '', burn: '', burnt: '', gold: 0, items: [] };
    const camp = (keep: string[], brood: string[]): MapDef => ({ id: 'dens', name: '', kind: 'outdoor', start: { x: 0, y: 0, facing: 0 }, rows: [], features: [den], encounters: [{ id: 'k', x: 2, y: 1, monsters: keep, roams: false }, { id: 'b', x: 5, y: 1, monsters: brood, respawn: 1440 }] });
    const three = ['smuggler_captain', 'smuggler_captain', 'smuggler_captain'], fair = denReading(camp(three, ['rat']), den, 1), wrong = denReading(camp(['rat'], three), den, 1);
    ok(!fair.fault && wrong.fault.includes('b'), `a den whose brood is harder than its keepers is caught (${fair.line}; ${wrong.fault})`);
    // An area whose second zone rises above its first: each map is judged at its own floor, so it
    // holds its aims where each holds, and misses them where one does not, at its floor or two under it.
    const box = (id: string, band: [number, number], ...groups: string[][]): MapDef => ({ id, name: '', kind: 'outdoor', band, start: { x: 0, y: 0, facing: 0 }, rows: [], encounters: groups.map((monsters, i) => ({ id: `${id}${i}`, x: i, y: 0, monsters })) });
    // A dungeon of three rats at 3-4 counts two under the area's floor, where no group has a company:
    // judged two under its own floor instead, it would be won at 1 and pull the back over its aim.
    const lower = box('low', [1, 3], ['rat', 'rat', 'rat']), wolves = box('mid', [3, 4], ['dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf']);
    const cellar: MapDef = { ...box('cellar', [3, 4], ['rat', 'rat', 'rat']), kind: 'dungeon' };
    const band = (top: string[]): MapDef[] => [lower, wolves, cellar, box('top', [4, 5], top)];
    const held = areaPools(band([...new Array(11).fill('brigand'), 'brigand_archer']), 1);
    const once = pooled(band([...new Array(11).fill('brigand'), 'brigand_archer']).flatMap((d) => d.encounters!), 1);
    const hard = areaPools(band(['ashen_hand', 'ashen_adept', 'ashen_adept']), 1), soft = areaPools(band(['rat', 'rat', 'rat']), 1);
    ok(held.through !== null && held.through >= GATE.through.aim && held.back !== null && held.back <= GATE.back.aim && once < GATE.through.aim,
      `an area whose second zone rises, with a dungeon in it, holds its aims at its maps' own floors (${pc(held.through ?? 0)} won, ${pc(held.back ?? 0)} two under), where one floor for all would miss (${pc(once)} at 1)`);
    ok(hard.through !== null && hard.through < GATE.through.aim && soft.back !== null && soft.back > GATE.back.aim,
      `and misses its aim where one map does not hold: too hard at its floor (${pc(hard.through ?? 0)}), or too soft two under it (${pc(soft.back ?? 0)})`);
    ok(areaPools([], 1).through === null, 'an area with no groups has no figure to judge');
  }
  // The road behind's groups (BEHIND): each names a group of a built map that waits on an `after`, so no
  // group a company at its floor can meet is left out; and leaving them out drops that group alone.
  const unbehind = BEHIND.filter((ref) => { const [map, id] = ref.split(':'); return !MAP_DEFS.find((d) => d.id === map)?.encounters?.find((e) => e.id === id)?.after; });
  ok(!unbehind.length, `every group BEHIND leaves out is a built map's and waits on an after${unbehind.length ? ` (not: ${unbehind.join(', ')})` : ''}`);
  {
    const said = (id: string, sets: string): Feature => ({ kind: 'event', x: 1, y: 1, id, text: 'Fixture.', once: true, sets: fxFlag(sets) });
    const group = (id: string, after?: EncounterDef['after']): EncounterDef => ({ id, x: 1, y: 1, monsters: ['knocker'], ...(after ? { after } : {}) });
    const early: MapDef = { id: 'fx_early', name: '', kind: 'dungeon', start: { x: 0, y: 0, facing: 0 }, rows: [], features: [said('fx_now', 'fx_now')],
      encounters: [group('fx_late', { flag: fxFlag('fx_then') }), group('fx_either', [{ flag: fxFlag('fx_then') }, { flag: fxFlag('fx_now') }]), group('fx_free')] };
    const later: MapDef = { ...early, id: 'fx_later', features: [said('fx_then', 'fx_then')], encounters: [] };
    ok(behindOf([{ maps: [early] }, { maps: [later] }]).join() === 'fx_early:fx_late',
      'a group is behind when each of its after\'s alternatives waits on a flag only a later area sets, and met when one waits on its own area\'s or it waits on none (#897)');
  }
  const fx: MapDef = { id: 'deep_mines3', name: '', kind: 'dungeon', start: { x: 0, y: 0, facing: 0 }, rows: [], encounters: [
    { id: 'ud_mines', x: 1, y: 1, monsters: ['knocker'], after: { flag: fxFlag('fx_open') } }, { id: 'fx_kept', x: 2, y: 1, monsters: ['knocker'] }] };
  const ids = (d: MapDef): string => (d.encounters ?? []).map((g) => g.id).join();
  ok(ids(beforeBehind(fx)) === 'fx_kept' && ids(beforeBehind({ ...fx, id: 'fx_elsewhere' })) === 'ud_mines,fx_kept' && beforeBehind({ ...fx, encounters: [fx.encounters![1]] }).encounters!.length === 1,
    'leaving the road behind out drops the group BEHIND names from its map and no other: not its neighbour, nor the same id on another map');
  // An owed entry goes to the part whose check reads it (#954): by an area's name, a zone's, a map's or
  // a boss's on a map, to that area; the fixture lair's to Saltreach's; any other to this part.
  const strays = AREAS.flatMap((a) => [`${nameOf(a.id)}: floor`, ...a.atlas.zones.map((z) => `${zoneName(z.name)}: road`), ...a.maps.flatMap((d) => [`${d.id}: rest`, `${d.id}:x: floor`])]
    .filter((k) => ownerOf(k) !== a.id));
  ok(!strays.length && ownerOf(`${LAIR.id}: rest`) === FIXTURE.area && ownerOf('fx_nowhere: floor') === undefined,
    `every owed key goes to the part of the area it names, the fixture lair's to ${FIXTURE.area}'s, any other to the fixed part${strays.length ? ` (not: ${strays.join(', ')})` : ''}`);
}

/** An area's part: its maps, its pools and its zones against the curve; Saltreach's with the enclave's fixture. */
function judgeArea(only: string): void {
  for (const area of AREAS) {
    if (area.id !== only) continue;
    const id: RegionId = area.id, band = CURVE[id].band;
    const zones = area.atlas.zones.filter((z) => z.maps?.length);
    const bosses = bossesOf(area);
    const { fought, own, pooled, daily } = gateMaps(area as Area, bosses);
    /** A group by the game's name for it, 'map:id'. */
    const find = (ref: string): EncounterDef | undefined => {
      const [map, g] = ref.split(':');
      return fought.find((d) => d.id === map)?.encounters!.find((e) => e.id === g);
    };

    // Each map against its sign. A map outside the area's budget (`Area.outside`) or an enclave is its
    // own: judged two under its own floor, and left out of the area's pools (`gateMaps`).
    for (const d of fought) judgeMap(d, band[0], bosses, own(d));

    // The area against the curve: each group at its own map's floor, and two under a floor.
    const name = nameOf(id);
    const lost = [...bosses, ...zones.flatMap((z) => z.road ?? [])].filter((ref) => !find(ref));
    ok(!lost.length, `${name}: its bosses and its roads are groups of its maps${lost.length ? ` (not: ${lost.join(', ')})` : ''}`);
    const pools = areaPools(pooled, band[0], rate, band[0] < GATE.dayFrom);
    if (pools.through === null) console.log(`  n/a:  ${name} has no groups yet`);
    else check(`${name}: floor`, pools.through, atLeast(GATE.through.aim), atLeast(GATE.through.limit), `${name} at its maps' floors: ${pc(pools.through)} of its ${pools.groups} groups' fights won (${aims(pc(GATE.through.aim), pc(GATE.through.limit))})`);
    // From dayFrom, two under the area by the day: every group of its maps but a boss, dealt to a company
    // two under the area's floor.
    if (band[0] >= GATE.dayFrom) {
      if (!daily.length) console.log(`  n/a:  ${name} ${GATE.under} under its floor: it has no group but its bosses`);
      else underDay(name, daily, band[0], `${name} ${GATE.under} under its floor, its maps' groups pooled`);
    } else if (pools.back === null) console.log(`  n/a:  ${name} ${GATE.under} under its maps' floors: no group has a company there`);
    else check(`${name}: under`, pools.back, atMost(GATE.back.aim), atMost(GATE.back.limit), `${name} ${GATE.under} under its maps' floors (a town's or dungeon's, the area's ${band[0]}): ${pc(pools.back)} of ${pools.under} groups' fights won (at most: ${aims(pc(GATE.back.aim), pc(GATE.back.limit))})`);

    // Each zone: its road walked at its floor, and a warning, not a wall, at its way in.
    for (const z of zones) {
      const maps = z.maps!.map((m) => fought.find((d) => d.id === m.map)).filter((d): d is (typeof fought)[number] => !!d);
      if (!maps.length) continue;
      const zn = zoneName(z.name), floor = Math.min(...maps.map((d) => d.band[0]));
      const refs = z.road, own = new Set(z.maps!.map((m) => m.map)), astray = (refs ?? []).filter((ref) => !own.has(ref.split(':')[0]));
      ok(!!refs?.length, `${zn}: its road is named${refs?.length ? '' : ` ('${z.id}' names none)`}`);
      ok(!astray.length, `${zn}: its road runs on its own maps${astray.length ? ` (not: ${astray.join(', ')})` : ''}`);
      const way = (refs ?? []).map(find);
      if (refs?.length && way.every((g) => g)) {
        const walked = road(way as EncounterDef[], floor);
        check(`${zn}: road`, walked, atLeast(GATE.road.aim), atLeast(GATE.road.limit), `${zn} at ${floor}: its road (${refs.join(', ')}) walked ${pc(walked)} of the time (${aims(pc(GATE.road.aim), pc(GATE.road.limit))})`);
      }
      // The two groups nearest its way in are among its gentlest, a point's grace below the median of
      // its own groups so that where most groups are always won one loss in a hundred is not a wall.
      // A group that comes only after a step is not there when a company first walks in.
      // A crossing's landing on any of its maps is a way in as well, held the same way (#164).
      const level = floor - GATE.under >= 1 ? floor - GATE.under : floor;
      const mid = median(maps.flatMap((d) => d.encounters!).map((g) => rate(g, level)));
      const warn = (d: MapDef, from: { x: number; y: number }, key: string, what: string): void => {
        const near = nearestWayIn(d.encounters!, stepsFrom(d, from));
        const least = Math.min(...near.map((g) => rate(g, level)));
        check(key, least, atLeast(mid - GATE.warning.aim), atLeast(mid - GATE.warning.limit), `${zn}: the groups nearest ${what}, ${near.map((g) => `${g.id} ${pc(rate(g, level))}`).join(' and ')}, are won at ${level} about as often as its median group or more (${pc(mid)}; less ${aims(pc(GATE.warning.aim), pc(GATE.warning.limit))})`);
      };
      const first = fought.find((d) => d.id === z.maps![0].map);
      if (first?.encounters?.length) warn(first, first.start, `${zn}: warning`, 'its way in');
      for (const d of maps) for (const l of landings(MAP_DEFS, d.id)) warn(d, l, `${zn}: warning by ${l.by}`, `the ${l.by.split(' ')[0]}'s landing at ${d.id} ${l.x},${l.y}`);
    }
  }
  // The enclave (#845): the fixture lair at the cap beside Saltreach, a band-10 area. Its own: Saltreach's
  // pools and day take what they took without it, and no zone's road walks it (a road walks its zone's
  // maps, and an enclave is none). Judged at its own band as any map is: its groups at 30, two under by
  // the day, its guardian at 30 and 32. It reads Saltreach's pools, so it runs with Saltreach's.
  if (only === FIXTURE.area) {
    const salt = AREAS.find((a) => a.id === FIXTURE.area)! as Area, floor = CURVE[FIXTURE.area].band[0];
    const bosses = bossesOf(salt);
    const was = gateMaps(salt, bosses), now = gateMaps({ ...salt, maps: [...salt.maps, LAIR] }, [...bosses, GUARDIAN]);
    const ids = (gs: readonly { id: string }[]): string => gs.map((g) => g.id).join(), lair = now.fought.find((d) => d.id === LAIR.id);
    const through = (m: typeof was): number | null => areaPools(m.pooled, floor, rate, false).through;
    ok(!!lair && now.own(lair) && ids(now.pooled) === ids(was.pooled) && ids(now.daily) === ids(was.daily) && through(now) === through(was),
      `the fixture lair at 30-32 beside Saltreach is its own: Saltreach's pools take its ${was.pooled.length} maps, won ${pc(through(was) ?? 0)} at their floors, and its day its ${was.daily.length} groups, as without it`);
    // Its figures off their aim are the fixture's, not the content's to put right: said here, out of the list.
    const listed = offAim.length;
    if (lair) judgeMap(lair, floor, [GUARDIAN], now.own(lair));
    for (const line of offAim.splice(listed)) console.log(`  info: the fixture lair, off its aim: ${line}`);
  }
}
