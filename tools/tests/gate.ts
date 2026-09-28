// The gate check (EXPANSION §2.2, §5.2): with one road and no flags on it, the monsters are what
// turn a company back. tools/gate.ts's bot plays the premade company, in its starting gear, against
// every group of a map alone from full health; each map is held to its sign's band and each area to
// its band on the curve (src/content/progression.ts). Every margin is printed. A miss the owners
// below are owed is reported, not failed, until it holds: Thornmark's are #40's to retune, the
// Foreland's the pilot's to settle (#47).
import { AREAS } from '../../src/content/index.ts';
import type { RegionId } from '../../src/content/index.ts';
import { CURVE } from '../../src/content/progression.ts';
import type { EncounterDef, MapDef } from '../../src/game/map.ts';
import { rest } from '../../src/game/party.ts';
import { gateCompany, gateFight, winRate } from '../gate.ts';
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
  /** How far below its floor a company is held back. */
  under: 2,
};

/** Seeds a cell, as tools/gate.ts's table has it. */
const SEEDS = 100;

/** Each area's boss groups, by id: they are judged at their map's floor and two levels above it. */
export const BOSSES: Record<RegionId, readonly string[]> = {
  shelf: ['m_warden', 'gw1_captain', 'gw2_deacon'],
  thornmark: ['g2_hand', 'g2_warden'],
};

/** Each area's road: the groups met on it, in order, from the way in. */
export const ROADS: Record<RegionId, readonly string[]> = {
  shelf: ['road_rats', 'hill_wolves'],
  thornmark: ['tm_wolves1', 'tm_brigands2', 'tm_hounds', 'tm_zealots'],
};

/** What an area is called in the check, apart from the map it shares an id with. */
const NAMES: Record<RegionId, string> = { shelf: 'the Foreland', thornmark: 'Thornmark' };

/** The misses someone owes, by check: reported, and failed once they hold. */
export const OWED: Record<string, string> = {
  // The Foreland: the pilot settles these, by retuning it or by moving the thresholds.
  'shelf: rest': '#47',
  'm_warden: floor': '#47',
  'greywater1: rest': '#47',
  'gw1_captain: floor': '#47',
  'greywater2: under': '#47',
  'greywater2: rest': '#47',
  'gw2_deacon: floor': '#47',
  'the Foreland: floor': '#47',
  // Thornmark, the Grove Roots and the Cut Stone: retuned until they hold.
  'thornmark: under': '#40',
  'grove1: under': '#40',
  'grove2: under': '#40',
  'grove2: rest': '#40',
  'g2_hand: floor': '#40',
  'g2_warden: floor': '#40',
  'Thornmark: under': '#40',
};

const used = new Set<string>();
/** A check, or its owed line where OWED names who owes it. */
function check(key: string, cond: boolean, msg: string): void {
  const whose = OWED[key];
  used.add(key);
  if (whose) owed(cond, msg, whose); else ok(cond, msg);
}

const pc = (x: number): string => `${(x * 100).toFixed(1).replace(/\.0$/, '')}%`;

