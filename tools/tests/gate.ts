// The gate check (EXPANSION §2.2, §5.2): with one road and no flags on it, the monsters are what
// turn a company back. tools/gate.ts's bot plays the premade company, dressed by the ladder, against
// every group of a map alone from full health; each map is held to its sign's band; each area pools
// its groups each at its own map's floor; each zone walks its road and warns at its way in.
// Every margin is printed, each figure against its aim and its limit: off its aim it is listed, past
// its limit it fails. A figure past its limit the owners below are owed is reported, not failed,
// until it holds.
import { AREAS } from '../../src/content/index.ts';
import type { RegionId } from '../../src/content/index.ts';
import { ATLAS, MAP_DEFS } from '../../src/content/index.ts';
import { CURVE } from '../../src/content/progression.ts';
import type { EncounterDef, Feature, MapDef } from '../../src/game/map.ts';
import { rest } from '../../src/game/party.ts';
import { gateCompany, gateFight, gateOpts, winRate } from '../gate.ts';
import { days, fightsPerRest, mendBetween, mustRest, ROUND_CAP } from '../harness.ts';
import { testMonster } from '../testmonster.ts';
import { stepsFrom } from './curve.ts';
import { ok, owed } from './lib.ts';

/**
 * Each figure's aim, and its limit beyond it (#273): a figure inside its aim passes; one between its
 * aim and its limit passes and is listed as off its aim; one past its limit fails. The pilot weighed
 * them on every box of the Downs and moved none (#47, docs/areas/shelf.md §8).
 */
export const GATE = {
  /** At the floor, the share of the fights won: through. At least. */
  through: { aim: 0.9, limit: 0.8 },
  /** Two levels under the floor, the share won: back. At most. */
  back: { aim: 0.25, limit: 0.9 },
  /** At the floor, the share of companies that walk the zone's road. At least. */
  road: { aim: 0.8, limit: 0.65 },
  /** The boss at its map's floor: about half. Within. */
  boss: { aim: [0.3, 0.7], limit: [0.2, 0.8] } as { aim: readonly [number, number]; limit: readonly [number, number] },
  /** The boss two levels above its map's floor: nearly always. At least. */
  bossAbove: { aim: 0.9, limit: 0.75 },
  /** How far fights to a rest may fall under and rise over harness's fightsPerRest: 5.5 to 7.5, and 4 to 10, at 6.5. */
  perRest: { aim: [1, 1], limit: [2.5, 3.5] } as { aim: readonly [number, number]; limit: readonly [number, number] },
  /** How far under its zone's median group the groups nearest its way in may be won. */
  warning: { aim: 0.01, limit: 0.1 },
  /** How far below its floor a company is held back. */
  under: 2,
};

/** Which side of a line a figure is: inside its aim ('aim'), off it but inside its limit ('off'), past its limit ('past'). */
export type Judged = 'aim' | 'off' | 'past';
/** A figure judged by how far it misses its aim and its limit (nothing or less where it holds). */
export const judge = (missAim: number, missLimit: number): Judged => (missLimit > 1e-9 ? 'past' : missAim > 1e-9 ? 'off' : 'aim');
/** The miss of a figure that should be at least `t`, at most `t`, within [lo, hi]. */
const atLeast = (t: number) => (v: number): number => t - v;
const atMost = (t: number) => (v: number): number => v - t;
const within = ([lo, hi]: readonly [number, number]) => (v: number): number => Math.max(lo - v, v - hi);

/** Seeds a cell, as tools/gate.ts's table has it. */
const SEEDS = 100;
/**
 * Seeds for fights to a rest: a day is a long run of fights, and over a hundred its mean moves by
 * a fifth of a fight with the seeds alone.
 */
const DAYS = 300;

/**
 * The boss groups, by the zone they are met from (a dungeon's under the zone it opens from), as the
 * game names a group, 'map:id': each is judged at its own map's floor and two levels above it, and
 * left out of its map's day. An area's are all its zones' together.
 */
