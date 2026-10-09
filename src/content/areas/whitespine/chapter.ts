// The Whitespine's chapter of the one quest, in the journal's words: The Bells (a working title), the
// first of Act IV. Over the pass after the two hundred and the bells across the snow; Highcell, its
// brothers at their hours and the Abbot on its seat; the Peak Stone over the crest; the road of cut
// stone out from Sheer Point, the night by her fire and the boat going out along the stones; and the
// Giants' Stair, its toll paid or refused, and the way down into the ash, where Ashfall's chapter
// (#518) takes it on. content/index.ts joins it with the other areas' in road order; how the words
// are keyed is in src/content/area.ts (`chapter`), and tools/tests/quests.ts checks every key.
// docs/areas/whitespine.md §5 and §9 (#505) are its design.
import type { Chapter, When } from '../../../game/quests.ts';
import { SLEEPERS_SEEN } from '../rimewater/chapter.ts';
import { WENNA_TAKEN } from './maps/sheerpoint_i8.ts';
import { STAIR_PASSED, STAIR_TOP } from './maps/highspine_i10.ts';

/** Where Rimewater's The Sleepers ends, the beds seen and the pass's mouth reached; or Monks' Vale walked into. */
const OVER: When = [{ flag: SLEEPERS_SEEN, seen: 'coldmere_k10:k10_mouth' }, { visited: 'monksvale_j11' }];

export const CHAPTER: Chapter = {
  id: 'bells',
  title: 'The Bells',
  start: OVER,
  // The Stair stood on below the king's step, paid or fought: `i10_top` sets it. Nothing is a lock:
  // the gate is open at every hour, the ridge trail from the start and the Stair to whoever pays or
  // wins, so a company may reach the Point before Highcell and the journal reads true in that order.
  done: { flag: STAIR_TOP },
  entries: [
    { id: 'bells', when: { seen: 'monksvale_j11:j11_bells' },
      text: 'Over the pass, bells across the snow: eleven, with gaps between, and then again. The same eleven, the same gaps.' },
    { id: 'cells', when: { seen: 'monastery:hc1_cells' },
      text: 'Highcell\'s brothers keep the hours. One stands in every cell, and not one of them is praying. They walk wrong.' },
    { id: 'board', when: { seen: 'monastery:hc1_board' },
      text: 'Their board of the hours is chalked fresh in the old script: KEEP THE HOURS. KEEP THE HOUSE. OPEN THE GATE.' },
    { id: 'abbot', when: { slain: 'monastery2:hc2_abbot' },
      text: 'Cut, none of them bled. The Abbot\'s robe fell open on grey plate, and overhead the bells rang the hour all the same.' },
    { id: 'stone', when: { seen: 'highspine_i11:i11_stone' },
      text: 'Over the crest the Peak Stone stands whole and steady, and the snow stops a yard short of it all the way round.' },
    { id: 'causeway', when: { seen: 'sheerpoint_i8:i8_causeway' },
      text: 'Off Sheer Point a road of cut stone runs out over the sea toward the Hearth. Every stone glows the way the shards do.' },
    { id: 'night', when: { flag: WENNA_TAKEN },
      text: 'We slept by her fire on the shingle, and woke to her blanket cold. Out along the stones a boat was going, rowed hard.' },
    { id: 'knot', when: { seen: 'sheerpoint_i8:i8_knot' },
      text: 'On the first stone, scratched fresh at the height of a girl\'s shoulder: a loop inside a loop.' },
    { id: 'heart', when: { flag: WENNA_TAKEN },
      text: 'Nobody spoke, till one of us read the Meridian journal\'s last line again: The heart opens for whoever makes it whole.' },
    { id: 'far', when: { flag: WENNA_TAKEN },
      text: 'One Stone is left, on the far side of the sea: the one that was never finished.' },
    { id: 'stair', when: { seen: 'highspine_i10:i10_head' },
      text: 'The Giants\' Stair goes down the Sheer to Ashfall, and at its head a giant sits and holds out his hand for a toll.' },
    { id: 'paid', when: [{ flag: 'toll_paid' }, { flag: 'toll_part' }, { flag: 'toll_coin' }],
      text: 'We paid the king his toll, and his giants stood aside.' },
    { id: 'fought', when: { slain: 'highspine_i10:i10_king' },
      text: 'We would not pay. The king fell on his own Stair, and nobody holds out a hand there now.' },
    { id: 'top', when: { flag: STAIR_TOP },
      text: 'Below the head the Stair goes down the Sheer into the ash, further than we could see. We go down.' },
  ],
  goals: [
    { when: STAIR_PASSED, at: 'highspine_i10', text: 'Past the king and onto the Giants\' Stair on the High Spine, and look down it.' },
    { when: { seen: 'highspine_i10:i10_head' }, at: 'highspine_i10', text: 'The king\'s toll at the head of the Giants\' Stair on the High Spine: pay it, or refuse him.' },
    { when: { flag: WENNA_TAKEN }, at: 'highspine_i10', text: 'South again along the ridge trail to the High Spine, and west off it to the Giants\' Stair, down to Ashfall.' },
    { when: { seen: 'sheerpoint_i8:i8_causeway' }, at: 'sheerpoint_i8', text: 'To the girl out of the hole, at her fire on the shingle under Sheer Point by the causeway, and sleep there.' },
    { when: { seen: 'monastery2:hc2_chapter' }, at: 'sheerpoint_i8', text: 'Over the crest past the Peak Stone, and north along the ridge trail to Sheer Point, where it ends over the sea.' },
    { when: { visited: 'monastery' }, at: 'monastery2', text: 'Through Highcell, past the cells, and down the night stair to its chapter house.' },
    { when: OVER, at: 'monastery', text: 'South after the two hundred: over the pass and down the road through Monks\' Vale to Highcell\'s gate.' },
  ],
};
