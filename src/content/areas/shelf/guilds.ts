// The Foreland's guild quests (DESIGN §8; game/guilds.ts): the Wardens' first task and the first of
// their rank 1 quests, given out at the Warden Drillyard in Helmstow. Thornmark holds the rest.
import type { GuildQuest } from '../../../game/guilds.ts';

export const GUILDS: readonly GuildQuest[] = [
  {
    id: 'wardens_watch', guild: 'wardens', rank: 0,
    offer: ['The drillmaster looks you over. "A charter makes you a company. It does not make you Wardens. Walk the road east to Captain Hale\'s post at the Scarth and back. Call it a first watch."'],
    goal: { seen: 'shelf:scarth_watch' },
    paid: ['"The Scarth and back, and nobody lost. The Wardens know your faces now."'],
    early: ['"You have walked the Scarth road already? Then you stood your first watch before anyone asked you to."'],
    pay: { gold: 20, xp: 60 },
    title: 'First Watch',
    entries: [{ id: 'sent', when: { flag: 'q_wardens_watch' }, text: 'The drillmaster at the Warden Drillyard sent us to walk the road east to Captain Hale\'s post at the Scarth, and back.' }],
    goals: [
      { when: { seen: 'shelf:scarth_watch' }, text: 'Report to the Warden Drillyard in Helmstow.' },
      { when: { flag: 'q_wardens_watch' }, text: 'Walk the road east to Hale\'s post at the Scarth.' },
    ],
  },
  {
    id: 'wardens_cult', guild: 'wardens', rank: 1,
    offer: ['"Grey robes in the Ashcombe cellar, the reports say. Two bands of them, holding it like a keep. A farm cellar. See they hold nothing."'],
    goal: { slain: ['mill:m_cult1', 'mill:m_cult2'] },
    paid: ['"Both bands. Good. Someone will want to know what a farm cellar was worth holding."'],
    early: ['"The grey robes in the Ashcombe cellar are dead. The report did not say who. Now it does."'],
    pay: { gold: 60, xp: 240 },
    title: "The Cellar's Cult",
    entries: [{ id: 'sent', when: { flag: 'q_wardens_cult' }, text: 'The Wardens want the grey-robed cult out of the Ashcombe cellar: two bands of them.' }],
    goals: [
      { when: { slain: ['mill:m_cult1', 'mill:m_cult2'] }, text: 'Report to the Warden Drillyard in Helmstow.' },
      { when: { flag: 'q_wardens_cult' }, text: 'Kill both bands of cultists in the Ashcombe cellar.' },
    ],
  },
];
