// The Foreland's side quests, in the journal's words: The Cargo Ledger (Hale) and A Boat With No
// Name-Board (Wat and Hamo, at Gullwick). Its chapter of the one quest is in ./chapter.ts. How the words are keyed is in src/content/area.ts (`quests`);
// tools/tests/quests.ts checks every key.
import type { QuestDef } from '../../../game/quests.ts';

export const QUESTS: readonly QuestDef[] = [
  {
    id: 'greywater',
    title: 'The Cargo Ledger',
    start: { flag: 'q_greywater' },
    done: { flag: 'q_greywater_done' },
    entries: [
      { id: 'hale', when: { flag: 'q_greywater' },
        text: 'Captain Hale wants the smugglers in the caves at Brandy Hole cleared out, and their ledger. His pass east to Thornmark is open, and he warns every company through it.' },
      { id: 'den', when: { seen: 'greywater1:gw1_den' },
        text: 'In the captain\'s den, a letter on grey Ashen paper: "The Deacon wants the cargo below by the dark of the moon."' },
      { id: 'cells', when: { seen: 'greywater2:gw2_east' },
        text: 'Beneath the caves, a passage of cells with the bars rusted through. The cargo the smugglers brought down was people.' },
      { id: 'deacon', when: { slain: 'greywater2:gw2_deacon' },
        text: 'The Ashen Deacon is dead in the shrine, where someone had been prising the iron staples out of a glowing seam in the floor.' },
      { id: 'ledger', when: [{ item: 'greywater_ledger' }, { flag: 'q_greywater_done' }],
        text: 'We have the smugglers\' ledger.' },
      { id: 'paid', when: { flag: 'q_greywater_done' },
        text: 'Hale read the ledger and went grey: names, dates, and a column headed CARGO BELOW. He paid 400 gold, and will send the Regent-Warden a copy.' },
    ],
    goals: [
      { when: { item: 'greywater_ledger' }, text: 'Take the ledger to Captain Hale at the pass, east along the Foreland road.' },
      { when: { visited: 'greywater1' }, text: 'Clear out the smugglers and find their ledger.' },
      { when: { flag: 'q_greywater' }, text: 'Find the caves at Brandy Hole, west along the beach, and take the smugglers\' ledger.' },
    ],
  },
  {
    id: 'board',
    title: 'A Boat With No Name-Board',
    start: [{ flag: 'q_board' }, { item: 'name_boards' }],
    done: [{ flag: 'q_board_home' }, { flag: 'q_board_sold' }],
    entries: [
      { id: 'wat', when: { flag: 'q_board' },
        text: 'Wat, Gullwick\'s boat-builder, wants the Patience\'s name-board off the wreckers\' beach before it goes on a fire. He says to go by night.' },
      { id: 'hoard', when: [{ item: 'name_boards' }, { flag: 'q_board_home' }, { flag: 'q_board_sold' }],
        text: 'Under sailcloth on the far beach, the wreckers\' hoard: name-boards stacked like slates, the Patience\'s among them.' },
      { id: 'chit', when: [{ item: 'customs_chit' }, { flag: 'q_board_home' }, { flag: 'q_board_sold' }],
        text: 'With them, a chit under the Helmstow customs seal: boards fourteen, passed as salvage, duty paid.' },
      { id: 'home', when: { flag: 'q_board_home' },
        text: 'The boards went home to Gullwick. Wat found a chisel\'s marks on the Patience\'s: she was not wrecked but taken, and his boys with her.' },
      { id: 'sold', when: { flag: 'q_board_sold' },
        text: 'We sold the boards to Hamo, the Compact\'s buyer on the Salt Road, by the plank.' },
    ],
    goals: [
      { when: { item: 'name_boards' }, at: 'downs_f3', text: 'Take the name-boards home to Wat on Gullwick\'s shingle, or sell them.' },
      { when: { flag: 'q_board' }, at: 'downs_f3', text: 'Find the Patience\'s name-board on the wreckers\' beach, across the Wend from Gullwick. Go by night.' },
    ],
  },
];
