// Rimewater's guild quest (DESIGN §8; game/guilds.ts): the Wardens' fourth rank's second ask, given
// through the cousin's captains at the Drillyard and waiting for Act III (#439): a sword at the ice-hole
// on the fourth night. The Kilns hold the first. The Lodge's hall gives the Lanterns' ladder as every
// Lantern hall does, its first task the ladder's own.
import type { GuildQuest } from '../../../game/guilds.ts';
import { FOURTH_RANKS_OPEN } from '../kilns/guilds.ts';

export const GUILDS: readonly GuildQuest[] = [
  {
    id: 'wardens_hole', guild: 'wardens', rank: 3, after: FOURTH_RANKS_OPEN,
    offer: ['"The Lanterns at Rime Lodge keep a hole open in the loch\'s ice, and take in what comes up it. On the fourth night they stand back from it. Stand there for us."'],
    goal: { slain: 'longmere_m9:m9_night_4' },
    paid: ['"The fourth night, and you stood." Ordgar writes it in the book in his boot. "The cousin will hear it before the walls do."'],
    early: ['"You stood at the Lodge\'s hole on the fourth night, and nobody sent you." Ordgar writes it in the book in his boot.'],
    pay: { gold: 300, xp: 2400 },
    title: 'A Sword at the Hole',
    entries: [{ id: 'sent', when: { flag: 'q_wardens_hole' }, text: 'Captain Ordgar of the Drillyard wants a Warden\'s sword at Rime Lodge\'s ice-hole on the fourth night.' }],
    goals: [
      { when: { slain: 'longmere_m9:m9_night_4' }, text: 'Report to the Warden Drillyard in Helmstow.' },
      { when: { flag: 'q_wardens_hole' }, text: 'Stand at the ice-hole off Rime Lodge on the fourth night.' },
    ],
  },
];
