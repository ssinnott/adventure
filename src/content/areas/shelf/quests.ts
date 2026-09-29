// The Foreland's side quests, in the journal's words: The Cargo Ledger (Hale), The Bell That Rang
// Twice (Osmund), The Rest of the Survey (Ebba and Ailith) and A Boat With No Name-Board (Wat and
// Hamo, at Gullwick). Its chapter of the one quest is in ./chapter.ts. How the words are keyed is in
// src/content/area.ts (`quests`); tools/tests/quests.ts checks every key.
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
    // #56's first: who rang the Queen's death bell at midnight. The name goes to Osmund's book, or
    // does not; the Wardens take Ebba, or she keeps the Chapel's lamps.
    id: 'bell',
    title: 'The Bell That Rang Twice',
    start: { flag: 'q_bell' },
    done: [{ flag: 'q_bell_named' }, { flag: 'q_bell_kept' }],
    entries: [
      { id: 'osmund', when: { flag: 'q_bell' },
        text: 'Osmund, sexton of the Chapel, wants a name for his book: whoever rang the Queen\'s death bell at midnight, hours before anyone knew she was dead.' },
      { id: 'boats', when: { flag: 'q_bell_boats' },
        text: 'A fisherman at the Gilded Eel heard the bell at midnight, hauling his net.' },
      { id: 'wall', when: { flag: 'q_bell_wall' },
        text: 'A Warden on the wall saw someone in grey leave the tower after the bell and go down towards the Eel.' },
      { id: 'ebba', when: { flag: 'q_bell_ebba' },
        text: 'Ebba, a Lantern adjunct at the Eel, rang it. The Hearth burns for the Crown, the catechism says; she watched it go out, and knew.' },
      { id: 'named', when: { flag: 'q_bell_named' },
        text: 'We gave Osmund her name for his book. The Wardens will want her at the keep.' },
      { id: 'kept', when: { flag: 'q_bell_kept' },
        text: 'We told Osmund we could not find out. He wrote RANG ITSELF, and shut the book.' },
    ],
    goals: [
      { when: { flag: 'q_bell_ebba' }, text: 'Tell Osmund at the Chapel whose hand was on the rope, or that we could not find out.' },
      { when: { flag: ['q_bell_boats', 'q_bell_wall'] }, text: 'Someone in grey went down towards the Gilded Eel that night. Ask there.' },
      { when: { flag: 'q_bell' }, text: 'Ask in Helmstow who rang the bell: at the Gilded Eel, and on the wall by the Chapel.' },
    ],
  },
  {
    // #56's eighth: Ailith of the survey team, hiding in the woods. Ebba asks after her, or the woods
    // show where she is; she goes to the Chapel, or to Thornhold.
    id: 'survey',
    title: 'The Rest of the Survey',
    start: [{ seen: 'shelf:survey_ring' }, { flag: 'q_survey' }, { flag: 'q_ailith' }],
    done: [{ flag: 'q_survey_chapel' }, { flag: 'q_survey_thornhold' }],
    entries: [
      { id: 'ebba', when: { flag: 'q_survey' },
        text: 'Ebba, a Lantern adjunct, says four of the survey team went south before the Queen died, and one lies dead under Ashcombe. She wants word of Ailith, who would hide in a wood.' },
      { id: 'ring', when: { seen: 'shelf:survey_ring' },
        text: 'In the woods south-west of Helmstow: a scrap of Lantern grey on a thorn, and a fire-ring hidden from its own smoke.' },
      { id: 'ailith', when: { flag: 'q_ailith' },
        text: 'Ailith, adjunct of the survey, is alive and hiding from the Wardens. The Regent sent the survey to Ashcombe under his seal, before the Queen died.' },
      { id: 'chapel', when: { flag: 'q_survey_chapel' },
        text: 'We sent Ailith home to the Chapel in Helmstow.' },
      { id: 'thornhold', when: { flag: 'q_survey_thornhold' },
        text: 'We sent Ailith over the Scarth to Thornhold, where nobody is looking for her.' },
    ],
    goals: [
      { when: { flag: 'q_ailith' }, text: 'Tell Ailith where to go: the Chapel in Helmstow, or Thornhold over the Scarth.' },
      { when: { flag: 'q_survey' }, text: 'Look for Ailith in the woods south-west of Helmstow, off the road.' },
      { when: { seen: 'shelf:survey_ring' }, text: 'Find whoever lit the fire-ring in the woods south-west of Helmstow, and hid from its smoke.' },
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
