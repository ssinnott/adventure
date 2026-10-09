// The Glasswold's chapter of the one quest, in the journal's words: The Warning (a working title), the
// third of Act IV. Over the Cinder Hills onto the grass, set down at Akordu by the Rider's ride, or up the
// Scarp stair from the Saltings; the glass in the grass, the Riders' white tents at Akordu and the eldest's
// story told whole at her own fire; the watch at the gap, who keep the only way into the Glass, and the
// Glass seen from the gap's last square; and back to Akordu's horse-lines, turned east for Cinderport and
// the last crossing, where Phase 1.5's chapter takes it on. Nothing in it is a lock: the Riders keep the
// Glass in words and its walkers in fact. content/index.ts joins it with the other areas' in road order;
// how the words are keyed is in src/content/area.ts (`chapter`), and tools/tests/quests.ts checks every
// key. docs/areas/glasswold.md §5 and §9 (#531) are its design.
import type { Chapter } from '../../../game/quests.ts';
import { LIT } from '../ashfall/maps/ember_stone.ts';
import { ROAD_WEST } from '../ashfall/maps/emberwaste_e10.ts';
import { STORY, ROAD_EAST } from './maps/wold_d8.ts';
import { WATCH } from './maps/wold_b9.ts';

/** The stair's head, where a Rider at the cairn says what hunts on the Wold (#528). */
const STAIR_HEAD = 'wold_c8:c8_line';

/** The gap's last square, where the sand ends and the Glass and its crown are seen (#530). */
const GAP = 'wold_b9:b9_glass';

export const CHAPTER: Chapter = {
  id: 'warning',
  title: 'The Warning',
  // The Window done, by the road over the Cinder Hills or the Rider's ride to Akordu; or, the Stone lit,
  // up the Scarp stair from the Saltings instead, which ends The Window too (ashfall/chapter.ts).
  start: [{ flag: ROAD_WEST }, { flag: LIT, seen: STAIR_HEAD }],
  // Back at Akordu's horse-lines with the eldest and the watch heard and the Glass seen: `d8_turned` sets
  // it, and Phase 1.5's chapter starts on it. The parts come in any order, and the journal reads true by
  // every way in.
  done: { flag: ROAD_EAST },
  entries: [
    { id: 'grass', when: { seen: 'wold_d9:d9_glass' },
      text: 'There is glass in the steppe\'s grass, in beads and runs, glittering south-west for miles. This land burned once.' },
    { id: 'stair', when: { seen: STAIR_HEAD },
      text: 'At the cairn over the Scarp stair a Rider got up to warn us: what hunts on the Wold kills Riders.' },
    { id: 'akordu', when: { visited: 'wold_d8' },
      text: 'Akordu: the Riders\' white tents in a ring under a mesa. From here they ride down to the port to trade.' },
    { id: 'eldest', when: { flag: STORY },
      text: 'At her own fire the eldest told it whole: where the fire fell, the land burned three days and cooled to glass.' },
    { id: 'watch', when: { flag: WATCH },
      text: 'Three Riders keep the only way into the Glass, at a fire on the last grass. Something is always walking out.' },
    { id: 'glass', when: { seen: GAP },
      text: 'From the gap the Glass runs white to the sky, and far out in it a dark crown. The Riders are right to keep it.' },
    { id: 'east', when: { flag: ROAD_EAST },
      text: 'With the Glass seen we turned east again at Akordu, for Cinderport and the last crossing.' },
  ],
  goals: [
    { when: { flag: [STORY, WATCH], seen: GAP }, at: 'wold_d8', text: 'Back over the Wold to Akordu\'s horse-lines, and east to Cinderport and the last crossing.' },
    { when: { flag: [STORY, WATCH] }, at: 'wold_b9', text: 'Past the watch\'s fire to the gap, where the Wold ends and the Glass begins.' },
    { when: { flag: STORY }, at: 'wold_b9', text: 'West over the Wold under the rim, and south over the dunes to the Riders who keep the way into the Glass.' },
    { when: { visited: 'wold_d8' }, at: 'wold_d8', text: 'In Akordu, the Wold Riders\' camp, to the eldest\'s fire before her tent, against the mesa.' },
    { when: [{ seen: 'wold_d9:d9_glass' }, { seen: STAIR_HEAD }], at: 'wold_d8', text: 'Over the grass of the Wold to Akordu, the Riders\' white tents in a ring under a mesa.' },
    { when: { flag: ROAD_WEST }, at: 'wold_d9', text: 'West up the Riders\' road through the mesas, onto the open steppe of the Wold.' },
  ],
};
