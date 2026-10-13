// Hearth Isle's quests in the journal's words. #56's 57, The Pilgrims in the Bowl (§6 of
// docs/areas/hearth_isle.md), as far as the isle goes (H6, #753): the three pilgrims met in the Bowl and
// a token taken, or none. Its end on the Stair's first landing, the rearguard slain where no token or
// verdict holds, and the goal under the temple, are #758's. How the words are keyed is in
// src/content/area.ts (`quests`); tools/tests/quests.ts checks every key.
import type { QuestDef } from '../../../game/quests.ts';
import { PILGRIMS, TOKEN_COUSIN, TOKEN_HOLD, TOKEN_TALLIS, HELD } from './maps/hearthisle_h6.ts';

export const QUESTS: readonly QuestDef[] = [
  {
    // #56's 57, at 28: begun on meeting any of the three; done once a claimant holds the bottom, by a
    // token carried or the Council's verdict (HELD).
    id: 'bowl_pilgrims',
    title: 'The Pilgrims in the Bowl',
    start: { flag: PILGRIMS },
    done: HELD,
    entries: [
      { id: 'met', when: { flag: PILGRIMS }, text: 'Three pilgrims in the Bowl, stranded by the Hand\'s landing: a Warden of the cousin\'s, an elf of the hold\'s, a hand of Tallis\'s. Each wants their token carried down.' },
      { id: 'badge', when: { flag: TOKEN_COUSIN }, text: 'We carry the Wardens\' badge. The cousin\'s people will stand at the bottom.' },
      { id: 'seal', when: { flag: TOKEN_HOLD }, text: 'We carry the hold\'s seal. The hold\'s people will stand at the bottom.' },
      { id: 'tally', when: { flag: TOKEN_TALLIS }, text: 'We carry Tallis\'s tally. Tallis\'s people will stand at the bottom.' },
    ],
    goals: [
      { when: { flag: PILGRIMS }, text: 'Choose whose token to carry down, or none.', at: 'hearthisle_h6' },
    ],
  },
];
