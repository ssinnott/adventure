// The gate check (EXPANSION §2.2, §5.2): with one road and no flags on it, the monsters are what
// turn a company back. tools/gate.ts's bot plays the premade company, dressed by the ladder, against
// every group of a map alone from full health; each map is held to its sign's band and each area to
// its band on the curve (src/content/progression.ts). Every margin is printed. A miss the owners
// below are owed is reported, not failed, until it holds: Thornmark's are #40's to retune, the
// Foreland's the pilot's to settle (#47).
import { AREAS } from '../../src/content/index.ts';
import type { RegionId } from '../../src/content/index.ts';
import { CURVE } from '../../src/content/progression.ts';
import type { EncounterDef, MapDef } from '../../src/game/map.ts';
import { rest } from '../../src/game/party.ts';
import { gateCompany, gateFight, gateOpts, winRate } from '../gate.ts';
import { days, fightsPerRest, mendBetween, mustRest, ROUND_CAP } from '../harness.ts';
import { testMonster } from '../testmonster.ts';
import { stepsFrom } from './curve.ts';
import { ok, owed } from './lib.ts';

/** The starting thresholds, to be set against the owner's own play in the pilot (#47). */
export const GATE = {
  /** At the floor, the share of the fights won: through. */
  through: 0.9,
  /** Two levels under the floor, the most it may win: back. */
  back: 0.25,
  /** At the floor, the share of companies that walk the area's road. */
  road: 0.8,
  /** The boss at its map's floor: about half. */
  boss: [0.3, 0.7] as const,
  /** The boss two levels above its map's floor: nearly always. */
  bossAbove: 0.9,
  /** Fights to a rest may miss harness's fightsPerRest by this many. */
  perRest: 1,
  /** How far under the area's median group the groups nearest its way in may be won. */
  warning: 0.01,
  /** How far below its floor a company is held back. */
  under: 2,
};

/** Seeds a cell, as tools/gate.ts's table has it. */
const SEEDS = 100;
/**
 * Seeds for fights to a rest: a day is a long run of fights, and over a hundred its mean moves by
 * a fifth of a fight with the seeds alone.
 */
const DAYS = 300;

/**
 * Each area's boss groups, as the game names a group, 'map:id': each is judged at its own map's floor
 * and two levels above it, so an area may have several.
 */
export const BOSSES: Record<RegionId, readonly string[]> = {
  shelf: ['mill:m_warden', 'greywater1:gw1_captain', 'greywater2:gw2_deacon'],
  thornmark: ['grove2:g2_hand', 'grove2:g2_warden'],
};

/** Each area's road: the groups met on it, in order, from the way in. */
export const ROADS: Record<RegionId, readonly string[]> = {
  shelf: ['shelf:road_rats', 'shelf:hill_wolves'],
  thornmark: ['thornmark:tm_wolves1', 'thornmark:tm_brigands2', 'thornmark:tm_hounds', 'thornmark:tm_zealots'],
};

/** What an area is called in the check, apart from the map it shares an id with. */
const NAMES: Record<RegionId, string> = { shelf: 'the Foreland', thornmark: 'Thornmark' };

/**
 * The misses someone owes, by check: who owes each, and the figure it stood at when it was owed. It
 * is reported, not failed, and fails once it holds; it fails too if it moves further from the
 * threshold than that figure, by more than a point (a tenth of a fight to a rest).
 */
export const OWED: Record<string, { whose: string; at: number }> = {
  // The Foreland: the pilot settles these, by retuning it or by moving the thresholds.
  'shelf: rest': { whose: '#47', at: 4.58 },
  'mill:m_warden: floor': { whose: '#47', at: 0.98 },
  'greywater1: rest': { whose: '#47', at: 4.08 },
  'greywater1:gw1_captain: floor': { whose: '#47', at: 0.99 },
  'greywater2: under': { whose: '#47', at: 0.658 },
  'greywater2:gw2_deacon: floor': { whose: '#47', at: 1 },
  'the Foreland: floor': { whose: '#47', at: 0.886 },
  // The Grove Roots and the Cut Stone: retuned until they hold; the area with them.
  'grove1: under': { whose: '#40', at: 0.999 },
  'grove2: under': { whose: '#40', at: 1 },
  'grove2: rest': { whose: '#40', at: 7.95 },
  'grove2:g2_hand: floor': { whose: '#40', at: 1 },
  'grove2:g2_warden: floor': { whose: '#40', at: 1 },
  'Thornmark: under': { whose: '#40', at: 0.536 },
};

