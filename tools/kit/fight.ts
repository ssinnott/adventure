// The fight, written once (#984): a fight played to its end under a round cap, the monsters' turns by
// the game's `monsterAct` and the party's by a bot given to it, under the what-ifs passed. The gate,
// the harness and the suites play every fight they measure through `playOut`. A group's fights are
// kept seed by seed, and the gate's figures settled on the seeds' ladder (#848): measured on 100
// seeds, and on more only where a figure lies near its limit.
import type { RngInstance } from '../../src/lib/engine/rng.ts';
import type { Party } from '../../src/game/party.ts';
import { currentTurn, monsterAct, startCombat, asGroup } from '../../src/game/combat.ts';
import type { CombatState, CombatOpts, Fighters } from '../../src/game/combat.ts';
import type { BotOpts } from '../../src/game/bot.ts';
import { makeRng } from '../../src/lib/engine/rng.ts';
import { RANGED_PENALTY } from '../../src/game/weather.ts';
import { botTurn, asWritten } from '../../src/game/bot.ts';
import { RULES, type Rules, gateCompany, HARNESS } from './company.ts';
import type { EncounterDef, Answer } from '../../src/game/mapdef.ts';
import { answer, barred } from '../../src/game/people.ts';
import type { Tables } from '../../src/game/tables.ts';

/** No fight goes on for ever: one still running after this many rounds is broken off, and the company must rest. */
export const ROUND_CAP = 15;
/** The most turns a fight is played: none under ROUND_CAP comes near it, and one with no cap is broken off at it. */
export const GUARD = 4000;
/** A bot's turn for member `i`; `opts` are the bots' options (#853), `rules.bot` as `play` hands them, and `rules` the what-ifs it plays by. */
export type Bot = (s: CombatState, p: Party, rng: RngInstance, i: number, opts?: BotOpts, rules?: Readonly<Rules>) => void;

/**
 * The fight `s` played on from where it stands to its end: each monster's turn by the game's
 * `monsterAct`, each member's by `bot` with the options and answers `rules` asks (`rules.bot`,
 * `rules.answer`). One still running past `cap` rounds, or at GUARD turns, is broken off. The fight as
 * it ended, to read.
 */
export function playOut(s: CombatState, p: Party, rng: RngInstance, bot: Bot, rules: Readonly<Rules>, cap = Infinity): CombatState {
  for (let turns = 0; s.outcome === 'ongoing' && turns < GUARD; turns++) {
    const t = currentTurn(s, p, rng);
    if (!t || s.round > cap) break;
    if (t.side === 'monster') monsterAct(s, p, rng); else bot(s, p, rng, t.i, rules.bot, rules);
  }
  return s;
}

/**
 * The bot's turn for member `i`, as the gate plays it: the game's `botTurn` knowing every monster as
 * written, with the options `rules.bot` asks (#853, `--bot`), none unless a what-if passes them
 * (#865), but the feats, which it plays once a fight has them unless a what-if sets them off (#1113),
 * and the answers `rules.answer` asks, play's unless passed (#946).
 */
export function gateTurn(s: CombatState, p: Party, rng: RngInstance, i: number, rules: Readonly<Rules> = RULES): void { botTurn(s, p, rng, i, asWritten, { feats: true, ...rules.bot }, rules.answer); }
/** The gate's bot as a fight plays it (`playOut`): `gateTurn`, under the what-ifs the fight is handed. */
export const gateBot: Bot = (s, p, rng, i, _opts, rules) => gateTurn(s, p, rng, i, rules);

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
 * fight's weather (see `gateOpts`); `rules` the what-ifs its bot plays by (`gateTurn`).
 */
export function gateFight(p: Party, monsters: Fighters, seed: number, cap = Infinity, opts: CombatOpts = {}, rules: Readonly<Rules> = RULES, tables: Tables = HARNESS): boolean {
  const rng = makeRng(seed), s = startCombat(tables, p, [asGroup('gate', monsters)], rng, opts);
  return playOut(s, p, rng, gateBot, rules, cap).outcome === 'victory';
}

/**
 * A group's question as the bot answers it (#544, kept by #549): it refuses, so the gate measures
 * the fight. None for a group that asks nothing.
 */
export const gateAnswer = (g: Pick<EncounterDef, 'choice'>): Answer | undefined => g.choice?.answers.find((a) => a.fight);

/**
 * The walk past a group that asks: the first answer that does not fight and the company can give,
 * given (its price paid, its item handed over, its flags set), and true. False, and nothing changes,
 * when it can give none: then the group is fought.
 */
export function gatePass(p: Party, g: Pick<EncounterDef, 'choice'>): boolean {
  const a = g.choice?.answers.find((x) => !x.fight && !barred(x, p));
  if (a) answer(HARNESS.items, a, p);
  return !!a;
}

/** The seed of a group's fight on seed `k`, the same for every level and every caller. */
export const fightSeed = (k: number): number => k * 7919 + 13;
/** Seed k's fight of a group: won or not by a company of `level`, alone from full health. The same fight at every count of seeds. */
const wonOn = (level: number, monsters: Fighters, k: number, cap: number, opts: CombatOpts, rules: Readonly<Rules>): boolean =>
  gateFight(gateCompany(level, k, rules), monsters, fightSeed(k), cap, opts, rules);

