// Sunderwood's chapter of the one quest, in the journal's words: The Wall, the last of Act II. The
// wood split in half, the wall at the Sunder's floor, the Tide Ship's papers read at Lantern Watch
// and Vask in the rain at its gate, whose question ends the act. content/index.ts joins it with the
// other areas' in road order; how the words are keyed is in src/content/area.ts (`chapter`), and
// tools/tests/quests.ts checks every key.
import type { Chapter } from '../../../game/quests.ts';

export const CHAPTER: Chapter = {
  // Begun by the Tide Ship's papers, carried or read: a company that takes the Sunder first finds
  // the wall all the same, and its rim, crossing and wall are written when the papers come. Once
  // Wrackholm's chapter names its done flag (#191), it takes the items' place here, so the papers
  // picked up on the ship no longer take the goal from Wrackholm's last steps.
  id: 'wall',
  title: 'The Wall',
  start: [{ item: 'ships_papers' }, { item: 'ships_log' }, { flag: 'papers_read' }],
  // Vask's question answered, either way: each answer sets its own flag and this one.
  done: { flag: 'q_salt_done' },
  entries: [
    { id: 'rim', when: { seen: 'eaves_j2:j2_rim' },
      text: 'At the Eaves\' rim the wood is split in half. The trees along the edge have gone to glass, and the gorge falls away further than the rain lets us see.' },
    { id: 'crossing', when: { seen: 'eaves_k2:k2_bridge' },
      text: 'We went over the gorge at Sunderfall on the rope bridge. The rain fell past our boots the whole way and never landed that we could hear.' },
    { id: 'wall', when: { seen: 'the_sunder2:su2_wall' },
      text: 'At the bottom of the Sunder, under the soil and the rock, a wall: flat, without a join, going down further than our light could reach. We put a hand to it, and it was warm.' },
    // What the Reader read: the papers, the log or both.
    { id: 'seal', when: { flag: 'seal_read' },
      text: 'At Lantern Watch the Reader read the papers. Every cargo, the shards and the people, went below under the Helmstow customs seal, the same as on the crates in the caves, and every page is countersigned by the Regent.' },
    { id: 'name', when: { flag: 'log_read' },
      text: 'At Lantern Watch the Reader read the Tide Ship\'s log: a clerk\'s cipher, and at the foot of each entry, in another ink, one name. Vask.' },
    { id: 'rain', when: { flag: 'q_vask_rain' },
      text: 'Vask came to the Watch himself, in the rain, with two Wardens, and asked for us by name. We knew half of what he knew, he said, and he told us the rest: the world is a cage, the Hearth its lock; beyond the sky there is somewhere real, and a door he means to open.' },
    { id: 'yes', when: { flag: 'q_vask_yes' },
      text: 'We told him we would help him. He did not thank us for it.' },
    { id: 'no', when: { flag: 'q_vask_no' },
      text: 'We told him no. He did not seem surprised.' },
    { id: 'girl', when: { flag: 'q_salt_done' },
      text: '"I don\'t need you. I have the girl." So Wenna is alive, below, and his.' },
    // Home is the act's last line, not a step: Helmstow's change is #157's, and its maps are not
    // in the band.
    { id: 'home', when: { flag: 'q_salt_done' },
      text: 'There is nothing left for us on this side of the gorge. West, then, and home to Helmstow.' },
  ],
  goals: [
    { when: { flag: 'papers_read', seen: 'the_sunder2:su2_wall' }, at: 'lantern_watch', text: 'Word at Lantern Watch: riders at the gate, by day, asking for us by name. Go down and meet them.' },
    { when: { flag: 'papers_read' }, at: 'the_sunder2', text: 'The papers are read. Now the gorge: go down the Sunder to its floor, under the ledges beyond the bridge.' },
    { when: [{ item: 'ships_papers', seen: 'the_sunder2:su2_wall' }, { item: 'ships_log', seen: 'the_sunder2:su2_wall' }], at: 'lantern_watch', text: 'Carry the papers across the gorge to Lantern Watch, and have them read there.' },
    { when: [{ item: 'ships_papers', seen: 'eaves_k2:k2_bridge' }, { item: 'ships_log', seen: 'eaves_k2:k2_bridge' }], at: 'the_sunder2', text: 'Before the Watch, the Sunder: go down by the door on the first landing of the Sunder\'s Mouth.' },
    { when: [{ item: 'ships_papers' }, { item: 'ships_log' }], at: 'eaves_k2', text: 'Go east through the Eaves to Sunderfall and cross the rope bridge over the gorge.' },
  ],
};