const pc = (x: number): string => `${(x * 100).toFixed(1).replace(/\.0$/, '')}%`;

const used = new Set<string>();
/**
 * A check on a figure: `miss` says how far it is from the threshold, nothing or less where it holds.
 * Where OWED names who owes it, the owed line, and the check that it has got no worse.
 */
function check(key: string, v: number, miss: (v: number) => number, msg: string, fights = false): void {
  const o = OWED[key];
  used.add(key);
  if (!o) { ok(miss(v) <= 0, msg); return; }
  owed(miss(v) <= 0, msg, o.whose);
  const show = (x: number): string => (fights ? x.toFixed(2) : pc(x)), slack = fights ? 0.1 : 0.01;
  const held = miss(v) <= miss(o.at) + slack + 1e-9;
  const redo = held ? '' : `; if the change is meant, re-record it in OWED: '${key}': { whose: '${o.whose}', at: ${fights ? v.toFixed(2) : v.toFixed(3).replace(/\.?0+$/, '')} }`;
  ok(held, `${key}: ${show(v)}, no more than ${fights ? 'a tenth of a fight' : 'a point'} further from the threshold than the ${show(o.at)} it was owed at${redo}`);
}

const rates = new Map<string, number>();
/**
 * A group's win rate at a level, in the weather its time to walk brings, keyed on its monsters and
 * that weather, each computed once: the maps and their areas share them.
 */
export function rate(g: Pick<EncounterDef, 'monsters' | 'when'>, level: number): number {
  const opts = gateOpts(g), key = `${g.monsters.join(',')}@${level}~${opts.rangedPenalty ?? 0}`;
  let r = rates.get(key);
  if (r === undefined) { r = winRate(level, g.monsters, SEEDS, ROUND_CAP, opts); rates.set(key, r); }
  return r;
}
/** The two groups nearest an area's way in, as a company first finds it: none that waits on an `after`. */
export const nearestWayIn = (groups: readonly EncounterDef[], steps: (x: number, y: number) => number): EncounterDef[] =>
  groups.filter((g) => !g.after).sort((a, b) => steps(a.x, a.y) - steps(b.x, b.y)).slice(0, 2);
