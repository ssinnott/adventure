// Thornmark's chapter of the one quest, in the journal's words: The Grove Stone, Vask's lead and
// Sylvane's chisel (his words are in the Foreland's chapter). content/index.ts joins it with the
// other areas' in road order; how the words are keyed is in src/content/area.ts (`chapter`), and
// tools/tests/quests.ts checks every key.
import type { Chapter } from '../../../game/quests.ts';

export const CHAPTER: Chapter = {
  // Vask sets the party on the Stone when he takes the wand; Sylvane, in Thornhold, is the one who
  // takes the chisel. One chapter, two voices, and the journal says which is which.
  id: 'grove',
  title: 'The Grove Stone',
  start: [{ flag: 'q_ashcombe_done' }, { flag: 'q_grove' }],
  done: { flag: 'q_grove_done' },
  entries: [
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
    { when: { item: 'ashen_chisel', flag: 'q_grove' }, at: 'thornhold', text: 'Take the chisel to Elder Sylvane in Thornhold.' },
    { when: { item: 'ashen_chisel' }, at: 'thornhold', text: 'Find someone in Thornhold who knows the Grove Stone.' },
    { when: { flag: 'q_grove' }, at: 'grove2', text: 'Go down under the Grove, south over the bridge, and find the tool that cut the Stone.' },
    { when: { visited: 'thornmark' }, at: 'grove2', text: 'Find the Grove Stone. The Grove is south over the bridge; Thornhold is north-east.' },
    { when: { flag: 'q_ashcombe_done' }, at: 'thornmark', text: 'Take the pass at the east end of the Foreland road into Thornmark.' },
  ],
};
