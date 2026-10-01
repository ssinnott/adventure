// Saltreach's guild quests (DESIGN §8; game/guilds.ts): the Salt Compact's first task and its first
// rank, given out at the Keel, Saltmouth's harbour tavern (#182). The run of brandy past the customs
// house; then the crews' crate on C6's quay and the watcher's place on Wrackholm's west cliff. The
// crews are the Hand's now, and killing them costs nothing here (#151, call 4).
import type { GuildQuest } from '../../../game/guilds.ts';

export const GUILDS: readonly GuildQuest[] = [
  {
    // The cask is the warehouse clerk's to hand over once the run is taken, and the customs house
    // shows itself only while the cask is carried, so the run cannot be done early.
    id: 'compact_run', guild: 'compact', rank: 0,
    offer: ['"There is a cask of brandy waiting with my clerk at the warehouse on the barge quay, past the land gate. Bring it to the Keel the long way, by the customs house door, and slowly. I want to see how you walk."'],
    goal: { seen: 'saltmouth:sm_customs_run' },
    item: 'brandy_cask',
    paid: ['"Past the door and nobody stopped you. That is the whole trade." She does not smile, but the glass comes down softer.', '"You run for the Keel now. The brandy is still four."'],
    pay: { gold: 30, xp: 300 },
    title: 'The Long Way',
    entries: [{ id: 'sent', when: { flag: 'q_compact_run' }, text: 'Ruan at the Keel sent us for a cask of brandy from the warehouse on the barge quay, to be carried into Saltmouth the long way, past the customs house door.' }],
    goals: [
      { when: { seen: 'saltmouth:sm_customs_run' }, text: 'Bring the cask to the Keel in Saltmouth.' },
      { when: { item: 'brandy_cask' }, text: 'Carry the cask past the customs house door in Saltmouth.' },
      { when: { flag: 'q_compact_run' }, text: 'Fetch the cask from the warehouse clerk on the barge quay outside Saltmouth.' },
    ],
  },
  {
    id: 'compact_crate', guild: 'compact', rank: 1,
    offer: ['"The river crews have stopped paying the warehouse and started carrying for somebody else. There is a crate of theirs on the barge quay. Open it and tell me what is in it, and whose."'],
    goal: { seen: 'saltings_c6:c6_crate' },
    paid: ['"None of that is ours and none of it is cheap. Whoever pays the crews pays well." She turns a cup on the bar. "We pay on time. Mostly."'],
    early: ['"You have been into the crews\' crate already? Then you know more than my clerk does. Keep it to this room."'],
    pay: { gold: 100, xp: 600 },
    title: 'What the Crews Carry',
    entries: [{ id: 'sent', when: { flag: 'q_compact_crate' }, text: 'The Keel wants to know what the river crews carry now, and for whom. A crate of their cargo lies on the barge quay outside Saltmouth.' }],
    goals: [
      { when: { seen: 'saltings_c6:c6_crate' }, text: 'Report to the Keel in Saltmouth.' },
      { when: { flag: 'q_compact_crate' }, text: 'Open a crate of the crews\' cargo on the barge quay outside Saltmouth.' },
    ],
  },
  {
    id: 'compact_lookout', guild: 'compact', rank: 1,
    offer: ['"Somebody on Wrackholm watches this harbour. I feel it on the back of my neck when I open the shutters. Find where they lie. Kitto takes the Keel\'s people across for half."'],
    goal: { seen: 'wrackholm_e6:e6_lookout' },
    paid: ['"A bed of stones worn to a man\'s shape, and the man gone. So they lie long and they come back." She looks at the shutters. "I will have somebody sit on that cliff a while."'],
    early: ['"You have found the place on the west cliff already? Then you have been colder than I have. Have a brandy. That one is paid."'],
    pay: { gold: 150, xp: 900 },
    title: 'The Watcher on Wrackholm',
    entries: [{ id: 'sent', when: { flag: 'q_compact_lookout' }, text: 'Somebody watches Saltmouth from Wrackholm\'s west cliff. Ruan at the Keel wants the place found.' }],
    goals: [
      { when: { seen: 'wrackholm_e6:e6_lookout' }, text: 'Report to the Keel in Saltmouth.' },
      { when: { flag: 'q_compact_lookout' }, text: 'Find the watcher\'s place on Wrackholm\'s west cliff.' },
    ],
  },
];