const pooled = (groups: readonly EncounterDef[], level: number): number => groups.reduce((t, g) => t + rate(g, level), 0) / groups.length;
const median = (v: readonly number[]): number => { const s = [...v].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

/** At the floor through, two levels under it back (or n/a, where that is under level 1). */
function margins(id: string, groups: readonly EncounterDef[], [floor]: readonly [number, number]): void {
  if (!groups.length) { console.log(`  n/a:  ${id} has no groups yet`); return; }
  const at = pooled(groups, floor);
  check(`${id}: floor`, at, (v) => GATE.through - v, `${id} at its floor, ${floor}: ${pc(at)} of fights won (${pc(GATE.through)} asked)`);
  const low = floor - GATE.under;
  if (low < 1) { console.log(`  n/a:  ${id} ${GATE.under} under its floor: level ${low} is no company`); return; }
  const under = pooled(groups, low);
  check(`${id}: under`, under, (v) => v - GATE.back, `${id} ${GATE.under} under its floor, at ${low}: ${pc(under)} won (${pc(GATE.back)} at most)`);
}

/** The road from the way in: every fight won, mending between and resting whole where the company must. */
function road(groups: readonly EncounterDef[], level: number): number {
  let walked = 0;
  for (let k = 1; k <= SEEDS; k++) {
    const p = gateCompany(level, k);
    const won = groups.every((g, f) => {
      if (!gateFight(p, g.monsters, k * 104729 + f, ROUND_CAP, gateOpts(g))) return false;
      mendBetween(p);
      if (mustRest(p)) for (const m of p.members) rest(m);
      return true;
    });
    if (won) walked++;
  }
  return walked / SEEDS;
}

export function gate(): void {
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
  }

  for (const area of AREAS) {
    const id: RegionId = area.id, band = CURVE[id].band;
    const fought = area.maps.filter((d): d is MapDef & { band: [number, number] } => !!d.encounters?.length && !!d.band);
    const all = fought.flatMap((d) => d.encounters!);
    /** A group by the game's name for it, 'map:id'. */
    const find = (ref: string): EncounterDef | undefined => {
      const [map, g] = ref.split(':');
      return fought.find((d) => d.id === map)?.encounters!.find((e) => e.id === g);
    };

    // Each map against its sign.
    for (const d of fought) {
      const groups = d.encounters!;
      margins(d.id, groups, d.band);
      for (const b of BOSSES[id].filter((ref) => ref.startsWith(`${d.id}:`))) {
        const boss = groups.find((e) => `${d.id}:${e.id}` === b);
        if (!boss) continue;
        const at = rate(boss, d.band[0]), above = rate(boss, d.band[0] + GATE.under);
        check(`${b}: floor`, at, (v) => Math.max(GATE.boss[0] - v, v - GATE.boss[1]), `${d.id}'s boss ${boss.id} at ${d.band[0]}: ${pc(at)} won (${pc(GATE.boss[0])} to ${pc(GATE.boss[1])} asked)`);
        check(`${b}: above`, above, (v) => GATE.bossAbove - v, `${d.id}'s boss ${boss.id} at ${d.band[0] + GATE.under}: ${pc(above)} won (${pc(GATE.bossAbove)} asked)`);
      }
      // Fights to a rest are harness's measure: its thrifty bot, its outfitted company, its round cap.
      const day = days(d.band[0], groups.map((g) => g.monsters), DAYS, 1, true), want = fightsPerRest(d.band[0]);
      check(`${d.id}: rest`, day.fights, (v) => Math.abs(v - want) - GATE.perRest, `${d.id} at ${d.band[0]}: ${day.fights.toFixed(2)} fights to a rest (${want} asked, ±${GATE.perRest}); ${pc(day.why.long)} of days end in a fight broken off`, true);
    }

    // The area against the curve.
    const name = NAMES[id];
    const lost = [...BOSSES[id], ...ROADS[id]].filter((ref) => !find(ref));
    ok(!lost.length, `${name}: its bosses and its road are groups of its maps${lost.length ? ` (not: ${lost.join(', ')})` : ''}`);
    margins(name, all, band);
    const way = ROADS[id].map(find);
    if (way.every((g) => g)) {
      const walked = road(way as EncounterDef[], band[0]);
      check(`${name}: road`, walked, (v) => GATE.road - v, `${name} at ${band[0]}: its road (${ROADS[id].join(', ')}) walked ${pc(walked)} of the time (${pc(GATE.road)} asked)`);
    }

    // A warning, not a wall: the two groups nearest the way in are among the gentlest, a point's
    // grace below the median so that where most groups are always won one loss in a hundred is not a wall.
    // A group that comes only after a step is not there when a company first walks in.
    const outdoors = area.maps.find((d) => d.kind === 'outdoor' && d.encounters?.length);
    if (outdoors && all.length) {
      const steps = stepsFrom(outdoors), level = band[0] - GATE.under >= 1 ? band[0] - GATE.under : band[0];
      const first = nearestWayIn(outdoors.encounters!, steps);
      const mid = median(all.map((g) => rate(g, level)));
      const least = Math.min(...first.map((g) => rate(g, level)));
      check(`${name}: warning`, least, (v) => mid - GATE.warning - v, `${name}: the groups nearest the way in, ${first.map((g) => `${g.id} ${pc(rate(g, level))}`).join(' and ')}, are won at ${level} about as often as its median group or more (${pc(mid)}, less ${pc(GATE.warning)})`);
    }
  }
  const stale = Object.keys(OWED).filter((k) => !used.has(k));
  ok(!stale.length, `every owed entry names a check that ran${stale.length ? ` (not: ${stale.join(', ')})` : ''}`);
}
