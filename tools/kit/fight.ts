// The fight, written once (#984): a fight played to its end under a round cap, the monsters' turns by
// the game's `monsterAct` and the party's by a bot given to it, under the what-ifs passed. The gate,
// the harness and the suites play every fight they measure through `playOut`.
import type { RngInstance } from '../../src/lib/engine/rng.ts';
import type { Party } from '../../src/game/party.ts';
import { currentTurn, monsterAct } from '../../src/game/combat.ts';
import type { CombatState } from '../../src/game/combat.ts';
import type { BotOpts } from '../../src/game/bot.ts';
import type { Rules } from '../harness.ts';

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
