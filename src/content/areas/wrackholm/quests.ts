// Wrackholm's side quests, in the journal's words: #56's four, each built with its map (#192; §6 of
// docs/areas/wrackholm.md). The Captain's Brother (Kitto at the landing, Colan by the rows in Kelp
// Hole), The Hermit of the Point (Merryn on the point, and the Keel or Tallis in Saltmouth),
// Every Name in the Column (Hale freed, at the Tide Ship's rail, and the clerk's book from the
// cabin) and What the Smugglers Feed (Loveday on Saltmouth's steps, and Tam at the black pool).
// How the words are keyed is in src/content/area.ts (`quests`); tools/tests/quests.ts checks every
// key.
import type { QuestDef } from '../../../game/quests.ts';
import { BEAST_SLAIN } from './maps/smugglers_cove2.ts';

export const QUESTS: readonly QuestDef[] = [
  {
    // #56's 25: Colan tells the company what he is, and they carry the truth to Kitto or his letter,
    // sealed. Told, Kitto carries for the cove no more.
    id: 'brother',
    title: 'The Captain\'s Brother',
    start: [{ flag: 'q_brother' }, { flag: 'q_brother_found' }],
    done: [{ flag: 'q_brother_told' }, { flag: 'q_brother_delivered' }],
    entries: [
      { id: 'kitto', when: { flag: 'q_brother' }, text: 'Kitto, who rowed us over, will not meet our eyes, and asks a thing ashore: his brother Colan went below with a cargo two years back as a guard, and sent one letter. The crews say he is in the cove still.' },
      { id: 'found', when: { flag: 'q_brother_found' }, text: 'We found Colan among the crates in Kelp Hole, his hands grey to the wrist, keeping the rows. He is not coming out.' },
      { id: 'truth', when: { flag: 'q_brother_truth' }, text: 'We said we would tell Kitto what his brother is. Colan stood up out of his chain and left it where it fell.' },
      { id: 'letter', when: { flag: 'q_brother_letter' }, text: 'We took Colan\'s letter for Kitto, sealed, to say that he is well. He sat back down and gathered up the chain.' },
      { id: 'told', when: { flag: 'q_brother_told' }, text: 'We told Kitto. He will not carry for the cove again, not a sack, not a soul, and every man who rows for him stays ashore with him.' },
      { id: 'delivered', when: { flag: 'q_brother_delivered' }, text: 'Kitto took the letter unopened and laid it in the boat\'s locker on the other one. He will read them both when Colan comes out, he says.' },
    ],
    goals: [
      { when: { flag: 'q_brother_truth' }, text: 'Tell Kitto, at the landing on Wrackholm, what his brother is.', at: 'wrackholm_e6' },
      { when: { item: 'colans_letter' }, text: 'Take Colan\'s letter to Kitto at the landing on Wrackholm.', at: 'wrackholm_e6' },
      { when: { flag: 'q_brother_found' }, text: 'Answer Colan among the crates in Kelp Hole: the truth to Kitto, or his letter.', at: 'smugglers_cove' },
      { when: { flag: 'q_brother' }, text: 'Find Colan by the rows in Kelp Hole, above the landing.', at: 'smugglers_cove' },
    ],
  },
  {
    // #56's 26: the founder's last letter, to the Keel, where it is the Compact's line's first proof
    // (DESIGN §10.2), or to Tallis, who pays more.
    id: 'hermit',
    title: 'The Hermit of the Point',
    start: { flag: 'q_hermit' },
    done: [{ flag: 'q_hermit_hall' }, { flag: 'q_hermit_tallis' }],
    entries: [
      { id: 'asked', when: { flag: 'q_hermit' }, text: 'Merryn, on the point of Wrackholm\'s east rocks, has cut a stroke for every ship in since the day the Compact\'s founder died, ten years gone. She has his last letter, and asks us to carry it to the hall in Saltmouth, or to whoever pays.' },
      { id: 'carried', when: { flag: 'q_hermit_carried' }, text: 'We carry the founder\'s letter, ten years in Merryn\'s coat. The hall in Saltmouth is owed it; Tallis would pay for it.' },
      { id: 'hall', when: { flag: 'q_hermit_hall' }, text: 'Ruan took the letter at the Keel and put it where it does not leave her. Ten years the hall\'s orders have come in a dead man\'s hand, and it did not know.' },
      { id: 'tallis', when: { flag: 'q_hermit_tallis' }, text: 'We sold the letter to Tallis. He knows now what the Compact\'s hall does not: whose hand its orders come in.' },
    ],
    goals: [
      { when: { item: 'founders_letter' }, text: 'Take the founder\'s letter to Saltmouth: to Ruan at the Keel, or to Tallis on the quay.', at: 'saltmouth' },
      { when: { flag: 'q_hermit' }, text: 'Answer Merryn at her cell on the point of the east rocks: carry the letter, or not yet.', at: 'wrackholm_f6' },
    ],
  },
  {
    // #56's 27: the clerk's book read against the freed, and where the thirty go, Saltmouth by the
    // boat or home by the coast road, which decides who is at Rime Lodge (#56's 41).
    id: 'column',
    title: 'Every Name in the Column',
    start: { flag: 'q_column' },
    done: [{ flag: 'q_column_saltmouth' }, { flag: 'q_column_road' }],
    entries: [
      { id: 'hale', when: { flag: 'q_column' }, text: 'Hale waits at the Tide Ship\'s rail with the thirty for the clerk\'s book from the cabin aft. Every name the hold carried is in it, he says, and where the ones not in the rows went.' },
      { id: 'book', when: { seen: 'tide_ship2:ts2_clerk' }, text: 'The clerk\'s book, from his corner of the captain\'s cabin: names and homes down the left, a tick for each down the right, and beside some, DELIVERED BELOW, BY THE DEEP MINE. Wenna of Gullwick is one of them.' },
      { id: 'saltmouth', when: { flag: 'q_column_saltmouth' }, text: 'The thirty go to Saltmouth by the boat, a day, to walk off onto the Compact\'s quay. Wat\'s elder boy is among them, and Hale goes with them.' },
      { id: 'road', when: { flag: 'q_column_road' }, text: 'The thirty go home up the coast road, a week on their feet, and Hale with them to the pass. Wat\'s elder boy is among them.' },
    ],
    goals: [
      { when: { item: 'clerks_book', flag: 'q_column' }, text: 'Take the clerk\'s book up to Hale at the Tide Ship\'s rail.', at: 'tide_ship' },
      { when: { flag: 'q_column' }, text: 'Fetch the clerk\'s book from the cabin aft on the Tide Ship\'s lower deck.', at: 'tide_ship2' },
    ],
  },
  {
    // #56's 28: the choice is the fight. The beast slain, Tam goes home to the steps; left alive, his
    // mother is told why he stays.
    id: 'feed',
    title: 'What the Smugglers Feed',
    start: [{ flag: 'q_feed' }, { flag: 'q_feed_tam' }],
    done: [{ flag: 'q_feed_home' }, { flag: 'q_feed_told' }],
    entries: [
      { id: 'loveday', when: { flag: 'q_feed' }, text: 'Loveday, on Saltmouth\'s harbour steps, wants her son Tam back from Wrackholm. He went over in the spring to carry for the crews; the money stopped, and he did not come.' },
      { id: 'tam', when: { flag: 'q_feed_tam' }, text: 'Tam, a boy off Saltmouth\'s steps, is at the back of the sea cave under Kelp Hole, feeding the great devilfish in the black pool. It spares whoever feeds it, and he asks us to leave it be.' },
      { id: 'told', when: { flag: 'q_feed_told' }, text: 'We told Loveday to her face: alive, feeding a thing in a hole, and all right. She will be on the steps when he is done being all right.' },
      { id: 'home', when: { flag: 'q_feed_home' }, text: 'The great devilfish is dead and the arrangement with it. Tam went home to the harbour steps, where he says out loud whose orders the cove takes.' },
    ],
    goals: [
      { when: [{ ...BEAST_SLAIN, flag: 'q_feed' }, { ...BEAST_SLAIN, flag: 'q_feed_tam' }], text: 'Go back to Tam at the black pool, at the back of the sea cave.', at: 'smugglers_cove2' },
      { when: { flag: 'q_feed_tam' }, text: 'Tell Loveday on Saltmouth\'s harbour steps what Tam is doing, or end the arrangement at the black pool.', at: 'saltmouth' },
      { when: { flag: 'q_feed' }, text: 'Find Tam in the sea cave under Kelp Hole.', at: 'smugglers_cove2' },
    ],
  },
];
