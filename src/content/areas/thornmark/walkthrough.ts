// Thornmark's walkthrough: the chain of the one quest, the Foreland's chapter and then its own, The
// Grove Stone, played from a new game by the game's own moves and checked a step at a time
// (tools/walk.ts); then played again with Thornmark taken early, before Vask's hire and after it
// but before the wand, where the log must still read true and end the same.
import type { Walkthrough } from '../../area.ts';
import { CHAPTER } from './chapter.ts';
import { CHAPTER as FORELAND } from '../shelf/chapter.ts';
import { HIRE, STEPS as FORELAND_STEPS, hired } from '../shelf/walkthrough.ts';
import { newWalk, meetWho, walkThrough, see, fight, playChapter, goalFromBegun, ending, everyGoalWalked, quest, listen } from '../../../../tools/walk.ts';
import type { Step, Walk } from '../../../../tools/walk.ts';
import { EAST, NORTH } from '../../../game/types.ts';

/** Over the pass, walked: the road has to let a company by. */
const pass = (w: Walk): void => walkThrough(w, 'shelf', 30, 9, EAST, 'thornmark');
/** Into Thornhold by its gate, and Sylvane met: she sets the company on the Stone. */
const sylvane = (w: Walk): void => { walkThrough(w, 'thornmark', 23, 5, NORTH, 'thornhold'); meetWho(w, 'q_grove'); };
/** Under the Grove: the Stone seen, the Hand of Ash and the Warden of the Cut fought. */
const stone = (w: Walk): void => { see(w, 'grove2:g2_stone'); fight(w, 'grove2:g2_hand'); fight(w, 'grove2:g2_warden'); };

/** The chapter in order: through the pass, to Sylvane, under the Grove and the chisel back. */
export const STEPS: readonly Step[] = [
  { name: 'the pass', play: pass },
  { name: 'to Thornhold', play: sylvane },
  { name: 'the Stone', play: stone },
  { name: 'the chisel', play: (w) => meetWho(w, 'ashen_chisel') },
];
/** The chapter for a company Sylvane has already hired. */
const FROM_SYLVANE = STEPS.slice(2);
/**
 * The chapter for a company that goes straight to the Stone and never meets Sylvane till it has
 * the chisel: she takes it at the first meeting, and never hires.
 */
const STONE_FIRST: readonly Step[] = [
  STEPS[0],
  { name: 'the Stone, unsent', play: stone },
  { name: 'the chisel, to someone who knows', play: (w) => { walkThrough(w, 'thornmark', 23, 5, NORTH, 'thornhold'); meetWho(w, 'ashen_chisel'); } },
];

export const walkthrough: Walkthrough = (ok) => {
  // The chain, in order.
  const chain = newWalk(ok);
  hired(chain);
  playChapter(chain, FORELAND, FORELAND_STEPS, 'in order');
  ok(chain.news.slice(-2).join(' ') === 'Chapter complete: The Quiet Farm. New chapter: The Grove Stone.', `in order, the wand ends the farm and opens the Grove (${chain.news.slice(-2).join(' ')})`);
  playChapter(chain, CHAPTER, STEPS, 'in order');
  ok(chain.news.slice(-2).join(' ') === 'Chapter complete: The Grove Stone. Quest complete: The Dimming.', `in order, the chisel ends the Grove and the quest (${chain.news.slice(-2).join(' ')})`);
  const want = ending(chain, 'in order');

  // Thornmark before Vask's hire: through the pass with no quest, to Sylvane and the Grove done
  // before anyone in Helmstow has spoken of it.
  const early = newWalk(ok);
  listen(early);
  pass(early);
  ok(!quest(early), 'early, before the hire: through the pass at level 1, and still no quest');
  sylvane(early);
  ok(early.news.at(-1) === 'New quest: The Dimming.' && quest(early)?.pages.length === 1, `early, Sylvane begins the quest at her own chapter (${early.news.at(-1)})`);
  goalFromBegun(early, 'early, before the hire');
  playChapter(early, CHAPTER, FROM_SYLVANE, 'early, before the hire');
  goalFromBegun(early, 'early, before the hire, the Grove done');
  playChapter(early, FORELAND, [HIRE, ...FORELAND_STEPS], 'early, before the hire');
  ok(JSON.stringify(ending(early, 'early, before the hire')) === JSON.stringify(want), 'early, before the hire: the log ends with the same entries as in order');

  // Thornmark after the hire, before the wand: the quest never sends the company to the Stone
  // before the farm, and the Grove's own chapter opens when Sylvane speaks.
  const hiredEarly = newWalk(ok);
  hired(hiredEarly);
  pass(hiredEarly);
  goalFromBegun(hiredEarly, 'hired, in Thornmark before the wand');
  ok(/Ashcombe/.test(quest(hiredEarly)?.goal ?? ''), `hired, in Thornmark before the wand, the goal is still the farm (${quest(hiredEarly)?.goal})`);
  sylvane(hiredEarly);
  ok(hiredEarly.news.at(-1) === 'New chapter: The Grove Stone.', `hired, Sylvane opens the Grove's chapter (${hiredEarly.news.at(-1)})`);
  playChapter(hiredEarly, CHAPTER, FROM_SYLVANE, 'hired, early');
  goalFromBegun(hiredEarly, 'hired, early, the Grove done');
  playChapter(hiredEarly, FORELAND, FORELAND_STEPS, 'hired, early');
  ok(JSON.stringify(ending(hiredEarly, 'hired, early')) === JSON.stringify(want), 'hired, early: the log ends with the same entries as in order');

  // In order, but to the Stone before Thornhold: the chisel goes to Sylvane at the first meeting.
  // She never hires, so her own entry is never written, and the entries are not compared.
  const unsent = newWalk(ok);
  hired(unsent);
  playChapter(unsent, FORELAND, FORELAND_STEPS, 'in order, the Stone first');
  playChapter(unsent, CHAPTER, STONE_FIRST, 'in order, the Stone first');
  ending(unsent, 'in order, the Stone first');

  everyGoalWalked(ok);
};
