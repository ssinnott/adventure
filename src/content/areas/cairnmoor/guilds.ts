// Cairnmoor's guild quest (DESIGN §8; game/guilds.ts): the Lanterns' fourth rank's second ask, the
// ring's voice reported at any Lantern hall, waiting for Act III (#439). The Kilns hold the first.
import type { GuildQuest } from '../../../game/guilds.ts';
import { FOURTH_RANKS_OPEN } from '../kilns/guilds.ts';
import { RING_SPOKE } from './chapter.ts';

export const GUILDS: readonly GuildQuest[] = [
  {
    id: 'lanterns_ring', guild: 'lanterns', rank: 3, after: FOURTH_RANKS_OPEN,
    offer: ['"The Watchers on High Moor have counted the stone ring\'s nights for four hundred years. Stand inside it after dark, and tell us what you hear."'],
    goal: { flag: RING_SPOKE },
    paid: ['She writes it down as you say it, flat, and reads it back. The Lantern beside her goes out without a word.'],
    early: ['"You have stood in the ring after dark already." She writes down what it said. The Lantern beside her goes out without a word.'],
    pay: { gold: 300, xp: 2400 },
    title: 'What the Ring Said',
    entries: [{ id: 'sent', when: { flag: 'q_lanterns_ring' }, text: 'The Lanterns want to know what is heard inside the stone ring on High Moor, after dark.' }],
    goals: [
      { when: { flag: RING_SPOKE }, text: 'Report to a Lantern hall, at Lantern Watch or Rime Lodge.' },
      { when: { flag: 'q_lanterns_ring' }, text: 'Stand inside the stone ring on High Moor after dark, and listen.' },
    ],
  },
];
