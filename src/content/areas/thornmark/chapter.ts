// Thornmark's chapter of the one quest, in the journal's words: The Grove Stone, Vask's lead,
// Sylvane's chisel and the treaty's seal in Henlys (his words are in the Foreland's chapter).
// content/index.ts joins it with the other areas' in road order; how the words are keyed is in
// src/content/area.ts (`chapter`), and tools/tests/quests.ts checks every key.
import type { Chapter } from '../../../game/quests.ts';

export const CHAPTER: Chapter = {
  // Vask sets the party on the Stone when he takes the wand; Sylvane, in Thornhold, is the one who
  // takes the chisel, and sends the company south to the treaty whose seal is the chisel's mark.
  // The chapter ends on the seal seen, or shown by Senara, with the chisel paid for, in whichever
  // order. A company that sees the treaty first reads a seal it does not know (Senara's words set
  // q_seal_unknown), and the chisel, found after, makes the match.
  id: 'grove',
  title: 'The Grove Stone',
  start: [{ flag: 'q_ashcombe_done' }, { flag: 'q_grove' }],
  done: [{ seen: 'deepthorn_i4:i4_treaty', flag: 'q_grove_done' }, { flag: ['q_treaty', 'q_grove_done'] }],
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
    { id: 'lead', when: { flag: 'q_grove_done' },
      text: 'Sylvane has seen the chisel\'s mark before: on the seal of a treaty her people keep in Henlys, south through the deep.' },
    { id: 'seal_early', when: { flag: 'q_seal_unknown' },
      text: 'In Henlys, a treaty two hundred years old with two seals: the Crown\'s, and the elves\' oldest mark, which means nothing to us yet.' },
    { id: 'seal', when: [{ seen: 'deepthorn_i4:i4_treaty', flag: 'q_grove_done' }, { flag: ['q_treaty', 'q_grove_done'] }, { flag: 'q_seal_matched' }],
      text: 'In Henlys, a treaty two hundred years old, sealed with the elves\' oldest mark. It is the mark on the chisel that cut the Grove Stone, line for line.' },
  ],
  goals: [
    { when: { flag: 'q_grove_done' }, at: 'deepthorn_i4', text: 'Go south through the deep to Henlys, and see the seal on its treaty.' },
    { when: { item: 'ashen_chisel', flag: 'q_grove' }, at: 'thornhold', text: 'Take the chisel to Elder Sylvane in Thornhold.' },
    { when: { item: 'ashen_chisel' }, at: 'thornhold', text: 'Find someone in Thornhold who knows the Grove Stone.' },
    { when: { flag: 'q_grove' }, at: 'grove2', text: 'Go down under the Grove, south over the bridge, and find the tool that cut the Stone.' },
    { when: { visited: 'thornmark' }, at: 'grove2', text: 'Find the Grove Stone. The Grove is south over the bridge; Thornhold is north-east.' },
    { when: { flag: 'q_ashcombe_done' }, at: 'thornmark', text: 'Take the pass at the east end of the Foreland road into Thornmark.' },
  ],
};
