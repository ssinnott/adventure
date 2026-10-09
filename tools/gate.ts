// The level gates, measured: how often a company of a given level wins an area's fights, so a map's
// band can be held against what its monsters actually do (docs/EXPANSION.md §2.2, §5.2).
//   node tools/gate.ts                                 every map with monsters, levels 1-8, 10, 12 and 14
//   node tools/gate.ts --maps thornmark,grove2 --levels 2,3,4,5 --seeds 200
//   node tools/gate.ts --road thornmark:tm_wolves1,tm_brigands2,tm_hounds,tm_zealots
// The premade company is trained to each level, dressed by the ladder (GEAR, tools/harness.ts: to
// 25, Cinderport's armourer's, and past it in that top step) and takes the prestiges its
// level brings, at 11, 19 and 27, as harness's company does (it is that company, `companyAt`),
// and fights every group of a map alone from full health, once per seed. --road instead fights the
// groups named, in order, with no rest between, and counts the companies still standing after each;
// one group is one fight. A plain bot plays the party: mend the weakest when someone is under 40%,
// or in the row a foe that sweeps would take under the most one sweep could deal them, so that none
// of the front row falls to one sweep and it never turns on the back row; else the strongest damage
// spell it can afford, else a weapon, else brace. It aims at a leader where it can reach one, since
// the people break at its fall, or at a caller while the fight has room for its call, or at a light
// whose touch takes spell points, since its fall keeps the casters' points, and else a weapon at
// the first foe it reaches. Once it has seen what an element does to a foe it casts the element
// that foe is weakest to, and never one it has seen do nothing to any foe still standing; once it
// has seen a foe mend, it burns it with fire each round before it casts anything else. It reads the
// fight as it stands each turn, the groups called into it too. It wakes a sleeper of the front row,
// or a caster, before it strikes. It never sleeps, blesses, drinks or flees, nor cures anything but
// sleep, so it is weaker than a player; single fights at full health are kinder than play. A group
// that asks before it fights (#544) it refuses, and fights. Between fights, where the gate check
// mends, it lifts stone first, by Absolve or the draught it carries from 25 (#546), as harness's
// company does.
// Read the numbers as where the fights bite, not as a promise. tools/tests/gate.ts holds every map
// and area to them (the gate check); it imports this file, whose table runs only from the command
// line.
import { pathToFileURL } from 'node:url';
import { makeRng } from '../src/lib/engine/rng.ts';
import { isDown, MAX_LEVEL } from '../src/game/party.ts';
import type { Party, Character } from '../src/game/party.ts';
import type { RngInstance } from '../src/lib/engine/rng.ts';
import { startCombat, currentTurn, partyAct, monsterAct, aliveMonsters, canAttackFromRow, canReach, asGroup, seenMult } from '../src/game/combat.ts';
import type { CombatOpts, CombatState, Fighters } from '../src/game/combat.ts';
import { RANGED_PENALTY } from '../src/game/weather.ts';
import { spell } from '../src/game/spells.ts';
import type { SpellDef, SpellTarget } from '../src/game/spells.ts';
import { MAP_DEFS } from '../src/content/index.ts';
import { companyAt, wakeWith, markOf, mendLines } from './harness.ts';
import type { EncounterDef, Answer } from '../src/game/map.ts';
import { answer, barred } from '../src/game/people.ts';

/**
 * The premade company, every member trained to `level`, dressed by the ladder and with the prestiges
 * that level brings, whole: harness's own (`companyAt`), a fresh copy every call. Under level 1 it is
 * no company, and throws.
 */
export function gateCompany(level: number, seed: number): Party {
  if (!(level >= 1)) throw new Error(`no company at level ${level}: levels start at 1`);
  return companyAt(level, seed);
}

/** How far a damage spell reaches; the bot casts the widest it can afford. */
const REACH: Partial<Record<SpellTarget, number>> = { all: 3, group: 2, enemy: 1 };

/**
 * What a group's time to walk does to its fights: one that walks only in fog is fought with the
 * bows' toll. By night, by day, in snow or in a season it is fought dry, as every other group.
 */
