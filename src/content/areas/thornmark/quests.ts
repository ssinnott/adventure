// Thornmark's side quests, in the journal's words: The Lost Expedition, a subplot. Its chapter of
// the one quest is in ./chapter.ts. How the words are keyed is in src/content/area.ts (`quests`);
// tools/tests/quests.ts checks every key.
import type { QuestDef } from '../../../game/quests.ts';

export const QUESTS: readonly QuestDef[] = [
  {
    // The Lost Expedition (DESIGN.md 10.3) begins with the first of the Meridian Company's journals.
    // The rest of its trail is not built yet, so it has no `done` and stays open. Nothing takes the
    // journal (no hand-in asks for it and no shop buys it; tools/tests/quests.ts holds to that), so the item
    // alone keeps the entry written.
    id: 'meridian',
    title: 'The Lost Expedition',
    start: { item: 'meridian_journal' },
    entries: [
      { id: 'journal', when: { item: 'meridian_journal' },
        text: 'Where the Warden of the Cut fell lay the first volume of the Meridian Company\'s journal. The Company went down to map the Underdeep thirty years ago, and never came back.' },
    ],
    goals: [
      { when: { item: 'meridian_journal' }, text: 'Find the other volumes of the Meridian journal.' },
    ],
  },
];
