// The full run (#723; docs/PILOT.md, Full runs): a new game on seed 4 played by the pilot alone, every
// brain asked and every key pressed through `Game.update`, the one quest's chapters in AREAS order on
// the one Game, so that each area starts as the pilot left the last (the one road, EXPANSION §2.2). A
// line a chapter: finished, with its ticks, days and the company's level, or where the pilot stopped.
//
// A chapter the fair pilot does not finish is played again from the save point taken before it, with
// the map on top as a player saves, by a fresh omniscient pilot (`Pilot.omniscient`), whose line says
// which kind of failure it is; the road goes on from where that one finished it, and ends at a
// chapter neither finishes. Every line heard that starts "Lost in" or "I have no answer" is a note,
// and fails nothing. It takes minutes, so it runs only when named (`ASKED`, tools/test.ts), on the
// road up to the last area FULLRUN names (area ids, or all); `npm test` names it, on the shelf:
//   FULLRUN=shelf node tools/test.ts fullrun     the default when FULLRUN is unset: 10 to 25 s
//   FULLRUN=all node tools/test.ts fullrun       every chapter on the road: ten minutes a chapter at most, fair and omniscient each
import { ok } from './lib.ts';
import { headlessGame, headlessLoad, drive } from '../kit/headless.ts';
import { ExploreScreen } from '../../src/ui/explore.ts';
import type { Game } from '../../src/app/game.ts';
import { AREAS } from '../../src/content/index.ts';
import { Pilot } from '../../src/app/pilot/pilot.ts';
import { serialize } from '../../src/game/save.ts';
import { play } from '../kit/rules/fullrun.ts';

/** The seed the run plays: the walkthroughs' (tools/kit/walk.ts). */
export const SEED = 4;
/** The ticks the pilot may take to come back to the map before a save point (`settle`). */
const SETTLE = 10_000;
type Area = (typeof AREAS)[number];
/** The areas with a chapter, in AREAS order: the road. */
const ROAD = AREAS.filter((a) => a.chapter);

/**
 * The road as far as FULLRUN reaches: every chapter up to the last area named, as a chapter is reached
 * only by those before it; and the names that are no area with a chapter.
 */
export function reach(env = process.env.FULLRUN): { road: Area[]; unknown: string[] } {
  const names = (env?.trim() || 'shelf').split(',').map((s) => s.trim()).filter(Boolean);
  if (names.includes('all')) return { road: [...ROAD], unknown: names.filter((n) => n !== 'all' && !ROAD.some((a) => a.id === n)) };
  const last = Math.max(-1, ...names.map((n) => ROAD.findIndex((a) => a.id === n)));
  return { road: ROAD.slice(0, last + 1), unknown: names.filter((n) => !ROAD.some((a) => a.id === n)) };
}

/**
 * The pilot plays on until the map is on top, where a player can save (F5 is the map's key): a
 * chapter may end in a visit, whose save would stand the party on the business's door. The ticks it took.
 */
function settle(g: Game): number {
  let ticks = 0;
  for (; ticks < SETTLE && g.pilot!.on && !(g.top instanceof ExploreScreen); ticks++) drive(g, [null]);
  return ticks;
}

/** The pilot at the helm of `g`: instant, every brain asked, omniscient only for the second look. */
function helm(g: Game, omniscient = false): Game {
  const p = new Pilot({ instant: true, omniscient });
  g.pilot = p;
  p.toggle(g);
  return g;
}

/** Each note once, with how many times it was heard. */
function note(who: string, lines: readonly string[]): void {
  const count = new Map<string, number>();
  for (const l of lines) count.set(l, (count.get(l) ?? 0) + 1);
  for (const [l, n] of count) console.log(`  note: ${who}: ${l}${n > 1 ? ` (x${n})` : ''}`);
}

export function fullrun(): void {
  const { road, unknown } = reach();
  if (unknown.length) ok(false, `FULLRUN names no area with a chapter: ${unknown.join(', ')} (of ${ROAD.map((a) => a.id).join(', ')} or all)`);
  let g = helm(headlessGame(SEED)), from = '';
  for (const area of road) {
    const chapter = area.chapter!;
    if (from) { ok(false, `${area.id}: not reached, as nobody finished ${from}`); continue; }
    // The save point, before the chapter and with the map on top, as a player saves: an omniscient look plays it again from here.
    const minutes = g.world.state.minutes, settled = settle(g), save = serialize(g.world.state, g.party, g.rng.state), fair = play(g, chapter, settled, minutes);
    note(area.id, fair.notes);
    const run = `in ${fair.ticks.toLocaleString('en-GB')} ticks, ${fair.days} days, level ${fair.level} (${fair.secs} s)`;
    ok(fair.done, fair.done ? `${area.id}: the pilot finishes ${chapter.title} ${run}` : `${area.id}: the pilot does not finish ${chapter.title}: ${fair.stop}, ${run}`);
    if (fair.done) continue;
    // A fresh pilot, omniscient, from the save point: no memory crosses it.
    const seer = helm(headlessLoad(save), true), all = play(seer, chapter);
    note(`${area.id} (omniscient)`, all.notes);
    ok(false, `${area.id}: fair pilot lost; omniscient ${all.done ? 'finishes' : 'also fails'} (${all.done ? '' : `${all.stop}, `}in ${all.ticks.toLocaleString('en-GB')} ticks, ${all.days} days, level ${all.level}, ${all.secs} s)`);
    // The road goes on from the omniscient's end with a fresh fair pilot, so each later chapter has its fair line; a chapter nobody finished ends it.
    if (all.done) g = helm(seer);
    else from = chapter.title;
  }
}
