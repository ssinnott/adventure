// Saltreach's side quests, in the journal's words: #56's four, each built with its box (§6 of
// docs/areas/saltreach.md). So far Passage Paid (C4, #171): the barge on a shoal by the ford, its
// hold full of people. Cut loose, they go ashore and a crew comes up the bank after them; pushed off,
// the master's word pays the boat's fare out of Saltmouth (Kitto's passage reads `q_passage_owed`).
// How the words are keyed is in src/content/area.ts (`quests`); tools/tests/quests.ts checks every
// key.
import type { QuestDef } from '../../../game/quests.ts';

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
];
