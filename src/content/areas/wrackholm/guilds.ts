// Wrackholm's guild quests (DESIGN §8; game/guilds.ts): the Salt Compact's Fence's and Factor's rungs,
// offered at any hall of the Compact, the Keel in Saltmouth and the factor's house at Cinderport, one
// ladder (#635). The Fence's deed is a place seen, the stair's foot under the Tide Ship's hold
// (docs/areas/wrackholm.md §4.5): Act II's country, built, with no group and no `after`. The Factor's
// waits for Act IV, as the fourth ranks wait for Act III: its deed is an order from the Dead-Drop's
// counting house in the pack (docs/areas/dead_drop.md §4.3), a `goal` and never an `item`, so a hall
// takes nothing and the Thief's third prestige (#448) still has the orders to carry. The choice that
// the rank opens is Ruan's, put in the Keel (saltreach/maps/saltmouth.ts), not at the report.
import type { GuildQuest } from '../../../game/guilds.ts';
import { SLEEPERS_SEEN } from '../rimewater/chapter.ts';

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
  {
    // A Factor, Act III done and the Sleepers seen: Act IV opens the Compact's last rung (#635). The deed is
    // an order carried up, kept in the pack.
    id: 'compact_factor', guild: 'compact', rank: 3, after: SLEEPERS_SEEN,
    offer: ['"The orders come to the Compact every quarter, sealed, and we do as they say. A Factor should know where from. Bring one up from below."'],
    goal: { item: 'compact_orders' },
    paid: ['"The founder\'s hand." A clerk turns the sheet to the lamp and gives it back. "Keep it. Ruan will want to hear where it was left."'],
    early: ['"You have one already? The founder\'s hand." A clerk turns the sheet to the lamp and gives it back. "Keep it. Ruan will want to hear where it was left."'],
    pay: { gold: 800, xp: 4800 },
    title: 'In the Founder\'s Hand',
    entries: [{ id: 'sent', when: { flag: 'q_compact_factor' }, text: 'The Compact\'s orders come up sealed every quarter. A hall of the Compact sent us to bring one up from below.' }],
    goals: [
      { when: { item: 'compact_orders' }, text: 'Report to a hall of the Compact, the Keel in Saltmouth or the factor\'s house at Cinderport.' },
      { when: { flag: 'q_compact_factor' }, text: 'Bring up one of the Compact\'s orders from below.' },
    ],
  },
];
