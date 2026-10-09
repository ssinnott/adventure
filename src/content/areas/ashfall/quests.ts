// Ashfall's side quests, in the journal's words: #56's three, 49, 50 and 52, each built on its box
// (#519; §6 of docs/areas/ashfall.md). What the Springs Bring Up (the bathhouse keeper at Scaldwell
// and the stoker at the rock, H10), The Founding Stone (Jenifer the potter at Cinderport and the stone
// under Old Cinder's hall) and The Shovel That Does Not Blunt (Gorran the smith at Cinderport and the
// scavenger by Grimsforge's fire, G11, who moves to the town).
// How the words are keyed is in src/content/area.ts (`quests`); tools/tests/quests.ts checks every key.
import type { QuestDef } from '../../../game/quests.ts';
import { COLD, SPRINGS_BREAK, SPRINGS_LEFT, SPRINGS_COLD } from './maps/cindercoast_h10.ts';
import { FOUNDING_RAISED } from './maps/cindercoast_g10.ts';
import { FOUNDING_UP, FOUNDING_LEFT, SHOVEL_THANE, SHOVEL_WARDENS, SHOVEL_KEPT } from './maps/cinderport.ts';
import { SHOVEL_STORY } from './maps/firemount_g11.ts';

const SHOVEL_SEEN = { seen: 'cindercoast_h10:h10_shovel' };
const LEDGE = { seen: 'firemount_g11:g11_finds' };

export const QUESTS: readonly QuestDef[] = [
  {
    // #56's 49: the bathhouse keeper gives it, and once the stoker at the rock is seen she asks. Left,
    // she gives what came up; broken, the springs go cold for good, and she is told.
    id: 'springs',
    title: 'What the Springs Bring Up',
    start: { flag: 'q_springs' },
    done: [{ flag: SPRINGS_LEFT }, { flag: SPRINGS_COLD }],
    entries: [
      { id: 'keeper', when: { flag: 'q_springs' }, text: 'At Scaldwell a Rider keeps a bathhouse on hot springs. Things come up in the water: a grey part, a bead of glass, a bone.' },
      { id: 'stoker', when: SHOVEL_SEEN, text: 'By the rock past the pools a thing like a boiler on legs shovels, and nothing is on its shovel.' },
      { id: 'break', when: { flag: SPRINGS_BREAK }, text: 'We told the keeper we would break it. Then the springs go cold for good, she said.' },
      { id: 'left', when: { flag: SPRINGS_LEFT }, text: 'We left it to its shovelling. She gave us what came up that dawn, a smooth grey part.' },
      { id: 'cold', when: COLD, text: 'The stoker is down at its rock, and the springs at Scaldwell are cold.' },
    ],
    goals: [
      { when: COLD, text: 'Go back to the bathhouse keeper at Scaldwell.', at: 'cindercoast_h10' },
      { when: { flag: SPRINGS_BREAK }, text: 'Break the stoker at the rock past Scaldwell\'s pools.', at: 'cindercoast_h10' },
      { when: SHOVEL_SEEN, text: 'Tell the bathhouse keeper: break the thing at the rock, or leave it.', at: 'cindercoast_h10' },
      { when: { flag: 'q_springs' }, text: 'See what shovels at the rock past Scaldwell\'s pools.', at: 'cindercoast_h10' },
    ],
  },
  {
    // #56's 50: Jenifer the potter gives it, and takes the stone carried up from Old Cinder's undercroft;
    // then she asks where it stands: raised on the trading ground, where the Riders move off, or taken
    // back down to the dead.
    id: 'founding',
    title: 'The Founding Stone',
    start: [{ flag: 'q_founding' }, { flag: FOUNDING_UP }],
    done: [{ flag: FOUNDING_RAISED }, { flag: FOUNDING_LEFT }],
    entries: [
      { id: 'potter', when: { flag: 'q_founding' }, text: 'Jenifer the potter at Cinderport wants the town\'s founding stone brought up from under the ash of Old Cinder.' },
      { id: 'niche', when: { seen: 'old_cinder2:oc2_stone' }, text: 'In a niche under Old Cinder\'s hall, a block of grey stone, a cup cut in its face and names under it, worn smooth.' },
      { id: 'up', when: { flag: FOUNDING_UP }, text: 'We carried it up to her. She stopped her wheel and took it in both arms.' },
      { id: 'raised', when: { flag: FOUNDING_RAISED }, text: 'It stands on the trading ground in a shrine of new basalt. The Riders have moved their horses off from it.' },
      { id: 'left', when: { flag: FOUNDING_LEFT }, text: 'It went back down to its niche, and the dead keep it dusted.' },
    ],
    goals: [
      { when: { flag: FOUNDING_UP }, text: 'Tell Jenifer where the stone stands: on the trading ground, or with the dead.', at: 'cinderport' },
      { when: { item: 'founding_stone' }, text: 'Carry the founding stone up to Jenifer the potter at Cinderport.', at: 'cinderport' },
      { when: { flag: 'q_founding' }, text: 'Find the founding stone under Old Cinder\'s hall.', at: 'old_cinder2' },
    ],
  },
  {
    // #56's 52: Gorran the smith gives it. The scavenger by Grimsforge's fire, his ledge found, tells
    // where the shovel-head came from and goes to Cinderport; then the smith asks: sold to the thane's
    // agent or to the Wardens, or kept, hafted.
    id: 'shovel',
    title: 'Shovel That Does Not Blunt',
    start: { flag: 'q_shovel' },
    done: [{ flag: SHOVEL_THANE }, { flag: SHOVEL_WARDENS }, { flag: SHOVEL_KEPT }],
    entries: [
      { id: 'smith', when: { flag: 'q_shovel' }, text: 'Gorran the smith at Cinderport bought a grey shovel-head off a scavenger. It will not take a burr, and the thane\'s agent and the Wardens want it.' },
      { id: 'ledge', when: LEDGE, text: 'In a ring of rock by Grimsforge, behind a rope, a ledge of grey parts sorted into heaps, and a draught from below.' },
      { id: 'story', when: { flag: SHOVEL_STORY }, text: 'The scavenger took it off a thing that shovels down there, when it stopped. His ledge found, he has gone to Cinderport.' },
      { id: 'thane', when: { flag: SHOVEL_THANE }, text: 'Gorran sold it for us to the thane\'s agent. The thane\'s forges will have it in pieces by spring.' },
      { id: 'wardens', when: { flag: SHOVEL_WARDENS }, text: 'Gorran sold it for us to the Wardens, who will lock it away.' },
      { id: 'kept', when: { flag: SHOVEL_KEPT }, text: 'Gorran hafted it for us on ash. Its edge takes no burr.' },
    ],
    goals: [
      { when: { flag: SHOVEL_STORY }, text: 'Go back to Gorran at Cinderport: sell the shovel-head, or keep it.', at: 'cinderport' },
      { when: LEDGE, text: 'Ask the scavenger by Grimsforge\'s fire about his ledge.', at: 'firemount_g11' },
      { when: { flag: 'q_shovel' }, text: 'Find where the scavenger by Grimsforge\'s fire gets his finds.', at: 'firemount_g11' },
    ],
  },
];
