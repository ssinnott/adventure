// The Foreland's chapter of the one quest, in the journal's words: The Quiet Farm, Vask's contract.
// content/index.ts joins it with the other areas' in road order; how the words are keyed is in
// src/content/area.ts (`chapter`), and tools/tests/quests.ts checks every key.
import type { Chapter } from '../../../game/quests.ts';

export const CHAPTER: Chapter = {
  id: 'ashcombe',
  title: 'The Quiet Farm',
  start: { flag: 'q_ashcombe' },
  done: { flag: 'q_ashcombe_done' },
  entries: [
    { id: 'hired', when: { flag: 'q_ashcombe' },
      text: 'Lord Vask, the Regent-Warden, has hired us: the Ashcombe farm south of Helmstow has gone quiet. He wants anything we find there that is not a rat.' },
    { id: 'lantern', when: { seen: 'mill:mill_lantern' },
      text: 'A dead Lantern in the cellar under Ashcombe, a note in her hand: "Not failing. CUT. The Grove Stone is next. Tell Vask nothing."' },
    { id: 'wand', when: [{ item: 'survey_wand' }, { flag: 'q_ashcombe_done' }],
      text: 'We have a cracked survey wand, Lantern work.' },
    { id: 'rift', when: { seen: 'mill:mill_core' },
      text: 'Deep in the cellar, a Rift: a tear in the floor, breathing heat, and beside it a shard of worked Wardstone.' },
    { id: 'warden', when: { slain: 'mill:m_warden' },
      text: 'We killed the Rift Warden that kept the tear.' },
    { id: 'paid', when: { flag: 'q_ashcombe_done' },
      text: 'Vask turned the wand over in his fingers and pocketed it. If he knew what he held, nothing in his face admitted it. He paid 300 gold.' },
    // His lead, here and not in Thornmark's chapter, so it is written when he gives it, whichever
    // chapter the company did first.
    { id: 'lead', when: { flag: 'q_ashcombe_done' },
      text: 'He spoke of the Grove Stone in Thornmark: gone quiet too, he said, and he wants to know why.' },
  ],
  goals: [
    { when: { item: 'survey_wand' }, at: 'keep', text: 'Take the survey wand to Lord Vask in Helmstow.' },
    { when: { visited: 'mill' }, at: 'mill', text: 'Search the cellar under the Ashcombe farmhouse.' },
    { when: { flag: 'q_ashcombe' }, at: 'shelf', text: 'Find out why Ashcombe has gone quiet: south of Helmstow, then east along the Foreland road.' },
    // Shown only to a company that began a later chapter before Vask hired it.
    { when: {}, at: 'keep', text: 'The Regent-Warden is hiring in Helmstow.' },
  ],
};
