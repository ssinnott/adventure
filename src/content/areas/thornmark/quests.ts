// Thornmark's quests, in the journal's words: The Grove Stone (Vask's lead, Sylvane's chisel) and
// The Lost Expedition. How the words are keyed is in src/content/index.ts; tools/tests/quests.ts
// checks every key.
import type { QuestDef } from '../../../game/quests.ts';

export const QUESTS: readonly QuestDef[] = [
  {
    // Vask sets the party on the Stone when he takes the wand; Sylvane, in Thornhold, is the one who
    // takes the chisel. One quest, two voices, and the journal says which is which.
    id: 'grove',
    title: 'The Grove Stone',
    start: [{ flag: 'q_ashcombe_done' }, { flag: 'q_grove' }],
    done: { flag: 'q_grove_done' },
    entries: [
      { id: 'lead', when: { flag: 'q_ashcombe_done' },
        text: 'Vask has more work: the Grove Stone in Thornmark has gone quiet too. He wants to know why, and to see what we find.' },
      { id: 'pass', when: { flag: ['q_ashcombe_done', 'q_greywater_done'] },
        text: 'With Ashcombe and Brandy Hole dealt with, the Wardens have opened the pass to Thornmark.' },
      { id: 'sylvane', when: { flag: 'q_grove' },
        text: 'Elder Sylvane of Thornhold says the Stone did not fail. It was cut, by hands, with tools, and she wants the tool that cut it.' },
      { id: 'stone', when: { seen: 'grove2:g2_stone' },
        text: 'Under the roots stands the Grove Stone, a hand-span of it cut clean away, and the air torn where the cut is.' },
      { id: 'chisel', when: [{ item: 'ashen_chisel' }, { flag: 'q_grove_done' }],
        text: 'The Hand of Ash lies dead at the foot of the Stone, and we have the chisel that cut it.' },
      { id: 'tear', when: { slain: 'grove2:g2_warden' },
        text: 'The Warden of the Cut is dead and the tear has closed. The cut stays; it will need a Lantern to mend.' },
      { id: 'paid', when: { flag: 'q_grove_done' },
        text: 'Sylvane read the chisel\'s runes: Underdeep, and a maintenance mark, not a prayer. Whoever arms the Ashen Hand can reach the Underdeep. She paid 1500 gold, and warned us to keep it from Vask.' },
    ],
    goals: [
      { when: { item: 'ashen_chisel', flag: 'q_grove' }, text: 'Take the chisel to Elder Sylvane in Thornhold.' },
      { when: { item: 'ashen_chisel' }, text: 'Find someone in Thornhold who knows the Grove Stone.' },
      { when: { flag: 'q_grove' }, text: 'Go down under the Grove, south over the bridge, and find the tool that cut the Stone.' },
      { when: { visited: 'thornmark' }, text: 'Find the Grove Stone. The Grove is south over the bridge; Thornhold is north-east.' },
      { when: { flag: ['q_ashcombe_done', 'q_greywater_done'] }, text: 'Take the pass at the east end of the Foreland road into Thornmark.' },
      { when: { flag: 'q_ashcombe_done' }, text: 'Deal with Brandy Hole, so that Captain Hale opens the pass east to Thornmark.' },
    ],
  },
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