export function gateOpts(g: Pick<EncounterDef, 'when'>): CombatOpts {
  const when = g.when === undefined ? [] : [g.when].flat();
  return when.length && when.every((h) => h.sky === 'fog') ? { rangedPenalty: RANGED_PENALTY } : {};
}

/**
 * One fight to its end with the bot playing the party, which carries its wounds out. True if won. With
 * `cap`, a fight still running after that many rounds is broken off, and not won; `opts` is the
 * fight's weather (see `gateOpts`).
 */
export function gateFight(p: Party, monsters: Fighters, seed: number, cap = Infinity, opts: CombatOpts = {}): boolean {
  const rng = makeRng(seed), s = startCombat(p, [asGroup('gate', monsters)], rng, opts);
  for (let guard = 0; s.outcome === 'ongoing' && guard < 4000; guard++) {
    const t = currentTurn(s, p, rng);
    if (!t || s.round > cap) break;
    if (t.side === 'monster') monsterAct(s, p, rng); else gateTurn(s, p, rng, t.i);
  }
  return s.outcome === 'victory';
}

/**
 * A group's question as the bot answers it (#544; the full bot is #549's): it refuses, so the gate
 * measures the fight. None for a group that asks nothing.
 */
export const gateAnswer = (g: Pick<EncounterDef, 'choice'>): Answer | undefined => g.choice?.answers.find((a) => a.fight);

/**
 * The walk past a group that asks: the first answer that does not fight and the company can give,
 * given (its price paid, its item handed over, its flags set), and true. False, and nothing changes,
 * when it can give none: then the group is fought.
 */
export function gatePass(p: Party, g: Pick<EncounterDef, 'choice'>): boolean {
  const a = g.choice?.answers.find((x) => !x.fight && !barred(x, p));
  if (a) answer(a, p);
  return !!a;
}

/** The damage spell the bot would cast at the fight's first foe, or its mark: none if it can afford none worth casting. */
export function gateBlast(s: CombatState, c: Character): SpellDef | undefined {
  const foes = aliveMonsters(s), foe = markOf(s, foes) ?? foes[0];
  if (foe === undefined) return undefined;
  const mult = (x: SpellDef): number => seenMult(s, s.monsters[foe], x.element);
  return c.spells.map(spell).filter((x) => x.context !== 'explore' && x.sp <= c.sp && x.dice && REACH[x.target] && foes.some((f) => seenMult(s, s.monsters[f], x.element) > 0))
    .sort((a, b) => mult(b) - mult(a) || REACH[b.target]! - REACH[a.target]! || b.dice! * b.sides! - a.dice! * a.sides!)[0];
}

/**
 * The bots' answer to what mends (`MonsterDef.regen`): once the company has seen a foe mend, the
 * member's widest, strongest fire spell at the first such foe not yet burnt this round, where it can
 * afford one and has not seen fire do nothing to it; none else.
 */
export function gateBurn(s: CombatState, c: Character): { spellId: string; target: number } | undefined {
  const target = aliveMonsters(s).find((f) => { const m = s.monsters[f]; return !!s.mends?.[m.def.id] && !m.burnt && seenMult(s, m, 'fire') > 0; });
  if (target === undefined) return undefined;
  const fire = c.spells.map(spell).filter((x) => x.context !== 'explore' && x.sp <= c.sp && x.element === 'fire' && REACH[x.target])
    .sort((a, b) => REACH[b.target]! - REACH[a.target]! || b.dice! * b.sides! - a.dice! * a.sides!)[0];
  return fire && { spellId: fire.id, target };
}