export const BOSSES: Record<string, readonly string[]> = {
  shelf: ['greywater1:gw1_captain', 'greywater2:gw2_deacon'],
  downs: ['mill:m_warden', 'berth:berth_captain'],
  thornmark: ['grove2:g2_hand', 'grove2:g2_warden'],
  deepthorn: ['deepthorn_j5:j5_eldest'],
  wrackholm: ['smugglers_cove2:kh2_great_devilfish', 'tide_ship_rift:tide_ship_rift_warden'],
};

/** Each zone's road: the groups met on it, in order, from its way in. Every zone with groups names one. */
export const ROADS: Record<string, readonly string[]> = {
  shelf: ['shelf:road_rats', 'shelf:hill_wolves'],
  downs: ['downs_f2:f2_bandits'],
  thornmark: ['thornmark:tm_wolves1', 'thornmark:tm_brigands2', 'thornmark:tm_hounds', 'thornmark:tm_zealots'],
  deepthorn: ['deepthorn_h3:h3_brambles', 'deepthorn_h3:h3_rootwalkers'],
  wrackholm: ['wrackholm_e6:e6_rats', 'wrackholm_e6:e6_gulls_inlet', 'wrackholm_e6:e6_path_east'],
  eaves: ['eaves_i2:i2_bears1', 'eaves_i2:i2_bears2', 'eaves_j2:j2_bears', 'eaves_j2:j2_hounds', 'eaves_k2:k2_hounds', 'eaves_k2:k2_bears'],
  lanternwood: ['lanternwood_l2:l2_lamp_moths', 'lanternwood_l2:l2_bears'],
  // On to the fork, where the bull toad sees the company, and up the spur past the barge (#171).
  delta: ['delta_c5:c5_pools_n', 'delta_c5:c5_pools_s', 'delta_c5:c5_toad', 'delta_c4:c4_barge'],
  // Up the last of the spur past the herons in the stubble, onto the mound and the quay by day (#172).
  upperwater: ['upperwater_c3:c3_herons', 'upperwater_c3:c3_quay'],
  saltings: ['saltings_c6:c6_bargemen', 'saltings_c6:c6_smugglers', 'saltings_c6:c6_crabs'],
};

/** What an area is called in the check, apart from the map it shares an id with. */
const NAMES: Record<RegionId, string> = { shelf: 'the Foreland', thornmark: 'Thornmark', saltreach: 'Saltreach', wrackholm: 'Wrackholm', sunderwood: 'Sunderwood' };

/**
 * The figures past their limits someone owes, by check: who owes each, and the figure it stood at
 * when it was owed. It is reported, not failed, and fails once it is inside its limit; it fails too if
 * it moves further from its limit than that figure, by more than a point (a tenth of a fight to a rest).
 */
export const OWED: Record<string, { whose: string; at: number }> = {
  // A company two under an Act II box wins every fight. The ladder past 10 (#399) dresses a company
  // at a floor past one two under it, but at the line's standard size (tools/testmonster.ts) a group
  // a company at the floor fights six or seven of to a rest is one a company two under still beats:
  // the to-a-rest aim and the two-under aim pull against each other past 10, which is #18's.
  'wrackholm_e6: under': { whose: '#18', at: 1 },
  'smugglers_cove: under': { whose: '#18', at: 1 },
  'tide_ship: under': { whose: '#18', at: 1 },
  'tide_ship2: under': { whose: '#18', at: 1 },
  'tide_ship3: under': { whose: '#18', at: 1 },
  'Wrackholm: under': { whose: '#18', at: 1 },
  'eaves_i2: under': { whose: '#18', at: 1 },
  'eaves_j2: under': { whose: '#18', at: 1 },
  'Sunderwood: under': { whose: '#18', at: 1 },
  'delta_c5: under': { whose: '#18', at: 1 },
  'c5_rift: under': { whose: '#18', at: 1 },
  'delta_c4: under': { whose: '#18', at: 1 },
  'upperwater_c3: under': { whose: '#18', at: 1 },
  'Saltreach: under': { whose: '#18', at: 1 },
};

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

