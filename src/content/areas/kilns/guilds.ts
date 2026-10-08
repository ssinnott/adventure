// The Kilns' guild quests (DESIGN §8; game/guilds.ts): the fourth ranks' asks in the Tiefzeche, each
// waiting for Act III (#439). The Lanterns want the words over the dwarves' dead copied, at any
// Lantern hall; the Wardens, through the cousin's captains at the Drillyard, want to know what the
// night carts carry down. Cairnmoor and Rimewater hold the rest of the fourth ranks.
import type { GuildQuest } from '../../../game/guilds.ts';

/** Act II done: Act III opens the fourth ranks, and Captain Ordgar keeps the Drillyard (#455). */
export const FOURTH_RANKS_OPEN = 'q_salt_done';

/** The words over the dead, read by a reader on either level of the Tiefzeche (game/inscriptions.ts). */
const COPIED = [{ seen: 'deep_mines:dm1_niche' }, { seen: 'deep_mines2:dm2_niche' }];

export const GUILDS: readonly GuildQuest[] = [
  {
    id: 'lanterns_niche', guild: 'lanterns', rank: 3, after: FOURTH_RANKS_OPEN,
    offer: ['"The dwarves cut words over their dead in the Tiefzeche, in Kiln-script. Copy them for us, mark for mark. Not every Lantern wants them copied."'],
    goal: COPIED,
    paid: ['"One word, over their dead." She reads the copy twice, and puts it inside her coat, not on the shelf.'],
    early: ['"You have copied the words over their dead already?" She reads the copy twice, and puts it inside her coat, not on the shelf.'],
    pay: { gold: 300, xp: 2400 },
    title: 'The Words Over the Dead',
    entries: [{ id: 'sent', when: { flag: 'q_lanterns_niche' }, text: 'The Lanterns want the words the dwarves cut over their dead in the Tiefzeche copied, by someone who reads Kiln-script.' }],
    goals: [
      { when: COPIED, text: 'Report to a Lantern hall, at Lantern Watch or Rime Lodge.' },
      { when: { flag: 'q_lanterns_niche' }, text: 'Read the words over a niche of the dead in the Tiefzeche, with a reader.' },
    ],
  },
  {
    id: 'wardens_cages', guild: 'wardens', rank: 3, after: FOURTH_RANKS_OPEN,
    offer: ['Captain Ordgar keeps his voice under the yard\'s noise. "Carts go up the Kilns\' trail by night with their lamps hooded, and come back light. Find out what they carry."'],
    goal: { seen: 'deep_mines2:dm2_cages' },
    paid: ['"Cages, and the straw fresh." Ordgar writes it in a book he keeps in his boot. "The walls will not hear it from me."'],
    early: ['"You have been down the Tiefzeche already, and seen the cages?" Ordgar writes it in a book he keeps in his boot.'],
    pay: { gold: 300, xp: 2400 },
    title: 'The Night Carts',
    entries: [{ id: 'sent', when: { flag: 'q_wardens_cages' }, text: 'Captain Ordgar of the Drillyard wants to know what the carts carry that go up the Kilns\' trail by night.' }],
    goals: [
      { when: { seen: 'deep_mines2:dm2_cages' }, text: 'Report to the Warden Drillyard in Helmstow.' },
      { when: { flag: 'q_wardens_cages' }, text: 'Find where the night carts go, down the shaft at the Tiefzeche\'s headworks.' },
    ],
  },
];