/** The share of a group's fights a company of `level` wins, each alone from full health, over seeds 1 to `seeds`, under the what-ifs `rules`. */
export function winRate(level: number, monsters: Fighters, seeds: number, cap = Infinity, opts: CombatOpts = {}, rules: Readonly<Rules> = RULES): number {
  let won = 0;
  for (let k = 1; k <= seeds; k++) if (wonOn(level, monsters, k, cap, opts, rules)) won++;
  return won / seeds;
}

/**
 * Seed k's value of a figure, each worked out once and kept (#848): the first n at any n, so a count
 * that grows plays only the seeds it has not played. `value` gives seed k the same at every count.
 */
export function seeded<T>(value: (k: number) => T): (n: number) => readonly T[] {
  const kept: T[] = [];
  return (n) => {
    while (kept.length < n) kept.push(value(kept.length + 1));
    return kept;
  };
}

/** Seeds a cell, as tools/gate.ts's table has it, and the gate's first rung (SEED_LADDER). */
export const SEEDS = 100;
type Group = Pick<EncounterDef, 'monsters' | 'back' | 'leader' | 'when' | 'under' | 'clock'>;
const played = new Map<string, (n: number) => readonly number[]>();
/**
 * A group's fights at a level seed by seed, 1 won and 0 not, at least `seeds` of them, in the weather
 * its time to walk brings under the round cap `cap` and the what-ifs `rules`: keyed on its monsters, its
 * clock, that weather, the cap and the what-ifs where they are not play's, each seed's fight played
 * once, so the maps and their areas share them and a count that grows plays only the seeds it has not
 * (#848). The gate's are under ROUND_CAP; the walkthroughs' `fight` asks ten with no cap
 * (tools/kit/walk.ts, #1018).
 */
export function fights(g: Group, level: number, seeds = SEEDS, cap = ROUND_CAP, rules: Readonly<Rules> = RULES): readonly number[] {
  const opts = gateOpts(g), key = `${g.monsters.join(',')}/${g.back ?? 0}/${g.leader ?? ''}/${g.under ?? ''}/${g.clock ? JSON.stringify(g.clock) : ''}@${level}~${opts.rangedPenalty ?? 0}^${cap}${rules === RULES ? '' : `|${JSON.stringify(rules)}`}`;
  let s = played.get(key);
  if (!s) played.set(key, (s = seeded((k) => (wonOn(level, g, k, cap, opts, rules) ? 1 : 0))));
  return s(seeds);
}
/** A group's win rate at a level over seeds 1 to `seeds`, winRate's to the last digit, from its fights (`fights`). */
export function rate(g: Group, level: number, seeds = SEEDS, cap = ROUND_CAP, rules: Readonly<Rules> = RULES): number {
  const w = fights(g, level, seeds, cap, rules);
  let won = 0;
  for (let k = 0; k < seeds; k++) won += w[k];
  return won / seeds;
}

/**
 * The seeds' ladder (#848): a figure the gate judges against a limit is measured on SEEDS seeds and,
 * while it lies within MARGIN standard errors of a limit, again on the next rung, four times the seeds,
 * to the top. A rung plays only the seeds the last did not (`seeded`), so a figure settled on N seeds is
 * the figure flat on N, and its standard error halves from rung to rung.
 */
export const SEED_LADDER: readonly number[] = [SEEDS, 4 * SEEDS, 16 * SEEDS];
/**
 * How many standard errors from a limit settle a figure under the ladder's top: three. A figure on its
 * limit is measured three outside it about one time in 740; on the gate's 605 figures at #848 no margin
 * from two to four judged a line otherwise than flat on 1,600 seeds, and three settled 574 on 100, 17
 * on 400 and 14 on 1,600 (two: 585, 17 and 3).
 */
export const MARGIN = 3;
/** A figure as measured on some seeds: its value and its standard error there. */
export interface Measure { value: number; se: number }
/** A figure settled on the seeds' ladder: as measured on the rung it stopped at, its seeds there, and whether it lies within the margin of a limit still (only at the top). */
export type Settled<M extends Measure> = M & { seeds: number; near: boolean };

/** The standard error of the mean of the first `n` of `values`, from their spread: for a rate's fights, 1 won and 0 not, sqrt(p(1-p)/n). */
export function spread(values: readonly number[], n: number): number {
  let sum = 0, sq = 0;
  for (let k = 0; k < n; k++) { sum += values[k]; sq += values[k] * values[k]; }
  return Math.sqrt(Math.max(0, sq / n - (sum / n) ** 2) / n);
}

/**
 * A figure settled against its limits (#848): `at(n)` measures it on n seeds, each rung of `ladder` in
 * turn, until it lies more than `margin` standard errors from every limit, `misses` each saying how far
 * a value misses one (nothing or less where it holds), or the ladder ends. One still within the margin
 * at the top is judged on its top figure, and says so (`near`).
 */
export function settle<M extends Measure>(at: (n: number) => M, misses: readonly ((v: number) => number)[], ladder: readonly number[] = SEED_LADDER, margin = MARGIN): Settled<M> {
  for (let i = 0; ; i++) {
    const m = at(ladder[i]), near = misses.some((miss) => Math.abs(miss(m.value)) <= margin * m.se);
    if (!near || i === ladder.length - 1) return { ...m, seeds: ladder[i], near };
  }
}