const rates = new Map<string, number>();
/**
 * A group's win rate at a level, in the weather its time to walk brings, keyed on its monsters and
 * that weather, each computed once: the maps and their areas share them.
 */
export function rate(g: Pick<EncounterDef, 'monsters' | 'back' | 'leader' | 'when'>, level: number): number {
  const opts = gateOpts(g), key = `${g.monsters.join(',')}/${g.back ?? 0}/${g.leader ?? ''}@${level}~${opts.rangedPenalty ?? 0}`;
  let r = rates.get(key);
  if (r === undefined) { r = winRate(level, g, SEEDS, ROUND_CAP, opts); rates.set(key, r); }
  return r;
}
/** The two groups nearest a zone's way in, as a company first finds it: none that waits on an `after`. */
export const nearestWayIn = (groups: readonly EncounterDef[], steps: (x: number, y: number) => number): EncounterDef[] =>
  groups.filter((g) => !g.after).sort((a, b) => steps(a.x, a.y) - steps(b.x, b.y)).slice(0, 2);
/**
 * Where the crossings people sell (game/passage.ts) put a company onto map `id`: a crossing's landing
 * on it, and where a crossing lands in a town, that town's ways out onto it. Each is a way in, as a
 * coach carries a company past country it has not earned (#164).
 */
export function landings(defs: readonly MapDef[], id: string): { x: number; y: number; by: string }[] {
  const out: { x: number; y: number; by: string }[] = [];
  for (const d of defs) for (const f of d.features ?? []) {
    if (f.kind !== 'npc') continue;
    for (const p of f.passage ?? []) {
      const by = `${p.by} from ${d.id}`;
      if (p.to === id) out.push({ x: p.x, y: p.y, by });
      const town = defs.find((t) => t.id === p.to && t.kind === 'town');
      for (const e of town?.exits ?? []) if (e.to === id && !out.some((o) => o.x === e.tx && o.y === e.ty && o.by === by)) out.push({ x: e.tx, y: e.ty, by: `${by} through ${town!.id}` });
    }
  }
  return out;
}
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
 * a company two under (under level 1).
 */
