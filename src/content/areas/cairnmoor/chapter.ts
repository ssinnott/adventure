// Cairnmoor's chapter of the one quest, in the journal's words: The Ring. The drove road up onto the
// moor in snow; Fionnlios, where the company sleeps and something speaks in the dark; and the road's
// head above the long lake, where the goal points down to Rime Lodge and Rimewater's chapter (#492).
// content/index.ts joins it with the other areas' in road order; how the words are keyed is in
// src/content/area.ts (`chapter`), and tools/tests/quests.ts checks every key. docs/areas/cairnmoor.md
// §5 and §9 (#481) are its design.
import type { Chapter } from '../../../game/quests.ts';

/** The voice heard inside the ring by night: `o7_voice` sets it, the once. */
export const RING_SPOKE = 'q_ring_spoke';

export const CHAPTER: Chapter = {
  // Begun on the moor, where the Kilns' chapter (#470) ends: nothing of it is asked.
  id: 'ring',
  title: 'The Ring',
  start: { visited: 'highmoor_n7' },
  // Down through the notch with the voice heard: Rimewater's chapter takes it on there. Nothing is a
  // lock: the ring is open ground, and the road's head may be walked first.
  done: { flag: RING_SPOKE, visited: 'longmere_m9' },
  entries: [
    { id: 'road', when: { visited: 'highmoor_n7' },
      text: 'The drove road climbed out of the Kilns\' hills onto High Moor, into snow. The drovers walk it by day and do not stop. Nowhere on the moor is out of the wind but inside the ring.' },
    { id: 'ring', when: { flag: RING_SPOKE },
      text: 'We slept inside Fionnlios, the ring of stones, older than the great Stones. In the dark something spoke, very old and very faint, like a man talking in his sleep: Crew. Report. Nobody slept after.' },
    { id: 'head', when: { seen: 'cairnfield_n8:n8_head' },
      text: 'At its head the drove road goes down through a notch in the Rimefells. Below lies Loch Fada, the long lake, white under ice. The drovers say the lodge-keepers on its shore have people coming up through it.' },
  ],
  goals: [
    { when: { flag: RING_SPOKE, seen: 'cairnfield_n8:n8_head' }, at: 'cairnfield_n8', text: 'From the drove road\'s head in the Cairnfield, down through the notch to the long lake and Rime Lodge on its shore.' },
    { when: { flag: RING_SPOKE }, at: 'cairnfield_n8', text: 'South-west to the drove road, and down it through the Cairnfield to its head above the lakes.' },
    { when: { seen: 'cairnfield_n8:n8_head' }, at: 'highmoor_o7', text: 'Back up the drove road and east to Fionnlios, the ring of stones, and sleep inside it.' },
    { when: { visited: 'highmoor_n7' }, at: 'highmoor_o7', text: 'East off the drove road by the peat-cutter\'s track to Fionnlios, the ring of stones on High Moor: nowhere else is out of the wind.' },
  ],
};
