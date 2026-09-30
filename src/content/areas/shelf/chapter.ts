// The Foreland's chapter of the one quest, in the journal's words: The Quiet Farm, Vask's contract.
// content/index.ts joins it with the other areas' in road order; how the words are keyed is in
// src/content/area.ts (`chapter`), and tools/tests/quests.ts checks every key.
import type { Chapter } from '../../../game/quests.ts';

export const CHAPTER: Chapter = {
  id: 'ashcombe',
  title: 'The Quiet Farm',
  start: { flag: 'q_ashcombe' },
  // Done once the wand is back, Hild has asked after her daughter at Gullwick and the keeper's log is
  // read at Crowness.
  done: { flag: ['q_ashcombe_done', 'q_wenna'], seen: 'downs_e3:e3_log' },
  entries: [
    { id: 'hired', when: { flag: 'q_ashcombe' },
      text: 'Lord Vask, the Regent-Warden, has hired us: the Ashcombe farm south of Helmstow has gone quiet. He wants anything we find there that is not a rat.' },
    { id: 'wenna', when: { flag: 'q_wenna' },
      text: 'At Gullwick, Hild asked us to find her daughter, Wenna, gone with the boat the night the light failed. She wants the name said wherever we go.' },
    { id: 'keeper', when: { seen: 'downs_e3:e3_log' },
      text: 'At Crowness Light, the keeper\'s log of that night: the Hearth out eleven times, and the gaps between even, as if measured.' },
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
    // A company that did the farm first: Gullwick and Crowness are still to come.
    { when: { flag: ['q_ashcombe_done', 'q_wenna'] }, at: 'downs_e3', text: 'Crowness Light, past Gullwick: the keeper who counted that night.' },
    { when: { flag: 'q_ashcombe_done' }, at: 'downs_f3', text: 'Gullwick, west on the Salt Road: a mother asks for her daughter.' },
    { when: { item: 'survey_wand' }, at: 'keep', text: 'Take the survey wand to Lord Vask in Helmstow.' },
    { when: { visited: 'mill' }, at: 'mill', text: 'Search the cellar under the Ashcombe farmhouse.' },
    { when: { flag: ['q_ashcombe', 'q_wenna'], seen: 'downs_e3:e3_log' }, at: 'shelf', text: 'Find out why Ashcombe has gone quiet: south of Helmstow, then east along the Foreland road.' },
    // Hired: Gullwick first, where the road west goes, then Crowness, and then the farm.
    { when: { flag: ['q_ashcombe', 'q_wenna'] }, at: 'downs_e3', text: 'Before Ashcombe, Crowness Light: on along the Salt Road past Gullwick, to the keeper who counted that night.' },
    { when: { flag: 'q_ashcombe' }, at: 'downs_f3', text: 'Before Ashcombe, Gullwick: west on the Salt Road from Brandy Hole\'s beach, a mother asks every company for her daughter.' },
    // Shown only to a company that began a later chapter before Vask hired it.
    { when: {}, at: 'keep', text: 'The Regent-Warden is hiring in Helmstow.' },
  ],
};
