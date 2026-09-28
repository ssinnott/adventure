// The Foreland's walkthrough: its chapter of the one quest, The Quiet Farm, played from a new game by
// the game's own moves and checked a step at a time (tools/walk.ts). Thornmark's plays the chain.
import type { Walkthrough } from '../../area.ts';
import { CHAPTER } from './chapter.ts';
import { newWalk, meetWho, walkThrough, see, fight, playChapter, quest, listen } from '../../../../tools/walk.ts';
import type { Step, Walk } from '../../../../tools/walk.ts';
import { EAST } from '../../../game/types.ts';

/** Vask hires the company: before the chapter, or its last step for a company that came early. */
export const HIRE: Step = { name: 'the hire', play: (w) => meetWho(w, 'q_ashcombe') };

/** The chapter once hired: Gullwick, the farm, the cellar and the wand taken back. */
export const STEPS: readonly Step[] = [
  { name: 'to Gullwick', play: (w) => meetWho(w, 'q_wenna') },
  { name: 'to Ashcombe', play: (w) => walkThrough(w, 'shelf', 23, 20, EAST, 'mill') },
  { name: 'the cellar', play: (w) => { see(w, 'mill:mill_lantern'); fight(w, 'mill:m_warden'); see(w, 'mill:mill_core'); } },
  { name: 'the wand', play: (w) => meetWho(w, 'survey_wand') },
];

/** The farm first and Gullwick last: the chapter's goal sends a company that did it so to Hild. */
export const FARM_FIRST: readonly Step[] = [...STEPS.slice(1), STEPS[0]];

/** A new game hired by Vask, the way the chapter begins in order. */
export function hired(w: Walk): void {
  listen(w);
  w.ok(!quest(w), 'a new game has no quest yet');
  HIRE.play(w);
  w.ok(w.news.at(-1) === 'New quest: The Dimming.', `Vask's hire begins the one quest (${w.news.at(-1)})`);
}

export const walkthrough: Walkthrough = (ok) => {
  const w = newWalk(ok);
  hired(w);
  playChapter(w, CHAPTER, STEPS, 'in order');
  ok(quest(w)?.pages.find((p) => p.def === CHAPTER)?.done === true && w.news.includes('Chapter complete: The Quiet Farm.'), 'in order, the wand back to Vask finishes The Quiet Farm');
};
