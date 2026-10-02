// Saltreach's side quests, in the journal's words: #56's four, each built with its box (§6 of
// docs/areas/saltreach.md). So far Passage Paid (C4, #171): the barge on a shoal by the ford, its
// hold full of people. Cut loose, they go ashore and a crew comes up the bank after them; pushed off,
// the master's word pays the boat's fare out of Saltmouth (Kitto's passage reads `q_passage_owed`).
// And The Tide Bell (the Drowned Temples, #175): the priestess at B6's dry door asks for the bell the
// Choirmaster beats time on, and takes it at the first meeting from a company she never asked.
// How the words are keyed is in src/content/area.ts (`quests`); tools/tests/quests.ts checks every
// key.
import type { QuestDef } from '../../../game/quests.ts';
import { BELL_HUNG, COUNT_STOPPED } from './maps/drowned_temples.ts';

export const QUESTS: readonly QuestDef[] = [
  {
    id: 'passage',
    title: 'Passage Paid',
    start: { flag: 'q_passage' },
    done: [{ flag: 'q_passage_freed' }, { flag: 'q_passage_owed' }],
    entries: [
      { id: 'shoal', when: { flag: 'q_passage' },
        text: 'A barge sits on a shoal in the Long Water below Rietum, and its master, Hessel, wants our backs to it. Its hold is full of people he swears paid passage to Saltmouth.' },
      { id: 'freed', when: { flag: 'q_passage_freed' },
        text: 'We cut the barge\'s passengers loose and they waded ashore. Hessel says every crew on the river will hear of it.' },
      { id: 'owed', when: { flag: 'q_passage_owed' },
        text: 'We pushed Hessel\'s barge off the shoal. The boat at Saltmouth\'s quay carries us to Wrackholm on his word, no fare.' },
    ],
    goals: [
      { when: { flag: 'q_passage' }, text: 'Decide what to do about the barge on the shoal by the ford, on the Long Water below Rietum.', at: 'delta_c4' },
    ],
  },
  {
    id: 'tide_bell',
    title: 'The Tide Bell',
    start: { flag: 'q_tide_bell' },
    done: BELL_HUNG,
    entries: [
      { id: 'asked', when: { flag: 'q_tide_bell' }, text: 'The priestess at the Drowned Temples\' dry door asked us for the temple\'s bell. It went below with the choir, and the master of the choir beats the count on it. The frame inside the door stands empty.' },
      { id: 'taken', when: COUNT_STOPPED, text: 'We took the bell from the Choirmaster in the choir under the temples. The count stopped when it fell.' },
      { id: 'hung', when: BELL_HUNG, text: 'The bell hangs on its frame in the narthex again. The priestess rang it inside the door, ten even strokes and the last a beat late.' },
    ],
    goals: [
      { when: [{ item: 'tide_bell' }], text: 'Bring the bell up to the priestess at the Drowned Temples\' dry door.', at: 'delta_b6' },
      { when: { flag: 'q_tide_bell' }, text: 'Go down to the choir under the Drowned Temples, where the Choirmaster beats the count on the bell, and take it.', at: 'drowned_temples2' },
    ],
  },
];
