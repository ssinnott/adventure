// Ashfall's guild quests (DESIGN §8; game/guilds.ts): the Cartographers' Guild's Surveyor's and Mapmaker's
// rungs, offered and paid at any hall of the Guild, the Map Room in Saltmouth and the Chart House at
// Cinderport, one ladder (#635). The Surveyor's deed is the fourth Meridian journal found in the lower
// gallery under the Ember Stone's housing (docs/areas/ashfall.md §4.8): seen, never taken, so the book
// stays in the pack. It waits for Act IV, as the fourth ranks wait for Act III. The Chart House's shelf
// fills once it is paid (`q_carto_journal_done`, maps/cinderport.ts). The Mapmaker's deed is the firelight
// on the one way to Fane's fire, on Meridian Camp's third level (docs/areas/meridian_camp.md §8, the
// camp's 7): seen, and nothing taken, for Fane's map is the Ranger's. It needs no `after` of its own: the
// ladder keeps it behind the Surveyor's, which makes a company Mapmakers once it is paid.
import type { GuildQuest } from '../../../game/guilds.ts';
import { SLEEPERS_SEEN } from '../rimewater/chapter.ts';

/** Where the journal lies: its chest in the lower gallery, opened. */
const FOUND = { seen: 'ember_stone:es_journal' };
/** Where the Company ended: the firelight on the one way to the fire, which no one comes to the fire without seeing. */
const FIRE = { seen: 'meridian_camp3:mc3_fire' };

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
  {
    // A Mapmaker, the Surveyor's paid: Fane's fire is the Company's end, and seeing it is the deed (#635).
    id: 'carto_fane', guild: 'cartographers', rank: 3,
    offer: ['"The Guild has the Company as far as the vents. Beyond that, nothing came home. Find where they ended."'],
    goal: FIRE,
    paid: ['"Firelight on the iron, and smoke." A clerk inks a flame on the Guild\'s map, past where the ink stopped. "Then that is where they ended."'],
    early: ['"You have been there already? Firelight on the iron, and smoke." A clerk inks a flame on the Guild\'s map, past where the ink stopped. "Then that is where they ended."'],
    pay: { gold: 800, xp: 4800 },
    title: 'Fane\'s Fire',
    entries: [{ id: 'sent', when: { flag: 'q_carto_fane' }, text: 'The Guild has the Meridian Company as far as the vents. A hall of the Guild sent us to find where it ended.' }],
    goals: [
      { when: FIRE, text: 'Report to a hall of the Guild, the Map Room in Saltmouth or the Chart House at Cinderport.' },
      { when: { flag: 'q_carto_fane' }, text: 'Find where the Meridian Company ended.' },
    ],
  },
];
