// Saltreach's chapter of the one quest, in the journal's words: The Tide Stone. Rietum saw the
// Stone go by, the plinth stands empty, the temples count, and at Saltmouth the word on Hale and
// the ship the Stone went to. content/index.ts joins it with the other areas' in road order; how
// the words are keyed is in src/content/area.ts (`chapter`), and tools/tests/quests.ts checks
// every key. docs/areas/saltreach.md §5 and §9 (#180) are its design.
import type { Chapter } from '../../../game/quests.ts';

/** The Foreland's chapter done: Hild's word, the keeper's log read and the wand handed in. */
const FARM_DONE = { flag: ['q_ashcombe_done', 'q_wenna'], seen: 'downs_e3:e3_log' } as const;

export const CHAPTER: Chapter = {
  // Begun once the Foreland and the Grove are both done, or by a person who names the Stone: Wytske
  // on Rietum's quay, or Kitto on Saltmouth's, to a company there first. A condition holds one
  // `seen`, so the two ends are joined twice over, each with the other's flag that stands for its
  // event: Senara's q_treaty for the treaty seen, the keeper's q_keeper for his log.
  id: 'tide',
  title: 'The Tide Stone',
  start: [
    { flag: ['q_ashcombe_done', 'q_wenna', 'q_grove_done', 'q_treaty'], seen: 'downs_e3:e3_log' },
    { flag: ['q_ashcombe_done', 'q_wenna', 'q_grove_done', 'q_keeper'], seen: 'deepthorn_i4:i4_treaty' },
    { flag: 'c3_saw_stone' },
    { flag: 'sm_ship_word' },
  ],
  // The Stone set back on its plinth: Wrackholm's chapter's last step, and its flag (#191).
  done: { flag: 'q_tide_home' },
  entries: [
    { id: 'saw', when: { flag: 'c3_saw_stone' },
      text: 'At Rietum, Wytske saw the Stone go downriver at midsummer on a barge with no lamp lit, the hold green through the sacking like a lantern in a sack. It came from Stienwierde, west over the fen.' },
    { id: 'plinth', when: { seen: 'delta_b5:b5_plinth' },
      text: 'At Stienwierde the plinth stands empty, its socket cut clean, a man\'s width. Nothing fell from it.' },
    { id: 'count', when: [{ flag: 'q_tide_bell' }, { flag: 'q_tide_bell_done' }],
      text: 'At the Drowned Temples\' dry door a priestess counts, and says the god sang the tides once and now only counts, one to ten and eleven a beat late. She says the number again and again, and it means nothing to us yet.' },
    { id: 'stair', when: { seen: 'drowned_temples:dt1_stair' },
      text: 'Inside the temples the count comes up the apse\'s stair from below, many voices at once: one to ten, a breath, and eleven.' },
    // News, not a step: the Warden is there once #156 has taken Hale from the Scarth, so no goal waits on it.
    { id: 'hale', when: { flag: 'sm_hale_word' },
      text: 'In Saltmouth a Warden come down the coast road: Captain Hale\'s copy of the ledger reached the Regent, and Hale has not been seen since. His post at the Scarth is held by men nobody knows.' },
    { id: 'ship', when: { flag: 'sm_ship_word' },
      text: 'Kitto at the quay\'s end saw the midsummer barge too. It never tied up but went straight out past the harbour lamps to a ship riding at anchor off Wrackholm, the smugglers\' isle. His boat goes out there, for a fare.' },
  ],
  // The boat is the last goal and stays the goal until the Stone is home: Wrackholm's chapter takes
  // the company on from the landing.
  goals: [
    { when: { flag: 'sm_ship_word', seen: 'delta_b5:b5_plinth' }, at: 'saltmouth', text: 'Take Kitto\'s boat from the end of Saltmouth\'s quay out to the ship off the smugglers\' isle.' },
    // Saltmouth taken first: the plinth before the boat, not a lock, as the Wall's Sunder before its Watch.
    { when: { flag: 'sm_ship_word' }, at: 'delta_b5', text: 'Before the boat, the Tide Stone\'s empty plinth: up from Saltmouth and west over the fen to Stienwierde.' },
    { when: [{ flag: 'q_tide_bell' }, { flag: 'q_tide_bell_done' }, { seen: 'drowned_temples:dt1_in' }], at: 'saltmouth', text: 'Go south through the Saltings to Saltmouth, where the barges end, and ask on its quay where the Stone\'s barge went.' },
    { when: { seen: 'delta_b5:b5_plinth' }, at: 'delta_b6', text: 'Go south from the plinth to the Drowned Temples, dark since the Stone went, where a priestess keeps the dry door.' },
    { when: { flag: 'c3_saw_stone' }, at: 'delta_b5', text: 'Go west over the fen from Rietum to Stienwierde, where the Tide Stone stood.' },
    { when: { visited: 'delta_d5' }, at: 'upperwater_c3', text: 'Go up the spur to Rietum on the Upper Water, where the barges tie up.' },
    { when: [FARM_DONE, { flag: ['q_ashcombe_done', 'q_wenna', 'q_keeper', 'q_grove_done'], seen: 'deepthorn_i4:i4_treaty' }], at: 'delta_d5', text: 'Go down off Kestrel Edge by the Salt Road into the Delta, the Tide Stone\'s country.' },
  ],
};
