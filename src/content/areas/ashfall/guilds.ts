// Ashfall's guild quest (DESIGN §8; game/guilds.ts): the Cartographers' Guild's Surveyor's rung, offered
// and paid at any hall of the Guild, the Map Room in Saltmouth and the Chart House at Cinderport, one
// ladder (#635). The deed is the fourth Meridian journal found in the lower gallery under the Ember
// Stone's housing (docs/areas/ashfall.md §4.8): seen, never taken, so the book stays in the pack. It
// waits for Act IV, as the fourth ranks wait for Act III. The Chart House's shelf fills once it is paid
// (`q_carto_journal_done`, maps/cinderport.ts).
import type { GuildQuest } from '../../../game/guilds.ts';
import { SLEEPERS_SEEN } from '../rimewater/chapter.ts';

/** Where the journal lies: its chest in the lower gallery, opened. */
const FOUND = { seen: 'ember_stone:es_journal' };

export const GUILDS: readonly GuildQuest[] = [
  {
    // Act III done, the Sleepers seen: Act IV opens the Guild's last rungs (#635).
    id: 'carto_journal', guild: 'cartographers', rank: 2, after: SLEEPERS_SEEN,
    offer: ['"Three of the Meridian journals came home to the Guild. The fourth never did. Find where the Company stopped on the far side, and the book with it."'],
    goal: FOUND,
    paid: ['"The fourth, in Fane\'s hand." A clerk copies it fair while you wait and gives it back. "Keep it. The shelf has its copy now."'],
    early: ['"You have the fourth already? Fane\'s hand." A clerk copies it fair while you wait and gives it back. "Keep it. The shelf has its copy now."'],
    pay: { gold: 500, xp: 3600 },
    title: 'The Fourth Journal',
    entries: [{ id: 'sent', when: { flag: 'q_carto_journal' }, text: 'The Guild has three of the Meridian Company\'s journals and a gap on its shelf for the fourth. A hall of the Guild sent us to find it on the far side.' }],
    goals: [
      { when: FOUND, text: 'Report to a hall of the Guild, the Map Room in Saltmouth or the Chart House at Cinderport.' },
      { when: { flag: 'q_carto_journal' }, text: 'Find the Meridian Company\'s fourth journal on the far side.' },
    ],
  },
];
