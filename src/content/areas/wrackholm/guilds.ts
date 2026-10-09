// Wrackholm's guild quest (DESIGN §8; game/guilds.ts): the Salt Compact's Fence's rung, the quest a
// Fence is offered at any hall of the Compact, the Keel in Saltmouth now and the factor's house at
// Cinderport when it opens (#635). The deed is a place seen, the stair's foot under the Tide Ship's
// hold (docs/areas/wrackholm.md §4.5): Act II's country, built, with no group and no `after`. The
// other three rungs owed ride Act IV's dungeons (DESIGN §8, Act IV's guild quests).
import type { GuildQuest } from '../../../game/guilds.ts';

export const GUILDS: readonly GuildQuest[] = [
  {
    id: 'compact_fence', guild: 'compact', rank: 2,
    offer: ['"Cargo goes aboard the Tide Ship off Wrackholm and none comes off. I keep the count and the count does not close. Find where it goes."'],
    goal: { seen: 'dead_drop_stair:dd_foot' },
    paid: ['"A stair under the hold. So that is where it goes." She sets the glass down without a sound. "You will want the rest. Not yet."'],
    early: ['"You have been down the hold\'s stair already?" She sets the glass down without a sound. "Then the count closed before I asked. You will want the rest. Not yet."'],
    pay: { gold: 200, xp: 600 },
    title: 'Where the Cargo Goes',
    entries: [{ id: 'sent', when: { flag: 'q_compact_fence' }, text: 'Cargo goes aboard the Tide Ship off Wrackholm and none comes off. Ruan at the Keel wants to know where it goes.' }],
    goals: [
      { when: { seen: 'dead_drop_stair:dd_foot' }, text: 'Report to a hall of the Compact, the Keel in Saltmouth or the factor\'s house at Cinderport.' },
      { when: { flag: 'q_compact_fence' }, text: 'Find where the Tide Ship\'s cargo goes.' },
    ],
  },
];