const rates = new Map<string, number>();
/** A group's win rate at a level, each computed once: the maps and their areas share them. */
function rate(g: EncounterDef, level: number): number {
  const key = `${g.id}@${level}`;
  let r = rates.get(key);
  if (r === undefined) { r = winRate(level, g.monsters, SEEDS, ROUND_CAP); rates.set(key, r); }
  return r;
}
const pooled = (groups: readonly EncounterDef[], level: number): number => groups.reduce((t, g) => t + rate(g, level), 0) / groups.length;
const median = (v: readonly number[]): number => { const s = [...v].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

/** At the floor through, two levels under it back (or n/a, where that is under level 1). */
function margins(id: string, groups: readonly EncounterDef[], [floor]: readonly [number, number]): void {
  const at = pooled(groups, floor);
  check(`${id}: floor`, at >= GATE.through, `${id} at its floor, ${floor}: ${pc(at)} of fights won (${pc(GATE.through)} asked)`);
  const low = floor - GATE.under;
  if (low < 1) { console.log(`  n/a:  ${id} ${GATE.under} under its floor: level ${low} is no company`); return; }
  const under = pooled(groups, low);
  check(`${id}: under`, under <= GATE.back, `${id} ${GATE.under} under its floor, at ${low}: ${pc(under)} won (${pc(GATE.back)} at most)`);
}

/** The road from the way in: every fight won, mending between and resting whole where the company must. */
function road(groups: readonly EncounterDef[], level: number): number {
  let walked = 0;
  for (let k = 1; k <= SEEDS; k++) {
    const p = gateCompany(level, k);
    const won = groups.every((g, f) => {
      if (!gateFight(p, g.monsters, k * 104729 + f, ROUND_CAP)) return false;
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

  for (const area of AREAS) {
    const id: RegionId = area.id, band = CURVE[id].band;
    const fought = area.maps.filter((d): d is MapDef & { band: [number, number] } => !!d.encounters?.length && !!d.band);
    const all = fought.flatMap((d) => d.encounters!);
    const find = (g: string): EncounterDef | undefined => all.find((e) => e.id === g);

    // Each map against its sign.
    for (const d of fought) {
      const groups = d.encounters!;
      margins(d.id, groups, d.band);
      for (const b of BOSSES[id].filter((g) => groups.some((e) => e.id === g))) {
        const boss = find(b)!, at = rate(boss, d.band[0]), above = rate(boss, d.band[0] + GATE.under);
        check(`${b}: floor`, at >= GATE.boss[0] && at <= GATE.boss[1], `${d.id}'s boss ${b} at ${d.band[0]}: ${pc(at)} won (${pc(GATE.boss[0])} to ${pc(GATE.boss[1])} asked)`);
        check(`${b}: above`, above >= GATE.bossAbove, `${d.id}'s boss ${b} at ${d.band[0] + GATE.under}: ${pc(above)} won (${pc(GATE.bossAbove)} asked)`);
      }
      // Fights to a rest are harness's measure: its thrifty bot, its outfitted company, its round cap.
      const day = days(d.band[0], groups.map((g) => g.monsters), SEEDS, 1, true), want = fightsPerRest(d.band[0]);
      check(`${d.id}: rest`, Math.abs(day.fights - want) <= GATE.perRest, `${d.id} at ${d.band[0]}: ${day.fights.toFixed(2)} fights to a rest (${want} asked, ±${GATE.perRest}); ${pc(day.why.long)} of days end in a fight broken off`);
    }

    // The area against the curve.
    const name = NAMES[id];
    ok(BOSSES[id].every(find) && ROADS[id].every(find), `${name}: its bosses and its road are groups of its maps`);
    margins(name, all, band);
    const walked = road(ROADS[id].map((g) => find(g)!), band[0]);
    check(`${name}: road`, walked >= GATE.road, `${name} at ${band[0]}: its road (${ROADS[id].join(', ')}) walked ${pc(walked)} of the time (${pc(GATE.road)} asked)`);

    // A warning, not a wall: the two groups nearest the way in are among the gentlest.
    const outdoors = area.maps.find((d) => d.kind === 'outdoor' && d.encounters?.length);
    if (outdoors) {
      const steps = stepsFrom(outdoors), level = band[0] - GATE.under >= 1 ? band[0] - GATE.under : band[0];
      const first = [...outdoors.encounters!].sort((a, b) => steps(a.x, a.y) - steps(b.x, b.y)).slice(0, 2);
      const mid = median(all.map((g) => rate(g, level)));
      check(`${name}: warning`, first.every((g) => rate(g, level) >= mid), `${name}: the groups nearest the way in, ${first.map((g) => `${g.id} ${pc(rate(g, level))}`).join(' and ')}, are won at ${level} at least as often as its median group (${pc(mid)})`);
    }
  }
  const stale = Object.keys(OWED).filter((k) => !used.has(k));
  ok(!stale.length, `every owed entry names a check that ran${stale.length ? ` (not: ${stale.join(', ')})` : ''}`);
}
