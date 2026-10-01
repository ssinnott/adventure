// Saltreach's guild quests (DESIGN §8; game/guilds.ts): the Cartographers' first task and their
// first rank, given out at the Map Room in Saltmouth (#181). The skills the Guild teaches are #18's.
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
];
