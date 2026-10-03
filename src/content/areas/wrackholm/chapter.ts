// Wrackholm's chapter of the one quest, in the journal's words: The Stone Carried Home. Kelp Hole's
// crates, the ship at anchor, the hold, Hale and the papers, the Stone found under its Warden, and
// the Stone set back on its plinth at Stienwierde, which ends Saltreach's chapter too and lights the
// Hearth's first step. content/index.ts joins it with the other areas' in road order; how the words
// are keyed is in src/content/area.ts (`chapter`), and tools/tests/quests.ts checks every key.
// docs/areas/wrackholm.md §5 and §9 (#191) are its design.
import type { Chapter } from '../../../game/quests.ts';

/** The Stone home with the captain's table opened: the papers carried, and the Wall begun on it. */
export const WRACK_DONE = { flag: 'q_tide_home', seen: 'tide_ship2:ts2_table' } as const;

export const CHAPTER: Chapter = {
  // Begun on landing: only Kitto's boat reaches the isle, so a company still in the Delta keeps the
  // Tide Stone's goals.
  id: 'wrack',
  title: 'The Stone Carried Home',
  start: { visited: 'wrackholm_e6' },
  // The Stone set back by the plinth's hand-in (delta_b5), and the papers taken off the ship: the
  // Wall begins on the same, so its own first goal is the way east.
  done: WRACK_DONE,
  entries: [
    { id: 'cove', when: { seen: 'smugglers_cove:kh1_crates' },
      text: 'In Kelp Hole the crews land their cargo under the rock, crates to the roof and every lid stamped Helmstow customs, passed, not one stamp smudged. The crews take their orders from the grey hands that keep the rows behind the crates, and the grey hands take theirs from below.' },
    { id: 'ship', when: [{ seen: 'wrackholm_f6:f6_clifftop' }, { seen: 'wrackholm_f6:f6_boats' }, { seen: 'tide_ship:ts_aboard' }],
      text: 'From the cliff on the east rocks we saw the ship at anchor below, black and deep-laden, low in the water and showing no colours. By night the boats go out to her from the shingle one behind another, lanterns hooded to a slit, and nobody in them speaks.' },
    { id: 'hold', when: { seen: 'tide_ship3:ts3_beam' },
      text: 'The hold carries two kinds of cargo: shards of stone packed in straw like eggs, each with a light in it, and people chained in rows, fishermen and farmers and children. The beam over the rows is carved deep, the letters fresh in the black oak: EVERY SHARD IS A STEP.' },
    // Hale is in the last row once #156 has taken him from the Scarth (q_hale_taken).
    { id: 'hale', when: { flag: 'q_hale_freed' },
      text: 'Captain Hale was in the last row, thin as a rake and his beard gone white, telling the boy beside him to keep his feet out of the wet. The Regent got his copy of the ledger, he said, and came for him that same night. When the last iron dropped he went up the ladder with the others, to the boats, and did not look back.' },
    { id: 'papers', when: { seen: 'tide_ship2:ts2_table' },
      text: 'On the captain\'s table we found the ship\'s papers and its log. The papers count every cargo passed and sent to the one place, BELOW, and midway the girl from Gullwick, delivered below months since by way of the dwarves\' deepest mine. The log is in a hand none of us can read.' },
    { id: 'stone', when: { seen: 'tide_ship_rift:tide_ship_rift_hoard' },
      text: 'We went in at the tear in the forward hold, and at its heart the Warden of the Tide stood over the Stone. When it fell the tear went quiet behind us, and we took up the Tide Stone, glowing green through its sacking.' },
    { id: 'home', when: { flag: 'q_tide_home' },
      text: 'We carried the Stone home by Kitto\'s boat and west over the fen, and set it in its socket at Stienwierde, where it fitted the cut exactly. That night the Hearth burned steadier than it had since the Queen died. From the dark temples to the south, very faint, something began to sing.' },
  ],
  // No goal on F6: its floor of 13 would put the plinth's step over B5's band. The way east is the
  // Wall's own first goal.
  goals: [
    { when: { flag: 'q_tide_home' }, at: 'tide_ship2', text: 'Back to the Tide Ship for the ship\'s papers, down the main hatch to the lower deck and aft to the captain\'s table.' },
    { when: { item: 'tide_stone' }, at: 'delta_b5', text: 'Carry the Stone home: back to the landing and Kitto\'s boat, and from Saltmouth west over the fen to its plinth in the Delta, at Stienwierde.' },
    { when: { visited: 'tide_ship' }, at: 'tide_ship3', text: 'Go down the main hatch and through the lower deck to the Hold, and to the green light behind its forward bulkhead.' },
    { when: { visited: 'wrackholm_e6' }, at: 'tide_ship', text: 'Go east over the moor to the cliffs over the anchorage, and out to the Tide Ship by night in the oarsman\'s boat from the shingle.' },
  ],
};
