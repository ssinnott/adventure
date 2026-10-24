// The endings (DESIGN §9; docs/areas/hearth.md §5 and §9, call 6): the three answers to Wenna's
// question at the Heart, each by the flag it sets, with its name and its pages. The pages are the
// long-form exception (DESIGN §11): shown on their own screen as the answer is taken (ui/ending.ts),
// three to an ending, and held to that screen rather than to the log's three lines (tools/tests/pillars.ts).
// The Hearth each leaves behind is game/stones.ts's.
import type { QuestCond } from '../game/quests.ts';

/** The three endings, in the order Wenna's answers put them. */
export type EndingId = 'reignite' | 'arrive' | 'finish';

export interface Ending {
  /** The flag the answer sets: the ending is taken, and the world after it reads it. */
  flag: string;
  /** Its name, over every page. */
  title: string;
  /** Its pages, read one at a time. */
  pages: readonly string[];
}

export const ENDINGS: Readonly<Record<EndingId, Ending>> = {
  reignite: {
    flag: 'q_end_reignite',
    title: 'The Hearth Relit',
    pages: [
      'The Hearth stands up out of the sea brighter than anyone living has seen it. All across Caldera the tears close, one by one, like doors in a house at night. The sky stays blue.',
      'The world you spent your lives mapping is the world you keep. Vask goes up the stair in irons, and stands trial in Helmstow, and never once looks up.',
      'In the spring, you will walk her home.',
    ],
  },
  arrive: {
    flag: 'q_end_arrive',
    title: 'The Hull Opened',
    pages: [
      'You open the hull. The Rifts stop for good, because there is nothing left for them to hold out.',
      'You walk up out of the dark into daylight the wrong colour, under a sky that goes up and does not stop, and for the first time in your lives you feel real wind. Vask walks out ahead of you, and he is the first to understand what beyond really means.',
      'In the spring, you will walk her home.',
    ],
  },
  finish: {
    flag: 'q_end_finish',
    title: 'The Voyage Finished',
    pages: [
      'The ship was never in orbit. It never arrived. The voyage did not end; it stalled. So you do the one thing nobody asked you to do, and you make it finish.',
      'The Hearth burns harder than it has ever burned, and somewhere far below, engines wake. You will not see the landing. Your grandchildren will, if you tell them the truth.',
      'In the spring, you will walk her home.',
    ],
  },
};

/** Any ending taken, as a `When` list (the plan's `ENDED`): what the road behind waits on. */
export const ENDED: readonly QuestCond[] = Object.values(ENDINGS).map((e) => ({ flag: e.flag }));
