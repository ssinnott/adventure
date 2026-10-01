// Saltreach's guild quests (DESIGN §8; game/guilds.ts): the Cartographers' first task and their
// first rank, given out at the Map Room in Saltmouth (#181); and the Salt Compact's, given out at
// the Keel, Saltmouth's harbour tavern (#182): the run of brandy past the customs house, then the
// crews' crate on C6's quay and the watcher's place on Wrackholm's west cliff. The crews are the
// Hand's now, and killing them costs nothing at the Keel (#151, call 4). The skills both guilds
// teach are #18's.
import type { GuildQuest } from '../../../game/guilds.ts';

export const GUILDS: readonly GuildQuest[] = [
  {
    // Every company walks past both stones on the way in, so the chain is laid only once the Guild
    // has sent it back up the road: the milestones' events wait on the taking.
    id: 'carto_chain', guild: 'cartographers', rank: 0,
    offer: ['She takes a chain from its peg, a hundred links, and looks you over. "A stranger will do. Go back up the Salt Road and chain it stone to stone, the Edge to the Saltings. See if they tell true."'],
    goal: { seen: 'saltings_c6:c6_milestone' },
    paid: ['"The stones say two and the chain says two. They agree, which is rarer than you would think." She hangs the chain back on its peg and writes your names under it.'],
    pay: { gold: 30, xp: 120 },
    title: 'First Chain',
    entries: [{ id: 'sent', when: { flag: 'q_carto_chain' }, text: 'Ysolde Carrow at the Map Room sent us back up the Salt Road to chain the distance between the milestone under Kestrel Edge and the one in the Saltings, and see if the stones tell true.' }],
    goals: [
      { when: { seen: 'saltings_c6:c6_milestone' }, text: 'Report at the Map Room in Saltmouth.' },
      { when: { seen: 'delta_d5:d5_milestone' }, text: 'Chain on down the road to the stone in the Saltings.' },
      { when: { flag: 'q_carto_chain' }, text: 'Chain the road from the milestone under Kestrel Edge.' },
    ],
  },
  {
    id: 'carto_fen_edge', guild: 'cartographers', rank: 1,
    offer: ['"The chart of the fen stops at Stienwierde. West of the mound it is a ruled box and nothing in it. Go past the mound and keep going till the fen ends, and tell me what ends it."'],
    goal: { seen: 'delta_b5:b5_west' },
    paid: ['"Hills, grey and bare, and no road up them. Nothing, then." She rules a line down the box and writes it in. "Nothing is worth knowing. Now we know it."'],
    early: ['"You have been west of Stienwierde already, to where the ground lifts? Then the box was filled before I asked. The Guild pays for the filling, not the asking."'],
    pay: { gold: 200, xp: 360 },
    title: "The Fen's Edge",
    entries: [{ id: 'sent', when: { flag: 'q_carto_fen_edge' }, text: 'The Guild\'s chart of the fen stops at Stienwierde; Ysolde sent us west past the mound to find where the fen ends.' }],
    goals: [
      { when: { seen: 'delta_b5:b5_west' }, text: 'Report at the Map Room in Saltmouth.' },
      { when: { flag: 'q_carto_fen_edge' }, text: 'Go west past Stienwierde until the fen ends.' },
    ],
  },
  {
    id: 'carto_west_arm', guild: 'cartographers', rank: 1,
    offer: ['"The Long Water has two arms and the chart has one. The west arm goes off into the Saltings and the chart does not follow. Find where it goes. Wet feet are the trade."'],
    goal: { seen: 'saltings_c6:c6_hut' },
    paid: ['"A ford, and past it an eel-catcher\'s hut and a reed trap with its last catch in it. A river that ends in that is a river mapped." She inks the arm in as far as the hut.'],
    early: ['"You have crossed the west arm and found the hut past it, before anyone sent you? Then the arm is drawn, and the Guild owes you for the drawing."'],
    pay: { gold: 200, xp: 360 },
    title: 'The West Arm',
    entries: [{ id: 'sent', when: { flag: 'q_carto_west_arm' }, text: 'The chart has one arm of the Long Water; Ysolde sent us to find where the river\'s west arm goes in the Saltings.' }],
    goals: [
      { when: { seen: 'saltings_c6:c6_hut' }, text: 'Report at the Map Room in Saltmouth.' },
      { when: { flag: 'q_carto_west_arm' }, text: 'Find where the Long Water\'s west arm goes in the Saltings.' },
    ],
  },
  {
    // The cask is the warehouse clerk's to hand over once the run is taken, and the customs house
    // shows itself only while the cask is carried, so the run cannot be done early.
    id: 'compact_run', guild: 'compact', rank: 0,
    offer: ['"There is a cask of brandy waiting with my clerk at the warehouse on the barge quay, past the land gate. Bring it to the Keel the long way, by the customs house door, and slowly. I want to see how you walk."'],
    goal: { seen: 'saltmouth:sm_customs_run' },
    item: 'brandy_cask',
    paid: ['"Past the door and nobody stopped you. That is the whole trade." She does not smile, but the glass comes down softer.', '"You run for the Keel now. The brandy is still four."'],
    pay: { gold: 30, xp: 120 },
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
    pay: { gold: 100, xp: 360 },
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
    pay: { gold: 150, xp: 480 },
    title: 'The Watcher on Wrackholm',
    entries: [{ id: 'sent', when: { flag: 'q_compact_lookout' }, text: 'Somebody watches Saltmouth from Wrackholm\'s west cliff. Ruan at the Keel wants the place found.' }],
    goals: [
      { when: { seen: 'wrackholm_e6:e6_lookout' }, text: 'Report to the Keel in Saltmouth.' },
      { when: { flag: 'q_compact_lookout' }, text: 'Find the watcher\'s place on Wrackholm\'s west cliff.' },
    ],
  },
];