/** The bot's turn for member `i`. */
export function gateTurn(s: CombatState, p: Party, rng: RngInstance, i: number): void {
  const c = p.members[i], foes = aliveMonsters(s), lead = markOf(s, foes), foe = lead ?? foes[0];
  const blade = lead !== undefined && canReach(s, c, lead) ? lead : foes.find((f) => canReach(s, c, f)) ?? foe;
  const known = c.spells.map(spell).filter((x) => x.context !== 'explore' && x.sp <= c.sp);
  const lines = mendLines(s, p), low = p.members.map((m, j) => ({ m, j })).filter(({ m, j }) => !isDown(m) && m.hp < lines[j]).sort((a, b) => a.m.hp - b.m.hp)[0];
  const mend = known.filter((x) => x.heal && !x.raise).sort((a, b) => (b.heal ?? 0) - (a.heal ?? 0))[0];
  const blast = gateBlast(s, c);
  if (low && mend && partyAct(s, p, rng, { type: 'cast', spellId: mend.id, target: low.j })) return;
  const sleeper = wakeWith(p, c);
  if (sleeper && partyAct(s, p, rng, { type: 'cast', ...sleeper })) return;
  const burn = gateBurn(s, c);
  if (burn && partyAct(s, p, rng, { type: 'cast', ...burn })) return;
  if (blast && partyAct(s, p, rng, { type: 'cast', spellId: blast.id, target: foe })) return;
  if (canAttackFromRow(c, i) && partyAct(s, p, rng, { type: 'attack', target: blade })) return;
  partyAct(s, p, rng, { type: 'defend' });
}

/** The seed of a group's fight on seed `k`, the same for every level and every caller. */
export const fightSeed = (k: number): number => k * 7919 + 13;

/** The share of a group's fights a company of `level` wins, each alone from full health, over seeds 1 to `seeds`. */
export function winRate(level: number, monsters: Fighters, seeds: number, cap = Infinity, opts: CombatOpts = {}): number {
  let won = 0;
  for (let k = 1; k <= seeds; k++) if (gateFight(gateCompany(level, k), monsters, fightSeed(k), cap, opts)) won++;
  return won / seeds;
}

function main(): void {
  const args = process.argv.slice(2);
  const opt = (name: string): string | undefined => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : undefined; };
  const levels = (opt('levels') ?? '1,2,3,4,5,6,7,8,10,12,14').split(',').map(Number);
  const seeds = Number(opt('seeds') ?? 100);
  const only = opt('maps')?.split(',').filter(Boolean);
  if (levels.some((l) => !(l >= 1 && l <= MAX_LEVEL))) throw new Error(`levels run from 1 to ${MAX_LEVEL}`);

  const pct = (n: number, of: number): number => Math.round((100 * n) / of);
  const line = (label: string, cells: readonly (string | number)[]): void => console.log(label.padEnd(28) + cells.map((c) => String(c).padStart(5)).join(''));
  const heading = (label: string): void => line(label, levels.map((l) => `L${l}`));

  const road = opt('road');
  if (road) {
    const [mapId, ids = ''] = road.split(':');
    const groups: EncounterDef[] = ids.split(',').filter(Boolean).map((id) => {
      const g = MAP_DEFS.find((d) => d.id === mapId)?.encounters?.find((e) => e.id === id);
      if (!g) throw new Error(`no group '${id}' on '${mapId}'`);
      return g;
    });
    console.log(`${mapId}: companies still standing after each fight, no rest between (%, ${seeds} seeds)`);
    heading('fight');
    const standing = groups.map(() => levels.map(() => 0));
    levels.forEach((l, li) => {
      for (let k = 1; k <= seeds; k++) {
        const p = gateCompany(l, k);
        for (let f = 0; f < groups.length && gateFight(p, groups[f], k * 104729 + f, Infinity, gateOpts(groups[f])); f++) standing[f][li]++;
      }
    });
    groups.forEach((g, f) => line(`${f + 1}: ${g.id} [${g.monsters.length}]`, standing[f].map((n) => pct(n, seeds))));
  } else {
    console.log(`Fights won, each group alone from full health (%, ${seeds} seeds)`);
    heading('map (band)');
    for (const d of MAP_DEFS) {
      const groups = d.encounters ?? [];
      if (!groups.length || (only && !only.includes(d.id))) continue;
      line(`${d.id} (${d.band?.join('-') ?? '-'})`, levels.map((l) => {
        const won = groups.reduce((n, g) => n + Math.round(winRate(l, g, seeds, Infinity, gateOpts(g)) * seeds), 0);
        return pct(won, groups.length * seeds);
      }));
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
