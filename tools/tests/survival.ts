// The survival sweep (#723's first part; docs/PILOT.md): the pilot plays the shelf's first chapter, The
// Quiet Farm, from a new game on each of SEEDS, with the premade company and with the company the seed
// draws (`randomParty`, as P on the title draws it), and at least FLOOR of each finish. It prints a line
// a seed: finished, or where the company fell, at what level and when. It takes minutes, so it runs only
// when named (`ASKED`, tools/test.ts): node tools/test.ts survival.
import { ok } from './lib.ts';
import { pilotRun } from '../walk.ts';
import { randomParty } from '../../src/ui/create.ts';
import { THE_QUEST } from '../../src/content/index.ts';

/** The seeds swept. */
export const SEEDS: readonly number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
/** How many of SEEDS must finish the chapter: with the premade company, and with the drawn ones. */
export const FLOOR = { premade: 9, drawn: 8 } as const;

export function survival(): void {
  const chapter = THE_QUEST.chapters[0];
  for (const kind of ['premade', 'drawn'] as const) {
    const done: number[] = [];
    for (const seed of SEEDS) {
      const r = pilotRun(chapter, { seed, party: kind === 'drawn' ? randomParty(seed) : undefined });
      if (r.done) done.push(seed);
      const how = r.done ? 'finished' : r.on ? `still going at the cap in ${r.where} ("${r.why}")` : `fell in ${r.where}`;
      console.log(`  ${kind} seed ${seed}: ${how}, level ${r.level}, ${r.ticks.toLocaleString('en-GB')} ticks, ${r.secs} s`);
    }
    ok(done.length >= FLOOR[kind], `with the ${kind} company the pilot finishes ${chapter.title} on ${done.length} of ${SEEDS.length} seeds, the floor ${FLOOR[kind]} (${done.join(' ') || 'none'})`);
  }
}
