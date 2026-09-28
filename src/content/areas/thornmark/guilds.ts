// Thornmark's guild quests (DESIGN §8; game/guilds.ts): the Wardens' lost watchtower and the
// garrison's strongbox, given out at the Warden Drillyard in Helmstow; the Lanterns' two survey
// markers, given out at either Lantern hall.
import type { GuildQuest } from '../../../game/guilds.ts';

export const GUILDS: readonly GuildQuest[] = [
  {
    id: 'wardens_tower', guild: 'wardens', rank: 1,
    offer: ['"We kept a tower in Thornmark once, north-west of the road. Something large moved into its base, and the garrison moved out. Take it back."'],
    goal: { slain: 'thornmark:tm_ogre' },
    paid: ['"The tower is ours again, roofless as it is. A Warden will stand in it by the end of the month."'],
    early: ['"The Thornmark tower is cleared, and nobody sent you. The Wardens pay for it all the same."'],
    pay: { gold: 150, xp: 900 },
    title: 'The Old Watchtower',
    entries: [{ id: 'sent', when: { flag: 'q_wardens_tower' }, text: 'Something has made a den in the Wardens\' old watchtower, in Thornmark\'s north-west. They want it back.' }],
    goals: [
      { when: { slain: 'thornmark:tm_ogre' }, text: 'Report to the Warden Drillyard in Helmstow.' },
      { when: { flag: 'q_wardens_tower' }, text: 'Clear the old Warden watchtower in Thornmark\'s north-west.' },
    ],
  },
  {
    id: 'wardens_strongbox', guild: 'wardens', rank: 2,
    offer: ['"When the tower fell, its garrison ran for Thornhold, and the elves kept the gate shut. They buried the pay chest by the north wall and came home without it."'],
    goal: { seen: 'thornmark:tm_strongbox' },
    paid: ['"The garrison\'s chest, dug up at last. Keep what was in it. They would have wanted it spent."'],
    early: ['"You found the garrison\'s chest before we told you it was there? Keep it. This is for the word."'],
    pay: { gold: 200, xp: 1500 },
    title: "The Garrison's Strongbox",
    entries: [{ id: 'sent', when: { flag: 'q_wardens_strongbox' }, text: 'The watchtower\'s garrison buried its pay chest by Thornhold\'s north wall when the elves would not let them in.' }],
    goals: [
      { when: { seen: 'thornmark:tm_strongbox' }, text: 'Report to the Warden Drillyard in Helmstow.' },
      { when: { flag: 'q_wardens_strongbox' }, text: 'Find the garrison\'s chest by Thornhold\'s north wall.' },
    ],
  },
  {
    id: 'lanterns_marker', guild: 'lanterns', rank: 1,
    offer: ['"One of our survey markers stands in a lake in Thornmark. It went dark in the spring. Go and look at it, and tell us whether the glass is broken or only out."'],
    goal: { seen: 'thornmark:lake' },
    paid: ['"Dark, with the glass whole. That is worse than broken. Thank you for looking."'],
    early: ['"You have seen the marker in the lake already. Dark, then. We were afraid of that."'],
    pay: { gold: 150, xp: 900 },
    title: 'The Dark Marker',
    entries: [{ id: 'sent', when: { flag: 'q_lanterns_marker' }, text: 'The Lanterns\' survey marker in a Thornmark lake has gone dark. They want to know whether its glass is broken.' }],
    goals: [
      { when: { seen: 'thornmark:lake' }, text: 'Report to a Lantern hall, in Helmstow or Thornhold.' },
      { when: { flag: 'q_lanterns_marker' }, text: 'Find the dark survey marker in Thornmark\'s lake.' },
    ],
  },
  {
    id: 'lanterns_second', guild: 'lanterns', rank: 2,
    offer: ['"There is a second marker on the hills south-east of the river, and it is still lit. Nobody can tell us why one burns and the other does not. Go and stand by it."'],
    goal: { seen: 'thornmark:second_marker' },
    paid: ['"Still burning. We will have a Reader up on those hills before the month is out."'],
    early: ['"You found the lit marker before we asked. Then you have seen what we cannot explain."'],
    pay: { gold: 200, xp: 1500 },
    title: 'The Second Marker',
    entries: [{ id: 'sent', when: { flag: 'q_lanterns_second' }, text: 'A second Lantern survey marker stands on the hills south-east of Thornmark\'s river, still lit.' }],
    goals: [
      { when: { seen: 'thornmark:second_marker' }, text: 'Report to a Lantern hall, in Helmstow or Thornhold.' },
      { when: { flag: 'q_lanterns_second' }, text: 'Find the lit marker on the hills south-east of the river.' },
    ],
  },
];
