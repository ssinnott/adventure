// A chapter played whole (#984): the pilot's run of a chapter on a headless game, which the fullrun
// suite plays and the pilot suite takes from here.
import { drive } from '../headless.ts';
import type { Game } from '../../../src/game/game.ts';
import type { Chapter } from '../../../src/game/quests.ts';
import { holds } from '../../../src/game/quests.ts';
import { companyLevel } from '../../../src/game/party.ts';
import { ChoiceScreen } from '../../../src/ui/screens.ts';

/** The ticks a chapter's play may take; the wall clock (`BUDGET`) bounds it first. */
export const TICK_CAP = 2_000_000;
/** The wall-clock budget of a chapter's play, fair or omniscient: ten minutes, over which it is capped and not finished. */
export const BUDGET = 10 * 60_000;
/** The pilot's stop under the ending's question (talk.ts; the epic's Decided 4). */
const CHOICE = 'The choice is yours.';
/** The lines heard that are findings against an area: a goal lost, a riddle not answered. */
const NOTE = /^(Lost in|I have no answer)/;

/** A chapter's play: done or not, how long, the company's level at the end and where and why it stopped if it did. */
export interface Play { done: boolean; ticks: number; days: string; secs: string; level: number; stop: string; notes: string[] }

/**
 * The last chapter's end is an ending taken, which the pilot never takes (the epic's Decided 4): its
 * stop under the ending's question counts, and the test, its privilege, presses the first answer so
 * the ending holds (the delegate's first call for #723). A stop with any other why line is no finish.
 * Returns whether it pressed.
 */
export function takeEnding(g: Game): boolean {
  const p = g.pilot!;
  if (p.on || p.why[0] !== CHOICE || !(g.top instanceof ChoiceScreen) || !g.top.ends) return false;
  drive(g, ['interact']);
  return true;
}

/**
 * Plays `chapter` on `g` with its pilot at the helm until it is done, the company is wiped, the pilot
 * stops itself or a cap (`TICK_CAP`, `BUDGET`) is met; at the ending's question, `takeEnding`.
 */
export function play(g: Game, chapter: Chapter, settled = 0, from = g.world.state.minutes): Play {
  const p = g.pilot!, notes: string[] = [], hear = p.hear;
  p.hear = (line) => { hear.call(p, line); if (NOTE.test(line)) notes.push(line); };
  const t0 = performance.now(), done = (): boolean => holds(chapter.done, g.world.state, g.party);
  let ticks = settled, over = false;
  for (; ticks < TICK_CAP && p.on && !done() && !over; ticks++) { drive(g, [null]); if (ticks % 100 === 0) over = performance.now() - t0 > BUDGET; }
  takeEnding(g);
  p.hear = hear;
  const st = g.world.state, where = `${g.world.zone?.name ?? g.maps[st.mapId]?.name ?? st.mapId} ${st.x},${st.y}`, finished = done();
  const stop = finished ? '' : p.on ? `capped by ${over ? `the budget (${BUDGET / 60_000} minutes)` : `the ticks (${TICK_CAP.toLocaleString('en-GB')})`} in ${where} ("${p.why[0]}")`
    : p.why[0] === 'The company has fallen.' ? `fell in ${where}` : `stopped itself in ${where} ("${p.why[0]}")`;
  return { done: finished, ticks, days: ((st.minutes - from) / 1440).toFixed(1), secs: ((performance.now() - t0) / 1000).toFixed(1), level: companyLevel(g.party), stop, notes };
}
