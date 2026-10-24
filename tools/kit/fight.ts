// The fight, written once (#984): a fight played to its end under a round cap, the monsters' turns by
// the game's `monsterAct` and the party's by a bot given to it, under the what-ifs passed. The gate,
// the harness and the suites play every fight they measure through `playOut`.
import type { RngInstance } from '../../src/lib/engine/rng.ts';
import type { Party } from '../../src/game/party.ts';
import { currentTurn, monsterAct, startCombat, asGroup } from '../../src/game/combat.ts';
import type { CombatState, CombatOpts, Fighters } from '../../src/game/combat.ts';
import type { BotOpts } from '../../src/game/bot.ts';
import { makeRng } from '../../src/lib/engine/rng.ts';
import { RANGED_PENALTY } from '../../src/game/weather.ts';
import { botTurn, asWritten } from '../../src/game/bot.ts';
import { RULES, type Rules, gateCompany } from './company.ts';
import type { EncounterDef, Answer } from '../../src/game/mapdef.ts';
import { answer, barred } from '../../src/game/people.ts';

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
 * (#865), and the answers `rules.answer` asks, play's unless passed (#946).
 */
export function gateTurn(s: CombatState, p: Party, rng: RngInstance, i: number, rules: Readonly<Rules> = RULES): void { botTurn(s, p, rng, i, asWritten, rules.bot, rules.answer); }
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
export function gateFight(p: Party, monsters: Fighters, seed: number, cap = Infinity, opts: CombatOpts = {}, rules: Readonly<Rules> = RULES): boolean {
  const rng = makeRng(seed), s = startCombat(p, [asGroup('gate', monsters)], rng, opts);
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
  if (a) answer(a, p);
  return !!a;
}

/** The seed of a group's fight on seed `k`, the same for every level and every caller. */
export const fightSeed = (k: number): number => k * 7919 + 13;

/** The share of a group's fights a company of `level` wins, each alone from full health, over seeds 1 to `seeds`, under the what-ifs `rules`. */
export function winRate(level: number, monsters: Fighters, seeds: number, cap = Infinity, opts: CombatOpts = {}, rules: Readonly<Rules> = RULES): number {
  let won = 0;
  for (let k = 1; k <= seeds; k++) if (gateFight(gateCompany(level, k, rules), monsters, fightSeed(k), cap, opts, rules)) won++;
  return won / seeds;
}

/** Seeds a cell, as tools/gate.ts's table has it. */
export const SEEDS = 100;
const rates = new Map<string, number>();
/**
 * A group's win rate at a level, in the weather its time to walk brings, keyed on its monsters, its
 * clock and that weather, each computed once: the maps and their areas share them.
 */
export function rate(g: Pick<EncounterDef, 'monsters' | 'back' | 'leader' | 'when' | 'under' | 'clock'>, level: number): number {
  const opts = gateOpts(g), key = `${g.monsters.join(',')}/${g.back ?? 0}/${g.leader ?? ''}/${g.under ?? ''}/${g.clock ? JSON.stringify(g.clock) : ''}@${level}~${opts.rangedPenalty ?? 0}`;
  let r = rates.get(key);
  if (r === undefined) { r = winRate(level, g, SEEDS, ROUND_CAP, opts); rates.set(key, r); }
  return r;
}
