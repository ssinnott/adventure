// Cairnmoor's side quests, in the journal's words: #56's three, each built on its box (#482; §6 of
// docs/areas/cairnmoor.md). The Watcher's Tally (the Watcher at his hut by the ring, and his
// predecessor's grave in Carn Dubh), The Ring on the Bog Body (the peat-cutter at his hut on the bog)
// and The Faces on the Tors (the stonecutter at his fire under the tors). #56's 40, the coach, is
// Rimewater's (#494). How the words are keyed is in src/content/area.ts (`quests`);
// tools/tests/quests.ts checks every key.
import type { QuestDef } from '../../../game/quests.ts';

export const QUESTS: readonly QuestDef[] = [
  {
    // #56's 37: the Watcher gives it (#434, call 8). The first page of the last Watcher's tally lies
    // under his hands in Carn Dubh, behind his wight; read from the pack, it goes back to the Watcher,
    // who takes it, and the page's nights go into his lintel or down to the Lanterns at the Lodge.
    id: 'tally',
    title: 'The Watcher\'s Tally',
    start: [{ flag: 'o7_watcher_met' }, { flag: 'q_tally_page' }],
    done: [{ flag: 'q_tally_lintel' }, { flag: 'q_tally_lanterns' }],
    entries: [
      { id: 'watcher', when: { flag: 'o7_watcher_met' }, text: 'The Watcher at his hut by the ring counts the bog lights, as the Watchers have for four hundred years. The last one stopped, and they buried him out among the cairns with the first page of his tally.' },
      { id: 'grave', when: { slain: 'cairns:cd1_watcher' }, text: 'In Carn Dubh a cell newer than the rest, a man on its slab in a watchman\'s coat, and a wight stood over him. It lies across his feet now.' },
      { id: 'page', when: { seen: 'cairns:cd1_page' }, text: 'Under his hands, the first page of his tally: a row of strokes to a night, and a ring drawn small beside eleven of the rows.' },
      { id: 'given', when: { flag: 'q_tally_page' }, text: 'The Watcher read the page twice and counted the rings in its margin. Eleven, he says, from before the hut was built.' },
      { id: 'lintel', when: { flag: 'q_tally_lintel' }, text: 'He cut the eleven nights into his lintel, before the first of the old cuts, and put the page in the fire. Now it is all in one place, he says.' },
      { id: 'lanterns', when: { flag: 'q_tally_lanterns' }, text: 'He sewed the page into oilskin and sent it down to the Lanterns at Rime Lodge with the drovers.' },
    ],
    goals: [
      { when: { flag: 'q_tally_page' }, text: 'Answer the Watcher at his hut: the page\'s nights cut in his lintel, or the page sent down to the Lanterns.', at: 'highmoor_o7' },
      { when: { item: 'watchers_page' }, text: 'Take the first page of the tally to the Watcher at his hut by the ring.', at: 'highmoor_o7' },
      { when: { flag: 'o7_watcher_met' }, text: 'Find the last Watcher\'s grave in Carn Dubh, the great cairn in the Cairnfield, and the page under his hands.', at: 'cairns' },
    ],
  },
  {
    // #56's 38: the peat-cutter puts it. Sold to Tallis's man at the Lodge or carried for the elves,
    // the ring is gone and the body walks on by night; put back on its hand, it lies down in its
    // cutting, and the bog bodies by the hut get up no more (`until`).
    id: 'bogring',
    title: 'The Ring on the Bog Body',
    start: { flag: 'q_bog_ring' },
    done: [{ flag: 'q_ring_sold' }, { flag: 'q_ring_elves' }, { flag: 'q_ring_back' }],
    entries: [
      { id: 'cutter', when: { flag: 'q_bog_ring' }, text: 'A peat-cutter on the bog below the ring dug a man out of his cutting with a rope round his neck and a ring on his hand. He kept the ring. Every night the body gets up and goes back to the cutting, feeling in the peat.' },
      { id: 'sold', when: { flag: 'q_ring_sold' }, text: 'The ring goes down to the Lodge, to the man there who buys old gold for Tallis. The body still gets up at night.' },
      { id: 'elves', when: { flag: 'q_ring_elves' }, text: 'We carry the ring for the elves. The body still gets up at night.' },
      { id: 'back', when: { flag: 'q_ring_back' }, text: 'We put the ring back on his hand, and the peat-cutter laid him in his cutting with the turves over him. He has not got up since.' },
    ],
    goals: [
      { when: { flag: 'q_bog_ring' }, text: 'Answer the peat-cutter at his hut on the bog: the ring to Tallis\'s man at the Lodge, to the elves, or back on the body\'s hand.', at: 'highmoor_o8' },
    ],
  },
  {
    // #56's 39: the stonecutter puts it. Home, he goes down to Rime Lodge (its words are Rimewater's)
    // and the last face stays half cut; finished, that tor never stands (`until` on its troll).
    id: 'faces',
    title: 'The Faces on the Tors',
    start: { flag: 'q_faces' },
    done: [{ flag: 'q_faces_home' }, { flag: 'q_faces_finished' }],
    entries: [
      { id: 'mason', when: { flag: 'q_faces' }, text: 'A stonecutter from Rime Lodge camps under the tors on High Moor and cuts faces in them, as his father did. The Lodge wants him home now the trolls get up. He says they got up when the ring began to speak.' },
      { id: 'home', when: { flag: 'q_faces_home' }, text: 'The stonecutter rolled up his chisels and went down the drove road to the Lodge. The last tor has a brow and one eye.' },
      { id: 'finished', when: { flag: 'q_faces_finished' }, text: 'We kept the stonecutter company while he finished the last face. It has both its eyes now.' },
    ],
    goals: [
      { when: { flag: 'q_faces' }, text: 'Answer the stonecutter at his fire under the tors: home to Rime Lodge, or the last face finished.', at: 'highmoor_o8' },
    ],
  },
];