export function areaPools(maps: readonly MapDef[], areaFloor: number, r: (g: EncounterDef, level: number) => number = rate): { through: number | null; back: number | null; groups: number; under: number } {
  const at: number[] = [], low: number[] = [];
  for (const d of maps) {
    if (!d.encounters?.length || !d.band) continue;
    const under = (d.kind === 'outdoor' ? d.band[0] : areaFloor) - GATE.under;
    for (const g of d.encounters) { at.push(r(g, d.band[0])); if (under >= 1) low.push(r(g, under)); }
  }
  return { through: at.length ? mean(at) : null, back: low.length ? mean(low) : null, groups: at.length, under: low.length };
}
/** A zone's name in the check's lines, 'the Foreland' for 'The Foreland'. */
const zoneName = (name: string): string => name.replace(/^The /, 'the ');
const median = (v: readonly number[]): number => { const s = [...v].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

/**
 * A map at its floor through, two levels under it back (or n/a, where that is under level 1). Two
 * under is asked of a map alone only where `judgeUnder` says: where its floor is its area's. A map with
 * a higher floor is held at its floor alone, and its groups count two under in the area's pool
 * (`areaPools`; the owner's decisions on #40, 28 September, and #209, 29 September).
 */
function margins(id: string, groups: readonly EncounterDef[], [floor]: readonly [number, number], judgeUnder = true): void {
  if (!groups.length) { console.log(`  n/a:  ${id} has no groups yet`); return; }
  const at = pooled(groups, floor);
  check(`${id}: floor`, at, atLeast(GATE.through.aim), atLeast(GATE.through.limit), `${id} at its floor, ${floor}: ${pc(at)} of fights won (${aims(pc(GATE.through.aim), pc(GATE.through.limit))})`);
  if (!judgeUnder) { console.log(`  n/a:  ${id} ${GATE.under} under its floor: its floor is above its area's, so its groups count two under in the area's pool (a zone map's under its own floor, a town's or dungeon's under the area's), where they have a company`); return; }
  const low = floor - GATE.under;
  if (low < 1) { console.log(`  n/a:  ${id} ${GATE.under} under its floor: level ${low} is no company`); return; }
  const under = pooled(groups, low);
  check(`${id}: under`, under, atMost(GATE.back.aim), atMost(GATE.back.limit), `${id} ${GATE.under} under its floor, at ${low}: ${pc(under)} won (at most: ${aims(pc(GATE.back.aim), pc(GATE.back.limit))})`);
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

export function gate(): void {
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
  }
  // A fight nobody finishes in fifteen rounds is broken off, and counted as not won.
  const slow = [testMonster('soldier', 1, 400, 0.01)];
  ok(gateFight(gateCompany(3, 36), slow, 36) && !gateFight(gateCompany(3, 36), slow, 36, ROUND_CAP), `a fight won only past ${ROUND_CAP} rounds is broken off at ${ROUND_CAP}, and not won`);
  // A group's time to walk: fog brings the bows' toll to its fights, and nothing else does; an
  // `until` changes no fight; a group that waits on an `after` is no warning at the way in.
  {
    const bows = new Array(6).fill('smuggler_bowman'), dry = rate({ monsters: bows }, 1), fog = rate({ monsters: bows, when: { sky: 'fog' } }, 1);
    ok(fog !== dry && rate({ monsters: bows, when: [{ hours: 'night' }, { season: 'winter' }] }, 1) === dry, `six smuggler bowmen that walk only in fog are fought in it (${pc(fog)} won at 1, against ${pc(dry)} dry), and by night or in winter dry`);
    ok(rate({ monsters: bows, when: [{ sky: 'fog' }, { hours: 'night' }] }, 1) === dry, 'and one that walks in fog or by night is fought dry too');
    const at = (x: number): EncounterDef => ({ id: `g${x}`, x, y: 0, monsters: ['rat'] }), line = [at(1), { ...at(2), after: { flag: 'f' } }, at(3), at(4)];
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

  for (const area of AREAS) {
    const id: RegionId = area.id, band = CURVE[id].band;
    const fought = area.maps.filter((d): d is MapDef & { band: [number, number] } => !!d.encounters?.length && !!d.band);
    const zones = area.atlas.zones.filter((z) => z.maps?.length);
    const bosses = area.atlas.zones.flatMap((z) => BOSSES[z.id] ?? []);
    /** A group by the game's name for it, 'map:id'. */
    const find = (ref: string): EncounterDef | undefined => {
      const [map, g] = ref.split(':');
      return fought.find((d) => d.id === map)?.encounters!.find((e) => e.id === g);
    };

    // Each map against its sign.
    for (const d of fought) {
      const groups = d.encounters!;
      margins(d.id, groups, d.band, d.band[0] === band[0]);
      for (const b of bosses.filter((ref) => ref.startsWith(`${d.id}:`))) {
        const boss = groups.find((e) => `${d.id}:${e.id}` === b);
        if (!boss) continue;
        const at = rate(boss, d.band[0]), above = rate(boss, d.band[0] + GATE.under);
        check(`${b}: floor`, at, within(GATE.boss.aim), within(GATE.boss.limit), `${d.id}'s boss ${boss.id} at ${d.band[0]}: ${pc(at)} won (${aims(`${pc(GATE.boss.aim[0])} to ${pc(GATE.boss.aim[1])}`, `${pc(GATE.boss.limit[0])} to ${pc(GATE.boss.limit[1])}`)})`);
        check(`${b}: above`, above, atLeast(GATE.bossAbove.aim), atLeast(GATE.bossAbove.limit), `${d.id}'s boss ${boss.id} at ${d.band[0] + GATE.under}: ${pc(above)} won (${aims(pc(GATE.bossAbove.aim), pc(GATE.bossAbove.limit))})`);
      }
      // Its dens: the keepers the camp's hardest fight, and its brood's number and pace.
      for (const f of d.features ?? []) if (f.kind === 'den') { const r = denReading(d, f, d.band[0]); ok(!r.fault, `${r.line}${r.fault ? ` (${r.fault})` : ''}`); }
      // Fights to a rest are harness's measure: its thrifty bot, its outfitted company, its round cap.
      // A boss is judged on its odds above, not on the day (MONSTERS.md §4.4), so the day leaves it out
      // (the owner's decision on #40, 28 September).
      const day = days(d.band[0], groups.filter((g) => !bosses.includes(`${d.id}:${g.id}`)), DAYS, 1, true), want = fightsPerRest(d.band[0]);
      const around = (e: readonly [number, number]): [number, number] => [want - e[0], want + e[1]], range = ([lo, hi]: [number, number]): string => `${lo} to ${hi}`;
      check(`${d.id}: rest`, day.fights, within(around(GATE.perRest.aim)), within(around(GATE.perRest.limit)), `${d.id} at ${d.band[0]}: ${day.fights.toFixed(2)} fights to a rest (${aims(range(around(GATE.perRest.aim)), range(around(GATE.perRest.limit)))}); ${pc(day.why.long)} of days end in a fight broken off`, true);
    }

    // The area against the curve: each group at its own map's floor, and two under a floor.
    const name = NAMES[id];
    const lost = [...bosses, ...zones.flatMap((z) => ROADS[z.id] ?? [])].filter((ref) => !find(ref));
    ok(!lost.length, `${name}: its bosses and its roads are groups of its maps${lost.length ? ` (not: ${lost.join(', ')})` : ''}`);
    const pools = areaPools(fought, band[0]);
    if (pools.through === null) console.log(`  n/a:  ${name} has no groups yet`);
    else check(`${name}: floor`, pools.through, atLeast(GATE.through.aim), atLeast(GATE.through.limit), `${name} at its maps' floors: ${pc(pools.through)} of its ${pools.groups} groups' fights won (${aims(pc(GATE.through.aim), pc(GATE.through.limit))})`);
    if (pools.back === null) console.log(`  n/a:  ${name} ${GATE.under} under its maps' floors: no group has a company there`);
    else check(`${name}: under`, pools.back, atMost(GATE.back.aim), atMost(GATE.back.limit), `${name} ${GATE.under} under its maps' floors (a town's or dungeon's, the area's ${band[0]}): ${pc(pools.back)} of ${pools.under} groups' fights won (at most: ${aims(pc(GATE.back.aim), pc(GATE.back.limit))})`);

    // Each zone: its road walked at its floor, and a warning, not a wall, at its way in.
    for (const z of zones) {
      const maps = z.maps!.map((m) => fought.find((d) => d.id === m.map)).filter((d): d is (typeof fought)[number] => !!d);
      if (!maps.length) continue;
      const zn = zoneName(z.name), floor = Math.min(...maps.map((d) => d.band[0]));
      const refs = ROADS[z.id], own = new Set(z.maps!.map((m) => m.map)), astray = (refs ?? []).filter((ref) => !own.has(ref.split(':')[0]));
      ok(!!refs?.length, `${zn}: its road is named${refs?.length ? '' : ` (ROADS has no '${z.id}')`}`);
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
  const zoneIds = new Set(ATLAS.zones.map((z) => z.id)), astray = [...Object.keys(ROADS), ...Object.keys(BOSSES)].filter((k) => !zoneIds.has(k));
  ok(!astray.length, `every key of ROADS and BOSSES is a zone${astray.length ? ` (not: ${astray.join(', ')})` : ''}`);
  if (offAim.length) console.log(`\n  Off their aim, inside their limits (${offAim.length}):\n${offAim.map((l) => `    ${l}`).join('\n')}`);
  const stale = Object.keys(OWED).filter((k) => !used.has(k));
  ok(!stale.length, `every owed entry names a check that ran${stale.length ? ` (not: ${stale.join(', ')})` : ''}`);
}
