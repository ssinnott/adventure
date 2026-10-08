// Rimewater's chapter of the one quest, in the journal's words: The Sleepers, the last of Act III. Down
// the notch to Rime Lodge, where people come up through Loch Fada's ice; the four nights at its inn and
// the girl out of the hole on the fourth; the door under Loch Fuar that opens under her palm; the beds
// below it; and south over the pass after the two hundred, where the Whitespine's chapter (#505) takes
// it on. content/index.ts joins it with the other areas' in road order; how the words are keyed is in
// src/content/area.ts (`chapter`), and tools/tests/quests.ts checks every key. docs/areas/rimewater.md
// §5 and §9 (#492) are its design.
import type { Chapter } from '../../../game/quests.ts';
import { NIGHTS, WENNA_UP } from './maps/rime_lodge.ts';

/** The beds under Loch Fuar seen: `sb2_beds` sets it, the once. The act turns on it. */
export const SLEEPERS_SEEN = 'q_sleepers_seen';

const [FIRST, SECOND, THIRD, FOURTH] = NIGHTS;

export const CHAPTER: Chapter = {
  // Begun on Loch Fada, where Cairnmoor's The Ring ends.
  id: 'sleepers',
  title: 'The Sleepers',
  start: { visited: 'longmere_m9' },
  // The beds seen and the pass's mouth reached, in either order: the step is the beds, and the Matron
  // falls or does not. Nothing is a lock but the door, which the girl's flag opens (content/locks.ts).
  done: { flag: SLEEPERS_SEEN, seen: 'coldmere_k10:k10_mouth' },
  entries: [
    { id: 'lodge', when: { visited: 'longmere_m9' },
      text: 'Rime Lodge stands on Loch Fada\'s shore, and its keepers keep a fire out on the ice by a hole. At night people come up through it, a few at a time, taken below from all over the world. Down there, they say, doors open for some and not for others.' },
    { id: 'night_1', when: { flag: FIRST },
      text: 'Our first night at the lodge one man came up through the ice, alone. In the morning he sat by the fire in a lodge blanket, blue to the lips.' },
    { id: 'night_2', when: { flag: SECOND },
      text: 'The second night three came up together, and would not let go of each other\'s hands.' },
    { id: 'night_3', when: { flag: THIRD },
      text: 'The third night a family came up. A girl had led them to the stair, they said, and gone back down.' },
    { id: 'night_4', when: { flag: FOURTH },
      text: 'The fourth night nobody came up. In the morning the keepers stood back from the hole, and it was clicking.' },
    { id: 'up', when: { flag: WENNA_UP },
      text: 'Up through the hole came something that clicked once for each of us, and six more behind it. Last out was a girl with a nail in her fist: "Are you the ones my mother sent?" She would not go home. "There are two hundred more of us down there. The doors know me."' },
    { id: 'door', when: { visited: 'sleepers_bay' },
      text: 'Down a crack in Loch Fuar\'s ice, a wall of grey with a door in it: no handle, no seam. It opened under her palm, and a voice in the wall said "Captain?" She flinched, and waited at the door while we went down.' },
    { id: 'sleepers', when: { seen: 'sleepers_bay2:sb2_beds' },
      text: 'Under the stair lay rows of long glass beds, frosted over. Wiped, one showed a face we had seen before, asleep. On the door\'s inside, scratched with a nail at a girl\'s shoulder: THE BLOOD OPENS THE DOOR. We didn\'t grow here. We were brought.' },
    { id: 'south', when: { flag: SLEEPERS_SEEN, seen: 'coldmere_k10:k10_mouth' },
      text: 'The two hundred she went back for were not in the beds. South of Loch Fuar a road climbs into the range between two walls of rock, its snow trodden by many feet. We go south after them.' },
  ],
  goals: [
    { when: { flag: SLEEPERS_SEEN }, at: 'coldmere_k10', text: 'South after the two hundred: up the road from Loch Fuar into the range, to the mouth of the pass.' },
    { when: { visited: 'sleepers_bay' }, at: 'sleepers_bay2', text: 'Down the stair under Loch Fuar\'s ice to the Sleepers\' Bay at its foot.' },
    { when: { flag: WENNA_UP }, at: 'coldmere_k9', text: 'West along the shore to Loch Fuar, the cold loch, and down the crack in its ice to the door, where she waits.' },
    { when: { flag: FOURTH }, at: 'longmere_m9', text: 'Out by the lake wall\'s door onto Loch Fada\'s ice, to the hole by the keepers\' fire, and see what comes up.' },
    { when: { visited: 'longmere_m9' }, at: 'rime_lodge', text: 'Stand the nights at Rime Lodge: a night at a time at its inn, and in the morning see who came up through the ice.' },
  ],
};
